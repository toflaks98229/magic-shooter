/**
 * @fileoverview 게임 화면 한 프레임을 브라우저 없이 PNG로 렌더링합니다.
 *
 *   npm run preview
 *
 * 실제 render.js를 그대로 실행하므로, 아틀라스 좌표와 테마 텍스처가 제대로 붙었는지
 * 눈으로 확인할 수 있습니다. 브라우저를 띄우기 어려운 환경에서 에셋 작업의 결과를
 * 즉시 검증하기 위한 도구입니다.
 *
 * 캔버스 2D 컨텍스트를 픽셀 단위로 직접 구현했습니다. 렌더러가 쓰는 기능
 * (drawImage / getImageData / putImageData / fillRect)만 지원합니다.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readPng, writePng } from './png.js';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

// --- 캔버스 2D 컨텍스트 구현 -------------------------------------------------

/**
 * 픽셀 버퍼를 가진 최소 캔버스를 만듭니다.
 * @param {number} width - 너비
 * @param {number} height - 높이
 * @returns {object} 캔버스 객체
 */
function createCanvas(width = 0, height = 0) {
    const canvas = {
        _pixels: new Uint8ClampedArray(Math.max(1, width * height * 4)),
        get width() { return this._w; },
        set width(v) { this._w = v; this._resize(); },
        get height() { return this._h; },
        set height(v) { this._h = v; this._resize(); },
        _w: width, _h: height,
        _resize() { this._pixels = new Uint8ClampedArray(Math.max(1, this._w * this._h * 4)); },
        getContext() { return makeContext(canvas); },
        toDataURL: () => 'data:image/png;base64,preview',
    };
    return canvas;
}

/**
 * 캔버스에 대한 2D 컨텍스트를 만듭니다.
 * @param {object} canvas - 대상 캔버스
 * @returns {object} 2D 컨텍스트
 */
function makeContext(canvas) {
    let fill = [255, 255, 255, 255];
    let alpha = 1;
    let offsetY = 0; // translate는 렌더러가 세로로만 씁니다.

    /** 알파를 고려해 픽셀 한 점을 찍습니다. */
    const blend = (x, y, r, g, b, a) => {
        x |= 0; y = (y + offsetY) | 0;
        if (x < 0 || y < 0 || x >= canvas._w || y >= canvas._h || a <= 0) return;
        const i = (y * canvas._w + x) * 4;
        const k = (a / 255) * alpha;
        canvas._pixels[i] = canvas._pixels[i] * (1 - k) + r * k;
        canvas._pixels[i + 1] = canvas._pixels[i + 1] * (1 - k) + g * k;
        canvas._pixels[i + 2] = canvas._pixels[i + 2] * (1 - k) + b * k;
        canvas._pixels[i + 3] = 255;
    };

    return {
        imageSmoothingEnabled: false,
        set globalAlpha(v) { alpha = v; }, get globalAlpha() { return alpha; },
        set globalCompositeOperation(v) { }, get globalCompositeOperation() { return 'source-over'; },
        set font(v) { }, set textAlign(v) { }, set textBaseline(v) { },
        set fillStyle(v) { fill = parseColor(v); }, get fillStyle() { return '#fff'; },

        save() { }, restore() { offsetY = 0; },
        translate(_x, y) { offsetY = y | 0; },
        clearRect() { canvas._pixels.fill(0); },
        fillText() { },

        fillRect(x, y, w, h) {
            for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) {
                blend(x + dx, y + dy, fill[0], fill[1], fill[2], fill[3]);
            }
        },

        createImageData: (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),

        getImageData(x, y, w, h) {
            const data = new Uint8ClampedArray(w * h * 4);
            for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++) {
                const s = ((y + dy) * canvas._w + (x + dx)) * 4;
                const d = (dy * w + dx) * 4;
                data.set(canvas._pixels.subarray(s, s + 4), d);
            }
            return { width: w, height: h, data };
        },

        putImageData(image, dx, dy) {
            for (let y = 0; y < image.height; y++) for (let x = 0; x < image.width; x++) {
                const s = (y * image.width + x) * 4;
                const d = ((dy + y) * canvas._w + (dx + x)) * 4;
                if (d < 0 || d >= canvas._pixels.length) continue;
                canvas._pixels.set(image.data.subarray(s, s + 4), d);
            }
        },

        /** 9인자/5인자 drawImage를 최근접 이웃으로 그립니다. */
        drawImage(source, ...args) {
            const src = source._pixels ? { width: source._w, height: source._h, data: source._pixels } : source;
            let sx = 0, sy = 0, sw = src.width, sh = src.height, dx = 0, dy = 0, dw = sw, dh = sh;
            if (args.length === 8) [sx, sy, sw, sh, dx, dy, dw, dh] = args;
            else if (args.length === 4) [dx, dy, dw, dh] = args;
            else if (args.length === 2) [dx, dy] = args;

            for (let y = 0; y < dh; y++) {
                const ty = sy + ((y * sh / dh) | 0);
                if (ty < 0 || ty >= src.height) continue;
                for (let x = 0; x < dw; x++) {
                    const tx = sx + ((x * sw / dw) | 0);
                    if (tx < 0 || tx >= src.width) continue;
                    const i = (ty * src.width + tx) * 4;
                    blend(dx + x, dy + y, src.data[i], src.data[i + 1], src.data[i + 2], src.data[i + 3]);
                }
            }
        },
    };
}

/**
 * CSS 색 문자열을 RGBA 배열로 바꿉니다. (렌더러가 쓰는 형식만 지원)
 * @param {string} value - '#rgb', '#rrggbb', 'rgba(...)'
 * @returns {number[]} [r, g, b, a]
 */
function parseColor(value) {
    if (typeof value !== 'string') return [255, 255, 255, 255];
    if (value.startsWith('rgba')) {
        const [r, g, b, a] = value.match(/[\d.]+/g).map(Number);
        return [r, g, b, a * 255];
    }
    let hex = value.replace('#', '');
    if (hex.length === 3) hex = [...hex].map(c => c + c).join('');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16), 255];
}

// --- 브라우저 전역 설치 ------------------------------------------------------

globalThis.window = globalThis;
globalThis.innerWidth = 960;
globalThis.innerHeight = 600;

/** 파일 시스템에서 읽어오는 Image. src를 지정하면 즉시 디코딩하고 onload를 호출합니다. */
globalThis.Image = class {
    set src(value) {
        this._src = value;
        try {
            const image = readPng(projectRoot + value);
            this._w = image.width; this._h = image.height; this._pixels = image.data;
            this.width = image.width; this.height = image.height;
            queueMicrotask(() => this.onload && this.onload());
        } catch (error) {
            queueMicrotask(() => this.onerror && this.onerror(error));
        }
    }
    get src() { return this._src; }
};

globalThis.document = {
    createElement: (tag) => (tag === 'canvas' ? createCanvas() : { style: {} }),
    querySelector: () => null,
    addEventListener() { }, removeEventListener() { }, exitPointerLock() { },
    pointerLockElement: null,
};
globalThis.addEventListener = () => { };

/** fetch를 파일 시스템 읽기로 대체합니다. (loadAssets가 아틀라스를 가져오는 경로) */
globalThis.fetch = async (url) => {
    try {
        const body = readFileSync(projectRoot + url);
        return { ok: true, json: async () => JSON.parse(body.toString('utf8')), arrayBuffer: async () => body };
    } catch {
        return { ok: false, status: 404, json: async () => ({}), arrayBuffer: async () => new ArrayBuffer(0) };
    }
};

// --- 렌더링 ------------------------------------------------------------------

const C = await import('../Script/constants.js');
const { world } = await import('../Script/world.js');
const { dom } = await import('../Script/dom.js');
const { runtime } = await import('../Script/runtime.js');
const actions = await import('../Script/actions.js');
const { loadAssets, render, resizeCanvas } = await import('../Script/render.js');
const { spawnEnemiesForFloor } = await import('../Script/gameLogic.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');

// dom.js의 bindDom은 실제 HTML을 요구하므로, 여기서는 필요한 것만 직접 채웁니다.
const screen = createCanvas(innerWidth, innerHeight);
dom.canvas = screen;
dom.ctx = screen.getContext('2d');
dom.offscreenCanvas = createCanvas();
dom.offscreenCtx = dom.offscreenCanvas.getContext('2d');
dom.weaponSpriteEl = { style: {}, classList: { contains: () => false }, src: '' };

await loadAssets(null); // 사운드는 audioCtx가 없어 건너뜁니다.

const theme = process.argv[2] || 'main';
const variation = Number(process.argv[3] || 1);
const outPath = process.argv[4] || `preview-${theme}-${variation}.png`;

actions.setGameRunning(true);
world.themeName = theme;
world.themeVariation = variation;

const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, 15, 4, 8);
world.map = dungeon.map;
world.objectMap = dungeon.objectMap;
world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;
spawnEnemiesForFloor();

// 적 몇 마리를 플레이어 앞에 세워 스프라이트도 함께 확인합니다.
const forward = (distance, side = 0) => ({
    x: world.player.x + Math.cos(world.player.angle) * distance - Math.sin(world.player.angle) * side,
    y: world.player.y + Math.sin(world.player.angle) * distance + Math.cos(world.player.angle) * side,
});
world.enemies.slice(0, 3).forEach((enemy, i) => {
    Object.assign(enemy, forward(C.TILE_SIZE * (4 + i * 2), (i - 1) * C.TILE_SIZE * 1.4));
});
world.items.push({ ...C.ITEM_TYPES.HEALTH, ...forward(C.TILE_SIZE * 3, C.TILE_SIZE * 0.8), z: C.TILE_SIZE / 2 });
world.items.push({ ...C.ITEM_TYPES.AMMO, ...forward(C.TILE_SIZE * 3.4, -C.TILE_SIZE * 0.9), z: C.TILE_SIZE / 2 });

resizeCanvas();
render();

writePng(projectRoot + outPath, { width: screen._w, height: screen._h, data: screen._pixels });
console.log(`${theme} variation ${variation} → ${outPath} (${screen._w}x${screen._h})`);

/**
 * @fileoverview 가지마다의 벽·바닥 타일을 모아 아틀라스로 만듭니다.
 *
 *   node tools/build-terrain-atlas.js
 *
 * 지금까지 층의 모습은 층 번호가 정했습니다. 1~3층은 main, 4~5층은 cave 하는 식의
 * 자체 표였습니다. 원본은 그렇게 하지 않습니다. 어느 가지에 있는가가 정합니다.
 * 오크 광산은 몇 층이든 오크 광산처럼 생겼고, 짐승굴은 짐승굴처럼 생겼습니다.
 *
 * 그래서 층 번호가 아니라 가지로 고르도록 바꾸고, 그 표를 원본에서 가져옵니다.
 * (tileview.cc:86 tile_default_flv)
 *
 * 타일 이름과 그림 파일의 대응은 rltiles/dc-wall.txt 와 dc-floor.txt 에 있습니다.
 * 한 줄이 `파일이름 TILE_이름 다른이름...` 꼴이라 그것을 읽어 잇습니다.
 */

import fs from 'node:fs';
import path from 'node:path';
import { readPng, writePng } from './png.js';

const RLTILES = 'Data/crawl/crawl-ref/source/rltiles';
const SHEET_OUT = 'Data/tiles/terrain.png';
const DATA_OUT = 'Data/tiles/terrain_data.json';

/** @description 타일 한 변(px). */
const TILE = 32;

/** @description 한 줄에 몇 개를 늘어놓을지. */
const COLUMNS = 16;

/**
 * @description 가지마다의 벽과 바닥. (tileview.cc:86 tile_default_flv)
 *
 * 우리 가지 글자를 원본의 타일 이름에 잇습니다.
 * 이름은 dc-wall.txt / dc-floor.txt 에 적힌 것을 그대로 씁니다.
 */
const BRANCH_TERRAIN = {
    D: { wall: 'WALL_NORMAL', floor: 'FLOOR_NORMAL' },          // 메인 던전
    U: { wall: 'WALL_NORMAL', floor: 'FLOOR_GREY_DIRT_B' },     // 심층부
    V: { wall: 'WALL_VAULT', floor: 'FLOOR_VAULT' },            // 보물창고
    T: { wall: 'WALL_VINES', floor: 'FLOOR_VINES' },            // 만신전
    E: { wall: 'WALL_HALL', floor: 'FLOOR_HALL' },              // 엘프 회관
    Y: { wall: 'WALL_COBALT_ROCK', floor: 'FLOOR_BLACK_COBALT' }, // 타르타로스
    C: { wall: 'ROCK_WALL_CRYPT', floor: 'FLOOR_CRYPT' },       // 납골당
    W: { wall: 'WALL_UNDEAD', floor: 'FLOOR_TOMB' },            // 고대의 무덤
    H: { wall: 'WALL_HELL', floor: 'FLOOR_CAGE' },              // 지옥의 안뜰
    I: { wall: 'WALL_ZOT_CYAN', floor: 'FLOOR_IRON' },          // 디스
    G: { wall: 'WALL_ZOT_RED', floor: 'FLOOR_ROUGH_RED' },      // 게헨나
    X: { wall: 'WALL_ICE', floor: 'FLOOR_FROZEN' },             // 코키투스
    O: { wall: 'WALL_ORC', floor: 'FLOOR_ORC' },                // 오크 광산
    L: { wall: 'WALL_LAIR', floor: 'FLOOR_LAIR' },              // 짐승굴
    M: { wall: 'WALL_SLIME', floor: 'FLOOR_SLIME' },            // 슬라임굴
    P: { wall: 'WALL_SNAKE', floor: 'FLOOR_MOSAIC' },           // 뱀굴
    S: { wall: 'WALL_SWAMP', floor: 'FLOOR_SWAMP' },            // 늪지
    A: { wall: 'WALL_SHOALS', floor: 'FLOOR_SAND' },            // 해안
    N: { wall: 'WALL_SPIDER', floor: 'FLOOR_SPIDER' },          // 거미 둥지
    Z: { wall: 'WALL_ZOT_YELLOW', floor: 'FLOOR_TOMB' },        // 조트의 왕국
};

/**
 * @description 그림 없이 색만 바꿔 쓰는 타일들. (dc-wall.txt:994)
 *
 * 원본은 조트 계열 벽을 파란 그림 하나로 두고 색상만 돌려 씁니다.
 * 그래서 파일을 찾아도 나오지 않습니다. 돌릴 각도가 그 파일에 적혀 있어
 * 그대로 옮겼습니다. 240 도에서 그 각도로 옮기고 밝기를 조금 낮춥니다.
 */
const HUE_VARIANTS = {
    WALL_ZOT_CYAN: { from: 'WALL_ZOT', hue: 180 },
    WALL_ZOT_RED: { from: 'WALL_ZOT', hue: 0 },
    WALL_ZOT_YELLOW: { from: 'WALL_ZOT', hue: 60 },
    WALL_ZOT_GREEN: { from: 'WALL_ZOT', hue: 140 },
    WALL_ZOT_MAGENTA: { from: 'WALL_ZOT', hue: 270 },
};

/** @description 원본이 조트 벽을 그린 바탕 색상. (dc-wall.txt 의 %hue 첫 값) */
const ZOT_BASE_HUE = 240;

/** @description 색을 돌릴 때 함께 낮추는 밝기. (%lum 240 -10) */
const ZOT_LUM_SHIFT = -10;

/**
 * 그림의 색상을 돌립니다.
 * @param {object} image - 원본 그림
 * @param {number} degrees - 돌릴 각도
 * @returns {object} 새 그림
 */
function rotateHue(image, degrees) {
    const out = {
        width: image.width,
        height: image.height,
        data: new Uint8ClampedArray(image.data),
    };

    for (let i = 0; i < out.data.length; i += 4) {
        if (out.data[i + 3] === 0) continue;

        const [h, sat, lum] = toHsl(out.data[i], out.data[i + 1], out.data[i + 2]);
        const shifted = ((h + degrees) % 360 + 360) % 360;
        const [r, g, b] = toRgb(shifted, sat, Math.max(0, lum + ZOT_LUM_SHIFT / 100));

        out.data[i] = r;
        out.data[i + 1] = g;
        out.data[i + 2] = b;
    }

    return out;
}

/**
 * RGB 를 HSL 로 바꿉니다.
 * @param {number} r - 빨강 0~255
 * @param {number} g - 초록 0~255
 * @param {number} b - 파랑 0~255
 * @returns {Array<number>} 색상(도), 채도, 밝기
 */
function toHsl(r, g, b) {
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    const lum = (max + min) / 2;

    if (max === min) return [0, 0, lum];

    const span = max - min;
    const sat = lum > 0.5 ? span / (2 - max - min) : span / (max + min);

    let hue;
    if (max === rn) hue = ((gn - bn) / span + (gn < bn ? 6 : 0)) * 60;
    else if (max === gn) hue = ((bn - rn) / span + 2) * 60;
    else hue = ((rn - gn) / span + 4) * 60;

    return [hue, sat, lum];
}

/**
 * HSL 을 RGB 로 되돌립니다.
 * @param {number} hue - 색상(도)
 * @param {number} sat - 채도
 * @param {number} lum - 밝기
 * @returns {Array<number>} 빨강, 초록, 파랑 (0~255)
 */
function toRgb(hue, sat, lum) {
    if (sat === 0) { const v = Math.round(lum * 255); return [v, v, v]; }

    const q = lum < 0.5 ? lum * (1 + sat) : lum + sat - lum * sat;
    const p = 2 * lum - q;
    const h = hue / 360;

    const channel = (t) => {
        let x = t;
        if (x < 0) x += 1;
        if (x > 1) x -= 1;
        if (x < 1 / 6) return p + (q - p) * 6 * x;
        if (x < 1 / 2) return q;
        if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
        return p;
    };

    return [channel(h + 1 / 3), channel(h), channel(h - 1 / 3)]
        .map(v => Math.round(v * 255));
}

/**
 * dc-*.txt 를 읽어 타일 이름에서 파일 이름을 찾는 표를 만듭니다.
 *
 * 한 줄이 `파일이름 이름1 이름2...` 꼴입니다. 한 그림에 여러 이름이 붙기도 하고
 * (WALL_BRICK_DARK_1 이 WALL_NORMAL 이기도 합니다) 이름 없이 변형만인 줄도 있습니다.
 * @param {string} file - dc-wall.txt 또는 dc-floor.txt
 * @returns {Map<string, string>} 타일 이름 → 파일 이름
 */
function readTileNames(file) {
    const names = new Map();

    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed === '' || trimmed.startsWith('%') || trimmed.startsWith('#')) continue;

        const parts = trimmed.split(/\s+/);
        const fileName = parts[0];

        // 두 번째 칸부터가 이름입니다. 없으면 앞 그림의 변형이라 건너뜁니다.
        for (const name of parts.slice(1)) {
            if (!/^[A-Z][A-Z0-9_]*$/.test(name)) continue;
            if (!names.has(name)) names.set(name, fileName);
        }
    }

    return names;
}

/**
 * 이름으로 그림 파일의 실제 경로를 찾습니다.
 *
 * dc-*.txt 는 확장자와 폴더 없이 이름만 적어 두어서 직접 뒤져야 합니다.
 * @param {string} baseName - 파일 이름 (확장자 없음)
 * @param {string} root - 뒤질 폴더
 * @returns {string|null} 경로
 */
function findImage(baseName, root) {
    const stack = [root];

    while (stack.length > 0) {
        const dir = stack.pop();
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) { stack.push(full); continue; }
            if (entry.name === `${baseName}.png`) return full;
        }
    }

    return null;
}

// --- 모으기 ---------------------------------------------------------------------

const wallNames = readTileNames(path.join(RLTILES, 'dc-wall.txt'));
const floorNames = readTileNames(path.join(RLTILES, 'dc-floor.txt'));

const wanted = new Map();   // 스프라이트 키 → 파일 경로
const missing = [];

for (const [branch, terrain] of Object.entries(BRANCH_TERRAIN)) {
    for (const kind of ['wall', 'floor']) {
        const tileName = terrain[kind];
        const names = kind === 'wall' ? wallNames : floorNames;
        // 색만 바꿔 쓰는 타일은 바탕 그림을 찾아 돌립니다.
        const variant = HUE_VARIANTS[tileName];
        const lookup = variant ? variant.from : tileName;
        const baseName = names.get(lookup);

        if (!baseName) { missing.push(`${branch} ${kind} ${tileName} (이름 없음)`); continue; }

        const image = findImage(baseName, path.join(RLTILES, 'dngn', kind));
        if (!image) { missing.push(`${branch} ${kind} ${tileName} → ${baseName}.png (그림 없음)`); continue; }

        wanted.set(`branch_${kind}_${branch}`, { image, hue: variant?.hue ?? null });
    }
}

console.log(`가지 ${Object.keys(BRANCH_TERRAIN).length}개 중 ${wanted.size / 2}개 분량을 찾았습니다.`);
if (missing.length > 0) {
    console.log('찾지 못한 것:');
    for (const line of missing) console.log(`  ${line}`);
}

// --- 시트 만들기 -----------------------------------------------------------------

const keys = [...wanted.keys()].sort();
const rows = Math.ceil(keys.length / COLUMNS);
const width = COLUMNS * TILE;
const height = Math.max(1, rows) * TILE;

const sheet = { width, height, data: new Uint8ClampedArray(width * height * 4) };
const sprites = {};
let skipped = 0;

keys.forEach((key, index) => {
    const entry = wanted.get(key);
    const raw = readPng(entry.image);
    if (raw.width !== TILE || raw.height !== TILE) { skipped++; return; }

    const source = entry.hue === null ? raw
        : rotateHue(raw, entry.hue - ZOT_BASE_HUE);

    const originX = (index % COLUMNS) * TILE;
    const originY = Math.floor(index / COLUMNS) * TILE;

    for (let y = 0; y < TILE; y++) {
        for (let x = 0; x < TILE; x++) {
            const from = (y * source.width + x) * 4;
            const to = ((originY + y) * width + originX + x) * 4;
            for (let c = 0; c < 4; c++) sheet.data[to + c] = source.data[from + c];
        }
    }

    sprites[key] = { x: originX, y: originY, w: TILE, h: TILE };
});

writePng(SHEET_OUT, sheet);
fs.writeFileSync(DATA_OUT, `${JSON.stringify({ sheetFile: 'terrain.png', sprites }, null, 2)}\n`);

console.log(`시트 ${width}x${height}, 스프라이트 ${Object.keys(sprites).length}개`);
if (skipped > 0) console.log(`크기가 달라 건너뛴 것: ${skipped}개`);
console.log(`→ ${SHEET_OUT}, ${DATA_OUT}`);

/**
 * @fileoverview 픽셀 버퍼를 실제로 갖는 최소 캔버스 2D 구현.
 *
 * 브라우저 없이 render.js를 그대로 돌려 화면을 확인하거나 성능을 재기 위해 필요합니다.
 * 렌더러가 실제로 호출하는 기능(drawImage / getImageData / putImageData / fillRect /
 * translate)만 지원하며, 스케일링은 렌더러와 같은 최근접 이웃 방식입니다.
 */

// --- 캔버스 2D 컨텍스트 구현 -------------------------------------------------

/**
 * 픽셀 버퍼를 가진 최소 캔버스를 만듭니다.
 * @param {number} width - 너비
 * @param {number} height - 높이
 * @returns {object} 캔버스 객체
 */
export function createCanvas(width = 0, height = 0) {
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


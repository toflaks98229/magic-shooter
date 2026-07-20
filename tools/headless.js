/**
 * @fileoverview 브라우저 없이 렌더러를 돌리기 위한 환경 구성.
 *
 * preview / bench / 렌더 테스트가 모두 같은 방식으로 환경을 세우도록 한 곳에 모았습니다.
 * window, document, Image, fetch를 파일 시스템 기반으로 대체하고,
 * 픽셀 버퍼를 실제로 갖는 캔버스를 dom에 물려줍니다.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readPng } from './png.js';
import { createCanvas } from './canvas.js';

/** @description 프로젝트 루트의 절대 경로 */
export const projectRoot = fileURLToPath(new URL('..', import.meta.url));

/**
 * Math.random을 시드 난수로 고정합니다.
 * 같은 명령을 두 번 실행하면 같은 그림이 나와야 렌더링 변경을 픽셀 단위로 비교할 수 있습니다.
 * @param {number} seed - 난수 시드
 */
export function seedRandom(seed) {
    let state = seed >>> 0;
    Math.random = () => {
        state |= 0; state = (state + 0x6D2B79F5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * 브라우저 전역을 설치합니다. 게임 모듈을 import 하기 전에 호출해야 합니다.
 * @param {{width: number, height: number}} [size] - 창 크기
 */
export function installRenderEnvironment({ width = 960, height = 600 } = {}) {
    globalThis.window = globalThis;
    globalThis.innerWidth = width;
    globalThis.innerHeight = height;

    // src를 지정하면 파일에서 즉시 디코딩하고 onload를 호출하는 Image
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

    // 아틀라스와 시트를 파일 시스템에서 읽어옵니다.
    globalThis.fetch = async (url) => {
        try {
            const body = readFileSync(projectRoot + url);
            return { ok: true, json: async () => JSON.parse(body.toString('utf8')), arrayBuffer: async () => body };
        } catch {
            return { ok: false, status: 404, json: async () => ({}), arrayBuffer: async () => new ArrayBuffer(0) };
        }
    };
}

/**
 * dom 객체에 실제 픽셀을 갖는 캔버스를 물려줍니다.
 * bindDom()은 진짜 HTML을 요구하므로 렌더링에 필요한 것만 직접 채웁니다.
 * @param {object} dom - Script/dom.js의 dom 객체
 * @param {{screenContext?: object}} [options] - 화면 컨텍스트를 대체하려면 지정
 * @returns {object} 최종 화면 캔버스
 */
export function attachHeadlessCanvas(dom, { screenContext } = {}) {
    const screen = createCanvas(globalThis.innerWidth, globalThis.innerHeight);
    dom.canvas = screen;
    dom.ctx = screenContext || screen.getContext('2d');
    dom.offscreenCanvas = createCanvas();
    dom.offscreenCtx = dom.offscreenCanvas.getContext('2d');
    dom.weaponSpriteEl = { style: {}, classList: { contains: () => false }, src: '' };
    return screen;
}

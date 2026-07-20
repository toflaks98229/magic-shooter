/**
 * @fileoverview 브라우저 API 스텁, 가상 시계, 시드 난수.
 *
 * 게임 모듈은 window/document/canvas를 전제로 하므로, Node에서 실행하려면
 * 이들을 먼저 세워 두어야 합니다. 반드시 게임 모듈을 import 하기 '전에'
 * installBrowserStubs()를 호출해야 합니다.
 *
 *   installBrowserStubs();
 *   const gameLogic = await import('../Script/gameLogic.js');
 *
 * 시계와 난수를 우리가 통제하기 때문에 시뮬레이션이 완전히 결정론적으로 재현됩니다.
 * 이것이 리팩토링 회귀 검사(regression.test.js)의 전제입니다.
 */

// --- 시드 난수 (mulberry32) -------------------------------------------------

let rngState = 0;

/**
 * Math.random을 시드 기반의 결정론적 난수로 교체합니다.
 * @param {number} seed - 난수 시드
 */
export function seedRandom(seed) {
    rngState = seed >>> 0;
    Math.random = () => {
        rngState |= 0; rngState = (rngState + 0x6D2B79F5) | 0;
        let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// --- 가상 시계 + 가상 타이머 ------------------------------------------------

let virtualNow = 1_000_000;
let timerId = 0;
let timers = [];

/**
 * Date.now와 setTimeout을 가상 시계에 연결합니다.
 * 타이머는 실제로 실행되지만, 언제 실행될지는 advanceClock()이 결정합니다.
 * (무기 교체나 피격 연출이 setTimeout에 의존하므로 무시하면 안 됩니다.)
 */
export function installClock() {
    virtualNow = 1_000_000;
    timerId = 0;
    timers = [];

    Date.now = () => virtualNow;
    globalThis.setTimeout = (fn, ms = 0) => {
        timers.push({ at: virtualNow + ms, fn, id: ++timerId });
        return timerId;
    };
    globalThis.clearTimeout = (id) => {
        const i = timers.findIndex(t => t.id === id);
        if (i >= 0) timers.splice(i, 1);
    };
}

/**
 * 가상 시간을 진행시키고, 그 사이 만기된 타이머를 등록 순서대로 실행합니다.
 * @param {number} ms - 진행시킬 시간(밀리초)
 */
export function advanceClock(ms) {
    virtualNow += ms;
    timers.sort((a, b) => a.at - b.at || a.id - b.id);
    while (timers.length && timers[0].at <= virtualNow) timers.shift().fn();
}

/** @returns {number} 현재 가상 시각 */
export function currentTime() {
    return virtualNow;
}

// --- DOM 스텁 ---------------------------------------------------------------

/** @description document에 등록된 리스너. fireDocumentEvent로 직접 호출하기 위해 보관합니다. */
const documentListeners = {};

/**
 * 게임 코드가 기대하는 최소한의 동작을 갖춘 가짜 DOM 요소를 만듭니다.
 * @param {string} id - 식별용 이름
 * @returns {object} 가짜 요소
 */
export function createStubElement(id = '?') {
    const handlers = {};
    return {
        id,
        style: {},
        textContent: '',
        src: '',
        disabled: false,
        clientWidth: 150,
        classList: {
            _set: new Set(),
            add(c) { this._set.add(c); },
            remove(c) { this._set.delete(c); },
            contains(c) { return this._set.has(c); },
            toggle(c, force) {
                const on = force === undefined ? !this._set.has(c) : force;
                if (on) this._set.add(c); else this._set.delete(c);
                return on;
            },
        },
        children: [],
        className: '',
        title: '',
        append(...nodes) { this.children.push(...nodes); },
        appendChild(node) { this.children.push(node); return node; },
        replaceChildren(...nodes) { this.children = nodes; },
        remove() { },
        /** 자식 중 클래스가 맞는 첫 요소를 찾습니다. (ui.js 가 남은 시간 칸을 찾을 때 씁니다) */
        querySelector(selector) {
            const wanted = selector.replace('.', '');
            const search = (nodes) => {
                for (const node of nodes) {
                    if (node.className === wanted) return node;
                    const found = node.children ? search(node.children) : null;
                    if (found) return found;
                }
                return null;
            };
            return search(this.children);
        },
        addEventListener(type, fn) { (handlers[type] ||= []).push(fn); },
        removeEventListener(type, fn) {
            const list = handlers[type];
            if (!list) return;
            const i = list.indexOf(fn);
            if (i >= 0) list.splice(i, 1);
        },
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 150, height: 150 }),
        requestPointerLock() { },
        /** 이 요소에 등록된 리스너를 직접 호출합니다. */
        fire(type, event = {}) {
            (handlers[type] || []).forEach(fn => fn({ preventDefault() { }, ...event }));
        },
    };
}

/**
 * 픽셀을 실제로 다루지는 않는 캔버스 컨텍스트 스텁.
 * 렌더러가 호출하는 메서드를 모두 받아주기만 합니다.
 * @returns {object} 가짜 2D 컨텍스트
 */
function createStubContext() {
    return {
        imageSmoothingEnabled: true,
        createImageData: (w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
        getImageData: (x, y, w, h) => ({ width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }),
        putImageData() { }, drawImage() { }, clearRect() { }, fillRect() { },
        save() { }, restore() { }, translate() { }, fillText() { },
        set fillStyle(v) { }, get fillStyle() { return '#000'; },
        set globalAlpha(v) { }, get globalAlpha() { return 1; },
        set globalCompositeOperation(v) { }, get globalCompositeOperation() { return 'source-over'; },
        set font(v) { }, set textAlign(v) { }, set textBaseline(v) { },
    };
}

/**
 * window, document, Image 등 브라우저 전역을 설치합니다.
 * 게임 모듈을 import 하기 전에 반드시 호출해야 합니다.
 */
export function installBrowserStubs() {
    seedRandom(1);
    installClock();

    // save.js 가 이어하기 칸을 두는 곳입니다. 실제 브라우저 저장소 대신 메모리에 담습니다.
    // 사생활 보호 모드처럼 접근 자체가 막힌 상황은 setFailingStorage() 로 흉내 냅니다.
    installMemoryStorage();

    globalThis.window = globalThis;
    globalThis.innerWidth = 1280;
    globalThis.innerHeight = 720;
    globalThis.Image = class { constructor() { this.src = ''; } };

    globalThis.document = {
        createElement(tag) {
            const el = createStubElement(`<${tag}>`);
            el.className = '';
            el.remove = () => { };
            if (tag === 'canvas') {
                el.width = 0;
                el.height = 0;
                el.getContext = () => createStubContext();
                el.toDataURL = () => 'data:image/png;base64,stub';
            }
            return el;
        },
        getElementById: (id) => createStubElement(id),
        querySelector: (selector) => createStubElement(selector),
        addEventListener(type, fn) { (documentListeners[type] ||= []).push(fn); },
        removeEventListener(type, fn) {
            const list = documentListeners[type];
            if (!list) return;
            const i = list.indexOf(fn);
            if (i >= 0) list.splice(i, 1);
        },
        exitPointerLock() { },
        pointerLockElement: null,
    };

    globalThis.addEventListener = (type, fn) => globalThis.document.addEventListener(type, fn);
}

/**
 * document에 등록된 리스너를 직접 호출합니다.
 * 실제 입력 경로(input.js의 keydown 처리 등)를 그대로 통과시키기 위한 장치입니다.
 * @param {string} type - 이벤트 종류 ('keydown' 등)
 * @param {object} event - 이벤트 객체에 담을 속성
 */
export function fireDocumentEvent(type, event = {}) {
    (documentListeners[type] || []).forEach(fn => fn({ preventDefault() { }, ...event }));
}

/**
 * dom 모듈의 모든 참조를 스텁 요소로 채웁니다.
 * bindDom()은 실제 HTML을 요구하므로, 테스트에서는 이 함수로 대체합니다.
 * @param {object} dom - Script/dom.js의 dom 객체
 */
export function bindStubDom(dom) {
    for (const key of Object.keys(dom)) {
        dom[key] = createStubElement(key);
    }
    dom.ctx = createStubContext();
    dom.offscreenCtx = createStubContext();
    dom.offscreenCanvas = globalThis.document.createElement('canvas');
}

/**
 * localStorage 를 메모리 구현으로 갈아 끼웁니다.
 * @returns {Map<string, string>} 실제로 값이 담기는 곳
 */
export function installMemoryStorage() {
    const entries = new Map();
    globalThis.localStorage = {
        getItem: (key) => (entries.has(key) ? entries.get(key) : null),
        setItem: (key, value) => { entries.set(key, String(value)); },
        removeItem: (key) => { entries.delete(key); },
        clear: () => entries.clear(),
    };
    return entries;
}

/**
 * 저장소 접근이 통째로 실패하는 상황을 만듭니다.
 * 사생활 보호 모드나 저장 공간이 꽉 찬 브라우저에서 실제로 일어납니다.
 */
export function installFailingStorage() {
    const boom = () => { throw new Error('저장소를 쓸 수 없습니다'); };
    globalThis.localStorage = {
        getItem: boom, setItem: boom, removeItem: boom, clear: boom,
    };
}

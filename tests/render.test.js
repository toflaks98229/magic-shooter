/**
 * @fileoverview 렌더링 스모크 테스트.
 *
 * 실제 render.js를 브라우저 없이 한 프레임 돌려, 화면이 "말이 되는" 상태인지 확인합니다.
 * 렌더러가 깨지는 방식은 예외를 던지는 것이 아니라 조용히 이상한 그림을 그리는 것이라,
 * 아무 검사도 없으면 알아챌 방법이 없습니다.
 *
 * 픽셀을 통째로 비교하지는 않습니다. 텍스처 샘플링을 조금만 손봐도 실패하는 검사는
 * 유지 비용만 크기 때문입니다. 대신 구조적인 성질만 봅니다.
 *   - 화면이 비어 있거나 단색이 아니다
 *   - 천장 / 벽 / 바닥이 서로 구분된다
 *   - 텍스처 누락을 뜻하는 마젠타 플레이스홀더가 화면을 덮고 있지 않다
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    installRenderEnvironment, attachHeadlessCanvas, seedRandom,
} from '../tools/headless.js';

seedRandom(0x5A5A1234);
installRenderEnvironment({ width: 480, height: 300 });

const C = await import('../Script/constants.js');
const { world } = await import('../Script/world.js');
const { dom } = await import('../Script/dom.js');
const actions = await import('../Script/actions.js');
const { loadAssets, render, resizeCanvas } = await import('../Script/render.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');

const screen = attachHeadlessCanvas(dom);
await loadAssets(null);

actions.setGameRunning(true);
world.themeName = 'main';
world.themeVariation = 1;

const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, 15, 4, 8);
world.map = dungeon.map;
world.objectMap = dungeon.objectMap;
world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;

resizeCanvas();
render();

const { _pixels: pixels, _w: width, _h: height } = screen;

/**
 * 화면의 가로 띠 하나에 대한 평균 색을 구합니다.
 * @param {number} fromRatio - 시작 높이 비율 (0~1)
 * @param {number} toRatio - 끝 높이 비율 (0~1)
 * @returns {{r: number, g: number, b: number, brightness: number}} 평균 색
 */
function averageColour(fromRatio, toRatio) {
    const from = Math.floor(height * fromRatio), to = Math.floor(height * toRatio);
    let r = 0, g = 0, b = 0, count = 0;
    for (let y = from; y < to; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            r += pixels[i]; g += pixels[i + 1]; b += pixels[i + 2];
            count++;
        }
    }
    r /= count; g /= count; b /= count;
    return { r, g, b, brightness: 0.299 * r + 0.587 * g + 0.114 * b };
}

test('화면이 비어 있지 않다', () => {
    let lit = 0;
    for (let i = 0; i < width * height; i++) {
        if (pixels[i * 4] + pixels[i * 4 + 1] + pixels[i * 4 + 2] > 12) lit++;
    }
    assert.ok(lit > width * height * 0.5,
        `그려진 픽셀이 ${((100 * lit) / (width * height)).toFixed(1)}% 뿐입니다`);
});

test('화면이 단색이 아니다', () => {
    const unique = new Set();
    for (let i = 0; i < width * height; i += 7) {
        unique.add((pixels[i * 4] << 16) | (pixels[i * 4 + 1] << 8) | pixels[i * 4 + 2]);
    }
    assert.ok(unique.size > 50, `색이 ${unique.size}종류 뿐입니다. 텍스처가 붙지 않았을 수 있습니다`);
});

test('천장·벽·바닥이 서로 구분된다', () => {
    // 레이캐스터는 화면을 위(천장) / 가운데(벽) / 아래(바닥)로 나눠 그립니다.
    // 셋이 같은 그림이라면 한 가지 텍스처만 그려지고 있다는 뜻입니다.
    //
    // 밝기만 보면 안 됩니다. 던전은 대체로 어두워서 천장과 바닥이 서로 다른 재질이어도
    // 밝기는 비슷하게 나옵니다. 색까지 함께 봐야 실제로 다른 재질인지 알 수 있습니다.
    const ceiling = averageColour(0, 0.25);
    const middle = averageColour(0.4, 0.6);
    const floor = averageColour(0.75, 1);

    const distance = Math.hypot(ceiling.r - floor.r, ceiling.g - floor.g, ceiling.b - floor.b);
    assert.ok(distance > 1.5,
        `천장 rgb(${ceiling.r.toFixed(1)},${ceiling.g.toFixed(1)},${ceiling.b.toFixed(1)})과 ` +
        `바닥 rgb(${floor.r.toFixed(1)},${floor.g.toFixed(1)},${floor.b.toFixed(1)})이 구분되지 않습니다`);
    assert.ok(middle.brightness > 0, '화면 중앙이 완전히 검습니다');
});

test('플레이스홀더가 화면을 덮고 있지 않다', () => {
    // 누락된 텍스처는 마젠타(#ff00ff) 체커보드로 그려집니다.
    // 이것이 넓은 면적을 차지한다면 아틀라스가 제대로 붙지 않은 것입니다.
    let magenta = 0;
    for (let i = 0; i < width * height; i++) {
        const r = pixels[i * 4], g = pixels[i * 4 + 1], b = pixels[i * 4 + 2];
        if (r > 180 && b > 180 && g < 70) magenta++;
    }
    const ratio = magenta / (width * height);
    assert.ok(ratio < 0.05, `마젠타 플레이스홀더가 화면의 ${(ratio * 100).toFixed(1)}%를 차지합니다`);
});

test('렌더 해상도가 설정을 따른다', () => {
    assert.equal(dom.offscreenCanvas.width, (width / C.RENDER_RESOLUTION_SCALE) | 0);
    assert.equal(dom.offscreenCanvas.height, (height / C.RENDER_RESOLUTION_SCALE) | 0);
});

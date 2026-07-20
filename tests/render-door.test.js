/**
 * @fileoverview 열리는 문 렌더링 스모크 테스트.
 *
 * 문이 열릴 때 렌더러는 벽을 화면 위로 밀어 올립니다(animatedWalls 의 z).
 * 이 경로는 지금까지 어떤 테스트도 지나가지 않았습니다.
 * render.test.js 는 animatedWalls 가 비어 있는 정적인 한 프레임만 보고,
 * 시뮬레이션 스냅샷도 animatedWalls: 0 인 상태만 기록하고 있었습니다.
 *
 * 벽을 밀어 올리는 계산은 y1 을 지평선 위로 넘길 수 있어(z 가 타일 크기의 절반을
 * 넘는 순간부터) 바닥/천장 루프의 인덱스 부호를 뒤집을 여지가 있습니다.
 * 지금은 뒤쪽 반복이 그 픽셀을 덮어써서 화면상 증상이 없지만, 루프 순서나
 * 범위를 손대면 바로 드러납니다. 그때 알아채려고 이 파일을 둡니다.
 *
 * 픽셀을 통째로 비교하지는 않습니다. 텍스처 샘플링을 조금만 손봐도 실패하는 검사는
 * 유지 비용만 크기 때문입니다. render.test.js 와 같이 구조적인 성질만 봅니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    installRenderEnvironment, attachHeadlessCanvas, seedRandom,
} from '../tools/headless.js';

seedRandom(0x0D000123);
installRenderEnvironment({ width: 480, height: 300 });

const C = await import('../Script/constants.js');
const { world } = await import('../Script/world.js');
const { dom } = await import('../Script/dom.js');
const actions = await import('../Script/actions.js');
const { loadAssets, render, resizeCanvas } = await import('../Script/render.js');

const screen = attachHeadlessCanvas(dom);
await loadAssets(null);

actions.setGameRunning(true);
world.themeName = 'main';
world.themeVariation = 1;

/** @description 플레이어 정면을 가로막는 벽에 뚫린 문의 타일 좌표 */
const DOOR_X = 9;
const DOOR_Y = 5;

/**
 * 정면에 문이 하나 있는 방을 만듭니다.
 * 던전 생성기에 맡기면 문이 시야에 들어온다는 보장이 없어 배치를 직접 정합니다.
 * @returns {number[][]} 맵 배열
 */
function roomWithDoorAhead() {
    const map = Array.from({ length: C.MAP_HEIGHT }, (_, y) =>
        Array.from({ length: C.MAP_WIDTH }, (_, x) =>
            (x === 0 || y === 0 || x === C.MAP_WIDTH - 1 || y === C.MAP_HEIGHT - 1)
                ? C.TILE_IDS.WALL
                : C.TILE_IDS.FLOOR));

    for (let y = 1; y < C.MAP_HEIGHT - 1; y++) map[y][DOOR_X] = C.TILE_IDS.WALL;
    map[DOOR_Y][DOOR_X] = C.TILE_IDS.DOOR;
    return map;
}

world.map = roomWithDoorAhead();
world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
world.player.x = 5 * C.TILE_SIZE + C.TILE_SIZE / 2;
world.player.y = DOOR_Y * C.TILE_SIZE + C.TILE_SIZE / 2;
world.player.angle = 0; // +x 방향, 즉 문 쪽을 바라봅니다.

resizeCanvas();

/**
 * 문이 주어진 높이만큼 올라간 순간의 한 프레임을 그립니다.
 * @param {number} z - 문이 올라간 높이(월드 단위). 0이면 닫힌 상태, TILE_SIZE면 다 열린 상태입니다.
 */
function renderWithDoorRaised(z) {
    world.animatedWalls.length = 0;
    world.animatedWalls.push({
        mapX: DOOR_X, mapY: DOOR_Y, z,
        wallType: C.TILE_IDS.DOOR, startTime: 0, duration: 500,
    });
    render();
}

/**
 * 화면 한가운데 세로줄의 픽셀을 위에서 아래로 훑습니다.
 * 문이 정면에 있으므로 이 줄은 반드시 문을 지납니다.
 * @returns {Array<{y: number, r: number, g: number, b: number, a: number}>} 픽셀 목록
 */
function centreColumn() {
    const { _pixels: pixels, _w: w, _h: h } = screen;
    const x = w >> 1;
    const column = [];
    for (let y = 0; y < h; y++) {
        const i = (y * w + x) * 4;
        column.push({ y, r: pixels[i], g: pixels[i + 1], b: pixels[i + 2], a: pixels[i + 3] });
    }
    return column;
}

/**
 * 화면 세로 구간의 평균 밝기를 구합니다.
 * @param {Array<{r: number, g: number, b: number}>} column - centreColumn()의 결과
 * @param {number} fromRatio - 시작 높이 비율 (0~1)
 * @param {number} toRatio - 끝 높이 비율 (0~1)
 * @returns {number} 평균 밝기
 */
function bandBrightness(column, fromRatio, toRatio) {
    const from = Math.floor(column.length * fromRatio);
    const to = Math.floor(column.length * toRatio);
    let sum = 0;
    for (let y = from; y < to; y++) sum += 0.299 * column[y].r + 0.587 * column[y].g + 0.114 * column[y].b;
    return sum / (to - from);
}

// z 가 타일 크기의 절반(16)을 넘는 순간부터 벽 하단이 지평선 위로 올라갑니다.
// 그 전후를 모두 지나도록 값을 고릅니다.
const RAISE_HEIGHTS = [0, 4, 16, 20, 28, C.TILE_SIZE];

for (const z of RAISE_HEIGHTS) {
    test(`문이 ${z}만큼 올라간 프레임이 온전하게 그려진다`, () => {
        renderWithDoorRaised(z);

        for (const px of centreColumn()) {
            assert.equal(px.a, 255, `y=${px.y} 픽셀의 알파가 ${px.a}입니다`);
            for (const [name, value] of [['r', px.r], ['g', px.g], ['b', px.b]]) {
                assert.ok(Number.isInteger(value) && value >= 0 && value <= 255,
                    `y=${px.y} 픽셀의 ${name} 채널이 ${value}입니다`);
            }
        }
    });
}

test('문이 열리는 동안 화면이 검게 죽지 않는다', () => {
    // 인덱스 부호가 뒤집혀 NaN 이 화면에 남게 되면 픽셀이 0으로 접혀 검은 띠가 생깁니다.
    // 지평선 아래쪽은 바닥 텍스처가 보여야 하므로 밝기가 0일 수 없습니다.
    for (const z of RAISE_HEIGHTS) {
        renderWithDoorRaised(z);
        const column = centreColumn();
        const lowerHalf = bandBrightness(column, 0.6, 0.95);
        assert.ok(lowerHalf > 1,
            `문이 ${z}만큼 올라갔을 때 화면 아래쪽 평균 밝기가 ${lowerHalf.toFixed(2)}입니다`);
    }
});

test('문이 열려도 천장과 바닥이 뒤집히지 않는다', () => {
    // 바닥/천장 루프의 인덱스가 음수로 내려가면 바닥이 위쪽에, 천장이 아래쪽에 찍힙니다.
    // 닫힌 프레임과 열린 프레임에서 위아래 밝기 관계의 부호가 유지되는지 봅니다.
    renderWithDoorRaised(0);
    const closed = centreColumn();
    renderWithDoorRaised(C.TILE_SIZE);
    const open = centreColumn();

    const closedGap = bandBrightness(closed, 0, 0.2) - bandBrightness(closed, 0.8, 1);
    const openGap = bandBrightness(open, 0, 0.2) - bandBrightness(open, 0.8, 1);

    assert.equal(Math.sign(closedGap), Math.sign(openGap),
        `문이 열리자 천장/바닥 밝기 관계가 뒤집혔습니다 ` +
        `(닫힘 ${closedGap.toFixed(2)}, 열림 ${openGap.toFixed(2)})`);
});

test('문이 다 열리기 전까지 벽으로 그려진다', () => {
    // 문은 스프라이트가 아니라 벽으로 렌더링됩니다(OBJECT_TYPES 의 renderAsWall).
    // 올라가는 중에는 화면 중앙에 벽면이 남아 있어야 하고, 그 높이는 z 가 커질수록 줄어듭니다.
    const middleBrightness = RAISE_HEIGHTS.map(z => {
        renderWithDoorRaised(z);
        return bandBrightness(centreColumn(), 0.35, 0.5);
    });

    assert.ok(middleBrightness[0] > 0, '문이 닫혔는데 화면 중앙이 완전히 검습니다');
    // 문이 위로 빠져나가면 중앙에서 벽이 사라지므로 밝기가 처음보다 어두워집니다.
    const first = middleBrightness[0];
    const last = middleBrightness[middleBrightness.length - 1];
    assert.notEqual(first.toFixed(2), last.toFixed(2),
        `문이 다 열려도 화면 중앙이 그대로입니다 (${first.toFixed(2)})`);
});

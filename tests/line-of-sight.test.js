/**
 * @fileoverview hasLineOfSight 검증.
 *
 * 이 함수가 없던 시절에는 거리와 각도만 보고 명중을 판정했기 때문에
 * 벽 너머의 적을 저격할 수 있었습니다.
 * 벽 판정 기준은 render.js의 castRay와 같아야 합니다(map 값이 0보다 크면 벽).
 * 즉 "화면에 벽으로 보이는 것은 총알도 막는다"가 성립해야 합니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const { world } = await import('../Script/world.js');  // 이 파일은 world를 재할당하지 않으므로 구조분해해도 안전합니다.
const { hasLineOfSight } = await import('../Script/gameLogic.js');

const TILE = C.TILE_SIZE;

// 8x8 맵. 1=벽, 0=바닥. x=4에 세로 벽이 서 있고 y=6만 뚫려 있다.
world.map = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
];

/** 타일 좌표를 그 타일 중심의 월드 좌표로 바꾼다. */
const center = (tileX, tileY) => [tileX * TILE + TILE / 2, tileY * TILE + TILE / 2];

test('막힌 것이 없으면 시야가 통한다', () => {
    assert.equal(hasLineOfSight(...center(1, 1), ...center(1, 1)), true, '완전히 같은 지점');
    assert.equal(hasLineOfSight(...center(1, 1), ...center(3, 1)), true, '수평');
    assert.equal(hasLineOfSight(...center(1, 1), ...center(1, 5)), true, '수직');
    assert.equal(hasLineOfSight(...center(1, 1), ...center(3, 3)), true, '대각선');
});

test('같은 칸 안의 다른 지점도 시야가 통한다', () => {
    // 코앞의 적은 같은 칸에 서 있습니다. DDA 는 한 칸 옮긴 뒤에 도착을 확인하므로,
    // 출발 칸을 먼저 걸러내지 않으면 목표를 지나쳐 영영 닿지 못합니다.
    const [x, y] = center(2, 2);
    assert.equal(hasLineOfSight(x, y, x + 10, y), true, '같은 칸 오른쪽');
    assert.equal(hasLineOfSight(x, y, x, y + 10), true, '같은 칸 아래쪽');
    assert.equal(hasLineOfSight(x, y, x + 8, y + 8), true, '같은 칸 대각선');
});

test('벽이 시야를 막는다', () => {
    assert.equal(hasLineOfSight(...center(1, 1), ...center(6, 1)), false, '벽 너머 저격이 차단되어야 한다');
    assert.equal(hasLineOfSight(...center(1, 1), ...center(6, 5)), false, '벽 너머 대각선');
});

test('뚫린 통로로는 시야가 통한다', () => {
    assert.equal(hasLineOfSight(...center(3, 6), ...center(5, 6)), true);
});

test('방향을 바꿔도 판정이 같다', () => {
    assert.equal(hasLineOfSight(...center(6, 1), ...center(1, 1)), false);
    assert.equal(hasLineOfSight(...center(3, 1), ...center(1, 1)), true);
});

test('벽 타일 자체를 겨냥하면 도달한 것으로 본다', () => {
    // 목표 타일에 도착하면 그 타일이 벽이어도 '가려지지 않았다'로 판정해야 한다.
    // 그렇지 않으면 벽에 붙어 선 적을 영영 맞힐 수 없다.
    assert.equal(hasLineOfSight(...center(1, 1), ...center(4, 1)), true);
});

test('맵 밖 목표는 차단된다', () => {
    assert.equal(hasLineOfSight(...center(1, 1), 99999, 99999), false);
});

test('축에 정확히 정렬된 광선도 무한 루프에 빠지지 않는다', () => {
    // dirY가 정확히 0이면 deltaDistY가 Infinity가 되는 경계 조건.
    assert.equal(hasLineOfSight(TILE * 1.5, TILE * 1.5, TILE * 3.5, TILE * 1.5), true);
    assert.equal(hasLineOfSight(TILE * 1.5, TILE * 1.5, TILE * 6.5, TILE * 1.5), false);
});

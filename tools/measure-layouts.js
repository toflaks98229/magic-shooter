/**
 * @fileoverview 맵 레이아웃이 실시간 FPS 에 맞는 규모인지 재 봅니다.
 *
 * 긴 복도는 턴제에서 전술 자산입니다. 한 번에 한 마리만 상대하고, 물러설 수 있고,
 * 시야가 한 줄로 제한됩니다. 실시간에서는 같은 복도가 아무 일도 일어나지 않는
 * 빈 시간이 됩니다. 게다가 이미 옮겨 둔 규칙들과 직접 충돌합니다.
 *
 *   인지 거리가 지능별로 3/8/11 타일입니다. 복도가 그보다 길면 몬스터가
 *   플레이어를 영영 알아채지 못하고 제자리에 서 있습니다.
 *   우는 소리 반경이 최대 12 타일입니다. 그보다 길면 '옆방을 깨웠는가'가
 *   성립하지 않습니다.
 *   1 타일 폭 복도에서는 좌우로 피할 공간이 없어, 에임 보정을 걷어내고
 *   겨눈 선으로 명중을 정하게 만든 것이 작동할 자리가 없습니다.
 *
 * 그래서 재는 것은 두 가지입니다. 복도가 얼마나 긴가, 그리고 얼마나 좁은가.
 *
 * 사용법: node tools/measure-layouts.js [층당 표본 수]
 */

import { installBrowserStubs } from '../tests/helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const { generateDungeon, allLayouts } = await import('../Script/mapGenerator.js');

/** @description 몬스터가 서로를 알아챌 수 있는 최대 거리(타일). 소리 반경입니다. */
const SHOUT_REACH_TILES = 12;

/** @description 옆으로 피할 수 있으려면 필요한 최소 폭(타일). */
const MIN_DODGE_WIDTH = 2;

/**
 * 한 칸이 바닥인지 봅니다.
 * @param {Array<Array<number>>} map - 맵
 * @param {number} x - 타일 X
 * @param {number} y - 타일 Y
 * @returns {boolean} 바닥이면 true
 */
function isOpen(map, x, y) {
    return !(C.tileAt(map, x, y).solid);
}

/**
 * 한 칸의 폭을 잽니다. 가로로 트인 길이와 세로로 트인 길이 중 좁은 쪽입니다.
 *
 * 넓은 방 한가운데는 양쪽 다 크고, 복도 한가운데는 한쪽이 1 입니다.
 * @param {Array<Array<number>>} map - 맵
 * @param {number} x - 타일 X
 * @param {number} y - 타일 Y
 * @returns {number} 좁은 쪽의 폭(타일)
 */
function narrowness(map, x, y) {
    let horizontal = 1;
    for (let d = 1; isOpen(map, x - d, y); d++) horizontal++;
    for (let d = 1; isOpen(map, x + d, y); d++) horizontal++;

    let vertical = 1;
    for (let d = 1; isOpen(map, x, y - d); d++) vertical++;
    for (let d = 1; isOpen(map, x, y + d); d++) vertical++;

    return Math.min(horizontal, vertical);
}

/**
 * 복도로 볼 수 있는 칸들의 길이를 모읍니다.
 *
 * 폭이 좁은 칸이 이어진 구간 하나를 복도 하나로 셉니다.
 * @param {Array<Array<number>>} map - 맵
 * @returns {{corridorCells: number, openCells: number, runs: Array<number>}} 잰 값
 */
function measureCorridors(map) {
    const runs = [];
    let corridorCells = 0;
    let openCells = 0;

    const narrow = [];
    for (let y = 0; y < map.length; y++) {
        narrow[y] = [];
        for (let x = 0; x < map[y].length; x++) {
            if (!isOpen(map, x, y)) { narrow[y][x] = false; continue; }
            openCells++;
            const isCorridor = narrowness(map, x, y) < MIN_DODGE_WIDTH + 1;
            narrow[y][x] = isCorridor;
            if (isCorridor) corridorCells++;
        }
    }

    // 가로로 이어진 좁은 구간의 길이
    for (let y = 0; y < narrow.length; y++) {
        let run = 0;
        for (let x = 0; x <= narrow[y].length; x++) {
            if (narrow[y][x]) run++;
            else { if (run >= 3) runs.push(run); run = 0; }
        }
    }
    // 세로로 이어진 좁은 구간의 길이
    for (let x = 0; x < C.MAP_WIDTH; x++) {
        let run = 0;
        for (let y = 0; y <= narrow.length; y++) {
            if (narrow[y]?.[x]) run++;
            else { if (run >= 3) runs.push(run); run = 0; }
        }
    }

    return { corridorCells, openCells, runs };
}

const samples = Number(process.argv[2] ?? 40);
const layouts = allLayouts();

console.log(`맵 ${C.MAP_WIDTH}x${C.MAP_HEIGHT}, 레이아웃 ${layouts.length}가지, 각 ${samples}판\n`);
console.log('레이아웃'.padEnd(16), '좁은칸%', '최장복도', '평균복도', `${SHOUT_REACH_TILES}칸초과`);
console.log('-'.repeat(60));

for (const layout of layouts) {
    let corridorCells = 0, openCells = 0;
    const allRuns = [];

    for (let i = 0; i < samples; i++) {
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, { layout });
        const measured = measureCorridors(dungeon.map);
        corridorCells += measured.corridorCells;
        openCells += measured.openCells;
        allRuns.push(...measured.runs);
    }

    const longest = allRuns.length ? Math.max(...allRuns) : 0;
    const mean = allRuns.length ? allRuns.reduce((a, b) => a + b, 0) / allRuns.length : 0;
    const overReach = allRuns.filter(r => r > SHOUT_REACH_TILES).length;

    console.log(
        String(layout).padEnd(16),
        `${(100 * corridorCells / openCells).toFixed(0)}%`.padStart(6),
        String(longest).padStart(8),
        mean.toFixed(1).padStart(8),
        `${allRuns.length ? (100 * overReach / allRuns.length).toFixed(0) : 0}%`.padStart(8),
    );
}

console.log(`
좁은칸%  — 옆으로 피할 수 없는 칸의 비율. 높을수록 조준 전투가 작동할 자리가 좁습니다.
최장복도 — 가장 긴 좁은 구간(타일).
${SHOUT_REACH_TILES}칸초과 — 소리 반경을 넘는 복도의 비율. 이 구간에서는 몬스터가 서로를 못 깨웁니다.`);

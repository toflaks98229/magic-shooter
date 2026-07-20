/**
 * @fileoverview 층 배치 검증.
 *
 * 층 모양이 여러 가지가 되면서, 예전에는 방-복도 방식이 저절로 지켜 주던 것들이
 * 더 이상 저절로 지켜지지 않게 되었습니다. 동굴이나 도시는 파내는 방식이 달라
 * 갈 수 없는 구석이 남을 수 있고, 출구가 벽 속에 박힐 수도 있습니다.
 *
 * 그래서 '어떤 레이아웃이 나오든 반드시 참이어야 하는 것'을 모든 레이아웃에 대해 봅니다.
 * 브라우저를 열 수 없어 층이 어떻게 생겼는지는 못 보지만, 걸어 다닐 수 있는지는 여기서 봅니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, seedRandom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const L = await import('../Script/layouts.js');
const { generateDungeon, allLayouts } = await import('../Script/mapGenerator.js');

/**
 * 시작 지점에서 걸어갈 수 있는 칸을 셉니다.
 * @param {number[][]} map - 맵
 * @param {{x: number, y: number}} from - 시작 지점
 * @returns {boolean[][]} 갈 수 있으면 true
 */
function reachable(map, from) {
    const seen = map.map(row => row.map(() => false));
    const queue = [from];
    seen[from.y][from.x] = true;

    for (let head = 0; head < queue.length; head++) {
        const { x, y } = queue[head];
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy;
            if (!map[ny]?.[nx] === undefined) continue;
            if (nx < 0 || ny < 0 || ny >= map.length || nx >= map[0].length) continue;
            if (seen[ny][nx] || C.tileAt(map, nx, ny).solid) continue;
            seen[ny][nx] = true;
            queue.push({ x: nx, y: ny });
        }
    }
    return seen;
}

/** 맵에서 출구 칸을 찾습니다. */
function findExit(map) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            if (map[y][x] === C.TILE_IDS.EXIT) return { x, y };
        }
    }
    return null;
}

// --- 원본 표를 옮긴 것이 맞는가 -----------------------------------------------

test('원본 layout.des 와 같은 수의 배치가 있다', () => {
    assert.equal(Object.keys(L.LAYOUTS).length, 11, '원본 0.34 의 layout.des 에는 11가지가 있습니다');
});

test('메인 던전은 깊이에 따라 나오는 배치가 달라진다', () => {
    // 원본에서 격자 방(roguey)과 트인 층은 D:9- 부터 나옵니다.
    const shallow = L.candidateLayouts('D', 1).map(c => c.id);
    const deep = L.candidateLayouts('D', 12).map(c => c.id);

    assert.ok(shallow.includes('rooms'), '얕은 층에도 방-복도는 나와야 합니다');
    assert.ok(!shallow.includes('roguey'), '격자 방이 1층부터 나오고 있습니다');
    assert.ok(deep.includes('roguey'), '깊은 층에 격자 방이 나오지 않습니다');
    assert.ok(deep.includes('bigOctagon'), '깊은 층에 트인 층이 나오지 않습니다');
});

test('가지마다 나오는 배치가 다르다', () => {
    // 오크 광산의 동굴과 다이아몬드 광산은 메인 던전에 나오면 안 됩니다.
    const orc = L.candidateLayouts('O', 3).map(c => c.id);
    const main = L.candidateLayouts('D', 3).map(c => c.id);

    assert.ok(orc.includes('caves'), '오크 광산에 동굴이 없습니다');
    assert.ok(orc.includes('diamondMine'), '오크 광산에 다이아몬드 광산이 없습니다');
    assert.ok(!main.includes('caves'), '메인 던전에 동굴이 나오고 있습니다');
});

test('표에 없는 가지도 층을 만들 수 있다', () => {
    // 원본 layout.des 가 모든 가지를 덮지는 않습니다. 그런 가지는 방-복도로 만듭니다.
    assert.equal(L.rollLayout('T', 1), 'rooms', '만신전에 쓸 배치를 정하지 못했습니다');
});

test('굴린 배치가 그 층에 나올 수 있는 것이다', () => {
    for (let seed = 0; seed < 60; seed++) {
        seedRandom(0xB000 + seed);
        const layout = L.rollLayout('D', 12);
        const allowed = L.candidateLayouts('D', 12).map(c => c.id);
        assert.ok(allowed.includes(layout), `D:12 에 나올 수 없는 ${layout} 이 나왔습니다`);
    }
});

// --- 어떤 배치든 지켜져야 하는 것 ---------------------------------------------

test('모든 배치에서 출구까지 걸어갈 수 있다', () => {
    for (const layout of allLayouts()) {
        for (let seed = 0; seed < 12; seed++) {
            seedRandom(0xC000 + seed);
            const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, { layout });

            const exit = findExit(dungeon.map);
            assert.ok(exit, `${layout}(seed ${seed}) 에 출구가 없습니다`);

            const seen = reachable(dungeon.map, dungeon.playerStart);
            // 출구는 벽 취급이라 그 자리로는 못 들어갑니다. 옆에 설 수 있으면 됩니다.
            const canStandBeside = [[1, 0], [-1, 0], [0, 1], [0, -1]]
                .some(([dx, dy]) => seen[exit.y + dy]?.[exit.x + dx]);
            assert.ok(canStandBeside, `${layout}(seed ${seed}) 의 출구에 닿을 수 없습니다`);
        }
    }
});

test('모든 배치에서 시작 지점이 바닥이다', () => {
    for (const layout of allLayouts()) {
        for (let seed = 0; seed < 12; seed++) {
            seedRandom(0xD000 + seed);
            const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, { layout });
            const { x, y } = dungeon.playerStart;

            assert.ok(!C.tileAt(dungeon.map, x, y).solid,
                `${layout}(seed ${seed}) 의 시작 지점이 벽 속입니다`);
        }
    }
});

test('모든 배치가 돌아다닐 만한 넓이를 갖는다', () => {
    for (const layout of allLayouts()) {
        seedRandom(0xE001);
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, { layout });
        const seen = reachable(dungeon.map, dungeon.playerStart);
        const walkable = seen.flat().filter(Boolean).length;

        // 30x30 맵에서 갈 수 있는 칸이 80 미만이면 층이라기보다 방 하나입니다.
        assert.ok(walkable >= 80, `${layout} 에서 갈 수 있는 칸이 ${walkable}개뿐입니다`);
    }
});

test('맵 가장자리는 벽으로 막혀 있다', () => {
    // 가장자리가 뚫려 있으면 광선이 새어 나가 화면이 깨집니다.
    for (const layout of allLayouts()) {
        seedRandom(0xE100);
        const { map } = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, { layout });
        const lastY = map.length - 1, lastX = map[0].length - 1;

        for (let x = 0; x <= lastX; x++) {
            assert.ok(C.tileAt(map, x, 0).solid, `${layout}: 위쪽 가장자리 ${x} 가 뚫렸습니다`);
            assert.ok(C.tileAt(map, x, lastY).solid, `${layout}: 아래쪽 가장자리 ${x} 가 뚫렸습니다`);
        }
        for (let y = 0; y <= lastY; y++) {
            assert.ok(C.tileAt(map, 0, y).solid, `${layout}: 왼쪽 가장자리 ${y} 가 뚫렸습니다`);
            assert.ok(C.tileAt(map, lastX, y).solid, `${layout}: 오른쪽 가장자리 ${y} 가 뚫렸습니다`);
        }
    }
});

test('배치마다 층의 생김새가 실제로 다르다', () => {
    // 표만 나뉘어 있고 결과가 같으면 나눈 의미가 없습니다. 바닥 넓이로 대신 봅니다.
    const areas = {};
    for (const layout of allLayouts()) {
        seedRandom(0xE200);
        const { map } = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, { layout });
        areas[layout] = map.flat().filter(tile => tile === C.TILE_IDS.FLOOR).length;
    }

    const values = Object.values(areas);
    assert.ok(Math.max(...values) > Math.min(...values) * 1.8,
        `배치별 넓이가 비슷합니다: ${JSON.stringify(areas)}`);
});

test('출구가 시작 지점에서 멀리 떨어져 있다', () => {
    // 바로 옆에 있으면 층을 둘러보지 않고 내려가게 됩니다.
    for (const layout of allLayouts()) {
        seedRandom(0xE300);
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, { layout });
        const exit = findExit(dungeon.map);
        const distance = Math.hypot(exit.x - dungeon.playerStart.x, exit.y - dungeon.playerStart.y);

        assert.ok(distance > 8, `${layout} 의 출구가 ${distance.toFixed(1)} 칸 거리에 있습니다`);
    }
});

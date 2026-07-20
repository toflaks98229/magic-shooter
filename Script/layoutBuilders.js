/**
 * @fileoverview 레이아웃별로 층의 모양을 그립니다.
 *
 * 어떤 레이아웃을 쓸지는 layouts.js 가 정하고, 실제로 벽을 파는 일은 여기서 합니다.
 * 원본 layout.des 의 Lua 를 그대로 옮길 수는 없어(맵 크기도 도구도 다릅니다) 각 레이아웃이
 * '왜 그렇게 생겼는가'를 따랐습니다. 원본에서 어떤 함수를 본 것인지는 각 함수에 적어 두었습니다.
 *
 * 모든 함수는 벽으로 가득 찬 맵을 받아 바닥을 파내고, 만들어진 방 목록을 돌려줍니다.
 * 시작 지점과 출구를 어디에 둘지는 mapGenerator 가 그 목록을 보고 정합니다.
 * 연결성 보장도 mapGenerator 가 맡습니다. 여기서는 모양만 신경 씁니다.
 */

import { TILE_IDS } from './constants.js';

const FLOOR = TILE_IDS.FLOOR;
const WALL = TILE_IDS.WALL;

// --- 공용 도구 ---------------------------------------------------------------

/**
 * 정수 난수를 뽑습니다. min 이상 max 이하입니다.
 * @param {number} min - 최솟값
 * @param {number} max - 최댓값
 * @returns {number} 뽑힌 값
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 직사각형을 바닥으로 팝니다. 맵 가장자리는 벽으로 남겨 둡니다.
 * @param {number[][]} map - 맵
 * @param {{x: number, y: number, w: number, h: number}} rect - 팔 영역
 */
function carveRect(map, rect) {
    const height = map.length, width = map[0].length;
    for (let y = Math.max(1, rect.y); y < Math.min(height - 1, rect.y + rect.h); y++) {
        for (let x = Math.max(1, rect.x); x < Math.min(width - 1, rect.x + rect.w); x++) {
            map[y][x] = FLOOR;
        }
    }
}

/**
 * 두 점을 ㄱ 자로 잇습니다. 원본의 join_the_dots 에 해당합니다.
 * @param {number[][]} map - 맵
 * @param {{x: number, y: number}} from - 시작
 * @param {{x: number, y: number}} to - 끝
 */
export function joinTheDots(map, from, to) {
    const height = map.length, width = map[0].length;
    const clampX = (x) => Math.max(1, Math.min(width - 2, x));
    const clampY = (y) => Math.max(1, Math.min(height - 2, y));

    let { x, y } = from;
    // 가로로 먼저 갈지 세로로 먼저 갈지 반씩 섞어 복도가 한쪽으로 쏠리지 않게 합니다.
    const horizontalFirst = Math.random() < 0.5;

    const stepX = () => { while (x !== to.x) { x += x < to.x ? 1 : -1; map[clampY(y)][clampX(x)] = FLOOR; } };
    const stepY = () => { while (y !== to.y) { y += y < to.y ? 1 : -1; map[clampY(y)][clampX(x)] = FLOOR; } };

    map[clampY(y)][clampX(x)] = FLOOR;
    if (horizontalFirst) { stepX(); stepY(); } else { stepY(); stepX(); }
}

/**
 * 방의 한가운데 좌표를 구합니다.
 * @param {{x: number, y: number, w: number, h: number}} room - 방
 * @returns {{x: number, y: number}} 중심
 */
export function centerOf(room) {
    return { x: room.x + Math.floor(room.w / 2), y: room.y + Math.floor(room.h / 2) };
}

// --- 방과 복도 (layout_rooms) -------------------------------------------------

/**
 * 겹치지 않는 직사각형 방을 흩어 놓고 차례로 잇습니다.
 *
 * 원본 layout_rooms 와 같은 방식입니다. 가장 흔하고 가장 무난한 층이라,
 * 후보가 없는 가지의 기본값으로도 씁니다.
 * @param {number[][]} map - 벽으로 찬 맵
 * @returns {object[]} 만들어진 방 목록
 */
export function buildRooms(map) {
    const height = map.length, width = map[0].length;
    const rooms = [];
    const MAX_ROOMS = 15;

    for (let attempt = 0; attempt < MAX_ROOMS * 5 && rooms.length < MAX_ROOMS; attempt++) {
        const w = randomInt(4, 8), h = randomInt(4, 8);
        const room = { x: randomInt(1, width - w - 2), y: randomInt(1, height - h - 2), w, h };

        const overlaps = rooms.some(other =>
            room.x < other.x + other.w + 1 && room.x + room.w + 1 > other.x &&
            room.y < other.y + other.h + 1 && room.y + room.h + 1 > other.y);
        if (overlaps) continue;

        carveRect(map, room);
        rooms.push(room);
    }

    for (let i = 1; i < rooms.length; i++) {
        joinTheDots(map, centerOf(rooms[i - 1]), centerOf(rooms[i]));
    }
    return rooms;
}

// --- 격자 방 (layout_roguey) ---------------------------------------------------

/**
 * 맵을 격자로 나누고 칸마다 방을 하나씩 놓습니다.
 *
 * 원본 layout_roguey 는 이름 그대로 옛 로그(rogue)의 층 모양입니다.
 * 방이 규칙적으로 늘어서 있고 이웃한 방끼리만 이어져, 흩어 놓는 방식보다 길이 분명합니다.
 * @param {number[][]} map - 벽으로 찬 맵
 * @returns {object[]} 만들어진 방 목록
 */
export function buildRoguey(map) {
    const height = map.length, width = map[0].length;
    const COLUMNS = 3, ROWS = 3;
    const cellW = Math.floor(width / COLUMNS), cellH = Math.floor(height / ROWS);
    const grid = [];

    for (let row = 0; row < ROWS; row++) {
        grid[row] = [];
        for (let column = 0; column < COLUMNS; column++) {
            // 칸 안에서 조금씩 어긋나게 두어야 격자가 너무 기계적으로 보이지 않습니다.
            const w = randomInt(4, Math.max(5, cellW - 3));
            const h = randomInt(4, Math.max(5, cellH - 3));
            const room = {
                x: column * cellW + randomInt(1, Math.max(1, cellW - w - 1)),
                y: row * cellH + randomInt(1, Math.max(1, cellH - h - 1)),
                w, h,
            };
            carveRect(map, room);
            grid[row][column] = room;
        }
    }

    // 오른쪽 이웃과 아래쪽 이웃에만 길을 냅니다. 이러면 모든 방이 하나로 이어집니다.
    for (let row = 0; row < ROWS; row++) {
        for (let column = 0; column < COLUMNS; column++) {
            if (column + 1 < COLUMNS) joinTheDots(map, centerOf(grid[row][column]), centerOf(grid[row][column + 1]));
            if (row + 1 < ROWS) joinTheDots(map, centerOf(grid[row][column]), centerOf(grid[row + 1][column]));
        }
    }

    return grid.flat();
}

// --- 뒤엉킨 복도 (layout_misc_corridors) ---------------------------------------

/**
 * 방 없이 복도만으로 층을 채웁니다.
 *
 * 원본 layout_misc_corridors 는 넓은 방이 거의 없어, 모퉁이를 돌 때까지 앞이 보이지 않습니다.
 * 이 게임은 1인칭이라 그 답답함이 원본보다 훨씬 강하게 느껴집니다.
 * @param {number[][]} map - 벽으로 찬 맵
 * @returns {object[]} 복도가 지나는 자리 목록 (방 대신)
 */
export function buildCorridors(map) {
    const height = map.length, width = map[0].length;
    const nodes = [];
    const NODE_COUNT = 14;

    for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({ x: randomInt(2, width - 3), y: randomInt(2, height - 3), w: 1, h: 1 });
    }

    // 차례로 잇고, 몇 군데는 되돌아가는 길을 더 내어 막다른 길만 남지 않게 합니다.
    for (let i = 1; i < nodes.length; i++) joinTheDots(map, nodes[i - 1], nodes[i]);
    for (let i = 0; i < 4; i++) {
        joinTheDots(map, nodes[randomInt(0, nodes.length - 1)], nodes[randomInt(0, nodes.length - 1)]);
    }

    // 교차점만 조금 넓혀 둡니다. 전부 폭 1이면 적과 마주쳤을 때 피할 데가 없습니다.
    const junctions = [];
    for (let i = 0; i < 5; i++) {
        const node = nodes[randomInt(0, nodes.length - 1)];
        const room = { x: node.x - 1, y: node.y - 1, w: 3, h: 3 };
        carveRect(map, room);
        junctions.push(room);
    }

    return [...junctions, ...nodes];
}

// --- 반듯한 도시 (layout_regular_city) -----------------------------------------

/**
 * 바닥을 통째로 비우고 그 위에 네모난 건물을 세웁니다.
 *
 * 원본 layout_regular_city 는 방을 파는 것이 아니라 빈 터에 벽을 놓는 방식입니다.
 * 그래서 시야가 트여 있고 건물 사이로 멀리까지 보입니다.
 * @param {number[][]} map - 벽으로 찬 맵
 * @returns {object[]} 건물 사이의 빈 자리 목록
 */
export function buildCity(map) {
    const height = map.length, width = map[0].length;

    carveRect(map, { x: 1, y: 1, w: width - 2, h: height - 2 });

    const plazas = [];
    const BLOCKS = 10;
    for (let i = 0; i < BLOCKS; i++) {
        const w = randomInt(3, 6), h = randomInt(3, 6);
        const x = randomInt(2, width - w - 3), y = randomInt(2, height - h - 3);

        for (let by = y; by < y + h; by++) {
            for (let bx = x; bx < x + w; bx++) map[by][bx] = WALL;
        }

        // 건물 절반쯤은 안이 비어 있고 문이 하나 있습니다. 원본에도 들어갈 수 있는 건물이 있습니다.
        if (w >= 5 && h >= 5 && Math.random() < 0.5) {
            carveRect(map, { x: x + 1, y: y + 1, w: w - 2, h: h - 2 });
            map[y + Math.floor(h / 2)][x] = FLOOR;
            plazas.push({ x: x + 1, y: y + 1, w: w - 2, h: h - 2 });
        }
    }

    // 시작 지점과 출구를 놓을 만한 트인 자리를 몇 군데 돌려줍니다.
    for (let i = 0; i < 6; i++) {
        plazas.push({ x: randomInt(2, width - 5), y: randomInt(2, height - 5), w: 3, h: 3 });
    }
    return plazas;
}

// --- 동굴 (layout_caves) --------------------------------------------------------

/**
 * 얼룩을 퍼뜨려 동굴을 만듭니다.
 *
 * 원본 layout_caves 는 spotty_level 을 씁니다. 무작위 지점에서 시작해 이웃 칸으로
 * 조금씩 번지는 방식이라, 직선이 하나도 없는 울퉁불퉁한 굴이 나옵니다.
 * @param {number[][]} map - 벽으로 찬 맵
 * @param {number} [density] - 얼룩을 몇 번 퍼뜨릴지
 * @returns {object[]} 파인 자리 목록
 */
export function buildCaves(map, density = 260) {
    const height = map.length, width = map[0].length;
    const spots = [];

    let x = Math.floor(width / 2), y = Math.floor(height / 2);
    for (let i = 0; i < density; i++) {
        // 취한 걸음(random walk)으로 돌아다니며 주변을 파냅니다.
        x = Math.max(2, Math.min(width - 3, x + randomInt(-2, 2)));
        y = Math.max(2, Math.min(height - 3, y + randomInt(-2, 2)));

        const radius = Math.random() < 0.25 ? 2 : 1;
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                if (dx * dx + dy * dy > radius * radius + 1) continue;
                const nx = x + dx, ny = y + dy;
                if (nx < 1 || ny < 1 || nx >= width - 1 || ny >= height - 1) continue;
                map[ny][nx] = FLOOR;
            }
        }

        // 가끔 멀리 건너뛰어 굴이 한 덩어리로만 뭉치지 않게 합니다.
        if (Math.random() < 0.04) {
            x = randomInt(3, width - 4);
            y = randomInt(3, height - 4);
            spots.push({ x: x - 1, y: y - 1, w: 3, h: 3 });
        }
    }

    spots.push({ x: Math.floor(width / 2) - 1, y: Math.floor(height / 2) - 1, w: 3, h: 3 });
    return spots;
}

/**
 * 가늘고 긴 굴을 팝니다.
 *
 * 원본 layout_diamond_mine 은 오크 광산의 갱도를 흉내 낸 것이라, 동굴이지만
 * 폭이 좁고 길게 뻗습니다.
 * @param {number[][]} map - 벽으로 찬 맵
 * @returns {object[]} 파인 자리 목록
 */
export function buildNarrowCaves(map) {
    const height = map.length, width = map[0].length;
    const shafts = [];
    const SHAFT_COUNT = 6;

    for (let i = 0; i < SHAFT_COUNT; i++) {
        let x = randomInt(3, width - 4), y = randomInt(3, height - 4);
        const start = { x, y };
        // 한 갱도는 대체로 한 방향으로 뻗습니다.
        const dirX = Math.random() < 0.5 ? 1 : -1;
        const dirY = Math.random() < 0.5 ? 1 : -1;

        for (let step = 0; step < 40; step++) {
            x = Math.max(2, Math.min(width - 3, x + (Math.random() < 0.7 ? dirX : randomInt(-1, 1))));
            y = Math.max(2, Math.min(height - 3, y + (Math.random() < 0.4 ? dirY : randomInt(-1, 1))));
            map[y][x] = FLOOR;
            if (Math.random() < 0.4) map[y][Math.min(width - 2, x + 1)] = FLOOR;
        }
        shafts.push({ x: start.x - 1, y: start.y - 1, w: 3, h: 3 });
    }

    // 갱도끼리 잇지 않으면 따로 노는 굴이 남습니다.
    for (let i = 1; i < shafts.length; i++) joinTheDots(map, centerOf(shafts[i - 1]), centerOf(shafts[i]));
    return shafts;
}

// --- 구획 (layout_subdivisions / layout_jigsaw) ---------------------------------

/**
 * 맵을 재귀적으로 반씩 갈라 방으로 채웁니다.
 *
 * 원본 layout_subdivisions 가 쓰는 방식(BSP)입니다. 빈 곳 없이 방으로 꽉 차고
 * 방마다 크기가 달라, 격자 방보다 답답하면서 규칙적입니다.
 * @param {number[][]} map - 벽으로 찬 맵
 * @returns {object[]} 만들어진 방 목록
 */
export function buildDivisions(map) {
    const height = map.length, width = map[0].length;
    const MIN_SIZE = 7;
    const rooms = [];

    /**
     * 영역을 더 나눌 수 있으면 나누고, 아니면 방으로 만듭니다.
     * @param {{x: number, y: number, w: number, h: number}} area - 나눌 영역
     * @param {number} depth - 남은 깊이
     */
    const split = (area, depth) => {
        const canSplit = depth > 0 && (area.w > MIN_SIZE * 2 || area.h > MIN_SIZE * 2);
        if (!canSplit) {
            const room = { x: area.x + 1, y: area.y + 1, w: area.w - 2, h: area.h - 2 };
            if (room.w >= 2 && room.h >= 2) { carveRect(map, room); rooms.push(room); }
            return;
        }

        // 긴 쪽을 자릅니다. 그러지 않으면 가늘고 긴 방이 생깁니다.
        if (area.w >= area.h) {
            const cut = randomInt(MIN_SIZE, area.w - MIN_SIZE);
            split({ ...area, w: cut }, depth - 1);
            split({ ...area, x: area.x + cut, w: area.w - cut }, depth - 1);
        } else {
            const cut = randomInt(MIN_SIZE, area.h - MIN_SIZE);
            split({ ...area, h: cut }, depth - 1);
            split({ ...area, y: area.y + cut, h: area.h - cut }, depth - 1);
        }
    };

    split({ x: 0, y: 0, w: width, h: height }, 4);
    for (let i = 1; i < rooms.length; i++) joinTheDots(map, centerOf(rooms[i - 1]), centerOf(rooms[i]));
    return rooms;
}

// --- 트인 모양 (layout_cross / layout_big_octagon / layout_forbidden_donut) ------

/**
 * 층 전체가 하나의 큰 도형인 배치를 만듭니다.
 *
 * 원본의 십자 · 큰 팔각형 · 금단의 고리가 여기 해당합니다. 방으로 나뉘어 있지 않고
 * 통째로 트여 있어, 멀리서 적이 다가오는 것이 보입니다. 깊은 층에만 나옵니다.
 * @param {number[][]} map - 벽으로 찬 맵
 * @param {string} shape - 'cross' | 'octagon' | 'donut'
 * @returns {object[]} 설 만한 자리 목록
 */
export function buildOpen(map, shape) {
    const height = map.length, width = map[0].length;
    const centerX = width / 2, centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 2;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const dx = x - centerX, dy = y - centerY;
            let inside = false;

            if (shape === 'cross') {
                const arm = Math.floor(Math.min(width, height) / 5);
                inside = Math.abs(dx) < arm || Math.abs(dy) < arm;
            } else if (shape === 'octagon') {
                // 팔각형은 정사각형과 마름모를 겹친 모양입니다.
                inside = Math.abs(dx) < radius && Math.abs(dy) < radius
                    && Math.abs(dx) + Math.abs(dy) < radius * 1.45;
            } else {
                // 고리: 바깥 원 안이면서 안쪽 원 밖
                const distance = Math.hypot(dx, dy);
                inside = distance < radius && distance > radius * 0.45;
            }

            if (inside) map[y][x] = FLOOR;
        }
    }

    // 트인 층은 방이 없으므로, 설 만한 자리를 도형 위에서 몇 군데 골라 돌려줍니다.
    const spots = [];
    for (let y = 2; y < height - 2; y += 3) {
        for (let x = 2; x < width - 2; x += 3) {
            if (map[y][x] === FLOOR) spots.push({ x: x - 1, y: y - 1, w: 3, h: 3 });
        }
    }
    return spots;
}

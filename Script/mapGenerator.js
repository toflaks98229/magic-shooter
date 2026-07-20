/**
 * @fileoverview 층 하나를 만듭니다.
 *
 * 예전에는 어떤 층이든 '방 열다섯 개를 흩어 놓고 복도로 잇는' 한 가지 방식이었습니다.
 * 짐승굴이든 오크 광산이든 지옥이든 똑같이 생겼다는 뜻이라, 어디에 있는지가 지형으로는
 * 전혀 드러나지 않았습니다.
 *
 * DCSS 는 층을 만들기 전에 먼저 '이 층을 어떤 모양으로 만들 것인가'를 굴립니다.
 * dat/des/builder/layout.des 에 열한 가지가 있고 가지와 깊이마다 나오는 것이 다릅니다.
 * 그 표를 layouts.js 로 옮겼고, 실제로 그리는 일은 layoutBuilders.js 가 합니다.
 * 이 파일은 그 둘을 이어 붙이고, 어떤 모양이 나오든 반드시 지켜져야 하는 것들을 챙깁니다.
 *
 * 반드시 지켜져야 하는 것은 두 가지입니다.
 *   - 시작 지점에서 출구까지 걸어갈 수 있을 것
 *   - 걸어갈 수 없는 자리에는 아무것도 놓지 않을 것
 * 동굴이나 도시처럼 파내는 방식이 방-복도가 아닌 레이아웃은 이것이 저절로 지켜지지 않습니다.
 * 그래서 다 만든 뒤에 ensureConnected 로 확인하고 고칩니다.
 */

import { TILE_IDS, tileAt } from './constants.js';
import { rollLayout, LAYOUTS } from './layouts.js';
import { placeMinivaults } from './vaults.js';
import {
    buildRooms, buildRoguey, buildCorridors, buildCity,
    buildCaves, buildNarrowCaves, buildDivisions, buildOpen,
    joinTheDots, centerOf,
} from './layoutBuilders.js';

/**
 * 층 하나를 만듭니다.
 *
 * @param {number} width - 맵 가로 (타일)
 * @param {number} height - 맵 세로 (타일)
 * @param {object} [options] - 어느 가지 몇 층인지. 없으면 메인 던전 1층으로 봅니다.
 * @param {string} [options.branch] - 가지 글자
 * @param {number} [options.floor] - 그 가지 안에서의 층
 * @param {string} [options.layout] - 레이아웃을 직접 지정할 때 (테스트와 미리보기용)
 * @returns {{map: number[][], objectMap: number[][], playerStart: {x: number, y: number}, layout: string}} 만들어진 층
 */
export function generateDungeon(width, height, options = {}) {
    const { branch = 'D', floor = 1 } = options;
    const layoutId = options.layout ?? rollLayout(branch, floor);

    const map = Array.from({ length: height }, () => Array(width).fill(TILE_IDS.WALL));
    const objectMap = Array.from({ length: height }, () => Array(width).fill(0));

    let spots = buildLayout(map, layoutId);

    // 어떤 레이아웃이든 설 자리가 하나도 안 나오는 경우가 있습니다. (난수가 나쁘게 걸릴 때)
    // 그럴 때는 가장 무난한 방-복도로 다시 만듭니다. 빈 맵을 내보내는 것보다 낫습니다.
    if (spots.length < 2) {
        for (let y = 0; y < height; y++) map[y].fill(TILE_IDS.WALL);
        spots = buildRooms(map);
    }
    if (spots.length < 2) return createFallbackDungeon(width, height);

    const playerStart = clampToFloor(map, centerOf(spots[0]));
    ensureConnected(map, playerStart, spots);

    // 손으로 그린 방을 찍어 넣습니다.
    //
    // 잇고 난 뒤에 찍습니다. 먼저 찍으면 잇는 과정이 볼트 한가운데를 뚫고 지나가
    // 애써 그린 모양이 망가집니다. 나중에 찍으면 볼트가 통로를 덮을 수 있으므로,
    // 찍은 뒤에 길이 끊기지 않았는지 다시 확인합니다.
    const vaults = placeMinivaults(map, { keepClear: playerStart });
    if (vaults.length > 0 && !ensureConnected(map, playerStart, spots)) {
        // 볼트가 층을 두 동강 냈습니다. 볼트 없는 층이 갈 수 없는 층보다 낫습니다.
        for (const vault of vaults) carveOut(map, vault);
    }


    placeDoors(map, objectMap);

    const exit = pickExit(map, playerStart);
    map[exit.y][exit.x] = TILE_IDS.EXIT;

    // 갇힌 바닥을 메웁니다.
    //
    // ensureConnected 는 '설 만한 자리' 목록만 봅니다. 그 목록에 없는 바닥이
    // 갇혀 있으면 그대로 남습니다. 30x30 에서는 갇혀 봐야 몇 칸이라 드러나지
    // 않다가, 80x70 으로 키우자 diamondMine 에서 바닥의 3분의 2가 갇히는 판이
    // 나왔습니다. 거기 놓인 적은 층을 다 뒤져도 찾을 수 없습니다.
    //
    // 뚫어서 잇지 않고 메웁니다. 뚫으면 원래 없던 통로가 생겨 레이아웃의 모양이
    // 무너집니다. 갇힌 곳은 애초에 없던 셈 치는 편이 낫습니다.
    sealUnreachable(map, playerStart);

    // 출구를 놓은 뒤에 메웁니다. 출구는 벽이라, 그 칸을 지나야만 갈 수 있던
    // 곳이 출구를 놓는 순간 끊깁니다. 먼저 메우면 그 부분이 남습니다.

    return { map, objectMap, playerStart, layout: layoutId, vaults };
}

/**
 * 레이아웃 키에 맞는 그리기 함수를 부릅니다.
 * @param {number[][]} map - 벽으로 찬 맵
 * @param {string} layoutId - 레이아웃 키
 * @returns {object[]} 설 만한 자리 목록
 */
function buildLayout(map, layoutId) {
    switch (layoutId) {
        case 'roguey': return buildRoguey(map);
        case 'miscCorridors': return buildCorridors(map);
        case 'regularCity': return buildCity(map);
        case 'caves': return buildCaves(map);
        case 'diamondMine': return buildNarrowCaves(map);
        case 'subdivisions':
        case 'jigsaw': return buildDivisions(map);
        case 'bigOctagon': return buildOpen(map, 'octagon');
        case 'cross': return buildOpen(map, 'cross');
        case 'forbiddenDonut': return buildOpen(map, 'donut');
        default: return buildRooms(map);
    }
}

// --- 반드시 지켜져야 하는 것들 ------------------------------------------------

/**
 * 시작 지점에서 걸어갈 수 있는 칸을 모두 표시합니다.
 * @param {number[][]} map - 맵
 * @param {{x: number, y: number}} from - 시작 지점
 * @returns {boolean[][]} 갈 수 있으면 true
 */
function reachableFrom(map, from) {
    const height = map.length, width = map[0].length;
    const seen = Array.from({ length: height }, () => Array(width).fill(false));
    const queue = [from];
    seen[from.y][from.x] = true;

    for (let head = 0; head < queue.length; head++) {
        const { x, y } = queue[head];
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
            if (seen[ny][nx] || tileAt(map, nx, ny).solid) continue;
            seen[ny][nx] = true;
            queue.push({ x: nx, y: ny });
        }
    }
    return seen;
}

/**
 * 따로 떨어진 구역을 시작 지점 쪽으로 이어 줍니다.
 *
 * 동굴이나 도시는 파내는 방식 자체가 연결을 보장하지 않습니다. 그대로 두면 적이나
 * 아이템이 갈 수 없는 곳에 놓여, 층을 다 뒤져도 찾지 못하는 일이 생깁니다.
 * @param {number[][]} map - 맵
 * @param {{x: number, y: number}} playerStart - 시작 지점
 * @param {object[]} spots - 설 만한 자리 목록
 */
function ensureConnected(map, playerStart, spots) {
    // 최대 여덟 번까지만 시도합니다. 그 이상 걸리는 맵은 어차피 성한 맵이 아닙니다.
    for (let pass = 0; pass < 8; pass++) {
        const reachable = reachableFrom(map, playerStart);
        const stranded = spots.find(spot => {
            const center = clampToFloor(map, centerOf(spot));
            return !reachable[center.y][center.x];
        });
        if (!stranded) return true;

        joinTheDots(map, playerStart, clampToFloor(map, centerOf(stranded)));
    }

    // 여덟 번을 뚫고도 못 이었습니다. 부르는 쪽이 판단하게 알립니다.
    return false;
}

/**
 * 찍어 넣은 볼트 자리를 도로 트인 바닥으로 되돌립니다.
 *
 * 볼트가 층을 두 동강 냈을 때 씁니다. 볼트 없는 평범한 층이
 * 갈 수 없는 구역이 있는 층보다 낫습니다.
 * @param {number[][]} map - 층
 * @param {object} vault - 놓인 볼트의 기록
 */
/**
 * 시작 지점에서 갈 수 없는 바닥을 벽으로 메웁니다.
 *
 * 뚫어서 잇는 방법도 있지만 원래 없던 통로가 생겨 레이아웃의 모양이 무너집니다.
 * 갇힌 곳은 애초에 없던 셈 치는 편이 낫습니다.
 * @param {number[][]} map - 층 (제자리에서 고쳐집니다)
 * @param {{x: number, y: number}} playerStart - 시작 지점
 * @returns {number} 메운 칸 수
 */
function sealUnreachable(map, playerStart) {
    const reachable = reachableFrom(map, playerStart);
    let sealed = 0;

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (reachable[y][x] || tileAt(map, x, y).solid) continue;
            map[y][x] = TILE_IDS.WALL;
            sealed++;
        }
    }

    return sealed;
}

function carveOut(map, vault) {
    for (let y = vault.top; y < vault.top + vault.height; y++) {
        for (let x = vault.left; x < vault.left + vault.width; x++) {
            if (map[y]?.[x] !== undefined) map[y][x] = TILE_IDS.FLOOR;
        }
    }
}

/**
 * 좌표가 벽이면 가장 가까운 바닥으로 옮깁니다.
 *
 * 도시나 트인 층에서는 '방의 한가운데'가 벽 속일 수 있습니다.
 * @param {number[][]} map - 맵
 * @param {{x: number, y: number}} point - 옮길 좌표
 * @returns {{x: number, y: number}} 바닥인 좌표
 */
function clampToFloor(map, point) {
    const height = map.length, width = map[0].length;
    const x = Math.max(1, Math.min(width - 2, point.x));
    const y = Math.max(1, Math.min(height - 2, point.y));
    if (!tileAt(map, x, y).solid) return { x, y };

    // 나선형으로 넓혀 가며 가장 가까운 바닥을 찾습니다.
    for (let radius = 1; radius < Math.max(width, height); radius++) {
        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx, ny = y + dy;
                if (nx < 1 || ny < 1 || nx >= width - 1 || ny >= height - 1) continue;
                if (!tileAt(map, nx, ny).solid) return { x: nx, y: ny };
            }
        }
    }
    // 바닥이 하나도 없으면 그 자리를 파냅니다.
    map[y][x] = TILE_IDS.FLOOR;
    return { x, y };
}

/**
 * 출구를 놓을 자리를 고릅니다.
 *
 * 걸어갈 수 있는 칸 중에서 시작 지점으로부터 가장 먼 곳입니다.
 * 가까운 데 두면 층을 둘러보지 않고 곧바로 내려가게 됩니다.
 * @param {number[][]} map - 맵
 * @param {{x: number, y: number}} playerStart - 시작 지점
 * @returns {{x: number, y: number}} 출구 자리
 */
function pickExit(map, playerStart) {
    const reachable = reachableFrom(map, playerStart);
    let best = playerStart, bestDistance = -1;

    for (let y = 1; y < map.length - 1; y++) {
        for (let x = 1; x < map[0].length - 1; x++) {
            if (!reachable[y][x]) continue;
            const distance = Math.hypot(x - playerStart.x, y - playerStart.y);
            if (distance > bestDistance) { bestDistance = distance; best = { x, y }; }
        }
    }
    return best;
}

/**
 * 복도 한가운데에 문을 놓습니다.
 *
 * 양옆이 벽인 폭 1의 자리만 문이 될 수 있습니다. 트인 층이나 동굴에는 그런 자리가
 * 거의 없어 문도 거의 생기지 않는데, 원본에서도 마찬가지입니다.
 * @param {number[][]} map - 맵
 * @param {number[][]} objectMap - 오브젝트 맵
 */
function placeDoors(map, objectMap) {
    const height = map.length, width = map[0].length;
    const DOOR_CHANCE = 0.06;

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if (map[y][x] !== TILE_IDS.FLOOR) continue;
            if (Math.random() > DOOR_CHANCE) continue;

            const verticalWalls = map[y - 1][x] === TILE_IDS.WALL && map[y + 1][x] === TILE_IDS.WALL;
            const horizontalWalls = map[y][x - 1] === TILE_IDS.WALL && map[y][x + 1] === TILE_IDS.WALL;
            // 한쪽 축만 벽이어야 통로입니다. 양쪽 다 벽이면 막다른 칸입니다.
            if (verticalWalls === horizontalWalls) continue;

            map[y][x] = TILE_IDS.DOOR;
            objectMap[y][x] = 1;
        }
    }
}

/**
 * 무엇을 해도 층이 만들어지지 않을 때 쓰는 비상용 맵입니다.
 * @param {number} width - 맵 너비
 * @param {number} height - 맵 높이
 * @returns {object} 만들어진 층
 */
function createFallbackDungeon(width, height) {
    console.warn('층을 만들지 못해 비상용 맵을 씁니다.');
    const map = Array.from({ length: height }, () => Array(width).fill(TILE_IDS.WALL));
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) map[y][x] = TILE_IDS.FLOOR;
    }

    const playerStart = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
    map[height - 2][width - 2] = TILE_IDS.EXIT;
    const objectMap = Array.from({ length: height }, () => Array(width).fill(0));
    return { map, objectMap, playerStart, layout: 'fallback' };
}

/** @returns {string[]} 쓸 수 있는 레이아웃 키 목록. 미리보기와 테스트가 씁니다. */
export function allLayouts() {
    return Object.keys(LAYOUTS);
}

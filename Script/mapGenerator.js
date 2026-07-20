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
import { placeMinivaults, rollFloorVault, stampFloorVault } from './vaults.js';
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

    // 손으로 그린 판이 통째로 나오는 층.
    //
    // 원본에서는 이런 볼트가 뽑히면 절차 생성을 아예 건너뜁니다. 층이 곧 볼트입니다.
    // 하수구나 납골당처럼 그 자체로 자족적인 판이라, 들어가는 순간
    // '여긴 만들어진 곳이구나' 가 분명히 읽힙니다.
    if (Math.random() < FLOOR_VAULT_CHANCE) {
        const built = buildFromFloorVault(map, objectMap);
        if (built) return built;
    }

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


if(globalThis.__DBG) console.log("  전 63,20 =", map[20]?.[63], "볼트", JSON.stringify(vaults.map(v=>[v.left,v.top,v.width,v.height])));
    placeDoors(map, objectMap, playerStart, vaults);
if(globalThis.__DBG) console.log("  후 63,20 =", map[20]?.[63]);

    // 볼트가 계단 글리프를 그려 두었으면 그것을 씁니다.
    //
    // 볼트에는 내려가는 계단이 여럿일 수 있습니다. 원본은 층마다 셋을 두지만
    // 이 게임은 하나입니다. 그대로 두면 층에 출구가 둘이 되어,
    // 어느 쪽이 진짜인지 알 수 없게 됩니다.
    let exit = null;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] !== TILE_IDS.EXIT) continue;
            if (exit) map[y][x] = TILE_IDS.FLOOR;
            else exit = { x, y };
        }
    }

    if (!exit) {
        exit = pickExit(map, playerStart);
        map[exit.y][exit.x] = TILE_IDS.EXIT;
    }

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
function placeDoors(map, objectMap, playerStart, vaults = []) {
    // 볼트 안에는 문을 놓지 않습니다.
    //
    // 볼트는 손으로 그린 방입니다. 그 위에 문을 얹으면 설계가 무너집니다.
    // 실제로 볼트가 '여기 몬스터가 선다' 고 정해 둔 칸을 문이 덮어,
    // 문을 열 줄 모르는 짐승이 닫힌 문 안에 갇혀 있었습니다.
    // 원본도 볼트를 이런 후처리로부터 보호합니다. (no_wall_fixup 등)
    const inVault = (x, y) => vaults.some(v =>
        x >= v.left && x < v.left + v.width && y >= v.top && y < v.top + v.height);

    const height = map.length, width = map[0].length;
    const DOOR_CHANCE = 0.05;

    // 복도가 좁던 시절에는 '한쪽 축만 벽인 칸'이 곧 통로였습니다.
    // 복도를 세 칸으로 넓히자 그런 칸이 사라져 문이 층당 두 개로 줄었습니다.
    // 이제는 통로의 목을 찾아 그 폭 전체를 문으로 막습니다.
    // 원본에도 여러 칸짜리 문(gate)이 있고, 넓은 복도에는 그쪽이 맞습니다.
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if (map[y][x] !== TILE_IDS.FLOOR) continue;
            if (inVault(x, y)) continue;
            if (Math.random() > DOOR_CHANCE) continue;

            // 가로로 목이 잡히는가. 즉 좌우가 벽으로 끊긴 짧은 구간인가.
            const across = runAt(map, x, y, 1, 0);
            const along = runAt(map, x, y, 0, 1);

            // 지나가는 방향으로는 길게 뻗어 있고, 가로지르는 방향으로는 짧아야
            // 통로입니다. 방 한가운데는 양쪽 다 길고, 막다른 칸은 양쪽 다 짧습니다.
            if (across.length > MAX_GATE_WIDTH || along.length <= across.length) continue;

            // 시작 지점을 막으면 문 속에서 시작합니다.
            const coversStart = playerStart && playerStart.y === y
                && playerStart.x >= across.start && playerStart.x < across.start + across.length;
            if (coversStart) continue;

            // 관문은 여러 칸을 한 번에 칠합니다. 시작 칸만 보고 지나가면
            // 볼트 밖에서 시작한 관문이 볼트 안까지 칠해 설계를 덮습니다.
            // 실제로 오두막 볼트의 식물 자리가 그렇게 문이 되어 있었습니다.
            const reachesVault = Array.from({ length: across.length })
                .some((_, d) => inVault(across.start + d, y));
            if (reachesVault) continue;

            for (let d = 0; d < across.length; d++) {
                map[y][across.start + d] = TILE_IDS.DOOR;
                objectMap[y][across.start + d] = 1;
            }
        }
    }
}

/** @description 문으로 막을 수 있는 최대 통로 폭(타일). 이보다 넓으면 방입니다. */
const MAX_GATE_WIDTH = 4;

/**
 * 한 칸에서 어느 방향으로 바닥이 몇 칸 이어지는지 잽니다.
 * @param {number[][]} map - 층
 * @param {number} x - 타일 X
 * @param {number} y - 타일 Y
 * @param {number} dx - 재는 방향
 * @param {number} dy - 재는 방향
 * @returns {{start: number, length: number}} 시작 좌표와 길이
 */
function runAt(map, x, y, dx, dy) {
    let back = 0;
    while (!tileAt(map, x - dx * (back + 1), y - dy * (back + 1)).solid) back++;

    let forward = 0;
    while (!tileAt(map, x + dx * (forward + 1), y + dy * (forward + 1)).solid) forward++;

    return {
        start: dx ? x - back : y - back,
        length: back + forward + 1,
    };
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

/**
 * @description 층이 통째로 손으로 그린 판일 확률.
 *
 * 흔하면 안 됩니다. 손으로 그린 판은 두 번째 만나는 순간 외운 판이 되므로,
 * 가끔 나와야 그 층이 특별해집니다. 원본의 포탈 던전도 드물게 나타납니다.
 */
const FLOOR_VAULT_CHANCE = 0.12;

/**
 * 층 볼트 하나를 통째로 찍어 층을 만듭니다.
 *
 * 절차 생성을 아예 건너뜁니다. 이것이 층 자체이기 때문입니다.
 * 다만 지켜야 할 것은 같습니다. 시작 지점과 출구가 있어야 하고,
 * 그 사이를 걸어갈 수 있어야 합니다. 볼트가 그것을 갖추지 못했으면
 * 절차 생성으로 되돌립니다. 갈 수 없는 층보다 평범한 층이 낫습니다.
 * @param {number[][]} map - 벽으로 찬 맵
 * @param {number[][]} objectMap - 오브젝트 격자
 * @returns {object|null} 만들어진 층. 쓸 수 없으면 null
 */
function buildFromFloorVault(map, objectMap) {
    const vault = rollFloorVault();
    if (!vault) return null;

    const placed = stampFloorVault(map, vault);

    // 설 자리를 찾습니다. 볼트가 @ 로 입구를 적어 두었어도 이 게임에는
    // 그 개념이 없어, 바닥 중 아무 데나 골라 거기서 시작합니다.
    const start = findOpenTile(map, placed);
    if (!start) return null;

    // 출구는 볼트가 계단으로 적어 둔 자리를 씁니다. 없으면 가장 먼 바닥입니다.
    // 볼트에는 계단이 여럿일 수 있습니다. 원본은 층마다 내려가는 계단을 셋 두지만
    // 이 게임은 하나입니다. 첫 번째만 남기고 나머지는 바닥으로 되돌립니다.
    let exit = null;
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] !== TILE_IDS.EXIT) continue;
            if (exit) map[y][x] = TILE_IDS.FLOOR;
            else exit = { x, y };
        }
    }

    if (!exit) {
        exit = pickExit(map, start);
        map[exit.y][exit.x] = TILE_IDS.EXIT;
    }

    // 갇힌 바닥을 메우고, 출구까지 갈 수 있는지 확인합니다.
    sealUnreachable(map, start);
    const reachable = reachableFrom(map, start);
    const exitReachable = [[1, 0], [-1, 0], [0, 1], [0, -1]]
        .some(([dx, dy]) => reachable[exit.y + dy]?.[exit.x + dx]);
    if (!exitReachable) return null;

    return {
        map, objectMap, playerStart: start,
        layout: `vault:${vault.name}`,
        vaults: [placed],
    };
}

/**
 * 볼트 안에서 설 만한 바닥을 하나 찾습니다.
 * @param {number[][]} map - 층
 * @param {object} placed - 찍힌 볼트의 기록
 * @returns {{x: number, y: number}|null} 찾은 자리
 */
function findOpenTile(map, placed) {
    const spots = [];
    for (let y = placed.top; y < placed.top + placed.height; y++) {
        for (let x = placed.left; x < placed.left + placed.width; x++) {
            if (map[y]?.[x] === undefined) continue;
            // 맨바닥이어야 합니다. 얕은 물 위에서 시작하면 물에 선 채로
            // 판이 열리고, 하수구 볼트는 물이 많아 실제로 자주 그렇게 됩니다.
            if (map[y][x] !== TILE_IDS.FLOOR) continue;
            spots.push({ x, y });
        }
    }
    if (spots.length === 0) return null;
    return spots[Math.floor(Math.random() * spots.length)];
}

/**
 * 맵에서 그 타일을 처음 찾습니다.
 * @param {number[][]} map - 층
 * @param {number} tileId - 찾을 타일
 * @returns {{x: number, y: number}|null} 자리
 */
function findTile(map, tileId) {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === tileId) return { x, y };
        }
    }
    return null;
}

/**
 * @fileoverview 손으로 그린 방(볼트)을 절차 생성된 층에 찍어 넣습니다.
 *
 * 무작위로 만든 방만 이어 붙이면 아무리 다양해도 결국 다 비슷해 보입니다.
 * 볼트 하나가 들어가는 순간 그 층은 기억에 남는 곳이 됩니다.
 * 유리 기둥이 늘어선 방을 지나가 본 사람은 그 층을 기억합니다.
 *
 * 원본의 규칙 중 이 게임에 그대로 옮긴 것이 하나 있습니다.
 * 미니볼트는 반드시 이미 만들어진 바닥과 한 칸 이상 겹치게 놓습니다.
 * 겹치지 않으면 벽 속에 갇힌 방이 되어 영영 갈 수 없게 되고,
 * 그렇다고 통로를 파 주면 '나중에 뚫은 티'가 납니다.
 * 겹쳐 놓으면 원래 그 층의 일부였던 것처럼 보입니다.
 *
 * 출처: crawl-ref/source/dungeon.cc (_place_minivaults), docs/develop/levels/
 */

import { VAULTS } from './data/vaults.js';
import { TILE_IDS, tileAt, MAP_WIDTH, MAP_HEIGHT } from './constants.js';
import { random2 } from './dcss/random.js';

/**
 * @description 볼트 글리프를 이 게임의 타일로 잇는 표.
 *
 * 원본 글리프를 그대로 쓰기로 했으므로 이름만 바꿔 줍니다.
 * OUTSIDE 는 볼트에 속하지 않는 칸이라 아래 지형을 건드리지 않습니다.
 */
const TILE_BY_GLYPH = {
    FLOOR: TILE_IDS.FLOOR,
    WALL: TILE_IDS.WALL,
    GLASS: TILE_IDS.GLASS,
    STATUE: TILE_IDS.STATUE,
    FOUNTAIN: TILE_IDS.FLOOR,   // 샘은 아직 없습니다. 바닥으로 둡니다
    DEEP_WATER: TILE_IDS.DEEP_WATER,
    SHALLOW_WATER: TILE_IDS.SHALLOW_WATER,
    LAVA: TILE_IDS.LAVA,
    TREE: TILE_IDS.TREE,
    DOOR: TILE_IDS.DOOR,

    // 몬스터 자리는 바닥입니다. 무엇이 서는지는 stamp 가 따로 봅니다.
    MONSTER_ANY: TILE_IDS.FLOOR,
    MONSTER_TOUGH: TILE_IDS.FLOOR,
    MONSTER_TOUGHER: TILE_IDS.FLOOR,
    MONSTER_SLOT: TILE_IDS.FLOOR,
    GRATE: TILE_IDS.GRATE,

    // 압력판은 밟을 수 있어야 하므로 바닥입니다.
    TRIGGER_PLATE: TILE_IDS.FLOOR,
    // 열릴 벽은 처음에는 벽입니다. 기믹이 터질 때 바닥이 됩니다.
    SEALED_WALL: TILE_IDS.WALL,
    OUTSIDE: null,
};

/** @description 원본 글리프 → 위 이름. import-vaults.js 의 표와 같아야 합니다. */
const GLYPH_NAMES = {
    '.': 'FLOOR', 'x': 'WALL', 'X': 'WALL', 'c': 'WALL', 'v': 'WALL', 'b': 'WALL',
    'm': 'GLASS', 'n': 'GLASS', 'o': 'GLASS',
    'G': 'STATUE', 'I': 'STATUE',
    'T': 'FOUNTAIN', 'U': 'FOUNTAIN', 'V': 'FOUNTAIN',
    'w': 'DEEP_WATER', 'W': 'SHALLOW_WATER', 'l': 'LAVA', 't': 'TREE',
    '+': 'DOOR', '=': 'DOOR',

    // 몬스터가 설 자리. 바닥으로 찍고 그 위에 몬스터를 놓습니다.
    '0': 'MONSTER_ANY', '9': 'MONSTER_TOUGH', '8': 'MONSTER_TOUGHER',
    '1': 'MONSTER_SLOT', '2': 'MONSTER_SLOT', '3': 'MONSTER_SLOT',
    '4': 'MONSTER_SLOT', '5': 'MONSTER_SLOT', '6': 'MONSTER_SLOT',
    '7': 'MONSTER_SLOT',


    // 기믹 자리. 밟으면 무슨 일이 일어나는 칸과, 그때 바뀔 칸입니다.
    '^': 'TRIGGER_PLATE',   // 압력판
    'z': 'SEALED_WALL',     // 열릴 벽. 기믹이 터지면 바닥이 됩니다

    ' ': 'OUTSIDE',
};

/**
 * @description 깊이에 맡기라는 표시. 실제 몬스터는 부르는 쪽이 뽑습니다.
 *
 * 볼트는 어느 층에 찍힐지 모르므로 여기서 종을 정할 수 없습니다.
 * '이 자리에 이 깊이에 맞는 것을 하나' 라는 뜻만 남깁니다.
 */
export const ROLL_FOR_DEPTH = '@depth';
export const ROLL_FOR_DEPTH_TOUGH = '@depth+5';
export const ROLL_FOR_DEPTH_TOUGHER = '@depth*2';

/** @description 한 층에 찍어 볼 볼트의 수. 원본도 무작위 미니볼트는 하나입니다. */
const VAULTS_PER_FLOOR = 1;

/** @description 자리를 찾는 시도 횟수. 못 찾으면 그냥 넘어갑니다. */
const PLACEMENT_TRIES = 60;

/**
 * 가중치에 따라 볼트 하나를 고릅니다.
 *
 * 원본의 저수지 표집을 그대로 씁니다. (maps.cc:1162)
 * @param {Array<object>} candidates - 후보들
 * @returns {object|null} 고른 볼트
 */
function pickVault(candidates) {
    let total = 0;
    let chosen = null;

    for (const vault of candidates) {
        const weight = vault.weight ?? 10;
        if (weight <= 0) continue;
        total += weight;
        if (random2(total) < weight) chosen = vault;
    }

    return chosen;
}

/**
 * SUBST 규칙을 적용해 글리프 격자를 확정합니다.
 *
 * `?  = TUV` 는 칸마다 따로 굴리고, `? : TUV` 는 볼트 전체가 같은 것이 됩니다.
 * 이 한 가지 지시자만으로도 같은 볼트가 판마다 다르게 보입니다.
 * @param {Array<Array<string>>} grid - 글리프 격자
 * @param {Array<object>} substitutions - 규칙들
 * @returns {Array<Array<string>>} 확정된 글리프 격자
 */
/** @description 기믹 자리를 나타내는 글리프. 치환이 지우지 못하게 지킵니다. */
const TRIGGER_GLYPHS = new Set(['^', 'z']);

function applySubstitutions(grid, substitutions) {

    for (const rule of substitutions) {
        // 기믹 표식을 지우는 치환은 건너뜁니다.
        //
        // 원본에서 z 는 '여기가 열릴 벽이다' 를 루아 마커에게 알려 주는 표식이고,
        // 마커가 자리를 기억한 뒤 SUBST 로 벽으로 되돌립니다. 루아가 없는 여기서는
        // 그 되돌리기를 그대로 따르면 자리를 기억할 새도 없이 사라집니다.
        // 대신 표식을 남겨 두고, 찍을 때 벽으로 놓으면서 자리를 적습니다.
        if (TRIGGER_GLYPHS.has(rule.from)) continue;

        // 전체가 같은 것으로 바뀌는 규칙은 한 번만 굴립니다.
        const fixed = rule.once ? weightedChoice(rule.choices) : null;

        for (const row of grid) {
            for (let x = 0; x < row.length; x++) {
                if (row[x] !== rule.from) continue;
                row[x] = fixed ?? weightedChoice(rule.choices);
            }
        }
    }

    return grid;
}

/**
 * 볼트의 무작위 지시자를 모두 적용해 글리프 격자를 확정합니다.
 *
 * 원본은 SUBST/NSUBST/SHUFFLE 을 파일에 적힌 순서대로 적용합니다.
 * 여기서는 종류별로 묶어 돌립니다. 한 볼트가 세 가지를 뒤섞어 쓰는 일이
 * 드물어 지금까지는 차이가 없었지만, 그런 볼트가 들어오면 어긋납니다.
 * 그때가 되면 줄 번호를 함께 담아 순서를 지켜야 합니다.
 * @param {object} vault - 볼트 정의
 * @returns {Array<Array<string>>} 확정된 글리프 격자
 */
function randomiseVault(vault) {
    let grid = vault.rows.map(row => [...row]);

    grid = applyShuffles(grid, vault.shuffle ?? []);
    grid = applyNsubst(grid, vault.nsubst ?? []);
    grid = applySubstitutions(grid, vault.subst ?? []);

    return grid;
}

/**
 * 글리프를 서로 뒤섞습니다.
 *
 * `ABC` 는 세 글리프의 뜻이 판마다 자리를 바꾼다는 뜻입니다. 방 셋의 내용물이
 * 돌아가므로, 한 번 본 볼트라도 어느 방에 무엇이 있는지는 다시 봐야 합니다.
 * @param {Array<Array<string>>} grid - 글리프 격자
 * @param {Array<object>} rules - 규칙들
 * @returns {Array<Array<string>>} 바뀐 격자
 */
function applyShuffles(grid, rules) {
    for (const rule of rules) {
        if (rule.kind === 'permute') {
            const shuffled = shuffleCopy(rule.glyphs);
            const mapping = {};
            rule.glyphs.forEach((from, i) => { mapping[from] = shuffled[i]; });
            grid = remap(grid, mapping);
            continue;
        }

        // 덩어리째 맞바꿉니다. 첫 덩어리의 자리에 뽑힌 덩어리가 들어갑니다.
        const chosen = rule.blocks[random2(rule.blocks.length)];
        const mapping = {};
        rule.blocks[0].forEach((from, i) => { mapping[from] = chosen[i]; });
        grid = remap(grid, mapping);
    }

    return grid;
}

/**
 * 정해진 개수만큼만 바꿉니다.
 *
 * SUBST 는 칸마다 확률을 굴려 개수가 들쭉날쭉합니다. NSUBST 는 개수를 고정합니다.
 * 문 하나, 계단 하나, 보물 셋처럼 수가 중요한 것들이 이걸 씁니다.
 * 이 지시자가 없으면 그런 볼트는 판마다 문이 없거나 셋이 되어 못 씁니다.
 * @param {Array<Array<string>>} grid - 글리프 격자
 * @param {Array<object>} rules - 규칙들
 * @returns {Array<Array<string>>} 바뀐 격자
 */
function applyNsubst(grid, rules) {
    for (const rule of rules) {
        // 그 글리프가 있는 자리를 모아 섞습니다. 어느 자리가 뽑힐지가 무작위입니다.
        const spots = [];
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === rule.from) spots.push({ x, y });
            }
        }
        const order = shuffleCopy(spots);

        let taken = 0;
        for (const spec of rule.specs) {
            // 'rest' 는 나머지 전부입니다. Infinity 를 JSON 에 담을 수 없어
            // 임포터가 문자열로 표시해 둡니다.
            const wanted = spec.count === 'rest' ? order.length - taken : spec.count;
            // 한 번만 굴려 그 몫 전체에 같은 것을 넣을지, 자리마다 따로 굴릴지.
            const fixed = spec.once ? spec.glyphs[random2(spec.glyphs.length)] : null;

            for (let n = 0; n < wanted && taken < order.length; n++, taken++) {
                const { x, y } = order[taken];
                grid[y][x] = fixed ?? spec.glyphs[random2(spec.glyphs.length)];
            }
        }
    }

    return grid;
}

/**
 * 글리프를 표대로 한꺼번에 바꿉니다.
 * @param {Array<Array<string>>} grid - 글리프 격자
 * @param {object} mapping - 바꿀 표
 * @returns {Array<Array<string>>} 바뀐 격자
 */
function remap(grid, mapping) {
    return grid.map(row => row.map(glyph => mapping[glyph] ?? glyph));
}

/**
 * 배열을 섞은 사본을 돌려줍니다. (피셔-예이츠)
 * @param {Array} list - 원본
 * @returns {Array} 섞인 사본
 */
function shuffleCopy(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const k = random2(i + 1);
        [copy[i], copy[k]] = [copy[k], copy[i]];
    }
    return copy;
}

/**
 * 가중치가 붙은 선택지에서 하나를 고릅니다.
 * @param {Array<{glyph: string, weight: number}>} choices - 선택지
 * @returns {string} 고른 글리프
 */
function weightedChoice(choices) {
    let total = 0;
    let chosen = choices[0].glyph;

    for (const choice of choices) {
        total += choice.weight;
        if (random2(total) < choice.weight) chosen = choice.glyph;
    }

    return chosen;
}

/**
 * 이 자리에 볼트를 놓을 수 있는지 봅니다.
 *
 * 두 가지를 봅니다. 맵 안에 들어가는가, 그리고 이미 있는 바닥과 겹치는가.
 * 겹침을 요구하는 것이 핵심입니다. 겹치지 않으면 벽 속에 갇힌 방이 되어
 * 영영 갈 수 없게 됩니다. (dungeon.cc 의 미니볼트 배치 규칙)
 * @param {Array<Array<number>>} map - 층
 * @param {Array<Array<string>>} grid - 글리프 격자
 * @param {number} left - 왼쪽 타일 좌표
 * @param {number} top - 위쪽 타일 좌표
 * @returns {boolean} 놓을 수 있으면 true
 */
function fitsAt(map, grid, left, top, keepClear) {
    let touchesFloor = false;

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const name = GLYPH_NAMES[grid[y][x]];
            if (name === 'OUTSIDE') continue;

            const mapX = left + x;
            const mapY = top + y;

            // 가장자리는 남겨 둡니다. 바깥 벽을 뚫으면 맵 밖으로 나갈 수 있습니다.
            if (mapX <= 0 || mapY <= 0 || mapY >= map.length - 1 || mapX >= map[mapY].length - 1) {
                return false;
            }

            // 시작 지점을 덮으면 안 됩니다. 벽 속에서 시작하게 됩니다.
            if (keepClear && mapX === keepClear.x && mapY === keepClear.y) return false;

            if (!tileAt(map, mapX, mapY).solid) touchesFloor = true;
        }
    }

    return touchesFloor;
}

/**
 * 볼트를 층에 찍습니다.
 * @param {Array<Array<number>>} map - 층
 * @param {Array<Array<string>>} grid - 글리프 격자
 * @param {number} left - 왼쪽 타일 좌표
 * @param {number} top - 위쪽 타일 좌표
 */
function stamp(map, grid, left, top, vault) {
    const spawns = [];
    const plates = [];
    const sealed = [];

    // 볼트가 그 칸에 쓸 그림을 지정했으면 적어 둡니다.
    // 렌더러가 이것을 보고 보통 벽 대신 지정된 그림을 그립니다.
    const tileOverrides = [];

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const glyph = grid[y][x];

            // KFEAT 이 정한 글리프는 볼트마다 뜻이 다릅니다. 표준 legend 보다 우선합니다.
            //
            // 이름을 먼저 정하고 나머지를 한 갈래로 처리합니다. 예전에는 KFEAT 을
            // 따로 처리하고 곧바로 넘어가서, KFEAT 으로 놓인 압력판이 기믹 자리로
            // 수집되지 않았습니다. 쥐덫 볼트가 찍혀도 아무 일도 일어나지 않았습니다.
            const kfeat = vault.kfeat?.[glyph];
            const name = kfeat ? kfeat[random2(kfeat.length)] : GLYPH_NAMES[glyph];

            const tile = TILE_BY_GLYPH[name];
            if (tile === null || tile === undefined) continue;   // 볼트 밖입니다
            map[top + y][left + x] = tile;

            const monsterId = monsterFor(glyph, name, vault);
            if (monsterId) spawns.push({ id: monsterId, tileX: left + x, tileY: top + y });

            if (name === 'TRIGGER_PLATE') plates.push({ tileX: left + x, tileY: top + y });
            if (name === 'SEALED_WALL') sealed.push({ tileX: left + x, tileY: top + y });

            const override = vault.tiles?.[glyph];
            if (override) {
                // 후보가 여럿이면 하나를 뽑습니다. 원본도 그렇게 합니다.
                tileOverrides.push({
                    tileX: left + x, tileY: top + y,
                    tile: pickName(override.tile),
                    floor: pickName(override.floor),
                });
            }
        }
    }

    return { spawns, plates, sealed, tileOverrides };
}

/**
 * 후보 중 하나를 뽑습니다.
 * @param {Array<string>|undefined} names - 그림 이름들
 * @returns {string|null} 뽑힌 이름
 */
function pickName(names) {
    if (!names?.length) return null;
    return names[random2(names.length)];
}

/**
 * 이 글리프에 어떤 몬스터가 서는지 정합니다.
 *
 * 1~7 은 볼트의 MONS 슬롯을 가리킵니다. 한 슬롯에 여러 후보가 있으면 그중
 * 하나를 뽑습니다. 0/8/9 는 깊이에 맞는 아무거나인데, 어느 깊이에서 뽑을지는
 * 부르는 쪽이 정합니다. 여기서는 표시만 남깁니다.
 * @param {string} glyph - 원본 글리프
 * @param {string} name - 옮긴 이름
 * @param {object} vault - 볼트 정의
 * @returns {string|null} 몬스터 식별자, 또는 깊이에 맡길 때의 표시
 */
function monsterFor(glyph, name, vault) {
    if (name === 'MONSTER_SLOT') {
        const slot = vault.mons?.[Number(glyph) - 1];
        if (!slot || slot.length === 0) return null;
        return slot[random2(slot.length)];
    }
    if (name === 'MONSTER_ANY') return ROLL_FOR_DEPTH;
    if (name === 'MONSTER_TOUGH') return ROLL_FOR_DEPTH_TOUGH;
    if (name === 'MONSTER_TOUGHER') return ROLL_FOR_DEPTH_TOUGHER;
    return null;
}

/**
 * 절차 생성된 층에 미니볼트를 찍어 넣습니다.
 *
 * 자리를 못 찾으면 조용히 넘어갑니다. 볼트가 없는 층은 그냥 평범한 층이지만,
 * 억지로 밀어 넣은 볼트는 갈 수 없는 방이 되거나 층을 두 동강 냅니다.
 * @param {Array<Array<number>>} map - 층 (제자리에서 고쳐집니다)
 * @param {object} [options] - 선택 사항
 * @param {number} [options.count] - 찍어 볼 볼트 수
 * @param {{x: number, y: number}} [options.keepClear] - 덮으면 안 되는 자리 (시작 지점)
 * @returns {Array<object>} 실제로 놓인 볼트들의 기록
 */
export function placeMinivaults(map, options = {}) {
    const count = options.count ?? VAULTS_PER_FLOOR;
    const placed = [];

    const height = map.length;
    const width = map[0]?.length ?? 0;

    for (let n = 0; n < count; n++) {
        const usable = VAULTS.filter(v => v.rows.length < height - 2
            && v.rows[0].length < width - 2);
        const vault = pickVault(usable);
        if (!vault) break;

        const grid = randomiseVault(vault);
        const vaultHeight = grid.length;
        const vaultWidth = grid[0].length;

        for (let tries = 0; tries < PLACEMENT_TRIES; tries++) {
            const left = 1 + random2(width - vaultWidth - 2);
            const top = 1 + random2(height - vaultHeight - 2);

            if (!fitsAt(map, grid, left, top, options.keepClear)) continue;

            const stamped = stamp(map, grid, left, top, vault);
            placed.push({
                name: vault.name, left, top,
                width: vaultWidth, height: vaultHeight,
                ...stamped,
            });
            break;
        }
    }

    return placed;
}

/**
 * 가져온 볼트의 수를 알려줍니다. 도구와 검사가 씁니다.
 * @returns {number} 볼트 수
 */
export function vaultCount() {
    return VAULTS.length;
}

/**
 * 층 전체를 정의하는 볼트 하나를 고릅니다.
 *
 * 원본에서는 이런 볼트가 뽑히면 절차 생성을 아예 건너뜁니다. 층이 곧 볼트입니다.
 * 흔하면 안 됩니다. 손으로 그린 판은 두 번째 만나는 순간 외운 판이 되므로,
 * 가끔 나와야 그 층이 특별해집니다.
 * @returns {object|null} 고른 볼트. 없으면 null
 */
export function rollFloorVault() {
    const candidates = VAULTS.filter(v => v.encompass
        && v.rows.length <= MAP_HEIGHT && v.rows[0].length <= MAP_WIDTH);
    return pickVault(candidates);
}

/**
 * 층 볼트를 맵에 통째로 찍습니다.
 *
 * 미니볼트와 달리 이미 있는 바닥과 겹칠 필요가 없습니다. 이것이 층 자체이므로
 * 맵을 벽으로 채운 뒤 한가운데에 놓습니다.
 * @param {Array<Array<number>>} map - 벽으로 찬 맵
 * @param {object} vault - 층 볼트
 * @returns {object} 찍은 결과
 */
export function stampFloorVault(map, vault) {
    const grid = randomiseVault(vault);
    const left = Math.floor((map[0].length - grid[0].length) / 2);
    const top = Math.floor((map.length - grid.length) / 2);

    const stamped = stamp(map, grid, left, top, vault);
    return { name: vault.name, left, top, width: grid[0].length, height: grid.length, ...stamped };
}

/**
 * 볼트를 정해진 자리에 찍습니다. 검사와 도구가 씁니다.
 *
 * 무작위 배치를 거치지 않으므로, 어떤 볼트가 제대로 찍히는지를
 * 뽑기 운에 기대지 않고 확인할 수 있습니다.
 * @param {Array<Array<number>>} map - 층
 * @param {object} vault - 볼트 정의
 * @param {number} left - 왼쪽 타일 좌표
 * @param {number} top - 위쪽 타일 좌표
 * @returns {object} 찍은 결과
 */
export function stampVaultAt(map, vault, left, top) {
    const grid = randomiseVault(vault);
    const stamped = stamp(map, grid, left, top, vault);
    return { name: vault.name, left, top, width: grid[0].length, height: grid.length, ...stamped };
}

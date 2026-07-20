/**
 * @fileoverview DCSS 원본 타일을 이름으로 찾아 시트 좌표를 알아냅니다.
 *
 *   npm run locate:tiles
 *
 * Data/tiles/ 의 시트는 DCSS가 여러 타일을 한 장으로 묶어 만든 것입니다.
 * 어느 좌표가 어떤 타일인지는 그림만 봐서는 알 수 없어, 처음에는 눈으로 골랐습니다.
 * 그 방식은 'hell 벽인 줄 알았던 것이 사실 황금 벽돌'이었던 것처럼 조용히 틀립니다.
 *
 * 이 도구는 crawl 저장소에서 이름이 붙은 원본 타일(dngn/wall/hell01.png 등)을 받아
 * 시트 안에서 픽셀이 완전히 일치하는 위치를 찾습니다. 좌표가 이름으로 확정되고,
 * 시트가 다른 버전으로 교체되면 일치하지 않아 즉시 드러납니다.
 *
 * 결과는 Data/tiles/tile-locations.json 에 저장되어 build-atlas.js 가 읽습니다.
 * 네트워크가 필요한 것은 이 도구뿐이고, 아틀라스 생성은 저장된 결과만 씁니다.
 */

import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readPng } from './png.js';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const TILES_DIR = projectRoot + 'Data/tiles/';
const CACHE_DIR = projectRoot + 'Data/tiles/.source-cache/';

/** @description 원본 타일을 받아올 곳 */
const SOURCE_BASE = 'https://raw.githubusercontent.com/crawl/crawl/master/crawl-ref/source/rltiles/';

/**
 * @description 찾아낼 타일들.
 *
 * 키는 게임에서 쓸 이름, 값은 crawl 저장소에서의 경로입니다.
 * 이름 뒤의 숫자는 같은 재질의 변형이며, 렌더러가 타일 좌표 해시로 섞어 씁니다.
 *
 * 값에 배열을 주면 앞에서부터 시도해 시트와 일치하는 첫 번째를 씁니다.
 * DCSS 는 몬스터 도트를 종종 다시 그리므로, 우리 시트의 버전에 없는 그림이 있습니다.
 * 그럴 때 비슷한 대안을 함께 적어 두면 시트를 갈아끼워도 계속 동작합니다.
 */
const WANTED = {
    // --- 벽: 던전 가지마다 원작의 벽을 씁니다 ---
    ...series('wall_main', 'dngn/wall/brick_dark_1_', 0, 6),
    ...series('wall_vault', 'dngn/wall/vault_stone', 0, 6, 2),
    ...series('wall_lair', 'dngn/wall/lair', 0, 6),
    ...series('wall_snake', 'dngn/wall/snake', 0, 6),
    ...series('wall_spider', 'dngn/wall/spider', 0, 6, 2),
    ...series('wall_crypt', 'dngn/wall/crypt', 0, 5),
    ...series('wall_orc', 'dngn/wall/orc', 0, 6),
    ...series('wall_hell', 'dngn/wall/hell', 1, 6, 2),
    ...series('wall_zot', 'dngn/wall/zot_stone_last', 0, 6, 2),
    ...series('wall_sandstone', 'dngn/wall/sandstone_wall', 0, 6),

    // --- 바닥 ---
    ...series('floor_main', 'dngn/floor/grey_dirt', 0, 6),
    ...series('floor_lair', 'dngn/floor/lair', 0, 6),
    // 사용자 시트의 crypt 바닥이 master 와 달라 픽셀이 일치하지 않습니다.
    // 언데드 던전에는 뼈가 깔린 바닥이 더 어울리기도 해 green_bones 를 씁니다.
    ...series('floor_bones', 'dngn/floor/green_bones', 1, 6, 2),
    ...series('floor_black', 'dngn/floor/black_cobalt', 1, 6, 2),
    ...series('floor_orc', 'dngn/floor/orc', 0, 6),
    ...series('floor_hell', 'dngn/floor/infernal', 1, 6, 2),
    ...series('floor_frozen', 'dngn/floor/frozen', 0, 6),
    ...series('floor_lava', 'dngn/floor/lava', 0, 6, 2),
    ...series('floor_spider', 'dngn/floor/spider', 0, 6, 2),
    ...series('floor_sand', 'dngn/floor/sand', 1, 6),
    ...series('floor_limestone', 'dngn/floor/limestone', 0, 6),

    // --- 천장으로 쓸 어두운 재질 ---
    // DCSS 에는 천장 타일이 없어, 어두운 바닥 재질을 테마마다 골라 씁니다.
    // 전부 같은 것을 쓰면 어느 던전이든 위를 올려다본 느낌이 똑같아집니다.
    ...series('ceil_rock', 'dngn/floor/rough_red', 0, 4),
    ...series('ceil_dirt', 'dngn/floor/dirt', 0, 3),
    ...series('ceil_mud', 'dngn/floor/mud', 0, 4),
    ...series('ceil_tomb', 'dngn/floor/tomb', 0, 4),
    ...series('ceil_ice', 'dngn/floor/ice', 0, 4),
    ...series('ceil_volcanic', 'dngn/floor/volcanic_floor', 0, 4),
    ...series('ceil_marble', 'dngn/floor/marble_floor', 1, 4),

    // --- 지형지물 ---
    door_closed: 'dngn/doors/closed_door',
    door_closed_crypt: 'dngn/doors/closed_door_crypt',

    // --- 몬스터 ---
    // 몬스터는 player.png 에 들어 있습니다. dc-player.txt 가 dc-mon.txt 를 포함하기 때문입니다.
    // 경로는 dc-mon.txt 의 MONS_* 항목에서 확인한 것으로, 게임의 몬스터 이름과 짝지었습니다.
    mon_rat: 'mon/animals/rat',
    mon_kobold: 'mon/humanoids/kobold',
    mon_snake: 'mon/animals/adder',
    mon_frog: 'mon/animals/bullfrog',
    mon_beast: ['mon/animals/wolf', 'mon/animals/hound', 'mon/animals/jackal', 'mon/animals/black_bear'],
    mon_spider: ['mon/animals/wolf_spider', 'mon/animals/jumping_spider', 'mon/animals/orb_spider'],
    mon_hydra: ['mon/dragons/hydra1', 'mon/dragons/hydra5', 'mon/dragons/swamp_dragon', 'mon/dragons/lindwurm', 'mon/dragons/wyvern', 'mon/dragons/steam_dragon'],
    mon_slime: 'mon/amorphous/slime_creature',
    mon_goblin: 'mon/humanoids/goblin',
    mon_orc: 'mon/humanoids/orcs/orc',
    mon_orc_warrior: 'mon/humanoids/orcs/orc_warrior',
    mon_centaur: 'mon/demihumanoids/taurs/centaur',
    mon_zombie: 'mon/undead/zombies/zombie_human',
    mon_skeleton: 'mon/undead/skeletal_warrior',
    mon_mummy: 'mon/undead/mummy',
    mon_spectre: 'mon/undead/phantom',
    mon_ice_beast: ['mon/animals/ice_beast', 'mon/animals/sky_beast', 'mon/demons/ice_devil'],
    mon_simulacrum: 'mon/undead/zombies/zombie_small',
    mon_ice_giant: 'mon/humanoids/giants/frost_giant',
    mon_gargoyle: ['mon/nonliving/gargoyle', 'mon/nonliving/war_gargoyle', 'mon/nonliving/molten_gargoyle', 'mon/nonliving/iron_golem'],
    mon_imp: ['mon/demons/crimson_imp', 'mon/demons/shadow_imp', 'mon/demons/white_imp', 'mon/demons/iron_imp'],
    mon_fire_demon: 'mon/demons/sun_demon',
    mon_hell_knight: 'mon/humanoids/humans/hell_knight',
    mon_demon: 'mon/demons/executioner',

    // 네임드
    mon_menkaure: 'mon/unique/menkaure',
    mon_minotaur: 'mon/demihumanoids/minotaur',
    mon_purgy: 'mon/unique/blorkula',
};

/**
 * 같은 재질의 연속된 변형을 한 번에 지정합니다.
 * @param {string} prefix - 게임에서 쓸 이름의 앞부분
 * @param {string} sourcePrefix - 저장소 경로의 앞부분
 * @param {number} from - 시작 번호
 * @param {number} count - 개수
 * @param {number} [pad] - 원본 파일명의 자릿수 (hell01 처럼 0을 채우는 경우)
 * @returns {Record<string, string>} 이름 -> 경로
 */
function series(prefix, sourcePrefix, from, count, pad = 1) {
    const out = {};
    for (let i = 0; i < count; i++) {
        const n = String(from + i).padStart(pad, '0');
        out[`${prefix}_${i + 1}`] = `${sourcePrefix}${n}`;
    }
    return out;
}

/**
 * 원본 타일을 내려받아 캐시에 저장합니다. 이미 있으면 다시 받지 않습니다.
 * @param {string} sourcePath - 저장소에서의 경로 (확장자 제외)
 * @returns {Promise<string|null>} 캐시된 파일 경로, 실패하면 null
 */
async function fetchTile(sourcePath) {
    const cached = CACHE_DIR + sourcePath.replace(/\//g, '__') + '.png';
    if (existsSync(cached)) return cached;

    const response = await fetch(`${SOURCE_BASE}${sourcePath}.png`);
    if (!response.ok) return null;

    writeFileSync(cached, Buffer.from(await response.arrayBuffer()));
    return cached;
}

/**
 * 투명한 여백을 잘라낸 알맹이 영역을 구합니다.
 *
 * tilegen 은 타일을 시트에 넣을 때 내용이 있는 부분만 잘라 넣습니다(%shrink).
 * 벽처럼 전면이 불투명한 타일은 잘려도 원본과 같아 그냥 찾아지지만,
 * 몬스터는 주변이 투명해 원본 그대로는 시트 어디에도 없습니다.
 * @param {object} image - 대상 이미지
 * @returns {{x: number, y: number, w: number, h: number}} 내용이 있는 영역
 */
function contentBounds(image) {
    let minX = image.width, minY = image.height, maxX = -1, maxY = -1;

    for (let y = 0; y < image.height; y++) {
        for (let x = 0; x < image.width; x++) {
            if (image.data[(y * image.width + x) * 4 + 3] === 0) continue;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
        }
    }

    // 완전히 투명한 이미지는 잘라낼 것이 없습니다.
    if (maxX < 0) return { x: 0, y: 0, w: image.width, h: image.height };
    return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

/**
 * 이미지에서 사각 영역만 잘라 새 이미지를 만듭니다.
 * @param {object} image - 원본
 * @param {{x: number, y: number, w: number, h: number}} bounds - 잘라낼 영역
 * @returns {object} 잘라낸 이미지
 */
function cropImage(image, bounds) {
    const data = new Uint8ClampedArray(bounds.w * bounds.h * 4);
    for (let y = 0; y < bounds.h; y++) {
        const from = ((bounds.y + y) * image.width + bounds.x) * 4;
        data.set(image.data.subarray(from, from + bounds.w * 4), y * bounds.w * 4);
    }
    return { width: bounds.w, height: bounds.h, data };
}

/**
 * 시트 안에서 타일과 픽셀이 완전히 일치하는 위치를 찾습니다.
 *
 * 시트는 폭 1024의 셸프 패킹으로 만들어져 대부분의 타일이 32의 배수 좌표에 놓입니다.
 * 먼저 격자 위치만 훑고, 없으면 전체를 훑습니다.
 * @param {object} sheet - 시트 이미지
 * @param {object} tile - 찾을 타일 이미지 (이미 잘라낸 것)
 * @returns {{x: number, y: number}|null} 찾은 좌표
 */
function findInSheet(sheet, tile) {
    const matchesAt = (ox, oy) => {
        for (let y = 0; y < tile.height; y++) {
            for (let x = 0; x < tile.width; x++) {
                const a = ((oy + y) * sheet.width + ox + x) * 4;
                const b = (y * tile.width + x) * 4;
                // 완전히 투명한 픽셀끼리는 색이 달라도 같은 것으로 봅니다.
                if (tile.data[b + 3] === 0 && sheet.data[a + 3] === 0) continue;
                if (sheet.data[a] !== tile.data[b] || sheet.data[a + 1] !== tile.data[b + 1] ||
                    sheet.data[a + 2] !== tile.data[b + 2] || sheet.data[a + 3] !== tile.data[b + 3]) {
                    return false;
                }
            }
        }
        return true;
    };

    for (const step of [32, 1]) {
        for (let y = 0; y + tile.height <= sheet.height; y += step) {
            for (let x = 0; x + tile.width <= sheet.width; x += step) {
                if (matchesAt(x, y)) return { x, y };
            }
        }
    }
    return null;
}

// --- 실행 -------------------------------------------------------------------

if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

/** @description 원본 경로의 첫 구간으로 어느 시트를 뒤질지 정합니다. */
const SHEET_FOR = {
    wall: 'wall', floor: 'floor', doors: 'feat', gateways: 'feat',
    // 몬스터는 dc-player.txt 가 dc-mon.txt 를 포함하는 탓에 player.png 에 들어갑니다.
    animals: 'player', humanoids: 'player', demihumanoids: 'player', demons: 'player',
    undead: 'player', nonliving: 'player', amorphous: 'player', dragons: 'player', unique: 'player',
};

const sheets = {};
const located = {};
const missing = [];

for (const [name, spec] of Object.entries(WANTED)) {
    // 값이 배열이면 앞에서부터 시도해, 시트와 맞는 첫 번째를 씁니다.
    const candidates = Array.isArray(spec) ? spec : [spec];
    const sheetName = SHEET_FOR[candidates[0].split('/')[1]] || 'main';

    if (!sheets[sheetName]) sheets[sheetName] = readPng(`${TILES_DIR}${sheetName}.png`);

    let resolved = null;
    const tried = [];

    for (const sourcePath of candidates) {
        const cached = await fetchTile(sourcePath);
        if (!cached) { tried.push(`${sourcePath}: 원본 없음`); continue; }

        // tilegen 과 같은 방식으로 투명 여백을 잘라낸 뒤 찾습니다.
        const source = readPng(cached);
        const tile = cropImage(source, contentBounds(source));
        const found = findInSheet(sheets[sheetName], tile);
        if (!found) { tried.push(`${sourcePath}: 시트에 없음`); continue; }

        // 시트에는 잘라낸 크기로 들어가 있으므로 그 크기를 기록합니다.
        resolved = { sheet: sheetName, source: sourcePath, ...found, w: tile.width, h: tile.height };
        break;
    }

    if (!resolved) {
        missing.push(`${name} (${tried.join(', ')})`);
        continue;
    }

    located[name] = resolved;
    // 첫 후보가 아니라 대안으로 찾았으면 '+' 로 표시합니다.
    process.stdout.write(tried.length > 0 ? '+' : '.');
}

process.stdout.write('\n');

const outputPath = `${TILES_DIR}tile-locations.json`;
const previous = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, 'utf8')).tiles : {};

writeFileSync(outputPath, JSON.stringify({
    note: 'npm run locate:tiles 로 생성됩니다. 직접 고치지 마십시오.',
    source: SOURCE_BASE,
    tiles: located,
}, null, 2) + '\n', 'utf8');

const changed = Object.keys(located).filter(k =>
    !previous[k] || previous[k].x !== located[k].x || previous[k].y !== located[k].y);

console.log(`확정 ${Object.keys(located).length}개 / 요청 ${Object.keys(WANTED).length}개`);
if (changed.length > 0) console.log(`좌표가 바뀐 타일 ${changed.length}개: ${changed.slice(0, 8).join(', ')}${changed.length > 8 ? ' ...' : ''}`);
if (missing.length > 0) {
    console.log(`\n찾지 못한 타일 ${missing.length}개:`);
    for (const item of missing) console.log(`  - ${item}`);
}

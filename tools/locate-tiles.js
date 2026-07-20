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
 * 시트 안에서 타일과 픽셀이 완전히 일치하는 위치를 찾습니다.
 *
 * 시트는 폭 1024의 셸프 패킹으로 만들어져 대부분의 타일이 32의 배수 좌표에 놓입니다.
 * 먼저 격자 위치만 훑고, 없으면 전체를 훑습니다.
 * @param {object} sheet - 시트 이미지
 * @param {object} tile - 찾을 타일 이미지
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
const SHEET_FOR = { wall: 'wall', floor: 'floor', doors: 'feat', gateways: 'feat', mon: 'main', player: 'player' };

const sheets = {};
const located = {};
const missing = [];

for (const [name, sourcePath] of Object.entries(WANTED)) {
    const category = sourcePath.split('/')[1];
    const sheetName = SHEET_FOR[category] || 'main';

    if (!sheets[sheetName]) sheets[sheetName] = readPng(`${TILES_DIR}${sheetName}.png`);

    const cached = await fetchTile(sourcePath);
    if (!cached) {
        missing.push(`${name} (${sourcePath}: 원본 없음)`);
        continue;
    }

    const found = findInSheet(sheets[sheetName], readPng(cached));
    if (!found) {
        missing.push(`${name} (${sourcePath}: 시트에서 찾지 못함)`);
        continue;
    }

    located[name] = { sheet: sheetName, source: sourcePath, ...found, w: 32, h: 32 };
    process.stdout.write('.');
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

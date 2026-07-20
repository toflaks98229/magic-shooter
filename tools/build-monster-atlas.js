/**
 * @fileoverview 몬스터 그림 아틀라스를 만듭니다.
 *
 *   node tools/build-monster-atlas.js
 *
 * 지금까지 몬스터는 글리프로 그림을 골랐습니다. 우리 아틀라스에 적 그림이
 * 마흔세 개뿐인데 DCSS 몬스터는 육백쉰아홉 종이라, 이름으로 하나하나 짝지으면
 * 대부분이 빈손으로 남기 때문입니다. r 은 전부 쥐 그림, S 는 전부 뱀 그림이
 * 되는 식이었습니다. 알아볼 수는 있지만 정확하지는 않습니다.
 *
 * 원본은 rltiles/mon/ 아래에 몬스터마다 개별 PNG 를 두고 있습니다. 천오백 장이
 * 넘고, 파일 이름이 몬스터 이름과 거의 그대로 대응합니다.
 * 그것들을 한 장으로 모아 좌표를 적어 두면 종마다 제 그림을 갖게 됩니다.
 *
 * 짝지을 수 없는 몬스터는 그대로 둡니다. 억지로 비슷한 것을 붙이면
 * 무엇이 안 맞는지 알아볼 수 없게 되고, 글리프 대체가 이미 그 일을 합니다.
 */

import fs from 'node:fs';
import path from 'node:path';
import { readPng, writePng, crop } from './png.js';

const SOURCE = 'Data/crawl/crawl-ref/source/rltiles/mon';
const SHEET_OUT = 'Data/tiles/monsters.png';
const DATA_OUT = 'Data/tiles/monsters_data.json';

/** @description 타일 한 변(px). 원본 몬스터 타일은 대부분 32 입니다. */
const TILE = 32;

/** @description 한 줄에 몇 개를 늘어놓을지. 시트가 지나치게 길어지지 않게 합니다. */
const COLUMNS = 32;

/**
 * rltiles/mon 아래의 모든 PNG 를 찾습니다.
 * @param {string} dir - 뒤질 디렉터리
 * @returns {Array<string>} 파일 경로들
 */
function collectPngs(dir) {
    const found = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) found.push(...collectPngs(full));
        else if (entry.name.endsWith('.png')) found.push(full);
    }
    return found;
}

/**
 * 파일 이름을 몬스터 식별자 후보로 바꿉니다.
 *
 * 원본 파일에는 같은 몬스터의 변형이 번호로 붙어 있습니다.
 * (abomination_large1..7) 첫 번째만 씁니다. 여러 장을 돌려 쓰는 것은
 * 지금 렌더러가 하지 않는 일이라, 넣어 두면 쓰이지 않는 데이터가 됩니다.
 * @param {string} file - 파일 경로
 * @returns {{id: string, variant: number}} 식별자와 변형 번호
 */
function toMonsterId(file) {
    const base = path.basename(file, '.png');

    // 끝의 숫자는 변형입니다. 다만 이름 자체가 숫자로 끝나는 것도 있어
    // (ufetubus2 같은) 숫자를 떼고도 남는 이름이 있어야 변형으로 봅니다.
    const matched = /^(.*?)(\d+)$/.exec(base);
    if (matched && matched[1].length > 2) {
        return { id: matched[1].replace(/_+$/, '').replace(/_/g, '-'), variant: Number(matched[2]) };
    }
    return { id: base.replace(/_/g, '-'), variant: 0 };
}

/**
 * 이 게임이 아는 몬스터 식별자를 모읍니다.
 * @returns {Set<string>} 식별자들
 */
function knownMonsterIds() {
    const text = fs.readFileSync('Script/data/monsters.js', 'utf8');
    return new Set([...text.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]));
}

/**
 * 그림에서 눈에 띄는 색 하나를 고릅니다.
 *
 * 피격 파티클 색으로 씁니다. 가장 흔한 불투명 색을 고르되 아주 어두운 것은
 * 건너뜁니다. 윤곽선이 대개 검은색이라 그것이 뽑히면 어느 몬스터든 검은 피가 납니다.
 * @param {object} image - 잘라낸 그림
 * @returns {string} 색
 */
function dominantColour(image) {
    const counts = new Map();

    for (let i = 0; i < image.data.length; i += 4) {
        const [r, g, b, a] = image.data.slice(i, i + 4);
        if (a < 200) continue;
        if (r + g + b < 90) continue;   // 윤곽선

        const key = `${r >> 4},${g >> 4},${b >> 4}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    if (counts.size === 0) return '#c8c8c0';

    const [best] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const [r, g, b] = best[0].split(',').map(v => (Number(v) << 4) + 8);
    return `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

// --- 모으기 ---------------------------------------------------------------------

if (!fs.existsSync(SOURCE)) {
    console.error(`원본 타일을 찾을 수 없습니다: ${SOURCE}`);
    process.exit(1);
}

const known = knownMonsterIds();
const chosen = new Map();   // 식별자 → 파일

for (const file of collectPngs(SOURCE)) {
    const { id, variant } = toMonsterId(file);
    if (!known.has(id)) continue;

    // 변형은 첫 번째만 씁니다.
    const existing = chosen.get(id);
    if (existing && existing.variant <= variant) continue;
    chosen.set(id, { file, variant });
}

console.log(`몬스터 그림 ${chosen.size}종을 찾았습니다. (아는 몬스터 ${known.size}종 중)`);

// --- 시트 만들기 -----------------------------------------------------------------

const ids = [...chosen.keys()].sort();
const rows = Math.ceil(ids.length / COLUMNS);
const width = COLUMNS * TILE;
const height = rows * TILE;

const sheet = { width, height, data: new Uint8ClampedArray(width * height * 4) };
const sprites = {};
let skipped = 0;

ids.forEach((id, index) => {
    const source = readPng(chosen.get(id).file);

    // 크기가 다른 것은 건너뜁니다. 늘리거나 자르면 그림이 망가집니다.
    if (source.width !== TILE || source.height !== TILE) { skipped++; return; }

    const column = index % COLUMNS;
    const row = Math.floor(index / COLUMNS);
    const originX = column * TILE;
    const originY = row * TILE;

    for (let y = 0; y < TILE; y++) {
        for (let x = 0; x < TILE; x++) {
            const from = (y * source.width + x) * 4;
            const to = ((originY + y) * width + originX + x) * 4;
            for (let c = 0; c < 4; c++) sheet.data[to + c] = source.data[from + c];
        }
    }

    sprites[`mon_${id}`] = {
        x: originX, y: originY, w: TILE, h: TILE,
        color: dominantColour(crop(source, 0, 0, TILE, TILE)),
    };
});

writePng(SHEET_OUT, sheet);
fs.writeFileSync(DATA_OUT, `${JSON.stringify({ sheetFile: 'monsters.png', sprites }, null, 2)}\n`);

console.log(`시트 ${width}x${height}, 스프라이트 ${Object.keys(sprites).length}개`);
if (skipped > 0) console.log(`크기가 달라 건너뛴 것: ${skipped}개`);
console.log(`→ ${SHEET_OUT}, ${DATA_OUT}`);

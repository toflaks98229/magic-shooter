/**
 * @fileoverview 종족별 플레이어 그림을 모아 아틀라스로 만듭니다.
 *
 *   node tools/build-player-atlas.js
 *
 * 1인칭에서는 플레이어를 그릴 일이 없었습니다. 화면이 곧 플레이어의 눈이라
 * 자기 모습이 보일 자리가 없었습니다. 위에서 내려다보면 그렇지 않습니다.
 * 자기가 어디 있는지 보이지 않으면 움직일 수가 없습니다.
 *
 * 만드는 방향이 다른 아틀라스와 반대입니다. 다른 것들은 그림에서 출발해
 * 있는 대로 담습니다. 여기서는 이 게임이 아는 종족에서 출발해 그 종족의
 * 그림을 찾습니다. 담기지 않은 종족이 있으면 그 종족을 고른 사람이 화면에서
 * 사라지므로, 빠진 것이 그대로 드러나야 합니다.
 */

import fs from 'node:fs';
import path from 'node:path';
import { readPng, writePng } from './png.js';

const PLAYER_DIR = 'Data/crawl/crawl-ref/source/rltiles/player/base';
const SHEET_OUT = 'Data/tiles/player-base.png';
const DATA_OUT = 'Data/tiles/player-base_data.json';

/** @description 타일 한 변(px). */
const TILE = 32;

/** @description 한 줄에 몇 개를 늘어놓을지. */
const COLUMNS = 8;

/**
 * @description 이름만으로는 이어지지 않는 종족의 그림 자리.
 *
 * 원본이 그림을 player/base 밖에 두었거나, 파일 이름이 종족 이름과 다른
 * 경우입니다. 바라키는 몬스터 쪽에, 펠리드는 고양이 전용 폴더에 있습니다.
 */
const ALIASES = {
    barachi: 'Data/crawl/crawl-ref/source/rltiles/mon/demihumanoids/barachi.png',
    felid: 'Data/crawl/crawl-ref/source/rltiles/player/felids/cat1.png',
    'mountain-dwarf': `${PLAYER_DIR}/dwarf_m.png`,
    'draconian-base': `${PLAYER_DIR}/draconian.png`,
    tengu: `${PLAYER_DIR}/tengu_winged_m.png`,
};

/**
 * 이 게임이 아는 종족 식별자를 모읍니다.
 * @returns {string[]} 식별자들
 */
function knownSpecies() {
    const text = fs.readFileSync('Script/data/species.js', 'utf8');
    return [...text.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);
}

/**
 * 한 종족의 그림 파일을 찾습니다.
 *
 * 원본은 같은 종족을 여러 모습으로 그려 둡니다. 나가는 비늘 색이 열일곱
 * 가지고, 오니는 다섯 가지입니다. 이 게임은 그 안의 갈래를 따로 세지 않으므로
 * 이름순으로 첫 번째를 씁니다.
 * @param {string} id - 종족 식별자
 * @param {string[]} files - player/base 안의 파일 이름들
 * @returns {string|null} 파일 경로. 못 찾으면 null
 */
function findArt(id, files) {
    if (ALIASES[id]) return ALIASES[id];

    const stem = id.replace(/-/g, '_');
    const candidates = files.filter((file) => {
        const base = path.basename(file, '.png');
        if (base === stem) return true;

        // 색 갈래(naga_blue)와 번호 갈래(octopode1), 성별(human_m)을 받습니다.
        // 다른 종족을 잘못 물지 않도록 경계를 확인합니다. 'gnoll' 이
        // 'gnome' 을 물면 안 됩니다.
        return new RegExp(`^${stem}(_|\\d)`).test(base);
    });

    return candidates.sort()[0] ?? null;
}

// --- 모으기 ---------------------------------------------------------------------

if (!fs.existsSync(PLAYER_DIR)) {
    console.error(`플레이어 그림을 찾을 수 없습니다: ${PLAYER_DIR}`);
    process.exit(1);
}

const files = fs.readdirSync(PLAYER_DIR)
    .filter(file => file.endsWith('.png'))
    .map(file => path.join(PLAYER_DIR, file));

const species = knownSpecies();
const sprites = {};
const missing = [];

const rows = Math.ceil(species.length / COLUMNS);
const width = COLUMNS * TILE;
const height = Math.max(1, rows) * TILE;
const sheet = { width, height, data: new Uint8ClampedArray(width * height * 4) };

species.forEach((id, index) => {
    const art = findArt(id, files);
    if (!art || !fs.existsSync(art)) { missing.push(id); return; }

    const source = readPng(art);
    const originX = (index % COLUMNS) * TILE;
    const originY = Math.floor(index / COLUMNS) * TILE;

    // 원본 그림은 대개 32x32 이지만 몇몇은 더 큽니다. 넘치는 부분은 자릅니다.
    const copyW = Math.min(TILE, source.width);
    const copyH = Math.min(TILE, source.height);

    for (let y = 0; y < copyH; y++) {
        for (let x = 0; x < copyW; x++) {
            const from = (y * source.width + x) * 4;
            const to = ((originY + y) * width + originX + x) * 4;
            for (let c = 0; c < 4; c++) sheet.data[to + c] = source.data[from + c];
        }
    }

    sprites[`player_${id}`] = { x: originX, y: originY, w: TILE, h: TILE };
});

writePng(SHEET_OUT, sheet);
fs.writeFileSync(DATA_OUT, `${JSON.stringify({ sheetFile: 'player-base.png', sprites }, null, 2)}\n`);

console.log(`종족 ${species.length}종 중 ${Object.keys(sprites).length}종을 담았습니다.`);
if (missing.length > 0) console.log(`그림을 찾지 못한 종족: ${missing.join(', ')}`);
console.log(`→ ${SHEET_OUT} (${width}x${height}), ${DATA_OUT}`);

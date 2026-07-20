/**
 * @fileoverview 볼트가 지정한 전용 타일을 모아 아틀라스로 만듭니다.
 *
 *   node tools/build-vault-tile-atlas.js
 *
 * 볼트는 자기가 쓸 타일을 직접 지정할 수 있습니다. 밀랍으로 된 벽, 이끼 낀 바닥,
 * 특정 자리에만 놓이는 석상 같은 것들입니다. 이것이 있어야 볼트가 그 볼트답게
 * 보입니다. 벌집 볼트가 보통 바위벽으로 그려지면 벌집으로 보이지 않습니다.
 *
 * 지금까지 이 지시자들을 읽지 않아, 지정된 타일이 있어야 할 자리에
 * 플레이스홀더가 나오고 있었습니다.
 *
 * 지시자는 네 가지입니다. (docs/develop/levels/syntax.txt:507, 1109)
 *   LROCKTILE  그 층의 바위벽 전체
 *   LFLOORTILE 그 층의 바닥 전체
 *   TILE       글리프 하나가 그려질 그림
 *   FTILE      그 글리프 아래에 깔릴 바닥
 *   RTILE      그 글리프 자리의 바위 변형
 */

import fs from 'node:fs';
import path from 'node:path';
import { readPng, writePng } from './png.js';

const RLTILES = 'Data/crawl/crawl-ref/source/rltiles';
const DES_ROOT = 'Data/crawl/crawl-ref/source/dat/des';
const SHEET_OUT = 'Data/tiles/vault-tiles.png';
const DATA_OUT = 'Data/tiles/vault-tiles_data.json';

/** @description 타일 한 변(px). */
const TILE = 32;

/** @description 한 줄에 몇 개를 늘어놓을지. */
const COLUMNS = 32;

/** @description 한 타일 이름에서 가져올 변형의 최대 수. */
const MAX_VARIANTS = 3;

/**
 * 모든 dc-*.txt 를 읽어 타일 이름에서 그림 파일들을 찾는 표를 만듭니다.
 *
 * 한 줄이 `파일이름 이름1 이름2...` 꼴이고, 이름 없는 줄은 바로 앞 묶음의
 * 변형입니다. `%repeat A B` 는 A 를 색만 바꿔 B 로도 쓴다는 뜻이라,
 * B 를 물으면 A 의 그림을 돌려줍니다.
 * @returns {Map<string, Array<string>>} 타일 이름 → 파일 이름들
 */
function readAllTileNames() {
    const names = new Map();

    for (const file of fs.readdirSync(RLTILES)) {
        if (!file.startsWith('dc-') || !file.endsWith('.txt')) continue;

        let current = null;
        for (const line of fs.readFileSync(path.join(RLTILES, file), 'utf8').split(/\r?\n/)) {
            const trimmed = line.trim();
            if (trimmed === '' || trimmed.startsWith('#')) continue;

            if (trimmed.startsWith('%repeat')) {
                // 색만 바꾼 이름입니다. 바탕이 되는 이름의 그림을 그대로 씁니다.
                const parts = trimmed.split(/\s+/);
                if (parts.length >= 3 && names.has(parts[1])) {
                    names.set(parts[2], names.get(parts[1]));
                }
                current = null;
                continue;
            }
            if (trimmed.startsWith('%')) {
                if (trimmed.startsWith('%variation')) current = null;
                continue;
            }

            const parts = trimmed.split(/\s+/);
            const tileNames = parts.slice(1).filter(n => /^[A-Z][A-Z0-9_]*$/.test(n));

            if (tileNames.length > 0) {
                current = [];
                for (const name of tileNames) {
                    if (!names.has(name)) names.set(name, current);
                }
            }

            if (current) current.push(parts[0]);
        }
    }

    return names;
}

/**
 * rltiles 안의 모든 그림을 파일 이름으로 찾을 수 있게 모읍니다.
 * @returns {Map<string, string>} 파일 이름(확장자 없음) → 경로
 */
function collectImages() {
    const images = new Map();
    const stack = [RLTILES];

    while (stack.length > 0) {
        const dir = stack.pop();
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) { stack.push(full); continue; }
            if (!entry.name.endsWith('.png')) continue;

            const base = path.basename(entry.name, '.png');
            if (!images.has(base)) images.set(base, full);
        }
    }

    return images;
}

/**
 * 볼트들이 지정한 타일 이름을 모두 모읍니다.
 * @returns {Set<string>} 타일 이름들 (대문자)
 */
function collectWantedTiles() {
    const wanted = new Set();
    const files = [];

    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith('.des')) files.push(full);
        }
    };
    walk(DES_ROOT);

    for (const file of files) {
        const text = fs.readFileSync(file, 'utf8');

        for (const match of text.matchAll(/^(LROCKTILE|LFLOORTILE|TILE|FTILE|RTILE):\s*(.+)$/gm)) {
            // 글리프가 앞에 붙습니다. 구분자는 = 와 : 둘 다 쓰입니다.
            // (x = wall_wax / x : wall_abyss)
            // : 만 보고 = 를 놓치면 글리프를 타일 이름으로 잘못 읽습니다.
            const value = match[2];
            const separator = value.search(/[=:]/);
            const rest = separator >= 0 ? value.slice(separator + 1) : value;

            for (const part of rest.split('/')) {
                const name = part.trim().replace(/^w:\d+\s*/, '').split(/\s+/)[0];
                if (!name || !/^[a-z_0-9]+$/.test(name)) continue;
                wanted.add(name.toUpperCase());
            }
        }
    }

    return wanted;
}

/**
 * @description 이름과 파일 이름이 어긋나는 것들.
 *
 * 원본이 파일을 줄여 쓴 자리입니다. COCYTUS 를 coc 로, DEMONIC_TREE_1 을
 * tree_demonic1 로 두는 식이라 규칙으로는 이어지지 않습니다.
 */
const FILE_ALIASES = {
    bedevilled_crystal_cocytus: 'bedevilled_crystal_coc',
    bedevilled_crystal_gehenna: 'bedevilled_crystal_geh',
    bedevilled_crystal_pandemonium: 'bedevilled_crystal_pan',
    bedevilled_crystal_tartarus: 'bedevilled_crystal_tar',
    dngn_cache_of_pizza: 'pizza',
};

/**
 * 악마 나무처럼 번호가 이름 안으로 들어간 것을 되돌립니다.
 * DNGN_DEMONIC_TREE_1 → tree_demonic1
 * @param {string} lower - 소문자 타일 이름
 * @returns {string|null} 파일 이름. 규칙에 안 맞으면 null
 */
function reorderedName(lower) {
    const matched = /^dngn_demonic_tree_(\d+)$/.exec(lower);
    return matched ? 'tree_demonic' + matched[1] : null;
}
/**
 * 파일 이름으로 직접 찾습니다.
 *
 * 이름표(dc-*.txt)는 게임 코드가 쓰는 이름만 담습니다. 볼트에서만 쓰는 타일은
 * 파일로만 있는 경우가 있어, 이름 그대로와 번호가 붙은 변형을 함께 찾습니다.
 * 이름이 조금 다른 것도 있어(coc / cocytus) 앞부분이 같으면 받아들입니다.
 * @param {string} lower - 소문자 타일 이름
 * @param {Map<string, string>} images - 파일 이름 → 경로
 * @returns {Array<string>|null} 파일 이름들
 */
function namesByFile(lower, images) {
    const found = [];

    // dngn_ 접두사가 붙은 이름이 있는데 그림 파일에는 없는 경우가 많습니다.
    // 떼고도 한 번 찾아봅니다.
    const candidates = [lower];
    if (lower.startsWith('dngn_')) candidates.push(lower.slice(5));
    if (FILE_ALIASES[lower]) candidates.unshift(FILE_ALIASES[lower]);

    const reordered = reorderedName(lower);
    if (reordered) candidates.unshift(reordered);

    for (const base of candidates) {
        if (images.has(base)) found.push(base);
        for (let i = 0; i < 8; i++) {
            const numbered = base + '_' + i;
            if (images.has(numbered)) found.push(numbered);
            else if (images.has(base + i)) found.push(base + i);
        }
        if (found.length > 0) break;
    }

    return found.length > 0 ? found : null;
}


// --- 모으기 ---------------------------------------------------------------------

const tileNames = readAllTileNames();
const images = collectImages();
const wanted = collectWantedTiles();

const chosen = new Map();   // 스프라이트 키 → 파일 경로
const missing = [];

for (const name of [...wanted].sort()) {
    // 이름표에 없어도 그림이 있을 수 있습니다. 이름표는 게임 코드가 쓰는
    // 이름만 담고, 볼트에서만 쓰는 타일은 파일로만 있는 경우가 있습니다.
    const baseNames = tileNames.get(name) ?? namesByFile(name.toLowerCase(), images);
    if (!baseNames?.length) { missing.push(name); continue; }

    let taken = 0;
    for (const baseName of baseNames) {
        if (taken >= MAX_VARIANTS) break;

        const image = images.get(baseName);
        if (!image) continue;

        chosen.set(`vault_${name.toLowerCase()}_${taken}`, image);
        taken++;
    }

    if (taken === 0) missing.push(name);
}

console.log(`볼트가 쓰는 타일 ${wanted.size} 가지 중 ${wanted.size - missing.length} 가지를 찾았습니다.`);
if (missing.length > 0) {
    for (const name of missing) console.log(`  못 찾음: ${name}`);
}

// --- 시트 만들기 -----------------------------------------------------------------

const keys = [...chosen.keys()].sort();
const rows = Math.ceil(keys.length / COLUMNS);
const width = COLUMNS * TILE;
const height = Math.max(1, rows) * TILE;

const sheet = { width, height, data: new Uint8ClampedArray(width * height * 4) };
const sprites = {};
let skipped = 0;

keys.forEach((key, index) => {
    const source = readPng(chosen.get(key));

    // 크기가 다른 것은 건너뜁니다. 늘리거나 자르면 그림이 망가집니다.
    if (source.width !== TILE || source.height !== TILE) { skipped++; return; }

    const originX = (index % COLUMNS) * TILE;
    const originY = Math.floor(index / COLUMNS) * TILE;

    for (let y = 0; y < TILE; y++) {
        for (let x = 0; x < TILE; x++) {
            const from = (y * source.width + x) * 4;
            const to = ((originY + y) * width + originX + x) * 4;
            for (let c = 0; c < 4; c++) sheet.data[to + c] = source.data[from + c];
        }
    }

    sprites[key] = { x: originX, y: originY, w: TILE, h: TILE };
});

writePng(SHEET_OUT, sheet);
fs.writeFileSync(DATA_OUT, `${JSON.stringify({ sheetFile: 'vault-tiles.png', sprites }, null, 2)}\n`);

console.log(`시트 ${width}x${height}, 스프라이트 ${Object.keys(sprites).length}개`);
if (skipped > 0) console.log(`크기가 달라 건너뛴 것: ${skipped}개`);
console.log(`→ ${SHEET_OUT}, ${DATA_OUT}`);

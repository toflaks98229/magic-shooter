/**
 * @fileoverview DCSS 의 .des 볼트를 이 게임이 읽을 수 있는 형태로 옮깁니다.
 *
 * 볼트는 손으로 그린 방입니다. 절차 생성이 만든 층 위에 찍어 넣으면
 * '누군가 설계한 곳'이 섞여 들어갑니다. 무작위로 만든 방만 이어 붙이면
 * 아무리 다양해도 결국 다 비슷해 보이는데, 볼트 하나가 들어가는 순간
 * 그 층은 기억에 남는 곳이 됩니다.
 *
 * 원본에서는 절차 생성과 볼트가 같은 시스템입니다. 0.34 에는 C++ 로 짠
 * 레이아웃 코드가 아예 없고, 층 전체가 'layout' 태그를 단 encompass 볼트입니다.
 * 다만 그 층 볼트들은 80x70 을 전제로 쓰여 있어 이 게임의 30x30 에 들어가지
 * 않습니다. 그래서 지금 가져오는 것은 방 하나 크기의 미니볼트뿐입니다.
 *
 * 사용법: node tools/import-vaults.js [crawl 소스 경로]
 */

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_SOURCE = 'Data/crawl/crawl-ref/source';
const OUTPUT = 'Script/data/vaults.js';

/** @description 이 게임의 맵 치수. DCSS 의 GXM/GYM 과 같습니다. */
const MAP_WIDTH = 80;
const MAP_HEIGHT = 70;

/**
 * @description 가져올 파일들.
 *
 * 몬스터 없는 순수 구조물부터 시작합니다. 지시자가 거의 없어 옮기기 쉽고,
 * 들어가는 순간 눈에 보이는 성과가 나옵니다.
 * 몬스터가 있는 볼트는 배치 밀도를 다시 잡아야 해서 나중으로 미룹니다.
 */
const SOURCE_FILES = [
    'dat/des/variable/mini_features.des',   // 몬스터 없는 순수 구조물
    'dat/des/variable/mini_monsters.des',   // 몬스터가 배치된 방
    'dat/des/traps/rats_trap.des',          // 밟으면 벽이 열리는 기믹

    // 층 전체를 정의하는 볼트(encompass).
    //
    // 원본의 encompass 볼트 355 개 중 대부분은 신전이나 분기 최하층이라
    // 이 게임에 대응물이 없습니다. 포탈 던전은 다릅니다. 하수구도 납골당도
    // 그 자체로 자족적인 한 판이라, 이 게임의 '한 층' 에 그대로 맞습니다.
    'dat/des/portals/sewer.des',
    'dat/des/portals/ossuary.des',
    'dat/des/portals/icecave.des',
];

/**
 * @description 이 게임이 이해하는 글리프.
 *
 * 원본의 글리프를 그대로 씁니다. 그래야 원본 볼트를 손대지 않고 붙여넣을 수 있고,
 * 나중에 더 가져올 때도 표를 다시 만들지 않아도 됩니다.
 * 표에 없는 글리프가 하나라도 있는 볼트는 통째로 버립니다.
 * 반쯤 이해한 볼트를 찍어 넣으면 무엇이 잘못됐는지 알아보기 어렵습니다.
 */
const GLYPHS = {

    // 기믹 자리. 밟으면 무슨 일이 일어나는 칸과, 그때 열릴 벽입니다.
    '^': 'TRIGGER_PLATE',
    '@': 'FLOOR',           // 볼트로 들어오는 입구. 바닥으로 둡니다
    'z': 'SEALED_WALL',

    // 계단. 이 게임에는 층을 잇는 길이 한 종류뿐이라 내려가는 것만 출구로 삼고,
    // 올라가는 것은 바닥으로 둡니다.
    '>': 'EXIT', '}': 'EXIT', ')': 'EXIT', ']': 'EXIT',
    '<': 'FLOOR', '{': 'FLOOR', '(': 'FLOOR', '[': 'FLOOR',

    // 물건 자리. 볼트에서 물건을 놓는 것은 아직 옮기지 않아 바닥으로 둡니다.
    '$': 'FLOOR', '%': 'FLOOR', '*': 'FLOOR', '|': 'FLOOR',
    'd': 'FLOOR', 'e': 'FLOOR', 'f': 'FLOOR', 'g': 'FLOOR',
    'h': 'FLOOR', 'i': 'FLOOR', 'j': 'FLOOR', 'k': 'FLOOR',

    // 구조물. 대응물이 없어 알아볼 수 있는 것으로 놓습니다.
    'A': 'FLOOR',                     // 돌 아치
    'B': 'STATUE', 'C': 'STATUE',     // 제단

    '.': 'FLOOR',
    'x': 'WALL',        // 바위벽
    'X': 'WALL',        // 부술 수 없는 바위벽. 이 게임에는 파기가 없어 같습니다
    'c': 'WALL',        // 돌벽
    'v': 'WALL',        // 금속벽
    'b': 'WALL',        // 수정벽
    'm': 'GLASS',       // 투명 바위벽. 막지만 보입니다
    'n': 'GLASS',       // 투명 돌벽
    'o': 'GLASS',       // 투명 영구벽
    'G': 'STATUE',      // 화강암 상. 막지만 보입니다
    'I': 'STATUE',      // 오크 우상
    'T': 'FOUNTAIN',    // 샘
    'U': 'FOUNTAIN',
    'V': 'FOUNTAIN',
    'w': 'DEEP_WATER',      // 깊은 물. 나는 것만 건넙니다
    'W': 'SHALLOW_WATER',   // 얕은 물. 누구나 건넙니다
    'l': 'LAVA',            // 용암
    't': 'TREE',            // 나무. 막고 가립니다
    '+': 'DOOR',
    '=': 'DOOR',        // 룬 문. 지금은 보통 문과 같습니다

    // 몬스터 자리. 바닥 위에 몬스터를 하나 놓습니다.
    '0': 'MONSTER_ANY',     // 이 깊이에 맞는 아무거나
    '9': 'MONSTER_TOUGH',   // 깊이 + 5 에서 뽑습니다
    '8': 'MONSTER_TOUGHER', // (깊이 + 2) * 2 에서 뽑습니다
    '1': 'MONSTER_SLOT_1', '2': 'MONSTER_SLOT_2', '3': 'MONSTER_SLOT_3',
    '4': 'MONSTER_SLOT_4', '5': 'MONSTER_SLOT_5', '6': 'MONSTER_SLOT_6',
    '7': 'MONSTER_SLOT_7',

    ' ': 'OUTSIDE',     // 빈칸은 볼트에 속하지 않습니다. 아래 지형을 그대로 둡니다
};

/** @description 지시자 한 줄: `NAME:   glass_columns_a` */
const DIRECTIVE = /^([A-Z][A-Z_]*):\s*(.*)$/;

/**
 * .des 파일 하나를 볼트 목록으로 읽습니다.
 * @param {string} text - 파일 전문
 * @returns {Array<object>} 볼트들
 */
function parseVaults(text) {
    const vaults = [];
    let current = null;
    let inMap = false;

    for (const rawLine of text.split(/\r?\n/)) {
        // MAP 안에서는 들여쓰기가 의미를 가지므로 자르지 않습니다.
        const line = inMap ? rawLine : rawLine.trim();

        if (!inMap) {
            if (line.startsWith('#') || line === '') continue;
            // 루아 줄과 블록은 건너뜁니다. 이 게임에는 루아가 없습니다.
            if (line.startsWith(':') || line.startsWith('{{') || line.startsWith('}}')) continue;
        }

        if (line === 'MAP') { inMap = true; current = current ?? {}; current.rows = []; continue; }
        if (line === 'ENDMAP') {
            inMap = false;
            if (current?.name && current.rows?.length) vaults.push(current);
            current = null;
            continue;
        }
        if (inMap) { current.rows.push(rawLine); continue; }

        const matched = DIRECTIVE.exec(line);
        if (!matched) continue;

        const [, key, value] = matched;
        if (key === 'NAME') current = { name: value, tags: [], subst: [], nsubst: [], mons: [], kmons: [], kfeat: [], tiles: [] };
        if (!current) continue;

        if (key === 'TAGS') current.tags.push(...value.split(/\s+/).filter(Boolean));
        if (key === 'DEPTH') current.depth = value;
        if (key === 'WEIGHT') current.weight = Number.parseInt(value, 10) || 10;
        if (key === 'ORIENT') current.orient = value;
        if (key === 'SUBST') current.subst.push(value);
        if (key === 'MONS') current.mons.push(...splitSlots(value));
        if (key === 'KMONS') current.kmons.push(value);   // 아래에서 글리프별로 풉니다
        if (key === 'KFEAT') current.kfeat.push(value);

        // 볼트가 지정한 그림. 이것을 읽지 않으면 밀랍 벽이 보통 바위벽으로
        // 그려져, 벌집 볼트가 벌집으로 보이지 않습니다.
        if (key === 'TILE' || key === 'FTILE' || key === 'RTILE') {
            current.tiles.push({ kind: key, value });
        }
        if (key === 'LROCKTILE') current.rockTile = value.trim();
        if (key === 'LFLOORTILE') current.floorTile = value.trim();
        if (key === 'NSUBST') current.nsubst.push(value);
        if (key === 'SHUFFLE') (current.shuffle ??= []).push(value);
    }

    return vaults;
}

/**
 * MONS 한 줄을 슬롯 목록으로 나눕니다.
 *
 * 쉼표가 슬롯을 가릅니다. 한 슬롯 안의 '/' 는 그중 하나를 고르라는 뜻이고,
 * ';' 뒤는 그 몬스터가 든 물건이라 여기서는 버립니다.
 * @param {string} value - MONS 값
 * @returns {Array<Array<string>>} 슬롯마다의 후보 목록
 */
function splitSlots(value) {
    return value.split(
        /,(?![^(]*\))/,
    ).map(slot => slot.split('/')
        .map(choice => choice.trim()
            .replace(/^w:\d+\s*/, '')
            .split(';')[0].trim())
        .filter(Boolean));
}

/**
 * TILE / FTILE / RTILE 한 줄을 규칙으로 바꿉니다.
 *
 * 글리프가 앞에 붙고 구분자는 = 와 : 둘 다 쓰입니다.
 * (x = wall_wax / x : wall_abyss) 하나만 보면 글리프를 그림 이름으로
 * 잘못 읽습니다.
 * @param {string} value - 지시자 값
 * @returns {object|null} 규칙
 */
function parseTileDirective(value) {
    const separator = value.search(/[=:]/);
    if (separator < 0) return null;

    const glyphs = [...value.slice(0, separator).trim()];
    const rest = value.slice(separator + 1);

    const names = [];
    for (const part of rest.split('/')) {
        const name = part.trim().replace(/^w:\d+\s*/, '').split(/\s+/)[0];
        if (name && /^[a-z_0-9]+$/i.test(name)) names.push(name.toLowerCase());
    }

    if (glyphs.length === 0 || names.length === 0) return null;
    return { glyphs, names };
}

/**
 * KMONS 한 줄을 규칙으로 바꿉니다. (`n = Terence / Maggie, human`)
 *
 * MONS 는 일곱 칸까지인데 KMONS 는 글리프에 직접 묶어 그 제한을 넘깁니다.
 * 슬래시는 '그중 하나', 쉼표는 '앞의 것이 안 되면 이것' 입니다.
 * 여기서는 둘 다 후보로 봅니다. 유니크를 가려낼 장치가 없기 때문입니다.
 * @param {string} line - KMONS 값
 * @returns {object|null} 규칙
 */
function parseKmons(line) {
    const matched = /^(\S+)\s*[=:]\s*(.+)$/.exec(line);
    if (!matched) return null;

    const [, glyphs, rest] = matched;
    const names = rest.split(/[,/]/).map(n => n.trim()).filter(Boolean);
    if (names.length === 0) return null;

    return { glyphs: [...glyphs], names };
}

/**
 * KFEAT 한 줄을 규칙으로 바꿉니다. (`O = enter_temple`)
 *
 * 원본은 지형·함정·상점·제단을 전부 여기로 묶습니다. 이 게임에 대응물이
 * 없는 것은 가져오지 않습니다. 없는 것을 있는 척하는 것보다 낫습니다.
 * @param {string} line - KFEAT 값
 * @returns {object|null} 규칙
 */
function parseKfeat(line) {
    const matched = /^(\S+)\s*[=:]\s*(.+)$/.exec(line);
    if (!matched) return null;

    const [, glyphs, rest] = matched;
    const choices = [];

    for (const part of rest.split('/')) {
        const feature = part.trim().replace(/^w:\d+\s*/, '');
        const mapped = KFEAT_FEATURES[feature];
        if (mapped) choices.push(mapped);
    }

    if (choices.length === 0) return null;
    return { glyphs: [...glyphs], choices };
}

/**
 * @description KFEAT 이 가리키는 지형 중 이 게임이 아는 것.
 *
 * 원본에는 상점·제단·전송문 등이 더 있지만 대응물이 없어 가져오지 않습니다.
 * 하나라도 모르는 것이 있는 KFEAT 줄은 통째로 버립니다.
 */
const KFEAT_FEATURES = {
    floor: 'FLOOR', '.': 'FLOOR',
    rock_wall: 'WALL', stone_wall: 'WALL', metal_wall: 'WALL',
    permarock_wall: 'WALL', crystal_wall: 'WALL',
    x: 'WALL', c: 'WALL', v: 'WALL', b: 'WALL',
    clear_rock_wall: 'GLASS', clear_stone_wall: 'GLASS',
    clear_permarock_wall: 'GLASS', iron_grate: 'GRATE',
    granite_statue: 'STATUE', orcish_idol: 'STATUE',
    shallow_water: 'SHALLOW_WATER', W: 'SHALLOW_WATER',
    deep_water: 'DEEP_WATER', w: 'DEEP_WATER',
    lava: 'LAVA', l: 'LAVA',
    tree: 'TREE', t: 'TREE',
    closed_door: 'DOOR', open_door: 'FLOOR', runed_door: 'DOOR',

    // 함정 중 밟는 순간을 잡을 수 있는 것만 옮깁니다.
    'pressure plate trap': 'TRIGGER_PLATE',

    // 나머지 함정은 아직 만들지 않았습니다. 밟아도 아무 일이 없으면
    // 거짓말이 되므로, 바닥으로 두어 없는 것으로 합니다.
    'alarm trap': 'FLOOR', 'net trap': 'FLOOR', 'dispersal trap': 'FLOOR',
    'shaft trap': 'FLOOR', 'teleport trap': 'FLOOR', 'zot trap': 'FLOOR',
    'arrow trap': 'FLOOR', 'spear trap': 'FLOOR', 'blade trap': 'FLOOR',
    'bolt trap': 'FLOOR', 'needle trap': 'FLOOR', 'axe trap': 'FLOOR',

    petrified_tree: 'TREE', mangrove: 'TREE', demonic_tree: 'TREE',
    broken_door: 'FLOOR', open_clear_door: 'FLOOR',
    closed_clear_door: 'GLASS', runed_clear_door: 'GLASS',
    stone_arch: 'FLOOR', fountain_blue: 'FLOOR', dry_fountain: 'FLOOR',
    granite_statue: 'STATUE',
};

/**
 * NSUBST 한 줄을 규칙 목록으로 바꿉니다.
 *
 * `? = 3:w / *:l` 은 '? 중 셋을 w 로, 나머지를 l 로' 라는 뜻입니다.
 * 이 지시자가 하는 일은 '정확히 몇 개' 입니다. SUBST 는 칸마다 확률을 굴려서
 * 판마다 개수가 들쭉날쭉한데, NSUBST 는 개수를 고정합니다. 문 하나, 계단 하나,
 * 보물 셋처럼 수가 중요한 것들이 이걸 씁니다.
 *
 * 한 줄에 쉼표로 여러 글리프를 묶기도 합니다. (`A = 1:. / *:x, B = 1:. / *:x`)
 * @param {string} line - NSUBST 값
 * @returns {Array<object>} 규칙들
 */
/** @description '나머지 전부'를 뜻하는 표시. Infinity 를 JSON 에 담을 수 없어 씁니다. */
const REST = 'rest';

function parseNsubst(line) {
    const rules = [];

    for (const clause of line.split(/,(?=\s*\S\s*[=:])/)) {
        const matched = /^\s*(\S)\s*=\s*(.+)$/.exec(clause);
        if (!matched) return [];

        const [, from, rest] = matched;
        const specs = [];

        for (const raw of rest.split('/')) {
            const spec = raw.trim();
            if (spec === '') continue;

            // `3:w` `3=w` `*:l` `*=xx.` `.` (수를 안 적으면 마지막은 *, 나머지는 1)
            const parsed = /^(\*|\d+)?\s*([=:])?\s*(.+)$/.exec(spec);
            if (!parsed) return [];

            const [, count, mode, glyphs] = parsed;
            specs.push({
                // Infinity 를 담으면 안 됩니다. 이 데이터는 JSON 으로 나가는데
                // JSON.stringify(Infinity) 는 null 이 되어, 읽는 쪽에서 개수가
                // 사라집니다. 그래서 '나머지 전부'는 문자열로 표시합니다.
                count: count === '*' ? REST : (count ? Number(count) : null),
                once: mode === ':',
                glyphs: [...glyphs],
            });
        }

        if (specs.length === 0) return [];

        // 수를 안 적은 것은 마지막이면 전부, 아니면 하나입니다. (syntax.txt)
        for (let i = 0; i < specs.length; i++) {
            if (specs[i].count !== null) continue;
            specs[i].count = (i === specs.length - 1) ? REST : 1;
        }

        rules.push({ from, specs });
    }

    return rules;
}

/**
 * SHUFFLE 한 줄을 규칙으로 바꿉니다.
 *
 * `ABC` 는 세 글리프를 서로 뒤섞으라는 뜻입니다. 방 세 개의 내용물이
 * 판마다 자리를 바꾸는 식이라, 외워 둔 볼트도 다시 살펴보게 만듭니다.
 * `AB/CD` 처럼 슬래시가 있으면 덩어리째 맞바꿉니다.
 * @param {string} line - SHUFFLE 값
 * @returns {Array<object>} 규칙들
 */
function parseShuffle(line) {
    const rules = [];

    for (const clause of line.split(',')) {
        const trimmed = clause.trim();
        if (trimmed === '') continue;

        if (trimmed.includes('/')) {
            const blocks = trimmed.split('/').map(b => [...b.trim()]);
            const width = blocks[0].length;
            if (blocks.some(b => b.length !== width)) return [];
            rules.push({ kind: 'blocks', blocks });
            continue;
        }

        rules.push({ kind: 'permute', glyphs: [...trimmed] });
    }

    return rules;
}

/**
 * 이 볼트를 쓸 수 있는지 봅니다.
 * @param {object} vault - 볼트
 * @param {number} maxSize - 받아들일 수 있는 최대 변 길이(타일)
 * @returns {string|null} 버리는 이유. 쓸 수 있으면 null
 */
function rejectionReason(vault, maxSize) {
    const height = vault.rows.length;
    const width = Math.max(...vault.rows.map(r => r.length));

    // 층 전체를 정의하는 볼트는 크기 잣대가 다릅니다. 방 하나가 아니라
    // 판 하나이므로 맵 전체에 들어가기만 하면 됩니다.
    //
    // 예전에는 이것들을 통째로 버렸습니다. 맵이 30x30 이던 시절에는 정말로
    // 들어가지 않았기 때문입니다. 80x70 으로 키우면서 그 이유는 사라졌는데
    // 필터는 그대로 두고 있었습니다.
    if (vault.orient) {
        if (vault.orient.trim() !== 'encompass') return 'orient';
        if (width > MAP_WIDTH || height > MAP_HEIGHT) return 'size';
    } else if (width > maxSize || height > maxSize) {
        return 'size';
    }

    // 읽을 수 없는 지시자가 있으면 반쯤만 이해한 채로 찍게 됩니다.
    for (const line of vault.nsubst) {
        if (parseNsubst(line).length === 0) return 'directive';
    }
    for (const line of vault.shuffle ?? []) {
        if (parseShuffle(line).length === 0) return 'directive';
    }

    // 아직 옮기지 않은 KFEAT 이 있으면 버립니다. 그 글리프가 무엇이 될지
    // 모르는 채로 찍으면 벽이어야 할 자리가 바닥이 되기도 합니다.
    for (const line of vault.kfeat) {
        if (!parseKfeat(line)) return 'kfeat';
    }
    // KMONS 는 글리프 하나에 몬스터를 직접 묶습니다. MONS 의 일곱 칸 제한을
    // 넘기려고 쓰는 것이라, 읽지 못하는 줄이 있으면 그 볼트는 버립니다.
    for (const line of vault.kmons) {
        if (!parseKmons(line)) return 'kmons';
    }

    // 모르는 글리프가 하나라도 있으면 버립니다.
    //
    // 다만 SUBST/NSUBST/SHUFFLE 이 갈아 끼울 자리는 legend 에 없어도 됩니다.
    // 그것들은 임시 표식이라 찍기 전에 사라집니다. 이 예외를 두지 않아서
    // 쥐덫 볼트처럼 'R 을 몬스터로 바꾼다' 는 볼트가 통째로 버려지고 있었습니다.
    const placeholders = new Set([
        ...vault.subst.map(l => parseSubst(l)?.from).filter(Boolean),
        ...vault.nsubst.flatMap(l => parseNsubst(l).map(r => r.from)),
        ...(vault.shuffle ?? []).flatMap(l => parseShuffle(l).flatMap(r => r.glyphs ?? r.blocks?.flat() ?? [])),
    ]);
    const kfeatGlyphs = new Set(vault.kfeat.flatMap(l => parseKfeat(l)?.glyphs ?? []));
    for (const line of vault.kmons) {
        for (const glyph of parseKmons(line)?.glyphs ?? []) kfeatGlyphs.add(glyph);
    }
    for (const row of vault.rows) {
        for (const glyph of row) {
            if (kfeatGlyphs.has(glyph) || placeholders.has(glyph)) continue;
            if (!(glyph in GLYPHS)) return `glyph:${glyph}`;
        }
    }

    // 몬스터 자리를 쓰는데 그 슬롯이 없으면 무엇을 놓을지 알 수 없습니다.
    const usedSlots = new Set();
    for (const row of vault.rows) {
        for (const glyph of row) {
            if (glyph >= '1' && glyph <= '7') usedSlots.add(Number(glyph));
        }
    }
    for (const slot of usedSlots) {
        if (!vault.mons[slot - 1]) return 'slot';
    }

    return null;
}

/**
 * SUBST 한 줄을 규칙으로 바꿉니다. (`? = TUV` 또는 `? : TUV`)
 * @param {string} line - SUBST 값
 * @returns {object|null} 규칙
 */
function parseSubst(line) {
    const matched = /^(\S)\s*([=:])\s*(.+)$/.exec(line);
    if (!matched) return null;

    const [, from, mode, rest] = matched;
    const choices = [];

    // `T:20 U V` 처럼 가중치가 붙습니다. 기본은 10 입니다.
    for (const token of rest.split(/\s+/).filter(Boolean)) {
        const weighted = /^(\S):(\d+)$/.exec(token);
        if (weighted) { choices.push({ glyph: weighted[1], weight: Number(weighted[2]) }); continue; }
        for (const glyph of token) choices.push({ glyph, weight: 10 });
    }

    if (choices.length === 0) return null;
    // `:` 는 볼트 전체가 같은 것으로 바뀝니다. `=` 는 칸마다 따로 굴립니다.
    return { from, once: mode === ':', choices };
}

/**
 * 원본의 몬스터 이름을 이 게임의 식별자로 바꿉니다.
 *
 * 원본은 'orc warrior' 처럼 띄어쓰기를, 이 게임은 'orc-warrior' 를 씁니다.
 * 없는 몬스터를 가리키는 볼트는 통째로 버립니다. 이름만 다른 것인지
 * 정말 없는 것인지 구분할 수 없으므로, 반쯤 채워진 방을 만드는 것보다 낫습니다.
 * @param {string} name - 원본 이름
 * @returns {string|null} 식별자
 */
function toMonsterId(name, known) {
    const cleaned = name.trim().toLowerCase().replace(/^(generate_awake|patrolling|band)\s+/, '');
    if (cleaned === '' || cleaned === 'nothing') return null;

    const id = cleaned.replace(/\s+/g, '-');
    return known.has(id) ? id : null;
}

/**
 * 이 게임이 아는 몬스터 식별자를 모읍니다.
 * @returns {Set<string>} 식별자들
 */
function knownMonsterIds() {
    const file = 'Script/data/monsters.js';
    if (!fs.existsSync(file)) return new Set();

    const text = fs.readFileSync(file, 'utf8');
    return new Set([...text.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]));
}

const source = process.argv[2] ?? DEFAULT_SOURCE;
const maxSize = Number(process.argv[3] ?? 12);

const known = knownMonsterIds();
const kept = [];
const rejected = {};

for (const relative of SOURCE_FILES) {
    const file = path.join(source, relative);
    if (!fs.existsSync(file)) {
        console.error(`찾을 수 없습니다: ${file}`);
        process.exit(1);
    }

    for (const vault of parseVaults(fs.readFileSync(file, 'utf8'))) {
        const reason = rejectionReason(vault, maxSize);
        if (reason) {
            const bucket = reason.startsWith('glyph:') ? 'glyph' : reason;
            rejected[bucket] = (rejected[bucket] ?? 0) + 1;
            continue;
        }

        // 모든 줄을 가장 긴 줄에 맞춰 늘립니다. 짧은 줄의 나머지는 볼트 밖입니다.
        // KFEAT 이 정한 글리프를 볼트마다 따로 기록합니다.
        // KMONS: 글리프 하나에 몬스터를 직접 묶습니다.
        const kmons = {};
        let unknownKmons = false;
        for (const line of vault.kmons) {
            const rule = parseKmons(line);
            if (!rule) { unknownKmons = true; break; }

            const ids = rule.names.map(name => toMonsterId(name, known)).filter(Boolean);
            if (ids.length === 0) { unknownKmons = true; break; }
            for (const glyph of rule.glyphs) kmons[glyph] = ids;
        }
        if (unknownKmons) { rejected.kmons = (rejected.kmons ?? 0) + 1; continue; }

        // 글리프마다의 그림. 여러 후보가 있으면 찍을 때 하나를 뽑습니다.
        const tiles = {};
        for (const entry of vault.tiles ?? []) {
            const parsed = parseTileDirective(entry.value);
            if (!parsed) continue;

            for (const glyph of parsed.glyphs) {
                // TILE 은 그 칸에 그릴 그림, FTILE 은 그 아래 깔릴 바닥입니다.
                const slot = entry.kind === 'FTILE' ? 'floor' : 'tile';
                tiles[glyph] = { ...(tiles[glyph] ?? {}), [slot]: parsed.names };
            }
        }

        const kfeat = {};
        for (const line of vault.kfeat) {
            const rule = parseKfeat(line);
            if (!rule) continue;
            for (const glyph of rule.glyphs) kfeat[glyph] = rule.choices;
        }

        const width = Math.max(...vault.rows.map(r => r.length));
        const rows = vault.rows.map(r => r.padEnd(width, ' '));

        // MONS 슬롯을 식별자로 옮깁니다. 하나라도 모르는 것이 있으면 버립니다.
        const slots = [];
        let unknownMonster = false;
        for (const slot of vault.mons) {
            const ids = slot.map(name => toMonsterId(name, known)).filter(Boolean);
            if (ids.length === 0) { unknownMonster = true; break; }
            slots.push(ids);
        }
        if (unknownMonster) { rejected.monster = (rejected.monster ?? 0) + 1; continue; }

        kept.push({
            name: vault.name,
            weight: vault.weight ?? 10,
            tags: vault.tags,
            rows,
            subst: vault.subst.map(parseSubst).filter(Boolean),
            nsubst: vault.nsubst.flatMap(parseNsubst),
            shuffle: (vault.shuffle ?? []).flatMap(parseShuffle),
            mons: slots,
            kfeat,
            // 층 전체를 정의하는 볼트는 미니볼트와 쓰이는 자리가 다릅니다.
            kmons,
            tiles,
            rockTile: vault.rockTile,
            floorTile: vault.floorTile,
            encompass: vault.orient?.trim() === 'encompass' || undefined,
        });
    }
}

const body = kept.map(v => `    ${JSON.stringify(v)},`).join('\n');

const out = `/**
 * @fileoverview DCSS 0.34 미니볼트. tools/import-vaults.js 가 만듭니다.
 *
 * 손으로 고치지 마세요. 원본은 crawl-ref/source/dat/des/ 입니다.
 *
 * 볼트는 손으로 그린 방입니다. 절차 생성이 만든 층 위에 찍어 넣으면
 * '누군가 설계한 곳'이 섞여 들어갑니다.
 *
 * 여기 있는 것은 방 하나 크기의 미니볼트뿐입니다. 층 전체를 정의하는
 * 볼트들은 80x70 을 전제로 쓰여 있어 이 게임의 30x30 에 들어가지 않습니다.
 *
 * 볼트 ${kept.length}개.
 */

export const VAULTS = [
${body}
];
`;

fs.writeFileSync(OUTPUT, out);

console.log(`볼트 ${kept.length}개를 가져왔습니다.`);
console.log('버린 것:', Object.entries(rejected).map(([k, v]) => `${k} ${v}`).join(', ') || '없음');
console.log(`→ ${OUTPUT}`);

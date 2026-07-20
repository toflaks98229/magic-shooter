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
        if (key === 'NAME') current = { name: value, tags: [], subst: [], nsubst: [], mons: [], kmons: [], kfeat: [] };
        if (!current) continue;

        if (key === 'TAGS') current.tags.push(...value.split(/\s+/).filter(Boolean));
        if (key === 'DEPTH') current.depth = value;
        if (key === 'WEIGHT') current.weight = Number.parseInt(value, 10) || 10;
        if (key === 'ORIENT') current.orient = value;
        if (key === 'SUBST') current.subst.push(value);
        if (key === 'MONS') current.mons.push(...splitSlots(value));
        if (key === 'KMONS') current.kmons.push(value);
        if (key === 'KFEAT') current.kfeat.push(value);
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
};

/**
 * 이 볼트를 쓸 수 있는지 봅니다.
 * @param {object} vault - 볼트
 * @param {number} maxSize - 받아들일 수 있는 최대 변 길이(타일)
 * @returns {string|null} 버리는 이유. 쓸 수 있으면 null
 */
function rejectionReason(vault, maxSize) {
    // 층 전체를 정의하는 볼트는 80x70 을 전제로 쓰여 있습니다.
    if (vault.orient) return 'orient';

    const height = vault.rows.length;
    const width = Math.max(...vault.rows.map(r => r.length));
    if (width > maxSize || height > maxSize) return 'size';

    // 아직 옮기지 않은 지시자가 있으면 반쯤만 이해한 채로 찍게 됩니다.
    if (vault.nsubst.length || vault.shuffle) return 'directive';

    // 아직 옮기지 않은 KFEAT 이 있으면 버립니다. 그 글리프가 무엇이 될지
    // 모르는 채로 찍으면 벽이어야 할 자리가 바닥이 되기도 합니다.
    for (const line of vault.kfeat) {
        if (!parseKfeat(line)) return 'kfeat';
    }
    // KMONS 는 아직 옮기지 않았습니다.
    if (vault.kmons.length > 0) return 'kmons';

    // 모르는 글리프가 하나라도 있으면 버립니다.
    const kfeatGlyphs = new Set(vault.kfeat.flatMap(l => parseKfeat(l)?.glyphs ?? []));
    for (const row of vault.rows) {
        for (const glyph of row) {
            if (kfeatGlyphs.has(glyph)) continue;
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
            mons: slots,
            kfeat,
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

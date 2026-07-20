/**
 * @fileoverview DCSS 0.34 의 몬스터 주문서를 게임이 읽을 수 있는 형태로 옮깁니다.
 *
 * 원본: crawl-ref/source/mon-spell.h 의 mspell_list[]
 *
 * 몬스터 정의는 주문서를 이름으로 가리킵니다. (spells: orc_wizard → MST_ORC_WIZARD)
 * 주문서 하나는 { 주문, 빈도, 깃발 } 의 목록이고, 빈도는 백분율이 아니라
 * 이백면체 위의 가중치입니다. 합이 200 에 못 미치면 그만큼 아무것도 시전하지 않습니다.
 *
 * 사용법: node tools/import-spellbooks.js [crawl 소스 경로]
 */

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_SOURCE = 'Data/crawl/crawl-ref/source';
const OUTPUT = 'Script/data/spellbooks.js';

/** @description 한 항목: { SPELL_X, 12, MON_SPELL_A | MON_SPELL_B }, */
const ENTRY = /\{\s*SPELL_([A-Z0-9_]+)\s*,\s*(\d+)\s*,\s*([A-Z0-9_|\s]+?)\s*\}/g;

/** @description 주문서 머리: {  MST_ORC_WIZARD, */
const BOOK_HEAD = /\{\s*MST_([A-Z0-9_]+)\s*,/g;

/**
 * mspell_list 를 주문서 목록으로 읽습니다.
 * @param {string} text - mon-spell.h 전문
 * @returns {Array<{name: string, slots: Array<object>}>} 주문서들
 */
function parseSpellbooks(text) {
    const start = text.indexOf('mspell_list[]');
    if (start < 0) throw new Error('mspell_list 를 찾지 못했습니다');

    const body = text.slice(start);
    const books = [];

    // 주문서 머리의 위치를 모두 찾아, 머리와 머리 사이를 그 주문서의 몸통으로 봅니다.
    // 중괄호를 세는 것보다 단순하고, 이 파일의 모양에서는 똑같이 정확합니다.
    const heads = [];
    BOOK_HEAD.lastIndex = 0;
    let head;
    while ((head = BOOK_HEAD.exec(body)) !== null) {
        heads.push({ name: head[1], at: head.index, end: BOOK_HEAD.lastIndex });
    }

    for (let i = 0; i < heads.length; i++) {
        const chunk = body.slice(heads[i].end, heads[i + 1]?.at ?? body.length);
        const slots = [];

        ENTRY.lastIndex = 0;
        let entry;
        while ((entry = ENTRY.exec(chunk)) !== null) {
            const flags = entry[3]
                .split('|')
                .map(f => f.trim().replace(/^MON_SPELL_/, ''))
                .filter(f => f && f !== 'NO_FLAGS');

            slots.push({ spell: entry[1], freq: Number(entry[2]), flags });
        }

        if (slots.length > 0) books.push({ name: heads[i].name, slots });
    }

    return books;
}

/**
 * 주문서 이름을 몬스터 정의가 쓰는 표기로 바꿉니다. (MST_ORC_WIZARD → orc_wizard)
 * @param {string} name - MST 이름
 * @returns {string} 소문자 이름
 */
function bookKey(name) {
    return name.toLowerCase();
}

const source = process.argv[2] ?? DEFAULT_SOURCE;
const file = path.join(source, 'mon-spell.h');

if (!fs.existsSync(file)) {
    console.error(`mon-spell.h 를 찾을 수 없습니다: ${file}`);
    console.error('crawl 소스 경로를 인자로 주세요.');
    process.exit(1);
}

const books = parseSpellbooks(fs.readFileSync(file, 'utf8'));

// 몬스터가 실제로 가리키는 주문서만 남깁니다.
const monsterFile = 'Script/data/monsters.js';
let referenced = null;
if (fs.existsSync(monsterFile)) {
    const monsterText = fs.readFileSync(monsterFile, 'utf8');
    referenced = new Set(
        [...monsterText.matchAll(/"spells":\s*"([a-z0-9_]+)"/g)].map(m => m[1]),
    );
}

const kept = referenced
    ? books.filter(b => referenced.has(bookKey(b.name)))
    : books;

const lines = kept
    .map(b => `    ${JSON.stringify(bookKey(b.name))}: ${JSON.stringify(b.slots)},`)
    .join('\n');

const out = `/**
 * @fileoverview DCSS 0.34 몬스터 주문서. tools/import-spellbooks.js 가 만듭니다.
 *
 * 손으로 고치지 마세요. 원본은 crawl-ref/source/mon-spell.h 입니다.
 *
 * freq 는 백분율이 아니라 이백면체 위의 가중치입니다. 합이 200 에 못 미치면
 * 그만큼의 확률로 아무것도 시전하지 않고, 그 턴에는 평소처럼 움직입니다.
 *
 * 주문서 ${kept.length}권, 슬롯 ${kept.reduce((n, b) => n + b.slots.length, 0)}개.
 */

export const SPELLBOOKS = {
${lines}
};
`;

fs.writeFileSync(OUTPUT, out);

const spells = new Set(kept.flatMap(b => b.slots.map(s => s.spell)));
console.log(`주문서 ${kept.length}권 (원본 ${books.length}권 중 몬스터가 가리키는 것)`);
console.log(`슬롯 ${kept.reduce((n, b) => n + b.slots.length, 0)}개, 서로 다른 주문 ${spells.size}가지`);
console.log(`→ ${OUTPUT}`);

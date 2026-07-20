/**
 * @fileoverview DCSS 데이터를 읽는 최소 YAML 파서를 확인합니다.
 *
 * 이 파서에는 한동안 테스트가 없었고, 그 사이에 실제로 데이터를 뭉개고 있었습니다.
 * 종족의 mutations 가 두 단계 중첩인데 한 단계만 다루도록 만들어져 있어,
 * 레벨 정보가 사라지고 MUT_HORNS 가 mutations 바로 아래로 올라붙었습니다.
 * 예외도 나지 않고 값도 그럴듯해 보여서 눈으로는 알 수 없었습니다.
 *
 * 파서가 조용히 틀리면 그 위에 쌓는 모든 수치가 함께 틀어지므로,
 * 여기서는 '읽히는가'가 아니라 '정확히 무엇으로 읽히는가'를 봅니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

const { parseYaml } = await import('../tools/lib/mini-yaml.js');

test('평탄한 값을 읽는다', () => {
    assert.deepEqual(parseYaml('name: "rat"\nhd: 1\nac: 0'), { name: 'rat', hd: 1, ac: 0 });
});

test('따옴표 안의 숫자는 문자열로 남는다', () => {
    // 스프라이트 키나 이름이 숫자로 바뀌면 조회가 어긋납니다.
    assert.deepEqual(parseYaml('a: "10"\nb: 10'), { a: '10', b: 10 });
});

test('음수와 소수를 읽는다', () => {
    assert.deepEqual(parseYaml('a: -3\nb: -1.5'), { a: -3, b: -1.5 });
});

test('참·거짓·빈값을 읽는다', () => {
    assert.deepEqual(parseYaml('a: true\nb: false\nc: null\nd: ~'),
        { a: true, b: false, c: null, d: null });
});

test('인라인 맵을 읽는다', () => {
    assert.deepEqual(parseYaml('glyph: {char: "r", colour: brown}'),
        { glyph: { char: 'r', colour: 'brown' } });
});

test('인라인 리스트를 읽는다', () => {
    assert.deepEqual(parseYaml('flags: [fighter, speaks, warm_blood]'),
        { flags: ['fighter', 'speaks', 'warm_blood'] });
});

test('블록 리스트를 읽는다', () => {
    assert.deepEqual(parseYaml('attacks:\n - {type: hit, damage: 3}\n - {type: bite, damage: 5}'),
        { attacks: [{ type: 'hit', damage: 3 }, { type: 'bite', damage: 5 }] });
});

test('스칼라만 있는 블록 리스트를 읽는다', () => {
    assert.deepEqual(parseYaml('levelup_stats:\n  - str\n  - dex'),
        { levelup_stats: ['str', 'dex'] });
});

test('블록 맵을 읽는다', () => {
    assert.deepEqual(parseYaml('aptitudes:\n  fighting: 2\n  axes: 2\n  spellcasting: -4'),
        { aptitudes: { fighting: 2, axes: 2, spellcasting: -4 } });
});

test('두 단계 중첩된 블록 맵을 읽는다', () => {
    // 이것이 파서를 다시 쓴 이유입니다. 예전에는 MUT_HORNS 가 mutations 바로 아래로
    // 올라붙어 '1레벨에 얻는다'는 정보가 통째로 사라졌습니다.
    assert.deepEqual(
        parseYaml('mutations:\n  1:\n    MUT_HORNS: 2\n    MUT_REFLEXIVE_HEADBUTT: 1'),
        { mutations: { 1: { MUT_HORNS: 2, MUT_REFLEXIVE_HEADBUTT: 1 } } });
});

test('중첩된 블록 뒤에 평탄한 값이 이어져도 깊이를 되찾는다', () => {
    // 블록이 끝난 뒤 다시 바깥으로 나오지 못하면 뒤따르는 값이 통째로 사라집니다.
    const parsed = parseYaml([
        'name: Minotaur',
        'mutations:',
        '  1:',
        '    MUT_HORNS: 2',
        'str: 12',
        'int: 5',
    ].join('\n'));
    assert.deepEqual(parsed, {
        name: 'Minotaur',
        mutations: { 1: { MUT_HORNS: 2 } },
        str: 12,
        int: 5,
    });
});

test('블록 맵과 블록 리스트가 한 문서에 섞여도 읽는다', () => {
    const parsed = parseYaml([
        'skills:',
        '  fighting: 3',
        '  armour: 3',
        'equipment:',
        '  - "scale mail"',
        '  - "buckler"',
        'weapon_choice: good',
    ].join('\n'));
    assert.deepEqual(parsed, {
        skills: { fighting: 3, armour: 3 },
        equipment: ['scale mail', 'buckler'],
        weapon_choice: 'good',
    });
});

test('빈 블록은 null 로 둔다', () => {
    assert.deepEqual(parseYaml('a: 1\nempty:\nb: 2'), { a: 1, empty: null, b: 2 });
});

test('주석과 빈 줄을 건너뛴다', () => {
    assert.deepEqual(parseYaml('# 머리말\n\nname: rat\n\n# 꼬리말\nhd: 1'),
        { name: 'rat', hd: 1 });
});

test('빈 문서는 빈 객체가 된다', () => {
    assert.deepEqual(parseYaml(''), {});
    assert.deepEqual(parseYaml('# 주석뿐\n'), {});
});

// --- 조용히 넘어가지 않아야 하는 것들 ------------------------------------------

test('콜론이 없는 줄은 예외를 던진다', () => {
    assert.throws(() => parseYaml('name rat'), /콜론이 없습니다/);
});

test('맵 안에 리스트 항목이 섞이면 예외를 던진다', () => {
    assert.throws(() => parseYaml('a: 1\n- b'), /리스트 항목/);
});

test('인라인 맵에 콜론이 없으면 예외를 던진다', () => {
    assert.throws(() => parseYaml('glyph: {char "r"}'), /인라인 맵에 콜론이 없습니다/);
});

// --- 실제 파일로 확인 ---------------------------------------------------------

test('실제 몬스터 파일을 온전히 읽는다', () => {
    const parsed = parseYaml([
        'name: "orc warrior"',
        'glyph: {char: "o", colour: yellow}',
        'flags: [fighter, speaks, warm_blood]',
        'exp: 133',
        'species: orc',
        'attacks:',
        ' - {type: hit, damage: 12}',
        'hd: 4',
        'hp_10x: 280',
        'ac: 0',
        'ev: 13',
    ].join('\n'));

    assert.equal(parsed.name, 'orc warrior');
    assert.equal(parsed.glyph.char, 'o');
    assert.deepEqual(parsed.flags, ['fighter', 'speaks', 'warm_blood']);
    assert.deepEqual(parsed.attacks, [{ type: 'hit', damage: 12 }]);
    assert.equal(parsed.hp_10x, 280);
    assert.equal(parsed.ev, 13);
});

test('리스트 항목이 여러 줄 맵이어도 읽는다', () => {
    // 종족의 fake_mutations 가 이 형태입니다.
    // 지원하지 않으면 예외가 나서 종족 이식이 통째로 멈춥니다.
    const parsed = parseYaml([
        'fake_mutations:',
        '  - long: You are resistant to damage.',
        '    short: damage resistance',
        '  - long: You can heal yourself.',
        '    short: heal wounds',
        'recommended_weapons:',
        '  - axes',
    ].join('\n'));

    assert.deepEqual(parsed, {
        fake_mutations: [
            { long: 'You are resistant to damage.', short: 'damage resistance' },
            { long: 'You can heal yourself.', short: 'heal wounds' },
        ],
        recommended_weapons: ['axes'],
    });
});

test('여러 줄 맵 리스트 뒤에도 바깥 깊이를 되찾는다', () => {
    const parsed = parseYaml([
        'a: 1',
        'items:',
        '  - k: v',
        '    j: w',
        'b: 2',
    ].join('\n'));
    assert.deepEqual(parsed, { a: 1, items: [{ k: 'v', j: 'w' }], b: 2 });
});

test('키 뒤의 꼬리 주석을 걷어낸다', () => {
    // 종족 파일에 `species_flags: # n.b. ants have hair` 같은 줄이 있습니다.
    // 걷어내지 않으면 값이 비었다는 것을 못 알아채고 주석을 값으로 읽어,
    // 뒤따르는 블록이 통째로 사라집니다.
    const parsed = parseYaml([
        'species_flags: # n.b. ants have hair',
        '  - no_bones',
        '  - no_ears',
        'str: 12  # 튼튼함',
    ].join('\n'));
    assert.deepEqual(parsed, { species_flags: ['no_bones', 'no_ears'], str: 12 });
});

test('따옴표 안의 # 은 주석이 아니다', () => {
    assert.deepEqual(parseYaml('colour: "#ff00ff"'), { colour: '#ff00ff' });
});

test('파이썬식 True/False/None 을 읽는다', () => {
    // DCSS 의 YAML 은 파이썬 도구가 만들어 대문자로 씁니다.
    // 소문자만 보면 문자열 "False" 로 읽히는데, 그 값이 하필 그럴듯해서
    // 데미갓의 '발동술을 배울 수 없음'이 문자열로 들어가 있었습니다.
    assert.deepEqual(parseYaml('a: True\nb: False\nc: None'),
        { a: true, b: false, c: null });
});

test('부호를 명시한 숫자를 읽는다', () => {
    // 적성표에 `alchemy: +1` 처럼 적힌 곳이 있습니다.
    // 더하기를 허용하지 않으면 문자열 "+1" 이 되어 계산이 조용히 NaN 으로 흘러갑니다.
    assert.deepEqual(parseYaml('a: +1\nb: -1\nc: +2.5'), { a: 1, b: -1, c: 2.5 });
});

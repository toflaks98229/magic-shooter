/**
 * @fileoverview 옮겨 온 종족·직업 데이터와 스킬 성장 체계를 확인합니다.
 *
 * 데이터 이식은 예외 없이 조용히 틀립니다. 이 파일을 쓰는 동안에도 세 가지가 나왔습니다.
 *   - 종족의 mutations 가 두 단계 중첩이라 레벨 정보가 사라지고 있었습니다
 *   - `species_flags: # 주석` 처럼 키 뒤에 주석이 붙으면 주석을 값으로 읽었습니다
 *   - 배울 수 없는 스킬을 뜻하는 False 를 문자열 "False" 로 읽었습니다
 * 셋 다 예외가 나지 않고 값이 그럴듯해 보였습니다. 그래서 값 하나하나를 대조합니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const S = await import('../Script/dcss/skills.js');

const species = JSON.parse(fs.readFileSync('Script/data/species.json', 'utf8'));
const jobs = JSON.parse(fs.readFileSync('Script/data/jobs.json', 'utf8'));

/** @param {string} id @returns {object} 종족 */
const sp = (id) => species.find(s => s.id === id);
/** @param {string} id @returns {object} 직업 */
const jb = (id) => jobs.find(j => j.id === id);

// --- 데이터 ------------------------------------------------------------------

test('종족과 직업이 충분히 들어왔다', () => {
    assert.ok(species.length >= 30, `종족이 ${species.length}종뿐입니다`);
    assert.ok(jobs.length >= 25, `직업이 ${jobs.length}종뿐입니다`);
});

test('폐기된 종족은 들어오지 않는다', () => {
    assert.ok(!species.some(s => s.id.startsWith('deprecated-')));
    assert.ok(!species.some(s => s.id === 'deep-dwarf'), '딥 드워프는 폐기되었습니다');
});

test('모든 종족이 능력치와 적성을 갖는다', () => {
    for (const s of species) {
        for (const field of ['str', 'int', 'dex']) {
            assert.ok(typeof s[field] === 'number', `${s.id}: ${field}`);
        }
        assert.ok(Object.keys(s.skillAptitudes).length > 20, `${s.id}: 적성이 부족합니다`);
        for (const field of ['hpMod', 'mpMod', 'xpMod', 'wlMod']) {
            assert.ok(typeof s[field] === 'number', `${s.id}: ${field}`);
        }
    }
});

test('적성 값이 숫자이거나 배울 수 없음(null)이다', () => {
    // 문자열이 섞이면 계산이 통째로 NaN 이 됩니다.
    // 실제로 False 를 문자열 "False" 로 읽던 시절이 있었습니다.
    for (const s of species) {
        for (const [skill, value] of Object.entries(s.skillAptitudes)) {
            assert.ok(value === null || typeof value === 'number',
                `${s.id}의 ${skill} 적성이 ${JSON.stringify(value)} 입니다`);
        }
    }
});

test('원본 수치가 그대로 옮겨졌다', () => {
    // YAML 을 직접 대조한 값입니다.
    const mino = sp('minotaur');
    assert.deepEqual({ str: mino.str, int: mino.int, dex: mino.dex }, { str: 12, int: 5, dex: 5 });
    assert.deepEqual({ hp: mino.hpMod, mp: mino.mpMod, xp: mino.xpMod, wl: mino.wlMod },
        { hp: 1, mp: -1, xp: -1, wl: 3 });
    assert.equal(mino.skillAptitudes.fighting, 2);
    assert.equal(mino.skillAptitudes.axes, 2);
    assert.equal(mino.skillAptitudes.spellcasting, -4);
});

test('두 단계 중첩된 변이가 살아 있다', () => {
    // 파서가 한 단계만 다루던 시절에는 MUT_HORNS 가 mutations 바로 아래로 올라붙어
    // '1레벨에 얻는다'는 정보가 사라졌습니다.
    assert.deepEqual(sp('minotaur').mutations, { 1: { MUT_HORNS: 2, MUT_REFLEXIVE_HEADBUTT: 1 } });
});

test('배울 수 없는 스킬이 원본과 같다', () => {
    // DCSS 는 이것을 False 로 적습니다. null 로 옮겨 적성 0 과 구분합니다.
    assert.equal(sp('demigod').skillAptitudes.invocations, null, '데미갓은 신을 섬기지 않습니다');
    assert.equal(sp('draconian-base').skillAptitudes.armour, null, '드라코니안은 갑옷을 못 입습니다');
    assert.equal(sp('draconian-black').skillAptitudes.armour, null, '색 드라코니안도 마찬가지입니다');
    assert.equal(sp('mummy').skillAptitudes.shapeshifting, null);

    // 펠리드는 고양이라 무기도 갑옷도 다룰 수 없습니다.
    const felid = sp('felid').skillAptitudes;
    for (const skill of ['short_blades', 'long_blades', 'axes', 'armour', 'shields', 'throwing']) {
        assert.equal(felid[skill], null, `펠리드가 ${skill} 을 배울 수 있게 되어 있습니다`);
    }
    assert.ok(typeof felid.unarmed_combat === 'number', '펠리드는 맨몸 전투는 배웁니다');
});

test('스킬 이름에 공백이 남아 있지 않다', () => {
    // 원본은 'ranged weapons' 만 공백이고 나머지는 밑줄입니다.
    // 섞여 있으면 조회할 때마다 어느 쪽인지 기억해야 합니다.
    const names = new Set(species.flatMap(s => Object.keys(s.skillAptitudes)));
    assert.deepEqual([...names].filter(n => n.includes(' ')), []);
    assert.ok(names.has('ranged_weapons'), '원거리 무기 스킬이 사라졌습니다');
});

test('모든 직업이 시작 스킬을 갖는다', () => {
    for (const j of jobs) {
        assert.ok(typeof j.str === 'number' && typeof j.int === 'number' && typeof j.dex === 'number',
            `${j.id}: 능력치`);
        // 방랑자는 시작 장비와 스킬이 매번 무작위라 표에 적혀 있지 않습니다.
        if (j.id === 'wanderer') continue;
        assert.ok(Object.keys(j.startingSkills).length > 0, `${j.id}: 시작 스킬이 없습니다`);
    }
});

test('직업의 시작 스킬이 원본과 같다', () => {
    assert.deepEqual(jb('fighter').startingSkills,
        { fighting: 3, armour: 3, shields: 3, weapon: 2 });
});

// --- 스킬 비용 ---------------------------------------------------------------

test('스킬 점수 요구량이 레벨에 따라 가파르게 는다', () => {
    assert.equal(S.baseSkillPointsFor(0), 0);
    assert.equal(S.baseSkillPointsFor(1), 50);   // 25 * 1 * 2

    for (let level = 1; level <= S.MAX_SKILL_LEVEL; level++) {
        assert.ok(S.baseSkillPointsFor(level) > S.baseSkillPointsFor(level - 1),
            `${level}레벨이 ${level - 1}레벨보다 싸집니다`);
    }
});

test('분기점을 넘으면 요구량이 한 번 더 꺾인다', () => {
    // 9·18·26 을 넘길 때마다 절반씩 더 붙습니다. 그 지점 전후의 증가폭을 비교합니다.
    const step = (level) => S.baseSkillPointsFor(level) - S.baseSkillPointsFor(level - 1);
    assert.ok(step(10) > step(9), '9를 넘어선 뒤 더 가팔라져야 합니다');
    assert.ok(step(19) > step(18), '18을 넘어선 뒤 더 가팔라져야 합니다');
});

test('범위를 벗어난 레벨은 조용히 넘어가지 않는다', () => {
    assert.throws(() => S.baseSkillPointsFor(-1), /스킬 레벨은/);
    assert.throws(() => S.baseSkillPointsFor(28), /스킬 레벨은/);
});

test('적성이 비용을 배로 바꾼다', () => {
    // 문서의 표현: +4 는 두 배 빨리, -4 는 절반 속도.
    assert.ok(Math.abs(S.aptitudeFactor(0) - 1) < 1e-9);
    assert.ok(Math.abs(S.aptitudeFactor(4) - 0.5) < 1e-9, '+4 는 비용 절반이어야 합니다');
    assert.ok(Math.abs(S.aptitudeFactor(-4) - 2) < 1e-9, '-4 는 비용 두 배여야 합니다');
    assert.equal(S.aptitudeFactor(null), Infinity, '배울 수 없으면 무한대입니다');
});

test('적성이 좋으면 같은 점수로 더 높이 오른다', () => {
    const points = 5000;
    const good = S.skillLevelFor(points, 3);
    const flat = S.skillLevelFor(points, 0);
    const bad = S.skillLevelFor(points, -3);
    assert.ok(good > flat && flat > bad,
        `적성 +3: ${good}, 0: ${flat}, -3: ${bad}`);
});

test('배울 수 없는 스킬은 아무리 부어도 0 이다', () => {
    assert.equal(S.skillLevelFor(1e9, null), 0);
    assert.equal(S.skillPointsNeeded(5, null), Infinity);
});

test('스킬 값은 레벨 사이를 소수로 잇는다', () => {
    // DCSS 공식은 스킬을 정수가 아니라 소수로 씁니다.
    // 정수로 자르면 피해와 명중이 계단처럼 끊깁니다.
    const aptitude = 0;
    const atLevel3 = S.skillPointsNeeded(3, aptitude);
    const atLevel4 = S.skillPointsNeeded(4, aptitude);
    const halfway = Math.round((atLevel3 + atLevel4) / 2);

    assert.equal(S.skillLevelFor(halfway, aptitude), 3, '레벨은 아직 3 입니다');
    const value = S.skillValueFor(halfway, aptitude);
    assert.ok(value > 3.4 && value < 3.6, `중간이면 3.5 근처여야 하는데 ${value.toFixed(3)} 입니다`);
});

test('최고 레벨을 넘지 않는다', () => {
    assert.equal(S.skillLevelFor(1e9, 5), S.MAX_SKILL_LEVEL);
    assert.equal(S.skillValueFor(1e9, 5), S.MAX_SKILL_LEVEL);
});

// --- 경험치 비용 --------------------------------------------------------------

test('성장할수록 스킬 점수가 비싸진다', () => {
    // 이것이 DCSS 후반 성장의 성격을 정합니다. 265 배까지 오릅니다.
    assert.equal(S.skillPointCost(1), 1);
    assert.equal(S.skillPointCost(27), 265);
    for (let level = 2; level <= 27; level++) {
        assert.ok(S.skillPointCost(level) >= S.skillPointCost(level - 1),
            `${level}단계가 ${level - 1}단계보다 싸집니다`);
    }
});

test('성장 단계가 범위를 벗어나도 멈추지 않는다', () => {
    assert.equal(S.skillPointCost(0), S.skillPointCost(1));
    assert.equal(S.skillPointCost(999), S.skillPointCost(27));
});

test('남는 경험치를 버리지 않는다', () => {
    // 조금씩 얻는 경험치가 사라지면 후반에 스킬이 아예 오르지 않습니다.
    const { points, spent, leftover } = S.trainWithExperience(100, 10);  // 비용 22
    assert.equal(points, 4);
    assert.equal(spent, 88);
    assert.equal(leftover, 12);
    assert.equal(spent + leftover, 100, '경험치 총량이 맞아야 합니다');
});

test('비용보다 적은 경험치로는 아무것도 오르지 않는다', () => {
    const { points, leftover } = S.trainWithExperience(10, 27);  // 비용 265
    assert.equal(points, 0);
    assert.equal(leftover, 10, '못 쓴 경험치는 그대로 남아야 합니다');
});

test('적히지 않은 스킬은 적성 0 으로 채워진다', () => {
    // 종족 파일은 0 이 아닌 적성만 적습니다. 드라코니안 밑틀은 열세 개뿐입니다.
    // 채우지 않으면 종족마다 스킬 목록이 달라져, 조회할 때마다 undefined 를 만나
    // 계산이 조용히 NaN 으로 흘러갑니다.
    const counts = new Set(species.map(s => Object.keys(s.skillAptitudes).length));
    assert.equal(counts.size, 1, `종족마다 스킬 수가 다릅니다: ${[...counts].join(', ')}`);
    assert.equal([...counts][0], 29, 'DCSS 의 스킬은 스물아홉 가지입니다');

    // 밑틀은 air_magic 을 적지 않으므로 0 이어야 합니다.
    assert.equal(sp('draconian-base').skillAptitudes.air_magic, 0);
    // 검은 드라코니안은 적어 두었으므로 그 값이어야 합니다.
    assert.equal(sp('draconian-black').skillAptitudes.air_magic, 2);
});

test('색 드라코니안은 따로 고를 수 없다', () => {
    // 드라코니안을 고르면 7레벨에 색이 정해집니다. 목록에는 밑틀 하나만 나옵니다.
    assert.equal(sp('draconian-base').selectable, true);
    for (const id of ['draconian-black', 'draconian-red', 'draconian-white']) {
        assert.equal(sp(id).selectable, false, `${id} 가 목록에 나옵니다`);
    }
    assert.ok(species.filter(s => s.selectable).length >= 25, '고를 수 있는 종족이 너무 적습니다');
});

test('모르는 스킬 이름이 들어오면 이식이 멈춘다', async () => {
    // 원본에 새 스킬이 생기면 조용히 버려지지 않고 드러나야 합니다.
    const { importCharacters } = await import('../tools/import-characters.js');
    assert.ok(typeof importCharacters === 'function');
});

/**
 * @fileoverview 칭호가 스킬을 따라 바뀌는지 검사합니다.
 *
 * 칭호가 좋은 이유는 플레이어가 무엇을 해 왔는지가 이름에 남기 때문입니다.
 * 레벨 숫자는 얼마나 오래 했는지만 말하지만, 칭호는 어떻게 해 왔는지를 말합니다.
 * 그래서 여기서 가장 중요한 검사는 '스킬을 올리면 실제로 바뀌는가' 입니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { installBrowserStubs } from './helpers/browser-stubs.js';

installBrowserStubs();

const T = await import('../Script/dcss/titles.js');
const { SPECIES } = await import('../Script/species.js');
const worldModule = await import('../Script/world.js');
const character = await import('../Script/character.js');
const { skillValue } = await import('../Script/dcss/training.js');

/** 스킬 수준을 바로 넘기는 읽기 함수. 표 자체를 볼 때 씁니다. */
const readLevel = (skills, skill) => skills[skill] ?? 0;

// --- 칸 나누기 -------------------------------------------------------------------

test('스킬 수준이 다섯 칸으로 나뉜다', () => {
    // 원본과 같아야 합니다. (skills.cc:1923)
    assert.equal(T.skillRank(0), 0);
    assert.equal(T.skillRank(7), 0);
    assert.equal(T.skillRank(8), 1);
    assert.equal(T.skillRank(14), 1);
    assert.equal(T.skillRank(15), 2);
    assert.equal(T.skillRank(20), 2);
    assert.equal(T.skillRank(21), 3);
    assert.equal(T.skillRank(26), 3);
    assert.equal(T.skillRank(27), 4);
});

// --- 표 -------------------------------------------------------------------------

test('격투 사다리가 원본과 같다', () => {
    const ladder = [0, 8, 15, 21, 27].map(level => T.skillTitle('fighting', T.skillRank(level), {}));
    assert.deepEqual(ladder, ['Trooper', 'Fighter', 'Warrior', 'Slayer', 'Conqueror']);
});

test('회피 사다리가 원본과 같다', () => {
    const ladder = [0, 8, 15, 21, 27].map(level => T.skillTitle('dodging', T.skillRank(level), {}));
    assert.deepEqual(ladder, ['Ducker', 'Nimble', 'Spry', 'Acrobat', 'Intangible']);
});

test('모든 스킬에 다섯 칸이 있다', () => {
    for (const skill of T.titledSkills()) {
        for (let rank = 0; rank <= 4; rank++) {
            const title = T.skillTitle(skill, rank, { species: SPECIES['deep-elf'] });
            assert.ok(title && title.length > 0, `${skill} 의 ${rank} 칸이 비어 있습니다`);
            assert.ok(!title.includes('@'), `${skill} 의 ${rank} 칸에 채우지 않은 자리가 남았습니다: ${title}`);
        }
    }
});

// --- 자리 채우기 -----------------------------------------------------------------

test('종족 이름이 자리에 들어간다', () => {
    const elf = SPECIES['deep-elf'];
    if (!elf) return;

    const title = T.skillTitle('necromancy', 4, { species: elf });
    assert.ok(title.includes(elf.enName), `종족 이름이 안 들어갔습니다: ${title}`);
});

test('맨손 격투는 민첩이 높으면 다른 사다리를 쓴다', () => {
    // 원본도 힘과 민첩을 비교합니다. (skills.cc:2070)
    const strong = T.skillTitle('unarmed_combat', 4, { str: 15, dex: 10 });
    const nimble = T.skillTitle('unarmed_combat', 4, { str: 10, dex: 15 });

    assert.notEqual(strong, nimble, '힘과 민첩에 따라 갈리지 않습니다');
    assert.equal(nimble, 'Grand Master');
    assert.ok(strong.endsWith('weight Champion'), `체급 칭호가 아닙니다: ${strong}`);
});

test('기원이 가장 높고 신을 섬기면 신도 칭호가 나온다', () => {
    // 원본은 기원 스킬의 칭호 자리를 신앙심에 따른 칭호로 대신합니다.
    const atheist = T.skillTitle('invocations', 4, {});
    const believer = T.skillTitle('invocations', 4, { god: 'trog', pietyRank: 7 });

    assert.equal(atheist, 'Apostate', '무신론자는 스킬 사다리를 씁니다');
    assert.equal(believer, 'Bane of Scribes', '트로그 최고 신앙 칭호가 아닙니다');
});

test('신앙심이 오르면 신도 칭호도 오른다', () => {
    const seen = new Set();
    for (let rank = 0; rank <= 7; rank++) {
        seen.add(T.skillTitle('invocations', 4, { god: 'zin', pietyRank: rank }));
    }
    assert.equal(seen.size, 8, '신앙심 칸마다 다른 칭호가 나와야 합니다');
});

// --- 가장 높은 스킬 ---------------------------------------------------------------

test('가장 높은 스킬이 칭호를 정한다', () => {
    assert.equal(T.bestSkill({ fighting: 5, dodging: 12 }, readLevel), 'dodging');
    assert.equal(T.bestSkill({ fighting: 20, dodging: 12 }, readLevel), 'fighting');
});

test('아무 스킬도 없으면 격투로 시작한다', () => {
    // 원본의 기본값과 같습니다. (skills.cc:2321)
    assert.equal(T.bestSkill({}, readLevel), 'fighting');
    assert.equal(T.playerTitle({}, readLevel, {}), 'Trooper');
});

// --- 이름과 잇기 -----------------------------------------------------------------

test('이름과 칭호를 the 로 잇는다', () => {
    assert.equal(T.titleLine('아리아', 'Warrior'), '아리아 the Warrior');
});

test('너무 길면 the 대신 쉼표를 쓴다', () => {
    // 원본도 마흔두 칸을 넘으면 이렇게 합니다. (output.cc:1450)
    const long = T.titleLine('아주아주긴이름을가진사람', 'Victor of a Thousand Battles');
    assert.ok(long.includes(','), `줄이지 않았습니다: ${long}`);
    assert.ok(!long.includes(' the '), 'the 가 남았습니다');
});

// --- 게임에 붙었는가 -------------------------------------------------------------

test('스킬을 올리면 칭호가 실제로 바뀐다', () => {
    // 이것이 이 시스템의 요점입니다. 붙여 놓고 바뀌지 않으면
    // 이름 옆에 고정된 글자가 하나 늘 뿐입니다.
    worldModule.resetWorld();
    character.applyCharacter('deep-elf', 'fighter', null);

    const player = worldModule.world.player;
    const seen = [];

    for (const points of [0, 2000, 12000, 40000]) {
        player.skills.points = { fighting: points };
        seen.push(character.characterTitle());
    }

    assert.equal(new Set(seen).size, seen.length,
        `칭호가 바뀌지 않았습니다: ${seen.join(', ')}`);
    assert.equal(seen[0], 'Trooper');
    assert.equal(seen[3], 'Conqueror');
});

test('적성을 넘기지 않으면 칭호가 굳는다', () => {
    // 실제로 겪은 결함입니다. 적성이 없으면 필요 점수가 무한이 되어
    // 어떤 스킬도 0 수준을 벗어나지 못합니다.
    const withoutAptitude = skillValue({ points: { fighting: 40000 } }, 'fighting');
    assert.equal(withoutAptitude, 0, '적성 없이도 수준이 오르면 이 검사는 뜻이 없습니다');

    const withAptitude = skillValue({ points: { fighting: 40000 } }, 'fighting',
        character.aptitudeFor('fighting'));
    assert.ok(withAptitude > 20, `적성을 넘겼는데 수준이 ${withAptitude} 입니다`);
});

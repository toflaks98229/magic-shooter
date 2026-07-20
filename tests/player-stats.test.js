/**
 * @fileoverview 상태창에 뜨는 값들이 실제 값인지 검사합니다.
 *
 * 자리만 만들고 숫자를 채우지 않으면 빈칸이 늘 뿐이고, 표시용으로 따로
 * 계산하면 화면의 숫자와 실제로 굴리는 값이 어긋납니다.
 * 그런 어긋남은 눈으로 알아채기 어려워 검사로 묶어 둡니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { installBrowserStubs } from './helpers/browser-stubs.js';

installBrowserStubs();

const S = await import('../Script/dcss/playerStats.js');
const { SPECIES } = await import('../Script/species.js');
const worldModule = await import('../Script/world.js');
const character = await import('../Script/character.js');

// --- 경험치 표 -------------------------------------------------------------------

test('경험치 표가 원본과 같다', () => {
    // 원본 주석에 적힌 표를 그대로 대조합니다. (player.cc:3680)
    const expected = {
        1: 0, 2: 10, 3: 30, 4: 70, 5: 140, 6: 270, 7: 520, 8: 1010,
        9: 1980, 10: 3910, 11: 7760, 12: 15450, 13: 26895, 14: 45585,
        15: 72745, 20: 335595, 27: 1059325,
    };

    for (const [level, experience] of Object.entries(expected)) {
        assert.equal(S.experienceNeeded(Number(level)), experience,
            `레벨 ${level} 의 필요 경험치가 다릅니다`);
    }
});

test('누적 경험치에서 수준이 나온다', () => {
    assert.equal(S.experienceLevel(0), 1);
    assert.equal(S.experienceLevel(9), 1, '모자라면 오르지 않습니다');
    assert.equal(S.experienceLevel(10), 2);
    assert.equal(S.experienceLevel(1059325), 27);
});

test('수준이 스물일곱을 넘지 않는다', () => {
    assert.equal(S.experienceLevel(99999999), S.MAX_EXPERIENCE_LEVEL);
});

test('다음 수준까지의 진행도가 나온다', () => {
    // 레벨 2 는 10, 레벨 3 은 30 이므로 15 는 그 사이 4분의 1 입니다.
    assert.equal(S.experienceProgress(15), 25);
    assert.equal(S.experienceProgress(10), 0);
    assert.equal(S.experienceProgress(1059325), 0, '최대 수준에서는 0 입니다');
});

// --- 능력치 ----------------------------------------------------------------------

test('능력치가 종족에서 시작한다', () => {
    const gargoyle = SPECIES.gargoyle;
    if (!gargoyle) return;

    const stats = S.playerStats(gargoyle, 1);
    assert.equal(stats.str, gargoyle.str);
    assert.equal(stats.int, gargoyle.int);
    assert.equal(stats.dex, gargoyle.dex);
});

test('세 수준마다 능력치가 하나 오른다', () => {
    const species = SPECIES.gargoyle ?? Object.values(SPECIES)[0];

    const start = S.playerStats(species, 1);
    const later = S.playerStats(species, 27);
    const startTotal = start.str + start.int + start.dex;
    const laterTotal = later.str + later.int + later.dex;

    // 1 에서 27 까지면 여덟 번 오릅니다.
    assert.equal(laterTotal - startTotal, Math.floor(26 / 3),
        `총합이 ${laterTotal - startTotal} 만큼 올랐습니다`);
});

// --- 방어 ------------------------------------------------------------------------

test('타고난 방어도가 있는 종족과 없는 종족이 갈린다', () => {
    // 값이 늘 0 이면 자리를 만들어 둔 뜻이 없습니다.
    const gargoyle = SPECIES.gargoyle;
    const human = SPECIES.human;
    if (!gargoyle || !human) return;

    assert.ok(S.playerAC(gargoyle, 1) > 0, '가고일에게 자연 방어도가 없습니다');
    assert.equal(S.playerAC(human, 1), 0, '사람에게 자연 방어도가 있습니다');
});

test('타고난 방어도는 수준에 따라 두꺼워진다', () => {
    const gargoyle = SPECIES.gargoyle;
    if (!gargoyle) return;

    assert.ok(S.playerAC(gargoyle, 27) > S.playerAC(gargoyle, 1),
        '수준이 올라도 방어도가 그대로입니다');
});

// --- 회피가 한 곳에서 나온다 -------------------------------------------------------

test('전투와 상태창이 같은 회피를 본다', () => {
    // 따로 계산하면 화면에 뜨는 숫자와 실제로 굴리는 값이 어긋납니다.
    worldModule.resetWorld();
    character.applyCharacter('deep-elf', 'fighter', null);

    const player = worldModule.world.player;
    const species = SPECIES['deep-elf'];

    const shown = S.currentPlayerEvasion(player, species, character.aptitudeFor);
    assert.ok(shown > 0, '회피가 0 입니다');

    // 회피 스킬을 올리면 값이 따라 올라야 합니다.
    player.skills.points = { dodging: 40000 };
    const trained = S.currentPlayerEvasion(player, species, character.aptitudeFor);
    assert.ok(trained > shown, `스킬을 올렸는데 회피가 ${shown} 에서 ${trained} 입니다`);
});

// --- 경험치가 실제로 쌓인다 -------------------------------------------------------

test('적을 잡으면 누적 경험치가 쌓인다', async () => {
    // 이것이 없으면 수준은 영원히 1 입니다.
    const { gainExperience, createSkillState } = await import('../Script/dcss/training.js');

    const state = createSkillState();
    assert.equal(state.totalGained, 0);

    gainExperience(state, 500, () => 0);
    assert.equal(state.totalGained, 500, '얻은 경험치가 쌓이지 않았습니다');

    gainExperience(state, 300, () => 0);
    assert.equal(state.totalGained, 800, '더한 것이 누적되지 않았습니다');
});

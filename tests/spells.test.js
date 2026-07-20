/**
 * @fileoverview 몬스터가 주문을 고르고 쓰는 규칙을 검사합니다.
 *
 * 원본의 빈도는 '턴마다 한 번 굴린다'를 전제로 맞춰져 있습니다.
 * 그 전제가 깨지면 수치는 그대로인데 체감은 완전히 달라지므로,
 * 굴리는 간격을 지키는지가 여기서 가장 중요한 검사입니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    SPELL_EFFECTS, spellPower, rollSpellDamage,
    pickSpellSlot, pickEmergencySpell, isImplemented, rollBreathCooldownMs,
} from '../Script/dcss/spells.js';
import { SPELLBOOKS } from '../Script/data/spellbooks.js';
import { resetRandomSource } from '../Script/dcss/random.js';

/** @description 평범한 상황. 다치지 않았고 중간 거리입니다. */
const CALM = { hpFraction: 1, distanceTiles: 5, breathReady: true };

// --- 주문서 데이터 -------------------------------------------------------------

test('주문서가 원본과 같다', () => {
    // 오크 마법사는 원본에서 마법 화살 9, 화염 9, 혼란 18, 투명화 9 입니다.
    assert.deepEqual(SPELLBOOKS.orc_wizard, [
        { spell: 'MAGIC_DART', freq: 9, flags: ['WIZARD'] },
        { spell: 'THROW_FLAME', freq: 9, flags: ['WIZARD'] },
        { spell: 'CONFUSE', freq: 18, flags: ['WIZARD'] },
        { spell: 'INVISIBILITY', freq: 9, flags: ['WIZARD'] },
    ]);
});

test('숨결에는 깃발이 붙어 있다', () => {
    // 이 깃발이 없으면 쿨다운이 걸리지 않아 드래곤이 쉬지 않고 뿜습니다.
    const breath = SPELLBOOKS.fire_dragon_breath[0];
    assert.equal(breath.spell, 'FIRE_BREATH');
    assert.ok(breath.flags.includes('BREATH'), '숨결 깃발이 없습니다');
});

// --- 위력 ----------------------------------------------------------------------

test('위력이 HD 에 비례하되 완만하게 오른다', () => {
    // 다섯 배의 HD 차이가 두 배 남짓의 피해 차이가 됩니다.
    // 깊은 곳의 시전자가 위험하되 한 방은 아니게 하는 성질입니다.
    resetRandomSource();
    const avg = (hd) => {
        let total = 0;
        for (let i = 0; i < 4000; i++) total += rollSpellDamage('BOLT_OF_FIRE', hd);
        return total / 4000;
    };
    const low = avg(4), high = avg(20);
    assert.ok(high > low * 1.8, `HD4 ${low.toFixed(1)}, HD20 ${high.toFixed(1)}`);
    assert.ok(high < low * 3, 'HD 가 다섯 배인데 피해가 세 배를 넘었습니다');
});

test('위력과 무관한 고정 피해 주문이 있다', () => {
    // 지옥불은 3d20 으로 HD 를 보지 않습니다. 이 성질을 지키지 않으면
    // 약한 악마가 뿜는 지옥불이 시시해집니다.
    resetRandomSource();
    const sample = (hd) => {
        let total = 0, lowest = Infinity, highest = 0;
        for (let i = 0; i < 8000; i++) {
            const d = rollSpellDamage('HURL_DAMNATION', hd);
            total += d;
            lowest = Math.min(lowest, d);
            highest = Math.max(highest, d);
        }
        return { mean: total / 8000, lowest, highest };
    };

    const weak = sample(5), strong = sample(25);

    // 3d20 이므로 3~60 안에 있고 평균은 31.5 입니다.
    // 양 끝은 팔천 분의 일씩이라 표본에 잡히지 않을 수 있어 범위만 봅니다.
    for (const s of [weak, strong]) {
        assert.ok(s.lowest >= 3 && s.highest <= 60, `3d20 범위를 벗어났습니다: ${s.lowest}~${s.highest}`);
    }
    assert.ok(Math.abs(weak.mean - strong.mean) < 1,
        `HD 가 달라도 같아야 합니다: HD5 ${weak.mean.toFixed(1)}, HD25 ${strong.mean.toFixed(1)}`);
    assert.ok(Math.abs(weak.mean - 31.5) < 1, `기대 평균 31.5, 실제 ${weak.mean.toFixed(1)}`);
});

test('고통만 위력에 바닥이 있다', () => {
    // 원본은 고통을 최소 50 으로 받칩니다. (mon-cast.cc:2162)
    assert.equal(spellPower('PAIN', 1), 50);
    assert.equal(spellPower('PAIN', 10), 120);
    assert.equal(spellPower('BOLT_OF_FIRE', 1), 12, '다른 주문에는 바닥이 없습니다');
});

test('주문마다 HD 계수가 다르다', () => {
    assert.equal(spellPower('CAUSE_FEAR', 10), 180);   // 계수 18
    assert.equal(spellPower('DRAIN_LIFE', 10), 10);    // 계수 1
    assert.equal(spellPower('BOLT_OF_FIRE', 10), 120); // 기본 12
});

// --- 고르기 --------------------------------------------------------------------

test('빈도 합이 시전 확률을 정한다', () => {
    // 빈도는 백분율이 아니라 이백면체 위의 가중치입니다.
    // 합이 200 에 못 미치면 그만큼 아무것도 하지 않고, 그 턴은 공짜입니다.
    resetRandomSource();
    const rate = (slots) => {
        let hit = 0;
        for (let i = 0; i < 20000; i++) if (pickSpellSlot(slots, CALM)) hit++;
        return hit / 20000;
    };

    const half = [{ spell: 'BOLT_OF_FIRE', freq: 100, flags: [] }];
    assert.ok(Math.abs(rate(half) - 0.5) < 0.03, `기대 0.5, 실제 ${rate(half).toFixed(3)}`);

    const always = [{ spell: 'BOLT_OF_FIRE', freq: 200, flags: [] }];
    assert.equal(rate(always), 1, '빈도 200 은 언제나 시전해야 합니다');
});

test('빈도 0 은 뽑히지 않는다', () => {
    // 원본도 목록에서 지웁니다. 정해진 계기로만 나가는 주문들입니다.
    resetRandomSource();
    const slots = [{ spell: 'BOLT_OF_FIRE', freq: 0, flags: [] }];
    for (let i = 0; i < 500; i++) assert.equal(pickSpellSlot(slots, CALM), null);
});

test('만들지 않은 주문은 조용히 넘어간다', () => {
    // 이백여든두 가지를 다 만들지는 않았습니다.
    // 없는 효과를 있는 척하는 것보다 넘어가는 편이 낫습니다.
    assert.equal(isImplemented({ spell: 'SYMBOL_OF_TORMENT' }), false);
    assert.equal(isImplemented({ spell: 'BOLT_OF_FIRE' }), true);

    resetRandomSource();
    const slots = [{ spell: 'SYMBOL_OF_TORMENT', freq: 200, flags: [] }];
    for (let i = 0; i < 300; i++) assert.equal(pickSpellSlot(slots, CALM), null);
});

test('급할 때만 쓰는 주문은 다쳐야 열린다', () => {
    resetRandomSource();
    const slots = [{ spell: 'BLINK', freq: 200, flags: ['EMERGENCY'] }];

    for (let i = 0; i < 300; i++) {
        assert.equal(pickSpellSlot(slots, CALM), null, '멀쩡한데 급할 때 주문이 나왔습니다');
    }
    const hurt = { ...CALM, hpFraction: 0.2 };
    assert.ok(pickSpellSlot(slots, hurt), '다쳤는데도 열리지 않았습니다');
});

test('거리 제한이 있는 주문이 있다', () => {
    resetRandomSource();
    const near = [{ spell: 'BLINK', freq: 200, flags: ['SHORT_RANGE'] }];
    const far = [{ spell: 'BLINK', freq: 200, flags: ['LONG_RANGE'] }];

    assert.ok(pickSpellSlot(near, { ...CALM, distanceTiles: 1 }), '가까운데 안 나왔습니다');
    assert.equal(pickSpellSlot(near, { ...CALM, distanceTiles: 6 }), null, '먼데 나왔습니다');

    assert.ok(pickSpellSlot(far, { ...CALM, distanceTiles: 6 }), '먼데 안 나왔습니다');
    assert.equal(pickSpellSlot(far, { ...CALM, distanceTiles: 1 }), null, '가까운데 나왔습니다');
});

test('쉬는 동안에는 숨결이 빠진다', () => {
    resetRandomSource();
    const slots = [{ spell: 'FIRE_BREATH', freq: 200, flags: ['NATURAL', 'BREATH'] }];

    assert.ok(pickSpellSlot(slots, CALM), '준비됐는데 안 나왔습니다');
    const resting = { ...CALM, breathReady: false };
    for (let i = 0; i < 300; i++) {
        assert.equal(pickSpellSlot(slots, resting), null, '쉬는 중에 숨결이 나왔습니다');
    }
});

test('숨결 쿨다운이 1d5 턴이다', () => {
    resetRandomSource();
    const seen = new Set();
    for (let i = 0; i < 500; i++) seen.add(rollBreathCooldownMs());
    // 한 턴은 10 aut, aut 하나는 50ms 이므로 500ms~2500ms 입니다.
    assert.equal(Math.min(...seen), 500);
    assert.equal(Math.max(...seen), 2500);
    assert.equal(seen.size, 5, '다섯 가지 값이 나와야 합니다');
});

test('궁지에 몰리면 빈도를 무시하고 아무거나 집는다', () => {
    resetRandomSource();
    const slots = [{ spell: 'BLINK', freq: 1, flags: [] }];

    // 멀쩡할 때는 절대 안 열립니다.
    for (let i = 0; i < 300; i++) {
        assert.equal(pickEmergencySpell(slots, CALM), null);
    }

    // 피가 삼분의 일 아래면 여덟 번에 한 번꼴로 열립니다.
    let opened = 0;
    for (let i = 0; i < 4000; i++) {
        if (pickEmergencySpell(slots, { ...CALM, hpFraction: 0.2 })) opened++;
    }
    assert.ok(opened > 300 && opened < 700, `기대 약 500, 실제 ${opened}`);
});

// --- 효과표 --------------------------------------------------------------------

test('뚫는 광선과 안 뚫는 광선이 갈린다', () => {
    // 원본의 can_beam 입니다. 뚫는 것은 줄지어 선 적을 한 번에 지납니다.
    assert.equal(SPELL_EFFECTS.BOLT_OF_FIRE.pierce, true);
    assert.equal(SPELL_EFFECTS.LIGHTNING_BOLT.pierce, true);
    assert.ok(!SPELL_EFFECTS.IRON_SHOT.pierce, '쇠 화살은 뚫지 않습니다');
    assert.ok(!SPELL_EFFECTS.MAGIC_DART.pierce, '마법 화살은 뚫지 않습니다');
});

test('터지는 주문에는 폭발 반경이 있다', () => {
    assert.ok(SPELL_EFFECTS.FIREBALL.blastTiles > 0);
    assert.ok(SPELL_EFFECTS.HURL_DAMNATION.blastTiles > 0);
    assert.ok(!SPELL_EFFECTS.BOLT_OF_FIRE.blastTiles, '광선은 터지지 않습니다');
});

test('겨눌 필요 없는 주문은 공기 강타뿐이다', () => {
    // 겨누고 피하는 게임에서 피할 수 없는 피해는 잘 해낸 것을 벌합니다.
    // 공기 강타만 남긴 것은 주변이 트일수록 아프다는 규칙 때문입니다.
    const smites = Object.entries(SPELL_EFFECTS)
        .filter(([, e]) => e.kind === 'smite')
        .map(([name]) => name);
    assert.deepEqual(smites, ['AIRSTRIKE']);
});

// --- 새 원형들 -----------------------------------------------------------------

test('소환 주문이 계열별로 갈린다', () => {
    // 마흔 가지를 낱낱이 옮기는 대신 계열로 묶었습니다.
    // 정확한 이식은 아니지만 부르는 쪽의 성격은 남습니다.
    assert.equal(SPELL_EFFECTS.SUMMON_DEMON.family, 'demonic');
    assert.equal(SPELL_EFFECTS.SUMMON_UNDEAD.family, 'undead');
    assert.equal(SPELL_EFFECTS.SUMMON_DRAGON.family, 'dragon');

    // 더 센 것을 부르는 주문과 약한 것을 부르는 주문이 갈립니다.
    assert.equal(SPELL_EFFECTS.SUMMON_GREATER_DEMON.stronger, true);
    assert.equal(SPELL_EFFECTS.SUMMON_MINOR_DEMON.weaker, true);
});

test('마비와 혼란은 일부러 넣지 않았다', () => {
    // 조작을 빼앗거나 뒤집는 것은 실시간 일인칭에서 견디기 어렵습니다.
    // 대응할 여지가 없는 피해는 잘 해낸 것을 벌합니다.
    for (const skipped of ['PARALYSE', 'CONFUSE', 'MASS_CONFUSION', 'SYMBOL_OF_TORMENT', 'BANISHMENT']) {
        assert.equal(isImplemented({ spell: skipped }), false, `${skipped} 가 들어가 있습니다`);
    }
    // 느려지는 것은 남겼습니다. 살아남을 수 있고 길을 다시 짜게 만듭니다.
    assert.equal(SPELL_EFFECTS.SLOW.debuff, 'slow');
});

test('투명화는 흐려지는 것으로 바꿨다', () => {
    // 원본은 완전히 안 보이게 만듭니다. 실시간 일인칭에서 어디서 오는지
    // 알 수 없는 피해는 대응할 여지가 없습니다.
    assert.equal(SPELL_EFFECTS.INVISIBILITY.kind, 'selfBuff');
    assert.equal(SPELL_EFFECTS.INVISIBILITY.buff, 'blur');
});

test('흡혈은 붙어야만 된다', () => {
    // 원본도 인접일 때만 씁니다. (mon-cast.cc:2273)
    assert.ok(SPELL_EFFECTS.VAMPIRIC_DRAINING.range <= 2, '흡혈이 멀리서 됩니다');
    assert.equal(SPELL_EFFECTS.VAMPIRIC_DRAINING.heals, true);
    // 생명 흡수는 멀리서도 됩니다.
    assert.ok(SPELL_EFFECTS.DRAIN_LIFE.range > 2);
});

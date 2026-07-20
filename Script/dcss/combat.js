/**
 * @fileoverview DCSS 의 전투 수식입니다. 0.34 기준입니다.
 *
 * 이 파일은 '피해가 얼마인가'만 다룹니다. '맞았는가'는 조준이 정합니다.
 * 가이드라인의 C 라인이 그렇게 나누기로 한 부분입니다.
 *
 * 다만 DCSS 가 EV(회피)로 표현하던 '맞추기 어려움'을 버리지는 않습니다.
 * 원본의 명중 확률을 그대로 계산한 뒤, 그 확률을 히트박스 크기로 옮깁니다.
 * 회피가 높은 몬스터는 조준해야 할 과녁이 작아집니다.
 *
 * 수식은 한 줄도 바꾸지 않았습니다. 굴림의 분포까지 원본 그대로입니다.
 * 정수 나눗셈과 반올림 방식이 결과를 바꾸므로 dcss/random.js 를 반드시 거칩니다.
 *
 * 출처: crawl-ref/source 의 actor.cc, attack.cc, fight.cc, mon-util.cc
 *       (trunk 와 0.34 를 대조한 결과 아래 수식들은 완전히 같았습니다)
 */

import {
    random2, random2avg, divRandRound, divRoundNear, applyChunkedAC,
} from './random.js';

/** @description 무조건 맞는 것으로 취급하는 명중값. (defines.h:141) */
export const AUTOMATIC_HIT = 1500;

/**
 * @description 수치와 무관하게 강제로 무작위가 되는 비율(%). (defines.h:147)
 * 어떤 상황에서도 최소 2.5% 는 빗나가고 최소 2.5% 는 맞습니다.
 * 압도적으로 강해도 가끔 빗나가고, 절망적으로 불리해도 가끔 맞습니다.
 */
export const MIN_HIT_MISS_PERCENTAGE = 5;

/** @description AC 를 적용하는 방식. (ac-type.h) */
export const AC_RULE = {
    /** 감산하지 않습니다 */
    NONE: 'none',
    /** random2(1+AC) 만큼 뺍니다. 근접 공격의 기본입니다 */
    NORMAL: 'normal',
    /** 절반만 적용합니다. 여러 주문 효과가 씁니다 */
    HALF: 'half',
    /** 세 번 굴려 더합니다. 주문 폭발에 쓰입니다 */
    TRIPLE: 'triple',
    /** 피해를 한 점씩 독립적으로 막습니다. 규모에 무관합니다 */
    PROPORTIONAL: 'proportional',
};

/**
 * 보장 피해 감소율(%)을 구합니다. (player.cc:6806)
 *
 * AC 굴림이 낮게 나왔을 때를 받쳐 주는 하한입니다. 좋은 굴림에 더해지지는 않습니다.
 * 플레이어만 갖습니다. 몬스터는 언제나 0 입니다. (monster.h:482)
 * @param {number} ac - 방어도
 * @returns {number} 백분율
 */
export function gdrPercent(ac) {
    return Math.trunc(16 * Math.sqrt(Math.sqrt(Math.max(0, ac))));
}

/**
 * AC 로 피해를 줄입니다. (actor.cc:351)
 *
 * 비율이 아니라 뺄셈입니다. 평균 감산이 AC/2 이므로 작은 피해 여러 번에는
 * 극도로 강하고 큰 한 방에는 약합니다. 이 비대칭이 DCSS 방어의 성격입니다.
 * @param {number} damage - 들어온 피해
 * @param {number} ac - 방어도
 * @param {object} [options] - 선택 사항
 * @param {string} [options.rule] - AC_RULE 중 하나. 기본은 NORMAL
 * @param {number} [options.maxDamage] - 이 공격이 낼 수 있는 최대 피해. GDR 에 쓰입니다
 * @param {number} [options.gdr] - 보장 감소율(%). 플레이어가 맞을 때만 넘깁니다
 * @returns {number} 남은 피해. 0 아래로는 내려가지 않습니다
 */
export function applyAC(damage, ac, options = {}) {
    const { rule = AC_RULE.NORMAL, maxDamage = 0, gdr = 0 } = options;

    let effectiveAc = Math.max(ac, 0);
    let saved = 0;

    switch (rule) {
        case AC_RULE.NONE:
            return damage;

        case AC_RULE.PROPORTIONAL:
            return Math.max(applyChunkedAC(damage, effectiveAc), 0);

        case AC_RULE.NORMAL:
            saved = random2(1 + effectiveAc);
            break;

        case AC_RULE.HALF:
            saved = Math.trunc(random2(1 + effectiveAc) / 2);
            effectiveAc = Math.trunc(effectiveAc / 2);
            break;

        case AC_RULE.TRIPLE:
            saved = random2(1 + effectiveAc) + random2(1 + effectiveAc) + random2(1 + effectiveAc);
            effectiveAc *= 3;
            break;

        default:
            throw new Error(`알 수 없는 AC 규칙입니다: ${rule}`);
    }

    // GDR 은 일반 규칙에서만, 그리고 최대 피해를 아는 경우에만 작동합니다.
    // 원본도 광선과 주문에는 maxDamage 로 0 을 넘겨 GDR 을 끕니다. (beam.cc:4530)
    if (rule === AC_RULE.NORMAL && maxDamage > 0 && gdr > 0) {
        const floor = Math.min(Math.trunc(gdr * maxDamage / 100), divRandRound(effectiveAc, 2));
        saved = Math.max(saved, floor);
    }

    return Math.max(damage - saved, 0);
}

/**
 * 몬스터의 기본 명중값을 구합니다. (fight.cc:239)
 * @param {number} hd - 몬스터의 HD
 * @param {boolean} [skilled] - 전투 숙련 몬스터인지 (fighter 깃발)
 * @returns {number} 명중값
 */
export function monToHitBase(hd, skilled = false) {
    return 18 + Math.trunc(hd * (skilled ? 5 : 3) / 2);
}

/**
 * 명중값을 굴립니다. (attack.cc:293 calc_to_hit)
 *
 * 명중값은 '상한'이고 실제 판정에는 그것을 굴린 값이 들어갑니다.
 * 이 둘을 헷갈리면 명중률이 완전히 달라지므로 함수를 갈라 둡니다.
 * @param {number} toHitCap - 굴리기 전의 명중값 상한
 * @returns {number} 굴린 명중값
 */
export function rollToHit(toHitCap) {
    return random2(toHitCap);
}

/**
 * 명중 판정을 합니다. (attack.cc:1046)
 *
 * 인자로 받는 것은 **이미 굴린** 명중값입니다. 상한을 그대로 넘기면
 * 거의 언제나 맞는 것으로 나옵니다. 굴리려면 rollToHit 을 먼저 부르십시오.
 *
 * 돌려주는 값은 여유분입니다. 0 이상이면 맞은 것입니다.
 * @param {number} toLand - 이미 굴린 명중값
 * @param {number} ev - 상대의 회피
 * @param {boolean} [randomiseEv] - 회피도 굴릴지 여부. 몬스터가 때릴 때만 참입니다
 * @returns {number} 여유분. 0 이상이면 명중
 */
export function testHit(toLand, ev, randomiseEv = false) {
    let effectiveEv = ev;
    if (randomiseEv) effectiveEv = random2avg(2 * ev, 2);
    if (toLand >= AUTOMATIC_HIT) return AUTOMATIC_HIT;

    // 수치와 무관한 강제 무작위 구간입니다.
    if (random2(100) < MIN_HIT_MISS_PERCENTAGE) {
        return random2(2) ? AUTOMATIC_HIT : -AUTOMATIC_HIT;
    }
    return toLand - effectiveEv;
}

/**
 * 플레이어가 몬스터를 때릴 때의 명중 확률을 구합니다. (fight.cc:96)
 *
 * 굴리지 않고 확률만 계산합니다. 히트박스 크기를 정하는 데 씁니다.
 * 플레이어가 때릴 때는 몬스터의 EV 를 굴리지 않으므로 식이 단순합니다.
 * @param {number} toLand - 명중값 (굴리기 전의 상한)
 * @param {number} ev - 몬스터의 회피
 * @returns {number} 0~1 사이의 확률
 */
export function playerHitChance(toLand, ev) {
    if (toLand >= AUTOMATIC_HIT) return 1;
    if (toLand <= 0) return MIN_HIT_MISS_PERCENTAGE / 200;

    // mhit 은 random2(toLand) 이므로 [0, toLand-1] 균등입니다.
    // 그중 ev 이상인 경우가 명중입니다.
    const hits = Math.max(0, toLand - ev);
    const raw = Math.min(1, hits / toLand);

    return applyForcedRandomBand(raw);
}

/**
 * 강제 무작위 구간을 확률에 반영합니다. (fight.cc:286)
 *
 * 원본이 화면에 명중률을 띄울 때 쓰는 보정과 같습니다.
 * @param {number} raw - 보정 전 확률
 * @returns {number} 보정된 확률
 */
export function applyForcedRandomBand(raw) {
    const band = MIN_HIT_MISS_PERCENTAGE / 200;
    return raw * (1 - band) + (1 - raw) * band;
}

/**
 * 회피를 조준 과녁의 크기로 환산합니다.
 *
 * 이것이 C 라인의 핵심입니다. DCSS 는 명중을 주사위로 정하지만 FPS 는 조준으로
 * 정합니다. 그렇다고 회피를 버리면 몬스터의 절반이 같은 몬스터가 되므로,
 * 원본의 명중 확률을 그대로 계산한 뒤 그만큼 과녁을 줄입니다.
 *
 * 넓이에 비례하도록 제곱근을 씁니다. 명중 확률이 1/4 이면 과녁 넓이도 1/4,
 * 즉 반지름은 절반이 됩니다.
 * @param {number} baseRadius - 몬스터 크기에서 온 기본 반지름(픽셀)
 * @param {number} toLand - 플레이어의 명중값
 * @param {number} ev - 몬스터의 회피
 * @returns {number} 실제로 맞아야 하는 반지름(픽셀)
 */
export function aimRadius(baseRadius, toLand, ev) {
    const chance = playerHitChance(toLand, ev);
    return baseRadius * Math.sqrt(chance);
}

/**
 * 몬스터의 최대 HP 를 굴립니다. (mon-util.cc:2287)
 *
 * YAML 의 hp_10x 는 평균 HP 의 열 배입니다.
 * 평균에서 최대 ±33% 벗어나되, 95% 는 ±10% 안에 들어옵니다.
 * @param {number} hp10x - YAML 의 hp_10x
 * @returns {number} 최대 HP. 최소 1
 */
export function rollMonsterHp(hp10x) {
    if (!hp10x) return 0;

    const variance = divRandRound(hp10x * 33, 100);
    const minHp = hp10x - variance;
    const rolled = minHp + random2avg(variance * 2, 8);
    return Math.max(1, divRandRound(rolled, 10));
}

/**
 * 몬스터의 자연 공격 피해를 굴립니다. (attack.cc:1004)
 *
 * YAML 의 damage 가 6 이면 [1, 6] 입니다. 0 이 나오지 않습니다.
 * @param {number} attackDamage - YAML 의 attacks[].damage
 * @returns {number} 굴린 피해
 */
export function rollMonsterDamage(attackDamage) {
    if (attackDamage <= 0) return 0;
    return 1 + random2(attackDamage);
}

/**
 * 몬스터의 HD 가 기준과 다를 때 피해를 비례해 조절합니다. (attack.cc:409)
 * 볼트가 HD 를 덮어쓴 몬스터에만 해당하며, 보통은 그대로입니다.
 * @param {number} attackDamage - 기본 피해
 * @param {number} hd - 현재 HD
 * @param {number} baseHd - 정의된 HD
 * @returns {number} 조절된 피해
 */
export function scaleDamageByHd(attackDamage, hd, baseHd) {
    if (!baseHd) return attackDamage;
    return divRandRound(attackDamage * hd, baseHd);
}

/**
 * 능력치로 피해를 배율 조정합니다. (fight.cc:1756)
 *
 * 10 에서 배율 1.0 이고, 1 점마다 2.5% 씩 오르내립니다.
 * @param {number} damage - 100 배로 확대된 피해
 * @param {number} attribute - 힘 또는 민첩
 * @returns {number} 조정된 피해 (여전히 100 배)
 */
export function statModifyDamage(damage, attribute) {
    const multiplier = Math.max(1.0, 75 + 2.5 * attribute);
    return Math.trunc(damage * multiplier / 100);
}

/**
 * 무기 스킬로 피해를 올립니다. (fight.cc:1771)
 * @param {number} damage - 피해
 * @param {number} skill - 무기 스킬 레벨 (0~27, 소수 가능)
 * @returns {number} 조정된 피해
 */
export function applyWeaponSkill(damage, skill) {
    const scaled = Math.trunc(skill * 100);
    return Math.trunc(damage * (2500 + random2(scaled + 1)) / 2500);
}

/**
 * 격투 스킬로 피해를 올립니다. (fight.cc:1779)
 * @param {number} damage - 피해
 * @param {number} skill - 격투 스킬 레벨
 * @param {boolean} [aux] - 보조 공격인지 여부. 기준값이 달라집니다
 * @returns {number} 조정된 피해
 */
export function applyFightingSkill(damage, skill, aux = false) {
    const base = aux ? 40 : 30;
    const scaled = Math.trunc(skill * 100);
    return Math.trunc(damage * (base * 100 + random2(scaled + 1)) / (base * 100));
}

/**
 * 무기 보정과 살상(slaying)을 더합니다. (attack.cc:850)
 *
 * +N 은 고정값이 아니라 random2(N+1) 입니다. 평균이 N/2 이라는 뜻입니다.
 * +0 이 아무것도 더하지 않는 것은 random2(1) 이 0 이기 때문입니다.
 * @param {number} damage - 피해
 * @param {number} plus - 무기 보정 + 살상 합계
 * @returns {number} 조정된 피해
 */
export function applySlaying(damage, plus) {
    if (plus >= 0) return damage + random2(1 + plus);
    return damage - random2(1 - plus);
}

/**
 * 플레이어의 공격 피해를 처음부터 끝까지 굴립니다. (attack.cc:1008)
 *
 * 주 굴림이 `0 ~ 최대치` 균등이라 편차가 매우 큽니다. 원본 그대로입니다.
 * @param {object} spec - 공격 명세
 * @param {number} spec.baseDamage - 무기의 기본 피해
 * @param {number} spec.attribute - 이 무기가 쓰는 능력치 (힘 또는 민첩)
 * @param {number} [spec.weaponSkill] - 무기 스킬 레벨
 * @param {number} [spec.fightingSkill] - 격투 스킬 레벨
 * @param {number} [spec.slaying] - 무기 보정 + 살상
 * @returns {number} AC 를 적용하기 전의 피해
 */
export function rollPlayerDamage(spec) {
    const {
        baseDamage, attribute,
        weaponSkill = 0, fightingSkill = 0, slaying = 0,
    } = spec;

    let potential = statModifyDamage(baseDamage * 100, attribute);
    let damage = divRoundNear(random2(potential + 1), 100);

    damage = applyWeaponSkill(damage, weaponSkill);
    damage = applyFightingSkill(damage, fightingSkill);
    damage = applySlaying(damage, slaying);

    return Math.max(0, damage);
}

/**
 * 플레이어의 최대 HP 를 구합니다. (player.cc:4356)
 * @param {number} xl - 경험 레벨
 * @param {number} fightingSkill - 격투 스킬 레벨
 * @param {number} [hpMod] - 종족의 HP 보정치
 * @returns {number} 최대 HP. 최소 1
 */
export function playerMaxHp(xl, fightingSkill, hpMod = 0) {
    let hp = Math.trunc(xl * 11 / 2) + 8;
    hp += Math.trunc(xl * Math.trunc(fightingSkill * 5) / 70)
        + Math.trunc((Math.trunc(fightingSkill * 3) + 1) / 2);
    hp = Math.trunc(hp * (10 + hpMod) / 10);
    return Math.max(1, hp);
}

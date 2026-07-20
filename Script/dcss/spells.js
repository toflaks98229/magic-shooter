/**
 * @fileoverview 몬스터가 주문을 고르고 그 위력을 정하는 규칙입니다.
 *
 * DCSS 의 몬스터는 턴마다 한 번 이백면체를 굴려 주문을 고릅니다. 주문서의 빈도가
 * 그 굴림 위의 가중치이고, 합이 200 에 못 미치면 그만큼 아무것도 하지 않습니다.
 * 아무것도 고르지 못한 턴은 공짜라서, 몬스터는 대신 걸어오거나 때립니다.
 *
 * 이 마지막 성질이 중요합니다. 시전에 실패했다고 멈춰 서지 않기 때문에
 * 시전자는 '가끔 쏘면서 계속 다가오는 적'이 됩니다.
 *
 * 실시간으로 옮길 때 가장 조심할 것은 굴리는 빈도입니다. 원본의 빈도는
 * '턴마다 한 번 굴린다'를 전제로 맞춰져 있어서, 프레임마다 굴리면
 * 주문 밀도가 예순 배가 됩니다. 그래서 굴림은 몬스터의 주문 기력에서 나오는
 * 간격으로만 일어납니다. (보통 초당 한 번)
 *
 * 출처: crawl-ref/source/mon-cast.cc, mon-spell.h, zap-data.h, spl-data.h
 */

import { random2, rollDice, oneChanceIn } from './random.js';
import { autToMs } from './time.js';

// --- 주문 위력 -----------------------------------------------------------------

/**
 * @description 주문마다 HD 에 곱하는 계수. (mon-cast.cc:2062 _mons_power_hd_factor)
 * 표에 없으면 12 입니다.
 */
const POWER_HD_FACTOR = {
    CAUSE_FEAR: 18,
    SLEETSTRIKE: 16, CALL_DOWN_LIGHTNING: 16,
    MESMERISE: 10, OBLIVION_HOWL: 10, BOULDER: 10,
    SIREN_SONG: 9, AVATAR_SONG: 9,
    MASS_CONFUSION: 8, CONFUSION_GAZE: 8, IOOD: 8, FREEZE: 8,
    FULMINANT_PRISM: 8, IGNITE_POISON: 8, ARCJOLT: 8, STICKY_FLAME: 8,
    MONSTROUS_MENAGERIE: 6, BATTLESPHERE: 6, IRRADIATE: 6,
    FOXFIRE: 6, MANIFOLD_ASSAULT: 6, SHADOW_PRISM: 6,
    SUMMON_DRAGON: 5, SUMMON_HYDRA: 5, MARTYRS_KNELL: 5, HELLFIRE_MORTAR: 5,
    CHAIN_OF_CHAOS: 4, STICKS_TO_SNAKES: 4, PHALANX_BEETLE: 4,
    DRAIN_LIFE: 1,
};

/** @description 표에 없는 주문의 계수. (mon-cast.cc:2119) */
const DEFAULT_HD_FACTOR = 12;

/**
 * 주문의 위력을 구합니다. (mon-cast.cc:2158 mons_power_for_hd)
 *
 * 위력은 피해 주사위의 눈금을 키웁니다. 나눗수가 커서 HD 에 비해 완만하게 오릅니다.
 * HD 4 화염 화살이 3d12, HD 20 이 3d29 로 다섯 배의 HD 차이가 두 배 남짓의
 * 피해 차이가 됩니다. 깊은 곳의 시전자가 위험하되 한 방은 아니게 하는 성질이라
 * 그대로 지켰습니다.
 * @param {string} spell - 주문 이름
 * @param {number} hd - 시전자의 HD
 * @returns {number} 위력
 */
export function spellPower(spell, hd) {
    const power = hd * (POWER_HD_FACTOR[spell] ?? DEFAULT_HD_FACTOR);

    // 고통만 최소 50 으로 받칩니다. (mon-cast.cc:2162)
    if (spell === 'PAIN') return Math.max(50, power);
    return power;
}

// --- 주문 효과표 ---------------------------------------------------------------

/**
 * @description 원형별 기본 발사체 속도(픽셀/기준프레임).
 *
 * 원본에는 이동 시간이 없습니다. 주문은 같은 턴에 닿습니다.
 * 조준하고 피하는 게임으로 옮기려면 날아가는 시간이 있어야 하므로
 * 이 값들은 원본에 없는, 이 게임이 정한 값입니다.
 */
const PROJECTILE_SPEED = {
    bolt: 9,      // 굵은 광선. 피하려면 미리 움직여야 합니다
    dart: 12,     // 가벼운 것은 빠릅니다
    ball: 6,      // 폭발하는 것은 느려서 보고 피할 수 있습니다
    breath: 7,
};

/**
 * @description 주문의 실제 효과. (zap-data.h 의 몬스터용 피해 계산기)
 *
 * damage 는 dicedef_calculator<주사위, 더할값, 곱할값, 나눌값> 를 옮긴 것으로,
 * `주사위 d (더할값 + 위력 * 곱할값 / 나눌값)` 입니다.
 * 곱할값이 0 이면 위력과 무관한 고정 피해입니다. (지옥불 3d20 등)
 *
 * pierce 는 원본의 can_beam 으로, 참이면 맞은 것을 뚫고 계속 날아갑니다.
 * range 는 타일 수입니다.
 */
export const SPELL_EFFECTS = {
    // --- 직선 광선 ---
    BOLT_OF_FIRE: { kind: 'bolt', damage: [3, 8, 1, 11], flavour: 'fire', pierce: true, range: 6 },
    BOLT_OF_COLD: { kind: 'bolt', damage: [3, 8, 1, 11], flavour: 'cold', pierce: true, range: 6 },
    BOLT_OF_MAGMA: { kind: 'bolt', damage: [3, 8, 1, 11], flavour: 'fire', pierce: true, range: 6 },
    BOLT_OF_DRAINING: { kind: 'bolt', damage: [3, 9, 1, 13], flavour: 'negative', pierce: true, range: 6 },
    LIGHTNING_BOLT: { kind: 'bolt', damage: [3, 10, 1, 17], flavour: 'elec', pierce: true, range: 8 },
    ELECTRICAL_BOLT: { kind: 'bolt', damage: [3, 3, 1, 12], flavour: 'elec', pierce: true, range: 8 },
    VENOM_BOLT: { kind: 'bolt', damage: [3, 6, 1, 13], flavour: 'poison', pierce: true, range: 6 },
    CORROSIVE_BOLT: { kind: 'bolt', damage: [3, 7, 1, 10], flavour: 'acid', pierce: true, range: 6 },
    DOOM_BOLT: { kind: 'bolt', damage: [3, 3, 1, 9], flavour: 'pure', pierce: true, range: 8 },
    QUICKSILVER_BOLT: { kind: 'bolt', damage: [3, 7, 1, 14], flavour: 'pure', pierce: true, range: 8 },
    BOLT_OF_DEVASTATION: { kind: 'bolt', damage: [3, 24, 0, 1], flavour: 'pure', pierce: true, range: 8 },
    STUNNING_BURST: { kind: 'bolt', damage: [2, 8, 1, 20], flavour: 'elec', pierce: true, range: 8 },
    METAL_SPLINTERS: { kind: 'bolt', damage: [3, 20, 1, 20], flavour: 'frag', range: 8 },
    POISON_ARROW: { kind: 'bolt', damage: [3, 7, 1, 12], flavour: 'poison', range: 6 },
    IRON_SHOT: { kind: 'bolt', damage: [3, 8, 1, 9], flavour: 'pure', range: 6 },
    LEHUDIBS_CRYSTAL_SPEAR: { kind: 'bolt', damage: [3, 16, 1, 10], flavour: 'pure', range: 6 },
    THROW_ICICLE: { kind: 'bolt', damage: [3, 8, 1, 11], flavour: 'cold', range: 6 },
    FLASH_FREEZE: { kind: 'bolt', damage: [3, 10, 1, 17], flavour: 'cold', range: 8 },
    STONE_ARROW: { kind: 'bolt', damage: [3, 5, 1, 10], flavour: 'pure', range: 5 },
    FORCE_LANCE: { kind: 'bolt', damage: [3, 6, 1, 15], flavour: 'pure', range: 5, knockback: true },
    HARPOON_SHOT: { kind: 'bolt', damage: [2, 7, 1, 20], flavour: 'pure', range: 8, pull: true },
    SPIT_ACID: { kind: 'bolt', damage: [3, 14, 0, 1], flavour: 'acid', range: 6 },

    // 가벼운 것들. 빠르고 약합니다.
    MAGIC_DART: { kind: 'dart', damage: [3, 4, 1, 100], flavour: 'pure', range: 8 },
    THROW_FLAME: { kind: 'dart', damage: [3, 5, 1, 40], flavour: 'fire', range: 6 },
    THROW_FROST: { kind: 'dart', damage: [3, 5, 1, 40], flavour: 'cold', range: 6 },
    STING: { kind: 'dart', damage: [3, 5, 1, 40], flavour: 'poison', range: 6 },
    SLUG_DART: { kind: 'dart', damage: [3, 5, 1, 40], flavour: 'pure', range: 6 },
    SPIT_POISON: { kind: 'dart', damage: [2, 4, 1, 10], flavour: 'poison', range: 6 },
    SHADOW_SHOT: { kind: 'dart', damage: [3, 5, 1, 20], flavour: 'negative', range: 8 },
    HOARFROST_BULLET: { kind: 'dart', damage: [3, 6, 1, 20], flavour: 'cold', range: 8 },

    // --- 터지는 것 ---
    FIREBALL: { kind: 'ball', damage: [3, 7, 1, 10], flavour: 'fire', range: 5, blastTiles: 1.5 },
    GHOSTLY_FIREBALL: { kind: 'ball', damage: [3, 6, 1, 13], flavour: 'negative', range: 6, blastTiles: 1.5 },
    HURL_DAMNATION: { kind: 'ball', damage: [3, 20, 0, 1], flavour: 'damnation', range: 6, blastTiles: 1.5 },
    ACID_BALL: { kind: 'ball', damage: [3, 7, 1, 14], flavour: 'acid', range: 6, blastTiles: 1.5 },
    STEAM_BALL: { kind: 'ball', damage: [3, 6, 1, 14], flavour: 'fire', range: 6, blastTiles: 1.5 },

    // --- 숨결. 쓰고 나면 쉬어야 합니다 ---
    FIRE_BREATH: { kind: 'breath', damage: [3, 0, 1, 6], flavour: 'fire', pierce: true, range: 8 },
    COLD_BREATH: { kind: 'breath', damage: [3, 0, 1, 6], flavour: 'cold', pierce: true, range: 8 },
    SEARING_BREATH: { kind: 'breath', damage: [3, 0, 1, 6], flavour: 'fire', pierce: true, range: 8 },
    HOLY_BREATH: { kind: 'breath', damage: [3, 0, 1, 6], flavour: 'holy', pierce: true, range: 8 },
    MIASMA_BREATH: { kind: 'breath', damage: [3, 2, 1, 12], flavour: 'miasma', range: 6, blastTiles: 1.5 },
    POISONOUS_CLOUD: { kind: 'breath', damage: [3, 4, 1, 12], flavour: 'poison', range: 6, blastTiles: 1.5 },
    NOXIOUS_CLOUD: { kind: 'breath', damage: [2, 3, 1, 14], flavour: 'poison', range: 6, blastTiles: 1.5 },
    CHAOS_BREATH: { kind: 'breath', damage: [3, 4, 1, 12], flavour: 'chaos', range: 6, blastTiles: 1.5 },

    // --- 자기 강화 ---
    HASTE: { kind: 'selfBuff', buff: 'haste', durationAuts: [200, 400] },
    MIGHT: { kind: 'selfBuff', buff: 'might', durationAuts: [200, 400] },
    BERSERKER_RAGE: { kind: 'selfBuff', buff: 'berserk', durationAuts: [150, 300] },
    TROGS_HAND: { kind: 'selfBuff', buff: 'might', durationAuts: [200, 400] },
    FLEETFOOT: { kind: 'selfBuff', buff: 'haste', durationAuts: [150, 300] },

    // --- 순간이동 ---
    BLINK: { kind: 'blink', bias: 'random' },
    BLINK_CLOSE: { kind: 'blink', bias: 'toward' },
    BLINK_AWAY: { kind: 'blink', bias: 'away' },
    BLINK_RANGE: { kind: 'blink', bias: 'ideal' },

    // --- 치유 ---
    MINOR_HEALING: { kind: 'heal', target: 'self' },
    MAJOR_HEALING: { kind: 'heal', target: 'self', multiplier: 2 },
    HEAL_OTHER: { kind: 'heal', target: 'ally' },
    WOODWEAL: { kind: 'heal', target: 'self' },

    // --- 조준이 필요 없는 것 ---
    // 원본에는 이런 주문이 많지만 대부분 이 게임에 맞지 않습니다.
    // 겨누고 피하는 게임에서 피할 수 없는 피해는 잘 해낸 것을 벌하기 때문입니다.
    // 공기 강타만 남겼습니다. 주변이 트여 있을수록 아프다는 규칙이라
    // '트인 데 서 있지 마라'로 읽혀 오히려 이 장르에 맞습니다. (mon-cast.cc:7663)
    AIRSTRIKE: { kind: 'smite', damage: [2, 5, 1, 12], flavour: 'pure', range: 8, openSpaceBonus: 2 },
};

// --- 시전 결정 -----------------------------------------------------------------

/** @description 굴림의 면 수. (mon-cast.cc:4936 random2(200)) */
const SPELL_ROLL = 200;

/** @description 이 값 미만이면 급할 때 쓰는 주문이 열립니다. (mon-cast.cc:4887) */
const EMERGENCY_HP_FRACTION = 1 / 3;

/** @description 가깝다·멀다를 가르는 거리(타일). LOS_DEFAULT_RANGE / 2. (mon-cast.cc:4866) */
const RANGE_SPLIT_TILES = 3;

/** @description 숨결을 쓰고 쉬는 시간(턴). 1d5 입니다. (mon-cast.cc:5948) */
const BREATH_COOLDOWN_DICE = 5;

/**
 * 지금 상황에서 이 슬롯을 쓸 수 있는지 봅니다.
 * (mon-cast.cc:4892 _spell_flags_invalid_for_situation)
 * @param {object} slot - 주문 슬롯
 * @param {object} context - { hpFraction, distanceTiles }
 * @returns {boolean} 쓸 수 있으면 true
 */
function slotAllowedNow(slot, context) {
    const flags = slot.flags ?? [];

    // 급할 때만 쓰는 주문은 피가 삼분의 일 아래로 떨어져야 열립니다.
    if (flags.includes('EMERGENCY') && context.hpFraction >= EMERGENCY_HP_FRACTION) {
        return false;
    }
    if (flags.includes('SHORT_RANGE') && context.distanceTiles >= RANGE_SPLIT_TILES) return false;
    if (flags.includes('LONG_RANGE') && context.distanceTiles <= RANGE_SPLIT_TILES) return false;

    return true;
}

/**
 * 이 게임이 실제로 시전할 수 있는 주문인지 봅니다.
 *
 * 원본의 이백여든두 가지를 다 만들지는 않았습니다. 만들지 않은 것은
 * 조용히 넘어갑니다. 없는 효과를 있는 척하는 것보다 낫습니다.
 * @param {object} slot - 주문 슬롯
 * @returns {boolean} 시전할 수 있으면 true
 */
export function isImplemented(slot) {
    return Object.prototype.hasOwnProperty.call(SPELL_EFFECTS, slot.spell);
}

/**
 * 이번 굴림에서 시전할 주문을 고릅니다. (mon-cast.cc:4915 _find_spell_prospect)
 *
 * 슬롯을 차례로 훑으며 빈도만큼 굴림값을 깎습니다. 끝까지 못 덮으면
 * 이번에는 아무것도 시전하지 않습니다. 이 실패는 공짜라서 몬스터는
 * 대신 평소처럼 움직입니다.
 * @param {Array<object>} slots - 주문서
 * @param {object} context - { hpFraction, distanceTiles, breathReady }
 * @returns {object|null} 고른 슬롯. 없으면 null
 */
export function pickSpellSlot(slots, context) {
    if (!slots || slots.length === 0) return null;

    let roll = random2(SPELL_ROLL);

    for (const slot of slots) {
        if (slot.freq === 0) continue;                  // (mon-cast.cc:5062)
        if (!isImplemented(slot)) continue;
        if (!slotAllowedNow(slot, context)) continue;

        // 숨결은 쉬는 동안 아예 목록에서 빠집니다. (mon-cast.cc:9941)
        if (slot.flags?.includes('BREATH') && !context.breathReady) continue;

        if (slot.freq >= roll) return slot;
        roll -= slot.freq;
    }

    return null;
}

/**
 * 급할 때 아무거나 하나 집습니다. (mon-cast.cc:4841 부근)
 *
 * 피가 삼분의 일 아래로 떨어지면 여덟 번에 한 번꼴로 빈도를 무시하고
 * 쓸 수 있는 것 중 아무거나 고릅니다. 궁지에 몰린 시전자가
 * 평소 안 쓰던 것을 꺼내는 셈입니다.
 * @param {Array<object>} slots - 주문서
 * @param {object} context - 상황
 * @returns {object|null} 고른 슬롯
 */
export function pickEmergencySpell(slots, context) {
    if (context.hpFraction >= EMERGENCY_HP_FRACTION) return null;
    if (!oneChanceIn(8)) return null;

    const usable = (slots ?? []).filter(
        s => s.freq > 0 && isImplemented(s) && slotAllowedNow(s, context)
            && (!s.flags?.includes('BREATH') || context.breathReady),
    );
    if (usable.length === 0) return null;

    return usable[random2(usable.length)];
}

/**
 * 숨결을 쓰고 쉬는 시간을 굴립니다. (mon-cast.cc:5943 setup_breath_timeout)
 * @returns {number} 쉬는 시간(ms)
 */
export function rollBreathCooldownMs() {
    // 1d5 턴. 한 턴은 10 aut 입니다.
    return autToMs(rollDice(1, BREATH_COOLDOWN_DICE) * 10);
}

/**
 * 주문의 피해를 굴립니다.
 * @param {string} spell - 주문 이름
 * @param {number} hd - 시전자의 HD
 * @returns {number} 피해
 */
export function rollSpellDamage(spell, hd) {
    const effect = SPELL_EFFECTS[spell];
    if (!effect?.damage) return 0;

    const [dice, adder, num, den] = effect.damage;
    const power = spellPower(spell, hd);
    const sides = adder + Math.trunc((power * num) / den);
    if (sides <= 0) return 0;

    return rollDice(dice, sides);
}

/**
 * 발사체의 속도를 구합니다.
 * @param {string} spell - 주문 이름
 * @returns {number} 픽셀/기준프레임
 */
export function projectileSpeedFor(spell) {
    const effect = SPELL_EFFECTS[spell];
    return PROJECTILE_SPEED[effect?.kind] ?? PROJECTILE_SPEED.bolt;
}

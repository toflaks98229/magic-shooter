/**
 * @fileoverview 종족 · 직업 · 신을 하나의 캐릭터로 합칩니다.
 *
 * 세 가지가 각자 수치를 건드리기 때문에, 어디서 온 보정인지 헷갈리기 쉽습니다.
 * 그래서 실제 계산은 전부 여기 한 곳에서만 합니다. 다른 모듈은 modifier() 만 읽습니다.
 *
 * 곱하는 순서는 종족 → 직업 → 신입니다. 원본에서도 신의 가호가 마지막에 얹히고,
 * 어차피 곱셈이라 순서가 결과를 바꾸지는 않지만 읽는 사람이 헷갈리지 않게 고정해 둡니다.
 */

import { world } from './world.js';
import { SPECIES, derive } from './species.js';
import { BACKGROUNDS, rollStartingItems } from './backgrounds.js';
import { GODS, startingPiety, canWorship } from './gods.js';

/** @description 기본값이 1(곱셈)인 항목들. 나머지는 0(덧셈)으로 다룹니다. */
const MULTIPLIED = new Set([
    'damageTaken', 'meleeDamage', 'magicDamage', 'moveSpeed', 'attackSpeed',
    'potionHeal', 'itemDropRate', 'floorClearHeal', 'maxHpMultiplier', 'stealth',
]);

/**
 * @description 이번 판 캐릭터의 보정값. resetCharacter/applyCharacter 가 다시 계산합니다.
 *
 * 매 프레임 종족·직업·신을 다시 훑지 않기 위해 한 번 계산해 둡니다.
 * 캐릭터는 판이 끝날 때까지 바뀌지 않으므로 캐시가 낡을 일이 없습니다.
 * (신은 바뀔 수 있어, 개종할 때 applyCharacter 를 다시 부릅니다)
 */
let cached = null;

/**
 * 캐릭터 보정값을 처음부터 다시 계산합니다.
 * @returns {object} 항목별 보정값
 */
function computeModifiers() {
    const speciesId = world.player.species;
    const backgroundId = world.player.background;
    const godId = world.player.god;

    const stats = derive(speciesId);
    const modifiers = {};
    for (const field of MULTIPLIED) modifiers[field] = stats[field] ?? 1;
    modifiers.hpRegenPerSecond = stats.hpRegenPerSecond;
    modifiers.mpRegenPerSecond = stats.mpRegenPerSecond;
    modifiers.hpOnKill = 0;
    modifiers.mpOnKill = 0;

    // 종족은 근접 피해만 계산해 두었으므로, 마법 피해는 지능에서 따로 가져옵니다.
    modifiers.magicDamage *= 1 + (SPECIES[speciesId].int - 8) * 0.04;

    // 직업의 능력치는 종족 능력치에 '더해지는' 값입니다. 원본과 같습니다.
    const background = BACKGROUNDS[backgroundId];
    if (background) {
        modifiers.meleeDamage *= 1 + background.str * 0.02;
        modifiers.magicDamage *= 1 + background.int * 0.02;
        modifiers.moveSpeed *= 1 + background.dex * 0.01;
    }

    // 신의 가호를 마지막에 얹습니다.
    const god = GODS[godId];
    if (god) {
        for (const [field, value] of Object.entries(god.passives)) {
            if (typeof value !== 'number') continue;     // revealMap 같은 참/거짓 항목은 건너뜁니다.
            if (MULTIPLIED.has(field)) modifiers[field] = (modifiers[field] ?? 1) * value;
            else modifiers[field] = (modifiers[field] ?? 0) + value;
        }
    }

    return modifiers;
}

/**
 * 캐릭터 보정값을 읽습니다.
 * @param {string} field - 항목 이름
 * @param {number} [base] - 항목이 없을 때 돌려줄 값
 * @returns {number} 보정값
 */
export function modifier(field, base = MULTIPLIED.has(field) ? 1 : 0) {
    if (!cached) cached = computeModifiers();
    return cached[field] ?? base;
}

/** 보정값 캐시를 버립니다. 신이 바뀌거나 새 판이 시작될 때 부릅니다. */
export function invalidateCharacter() {
    cached = null;
}

/**
 * 종족 · 직업 · 신을 정하고 플레이어를 그에 맞게 세웁니다.
 *
 * 체력과 마력의 최대치가 여기서 정해지므로, 새 판을 시작할 때 층을 만들기 '전에' 불러야 합니다.
 * @param {string} speciesId - 종족 키
 * @param {string} backgroundId - 직업 키
 * @param {string|null} godId - 섬길 신 키. 없으면 무신론자로 시작합니다.
 * @returns {string[]} 시작 소지품으로 넣을 아이템 키 목록
 */
export function applyCharacter(speciesId, backgroundId, godId = null) {
    if (!SPECIES[speciesId]) throw new Error(`알 수 없는 종족입니다: ${speciesId}`);
    if (!BACKGROUNDS[backgroundId]) throw new Error(`알 수 없는 직업입니다: ${backgroundId}`);

    const player = world.player;
    player.species = speciesId;
    player.background = backgroundId;

    // 섬길 수 없는 신을 고른 채로 시작하면 조용히 무신론자가 되는 편이 낫습니다.
    // (데미갓 광전사처럼, 직업이 정해 주는 신을 종족이 거부하는 조합이 실제로 있습니다)
    const background = BACKGROUNDS[backgroundId];
    const wanted = godId ?? background.god ?? null;
    player.god = wanted && canWorship(wanted, SPECIES[speciesId]).allowed ? wanted : null;
    player.piety = player.god ? startingPiety(player.god) : 0;

    invalidateCharacter();

    const stats = derive(speciesId);
    player.maxHp = Math.max(1, Math.round(stats.maxHp * modifier('maxHpMultiplier')));
    player.hp = player.maxHp;

    // 트로그는 마법을 완전히 금합니다. 이 게임에서 마력은 지팡이의 탄약이므로 0 이 됩니다.
    const forbidsMagic = GODS[player.god]?.forbidsMagic ?? false;
    player.maxAmmo = forbidsMagic ? 0 : stats.maxMp;
    player.ammo = player.maxAmmo;
    player.weapon = forbidsMagic ? 'fist' : background.weapon;

    return rollStartingItems(backgroundId);
}

/**
 * 지금 캐릭터가 이 행동을 할 수 있는지 봅니다.
 *
 * 지금은 트로그의 마법 금지 하나뿐이지만, 원본의 금기는 종류가 많아 여기로 모아 둡니다.
 * @param {string} conduct - 'magic' 또는 'haste'
 * @returns {boolean} 금지되어 있으면 true
 */
export function isForbidden(conduct) {
    const god = GODS[world.player.god];
    if (!god) return false;
    if (conduct === 'magic') return god.forbidsMagic === true;
    if (conduct === 'haste') return god.forbidsHaste === true;
    return false;
}

/**
 * 캐릭터를 한 줄로 설명합니다. DCSS 가 상태창 맨 위에 적어 두는 것과 같은 형식입니다.
 * @returns {string} 예: '트롤 광전사 (트로그)'
 */
/**
 * 지금 종족의 스킬 적성을 돌려줍니다.
 *
 * 적성은 학습 속도입니다. 0 이 기준이고 +4 면 두 배 빨리 배웁니다.
 * null 은 아예 배울 수 없다는 뜻입니다. 펠리드는 무기를, 드라코니안은 갑옷을
 * 배울 수 없는데, 그 자리에 0 을 돌려주면 배울 수 있는 것처럼 되어 버립니다.
 * @param {string} skill - 스킬 이름
 * @returns {number|null} 적성
 */
export function aptitudeFor(skill) {
    const species = SPECIES[world.player.species];
    if (!species) return 0;
    const aptitude = species.skillAptitudes?.[skill];
    return aptitude === undefined ? 0 : aptitude;
}

export function describeCharacter() {
    const species = SPECIES[world.player.species];
    const background = BACKGROUNDS[world.player.background];
    if (!species || !background) return '';

    const god = GODS[world.player.god];
    return god ? `${species.name} ${background.name} (${god.name})`
        : `${species.name} ${background.name}`;
}

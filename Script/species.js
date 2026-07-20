/**
 * @fileoverview 플레이어 종족.
 *
 * DCSS 0.34 의 dat/species/*.yaml 을 그대로 옮겨온 것입니다.
 * 수치는 눈대중이 아니라 저장소에서 직접 읽어 왔습니다. (npm run verify:chargen 으로 대조합니다)
 *
 * 다만 DCSS 는 턴제이고 이 게임은 실시간 1인칭이라, 원본의 값이 전부 의미를 갖지는 않습니다.
 * 무기 숙련도(short_blades, axes...)처럼 이 게임에 대응물이 없는 것은 데이터로만 두고 쓰지 않습니다.
 * 실제로 게임에 반영되는 것은 아래 derive() 가 계산하는 값들뿐이고, 무엇이 어떻게 반영되는지는
 * 각 항목에 적어 두었습니다. 반영되지 않는 것을 반영되는 척하지 않는 편이 나중에 덜 헷갈립니다.
 *
 * 색깔 있는 드라코니안 8종은 여기에 없습니다. 원본에서도 캐릭터 생성 때 고르는 것이 아니라
 * 14레벨에 색이 정해지기 때문입니다. (difficulty: false 로 표시되어 있습니다)
 */

/** @description 아무 보정도 없는 종족의 기준 체력 */
export const BASE_HP = 100;
/** @description 아무 보정도 없는 종족의 기준 마력 */
export const BASE_MP = 100;

/**
 * @description 종족 정의.
 *
 * hp/mpMod/xp/wl 과 str/int/dex 는 원본 yaml 의 같은 이름 항목 그대로입니다.
 * traits 는 원본 mutations 중 이 게임에서 뜻이 통하는 것만 추린 것입니다.
 */
export const SPECIES = {
    armataur: {
        name: '아르마타우르', enName: 'Armataur', difficulty: 'simple',
        hp: 1, mpMod: 0, xp: -1, wl: 3, str: 13, int: 8, dex: 5,
        traits: ['toughSkin'],
        note: '단단한 가죽. 받는 피해가 조금 줄어듭니다.',
    },
    barachi: {
        name: '바라치', enName: 'Barachi', difficulty: 'intermediate',
        hp: 0, mpMod: 0, xp: 0, wl: 3, str: 9, int: 8, dex: 7,
        traits: ['slow'],
        note: '개구리 다리. 원본에서도 느린 종족입니다.',
    },
    coglin: {
        name: '코글린', enName: 'Coglin', difficulty: 'advanced',
        hp: 0, mpMod: 0, xp: 0, wl: 5, str: 8, int: 7, dex: 9,
        traits: ['dualWield'],
        note: '양손에 무기를 듭니다. 공격 간격이 짧아집니다.',
    },
    deepElf: {
        name: '딥 엘프', enName: 'Deep Elf', difficulty: 'simple',
        hp: -2, mpMod: 2, xp: -1, wl: 4, str: 5, int: 12, dex: 10,
        traits: ['manaRegen'],
        note: '마력이 저절로 차오릅니다. 대신 몸이 약합니다.',
    },
    demigod: {
        name: '데미갓', enName: 'Demigod', difficulty: 'advanced',
        hp: 1, mpMod: 2, xp: -2, wl: 4, str: 9, int: 10, dex: 9,
        traits: ['godless'],
        note: '어떤 신도 섬길 수 없습니다. 대신 타고난 능력치가 높습니다.',
    },
    demonspawn: {
        name: '데몬스폰', enName: 'Demonspawn', difficulty: 'intermediate',
        hp: 0, mpMod: 0, xp: -1, wl: 3, str: 8, int: 8, dex: 8,
        traits: ['demonic'],
        note: '악마의 피. 선한 신은 받아주지 않습니다.',
    },
    djinni: {
        name: '진니', enName: 'Djinni', difficulty: 'intermediate',
        hp: -1, mpMod: 0, xp: 1, wl: 4, str: 7, int: 9, dex: 8,
        traits: ['fireResist', 'coldVulnerable', 'hpCasting'],
        note: '마력 대신 체력으로 마법을 씁니다. 불에 강하고 냉기에 약합니다.',
    },
    draconian: {
        name: '드라코니안', enName: 'Draconian', difficulty: 'simple',
        hp: 1, mpMod: 0, xp: -1, wl: 3, str: 10, int: 8, dex: 6,
        traits: ['toughSkin'],
        note: '비늘 꼬리. 원본에서는 14레벨에 색이 정해집니다.',
    },
    felid: {
        name: '펠리드', enName: 'Felid', difficulty: 'advanced',
        hp: -3, mpMod: 1, xp: -1, wl: 6, str: 4, int: 11, dex: 11,
        traits: ['claws', 'noArmour', 'multiLived'],
        note: '무기를 들 수 없어 발톱으로만 싸웁니다. 목숨이 여러 개입니다.',
    },
    formicid: {
        name: '포미시드', enName: 'Formicid', difficulty: 'advanced',
        hp: 0, mpMod: 0, xp: 1, wl: 4, str: 12, int: 7, dex: 9,
        traits: ['steady'],
        note: '땅에 단단히 붙어 있어 밀려나지 않습니다.',
    },
    gargoyle: {
        name: '가고일', enName: 'Gargoyle', difficulty: 'simple',
        hp: -2, mpMod: 0, xp: 0, wl: 3, str: 11, int: 8, dex: 5,
        traits: ['stoneBody', 'negativeResist', 'tormentResist'],
        note: '돌로 된 몸. 체력은 낮지만 받는 피해가 크게 줄어듭니다.',
    },
    gnoll: {
        name: '놀', enName: 'Gnoll', difficulty: 'simple',
        hp: 0, mpMod: 0, xp: 0, wl: 3, str: 7, int: 7, dex: 7,
        traits: ['treasureSense', 'fangs'],
        note: '보물의 냄새를 맡습니다. 아이템이 더 자주 떨어집니다.',
    },
    human: {
        name: '인간', enName: 'Human', difficulty: 'intermediate',
        hp: 0, mpMod: 0, xp: 0, wl: 3, str: 8, int: 8, dex: 8,
        traits: ['exploreRegen'],
        note: '무난합니다. 층을 내려갈 때 더 회복합니다.',
    },
    kobold: {
        name: '코볼드', enName: 'Kobold', difficulty: 'intermediate',
        hp: -2, mpMod: 0, xp: 1, wl: 3, str: 5, int: 9, dex: 10,
        traits: ['nightstalker'],
        note: '어둠 속에서 잘 봅니다. 어두운 곳에서 더 아프게 때립니다.',
    },
    merfolk: {
        name: '머포크', enName: 'Merfolk', difficulty: 'simple',
        hp: 0, mpMod: 0, xp: 0, wl: 3, str: 8, int: 7, dex: 9,
        traits: [],
        note: '균형이 잡혀 있습니다.',
    },
    minotaur: {
        name: '미노타우로스', enName: 'Minotaur', difficulty: 'simple',
        hp: 1, mpMod: -1, xp: -1, wl: 3, str: 12, int: 5, dex: 5,
        traits: ['horns', 'headbutt'],
        note: '뿔로 들이받습니다. 근접 피해가 큽니다.',
    },
    mountainDwarf: {
        name: '마운틴 드워프', enName: 'Mountain Dwarf', difficulty: 'simple',
        hp: 1, mpMod: 0, xp: -1, wl: 4, str: 10, int: 8, dex: 5,
        traits: ['runicMagic'],
        note: '튼튼하고 마법에도 소질이 있습니다.',
    },
    mummy: {
        name: '미라', enName: 'Mummy', difficulty: 'advanced',
        hp: 0, mpMod: 0, xp: -1, wl: 5, str: 11, int: 7, dex: 7,
        traits: ['undead', 'noDrink', 'coldResist', 'negativeResist', 'tormentResist', 'heatVulnerable'],
        note: '물약을 마실 수 없습니다. 대신 대부분의 것에 강합니다.',
    },
    naga: {
        name: '나가', enName: 'Naga', difficulty: 'advanced',
        hp: 2, mpMod: 0, xp: 0, wl: 5, str: 10, int: 8, dex: 6,
        traits: ['verySlow', 'poisonResist', 'spitPoison'],
        note: '가장 느립니다. 대신 체력이 많고 독에 강합니다.',
    },
    octopode: {
        name: '옥토포드', enName: 'Octopode', difficulty: 'advanced',
        hp: -1, mpMod: 0, xp: 0, wl: 3, str: 7, int: 10, dex: 7,
        traits: ['camouflage'],
        note: '주변에 섞여듭니다. 적이 늦게 알아챕니다.',
    },
    oni: {
        name: '오니', enName: 'Oni', difficulty: 'intermediate',
        hp: 3, mpMod: 0, xp: 0, wl: 4, str: 11, int: 9, dex: 4,
        traits: ['toughSkin', 'horns', 'doublePotionHeal'],
        note: '체력이 가장 많습니다. 물약 회복량이 두 배입니다.',
    },
    poltergeist: {
        name: '폴터가이스트', enName: 'Poltergeist', difficulty: 'advanced',
        hp: -1, mpMod: 0, xp: 0, wl: 4, str: 4, int: 10, dex: 9,
        traits: ['undead', 'float', 'negativeResist', 'coldResist', 'tormentResist'],
        note: '떠다닙니다. 몸이 약하지만 죽음의 마법에 상하지 않습니다.',
    },
    revenant: {
        name: '레버넌트', enName: 'Revenant', difficulty: 'intermediate',
        hp: 1, mpMod: 1, xp: -1, wl: 3, str: 11, int: 7, dex: 4,
        traits: ['undead', 'claws', 'negativeResist', 'coldResist', 'tormentResist'],
        note: '망령. 발톱으로 싸우며 죽음의 마법에 상하지 않습니다.',
    },
    spriggan: {
        name: '스프리건', enName: 'Spriggan', difficulty: 'intermediate',
        hp: -3, mpMod: 1, xp: -1, wl: 7, str: 4, int: 9, dex: 10,
        traits: ['fast'],
        note: '가장 빠릅니다. 대신 가장 약합니다.',
    },
    tengu: {
        name: '텐구', enName: 'Tengu', difficulty: 'intermediate',
        hp: -2, mpMod: 1, xp: 0, wl: 3, str: 8, int: 8, dex: 9,
        traits: ['beak', 'acrobatic'],
        note: '날렵합니다. 움직이는 동안 잘 맞지 않습니다.',
    },
    troll: {
        name: '트롤', enName: 'Troll', difficulty: 'simple',
        hp: 3, mpMod: -1, xp: -1, wl: 3, str: 15, int: 4, dex: 5,
        traits: ['regeneration', 'claws', 'toughSkin'],
        note: '체력이 저절로 회복됩니다. 힘이 가장 셉니다.',
    },
    vineStalker: {
        name: '바인 스토커', enName: 'Vine Stalker', difficulty: 'advanced',
        hp: -3, mpMod: 1, xp: 0, wl: 5, str: 10, int: 8, dex: 9,
        traits: ['manaShield', 'regeneration', 'noPotionHeal', 'fangs'],
        note: '물약으로 회복하지 못합니다. 대신 마력이 몸을 지켜 줍니다.',
    },
};

/**
 * @description 종족 특성이 실제로 무엇을 바꾸는지.
 *
 * 여기에 없는 특성은 아직 게임에 반영되지 않은 것입니다. 표시용 설명으로만 쓰입니다.
 * 값은 곱하는 것(1.0 이 기준)과 더하는 것이 섞여 있어, 쓰는 쪽에서 구분해 씁니다.
 */
export const TRAIT_EFFECTS = {
    fast: { moveSpeed: 1.30 },
    slow: { moveSpeed: 0.90 },
    verySlow: { moveSpeed: 0.75 },
    toughSkin: { damageTaken: 0.94 },
    stoneBody: { damageTaken: 0.80 },
    claws: { meleeDamage: 1.25 },
    fangs: { meleeDamage: 1.10 },
    horns: { meleeDamage: 1.20 },
    headbutt: { meleeDamage: 1.10 },
    beak: { meleeDamage: 1.10 },
    regeneration: { hpRegenPerSecond: 1.2 },
    manaRegen: { mpRegenPerSecond: 1.5 },
    dualWield: { attackSpeed: 1.20 },
    acrobatic: { damageTaken: 0.95 },
    doublePotionHeal: { potionHeal: 2.0 },
    nightstalker: { meleeDamage: 1.10 },
    treasureSense: { itemDropRate: 1.35 },
    exploreRegen: { floorClearHeal: 2.0 },
};

/**
 * 종족의 실제 게임 수치를 계산합니다.
 *
 * DCSS 의 hp 적성은 -3~+3 이고, 원본에서는 레벨마다 붙는 체력에 곱해집니다.
 * 이 게임에는 레벨이 없으므로 기준 체력에 한 번에 반영합니다.
 * 한 단계당 8% 로 두면 트롤(+3)이 124, 스프리건/펠리드(-3)가 76 이 되어
 * 원본에서 느껴지는 차이와 얼추 맞습니다.
 *
 * @param {string} speciesId - 종족 키
 * @returns {object} 계산된 수치
 */
export function derive(speciesId) {
    const species = SPECIES[speciesId];
    if (!species) throw new Error(`알 수 없는 종족입니다: ${speciesId}`);

    const stats = {
        maxHp: Math.round(BASE_HP * (1 + species.hp * 0.08)),
        maxMp: Math.round(BASE_MP * (1 + species.mpMod * 0.15)),
        // 곱해서 쓰는 값들의 기본은 1 입니다.
        moveSpeed: 1, damageTaken: 1, meleeDamage: 1, attackSpeed: 1,
        potionHeal: 1, itemDropRate: 1, floorClearHeal: 1,
        // 더해서 쓰는 값들의 기본은 0 입니다.
        hpRegenPerSecond: 0, mpRegenPerSecond: 0,
    };

    for (const trait of species.traits) {
        const effect = TRAIT_EFFECTS[trait];
        if (!effect) continue;   // 아직 반영되지 않은 특성입니다.
        for (const [key, value] of Object.entries(effect)) {
            // 회복량은 여러 특성이 겹치면 더하고, 나머지 배율은 곱합니다.
            if (key.endsWith('PerSecond')) stats[key] += value;
            else stats[key] *= value;
        }
    }

    // 힘은 근접 피해에, 지능은 마력에 반영합니다. 8 이 평균이라 그것을 기준으로 둡니다.
    stats.meleeDamage *= 1 + (species.str - 8) * 0.04;
    stats.maxMp = Math.round(stats.maxMp * (1 + (species.int - 8) * 0.03));

    return stats;
}

/** @returns {string[]} 캐릭터 생성에서 고를 수 있는 종족 키 목록 */
export function selectableSpecies() {
    return Object.keys(SPECIES);
}

/**
 * 종족이 특성을 가졌는지 확인합니다.
 * @param {string} speciesId - 종족 키
 * @param {string} trait - 특성 이름
 * @returns {boolean} 가졌는지 여부
 */
export function hasTrait(speciesId, trait) {
    return SPECIES[speciesId]?.traits.includes(trait) ?? false;
}

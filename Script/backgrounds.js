/**
 * @fileoverview 플레이어 직업(배경).
 *
 * DCSS 0.34 의 dat/jobs/*.yaml 을 옮겨온 것입니다. str/int/dex 와 추천 종족, 원본의 시작 장비
 * 문자열은 저장소에서 직접 읽어 온 그대로입니다. (npm run verify:chargen 으로 대조합니다)
 *
 * 시작 장비를 그대로 줄 수는 없습니다. 이 게임에는 방어구도, 주문서도, 던지는 무기도 없고
 * 무기는 장갑과 지팡이 둘뿐이기 때문입니다. 그래서 원본 장비 목록(sourceEquipment)은 기록만
 * 해 두고, 실제로 주는 것은 items/weapon 에 따로 적었습니다. 무엇을 무엇으로 바꿨는지 보이도록
 * 둘 다 남겨 둡니다.
 *
 * 원본 26 직업 중 방랑자(wanderer)는 yaml 에 장비도 기술도 없습니다. 원본에서도 시작 장비를
 * 그때그때 무작위로 굴리기 때문이고, 여기서도 같게 처리합니다.
 */

/**
 * @description 직업 정의.
 *
 * str/int/dex 는 종족 능력치에 '더해지는' 값입니다. 원본과 같은 방식이고, 음수도 원본 그대로입니다.
 * (광전사는 int -1, 컨저러는 str -1 입니다. 오타가 아닙니다)
 */
export const BACKGROUNDS = {
    fighter: {
        name: '전사', enName: 'Fighter', category: 'warrior',
        str: 8, int: 0, dex: 4,
        weapon: 'fist', items: ['might', 'might'],
        sourceEquipment: ['scale mail', 'buckler', 'potion of might q:2'],
        recommended: ['mountainDwarf', 'troll', 'minotaur', 'gargoyle', 'armataur', 'formicid', 'revenant'],
    },
    gladiator: {
        name: '검투사', enName: 'Gladiator', category: 'warrior',
        str: 6, int: 0, dex: 6,
        weapon: 'fist', items: ['haste'],
        sourceEquipment: ['leather armour', 'helmet', 'throwing net q:3'],
        recommended: ['mountainDwarf', 'merfolk', 'minotaur', 'gargoyle', 'coglin', 'vineStalker'],
    },
    monk: {
        name: '수도승', enName: 'Monk', category: 'warrior',
        str: 3, int: 2, dex: 7,
        weapon: 'fist', items: ['healing'],
        sourceEquipment: ['robe', 'potion of ambrosia', 'orb ego:light'],
        recommended: ['mountainDwarf', 'troll', 'armataur', 'merfolk', 'gargoyle', 'demonspawn'],
    },
    berserker: {
        name: '광전사', enName: 'Berserker', category: 'warrior',
        str: 9, int: -1, dex: 4,
        weapon: 'fist', items: ['might'],
        sourceEquipment: ['animal skin'],
        recommended: ['mountainDwarf', 'oni', 'merfolk', 'minotaur', 'gargoyle', 'armataur'],
        god: 'trog',   // 원본에서 광전사는 트로그를 섬긴 채로 시작합니다.
    },
    chaosKnight: {
        name: '혼돈의 기사', enName: 'Chaos Knight', category: 'warrior',
        str: 4, int: 4, dex: 4,
        weapon: 'fist', items: ['resistance'],
        sourceEquipment: ['leather armour plus:2', 'scroll of butterflies'],
        recommended: ['spriggan', 'troll', 'gnoll', 'merfolk', 'minotaur', 'draconian', 'demonspawn'],
        god: 'xom',    // 원본에서 혼돈의 기사는 좀을 섬긴 채로 시작합니다.
    },
    cinderAcolyte: {
        name: '잿불 수행자', enName: 'Cinder Acolyte', category: 'warrior',
        str: 6, int: 6, dex: 0,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['robe'],
        recommended: ['mountainDwarf', 'draconian', 'oni', 'djinni', 'gnoll'],
    },
    reaver: {
        name: '약탈자', enName: 'Reaver', category: 'warrior',
        str: 4, int: 5, dex: 3,
        weapon: 'gun', items: ['might', 'magic'],
        sourceEquipment: ['leather armour'],
        recommended: ['gnoll', 'tengu', 'barachi', 'demonspawn', 'draconian', 'mountainDwarf'],
    },
    shapeshifter: {
        name: '변신술사', enName: 'Shapeshifter', category: 'warrior',
        str: 6, int: 2, dex: 4,
        weapon: 'fist', items: ['resistance', 'vitality'],
        sourceEquipment: ['animal skin', 'flux bauble q:3', 'potion of lignification', 'quill talisman', 'protean talisman'],
        recommended: ['naga', 'merfolk', 'draconian', 'demigod', 'demonspawn', 'troll'],
    },
    hunter: {
        name: '사냥꾼', enName: 'Hunter', category: 'ranged',
        str: 3, int: 1, dex: 8,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['shortbow', 'leather armour', 'scroll of butterflies'],
        recommended: ['minotaur', 'gnoll', 'barachi', 'kobold', 'spriggan'],
    },
    brigand: {
        name: '도적', enName: 'Brigand', category: 'ranged',
        str: 3, int: 3, dex: 6,
        weapon: 'gun', items: ['haste', 'haste'],
        sourceEquipment: ['dagger plus:2', 'robe', 'cloak', 'dart ego:poisoned q:9', 'dart ego:curare q:3'],
        recommended: ['troll', 'spriggan', 'demonspawn', 'vineStalker', 'gnoll'],
    },
    artificer: {
        name: '기술자', enName: 'Artificer', category: 'ranged',
        str: 4, int: 3, dex: 5,
        weapon: 'gun', items: ['magic', 'magic'],
        sourceEquipment: ['club', 'leather armour', 'wand of flame charges:15', 'wand of charming charges:15', 'wand of iceblast charges:5'],
        recommended: ['kobold', 'spriggan', 'draconian', 'demonspawn', 'coglin'],
    },
    delver: {
        name: '굴착자', enName: 'Delver', category: 'ranged',
        str: 4, int: 2, dex: 6,
        weapon: 'gun', items: ['haste', 'resistance'],
        sourceEquipment: ['leather armour', 'scroll of fog', 'scroll of revelation', 'scroll of fear', 'potion of haste', 'wand of digging charges:3'],
        recommended: ['felid', 'spriggan', 'kobold', 'gnoll'],
    },
    warper: {
        name: '워퍼', enName: 'Warper', category: 'ranged',
        str: 3, int: 5, dex: 4,
        weapon: 'gun', items: ['haste', 'magic'],
        sourceEquipment: ['leather armour', 'scroll of blinking', 'dart ego:disjunction q:4'],
        recommended: ['felid', 'spriggan', 'armataur', 'draconian', 'coglin'],
    },
    hexslinger: {
        name: '주술 사수', enName: 'Hexslinger', category: 'ranged',
        str: 0, int: 5, dex: 7,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['robe', 'scroll of poison', 'sling plus:1'],
        recommended: ['formicid', 'deepElf', 'kobold', 'spriggan', 'gnoll'],
    },
    hedgeWizard: {
        name: '떠돌이 마법사', enName: 'Hedge Wizard', category: 'caster',
        str: 2, int: 6, dex: 4,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['dagger', 'robe', 'hat', 'potion of magic'],
        recommended: ['deepElf', 'naga', 'draconian', 'octopode', 'human', 'djinni'],
    },
    conjurer: {
        name: '컨저러', enName: 'Conjurer', category: 'caster',
        str: -1, int: 10, dex: 3,
        weapon: 'gun', items: ['magic', 'magic'],
        sourceEquipment: ['robe', 'potion of magic'],
        recommended: ['deepElf', 'naga', 'tengu', 'draconian', 'demigod', 'djinni', 'armataur'],
    },
    summoner: {
        name: '소환술사', enName: 'Summoner', category: 'caster',
        str: 0, int: 7, dex: 5,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['robe', 'potion of magic'],
        recommended: ['deepElf', 'oni', 'vineStalker', 'merfolk', 'tengu'],
    },
    necromancer: {
        name: '강령술사', enName: 'Necromancer', category: 'caster',
        str: 0, int: 7, dex: 5,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['dagger', 'robe', 'potion of magic'],
        recommended: ['deepElf', 'djinni', 'mountainDwarf', 'demonspawn', 'mummy', 'revenant'],
    },
    forgewright: {
        name: '주조술사', enName: 'Forgewright', category: 'caster',
        str: 2, int: 7, dex: 3,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['mace', 'robe', 'potion of magic'],
        recommended: ['mountainDwarf', 'coglin', 'barachi', 'human', 'vineStalker', 'merfolk'],
    },
    enchanter: {
        name: '인챈터', enName: 'Enchanter', category: 'caster',
        str: 0, int: 7, dex: 5,
        weapon: 'gun', items: ['haste', 'magic'],
        sourceEquipment: ['dagger plus:1', 'robe', 'potion of invisibility q:2'],
        recommended: ['deepElf', 'felid', 'kobold', 'spriggan', 'naga', 'poltergeist'],
    },
    fireElementalist: {
        name: '화염술사', enName: 'Fire Elementalist', category: 'caster',
        str: 0, int: 7, dex: 5,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['robe', 'potion of magic'],
        recommended: ['deepElf', 'mountainDwarf', 'naga', 'tengu', 'demigod', 'gargoyle', 'djinni'],
    },
    iceElementalist: {
        name: '빙결술사', enName: 'Ice Elementalist', category: 'caster',
        str: 0, int: 7, dex: 5,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['robe', 'potion of magic'],
        recommended: ['merfolk', 'barachi', 'draconian', 'demigod', 'gargoyle', 'djinni', 'revenant'],
    },
    airElementalist: {
        name: '대기술사', enName: 'Air Elementalist', category: 'caster',
        str: 0, int: 7, dex: 5,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['robe', 'potion of magic'],
        recommended: ['deepElf', 'tengu', 'draconian', 'naga', 'vineStalker', 'djinni'],
    },
    earthElementalist: {
        name: '대지술사', enName: 'Earth Elementalist', category: 'caster',
        str: 0, int: 7, dex: 5,
        weapon: 'gun', items: ['magic'],
        sourceEquipment: ['robe', 'potion of magic'],
        recommended: ['deepElf', 'spriggan', 'gargoyle', 'demigod', 'octopode', 'revenant'],
    },
    alchemist: {
        name: '연금술사', enName: 'Alchemist', category: 'caster',
        str: 0, int: 7, dex: 5,
        weapon: 'gun', items: ['magic', 'healing'],
        sourceEquipment: ['robe', 'potion of magic'],
        recommended: ['deepElf', 'spriggan', 'naga', 'merfolk', 'octopode', 'djinni', 'demonspawn'],
    },
    wanderer: {
        name: '방랑자', enName: 'Wanderer', category: 'ranged',
        str: 0, int: 0, dex: 0,
        weapon: 'gun', items: [],
        sourceEquipment: [],
        recommended: ['mountainDwarf', 'gnoll', 'merfolk', 'draconian', 'human', 'demonspawn', 'barachi'],
        // 원본에서도 시작 장비가 정해져 있지 않고 그때그때 굴립니다.
        randomStart: true,
    },
};

/** @description 방랑자가 시작할 때 굴리는 물약 후보. 원본처럼 무엇이 나올지 모릅니다. */
const WANDERER_POOL = ['healing', 'magic', 'might', 'haste', 'resistance'];

/** @description 직업 분류의 표시 이름. DCSS 의 캐릭터 생성 화면이 이렇게 묶어 보여줍니다. */
export const CATEGORY_NAMES = {
    warrior: '전사 계열',
    ranged: '원거리 계열',
    caster: '마법 계열',
};

/**
 * 직업이 주는 시작 소지품을 굴립니다.
 *
 * 방랑자만 무작위이고 나머지는 정해져 있습니다.
 * @param {string} backgroundId - 직업 키
 * @returns {string[]} 아이템 키 목록
 */
export function rollStartingItems(backgroundId) {
    const background = BACKGROUNDS[backgroundId];
    if (!background) throw new Error(`알 수 없는 직업입니다: ${backgroundId}`);
    if (!background.randomStart) return [...background.items];

    const count = 2 + Math.floor(Math.random() * 2);   // 두세 개
    return Array.from({ length: count },
        () => WANDERER_POOL[Math.floor(Math.random() * WANDERER_POOL.length)]);
}

/** @returns {string[]} 캐릭터 생성에서 고를 수 있는 직업 키 목록 */
export function selectableBackgrounds() {
    return Object.keys(BACKGROUNDS);
}

/**
 * 직업을 분류별로 묶습니다. 캐릭터 생성 화면이 이 순서로 보여줍니다.
 * @returns {Array<{category: string, name: string, ids: string[]}>} 묶음 목록
 */
export function groupedBackgrounds() {
    return Object.keys(CATEGORY_NAMES).map(category => ({
        category,
        name: CATEGORY_NAMES[category],
        ids: Object.keys(BACKGROUNDS).filter(id => BACKGROUNDS[id].category === category),
    }));
}

/**
 * 이 조합을 원본이 추천하는지 봅니다. 캐릭터 생성 화면에서 표시에 씁니다.
 * @param {string} speciesId - 종족 키
 * @param {string} backgroundId - 직업 키
 * @returns {boolean} 추천 조합인지
 */
export function isRecommended(speciesId, backgroundId) {
    return BACKGROUNDS[backgroundId]?.recommended.includes(speciesId) ?? false;
}

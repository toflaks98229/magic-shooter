/**
 * @fileoverview 신과 신앙.
 *
 * DCSS 0.34 의 god-type.h · god-conduct.cc · god-passive.cc · god-abil.cc 를 대조해 옮겼습니다.
 * 26 위 전부이고, 원본에서 섬길 수 없는 것(GOD_NO_GOD, GOD_RANDOM, 그리고 리워크 대기 중인
 * 파켈라스)은 뺐습니다.
 *
 * 신앙심 단계는 원본 그대로입니다. religion.cc 의 breakpoints[6] = {30, 50, 75, 100, 120, 160}
 * 이고 최대치는 200 입니다. 별 개수도 이 경계로 셉니다.
 *
 * 원본과 다른 점은 '신앙심을 어떻게 얻는가' 입니다. 원본에는 이 게임에 없는 것들(제단 기부,
 * 장비 저주, 희생, 카드)이 신앙심의 원천인 신이 여럿 있습니다. 그런 신은 이 게임에서 뜻이
 * 통하는 가장 가까운 행동으로 옮겼고, 무엇을 무엇으로 옮겼는지 각 신에 적어 두었습니다.
 */

/** @description 신앙심 단계 경계. 원본 religion.cc 의 값 그대로입니다. */
export const PIETY_BREAKPOINTS = [30, 50, 75, 100, 120, 160];
/** @description 신앙심 최대치. 원본 MAX_PIETY 와 같습니다. */
export const MAX_PIETY = 200;

/**
 * @description 신앙심을 얻는 방식.
 *
 * kill        - 적을 잡을 때. 대부분의 신입니다.
 * killTough   - 강한 적일수록 많이. 오카와루처럼 난이도에 비례하는 신입니다.
 * explore     - 층을 내려갈 때. 원본에서 탐험으로 신앙심을 얻는 신들입니다.
 * damage      - 피해를 줄 때마다. 우스카야우처럼 전투 중에만 오르는 신입니다.
 * none        - 오르지 않습니다. 좀과 이그니스가 그렇습니다.
 */
export const PIETY_SOURCES = ['kill', 'killTough', 'explore', 'damage', 'none'];

/**
 * @description 신 정의.
 *
 * likes/dislikes 는 원본 god-conduct.cc 의 divine_likes[] / divine_peeves[] 를 옮긴 것입니다.
 * passives 는 TRAIT 처럼 실제 수치에 반영되는 것만 적었고, abilities 는 신앙심 단계별로
 * 쓸 수 있게 되는 것입니다.
 */
export const GODS = {
    zin: {
        name: '진', enName: 'Zin', piety: 'kill',
        domain: '규율과 정결의 신. 몸과 마음이 깨끗하기를 요구합니다.',
        likes: ['부정하거나 혼돈한 존재를 처치'],
        dislikes: ['사악한 마법과 물건', '혼돈한 물건', '중립적인 존재를 공격'],
        passives: { damageTaken: 0.92 },
        abilities: [{ name: '성역', rank: 5, effect: 'sanctuary' }],
        rejectsUndead: true, rejectsDemonic: true,
    },
    theShiningOne: {
        name: '빛나는 자', enName: 'the Shining One', piety: 'kill',
        domain: '악에 맞서는 성전의 신. 언데드와 악마를 베는 것을 기뻐합니다.',
        likes: ['언데드 처치', '악마 처치', '사악한 존재 처치'],
        dislikes: ['사악한 마법과 물건', '중립적인 존재를 공격'],
        passives: { damageTaken: 0.90 },
        abilities: [{ name: '신성한 방패', rank: 1, effect: 'shield' }],
        rejectsUndead: true, rejectsDemonic: true,
    },
    kikubaaqudgha: {
        name: '키쿠바쿠드가', enName: 'Kikubaaqudgha', piety: 'kill',
        domain: '죽음과 강령술의 마신. 죽음을 다루는 자를 지켜 줍니다.',
        likes: ['살아 있는 것을 처치', '언데드 파괴', '악마 처치'],
        dislikes: [],
        passives: { damageTaken: 0.95 },
        abilities: [{ name: '파멸의 표식', rank: 5, effect: 'weakenEnemies' }],
    },
    yredelemnul: {
        name: '이레델렘눌', enName: 'Yredelemnul', piety: 'kill',
        domain: '죽음과 사로잡힌 영혼의 신. 검은 횃불로 언데드를 부립니다.',
        likes: ['횃불을 든 채로 살아 있는 것을 처치'],
        dislikes: ['신성한 마법과 물건'],
        passives: { meleeDamage: 1.10 },
        abilities: [{ name: '횃불 던지기', rank: 2, effect: 'burst' }],
    },
    xom: {
        name: '좀', enName: 'Xom', piety: 'none',
        domain: '변덕스러운 혼돈의 신. 신자가 아니라 장난감을 원합니다.',
        likes: ['지루하지 않은 것'],
        dislikes: ['지루한 것'],
        passives: {},
        abilities: [],
        // 원본에서 좀의 신앙심은 '기분'이라 오르내리는 것이 아니라 100 에서 흔들립니다.
        startingPiety: 100, capricious: true,
    },
    vehumet: {
        name: '베후멧', enName: 'Vehumet', piety: 'kill',
        domain: '파괴 마법의 신. 공격 마법을 북돋웁니다.',
        likes: ['살아 있는 것을 처치'],
        dislikes: [],
        passives: { mpOnKill: 4, magicDamage: 1.15 },
        abilities: [],
    },
    okawaru: {
        name: '오카와루', enName: 'Okawaru', piety: 'killTough',
        domain: '전투의 신. 홀로 강한 적과 싸우는 것을 기뻐합니다.',
        likes: ['버거운 적을 처치'],
        dislikes: ['동료를 거느리는 것'],
        passives: { meleeDamage: 1.10 },
        abilities: [
            { name: '영웅심', rank: 1, effect: 'might' },
            { name: '기교', rank: 4, effect: 'haste' },
        ],
    },
    makhleb: {
        name: '마클렙', enName: 'Makhleb', piety: 'kill',
        domain: '유혈과 파괴의 신. 죽일수록 몸이 나아집니다.',
        likes: ['살아 있는 것을 처치'],
        dislikes: [],
        passives: { hpOnKill: 4 },
        abilities: [{ name: '파괴', rank: 2, effect: 'burst' }],
    },
    sifMuna: {
        name: '시프 무나', enName: 'Sif Muna', piety: 'kill',
        domain: '마법 지식의 신. 마력을 다스리게 해 줍니다.',
        likes: ['살아 있는 것을 처치'],
        dislikes: [],
        passives: { mpRegenPerSecond: 2.0 },
        abilities: [{ name: '마력 전환', rank: 1, effect: 'restoreMp' }],
    },
    trog: {
        name: '트로그', enName: 'Trog', piety: 'kill',
        domain: '분노와 폭력의 신. 마법을 완전히 금하는 대신 광포함을 줍니다.',
        likes: ['살아 있는 것을 처치', '마법사를 처치'],
        dislikes: ['주문을 외는 것', '마법 물건을 쓰는 것'],
        passives: { meleeDamage: 1.25, maxMp: 0 },
        abilities: [
            { name: '광폭화', rank: 1, effect: 'berserk' },
            { name: '트로그의 손', rank: 2, effect: 'regen' },
        ],
        // 원본에서 트로그만이 주문 자체를 금합니다. 이 게임에서 지팡이는 마법이므로 쓸 수 없습니다.
        forbidsMagic: true,
    },
    nemelexXobeh: {
        name: '네멜렉스 조베', enName: 'Nemelex Xobeh', piety: 'explore',
        domain: '카드의 신. 운을 뒤섞어 줍니다.',
        likes: ['세상을 탐험하는 것'],
        dislikes: [],
        passives: { itemDropRate: 1.4 },
        abilities: [{ name: '카드 뽑기', rank: 3, effect: 'randomBoon' }],
    },
    elyvilon: {
        name: '엘리빌론', enName: 'Elyvilon', piety: 'explore',
        domain: '치유의 신. 죽이는 것이 아니라 살리는 것을 기뻐합니다.',
        likes: ['세상을 탐험하는 것'],
        dislikes: ['사악한 마법과 물건', '중립적인 존재를 공격'],
        passives: { potionHeal: 1.3 },
        abilities: [
            { name: '자기 치유', rank: 3, effect: 'heal' },
            { name: '신성한 활력', rank: 5, effect: 'vigour' },
        ],
        rejectsUndead: true, rejectsDemonic: true,
    },
    lugonu: {
        name: '루고누', enName: 'Lugonu', piety: 'kill',
        domain: '심연의 추방된 신. 형체 없는 것들을 다룹니다.',
        likes: ['살아 있는 것을 처치', '적을 심연으로 추방'],
        dislikes: [],
        passives: { magicDamage: 1.10 },
        abilities: [{ name: '추방', rank: 2, effect: 'banish' }],
    },
    beogh: {
        name: '베오그', enName: 'Beogh', piety: 'kill',
        domain: '버림받은 자들의 신. 쓰러진 오크를 동료로 거둡니다.',
        likes: ['살아 있는 것을 처치', '다른 종교의 사제를 처치'],
        dislikes: ['적대적이지 않은 오크를 공격'],
        passives: { meleeDamage: 1.10 },
        abilities: [{ name: '강타', rank: 2, effect: 'smite' }],
    },
    jiyva: {
        name: '지이바', enName: 'Jiyva', piety: 'explore',
        domain: '슬라임의 신. 젤리를 친구로 만들고 몸을 뒤바꿉니다.',
        likes: ['세상을 탐험하는 것'],
        dislikes: [],
        passives: { hpRegenPerSecond: 1.0 },
        abilities: [{ name: '점액화', rank: 4, effect: 'slimify' }],
    },
    fedhas: {
        name: '페드하스', enName: 'Fedhas Madash', piety: 'kill',
        domain: '식물과 균류의 신. 자라는 것들을 편들어 줍니다.',
        likes: ['살아 있는 것을 처치'],
        dislikes: [],
        passives: { hpRegenPerSecond: 0.8 },
        abilities: [{ name: '가시덤불', rank: 2, effect: 'briars' }],
    },
    cheibriados: {
        name: '케이브리아도스', enName: 'Cheibriados', piety: 'kill',
        domain: '느림의 신. 영원히 느려지는 대신 크게 강해집니다.',
        likes: ['굼뜨지 않은 것을 처치'],
        dislikes: ['자신을 가속하는 것'],
        // 원본과 같이 영구히 느려지고 가속을 받을 수 없습니다. 그 대가로 능력치가 크게 오릅니다.
        passives: { moveSpeed: 0.75, damageTaken: 0.75, meleeDamage: 1.25, magicDamage: 1.25 },
        abilities: [{ name: '시간 왜곡', rank: 3, effect: 'slowEnemies' }],
        forbidsHaste: true,
    },
    ashenzari: {
        name: '아셴자리', enName: 'Ashenzari', piety: 'explore',
        domain: '속박된 예언의 신. 자유를 저당잡고 앎을 줍니다.',
        likes: ['스스로를 저주로 묶는 것'],
        dislikes: [],
        passives: { revealMap: true, damageTaken: 0.95 },
        abilities: [],
        startingPiety: 2,
    },
    dithmenos: {
        name: '디스메노스', enName: 'Dithmenos', piety: 'explore',
        domain: '밤과 그림자의 신. 그림자가 당신의 행동을 따라합니다.',
        likes: ['세상을 탐험하는 것'],
        dislikes: [],
        passives: { stealth: 1.5 },
        abilities: [{ name: '그림자 바꿔치기', rank: 3, effect: 'shadowslip' }],
    },
    gozag: {
        name: '고자그', enName: 'Gozag', piety: 'explore',
        domain: '탐욕의 신. 신앙심 대신 금화로 거래합니다.',
        likes: ['금화를 모으는 것'],
        dislikes: [],
        passives: { itemDropRate: 1.5 },
        abilities: [{ name: '물약 청원', rank: 0, effect: 'potionPetition' }],
        // 원본에서 고자그에게는 신앙심 단계가 없고 모든 능력이 금화 값입니다.
        goldInsteadOfPiety: true,
    },
    qazlal: {
        name: '카즈랄', enName: 'Qazlal', piety: 'kill',
        domain: '폭풍의 신. 신자를 원소의 폭풍으로 감쌉니다.',
        likes: ['살아 있는 것을 처치'],
        dislikes: [],
        passives: { damageTaken: 0.88, stealth: 0.6 },
        abilities: [{ name: '격변', rank: 2, effect: 'burst' }],
    },
    ru: {
        name: '루', enName: 'Ru', piety: 'explore',
        domain: '희생의 신. 영영 돌이킬 수 없는 것을 내주면 힘을 줍니다.',
        likes: ['스스로를 희생하는 것'],
        dislikes: [],
        passives: { damageTaken: 0.85 },
        abilities: [{ name: '힘 끌어내기', rank: 3, effect: 'drawOutPower' }],
        startingPiety: 10,
    },
    uskayaw: {
        name: '우스카야우', enName: 'Uskayaw', piety: 'damage',
        domain: '춤의 신. 싸움이 이어지는 동안에만 함께합니다.',
        likes: ['적에게 피해를 입히는 것'],
        dislikes: [],
        passives: { attackSpeed: 1.15 },
        abilities: [{ name: '발구르기', rank: 1, effect: 'stomp' }],
        // 원본처럼 전투가 끊기면 신앙심이 빠르게 식습니다.
        pietyDecaysFast: true,
    },
    hepliaklqana: {
        name: '헵리아클콰나', enName: 'Hepliaklqana', piety: 'explore',
        domain: '잊혀진 자. 최대 체력을 대가로 조상을 불러 줍니다.',
        likes: ['세상을 탐험하는 것'],
        dislikes: [],
        passives: { maxHpMultiplier: 0.85, meleeDamage: 1.15 },
        abilities: [{ name: '조상 소환', rank: 1, effect: 'ancestor' }],
    },
    wuJian: {
        name: '우 지안 회', enName: 'the Wu Jian Council', piety: 'kill',
        domain: '무예의 회. 움직임 자체를 공격으로 바꿉니다.',
        likes: ['살아 있는 것을 처치'],
        dislikes: [],
        passives: { moveSpeed: 1.10, meleeDamage: 1.15 },
        abilities: [{ name: '뱀의 채찍', rank: 3, effect: 'serpentsLash' }],
    },
    ignis: {
        name: '이그니스', enName: 'Ignis', piety: 'none',
        domain: '꺼져 가는 불꽃. 다시 채울 수 없는 힘을 미리 내어 줍니다.',
        likes: [],
        dislikes: [],
        passives: { fireResist: true, magicDamage: 1.2 },
        abilities: [{ name: '불꽃 갑주', rank: 1, effect: 'fieryArmour' }],
        // 원본처럼 신앙심이 130 에서 시작해 줄어들기만 합니다.
        startingPiety: 130, pietyOnlyDecreases: true,
    },
};

/**
 * 신앙심이 몇 단계(별 몇 개)인지 셉니다. 원본 piety_rank 와 같은 계산입니다.
 * @param {number} piety - 신앙심
 * @returns {number} 0~6
 */
export function pietyRank(piety) {
    let rank = 0;
    for (const breakpoint of PIETY_BREAKPOINTS) {
        if (piety >= breakpoint) rank++;
    }
    return rank;
}

/**
 * 신을 섬기기 시작할 때의 신앙심입니다.
 * 원본 _set_initial_god_piety 처럼 신마다 다릅니다. (기본 15)
 * @param {string} godId - 신 키
 * @returns {number} 시작 신앙심
 */
export function startingPiety(godId) {
    return GODS[godId]?.startingPiety ?? 15;
}

/**
 * 이 종족이 이 신을 섬길 수 있는지 봅니다.
 *
 * 원본에서 선한 신 셋은 언데드와 악마를 받지 않고, 데미갓은 어떤 신도 섬기지 못합니다.
 * @param {string} godId - 신 키
 * @param {object} species - SPECIES 항목
 * @returns {{allowed: boolean, reason: string}} 가능 여부와 이유
 */
export function canWorship(godId, species) {
    const god = GODS[godId];
    if (!god) return { allowed: false, reason: '없는 신입니다' };

    if (species.traits.includes('godless')) {
        return { allowed: false, reason: '데미갓은 어떤 신도 섬기지 않습니다' };
    }
    if (god.rejectsUndead && species.traits.includes('undead')) {
        return { allowed: false, reason: `${god.name}은(는) 언데드를 받지 않습니다` };
    }
    if (god.rejectsDemonic && species.traits.includes('demonic')) {
        return { allowed: false, reason: `${god.name}은(는) 악마의 피를 받지 않습니다` };
    }
    return { allowed: true, reason: '' };
}

/**
 * 지금 신앙심으로 쓸 수 있는 능력만 골라냅니다.
 * @param {string} godId - 신 키
 * @param {number} piety - 신앙심
 * @returns {object[]} 쓸 수 있는 능력 목록
 */
export function availableAbilities(godId, piety) {
    const god = GODS[godId];
    if (!god) return [];
    const rank = pietyRank(piety);
    return god.abilities.filter(ability => rank >= ability.rank);
}

/** @returns {string[]} 섬길 수 있는 신 키 목록 */
export function allGods() {
    return Object.keys(GODS);
}

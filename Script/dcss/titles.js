/**
 * @fileoverview 플레이어의 칭호를 정합니다.
 *
 * 원본은 이름 뒤에 칭호를 붙입니다. 그 칭호는 가장 높은 스킬이 무엇이고
 * 얼마나 높은지로 정해집니다. 격투가 높으면 Trooper 에서 시작해 Conqueror 로,
 * 회피가 높으면 Ducker 에서 Intangible 로 갑니다.
 *
 * 이것이 좋은 이유는 플레이어가 무엇을 해 왔는지가 이름에 남기 때문입니다.
 * 레벨 숫자는 얼마나 오래 했는지만 말하지만, 칭호는 어떻게 해 왔는지를 말합니다.
 * 같은 XL 15 라도 Warrior 와 Spry 는 다른 사람입니다.
 *
 * 신을 섬기면 기원 스킬의 칭호 자리를 신앙심에 따른 신도 칭호가 대신합니다.
 *
 * 출처: crawl-ref/source/skills.cc (69-128, 1923, 2017, 2306, 2318),
 *       crawl-ref/source/describe-god.cc (130-271)
 */

/**
 * @description 스킬마다의 칭호 사다리. (skills.cc:69)
 *
 * 다섯 칸이고 각각 수준 0~7, 8~14, 15~20, 21~26, 27 입니다.
 * `@Genus@` 같은 자리는 종족 이름으로 채웁니다.
 */
const SKILL_TITLES = {
    fighting: ['Trooper', 'Fighter', 'Warrior', 'Slayer', 'Conqueror'],
    short_blades: ['Cutter', 'Slicer', 'Swashbuckler', 'Cutthroat', 'Politician'],
    long_blades: ['Slasher', 'Carver', 'Fencer', '@Adj@ Blade', 'Swordmaster'],
    axes: ['Chopper', 'Cleaver', 'Severer', 'Executioner', 'Axe Maniac'],
    maces_flails: ['Cudgeller', 'Basher', 'Bludgeoner', 'Shatterer', 'Skullcrusher'],
    polearms: ['Poker', 'Spear-Bearer', 'Impaler', 'Phalangite', '@Adj@ Porcupine'],
    staves: ['Twirler', 'Cruncher', 'Stickfighter', 'Pulveriser', 'Chief of Staff'],
    ranged_weapons: ['Shooter', 'Skirmisher', 'Marks@genus@', 'Crack Shot', 'Merry @Genus@'],
    throwing: ['Chucker', 'Thrower', 'Deadly Accurate', 'Hawkeye', '@Adj@ Ballista'],
    armour: ['Covered', 'Protected', 'Tortoise', 'Impregnable', 'Invulnerable'],
    dodging: ['Ducker', 'Nimble', 'Spry', 'Acrobat', 'Intangible'],
    stealth: ['Sneak', 'Covert', 'Unseen', 'Imperceptible', 'Ninja'],
    shields: ['Shield-Bearer', 'Blocker', 'Peltast', 'Hoplite', '@Adj@ Barricade'],
    unarmed_combat: ['Ruffian', 'Grappler', 'Brawler', 'Wrestler', '@Weight@weight Champion'],

    spellcasting: ['Magician', 'Thaumaturge', 'Eclecticist', 'Sorcerer', 'Archmage'],
    conjurations: ['Conjurer', 'Destroyer', 'Devastator', 'Ruinous', 'Annihilator'],
    hexes: ['Vexing', 'Jinx', 'Bewitcher', 'Maledictor', 'Spellbinder'],
    summonings: ['Caller', 'Summoner', 'Convoker', 'Worldbinder', 'Planerender'],
    necromancy: ['Grave Robber', 'Reanimator', 'Necromancer', 'Thanatomancer', '@Genus_Short@ of Death'],
    translocations: ['Grasshopper', 'Placeless @Genus@', 'Blinker', 'Portalist', 'Plane @Walker@'],
    forgecraft: ['Tinkerer', 'Fabricator', 'Mechanist', 'Siegecrafter', 'Architect of Ages'],

    fire_magic: ['Firebug', 'Arsonist', 'Scorcher', 'Pyromancer', 'Infernalist'],
    ice_magic: ['Chiller', 'Frost Mage', 'Gelid', 'Cryomancer', 'Englaciator'],
    air_magic: ['Gusty', 'Zephyrmancer', 'Stormcaller', 'Cloud Mage', 'Meteorologist'],
    earth_magic: ['Digger', 'Geomancer', 'Earth Mage', 'Metallomancer', 'Petrodigitator'],
    alchemy: ['Apothecary', 'Toxicologist', 'Hermetic', 'Philosopher', 'Quintessent'],

    invocations: ['Unbeliever', 'Agnostic', 'Dissident', 'Heretic', 'Apostate'],
    evocations: ['Charlatan', 'Prestidigitator', 'Fetichist', 'Evocator', 'Ex Machina'],
    shapeshifting: ['Changeling', 'Mimic', 'Metamorph', 'Skinwalker', 'Shapeless @Genus@'],
};

/**
 * @description 맨손 격투의 다른 사다리. (skills.cc:125)
 * 민첩이 힘보다 높으면 무술가 쪽으로 갑니다.
 */
const MARTIAL_ARTS_TITLES = ['Insei', 'Martial Artist', 'Black Belt', 'Sensei', 'Grand Master'];

/**
 * @description 신도 칭호. (describe-god.cc:130)
 *
 * 여덟 칸이고 0 은 파문, 1~7 은 신앙심이 오르는 차례입니다.
 * 기원 스킬이 가장 높을 때 이것이 스킬 칭호를 대신합니다.
 */
const DIVINE_TITLES = {
    none: ['Buglet', 'Firebug', 'Bogeybug', 'Bugger', 'Bugbear', 'Bugged One', 'Giant Bug', 'Lord of the Bugs'],
    zin: ['Blasphemer', 'Anchorite', 'Apologist', 'Pious', 'Devout', 'Orthodox', 'Immaculate', 'Bringer of Law'],
    tso: ['Honourless', 'Acolyte', 'Righteous', 'Unflinching', 'Holy Warrior', 'Exorcist', 'Demon Slayer', 'Bringer of Light'],
    kikubaaqudgha: ['Tormented', 'Purveyor of Pain', 'Pupil of Sorrows', 'Merchant of Misery', 'Scholar of Souls', 'Artisan of Death', 'Demagogue of Despair', 'Lord of Darkness'],
    yredelemnul: ['Traitor', 'Torchbearer', 'Despoiler', 'Black Crusader', 'Fallen @Genus@', 'Harbinger of Doom', 'Inexorable Tide', 'Bringer of Blasphemy'],
    xom: ['Toy', 'Toy', 'Toy', 'Toy', 'Toy', 'Toy', 'Toy', 'Toy'],
    vehumet: ['Meek', "Sorcerer's Apprentice", 'Scholar of Destruction', 'Caster of Ruination', 'Traumaturge', 'Battlemage', 'Warlock', 'Luminary of Lethal Lore'],
    okawaru: ['Coward', 'Struggler', 'Combatant', '@Genus@-At-Arms', 'Knight', 'Myrmidon', 'Warmonger', 'Victor of a Thousand Battles'],
    makhleb: ['Orderly', 'Spawn of Chaos', 'Disciple of Destruction', 'Fanfare of Bloodshed', 'Fiendish', 'Demolition @Genus@', 'Pandemonic', 'Champion of Chaos'],
    sif_muna: ['Ignorant', 'Disciple', 'Student', 'Adept', 'Scribe', 'Scholar', 'Sage', 'Genius of the Arcane'],
    trog: ['Puny', 'Troglodyte', 'Angry Troglodyte', 'Frenzied', '@Genus@ of Prey', 'Rampant', 'Wild @Genus@', 'Bane of Scribes'],
    nemelex_xobeh: ['Unlucky @Genus@', 'Pannier', 'Jester', 'Fortune-Teller', 'Soothsayer', 'Magus', 'Cardsharp', 'Hand of Fortune'],
    elyvilon: ['Sinner', 'Practitioner', 'Comforter', 'Caregiver', 'Mender', 'Pacifist', 'Purifying @Genus@', 'Bringer of Life'],
    lugonu: ['Pure', 'Abyss-Baptised', 'Unweaver', 'Distorting @Genus@', 'Agent of Entropy', 'Schismatic', 'Envoy of Void', 'Corrupter of Planes'],
    beogh: ['Apostate', 'Convert', 'Proselytiser', 'Priest', 'Missionary', 'Evangelist', 'Unifier', 'Messiah'],
    jiyva: ['Scum', 'Squelcher', 'Ooze', 'Jelly', 'Slime Creature', 'Dissolving @Genus@', 'Blob', 'Royal Jelly'],
    fedhas: ['@Walking@ Fertiliser', 'Fungal', 'Green @Genus@', 'Cultivator', 'Fruitful', 'Photosynthesist', 'Green Death', 'Force of Nature'],
    cheibriados: ['Hasty', 'Sluggish @Genus@', 'Deliberate', 'Unhurried', 'Contemplative', 'Epochal', 'Timeless', '@Adj@ Aeon'],
    ashenzari: ['Star-crossed', 'Cursed', 'Initiated', 'Seer', 'Oracle', 'Illuminatus', 'Prince of Secrets', 'Omniscient'],
    dithmenos: ['Conspicuous', 'Nocturnal', 'Bump in the Night', 'Thespian', 'Tenebrous', 'Puppetmaster', '@Walking@ Midnight', 'Who Hides the Stars'],
    gozag: ['Profligate', 'Pauper', 'Entrepreneur', 'Capitalist', 'Rich', 'Opulent', 'Tycoon', 'Plutocrat'],
    qazlal: ['Unspoiled', '@Adj@ Mishap', 'Lightning Rod', '@Adj@ Disaster', 'Eye of the Storm', '@Adj@ Catastrophe', '@Adj@ Cataclysm', 'End of an Era'],
    ru: ['Sleeper', 'Questioner', 'Initiate', 'Seeker of Truth', '@Walker@ of the Path', 'Lifter of the Veil', 'Transcendent', 'Drop of Water'],
    uskayaw: ['Prude', 'Wallflower', 'Party-goer', 'Dancer', 'Impassioned', 'Rapturous', 'Ecstatic', 'Rhythm of Life and Death'],
    hepliaklqana: ['Damnatio Memoriae', 'Hazy', '@Adj@ @Child@', 'Storyteller', 'Brooding', 'Anamnesiscian', 'Grand Scion', 'Unforgettable'],
    wu_jian: ['Wooden Rat', 'Young Dog', 'Young Crane', 'Young Tiger', 'Young Dragon', 'Red Sash', 'Golden Sash', 'Sifu'],
    ignis: ['Extinguished', 'Last Ember', 'Glowing Coal', 'Thurifer', 'Hearthfire', 'Furnace', 'Raging Flame', 'Inferno'],
};

/**
 * @description 몸집에 따른 체급. (skills.cc:1907)
 * 맨손 격투 27 의 `@Weight@weight Champion` 에 들어갑니다.
 */
const WEIGHT_BY_SPECIES = {
    troll: 'Heavy', ogre: 'Heavy', coglin: 'Heavy',
    spriggan: 'Fly', kobold: 'Feather', tengu: 'Feather',
    deep_elf: 'Light', 'deep-elf': 'Light',
};

/** @description 체급을 알 수 없을 때. 원본의 마지막 갈래입니다. */
const DEFAULT_WEIGHT = 'Middle';

/**
 * 스킬 수준을 칭호 칸으로 바꿉니다. (skills.cc:1923 get_skill_rank)
 * @param {number} level - 스킬 수준 (0~27)
 * @returns {number} 0~4
 */
export function skillRank(level) {
    if (level <= 7) return 0;
    if (level <= 14) return 1;
    if (level <= 20) return 2;
    if (level <= 26) return 3;
    return 4;
}

/**
 * 가장 높은 스킬을 고릅니다. (skills.cc:2318 best_skill)
 *
 * 원본은 같은 수준일 때 '그 수준에 먼저 도달한 쪽'을 고릅니다. 칭호가 쉽게
 * 바뀌지 않게 하려는 것입니다. 여기서는 그 순서를 기록해 두지 않으므로
 * 이름 차례로 가릅니다. 결과가 안정적이기만 하면 되는 자리라 그것으로 충분합니다.
 * @param {object} skills - 스킬 상태
 * @param {function(object, string): number} valueOf - 스킬 수준을 읽는 함수
 * @returns {string} 스킬 이름
 */
export function bestSkill(skills, valueOf) {
    let best = 'fighting';
    let bestValue = 0;

    for (const name of Object.keys(SKILL_TITLES)) {
        const value = valueOf(skills, name);
        if (value > bestValue) { best = name; bestValue = value; }
    }

    return best;
}

/**
 * 칭호 한 줄을 만듭니다. (skills.cc:2017 skill_title_by_rank)
 *
 * @param {string} skill - 가장 높은 스킬
 * @param {number} rank - 0~4
 * @param {object} context - 종족과 신앙
 * @param {object} [context.species] - 종족 정의 (enName 을 씁니다)
 * @param {string} [context.god] - 섬기는 신
 * @param {number} [context.pietyRank] - 신앙심 칸 (0~7)
 * @param {number} [context.str] - 힘
 * @param {number} [context.dex] - 민첩
 * @returns {string} 칭호
 */
export function skillTitle(skill, rank, context = {}) {
    // 기원이 가장 높고 신을 섬기면 신도 칭호가 대신합니다. (skills.cc:2229)
    if (skill === 'invocations' && context.god && context.god !== 'none') {
        const ladder = DIVINE_TITLES[context.god];
        if (ladder) return expand(ladder[clamp(context.pietyRank ?? 0, 0, 7)], context);
    }

    // 맨손 격투는 민첩이 힘보다 높으면 다른 사다리를 씁니다. (skills.cc:2070)
    if (skill === 'unarmed_combat' && (context.dex ?? 0) > (context.str ?? 0)) {
        return expand(MARTIAL_ARTS_TITLES[clamp(rank, 0, 4)], context);
    }

    const ladder = SKILL_TITLES[skill] ?? SKILL_TITLES.fighting;
    return expand(ladder[clamp(rank, 0, 4)], context);
}

/**
 * 이름 뒤에 붙일 칭호를 구합니다. (skills.cc:2306 player_title)
 * @param {object} skills - 스킬 상태
 * @param {function(object, string): number} valueOf - 스킬 수준을 읽는 함수
 * @param {object} context - 종족과 신앙
 * @returns {string} 칭호
 */
export function playerTitle(skills, valueOf, context = {}) {
    const skill = bestSkill(skills, valueOf);
    return skillTitle(skill, skillRank(valueOf(skills, skill)), context);
}

/**
 * 이름과 칭호를 한 줄로 잇습니다. (output.cc:1429 _redraw_title)
 *
 * 원본은 마흔두 칸을 넘으면 'the' 를 떼고 쉼표로 바꿉니다.
 * 한 칭호만 예외인데, 그 칭호 자체가 쉼표로 시작하기 때문입니다.
 * @param {string} name - 플레이어 이름
 * @param {string} title - 칭호
 * @param {number} [width] - 한 줄에 들어가는 칸 수
 * @returns {string} 표시할 줄
 */
export function titleLine(name, title, width = 42) {
    // "Who Hides the Stars" 는 원본도 the 대신 쉼표를 씁니다. (skills.cc:2312)
    if (title === 'Who Hides the Stars') return `${name}, ${title}`;

    const full = `${name} the ${title}`;
    if (full.length <= width) return full;

    return `${name}, ${title}`;
}

/**
 * `@...@` 자리를 채웁니다. (skills.cc:2287)
 * @param {string} text - 칭호
 * @param {object} context - 종족 정보
 * @returns {string} 채워진 칭호
 */
function expand(text, context) {
    const genus = context.species?.enName ?? 'Adventurer';

    return text
        .replaceAll('@Genus_Short@', genus)
        .replaceAll('@Genus@', genus)
        .replaceAll('@genus@', genus.toLowerCase())
        .replaceAll('@Adj@', genus)
        .replaceAll('@Walker@', 'Walker')
        .replaceAll('@Walking@', 'Walking')
        .replaceAll('@Child@', 'Child')
        .replaceAll('@Weight@', WEIGHT_BY_SPECIES[context.species?.id] ?? DEFAULT_WEIGHT);
}

/**
 * 값을 범위 안으로 넣습니다.
 * @param {number} value - 값
 * @param {number} low - 최솟값
 * @param {number} high - 최댓값
 * @returns {number} 범위 안의 값
 */
function clamp(value, low, high) {
    return Math.max(low, Math.min(high, value));
}

/**
 * 칭호가 있는 스킬 목록을 돌려줍니다. 검사와 도구가 씁니다.
 * @returns {Array<string>} 스킬 이름들
 */
export function titledSkills() {
    return Object.keys(SKILL_TITLES);
}

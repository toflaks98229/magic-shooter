/**
 * @fileoverview 몬스터 정의.
 *
 * 이전에는 적이 네 종류뿐이라 어느 던전을 가도 같은 것들이 나왔습니다.
 * 이제 던전마다 자기 몬스터 목록을 갖고(branches.js / portals.js의 monsters 필드),
 * 여기에 정의된 것들 중에서 깊이에 맞는 것이 뽑힙니다.
 *
 *   tier      - 등장하기 시작하는 대략적인 깊이. 낮을수록 초반에 나옵니다.
 *   behavior  - 행동 방식. gameLogic.js의 ENEMY_BEHAVIORS에 같은 이름의 처리기가 있어야 합니다.
 *   hp/speed/damage/cooldown - 기본 능력치
 *   size      - 충돌 및 렌더링 크기
 *   color     - 피격 파티클 색. 스프라이트를 못 찾았을 때의 대체 색으로도 쓰입니다.
 *   fleeBelow - 체력이 최대치의 이 비율 아래로 떨어지면 도망칩니다. 없으면 끝까지 싸웁니다.
 *               언데드·구조물·보스에는 넣지 않았습니다. 겁먹는 것이 어색하기 때문입니다.
 *               behavior 와는 다른 축입니다. 무엇으로 싸우든 겁은 먹을 수 있습니다.
 *
 * 행동별 추가 값
 *   ranged   : projectileSpeed, range
 *   exploder : fuseMs, blastRadius, blastDamage
 *   summoner : summonId, summonCooldown, maxSummons
 *   healer   : healAmount, healRange, healCooldown
 */

/** @description 모든 몬스터 정의 */
export const MONSTERS = {
    // --- 초반 잡몹 ---------------------------------------------------------
    rat: {
        name: '쥐', tier: 1, behavior: 'melee',
        hp: 14, speed: 1.1, damage: 5, cooldown: 700, size: 14,
        color: '#9a8f86', spriteKey: 'enemy_rat',
        fleeBelow: 0.35,
    },
    kobold: {
        name: '코볼트 산적', tier: 1, behavior: 'melee',
        hp: 22, speed: 0.9, damage: 8, cooldown: 900, size: 18,
        color: '#c8762c', spriteKey: 'enemy_kobold',
        fleeBelow: 0.3,
    },
    snake: {
        name: '뱀', tier: 2, behavior: 'melee',
        hp: 26, speed: 1.0, damage: 11, cooldown: 800, size: 17,
        color: '#4f9c3a', spriteKey: 'enemy_snake',
        fleeBelow: 0.25,
    },
    frog: {
        name: '거대 개구리', tier: 2, behavior: 'melee',
        hp: 34, speed: 0.8, damage: 10, cooldown: 1000, size: 22,
        color: '#3f8fb0', spriteKey: 'enemy_frog',
        fleeBelow: 0.25,
    },

    // --- 오크·성채 ---------------------------------------------------------
    goblin: {
        name: '고블린', tier: 2, behavior: 'melee',
        hp: 28, speed: 0.95, damage: 10, cooldown: 850, size: 19,
        color: '#8fa03a', spriteKey: 'enemy_goblin',
        fleeBelow: 0.3,
    },
    orc: {
        name: '오크', tier: 4, behavior: 'melee',
        hp: 48, speed: 0.8, damage: 15, cooldown: 1000, size: 22,
        color: '#3f7a4a', spriteKey: 'enemy_orc',
    },
    orc_warrior: {
        name: '오크 전사', tier: 7, behavior: 'melee',
        hp: 85, speed: 0.9, damage: 22, cooldown: 1100, size: 25,
        color: '#b23a3a', spriteKey: 'enemy_orc_warrior',
    },
    centaur: {
        name: '켄타우로스', tier: 6, behavior: 'ranged',
        hp: 55, speed: 1.0, damage: 14, cooldown: 1300, size: 26,
        projectileSpeed: 4.5, range: 32 * 11,
        color: '#a9713c', spriteKey: 'enemy_centaur',
        fleeBelow: 0.4,
    },

    // --- 짐승굴 -------------------------------------------------------------
    beast: {
        name: '짐승', tier: 5, behavior: 'melee',
        hp: 60, speed: 1.25, damage: 18, cooldown: 900, size: 24,
        color: '#2f2f33', spriteKey: 'enemy_beast',
    },
    spider: {
        name: '거대 거미', tier: 5, behavior: 'melee',
        hp: 40, speed: 1.4, damage: 14, cooldown: 700, size: 20,
        color: '#6b3f9c', spriteKey: 'enemy_spider',
        fleeBelow: 0.25,
    },
    hydra: {
        name: '히드라', tier: 9, behavior: 'melee',
        hp: 140, speed: 0.7, damage: 28, cooldown: 900, size: 30,
        color: '#c8c0a8', spriteKey: 'enemy_hydra',
    },
    slime: {
        name: '슬라임', tier: 6, behavior: 'exploder',
        hp: 45, speed: 0.85, damage: 0, cooldown: 1000, size: 22,
        fuseMs: 600, blastRadius: 32 * 2.2, blastDamage: 30,
        color: '#7fc04a', spriteKey: 'enemy_slime',
    },

    // --- 언데드 -------------------------------------------------------------
    zombie: {
        name: '좀비', tier: 2, behavior: 'melee',
        hp: 40, speed: 0.55, damage: 12, cooldown: 1200, size: 21,
        color: '#b9b0a0', spriteKey: 'enemy_zombie',
    },
    skeleton: {
        name: '스켈레톤', tier: 3, behavior: 'melee',
        hp: 32, speed: 0.9, damage: 12, cooldown: 900, size: 20,
        color: '#d8d4c8', spriteKey: 'enemy_skeleton',
    },
    mummy: {
        name: '미라', tier: 5, behavior: 'melee',
        hp: 65, speed: 0.6, damage: 20, cooldown: 1300, size: 23,
        color: '#c2ad5e', spriteKey: 'enemy_mummy',
    },
    spectre: {
        name: '망령', tier: 11, behavior: 'ranged',
        hp: 50, speed: 0.75, damage: 20, cooldown: 1600, size: 24,
        projectileSpeed: 3.0, range: 32 * 9,
        color: '#9ec8ff', spriteKey: 'enemy_spectre',
    },

    // --- 얼음 ---------------------------------------------------------------
    ice_beast: {
        name: '얼음 짐승', tier: 7, behavior: 'melee',
        hp: 70, speed: 0.9, damage: 18, cooldown: 950, size: 24,
        color: '#7ec6e8', spriteKey: 'enemy_ice_beast',
    },
    simulacrum: {
        name: '시뮬라크럼', tier: 8, behavior: 'exploder',
        hp: 38, speed: 1.0, damage: 0, cooldown: 1000, size: 21,
        fuseMs: 500, blastRadius: 32 * 2.5, blastDamage: 26,
        color: '#bfe4f5', spriteKey: 'enemy_simulacrum',
    },
    ice_giant: {
        name: '얼음 거인', tier: 11, behavior: 'melee',
        hp: 160, speed: 0.7, damage: 32, cooldown: 1400, size: 30,
        color: '#4a7fc8', spriteKey: 'enemy_ice_giant',
    },

    // --- 화염·악마 -----------------------------------------------------------
    gargoyle: {
        name: '가고일', tier: 8, behavior: 'melee',
        hp: 90, speed: 0.65, damage: 22, cooldown: 1200, size: 25,
        color: '#8b8b93', spriteKey: 'enemy_gargoyle',
    },
    imp: {
        name: '임프', tier: 4, behavior: 'ranged',
        hp: 30, speed: 0.9, damage: 13, cooldown: 1500, size: 18,
        projectileSpeed: 3.2, range: 32 * 8,
        color: '#9932cc', spriteKey: 'enemy_imp',
    },
    fire_demon: {
        name: '화염 악마', tier: 10, behavior: 'ranged',
        hp: 80, speed: 0.85, damage: 22, cooldown: 1200, size: 25,
        projectileSpeed: 4.0, range: 32 * 10,
        color: '#e06a26', spriteKey: 'enemy_fire_demon',
    },
    hell_knight: {
        name: '지옥 기사', tier: 13, behavior: 'melee',
        hp: 150, speed: 1.0, damage: 34, cooldown: 1000, size: 27,
        color: '#8f2222', spriteKey: 'enemy_hell_knight',
    },
    demon: {
        name: '상급 악마', tier: 15, behavior: 'summoner',
        hp: 130, speed: 0.7, damage: 24, cooldown: 1400, size: 28,
        summonId: 'imp', summonCooldown: 5000, maxSummons: 3,
        color: '#5e2f8f', spriteKey: 'enemy_demon',
    },

    // --- 던전별 고유 종 -------------------------------------------------------
    // 아래는 던전 구성표에 이름이 나온 것들입니다.
    crocodile: {
        name: '악어', tier: 6, behavior: 'melee',
        hp: 75, speed: 0.95, damage: 20, cooldown: 1000, size: 26,
        color: '#5c6b3a', spriteKey: 'enemy_crocodile',
    },
    merfolk: {
        name: '인어', tier: 7, behavior: 'ranged',
        hp: 60, speed: 1.05, damage: 16, cooldown: 1200, size: 23,
        projectileSpeed: 4.2, range: 32 * 9,
        color: '#3f8f9c', spriteKey: 'enemy_merfolk',
    },
    naga: {
        name: '나가', tier: 8, behavior: 'melee',
        hp: 95, speed: 0.8, damage: 24, cooldown: 1100, size: 27,
        color: '#4a7c3f', spriteKey: 'enemy_naga',
    },
    killer_bee: {
        name: '살인벌', tier: 5, behavior: 'melee',
        hp: 30, speed: 1.5, damage: 13, cooldown: 600, size: 16,
        color: '#c8a02c', spriteKey: 'enemy_killer_bee',
    },
    jelly: {
        name: '젤리', tier: 7, behavior: 'melee',
        hp: 70, speed: 0.7, damage: 19, cooldown: 900, size: 24,
        color: '#8fb84a', spriteKey: 'enemy_jelly',
    },
    deep_elf: {
        name: '딥 엘프 마법사', tier: 11, behavior: 'ranged',
        hp: 65, speed: 0.9, damage: 24, cooldown: 1300, size: 24,
        projectileSpeed: 4.5, range: 32 * 11,
        color: '#8f6fc0', spriteKey: 'enemy_deep_elf',
    },
    deep_elf_knight: {
        name: '딥 엘프 기사', tier: 12, behavior: 'melee',
        hp: 120, speed: 1.05, damage: 28, cooldown: 950, size: 26,
        color: '#5f5f8f', spriteKey: 'enemy_deep_elf_knight',
    },
    ice_dragon: {
        name: '얼음 용', tier: 13, behavior: 'ranged',
        hp: 180, speed: 0.75, damage: 30, cooldown: 1500, size: 32,
        projectileSpeed: 3.8, range: 32 * 10,
        color: '#5aa8d8', spriteKey: 'enemy_ice_dragon',
    },
    fire_giant: {
        name: '화염 거인', tier: 14, behavior: 'melee',
        hp: 190, speed: 0.8, damage: 36, cooldown: 1300, size: 31,
        color: '#c85a2a', spriteKey: 'enemy_fire_giant',
    },
    stone_giant: {
        name: '바위 거인', tier: 13, behavior: 'melee',
        hp: 200, speed: 0.65, damage: 34, cooldown: 1400, size: 32,
        color: '#8a8478', spriteKey: 'enemy_stone_giant',
    },
    troll: {
        name: '트롤', tier: 10, behavior: 'melee',
        hp: 140, speed: 1.0, damage: 28, cooldown: 1000, size: 29,
        color: '#6b7c4a', spriteKey: 'enemy_troll',
    },
    golem: {
        name: '골렘', tier: 14, behavior: 'melee',
        hp: 210, speed: 0.55, damage: 32, cooldown: 1500, size: 30,
        color: '#7a7a82', spriteKey: 'enemy_golem',
    },
    phantasmal: {
        name: '환영 전사', tier: 12, behavior: 'melee',
        hp: 85, speed: 1.1, damage: 26, cooldown: 900, size: 25,
        color: '#7fc0c8', spriteKey: 'enemy_phantasmal',
    },
    rakshasa: {
        name: '락샤샤', tier: 13, behavior: 'summoner',
        hp: 110, speed: 0.95, damage: 24, cooldown: 1100, size: 26,
        summonId: 'phantasmal', summonCooldown: 6000, maxSummons: 2,
        color: '#d07a2a', spriteKey: 'enemy_rakshasa',
    },
    mana_viper: {
        name: '마나 바이퍼', tier: 12, behavior: 'ranged',
        hp: 70, speed: 1.0, damage: 22, cooldown: 1400, size: 24,
        projectileSpeed: 4.0, range: 32 * 9,
        color: '#9c5fc8', spriteKey: 'enemy_mana_viper',
    },
    cacodemon: {
        name: '커럽터', tier: 15, behavior: 'summoner',
        hp: 150, speed: 0.7, damage: 26, cooldown: 1300, size: 29,
        summonId: 'imp', summonCooldown: 4500, maxSummons: 3,
        color: '#a04ac0', spriteKey: 'enemy_cacodemon',
    },

    // --- 네임드 -------------------------------------------------------------
    menkaure: {
        name: '멘카우레', tier: 4, behavior: 'summoner', named: true,
        hp: 130, speed: 0.6, damage: 22, cooldown: 1200, size: 30,
        summonId: 'skeleton', summonCooldown: 4500, maxSummons: 4,
        color: '#d8b64a', spriteKey: 'enemy_menkaure',
    },
    purgy: {
        name: '퍼기', tier: 3, behavior: 'melee', named: true,
        hp: 110, speed: 1.0, damage: 20, cooldown: 900, size: 30,
        color: '#2f9fb8', spriteKey: 'enemy_purgy',
    },
    minotaur: {
        name: '미노타우로스', tier: 10, behavior: 'melee', named: true,
        hp: 260, speed: 1.15, damage: 40, cooldown: 1000, size: 34,
        color: '#3a2f2a', spriteKey: 'enemy_minotaur',
    },
};

/**
 * @description 던전이 몬스터 목록을 지정하지 않았을 때 쓰는 기본 구성.
 * 메인 던전에서 만나는 잡다한 것들입니다.
 */
export const DEFAULT_SPAWN_TABLE = [
    'rat', 'kobold', 'goblin', 'snake', 'zombie', 'skeleton',
    'orc', 'imp', 'orc_warrior', 'centaur', 'gargoyle', 'hell_knight',
];

/**
 * @description tier가 현재 깊이보다 얼마나 높은 것까지 허용할지.
 * 조금 넘는 것은 나오게 두어야 가끔 벅찬 상대를 만나는 긴장감이 생깁니다.
 */
const TIER_HEADROOM = 2;

/**
 * @description 한 층에 함께 나올 수 있는 tier 폭.
 *
 * 이 층에서 나올 수 있는 가장 강한 것을 기준으로, 그보다 이만큼 아래까지만 함께 등장합니다.
 * 절대 깊이로 하한을 두면 문제가 생깁니다. 짐승굴은 메인 10층 아래에 있어 누적 깊이가 13인데,
 * 짐승굴의 몬스터는 대부분 그보다 낮은 tier라 전부 걸러지고 히드라만 남았습니다.
 * 기준을 '이 목록에서 나올 수 있는 가장 강한 것'으로 잡으면 던전의 구성이 유지됩니다.
 */
const TIER_SPREAD = 6;

/**
 * 주어진 깊이에서 뽑을 수 있는 몬스터 목록을 고릅니다.
 * @param {string[]} table - 던전의 몬스터 목록
 * @param {number} dangerLevel - 현재 누적 깊이
 * @returns {string[]} 뽑을 수 있는 몬스터 id 목록
 */
export function availableMonsters(table, dangerLevel) {
    // 네임드는 보스로만 배치되므로 일반 스폰 후보에서 제외합니다.
    const usable = table.filter(id => MONSTERS[id] && !MONSTERS[id].named);
    if (usable.length === 0) return [];

    const withinDepth = usable.filter(id => MONSTERS[id].tier <= dangerLevel + TIER_HEADROOM);

    // 아직 아무것도 감당할 수 없을 만큼 얕으면 가장 약한 것들을 내보냅니다.
    if (withinDepth.length === 0) {
        const weakest = Math.min(...usable.map(id => MONSTERS[id].tier));
        return usable.filter(id => MONSTERS[id].tier === weakest);
    }

    // 등장 가능한 것 중 가장 강한 것을 기준으로 아래쪽을 잘라냅니다.
    const strongest = Math.max(...withinDepth.map(id => MONSTERS[id].tier));
    return withinDepth.filter(id => MONSTERS[id].tier >= strongest - TIER_SPREAD);
}

/**
 * 몬스터 정의를 조회합니다.
 * @param {string} id - 몬스터 id
 * @returns {object|undefined} 몬스터 정의
 */
export function getMonster(id) {
    return MONSTERS[id];
}

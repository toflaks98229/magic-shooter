/**
 * @fileoverview 아이템 정의.
 *
 * 이전에는 체력과 탄약 두 가지뿐이라, 바닥에 떨어진 것을 보고 고민할 일이 없었습니다.
 * 지금 주울지 아껴둘지 판단할 거리를 만들려면 즉시 효과와 지속 효과가 함께 있어야 합니다.
 *
 *   category   - 소지품 창에서 묶일 분류 (inventory.js 의 CATEGORIES)
 *   effect     - 사용 시 적용할 효과. items.js 의 ITEM_EFFECTS 에 같은 이름이 있어야 합니다.
 *   tier       - 등장하기 시작하는 대략적인 깊이
 *   weight     - 같은 깊이의 후보들 사이에서의 상대 등장 빈도
 *   durationMs - 지속 효과의 유지 시간 (즉시 효과에는 없습니다)
 *
 * 지속 효과는 world.buffs 에 쌓이고 update() 가 만료를 확인합니다.
 * 저장 대상이므로 세이브를 불러와도 남은 시간이 그대로 이어집니다.
 */

/** @description 모든 아이템 정의 */
export const ITEMS = {
    // --- 즉시 효과 ---------------------------------------------------------
    healing: {
        name: '치유의 물약', category: 'potion', effect: 'heal', amount: 30,
        tier: 1, weight: 30, size: 15, color: '#c0392b',
        spriteKey: 'item_health',
    },
    magic: {
        name: '마력의 물약', category: 'potion', effect: 'restoreAmmo', amount: 25,
        tier: 1, weight: 30, size: 15, color: '#2980b9',
        spriteKey: 'item_ammo',
    },
    greaterHealing: {
        name: '완전 치유의 물약', category: 'potion', effect: 'heal', amount: 80,
        tier: 8, weight: 8, size: 16, color: '#e74c3c',
        spriteKey: 'item_greater_health',
    },

    // --- 지속 효과 ---------------------------------------------------------
    might: {
        name: '힘의 물약', category: 'potion', effect: 'might', durationMs: 20_000,
        tier: 3, weight: 10, size: 15, color: '#c0392b',
        spriteKey: 'item_might',
    },
    haste: {
        name: '가속의 물약', category: 'potion', effect: 'haste', durationMs: 15_000,
        tier: 5, weight: 10, size: 15, color: '#f39c12',
        spriteKey: 'item_haste',
    },
    resistance: {
        name: '보호의 물약', category: 'potion', effect: 'resistance', durationMs: 25_000,
        tier: 7, weight: 8, size: 15, color: '#16a085',
        spriteKey: 'item_resistance',
    },

    // --- 영구 강화 ---------------------------------------------------------
    // 던전 깊은 곳까지 내려갈 동기를 주는 보상입니다.
    vitality: {
        name: '생명의 물약', category: 'potion', effect: 'maxHp', amount: 15,
        tier: 10, weight: 4, size: 16, color: '#27ae60',
        spriteKey: 'item_vitality',
    },
    capacity: {
        name: '마력 확장의 물약', category: 'potion', effect: 'maxAmmo', amount: 20,
        tier: 10, weight: 4, size: 16, color: '#8e44ad',
        spriteKey: 'item_capacity',
    },
};

/** @description 적을 처치했을 때 아이템이 떨어질 확률 */
export const DROP_CHANCE = 0.45;

/**
 * @description 지속 효과가 실제로 무엇을 바꾸는지.
 * 여기에 없는 효과는 즉시 효과이며 actions.js 가 처리합니다.
 *
 * damageMultiplier - 플레이어가 주는 피해 배율
 * speedMultiplier  - 플레이어 이동 속도 배율
 * damageTaken      - 플레이어가 받는 피해 배율
 */
export const BUFF_MODIFIERS = {
    might: { damageMultiplier: 1.8 },
    haste: { speedMultiplier: 1.5 },
    resistance: { damageTaken: 0.5 },
};

/**
 * 주어진 깊이에서 떨어질 수 있는 아이템 목록을 고릅니다.
 * 깊이에 못 미치는 것은 제외하되, 기본 물약은 언제나 남습니다.
 * @param {number} dangerLevel - 현재 누적 깊이
 * @returns {string[]} 아이템 id 목록
 */
export function availableItems(dangerLevel) {
    return Object.keys(ITEMS).filter(id => ITEMS[id].tier <= dangerLevel);
}

/**
 * 등장 빈도(weight)를 반영해 아이템 하나를 뽑습니다.
 * @param {number} dangerLevel - 현재 누적 깊이
 * @param {() => number} [random] - 난수 생성기
 * @returns {string|null} 아이템 id
 */
export function rollItem(dangerLevel, random = Math.random) {
    const candidates = availableItems(dangerLevel);
    if (candidates.length === 0) return null;

    const total = candidates.reduce((sum, id) => sum + ITEMS[id].weight, 0);
    let roll = random() * total;

    for (const id of candidates) {
        roll -= ITEMS[id].weight;
        if (roll <= 0) return id;
    }
    return candidates[candidates.length - 1];
}

/**
 * 아이템 정의를 조회합니다.
 * @param {string} id - 아이템 id
 * @returns {object|undefined} 아이템 정의
 */
export function getItem(id) {
    return ITEMS[id];
}

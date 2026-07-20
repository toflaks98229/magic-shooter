/**
 * @fileoverview 소지품.
 *
 * 이전에는 바닥의 물약을 밟는 순간 자동으로 마셨습니다. 그러면 체력이 가득 찬 상태에서
 * 치유의 물약을 밟기만 해도 사라지고, 언제 쓸지 고를 여지가 없습니다.
 * 이제 주운 것은 소지품에 들어가고, 쓰는 시점은 플레이어가 정합니다.
 *
 * 구성은 Dungeon Crawl Stone Soup 을 따릅니다. 항목마다 a, b, c … 글자가 붙고
 * 종류별로 묶여 표시되며, 같은 것은 하나의 칸에 쌓입니다.
 */

import { getItem, ITEMS } from './items.js';

/** @description 소지품 칸 수. 다 차면 더 줍지 못하고 바닥에 남습니다. */
export const INVENTORY_SLOTS = 20;

/**
 * @description 소지품 창에서 항목을 묶어 보여줄 분류.
 * order 는 표시 순서입니다.
 */
export const CATEGORIES = {
    potion: { name: '물약', order: 1 },
    scroll: { name: '두루마리', order: 2 },
    wand: { name: '지팡이', order: 3 },
    misc: { name: '기타', order: 9 },
};

/**
 * 칸 번호에 해당하는 글자를 돌려줍니다. (0 -> 'a')
 * @param {number} index - 칸 번호
 * @returns {string} 표시용 글자
 */
export function slotLetter(index) {
    return String.fromCharCode(97 + index);
}

/**
 * 글자에 해당하는 칸 번호를 돌려줍니다. ('a' -> 0)
 * @param {string} letter - 글자
 * @returns {number} 칸 번호. 범위를 벗어나면 -1.
 */
export function letterSlot(letter) {
    const index = letter.toLowerCase().charCodeAt(0) - 97;
    return index >= 0 && index < INVENTORY_SLOTS ? index : -1;
}

/**
 * 소지품에 아이템을 넣습니다. 같은 것이 이미 있으면 개수만 늘립니다.
 * @param {object[]} inventory - world.inventory
 * @param {string} itemId - items.js 의 아이템 id
 * @returns {boolean} 넣었으면 true, 자리가 없으면 false
 */
export function addToInventory(inventory, itemId) {
    if (!getItem(itemId)) return false;

    const existing = inventory.find(slot => slot.itemId === itemId);
    if (existing) {
        existing.count++;
        return true;
    }

    if (inventory.length >= INVENTORY_SLOTS) return false;

    inventory.push({ itemId, count: 1 });
    return true;
}

/**
 * 소지품에서 하나를 덜어냅니다. 마지막 하나였으면 칸 자체를 비웁니다.
 * @param {object[]} inventory - world.inventory
 * @param {number} index - 칸 번호
 * @returns {string|null} 덜어낸 아이템 id
 */
export function takeFromInventory(inventory, index) {
    const slot = inventory[index];
    if (!slot) return null;

    slot.count--;
    if (slot.count <= 0) inventory.splice(index, 1);

    return slot.itemId;
}

/**
 * 소지품을 종류별로 묶어 표시용 구조로 만듭니다.
 *
 * 글자는 묶기 전의 칸 번호로 매기므로, 창을 열 때마다 같은 물약이 같은 글자를 갖습니다.
 * 분류가 바뀔 때마다 글자가 뒤바뀌면 급할 때 잘못 마시게 됩니다.
 * @param {object[]} inventory - world.inventory
 * @returns {Array<{category: string, name: string, entries: object[]}>} 묶인 목록
 */
export function groupInventory(inventory) {
    const groups = new Map();

    inventory.forEach((slot, index) => {
        const item = getItem(slot.itemId);
        if (!item) return;

        const category = item.category || 'misc';
        if (!groups.has(category)) groups.set(category, []);

        groups.get(category).push({
            index,
            letter: slotLetter(index),
            itemId: slot.itemId,
            count: slot.count,
            item,
        });
    });

    return [...groups.entries()]
        .map(([category, entries]) => ({
            category,
            name: CATEGORIES[category]?.name || category,
            order: CATEGORIES[category]?.order ?? 99,
            entries,
        }))
        .sort((a, b) => a.order - b.order);
}

/**
 * 소지품 창의 제목에 쓸 요약을 만듭니다. (DCSS 의 'N/M gear slots' 를 따릅니다)
 * @param {object[]} inventory - world.inventory
 * @returns {string} 요약 문구
 */
export function inventorySummary(inventory) {
    return `소지품 ${inventory.length}/${INVENTORY_SLOTS}칸`;
}

/**
 * 아이템 이름을 개수와 함께 표시용으로 만듭니다.
 * @param {string} itemId - 아이템 id
 * @param {number} count - 개수
 * @returns {string} 표시 문구
 */
export function describeStack(itemId, count) {
    const item = ITEMS[itemId];
    if (!item) return '?';
    return count > 1 ? `${item.name} ${count}개` : item.name;
}

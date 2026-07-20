/**
 * @fileoverview 소지품 검증.
 *
 * 밟는 즉시 마시던 것을 소지품에 넣도록 바꾸면서 생긴 약속들입니다.
 *   가득 차면 줍지 않고 바닥에 남긴다 · 같은 것은 한 칸에 쌓인다
 *   글자와 숫자가 칸에 안정적으로 대응한다 · 세이브를 넘어 남는다
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const INV = await import('../Script/inventory.js');
const worldModule = await import('../Script/world.js');
const { resetWorld, serializeWorld, deserializeWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const { runtime } = await import('../Script/runtime.js');
const A = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');

bindStubDom(dom);

/** 빈 방 하나짜리 세계를 세웁니다. */
function emptyRoom() {
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.player.x = 10 * C.TILE_SIZE;
    worldModule.world.player.y = 10 * C.TILE_SIZE;
}

/** 발밑에 떨어뜨리고 한 스텝 진행해 줍습니다. */
function walkOver(itemId) {
    A.dropItem(itemId, worldModule.world.player.x, worldModule.world.player.y);
    gameLogic.update(C.SIMULATION_STEP_MS);
}

// --- 칸과 글자 ---------------------------------------------------------------

test('칸 번호와 글자가 서로 대응한다', () => {
    assert.equal(INV.slotLetter(0), 'a');
    assert.equal(INV.slotLetter(4), 'e');
    assert.equal(INV.letterSlot('a'), 0);
    assert.equal(INV.letterSlot('E'), 4, '대문자도 같은 칸이어야 합니다');
    assert.equal(INV.letterSlot('z'), -1, '칸 수를 넘는 글자는 없는 칸입니다');
});

test('같은 아이템은 한 칸에 쌓인다', () => {
    const inventory = [];
    assert.equal(INV.addToInventory(inventory, 'healing'), true);
    assert.equal(INV.addToInventory(inventory, 'healing'), true);
    assert.equal(INV.addToInventory(inventory, 'magic'), true);

    assert.equal(inventory.length, 2, '같은 물약이 칸을 두 개 차지했습니다');
    assert.equal(inventory[0].count, 2);
});

test('칸이 가득 차면 더 넣지 못한다', () => {
    // 서로 다른 이름으로 칸을 모두 채웁니다. 같은 것끼리는 쌓여서 칸이 늘지 않기 때문입니다.
    const inventory = Array.from({ length: INV.INVENTORY_SLOTS },
        (_, i) => ({ itemId: `filler#${i}`, count: 1 }));

    assert.equal(INV.addToInventory(inventory, 'healing'), false, '가득 찼는데 들어갔습니다');
    assert.equal(inventory.length, INV.INVENTORY_SLOTS);
});

test('하나씩 덜어내고 마지막이면 칸이 비워진다', () => {
    const inventory = [{ itemId: 'healing', count: 2 }];

    assert.equal(INV.takeFromInventory(inventory, 0), 'healing');
    assert.equal(inventory[0].count, 1);

    INV.takeFromInventory(inventory, 0);
    assert.equal(inventory.length, 0, '다 쓴 칸이 남아 있습니다');
});

test('소지품이 종류별로 묶여 표시된다', () => {
    const inventory = [{ itemId: 'healing', count: 3 }, { itemId: 'haste', count: 1 }];
    const groups = INV.groupInventory(inventory);

    assert.equal(groups.length, 1, '지금은 물약뿐이라 한 묶음이어야 합니다');
    assert.equal(groups[0].name, '물약');
    assert.equal(groups[0].entries.length, 2);

    // 글자는 칸 번호로 매겨져 묶는 방식이 바뀌어도 흔들리지 않아야 합니다.
    assert.equal(groups[0].entries[0].letter, 'a');
    assert.equal(groups[0].entries[1].letter, 'b');
});

test('개수가 표시 문구에 반영된다', () => {
    assert.equal(INV.describeStack('healing', 1), '치유의 물약');
    assert.match(INV.describeStack('healing', 3), /3개/);
});

// --- 줍기와 사용 -------------------------------------------------------------

test('밟으면 소지품에 들어가고 효과는 나지 않는다', () => {
    emptyRoom();
    worldModule.world.player.hp = 50;

    walkOver('healing');

    assert.equal(worldModule.world.inventory.length, 1);
    assert.equal(worldModule.world.items.length, 0, '주운 것이 바닥에 남았습니다');
    assert.equal(worldModule.world.player.hp, 50, '줍기만 했는데 효과가 났습니다');
});

test('소지품이 가득 차면 줍지 않고 바닥에 남긴다', () => {
    emptyRoom();
    // 서로 다른 이름으로 칸을 모두 채웁니다.
    for (let i = 0; i < INV.INVENTORY_SLOTS; i++) {
        worldModule.world.inventory.push({ itemId: `filler#${i}`, count: 1 });
    }

    walkOver('healing');

    assert.equal(worldModule.world.items.length, 1, '주울 수 없는데 아이템이 사라졌습니다');
    assert.equal(worldModule.world.inventory.length, INV.INVENTORY_SLOTS);
});

test('사용하면 효과가 나고 소지품에서 줄어든다', () => {
    emptyRoom();
    worldModule.world.player.hp = 40;
    walkOver('healing');
    walkOver('healing');

    assert.equal(worldModule.world.inventory[0].count, 2);

    assert.equal(A.useInventorySlot(0), true);
    assert.equal(worldModule.world.player.hp, 70);
    assert.equal(worldModule.world.inventory[0].count, 1, '한 번에 두 개가 사라졌습니다');
});

test('빈 칸을 쓰려 해도 아무 일도 없다', () => {
    emptyRoom();
    assert.equal(A.useInventorySlot(0), false);
    assert.equal(A.useInventorySlot(99), false);
});

// --- 입력과 창 ---------------------------------------------------------------

test('숫자키로 첫 아홉 칸을 곧바로 쓴다', () => {
    emptyRoom();
    worldModule.world.player.hp = 30;
    walkOver('magic');     // 0번 칸
    walkOver('healing');   // 1번 칸

    // 실시간 전투 중에 창을 열 여유가 없으므로 숫자키가 곧바로 이어져야 합니다.
    A.useInventorySlot(1);
    assert.equal(worldModule.world.player.hp, 60);
    assert.equal(worldModule.world.inventory.length, 1, '쓴 칸이 정리되지 않았습니다');
});

test('소지품 창은 접었다 펼 수 있다', () => {
    runtime.isInventoryOpen = false;
    runtime.isInventoryOpen = !runtime.isInventoryOpen;
    assert.equal(runtime.isInventoryOpen, true);
    runtime.isInventoryOpen = !runtime.isInventoryOpen;
    assert.equal(runtime.isInventoryOpen, false);
});

// --- 저장 --------------------------------------------------------------------

test('소지품이 세이브와 던전 이동을 넘어 남는다', () => {
    emptyRoom();
    walkOver('healing');
    walkOver('healing');
    walkOver('haste');

    const saved = serializeWorld();
    resetWorld();
    assert.equal(worldModule.world.inventory.length, 0);

    deserializeWorld(saved);
    assert.equal(worldModule.world.inventory.length, 2, '세이브에서 소지품이 사라졌습니다');
    assert.equal(worldModule.world.inventory[0].count, 2, '개수가 보존되지 않았습니다');

    // 서브 던전에 들어가도 들고 갑니다.
    A.enterBranch('L');
    assert.equal(worldModule.world.inventory.length, 2, '던전을 옮기며 소지품을 잃었습니다');
});

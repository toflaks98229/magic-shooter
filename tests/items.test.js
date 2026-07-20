/**
 * @fileoverview 아이템과 지속 효과 검증.
 *
 * 아이템이 체력·탄약 두 가지뿐이던 때는 주울지 말지 고민할 것이 없었습니다.
 * 지속 효과가 생기면서 확인해야 할 것이 늘었습니다.
 *   효과가 실제로 전투에 반영되는가 · 시간이 지나면 사라지는가
 *   깊이에 맞는 것만 떨어지는가 · 세이브에서 남은 시간이 이어지는가
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom, seedRandom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const I = await import('../Script/items.js');
const worldModule = await import('../Script/world.js');
const { resetWorld, serializeWorld, deserializeWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
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

/** 플레이어 발밑에 아이템을 놓고 한 스텝 진행해 소지품에 넣습니다. */
function pickUp(itemId) {
    A.dropItem(itemId, worldModule.world.player.x, worldModule.world.player.y);
    gameLogic.update(C.SIMULATION_STEP_MS);
}

/** 주운 뒤 곧바로 사용합니다. 예전처럼 밟자마자 효과가 나는지 보는 테스트용입니다. */
function pickUpAndUse(itemId) {
    pickUp(itemId);
    const index = worldModule.world.inventory.findIndex(slot => slot.itemId === itemId);
    assert.ok(index >= 0, `${itemId} 가 소지품에 들어가지 않았습니다`);
    A.useInventorySlot(index);
}

// --- 정의 -------------------------------------------------------------------

test('모든 아이템이 필요한 값을 갖춘다', () => {
    for (const [id, item] of Object.entries(I.ITEMS)) {
        assert.ok(item.name, `${id}에 이름이 없습니다`);
        assert.ok(item.effect, `${id}에 효과가 없습니다`);
        assert.ok(item.tier >= 1, `${id}의 tier 가 1보다 작습니다`);
        assert.ok(item.weight > 0, `${id}의 등장 빈도가 0입니다`);
        assert.ok(item.spriteKey, `${id}에 스프라이트가 없습니다`);
        assert.match(item.color, /^#[0-9a-f]{6}$/i, `${id}의 색 형식이 잘못되었습니다`);

        // 지속 효과라면 무엇을 바꾸는지가 정의되어 있어야 합니다.
        if (item.durationMs) {
            assert.ok(I.BUFF_MODIFIERS[item.effect],
                `${id}는 지속 효과인데 BUFF_MODIFIERS 에 ${item.effect} 가 없습니다`);
        } else {
            assert.ok(item.amount !== undefined, `${id}는 즉시 효과인데 amount 가 없습니다`);
        }
    }
});

test('깊이에 맞지 않는 아이템은 떨어지지 않는다', () => {
    const shallow = I.availableItems(1);
    assert.ok(shallow.includes('healing'), '기본 물약은 1층부터 나와야 합니다');
    assert.ok(!shallow.includes('vitality'), '영구 강화는 초반에 나오면 안 됩니다');

    const deep = I.availableItems(15);
    assert.ok(deep.includes('vitality'), '깊은 곳에서는 영구 강화가 나와야 합니다');
    assert.ok(deep.includes('healing'), '기본 물약은 계속 나와야 합니다');
});

test('등장 빈도가 반영된다', () => {
    // 기본 물약이 영구 강화보다 훨씬 흔해야 합니다.
    const tally = {};
    for (let seed = 0; seed < 600; seed++) {
        seedRandom(0x7000 + seed);
        const id = I.rollItem(15);
        tally[id] = (tally[id] || 0) + 1;
    }
    assert.ok(tally.healing > tally.vitality * 3,
        `치유 ${tally.healing} vs 생명 ${tally.vitality} — 빈도 차이가 반영되지 않았습니다`);
});

// --- 즉시 효과 ---------------------------------------------------------------

test('치유의 물약이 체력을 회복시킨다', () => {
    emptyRoom();
    worldModule.world.player.hp = 40;

    pickUp('healing');
    assert.equal(worldModule.world.items.length, 0, '주운 아이템이 바닥에 남아 있습니다');
    assert.equal(worldModule.world.player.hp, 40, '주웠을 뿐인데 효과가 났습니다');

    A.useInventorySlot(0);
    assert.equal(worldModule.world.player.hp, 70);
    assert.equal(worldModule.world.inventory.length, 0, '쓴 물약이 소지품에 남아 있습니다');
});

test('영구 강화는 최대치를 올리고 그만큼 채워준다', () => {
    emptyRoom();
    const beforeMax = worldModule.world.player.maxHp;
    worldModule.world.player.hp = 50;

    pickUpAndUse('vitality');

    assert.equal(worldModule.world.player.maxHp, beforeMax + 15);
    assert.equal(worldModule.world.player.hp, 65, '올려놓고 비어 있으면 보상 같지 않습니다');
});

// --- 지속 효과 ---------------------------------------------------------------

test('힘의 물약이 실제 피해량을 올린다', () => {
    emptyRoom();
    const target = gameLogic.spawnMonster('zombie', {
        x: worldModule.world.player.x + 20,
        y: worldModule.world.player.y,
    });
    worldModule.world.player.angle = 0; // 적을 향해 봅니다

    // 효과 없이 한 대
    const before = target.hp;
    gameLogic.attack();
    const normalDamage = before - target.hp;
    assert.ok(normalDamage > 0, '평상시 공격이 들어가야 합니다');

    // 힘을 걸고 한 대 (쿨다운을 넘기기 위해 시간을 진행)
    A.applyBuff('might', 20_000);
    worldModule.world.time += 1000;
    target.hp = before;
    gameLogic.attack();
    const mightyDamage = before - target.hp;

    assert.ok(mightyDamage > normalDamage,
        `힘 효과가 반영되지 않았습니다: ${normalDamage} -> ${mightyDamage}`);
});

test('보호의 물약이 받는 피해를 줄인다', () => {
    emptyRoom();
    worldModule.world.player.hp = 100;
    A.damagePlayer(40);
    const normalLoss = 100 - worldModule.world.player.hp;

    worldModule.world.player.hp = 100;
    A.applyBuff('resistance', 25_000);
    A.damagePlayer(40);
    const protectedLoss = 100 - worldModule.world.player.hp;

    assert.ok(protectedLoss < normalLoss,
        `보호 효과가 반영되지 않았습니다: ${normalLoss} -> ${protectedLoss}`);
});

test('지속 효과는 시간이 지나면 사라진다', () => {
    emptyRoom();
    A.applyBuff('haste', 5000);
    assert.equal(A.hasBuff('haste'), true);

    worldModule.world.time += 4999;
    A.expireBuffs();
    assert.equal(A.hasBuff('haste'), true, '시간이 남았는데 사라졌습니다');

    worldModule.world.time += 2;
    A.expireBuffs();
    assert.equal(A.hasBuff('haste'), false, '시간이 지났는데 남아 있습니다');
});

test('같은 효과를 다시 얻으면 시간이 새로 채워진다', () => {
    emptyRoom();
    A.applyBuff('might', 10_000);
    worldModule.world.time += 8000;

    A.applyBuff('might', 10_000);
    assert.equal(worldModule.world.buffs.length, 1, '같은 효과가 중복해서 쌓였습니다');

    worldModule.world.time += 5000;
    A.expireBuffs();
    assert.equal(A.hasBuff('might'), true, '시간이 새로 채워지지 않았습니다');
});

test('지속 효과가 세이브와 던전 이동을 넘어 이어진다', () => {
    emptyRoom();
    A.applyBuff('resistance', 30_000);

    const saved = serializeWorld();
    resetWorld();
    assert.equal(A.hasBuff('resistance'), false);

    deserializeWorld(saved);
    assert.equal(A.hasBuff('resistance'), true, '세이브에서 지속 효과가 사라졌습니다');

    // 서브 던전에 들어가도 따라와야 합니다.
    A.enterBranch('L');
    assert.equal(A.hasBuff('resistance'), true, '던전을 옮기며 지속 효과가 사라졌습니다');
});

// --- 드랍 --------------------------------------------------------------------

test('적을 처치하면 확률적으로 아이템이 떨어진다', () => {
    seedRandom(0x8001);
    emptyRoom();
    worldModule.world.floor = 12;

    let drops = 0;
    const KILLS = 200;
    for (let i = 0; i < KILLS; i++) {
        gameLogic.spawnMonster('rat', { x: 5 * C.TILE_SIZE, y: 5 * C.TILE_SIZE });
        worldModule.world.enemies[0].hp = 0;
        worldModule.world.items.length = 0;
        A.killEnemyAt(0);
        if (worldModule.world.items.length > 0) drops++;
    }

    const rate = drops / KILLS;
    assert.ok(rate > 0.25 && rate < 0.65, `드랍률이 ${(rate * 100).toFixed(0)}% 입니다`);
});

test('떨어진 아이템이 정의와 같은 모습을 갖는다', () => {
    emptyRoom();
    A.dropItem('haste', 100, 200);

    const [item] = worldModule.world.items;
    assert.equal(item.itemId, 'haste');
    assert.equal(item.spriteKey, I.ITEMS.haste.spriteKey);
    assert.equal(item.size, I.ITEMS.haste.size);
    assert.equal(item.x, 100);
    assert.equal(item.y, 200);
});

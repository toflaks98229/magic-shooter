/**
 * @fileoverview 물·용암·나무가 통행과 시야를 어떻게 가르는지 봅니다.
 *
 * 이 타일들이 생기면서 flies 깃발이 처음으로 뜻을 갖습니다. 182종이 갖고
 * 있는데 지금까지 아무 일도 하지 않았습니다. 무시할 지형이 없었기 때문입니다.
 * 그래서 여기서 가장 중요한 검사는 '나는 것과 걷는 것이 갈리는가' 입니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { installBrowserStubs, bindStubDom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const worldModule = await import('../Script/world.js');
const { dom } = await import('../Script/dom.js');
const actions = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');

bindStubDom(dom);

/** 사방이 막힌 빈 방을 만들고 플레이어를 가운데 세웁니다. */
function emptyRoom() {
    worldModule.resetWorld();
    actions.setGameRunning(true);

    const world = worldModule.world;
    world.map = Array.from({ length: C.MAP_HEIGHT }, (_, y) => Array.from(
        { length: C.MAP_WIDTH },
        (_, x) => (x === 0 || y === 0 || x === C.MAP_WIDTH - 1 || y === C.MAP_HEIGHT - 1)
            ? C.TILE_IDS.WALL : C.TILE_IDS.FLOOR,
    ));
    world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    world.player.x = 20 * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = 20 * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.mapRevision = (world.mapRevision ?? 0) + 1;
    return world;
}

/** 플레이어 오른쪽 몇 칸에 세로줄을 세웁니다. */
function bandAt(world, tileId, tilesRight, width = 2) {
    const column = Math.floor(world.player.x / C.TILE_SIZE) + tilesRight;
    for (let y = 0; y < C.MAP_HEIGHT; y++) {
        for (let d = 0; d < width; d++) world.map[y][column + d] = tileId;
    }
    world.mapRevision = (world.mapRevision ?? 0) + 1;
    return column;
}

/** 적을 하나 세웁니다. */
function placeEnemy(world, overrides) {
    const enemy = {
        monsterId: 'test', spriteKey: 'enemy_rat', behavior: 'melee',
        z: C.TILE_SIZE / 2, hp: 100, maxHp: 100, speed: 1.2, damage: 0,
        cooldown: 9e9, size: 14, hd: 1, dcssSpeed: 10,
        lastAttackTime: C.PAST_TIME, lastHitTime: 0,
        state: 'chase', huntUntil: 1e9,
        ...overrides,
    };
    world.enemies.push(enemy);
    return enemy;
}

const run = (steps) => { for (let i = 0; i < steps; i++) gameLogic.update(C.SIMULATION_STEP_MS); };

// --- 타일 성질 ------------------------------------------------------------------

test('얕은 물은 누구나 건넌다', () => {
    const shallow = C.TILE_TYPES[C.TILE_IDS.SHALLOW_WATER];
    assert.equal(shallow.solid, false);
    assert.equal(shallow.opaque, false);
});

test('깊은 물과 용암은 막되 보인다', () => {
    for (const id of [C.TILE_IDS.DEEP_WATER, C.TILE_IDS.LAVA]) {
        const tile = C.TILE_TYPES[id];
        assert.equal(tile.solid, true, `${tile.name} 을 걸어 들어갈 수 있습니다`);
        assert.equal(tile.opaque, false, `${tile.name} 너머가 안 보입니다`);
        assert.equal(tile.crossableByFlight, true, `${tile.name} 을 날아서 못 건넙니다`);
    }
});

test('나무는 막고 가린다', () => {
    const tree = C.TILE_TYPES[C.TILE_IDS.TREE];
    assert.equal(tree.solid, true);
    assert.equal(tree.opaque, true, '나무 너머가 보입니다');
    assert.ok(!tree.crossableByFlight, '나무 위로 날아 넘습니다');
});

test('물 너머가 보인다', () => {
    const world = emptyRoom();
    bandAt(world, C.TILE_IDS.DEEP_WATER, 3);

    assert.equal(
        gameLogic.hasLineOfSight(world.player.x, world.player.y,
            world.player.x + 8 * C.TILE_SIZE, world.player.y),
        true, '물 너머가 보이지 않습니다',
    );
});

// --- flies 가 뜻을 갖는다 ---------------------------------------------------------

test('걷는 적은 물을 건너지 못한다', () => {
    const world = emptyRoom();
    const water = bandAt(world, C.TILE_IDS.DEEP_WATER, 3);
    const enemy = placeEnemy(world, {
        flies: false,
        x: (water + 4) * C.TILE_SIZE, y: world.player.y,
    });

    run(300);
    assert.ok(enemy.x > water * C.TILE_SIZE,
        `걷는 적이 물(타일 ${water})을 건넜습니다: x=${(enemy.x / C.TILE_SIZE).toFixed(1)}`);
});

test('나는 적은 물을 건너온다', () => {
    // 182종이 가진 flies 깃발이 처음으로 뜻을 갖는 지점입니다.
    // 이 검사가 없으면 깃발을 옮겨 놓고도 아무 일도 하지 않던 예전으로 조용히 돌아갑니다.
    const world = emptyRoom();
    const water = bandAt(world, C.TILE_IDS.DEEP_WATER, 3);
    const enemy = placeEnemy(world, {
        flies: true,
        x: (water + 4) * C.TILE_SIZE, y: world.player.y,
    });

    run(400);
    assert.ok(enemy.x < water * C.TILE_SIZE,
        `나는 적이 물(타일 ${water})을 건너오지 못했습니다: x=${(enemy.x / C.TILE_SIZE).toFixed(1)}`);
});

test('나는 적도 나무는 넘지 못한다', () => {
    // 나무는 막고 가립니다. 날아도 통과할 수 없어야 벽으로서 뜻을 갖습니다.
    const world = emptyRoom();
    const trees = bandAt(world, C.TILE_IDS.TREE, 3);
    const enemy = placeEnemy(world, {
        flies: true,
        x: (trees + 4) * C.TILE_SIZE, y: world.player.y,
    });

    run(300);
    assert.ok(enemy.x > trees * C.TILE_SIZE,
        `나는 적이 나무(타일 ${trees})를 넘었습니다`);
});

test('용암은 나는 것만 건넌다', () => {
    // 물과 같은 규칙이되 따로 검사합니다. 두 타일이 같은 표를 쓰는지가
    // 눈으로만 확인되면, 한쪽만 바뀌었을 때 조용히 어긋납니다.
    const world = emptyRoom();
    const lava = bandAt(world, C.TILE_IDS.LAVA, 3);

    const walker = placeEnemy(world, { flies: false, x: (lava + 4) * C.TILE_SIZE, y: world.player.y });
    const flier = placeEnemy(world, {
        flies: true,
        x: (lava + 4) * C.TILE_SIZE, y: world.player.y + 3 * C.TILE_SIZE,
    });

    run(400);
    assert.ok(walker.x > lava * C.TILE_SIZE, '걷는 적이 용암을 건넜습니다');
    assert.ok(flier.x < lava * C.TILE_SIZE, '나는 적이 용암을 못 건넜습니다');
});

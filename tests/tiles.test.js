/**
 * @fileoverview 타일의 두 축 — 막는가와 보이는가 — 를 검사합니다.
 *
 * 지금까지 모든 벽은 막으면서 동시에 보이지 않았습니다. 두 성질이 언제나 같이
 * 다녀서 코드 곳곳에서 둘을 섞어 써도 아무 문제가 드러나지 않았습니다.
 * 실제로 발사체와 파티클은 '보이지 않는가'로 충돌을 판정하고 있었습니다.
 *
 * 쇠창살처럼 막지만 보이는 타일이 생기면 그 혼동이 곧바로 버그가 됩니다.
 * 화살이 창살을 그대로 지나가기 때문입니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { installBrowserStubs, bindStubDom, fireDocumentEvent } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const worldModule = await import('../Script/world.js');
const { dom } = await import('../Script/dom.js');
const actions = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');

const input = await import('../Script/input.js');

bindStubDom(dom);

// bindStubDom 뒤에 켜야 합니다. 앞에서 켜면 붙일 요소가 아직 없습니다.
// 이것을 부르지 않으면 키 이벤트가 아무 데도 닿지 않아,
// 플레이어를 밀어붙이는 검사가 무엇을 망가뜨려도 통과합니다.
input.setupInputHandlers();

/**
 * 사방이 막힌 빈 방을 만들고 플레이어를 가운데 세웁니다.
 * @returns {object} world
 */
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
    world.player.x = 15 * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = 15 * C.TILE_SIZE + C.TILE_SIZE / 2;
    return world;
}

/** 플레이어 오른쪽 몇 칸에 세로줄을 세웁니다. */
function wallColumnAt(world, tileId, tilesRight) {
    const column = Math.floor(world.player.x / C.TILE_SIZE) + tilesRight;
    for (let y = 0; y < C.MAP_HEIGHT; y++) world.map[y][column] = tileId;
    return column;
}

// --- 두 축이 갈라진다 ------------------------------------------------------------

test('쇠창살은 막지만 보인다', () => {
    const grate = C.TILE_TYPES[C.TILE_IDS.GRATE];
    assert.equal(grate.solid, true, '창살은 지나갈 수 없어야 합니다');
    assert.equal(grate.opaque, false, '창살 너머는 보여야 합니다');

    // 벽은 둘 다입니다. 이것이 지금까지 혼동이 드러나지 않던 이유입니다.
    const wall = C.TILE_TYPES[C.TILE_IDS.WALL];
    assert.equal(wall.solid, true);
    assert.equal(wall.opaque, true);
});

test('창살 너머가 보인다', () => {
    const world = emptyRoom();
    wallColumnAt(world, C.TILE_IDS.GRATE, 3);

    const beyond = world.player.x + 6 * C.TILE_SIZE;
    assert.equal(
        gameLogic.hasLineOfSight(world.player.x, world.player.y, beyond, world.player.y),
        true, '창살 너머가 보이지 않습니다',
    );
});

test('벽 너머는 보이지 않는다', () => {
    const world = emptyRoom();
    wallColumnAt(world, C.TILE_IDS.WALL, 3);

    const beyond = world.player.x + 6 * C.TILE_SIZE;
    assert.equal(
        gameLogic.hasLineOfSight(world.player.x, world.player.y, beyond, world.player.y),
        false, '벽 너머가 보입니다',
    );
});

test('창살 너머의 적이 플레이어를 알아챈다', () => {
    // 보이므로 알아챕니다. 다만 다가올 수는 없습니다.
    // 이것이 창살의 쓸모입니다. 보면서 어쩌지 못하는 상황이 만들어집니다.
    const world = emptyRoom();
    wallColumnAt(world, C.TILE_IDS.GRATE, 3);

    const enemy = gameLogic.spawnMonster('rat', {
        x: world.player.x + 5 * C.TILE_SIZE,
        y: world.player.y,
    });

    for (let i = 0; i < 10; i++) gameLogic.update(C.SIMULATION_STEP_MS);
    assert.notEqual(enemy.state, 'idle', '창살 너머의 적이 알아채지 못했습니다');
});

// --- 무엇이 막히는가 -------------------------------------------------------------

test('창살 사이로는 쏠 수 있다', () => {
    // 막는 것과 쏘는 것을 막는 것은 다릅니다. 쇠창살은 사이로 쏠 수 있고
    // 유리벽은 못 쏩니다. 둘 다 보이지만 대응이 갈려서, 같은 그림인데 다른 방이 됩니다.
    const world = emptyRoom();
    wallColumnAt(world, C.TILE_IDS.GRATE, 3);

    // 플레이어 자리에서 띄우면 그 자리에서 곧바로 플레이어를 맞고 사라집니다.
    // 그러면 창살에 막혔는지와 무관하게 언제나 사라져 검사가 헛돕니다.
    // 창살 반대편에서 창살을 향해 쏘아 어디서 멈추는지를 봅니다.
    const grateColumn = Math.floor(world.player.x / C.TILE_SIZE) + 3;
    const startX = (grateColumn + 4) * C.TILE_SIZE;

    world.projectiles.push({
        x: startX, y: world.player.y, z: C.TILE_SIZE / 2,
        angle: Math.PI, speed: 4, damage: 5, size: 8,   // 플레이어 쪽으로
        from: 'enemy', spriteKey: 'projectile_fireball',
    });
    const shot = world.projectiles[0];

    // 창살에 닿을 때까지 돌리되, 지나쳐 버렸는지 매 스텝 확인합니다.
    let crossed = false;
    for (let i = 0; i < 120 && world.projectiles.includes(shot); i++) {
        gameLogic.update(C.SIMULATION_STEP_MS);
        if (shot.x < grateColumn * C.TILE_SIZE) crossed = true;
    }

    assert.equal(crossed, true, '창살 사이로 쏘지 못했습니다');
});

test('플레이어가 창살을 지나갈 수 없다', () => {
    const world = emptyRoom();
    const column = wallColumnAt(world, C.TILE_IDS.GRATE, 2);

    // 실제 입력으로 밀어붙입니다. 좌표를 직접 옮기면 충돌 처리를 건너뛰어
    // 무엇을 검사하든 통과해 버립니다.
    world.player.angle = 0;   // 창살 쪽을 봅니다
    fireDocumentEvent('keydown', { code: 'KeyW' });
    for (let i = 0; i < 200; i++) gameLogic.update(C.SIMULATION_STEP_MS);
    fireDocumentEvent('keyup', { code: 'KeyW' });

    assert.ok(world.player.x < column * C.TILE_SIZE,
        `창살(타일 ${column})을 지나갔습니다: x=${world.player.x}`);
});

test('적이 창살을 지나갈 수 없다', () => {
    const world = emptyRoom();
    const column = wallColumnAt(world, C.TILE_IDS.GRATE, 3);

    const enemy = gameLogic.spawnMonster('rat', {
        x: world.player.x + 5 * C.TILE_SIZE,
        y: world.player.y,
    });

    for (let i = 0; i < 200; i++) gameLogic.update(C.SIMULATION_STEP_MS);
    assert.ok(enemy.x > column * C.TILE_SIZE,
        `적이 창살(타일 ${column})을 넘어왔습니다: x=${enemy.x}`);
});

test('유리벽은 보이지만 쏠 수 없다', () => {
    // 창살과 짝을 이룹니다. 둘 다 보이는데 하나는 쏠 수 있고 하나는 못 쏩니다.
    const world = emptyRoom();
    const glassColumn = wallColumnAt(world, C.TILE_IDS.GLASS, 3);

    // 보이기는 합니다.
    assert.equal(
        gameLogic.hasLineOfSight(world.player.x, world.player.y,
            world.player.x + 6 * C.TILE_SIZE, world.player.y),
        true, '유리벽 너머가 보이지 않습니다',
    );

    world.projectiles.push({
        x: (glassColumn + 4) * C.TILE_SIZE, y: world.player.y, z: C.TILE_SIZE / 2,
        angle: Math.PI, speed: 4, damage: 5, size: 8,
        from: 'enemy', spriteKey: 'projectile_fireball',
    });
    const shot = world.projectiles[0];

    let crossed = false;
    for (let i = 0; i < 120 && world.projectiles.includes(shot); i++) {
        gameLogic.update(C.SIMULATION_STEP_MS);
        if (shot.x < glassColumn * C.TILE_SIZE) crossed = true;
    }

    assert.equal(crossed, false, '유리벽을 뚫고 쏘았습니다');
});

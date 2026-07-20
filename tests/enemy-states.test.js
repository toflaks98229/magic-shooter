/**
 * @fileoverview 적 상태 기계(FSM)를 확인합니다.
 *
 * 적은 이제 상태를 하나 갖고, 상태가 '어디로 움직이는가 · 무엇을 하는가 · 다음에 무엇이 되는가'를
 * 정합니다. behavior(무엇으로 싸우는가)와는 다른 축입니다.
 *
 * 회귀 스냅샷으로는 이것을 확인할 수 없습니다. 1800프레임 뒤의 최종 상태만 보는데,
 * 도망이 한 번도 걸리지 않거나 걸렸다가 돌아와도 스냅샷은 그대로이기 때문입니다.
 * 실제로 FSM 을 넣은 뒤에도 스냅샷은 한 줄도 바뀌지 않았습니다.
 * 그래서 겁먹을 상황을 직접 만들어 봅니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom, seedRandom, fireDocumentEvent } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const worldModule = await import('../Script/world.js');
const { resetWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const A = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');
const M = await import('../Script/monsters.js');

const input = await import('../Script/input.js');

bindStubDom(dom);

// 이것을 부르지 않으면 키 입력이 아무 데도 닿지 않아 이동 검사가 헛돕니다.
input.setupInputHandlers();

/**
 * 벽으로만 둘러싸인 빈 방을 만들고 플레이어를 가운데 세웁니다.
 * @returns {object} 준비된 월드
 */
function emptyRoom() {
    resetWorld();
    const world = worldModule.world;

    world.map = Array.from({ length: C.MAP_HEIGHT }, (_, y) =>
        Array.from({ length: C.MAP_WIDTH }, (_, x) =>
            (x === 0 || y === 0 || x === C.MAP_WIDTH - 1 || y === C.MAP_HEIGHT - 1)
                ? C.TILE_IDS.WALL : C.TILE_IDS.FLOOR));
    world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));

    world.player.x = 15 * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = 15 * C.TILE_SIZE + C.TILE_SIZE / 2;
    A.setGameRunning(true);
    return world;
}

/**
 * 적 한 마리를 세웁니다.
 * @param {object} world - 월드
 * @param {object} overrides - 덮어쓸 속성
 * @returns {object} 세워진 적
 */
function placeEnemy(world, overrides = {}) {
    const enemy = {
        monsterId: 'rat', spriteKey: 'enemy_rat', behavior: 'melee',
        x: 15 * C.TILE_SIZE + C.TILE_SIZE / 2,
        y: 13 * C.TILE_SIZE + C.TILE_SIZE / 2,   // 플레이어에서 두 칸 위
        z: C.TILE_SIZE / 2,
        hp: 100, maxHp: 100, speed: 1.0, damage: 5, cooldown: 500, size: 14,
        lastAttackTime: C.PAST_TIME, lastHitTime: 0, state: 'chase',
        ...overrides,
    };
    world.enemies.push(enemy);
    return enemy;
}

/** @param {number} steps - 굴릴 스텝 수 */
function run(steps) {
    for (let i = 0; i < steps; i++) gameLogic.update(C.SIMULATION_STEP_MS);
}

/** @param {object} e @param {object} world @returns {number} 플레이어까지의 거리 */
function distanceToPlayer(e, world) {
    return Math.hypot(e.x - world.player.x, e.y - world.player.y);
}

// --- 골격 --------------------------------------------------------------------

test('평범한 적은 추격 상태로 시작한다', () => {
    const world = emptyRoom();
    world.floor = 1;
    gameLogic.spawnEnemiesForFloor();

    assert.ok(world.enemies.length > 0, '적이 스폰되지 않았습니다');
    for (const enemy of world.enemies) {
        // 이제 적은 플레이어를 알아채지 못한 채로 태어납니다.
        // 예전에는 스폰되는 순간부터 위치를 알고 달려왔습니다.
        assert.equal(enemy.state, 'idle',
            `${enemy.monsterId} 가 잠든 채로 시작하지 않았습니다`);
        assert.equal(enemy.huntUntil, 0, '아직 아무도 쫓고 있지 않아야 합니다');
    }
});

test('state 가 없는 옛 세이브의 적도 추격으로 움직인다', () => {
    // 이어하기가 붙기 전에 저장된 판에는 state 필드가 없습니다.
    // 상태를 못 찾아 멈춰 서면 판을 이어받자마자 적이 얼어붙습니다.
    const world = emptyRoom();
    const enemy = placeEnemy(world, { state: undefined });
    const before = distanceToPlayer(enemy, world);

    run(30);

    assert.ok(distanceToPlayer(enemy, world) < before, '옛 세이브의 적이 다가오지 않았습니다');
});

test('겁이 없는 적은 빈사여도 계속 덤빈다', () => {
    // fleeBelow 가 없으면 끝까지 싸웁니다. 언데드나 구조물이 도망치면 어색합니다.
    const world = emptyRoom();
    const enemy = placeEnemy(world, { hp: 1, maxHp: 100 }); // fleeBelow 없음
    const before = distanceToPlayer(enemy, world);

    run(30);

    assert.equal(enemy.state, 'chase', '겁이 없는 적이 도망쳤습니다');
    assert.ok(distanceToPlayer(enemy, world) < before, '다가오지 않았습니다');
});

// --- 도망 --------------------------------------------------------------------

test('체력이 떨어진 적은 도망친다', () => {
    const world = emptyRoom();
    const enemy = placeEnemy(world, { hp: 20, maxHp: 100, fleeBelow: 0.35 });
    const before = distanceToPlayer(enemy, world);

    run(60);

    assert.equal(enemy.state, 'flee', '도망 상태로 넘어가지 않았습니다');
    assert.ok(distanceToPlayer(enemy, world) > before,
        `멀어지지 않았습니다. ${before.toFixed(0)} → ${distanceToPlayer(enemy, world).toFixed(0)}`);
});

test('멀쩡한 적은 도망치지 않는다', () => {
    const world = emptyRoom();
    const enemy = placeEnemy(world, { hp: 100, maxHp: 100, fleeBelow: 0.35 });
    const before = distanceToPlayer(enemy, world);

    run(30);

    assert.equal(enemy.state, 'chase');
    assert.ok(distanceToPlayer(enemy, world) < before, '다가오지 않았습니다');
});

test('멀리서 다친 적은 굳이 달아나지 않는다', () => {
    // 화면 밖에서 적들이 달아나 버리면 무슨 일이 벌어지는지 알 수 없습니다.
    const world = emptyRoom();
    const enemy = placeEnemy(world, {
        hp: 5, maxHp: 100, fleeBelow: 0.35,
        y: (15 - C.FLEE_START_DISTANCE_TILES - 3) * C.TILE_SIZE + C.TILE_SIZE / 2,
    });

    run(10);
    assert.equal(enemy.state, 'chase', '멀리 있는데도 도망쳤습니다');
});

test('도망치는 동안에는 때리지 않는다', () => {
    // 도망치면서 공격하면 겁먹었다는 것이 읽히지 않고 그냥 잡기 어려운 적이 됩니다.
    const world = emptyRoom();
    const enemy = placeEnemy(world, {
        hp: 20, maxHp: 100, fleeBelow: 0.35,
        x: world.player.x, y: world.player.y + 4,   // 때릴 수 있을 만큼 붙여 둡니다
        speed: 0,                                    // 붙은 채로 두어 사거리를 벗어나지 않게 합니다
        damage: 50, cooldown: 0,
    });
    enemy.state = 'flee';
    const hpBefore = world.player.hp;

    run(30);

    assert.equal(world.player.hp, hpBefore, '도망치는 적이 플레이어를 때렸습니다');
});

test('충분히 멀어지면 숨을 돌리고 다시 덤빈다', () => {
    // 한 번 겁먹었다고 영영 달아나기만 하면 잡을 수도 무시할 수도 없는 적이 됩니다.
    const world = emptyRoom();
    const enemy = placeEnemy(world, { hp: 20, maxHp: 100, fleeBelow: 0.35 });

    run(60);
    assert.equal(enemy.state, 'flee', '먼저 도망쳐야 합니다');

    // 그만두는 거리 너머로 옮겨 놓습니다.
    enemy.x = world.player.x;
    enemy.y = world.player.y - (C.FLEE_STOP_DISTANCE_TILES + 2) * C.TILE_SIZE;
    run(2);

    assert.equal(enemy.state, 'chase', '충분히 멀어졌는데도 계속 도망칩니다');
});

test('도망과 추격을 경계에서 오가지 않는다', () => {
    // 시작 거리와 그만두는 거리가 같으면 그 지점에서 매 스텝 상태가 뒤집혀 제자리걸음을 합니다.
    assert.ok(C.FLEE_STOP_DISTANCE_TILES > C.FLEE_START_DISTANCE_TILES,
        '그만두는 거리가 시작 거리보다 커야 진동하지 않습니다');

    const world = emptyRoom();
    const enemy = placeEnemy(world, {
        hp: 20, maxHp: 100, fleeBelow: 0.35, speed: 0,   // 움직이지 않게 두고 상태만 봅니다
        y: world.player.y - C.FLEE_START_DISTANCE_TILES * C.TILE_SIZE,
    });

    const seen = [];
    for (let i = 0; i < 20; i++) {
        gameLogic.update(C.SIMULATION_STEP_MS);
        seen.push(enemy.state);
    }

    const flips = seen.filter((s, i) => i > 0 && s !== seen[i - 1]).length;
    assert.ok(flips <= 1, `상태가 ${flips}번 뒤집혔습니다: ${seen.join(',')}`);
});

test('구석에 몰린 적은 돌아서서 싸운다', () => {
    // 물러날 곳이 없는데 도망 상태로 남으면 벽을 보고 떨기만 합니다.
    // 플레이어가 몰아넣는 선택에 의미가 생기도록 돌아서게 합니다.
    const world = emptyRoom();

    // 진짜 막다른 곳을 만듭니다. 방 모서리만으로는 부족합니다.
    // 벽을 따라 옆으로 빠져나갈 수 있어 도망칠 길이 남기 때문입니다.
    // 아래쪽 칸까지 막아 출구가 플레이어 쪽 하나만 남게 합니다.
    const cornerX = 1, cornerY = 1;
    world.map[cornerY + 1][cornerX] = C.TILE_IDS.WALL;

    world.player.x = (cornerX + 1) * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = cornerY * C.TILE_SIZE + C.TILE_SIZE / 2;

    const enemy = placeEnemy(world, {
        hp: 20, maxHp: 100, fleeBelow: 0.35, speed: 0.5,
        x: cornerX * C.TILE_SIZE + C.TILE_SIZE / 2,
        y: cornerY * C.TILE_SIZE + C.TILE_SIZE / 2,
        state: 'flee',
    });

    run(20);

    assert.equal(enemy.state, 'chase', '몰린 적이 돌아서지 않았습니다');
});

// --- 데이터 ------------------------------------------------------------------

test('겁을 먹는 몬스터의 기준값이 온전하다', () => {
    for (const [id, monster] of Object.entries(M.MONSTERS)) {
        if (monster.fleeBelow === undefined) continue;
        assert.ok(monster.fleeBelow > 0 && monster.fleeBelow < 1,
            `${id} 의 fleeBelow 가 0과 1 사이가 아닙니다: ${monster.fleeBelow}`);
    }
});

test('몰린 적이 도망과 추격을 매 스텝 오가지 않는다', () => {
    // 돌아서기만 하고 끝내면 다음 스텝에 다시 겁을 먹습니다.
    // 그러면 공격이 한 스텝 걸러 한 번씩만 나가 반쯤 얼어붙은 것처럼 보입니다.
    const world = emptyRoom();
    const cornerX = 1, cornerY = 1;
    world.map[cornerY + 1][cornerX] = C.TILE_IDS.WALL;
    world.player.x = (cornerX + 1) * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = cornerY * C.TILE_SIZE + C.TILE_SIZE / 2;

    const enemy = placeEnemy(world, {
        hp: 20, maxHp: 100, fleeBelow: 0.35, speed: 0.5,
        x: cornerX * C.TILE_SIZE + C.TILE_SIZE / 2,
        y: cornerY * C.TILE_SIZE + C.TILE_SIZE / 2,
        state: 'flee',
    });

    const seen = [];
    for (let i = 0; i < 20; i++) {
        gameLogic.update(C.SIMULATION_STEP_MS);
        seen.push(enemy.state);
    }

    const flips = seen.filter((s, i) => i > 0 && s !== seen[i - 1]).length;
    assert.ok(flips <= 1, `몰린 적의 상태가 ${flips}번 뒤집혔습니다: ${seen.join(',')}`);
});

test('겁을 먹는 몬스터가 실제로 존재한다', () => {
    // 이 검사가 없으면 monsters.js 에서 fleeBelow 를 전부 지워도 아무도 눈치채지 못합니다.
    // 도망 상태를 구현해 두고 정작 아무도 도망치지 않는 상태가 됩니다.
    const scared = Object.entries(M.MONSTERS).filter(([, m]) => m.fleeBelow !== undefined);
    assert.ok(scared.length >= 3,
        `겁을 먹는 몬스터가 ${scared.length}종뿐입니다. 도망 상태가 사실상 죽은 코드입니다.`);

    // 언데드와 구조물은 겁을 먹지 않아야 합니다. 도망치면 어색합니다.
    for (const id of ['zombie', 'skeleton', 'gargoyle']) {
        if (!M.MONSTERS[id]) continue;
        assert.equal(M.MONSTERS[id].fleeBelow, undefined,
            `${id} 은(는) 겁을 먹지 않아야 합니다`);
    }
});

// --- 원본이 붙여 둔 움직임 성향 -------------------------------------------------

test('거리를 두는 적은 다가오지 않는다', () => {
    // 쫓아와 때리는 적만 있으면 전투가 한 가지 모양으로 굳습니다.
    // 다가오지 않는 적이 섞여야 플레이어가 거리를 좁힐지 말지를 고르게 됩니다.
    const world = emptyRoom();
    const enemy = placeEnemy(world, {
        maintainRange: true, state: 'kite', speed: 1.0, behavior: 'melee',
        x: world.player.x + C.KITE_IDEAL_DISTANCE_TILES * C.TILE_SIZE * 0.4,
        y: world.player.y,
    });
    const before = distanceToPlayer(enemy, world);

    run(40);

    assert.ok(distanceToPlayer(enemy, world) > before,
        `가까이 있는데 물러서지 않았습니다 (${before.toFixed(0)} → ${distanceToPlayer(enemy, world).toFixed(0)})`);
    assert.equal(enemy.state, 'kite', '거리를 두는 성향이 유지되어야 합니다');
});

test('거리를 두는 적도 너무 멀면 다가온다', () => {
    // 물러서기만 하면 영영 만날 수 없는 적이 됩니다.
    const world = emptyRoom();
    const enemy = placeEnemy(world, {
        maintainRange: true, state: 'kite', speed: 1.0, behavior: 'melee',
        // 맵 밖으로 나가지 않게 둡니다. 밖에 서면 플로우 필드가 닿지 않아
        // 다가오고 싶어도 길을 못 찾습니다.
        x: world.player.x - C.KITE_IDEAL_DISTANCE_TILES * C.TILE_SIZE * 2,
        y: world.player.y,
    });
    const before = distanceToPlayer(enemy, world);

    run(40);
    assert.ok(distanceToPlayer(enemy, world) < before, '멀리 있는데 다가오지 않았습니다');
});

test('정신없이 나는 적은 곧장 오지 않는다', () => {
    // 겨눈 선으로 명중을 정하는 이 게임에서는 앞을 예측해 쏘아야 하는 적이 됩니다.
    const world = emptyRoom();
    const straight = placeEnemy(world, { speed: 1.0, x: world.player.x + 200, y: world.player.y });
    const erratic = placeEnemy(world, {
        batty: true, state: 'erratic', speed: 1.0, dcssSpeed: 10,
        x: world.player.x + 200, y: world.player.y + 100,
    });

    const straightBefore = distanceToPlayer(straight, world);
    const erraticBefore = distanceToPlayer(erratic, world);
    run(60);

    // 곧장 오는 적은 확실히 가까워집니다.
    assert.ok(distanceToPlayer(straight, world) < straightBefore - 30, '추격하는 적이 다가오지 않았습니다');

    // 헤매는 적은 움직이기는 하되 곧장 오지는 않습니다.
    const moved = Math.hypot(erratic.x - (world.player.x + 200), erratic.y - (world.player.y + 100));
    assert.ok(moved > 10, '헤매는 적이 움직이지 않았습니다');
    const approached = erraticBefore - distanceToPlayer(erratic, world);
    assert.ok(approached < straightBefore - distanceToPlayer(straight, world),
        '헤매는 적이 추격하는 적만큼 곧장 다가왔습니다');
});

test('헤매는 방향이 무작위지만 재생 가능하다', () => {
    // 세이브를 불러오면 같은 상황에서 같은 결과가 나와야 합니다.
    const runOnce = () => {
        seedRandom(0xE44A);
        const world = emptyRoom();
        const e = placeEnemy(world, {
            batty: true, state: 'erratic', speed: 1.0, dcssSpeed: 10,
            x: world.player.x + 150, y: world.player.y,
        });
        run(30);
        return [Math.round(e.x), Math.round(e.y)];
    };
    assert.deepEqual(runOnce(), runOnce(), '같은 씨앗에서 다른 결과가 나왔습니다');
});

// --- 알아채고 잊기 -------------------------------------------------------------

test('멀리 있으면 알아채지 못한다', () => {
    // 예전에는 태어난 순간부터 위치를 알고 곧장 달려왔습니다.
    // 그래서 이 게임에는 '들키지 않는다'는 선택지가 아예 없었습니다.
    const world = emptyRoom();
    const enemy = placeEnemy(world, {
        intelligence: 'animal', shout: 'silent', speed: 1.0,
        x: world.player.x + 12 * C.TILE_SIZE, y: world.player.y,   // 인지 거리 8칸 밖
    });
    const before = distanceToPlayer(enemy, world);

    run(60);

    assert.equal(enemy.state, 'idle', '멀리 있는데 알아챘습니다');
    assert.equal(distanceToPlayer(enemy, world), before, '알아채지 못했는데 움직였습니다');
});

test('가까이 가면 알아채고 쫓아온다', () => {
    const world = emptyRoom();
    const enemy = placeEnemy(world, {
        intelligence: 'animal', shout: 'silent', speed: 1.0,
        x: world.player.x + 4 * C.TILE_SIZE, y: world.player.y,    // 인지 거리 안
    });
    const before = distanceToPlayer(enemy, world);

    run(40);

    assert.notEqual(enemy.state, 'idle', '가까운데 알아채지 못했습니다');
    assert.ok(distanceToPlayer(enemy, world) < before, '알아챘는데 다가오지 않았습니다');
});

test('지능이 높을수록 멀리서 알아본다', () => {
    // 머리가 없는 것은 코앞만, 사람만큼 영리한 것은 방 하나 너머를 봅니다.
    const noticedAt = (intelligence, tiles) => {
        const world = emptyRoom();
        const enemy = placeEnemy(world, {
            intelligence, shout: 'silent', speed: 0,
            x: world.player.x + tiles * C.TILE_SIZE, y: world.player.y,
        });
        run(4);
        return enemy.state !== 'idle';
    };

    assert.equal(noticedAt('brainless', 5), false, '머리 없는 것이 다섯 칸 밖을 봤습니다');
    assert.equal(noticedAt('animal', 5), true, '짐승이 다섯 칸을 못 봤습니다');
    assert.equal(noticedAt('animal', 10), false, '짐승이 열 칸 밖을 봤습니다');
    assert.equal(noticedAt('human', 10), true, '사람만큼 영리한 것이 열 칸을 못 봤습니다');
});

test('벽 뒤는 보지 못한다', () => {
    const world = emptyRoom();
    // 사이를 벽으로 막습니다.
    const wallTile = Math.floor(world.player.x / C.TILE_SIZE) + 2;
    for (let y = 0; y < C.MAP_HEIGHT; y++) world.map[y][wallTile] = C.TILE_IDS.WALL;

    const enemy = placeEnemy(world, {
        intelligence: 'human', shout: 'silent', speed: 0,
        x: world.player.x + 4 * C.TILE_SIZE, y: world.player.y,
    });

    run(6);
    assert.equal(enemy.state, 'idle', '벽 너머를 봤습니다');
});

test('시야가 끊기면 한동안 쫓다가 잊는다', () => {
    // 이 시간이 '따돌릴 수 있는가'를 정합니다.
    const world = emptyRoom();
    const enemy = placeEnemy(world, {
        intelligence: 'brainless', shout: 'silent', speed: 0,
        x: world.player.x + 2 * C.TILE_SIZE, y: world.player.y,
    });

    run(4);
    assert.notEqual(enemy.state, 'idle', '가까운데 알아채지 못했습니다');

    // 플레이어가 인지 거리 밖으로 사라집니다.
    world.player.x += 20 * C.TILE_SIZE;
    run(4);
    assert.notEqual(enemy.state, 'idle', '사라지자마자 잊었습니다');

    // 머리가 없는 것은 곧 잊습니다. (100~300 aut = 5~15초)
    run(400);
    assert.equal(enemy.state, 'idle', '머리 없는 것이 한참을 기억합니다');
});

test('울면 벽 너머의 동료까지 깨운다', () => {
    // '옆방을 깨웠는가'는 실시간에서 일급 판단이 됩니다.
    const world = emptyRoom();
    const wallTile = Math.floor(world.player.x / C.TILE_SIZE) + 3;
    for (let y = 0; y < C.MAP_HEIGHT; y++) world.map[y][wallTile] = C.TILE_IDS.WALL;

    // 우는 놈은 플레이어 옆에, 동료는 벽 너머에 둡니다.
    const shouter = placeEnemy(world, {
        intelligence: 'human', shout: 'shout', speed: 0, state: 'idle', huntUntil: 0,
        x: world.player.x + C.TILE_SIZE, y: world.player.y,
    });
    const sleeper = placeEnemy(world, {
        intelligence: 'human', shout: 'silent', speed: 0, state: 'idle', huntUntil: 0,
        x: world.player.x + 6 * C.TILE_SIZE, y: world.player.y,   // 벽 너머
    });

    run(4);
    assert.notEqual(shouter.state, 'idle', '옆에 있는데 알아채지 못했습니다');
    assert.notEqual(sleeper.state, 'idle', '동료가 울었는데 깨어나지 않았습니다');
});

test('조용한 몬스터는 동료를 부르지 않는다', () => {
    const world = emptyRoom();
    const quiet = placeEnemy(world, {
        intelligence: 'human', shout: 'silent', speed: 0, state: 'idle', huntUntil: 0,
        x: world.player.x + C.TILE_SIZE, y: world.player.y,
    });
    const sleeper = placeEnemy(world, {
        intelligence: 'human', shout: 'silent', speed: 0, state: 'idle', huntUntil: 0,
        x: world.player.x + 9 * C.TILE_SIZE, y: world.player.y + 9 * C.TILE_SIZE,
    });

    run(4);
    assert.notEqual(quiet.state, 'idle');
    assert.equal(sleeper.state, 'idle', '조용한 적이 동료를 불렀습니다');
});

// --- 원거리 적의 약점 -----------------------------------------------------------

test('원거리 적은 붙으면 쏘지 못한다', () => {
    // 이 규칙이 있어야 원거리 적에게 '거리를 좁힌다'는 대응이 생깁니다.
    // 없으면 코앞에서도 계속 쏘아 붙을 이유가 사라집니다. (mon-act.cc:1522)
    const world = emptyRoom();
    placeEnemy(world, {
        behavior: 'ranged', range: C.TILE_SIZE * 11, projectileSpeed: 4.5,
        speed: 0, cooldown: 0, damage: 5, hd: 4,
        state: 'chase', huntUntil: 1e9,
        x: world.player.x + C.TILE_SIZE, y: world.player.y,   // 바로 옆
    });

    run(30);
    assert.equal(world.projectiles.length, 0, '붙었는데 쏘았습니다');
});

test('멀어지면 다시 쏜다', () => {
    const world = emptyRoom();
    placeEnemy(world, {
        behavior: 'ranged', range: C.TILE_SIZE * 11, projectileSpeed: 4.5,
        speed: 0, cooldown: 0, damage: 5, hd: 4,
        state: 'chase', huntUntil: 1e9,
        x: world.player.x + C.TILE_SIZE * 5, y: world.player.y,
    });

    run(10);
    assert.ok(world.projectiles.length > 0, '사거리 안인데 쏘지 않았습니다');
});

test('붙어서도 쏘는 적이 따로 있다', () => {
    // prefer_ranged 를 가진 일곱 종은 코앞에서도 쏩니다.
    // 거리를 좁혀도 통하지 않는 적이 섞여야 대응이 한 가지로 굳지 않습니다.
    const world = emptyRoom();
    placeEnemy(world, {
        behavior: 'ranged', preferRanged: true,
        range: C.TILE_SIZE * 11, projectileSpeed: 4.5,
        speed: 0, cooldown: 0, damage: 5, hd: 4,
        state: 'chase', huntUntil: 1e9,
        x: world.player.x + C.TILE_SIZE, y: world.player.y,
    });

    run(10);
    assert.ok(world.projectiles.length > 0, '붙어서도 쏘는 적이 쏘지 않았습니다');
});

test('활잡이는 같은 화살이라도 더 아프다', () => {
    // HD 에 비례해 피해가 얹힙니다. 깊은 곳의 활잡이가 훨씬 위험해집니다.
    const shoot = (archer, hd) => {
        const world = emptyRoom();
        placeEnemy(world, {
            behavior: 'ranged', archer, hd,
            range: C.TILE_SIZE * 11, projectileSpeed: 4.5,
            speed: 0, cooldown: 0, damage: 5,
            state: 'chase', huntUntil: 1e9,
            x: world.player.x + C.TILE_SIZE * 5, y: world.player.y,
        });
        run(2);
        return world.projectiles[0]?.damage ?? 0;
    };

    seedRandom(0xA2C);
    let plain = 0, skilled = 0;
    for (let i = 0; i < 40; i++) { plain += shoot(false, 12); skilled += shoot(true, 12); }
    assert.ok(skilled > plain, `보통 ${plain}, 활잡이 ${skilled}`);
});

// --- 주문이 게임 안에서 실제로 일어나는가 -----------------------------------------

test('순간이동하는 적은 제자리에 있지 않는다', () => {
    // 이 검사가 없어서 순간이동이 통째로 조용히 실패하고 있었습니다.
    // 좌표 단위를 잘못 넘겨 모든 자리가 막힌 것으로 나왔고,
    // 데이터에서 가장 흔한 주문(30종)이 한 번도 나가지 않았습니다.
    const world = emptyRoom();
    const enemy = placeEnemy(world, {
        speed: 0, hd: 5, state: 'chase', huntUntil: 1e9,
        spellbook: [{ spell: 'BLINK', freq: 200, flags: ['MAGICAL'] }],
        spellCooldown: 100,
        x: world.player.x + 4 * C.TILE_SIZE, y: world.player.y,
    });
    const start = { x: enemy.x, y: enemy.y };

    run(60);
    assert.ok(Math.hypot(enemy.x - start.x, enemy.y - start.y) > C.TILE_SIZE,
        '순간이동을 가진 적이 제자리에 있습니다');
});

test('소환하는 적이 실제로 불러낸다', () => {
    const world = emptyRoom();
    placeEnemy(world, {
        speed: 0, hd: 12, state: 'chase', huntUntil: 1e9,
        spellbook: [{ spell: 'SUMMON_DEMON', freq: 200, flags: ['WIZARD'] }],
        spellCooldown: 100, monsterId: 'summoner-under-test',
        x: world.player.x + 4 * C.TILE_SIZE, y: world.player.y,
    });

    run(40);
    const summoned = world.enemies.filter(e => e.summonedUntil !== undefined);
    assert.ok(summoned.length > 0, '소환 주문을 가진 적이 아무것도 부르지 않았습니다');
});

test('한 마리가 부를 수 있는 수에 상한이 있다', () => {
    // 원본은 턴마다 한 번 행동하니 부르는 속도가 저절로 눌립니다.
    // 실시간에서는 같은 수치가 금세 화면을 메웁니다.
    // 실제로 상한을 두기 전에는 악마술사 하나가 60초에 서른세 마리를 불렀습니다.
    const world = emptyRoom();
    placeEnemy(world, {
        speed: 0, hd: 20, state: 'chase', huntUntil: 1e9,
        spellbook: [{ spell: 'SUMMON_DEMON', freq: 200, flags: ['WIZARD'] }],
        spellCooldown: 50, monsterId: 'capped-summoner',
        x: world.player.x + 4 * C.TILE_SIZE, y: world.player.y,
    });

    run(400);
    const mine = world.enemies.filter(e => e.summonedBy === 'capped-summoner');
    assert.ok(mine.length <= C.MAX_SUMMONS_PER_CASTER,
        `상한 ${C.MAX_SUMMONS_PER_CASTER} 인데 ${mine.length} 마리가 살아 있습니다`);
});

test('불려 나온 것은 시간이 다하면 사라진다', () => {
    // 영원히 남으면 소환자를 무시하고 눈앞의 것부터 치우는 편이 언제나 낫습니다.
    // 사라져야 '부른 놈을 먼저 잡는다'는 판단이 생깁니다.
    const world = emptyRoom();
    const minion = placeEnemy(world, {
        speed: 0, state: 'chase', huntUntil: 1e9,
        summonedUntil: world.time + 200, summonedBy: 'someone',
        x: world.player.x + 3 * C.TILE_SIZE, y: world.player.y,
    });

    run(4);
    assert.ok(world.enemies.includes(minion), '너무 일찍 사라졌습니다');

    run(40);
    assert.ok(!world.enemies.includes(minion), '시간이 다했는데 남아 있습니다');
});

test('사라지는 것은 죽는 것과 다르다', () => {
    // 소환물로 경험치를 벌 수 있으면 소환자를 살려 두는 것이 이득이 되어,
    // '부른 놈을 먼저 잡는다'는 판단이 거꾸로 뒤집힙니다.
    const world = emptyRoom();
    placeEnemy(world, {
        speed: 0, exp: 500, hp: 100, maxHp: 100,
        summonedUntil: world.time + 100, summonedBy: 'someone',
        x: world.player.x + 3 * C.TILE_SIZE, y: world.player.y,
    });
    const before = world.player.skills.experiencePool ?? 0;

    run(20);
    assert.equal(world.enemies.length, 0, '사라지지 않았습니다');
    assert.equal(world.player.skills.experiencePool ?? 0, before,
        '사라진 적에게서 경험치가 나왔습니다');
});

// --- 버프가 실제로 무언가를 한다 ---------------------------------------------------

test('가속이 걸린 적이 더 빨리 온다', () => {
    // 버프를 걸어 두기만 하고 아무도 읽지 않으면, 시전은 성공하는데
    // 아무 일도 일어나지 않습니다. flies 깃발이 그랬듯 '반영되는 척'이 됩니다.
    const world = emptyRoom();
    const now = world.time;

    // 하나씩 따로 잽니다. 나란히 두면 서로 밀어내는 힘이 섞여
    // 무엇 때문에 차이가 났는지 알 수 없습니다.
    const distanceAfter = (buffs) => {
        world.enemies.length = 0;
        const enemy = placeEnemy(world, {
            speed: 1.0, state: 'chase', huntUntil: 1e9, buffs,
            x: world.player.x + 8 * C.TILE_SIZE, y: world.player.y,
        });
        run(60);
        return enemy.x - world.player.x;
    };

    const start = 8 * C.TILE_SIZE;
    const plainMoved = start - distanceAfter(undefined);
    const hastedMoved = start - distanceAfter({ haste: now + 1e9 });
    assert.ok(hastedMoved > plainMoved * 1.2,
        `보통 ${plainMoved.toFixed(0)}px, 가속 ${hastedMoved.toFixed(0)}px`);
});

test('완력이 걸린 적이 더 아프게 때린다', () => {
    const world = emptyRoom();
    const now = world.time;

    const hit = (buffs) => {
        world.player.hp = 100000;
        const enemy = placeEnemy(world, {
            speed: 0, hd: 20, damage: 20, cooldown: 0, behavior: 'melee',
            state: 'chase', huntUntil: 1e9, buffs,
            x: world.player.x + 20, y: world.player.y,
        });
        const before = world.player.hp;
        run(120);
        world.enemies.length = 0;
        return before - world.player.hp;
    };

    seedRandom(0x81F);
    const plain = hit(undefined);
    seedRandom(0x81F);
    const mighty = hit({ might: now + 1e9 });

    assert.ok(mighty > plain, `보통 ${plain}, 완력 ${mighty}`);
});

test('감속에 걸린 플레이어가 느려진다', () => {
    // 원본의 마비·혼란과 달리 조작을 빼앗지 않습니다.
    // 살아남을 수 있고, 대신 길을 다시 짜게 만듭니다.
    const world = emptyRoom();
    world.player.angle = 0;

    const walk = (debuffs) => {
        world.player.x = 5 * C.TILE_SIZE;
        world.player.debuffs = debuffs;
        const start = world.player.x;
        fireDocumentEvent('keydown', { code: 'KeyW' });
        for (let i = 0; i < 60; i++) gameLogic.update(C.SIMULATION_STEP_MS);
        fireDocumentEvent('keyup', { code: 'KeyW' });
        return world.player.x - start;
    };

    const normal = walk({});
    const slowed = walk({ slow: world.time + 1e9 });

    assert.ok(normal > 0, '평소에 움직이지 않았습니다');
    assert.ok(slowed < normal * 0.8, `보통 ${normal.toFixed(0)}px, 감속 ${slowed.toFixed(0)}px`);
});

// --- 문 ---------------------------------------------------------------------------

/** 플레이어와 적 사이를 벽으로 막고 가운데에 문 하나를 둡니다. */
function walledWithDoor(world) {
    const column = Math.floor(world.player.x / C.TILE_SIZE) + 4;
    const row = Math.floor(world.player.y / C.TILE_SIZE);

    for (let y = 0; y < C.MAP_HEIGHT; y++) world.map[y][column] = C.TILE_IDS.WALL;
    world.map[row][column] = C.TILE_IDS.DOOR;
    world.objectMap[row][column] = 1;
    world.mapRevision = (world.mapRevision ?? 0) + 1;

    return { column, row };
}

test('문을 열 줄 아는 적이 문을 연다', () => {
    // 예전에는 문을 여는 곳이 플레이어의 상호작용 하나뿐이었습니다.
    // 몬스터에게 문은 벽과 같아서, 문 하나로 나뉜 방은 영영 닿지 않았습니다.
    const world = emptyRoom();
    const door = walledWithDoor(world);

    const enemy = placeEnemy(world, {
        canOpenDoors: true, speed: 1.5, state: 'chase', huntUntil: 1e9,
        x: (door.column + 4) * C.TILE_SIZE, y: world.player.y,
    });

    run(400);
    assert.equal(world.objectMap[door.row][door.column], 0, '문이 열리지 않았습니다');
    assert.ok(enemy.x < door.column * C.TILE_SIZE, '문을 지나오지 못했습니다');
});

test('문을 열 때 여는 연출이 함께 나간다', () => {
    // 이것이 없어서 문이 소리 없이 사라졌습니다. 플레이어가 열 때는
    // 올라가는 연출이 나오는데 몬스터가 열 때는 나오지 않았습니다.
    const world = emptyRoom();
    const door = walledWithDoor(world);

    placeEnemy(world, {
        canOpenDoors: true, speed: 1.5, state: 'chase', huntUntil: 1e9,
        x: (door.column + 4) * C.TILE_SIZE, y: world.player.y,
    });

    let peak = 0;
    for (let i = 0; i < 400; i++) {
        gameLogic.update(C.SIMULATION_STEP_MS);
        peak = Math.max(peak, world.animatedWalls.length);
    }

    assert.ok(peak > 0, '문이 열렸는데 여는 연출이 등록되지 않았습니다');
});

test('짐승은 문을 열지 못한다', () => {
    // 원본은 물건을 다룰 줄 아는 몬스터만 문을 엽니다. 짐승과 언데드는
    // 열지 못해 문이 실제로 벽 노릇을 합니다. 그래야 문을 닫고 도망치는
    // 선택에 뜻이 생깁니다.
    const world = emptyRoom();
    const door = walledWithDoor(world);

    const enemy = placeEnemy(world, {
        canOpenDoors: false, speed: 1.5, state: 'chase', huntUntil: 1e9,
        x: (door.column + 4) * C.TILE_SIZE, y: world.player.y,
    });

    run(400);
    assert.equal(world.objectMap[door.row][door.column], 1, '짐승이 문을 열었습니다');
    assert.ok(enemy.x > door.column * C.TILE_SIZE, '짐승이 문을 지나왔습니다');
});

test('원본이 정한 대로 갈린다', () => {
    // 쥐와 좀비는 못 열고 오크는 엽니다.
    assert.equal(M.getMonster('rat').canOpenDoors, false);
    assert.equal(M.getMonster('orc').canOpenDoors, true);
});

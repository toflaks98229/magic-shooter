/**
 * @fileoverview 월드 직렬화 검증 — 상태 소유권 리팩토링의 핵심 목표.
 *
 * world가 통째로 저장·복원되어야 서브 던전(월드를 스택에 밀어 넣었다 복원)과
 * 세이브/로드가 성립합니다. 텍스처나 DOM 참조가 world로 새어 들어오면
 * 여기서 즉시 실패하므로, 계층 분리를 지키는 안전장치 역할도 합니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, advanceClock, bindStubDom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
// world는 resetWorld()/deserializeWorld()가 재할당하므로 네임스페이스로 접근해야 합니다.
// 구조분해로 받으면 live binding이 끊겨 항상 옛 월드 객체를 보게 됩니다.
const worldModule = await import('../Script/world.js');
const { resetWorld, serializeWorld, deserializeWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const actions = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');

bindStubDom(dom);

/** 새 층을 만들고 적을 배치한다. */
function buildFloor() {
    const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT);
    worldModule.world.map = dungeon.map;
    worldModule.world.objectMap = dungeon.objectMap;
    worldModule.world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
    worldModule.world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;
    gameLogic.spawnEnemiesForFloor();
}

/** 시뮬레이션을 n 프레임 진행시킨다. */
function runFrames(n) {
    for (let i = 0; i < n; i++) {
        worldModule.world.player.angle += 0.017;
        if (i % 9 === 0) gameLogic.attack();
        advanceClock(1000 / 60);
        gameLogic.update(1000 / 60);
    }
}

/** 적들의 좌표 합. 세계가 실제로 진행되었는지 확인하는 지표. */
const enemyFingerprint = () => worldModule.world.enemies.reduce((sum, e) => sum + e.x + e.y, 0);

test('월드 전체가 JSON으로 직렬화된다', () => {
    resetWorld();
    actions.setGameRunning(true);
    worldModule.world.themeName = 'main';
    worldModule.world.themeVariation = 1;
    buildFloor();
    runFrames(300);

    const json = serializeWorld();
    assert.ok(json.length > 0);

    // 직렬화할 수 없는 값이 world로 새어 들어왔는지 확인한다.
    for (const marker of ['[object', 'HTMLElement', 'Uint8ClampedArray', '"ctx"', '"canvas"']) {
        assert.ok(!json.includes(marker), `직렬화 결과에 ${marker} 가 있으면 안 된다`);
    }
});

test('저장한 뒤 진행한 세계를 저장 시점으로 되돌린다', () => {
    resetWorld();
    actions.setGameRunning(true);
    buildFloor();
    runFrames(200);

    const saved = serializeWorld();
    const savedState = {
        floor: worldModule.world.floor,
        hp: worldModule.world.player.hp,
        ammo: worldModule.world.player.ammo,
        x: worldModule.world.player.x,
        enemies: worldModule.world.enemies.length,
    };
    // 적은 플레이어를 알아채기 전까지 제자리에 있습니다.
    // 깨우지 않으면 세계가 변하지 않아 이 검사가 헛돌게 됩니다.
    for (const enemy of worldModule.world.enemies) {
        enemy.state = 'chase';
        enemy.huntUntil = worldModule.world.time + 1e9;
    }

    const beforeDrift = enemyFingerprint();

    runFrames(300); // 저장 이후 세계가 더 진행된다
    assert.notEqual(enemyFingerprint(), beforeDrift, '테스트가 의미 있으려면 세계가 실제로 변해야 한다');

    deserializeWorld(saved);
    assert.equal(worldModule.world.floor, savedState.floor);
    assert.equal(worldModule.world.player.hp, savedState.hp);
    assert.equal(worldModule.world.player.ammo, savedState.ammo);
    assert.equal(worldModule.world.player.x, savedState.x);
    assert.equal(worldModule.world.enemies.length, savedState.enemies);

    // 복원한 월드로 시뮬레이션이 정상 재개되어야 한다.
    runFrames(120);
    assert.ok(Number.isFinite(worldModule.world.player.x) && Number.isFinite(worldModule.world.player.y));
});

test('서브 던전 스택: 월드를 보관했다가 복귀한다', () => {
    resetWorld();
    actions.setGameRunning(true);
    buildFloor();
    runFrames(100);

    const stack = [serializeWorld()];
    const beforeEnter = worldModule.world.player.x;

    resetWorld();          // 서브 던전 진입
    actions.setGameRunning(true);
    buildFloor();
    runFrames(120);
    assert.notEqual(worldModule.world.player.x, beforeEnter, '서브 던전은 별개의 세계여야 한다');

    deserializeWorld(stack.pop()); // 원래 던전으로 복귀
    assert.equal(worldModule.world.player.x, beforeEnter);
});

test('필드가 빠진 세이브도 기본값으로 채워 읽는다', () => {
    deserializeWorld(JSON.stringify({ floor: 7, player: { hp: 42 } }));

    assert.equal(worldModule.world.floor, 7);
    assert.equal(worldModule.world.player.hp, 42);
    // 세이브에 없던 필드는 createWorld()의 기본값으로 채워져야 한다.
    assert.equal(worldModule.world.player.maxHp, 100);
    assert.equal(worldModule.world.player.weapon, 'gun');
    assert.deepEqual(worldModule.world.enemies, []);
});

test('resetWorld 이후 다른 모듈이 새 월드를 바라본다', () => {
    // 이 프로젝트는 world를 교체하는 방식(resetWorld/deserializeWorld)을 쓰므로,
    // 모든 모듈이 ESM의 live binding으로 world를 참조해야 합니다.
    // 어느 모듈이든 `const w = world` 처럼 값을 복사해 두면 교체 이후 옛 월드를 계속 보게 되어
    // 재시작이나 세이브 로드가 조용히 깨집니다. 그 계약을 여기서 고정합니다.
    resetWorld();
    actions.setGameRunning(true);
    buildFloor();

    const previousWorld = worldModule.world;
    const previousEnemyCount = previousWorld.enemies.length; // 이미 buildFloor로 채워져 있다
    resetWorld();
    assert.notEqual(worldModule.world, previousWorld, 'resetWorld는 새 객체를 만들어야 한다');

    // gameLogic은 자신의 import를 통해 world를 본다.
    // 아래가 옛 월드에 적을 넣는다면 length가 0으로 남는다.
    worldModule.world.map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.floor = 1;
    gameLogic.spawnEnemiesForFloor();

    assert.equal(worldModule.world.enemies.length, 5, 'gameLogic이 교체된 월드에 적을 넣어야 한다');
    assert.equal(previousWorld.enemies.length, previousEnemyCount, '옛 월드는 건드리지 않아야 한다');
});

test('world는 시뮬레이션 상태만 소유한다', () => {
    resetWorld();
    // 아래가 world에 있으면 직렬화가 깨지므로, 계층 분리를 명시적으로 고정한다.
    assert.ok(!('textures' in worldModule.world), '텍스처는 assets.js 소유');
    assert.ok(!('canvas' in worldModule.world), 'DOM 참조는 dom.js 소유');
    assert.ok(!('isGameRunning' in worldModule.world), '실행 플래그는 runtime.js 소유');
});

// --- 층 범위 분류 -----------------------------------------------------------

test('createWorld의 모든 배열이 층/판/격자 중 하나로 분류되어 있다', () => {
    // 이 검사가 이 리팩토링의 핵심입니다.
    //
    // 예전에는 main.js가 층을 새로 만들 때 비울 컬렉션을 여섯 줄로 늘어놓았습니다.
    // 새 컬렉션을 추가하면서 그 목록에 넣는 것을 잊으면 이전 층의 엔티티가 그대로 남는데,
    // 층을 옮겨야만 드러나는 데다 조용히 어긋나는 종류라 알아채기 어려웠습니다.
    //
    // 이제 beginFloor()가 FLOOR_SCOPED_COLLECTIONS를 읽어 비우므로,
    // 새 배열을 분류해 넣기만 하면 자동으로 처리됩니다.
    // 분류를 잊었을 때 조용히 넘어가지 않도록 여기서 막습니다.
    const fresh = worldModule.createWorld();
    const classified = new Set([
        ...worldModule.FLOOR_SCOPED_COLLECTIONS,
        ...worldModule.RUN_SCOPED_COLLECTIONS,
        ...worldModule.FLOOR_REPLACED_GRIDS,
    ]);

    const arrayKeys = Object.keys(fresh).filter(key => Array.isArray(fresh[key]));
    const unclassified = arrayKeys.filter(key => !classified.has(key));

    assert.deepEqual(unclassified, [],
        `world에 새 배열이 생겼는데 분류되지 않았습니다: ${unclassified.join(', ')}\n` +
        `world.js의 FLOOR_SCOPED_COLLECTIONS(층마다 비움) / RUN_SCOPED_COLLECTIONS(판 내내 유지) / ` +
        `FLOOR_REPLACED_GRIDS(층마다 교체) 중 하나에 넣으십시오.`);

    // 반대 방향도 봅니다. 이름이 바뀌거나 사라진 항목이 목록에 남아 있으면
    // beginFloor()가 없는 속성을 비우려다 터집니다.
    const stale = [...classified].filter(key => !(key in fresh));
    assert.deepEqual(stale, [],
        `분류 목록에 world에 없는 항목이 남아 있습니다: ${stale.join(', ')}`);

    // 한 항목이 두 목록에 동시에 들어가면 의도가 모순됩니다.
    const all = [
        ...worldModule.FLOOR_SCOPED_COLLECTIONS,
        ...worldModule.RUN_SCOPED_COLLECTIONS,
        ...worldModule.FLOOR_REPLACED_GRIDS,
    ];
    assert.equal(all.length, new Set(all).size, '한 항목이 여러 분류에 중복되어 있습니다');
});

test('beginFloor는 층에 매인 것만 비우고 판에 걸친 것은 남긴다', () => {
    resetWorld();
    const world = worldModule.world;

    // 층에 매인 것과 판에 걸친 것을 모두 채워 둡니다.
    for (const key of worldModule.FLOOR_SCOPED_COLLECTIONS) world[key].push({ marker: key });
    for (const key of worldModule.RUN_SCOPED_COLLECTIONS) world[key].push({ marker: key });

    const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT);
    actions.beginFloor(dungeon);

    for (const key of worldModule.FLOOR_SCOPED_COLLECTIONS) {
        assert.equal(world[key].length, 0, `${key}는 새 층에서 비워져야 합니다`);
    }
    for (const key of worldModule.RUN_SCOPED_COLLECTIONS) {
        assert.equal(world[key].length, 1, `${key}는 층이 바뀌어도 남아야 합니다`);
    }

    assert.equal(world.map, dungeon.map, '지형이 새 층으로 교체되어야 합니다');
    assert.equal(world.objectMap, dungeon.objectMap, '오브젝트 격자가 교체되어야 합니다');
    assert.equal(world.player.x, dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2,
        '플레이어가 새 층 시작 지점에 서야 합니다');
});

test('서브 던전에 다녀와도 스택에 넣어둔 층이 비워지지 않는다', () => {
    // beginFloor가 .length = 0 으로 비우므로, 스택 스냅샷이 같은 배열을 참조하고 있다면
    // 새 층을 만드는 순간 돌아갈 층의 적까지 사라집니다.
    // snapshotForStack이 structuredClone을 쓰고 있어 괜찮지만, 그 전제가 깨지면 여기서 드러납니다.
    resetWorld();
    const world = worldModule.world;
    world.map = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT).map;
    world.enemies.push({ marker: 'parent-floor' });

    actions.enterBranch('L'); // 짐승굴
    actions.beginFloor(generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT));

    const stacked = worldModule.world.parentStack[0];
    assert.equal(stacked.enemies.length, 1, '스택에 보관된 층의 적이 사라졌습니다');
    assert.equal(stacked.enemies[0].marker, 'parent-floor');
});

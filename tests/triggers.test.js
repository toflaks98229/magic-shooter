/**
 * @fileoverview 층에 걸린 기믹 — 가까이 가면 일어나는 일들.
 *
 * 볼트가 손으로 그린 방이라면 기믹은 그 방이 하는 일입니다.
 * 밟으면 벽이 열리며 쥐가 쏟아지는 방이 있어야 층에 사건이 생깁니다.
 *
 * 턴제와 가장 크게 갈리는 지점이 여기입니다. 원본에서 '밟았다'는 턴마다
 * 한 번인데, 실시간에서는 플레이어가 타일 경계를 계속 넘나듭니다.
 * 그대로 두면 초당 예순 번 터지므로, 그 억제가 제대로 되는지가 중요합니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { installBrowserStubs, bindStubDom, seedRandom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const worldModule = await import('../Script/world.js');
const { dom } = await import('../Script/dom.js');
const actions = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');
const { placeMinivaults } = await import('../Script/vaults.js');
const { addTrigger, TRIGGER_ON, TRIGGER_DO } = await import('../Script/triggers.js');
const { EVENTS, on, off } = await import('../Script/events.js');

bindStubDom(dom);

/** 트인 방을 만들고 플레이어를 구석에 둡니다. */
function openFloor() {
    worldModule.resetWorld();
    actions.setGameRunning(true);

    const world = worldModule.world;
    world.map = Array.from({ length: C.MAP_HEIGHT }, (_, y) => Array.from(
        { length: C.MAP_WIDTH },
        (_, x) => (x === 0 || y === 0 || x === C.MAP_WIDTH - 1 || y === C.MAP_HEIGHT - 1)
            ? C.TILE_IDS.WALL : C.TILE_IDS.FLOOR,
    ));
    world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    world.player.x = 5 * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = 5 * C.TILE_SIZE + C.TILE_SIZE / 2;
    return world;
}

/** 플레이어를 어느 타일로 옮기고 한 스텝 돌립니다. */
function stepOnto(world, tileX, tileY) {
    world.player.x = tileX * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = tileY * C.TILE_SIZE + C.TILE_SIZE / 2;
    gameLogic.update(C.SIMULATION_STEP_MS);
}

/** 이벤트를 세는 동안만 듣습니다. */
function countingFires(body) {
    let fired = 0;
    const listener = () => { fired++; };
    on(EVENTS.TRIGGER_FIRED, listener);
    try { body(); } finally { off?.(EVENTS.TRIGGER_FIRED, listener); }
    return fired;
}

// --- 밟기 -----------------------------------------------------------------------

test('밟으면 벽이 열린다', () => {
    const world = openFloor();
    const wall = { tileX: 12, tileY: 12 };
    world.map[wall.tileY][wall.tileX] = C.TILE_IDS.WALL;

    addTrigger({
        on: TRIGGER_ON.ENTER,
        action: TRIGGER_DO.CHANGE_TERRAIN,
        tileX: 10, tileY: 10,
        data: { spots: [wall], becomes: 'FLOOR' },
    });

    assert.equal(world.map[wall.tileY][wall.tileX], C.TILE_IDS.WALL, '아직 벽이어야 합니다');
    stepOnto(world, 10, 10);
    assert.equal(world.map[wall.tileY][wall.tileX], C.TILE_IDS.FLOOR, '밟았는데 열리지 않았습니다');
});

test('다른 칸을 밟으면 터지지 않는다', () => {
    const world = openFloor();
    const wall = { tileX: 12, tileY: 12 };
    world.map[wall.tileY][wall.tileX] = C.TILE_IDS.WALL;

    addTrigger({
        on: TRIGGER_ON.ENTER,
        action: TRIGGER_DO.CHANGE_TERRAIN,
        tileX: 10, tileY: 10,
        data: { spots: [wall], becomes: 'FLOOR' },
    });

    stepOnto(world, 11, 10);
    assert.equal(world.map[wall.tileY][wall.tileX], C.TILE_IDS.WALL, '엉뚱한 칸에서 터졌습니다');
});

test('한 타일 안에서 서성여도 한 번만 터진다', () => {
    // 실시간에서 가장 중요한 억제입니다. 원본에서 밟기는 턴마다 한 번인데
    // 여기서는 매 프레임 좌표가 바뀝니다. 억제가 없으면 초당 예순 번 터집니다.
    const world = openFloor();

    addTrigger({
        on: TRIGGER_ON.ENTER,
        action: TRIGGER_DO.MESSAGE,
        tileX: 10, tileY: 10,
        data: { text: '무언가 밟혔다' },
    });

    const fired = countingFires(() => {
        world.player.x = 10 * C.TILE_SIZE + 4;
        world.player.y = 10 * C.TILE_SIZE + 4;
        // 같은 타일 안에서 조금씩 움직입니다.
        for (let i = 0; i < 60; i++) {
            world.player.x += 0.3;
            gameLogic.update(C.SIMULATION_STEP_MS);
        }
    });

    assert.equal(fired, 1, `한 번만 터져야 하는데 ${fired} 번 터졌습니다`);
});

test('나갔다 다시 들어와도 한 번뿐이다', () => {
    // 기본은 한 번입니다. 원본의 Triggerable 도 repeated 를 적어야 되풀이됩니다.
    const world = openFloor();

    addTrigger({
        on: TRIGGER_ON.ENTER,
        action: TRIGGER_DO.MESSAGE,
        tileX: 10, tileY: 10,
        data: { text: '한 번뿐' },
    });

    const fired = countingFires(() => {
        for (let i = 0; i < 3; i++) {
            stepOnto(world, 10, 10);
            stepOnto(world, 14, 14);
        }
    });

    assert.equal(fired, 1, `${fired} 번 터졌습니다`);
});

test('되풀이되는 기믹은 다시 터진다', () => {
    const world = openFloor();

    addTrigger({
        on: TRIGGER_ON.ENTER,
        action: TRIGGER_DO.MESSAGE,
        tileX: 10, tileY: 10,
        repeats: true,
        data: { text: '또' },
    });

    const fired = countingFires(() => {
        for (let i = 0; i < 3; i++) {
            stepOnto(world, 10, 10);
            stepOnto(world, 14, 14);
        }
    });

    assert.equal(fired, 3, `세 번 터져야 하는데 ${fired} 번이었습니다`);
});

// --- 시야 -----------------------------------------------------------------------

test('보이면 터지는 기믹이 있다', () => {
    // 밟지 않아도 됩니다. 방에 들어서는 순간 분위기를 알리는 데 씁니다.
    const world = openFloor();

    addTrigger({
        on: TRIGGER_ON.SIGHT,
        action: TRIGGER_DO.MESSAGE,
        tileX: 8, tileY: 5,
        data: { text: '어디선가 목소리가 들린다' },
    });

    const fired = countingFires(() => stepOnto(world, 6, 5));
    assert.equal(fired, 1, '보이는데 터지지 않았습니다');
});

test('벽 너머는 보이지 않아 터지지 않는다', () => {
    const world = openFloor();
    for (let y = 0; y < C.MAP_HEIGHT; y++) world.map[y][7] = C.TILE_IDS.WALL;

    addTrigger({
        on: TRIGGER_ON.SIGHT,
        action: TRIGGER_DO.MESSAGE,
        tileX: 10, tileY: 5,
        data: { text: '보일 리 없다' },
    });

    const fired = countingFires(() => stepOnto(world, 5, 5));
    assert.equal(fired, 0, '벽 너머의 기믹이 터졌습니다');
});

// --- 몬스터 죽음 -----------------------------------------------------------------

test('지정한 몬스터가 죽으면 터진다', () => {
    // 우두머리를 잡으면 길이 열리는 식입니다. 자리와 무관합니다.
    const world = openFloor();
    const wall = { tileX: 12, tileY: 12 };
    world.map[wall.tileY][wall.tileX] = C.TILE_IDS.WALL;

    addTrigger({
        on: TRIGGER_ON.MONSTER_DIED,
        action: TRIGGER_DO.CHANGE_TERRAIN,
        data: { monsterId: 'rat', spots: [wall], becomes: 'FLOOR' },
    });

    const enemy = gameLogic.spawnMonster('rat', {
        x: 15 * C.TILE_SIZE, y: 15 * C.TILE_SIZE,
    });
    enemy.hp = 0;
    gameLogic.update(C.SIMULATION_STEP_MS);

    assert.equal(world.map[wall.tileY][wall.tileX], C.TILE_IDS.FLOOR,
        '몬스터가 죽었는데 열리지 않았습니다');
});

test('다른 몬스터가 죽어도 터지지 않는다', () => {
    const world = openFloor();
    const wall = { tileX: 12, tileY: 12 };
    world.map[wall.tileY][wall.tileX] = C.TILE_IDS.WALL;

    addTrigger({
        on: TRIGGER_ON.MONSTER_DIED,
        action: TRIGGER_DO.CHANGE_TERRAIN,
        data: { monsterId: 'orc', spots: [wall], becomes: 'FLOOR' },
    });

    const enemy = gameLogic.spawnMonster('rat', {
        x: 15 * C.TILE_SIZE, y: 15 * C.TILE_SIZE,
    });
    enemy.hp = 0;
    gameLogic.update(C.SIMULATION_STEP_MS);

    assert.equal(world.map[wall.tileY][wall.tileX], C.TILE_IDS.WALL,
        '엉뚱한 몬스터의 죽음으로 터졌습니다');
});

// --- 원본 볼트가 실제로 작동한다 ---------------------------------------------------

test('쥐덫 볼트가 실제로 터진다', () => {
    // 원본의 dk_rats_in_the_wall 입니다. 복도에 압력판이 있고 그 옆 벽 안에
    // 쥐들이 갇혀 있습니다. 밟으면 벽이 열리며 쏟아집니다.
    //
    // 이 검사는 통째로 이어진 길을 봅니다. 임포터가 압력판과 열릴 벽을 읽고,
    // 찍을 때 자리를 적고, beginFloor 가 기믹을 걸고, 밟으면 지형이 바뀝니다.
    // 어느 한 곳만 끊겨도 볼트는 찍히는데 아무 일도 일어나지 않습니다.
    let tested = false;

    for (let seed = 0; seed < 600 && !tested; seed++) {
        seedRandom(seed);
        const world = openFloor();

        const placed = placeMinivaults(world.map, { count: 1 });
        if (placed[0]?.name !== 'dk_rats_in_the_wall') continue;

        const vault = placed[0];
        assert.ok(vault.plates?.length > 0, '압력판을 읽지 못했습니다');
        assert.ok(vault.sealed?.length > 0, '열릴 벽을 읽지 못했습니다');

        actions.beginFloor({
            map: world.map, objectMap: world.objectMap,
            playerStart: { x: 2, y: 2 }, vaults: placed,
        });

        for (const spot of vault.sealed) {
            assert.equal(world.map[spot.tileY][spot.tileX], C.TILE_IDS.WALL,
                '열릴 벽이 처음부터 열려 있습니다');
        }

        const plate = vault.plates[0];
        stepOnto(world, plate.tileX, plate.tileY);

        for (const spot of vault.sealed) {
            assert.equal(world.map[spot.tileY][spot.tileX], C.TILE_IDS.FLOOR,
                '밟았는데 벽이 열리지 않았습니다');
        }
        tested = true;
    }

    assert.ok(tested, '육백 번을 돌려도 쥐덫 볼트가 한 번도 찍히지 않았습니다');
});

test('되풀이되는 기믹도 머무는 동안에는 한 번만 터진다', () => {
    // 여기가 타일 경계 확인이 진짜로 필요한 자리입니다.
    // 한 번만 터지는 기믹은 fired 표시만으로도 억제되지만, 되풀이되는 기믹은
    // 경계를 넘었는지 보지 않으면 서 있는 내내 매 프레임 터집니다.
    const world = openFloor();

    addTrigger({
        on: TRIGGER_ON.ENTER,
        action: TRIGGER_DO.MESSAGE,
        tileX: 10, tileY: 10,
        repeats: true,
        data: { text: '되풀이' },
    });

    const fired = countingFires(() => {
        world.player.x = 10 * C.TILE_SIZE + 2;
        world.player.y = 10 * C.TILE_SIZE + 2;
        // 같은 타일 안에서만 움직입니다. 경계를 넘지 않습니다.
        for (let i = 0; i < 80; i++) {
            world.player.x += 0.2;
            gameLogic.update(C.SIMULATION_STEP_MS);
        }
    });

    assert.equal(fired, 1, `머무는 동안 ${fired} 번 터졌습니다`);
});

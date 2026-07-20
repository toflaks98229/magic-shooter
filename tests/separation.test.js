/**
 * @fileoverview 적끼리 겹쳐 서지 않는지 확인합니다.
 *
 * 모든 적이 같은 플로우 필드를 따르고 그 필드는 네 방향만 보므로, 다들 같은 타일 중심을
 * 향해 걷습니다. 밀어내는 힘이 없으면 플레이어 앞에서 여러 마리가 한 점에 완전히 겹쳐
 * 한 마리처럼 보입니다. 무엇을 상대하고 있는지 알 수 없어지는 문제였습니다.
 *
 * 회귀 스냅샷으로는 이 동작을 확인할 수 없습니다. 그쪽은 1800프레임 뒤의 최종 상태만
 * 보는데, 살아남은 적들이 마침 겹치지 않은 채 끝나면 아무것도 달라지지 않기 때문입니다.
 * (실제로 분리력을 넣은 뒤에도 스냅샷의 적 좌표는 그대로였습니다.)
 * 그래서 겹친 상황을 직접 만들어 확인합니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const worldModule = await import('../Script/world.js');
const { resetWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const A = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');

bindStubDom(dom);

/**
 * 벽으로 둘러싸인 빈 방 하나를 만들고 게임을 굴릴 준비를 합니다.
 * 던전 생성기에 맡기면 지형이 매번 달라져 겹침을 재현할 수 없습니다.
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

    world.player.x = 15 * C.TILE_SIZE;
    world.player.y = 15 * C.TILE_SIZE;
    A.setGameRunning(true);
    return world;
}

/**
 * 적 한 마리를 원하는 자리에 세웁니다.
 * @param {object} world - 월드
 * @param {number} x - 월드 X 좌표
 * @param {number} y - 월드 Y 좌표
 * @returns {object} 세워진 적
 */
function placeEnemy(world, x, y) {
    const enemy = {
        monsterId: 'rat', spriteKey: 'enemy_rat', behavior: 'chaser',
        x, y, z: C.TILE_SIZE / 2,
        hp: 100, maxHp: 100, speed: 0, damage: 0, cooldown: 99999, size: 14,
        lastAttackTime: C.PAST_TIME, lastHitTime: 0,
    };
    world.enemies.push(enemy);
    return enemy;
}

/** @param {object} a @param {object} b @returns {number} 두 적 사이의 거리 */
function gapBetween(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * 시뮬레이션을 여러 스텝 굴립니다.
 * @param {number} steps - 굴릴 스텝 수
 */
function run(steps) {
    for (let i = 0; i < steps; i++) gameLogic.update(C.SIMULATION_STEP_MS);
}

test('겹쳐 선 적이 서로 밀려난다', () => {
    const world = emptyRoom();
    // 속도를 0으로 둔 적을 거의 같은 자리에 세웁니다.
    // 속도가 있으면 플레이어를 향해 걸어가 버려 밀려난 것인지 걸어간 것인지 구분되지 않습니다.
    const a = placeEnemy(world, 10 * C.TILE_SIZE, 10 * C.TILE_SIZE);
    const b = placeEnemy(world, 10 * C.TILE_SIZE + 1, 10 * C.TILE_SIZE);

    assert.ok(gapBetween(a, b) < 2, '시작할 때는 겹쳐 있어야 합니다');

    run(60);

    const minGap = ((a.size + b.size) / 2) * C.ENEMY_SEPARATION_RANGE;
    assert.ok(gapBetween(a, b) >= minGap * 0.9,
        `겹침이 풀리지 않았습니다. 거리 ${gapBetween(a, b).toFixed(1)}, 기대 ${minGap.toFixed(1)}`);
});

test('완전히 같은 자리에 선 적도 갈라선다', () => {
    // 좌표가 정확히 같으면 밀어낼 방향을 잡을 수 없습니다.
    // 방향을 못 정해 그대로 겹쳐 있으면 가장 눈에 띄는 상황에서 아무 효과가 없게 됩니다.
    const world = emptyRoom();
    const a = placeEnemy(world, 10 * C.TILE_SIZE, 10 * C.TILE_SIZE);
    const b = placeEnemy(world, 10 * C.TILE_SIZE, 10 * C.TILE_SIZE);

    assert.equal(gapBetween(a, b), 0);
    run(60);

    assert.ok(gapBetween(a, b) > 1, '같은 자리에 선 적이 갈라서지 않았습니다');
});

test('밀어내는 방향이 무작위가 아니다', () => {
    // 세이브를 불러오면 같은 자리에서 같은 결과가 나와야 합니다.
    // 방향을 Math.random 으로 정하면 불러올 때마다 적 배치가 달라집니다.
    const runOnce = () => {
        const world = emptyRoom();
        const a = placeEnemy(world, 10 * C.TILE_SIZE, 10 * C.TILE_SIZE);
        const b = placeEnemy(world, 10 * C.TILE_SIZE, 10 * C.TILE_SIZE);
        run(30);
        return [a.x, a.y, b.x, b.y];
    };

    assert.deepEqual(runOnce(), runOnce(), '같은 상황에서 다른 결과가 나왔습니다');
});

test('밀려나도 벽을 뚫지 않는다', () => {
    // 벽에 붙어 겹친 적을 밀어내면 벽 밖으로 나갈 수 있습니다.
    // 나가면 그 뒤로는 플로우 필드가 닿지 않아 영영 돌아오지 못합니다.
    const world = emptyRoom();
    const wallX = 1 * C.TILE_SIZE + C.TILE_SIZE / 2;  // 벽 바로 안쪽 칸
    const y = 10 * C.TILE_SIZE + C.TILE_SIZE / 2;

    const a = placeEnemy(world, wallX, y);
    const b = placeEnemy(world, wallX + 1, y);

    run(120);

    for (const enemy of [a, b]) {
        const tileX = Math.floor(enemy.x / C.TILE_SIZE);
        const tileY = Math.floor(enemy.y / C.TILE_SIZE);
        assert.equal(C.tileAt(world.map, tileX, tileY).solid, false,
            `적이 벽 안에 들어갔습니다 (${tileX}, ${tileY})`);
    }
});

test('떨어져 있는 적은 서로 건드리지 않는다', () => {
    // 밀어내는 힘이 거리와 무관하게 작용하면 적들이 방 구석으로 흩어져 버립니다.
    const world = emptyRoom();
    const a = placeEnemy(world, 5 * C.TILE_SIZE, 5 * C.TILE_SIZE);
    const b = placeEnemy(world, 20 * C.TILE_SIZE, 20 * C.TILE_SIZE);
    const before = [a.x, a.y, b.x, b.y];

    run(60);

    assert.deepEqual([a.x, a.y, b.x, b.y], before, '멀리 있는 적이 움직였습니다');
});

test('여러 마리가 뭉쳐도 모두 흩어진다', () => {
    // 실제로 문제가 되는 상황은 두 마리가 아니라 대여섯 마리가 한 점에 몰릴 때입니다.
    const world = emptyRoom();
    const pack = [];
    for (let i = 0; i < 6; i++) {
        pack.push(placeEnemy(world, 10 * C.TILE_SIZE + i * 0.5, 10 * C.TILE_SIZE));
    }

    run(180);

    for (let i = 0; i < pack.length; i++) {
        for (let j = i + 1; j < pack.length; j++) {
            const gap = gapBetween(pack[i], pack[j]);
            const minGap = ((pack[i].size + pack[j].size) / 2) * C.ENEMY_SEPARATION_RANGE;
            assert.ok(gap >= minGap * 0.8,
                `${i}번과 ${j}번이 아직 겹쳐 있습니다. 거리 ${gap.toFixed(1)}, 기대 ${minGap.toFixed(1)}`);
        }
    }
});

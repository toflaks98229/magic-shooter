/**
 * @fileoverview 고정 타임스텝 검증 — 2순위 리팩토링의 핵심 목표.
 *
 * 이전에는 실제 프레임 간격을 그대로 시뮬레이션에 넘겼기 때문에,
 * 같은 조작을 해도 기기의 프레임레이트에 따라 결과가 달라졌습니다.
 * 30FPS에서는 한 스텝의 이동량이 커져 벽을 통과할 수 있었고,
 * 밸런스(쿨다운 대비 이동 거리)도 프레임레이트에 따라 흔들렸습니다.
 *
 * 여기서 확인하는 것은 하나입니다.
 * "같은 시간 동안 같은 조작을 하면, 프레임레이트와 무관하게 같은 결과가 나온다."
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, seedRandom, advanceClock, bindStubDom, fireDocumentEvent } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const worldModule = await import('../Script/world.js');
const { resetWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const { runtime, resetRuntime } = await import('../Script/runtime.js');
const actions = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');
const input = await import('../Script/input.js');
const { advanceSimulation, resetLoop } = await import('../Script/loop.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');

bindStubDom(dom);
input.setupInputHandlers();

const SEED = 0xC0FFEE;

/**
 * 지정한 프레임레이트로 durationMs 만큼 시뮬레이션을 돌립니다.
 * 시드와 모든 모듈 상태를 매번 초기화하므로 프레임레이트만이 유일한 차이입니다.
 * @param {number} fps - 초당 화면 프레임 수
 * @param {number} durationMs - 흘려보낼 총 시간(ms)
 * @returns {object} 시뮬레이션 종료 시점의 상태
 */
function runAtFrameRate(fps, durationMs) {
    seedRandom(SEED);
    resetWorld();
    resetRuntime();
    resetLoop();
    input.clearInputQueue();
    fireDocumentEvent('keyup', { code: 'KeyW' }); // 이전 실행의 키 상태 정리
    actions.setGameRunning(true);

    const world = worldModule.world;
    const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT);
    world.map = dungeon.map;
    world.objectMap = dungeon.objectMap;
    world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;
    gameLogic.spawnEnemiesForFloor();

    // 앞으로 계속 이동시킨다. 이동량은 스텝 수에만 비례해야 한다.
    fireDocumentEvent('keydown', { code: 'KeyW' });

    const frameTime = 1000 / fps;
    const frames = Math.round(durationMs / frameTime);
    for (let i = 0; i < frames; i++) {
        advanceClock(frameTime);
        advanceSimulation(frameTime);
    }
    fireDocumentEvent('keyup', { code: 'KeyW' });

    return {
        x: world.player.x,
        y: world.player.y,
        gameTime: world.time,
        enemies: world.enemies.length,
        bobbing: runtime.bobbingOffset,
    };
}

test('프레임레이트가 달라도 같은 시간에 같은 결과가 나온다', () => {
    const DURATION = 2000; // 2초
    const at30 = runAtFrameRate(30, DURATION);
    const at60 = runAtFrameRate(60, DURATION);
    const at144 = runAtFrameRate(144, DURATION);

    // 누산기에 남는 잔여 시간 때문에 스텝 수가 1개 어긋날 수 있으므로,
    // 완전 일치가 아니라 한 스텝 분량의 오차 안에 드는지를 본다.
    const STEP_TOLERANCE = C.MOVE_SPEED * 1.5; // 한 스텝의 이동량보다 조금 넉넉하게

    for (const [label, result] of [['30fps', at30], ['144fps', at144]]) {
        assert.ok(Math.abs(result.x - at60.x) < STEP_TOLERANCE,
            `${label}의 x가 60fps와 달라졌다: ${result.x} vs ${at60.x}`);
        assert.ok(Math.abs(result.y - at60.y) < STEP_TOLERANCE,
            `${label}의 y가 60fps와 달라졌다: ${result.y} vs ${at60.y}`);
        assert.ok(Math.abs(result.gameTime - at60.gameTime) <= C.SIMULATION_STEP_MS + 1e-6,
            `${label}의 게임 시간이 60fps와 달라졌다: ${result.gameTime} vs ${at60.gameTime}`);
        assert.equal(result.enemies, at60.enemies, `${label}의 적 수가 달라졌다`);

        // 화면 흔들림은 lerp(지수 평활)로 수렴하므로, 가변 타임스텝에서는
        // dtFactor를 곱해도 프레임레이트에 따라 수렴 속도가 달라졌던 값입니다.
        // 고정 스텝에서는 스텝 수가 같으므로 정확히 같은 값이 나와야 합니다.
        assert.ok(Math.abs(result.bobbing - at60.bobbing) < 0.5,
            `${label}의 화면 흔들림이 60fps와 달라졌다: ${result.bobbing} vs ${at60.bobbing}`);
    }

    // 테스트가 의미 있으려면 플레이어가 실제로 움직였어야 한다.
    assert.ok(Math.abs(at60.gameTime - DURATION) < C.SIMULATION_STEP_MS * 2);
    assert.notEqual(at60.bobbing, 0, '이동 중이었다면 화면 흔들림이 일어났어야 한다');
});

test('게임 시간은 실제 흐른 시간과 무관하게 스텝 단위로만 전진한다', () => {
    seedRandom(SEED);
    resetWorld();
    resetLoop();
    actions.setGameRunning(true);
    worldModule.world.map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));

    // 한 스텝에 못 미치는 시간을 여러 번 넣으면, 누적되어 한 스텝이 되는 순간에만 전진해야 한다.
    const steps1 = advanceSimulation(C.SIMULATION_STEP_MS / 2);
    assert.equal(steps1, 0, '한 스텝에 못 미치면 시뮬레이션은 전진하지 않는다');
    assert.equal(worldModule.world.time, 0);

    const steps2 = advanceSimulation(C.SIMULATION_STEP_MS / 2);
    assert.equal(steps2, 1, '누적되어 한 스텝이 되면 한 번 전진한다');
    assert.equal(worldModule.world.time, C.SIMULATION_STEP_MS);
});

test('프레임이 크게 밀려도 한 번에 몰아 실행하지 않는다', () => {
    seedRandom(SEED);
    resetWorld();
    resetLoop();
    actions.setGameRunning(true);
    worldModule.world.map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));

    // 탭을 10초간 비워둔 상황. 600스텝을 몰아 실행하면 그 프레임이 멈춘 것처럼 보이고,
    // 플레이어가 한 번에 먼 거리를 이동해 벽을 통과할 수도 있다.
    const steps = advanceSimulation(10_000);
    assert.ok(steps <= C.MAX_STEPS_PER_FRAME, `한 프레임에 ${steps}스텝을 실행했다`);

    // 밀린 시간을 계속 쌓아두면 다음 프레임이 더 무거워져 점점 느려지므로(죽음의 나선),
    // 따라잡지 못한 시간은 버려야 한다.
    const nextSteps = advanceSimulation(0);
    assert.equal(nextSteps, 0, '따라잡지 못한 시간은 다음 프레임으로 넘기지 않는다');
});

test('플레이어 상태는 시뮬레이션 스텝 안에서만 변한다', () => {
    seedRandom(SEED);
    resetWorld();
    resetLoop();
    input.clearInputQueue();
    actions.setGameRunning(true);
    worldModule.world.map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));

    globalThis.document.pointerLockElement = dom.canvas;
    const angleBefore = worldModule.world.player.angle;

    // 마우스를 여러 번 움직여도 시뮬레이션이 돌기 전에는 각도가 변하지 않아야 한다.
    // (이전에는 mousemove 핸들러가 player.angle을 그 자리에서 바꿨다)
    for (let i = 0; i < 5; i++) fireDocumentEvent('mousemove', { movementX: 20 });
    assert.equal(worldModule.world.player.angle, angleBefore,
        '입력이 게임 루프 밖에서 플레이어 상태를 바꾸면 안 된다');

    // 스텝이 돌면 그동안 쌓인 이동량이 한꺼번에 반영된다.
    advanceSimulation(C.SIMULATION_STEP_MS);
    const expected = angleBefore + 5 * 20 * C.MOUSE_SENSITIVITY * C.ROTATION_SPEED;
    assert.ok(Math.abs(worldModule.world.player.angle - expected) < 1e-9,
        `누적된 회전량이 반영되어야 한다: ${worldModule.world.player.angle} vs ${expected}`);
});

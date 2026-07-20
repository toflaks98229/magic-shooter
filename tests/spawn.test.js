/**
 * @fileoverview 적 스폰과 던전 생성 검증.
 *
 * 이전의 findSpawnPoint는 "벽이 아니고 플레이어와 5타일 이상" 조건을 만족하는 칸이
 * 하나도 없는 맵에서 do...while 루프를 영원히 돌아 브라우저를 멈추게 했습니다.
 * 여기서는 그런 맵을 일부러 만들어, 스폰이 반드시 끝나는지 확인합니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
// world는 resetWorld()가 재할당하므로 네임스페이스로 접근해야 합니다.
// const { world } = await import(...) 로 구조분해하면 live binding이 끊겨
// 항상 옛 월드 객체를 보게 됩니다.
const worldModule = await import('../Script/world.js');
const { resetWorld } = worldModule;
const { spawnEnemiesForFloor } = await import('../Script/gameLogic.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');

const TILE = C.TILE_SIZE;
const grid = (w, h, value) => Array.from({ length: h }, () => Array(w).fill(value));

/** 주어진 맵과 플레이어 위치로 월드를 세팅한다. */
function setupWorld(map, playerTileX, playerTileY) {
    resetWorld();
    worldModule.world.map = map;
    worldModule.world.objectMap = grid(map[0].length, map.length, 0);
    worldModule.world.player.x = playerTileX * TILE + TILE / 2;
    worldModule.world.player.y = playerTileY * TILE + TILE / 2;
}

test('넓은 맵에서는 항상 바닥이면서 플레이어와 떨어진 곳에 스폰한다', () => {
    setupWorld(grid(30, 30, 0), 15, 15);
    worldModule.world.floor = 20; // 깊을수록 많이 스폰되지만 MAX_ENEMIES_PER_FLOOR 로 상한이 걸립니다
    spawnEnemiesForFloor();

    assert.equal(worldModule.world.enemies.length, C.MAX_ENEMIES_PER_FLOOR);
    const minDistance = TILE * C.SPAWN_MIN_DISTANCE_TILES;
    for (const enemy of worldModule.world.enemies) {
        const tileX = Math.floor(enemy.x / TILE);
        const tileY = Math.floor(enemy.y / TILE);
        assert.equal(worldModule.world.map[tileY][tileX], 0, '적은 바닥 위에 있어야 한다');
        assert.ok(Math.hypot(enemy.x - worldModule.world.player.x, enemy.y - worldModule.world.player.y) >= minDistance,
            '적은 플레이어에게서 충분히 떨어져 있어야 한다');
    }
});

test('조건을 만족하는 칸이 없는 맵에서도 스폰이 끝난다', () => {
    // 바닥이 플레이어 주변 3x3에만 있어 "5타일 이상 떨어진 바닥"이 존재하지 않는다.
    // 이전 구현은 여기서 무한 루프에 빠졌다.
    const map = grid(10, 10, 1);
    for (let y = 4; y <= 6; y++) for (let x = 4; x <= 6; x++) map[y][x] = 0;
    setupWorld(map, 5, 5);
    worldModule.world.floor = 1;

    // Date.now는 가상 시계로 대체되어 있으므로 실제 경과 시간은 performance.now로 잰다.
    const started = performance.now();
    spawnEnemiesForFloor(); // 멈추지 않고 반환되어야 한다
    assert.ok(performance.now() - started < 2000, '스폰이 즉시 끝나야 한다');

    assert.equal(worldModule.world.enemies.length, 5);
    for (const enemy of worldModule.world.enemies) {
        const tileX = Math.floor(enemy.x / TILE);
        const tileY = Math.floor(enemy.y / TILE);
        assert.equal(map[tileY][tileX], 0, '폴백이어도 바닥 위에 스폰해야 한다');
    }
});

test('바닥이 하나도 없는 맵에서도 멈추지 않는다', () => {
    setupWorld(grid(6, 6, 1), 2, 2);
    worldModule.world.floor = 1;

    spawnEnemiesForFloor();
    assert.equal(worldModule.world.enemies.length, 5, '최후의 폴백으로 플레이어 위치에 스폰한다');
});

test('generateDungeon이 항상 유효한 맵을 만든다', () => {
    for (let i = 0; i < 300; i++) {
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, 15, 4, 8);

        assert.equal(dungeon.map.length, C.MAP_HEIGHT);
        assert.equal(dungeon.map[0].length, C.MAP_WIDTH);
        assert.equal(dungeon.objectMap.length, C.MAP_HEIGHT);

        const exits = dungeon.map.flat().filter(tile => tile === 4).length;
        assert.equal(exits, 1, '출구 타일은 정확히 하나여야 한다');

        assert.equal(dungeon.map[dungeon.playerStart.y][dungeon.playerStart.x], 0,
            '플레이어 시작 지점은 바닥이어야 한다');
    }
});

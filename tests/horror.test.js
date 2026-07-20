/**
 * @fileoverview 공포 갈래의 중심 규칙을 검사합니다.
 *
 * 이 갈래는 싸울 수 없습니다. 적을 죽일 수단이 없는 것이 중심이라,
 * 인지 거리와 기억 시간과 우는 소리가 곁가지가 아니라 규칙 전부가 됩니다.
 *
 * 그래서 여기서 가장 중요한 검사는 '정말로 못 싸우는가' 입니다.
 * 어딘가에 공격 경로가 남아 있으면 게임의 전제가 무너집니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { installBrowserStubs, bindStubDom, seedRandom } from './helpers/browser-stubs.js';

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
    return world;
}

// --- 싸울 수 없다 ----------------------------------------------------------------

test('공격해도 적이 다치지 않는다', () => {
    const world = emptyRoom();

    const enemy = gameLogic.spawnMonster('rat', {
        x: world.player.x + C.TILE_SIZE,
        y: world.player.y,
    });
    const before = enemy.hp;

    world.player.angle = 0;
    for (let i = 0; i < 60; i++) {
        gameLogic.attack();
        gameLogic.update(C.SIMULATION_STEP_MS);
    }

    assert.equal(enemy.hp, before, '싸울 수 없는데 적이 다쳤습니다');
});

test('공격해도 발사체가 나가지 않는다', () => {
    const world = emptyRoom();
    world.player.angle = 0;

    for (let i = 0; i < 30; i++) {
        gameLogic.attack();
        gameLogic.update(C.SIMULATION_STEP_MS);
    }

    const fromPlayer = world.projectiles.filter(p => p.from !== 'enemy');
    assert.equal(fromPlayer.length, 0, '싸울 수 없는데 발사체가 나갔습니다');
});

test('공격해도 탄약이 줄지 않는다', () => {
    const world = emptyRoom();
    const before = world.player.ammo;

    for (let i = 0; i < 30; i++) {
        gameLogic.attack();
        gameLogic.update(C.SIMULATION_STEP_MS);
    }

    assert.equal(world.player.ammo, before, '쏘지 않았는데 탄약이 줄었습니다');
});

// --- 적은 여전히 위험하다 ---------------------------------------------------------

test('적은 여전히 플레이어를 때린다', () => {
    // 못 싸운다는 것이 안전하다는 뜻은 아닙니다.
    // 맞는 쪽 판정이 살아 있어야 도망칠 이유가 생깁니다.
    const world = emptyRoom();
    world.player.hp = 1000;

    const enemy = gameLogic.spawnMonster('rat', {
        x: world.player.x + 20,
        y: world.player.y,
    });
    enemy.state = 'chase';
    enemy.huntUntil = 1e9;
    enemy.cooldown = 0;

    const before = world.player.hp;
    for (let i = 0; i < 200; i++) gameLogic.update(C.SIMULATION_STEP_MS);

    assert.ok(world.player.hp < before, '적이 플레이어를 때리지 못했습니다');
});

// --- 도망이 통한다 ---------------------------------------------------------------

test('시야를 끊고 오래 버티면 잊힌다', () => {
    // 이 갈래의 핵심 대응입니다. 싸울 수 없으니 따돌리는 것이 유일한 해법이고,
    // 무엇에게 쫓기는지에 따라 얼마나 오래 숨어야 하는지가 갈립니다.
    const world = emptyRoom();

    const enemy = gameLogic.spawnMonster('rat', {
        x: world.player.x + 2 * C.TILE_SIZE,
        y: world.player.y,
    });

    for (let i = 0; i < 10; i++) gameLogic.update(C.SIMULATION_STEP_MS);
    assert.notEqual(enemy.state, 'idle', '가까운데 알아채지 못했습니다');

    // 벽 뒤로 숨습니다.
    //
    // 그냥 멀어지는 것으로는 부족합니다. 빈 방에서는 아무리 멀어져도 시야가
    // 닿아 기억이 계속 새로 채워집니다. 실제로 스물다섯 칸을 옮겨도 잊지
    // 않았습니다. 시야를 끊어야 잊기 시작합니다. 그것이 이 갈래의 요점입니다.
    const wallColumn = Math.floor(world.player.x / C.TILE_SIZE) + 4;
    for (let y = 0; y < C.MAP_HEIGHT; y++) world.map[y][wallColumn] = C.TILE_IDS.WALL;
    world.mapRevision = (world.mapRevision ?? 0) + 1;

    world.player.x = (wallColumn + 6) * C.TILE_SIZE;

    // 쥐는 머리가 없어 곧 잊습니다. (100~300 aut = 5~15초)
    for (let i = 0; i < 1200; i++) gameLogic.update(C.SIMULATION_STEP_MS);

    assert.equal(enemy.state, 'idle', '오래 숨었는데 잊지 않았습니다');
});

// --- 시점 ------------------------------------------------------------------------

test('위에서 내려다보는 렌더러가 있다', () => {
    const source = readFileSync(new URL('../Script/renderTopDown.js', import.meta.url), 'utf8');

    assert.match(source, /export function render/, '그리는 함수가 없습니다');
    assert.match(source, /isVisible/, '시야 판정이 없습니다');
});

test('가 본 곳을 기억하되 몬스터는 남기지 않는다', () => {
    // 지형은 어둡게 남습니다. 그러지 않으면 왔던 길도 매번 새로 더듬어야 해서
    // 긴장이 아니라 성가심이 됩니다.
    //
    // 몬스터는 남기지 않습니다. 어디 있었는지 기억나면 피해 가기가 너무 쉬워집니다.
    const source = readFileSync(new URL('../Script/renderTopDown.js', import.meta.url), 'utf8');

    assert.match(source, /world\.seen\[/, '가 본 곳을 적어 두지 않습니다');
    assert.match(source, /function drawEnemies[\s\S]*?if \(!isVisible/,
        '적을 보이지 않아도 그리고 있습니다');
    assert.ok(!/world\.seen[\s\S]{0,200}enem/i.test(source),
        '적을 기억에 남기고 있습니다');
});

test('가 본 곳이 층마다 비워진다', () => {
    // 층을 옮겨도 남아 있으면 새 층이 처음부터 드러나 보입니다.
    assert.ok(worldModule.FLOOR_SCOPED_COLLECTIONS.includes('seen'),
        'seen 이 층 단위로 비워지지 않습니다');
});

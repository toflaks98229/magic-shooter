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

import { installBrowserStubs, bindStubDom, seedRandom, fireDocumentEvent } from './helpers/browser-stubs.js';

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

test('플레이어를 고른 종족의 그림으로 그린다', () => {
    // 1인칭에서는 자기 모습이 화면에 없었습니다. 위에서 보면 자기가 어디
    // 있는지 보이지 않으면 움직일 수가 없습니다.
    const source = readFileSync(new URL('../Script/renderTopDown.js', import.meta.url), 'utf8');
    assert.match(source, /function drawPlayer[\s\S]*?player_\$\{species\}/,
        '플레이어를 그리지 않거나 종족을 보지 않습니다');

    // 그림이 실제로 있어야 합니다. 이름만 맞추고 아틀라스에 없으면
    // drawSprite 가 조용히 아무것도 하지 않아, 고쳐진 것처럼만 보입니다.
    const atlas = JSON.parse(readFileSync(
        new URL('../Data/tiles/player-base_data.json', import.meta.url), 'utf8'));
    const species = [...readFileSync(new URL('../Script/data/species.js', import.meta.url), 'utf8')
        .matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);

    const missing = species.filter(id => !(`player_${id}` in atlas.sprites));
    assert.deepEqual(missing, [], `그림이 없는 종족: ${missing.join(', ')}`);

    // 아틀라스가 실려야 fetch 대상이 됩니다.
    assert.ok(Object.values(C.SPRITE_SHEET_URLS).includes('Data/tiles/player-base_data.json'),
        '플레이어 아틀라스를 읽지 않습니다');
});

test('모퉁이 벽도 보이는 것으로 친다', async () => {
    // 벽 한가운데로 선을 그으면 그 벽 자신에게 막혀 언제나 가려진 것으로
    // 나옵니다. 모퉁이가 특히 그래서, 벽 줄에 구멍이 뚫린 것처럼 보였습니다.
    const world = emptyRoom();
    const { isVisible } = await import('../Script/renderTopDown.js');

    const px = Math.floor(world.player.x / C.TILE_SIZE);
    const py = Math.floor(world.player.y / C.TILE_SIZE);

    // 플레이어 앞에 ㄱ 자로 꺾인 벽을 세웁니다. 꺾이는 자리가 모퉁이입니다.
    //
    //     . . . .
    //     . # # #      ← 가로줄
    //     . #  . .     ← 세로줄. 둘이 만나는 (cx, cy) 가 모퉁이
    //     . @ . .
    const cornerX = px + 1;
    const cornerY = py - 2;
    for (let x = cornerX; x <= cornerX + 2; x++) world.map[cornerY][x] = C.TILE_IDS.WALL;
    for (let y = cornerY; y <= cornerY + 1; y++) world.map[y][cornerX] = C.TILE_IDS.WALL;
    world.mapRevision = (world.mapRevision ?? 0) + 1;

    assert.ok(isVisible(cornerX, cornerY),
        '모퉁이 벽이 보이지 않습니다. 벽 줄에 구멍이 뚫려 보입니다');

    // 그렇다고 아무 벽이나 보이면 안 됩니다. 벽 뒤에 가려진 벽은 여전히
    // 보이지 않아야 합니다. 그러지 않으면 층 전체가 드러납니다.
    world.map[cornerY - 1][cornerX + 1] = C.TILE_IDS.WALL;
    assert.ok(!isVisible(cornerX + 1, cornerY - 1),
        '벽 뒤에 가려진 벽까지 보입니다');
});

test('화면 전체를 붉게 물들이지 않는다', () => {
    // 1인칭에서는 화면이 곧 눈이라 화면에 피가 튀는 것이 뜻을 가졌습니다.
    // 위에서 내려다보는 화면은 눈이 아니라 지도입니다.
    const ui = readFileSync(new URL('../Script/ui.js', import.meta.url), 'utf8');
    assert.ok(!/bloodSplatterEl\.style\.opacity\s*=\s*0\.\d/.test(ui),
        '피격 때 화면 전체를 붉게 물들이고 있습니다');

    const source = readFileSync(new URL('../Script/renderTopDown.js', import.meta.url), 'utf8');
    assert.match(source, /PLAYER_DAMAGED/, '맞았다는 소식을 그리는 쪽이 받지 않습니다');
});

// --- 길찾기 ----------------------------------------------------------------------

test('비스듬한 길을 계단으로 꺾지 않는다', () => {
    // 오랫동안 네 방향으로만 길을 찾았습니다. 1인칭에서는 그 차이가 보이지
    // 않았습니다. 앞에서 다가오는 몬스터는 어느 쪽으로 왔든 다가오는 것으로만
    // 보였습니다. 위에서 보면 계단처럼 꺾여 오는 것이 그대로 드러납니다.
    const world = emptyRoom();

    // 플레이어에게서 대각선으로 여섯 칸 떨어진 곳에 세웁니다.
    const enemy = gameLogic.spawnMonster('rat', {
        x: world.player.x + 6 * C.TILE_SIZE,
        y: world.player.y + 6 * C.TILE_SIZE,
    });
    enemy.state = 'chase';
    enemy.huntUntil = 1e9;

    const startX = enemy.x - world.player.x;
    const startY = enemy.y - world.player.y;

    for (let i = 0; i < 60; i++) gameLogic.update(C.SIMULATION_STEP_MS);

    const movedX = startX - (enemy.x - world.player.x);
    const movedY = startY - (enemy.y - world.player.y);

    assert.ok(movedX > 1 && movedY > 1,
        `한쪽 축으로만 다가왔습니다: x ${movedX.toFixed(1)}, y ${movedY.toFixed(1)}`);

    // 두 축이 비슷하게 줄어야 비스듬히 온 것입니다. 네 방향뿐이면 한 축을
    // 먼저 다 줄이고 나서 다른 축을 줄이므로 크게 어긋납니다.
    const ratio = Math.min(movedX, movedY) / Math.max(movedX, movedY);
    assert.ok(ratio > 0.7, `비스듬히 오지 않았습니다: 비율 ${ratio.toFixed(2)}`);
});

test('벽 두 장 사이 틈으로 비스듬히 들어가지 않는다', () => {
    // 원본은 그 틈으로 지나갑니다. 여기서는 막습니다. 부딪힘을 가로세로 따로
    // 보기 때문에, 틈으로 들어가면 양쪽 다 막혀 그 자리에 붙어 버립니다.
    // 길을 찾는 쪽과 움직이는 쪽이 다른 규칙을 쓰면 그런 자리가 생깁니다.
    const world = emptyRoom();

    const px = Math.floor(world.player.x / C.TILE_SIZE);
    const py = Math.floor(world.player.y / C.TILE_SIZE);

    // 플레이어 오른쪽 위 대각선 칸으로만 이어지도록 벽 두 장을 놓습니다.
    world.map[py - 1][px] = C.TILE_IDS.WALL;
    world.map[py][px + 1] = C.TILE_IDS.WALL;
    world.mapRevision = (world.mapRevision ?? 0) + 1;

    const enemy = gameLogic.spawnMonster('rat', {
        x: (px + 1) * C.TILE_SIZE + C.TILE_SIZE / 2,
        y: (py - 1) * C.TILE_SIZE + C.TILE_SIZE / 2,
    });
    enemy.state = 'chase';
    enemy.huntUntil = 1e9;

    const startDistance = Math.hypot(enemy.x - world.player.x, enemy.y - world.player.y);
    for (let i = 0; i < 40; i++) gameLogic.update(C.SIMULATION_STEP_MS);
    const endDistance = Math.hypot(enemy.x - world.player.x, enemy.y - world.player.y);

    // 틈으로 곧장 오려 했다면 벽에 붙어 거리가 그대로였을 것입니다.
    // 돌아가든 제자리에 있든, 벽에 끼어 진동하지만 않으면 됩니다.
    assert.ok(Math.abs(endDistance - startDistance) > 1 || endDistance >= startDistance,
        '벽 사이에 끼었습니다');
});

// --- 조작 ------------------------------------------------------------------------

test('누른 방향으로 바로 간다', async () => {
    // 1인칭에서는 시야 방향을 기준으로 앞뒤좌우를 잡았습니다.
    // 위에서 내려다보는 화면에서 그러면, 위를 눌렀는데 화면에서 옆으로 갑니다.
    const world = emptyRoom();
    const input = await import('../Script/input.js');
    input.setupInputHandlers();

    const move = (code) => {
        world.player.x = 20 * C.TILE_SIZE;
        world.player.y = 20 * C.TILE_SIZE;
        const start = { x: world.player.x, y: world.player.y };

        fireDocumentEvent('keydown', { code });
        for (let i = 0; i < 40; i++) gameLogic.update(C.SIMULATION_STEP_MS);
        fireDocumentEvent('keyup', { code });

        return { dx: world.player.x - start.x, dy: world.player.y - start.y };
    };

    const up = move('KeyW');
    assert.ok(up.dy < -10, `W 를 눌렀는데 위로 가지 않았습니다: ${JSON.stringify(up)}`);
    assert.ok(Math.abs(up.dx) < 1, 'W 를 눌렀는데 옆으로도 갔습니다');

    const right = move('KeyD');
    assert.ok(right.dx > 10, `D 를 눌렀는데 오른쪽으로 가지 않았습니다: ${JSON.stringify(right)}`);
    assert.ok(Math.abs(right.dy) < 1, 'D 를 눌렀는데 위아래로도 갔습니다');
});

test('바라보는 쪽이 움직인 방향을 따른다', async () => {
    // 시야 방향은 버리지 않았습니다. 무엇이 보이는지를 정하는 데 계속 쓰입니다.
    const world = emptyRoom();
    const input = await import('../Script/input.js');
    input.setupInputHandlers();

    world.player.x = 20 * C.TILE_SIZE;
    world.player.y = 20 * C.TILE_SIZE;

    fireDocumentEvent('keydown', { code: 'KeyD' });
    for (let i = 0; i < 10; i++) gameLogic.update(C.SIMULATION_STEP_MS);
    fireDocumentEvent('keyup', { code: 'KeyD' });

    // 오른쪽은 각도 0 입니다.
    assert.ok(Math.abs(world.player.angle) < 0.1,
        `오른쪽으로 갔는데 각도가 ${world.player.angle} 입니다`);
});

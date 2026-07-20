/**
 * @fileoverview 포탈 던전 검증.
 *
 * 포탈이 정규 가지와 다른 점은 네 가지입니다.
 *   확률적으로 나타난다 · 시간이 지나면 영구히 닫힌다
 *   한 게임에 정해진 횟수만 나온다 · 깊이에 맞는 것만 나온다
 * 이 규칙들이 지켜지지 않으면 "지금 갈지 말지"라는 선택이 성립하지 않습니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom, seedRandom, advanceClock } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const P = await import('../Script/portals.js');
const B = await import('../Script/branches.js');
// world는 포탈 진입/복귀가 교체하므로 네임스페이스로 접근해야 합니다.
const worldModule = await import('../Script/world.js');
const { resetWorld, serializeWorld, deserializeWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const A = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');

bindStubDom(dom);

/** 현재 월드에 층 하나를 만들어 넣습니다. */
function buildFloor() {
    const world = worldModule.world;
    const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT);
    world.map = dungeon.map;
    world.objectMap = dungeon.objectMap;
    world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;
    return dungeon;
}

/** 지형과 적 배치를 하나의 값으로 요약합니다. */
function fingerprint() {
    const world = worldModule.world;
    const mapSum = world.map.flat().reduce((a, v, i) => (a + v * (i + 1)) % 2147483647, 0);
    return `${mapSum}|${world.enemies.length}`;
}

/** 바닥 한 칸을 찾아 포탈을 열어 둡니다. */
function openPortalAt(portalId) {
    const world = worldModule.world;
    const portal = P.PORTAL_DUNGEONS[portalId];
    for (let y = 0; y < world.map.length; y++) {
        for (let x = 0; x < world.map[y].length; x++) {
            if (!C.tileAt(world.map, x, y).spawnable) continue;
            world.map[y][x] = C.TILE_IDS.PORTAL;
            A.openPortal(portal, x, y);
            return { x, y };
        }
    }
    throw new Error('포탈을 놓을 자리가 없습니다');
}

// --- 정의 -------------------------------------------------------------------

test('모든 포탈 던전이 필요한 값을 갖춘다', () => {
    for (const portal of Object.values(P.PORTAL_DUNGEONS)) {
        assert.ok(portal.name, `${portal.id}에 이름이 없습니다`);
        assert.ok(portal.flavour, `${portal.name}에 등장 문구가 없습니다`);
        assert.ok(portal.minDepth <= portal.maxDepth, `${portal.name}의 깊이 범위가 뒤집혀 있습니다`);
        assert.ok(portal.chance > 0 && portal.chance <= 1, `${portal.name}의 확률이 범위 밖입니다`);
        assert.ok(portal.maxPerGame >= 1, `${portal.name}의 생성 한도가 0입니다`);
        assert.ok(portal.lifetimeMs > 0, `${portal.name}의 유지 시간이 0입니다`);
        assert.ok(portal.depth >= 1, `${portal.name}의 층수가 0입니다`);
    }
});

test('포탈 식별자가 정규 가지와 겹치지 않는다', () => {
    // getBranch가 둘을 한 조회로 해석하므로, 겹치면 한쪽이 가려집니다.
    for (const id of Object.keys(P.PORTAL_DUNGEONS)) {
        assert.ok(!(id in B.BRANCHES), `포탈 '${id}'가 정규 가지와 이름이 겹칩니다`);
    }
});

test('getBranch가 포탈도 해석한다', () => {
    // 포탈에 들어가면 층 표시와 최하층 판정이 가지와 같은 코드를 탑니다.
    const sewer = B.getBranch('sewer');
    assert.equal(sewer.name, '하수구');
    assert.equal(sewer.isPortal, true);
    assert.equal(B.formatLocation('sewer', 1), 'sewer:1');
});

test('네크로폴리스만 한 게임에 여러 번 나타난다', () => {
    for (const portal of Object.values(P.PORTAL_DUNGEONS)) {
        const expected = portal.id === 'necropolis' ? 3 : 1;
        assert.equal(portal.maxPerGame, expected, `${portal.name}의 생성 한도가 예상과 다릅니다`);
    }
});

// --- 등장 규칙 ---------------------------------------------------------------

test('깊이에 맞지 않는 포탈은 후보에 오르지 않는다', () => {
    const shallow = P.eligiblePortals(3);
    const deep = P.eligiblePortals(20);

    assert.ok(shallow.some(p => p.id === 'ossuary'), '납골당은 초반에 나와야 합니다');
    assert.ok(!shallow.some(p => p.isWizardLab), '연구소는 초반에 나오면 안 됩니다');
    assert.ok(deep.some(p => p.isWizardLab), '연구소는 후반에 나와야 합니다');
    assert.ok(!deep.some(p => p.id === 'ossuary'), '납골당은 후반에는 나오지 않아야 합니다');
});

test('생성 한도를 채운 포탈은 다시 후보에 오르지 않는다', () => {
    const used = { ossuary: 1, necropolis: 1 };
    const candidates = P.eligiblePortals(5, used);

    assert.ok(!candidates.some(p => p.id === 'ossuary'), '한도를 채운 납골당이 다시 후보에 있습니다');
    assert.ok(candidates.some(p => p.id === 'necropolis'), '네크로폴리스는 아직 두 번 남아 있어야 합니다');
});

test('한 층에는 포탈이 최대 하나만 열린다', () => {
    for (let seed = 0; seed < 200; seed++) {
        seedRandom(0xB000 + seed);
        const rolled = P.rollPortalForFloor(10, {});
        assert.ok(rolled === null || typeof rolled.id === 'string');
    }
});

test('포탈은 대부분의 층에 나타나지 않는다', () => {
    // 매 층 나온다면 특별할 것이 없고, 아예 안 나오면 기능이 죽은 것입니다.
    let appeared = 0;
    const FLOORS = 400;
    for (let seed = 0; seed < FLOORS; seed++) {
        seedRandom(0xC000 + seed);
        if (P.rollPortalForFloor(10, {})) appeared++;
    }
    const rate = appeared / FLOORS;
    assert.ok(rate > 0.05, `등장률이 ${(rate * 100).toFixed(1)}%로 너무 낮습니다`);
    assert.ok(rate < 0.6, `등장률이 ${(rate * 100).toFixed(1)}%로 너무 높습니다`);
});

// --- 타이머 -----------------------------------------------------------------

test('시간이 지나면 포탈이 닫히고 자리는 바닥이 된다', () => {
    seedRandom(0xD001);
    resetWorld();
    A.setGameRunning(true);
    buildFloor();

    const spot = openPortalAt('sewer');
    assert.equal(worldModule.world.map[spot.y][spot.x], C.TILE_IDS.PORTAL);
    assert.equal(worldModule.world.portals.length, 1);

    // 아직 시간이 남았으면 그대로 있어야 합니다.
    worldModule.world.time += P.PORTAL_DUNGEONS.sewer.lifetimeMs - 1;
    A.closeExpiredPortals();
    assert.equal(worldModule.world.portals.length, 1, '시간이 남았는데 닫혔습니다');

    // 시간이 다 되면 영구히 닫힙니다.
    worldModule.world.time += 2;
    A.closeExpiredPortals();
    assert.equal(worldModule.world.portals.length, 0, '시간이 지났는데 닫히지 않았습니다');
    assert.equal(worldModule.world.map[spot.y][spot.x], C.TILE_IDS.FLOOR, '닫힌 자리가 바닥이 아닙니다');
});

test('포탈이 닫히면 경로 캐시가 무효화된다', () => {
    // 포탈 타일은 통행을 막으므로, 닫힌 뒤에도 적이 벽으로 여기면 안 됩니다.
    seedRandom(0xD002);
    resetWorld();
    A.setGameRunning(true);
    buildFloor();
    openPortalAt('sewer');

    const before = worldModule.world.mapRevision;
    worldModule.world.time += P.PORTAL_DUNGEONS.sewer.lifetimeMs;
    A.closeExpiredPortals();

    assert.ok(worldModule.world.mapRevision > before, '맵 개정 번호가 오르지 않았습니다');
});

// --- 진입과 복귀 -------------------------------------------------------------

test('포탈에 들어가면 스택에 쌓이고 나오면 복원된다', () => {
    seedRandom(0xE001);
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.floor = 5;
    buildFloor();
    gameLogic.spawnEnemiesForFloor();

    // 포탈은 들어가는 순간 소모되므로, 복귀했을 때의 지형은 '포탈이 놓이기 전'과 같아야 합니다.
    const before = { fingerprint: fingerprint(), branch: worldModule.world.branch, floor: worldModule.world.floor };

    openPortalAt('ossuary');
    assert.notEqual(fingerprint(), before.fingerprint, '포탈 타일이 실제로 놓여야 합니다');

    assert.equal(A.enterPortal('ossuary'), true);
    assert.equal(worldModule.world.branch, 'ossuary');
    assert.equal(worldModule.world.parentStack.length, 1);

    buildFloor();
    gameLogic.spawnEnemiesForFloor();
    A.damagePlayer(20);
    const hpInside = worldModule.world.player.hp;

    assert.equal(A.returnToParent(), true);
    assert.equal(worldModule.world.branch, before.branch);
    assert.equal(worldModule.world.floor, before.floor);
    assert.equal(fingerprint(), before.fingerprint, '떠난 층이 그대로 복원되어야 합니다');
    assert.equal(worldModule.world.player.hp, hpInside, '포탈 안에서 입은 피해는 유지되어야 합니다');
});

test('들어간 포탈은 나왔을 때 사라져 있다', () => {
    // 다시 들어갈 수 있으면 보상을 무한히 얻을 수 있습니다.
    seedRandom(0xE002);
    resetWorld();
    A.setGameRunning(true);
    buildFloor();

    const spot = openPortalAt('bazaar');
    A.enterPortal('bazaar');
    buildFloor();
    A.returnToParent();

    assert.equal(worldModule.world.portals.length, 0, '복귀한 층에 포탈이 남아 있습니다');
    assert.notEqual(worldModule.world.map[spot.y][spot.x], C.TILE_IDS.PORTAL, '포탈 타일이 남아 있습니다');
});

test('생성 횟수는 던전을 옮겨 다녀도 유지된다', () => {
    // 서브 던전에 들어갔다 나올 때마다 초기화되면 한도가 의미를 잃습니다.
    seedRandom(0xE003);
    resetWorld();
    A.setGameRunning(true);
    buildFloor();

    openPortalAt('volcano');
    assert.equal(worldModule.world.portalsUsed.volcano, 1);

    A.enterPortal('volcano');
    assert.equal(worldModule.world.portalsUsed.volcano, 1, '포탈 안에서 기록이 사라졌습니다');

    buildFloor();
    A.returnToParent();
    assert.equal(worldModule.world.portalsUsed.volcano, 1, '복귀 후 기록이 사라졌습니다');
});

test('포탈 안에서 저장하고 불러와도 돌아갈 길이 남는다', () => {
    seedRandom(0xE004);
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.floor = 6;
    buildFloor();
    gameLogic.spawnEnemiesForFloor();

    const outsideFingerprint = fingerprint();
    openPortalAt('iceCave');
    A.enterPortal('iceCave');
    buildFloor();

    const saved = serializeWorld();
    resetWorld();
    deserializeWorld(saved);

    assert.equal(worldModule.world.branch, 'iceCave');
    assert.equal(worldModule.world.parentStack.length, 1);
    assert.equal(A.returnToParent(), true);
    assert.equal(fingerprint(), outsideFingerprint, '불러온 뒤에도 원래 층이 그대로여야 합니다');
});

test('포탈 던전의 난이도가 들어온 깊이를 따른다', () => {
    // 포탈은 표에 고정된 위치가 없습니다. 들어온 깊이를 기억하지 않으면
    // 후반에 들어간 연구소가 1층 난이도로 스폰되어 보상만 챙기는 곳이 됩니다.
    seedRandom(0xF001);
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.floor = 14;
    buildFloor();

    const outsideDanger = A.currentDangerLevel();
    openPortalAt('maxwell');
    A.enterPortal('maxwell');
    buildFloor();
    gameLogic.spawnEnemiesForFloor();

    assert.equal(A.currentDangerLevel(), outsideDanger,
        '포탈 안의 위험도가 들어온 깊이와 같아야 합니다');
    assert.ok(worldModule.world.enemies.length > 20,
        `깊은 곳의 포탈인데 적이 ${worldModule.world.enemies.length}마리뿐입니다`);

    // 복귀하면 원래 던전의 계산으로 돌아가야 합니다.
    A.returnToParent();
    assert.equal(worldModule.world.portalDangerLevel, null);
    assert.equal(A.currentDangerLevel(), outsideDanger);
});

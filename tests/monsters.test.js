/**
 * @fileoverview 몬스터 정의와 던전별 스폰 검증.
 *
 * 적이 네 종류뿐이던 때는 어느 던전을 가도 같은 것들이 나왔습니다.
 * 이제 던전마다 자기 목록을 갖고 깊이에 맞는 것이 뽑히므로,
 * 확인해야 할 것은 두 가지입니다.
 *   던전이 자기 몬스터를 낸다 · 깊이에 맞지 않는 것은 나오지 않는다
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom, seedRandom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const M = await import('../Script/monsters.js');
const B = await import('../Script/branches.js');
const P = await import('../Script/portals.js');
const worldModule = await import('../Script/world.js');
const { resetWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const A = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');

bindStubDom(dom);

/** 지정한 던전과 층으로 세계를 세우고 적을 스폰합니다. */
function spawnIn(branchId, floor) {
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.branch = branchId;
    worldModule.world.floor = floor;

    const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT);
    worldModule.world.map = dungeon.map;
    worldModule.world.objectMap = dungeon.objectMap;
    worldModule.world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
    worldModule.world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;

    gameLogic.spawnEnemiesForFloor();
    return worldModule.world.enemies;
}

/** 스폰된 적들의 몬스터 id 집합 */
const spawnedIds = (enemies) => new Set(enemies.map(e => e.monsterId));

// --- 정의 -------------------------------------------------------------------

test('모든 몬스터가 필요한 값을 갖춘다', () => {
    for (const [id, monster] of Object.entries(M.MONSTERS)) {
        assert.ok(monster.name, `${id}에 이름이 없습니다`);
        assert.ok(monster.hp > 0, `${id}의 체력이 0입니다`);
        assert.ok(monster.speed > 0, `${id}의 속도가 0입니다`);
        assert.ok(monster.size > 0, `${id}의 크기가 0입니다`);
        assert.ok(monster.tier >= 1, `${id}의 tier가 1보다 작습니다`);
        assert.match(monster.color, /^#[0-9a-f]{6}$/i, `${id}의 색이 형식에 맞지 않습니다`);
        assert.ok(monster.spriteKey, `${id}에 스프라이트가 없습니다`);
    }
});

test('행동에 필요한 값이 빠짐없이 채워져 있다', () => {
    const required = {
        ranged: ['projectileSpeed', 'range'],
        exploder: ['fuseMs', 'blastRadius', 'blastDamage'],
        summoner: ['summonId', 'summonCooldown', 'maxSummons'],
        melee: [],
    };

    for (const [id, monster] of Object.entries(M.MONSTERS)) {
        const fields = required[monster.behavior];
        assert.ok(fields, `${id}의 행동 '${monster.behavior}'을 알 수 없습니다`);
        for (const field of fields) {
            assert.ok(monster[field] !== undefined, `${id}(${monster.behavior})에 ${field}가 없습니다`);
        }
        if (monster.behavior === 'summoner') {
            assert.ok(M.MONSTERS[monster.summonId], `${id}가 없는 몬스터 '${monster.summonId}'를 부릅니다`);
        }
    }
});

test('모든 던전의 몬스터 목록이 실재하는 몬스터를 가리킨다', () => {
    const dungeons = [...Object.values(B.BRANCHES), ...Object.values(P.PORTAL_DUNGEONS)];

    for (const dungeon of dungeons) {
        for (const id of dungeon.monsters || []) {
            assert.ok(M.MONSTERS[id], `${dungeon.name}의 목록에 없는 몬스터 '${id}'가 있습니다`);
        }
        if (dungeon.boss) {
            assert.ok(M.MONSTERS[dungeon.boss], `${dungeon.name}의 보스 '${dungeon.boss}'가 없습니다`);
            assert.ok(M.MONSTERS[dungeon.boss].named, `${dungeon.boss}는 보스인데 named 표시가 없습니다`);
        }
    }
});

test('모든 정규 가지가 몬스터 목록을 갖는다', () => {
    for (const branch of Object.values(B.BRANCHES)) {
        assert.ok(branch.monsters?.length > 0, `${branch.name}에 몬스터 목록이 없습니다`);
    }
});

// --- 깊이에 따른 선별 ---------------------------------------------------------

test('깊이에 맞지 않는 몬스터는 뽑히지 않는다', () => {
    const table = M.DEFAULT_SPAWN_TABLE;

    const shallow = M.availableMonsters(table, 2);
    assert.ok(shallow.includes('rat'), '초반에 쥐가 나와야 합니다');
    assert.ok(!shallow.includes('hell_knight'), '2층에 지옥 기사가 나오면 안 됩니다');

    const deep = M.availableMonsters(table, 15);
    assert.ok(deep.includes('hell_knight'), '후반에 지옥 기사가 나와야 합니다');
    assert.ok(!deep.includes('rat'), '15층에 쥐가 나오면 안 됩니다');
});

test('네임드 몬스터는 일반 스폰에 섞이지 않는다', () => {
    // 보스는 지정된 던전의 최하층에만 나와야 합니다.
    const table = [...M.DEFAULT_SPAWN_TABLE, 'minotaur', 'purgy'];
    for (let depth = 1; depth <= 25; depth++) {
        const pool = M.availableMonsters(table, depth);
        assert.ok(!pool.includes('minotaur'), `${depth}층 후보에 미노타우로스가 있습니다`);
        assert.ok(!pool.includes('purgy'), `${depth}층 후보에 퍼기가 있습니다`);
    }
});

test('어느 깊이에서도 뽑을 것이 남는다', () => {
    // 후보가 비면 적이 하나도 안 나와 층이 텅 빕니다.
    for (const dungeon of [...Object.values(B.BRANCHES), ...Object.values(P.PORTAL_DUNGEONS)]) {
        const table = dungeon.monsters || M.DEFAULT_SPAWN_TABLE;
        for (let depth = 1; depth <= 30; depth++) {
            const pool = M.availableMonsters(table, depth);
            assert.ok(pool.length > 0, `${dungeon.name}의 ${depth} 깊이에서 뽑을 몬스터가 없습니다`);
        }
    }
});

// --- 던전별 스폰 --------------------------------------------------------------

test('던전마다 자기 몬스터가 나온다', () => {
    seedRandom(0x1001);
    const lair = spawnedIds(spawnIn('L', 3));
    const mines = spawnedIds(spawnIn('O', 1));

    for (const id of lair) {
        assert.ok(B.BRANCHES.L.monsters.includes(id), `짐승굴에 목록 밖 몬스터 '${id}'가 나왔습니다`);
    }
    for (const id of mines) {
        assert.ok(B.BRANCHES.O.monsters.includes(id), `오크 광산에 목록 밖 몬스터 '${id}'가 나왔습니다`);
    }
});

test('서로 다른 던전은 서로 다른 적 구성을 갖는다', () => {
    // 목록을 나눠둔 이유가 이것입니다. 겹치기만 하면 나눈 의미가 없습니다.
    seedRandom(0x1002);
    const undead = spawnedIds(spawnIn('C', 2));   // 납골당
    const beasts = spawnedIds(spawnIn('L', 3));   // 짐승굴

    const shared = [...undead].filter(id => beasts.has(id));
    assert.equal(shared.length, 0, `언데드 던전과 짐승굴에 같은 적이 나옵니다: ${shared}`);
});

test('보스가 지정된 포탈은 최하층에 보스를 한 마리 배치한다', () => {
    seedRandom(0x1003);
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.branch = 'gauntlet';
    worldModule.world.floor = 1;                 // 건틀릿은 단층이므로 1층이 곧 최하층
    worldModule.world.portalDangerLevel = 12;

    const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT);
    worldModule.world.map = dungeon.map;
    worldModule.world.objectMap = dungeon.objectMap;
    gameLogic.spawnEnemiesForFloor();

    const bosses = worldModule.world.enemies.filter(e => e.monsterId === 'minotaur');
    assert.equal(bosses.length, 1, `미노타우로스가 ${bosses.length}마리 나왔습니다`);
    assert.ok(bosses[0].hp > 200, '보스의 체력이 충분히 높아야 합니다');
});

// --- 행동 --------------------------------------------------------------------

test('자폭병은 다가가면 점화하고 터지며 사라진다', () => {
    seedRandom(0x2001);
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.player.x = 10 * C.TILE_SIZE;
    worldModule.world.player.y = 10 * C.TILE_SIZE;

    // 플레이어 바로 옆에 세워 둡니다.
    const slime = gameLogic.spawnMonster('slime', {
        x: worldModule.world.player.x + 10,
        y: worldModule.world.player.y,
    });
    const hpBefore = worldModule.world.player.hp;

    gameLogic.update(C.SIMULATION_STEP_MS);
    assert.ok(slime.fuseStartedAt !== null, '가까이 있는데 점화되지 않았습니다');
    assert.equal(worldModule.world.player.hp, hpBefore, '점화 즉시 터지면 피할 방법이 없습니다');

    // 도화선이 다 탈 때까지 진행
    for (let i = 0; i < 60; i++) gameLogic.update(C.SIMULATION_STEP_MS);

    assert.ok(worldModule.world.player.hp < hpBefore, '폭발 피해가 들어가지 않았습니다');
    assert.ok(!worldModule.world.enemies.includes(slime), '터진 자폭병이 남아 있습니다');
});

test('소환사는 하수인을 부르되 한도를 넘지 않는다', () => {
    seedRandom(0x2002);
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.player.x = 10 * C.TILE_SIZE;
    worldModule.world.player.y = 10 * C.TILE_SIZE;

    const summoner = gameLogic.spawnMonster('menkaure', {
        x: worldModule.world.player.x + C.TILE_SIZE * 3,
        y: worldModule.world.player.y,
    });
    summoner.speed = 0; // 제자리에 두고 소환만 관찰합니다

    // 소환 쿨다운을 여러 번 넘길 만큼 진행
    const steps = Math.ceil((summoner.summonCooldown * (summoner.maxSummons + 3)) / C.SIMULATION_STEP_MS);
    for (let i = 0; i < steps; i++) gameLogic.update(C.SIMULATION_STEP_MS);

    const minions = worldModule.world.enemies.filter(e => e.monsterId === summoner.summonId);
    assert.ok(minions.length > 0, '하수인을 한 마리도 부르지 않았습니다');
    assert.ok(minions.length <= summoner.maxSummons,
        `한도 ${summoner.maxSummons}를 넘어 ${minions.length}마리를 불렀습니다`);
});

test('던전의 몬스터 구성이 한 종류로 쏠리지 않는다', () => {
    // tier 하한을 절대 깊이로 잡으면, 깊은 곳에 있는 가지의 고유 몬스터가 전부 걸러지고
    // 가장 강한 하나만 남습니다. 짐승굴이 히드라로만 채워졌던 것이 그 경우입니다.
    const cases = [
        ['L', 3], ['C', 2], ['O', 1], ['S', 2], ['X', 4], ['V', 3],
    ];

    for (const [branchId, floor] of cases) {
        const branch = B.BRANCHES[branchId];
        const danger = B.absoluteDepth(branchId, floor);
        const pool = M.availableMonsters(branch.monsters, danger);

        assert.ok(pool.length >= 2,
            `${branch.name} ${floor}층(깊이 ${danger})의 후보가 ${pool.length}종뿐입니다: ${pool}`);
    }
});

test('적 수에 상한이 있다', () => {
    // 서브 던전은 누적 깊이가 25를 넘어, 상한이 없으면 맵이 적으로 들어찹니다.
    seedRandom(0x3001);
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.branch = 'Z';   // 조트의 왕국. 가장 깊은 축입니다.
    worldModule.world.floor = 5;

    const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT);
    worldModule.world.map = dungeon.map;
    worldModule.world.objectMap = dungeon.objectMap;
    gameLogic.spawnEnemiesForFloor();

    assert.ok(A.currentDangerLevel() > 20, '이 테스트는 아주 깊은 곳을 전제로 합니다');
    assert.ok(worldModule.world.enemies.length <= C.MAX_ENEMIES_PER_FLOOR,
        `적이 ${worldModule.world.enemies.length}마리로 상한을 넘었습니다`);
});

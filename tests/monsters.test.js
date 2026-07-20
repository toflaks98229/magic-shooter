/**
 * @fileoverview DCSS 몬스터가 게임에 옳게 연결되었는지 확인합니다.
 *
 * 여기서 보는 것은 '데이터가 들어왔는가'가 아니라 '게임이 쓰는 형태로 옮겨졌는가'입니다.
 * 데이터 자체는 dcss-monsters.test.js 가 봅니다.
 *
 * 예전에는 tier 라는 자체 값으로 어느 깊이에 무엇이 나올지 정했습니다.
 * 이제 DCSS 의 출현표를 그대로 쓰므로, 같은 깊이에서 같은 것들이 같은 빈도로 나와야 합니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom, seedRandom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const M = await import('../Script/monsters.js');
const T = await import('../Script/dcss/time.js');
const worldModule = await import('../Script/world.js');
const { resetWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const A = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');

bindStubDom(dom);

/** 빈 방을 깔고 플레이어를 세웁니다. */
function emptyRoom() {
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.player.x = 10 * C.TILE_SIZE;
    worldModule.world.player.y = 10 * C.TILE_SIZE;
    return worldModule.world;
}

/** 지정한 가지와 층으로 세계를 세우고 적을 스폰합니다. */
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

// --- 환산 --------------------------------------------------------------------

test('모든 몬스터가 게임이 쓰는 값을 갖춘다', () => {
    for (const m of Object.values(M.MONSTERS)) {
        assert.ok(typeof m.speed === 'number' && m.speed >= 0, `${m.id}: speed`);
        assert.ok(Number.isFinite(m.cooldown), `${m.id}: cooldown 이 유한하지 않습니다`);
        assert.ok(typeof m.size === 'number' && m.size > 0, `${m.id}: size`);
        assert.ok(typeof m.color === 'string' && m.color.startsWith('#'), `${m.id}: color`);
        assert.ok(typeof m.ac === 'number' && typeof m.ev === 'number', `${m.id}: ac/ev`);
    }
});

test('세이브를 깨뜨릴 값이 섞이지 않는다', () => {
    // world 는 JSON 으로 저장됩니다. JSON.stringify(Infinity) 는 null 이 되어,
    // 세이브를 불러오는 순간 쿨다운 비교가 통째로 무너집니다.
    // 움직이지 않는 몬스터에 Infinity 를 담았다가 실제로 이 문제를 만들 뻔했습니다.
    for (const m of Object.values(M.MONSTERS)) {
        const restored = JSON.parse(JSON.stringify(m));
        for (const [key, value] of Object.entries(m)) {
            if (typeof value !== 'number') continue;
            assert.equal(restored[key], value,
                `${m.id}의 ${key}(${value})가 저장을 거치며 ${restored[key]} 가 됩니다`);
        }
    }
});

test('DCSS 속도가 실시간 단위로 환산된다', () => {
    // speed 10 은 0.5초에 한 칸입니다. 기준 프레임(16.67ms)으로는 약 1.07픽셀입니다.
    const rat = M.MONSTERS.rat;
    assert.equal(rat.dcssSpeed, 10);
    assert.ok(Math.abs(rat.speed - 1.067) < 0.01, `쥐의 속도가 ${rat.speed.toFixed(3)} 입니다`);
    assert.equal(rat.cooldown, T.monsterActionMs(10));

    // 빠른 몬스터는 그만큼 빨라야 합니다. 이 비율이 DCSS 밸런스 그 자체입니다.
    const fast = Object.values(M.MONSTERS).find(m => m.dcssSpeed === 20);
    assert.ok(Math.abs(fast.speed / rat.speed - 2) < 1e-9, 'speed 20 은 두 배여야 합니다');
});

test('움직이지 않는 몬스터는 행동하지 않는 것으로 표시된다', () => {
    // 식물·조형물은 speed 0 입니다. DCSS 는 이들에게 에너지를 주지 않아 아예 행동하지 않습니다.
    const plant = M.MONSTERS.plant;
    assert.equal(plant.canAct, false);
    assert.equal(plant.speed, 0);
    assert.ok(Object.values(M.MONSTERS).filter(m => !m.canAct).length > 10);
});

test('분류용 자리표시자는 스폰 대상이 아니다', () => {
    // DCSS 에는 bear·dragon·snake 처럼 HD 도 공격도 0 인 항목이 섞여 있습니다.
    // 실제 몬스터가 아니라 다형변신이나 무작위 하위 종류를 고를 때 쓰는 이름이라,
    // 그대로 스폰하면 HP 0 으로 태어나 즉사합니다.
    for (const id of ['bear', 'dragon', 'snake', 'spider', 'giant']) {
        assert.equal(M.MONSTERS[id].spawnable, false, `${id} 가 스폰 대상으로 잡혀 있습니다`);
    }
    assert.equal(M.MONSTERS.rat.spawnable, true);

    for (const m of Object.values(M.MONSTERS)) {
        if (!m.spawnable) continue;
        assert.ok(m.hp10x > 0, `${m.id}: hp10x 가 0 인데 스폰 대상입니다`);
        assert.ok(m.damage > 0, `${m.id}: 공격이 없는데 스폰 대상입니다`);
    }
});

// --- 출현 --------------------------------------------------------------------

test('가지마다 자기 출현표를 쓴다', () => {
    assert.notDeepEqual(M.spawnTableFor('D'), M.spawnTableFor('L'));
    assert.ok(M.spawnTableFor('D').length > 0);
});

test('표가 없는 가지는 메인 던전 표로 물러선다', () => {
    // 포탈 던전은 DCSS 에 대응하는 표가 없습니다. 깊이는 호출부가 위험도로 넘기므로
    // 난이도는 맞고, 나오는 종류만 메인 던전을 따릅니다.
    assert.deepEqual(M.spawnTableFor('sewer'), M.spawnTableFor('D'));
});

test('1층에서는 약한 것만 나온다', () => {
    seedRandom(0x51A11);
    const seen = new Set();
    for (let i = 0; i < 400; i++) {
        const id = M.rollMonsterFor('D', 1);
        if (id) seen.add(id);
    }

    assert.ok(seen.size > 3, `1층 후보가 ${seen.size}종뿐입니다`);
    assert.ok(seen.has('rat') || seen.has('bat') || seen.has('jackal'), '1층에 잡몹이 없습니다');
    for (const tough of ['orc-warrior', 'fire-dragon', 'stone-giant']) {
        assert.ok(!seen.has(tough), `1층에 ${tough} 가 나옵니다`);
    }
});

test('깊어질수록 강한 것이 나온다', () => {
    seedRandom(0xDEE9);
    const avgHd = (depth) => {
        let total = 0, count = 0;
        for (let i = 0; i < 300; i++) {
            const id = M.rollMonsterFor('D', depth);
            if (!id) continue;
            total += M.MONSTERS[id].hd;
            count++;
        }
        return total / count;
    };
    const shallow = avgHd(2), deep = avgHd(14);
    assert.ok(deep > shallow * 1.5, `2층 평균 HD ${shallow.toFixed(1)}, 14층 ${deep.toFixed(1)}`);
});

test('뽑힌 몬스터는 반드시 실재한다', () => {
    // 자리표시자나 정의 없는 항목이 새어 나오면 스폰에서 터집니다.
    seedRandom(0xA11);
    for (const branch of ['D', 'L', 'O', 'V', 'P']) {
        for (let depth = 1; depth <= 10; depth++) {
            for (let i = 0; i < 20; i++) {
                const id = M.rollMonsterFor(branch, depth);
                if (id === null) continue;
                assert.ok(M.MONSTERS[id], `${branch}:${depth} 에서 없는 몬스터 ${id} 가 나왔습니다`);
                assert.ok(M.MONSTERS[id].spawnable,
                    `${branch}:${depth} 에서 자리표시자 ${id} 가 나왔습니다`);
            }
        }
    }
});

test('던전마다 다른 것이 나온다', () => {
    seedRandom(0xB2A11);
    const sample = (branch) => {
        const seen = new Set();
        for (let i = 0; i < 300; i++) {
            const id = M.rollMonsterFor(branch, 5);
            if (id) seen.add(id);
        }
        return seen;
    };
    const dungeon = sample('D'), lair = sample('L');
    const shared = [...dungeon].filter(id => lair.has(id)).length;
    assert.ok(shared < Math.min(dungeon.size, lair.size),
        '메인 던전과 짐승굴이 완전히 같은 몬스터를 냅니다');
});

// --- 스폰 --------------------------------------------------------------------

test('스폰한 적이 굴린 체력을 갖는다', () => {
    // HP 는 정의된 값이 아니라 스폰할 때 굴립니다.
    // hp_10x 는 평균 HP 의 열 배라 같은 몬스터라도 개체마다 다릅니다.
    seedRandom(0x4444);
    emptyRoom();

    const rolled = new Set();
    for (let i = 0; i < 40; i++) {
        const enemy = gameLogic.spawnMonster('rat', { x: 100, y: 100 });
        assert.ok(enemy.maxHp > 0, '체력이 0 인 적이 태어났습니다');
        assert.equal(enemy.hp, enemy.maxHp, 'hp 와 maxHp 가 어긋납니다');
        rolled.add(enemy.maxHp);
    }
    assert.ok(rolled.size > 1, '체력이 매번 같습니다. 굴리지 않고 있습니다');
});

test('층을 채우면 적이 실제로 생긴다', () => {
    seedRandom(0x5555);
    const enemies = spawnIn('D', 3);
    assert.ok(enemies.length > 0, '적이 하나도 스폰되지 않았습니다');
    for (const e of enemies) {
        assert.ok(e.hp > 0, `${e.monsterId}: 체력 0 으로 태어났습니다`);
        assert.ok(e.size > 0 && Number.isFinite(e.cooldown), `${e.monsterId}: 값이 온전하지 않습니다`);
    }
});

test('깊은 층은 얕은 층보다 적이 많다', () => {
    seedRandom(0x6666);
    assert.ok(spawnIn('D', 12).length > spawnIn('D', 1).length);
});

test('한 층의 구성이 한 종류로 쏠리지 않는다', () => {
    seedRandom(0x7777);
    const enemies = spawnIn('D', 8);
    const kinds = new Set(enemies.map(e => e.monsterId));
    assert.ok(kinds.size > 1, `${enemies.length}마리가 전부 같은 종류입니다`);
});

test('적 수에 상한이 있다', () => {
    // 서브 던전은 누적 깊이가 25를 넘어, 상한이 없으면 맵이 적으로 들어찹니다.
    seedRandom(0x3001);
    const enemies = spawnIn('Z', 5);   // 조트의 왕국. 가장 깊은 축입니다.
    assert.ok(A.currentDangerLevel() > 20, '이 테스트는 아주 깊은 곳을 전제로 합니다');
    assert.ok(enemies.length <= C.MAX_ENEMIES_PER_FLOOR + 1,
        `${enemies.length}마리가 나왔습니다`);
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
    assert.ok(bosses[0].hp > 20, '보스의 체력이 충분히 높아야 합니다');
});

// --- 행동 --------------------------------------------------------------------

test('자폭병은 다가가면 점화하고 터지며 사라진다', () => {
    seedRandom(0x2001);
    const world = emptyRoom();

    // 플레이어 바로 옆에 세워 둡니다.
    const bomb = gameLogic.spawnMonster('ballistomycete-spore', {
        x: world.player.x + 10,
        y: world.player.y,
    });
    const hpBefore = world.player.hp;

    gameLogic.update(C.SIMULATION_STEP_MS);
    assert.ok(bomb.fuseStartedAt !== null, '가까이 있는데 점화되지 않았습니다');
    assert.equal(world.player.hp, hpBefore, '점화 즉시 터지면 피할 방법이 없습니다');

    // 도화선이 다 탈 때까지 진행
    for (let i = 0; i < 80; i++) gameLogic.update(C.SIMULATION_STEP_MS);

    assert.ok(world.player.hp < hpBefore, '폭발 피해가 들어가지 않았습니다');
    assert.ok(!world.enemies.includes(bomb), '터진 자폭병이 남아 있습니다');
});

test('소환사는 하수인을 부르되 한도를 넘지 않는다', () => {
    seedRandom(0x2002);
    const world = emptyRoom();

    const summoner = gameLogic.spawnMonster('menkaure', {
        x: world.player.x + C.TILE_SIZE * 3,
        y: world.player.y,
    });
    summoner.speed = 0; // 제자리에 두고 소환만 관찰합니다

    const steps = Math.ceil((summoner.summonCooldown * (summoner.maxSummons + 3)) / C.SIMULATION_STEP_MS);
    for (let i = 0; i < steps; i++) gameLogic.update(C.SIMULATION_STEP_MS);

    const minions = world.enemies.filter(e => e.monsterId === summoner.summonId);
    assert.ok(minions.length > 0, '하수인을 한 마리도 부르지 않았습니다');
    assert.ok(minions.length <= summoner.maxSummons,
        `한도 ${summoner.maxSummons}를 넘어 ${minions.length}마리를 불렀습니다`);
});

// --- 원본이 명시한 규칙 ---------------------------------------------------------

test('원본이 배치를 막아 둔 몬스터는 나오지 않는다', () => {
    // cant_spawn 은 내부용이라는 표시입니다. (mon-place.cc:908)
    // 수치가 멀쩡해 보여도 나오면 안 되며, HP 0 인 자리표시자와는 다른 축입니다.
    const blocked = Object.values(M.MONSTERS).filter(m => m.spawnable === false);
    assert.ok(blocked.length > 50, '걸러진 몬스터가 너무 적습니다');

    seedRandom(0xC5);
    for (let i = 0; i < 3000; i++) {
        const id = M.rollMonsterFor('D', 1 + (i % 15));
        if (id) assert.ok(M.MONSTERS[id].spawnable, `${id} 는 나오면 안 됩니다`);
    }
});

test('제자리 몬스터는 속도와 무관하게 움직이지 않는다', () => {
    // stationary 는 speed 와 별개의 축입니다. 속도가 있어도 제자리에서만 싸웁니다.
    // 이것을 놓치면 나무가 플레이어를 쫓아옵니다. (mon-util.cc:628)
    const stationary = Object.values(M.MONSTERS).filter(m => m.stationary);
    assert.ok(stationary.length > 20, `제자리 몬스터가 ${stationary.length}종뿐입니다`);
    for (const m of stationary) {
        assert.equal(m.canAct, false, `${m.id} 가 제자리인데 행동 가능합니다`);
    }
});

test('언데드와 무생물이 계열에서 오는 저항을 갖는다', () => {
    // YAML 은 이 저항을 일부러 적지 않습니다. 계열에서 따라오기 때문입니다.
    // 옮기지 않으면 언데드가 독에 멀쩡히 당하는 게임이 됩니다.
    // (mon-util.cc:270 _apply_holiness_resists)
    const zombie = M.MONSTERS.zombie;
    assert.deepEqual(zombie.holiness, ['undead']);
    assert.equal(zombie.resists.poison, 3, '언데드가 독 저항이 없습니다');
    assert.equal(zombie.resists.neg, 3, '언데드가 음에너지 저항이 없습니다');
    assert.equal(zombie.resists.torment, 1, '언데드가 고문 저항이 없습니다');

    // 자연물은 그 어느 것도 공짜로 받지 않습니다.
    const rat = M.MONSTERS.rat;
    assert.deepEqual(rat.holiness, ['natural']);
    assert.equal(rat.resists.poison, undefined);
    assert.equal(rat.resists.neg, undefined);
});

test('계열이 빠짐없이 채워져 있다', () => {
    // 원본은 자연물일 때 생략합니다. null 로 남기면 판정이 통째로 빗나갑니다.
    for (const m of Object.values(M.MONSTERS)) {
        assert.ok(Array.isArray(m.holiness) && m.holiness.length > 0, `${m.id}: 계열이 비었습니다`);
    }
});

test('경험치를 주지 않는 몬스터가 실제로 있다', () => {
    // no_exp_gain 이 붙으면 0 입니다. (mon-util.cc:659)
    // 소환물과 분신이 여기 해당하며, 그대로 두면 무한 경험치가 됩니다.
    const free = Object.values(M.MONSTERS).filter(m => m.exp === 0);
    assert.ok(free.length > 20, `경험치 0 인 몬스터가 ${free.length}종뿐입니다`);
    assert.ok(M.MONSTERS.rat.exp > 0, '쥐는 경험치를 주어야 합니다');
});

// --- 그림과 스폰 깊이 -----------------------------------------------------------

test('스폰되는 모든 몬스터에 그림이 있다', () => {
    // 아틀라스의 적 그림은 마흔세 개뿐인데 몬스터는 오백쉰다섯 종입니다.
    // 이름으로만 짝지으면 대부분이 빈손으로 남아, 실제로 D:1 에 나오는 열두 종 중
    // 아홉 종이 플레이스홀더로 나오고 있었습니다.
    // 글리프 문자가 곧 분류이므로 그것으로 덮습니다.
    const missing = Object.values(M.MONSTERS)
        .filter(m => m.spawnable && !m.spriteKey);
    assert.deepEqual(missing.map(m => `${m.id}(${m.glyph})`), [],
        '그림 없이 나오는 몬스터가 있습니다');
});

test('1층에 나오는 것이 전부 알아볼 수 있다', () => {
    seedRandom(0x5717E);
    const seen = new Set();
    for (let i = 0; i < 2000; i++) {
        const id = M.rollMonsterFor('D', 1);
        if (id) seen.add(id);
    }
    for (const id of seen) {
        assert.ok(M.MONSTERS[id].spriteKey, `${id} 가 그림 없이 나옵니다`);
    }
});

test('출현표는 가지 안에서의 깊이로 색인한다', () => {
    // 절대 깊이를 넘기면 후보가 하나도 없어 그 던전이 텅 빕니다.
    // 오크 광산의 표는 1~4 밖에 없는데 절대 깊이는 12 부터라,
    // 실제로 오크 광산·뱀굴·엘프 회관에 적이 하나도 나오지 않았습니다.
    seedRandom(0xDEE7);
    for (const branch of ['O', 'P', 'E', 'L', 'V']) {
        let found = 0;
        for (let i = 0; i < 100; i++) if (M.rollMonsterFor(branch, 1)) found++;
        assert.ok(found > 90, `${branch} 1층에서 ${found}/100 만 뽑혔습니다`);
    }
});

test('가지의 1층에 실제로 적이 스폰된다', () => {
    // 위 검사는 뽑기만 봅니다. 게임을 실제로 굴려 층이 채워지는지도 봅니다.
    seedRandom(0xB2A);
    for (const branch of ['O', 'P', 'E']) {
        const enemies = spawnIn(branch, 1);
        assert.ok(enemies.length > 0, `${branch} 1층이 비었습니다`);
    }
});

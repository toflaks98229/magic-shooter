/**
 * @fileoverview 던전 가지와 서브 던전 스택 검증.
 *
 * 서브 던전의 핵심 약속은 하나입니다.
 * "들어갔다 나오면 떠날 때 그 자리, 그 지형, 그 적들이 그대로 있어야 한다.
 *  단, 내가 겪은 일(체력, 탄약, 룬)은 따라와야 한다."
 *
 * 이것이 성립하지 않으면 서브 던전은 그냥 다른 층일 뿐입니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom, seedRandom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const B = await import('../Script/branches.js');
// world는 enterBranch/returnToParent가 교체하므로 네임스페이스로 접근해야 합니다.
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
    gameLogic.spawnEnemiesForFloor();
}

/** 지형과 적 배치를 하나의 값으로 요약합니다. 복원 여부를 비교하는 데 씁니다. */
function fingerprint() {
    const world = worldModule.world;
    const mapSum = world.map.flat().reduce((a, v, i) => (a + v * (i + 1)) % 2147483647, 0);
    const enemySum = world.enemies.reduce((a, e) => a + e.x + e.y + e.hp, 0);
    return `${mapSum}|${enemySum.toFixed(4)}|${world.enemies.length}`;
}

// --- 가지 정의 -------------------------------------------------------------

test('모든 가지의 상위 가지가 실제로 존재한다', () => {
    for (const branch of Object.values(B.BRANCHES)) {
        if (branch.parent === null) continue;
        assert.ok(B.BRANCHES[branch.parent], `${branch.name}의 상위 가지 '${branch.parent}'가 없습니다`);
    }
});

test('가지 그래프에 순환이 없고 모두 메인 던전으로 이어진다', () => {
    for (const branch of Object.values(B.BRANCHES)) {
        const seen = new Set();
        let current = branch;
        while (current.parent) {
            assert.ok(!seen.has(current.id), `${branch.name}에서 시작한 경로가 순환합니다`);
            seen.add(current.id);
            current = B.BRANCHES[current.parent];
        }
        assert.equal(current.id, B.STARTING_BRANCH, `${branch.name}이 메인 던전으로 이어지지 않습니다`);
    }
});

test('입구 층 범위가 상위 가지의 층수 안에 들어온다', () => {
    for (const branch of Object.values(B.BRANCHES)) {
        if (!branch.parent) continue;
        const parent = B.BRANCHES[branch.parent];
        assert.ok(branch.entryFrom >= 1, `${branch.name}의 입구 시작 층이 1보다 작습니다`);
        assert.ok(branch.entryFrom <= branch.entryTo, `${branch.name}의 입구 범위가 뒤집혀 있습니다`);
        assert.ok(branch.entryTo <= parent.depth,
            `${branch.name}의 입구가 ${parent.name}(${parent.depth}층) 밖인 ${branch.entryTo}층에 있습니다`);
    }
});

test('누적 깊이가 가지를 내려갈수록 커진다', () => {
    // 짐승굴 1층은 메인 1층보다 훨씬 깊은 곳입니다. 적 스폰 수가 여기에 걸려 있습니다.
    assert.ok(B.absoluteDepth('L', 1) > B.absoluteDepth('D', 5));
    // 늪지(짐승굴의 하위)는 짐승굴보다 더 깊습니다.
    assert.ok(B.absoluteDepth('S', 1) > B.absoluteDepth('L', 1));
    // 고대의 무덤은 가장 깊은 축에 듭니다.
    assert.ok(B.absoluteDepth('W', 3) > B.absoluteDepth('L', 5));
});

test('배치된 입구는 모두 정해진 층 범위 안에 놓인다', () => {
    seedRandom(0x1111);
    resetWorld();
    A.rollBranchEntrances();

    for (const [branchId, floor] of Object.entries(worldModule.world.branchEntrances)) {
        const branch = B.BRANCHES[branchId];
        assert.ok(branch, `알 수 없는 가지 '${branchId}'에 입구가 배치되었습니다`);
        assert.ok(floor >= branch.entryFrom && floor <= branch.entryTo,
            `${branch.name}의 입구가 범위(${branch.entryFrom}~${branch.entryTo}) 밖인 ${floor}층에 배치되었습니다`);
    }
});

test('배타 그룹이 아닌 가지는 반드시 입구가 생긴다', () => {
    // 배타 그룹에 속하지 않은 가지는 한 판에 무조건 갈 수 있어야 합니다.
    // 그렇지 않으면 조트의 왕국처럼 진행에 필요한 곳에 도달할 수 없게 됩니다.
    seedRandom(0x1212);
    resetWorld();
    A.rollBranchEntrances();

    for (const branch of Object.values(B.BRANCHES)) {
        if (!branch.parent || branch.exclusiveGroup) continue;
        assert.ok(branch.id in worldModule.world.branchEntrances,
            `${branch.name}의 입구가 배치되지 않았습니다`);
    }
});

// --- 서브 던전 스택 ---------------------------------------------------------

test('서브 던전에 들어갔다 나오면 떠날 때 그대로 복원된다', () => {
    seedRandom(0x2222);
    resetWorld();
    A.rollBranchEntrances();
    A.setGameRunning(true);
    worldModule.world.floor = 9;
    buildFloor();

    const before = {
        fingerprint: fingerprint(),
        branch: worldModule.world.branch,
        floor: worldModule.world.floor,
        x: worldModule.world.player.x,
    };

    // 짐승굴로 진입
    assert.equal(A.enterBranch('L'), true);
    assert.equal(worldModule.world.branch, 'L');
    assert.equal(worldModule.world.floor, 1);
    assert.equal(worldModule.world.parentStack.length, 1);

    buildFloor();
    assert.notEqual(fingerprint(), before.fingerprint, '서브 던전은 별개의 지형이어야 합니다');

    // 서브 던전에서 다치고 룬을 얻는다
    A.damagePlayer(30);
    A.collectRune('L');
    const hpInBranch = worldModule.world.player.hp;

    // 복귀
    assert.equal(A.returnToParent(), true);
    assert.equal(worldModule.world.branch, before.branch);
    assert.equal(worldModule.world.floor, before.floor);
    assert.equal(worldModule.world.parentStack.length, 0);

    assert.equal(fingerprint(), before.fingerprint, '지형과 적이 떠날 때 그대로여야 합니다');
    assert.equal(worldModule.world.player.x, before.x, '플레이어는 들어갔던 자리로 돌아와야 합니다');

    // 겪은 일은 따라온다
    assert.equal(worldModule.world.player.hp, hpInBranch, '서브 던전에서 입은 피해는 유지되어야 합니다');
    assert.deepEqual(worldModule.world.runes, ['L'], '획득한 룬은 유지되어야 합니다');
});

test('여러 단계로 중첩해 들어가고 역순으로 빠져나온다', () => {
    seedRandom(0x3333);
    resetWorld();
    A.rollBranchEntrances();
    A.setGameRunning(true);
    buildFloor();

    const marks = [];

    // 메인 → 짐승굴 → 늪지
    for (const branchId of ['L', 'S']) {
        marks.push({ branch: worldModule.world.branch, fingerprint: fingerprint() });
        A.enterBranch(branchId);
        buildFloor();
    }

    assert.equal(worldModule.world.branch, 'S');
    assert.equal(worldModule.world.parentStack.length, 2, '두 단계 깊이여야 합니다');

    // 역순으로 복귀
    for (const mark of marks.reverse()) {
        assert.equal(A.returnToParent(), true);
        assert.equal(worldModule.world.branch, mark.branch);
        assert.equal(fingerprint(), mark.fingerprint, `${mark.branch}가 그대로 복원되어야 합니다`);
    }

    assert.equal(worldModule.world.parentStack.length, 0);
    assert.equal(A.returnToParent(), false, '최상위에서는 더 나갈 곳이 없습니다');
});

test('스택은 중첩되지 않고 평평하게 쌓인다', () => {
    // 상위 월드를 통째로 중첩해 넣으면 깊이가 깊어질수록 같은 데이터가 반복 직렬화됩니다.
    seedRandom(0x4444);
    resetWorld();
    A.setGameRunning(true);
    buildFloor();

    A.enterBranch('L');
    buildFloor();
    A.enterBranch('S');

    for (const saved of worldModule.world.parentStack) {
        assert.ok(!('parentStack' in saved), '스택에 보관된 월드가 자기 스택을 또 갖고 있습니다');
    }
});

test('서브 던전 안에서 저장하고 불러와도 스택이 살아남는다', () => {
    seedRandom(0x5555);
    resetWorld();
    A.rollBranchEntrances();
    A.setGameRunning(true);
    worldModule.world.floor = 9;
    buildFloor();

    const mainFingerprint = fingerprint();
    A.enterBranch('L');
    buildFloor();

    const saved = serializeWorld();
    const branchFingerprint = fingerprint();

    // 전혀 다른 상태로 만들었다가 불러오기
    resetWorld();
    buildFloor();
    assert.notEqual(fingerprint(), branchFingerprint);

    deserializeWorld(saved);
    assert.equal(worldModule.world.branch, 'L');
    assert.equal(fingerprint(), branchFingerprint, '서브 던전 자체가 복원되어야 합니다');
    assert.equal(worldModule.world.parentStack.length, 1, '돌아갈 길도 함께 저장되어야 합니다');

    // 불러온 뒤에도 정상적으로 빠져나올 수 있어야 합니다.
    assert.equal(A.returnToParent(), true);
    assert.equal(worldModule.world.branch, 'D');
    assert.equal(fingerprint(), mainFingerprint, '불러온 세이브에서도 상위 던전이 그대로여야 합니다');
});

test('적 스폰 수가 가지 깊이를 반영한다', () => {
    seedRandom(0x6666);

    resetWorld();
    A.setGameRunning(true);
    worldModule.world.floor = 1;
    buildFloor();
    const mainCount = worldModule.world.enemies.length;

    resetWorld();
    A.setGameRunning(true);
    worldModule.world.branch = 'L';
    worldModule.world.floor = 1;
    buildFloor();
    const lairCount = worldModule.world.enemies.length;

    assert.ok(lairCount > mainCount,
        `짐승굴 1층(${lairCount}마리)이 메인 1층(${mainCount}마리)보다 위험해야 합니다`);
});

test('배타 그룹의 가지는 한 판에 하나만 생성된다', () => {
    // DCSS 규칙: 늪지와 해안 중 하나, 뱀굴과 거미 둥지 중 하나만 나옵니다.
    // 넷 다 나오면 룬을 지나치게 쉽게 모으게 됩니다.
    for (let attempt = 0; attempt < 50; attempt++) {
        seedRandom(0x9000 + attempt);
        resetWorld();
        A.rollBranchEntrances();

        const placed = worldModule.world.branchEntrances;
        const wet = ['S', 'A'].filter(id => id in placed);
        const crawl = ['P', 'N'].filter(id => id in placed);

        assert.equal(wet.length, 1, `늪지/해안이 ${wet.length}개 생성되었습니다: ${wet}`);
        assert.equal(crawl.length, 1, `뱀굴/거미 둥지가 ${crawl.length}개 생성되었습니다: ${crawl}`);
    }
});

test('배타 그룹에서 양쪽 모두 선택될 수 있다', () => {
    // 항상 같은 쪽만 나오면 그룹 규칙이 의미가 없습니다.
    const seen = new Set();
    for (let attempt = 0; attempt < 60; attempt++) {
        seedRandom(0xA000 + attempt);
        resetWorld();
        A.rollBranchEntrances();
        seen.add(['S', 'A'].find(id => id in worldModule.world.branchEntrances));
    }
    assert.deepEqual([...seen].sort(), ['A', 'S'], '늪지와 해안이 모두 등장할 수 있어야 합니다');
});

// --- 알 수 없는 식별자 --------------------------------------------------------

test('알 수 없는 식별자는 메인 던전으로 대신하되 조용히 넘어가지 않는다', () => {
    // 폴백 자체는 일부러 둔 것입니다. 옛 세이브에 사라진 가지 이름이 들어 있을 때
    // 예외를 던지면 판을 통째로 잃기 때문입니다.
    //
    // 다만 조용하면 안 됩니다. 가지 id 는 'L' 같은 한 글자라 'lair' 처럼 적기 쉬운데,
    // 그러면 아무 일도 없었다는 듯 시작 던전이 돌아와 원인을 찾기 어렵습니다.
    // (이 저장소에서 실제로 두 번 걸렸습니다.)
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (...args) => warnings.push(args.join(' '));

    try {
        const branch = B.getBranch('lair'); // 'L' 이 맞습니다
        assert.equal(branch.id, B.STARTING_BRANCH, '메인 던전으로 대신해야 합니다');
        assert.equal(warnings.length, 1, '경고가 나오지 않았습니다');
        assert.ok(warnings[0].includes('lair'), `무엇이 잘못됐는지 담아야 합니다: ${warnings[0]}`);

        // 같은 식별자로 계속 부르면 콘솔이 묻힙니다. HUD 갱신 경로에서도 불리기 때문입니다.
        B.getBranch('lair');
        B.getBranch('lair');
        assert.equal(warnings.length, 1, '같은 식별자로 반복해서 경고했습니다');
    } finally {
        console.warn = originalWarn;
    }
});

test('제대로 된 식별자는 경고 없이 찾는다', () => {
    const warnings = [];
    const originalWarn = console.warn;
    console.warn = (...args) => warnings.push(args.join(' '));

    try {
        assert.equal(B.getBranch('L').id, 'L', '짐승굴을 찾지 못했습니다');
        assert.equal(B.getBranch('D').id, 'D', '메인 던전을 찾지 못했습니다');
        assert.equal(B.getBranch('sewer').id, 'sewer', '포탈 던전도 같은 조회로 찾아야 합니다');
        assert.deepEqual(warnings, [], '멀쩡한 식별자에 경고가 나왔습니다');
    } finally {
        console.warn = originalWarn;
    }
});

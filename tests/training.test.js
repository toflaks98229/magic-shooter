/**
 * @fileoverview 스킬이 실제로 자라는지 확인합니다.
 *
 * DCSS 는 '쓰는 것이 는다'는 원칙을 씁니다. 경험치를 어디에 넣을지 고르는 것이 아니라,
 * 무엇을 하고 있었는지가 배분을 정합니다. 그래서 여기서 보는 것은
 * '경험치가 들어왔는가'가 아니라 '내가 쓴 것이 늘었는가'입니다.
 *
 * 배선이 끊기면 조용히 실패합니다. 적을 죽여도 스킬이 오르지 않고,
 * 명중률도 영영 그대로인데 예외는 나지 않습니다. 그래서 게임을 실제로 굴려 봅니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom, seedRandom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const T = await import('../Script/dcss/training.js');
const S = await import('../Script/dcss/skills.js');
const worldModule = await import('../Script/world.js');
const { resetWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const A = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');
const { applyCharacter, aptitudeFor } = await import('../Script/character.js');
const { aimRadius } = await import('../Script/dcss/combat.js');

bindStubDom(dom);

/** 적성 0 으로 보는 단순한 조회기 */
const flatAptitude = () => 0;

// --- 훈련 큐 -----------------------------------------------------------------

test('최근에 한 것만 배분에 영향을 준다', () => {
    // 큐가 무한하면 무기를 바꿔도 옛 스킬이 계속 오릅니다.
    const state = T.createSkillState();
    for (let i = 0; i < T.EXERCISE_QUEUE_SIZE * 2; i++) T.exercise(state, 'axes');
    assert.equal(state.recent.length, T.EXERCISE_QUEUE_SIZE);

    // 이제 다른 무기로 바꿉니다. 큐가 가득 차면 옛 것이 밀려나야 합니다.
    for (let i = 0; i < T.EXERCISE_QUEUE_SIZE; i++) T.exercise(state, 'maces_and_flails');
    assert.ok(!state.recent.includes('axes'), '큐를 다 채웠는데 옛 스킬이 남아 있습니다');
});

test('쓴 것에만 경험치가 들어간다', () => {
    const state = T.createSkillState();
    for (let i = 0; i < 10; i++) T.exercise(state, 'fighting');

    T.gainExperience(state, 5000, flatAptitude);
    assert.ok((state.points.fighting ?? 0) > 0, '쓴 스킬이 오르지 않았습니다');
    assert.equal(state.points.axes, undefined, '쓰지 않은 스킬이 올랐습니다');
});

test('많이 쓴 쪽이 더 오른다', () => {
    const state = T.createSkillState();
    for (let i = 0; i < 75; i++) T.exercise(state, 'fighting');
    for (let i = 0; i < 25; i++) T.exercise(state, 'dodging');

    T.gainExperience(state, 20000, flatAptitude);
    assert.ok(state.points.fighting > state.points.dodging * 2,
        `격투 ${state.points.fighting}, 회피 ${state.points.dodging}`);
});

test('아무것도 하지 않았으면 경험치를 쌓아 둔다', () => {
    // 버리면 적을 죽였는데 아무 일도 없는 것처럼 보입니다.
    const state = T.createSkillState();
    T.gainExperience(state, 500, flatAptitude);
    assert.equal(state.pool, 500, '경험치가 사라졌습니다');

    // 뒤늦게 무언가를 하면 쌓아 둔 것이 쓰입니다.
    for (let i = 0; i < 10; i++) T.exercise(state, 'fighting');
    T.gainExperience(state, 0, flatAptitude);
    assert.ok(state.points.fighting > 0, '쌓아 둔 경험치가 쓰이지 않았습니다');
});

test('배울 수 없는 스킬에는 넣지 않는다', () => {
    // 넣으면 경험치만 사라집니다. 펠리드가 도끼를 휘두르는 상황입니다.
    const state = T.createSkillState();
    for (let i = 0; i < 10; i++) T.exercise(state, 'axes');

    const before = state.pool;
    T.gainExperience(state, 5000, (skill) => (skill === 'axes' ? null : 0));
    assert.equal(state.points.axes, undefined, '배울 수 없는 스킬이 올랐습니다');
    assert.ok(state.pool >= before, '경험치가 사라졌습니다');
});

test('성장할수록 스킬 점수가 비싸진다', () => {
    // 같은 경험치로 얻는 점수가 후반에는 훨씬 적어야 합니다.
    const fresh = T.createSkillState();
    for (let i = 0; i < 10; i++) T.exercise(fresh, 'fighting');
    T.gainExperience(fresh, 5000, flatAptitude);
    const early = fresh.points.fighting;

    const veteran = T.createSkillState();
    veteran.totalSpent = 500000;
    for (let i = 0; i < 10; i++) T.exercise(veteran, 'fighting');
    T.gainExperience(veteran, 5000, flatAptitude);
    const late = veteran.points.fighting ?? 0;

    assert.ok(late < early, `초반 ${early}점, 후반 ${late}점 — 비싸지지 않았습니다`);
});

test('적성이 좋으면 같은 점수로 더 높이 오른다', () => {
    const state = T.createSkillState();
    state.points.fighting = 3000;
    assert.ok(T.skillLevel(state, 'fighting', 3) > T.skillLevel(state, 'fighting', -3));
});

test('스킬 상태가 저장을 왕복해도 그대로다', () => {
    // world 에 담겨 세이브에 들어갑니다. 함수나 Infinity 가 섞이면 무너집니다.
    const state = T.createSkillState();
    for (let i = 0; i < 20; i++) T.exercise(state, 'fighting');
    T.gainExperience(state, 3000, flatAptitude);

    assert.deepEqual(JSON.parse(JSON.stringify(state)), state);
});

// --- 게임에 실제로 붙었는가 -----------------------------------------------------

/** 빈 방을 깔고 캐릭터를 세웁니다. */
function emptyRoom(species = 'minotaur', background = 'fighter') {
    resetWorld();
    A.setGameRunning(true);
    applyCharacter(species, background);
    worldModule.world.map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.player.x = 10 * C.TILE_SIZE;
    worldModule.world.player.y = 10 * C.TILE_SIZE;
    return worldModule.world;
}

test('새 캐릭터가 스킬 상태를 갖고 시작한다', () => {
    const world = emptyRoom();
    assert.ok(world.player.skills, '스킬 상태가 없습니다');
    assert.deepEqual(world.player.skills.points, {}, '처음부터 점수가 있습니다');
});

test('적을 죽이면 경험치가 스킬로 들어간다', () => {
    // 이것이 배선의 핵심입니다. 끊겨 있으면 아무리 싸워도 강해지지 않는데
    // 예외는 나지 않습니다.
    seedRandom(0x7A1);
    const world = emptyRoom();

    // 무언가를 하고 있었던 것으로 둡니다. 그래야 경험치가 나뉩니다.
    for (let i = 0; i < 20; i++) A.practise('fighting');

    const enemy = gameLogic.spawnMonster('rat', { x: world.player.x + 40, y: world.player.y });
    assert.ok(enemy.exp > 0, '이 몬스터는 경험치를 주지 않습니다');

    const before = world.player.skills.points.fighting ?? 0;
    enemy.hp = 0;
    gameLogic.update(C.SIMULATION_STEP_MS);   // 사망 처리에서 경험치가 들어갑니다

    const after = world.player.skills.points.fighting ?? 0;
    const pooled = world.player.skills.pool;
    assert.ok(after > before || pooled > 0,
        '적을 죽였는데 경험치가 어디에도 들어가지 않았습니다');
});

// 공포 갈래에서는 싸울 수 없어 이 검사가 성립하지 않습니다.
// 지우지 않고 건너뜁니다. main 으로 되돌릴 때 다시 살아나야 합니다.
test.skip('맞춰야 스킬이 오른다', () => {
    // 허공에 쏘면서 스킬이 오르면 벽을 보고 난사하는 것이 최선의 성장법이 됩니다.
    seedRandom(0x7A2);
    const world = emptyRoom();
    world.player.angle = Math.PI;   // 적이 없는 쪽을 봅니다

    // 주먹 사거리(약 38픽셀) 안에 세웁니다. 밖에 두면 겨눠도 닿지 않습니다.
    gameLogic.spawnMonster('rat', { x: world.player.x + 24, y: world.player.y });

    for (let i = 0; i < 20; i++) {
        world.player.lastAttackTime = C.PAST_TIME;
        gameLogic.attack();
    }
    assert.equal(world.player.skills.recent.length, 0,
        '빗나갔는데 훈련 기록이 남았습니다');

    // 이제 겨누고 쏩니다.
    world.player.angle = 0;
    for (let i = 0; i < 5; i++) {
        world.player.lastAttackTime = C.PAST_TIME;
        gameLogic.attack();
    }
    assert.ok(world.player.skills.recent.length > 0, '맞췄는데 훈련되지 않았습니다');
});

test('스킬이 오르면 명중값도 오른다', () => {
    // 스킬이 명중에 반영되지 않으면 성장이 체감되지 않습니다.
    // 명중값은 과녁 크기를 정하므로, 오르면 맞추기 쉬워집니다.
    const world = emptyRoom();

    // gameLogic 의 playerToHit 은 내보내지 않으므로 같은 식으로 재어 봅니다.
    const toHit = () => {
        const skills = world.player.skills;
        const dex = 5;   // 미노타우로스
        return 15 + Math.trunc(dex / 2)
            + S.skillValueFor(skills.points.fighting ?? 0, aptitudeFor('fighting'))
            + S.skillValueFor(skills.points.unarmed_combat ?? 0, aptitudeFor('unarmed_combat'));
    };
    const targetRadius = () => aimRadius(11, toHit(), 10);

    const before = targetRadius();
    world.player.skills.points.fighting = 20000;
    const after = targetRadius();

    assert.ok(after > before, `과녁이 ${before.toFixed(2)} → ${after.toFixed(2)} 로 커지지 않았습니다`);
});

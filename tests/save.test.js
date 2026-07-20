/**
 * @fileoverview 이어하기 한 칸의 규칙을 확인합니다.
 *
 * 원본 DCSS 를 따라 '저장하고 나가기' 한 칸만 둡니다. 이 방식이 성립하려면
 * 불러온 뒤 파일이 남지 않아야 하고, 죽으면 지워져야 합니다.
 * 둘 중 하나라도 새면 어려운 판을 몇 번이고 되돌릴 수 있게 되어
 * 이어하기가 죽음을 무르는 장치로 바뀝니다. 그래서 그 두 가지를 주로 봅니다.
 *
 * 저장 자체가 막힌 브라우저(사생활 보호 모드 등)에서 게임이 멈추지 않는지도 함께 봅니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    installBrowserStubs, bindStubDom, installMemoryStorage, installFailingStorage,
} from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const worldModule = await import('../Script/world.js');
const { resetWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const actions = await import('../Script/actions.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');
const { hasSave, describeSave, saveGame, loadGame, deleteSave } = await import('../Script/save.js');

bindStubDom(dom);

/** 저장할 만한 상태의 판을 하나 만듭니다. */
function playUntilSomethingHappened() {
    installMemoryStorage();
    resetWorld();
    const world = worldModule.world;

    actions.beginFloor(generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT));
    actions.setFloor(4);
    world.player.hp = 37;
    world.player.species = 'minotaur';
    world.player.background = 'berserker';
    world.time = 123456;
    world.enemies.push({ x: 100, y: 100, hp: 5, spriteKey: 'rat' });
    return world;
}

// --- 왕복 -------------------------------------------------------------------

test('저장한 판을 그대로 되살린다', () => {
    const before = playUntilSomethingHappened();
    const expected = {
        floor: before.floor, hp: before.player.hp, time: before.time,
        species: before.player.species, enemies: before.enemies.length,
        mapSum: before.map.flat().reduce((a, v) => a + v, 0),
    };

    assert.equal(saveGame(), true, '저장에 실패했습니다');

    resetWorld(); // 판을 완전히 떠난 상태를 흉내 냅니다.
    assert.equal(loadGame(), true, '되살리기에 실패했습니다');

    const after = worldModule.world;
    assert.equal(after.floor, expected.floor);
    assert.equal(after.player.hp, expected.hp);
    assert.equal(after.time, expected.time, '게임 내부 시간이 이어져야 쿨다운이 어긋나지 않습니다');
    assert.equal(after.player.species, expected.species);
    assert.equal(after.enemies.length, expected.enemies, '적이 서 있던 자리가 남아야 합니다');
    assert.equal(after.map.flat().reduce((a, v) => a + v, 0), expected.mapSum, '지형이 그대로여야 합니다');
});

test('서브 던전에 들어간 채로 저장해도 돌아갈 길이 남는다', () => {
    // parentStack 이 world 안에 들어 있으므로 저장 한 줄에 함께 담깁니다.
    // 이것이 world 를 순수 데이터로 유지해 온 이유입니다.
    playUntilSomethingHappened();
    worldModule.world.enemies.push({ x: 1, y: 1, hp: 1, spriteKey: 'rat' });
    const enemiesLeftBehind = worldModule.world.enemies.length;

    actions.enterBranch('L'); // 짐승굴
    actions.beginFloor(generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT));

    assert.equal(worldModule.world.parentStack.length, 1);
    saveGame();
    resetWorld();
    loadGame();

    assert.equal(worldModule.world.branch, 'L', '들어가 있던 가지가 유지되어야 합니다');
    assert.equal(worldModule.world.parentStack.length, 1, '돌아갈 상위 던전이 사라졌습니다');
    assert.equal(worldModule.world.parentStack[0].enemies.length, enemiesLeftBehind,
        '스택에 보관된 층의 적까지 저장되어야 합니다');
});

// --- 한 칸의 규칙 -------------------------------------------------------------

test('불러오면 저장 파일이 사라진다', () => {
    // 이 규칙이 이 방식의 핵심입니다. 남겨 두면 같은 지점을 몇 번이고 다시 불러올 수 있어
    // 어려운 판을 무한히 되돌릴 수 있게 됩니다.
    playUntilSomethingHappened();
    saveGame();
    assert.equal(hasSave(), true);

    loadGame();
    assert.equal(hasSave(), false, '불러온 뒤에도 저장 파일이 남아 있습니다');
    assert.equal(loadGame(), false, '같은 판을 두 번 불러올 수 있습니다');
});

test('죽으면 저장 파일이 사라진다', () => {
    playUntilSomethingHappened();
    saveGame();
    assert.equal(hasSave(), true);

    deleteSave(); // main.js 가 PLAYER_DIED 에서 부르는 것과 같습니다.
    assert.equal(hasSave(), false, '죽은 뒤에도 이어하기가 남아 있습니다');
});

test('저장할 때마다 이전 칸을 덮어쓴다', () => {
    playUntilSomethingHappened();
    actions.setFloor(2);
    saveGame();
    actions.setFloor(9);
    saveGame();

    loadGame();
    assert.equal(worldModule.world.floor, 9, '마지막으로 저장한 지점이 아닙니다');
    assert.equal(hasSave(), false, '칸이 하나가 아닙니다');
});

// --- 제목 화면 표시 -----------------------------------------------------------

test('저장이 없으면 이어하기 정보도 없다', () => {
    installMemoryStorage();
    assert.equal(hasSave(), false);
    assert.equal(describeSave(), null);
});

test('저장된 지점을 가지:층 형태로 알려준다', () => {
    playUntilSomethingHappened();
    actions.setFloor(4);
    saveGame();

    const summary = describeSave();
    assert.equal(summary.floor, 4);
    assert.equal(summary.branch, 'D');
    assert.ok(summary.location.includes('4'), `표시가 층을 담아야 합니다: ${summary.location}`);
});

// --- 망가진 상황 --------------------------------------------------------------

test('깨진 저장 파일은 지우고 없는 것으로 본다', () => {
    // 읽다가 죽는 것보다 이어하기가 사라지는 편이 낫습니다.
    installMemoryStorage();
    localStorage.setItem('magic-shooter/save/v1', '{어쩌구 저쩌구');

    assert.equal(hasSave(), false, '깨진 파일을 유효한 저장으로 봤습니다');
    assert.equal(localStorage.getItem('magic-shooter/save/v1'), null, '깨진 파일이 남아 있습니다');
});

test('월드가 빠진 저장 파일도 없는 것으로 본다', () => {
    installMemoryStorage();
    localStorage.setItem('magic-shooter/save/v1', JSON.stringify({ location: 'D:3', floor: 3 }));

    assert.equal(hasSave(), false);
});

test('저장소를 쓸 수 없어도 게임이 멈추지 않는다', () => {
    // 사생활 보호 모드에서는 localStorage 접근 자체가 예외를 던집니다.
    // 이어하기만 조용히 사라지고 나머지는 평소대로 돌아가야 합니다.
    resetWorld();
    installFailingStorage();

    assert.doesNotThrow(() => hasSave());
    assert.doesNotThrow(() => describeSave());
    assert.doesNotThrow(() => deleteSave());
    assert.doesNotThrow(() => loadGame());

    assert.equal(hasSave(), false);
    assert.equal(saveGame(), false, '저장할 수 없는데 성공했다고 답했습니다');
    assert.equal(loadGame(), false);

    installMemoryStorage(); // 다음 테스트에 영향을 주지 않도록 되돌립니다.
});

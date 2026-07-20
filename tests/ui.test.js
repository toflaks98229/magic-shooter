/**
 * @fileoverview 상태 패널이 글자 대신 그림을 쓰는지 확인합니다.
 *
 * 이 저장소에서는 브라우저를 열 수 없어, 패널이 어떻게 보이는지 눈으로 볼 수 없습니다.
 * 그래서 '그림 요소가 실제로 만들어졌는가'를 여기서 대신 봅니다.
 * 에셋이 없을 때 칸이 비어 버리지 않는지도 함께 봅니다. (로딩 전에도 화면은 말이 되어야 합니다)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const worldModule = await import('../Script/world.js');
const { resetWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const { assets } = await import('../Script/assets.js');
const { updateHUD, invalidateSpriteCache } = await import('../Script/ui.js');

bindStubDom(dom);

/** 그림이 준비된 척합니다. 실제 로딩은 브라우저에서만 됩니다. */
function pretendAssetsLoaded(...spriteKeys) {
    for (const key of spriteKeys) {
        assets.textures[key] = { img: { src: `stub://${key}` } };
    }
    invalidateSpriteCache();
}

/** 칸 안의 그림 요소만 셉니다. */
function iconsIn(element) {
    return (element.children || []).filter(node => node.className === 'sprite-icon');
}

// --- 룬 -----------------------------------------------------------------------

test('룬이 없으면 0 으로 표시된다', () => {
    resetWorld();
    pretendAssetsLoaded('status_rune');
    updateHUD();

    assert.equal(iconsIn(dom.runeCountEl).length, 0);
    assert.equal(dom.runeCountEl.textContent, '0');
});

test('모은 룬이 그림으로 늘어선다', () => {
    resetWorld();
    worldModule.world.runes = ['L', 'S', 'V'];
    pretendAssetsLoaded('status_rune');
    updateHUD();

    assert.equal(iconsIn(dom.runeCountEl).length, 3, '룬 세 개가 그림 세 개로 나와야 합니다');
});

test('룬이 많으면 다섯 개까지만 그리고 나머지는 숫자로 붙인다', () => {
    resetWorld();
    worldModule.world.runes = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    pretendAssetsLoaded('status_rune');
    updateHUD();

    // 열다섯 개까지 늘어설 수 있어 줄이 넘칩니다. 다섯 개에서 끊고 남은 수를 적습니다.
    assert.equal(iconsIn(dom.runeCountEl).length, 5);
    const rest = dom.runeCountEl.children.find(node => typeof node.textContent === 'string' && node.textContent.includes('+2'));
    assert.ok(rest, '남은 두 개가 +2 로 표시되어야 합니다');
});

test('그림이 아직 없어도 룬 개수는 보인다', () => {
    resetWorld();
    worldModule.world.runes = ['L', 'S'];
    delete assets.textures.status_rune;   // 에셋 로딩 전 상태
    invalidateSpriteCache();
    updateHUD();

    assert.equal(dom.runeCountEl.textContent, '2', '그림이 없으면 숫자라도 나와야 합니다');
});

// --- 들고 있는 무기 -------------------------------------------------------------

test('들고 있는 무기가 그림과 이름으로 나온다', () => {
    resetWorld();
    worldModule.world.player.weapon = 'gun';
    pretendAssetsLoaded('gun');
    updateHUD();

    assert.equal(iconsIn(dom.wieldedWeaponEl).length, 1);
    const label = dom.wieldedWeaponEl.children.find(node => node.textContent === C.WEAPONS.gun.name);
    assert.ok(label, `무기 이름 '${C.WEAPONS.gun.name}' 이 나와야 합니다`);
});

test('무기를 바꾸면 표시도 따라 바뀐다', () => {
    resetWorld();
    worldModule.world.player.weapon = 'gun';
    pretendAssetsLoaded('gun', 'fist');
    updateHUD();

    worldModule.world.player.weapon = 'fist';
    updateHUD();

    const label = dom.wieldedWeaponEl.children.find(node => node.textContent === C.WEAPONS.fist.name);
    assert.ok(label, '무기를 바꿨는데 이전 무기가 남아 있습니다');
});

test('모든 무기에 표시할 이름이 있다', () => {
    for (const [key, weapon] of Object.entries(C.WEAPONS)) {
        assert.ok(weapon.name, `${key} 에 상태창에 적을 이름이 없습니다`);
    }
});

// --- 연출 타이머 생명주기 -------------------------------------------------------

const events = await import('../Script/events.js');
const { runtime } = await import('../Script/runtime.js');
const { registerUiHandlers, resetUi } = await import('../Script/ui.js');
const { advanceClock } = await import('./helpers/browser-stubs.js');

registerUiHandlers();

test('무기 교체 도중 판이 다시 시작되면 예약된 연출이 새 판을 건드리지 않는다', () => {
    // 무기 교체는 두 단계로 300ms 에 걸쳐 진행됩니다.
    // 그 사이에 재시작하면, 예전에는 예약된 콜백이 살아남아
    // 새 판에서 고른 무기를 이전 판의 교체 대상으로 덮어썼습니다.
    resetWorld();
    const world = worldModule.world;
    world.player.weapon = 'gun';

    events.emit(events.EVENTS.WEAPON_CHANGED, { from: 'gun', to: 'fist' });
    assert.equal(runtime.isSwappingWeapon, true, '교체 연출이 시작되어야 합니다');

    // 첫 단계가 끝나기 직전에 판이 다시 시작됩니다.
    advanceClock(C.WEAPON_SWAP_HALF_MS - 1);
    assert.equal(world.player.weapon, 'gun', '아직 교체가 확정되기 전이어야 합니다');

    resetUi();
    resetWorld();
    worldModule.world.player.weapon = 'gun'; // 새 판에서 고른 무기

    // 예약이 살아 있었다면 이 시점에 setWeapon('fist') 가 실행됩니다.
    advanceClock(C.WEAPON_SWAP_HALF_MS * 4);

    assert.equal(worldModule.world.player.weapon, 'gun',
        '취소된 연출이 새 판의 무기를 덮어썼습니다');
});

test('resetUi는 중간에 멈춘 연출의 CSS 클래스를 남기지 않는다', () => {
    // 취소만 하고 클래스를 그대로 두면 무기가 화면 밖으로 내려간 채 돌아오지 않습니다.
    resetWorld();
    worldModule.world.player.weapon = 'gun';

    events.emit(events.EVENTS.WEAPON_CHANGED, { from: 'gun', to: 'fist' });
    assert.ok(dom.weaponSpriteEl.classList.contains('swapping-out'),
        '내려가는 연출 클래스가 붙어야 합니다');

    resetUi();

    assert.equal(dom.weaponSpriteEl.classList.contains('swapping-out'), false,
        'swapping-out 클래스가 남아 있습니다');
    assert.equal(dom.weaponSpriteEl.classList.contains('swapping-in'), false,
        'swapping-in 클래스가 남아 있습니다');
});

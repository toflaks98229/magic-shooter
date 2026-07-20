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

/**
 * @fileoverview HTML 문서의 UI 요소를 업데이트하고 관리하는 모든 함수를 포함합니다.
 *
 * 이제 게임 로직이 이 파일의 함수를 직접 부르지 않습니다.
 * 대신 이 파일이 게임 이벤트를 구독해 스스로 반응합니다.
 * 연출을 바꾸거나 추가할 때 시뮬레이션 코드를 열 필요가 없습니다.
 */

// --- 모듈 임포트 ---
import * as C from './constants.js';
import { world } from './world.js';
import { runtime } from './runtime.js';
import { assets } from './assets.js';
import { dom } from './dom.js';
import { formatLocation } from './branches.js';
import { groupInventory, inventorySummary, describeStack, INVENTORY_SLOTS } from './inventory.js';
import { BUFF_MODIFIERS } from './items.js';
import { setWeapon } from './actions.js';
import { on, EVENTS } from './events.js';

// --- 초기화 ---

/**
 * 게임 이벤트를 구독해 UI가 스스로 반응하도록 등록합니다.
 * main.js의 초기화 시점에 한 번만 호출됩니다.
 */
export function registerUiHandlers() {
    on(EVENTS.PLAYER_DAMAGED, showHitReaction);
    on(EVENTS.WEAPON_FIRED, showAttackEffect);
    on(EVENTS.WEAPON_CHANGED, ({ to }) => playWeaponSwapAnimation(to));

    // 소지품 창은 제목 줄을 눌러서도 접고 펼 수 있습니다.
    dom.inventoryHeaderEl.addEventListener('click', () => {
        runtime.isInventoryOpen = !runtime.isInventoryOpen;
    });
}

// --- 외부 공개 함수 (Public Methods) ---

/**
 * 현재 게임 상태를 기반으로 HUD(Head-Up Display)의 모든 텍스트와 이미지를 업데이트합니다.
 * 매 프레임 호출되므로, 값이 실제로 바뀐 경우에만 DOM에 쓰도록 더티 체크를 합니다.
 */
export function updateHUD() {
    const player = world.player;

    // DCSS 처럼 현재값/최대값과 막대를 함께 보여줍니다.
    setText(dom.playerHpEl, `${Math.ceil(player.hp)}/${player.maxHp}`);
    setText(dom.playerAmmoEl, `${player.ammo}/${player.maxAmmo}`);
    setBarWidth(dom.hpBarFillEl, player.hp / player.maxHp);
    setBarWidth(dom.mpBarFillEl, player.ammo / player.maxAmmo);

    setText(dom.enemyCountEl, world.enemies.length);
    // 가지 안에서의 층만 보여주면 짐승굴 2층인지 메인 2층인지 알 수 없으므로
    // DCSS 관례대로 '가지:층' 형태로 표시합니다.
    setText(dom.floorCountEl, formatLocation(world.branch, world.floor));
    setText(dom.runeCountEl, world.runes.length);
    setText(dom.gameTimeEl, (world.time / 1000).toFixed(1));

    updateBuffList();
    updateInventory();
    updateStatusFace(); // 상태 얼굴 업데이트
    updateWeaponSprite(); // 무기 스프라이트 업데이트
}

/**
 * 막대의 채워진 길이를 설정합니다.
 * @param {HTMLElement} element - 막대 요소
 * @param {number} ratio - 0~1 비율
 */
function setBarWidth(element, ratio) {
    const percent = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
    if (element.style.width !== percent) element.style.width = percent;
}

/** @description 지속 효과의 표시 이름 */
const BUFF_LABELS = { might: '힘', haste: '가속', resistance: '보호' };

/**
 * 걸려 있는 지속 효과와 남은 시간을 보여줍니다.
 * DCSS 가 상태 이상을 패널에 나열하는 자리를 대신합니다.
 */
function updateBuffList() {
    const text = world.buffs
        .map(buff => `${BUFF_LABELS[buff.effect] || buff.effect} ${Math.ceil((buff.expiresAt - world.time) / 1000)}s`)
        .join('  ');
    setText(dom.buffListEl, text);
}

/**
 * 소지품 창을 다시 그립니다.
 *
 * 매 프레임 호출되므로, 내용이 실제로 달라졌을 때만 DOM 을 새로 만듭니다.
 * 그렇지 않으면 초당 수십 번 목록 전체를 다시 만들게 됩니다.
 */
function updateInventory() {
    dom.inventoryEl.classList.toggle('collapsed', !runtime.isInventoryOpen);
    setText(dom.inventoryToggleEl, runtime.isInventoryOpen ? '[-]' : '[+]');
    setText(dom.inventoryTitleEl, inventorySummary(world.inventory));

    const signature = world.inventory.map(slot => `${slot.itemId}:${slot.count}`).join(',');
    if (signature === lastInventorySignature) return;
    lastInventorySignature = signature;

    dom.inventoryBodyEl.replaceChildren(...buildInventoryRows());
}

/** @description 마지막으로 그린 소지품 내용. 달라졌을 때만 다시 그립니다. */
let lastInventorySignature = null;

/**
 * 소지품 목록의 DOM 요소들을 만듭니다.
 * @returns {HTMLElement[]} 표시할 줄들
 */
function buildInventoryRows() {
    if (world.inventory.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'inv-empty';
        empty.textContent = '가진 것이 없다.';
        return [empty];
    }

    const rows = [];
    for (const group of groupInventory(world.inventory)) {
        const heading = document.createElement('div');
        heading.className = 'inv-category';
        heading.textContent = group.name;
        rows.push(heading);

        for (const entry of group.entries) {
            const row = document.createElement('div');
            row.className = 'inv-item';

            const letter = document.createElement('span');
            letter.className = 'inv-letter';
            // 첫 아홉 칸은 숫자키로 곧바로 쓸 수 있어 그 숫자를 함께 보여줍니다.
            letter.textContent = entry.index < 9 ? `${entry.index + 1})` : `${entry.letter})`;

            const label = document.createElement('span');
            label.textContent = describeStack(entry.itemId, entry.count);

            row.append(letter, label);
            rows.push(row);
        }
    }
    return rows;
}

// --- 이벤트 핸들러 (Private) ---

/**
 * 플레이어가 피격당했을 때 화면 효과와 얼굴 반응을 표시합니다.
 */
function showHitReaction() {
    // 화면에 붉은 혈흔 효과를 잠시 표시합니다.
    dom.bloodSplatterEl.style.opacity = 0.8;

    // 상태 얼굴을 일시적으로 피격 반응 얼굴로 변경합니다.
    updateStatusFace(C.FACE_SPRITES.HIT_REACTION);

    // 잠시 후, 혈흔 효과를 서서히 사라지게 하고 얼굴을 원래 상태로 되돌립니다.
    setTimeout(() => {
        dom.bloodSplatterEl.style.opacity = 0;
        updateHUD(); // HUD 전체를 업데이트하여 얼굴을 현재 체력 상태에 맞게 되돌립니다.
    }, C.HIT_REACTION_MS);
}

/**
 * 무기를 발사했을 때의 시각 효과를 무기 정의에 따라 표시합니다.
 * @param {{weapon: string}} detail - 발사한 무기 정보
 */
function showAttackEffect({ weapon }) {
    const weaponData = C.WEAPONS[weapon];
    if (!weaponData) return;

    // 총구 섬광처럼 별도 스프라이트가 정의된 무기는 스프라이트를 잠시 교체합니다.
    if (weaponData.fireSprite) showFireSprite(weaponData);

    // 주먹처럼 CSS 애니메이션으로 표현되는 무기는 클래스를 잠시 붙입니다.
    if (weaponData.attackAnimation) {
        const className = weaponData.attackAnimation;
        dom.weaponSpriteEl.classList.add(className);
        setTimeout(() => dom.weaponSpriteEl.classList.remove(className), C.WEAPON_ATTACK_ANIM_MS);
    }
}

/**
 * 발사 스프라이트를 잠시 표시했다가 원래 스프라이트로 되돌립니다.
 * @param {object} weaponData - constants.js의 WEAPONS 항목
 */
function showFireSprite(weaponData) {
    const fireSpriteTexture = assets.textures[weaponData.fireSprite];
    const normalSpriteTexture = assets.textures[weaponData.sprite];
    const placeholderTexture = assets.textures.placeholder;

    // 발사 스프라이트가 있으면 사용하고, 없으면 일반 스프라이트, 그것도 없으면 플레이스홀더를 사용합니다.
    const fireSrc = fireSpriteTexture?.img?.src || normalSpriteTexture?.img?.src || placeholderTexture?.img?.src;
    if (fireSrc && dom.weaponSpriteEl.src !== fireSrc) {
        dom.weaponSpriteEl.src = fireSrc;
    }

    // 효과가 끝난 후 복원할 스프라이트도 미리 확인합니다.
    const restoreSrc = normalSpriteTexture?.img?.src || placeholderTexture?.img?.src;

    setTimeout(() => {
        // 그 사이 무기가 바뀌었을 수 있으므로, 여전히 같은 무기를 들고 있을 때만 복원합니다.
        if (C.WEAPONS[world.player.weapon] === weaponData && !runtime.isSwappingWeapon && restoreSrc) {
            dom.weaponSpriteEl.src = restoreSrc;
        }
    }, C.MUZZLE_FLASH_MS);
}

/**
 * 무기 교체 애니메이션을 재생하고, 연출이 끝나는 시점에 실제 무기를 교체합니다.
 * @param {string} newWeapon - 새로 교체할 무기의 키 ('gun' 또는 'fist')
 */
function playWeaponSwapAnimation(newWeapon) {
    if (runtime.isSwappingWeapon) return; // 이미 교체 중이면 중복 실행을 방지합니다.

    runtime.isSwappingWeapon = true;
    dom.weaponSpriteEl.classList.add('swapping-out'); // 무기가 아래로 내려가는 애니메이션

    // 무기가 화면 아래로 사라진 후
    setTimeout(() => {
        setWeapon(newWeapon);  // 실제 무기 상태를 변경
        updateWeaponSprite();  // 새 무기 이미지로 교체
        dom.weaponSpriteEl.classList.remove('swapping-out');
        dom.weaponSpriteEl.classList.add('swapping-in'); // 새 무기가 위로 올라오는 애니메이션

        // 새 무기가 완전히 올라온 후
        setTimeout(() => {
            dom.weaponSpriteEl.classList.remove('swapping-in');
            runtime.isSwappingWeapon = false;
        }, C.WEAPON_SWAP_HALF_MS);
    }, C.WEAPON_SWAP_HALF_MS);
}

// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 값이 실제로 바뀐 경우에만 textContent를 씁니다.
 * 매 프레임 무조건 쓰면 초당 수백 번의 불필요한 DOM 변경이 발생합니다.
 * @param {HTMLElement} element - 대상 요소
 * @param {string|number} value - 표시할 값
 */
function setText(element, value) {
    const text = String(value);
    if (element.textContent !== text) element.textContent = text;
}

/**
 * 플레이어의 현재 체력에 따라 상태 창의 얼굴 이미지를 변경합니다.
 * @param {string|null} overrideFaceKey - 특정 얼굴(예: 피격 반응)을 일시적으로 표시할 스프라이트 키.
 */
function updateStatusFace(overrideFaceKey = null) {
    const faceImg = dom.statusFaceImgEl;
    if (!faceImg) return;

    let faceKeyToShow = overrideFaceKey;

    if (!faceKeyToShow) {
        // 플레이어 체력 비율에 따라 다른 얼굴 스프라이트 키를 선택합니다.
        const healthRatio = world.player.hp / world.player.maxHp;
        if (healthRatio > 0.7) faceKeyToShow = C.FACE_SPRITES.HEALTHY;
        else if (healthRatio > 0.3) faceKeyToShow = C.FACE_SPRITES.HURT;
        else faceKeyToShow = C.FACE_SPRITES.BLOODY;
    }

    applySprite(faceImg, faceKeyToShow, 'Status face');
}

/**
 * 현재 선택된 무기에 맞는 스프라이트를 화면에 표시합니다.
 */
function updateWeaponSprite() {
    const weaponData = C.WEAPONS[world.player.weapon];
    if (!weaponData) return;

    applySprite(dom.weaponSpriteEl, weaponData.sprite, 'Weapon');
}

/**
 * @description 이미 경고한 텍스처 키. updateHUD가 매 프레임 호출되므로,
 * 누락된 스프라이트 하나가 초당 수십 줄의 콘솔 경고를 쏟아내는 것을 막습니다.
 */
const warnedTextures = new Set();

/**
 * 텍스처를 찾아 img 요소에 적용합니다. 없으면 플레이스홀더로 대체합니다.
 * @param {HTMLImageElement} imgEl - 대상 img 요소
 * @param {string} textureKey - 표시할 텍스처 키
 * @param {string} label - 경고 메시지에 쓸 이름
 */
function applySprite(imgEl, textureKey, label) {
    const texture = assets.textures[textureKey];
    const placeholder = assets.textures.placeholder;
    let newSrc = '';

    if (texture && texture.img) {
        newSrc = texture.img.src;
    } else if (placeholder && placeholder.img) {
        newSrc = placeholder.img.src;
        if (!warnedTextures.has(textureKey)) {
            warnedTextures.add(textureKey);
            console.warn(`${label} sprite not found: ${textureKey}. Using placeholder.`);
        }
    }

    // 현재 이미지와 다를 경우에만 src를 변경하여 불필요한 DOM 조작을 방지합니다.
    if (newSrc && imgEl.src !== newSrc) {
        imgEl.src = newSrc;
    }
}

/**
 * @fileoverview HTML 문서의 UI 요소를 업데이트하고 관리하는 모든 함수를 포함합니다.
 */

// --- 모듈 임포트 ---
import * as S from './state.js';
import * as C from './constants.js';

// --- 외부 공개 함수 (Public Methods) ---

/**
 * 현재 게임 상태를 기반으로 HUD(Head-Up Display)의 모든 텍스트와 이미지를 업데이트합니다.
 * 이 함수는 매 프레임의 마지막에 호출되어 화면에 최신 정보를 표시합니다.
 */
export function updateHUD() {
    S.dom.playerHpEl.textContent = Math.ceil(S.player.hp);
    S.dom.playerAmmoEl.textContent = S.player.ammo;
    S.dom.enemyCountEl.textContent = S.enemies.length;
    S.dom.floorCountEl.textContent = S.floor;
    updateStatusFace(); // 상태 얼굴 업데이트
    updateWeaponSprite(); // 무기 스프라이트 업데이트
}

/**
 * 플레이어가 피격당했을 때 화면 효과와 얼굴 반응을 표시합니다.
 */
export function showHitReaction() {
    // 화면에 붉은 혈흔 효과를 잠시 표시합니다.
    S.dom.bloodSplatterEl.style.opacity = 0.8;
    window.playSound('PLAYER_HIT'); // 피격음 재생

    // 상태 얼굴을 일시적으로 피격 반응 얼굴로 변경합니다.
    updateStatusFace(C.FACE_SPRITES.HIT_REACTION);

    // 150ms 후, 혈흔 효과를 서서히 사라지게 하고 얼굴을 원래 상태로 되돌립니다.
    setTimeout(() => {
        S.dom.bloodSplatterEl.style.opacity = 0;
        updateHUD(); // HUD 전체를 업데이트하여 얼굴을 현재 체력 상태에 맞게 되돌립니다.
    }, 150);
}

/**
 * 무기 교체 애니메이션을 관리합니다.
 * @param {string} newWeapon - 새로 교체할 무기의 키 ('gun' 또는 'fist').
 */
export function switchWeapon(newWeapon) {
    if (S.isSwappingWeapon) return; // 이미 교체 중이면 중복 실행을 방지합니다.

    S.setSwappingWeapon(true);
    window.playSound('WEAPON_SWAP'); // 무기 교체음 재생
    S.dom.weaponSpriteEl.classList.add('swapping-out'); // 무기가 아래로 내려가는 애니메이션 클래스 추가

    // 무기가 화면 아래로 사라진 후
    setTimeout(() => {
        S.setCurrentWeapon(newWeapon); // 실제 무기 상태를 변경
        updateWeaponSprite(); // 새 무기 이미지로 교체
        S.dom.weaponSpriteEl.classList.remove('swapping-out');
        S.dom.weaponSpriteEl.classList.add('swapping-in'); // 새 무기가 위로 올라오는 애니메이션 클래스 추가
        
        // 새 무기가 완전히 올라온 후
        setTimeout(() => {
            S.dom.weaponSpriteEl.classList.remove('swapping-in');
            S.setSwappingWeapon(false); // 애니메이션 종료 후 상태 플래그를 해제합니다.
        }, 150);
    }, 150);
}

/**
 * 총 발사 시 무기 스프라이트를 일시적으로 '발사' 이미지로 변경하는 효과를 표시합니다.
 */
export function showGunFireEffect() {
    const weaponData = C.WEAPONS.gun;
    // 사용할 스프라이트 텍스처를 미리 찾아둡니다.
    const fireSpriteTexture = S.textures[weaponData.fireSprite];
    const normalSpriteTexture = S.textures[weaponData.sprite];
    const placeholderTexture = S.textures['placeholder'];

    // 발사 스프라이트가 있으면 사용하고, 없으면 일반 스프라이트, 그것도 없으면 플레이схолдер를 사용합니다.
    const fireSrc = fireSpriteTexture?.img?.src || normalSpriteTexture?.img?.src || placeholderTexture?.img?.src;
    if (S.dom.weaponSpriteEl.src !== fireSrc) {
        S.dom.weaponSpriteEl.src = fireSrc;
    }
    
    // 효과가 끝난 후 복원할 스프라이트도 미리 확인합니다.
    const restoreSrc = normalSpriteTexture?.img?.src || placeholderTexture?.img?.src;

    // 60ms 후, 원래 스프라이트로 복원합니다.
    setTimeout(() => {
        // 효과가 끝난 후에도 여전히 총을 들고 있는지 확인하고 복원합니다.
        // (그 사이에 주먹으로 바뀌었을 수 있음)
        if (S.currentWeapon === 'gun' && !S.isSwappingWeapon) {
            S.dom.weaponSpriteEl.src = restoreSrc;
        }
    }, 60);
}


// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 플레이어의 현재 체력에 따라 상태 창의 얼굴 이미지를 변경합니다.
 * @param {string|null} overrideFaceKey - 특정 얼굴(예: 피격 반응)을 일시적으로 표시할 스프라이트 키.
 */
function updateStatusFace(overrideFaceKey = null) {
    const faceImg = S.dom.statusFaceImgEl;
    if (!faceImg) return;

    let faceKeyToShow = overrideFaceKey;

    if (!faceKeyToShow) {
        // 플레이어 체력 비율에 따라 다른 얼굴 스프라이트 키를 선택합니다.
        const healthRatio = S.player.hp / S.player.maxHp;
        if (healthRatio > 0.7) faceKeyToShow = C.FACE_SPRITES.HEALTHY;
        else if (healthRatio > 0.3) faceKeyToShow = C.FACE_SPRITES.HURT;
        else faceKeyToShow = C.FACE_SPRITES.BLOODY;
    }

    // 표시할 얼굴 텍스처를 찾고, 없으면 플레이схолдер를 사용합니다.
    const faceTexture = S.textures[faceKeyToShow];
    const placeholderTexture = S.textures['placeholder'];
    let newSrc = '';

    if (faceTexture && faceTexture.img) {
        newSrc = faceTexture.img.src;
    } else if (placeholderTexture && placeholderTexture.img) {
        newSrc = placeholderTexture.img.src;
        console.warn(`Status face sprite not found: ${faceKeyToShow}. Using placeholder.`);
    }

    // 현재 이미지와 다를 경우에만 src를 변경하여 불필요한 DOM 조작을 방지합니다.
    if (newSrc && faceImg.src !== newSrc) {
        faceImg.src = newSrc;
    }
}

/**
 * 현재 선택된 무기에 맞는 스프라이트를 화면에 표시합니다.
 */
function updateWeaponSprite() {
    const weaponData = C.WEAPONS[S.currentWeapon];
    if (!weaponData) return;
    const textureKey = weaponData.sprite;
    
    // 표시할 무기 텍스처를 찾고, 없으면 플레이схолдер를 사용합니다.
    const weaponTexture = S.textures[textureKey];
    const placeholderTexture = S.textures['placeholder'];
    let newSrc = '';

    if (weaponTexture && weaponTexture.img) {
        newSrc = weaponTexture.img.src;
    } else if (placeholderTexture && placeholderTexture.img) {
        newSrc = placeholderTexture.img.src;
        console.warn(`Weapon sprite not found: ${textureKey}. Using placeholder.`);
    }
    
    // 현재 이미지와 다를 경우에만 src를 변경합니다.
    if (newSrc && S.dom.weaponSpriteEl.src !== newSrc) {
        S.dom.weaponSpriteEl.src = newSrc;
    }
}

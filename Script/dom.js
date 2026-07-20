/**
 * @fileoverview HTML 문서의 주요 요소에 대한 참조를 모아 둡니다.
 *
 * 이전에는 이 참조들이 state.js 안에 있어 시뮬레이션 상태와 뷰가 뒤섞여 있었고,
 * 18개의 getElementById가 null 검사 없이 실행되어 id 오타 하나에
 * 첫 프레임의 updateHUD()에서 정체를 알 수 없는 오류로 죽었습니다.
 * bindDom()은 누락된 요소를 한 번에 모아 보고하므로 원인이 즉시 드러납니다.
 */

/** @description HTML 문서의 주요 UI 요소들에 대한 참조 */
export const dom = {
    canvas: null,
    ctx: null,
    offscreenCanvas: null,
    offscreenCtx: null,
    viewport: null,
    playerHpEl: null,
    playerAmmoEl: null,
    hpBarFillEl: null,
    mpBarFillEl: null,
    floorCountEl: null,
    runeCountEl: null,
    wieldedWeaponEl: null,
    enemyCountEl: null,
    gameTimeEl: null,
    buffListEl: null,
    inventoryEl: null,
    inventoryHeaderEl: null,
    inventoryTitleEl: null,
    inventoryToggleEl: null,
    inventoryBodyEl: null,
    statusFaceEl: null,
    statusFaceImgEl: null,
    weaponSpriteEl: null,
    bloodSplatterEl: null,
    messageLogEl: null,
    startScreen: null,
    gameOverScreen: null,
    titleSplashEl: null,
    startGameBtn: null,
    restartGameBtn: null,
    finalFloorEl: null,
    lookZone: null,
    moveStickZone: null,
    moveStick: null,
    shootBtn: null,
    mobileControls: null,
};

/**
 * @description dom의 각 키가 어떤 셀렉터로 조회되는지 정의한 표.
 * JS가 HTML 구조에 의존하는 지점을 이 한 곳에 모아, 마크업 변경 시
 * 코드 전체를 뒤지지 않고 이 표만 고치면 되도록 했습니다.
 */
const SELECTORS = {
    canvas: '#game-canvas',
    viewport: '#viewport',
    playerHpEl: '#player-hp',
    playerAmmoEl: '#player-ammo',
    hpBarFillEl: '#hp-bar-fill',
    mpBarFillEl: '#mp-bar-fill',
    floorCountEl: '#floor-count',
    runeCountEl: '#rune-count',
    wieldedWeaponEl: '#wielded-weapon',
    enemyCountEl: '#enemy-count',
    gameTimeEl: '#game-time',
    buffListEl: '#buff-list',
    inventoryEl: '#inventory',
    inventoryHeaderEl: '#inventory-header',
    inventoryTitleEl: '#inventory-title',
    inventoryToggleEl: '#inventory-toggle',
    inventoryBodyEl: '#inventory-body',
    statusFaceEl: '#status-face',
    statusFaceImgEl: '#status-face-img',
    weaponSpriteEl: '#weapon-sprite',
    bloodSplatterEl: '.blood-splatter',
    messageLogEl: '#message-log',
    startScreen: '#start-screen',
    gameOverScreen: '#game-over-screen',
    titleSplashEl: '#title-splash',
    startGameBtn: '#start-game-btn',
    restartGameBtn: '#restart-game-btn',
    finalFloorEl: '#final-floor',
    lookZone: '#look-zone',
    moveStickZone: '#move-stick-zone',
    moveStick: '#move-stick',
    shootBtn: '#shoot-btn',
    mobileControls: '#mobile-controls',
};

/**
 * HTML에서 모든 UI 요소를 찾아 dom 객체에 채우고, 오프스크린 캔버스를 준비합니다.
 * @throws {Error} 필수 요소를 하나라도 찾지 못하면 누락된 목록 전체를 담아 던집니다.
 */
export function bindDom() {
    const missing = [];

    for (const [key, selector] of Object.entries(SELECTORS)) {
        const element = document.querySelector(selector);
        if (!element) missing.push(`${key} (${selector})`);
        dom[key] = element;
    }

    if (missing.length > 0) {
        throw new Error(
            `HTML에서 다음 UI 요소를 찾을 수 없습니다:\n  - ${missing.join('\n  - ')}\n` +
            `index HTML의 id/class가 dom.js의 SELECTORS와 일치하는지 확인하십시오.`
        );
    }

    dom.ctx = dom.canvas.getContext('2d');
    dom.offscreenCanvas = document.createElement('canvas');
    dom.offscreenCtx = dom.offscreenCanvas.getContext('2d', { willReadFrequently: true });
}

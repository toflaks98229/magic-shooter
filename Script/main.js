/**
 * @fileoverview 이 파일은 게임의 메인 진입점(Entry Point)입니다.
 * 모든 모듈을 가져와 초기화하고 게임 루프를 시작하며, 게임의 전반적인 흐름을 제어합니다.
 *
 * 이전에는 gameOver/playSound/nextFloor를 window에 붙여 다른 모듈이 역방향으로
 * 호출했지만, 이제는 게임 이벤트를 구독하는 방식으로 바뀌어 전역 오염이 사라졌습니다.
 */

// --- 모듈 임포트 ---
import * as C from './constants.js';
import * as A from './actions.js';
import { world, resetWorld } from './world.js';
import { runtime, resetRuntime } from './runtime.js';
import { assets } from './assets.js';
import { dom, bindDom } from './dom.js';
import { on, EVENTS } from './events.js';
import { generateDungeon } from './mapGenerator.js';
import { setupInputHandlers } from './input.js';
import { render, resizeCanvas, loadAssets } from './render.js';
import { update, spawnEnemiesForFloor, registerGameplayHandlers } from './gameLogic.js';
import { updateHUD, registerUiHandlers } from './ui.js';
import { initAudio, registerAudioHandlers } from './audio.js';

// --- 모듈 스코프 변수 (Private Member Variables) ---

/** @description 마지막 프레임의 타임스탬프. deltaTime 계산에 사용됩니다. */
let lastTime = 0;
/** @description 웹 오디오 API를 사용하기 위한 오디오 컨텍스트. 사용자의 첫 상호작용 시 생성됩니다. */
let audioCtx = null;
/** @description 게임 루프가 이미 돌고 있는지 여부. 재시작 시 루프가 중복 실행되는 것을 막습니다. */
let isLoopRunning = false;

// --- 게임 생명주기 함수 ---

/**
 * HTML 문서가 로드된 후 가장 먼저 호출되어 게임의 모든 요소를 초기화하고 이벤트 리스너를 설정합니다.
 */
function init() {
    // 1. DOM 요소를 찾아 바인딩합니다. 누락된 요소가 있으면 여기서 명확한 오류로 중단됩니다.
    bindDom();

    // 2. 표현 계층이 게임 이벤트를 구독하도록 등록합니다.
    registerUiHandlers();
    registerAudioHandlers();
    registerGameplayHandlers();
    registerGameFlowHandlers();

    // 3. 브라우저 이벤트 리스너 설정
    window.addEventListener('resize', resizeCanvas); // 창 크기가 변경될 때마다 캔버스 크기 조정
    dom.startGameBtn.addEventListener('click', handleStartClick);
    dom.restartGameBtn.addEventListener('click', startGame); // 재시작 버튼

    // 4. 캔버스 초기화 및 입력 핸들러 설정
    resizeCanvas(); // 최초 캔버스 크기 설정
    setupInputHandlers(); // 키보드, 마우스, 터치 입력 설정
}

/**
 * 게임 흐름(사망, 출구 도달)에 반응하는 핸들러를 등록합니다.
 * 이전의 window.gameOver / window.nextFloor를 대체합니다.
 */
function registerGameFlowHandlers() {
    on(EVENTS.PLAYER_DIED, gameOver);
    on(EVENTS.EXIT_REACHED, nextFloor);
}

/**
 * START 버튼 클릭을 처리합니다. 에셋을 로드한 뒤 게임을 시작합니다.
 */
function handleStartClick() {
    // 오디오 컨텍스트 초기화 (브라우저 정책상 사용자 상호작용이 있을 때만 가능)
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        initAudio(audioCtx);
    }

    dom.startGameBtn.disabled = true;
    dom.startGameBtn.textContent = 'LOADING...';

    // 모든 에셋(이미지, 사운드)을 로드한 후 게임을 시작합니다.
    loadAssets(audioCtx).then(() => {
        dom.startGameBtn.disabled = false;
        dom.startGameBtn.textContent = 'START';
        startGame();
        startLoop();
    }).catch(err => {
        dom.startGameBtn.textContent = 'ERROR - Check Console';
        console.error('에셋 로딩 중 오류 발생:', err);
    });
}

/**
 * 게임 루프를 시작합니다. 이미 돌고 있다면 아무것도 하지 않습니다.
 */
function startLoop() {
    if (isLoopRunning) return;
    isLoopRunning = true;
    lastTime = 0; // 다음 프레임에서 현재 타임스탬프로 다시 맞춰집니다.
    requestAnimationFrame(gameLoop);
}

/**
 * 매 프레임마다 게임 상태를 업데이트하고 화면을 다시 그리는 메인 게임 루프.
 * @param {number} timestamp - requestAnimationFrame이 제공하는 현재 시간
 */
function gameLoop(timestamp = 0) {
    // 첫 프레임에는 lastTime이 0이므로 deltaTime이 타임스탬프 전체(수천 ms)가 되어버립니다.
    // 기준 시간을 현재 타임스탬프로 맞춰 첫 프레임의 deltaTime을 0으로 만듭니다.
    if (lastTime === 0) lastTime = timestamp;

    const rawDeltaTime = timestamp - lastTime; // 이전 프레임과의 실제 시간 간격
    lastTime = timestamp;

    // 탭 전환 등으로 프레임 간격이 크게 벌어진 경우, 시뮬레이션에 반영할 시간을 제한합니다.
    // 제한하지 않으면 한 프레임의 이동량이 타일 크기를 넘어서 벽을 통과할 수 있습니다.
    const deltaTime = Math.min(rawDeltaTime, C.MAX_FRAME_TIME);

    if (runtime.isGameRunning && deltaTime > 0) {
        update(deltaTime); // 게임 로직 업데이트 (gameLogic.js)
        render();          // 화면 렌더링 (render.js)
        updateHUD();       // HUD 갱신 (ui.js)
    }

    requestAnimationFrame(gameLoop); // 다음 프레임에 gameLoop를 재귀적으로 호출
}

// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 게임을 시작하는 함수.
 * 초기화면을 숨기고, 세계 상태를 새로 만들며, 첫 번째 층을 생성합니다.
 */
function startGame() {
    resetWorld();    // 월드를 초기 상태로 재생성 (이전 판의 잔재가 남지 않도록)
    resetRuntime();  // 흔들림 위상, 무기 교체 플래그 등 세션 상태도 초기화
    A.setGameRunning(true);

    generateNewFloor();

    dom.startScreen.style.display = 'none';
    dom.gameOverScreen.style.display = 'none';
    // 터치스크린이 아닌 데스크톱 환경에서만 마우스 포인터를 잠급니다.
    if (!('ontouchstart' in window)) {
        dom.canvas.requestPointerLock();
    }
    updateHUD();
}

/**
 * 게임 오버 처리를 담당합니다. PLAYER_DIED 이벤트에 반응합니다.
 */
function gameOver() {
    A.setGameRunning(false);
    dom.finalFloorEl.textContent = world.floor;
    dom.gameOverScreen.style.display = 'flex';
    document.exitPointerLock(); // 마우스 포인터 잠금 해제
}

/**
 * 다음 층(스테이지)으로 이동합니다. EXIT_REACHED 이벤트에 반응합니다.
 */
function nextFloor() {
    A.setFloor(world.floor + 1);
    // 다음 층으로 갈 때 체력과 탄약을 약간 보상해줍니다.
    A.healPlayer(C.FLOOR_CLEAR_HEAL);
    A.giveAmmo(C.FLOOR_CLEAR_AMMO);
    generateNewFloor();
    updateHUD();
}

/**
 * 새로운 층을 생성하고 맵과 엔티티를 재설정합니다.
 */
function generateNewFloor() {
    applyFloorTheme();

    // 새로운 던전 맵 생성
    const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, 15, 4, 8);
    world.map = dungeon.map;
    world.objectMap = dungeon.objectMap;

    // 플레이어를 맵의 시작 지점으로 이동
    world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;

    // 기존의 모든 엔티티(적, 발사체, 아이템, 파티클)를 제거
    world.enemies.length = 0;
    world.projectiles.length = 0;
    world.items.length = 0;
    world.particles.length = 0;
    world.animatedObjects.length = 0;
    world.animatedWalls.length = 0;

    // 새로운 층에 맞는 적들을 스폰
    spawnEnemiesForFloor();
}

/**
 * dungeon_progression.json을 참조해 현재 층의 테마를 world에 기록합니다.
 * 텍스처 자체가 아니라 '이름'만 저장하므로 world는 직렬화 가능한 상태로 유지됩니다.
 */
function applyFloorTheme() {
    const progression = assets.dungeonProgression;
    let themeInfo;

    // 1. 현재 층(world.floor)에 해당하는 설정을 찾습니다.
    if (progression && progression.floors) {
        themeInfo = progression.floors.find(f => f.floor === world.floor);
    }

    // 2. 현재 층에 대한 설정이 없으면, default 설정을 사용합니다.
    if (!themeInfo && progression && progression.default) {
        themeInfo = progression.default;
        console.log(`No specific theme for floor ${world.floor}. Using default theme.`);
    }

    // 3. themeInfo가 유효하지 않으면 테마 없이(폴백 텍스처로) 렌더링합니다.
    if (!themeInfo || !themeInfo.theme || !themeInfo.variation) {
        world.themeName = null;
        world.themeVariation = null;
        console.warn(`No theme information found for floor ${world.floor} in dungeon_progression.json. Using fallback textures.`);
        return;
    }

    world.themeName = themeInfo.theme;
    world.themeVariation = themeInfo.variation;
    console.log(`Floor ${world.floor} theme set to: ${themeInfo.theme} - variation_${themeInfo.variation}`);
}

// --- 스크립트 실행 ---
// type="module" 스크립트는 문서 파싱이 끝난 뒤 실행되므로 DOM이 준비되어 있습니다.
init();

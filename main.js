/**
 * @fileoverview 이 파일은 게임의 메인 진입점(Entry Point)입니다.
 * 모든 모듈을 가져와 초기화하고 게임 루프를 시작하며, 게임의 전반적인 흐름을 제어합니다.
 */

// --- 모듈 임포트 ---
import * as C from './constants.js';
import * as S from './state.js';
import { generateDungeon } from './mapGenerator.js';
import { setupInputHandlers } from './input.js';
import { render, resizeCanvas, loadAssets } from './render.js';
import { update, spawnEnemiesForFloor } from './gameLogic.js';
import { updateHUD } from './ui.js';

// --- 모듈 스코프 변수 (Private Member Variables) ---

/** @description 마지막 프레임의 타임스탬프. deltaTime 계산에 사용됩니다. */
let lastTime = 0;
/** @description 웹 오디오 API를 사용하기 위한 오디오 컨텍스트. 사용자의 첫 상호작용 시 생성됩니다. */
let audioCtx = null;

// --- 게임 생명주기 함수 ---

/**
 * HTML 문서가 로드된 후 가장 먼저 호출되어 게임의 모든 요소를 초기화하고 이벤트 리스너를 설정합니다.
 */
function init() {
    // 1. DOM 요소들을 State 객체에 할당하여 모든 모듈에서 쉽게 참조할 수 있게 합니다.
    S.dom.canvas = document.getElementById('game-canvas');
    S.dom.ctx = S.dom.canvas.getContext('2d');
    S.dom.offscreenCanvas = document.createElement('canvas');
    S.dom.offscreenCtx = S.dom.offscreenCanvas.getContext('2d', { willReadFrequently: true });
    S.dom.playerHpEl = document.getElementById('player-hp');
    S.dom.playerAmmoEl = document.getElementById('player-ammo');
    S.dom.floorCountEl = document.getElementById('floor-count');
    S.dom.enemyCountEl = document.getElementById('enemy-count');
    S.dom.statusFaceEl = document.getElementById('status-face');
    S.dom.statusFaceImgEl = document.getElementById('status-face-img');
    S.dom.weaponSpriteEl = document.getElementById('weapon-sprite');
    S.dom.bloodSplatterEl = document.querySelector('.blood-splatter');
    S.dom.startScreen = document.getElementById('start-screen');
    S.dom.gameOverScreen = document.getElementById('game-over-screen');
    S.dom.startGameBtn = document.getElementById('start-game-btn');
    S.dom.restartGameBtn = document.getElementById('restart-game-btn');
    S.dom.finalFloorEl = document.getElementById('final-floor');
    S.dom.lookZone = document.getElementById('look-zone');
    S.dom.moveStickZone = document.getElementById('move-stick-zone');
    S.dom.moveStick = document.getElementById('move-stick');
    S.dom.shootBtn = document.getElementById('shoot-btn');
    S.dom.mobileControls = document.getElementById('mobile-controls');

    // 2. 이벤트 리스너 설정
    window.addEventListener('resize', resizeCanvas); // 창 크기가 변경될 때마다 캔버스 크기 조정
    S.dom.startGameBtn.addEventListener('click', () => { // 시작 버튼 클릭 이벤트
        // 오디오 컨텍스트 초기화 (브라우저 정책상 사용자 상호작용이 있을 때만 가능)
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        S.dom.startGameBtn.disabled = true;
        S.dom.startGameBtn.textContent = "LOADING...";

        // 모든 에셋(이미지, 사운드)을 로드한 후 게임을 시작합니다.
        loadAssets(audioCtx).then(() => {
            S.dom.startGameBtn.disabled = false;
            S.dom.startGameBtn.textContent = "START";
            startGame();
            requestAnimationFrame(gameLoop); // 게임 루프 시작
        }).catch(err => {
            S.dom.startGameBtn.textContent = "ERROR - Check Console";
            console.error("에셋 로딩 중 오류 발생:", err);
        });
    });
    S.dom.restartGameBtn.addEventListener('click', startGame); // 재시작 버튼 클릭 이벤트

    // 3. 캔버스 초기화 및 입력 핸들러 설정
    resizeCanvas(); // 최초 캔버스 크기 설정
    setupInputHandlers(); // 키보드, 마우스, 터치 입력 설정

    // 4. 다른 모듈에서 전역적으로 호출할 수 있도록 주요 함수들을 window 객체에 할당합니다.
    window.gameOver = gameOver;
    window.playSound = playSound;
    window.nextFloor = nextFloor;
}

/**
 * 매 프레임마다 게임 상태를 업데이트하고 화면을 다시 그리는 메인 게임 루프.
 * @param {number} timestamp - requestAnimationFrame이 제공하는 현재 시간
 */
function gameLoop(timestamp = 0) {
    const deltaTime = timestamp - lastTime; // 이전 프레임과의 시간 간격
    lastTime = timestamp;

    if (S.isGameRunning && deltaTime > 0) {
        update(deltaTime); // 게임 로직 업데이트 (gameLogic.js)
        render();          // 화면 렌더링 (render.js)
    }

    requestAnimationFrame(gameLoop); // 다음 프레임에 gameLoop를 재귀적으로 호출
}

// --- 외부 공개 함수 (Public Methods, window 객체를 통해 노출) ---

/**
 * 지정된 키에 해당하는 사운드를 재생합니다.
 * @param {string} key - constants.js의 SOUNDS 객체에 정의된 사운드 키
 */
export function playSound(key) {
    if (!audioCtx || !S.sounds[key]) return; // 오디오 컨텍스트나 사운드 버퍼가 없으면 중단

    const source = audioCtx.createBufferSource(); // 사운드 소스 생성
    source.buffer = S.sounds[key];              // 재생할 오디오 데이터(버퍼) 할당
    source.connect(audioCtx.destination);       // 스피커에 연결
    source.start(0);                            // 즉시 재생
}

// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 게임을 시작하는 함수.
 * 초기화면을 숨기고, 플레이어 상태를 리셋하며, 첫 번째 층을 생성합니다.
 */
function startGame() {
    S.setGameRunning(true);
    S.setFloor(1);
    resetPlayer();
    generateNewFloor();

    S.dom.startScreen.style.display = 'none';
    S.dom.gameOverScreen.style.display = 'none';
    // 터치스크린이 아닌 데스크톱 환경에서만 마우스 포인터를 잠급니다.
    if (!('ontouchstart' in window)) {
        S.dom.canvas.requestPointerLock();
    }
    updateHUD();
}

/**
 * 게임 오버 처리를 담당하는 함수.
 * 게임 루프를 멈추고 게임 오버 화면을 표시합니다.
 */
function gameOver() {
    S.setGameRunning(false);
    S.dom.finalFloorEl.textContent = S.floor;
    S.dom.gameOverScreen.style.display = 'flex';
    document.exitPointerLock(); // 마우스 포인터 잠금 해제
}

/**
 * 다음 층(스테이지)으로 이동하는 함수.
 * 출구에 도달했을 때 호출됩니다.
 */
function nextFloor() {
    S.setFloor(S.floor + 1);
    // 다음 층으로 갈 때 체력과 탄약을 약간 보상해줍니다.
    S.player.hp = Math.min(S.player.maxHp, S.player.hp + 15);
    S.player.ammo = Math.min(S.player.maxAmmo, S.player.ammo + 10);
    generateNewFloor();
    updateHUD();
}

/**
 * 새로운 층을 생성하고 맵과 엔티티를 재설정하는 함수.
 */
function generateNewFloor() {
    // --- 테마 시스템 수정: dungeon_progression.json 기반으로 변경 ---
    let themeInfo;
    
    // 1. S.dungeonProgression 데이터에서 현재 층(S.floor)에 해당하는 설정을 찾습니다.
    if (S.dungeonProgression && S.dungeonProgression.floors) {
        themeInfo = S.dungeonProgression.floors.find(f => f.floor === S.floor);
    }

    // 2. 현재 층에 대한 설정이 없으면, default 설정을 사용합니다.
    if (!themeInfo && S.dungeonProgression && S.dungeonProgression.default) {
        themeInfo = S.dungeonProgression.default;
        console.log(`No specific theme for floor ${S.floor}. Using default theme.`);
    }

    // 3. themeInfo가 유효한지 확인하고 테마를 설정합니다.
    if (themeInfo && themeInfo.theme && themeInfo.variation) {
        const themeName = themeInfo.theme;
        const variationName = `variation_${themeInfo.variation}`;
        const themeObject = S.dungeonThemes[themeName];

        if (themeObject && themeObject[variationName]) {
            // 최종 선택된 테마 유형을 현재 층의 테마로 설정
            S.setCurrentDungeonTheme(themeObject[variationName]);
            console.log(`Floor ${S.floor} theme set to: ${themeName} - ${variationName}`);
        } else {
            S.setCurrentDungeonTheme(null);
            console.warn(`Theme or variation not found in loaded themes: ${themeName} - ${variationName}. Using fallback.`);
        }
    } else {
        S.setCurrentDungeonTheme(null); // 테마가 없으면 null로 설정
        console.warn(`No theme information found for floor ${S.floor} in dungeon_progression.json. Using fallback textures.`);
    }
    // --- 테마 시스템 끝 ---

    // 새로운 던전 맵 생성
    const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, 15, 4, 8);
    S.setMap(dungeon.map);

    // 플레이어를 맵의 시작 지점으로 이동
    S.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
    S.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;

    // 기존의 모든 엔티티(적, 발사체, 아이템, 파티클)를 제거
    S.enemies.length = 0;
    S.projectiles.length = 0;
    S.items.length = 0;
    S.particles.length = 0;
    
    // 새로운 층에 맞는 적들을 스폰
    spawnEnemiesForFloor();
}

/**
 * 플레이어의 상태(체력, 탄약 등)를 게임 시작 상태로 초기화하는 함수.
 */
function resetPlayer() {
    S.player.angle = Math.PI / 2;
    S.player.hp = S.player.maxHp;
    S.player.ammo = 50;
    S.setCurrentWeapon('gun');
}

// --- 스크립트 실행 ---
// HTML 문서의 모든 요소가 로드된 후 init 함수를 호출하여 게임을 준비합니다.
init();


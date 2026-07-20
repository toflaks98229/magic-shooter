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
import { getBranch, formatLocation } from './branches.js';
import { rollItem } from './items.js';
import { setupInputHandlers, clearInputQueue } from './input.js';
import { render, resizeCanvas, loadAssets } from './render.js';
import { spawnEnemiesForFloor } from './gameLogic.js';
import { advanceSimulation, resetLoop } from './loop.js';
import { updateHUD, registerUiHandlers, invalidateSpriteCache } from './ui.js';
import { initAudio, registerAudioHandlers } from './audio.js';
import { registerMessageHandlers, clearMessages } from './messages.js';
import { startCharacterCreation } from './chargen.js';
import { applyCharacter } from './character.js';
import { SPECIES } from './species.js';
import { GODS, allGods, canWorship } from './gods.js';
import { addToInventory } from './inventory.js';

// --- 모듈 스코프 변수 (Private Member Variables) ---

/** @description 마지막 프레임의 타임스탬프. deltaTime 계산에 사용됩니다. */
let lastTime = 0;
/** @description 웹 오디오 API를 사용하기 위한 오디오 컨텍스트. 사용자의 첫 상호작용 시 생성됩니다. */
let audioCtx = null;
/** @description 게임 루프가 이미 돌고 있는지 여부. 재시작 시 루프가 중복 실행되는 것을 막습니다. */
let isLoopRunning = false;
/** @description 직전에 고른 종족과 직업. 다시 시작할 때 그대로 씁니다. */
let lastSpecies = 'human';
let lastBackground = 'fighter';

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
    registerMessageHandlers();
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
    on(EVENTS.BRANCH_ENTERED, enterBranchFloor);
    on(EVENTS.RUNE_COLLECTED, ({ branch, total }) => {
        console.log(`${getBranch(branch).name}의 룬을 획득했습니다. (총 ${total}개)`);
    });
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
        dom.startGameBtn.textContent = '(a) 새 탐험 시작';
        // 이제 그림이 준비되었으므로 소지품과 상태 표시를 다시 그리게 합니다.
        invalidateSpriteCache();
        // 에셋이 준비된 뒤에 종족과 직업을 고릅니다. 다 고르면 startGame 이 불립니다.
        startCharacterCreation((species, background) => {
            startGame(species, background);
            startLoop();
        });
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

    if (runtime.isGameRunning) {
        // 시뮬레이션은 고정 크기 스텝으로만 전진합니다. 프레임레이트와 무관하게 결과가 같습니다.
        // 프레임 간격이 지나치게 큰 경우의 상한 처리는 advanceSimulation 안에서 이뤄집니다.
        advanceSimulation(rawDeltaTime);
        // 렌더링은 매 화면 프레임마다 수행합니다.
        // (스텝이 없었더라도 창 크기 변경 등으로 다시 그려야 할 수 있습니다.)
        render();
        updateHUD();
    }

    requestAnimationFrame(gameLoop); // 다음 프레임에 gameLoop를 재귀적으로 호출
}

// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 게임을 시작하는 함수.
 * 초기화면을 숨기고, 세계 상태를 새로 만들며, 첫 번째 층을 생성합니다.
 */
function startGame(species = lastSpecies, background = lastBackground) {
    // 다시 시작할 때는 직전에 고른 캐릭터를 그대로 씁니다. 매번 다시 고르게 하면 번거롭습니다.
    lastSpecies = species;
    lastBackground = background;

    resetWorld();       // 월드를 초기 상태로 재생성 (이전 판의 잔재가 남지 않도록)
    A.rollBranchEntrances(); // 어느 층에 어떤 하위 던전 입구가 놓일지 이번 판에서 한 번만 정합니다
    resetRuntime();     // 흔들림 위상, 무기 교체 플래그 등 세션 상태도 초기화
    resetLoop();        // 누산기에 남아 있던 시간 제거
    clearInputQueue();  // 이전 판에서 쌓인 입력이 새 판에 반영되지 않도록 비움
    clearMessages();    // 이전 판의 알림이 남아 있지 않도록 비움
    A.setGameRunning(true);

    // 종족과 직업을 반영합니다. 최대 체력과 마력이 여기서 정해지므로 층을 만들기 전에 해야 합니다.
    const startingItems = applyCharacter(species, background);
    for (const itemId of startingItems) addToInventory(world.inventory, itemId);

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
    dom.finalFloorEl.textContent = formatLocation(world.branch, world.floor);
    dom.gameOverScreen.style.display = 'flex';
    document.exitPointerLock(); // 마우스 포인터 잠금 해제
}

/**
 * 출구에 도달했을 때의 처리. EXIT_REACHED 이벤트에 반응합니다.
 *
 * 현재 가지에 더 내려갈 층이 남았으면 내려가고,
 * 최하층이라면 왔던 상위 던전으로 되돌아갑니다.
 */
function nextFloor() {
    const branch = getBranch(world.branch);

    if (world.floor >= branch.depth && world.parentStack.length > 0) {
        // 이 가지의 끝. 룬이 있는 가지였다면 챙기고 상위 던전으로 복귀합니다.
        if (branch.rune) A.collectRune(branch.id);
        A.returnToParent();
        restoreFloorAfterReturn();
        return;
    }

    A.setFloor(world.floor + 1);
    // 다음 층으로 갈 때 체력과 탄약을 약간 보상해줍니다.
    A.healPlayer(C.FLOOR_CLEAR_HEAL);
    A.giveAmmo(C.FLOOR_CLEAR_AMMO);
    generateNewFloor();
    updateHUD();
}

/**
 * 하위 던전에 진입했을 때 첫 층을 만듭니다. BRANCH_ENTERED 이벤트에 반응합니다.
 */
function enterBranchFloor({ name }) {
    console.log(`${name}에 진입했습니다. (${formatLocation(world.branch, world.floor)})`);
    generateNewFloor();
    updateHUD();
}

/**
 * 상위 던전으로 되돌아왔을 때의 처리.
 * 지형과 적은 스택에서 그대로 복원되었으므로 다시 만들지 않습니다.
 * 이것이 서브 던전 스택의 핵심입니다. 나갔다 돌아오면 떠날 때 그 자리입니다.
 */
function restoreFloorAfterReturn() {
    console.log(`${getBranch(world.branch).name}으로 돌아왔습니다. (${formatLocation(world.branch, world.floor)})`);
    updateHUD();
}

/**
 * 새로운 층을 생성하고 맵과 엔티티를 재설정합니다.
 */
function generateNewFloor() {
    applyFloorTheme();

    // 새로운 던전 맵 생성
    // 어느 가지 몇 층인지에 따라 층의 모양이 달라집니다. (원본 layout.des 의 표를 따릅니다)
    const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, {
        branch: world.branch,
        floor: world.floor,
    });
    world.map = dungeon.map;
    world.objectMap = dungeon.objectMap;
    placeBranchEntrances(dungeon);
    placeAltar(dungeon);
    placePortal(dungeon);

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

    // 포탈 던전은 짧은 대신 보상이 두둑합니다.
    const branch = getBranch(world.branch);
    if (branch.isPortal) scatterBonusItems(branch.bonusItems);
}

/**
 * 포탈 던전의 보상 아이템을 바닥에 흩뿌립니다.
 * @param {number} count - 배치할 아이템 수
 */
function scatterBonusItems(count) {
    const floors = [];
    for (let y = 0; y < world.map.length; y++) {
        for (let x = 0; x < world.map[y].length; x++) {
            if (C.tileAt(world.map, x, y).spawnable) floors.push({ x, y });
        }
    }
    if (floors.length === 0) return;

    const dangerLevel = A.currentDangerLevel();
    for (let i = 0; i < count; i++) {
        const spot = floors[Math.floor(Math.random() * floors.length)];
        const itemId = rollItem(dangerLevel);
        if (itemId) {
            A.dropItem(itemId, spot.x * C.TILE_SIZE + C.TILE_SIZE / 2, spot.y * C.TILE_SIZE + C.TILE_SIZE / 2);
        }
    }
}

/**
 * 이 층에 놓여야 할 하위 던전 입구를 맵에 배치합니다.
 * 어느 층에 무엇이 놓일지는 게임 시작 시 정해져 있으므로 여기서는 자리만 찾습니다.
 * @param {{map: number[][], playerStart: {x: number, y: number}}} dungeon - 방금 생성된 던전
 */
function placeBranchEntrances(dungeon) {
    world.entrances = [];

    for (const branchId of A.branchEntrancesForCurrentFloor()) {
        const spot = findEntranceSpot(dungeon);
        if (!spot) {
            console.warn(`${getBranch(branchId).name}의 입구를 놓을 자리를 찾지 못했습니다.`);
            continue;
        }
        world.map[spot.y][spot.x] = C.TILE_IDS.BRANCH_ENTRANCE;
        world.entrances.push({ tileX: spot.x, tileY: spot.y, branch: branchId });
        console.log(`${getBranch(branchId).name}의 입구가 ${formatLocation(world.branch, world.floor)}에 있습니다.`);
    }
}

/**
 * 이번 층에 제단이 놓이는지 굴리고, 놓인다면 배치합니다.
 *
 * 원본에서 제단은 흔하지 않습니다. 층마다 있으면 아무 때나 갈아탈 수 있어
 * 신을 고르는 일이 가벼워지기 때문입니다. 대략 네 층에 하나꼴로 둡니다.
 *
 * 어떤 신의 제단인지는 층마다 새로 굴립니다. 다만 지금 종족이 섬길 수 없는 신
 * (언데드에게 선한 신 같은)은 후보에서 빼 둡니다. 걸어가서 거부당하기만 하는
 * 제단은 놀리는 것이나 다름없기 때문입니다.
 * @param {{playerStart: {x: number, y: number}}} dungeon - 방금 생성된 던전
 */
function placeAltar(dungeon) {
    world.altars = [];
    if (Math.random() > 0.25) return;

    const species = SPECIES[world.player.species];
    const candidates = allGods().filter(id => canWorship(id, species).allowed);
    if (candidates.length === 0) return;   // 데미갓은 제단을 만나지 않습니다.

    const spot = findEntranceSpot(dungeon);
    if (!spot) return;

    const god = candidates[Math.floor(Math.random() * candidates.length)];
    world.map[spot.y][spot.x] = C.TILE_IDS.ALTAR;
    world.altars.push({ tileX: spot.x, tileY: spot.y, god });
    console.log(`${GODS[god].name}의 제단이 ${formatLocation(world.branch, world.floor)}에 있습니다.`);
}

/**
 * 이번 층에 포탈이 열리는지 굴리고, 열린다면 맵에 배치합니다.
 * 확률로 결정되므로 대부분의 층에는 아무것도 생기지 않습니다.
 * @param {{playerStart: {x: number, y: number}}} dungeon - 방금 생성된 던전
 */
function placePortal(dungeon) {
    world.portals = [];

    const portal = A.rollPortalForCurrentFloor();
    if (!portal) return;

    const spot = findEntranceSpot(dungeon);
    if (!spot) return;

    world.map[spot.y][spot.x] = C.TILE_IDS.PORTAL;
    A.openPortal(portal, spot.x, spot.y);
}

/**
 * 입구를 놓을 바닥 칸을 찾습니다. 플레이어 시작 지점과 이미 놓인 입구는 피합니다.
 * @param {{map: number[][], playerStart: {x: number, y: number}}} dungeon - 대상 던전
 * @returns {{x: number, y: number}|null} 찾은 좌표
 */
function findEntranceSpot(dungeon) {
    const candidates = [];
    for (let y = 0; y < world.map.length; y++) {
        for (let x = 0; x < world.map[y].length; x++) {
            if (!C.tileAt(world.map, x, y).spawnable) continue;
            if (x === dungeon.playerStart.x && y === dungeon.playerStart.y) continue;
            candidates.push({ x, y });
        }
    }
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * dungeon_progression.json을 참조해 현재 층의 테마를 world에 기록합니다.
 * 텍스처 자체가 아니라 '이름'만 저장하므로 world는 직렬화 가능한 상태로 유지됩니다.
 */
function applyFloorTheme() {
    const branch = getBranch(world.branch);

    // 메인 던전이 아닌 가지는 자기 테마를 씁니다.
    // dungeon_progression.json은 메인 던전의 층별 연출을 위한 것입니다.
    if (branch.parent) {
        world.themeName = branch.theme;
        world.themeVariation = branch.themeVariation;
        return;
    }

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

/**
 * @fileoverview 이 파일은 게임의 모든 동적 상태를 저장하고 관리합니다.
 * 게임의 현재 상황을 나타내는 모든 변수는 여기에 포함됩니다.
 * 이 파일의 변수들은 다른 모든 모듈에서 import하여 참조하거나 수정합니다.
 */

// --- DOM 요소 참조 ---
/** @description HTML 문서의 주요 UI 요소들에 대한 참조를 저장하는 객체 */
export const dom = {
    canvas: null,
    ctx: null,
    offscreenCanvas: null,
    offscreenCtx: null,
    playerHpEl: null,
    playerAmmoEl: null,
    floorCountEl: null,
    enemyCountEl: null,
    statusFaceEl: null,
    statusFaceImgEl: null,
    weaponSpriteEl: null,
    bloodSplatterEl: null,
    startScreen: null,
    gameOverScreen: null,
    startGameBtn: null,
    restartGameBtn: null,
    finalFloorEl: null,
    lookZone: null,
    moveStickZone: null,
    moveStick: null,
    shootBtn: null,
    mobileControls: null,
};

// --- 게임 상태 변수 ---
/** @description 게임이 현재 실행 중인지 여부를 나타내는 플래그 */
export let isGameRunning = false;
/** @description isGameRunning 상태를 변경하는 함수 */
export function setGameRunning(status) { isGameRunning = status; }

/** @description 현재 플레이어가 있는 층(스테이지) */
export let floor = 1;
/** @description 현재 층을 변경하는 함수 */
export function setFloor(newFloor) { floor = newFloor; }

/** @description 현재 층의 맵 데이터 (2차원 배열) */
export let map = [];
/** @description 맵 데이터를 새로운 맵으로 교체하는 함수 */
export function setMap(newMap) { map = newMap; }

// --- 에셋 상태 변수 (다중 시트 지원) ---
/** @description 로드된 모든 스프라이트 시트 이미지 파일을 저장하는 객체 (e.g., { main: Image, walls: Image }) */
export const spriteSheets = {};
/** @description 파싱된 모든 스프라이트 시트 JSON 데이터를 저장하는 객체 (e.g., { main: atlas, walls: atlas }) */
export const spriteAtlases = {};
/** @description 각 스프라이트 키가 어느 시트에 속하는지 매핑하는 객체 (e.g., { player: 'main', wall1: 'walls' }) */
export const spriteKeyToSheet = {};
/** @description 스프라이트 시트에서 잘라낸 개별 텍스처/스프라이트 데이터(ImageData, Image)를 저장하는 객체 */
export const textures = {};
/** @description 로드된 모든 사운드 버퍼를 저장하는 객체 */
export const sounds = {};
/** @description 모든 에셋(텍스처, 사운드)의 로딩이 완료되면 resolve되는 Promise 객체 */
export let assetsPromise = null;
/** @description 에셋 로딩 Promise를 설정하는 함수 */
export function setAssetsPromise(promise) { assetsPromise = promise; }

/** @description 로드된 던전 진행도 데이터 (dungeon_progression.json) */
export let dungeonProgression = null;
/** @description 던전 진행도 데이터를 설정하는 함수 */
export function setDungeonProgression(data) { dungeonProgression = data; }

/** @description 감지된 모든 던전 테마를 저장하는 객체 */
export let dungeonThemes = {};
/** @description 현재 층에 적용된 던전 테마 객체 */
export let currentDungeonTheme = null;
/** @description 현재 던전 테마를 설정하는 함수 */
export function setCurrentDungeonTheme(theme) { currentDungeonTheme = theme; }


// --- 엔티티 상태 변수 ---
/** @description 플레이어의 모든 상태 정보를 담는 객체 */
export const player = {
    x: 0, y: 0, // 월드 좌표
    angle: Math.PI / 2, // 바라보는 각도 (라디안)
    hp: 100, // 현재 체력
    maxHp: 100, // 최대 체력
    size: 20, // 충돌 판정 크기
    ammo: 50, // 현재 탄약
    maxAmmo: 100, // 최대 탄약
};

/** @description 현재 맵에 존재하는 모든 적들의 배열 */
export let enemies = [];
/** @description 현재 맵에 존재하는 모든 발사체들의 배열 */
export let projectiles = [];
/** @description 현재 맵에 존재하는 모든 아이템들의 배열 */
export let items = [];
/** @description 현재 맵에 존재하는 모든 파티클들의 배열 */
export let particles = [];

// --- 렌더링 상태 변수 ---
/** @description 총 발사 등 동적인 광원 효과의 상태를 저장하는 객체 */
export let dynamicLight = { active: false, x: 0, y: 0, intensity: 0, falloff: 0.001 };
/** @description 동적 광원 상태를 설정하는 함수 */
export function setDynamicLight(lightState) {
    dynamicLight.active = lightState.active;
    dynamicLight.x = lightState.x;
    dynamicLight.y = lightState.y;
    dynamicLight.intensity = lightState.intensity;
    dynamicLight.falloff = lightState.falloff;
}

/** @description 렌더링에 사용될 화면 픽셀 데이터 (ImageData 객체) */
export let screenImageData = null;
/** @description 화면 픽셀 데이터를 설정하는 함수 */
export function setScreenData(data) { screenImageData = data; }

/** @description screenImageData의 32비트 버퍼 뷰 (빠른 픽셀 조작용) */
export let screenBuffer = null;
/** @description 화면 버퍼를 설정하는 함수 */
export function setScreenBuffer(buffer) { screenBuffer = buffer; }

/** @description 각 화면 컬럼(수직선)별 벽까지의 거리를 저장하는 배열 (스프라이트 렌더링 시 사용) */
export let zBuffer = [];
/** @description Z-버퍼를 설정하는 함수 */
export function setZBuffer(newBuffer) { zBuffer = newBuffer; }

/** @description 바닥/천장 렌더링 시 y좌표에 따른 거리를 미리 계산해둔 룩업 테이블 */
export let yDistLookup = [];
/** @description 거리 룩업 테이블을 설정하는 함수 */
export function setYDistLookup(newLookup) { yDistLookup = newLookup; }

// --- 입력 및 무기 상태 변수 ---
/** @description 플레이어가 현재 움직이고 있는지 여부 */
export let isMoving = false;
/** @description isMoving 상태를 설정하는 함수 */
export function setMoving(status) { isMoving = status; }

/** @description 화면 흔들림(Bobbing) 효과를 위한 각도 */
export let bobbingAngle = 0;
/** @description 화면 흔들림 각도를 설정하는 함수 */
export function setBobbingAngle(angle) { bobbingAngle = angle; }

/** @description 화면 흔들림 효과의 현재 수직 오프셋 */
export let bobbingOffset = 0;
/** @description 화면 흔들림 오프셋을 설정하는 함수 */
export function setBobbingOffset(offset) { bobbingOffset = offset; }

/** @description 화면 흔들림 효과의 현재 수평 오프셋 */
export let bobbingOffsetX = 0;
/** @description 화면 흔들림 수평 오프셋을 설정하는 함수 */
export function setBobbingOffsetX(offset) { bobbingOffsetX = offset; }

/** @description 현재 플레이어가 사용 중인 무기 ('gun', 'fist') */
export let currentWeapon = 'gun';
/** @description 현재 무기를 설정하는 함수 */
export function setCurrentWeapon(weapon) { currentWeapon = weapon; }

/** @description 현재 무기를 교체하는 중인지 여부 (애니메이션 중) */
export let isSwappingWeapon = false;
/** @description 무기 교체 상태를 설정하는 함수 */
export function setSwappingWeapon(status) { isSwappingWeapon = status; }

/** @description 마지막으로 공격한 시간 (타임스탬프) */
export let lastAttackTime = 0;
/** @description 마지막 공격 시간을 설정하는 함수 */
export function setLastAttackTime(time) { lastAttackTime = time; }

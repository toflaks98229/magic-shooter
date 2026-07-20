/**
 * @fileoverview 게임의 모든 시각적 요소를 캔버스에 그리는 렌더링 엔진입니다.
 * 레이캐스팅 알고리즘을 사용하여 2D 맵을 3D 뷰로 변환합니다.
 * 스프라이트 시트를 사용하여 모든 텍스처와 스프라이트를 렌더링합니다.
 */

// --- 모듈 임포트 ---
import * as C from './constants.js';
import { world } from './world.js';
import { runtime } from './runtime.js';
import { assets, resolveTheme } from './assets.js';
import { dom } from './dom.js';

// --- 렌더러 내부 상태 (Private Member Variables) ---
// 이 버퍼들은 렌더링에만 쓰이고 저장 대상도 아니므로, 공용 상태가 아니라 이 모듈이 소유합니다.

/** @description 렌더링에 사용될 화면 픽셀 데이터 (ImageData 객체) */
let screenImageData = null;
/** @description screenImageData의 32비트 버퍼 뷰 (빠른 픽셀 조작용) */
let screenBuffer = null;
/** @description 각 화면 컬럼(수직선)별 벽까지의 거리 (스프라이트 가림 판정용) */
let zBuffer = [];
/** @description 바닥/천장 렌더링 시 y좌표에 따른 거리를 미리 계산해둔 룩업 테이블 */
let yDistLookup = [];

/** @description objectMap에서 뽑아낸 스프라이트 오브젝트 목록. 맵이 바뀔 때만 다시 만듭니다. */
let objectSprites = [];
/** @description objectSprites가 어느 맵·개정 번호를 기준으로 만들어졌는지 */
let objectSpritesCache = { objectMap: null, revision: -1 };


// --- 외부 공개 함수 (Public Methods) ---

/**
 * 게임에 필요한 모든 에셋(스프라이트 시트, 사운드)을 비동기적으로 로드합니다.
 * @param {AudioContext} audioCtx - 사운드 디코딩에 사용할 오디오 컨텍스트
 * @returns {Promise} 모든 에셋 로딩이 완료되면 resolve되는 Promise 객체.
 */
export function loadAssets(audioCtx) {
    // 스프라이트 시트, 진행도 파일, 사운드 파일들을 동시에 병렬로 로드하여 로딩 시간을 단축합니다.
    const promise = Promise.all([
        loadSpriteSheets(),
        loadDungeonProgression(), // 던전 진행도 파일 로드 추가
        ...Object.entries(C.SOUNDS).map(([key, src]) => loadSound(key, src, audioCtx))
    ]);
    return promise;
}

/**
 * 게임의 한 프레임을 렌더링합니다. 벽, 바닥, 천장, 스프라이트를 모두 그립니다.
 * 이 함수는 매 프레임마다 gameLoop에 의해 호출됩니다.
 */
export function render() {
    if (!runtime.isGameRunning) return;

    // 실제 화면에 그리기 전에, 성능을 위해 저해상도 오프스크린 캔버스에 먼저 그립니다.
    const targetCtx = dom.offscreenCtx;
    const { width, height } = dom.offscreenCanvas;

    // 캔버스 크기가 변경되었으면 렌더링에 필요한 버퍼들을 다시 생성합니다.
    if (!screenImageData || screenImageData.width !== width || screenImageData.height !== height) {
        resizeCanvas();
    }

    // 1. 화면 흔들림(Bobbing) 효과 계산 및 무기 DOM 요소에 적용
    const bobY = runtime.bobbingOffset * (dom.canvas.height / 480); // 화면 해상도에 비례하여 흔들림 강도 조절
    const bobX = runtime.bobbingOffsetX * (dom.canvas.width / 640); // 좌우 흔들림 추가
    const weaponEl = dom.weaponSpriteEl;
    let weaponTransform = `translateX(calc(-50% + ${bobX}px)) translateY(${bobY * 1.5}px)`;
    // 공격 애니메이션 중일 경우 추가적인 변형을 적용
    if (weaponEl.classList.contains('attacking')) {
        weaponTransform += ' translateX(20px) translateY(-20px) scale(1.05)';
    }
    weaponEl.style.transform = weaponTransform;

    // 2. Raycasting으로 벽, 바닥, 천장을 픽셀 단위로 오프스크린 버퍼에 렌더링
    renderWorld(width, height);
    // 버퍼의 픽셀 데이터를 오프스크린 캔버스에 그립니다.
    targetCtx.putImageData(screenImageData, 0, 0);

    // 3. 적, 아이템 등 모든 스프라이트와 파티클을 오프스크린 캔버스 위에 렌더링
    renderEntities(targetCtx, width, height);

    // 4. 최종 결과물(오프스크린 캔버스)을 메인 캔버스에 확대하여 그립니다.
    dom.ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
    dom.ctx.save();
    // 화면 흔들림 효과를 전체 화면에 적용 (수직만 적용하여 멀미 방지)
    dom.ctx.translate(0, bobY);
    dom.ctx.drawImage(dom.offscreenCanvas, 0, 0, width, height, 0, 0, dom.canvas.width, dom.canvas.height);
    dom.ctx.restore();
}

/**
 * 캔버스 크기를 창 크기에 맞게 조절하고 렌더링 버퍼를 재생성합니다.
 */
export function resizeCanvas() {
    // 화면 오른쪽을 상태 패널이 차지하므로 창 크기가 아니라 캔버스가 실제로 차지한
    // 영역을 기준으로 삼습니다. 창 크기를 쓰면 그림이 패널 밑으로 밀려납니다.
    const width = dom.canvas.clientWidth || window.innerWidth;
    const height = dom.canvas.clientHeight || window.innerHeight;

    dom.canvas.width = width;
    dom.canvas.height = height;
    // 성능을 위해 실제 렌더링은 낮은 해상도로 수행
    dom.offscreenCanvas.width = width / runtime.renderScale | 0;
    dom.offscreenCanvas.height = height / runtime.renderScale | 0;

    // 픽셀 아트 스타일을 유지하기 위해 이미지 스무딩을 비활성화합니다.
    dom.ctx.imageSmoothingEnabled = false;
    dom.offscreenCtx.imageSmoothingEnabled = false;

    // 렌더링에 필요한 버퍼들을 새로 생성합니다.
    screenImageData = dom.offscreenCtx.createImageData(dom.offscreenCanvas.width, dom.offscreenCanvas.height);
    screenBuffer = new Uint32Array(screenImageData.data.buffer);
    zBuffer = new Array(dom.offscreenCanvas.width);

    // 바닥/천장 렌더링을 위한 거리 룩업 테이블을 재생성합니다.
    // 이는 매 프레임마다 거리를 계산하는 것을 피하여 성능을 향상시킵니다.
    const lookupSize = Math.ceil(dom.offscreenCanvas.height / 2);
    const newYDistLookup = new Array(lookupSize);
    const playerHeight = 0.5 * C.TILE_SIZE;
    const projectionDist = (dom.offscreenCanvas.width / 2) / Math.tan(C.FOV / 2);
    for (let j = 0; j < lookupSize; j++) {
        newYDistLookup[j] = j === 0 ? C.TILE_SIZE * 10000 : (playerHeight * projectionDist) / j;
    }
    yDistLookup = newYDistLookup;
}

// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * dungeon_progression.json 파일을 로드하여 state에 저장합니다.
 * @returns {Promise} 로딩이 완료되면 resolve되는 Promise.
 */
function loadDungeonProgression() {
    return fetch(C.DUNGEON_PROGRESSION_URL)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${C.DUNGEON_PROGRESSION_URL}`);
            return response.json();
        })
        .then(data => {
            assets.dungeonProgression = data;
        })
        .catch(error => {
            console.error(`Failed to load dungeon progression data: ${C.DUNGEON_PROGRESSION_URL}`, error);
            // 파일 로드 실패 시, 게임이 멈추지 않도록 기본값으로 대체합니다.
            assets.dungeonProgression = {
                floors: [],
                default: { theme: "main", variation: 1 }
            };
        });
}

/**
 * 텍스처 좌표를 텍스처 크기 안으로 감싸(wrap) 반환합니다.
 * 월드 좌표는 음수가 될 수 있으므로 JS의 나머지 연산 결과가 음수가 되는 경우를 보정합니다.
 * @param {number} value - 감쌀 정수 좌표
 * @param {number} size - 텍스처의 한 변 크기
 * @returns {number} 0 이상 size 미만의 좌표
 */
function wrapTexCoord(value, size) {
    const wrapped = value % size;
    return wrapped < 0 ? wrapped + size : wrapped;
}

/**
 * 레이캐스팅을 사용하여 벽, 바닥, 천장을 렌더링하고 screenBuffer에 픽셀 데이터를 씁니다.
 * @param {number} width - 렌더링할 너비
 * @param {number} height - 렌더링할 높이
 */
function renderWorld(width, height) {
    const projectionDist = (width / 2) / Math.tan(C.FOV / 2);
    const halfHeight = height / 2 | 0;

    // --- 애니메이션 벽(문) 정보 룩업 ---
    // 열릴 때만 존재하므로 대부분의 프레임에서는 비어 있습니다.
    // 예전에는 컬럼마다 `x,y` 문자열 키를 만들어 조회했는데, 해상도가 높아질수록
    // 프레임당 수백 개의 임시 문자열이 생겼습니다. 정수 키로 바꾸고,
    // 애니메이션 중인 벽이 없으면 조회 자체를 건너뜁니다.
    const animatedWalls = world.animatedWalls;
    const hasAnimatedWalls = animatedWalls.length > 0;
    const animatedWallLookup = hasAnimatedWalls ? new Map() : null;
    if (hasAnimatedWalls) {
        for (const wall of animatedWalls) {
            animatedWallLookup.set(wall.mapY * C.MAP_WIDTH + wall.mapX, wall);
        }
    }
    
    // --- 테마 시스템 적용 ---
    const placeholderTex = assets.textures.placeholder;
    const currentTheme = resolveTheme(world.themeName, world.themeVariation);
    let floorTextures, ceilingTextures, wallTextures; 

    if (currentTheme) {
        wallTextures = (currentTheme.wall && currentTheme.wall.length > 0) ? currentTheme.wall : [placeholderTex];
        floorTextures = (currentTheme.floor && currentTheme.floor.length > 0) ? currentTheme.floor : [placeholderTex];
        ceilingTextures = (currentTheme.ceiling && currentTheme.ceiling.length > 0) ? currentTheme.ceiling : [placeholderTex];
        
    } else {
        // 테마가 없는 경우, 이전 방식(fallback)으로 렌더링
        wallTextures = [assets.textures.wall_main_1_1 || placeholderTex];
        floorTextures = [assets.textures.floor_main_1_1 || placeholderTex];
        ceilingTextures = [assets.textures.ceiling_main_1_1 || placeholderTex];
    }
    // --- 테마 시스템 적용 끝 ---

    // 컬럼마다 되풀이해서 필요한 값들을 한 번만 모아 둡니다.
    // 프레임당 객체 하나이며, 컬럼 반복 안에서는 아무것도 만들지 않습니다.
    scene.width = width;
    scene.height = height;
    scene.halfHeight = halfHeight;
    scene.projectionDist = projectionDist;
    scene.light = runtime.dynamicLight;
    scene.placeholderTex = placeholderTex;
    scene.wallTextures = wallTextures;
    scene.floorTextures = floorTextures;
    scene.ceilingTextures = ceilingTextures;
    scene.animatedWallLookup = animatedWallLookup;
    scene.hasAnimatedWalls = hasAnimatedWalls;

    // 화면의 모든 수직선(column)에 대해 레이캐스팅을 수행합니다.
    for (let i = 0; i < width; i++) renderColumn(scene, i);
}

/**
 * @description renderWorld 가 컬럼 반복에 넘기는 프레임 단위 값 묶음.
 * 컬럼마다 새로 만들면 프레임당 수백 개가 생기므로 하나를 돌려 씁니다.
 */
const scene = {
    width: 0, height: 0, halfHeight: 0, projectionDist: 0,
    light: null, placeholderTex: null,
    wallTextures: null, floorTextures: null, ceilingTextures: null,
    animatedWallLookup: null, hasAnimatedWalls: false,
};

/**
 * 화면의 세로줄 하나를 그립니다. 광선을 쏘고, 벽면을 칠하고, 그 아래위로 바닥과 천장을 채웁니다.
 * @param {object} scene - 프레임 단위로 준비된 값 묶음
 * @param {number} i - 화면 컬럼 번호
 */
function renderColumn(scene, i) {
    const { width, halfHeight, projectionDist } = scene;

    const angle = world.player.angle - C.FOV / 2 + (i / width) * C.FOV;
    const ray = castRay(angle); // 해당 각도로 광선을 쏴서 벽과 충돌 정보를 얻음
    // 어안 렌즈 효과를 보정하고, zBuffer에 거리를 저장합니다.
    const correctedDist = Math.max(ray.distance * Math.cos(angle - world.player.angle), C.MIN_RENDER_DISTANCE);
    zBuffer[i] = correctedDist;

    // 벽 높이 계산
    const wallHeight = (C.TILE_SIZE / correctedDist) * projectionDist;
    let wallTopY = halfHeight - wallHeight / 2;

    // 애니메이션 중인 벽(열리는 문)이라면 Z좌표만큼 화면에서 위로 밀어 올립니다.
    const animatedWall = scene.hasAnimatedWalls
        ? scene.animatedWallLookup.get(ray.mapY * C.MAP_WIDTH + ray.mapX)
        : undefined;
    if (animatedWall) wallTopY -= (animatedWall.z / correctedDist) * projectionDist;

    const wallBottomY = wallTopY + wallHeight;
    const y0 = Math.max(0, wallTopY | 0);
    const y1 = Math.min(scene.height, wallBottomY | 0);

    drawWallStripe(scene, i, ray, angle, correctedDist, wallTopY, wallHeight, y0, y1);
    drawFloorAndCeiling(scene, i, ray, correctedDist, y1);
}

/**
 * 컬럼에서 벽이 차지하는 구간을 텍스처로 칠합니다.
 * @param {object} scene - 프레임 단위 값 묶음
 * @param {number} i - 화면 컬럼 번호
 * @param {object} ray - castRay 결과
 * @param {number} angle - 이 컬럼의 광선 각도
 * @param {number} correctedDist - 어안 보정된 벽까지의 거리
 * @param {number} wallTopY - 벽 윗변의 화면 Y (정수로 자르기 전)
 * @param {number} wallHeight - 벽의 화면상 높이
 * @param {number} y0 - 칠하기 시작할 화면 Y
 * @param {number} y1 - 칠하기를 멈출 화면 Y
 */
function drawWallStripe(scene, i, ray, angle, correctedDist, wallTopY, wallHeight, y0, y1) {
    const { width, light, placeholderTex } = scene;

    // 어떤 타일을 어떤 텍스처로 그릴지는 TILE_TYPES 표가 정합니다.
    const wallTextureKey = C.TILE_TYPES[ray.texture]?.wallTexture;
    let wallTextureInfo;

    if (wallTextureKey === 'theme') {
        // 타일 좌표 해시로 테마 텍스처를 섞어 벽면이 단조롭지 않게 합니다.
        const wallHash = (ray.mapX * 19 + ray.mapY * 73);
        wallTextureInfo = scene.wallTextures[Math.abs(wallHash) % scene.wallTextures.length];
    } else if (wallTextureKey) {
        wallTextureInfo = assets.textures[wallTextureKey] || placeholderTex;
    } else {
        wallTextureInfo = placeholderTex;
    }

    const wallTexture = wallTextureInfo.data;
    if (!wallTexture) return;

    const texSize = wallTextureInfo.w;
    let texX = ray.wallX * texSize | 0;
    // 광선의 방향에 따라 텍스처를 좌우 반전시켜 올바르게 보이도록 합니다.
    if ((ray.side === 0 && ray.rayDirX > 0) || (ray.side === 1 && ray.rayDirY < 0)) {
        texX = texSize - 1 - texX;
    }

    // 밝기 계산
    const brightness = 1 - Math.min(correctedDist / (C.TILE_SIZE * 12), 1);
    const shade = ray.side === 1 ? 0.7 : 1.0;
    let finalBrightness = brightness * shade;

    if (light.active) {
        const wallWorldX = world.player.x + ray.distance * Math.cos(angle);
        const wallWorldY = world.player.y + ray.distance * Math.sin(angle);
        const distToLightSq = (wallWorldX - light.x) ** 2 + (wallWorldY - light.y) ** 2;
        finalBrightness += light.intensity / (1 + distToLightSq * light.falloff);
    }

    for (let y = y0; y < y1; y++) {
        // 수직 오프셋을 고려하여 텍스처의 Y좌표를 정확하게 계산합니다.
        const texY = ((y - wallTopY) / wallHeight) * texSize | 0;
        const texIndex = (texY * texSize + texX) << 2;
        const r = Math.min(255, wallTexture[texIndex] * finalBrightness);
        const g = Math.min(255, wallTexture[texIndex + 1] * finalBrightness);
        const b = Math.min(255, wallTexture[texIndex + 2] * finalBrightness);
        screenBuffer[y * width + i] = (255 << 24) | (b << 16) | (g << 8) | r;
    }
}

/**
 * 벽 아래 구간을 바닥으로 채우고, 같은 계산을 위아래로 뒤집어 천장을 채웁니다.
 * @param {object} scene - 프레임 단위 값 묶음
 * @param {number} i - 화면 컬럼 번호
 * @param {object} ray - castRay 결과
 * @param {number} correctedDist - 어안 보정된 벽까지의 거리
 * @param {number} y1 - 벽이 끝나는 화면 Y
 */
function drawFloorAndCeiling(scene, i, ray, correctedDist, y1) {
    const { width, height, halfHeight, light } = scene;

    // 광선이 벽에 닿은 지점의 월드 좌표. 바닥 원근의 기준점이 됩니다.
    let floorXWall, floorYWall;
    if (ray.side === 0 && ray.rayDirX > 0) { floorXWall = ray.mapX; floorYWall = ray.mapY + ray.wallX; }
    else if (ray.side === 0 && ray.rayDirX < 0) { floorXWall = ray.mapX + 1.0; floorYWall = ray.mapY + ray.wallX; }
    else if (ray.side === 1 && ray.rayDirY > 0) { floorXWall = ray.mapX + ray.wallX; floorYWall = ray.mapY; }
    else { floorXWall = ray.mapX + ray.wallX; floorYWall = ray.mapY + 1.0; }
    floorXWall *= C.TILE_SIZE; floorYWall *= C.TILE_SIZE;

    // 텍스처 선택은 타일이 바뀔 때만 다시 하면 되므로, 직전 타일의 결과를 재사용합니다.
    // (예전에는 픽셀마다 해시와 나머지 연산을 두 번씩 계산했습니다.)
    let cachedTileHash = -1;
    let floorTexData = null, ceilingTexData = null;
    let floorTexSize = 0, ceilingTexSize = 0;

    // 바닥/천장 원근 계산은 지평선 아래에서만 성립하므로, 시작점을 지평선에서 자릅니다.
    //
    // 문이 열리는 동안 벽 하단이 지평선 위로 밀려 올라갑니다. z 가 타일 크기의 절반을
    // 넘는 순간부터 거리와 무관하게 일어나며, 그때 y1 이 halfHeight 보다 작아져
    // pixelsFromHorizon 이 음수가 됩니다. yDistLookup 이 undefined 를 돌려주고
    // 이후 거리·좌표·밝기가 전부 NaN 이 됩니다.
    //
    // 다만 화면에 보이는 증상은 없습니다. NaN 으로 쓴 픽셀은 같은 루프의 뒤쪽 반복이
    // (바닥은 아래에서, 천장은 height-1-y 로 위에서) 빠짐없이 덮어쓰기 때문입니다.
    // 실제로 수정 전후의 화면을 바이트 단위로 비교했을 때 차이가 없었습니다.
    // 그러니 이 클램프는 버그 수정이 아니라, 언제든 겉으로 드러날 수 있는 위험을
    // 없애고 헛도는 계산을 줄이는 정리입니다.
    for (let y = Math.max(y1, halfHeight); y < height; y++) {
        const pixelsFromHorizon = y - halfHeight;
        const currentDist = yDistLookup[pixelsFromHorizon];
        const weight = currentDist / correctedDist;
        let baseBrightness = Math.max(0, 1 - Math.min(currentDist / (C.TILE_SIZE * 12), 1));
        const currentFloorX = weight * floorXWall + (1.0 - weight) * world.player.x;
        const currentFloorY = weight * floorYWall + (1.0 - weight) * world.player.y;

        if (light.active) {
            const distToLightSq = (currentFloorX - light.x) ** 2 + (currentFloorY - light.y) ** 2;
            baseBrightness += light.intensity / (1 + distToLightSq * light.falloff);
        }

        const mapTileX = currentFloorX / C.TILE_SIZE | 0;
        const mapTileY = currentFloorY / C.TILE_SIZE | 0;
        const tileHash = (mapTileX * 23 + mapTileY * 83);

        if (tileHash !== cachedTileHash) {
            cachedTileHash = tileHash;
            const absHash = tileHash < 0 ? -tileHash : tileHash;
            const floorTextureInfo = scene.floorTextures[absHash % scene.floorTextures.length];
            floorTexData = floorTextureInfo.data;
            floorTexSize = floorTextureInfo.w;
            const ceilingTextureInfo = scene.ceilingTextures[absHash % scene.ceilingTextures.length];
            ceilingTexData = ceilingTextureInfo.data;
            ceilingTexSize = ceilingTextureInfo.w;
        }

        if (floorTexData) {
            // 기존의 비트 마스크(& size-1) 방식은 텍스처 크기가 2의 거듭제곱일 때만 동작했습니다.
            // 나머지 연산으로 바꿔 48x48 같은 크기의 텍스처도 안전하게 반복되도록 합니다.
            const floorTexX = wrapTexCoord(currentFloorX | 0, floorTexSize);
            const floorTexY = wrapTexCoord(currentFloorY | 0, floorTexSize);
            const texIndex = (floorTexY * floorTexSize + floorTexX) << 2;
            const r = Math.min(255, floorTexData[texIndex] * baseBrightness);
            const g = Math.min(255, floorTexData[texIndex + 1] * baseBrightness);
            const b = Math.min(255, floorTexData[texIndex + 2] * baseBrightness);
            screenBuffer[y * width + i] = (255 << 24) | (b << 16) | (g << 8) | r;
        }

        if (ceilingTexData) {
            const ceilY = height - 1 - y;
            // 천장 텍스처는 바닥과 크기가 다를 수 있으므로, 반드시 자신의 크기로 좌표를 계산해야 합니다.
            // (기존에는 바닥의 크기/좌표로 천장 데이터를 인덱싱해 텍스처가 어긋나거나 범위를 벗어났습니다.)
            const ceilingTexX = wrapTexCoord(currentFloorX | 0, ceilingTexSize);
            const ceilingTexY = wrapTexCoord(currentFloorY | 0, ceilingTexSize);
            const texIndex = (ceilingTexY * ceilingTexSize + ceilingTexX) << 2;
            const r_c = Math.min(255, ceilingTexData[texIndex] * baseBrightness);
            const g_c = Math.min(255, ceilingTexData[texIndex + 1] * baseBrightness);
            const b_c = Math.min(255, ceilingTexData[texIndex + 2] * baseBrightness);
            screenBuffer[ceilY * width + i] = (255 << 24) | (b_c << 16) | (g_c << 8) | r_c;
        }
    }
}

/**
 * objectMap에서 스프라이트로 그려야 할 오브젝트 목록이 최신인지 확인하고, 필요하면 다시 만듭니다.
 *
 * 예전에는 이 30x30 이중 반복을 매 프레임 돌렸습니다. 지금 OBJECT_TYPES에는 문 하나뿐이고
 * 그마저 renderAsWall 이라 걸러지므로, 초당 5만 번 넘게 훑어서 항상 빈 배열을 만들고 있었습니다.
 * (헛도는 것은 분명하지만, 이걸 없앤 뒤에도 프레임 시간에 잡히는 변화는 없었습니다.
 *  픽셀 래스터화가 워낙 지배적이라 이 정도 반복은 묻힙니다.)
 *
 * 무효화 조건은 gameLogic 의 플로우 필드 캐시와 같은 방식입니다. 둘 다 필요합니다.
 *   - objectMap 참조 교체: 층이 바뀌면 main.js 가 새 배열을 통째로 갈아 끼웁니다.
 *   - mapRevision 증가: 문이 열리면 actions.js 가 배열 내용을 제자리에서 고치므로
 *     참조 비교만으로는 알아챌 수 없습니다. (actions.js 의 openDoor 참조)
 * @returns {object[]} 스프라이트로 그릴 오브젝트 목록
 */
function ensureObjectSprites() {
    const isCurrent = objectSpritesCache.objectMap === world.objectMap
        && objectSpritesCache.revision === world.mapRevision;
    if (isCurrent) return objectSprites;

    objectSprites = [];
    for (let y = 0; y < world.objectMap.length; y++) {
        for (let x = 0; x < world.objectMap[y].length; x++) {
            const objectId = world.objectMap[y][x];
            if (objectId <= 0) continue;

            const objectType = C.OBJECT_TYPES[objectId];
            // renderAsWall 플래그가 없는 오브젝트만 스프라이트로 렌더링합니다.
            if (!objectType || objectType.renderAsWall) continue;

            objectSprites.push({
                id: objectId,
                type: 'object',
                ...objectType,
                x: x * C.TILE_SIZE + C.TILE_SIZE / 2, // 타일 중앙 좌표
                y: y * C.TILE_SIZE + C.TILE_SIZE / 2,
                z: C.TILE_SIZE / 2,
                mapX: x, // 나중에 상호작용 시 참조할 맵 좌표
                mapY: y,
            });
        }
    }

    objectSpritesCache = { objectMap: world.objectMap, revision: world.mapRevision };
    return objectSprites;
}

/**
 * 모든 엔티티(스프라이트, 파티클)를 거리에 따라 정렬하고 렌더링합니다.
 * @param {CanvasRenderingContext2D} targetCtx - 렌더링할 캔버스 컨텍스트
 * @param {number} width - 렌더링 너비
 * @param {number} height - 렌더링 높이
 */
function renderEntities(targetCtx, width, height) {
    const projectionDist = (width / 2) / Math.tan(C.FOV / 2);
    const halfHeight = height / 2 | 0;

    const entitiesToRender = collectEntitiesByDistance();

    for (const entity of entitiesToRender) {
        let angleToEntity = Math.atan2(entity.y - world.player.y, entity.x - world.player.x) - world.player.angle;
        // 각도를 -PI ~ PI 범위로 정규화
        while (angleToEntity > Math.PI) angleToEntity -= 2 * Math.PI;
        while (angleToEntity < -Math.PI) angleToEntity += 2 * Math.PI;

        // 엔티티가 시야각(FOV) 내에 있을 때만 렌더링합니다.
        // 0.2는 화면 가장자리에서 스프라이트가 잘리는 것을 방지하기 위한 여유입니다.
        if (Math.abs(angleToEntity) >= C.FOV / 2 + 0.2) continue;

        const correctedDist = Math.max(entity.dist * Math.cos(angleToEntity), C.MIN_RENDER_DISTANCE);
        const entityZ = entity.z || (C.TILE_SIZE / 2);
        const verticalOffset = ((C.TILE_SIZE / 2 - entityZ) / correctedDist) * projectionDist;

        const screenX = (width / 2) * (1 + Math.tan(angleToEntity) / Math.tan(C.FOV / 2));
        const entitySize = ((entity.size || C.TILE_SIZE) / correctedDist) * projectionDist;
        const entityTopY = halfHeight - (entitySize / 2) + verticalOffset;
        const entityLeftX = screenX - entitySize / 2;

        // 거리에 따라 투명도를 조절하여 멀리 있는 것이 희미하게 보이게 합니다.
        targetCtx.globalAlpha = 1 - Math.min(correctedDist / (C.TILE_SIZE * 10), 1);

        if (entity.isParticle) {
            drawParticle(targetCtx, entity, width, correctedDist, entityLeftX, entityTopY, entitySize);
        } else {
            drawEntitySprite(targetCtx, entity, width, correctedDist, entityLeftX, entityTopY, entitySize);
        }
    }
    targetCtx.globalAlpha = 1.0; // 투명도 복구
}

/**
 * 이번 프레임에 그릴 모든 엔티티를 모아 먼 것부터 오도록 정렬합니다.
 *
 * 정렬은 화가 기법을 위한 것입니다. 먼 것을 먼저 그려야 가까운 것이 위에 덮입니다.
 * @returns {object[]} 거리 내림차순으로 정렬된 엔티티 목록
 */
function collectEntitiesByDistance() {
    // animatedWalls에 있는 문은 renderWorld에서 벽으로 처리되므로 여기서는 제외합니다.
    const entities = [
        ...world.enemies, ...world.items, ...world.projectiles,
        ...world.particles, ...ensureObjectSprites(), ...world.animatedObjects,
    ];

    for (const entity of entities) {
        const dx = entity.x - world.player.x;
        const dy = entity.y - world.player.y;
        entity.dist = Math.hypot(dx, dy);
        entity.isParticle = !entity.spriteKey; // spriteKey가 없으면 파티클로 간주
    }

    entities.sort((a, b) => b.dist - a.dist);
    return entities;
}

/**
 * 파티클 하나를 사각형으로 그립니다.
 * @param {CanvasRenderingContext2D} targetCtx - 그릴 대상
 * @param {object} entity - 파티클
 * @param {number} width - 렌더링 너비
 * @param {number} correctedDist - 어안 보정된 거리
 * @param {number} entityLeftX - 화면상 왼쪽 X
 * @param {number} entityTopY - 화면상 위쪽 Y
 * @param {number} entitySize - 화면상 크기
 */
function drawParticle(targetCtx, entity, width, correctedDist, entityLeftX, entityTopY, entitySize) {
    // zBuffer를 확인하여 파티클이 벽 뒤에 있으면 그리지 않습니다.
    // 스프라이트와 달리 왼쪽 끝 한 점만 보므로, 벽 모서리에 걸치면 통째로 나타나거나 사라집니다.
    const screenXInt = entityLeftX | 0;
    if (screenXInt < 0 || screenXInt >= width || zBuffer[screenXInt] <= correctedDist) return;

    targetCtx.fillStyle = entity.color || '#fff';
    targetCtx.fillRect(entityLeftX, entityTopY, entitySize, entitySize);
}

/**
 * 스프라이트를 쓰는 엔티티 하나를 그리고, 최근에 맞았다면 번쩍임을 얹습니다.
 * @param {CanvasRenderingContext2D} targetCtx - 그릴 대상
 * @param {object} entity - 엔티티
 * @param {number} width - 렌더링 너비
 * @param {number} correctedDist - 어안 보정된 거리
 * @param {number} entityLeftX - 화면상 왼쪽 X
 * @param {number} entityTopY - 화면상 위쪽 Y
 * @param {number} entitySize - 화면상 크기
 */
function drawEntitySprite(targetCtx, entity, width, correctedDist, entityLeftX, entityTopY, entitySize) {
    const spriteKey = entity.spriteKey;
    const sheetKey = assets.spriteKeyToSheet[spriteKey];

    const usePlaceholder = !sheetKey || !assets.spriteAtlases[sheetKey]
        || !assets.spriteSheets[sheetKey] || !assets.spriteAtlases[sheetKey].sprites[spriteKey];

    const sourceImage = usePlaceholder ? assets.textures.placeholder.img : assets.spriteSheets[sheetKey];
    const sourceCoords = usePlaceholder
        ? { x: 0, y: 0, w: assets.textures.placeholder.w, h: assets.textures.placeholder.h }
        : assets.spriteAtlases[sheetKey].sprites[spriteKey];

    if (sourceImage && sourceCoords) {
        // 스프라이트는 내용이 있는 부분만 잘려 아틀라스에 들어가 있어 가로세로비가 제각각입니다.
        // (쥐는 납작하고 지옥 기사는 길쭉합니다.)
        // 정사각형에 욱여넣으면 늘어나 보이므로, 폭을 기준으로 높이를 비율대로 잡고
        // 발이 바닥에 닿은 위치는 그대로 두어 공중에 뜨지 않게 합니다.
        const spriteHeight = entitySize * (sourceCoords.h / sourceCoords.w);
        const spriteTopY = entityTopY + entitySize - spriteHeight;

        const startX = Math.max(0, Math.floor(entityLeftX));
        const endX = Math.min(width, Math.ceil(entityLeftX + entitySize));

        // zBuffer로 벽에 가려지는 수직선을 걸러내되, 보이는 구간이 연속되는 동안은
        // 한 번의 drawImage로 묶어서 그립니다.
        // 예전에는 수직선 하나마다 drawImage를 호출해, 스프라이트 하나에
        // 폭만큼의 호출이 발생했습니다.
        let runStart = -1;
        for (let stripe = startX; stripe <= endX; stripe++) {
            const visible = stripe < endX && zBuffer[stripe] > correctedDist;

            if (visible && runStart < 0) {
                runStart = stripe;              // 보이는 구간 시작
            } else if (!visible && runStart >= 0) {
                drawSpriteRun(targetCtx, sourceImage, sourceCoords,
                    runStart, stripe, entityLeftX, entitySize, spriteTopY, spriteHeight);
                runStart = -1;                  // 구간 종료
            }
        }
    }

    // 피격 효과: 최근에 맞았다면 하얀색으로 번쩍이는 효과를 줍니다.
    if (entity.lastHitTime && world.time - entity.lastHitTime < C.HIT_FLASH_MS) {
        targetCtx.globalCompositeOperation = 'lighter'; // 색상 혼합 모드 변경
        targetCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        targetCtx.fillRect(entityLeftX, entityTopY, entitySize, entitySize);
        targetCtx.globalCompositeOperation = 'source-over'; // 원래대로 복구
    }
}

/**
 * 스프라이트의 연속된 수직선 구간을 한 번에 그립니다.
 * @param {CanvasRenderingContext2D} ctx - 대상 컨텍스트
 * @param {*} sourceImage - 스프라이트 시트 이미지
 * @param {{x: number, y: number, w: number, h: number}} coords - 시트 안에서의 스프라이트 위치
 * @param {number} fromStripe - 구간 시작 화면 X (포함)
 * @param {number} toStripe - 구간 끝 화면 X (제외)
 * @param {number} entityLeftX - 스프라이트가 시작되는 화면 X (소수 포함)
 * @param {number} entitySize - 화면에 그려질 스프라이트의 폭
 * @param {number} topY - 그려질 화면 Y
 * @param {number} drawHeight - 그려질 높이 (가로세로비를 반영한 값)
 */
function drawSpriteRun(ctx, sourceImage, coords, fromStripe, toStripe, entityLeftX, entitySize, topY, drawHeight) {
    // 화면 구간을 원본 텍스처 구간으로 되돌립니다.
    const texFrom = Math.floor(((fromStripe - entityLeftX) / entitySize) * coords.w);
    const texTo = Math.ceil(((toStripe - entityLeftX) / entitySize) * coords.w);

    const clampedFrom = Math.max(0, Math.min(coords.w - 1, texFrom));
    const clampedTo = Math.max(clampedFrom + 1, Math.min(coords.w, texTo));

    ctx.drawImage(
        sourceImage,
        coords.x + clampedFrom, coords.y,
        clampedTo - clampedFrom, coords.h,
        fromStripe, topY,
        toStripe - fromStripe, drawHeight
    );
}

/**
 * @description castRay 가 결과를 담아 돌려주는 재사용 객체.
 *
 * 예전에는 컬럼마다 새 객체를 만들어 반환했습니다. 640픽셀 폭이면 초당 3만 개가 넘습니다.
 * 다만 이것을 없앤다고 빨라지지는 않았습니다. 헤드리스 벤치의 프레임 시간도,
 * 120프레임 동안의 마이너 GC 횟수(217회 → 216회)도 사실상 그대로였습니다.
 * V8 의 신세대 할당이 이 정도 크기의 단명 객체에는 충분히 저렴하기 때문입니다.
 * 그러니 성능 개선이 아니라, 프레임마다 버릴 것을 만들지 않는다는 정리로 보십시오.
 *
 * 반환값은 renderWorld 의 컬럼 반복 한 회차 안에서만 쓰이고 밖으로 새어 나가지 않으므로
 * 하나를 돌려 써도 안전합니다. 다만 이것이 이 최적화가 성립하는 유일한 근거이므로,
 * 호출부가 결과를 보관하거나 배열에 쌓기 시작하면 그 순간 조용히 깨집니다.
 * 그런 필요가 생기면 반드시 값을 복사해 두십시오.
 */
const rayHit = {
    distance: 0, texture: 0, side: 0, wallX: 0,
    rayDirX: 0, rayDirY: 0, mapX: 0, mapY: 0,
};

/**
 * 주어진 각도로 광선을 쏴서 처음으로 부딪히는 벽의 정보를 반환합니다. (DDA 알고리즘 사용)
 * @param {number} angle - 발사할 광선의 각도 (라디안)
 * @returns {object} 충돌 정보를 담은 재사용 객체(rayHit). 다음 호출 때 덮어써집니다.
 */
function castRay(angle) {
    const rayDirX = Math.cos(angle), rayDirY = Math.sin(angle);
    let mapX = world.player.x / C.TILE_SIZE | 0, mapY = world.player.y / C.TILE_SIZE | 0;
    const deltaDistX = Math.abs(1 / rayDirX), deltaDistY = Math.abs(1 / rayDirY);

    let stepX, sideDistX, stepY, sideDistY;
    if (rayDirX < 0) { stepX = -1; sideDistX = (world.player.x / C.TILE_SIZE - mapX) * deltaDistX; }
    else { stepX = 1; sideDistX = (mapX + 1 - world.player.x / C.TILE_SIZE) * deltaDistX; }
    if (rayDirY < 0) { stepY = -1; sideDistY = (world.player.y / C.TILE_SIZE - mapY) * deltaDistY; }
    else { stepY = 1; sideDistY = (mapY + 1 - world.player.y / C.TILE_SIZE) * deltaDistY; }

    let hit = 0, side = 0;
    while (hit === 0) {
        if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0; } // X축 방향으로 한 칸 이동
        else { sideDistY += deltaDistY; mapY += stepY; side = 1; } // Y축 방향으로 한 칸 이동
        if (C.tileAt(world.map, mapX, mapY).opaque) hit = 1; // 벽·문·출구에 부딪힘
    }

    const perpWallDist = (side === 0) ? (sideDistX - deltaDistX) : (sideDistY - deltaDistY);
    let wallX = (side === 0) ? world.player.y / C.TILE_SIZE + perpWallDist * rayDirY : world.player.x / C.TILE_SIZE + perpWallDist * rayDirX;
    wallX -= (wallX | 0); // 텍스처 좌표 계산을 위해 소수점 부분만 남김
    
    rayHit.distance = perpWallDist * C.TILE_SIZE;
    rayHit.texture = world.map[mapY][mapX];
    rayHit.side = side;
    rayHit.wallX = wallX;
    rayHit.rayDirX = rayDirX;
    rayHit.rayDirY = rayDirY;
    rayHit.mapX = mapX;
    rayHit.mapY = mapY;
    return rayHit;
}

/**
 * 여러 스프라이트 시트 JSON과 이미지를 로드하고, 각 스프라이트를 개별 데이터로 분리하여 state에 저장합니다.
 * @returns {Promise} 로딩 및 처리가 완료되면 resolve되는 Promise.
 */
function loadSpriteSheets() {
    const sheetPromises = Object.entries(C.SPRITE_SHEET_URLS).map(([key, jsonUrl]) => {
        return new Promise((resolve) => {
            fetch(jsonUrl)
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${jsonUrl}`);
                    return response.json();
                })
                .then(atlas => {
                    assets.spriteAtlases[key] = atlas;
                    for (const spriteName in atlas.sprites) {
                        assets.spriteKeyToSheet[spriteName] = key;
                    }
                    const img = new Image();
                    const basePath = jsonUrl.substring(0, jsonUrl.lastIndexOf('/') + 1);
                    img.src = basePath + atlas.sheetFile;
                    img.onload = () => {
                        assets.spriteSheets[key] = img;
                        prepareSprites(key, img, atlas);
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Sprite sheet image load failed: ${atlas.sheetFile}`);
                        const placeholder = createPlaceholderTexture(64, 64);
                        assets.spriteSheets[key] = placeholder.img;
                        prepareSprites(key, placeholder.img, { sprites: {} });
                        resolve();
                    };
                })
                .catch(error => {
                    console.error(`Failed to load sprite sheet JSON: ${jsonUrl}`, error);
                    resolve();
                });
        });
    });

    return Promise.all(sheetPromises).then(() => {
        const placeholder = createPlaceholderTexture();
        assets.textures['placeholder'] = {
            img: placeholder.img,
            data: placeholder.data,
            w: placeholder.w,
            h: placeholder.h
        };
    });
}

/**
 * @description HTML 요소에 직접 붙일 이미지가 필요한 스프라이트.
 * 무기와 얼굴, 소지품에 나열되는 아이템, 상태 패널의 상태 기호가 해당합니다.
 */
const HTML_SPRITE_PATTERN = /^(face_|gun|fist|item_|status_)/;

/**
 * 로드된 스프라이트 시트 이미지와 아틀라스 데이터를 기반으로 각 스프라이트를
 * ImageData(벽/바닥용) 또는 Image(UI용) 객체로 만들어 assets.textures에 저장합니다.
 * @param {string} sheetKey - 이 스프라이트 시트의 키 (e.g., 'main', 'walls')
 * @param {HTMLImageElement} sheetImage - 로드된 스프라이트 시트 이미지
 * @param {object} atlas - 파싱된 스프라이트 시트 JSON 데이터
 */
function prepareSprites(sheetKey, sheetImage, atlas) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

    for (const key in atlas.sprites) {
        const coords = atlas.sprites[key];
        if (typeof coords.x !== 'number' || typeof coords.y !== 'number' ||
            typeof coords.w !== 'number' || typeof coords.h !== 'number' ||
            coords.w <= 0 || coords.h <= 0) {
            console.warn(`'${key}' in sheet '${sheetKey}' has invalid coordinates. Skipping.`);
            continue;
        }

        tempCanvas.width = coords.w;
        tempCanvas.height = coords.h;
        tempCtx.drawImage(sheetImage, coords.x, coords.y, coords.w, coords.h, 0, 0, coords.w, coords.h);
        
        // --- 테마 시스템 수정 ---
        // 이름 규칙: type_theme_variation_subvariation (e.g., wall_main_1_1)
        const themeMatch = key.match(/^(wall|floor|ceiling)_([a-zA-Z0-9]+)_(\d+)_(\d+)$/);

        if (themeMatch) {
            const [, type, theme, variation] = themeMatch;
            const variationKey = `variation_${variation}`;
            const textureData = {
                data: tempCtx.getImageData(0, 0, coords.w, coords.h).data,
                w: coords.w,
                h: coords.h
            };
            
            // 테마 객체가 없으면 새로 생성
            if (!assets.dungeonThemes[theme]) {
                assets.dungeonThemes[theme] = {};
            }
            // 테마 안에 유형(variation) 객체가 없으면 새로 생성
            if (!assets.dungeonThemes[theme][variationKey]) {
                assets.dungeonThemes[theme][variationKey] = { wall: [], floor: [], ceiling: [] };
            }
            // 해당 유형의 배열에 텍스처 추가
            assets.dungeonThemes[theme][variationKey][type].push(textureData);
            
            // 개별 텍스처도 assets.textures에 저장해둬서, 테마 없이 직접 참조할 수도 있게 합니다.
            assets.textures[key] = textureData;

        } else if (HTML_SPRITE_PATTERN.test(key)) {
            // 상태 패널과 소지품 창은 HTML 이라 <img> 에 넣을 수 있는 형태가 필요합니다.
            // 레이캐스터가 쓰는 ImageData 로는 화면에 붙일 수 없습니다.
            const img = new Image();
            img.src = tempCanvas.toDataURL();
            assets.textures[key] = { img: img };
        } else {
            // 테마 시스템에 해당하지 않는 나머지 스프라이트(e.g. exit, door_gate_1)는 ImageData로 저장
             assets.textures[key] = {
                data: tempCtx.getImageData(0, 0, coords.w, coords.h).data,
                w: coords.w,
                h: coords.h
            };
        }
    }
}

/**
 * 단일 사운드 파일을 로드하고, 디코딩된 오디오 버퍼를 state에 저장합니다.
 * @param {string} key - 사운드를 저장할 키
 * @param {string} src - 사운드 파일 경로
 * @param {AudioContext} audioCtx - 오디오 컨텍스트
 * @returns {Promise} 로딩이 완료되면 resolve되는 Promise.
 */
function loadSound(key, src, audioCtx) {
    return new Promise((resolve) => {
        if (!audioCtx) { resolve(); return; } // 오디오 컨텍스트가 없으면 로드 시도 안 함
        fetch(src)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
            .then(audioBuffer => { assets.sounds[key] = audioBuffer; resolve(); })
            .catch(error => { console.warn(`Sound load failed: ${src}`, error); assets.sounds[key] = null; resolve(); });
    });
}

/**
 * 누락된 텍스처를 위한 플레이схолдер 이미지 데이터를 생성합니다.
 * 분홍색/검정색 체커보드 패턴에 물음표를 그려 만듭니다.
 * @param {number} width - 생성할 텍스처의 너비
 * @param {number} height - 생성할 텍스처의 높이
 * @returns {{img: HTMLImageElement, data: Uint8ClampedArray, w: number, h: number}} - UI용 Image 객체, 렌더링용 ImageData 배열, 크기 정보
 */
function createPlaceholderTexture(width = 32, height = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const color1 = '#ff00ff'; // Magenta
    const color2 = '#000000'; // Black
    const checkerSize = 8;
    for (let y = 0; y < height; y += checkerSize) {
        for (let x = 0; x < width; x += checkerSize) {
            ctx.fillStyle = ((x / checkerSize) % 2 === (y / checkerSize) % 2) ? color1 : color2;
            ctx.fillRect(x, y, checkerSize, checkerSize);
        }
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', width / 2, height / 2);
    
    const img = new Image();
    img.src = canvas.toDataURL();
    const data = ctx.getImageData(0, 0, width, height).data;
    
    return { img, data, w: width, h: height };
}


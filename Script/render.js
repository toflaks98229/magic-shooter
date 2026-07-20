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
    dom.canvas.width = window.innerWidth;
    dom.canvas.height = window.innerHeight;
    // 성능을 위해 실제 렌더링은 낮은 해상도로 수행
    dom.offscreenCanvas.width = window.innerWidth / C.RENDER_RESOLUTION_SCALE | 0;
    dom.offscreenCanvas.height = window.innerHeight / C.RENDER_RESOLUTION_SCALE | 0;

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

    // --- 애니메이션 벽(문) 정보 룩업 테이블 생성 ---
    // 렌더링 루프 전에 미리 애니메이션 중인 벽의 정보를 맵 좌표를 키로 하는 객체에 저장해두어,
    // 루프 내에서 빠르게 접근할 수 있도록 합니다.
    const animatedWallLookup = {};
    world.animatedWalls.forEach(wall => {
        animatedWallLookup[`${wall.mapX},${wall.mapY}`] = wall;
    });
    
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

    const light = runtime.dynamicLight;

    // 화면의 모든 수직선(column)에 대해 레이캐스팅을 수행합니다.
    for (let i = 0; i < width; i++) {
        const angle = world.player.angle - C.FOV / 2 + (i / width) * C.FOV;
        const ray = castRay(angle); // 해당 각도로 광선을 쏴서 벽과 충돌 정보를 얻음
        // 어안 렌즈 효과를 보정하고, zBuffer에 거리를 저장합니다.
        let correctedDist = Math.max(ray.distance * Math.cos(angle - world.player.angle), C.MIN_RENDER_DISTANCE);
        zBuffer[i] = correctedDist;

        // 벽 높이 계산
        const wallHeight = (C.TILE_SIZE / correctedDist) * projectionDist;
        let wallTopY = halfHeight - wallHeight / 2;
        
        // --- 애니메이션 벽(문) 처리 ---
        // 광선이 부딪힌 타일이 애니메이션 중인 벽인지 룩업 테이블에서 확인합니다.
        const animatedWall = animatedWallLookup[`${ray.mapX},${ray.mapY}`];
        let verticalOffset = 0;
        if (animatedWall) {
            // 애니메이션 중인 벽이라면, Z좌표를 기반으로 화면에서의 수직 오프셋을 계산합니다.
            verticalOffset = (animatedWall.z / correctedDist) * projectionDist;
        }
        // 계산된 오프셋을 벽의 Y좌표에 적용합니다.
        wallTopY -= verticalOffset;
        // --- 처리 끝 ---

        const wallBottomY = wallTopY + wallHeight;
        const y0 = Math.max(0, wallTopY | 0);
        const y1 = Math.min(height, wallBottomY | 0);

        // --- 벽 텍스처 선택 로직 ---
        let wallTextureInfo;
        const wallType = ray.texture;

        if (wallType === 1) { // 일반 벽
            if (wallTextures.length > 0) {
                const wallHash = (ray.mapX * 19 + ray.mapY * 73);
                const texIndex = Math.abs(wallHash) % wallTextures.length;
                wallTextureInfo = wallTextures[texIndex];
            } else {
                wallTextureInfo = placeholderTex;
            }
        } else if (wallType === 4) { // 출구
            wallTextureInfo = assets.textures.exit || placeholderTex;
        } else if (wallType === 5) { // 문
            wallTextureInfo = assets.textures.door_gate_1 || placeholderTex;
        } else {
            wallTextureInfo = placeholderTex;
        }
        // --- 로직 종료 ---
        
        const wallTexture = wallTextureInfo.data;
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

        // 계산된 벽 부분을 픽셀 단위로 버퍼에 씁니다.
        if (wallTexture) {
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

        // 바닥 및 천장 렌더링
        let floorXWall, floorYWall;
        if (ray.side === 0 && ray.rayDirX > 0) { floorXWall = ray.mapX; floorYWall = ray.mapY + ray.wallX; }
        else if (ray.side === 0 && ray.rayDirX < 0) { floorXWall = ray.mapX + 1.0; floorYWall = ray.mapY + ray.wallX; }
        else if (ray.side === 1 && ray.rayDirY > 0) { floorXWall = ray.mapX + ray.wallX; floorYWall = ray.mapY; }
        else { floorXWall = ray.mapX + ray.wallX; floorYWall = ray.mapY + 1.0; }
        floorXWall *= C.TILE_SIZE; floorYWall *= C.TILE_SIZE;

        // 벽 아래(애니메이션으로 올라간 공간 포함)부터 바닥/천장 픽셀을 채웁니다.
        for (let y = y1; y < height; y++) {
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

            const floorTexIndex = Math.abs(tileHash) % floorTextures.length;
            const floorTextureInfo = floorTextures[floorTexIndex];
            const floorTexData = floorTextureInfo.data;
            const floorTexSize = floorTextureInfo.w;

            const ceilingTexIndex = Math.abs(tileHash) % ceilingTextures.length;
            const ceilingTextureInfo = ceilingTextures[ceilingTexIndex];
            const ceilingTexData = ceilingTextureInfo.data;
            const ceilingTexSize = ceilingTextureInfo.w;

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

     // world.objectMap을 순회하며 렌더링할 오브젝트를 추출합니다.
    const objectsToRender = [];
    for (let y = 0; y < world.objectMap.length; y++) {
        for (let x = 0; x < world.objectMap[y].length; x++) {
            const objectId = world.objectMap[y][x];
            if (objectId > 0) {
                const objectType = C.OBJECT_TYPES[objectId];
                // renderAsWall 플래그가 없는 오브젝트만 스프라이트로 렌더링합니다.
                if (objectType && !objectType.renderAsWall) {
                    objectsToRender.push({
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
        }
    }

    // 렌더링할 모든 엔티티를 하나의 배열로 합칩니다.
    // animatedWalls에 있는 문은 renderWorld에서 벽으로 처리되므로 여기서는 제외합니다.
    const entitiesToRender = [...world.enemies, ...world.items, ...world.projectiles, ...world.particles, ...objectsToRender, ...world.animatedObjects]
        .map(e => {
            const dx = e.x - world.player.x;
            const dy = e.y - world.player.y;
            e.dist = Math.hypot(dx, dy);
            e.isParticle = !e.spriteKey; // spriteKey가 없으면 파티클로 간주
            return e;
        });

    // 멀리 있는 엔티티부터 그리도록 거리를 기준으로 내림차순 정렬합니다 (화가 기법).
    entitiesToRender.sort((a, b) => b.dist - a.dist);

    entitiesToRender.forEach(entity => {
        const dx = entity.x - world.player.x, dy = entity.y - world.player.y;
        let angleToEntity = Math.atan2(dy, dx) - world.player.angle;
        // 각도를 -PI ~ PI 범위로 정규화
        while (angleToEntity > Math.PI) angleToEntity -= 2 * Math.PI;
        while (angleToEntity < -Math.PI) angleToEntity += 2 * Math.PI;

        // 엔티티가 시야각(FOV) 내에 있을 때만 렌더링합니다.
        if (Math.abs(angleToEntity) < C.FOV / 2 + 0.2) { // 0.2는 화면 가장자리에서 스프라이트가 잘리는 것을 방지하기 위한 여유
            let correctedDist = Math.max(entity.dist * Math.cos(angleToEntity), C.MIN_RENDER_DISTANCE);
            
            const entityZ = entity.z || (C.TILE_SIZE / 2);
            const verticalOffset = ((C.TILE_SIZE / 2 - entityZ) / correctedDist) * projectionDist;
            
            const screenX = (width / 2) * (1 + Math.tan(angleToEntity) / Math.tan(C.FOV / 2));
            const entitySize = ((entity.size || C.TILE_SIZE) / correctedDist) * projectionDist;
            const entityTopY = halfHeight - (entitySize / 2) + verticalOffset;
            const entityLeftX = screenX - entitySize / 2;

            // 거리에 따라 투명도를 조절하여 멀리 있는 것이 희미하게 보이게 합니다.
            targetCtx.globalAlpha = 1 - Math.min(correctedDist / (C.TILE_SIZE * 10), 1);

            if (entity.isParticle) {
                // 파티클은 간단한 사각형으로 그립니다.
                const screen_x_int = entityLeftX | 0;
                // zBuffer를 확인하여 파티클이 벽 뒤에 있으면 그리지 않습니다.
                if (screen_x_int >= 0 && screen_x_int < width && zBuffer[screen_x_int] > correctedDist) {
                    targetCtx.fillStyle = entity.color || '#fff';
                    targetCtx.fillRect(entityLeftX, entityTopY, entitySize, entitySize);
                }
            } else {
                // 스프라이트 렌더링
                const spriteKey = entity.spriteKey;
                const sheetKey = assets.spriteKeyToSheet[spriteKey];

                const usePlaceholder = !sheetKey || !assets.spriteAtlases[sheetKey] || !assets.spriteSheets[sheetKey] || !assets.spriteAtlases[sheetKey].sprites[spriteKey];

                const sourceImage = usePlaceholder ? assets.textures.placeholder.img : assets.spriteSheets[sheetKey];
                const sourceCoords = usePlaceholder ?
                    { x: 0, y: 0, w: assets.textures.placeholder.w, h: assets.textures.placeholder.h } :
                    assets.spriteAtlases[sheetKey].sprites[spriteKey];

                if (sourceImage && sourceCoords) {
                    const startX = Math.max(0, Math.floor(entityLeftX));
                    const endX = Math.min(width, Math.ceil(entityLeftX + entitySize));

                    // zBuffer를 사용하여 각 수직선(stripe)이 벽 뒤에 가려지는지 확인합니다.
                    for (let stripe = startX; stripe < endX; stripe++) {
                        if (zBuffer[stripe] > correctedDist) {
                            const texX = Math.floor(((stripe - entityLeftX) / entitySize) * sourceCoords.w);
                            if (texX >= 0 && texX < sourceCoords.w) {
                                // 1픽셀 너비의 수직선을 잘라서 그립니다.
                                targetCtx.drawImage(
                                    sourceImage,
                                    sourceCoords.x + texX, sourceCoords.y,
                                    1, sourceCoords.h,
                                    stripe, entityTopY,
                                    1, entitySize
                                );
                            }
                        }
                    }
                }

                // 피격 효과: 최근에 맞았다면 하얀색으로 번쩍이는 효과를 줍니다.
                if (entity.lastHitTime && Date.now() - entity.lastHitTime < 100) {
                    targetCtx.globalCompositeOperation = 'lighter'; // 색상 혼합 모드 변경
                    targetCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                    targetCtx.fillRect(entityLeftX, entityTopY, entitySize, entitySize);
                    targetCtx.globalCompositeOperation = 'source-over'; // 원래대로 복구
                }
            }
        }
    });
    targetCtx.globalAlpha = 1.0; // 투명도 복구
}

/**
 * 주어진 각도로 광선을 쏴서 처음으로 부딪히는 벽의 정보를 반환합니다. (DDA 알고리즘 사용)
 * @param {number} angle - 발사할 광선의 각도 (라디안)
 * @returns {object} 충돌 정보 (거리, 텍스처 종류, 부딪힌 면, 텍스처 X좌표 등)
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
        if (world.map[mapY]?.[mapX] > 0) hit = 1; // 벽에 부딪힘
    }

    const perpWallDist = (side === 0) ? (sideDistX - deltaDistX) : (sideDistY - deltaDistY);
    let wallX = (side === 0) ? world.player.y / C.TILE_SIZE + perpWallDist * rayDirY : world.player.x / C.TILE_SIZE + perpWallDist * rayDirX;
    wallX -= (wallX | 0); // 텍스처 좌표 계산을 위해 소수점 부분만 남김
    
    return { distance: perpWallDist * C.TILE_SIZE, texture: world.map[mapY][mapX], side, wallX, rayDirX, rayDirY, mapX, mapY };
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

        } else if (key.startsWith('face_') || key.startsWith('gun') || key.startsWith('fist')) {
            // UI/무기는 HTML <img> 요소에 바로 사용하기 위해 Image 객체로 저장
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


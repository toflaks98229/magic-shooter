/**
 * @fileoverview 위에서 내려다보는 렌더러. 원본 DCSS 와 같은 시점입니다.
 *
 * 레이캐스터를 대신합니다. 몬스터 그림 551종과 벽·바닥 타일은 원래 위에서
 * 보는 그림이라, 시점을 되돌리면 그림이 제 모습으로 돌아옵니다.
 * 지금까지는 그것을 빌보드로 세워 쓰고 있었습니다.
 *
 * 다만 원본처럼 층 전체를 보여주지는 않습니다. 다 보이면 숨을 곳이 없습니다.
 * 이 갈래는 싸울 수 없는 게임이라, 무엇이 어디 있는지 모르는 것이 곧 긴장입니다.
 * 그래서 세 겹으로 그립니다.
 *
 *   지금 보이는 곳   — 밝게. 몬스터와 물건까지 보입니다
 *   가 본 적 있는 곳 — 어둡게. 지형만 기억나고 무엇이 서 있는지는 모릅니다
 *   가 본 적 없는 곳 — 아무것도 그리지 않습니다
 *
 * 원본의 지도도 같은 방식입니다. 다른 점은 원본이 한 번 본 몬스터를 기억해
 * 흐리게 남기는 데 비해, 여기서는 남기지 않는다는 것입니다.
 * 어디 있었는지 기억나면 피해 가기가 너무 쉬워집니다.
 */

import * as C from './constants.js';
import { world } from './world.js';
import { runtime } from './runtime.js';
import { assets } from './assets.js';
import { dom } from './dom.js';
import { hasLineOfSight } from './gameLogic.js';

/**
 * @description 한 칸을 화면에 몇 픽셀로 그릴지.
 *
 * 원본 타일이 32 픽셀이라 그대로 쓰면 화면에 스무 칸 남짓만 들어옵니다.
 * 공포에는 그편이 맞습니다. 넓게 보이면 다음에 무엇이 올지 미리 알게 됩니다.
 */
const CELL = 32;

/**
 * @description 시야가 닿는 거리(칸).
 *
 * 원본의 LOS_RADIUS 와 같습니다. 이 값이 곧 긴장의 크기라 함부로 늘리면
 * 게임이 통째로 물러집니다.
 */
const SIGHT_RADIUS = 8;

/** @description 기억으로만 남은 곳을 얼마나 어둡게 그릴지. */
const REMEMBERED_DIM = 0.35;

/**
 * 한 프레임을 그립니다.
 */
export function render() {
    if (!runtime.isGameRunning) return;

    const ctx = dom.ctx;
    const { width, height } = dom.canvas;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false;

    // 플레이어를 화면 한가운데 두고 그 둘레를 그립니다.
    const centerX = width / 2;
    const centerY = height / 2;
    const originX = centerX - world.player.x;
    const originY = centerY - world.player.y;

    const view = visibleBounds(width, height);
    rememberVisible(view);

    drawTerrain(ctx, view, originX, originY);
    drawItems(ctx, originX, originY);
    drawEnemies(ctx, originX, originY);
    drawPlayer(ctx, centerX, centerY);
}

/**
 * 화면에 들어오는 타일 범위를 구합니다.
 * @param {number} width - 화면 너비
 * @param {number} height - 화면 높이
 * @returns {{left: number, top: number, right: number, bottom: number}} 타일 범위
 */
function visibleBounds(width, height) {
    const halfCols = Math.ceil(width / (2 * CELL)) + 1;
    const halfRows = Math.ceil(height / (2 * CELL)) + 1;

    const tileX = Math.floor(world.player.x / C.TILE_SIZE);
    const tileY = Math.floor(world.player.y / C.TILE_SIZE);

    return {
        left: Math.max(0, tileX - halfCols),
        top: Math.max(0, tileY - halfRows),
        right: Math.min(C.MAP_WIDTH - 1, tileX + halfCols),
        bottom: Math.min(C.MAP_HEIGHT - 1, tileY + halfRows),
    };
}

/**
 * 지금 보이는 칸을 '가 본 곳' 으로 적어 둡니다.
 *
 * 한 번 본 지형은 어둡게라도 남습니다. 그러지 않으면 왔던 길도 매번
 * 새로 더듬어야 해서, 긴장이 아니라 성가심이 됩니다.
 * @param {object} view - 타일 범위
 */
function rememberVisible(view) {
    for (let y = view.top; y <= view.bottom; y++) {
        for (let x = view.left; x <= view.right; x++) {
            if (!isVisible(x, y)) continue;
            world.seen[y * C.MAP_WIDTH + x] = 1;
        }
    }
}

/**
 * 그 칸이 지금 보이는지 봅니다.
 * @param {number} tileX - 타일 X
 * @param {number} tileY - 타일 Y
 * @returns {boolean} 보이면 true
 */
function isVisible(tileX, tileY) {
    const playerTileX = Math.floor(world.player.x / C.TILE_SIZE);
    const playerTileY = Math.floor(world.player.y / C.TILE_SIZE);

    const dx = tileX - playerTileX;
    const dy = tileY - playerTileY;
    if (dx * dx + dy * dy > SIGHT_RADIUS * SIGHT_RADIUS) return false;

    return hasLineOfSight(
        world.player.x, world.player.y,
        tileX * C.TILE_SIZE + C.TILE_SIZE / 2,
        tileY * C.TILE_SIZE + C.TILE_SIZE / 2,
    );
}

/**
 * 벽과 바닥을 그립니다.
 * @param {CanvasRenderingContext2D} ctx - 그릴 대상
 * @param {object} view - 타일 범위
 * @param {number} originX - 화면 원점
 * @param {number} originY - 화면 원점
 */
function drawTerrain(ctx, view, originX, originY) {
    for (let y = view.top; y <= view.bottom; y++) {
        for (let x = view.left; x <= view.right; x++) {
            const lit = isVisible(x, y);
            const remembered = world.seen[y * C.MAP_WIDTH + x] === 1;
            if (!lit && !remembered) continue;

            const texture = tileTexture(x, y);
            if (!texture) continue;

            ctx.globalAlpha = lit ? 1 : REMEMBERED_DIM;
            blit(ctx, texture, originX + x * C.TILE_SIZE, originY + y * C.TILE_SIZE);
        }
    }
    ctx.globalAlpha = 1;
}

/**
 * 그 칸에 쓸 그림을 고릅니다.
 *
 * 볼트가 지정한 것이 먼저이고, 없으면 가지의 것을 씁니다.
 * 고르는 규칙 자체는 1인칭 쪽과 같아야 합니다. 같은 층이 시점에 따라
 * 다르게 생기면 두 갈래가 같은 데이터를 쓴다는 말이 무색해집니다.
 * @param {number} tileX - 타일 X
 * @param {number} tileY - 타일 Y
 * @returns {object|null} 텍스처
 */
function tileTexture(tileX, tileY) {
    const tile = C.tileAt(world.map, tileX, tileY);
    const kind = tile.solid ? 'wall' : 'floor';

    // 볼트가 지정한 그림이 먼저입니다.
    const override = world.vaultTiles?.[tileY * C.MAP_WIDTH + tileX];
    const name = tile.solid ? override?.tile : override?.floor;
    if (name) {
        const chosen = assets.textures[`vault_${name}_0`];
        if (chosen?.data) return chosen;
    }

    // 같은 칸은 늘 같은 변형을 씁니다. 매 프레임 바뀌면 바닥이 끓어 보입니다.
    const hash = Math.abs(tileX * 19 + tileY * 73);
    for (let i = 0; i < 4; i++) {
        const texture = assets.textures[`branch_${kind}_${world.branch}_${(hash + i) % 4}`];
        if (texture?.data) return texture;
    }

    return null;
}

/**
 * 바닥에 떨어진 물건을 그립니다.
 * @param {CanvasRenderingContext2D} ctx - 그릴 대상
 * @param {number} originX - 화면 원점
 * @param {number} originY - 화면 원점
 */
function drawItems(ctx, originX, originY) {
    for (const item of world.items) {
        const tileX = Math.floor(item.x / C.TILE_SIZE);
        const tileY = Math.floor(item.y / C.TILE_SIZE);
        if (!isVisible(tileX, tileY)) continue;

        drawSprite(ctx, item.spriteKey, originX + item.x - CELL / 2, originY + item.y - CELL / 2);
    }
}

/**
 * 적을 그립니다.
 *
 * 보이는 것만 그립니다. 기억으로 남기지 않는 것이 요점입니다.
 * 어디 있었는지 기억나면 피해 가기가 너무 쉬워집니다.
 * @param {CanvasRenderingContext2D} ctx - 그릴 대상
 * @param {number} originX - 화면 원점
 * @param {number} originY - 화면 원점
 */
function drawEnemies(ctx, originX, originY) {
    for (const enemy of world.enemies) {
        const tileX = Math.floor(enemy.x / C.TILE_SIZE);
        const tileY = Math.floor(enemy.y / C.TILE_SIZE);
        if (!isVisible(tileX, tileY)) continue;

        drawSprite(ctx, enemy.spriteKey, originX + enemy.x - CELL / 2, originY + enemy.y - CELL / 2);
    }
}

/**
 * 플레이어를 그립니다.
 * @param {CanvasRenderingContext2D} ctx - 그릴 대상
 * @param {number} centerX - 화면 한가운데
 * @param {number} centerY - 화면 한가운데
 */
function drawPlayer(ctx, centerX, centerY) {
    drawSprite(ctx, 'player_base', centerX - CELL / 2, centerY - CELL / 2);
}

/**
 * 스프라이트 하나를 그립니다.
 * @param {CanvasRenderingContext2D} ctx - 그릴 대상
 * @param {string} spriteKey - 스프라이트 이름
 * @param {number} screenX - 화면 X
 * @param {number} screenY - 화면 Y
 */
function drawSprite(ctx, spriteKey, screenX, screenY) {
    if (!spriteKey) return;

    const sheetKey = assets.spriteKeyToSheet?.[spriteKey];
    const atlas = assets.spriteAtlases?.[sheetKey];
    const sheet = assets.spriteSheets?.[sheetKey];
    const sprite = atlas?.sprites?.[spriteKey];
    if (!sheet || !sprite) return;

    ctx.drawImage(
        sheet, sprite.x, sprite.y, sprite.w, sprite.h,
        screenX | 0, screenY | 0, CELL, CELL,
    );
}

/**
 * 잘라 둔 텍스처를 화면에 찍습니다.
 *
 * 벽·바닥 텍스처는 아틀라스가 아니라 픽셀 배열로 들고 있습니다.
 * 레이캐스터가 그렇게 쓰기 때문인데, 여기서는 한 번 캔버스로 옮겨 두고
 * 그것을 그립니다. 매번 픽셀을 찍으면 칸 하나당 천 번이 넘습니다.
 * @param {CanvasRenderingContext2D} ctx - 그릴 대상
 * @param {object} texture - 텍스처
 * @param {number} screenX - 화면 X
 * @param {number} screenY - 화면 Y
 */
function blit(ctx, texture, screenX, screenY) {
    const canvas = textureCanvas(texture);
    if (!canvas) return;

    ctx.drawImage(canvas, screenX | 0, screenY | 0, CELL, CELL);
}

/** @description 픽셀 배열을 옮겨 둔 캔버스. 텍스처마다 한 번만 만듭니다. */
const textureCanvases = new WeakMap();

/**
 * 텍스처를 그릴 수 있는 캔버스로 바꿉니다.
 * @param {object} texture - 텍스처
 * @returns {HTMLCanvasElement|null} 캔버스
 */
function textureCanvas(texture) {
    if (textureCanvases.has(texture)) return textureCanvases.get(texture);
    if (!texture?.data) return null;

    const canvas = document.createElement('canvas');
    canvas.width = texture.w;
    canvas.height = texture.h;

    const ctx = canvas.getContext('2d');
    const image = ctx.createImageData(texture.w, texture.h);
    image.data.set(texture.data);
    ctx.putImageData(image, 0, 0);

    textureCanvases.set(texture, canvas);
    return canvas;
}

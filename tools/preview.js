/**
 * @fileoverview 게임 화면 한 프레임을 브라우저 없이 PNG로 렌더링합니다.
 *
 *   npm run preview
 *
 * 실제 render.js를 그대로 실행하므로, 아틀라스 좌표와 테마 텍스처가 제대로 붙었는지
 * 눈으로 확인할 수 있습니다. 브라우저를 띄우기 어려운 환경에서 에셋 작업의 결과를
 * 즉시 검증하기 위한 도구입니다.
 *
 * 캔버스 2D 컨텍스트를 픽셀 단위로 직접 구현했습니다. 렌더러가 쓰는 기능
 * (drawImage / getImageData / putImageData / fillRect)만 지원합니다.
 */

import { writePng } from './png.js';
import { installRenderEnvironment, attachHeadlessCanvas, seedRandom, projectRoot } from './headless.js';

seedRandom(0x1234ABCD);
installRenderEnvironment({ width: 960, height: 600 });

// --- 렌더링 ------------------------------------------------------------------

const C = await import('../Script/constants.js');
const { world } = await import('../Script/world.js');
const { dom } = await import('../Script/dom.js');
const { runtime } = await import('../Script/runtime.js');
const actions = await import('../Script/actions.js');
const { loadAssets, render, resizeCanvas } = await import('../Script/render.js');
const { spawnEnemiesForFloor, spawnMonster } = await import('../Script/gameLogic.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');

const screen = attachHeadlessCanvas(dom);

await loadAssets(null); // 사운드는 audioCtx가 없어 건너뜁니다.

const theme = process.argv[2] || 'main';
const variation = Number(process.argv[3] || 1);
const outPath = process.argv[4] || `preview-${theme}-${variation}.png`;

actions.setGameRunning(true);
world.themeName = theme;
world.themeVariation = variation;

const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, 15, 4, 8);
world.map = dungeon.map;
world.objectMap = dungeon.objectMap;
world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;
spawnEnemiesForFloor();

// 적 몇 마리를 플레이어 앞에 세워 스프라이트도 함께 확인합니다.
const forward = (distance, side = 0) => ({
    x: world.player.x + Math.cos(world.player.angle) * distance - Math.sin(world.player.angle) * side,
    y: world.player.y + Math.sin(world.player.angle) * distance + Math.cos(world.player.angle) * side,
});
// 서로 다른 몬스터를 나란히 세워 스프라이트를 한눈에 확인합니다.
const showcase = (process.argv[5] || 'orc,spectre,ice_giant,fire_demon').split(',');
world.enemies.length = 0;
showcase.forEach((id, i) => {
    const spot = forward(C.TILE_SIZE * (4 + i * 0.4), (i - (showcase.length - 1) / 2) * C.TILE_SIZE * 1.5);
    spawnMonster(id, spot);
});
world.items.push({ ...C.ITEM_TYPES.HEALTH, ...forward(C.TILE_SIZE * 3, C.TILE_SIZE * 0.8), z: C.TILE_SIZE / 2 });
world.items.push({ ...C.ITEM_TYPES.AMMO, ...forward(C.TILE_SIZE * 3.4, -C.TILE_SIZE * 0.9), z: C.TILE_SIZE / 2 });

resizeCanvas();
render();

writePng(projectRoot + outPath, { width: screen._w, height: screen._h, data: screen._pixels });
console.log(`${theme} variation ${variation} → ${outPath} (${screen._w}x${screen._h})`);

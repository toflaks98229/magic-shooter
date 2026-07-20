/**
 * @fileoverview 렌더링 성능 측정.
 *
 *   npm run bench            (현재 RENDER_RESOLUTION_SCALE 로)
 *   npm run bench -- 3 200   (스케일 3, 200프레임)
 *
 * 실제 render.js를 브라우저 없이 돌려 프레임당 소요 시간을 잽니다.
 * 절대 수치는 브라우저와 다르지만, 최적화 전후를 같은 조건에서 비교하는 데는 충분합니다.
 * 적과 발사체를 넉넉히 배치해 스프라이트 렌더링 비용도 함께 포함시킵니다.
 */

import { installRenderEnvironment, attachHeadlessCanvas, seedRandom } from './headless.js';

seedRandom(0x1234ABCD);
installRenderEnvironment({ width: 1920, height: 1080 });

const C = await import('../Script/constants.js');
const { world } = await import('../Script/world.js');
const { runtime } = await import('../Script/runtime.js');
const { dom } = await import('../Script/dom.js');
const actions = await import('../Script/actions.js');
const { loadAssets, render, resizeCanvas } = await import('../Script/render.js');
const { spawnEnemiesForFloor } = await import('../Script/gameLogic.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');

const scale = Number(process.argv[2] || C.RENDER_RESOLUTION_SCALE);
const frames = Number(process.argv[3] || 120);

/** 아무것도 그리지 않는 컨텍스트. 최종 합성 비용을 측정에서 빼기 위해 씁니다. */
function nullContext() {
    return new Proxy({}, { get: () => () => { }, set: () => true });
}

/** drawImage 호출 횟수를 셉니다. 배칭 효과는 시간보다 호출 수로 드러납니다. */
const counters = { drawImage: 0 };
function instrument(ctx) {
    const original = ctx.drawImage.bind(ctx);
    ctx.drawImage = (...args) => { counters.drawImage++; return original(...args); };
    return ctx;
}

// 오프스크린 -> 화면 확대 합성은 브라우저에서 GPU가 처리하므로 측정에서 제외합니다.
// 여기서 재는 것은 레이캐스팅과 스프라이트 렌더링, 즉 실제 자바스크립트 비용입니다.
attachHeadlessCanvas(dom, { screenContext: nullContext() });
instrument(dom.offscreenCtx);

await loadAssets(null);

actions.setGameRunning(true);
world.themeName = 'main';
world.themeVariation = 1;
const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, 15, 4, 8);
world.map = dungeon.map;
world.objectMap = dungeon.objectMap;
world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;
world.floor = 12;              // 층이 높을수록 적이 많습니다 (12*2+3 = 27마리)
spawnEnemiesForFloor();

// 스프라이트 비용을 확실히 포함시키기 위해 절반을 시야 안에 흩뿌립니다.
world.enemies.forEach((enemy, i) => {
    if (i % 2) return;
    const distance = C.TILE_SIZE * (2 + (i % 7));
    const side = ((i % 5) - 2) * C.TILE_SIZE * 0.7;
    enemy.x = world.player.x + Math.cos(world.player.angle) * distance - Math.sin(world.player.angle) * side;
    enemy.y = world.player.y + Math.sin(world.player.angle) * distance + Math.cos(world.player.angle) * side;
});

runtime.renderScale = scale;
resizeCanvas();

for (let i = 0; i < 12; i++) render(); // JIT 워밍업
counters.drawImage = 0;

// putImageData 는 브라우저에서 네이티브 memcpy 로 처리되지만 이 스텁에서는 픽셀 단위 복사라
// 측정을 왜곡합니다. 순수한 렌더러 비용을 보기 위해 선택적으로 제외합니다.
if (process.env.BENCH_SKIP_BLIT) dom.offscreenCtx.putImageData = () => { };

const samples = [];
for (let i = 0; i < frames; i++) {
    world.player.angle += 0.01; // 매 프레임 다른 각도로 캐시 효과를 배제
    const start = performance.now();
    render();
    samples.push(performance.now() - start);
}

samples.sort((a, b) => a - b);
const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
const columns = dom.offscreenCanvas.width;

console.log(`해상도 스케일 ${scale}  →  ${columns}x${dom.offscreenCanvas.height} (${frames}프레임, 적 ${world.enemies.length})`);
console.log(`  평균 ${mean.toFixed(2)}ms   중앙값 ${samples[frames >> 1].toFixed(2)}ms   95번째 ${samples[(frames * 0.95) | 0].toFixed(2)}ms`);
console.log(`  drawImage 호출 ${(counters.drawImage / frames).toFixed(0)}회/프레임`);

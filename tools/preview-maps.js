/**
 * @fileoverview 층 배치를 글자 그림으로 찍어 봅니다.
 *
 *   npm run preview:maps            모든 배치를 하나씩
 *   npm run preview:maps -- caves 3 특정 배치를 세 번
 *
 * 테스트는 '걸어갈 수 있는가'만 봅니다. 그것만으로는 층이 재미있게 생겼는지 알 수 없습니다.
 * 동굴이 사실 네모난 방이거나, 도시에 건물이 하나도 없어도 테스트는 통과합니다.
 * 브라우저를 열 수 없으니, 눈으로 확인할 방법은 이렇게 찍어 보는 것뿐입니다.
 */

import { installBrowserStubs, seedRandom } from '../tests/helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const { generateDungeon, allLayouts } = await import('../Script/mapGenerator.js');

/** @description 타일을 글자로. 로그라이크의 관례를 따릅니다. */
const GLYPH = {
    [C.TILE_IDS.WALL]: '#',
    [C.TILE_IDS.FLOOR]: '.',
    [C.TILE_IDS.EXIT]: '>',
    [C.TILE_IDS.DOOR]: '+',
    [C.TILE_IDS.BRANCH_ENTRANCE]: '<',
    [C.TILE_IDS.PORTAL]: 'O',
    [C.TILE_IDS.ALTAR]: '_',
};

const [wanted, countArg] = process.argv.slice(2);
const layouts = wanted ? [wanted] : allLayouts();
const count = Number(countArg) || 1;

if (wanted && !allLayouts().includes(wanted)) {
    console.error(`모르는 배치입니다: ${wanted}`);
    console.error(`쓸 수 있는 것: ${allLayouts().join(', ')}`);
    process.exit(1);
}

for (const layout of layouts) {
    for (let run = 0; run < count; run++) {
        seedRandom(0xF001 + run);
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, { layout });

        let floors = 0, doors = 0;
        const rows = dungeon.map.map((row, y) => row.map((tile, x) => {
            if (tile === C.TILE_IDS.FLOOR) floors++;
            if (tile === C.TILE_IDS.DOOR) doors++;
            if (x === dungeon.playerStart.x && y === dungeon.playerStart.y) return '@';
            return GLYPH[tile] ?? '?';
        }).join(''));

        console.log(`=== ${layout}${count > 1 ? ` #${run + 1}` : ''} — 바닥 ${floors}칸 · 문 ${doors}개 ===`);
        console.log(rows.join('\n'));
        console.log('');
    }
}

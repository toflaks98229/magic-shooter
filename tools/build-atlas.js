/**
 * @fileoverview 타일시트 아틀라스(*_data.json) 생성기.
 *
 *   npm run build:atlas
 *
 * Data/tiles/ 에 있는 Dungeon Crawl Stone Soup 타일시트에서 게임이 쓰는 스프라이트만
 * 골라 좌표 파일을 만듭니다. 아래 SELECTION 표가 "어느 시트의 어디를 무엇으로 쓸지"에 대한
 * 유일한 정의이며, 스프라이트를 바꾸고 싶으면 이 표만 고치면 됩니다.
 *
 * 좌표는 실제 시트를 열어 눈으로 확인해 고른 값입니다.
 * 벽/바닥은 32px 격자에 정렬되어 있어 (열, 행)로 지정하고,
 * 몬스터·아이템처럼 가변 크기로 배치된 것은 픽셀 좌표로 지정합니다.
 */

import { writeFileSync } from 'node:fs';
import { readPng } from './png.js';

/** @description 타일시트가 있는 디렉터리 (프로젝트 루트 기준) */
const TILES_DIR = new URL('../Data/tiles/', import.meta.url);

/** @description 격자형 시트의 타일 한 변 크기(px) */
const TILE = 32;

/**
 * @description 던전 테마별 벽/바닥/천장 텍스처.
 *
 * 이름은 render.js가 인식하는 `종류_테마_변형_번호` 규칙을 따라 자동 생성됩니다.
 * 각 항목은 시트 위에서 같은 재질이 연속으로 놓인 구간이며, [열, 행, 개수] 형식입니다.
 * 배열에 여러 텍스처가 들어가면 렌더러가 타일 좌표 해시로 섞어 써서 벽면이 단조롭지 않게 됩니다.
 *
 * DCSS에는 천장 타일이 없으므로, 바닥 시트에서 충분히 어두운 재질을 골라 천장으로 씁니다.
 */
const THEMES = {
    main: {
        1: {
            wall: { sheet: 'wall', run: [17, 33, 6] },    // 회색 벽돌
            floor: { sheet: 'floor', run: [6, 18, 6] },   // 어두운 반점 석재
            ceiling: { sheet: 'floor', run: [16, 4, 4] }, // 매우 어두운 석재
        },
        2: {
            wall: { sheet: 'wall', run: [1, 42, 6] },     // 회색 자갈벽
            floor: { sheet: 'floor', run: [7, 27, 6] },   // 밝은 회색 석재
            ceiling: { sheet: 'floor', run: [16, 4, 4] },
        },
    },
    cave: {
        1: {
            wall: { sheet: 'wall', run: [21, 13, 6] },    // 이끼 낀 암석
            floor: { sheet: 'floor', run: [7, 4, 6] },    // 어두운 이끼 바닥
            ceiling: { sheet: 'floor', run: [0, 18, 4] }, // 어두운 흙빛
        },
        2: {
            wall: { sheet: 'wall', run: [8, 11, 6] },     // 누런 암석 무더기
            floor: { sheet: 'floor', run: [6, 11, 6] },   // 모래 섞인 흙
            ceiling: { sheet: 'floor', run: [0, 18, 4] },
        },
    },
    hell: {
        1: {
            wall: { sheet: 'wall', run: [17, 41, 6] },    // 암적색 벽돌
            floor: { sheet: 'floor', run: [4, 15, 6] },   // 검붉은 소용돌이
            ceiling: { sheet: 'floor', run: [12, 26, 4] },// 어두운 적갈색
        },
        2: {
            wall: { sheet: 'wall', run: [17, 40, 6] },    // 황금빛 벽돌 (하층 변형)
            floor: { sheet: 'floor', run: [17, 17, 6] },  // 주황빛 소용돌이
            ceiling: { sheet: 'floor', run: [12, 26, 4] },
        },
    },
};

/**
 * @description 테마 외 개별 스프라이트.
 * grid는 32px 격자 좌표 [열, 행], rect는 픽셀 좌표 [x, y, 너비, 높이]입니다.
 */
const SPRITES = {
    wall: {
        // 출구 타일은 벽처럼 렌더링되므로 불투명한 32x32 텍스처여야 합니다.
        // 청록으로 빛나는 제단 패널이라 어느 테마에서도 눈에 띕니다.
        exit: { grid: [9, 38] },
    },
    feat: {
        door_gate_1: { grid: [1, 4] },                    // 금속 띠를 두른 나무문
    },
    player: {
        // 종족별 전신 도트. constants.js의 ENEMY_TYPES 색상과 맞춰 골랐습니다.
        enemy_grunt: { rect: [468, 96, 32, 40] },         // 주황
        enemy_berserker: { rect: [437, 96, 31, 39] },     // 적색
        enemy_imp: { rect: [437, 142, 32, 40] },          // 보라
        enemy_commando: { rect: [0, 96, 31, 39] },        // 청록
    },
    main: {
        item_health: { rect: [526, 816, 27, 23] },        // 녹색 보석
        item_ammo: { rect: [591, 1060, 21, 23] },         // 푸른 결정
        projectile_fireball: { rect: [226, 1092, 17, 15] },// 보랏빛 섬광
        projectile_bullet: { rect: [632, 816, 27, 23] },  // 청록 보석
        fist: { rect: [631, 415, 31, 31] },               // 황금 건틀릿
        gun: { rect: [592, 447, 28, 28] },                // 보석 지팡이
        gun_fire: { rect: [620, 447, 30, 30] },           // 빛나는 지팡이
    },
    gui: {},
};

/**
 * 지정한 시트/구간에서 텍스처 좌표 목록을 만듭니다.
 * @param {[number, number, number]} run - [시작 열, 행, 개수]
 * @returns {Array<{x: number, y: number, w: number, h: number}>} 좌표 목록
 */
function expandRun([column, row, count]) {
    return Array.from({ length: count }, (_, i) => ({
        x: (column + i) * TILE, y: row * TILE, w: TILE, h: TILE,
    }));
}

/**
 * 스프라이트 영역의 평균 색상을 구합니다.
 * 발사체가 벽에 부딪혔을 때 튀는 파티클 색으로 쓰이므로 아틀라스에 함께 기록합니다.
 * @param {object} image - 시트 이미지
 * @param {{x: number, y: number, w: number, h: number}} rect - 대상 영역
 * @returns {string} '#rrggbb' 형식의 색상
 */
function averageColor(image, rect) {
    let r = 0, g = 0, b = 0, count = 0;
    for (let y = 0; y < rect.h; y++) {
        for (let x = 0; x < rect.w; x++) {
            const i = ((rect.y + y) * image.width + (rect.x + x)) * 4;
            if (image.data[i + 3] < 128) continue; // 투명한 부분은 색 평균에서 제외
            r += image.data[i]; g += image.data[i + 1]; b += image.data[i + 2]; count++;
        }
    }
    if (count === 0) return '#ffffff';
    const hex = (v) => Math.round(v / count).toString(16).padStart(2, '0');
    return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/**
 * 좌표가 시트 범위를 벗어나지 않는지 확인합니다.
 * 표를 손으로 고치다 실수하면 게임이 조용히 깨진 텍스처를 그리는 대신 여기서 멈춥니다.
 * @param {string} sheet - 시트 이름
 * @param {object} image - 시트 이미지
 * @param {string} key - 스프라이트 이름
 * @param {object} rect - 좌표
 */
function assertInBounds(sheet, image, key, rect) {
    if (rect.x < 0 || rect.y < 0 || rect.x + rect.w > image.width || rect.y + rect.h > image.height) {
        throw new Error(
            `'${key}'의 좌표가 ${sheet}.png(${image.width}x${image.height}) 범위를 벗어납니다: ` +
            `x=${rect.x} y=${rect.y} w=${rect.w} h=${rect.h}`
        );
    }
}

// --- 아틀라스 조립 ---

const sheetNames = ['main', 'wall', 'floor', 'gui', 'player', 'feat'];
const images = Object.fromEntries(
    sheetNames.map(name => [name, readPng(new URL(`${name}.png`, TILES_DIR))])
);

/** @description 시트별로 모을 스프라이트 좌표 */
const atlases = Object.fromEntries(sheetNames.map(name => [name, {}]));

// 1. 테마 텍스처: 이름 규칙에 맞춰 자동으로 펼칩니다.
for (const [themeName, variations] of Object.entries(THEMES)) {
    for (const [variation, surfaces] of Object.entries(variations)) {
        for (const [surface, { sheet, run }] of Object.entries(surfaces)) {
            expandRun(run).forEach((rect, index) => {
                const key = `${surface}_${themeName}_${variation}_${index + 1}`;
                assertInBounds(sheet, images[sheet], key, rect);
                atlases[sheet][key] = rect;
            });
        }
    }
}

// 2. 개별 스프라이트
for (const [sheet, entries] of Object.entries(SPRITES)) {
    for (const [key, spec] of Object.entries(entries)) {
        const rect = spec.grid
            ? { x: spec.grid[0] * TILE, y: spec.grid[1] * TILE, w: TILE, h: TILE }
            : { x: spec.rect[0], y: spec.rect[1], w: spec.rect[2], h: spec.rect[3] };
        assertInBounds(sheet, images[sheet], key, rect);
        atlases[sheet][key] = { ...rect, color: averageColor(images[sheet], rect) };
    }
}

// 3. 파일로 쓰기
let total = 0;
for (const sheet of sheetNames) {
    const sprites = atlases[sheet];
    const count = Object.keys(sprites).length;
    total += count;
    writeFileSync(
        new URL(`${sheet}_data.json`, TILES_DIR),
        JSON.stringify({ sheetFile: `${sheet}.png`, sprites }, null, 2) + '\n',
        'utf8'
    );
    console.log(`  ${sheet}_data.json  스프라이트 ${String(count).padStart(3)}개`);
}
console.log(`\n아틀라스 ${sheetNames.length}개, 스프라이트 ${total}개를 생성했습니다.`);

/**
 * @fileoverview 타일시트 아틀라스(*_data.json) 생성기.
 *
 *   npm run build:atlas
 *
 * Data/tiles/ 에 있는 Dungeon Crawl Stone Soup 타일시트에서 게임이 쓰는 스프라이트만
 * 골라 좌표 파일을 만듭니다. 아래 SELECTION 표가 "어느 시트의 어디를 무엇으로 쓸지"에 대한
 * 유일한 정의이며, 스프라이트를 바꾸고 싶으면 이 표만 고치면 됩니다.
 *
 * 벽·바닥·문처럼 DCSS가 이름을 붙여 둔 타일은 좌표를 직접 쓰지 않습니다.
 * `npm run locate:tiles` 가 crawl 저장소의 원본과 픽셀 대조로 찾아낸 결과
 * (Data/tiles/tile-locations.json)를 이름으로 참조합니다.
 * 눈으로 고른 좌표는 'hell 벽인 줄 알았던 것이 황금 벽돌'처럼 조용히 틀리기 때문입니다.
 *
 * 몬스터·아이템처럼 대응하는 원본 이름을 특정하기 어려운 것만 픽셀 좌표로 남겨 둡니다.
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { readPng } from './png.js';

/** @description 타일시트가 있는 디렉터리 (프로젝트 루트 기준) */
const TILES_DIR = new URL('../Data/tiles/', import.meta.url);

/** @description 격자형 시트의 타일 한 변 크기(px) */
const TILE = 32;

/**
 * @description locate-tiles.js 가 이름으로 확정해 둔 좌표.
 * 없으면 아틀라스를 만들 수 없으므로 즉시 중단합니다.
 */
const LOCATIONS = (() => {
    const path = new URL('located.json', TILES_DIR);
    const file = new URL('tile-locations.json', TILES_DIR);
    if (!existsSync(file)) {
        throw new Error('Data/tiles/tile-locations.json 이 없습니다. 먼저 `npm run locate:tiles` 를 실행하십시오.');
    }
    return JSON.parse(readFileSync(file, 'utf8')).tiles;
})();

/**
 * 이름으로 확정된 타일의 좌표를 가져옵니다.
 * @param {string} name - locate-tiles.js 의 이름
 * @returns {{x: number, y: number, w: number, h: number}} 좌표
 */
function located(name) {
    const tile = LOCATIONS[name];
    if (!tile) throw new Error(`확정되지 않은 타일: ${name}. WANTED 에 추가하고 locate:tiles 를 다시 실행하십시오.`);
    return { x: tile.x, y: tile.y, w: tile.w, h: tile.h };
}

/**
 * 같은 재질의 변형 묶음을 이름으로 가져옵니다.
 * @param {string} prefix - 이름 앞부분 (예: 'wall_hell')
 * @returns {Array<{x: number, y: number, w: number, h: number}>} 좌표 목록
 */
function locatedSeries(prefix) {
    const names = Object.keys(LOCATIONS).filter(n => n.startsWith(prefix + '_') && /_\d+$/.test(n));
    if (names.length === 0) throw new Error(`확정된 타일이 없습니다: ${prefix}`);
    return names.sort((a, b) => Number(a.match(/\d+$/)[0]) - Number(b.match(/\d+$/)[0])).map(located);
}

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
    // 메인 던전: 어두운 벽돌과 회색 흙바닥. DCSS 의 D 층 기본 외형입니다.
    main: {
        1: { wall: 'wall_main', floor: 'floor_main', ceiling: 'ceil_rock' },
        2: { wall: 'wall_vault', floor: 'floor_limestone', ceiling: 'ceil_rock' },
    },
    // 짐승굴 계열: 흙과 바위
    cave: {
        1: { wall: 'wall_lair', floor: 'floor_lair', ceiling: 'ceil_dirt' },
        2: { wall: 'wall_sandstone', floor: 'floor_sand', ceiling: 'ceil_dirt' },
    },
    // 지옥 계열: 검붉은 벽과 용암빛 바닥
    hell: {
        1: { wall: 'wall_hell', floor: 'floor_hell', ceiling: 'ceil_volcanic' },
        2: { wall: 'wall_zot', floor: 'floor_lava', ceiling: 'ceil_volcanic' },
    },
    // 언데드 계열: 납골당과 무덤
    crypt: {
        1: { wall: 'wall_crypt', floor: 'floor_bones', ceiling: 'ceil_tomb' },
        2: { wall: 'wall_crypt', floor: 'floor_black', ceiling: 'ceil_tomb' },
    },
    // 오크 광산
    orc: {
        1: { wall: 'wall_orc', floor: 'floor_orc', ceiling: 'ceil_mud' },
        2: { wall: 'wall_orc', floor: 'floor_limestone', ceiling: 'ceil_mud' },
    },
    // 뱀굴
    snake: {
        1: { wall: 'wall_snake', floor: 'floor_sand', ceiling: 'ceil_dirt' },
        2: { wall: 'wall_snake', floor: 'floor_limestone', ceiling: 'ceil_dirt' },
    },
    // 거미 둥지
    spider: {
        1: { wall: 'wall_spider', floor: 'floor_spider', ceiling: 'ceil_mud' },
        2: { wall: 'wall_spider', floor: 'floor_lair', ceiling: 'ceil_mud' },
    },
    // 보물창고
    vault: {
        1: { wall: 'wall_vault', floor: 'floor_limestone', ceiling: 'ceil_marble' },
        2: { wall: 'wall_vault', floor: 'floor_black', ceiling: 'ceil_marble' },
    },
    // 얼음 동굴
    ice: {
        1: { wall: 'wall_sandstone', floor: 'floor_frozen', ceiling: 'ceil_ice' },
        2: { wall: 'wall_lair', floor: 'floor_frozen', ceiling: 'ceil_ice' },
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
        door_gate_1: { name: 'door_closed' },             // DCSS 의 닫힌 문
    },
    player: {
        // 종족별 전신 도트를 몬스터 스프라이트로 씁니다.
        // 색으로 구분되므로 레이캐스트 화면에서 멀리서도 어떤 적인지 알아볼 수 있습니다.

        // 초반 잡몹
        enemy_rat: { rect: [92, 188, 32, 39] },           // 회색
        enemy_kobold: { rect: [0, 188, 31, 40] },         // 주황
        enemy_snake: { rect: [969, 96, 32, 39] },         // 녹색
        enemy_frog: { rect: [905, 96, 32, 40] },          // 청록

        // 짐승굴 계열
        enemy_beast: { rect: [281, 188, 32, 39] },        // 검정
        enemy_spider: { rect: [747, 142, 31, 39] },       // 보라
        enemy_hydra: { rect: [320, 1446, 32, 36] },       // 창백한 비늘 몸통
        enemy_slime: { rect: [341, 142, 32, 40] },        // 연두

        // 오크·성채 계열
        enemy_goblin: { rect: [216, 142, 32, 39] },       // 황록
        enemy_orc: { rect: [0, 142, 32, 40] },            // 짙은 녹색
        enemy_orc_warrior: { rect: [437, 96, 31, 39] },   // 적색
        enemy_centaur: { rect: [874, 142, 32, 40] },      // 갈색

        // 언데드
        enemy_zombie: { rect: [623, 188, 31, 39] },       // 창백
        enemy_skeleton: { rect: [967, 142, 31, 38] },     // 회백
        enemy_mummy: { rect: [343, 326, 32, 39] },        // 누런빛
        enemy_spectre: { rect: [534, 1078, 32, 43] },     // 빛나는 구체

        // 얼음
        enemy_ice_beast: { rect: [532, 96, 32, 39] },     // 하늘색
        enemy_simulacrum: { rect: [564, 96, 32, 40] },    // 창백한 푸른빛
        enemy_ice_giant: { rect: [874, 96, 31, 39] },     // 짙은 파랑

        // 화염·악마
        enemy_gargoyle: { rect: [842, 142, 32, 39] },     // 석상 회색
        enemy_fire_demon: { rect: [468, 96, 32, 40] },    // 주황빛 적색
        enemy_imp: { rect: [437, 142, 32, 40] },          // 보라
        enemy_hell_knight: { rect: [343, 96, 32, 39] },   // 검붉은색
        enemy_demon: { rect: [405, 142, 32, 39] },        // 짙은 보라

        // 네임드 (같은 도트를 쓰되 크기가 커서 한눈에 구분됩니다)
        enemy_menkaure: { rect: [375, 326, 32, 40] },     // 미라 우두머리
        enemy_purgy: { rect: [698, 48, 32, 40] },         // 거대 개구리
        enemy_minotaur: { rect: [529, 188, 32, 39] },     // 검은 거구
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

// 1. 테마 텍스처: 확정된 이름 묶음을 렌더러의 이름 규칙으로 펼칩니다.
for (const [themeName, variations] of Object.entries(THEMES)) {
    for (const [variation, surfaces] of Object.entries(variations)) {
        for (const [surface, locatedPrefix] of Object.entries(surfaces)) {
            const sheet = LOCATIONS[`${locatedPrefix}_1`].sheet;
            locatedSeries(locatedPrefix).forEach((rect, index) => {
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
        const rect = spec.name
            ? located(spec.name)
            : spec.grid
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

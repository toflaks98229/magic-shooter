/**
 * @fileoverview 이 파일은 게임의 모든 상수 값과 설정을 담고 있습니다.
 * 이 값을 중앙에서 관리함으로써 게임의 밸런스와 속성을 쉽게 조정할 수 있습니다.
 */

// --- 에셋 경로 ---

/**
 * @description 스프라이트 시트의 좌표 정보가 담긴 아틀라스 파일들의 경로.
 * 각 아틀라스는 sheetFile로 같은 폴더의 PNG를 가리킵니다.
 * 이 파일들은 손으로 쓰는 것이 아니라 `npm run build:atlas`로 생성됩니다.
 */
export const SPRITE_SHEET_URLS = {
    main: 'Data/tiles/main_data.json',
    wall: 'Data/tiles/wall_data.json',
    floor: 'Data/tiles/floor_data.json',
    gui: 'Data/tiles/gui_data.json',
    player: 'Data/tiles/player_data.json',
    feat: 'Data/tiles/feat_data.json',
    icons: 'Data/tiles/icons_data.json',

    // 몬스터마다의 그림. rltiles/mon 의 개별 PNG 를 모은 것으로,
    // 다른 시트와 달리 build-monster-atlas.js 가 따로 만듭니다.
    monsters: 'Data/tiles/monsters_data.json',
};

// --- 던전 테마 설정 ---
/** @description 층별 테마 진행 정보를 담은 JSON 파일 경로 */
export const DUNGEON_PROGRESSION_URL = 'Data/dungeon_progression.json';

/**
 * @description 던전 종류별로 사용할 테마 목록을 지정합니다.
 * 여기에 테마 이름을 추가하면, 해당 던전 생성 시 목록 안에서 무작위로 선택됩니다.
 * 테마 이름은 JSON 파일의 `wall_themename_...` 규칙을 따릅니다.
 */
export const DUNGEON_THEMES = {
    main: ['main', 'cave'] // 메인 던전에서 사용할 테마 목록
    // 나중에 서브 던전을 추가할 경우:
    // sub_dungeon_A: ['forest', 'ruins'],
};


// --- 맵 & 렌더링 상수 ---

/** @description 맵 타일 하나의 픽셀 크기 */
export const TILE_SIZE = 32;
/**
 * @description 맵의 너비 (타일 기준). DCSS 의 GXM 과 같습니다.
 *
 * 예전에는 30x30 이었습니다. DCSS 층의 16% 크기라 원본의 레이아웃이 아예
 * 돌아가지 않았습니다. layout_roguey 는 방을 5x5 로 늘어놓는데 최소 폭이
 * 47 타일이라 30 칸 안에 들어갈 수가 없습니다. 볼트도 대부분 너무 컸습니다.
 *
 * 원본과 같은 치수로 맞추면 볼트와 레이아웃이 손대지 않고 그대로 들어옵니다.
 * 레이캐스터는 맵 크기와 무관하고(화면 폭과 시야 거리에만 비례),
 * 플로우 필드도 5600 칸은 1ms 미만이라 기술적 부담은 없습니다.
 */
export const MAP_WIDTH = 80;
/** @description 맵의 높이 (타일 기준). DCSS 의 GYM 과 같습니다. */
export const MAP_HEIGHT = 70;
/** @description 시야각 (Field of View), 60도 */
export const FOV = Math.PI / 3;
/**
 * @description 렌더링 해상도 축소 배율의 기본값. 값이 클수록 낮은 해상도로 그립니다.
 *
 * 오랫동안 8이었습니다. 1920px 화면이 240px로 그려질 만큼 낮은 값인데,
 * 스프라이트를 수직선마다 그리고 바닥 픽셀마다 텍스처를 다시 고르던 시절에는
 * 그렇게까지 낮추지 않으면 프레임을 유지할 수 없었기 때문입니다.
 * 그 두 가지를 정리한 뒤 실측한 결과 640x360에서도 렌더 비용이 4ms 수준이라 3으로 낮췄습니다.
 *
 * 기기에 따라 조절할 수 있도록 실제 사용 값은 runtime.renderScale 에 있습니다.
 * 저사양 기기에서 프레임이 모자라면 그 값을 키우면 됩니다.
 */
export const RENDER_RESOLUTION_SCALE = 3;
/** @description 벽이나 객체가 너무 가까울 때 화면을 뚫고 나오는 시각적 오류를 방지하기 위한 최소 렌더링 거리 */
export const MIN_RENDER_DISTANCE = 16;


// --- 플레이어 & 움직임 상수 ---

/** @description 플레이어의 초당 이동 속도 */
export const MOVE_SPEED = 2.0;
/** @description 플레이어의 회전 속도 (마우스 감도에 영향) */
export const ROTATION_SPEED = 1.5;
/** @description 이동 시 화면(무기)이 흔들리는 속도 */
export const BOB_SPEED = 0.15;
/** @description 이동 시 화면(무기)이 흔들리는 폭 */
export const BOB_AMOUNT = 8;
/** @description 이동 시 화면(무기)이 좌우로 흔들리는 폭 */
export const BOB_AMOUNT_X = 10;
/** @description 파티클에 적용되는 중력 값 */
export const PARTICLE_GRAVITY = 0.1;


// --- 시뮬레이션 안정성 상수 ---

/**
 * @description 한 화면 프레임에서 누산기에 넣을 수 있는 최대 시간(ms).
 * 탭 전환 후 복귀처럼 프레임 간격이 비정상적으로 벌어졌을 때,
 * 수백 스텝을 한 프레임에 몰아 실행해 화면이 멈추는 것을 방지합니다.
 * loop.js의 advanceSimulation 안에서 적용됩니다.
 */
export const MAX_FRAME_TIME = 100;

/** @description 적 스폰 위치를 무작위로 탐색할 최대 시도 횟수 */
export const SPAWN_MAX_ATTEMPTS = 200;
/** @description 적이 스폰될 때 플레이어와 유지해야 하는 최소 거리 (타일 단위) */
export const SPAWN_MIN_DISTANCE_TILES = 5;

/**
 * @description 한 층에 배치할 수 있는 적의 최대 수.
 *
 * 적 수는 누적 깊이에 비례하는데, 서브 던전이 생기면서 깊이가 25를 넘게 되어
 * 상한이 없으면 30x30 맵에 50마리 넘게 들어차게 됩니다.
 */
// 30x30 시절의 값은 30 이었습니다. 맵이 여섯 배 넓어졌는데 상한이 그대로면
// 6층부터 계속 상한에 걸려 깊이가 다시 뜻을 잃습니다.
export const MAX_ENEMIES_PER_FLOOR = 55;

/**
 * @description 밀도를 재는 기준이 되는 바닥 칸 수.
 *
 * 적 수를 깊이만으로 정하면 맵 크기가 바뀔 때 밀도가 통째로 어긋납니다.
 * 30x30 에서 80x70 으로 키우자 적 한 마리당 바닥이 203 칸이 되어 층이 텅 비었습니다.
 * 이 값은 옛 30x30 의 평균 바닥 수로, 그때의 밀도를 기준으로 삼는다는 뜻입니다.
 */
export const BASELINE_FLOOR_TILES = 380;

/**
 * @description 넓이 보정의 상한.
 *
 * 이것이 없으면 넓이가 깊이를 압도해 1층부터 상한까지 적이 차오릅니다.
 * 깊이가 위험도를 정한다는 원칙을 지키려면 늘어나는 폭을 막아야 합니다.
 */
export const MAX_AREA_SCALE = 3;

/**
 * @description 적끼리 서로 밀어내는 세기. 겹친 만큼의 몇 배로 떨어뜨릴지 정합니다.
 *
 * 적은 모두 같은 플로우 필드를 따라 플레이어에게 다가옵니다. 게다가 그 필드는
 * 네 방향만 보므로 다들 같은 타일 중심을 향해 걷습니다. 밀어내는 힘이 없으면
 * 플레이어 앞에서 여러 마리가 한 점에 완전히 겹쳐 한 마리처럼 보입니다.
 * 무엇을 상대하고 있는지 알 수 없어 전투 가독성을 가장 크게 해치는 부분이었습니다.
 *
 * 1보다 작게 둡니다. 한 번에 겹침을 다 풀면 서로 튕겨 나가 부자연스럽고,
 * 좁은 복도에서 벽에 끼었을 때 진동합니다. 여러 스텝에 걸쳐 서서히 벌어지게 합니다.
 */
export const ENEMY_SEPARATION_STRENGTH = 0.5;

/**
 * @description 적끼리 겹쳤다고 볼 거리의 배율. 두 적의 반지름 합에 곱합니다.
 * 1이면 몸이 실제로 닿을 때만 밀어내는데, 그보다 조금 넉넉히 두어야
 * 스프라이트가 서로 파고들기 전에 벌어집니다.
 */
export const ENEMY_SEPARATION_RANGE = 1.1;

/**
 * @description 도망을 시작하는 거리(타일). 이보다 가까워야 겁을 먹습니다.
 * 멀리서 다친 적까지 달아나면 화면 밖에서 무슨 일이 벌어지는지 알 수 없습니다.
 */
export const FLEE_START_DISTANCE_TILES = 6;

/**
 * @description 도망을 그만두는 거리(타일). 여기까지 벌리면 숨을 돌리고 다시 덤빕니다.
 *
 * 시작 거리보다 넉넉히 크게 둡니다. 두 값이 같으면 경계에서 도망과 추격을
 * 매 스텝 오가며 제자리걸음을 합니다. 벌어진 두 값이 그 진동을 막습니다.
 */
export const FLEE_STOP_DISTANCE_TILES = 10;

/**
 * @description 몰린 적이 체념하고 싸우는 시간(ms).
 *
 * 물러날 곳이 없으면 돌아서서 뭅니다. 그런데 돌아선 다음 스텝에 다시 겁을 먹으면
 * 도망과 추격을 매 스텝 오가며 공격이 절반만 나갑니다.
 * 그래서 한 번 몰리면 이 시간 동안은 겁을 먹지 않고 싸우게 합니다.
 */
export const CORNERED_FIGHT_MS = 2000;

/**
 * @description 거리를 두고 싸우는 적이 지키려는 거리(타일). (mon-behv.cc:115)
 * 원본은 시야의 절반쯤을 이상적인 거리로 잡습니다.
 */
export const KITE_IDEAL_DISTANCE_TILES = 5;

/**
 * @description 정신없이 날아다니는 적이 한 방향으로 나아가는 시간(ms).
 * 이보다 짧으면 제자리에서 떠는 것처럼 보이고, 길면 그냥 직진하는 적이 됩니다.
 */
export const ERRATIC_LEG_MS = 400;

/**
 * @description 플레이어의 기본 명중값.
 *
 * DCSS 는 15 + 민첩/2 에 격투·무기 스킬 굴림을 더해 구합니다. (attack.cc:177)
 * 아직 스킬과 능력치가 들어오지 않았으므로, 민첩 10 에 스킬 0 인 사람의 값을
 * 임시로 고정해 둡니다. 4단계에서 스킬이 들어오면 계산으로 바뀝니다.
 *
 * 이 값이 커지면 회피가 높은 몬스터의 과녁도 함께 커집니다.
 * combat.js 의 aimRadius 가 명중 확률을 과녁 넓이로 옮기기 때문입니다.
 */
export const BASE_PLAYER_TO_HIT = 20;

/**
 * @description 시뮬레이션 한 스텝의 길이(ms).
 * 게임 로직은 실제 프레임 간격과 무관하게 항상 이 크기로만 전진합니다.
 * 덕분에 30FPS든 144FPS든 같은 시간에 같은 결과가 나옵니다.
 */
export const SIMULATION_STEP_MS = 1000 / 60;

/**
 * @description 속도 상수들이 기준으로 삼는 프레임 길이(ms).
 * MOVE_SPEED 등은 "이 길이의 프레임 하나당" 이동량으로 정의되어 있습니다.
 * SIMULATION_STEP_MS를 바꿔도 체감 속도가 유지되도록 하는 환산 기준입니다.
 */
export const REFERENCE_FRAME_MS = 1000 / 60;

/**
 * @description 한 화면 프레임에서 실행할 수 있는 최대 시뮬레이션 스텝 수.
 * 기기가 느려 따라잡지 못할 때 스텝이 계속 밀려 더 느려지는
 * '죽음의 나선(spiral of death)'을 방지합니다.
 */
export const MAX_STEPS_PER_FRAME = 6;

/**
 * @description 쿨다운이 이미 지난 것으로 취급되는 과거 시각.
 * 게임 내부 시간은 0에서 시작하므로, 마지막 공격 시각을 0으로 두면
 * 시작 직후 쿨다운이 안 지난 것으로 판정됩니다. 그것을 피하기 위한 초기값입니다.
 */
export const PAST_TIME = -1e9;

/** @description 다음 층으로 진입할 때 회복시켜 주는 체력 */
export const FLOOR_CLEAR_HEAL = 15;
/** @description 다음 층으로 진입할 때 보충해 주는 탄약 */
export const FLOOR_CLEAR_AMMO = 10;

// --- 맵 타일 정의 ---

/**
 * @description 맵 배열에 기록되는 타일 ID.
 * 이전에는 0/1/4/5 라는 숫자가 mapGenerator, gameLogic, render 세 파일에 흩어져 있어
 * 새 타일(함정, 용암, 부술 수 있는 벽)을 추가하려면 다섯 군데를 동시에 고쳐야 했습니다.
 */
export const TILE_IDS = {
    FLOOR: 0,
    WALL: 1,
    EXIT: 4,
    DOOR: 5,
    BRANCH_ENTRANCE: 6,
    PORTAL: 7,
    ALTAR: 8,
    GRATE: 9,
    GLASS: 10,
    STATUE: 11,
    SHALLOW_WATER: 12,
    DEEP_WATER: 13,
    LAVA: 14,
    TREE: 15,
};

/**
 * @description 타일 종류별 속성.
 *
 * solid   - 통과할 수 없음 (이동 판정)
 * opaque  - 광선을 막음 (렌더링, 시야, 발사체·파티클 충돌)
 * spawnable - 적이 스폰될 수 있음
 * wallTexture - 벽으로 그릴 때 쓸 텍스처. 'theme'이면 현재 던전 테마의 벽 텍스처를 씁니다.
 * interaction - 스페이스바로 상호작용했을 때의 동작
 *
 * 문(DOOR)은 solid가 아닙니다. 닫힌 문의 통행 차단은 objectMap의 오브젝트가 담당하며,
 * 이 타일은 "문처럼 생긴 벽으로 그린다"는 뜻만 갖습니다.
 */
export const TILE_TYPES = {
    [TILE_IDS.FLOOR]: {
        id: TILE_IDS.FLOOR, name: 'floor',
        solid: false, opaque: false, spawnable: true,
        wallTexture: null, interaction: null,
    },
    [TILE_IDS.WALL]: {
        id: TILE_IDS.WALL, name: 'wall',
        solid: true, opaque: true, spawnable: false,
        wallTexture: 'theme', interaction: null,
    },
    [TILE_IDS.EXIT]: {
        id: TILE_IDS.EXIT, name: 'exit',
        solid: true, opaque: true, spawnable: false,
        wallTexture: 'exit', interaction: 'exit',
    },
    [TILE_IDS.DOOR]: {
        id: TILE_IDS.DOOR, name: 'door',
        solid: false, opaque: true, spawnable: false,
        wallTexture: 'door_gate_1', interaction: null,
    },
    [TILE_IDS.BRANCH_ENTRANCE]: {
        id: TILE_IDS.BRANCH_ENTRANCE, name: 'branch entrance',
        solid: true, opaque: true, spawnable: false,
        // 출구와 같은 텍스처를 쓰되, 어느 가지로 이어지는지는 world.entrances가 압니다.
        wallTexture: 'exit', interaction: 'branch',
    },
    [TILE_IDS.ALTAR]: {
        id: TILE_IDS.ALTAR, name: 'altar',
        solid: true, opaque: true, spawnable: false,
        // 어느 신의 제단인지는 world.altars 가 압니다. 밟아서 지나가는 것이 아니라
        // 앞에 서서 스페이스로 개종하는 것이라 벽처럼 막혀 있는 편이 자연스럽습니다.
        wallTexture: 'exit', interaction: 'altar',
    },
    [TILE_IDS.GRATE]: {
        id: TILE_IDS.GRATE, name: 'iron grate',
        // 막지만 보입니다. DCSS 의 쇠창살(DNGN_GRATE)에 해당합니다.
        //
        // 두 축이 갈라지는 첫 타일입니다. 지금까지는 막는 것과 보이지 않는 것이
        // 언제나 같아서 둘을 섞어 써도 드러나지 않았습니다.
        // 갇힌 몬스터를 보면서 다가갈 수 없게 만들거나, 건너편이 보이는 방을
        // 만들 수 있습니다. 소리는 벽을 넘어가므로 창살 너머의 것도 깨어납니다.
        // 창살 사이로는 쏠 수 있습니다. 이것이 유리벽과 갈리는 점입니다.
        // 보면서 쏠 수는 있되 다가갈 수 없는 자리가 만들어집니다.
        solid: true, opaque: false, blocksShots: false, spawnable: false,
        wallTexture: 'grate', interaction: null,
    },
    [TILE_IDS.GLASS]: {
        id: TILE_IDS.GLASS, name: 'clear wall',
        // 유리벽. 막고, 보이고, 발사체도 막습니다.
        //
        // 쇠창살과 짝을 이룹니다. 창살은 쏠 수 있고 유리벽은 못 쏩니다.
        // 둘 다 보이지만 대응이 갈려서, 같은 그림인데 다른 방이 됩니다.
        solid: true, opaque: false, spawnable: false,
        wallTexture: 'glass', interaction: null,
    },
    [TILE_IDS.STATUE]: {
        id: TILE_IDS.STATUE, name: 'granite statue',
        // 화강암 상. 원본도 보이지만 지나갈 수 없다고 못박아 둡니다.
        solid: true, opaque: false, spawnable: false,
        wallTexture: 'statue', interaction: null,
    },
    [TILE_IDS.SHALLOW_WATER]: {
        id: TILE_IDS.SHALLOW_WATER, name: 'shallow water',
        // 누구나 건넙니다. 원본에서도 걸어 들어갈 수 있고, 소리가 납니다.
        solid: false, opaque: false, spawnable: true,
        wallTexture: null, interaction: null,
    },
    [TILE_IDS.DEEP_WATER]: {
        id: TILE_IDS.DEEP_WATER, name: 'deep water',
        // 나는 것만 건넙니다. 이 게임에는 헤엄이 없어서 플레이어는 막힙니다.
        //
        // 이 타일이 생기면서 flies 깃발이 비로소 뜻을 갖습니다. 182종이 갖고
        // 있는데 지금까지 아무 일도 하지 않았습니다. 무시할 지형이 없었기 때문입니다.
        // 이제 물 건너의 적은 날 수 있는 것만 다가옵니다.
        solid: true, opaque: false, crossableByFlight: true, spawnable: false,
        wallTexture: null, interaction: null,
    },
    [TILE_IDS.LAVA]: {
        id: TILE_IDS.LAVA, name: 'lava',
        // 나는 것만 건넙니다. 건너는 동안 탑니다.
        solid: true, opaque: false, crossableByFlight: true, burns: true, spawnable: false,
        wallTexture: null, interaction: null,
    },
    [TILE_IDS.TREE]: {
        id: TILE_IDS.TREE, name: 'tree',
        // 원본에서 나무는 막고 가립니다. 벽과 같되 나중에 태울 수 있습니다.
        solid: true, opaque: true, spawnable: false,
        wallTexture: 'tree', interaction: null,
    },
    [TILE_IDS.PORTAL]: {
        id: TILE_IDS.PORTAL, name: 'portal',
        solid: true, opaque: true, spawnable: false,
        // 시간이 지나면 사라지는 임시 입구입니다. world.portals가 언제 닫히는지 압니다.
        wallTexture: 'exit', interaction: 'portal',
    },
};

/** @description 맵 바깥을 조회했을 때 돌려줄 타일. 벽과 동일하게 취급해 광선이 새어나가지 않게 합니다. */
const OUT_OF_BOUNDS = TILE_TYPES[TILE_IDS.WALL];

/**
 * 맵 좌표의 타일 속성을 조회합니다. 범위를 벗어나면 벽으로 취급합니다.
 * @param {number[][]} map - 맵 배열
 * @param {number} x - 타일 X 좌표
 * @param {number} y - 타일 Y 좌표
 * @returns {object} TILE_TYPES 항목
 */
export function tileAt(map, x, y) {
    return TILE_TYPES[map[y]?.[x]] ?? OUT_OF_BOUNDS;
}


/**
 * @description 맵 오브젝트 유형별 속성을 정의한 객체.
 * 키 값은 objectMap에 기록될 ID입니다.
 * --- 문(Door) 시스템 변경 사항 ---
 * - 문이 벽처럼 렌더링되도록 `renderAsWall: true`로 설정합니다.
 * - `size` 속성은 더 이상 필요 없으므로 제거합니다.
 * - '열린 문' 상태는 애니메이션으로 대체되므로 제거합니다.
 */
export const OBJECT_TYPES = {
    1: { id: 1, name: 'Door', spriteKey: 'door_gate_1', solid: true, interactive: true, hp: 100, renderAsWall: true },
    // 2: { id: 2, name: 'Open Door', ... } // '열린 문' 상태는 애니메이션으로 대체되므로 제거합니다.
    // 여기에 분수, 보물 상자 등 다른 오브젝트를 추가할 수 있습니다.
};


// --- 엔티티(개체) 정의 ---
// 적의 정의는 monsters.js 로 옮겼습니다. 종류가 늘어나면서 상수 파일에 두기에는
// 양이 많아졌고, 던전별 스폰 목록과 함께 관리되는 편이 자연스럽기 때문입니다.

/**
 * @description 드랍 아이템 유형별 속성을 정의한 객체.
 */
export const ITEM_TYPES = {
    HEALTH: { color: '#00ff7f', type: 'health', amount: 25, size: 15, spriteKey: 'item_health' },
    AMMO:   { color: '#1e90ff', type: 'ammo', amount: 20, size: 15, spriteKey: 'item_ammo' }
};

/**
 * @description 발사체 유형별 속성을 정의한 객체.
 */
export const PROJECTILE_TYPES = {
    ENEMY_FIREBALL: { color: '#9932cc', size: 10, spriteKey: 'projectile_fireball' },
    ENEMY_BULLET:   { color: '#00ced1', size: 8, spriteKey: 'projectile_bullet' }
};


// --- 무기 정의 ---

/**
 * @description 무기 유형별 속성을 정의한 객체.
 */
export const WEAPONS = {
    fist: {
        /** @description 상태 패널에 들고 있는 것으로 표시할 이름 */
        name: '마법 장갑',
        sprite: 'fist',
        cooldown: 400,
        range: TILE_SIZE * 1.2,
        damage: 35,
        /** @description 공격 시 무기 스프라이트에 붙일 CSS 클래스. 없으면 연출 없음. */
        attackAnimation: 'attacking',
        /** @description 공격 시 재생할 효과음 키. null이면 무음. */
        sound: null
    },
    gun: {
        name: '마법 지팡이',
        sprite: 'gun',
        fireSprite: 'gun_fire',
        cooldown: 200,
        damage: 50,
        lightIntensity: 1.5,
        lightFalloff: 0.0005,
        attackAnimation: null,
        sound: 'GUN_SHOT'
    }
};

/** @description 무기 공격 연출용 CSS 클래스가 유지되는 시간(ms) */
export const WEAPON_ATTACK_ANIM_MS = 100;
/** @description 총구 섬광 스프라이트가 표시되는 시간(ms) */
export const MUZZLE_FLASH_MS = 60;
/** @description 무기 교체 애니메이션의 한 방향(내려가기 또는 올라오기) 소요 시간(ms). CSS의 swap-out/in 길이와 맞춰야 합니다. */
export const WEAPON_SWAP_HALF_MS = 150;
/** @description 피격 시 화면 혈흔 효과가 유지되는 시간(ms) */
export const HIT_REACTION_MS = 150;
/** @description 적이 피격 시 하얗게 번쩍이는 시간(ms) */
export const HIT_FLASH_MS = 100;

/** @description 마우스 이동 1픽셀당 회전량 계수 */
export const MOUSE_SENSITIVITY = 0.001;
/** @description 터치 시점 조작의 감도 배수 (마우스 대비) */
export const TOUCH_LOOK_MULTIPLIER = 2;
/** @description 프레임 사이에 쌓아둘 수 있는 입력 동작의 최대 개수 */
export const MAX_QUEUED_INPUTS = 32;


// --- 사운드 정의 ---

/**
 * @description 게임 내에서 사용될 사운드 효과의 키와 파일 경로를 정의한 객체.
 */
export const SOUNDS = {
    GUN_SHOT: 'Sound/gun_shot.wav',
    ENEMY_HIT: 'Sound/enemy_hit.wav',
    PLAYER_HIT: 'Sound/player_hit.wav',
    ITEM_PICKUP: 'Sound/item_pickup.wav',
    WEAPON_SWAP: 'Sound/weapon_swap.wav',
    DOOR_OPEN: 'Sound/door_open.wav', // 문 열림 효과음 추가 (실제 파일 필요)
};


// --- UI 상수 ---

/**
 * @description UI 상태 창에 표시될 얼굴 이미지의 spriteKey를 정의한 객체.
 */
export const FACE_SPRITES = {
    HEALTHY: 'face_healthy',
    HURT: 'face_hurt',
    BLOODY: 'face_bloody',
    HIT_REACTION: 'face_hit_reaction'
};


/**
 * @description 순간이동으로 뛰는 거리(타일).
 * 원본은 시야 안 아무 칸이나 고르지만, 실시간에서는 너무 멀리 사라지면
 * 어디로 갔는지 읽히지 않아 시야 절반쯤으로 줄였습니다.
 */
export const BLINK_RANGE_TILES = 4;

/** @description 동료를 치유할 수 있는 거리(타일). */
export const HEAL_ALLY_RANGE_TILES = 8;

/**
 * @description 한 층에 동시에 존재할 수 있는 적의 수.
 *
 * 소환 때문에 필요해진 상한입니다. 원본의 소환 수치는 한 턴에 한 번 행동하는
 * 것을 전제로 맞춰져 있어 견딜 만하지만, 실시간에서는 같은 수치가 금세
 * 화면을 메웁니다. 부르는 쪽의 성격은 남기되 총량만 막았습니다.
 */
export const MAX_ENEMIES_ON_FLOOR = 40;

/**
 * @description 한 마리가 동시에 거느릴 수 있는 소환물의 수.
 * 원본은 턴마다 한 번 행동하니 부르는 속도가 저절로 눌리지만,
 * 실시간에서는 같은 수치가 금세 화면을 메웁니다.
 */
export const MAX_SUMMONS_PER_CASTER = 4;

/**
 * @description 가속이 이동을 얼마나 빠르게 하는가.
 * 원본의 가속은 행동을 두 배로 만듭니다. 실시간에서 두 배는 너무 급해서
 * 이동에만 얹고 폭을 줄였습니다.
 */
export const HASTE_SPEED_SCALE = 1.5;

/** @description 광포가 이동을 얼마나 빠르게 하는가. 가속보다 조금 더입니다. */
export const BERSERK_SPEED_SCALE = 1.7;

/**
 * @description 감속에 걸린 플레이어의 이동 배율.
 * 원본의 마비·혼란과 달리 조작을 빼앗지 않습니다. 살아남을 수 있고,
 * 대신 길을 다시 짜게 만듭니다.
 */
export const SLOW_SPEED_SCALE = 0.6;

/** @description 완력이 피해를 얼마나 올리는가. */
export const MIGHT_DAMAGE_SCALE = 1.4;

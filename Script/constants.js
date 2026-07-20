/**
 * @fileoverview 이 파일은 게임의 모든 상수 값과 설정을 담고 있습니다.
 * 이 값을 중앙에서 관리함으로써 게임의 밸런스와 속성을 쉽게 조정할 수 있습니다.
 */

// --- 에셋 경로 ---

/** @description 게임에 사용될 스프라이트 시트들의 좌표 정보가 담긴 JSON 파일들의 경로 */
export const SPRITE_SHEET_URLS = {
    main: 'Image/main_data.json',
    wall: 'Image/wall_data.json',
    floor: 'Image/floor_data.json',
    gui: 'Image/gui_data.json',
    player: 'Image/player_data.json',
    feat: 'Image/feat_data.json'
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
/** @description 맵의 너비 (타일 기준) */
export const MAP_WIDTH = 30;
/** @description 맵의 높이 (타일 기준) */
export const MAP_HEIGHT = 30;
/** @description 시야각 (Field of View), 60도 */
export const FOV = Math.PI / 3;
/** @description 렌더링 해상도 스케일. 값이 클수록 낮은 해상도로 렌더링하여 성능을 향상시킵니다. */
export const RENDER_RESOLUTION_SCALE = 8;
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
 * @description 한 프레임에서 시뮬레이션에 반영할 수 있는 최대 시간(ms).
 * 탭 전환 후 복귀처럼 프레임 간격이 비정상적으로 벌어졌을 때,
 * 플레이어가 한 번에 타일 하나 이상을 이동해 벽을 관통하는 것을 방지합니다.
 */
export const MAX_FRAME_TIME = 100;

/** @description 적 스폰 위치를 무작위로 탐색할 최대 시도 횟수 */
export const SPAWN_MAX_ATTEMPTS = 200;
/** @description 적이 스폰될 때 플레이어와 유지해야 하는 최소 거리 (타일 단위) */
export const SPAWN_MIN_DISTANCE_TILES = 5;

/** @description 다음 층으로 진입할 때 회복시켜 주는 체력 */
export const FLOOR_CLEAR_HEAL = 15;
/** @description 다음 층으로 진입할 때 보충해 주는 탄약 */
export const FLOOR_CLEAR_AMMO = 10;

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

/**
 * @description 적 유형별 속성을 정의한 객체.
 * spriteKey는 로드된 JSON 파일들 중 하나에 정의된 이름과 일치해야 합니다.
 */
export const ENEMY_TYPES = {
    MELEE_GRUNT:     { color: '#ff8c00', hp: 40, speed: 0.7, type: 'melee', damage: 10, cooldown: 1000, size: 20, spriteKey: 'enemy_grunt' },
    MELEE_BERSERKER: { color: '#dc143c', hp: 80, speed: 1.2, type: 'melee', damage: 20, cooldown: 1500, size: 25, spriteKey: 'enemy_berserker' },
    RANGED_IMP:      { color: '#9932cc', hp: 30, speed: 0.5, type: 'ranged', damage: 15, cooldown: 2000, projectileSpeed: 2.5, range: TILE_SIZE * 7, spriteKey: 'enemy_imp' },
    RANGED_COMMANDO: { color: '#00ced1', hp: 60, speed: 0.3, type: 'ranged', damage: 10, cooldown: 1000, projectileSpeed: 4.0, range: TILE_SIZE * 10, spriteKey: 'enemy_commando' }
};

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


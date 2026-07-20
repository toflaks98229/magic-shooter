/**
 * @fileoverview 게임 세계의 '직렬화 가능한' 상태입니다.
 *
 * 이 파일에는 저장·복원이 가능해야 하는 데이터만 들어갑니다.
 * DOM 요소, Image, ImageData, AudioBuffer처럼 JSON으로 표현할 수 없는 값은
 * 절대 여기에 넣지 마십시오. 그런 값들의 자리는 다음과 같습니다.
 *
 *   - 로드된 에셋(텍스처/사운드/테마)  → assets.js
 *   - DOM 참조                        → dom.js
 *   - 세션 한정 플래그(실행 여부 등)    → runtime.js
 *
 * 이 규칙 덕분에 JSON.stringify(world) 한 줄로 세이브 파일이 만들어지고,
 * 서브 던전에 들어갈 때 world를 통째로 스택에 밀어 넣었다가 복원할 수 있습니다.
 *
 * 상태를 '읽는' 것은 어느 모듈에서든 자유롭지만, '쓰는' 것은 actions.js를 통해야 합니다.
 * (프레임마다 갱신되는 좌표 등 성능이 중요한 내부 루프는 예외입니다.)
 */

import { PAST_TIME } from './constants.js';

/**
 * 완전히 새로운 세계 상태를 생성해 반환합니다.
 * 모듈 로드 시점의 초기값과 게임 재시작 시의 초기값이 갈라지지 않도록,
 * 초기 상태는 반드시 이 팩토리 하나만 사용합니다.
 * @returns {object} 새 월드 객체
 */
export function createWorld() {
    return {
        /** @description 현재 플레이어가 있는 층(스테이지) */
        floor: 1,

        /**
         * @description 게임 내부 경과 시간(ms).
         * 모든 쿨다운과 애니메이션은 Date.now()가 아니라 이 값을 기준으로 계산합니다.
         * 벽시계 시각과 분리되어 있으므로 세이브를 불러와도 쿨다운이 어긋나지 않고,
         * 나중에 일시정지나 배속 기능을 넣을 때도 그대로 동작합니다.
         */
        time: 0,

        /** @description 현재 층의 맵 데이터 (2차원 배열). 0=바닥, 1=벽, 4=출구, 5=문 */
        map: [],
        /** @description 현재 층의 오브젝트 데이터 (2차원 배열). 0은 비어있음, 1 이상은 오브젝트 ID */
        objectMap: [],

        /**
         * @description 현재 층에 적용된 테마의 '이름'입니다.
         * 텍스처 객체 자체가 아니라 키만 저장한다는 점이 중요합니다.
         * 실제 텍스처는 assets.resolveTheme()으로 그때그때 조회합니다.
         */
        themeName: null,
        /** @description 현재 층에 적용된 테마의 변형 번호 */
        themeVariation: null,

        /** @description 플레이어의 모든 상태 정보 */
        player: {
            x: 0, y: 0,             // 월드 좌표
            angle: Math.PI / 2,     // 바라보는 각도 (라디안)
            hp: 100,                // 현재 체력
            maxHp: 100,             // 최대 체력
            size: 20,               // 충돌 판정 크기
            ammo: 50,               // 현재 탄약
            maxAmmo: 100,           // 최대 탄약
            weapon: 'gun',          // 현재 사용 중인 무기 키
            lastAttackTime: PAST_TIME, // 마지막으로 공격한 시각. 시작하자마자 공격할 수 있도록 과거로 둡니다.
        },

        /** @description 현재 맵에 존재하는 모든 적 */
        enemies: [],
        /** @description 현재 맵에 존재하는 모든 발사체 */
        projectiles: [],
        /** @description 현재 맵에 존재하는 모든 아이템 */
        items: [],
        /** @description 현재 맵에 존재하는 모든 파티클 */
        particles: [],
        /** @description 스프라이트로 렌더링되는 동적 오브젝트의 애니메이션 상태 */
        animatedObjects: [],
        /** @description 벽처럼 렌더링되는 동적 오브젝트(예: 열리는 문)의 애니메이션 상태 */
        animatedWalls: [],
    };
}

/**
 * @description 현재 세계 상태.
 * ESM의 live binding 덕분에, setWorld()로 교체해도 이 값을 import한 모든 모듈이
 * 자동으로 새 객체를 바라보게 됩니다.
 */
export let world = createWorld();

/**
 * 세계 상태를 통째로 교체합니다. (세이브 불러오기, 서브 던전 복귀 등)
 * @param {object} nextWorld - 새로 적용할 월드 객체
 */
export function setWorld(nextWorld) {
    world = nextWorld;
}

/**
 * 세계 상태를 초기값으로 되돌립니다.
 * @returns {object} 새로 만들어진 월드 객체
 */
export function resetWorld() {
    world = createWorld();
    return world;
}

/**
 * 현재 세계 상태를 JSON 문자열로 직렬화합니다.
 * 직렬화 불가능한 값이 섞여 들어가면 여기서 즉시 드러납니다.
 * @returns {string} 직렬화된 월드
 */
export function serializeWorld() {
    return JSON.stringify(world);
}

/**
 * 직렬화된 문자열로부터 세계 상태를 복원해 적용합니다.
 * 세이브 파일에 없는 필드는 createWorld()의 기본값으로 채워, 구버전 세이브도 읽히게 합니다.
 * @param {string} json - serializeWorld()가 만든 문자열
 * @returns {object} 복원되어 적용된 월드 객체
 */
export function deserializeWorld(json) {
    const parsed = JSON.parse(json);
    const restored = createWorld();

    // 기본 player를 먼저 붙잡아 둡니다. Object.assign이 player를 통째로 덮어쓰기 때문에,
    // 나중에 참조하면 이미 세이브 값으로 바뀐 객체를 병합하게 되어 기본값이 사라집니다.
    const defaultPlayer = restored.player;

    Object.assign(restored, parsed);
    // player는 중첩 객체이므로, 세이브에 없는 필드는 기본값으로 채워 넣습니다.
    restored.player = { ...defaultPlayer, ...(parsed.player || {}) };

    world = restored;
    return world;
}

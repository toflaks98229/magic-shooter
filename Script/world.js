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
import { STARTING_BRANCH } from './branches.js';

/**
 * 완전히 새로운 세계 상태를 생성해 반환합니다.
 * 모듈 로드 시점의 초기값과 게임 재시작 시의 초기값이 갈라지지 않도록,
 * 초기 상태는 반드시 이 팩토리 하나만 사용합니다.
 * @returns {object} 새 월드 객체
 */
export function createWorld() {
    return {
        /** @description 현재 있는 던전 가지의 식별 기호 (branches.js 참조) */
        branch: STARTING_BRANCH,

        /** @description 현재 가지 안에서의 층. 전체 깊이가 아니라 가지 기준입니다. */
        floor: 1,

        /**
         * @description 돌아갈 상위 던전들. 얕은 곳이 앞, 방금 떠나온 곳이 뒤입니다.
         *
         * 서브 던전에 들어갈 때 지금 세계를 통째로 여기에 밀어 넣고, 나올 때 꺼내 복원합니다.
         * 각 항목은 parentStack을 뺀 월드 객체라, 중첩 없이 평평하게 쌓입니다.
         * (중첩해서 넣으면 깊이가 깊어질수록 같은 데이터가 반복 직렬화됩니다.)
         */
        parentStack: [],

        /**
         * @description 각 하위 가지의 입구가 상위 가지의 몇 층에 놓이는지.
         * 게임 시작 시 한 번 뽑아 고정합니다. 층을 만들 때마다 다시 뽑으면
         * 같은 입구가 여러 층에 생기거나 아예 안 생길 수 있기 때문입니다.
         */
        branchEntrances: {},

        /** @description 현재 층에 놓인 하위 가지 입구들 */
        entrances: [],

        /**
         * @description 현재 층에 열려 있는 포탈들.
         * 각 항목은 { id, tileX, tileY, expiresAt } 이며, expiresAt은 게임 내부 시간 기준입니다.
         */
        portals: [],

        /**
         * @description 포탈 던전별로 이번 판에 몇 번 생성되었는지.
         * 대부분 한 번뿐이고 네크로폴리스만 세 번까지 나타납니다.
         * 던전을 옮겨 다녀도 유지되어야 하므로 월드가 아니라 판 단위의 값입니다.
         */
        portalsUsed: {},

        /** @description 지금까지 획득한 룬의 가지 식별 기호 목록 */
        runes: [],

        /**
         * @description 소지품. [{ itemId, count }]
         * 주운 것은 여기에 들어가고, 언제 쓸지는 플레이어가 정합니다.
         */
        inventory: [],

        /**
         * @description 현재 걸려 있는 지속 효과. [{ effect, expiresAt }]
         * expiresAt 은 게임 내부 시간 기준이라 세이브를 불러와도 남은 시간이 이어집니다.
         */
        buffs: [],

        /**
         * @description 포탈 던전에 들어온 시점의 누적 깊이.
         *
         * 포탈 던전은 정규 가지처럼 고정된 위치가 없어 표만 보고는 깊이를 알 수 없습니다.
         * D:13에서 들어간 연구소를 1층 취급하면 후반 보상을 초반 난이도로 얻게 되므로,
         * 들어올 때의 위험도를 기억해 두고 적 스폰에 씁니다. 포탈이 아니면 null입니다.
         */
        portalDangerLevel: null,

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
         * @description 통행 가능 여부가 바뀔 때마다 올라가는 번호.
         * 경로 탐색(플로우 필드)이 캐시를 언제 버려야 하는지 판단하는 데 씁니다.
         * 문이 열리는 것처럼 맵 배열의 내용만 바뀌는 경우는 참조 비교로 알 수 없기 때문입니다.
         */
        mapRevision: 0,

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

            // 캐릭터. character.js 의 applyCharacter 가 정하며, 판이 끝날 때까지 종족과 직업은
            // 바뀌지 않습니다. 신만 개종으로 바뀔 수 있습니다.
            species: 'human',       // 종족 키 (species.js)
            background: 'fighter',  // 직업 키 (backgrounds.js)
            god: null,              // 섬기는 신 키. null 이면 무신론자입니다.
            piety: 0,               // 신앙심. 0~200 이고 단계는 gods.js 의 pietyRank 가 셉니다.
        },

        /** @description 이번 층에 놓인 제단. [{tileX, tileY, god}] */
        altars: [],

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

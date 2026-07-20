/**
 * @fileoverview 포탈 던전 정의.
 *
 * 정규 가지(branches.js)와 달리 포탈 던전은 정해진 층에 항상 있는 것이 아니라,
 * 조건이 맞는 층에 확률적으로 나타났다가 일정 시간이 지나면 영구히 닫힙니다.
 * 지나칠 수도 있고, 발견했다면 지금 들어갈지 말지 결정해야 하는 것이 핵심입니다.
 *
 *   id          - 식별자
 *   name        - 표시 이름
 *   minDepth    - 등장할 수 있는 가장 얕은 누적 깊이
 *   maxDepth    - 가장 깊은 누적 깊이
 *   chance      - 조건을 만족하는 층마다 굴리는 등장 확률
 *   maxPerGame  - 한 게임에 생성될 수 있는 최대 횟수
 *   lifetimeMs  - 나타난 뒤 닫히기까지의 시간
 *   depth       - 던전의 층수 (대부분 단층 챌린지 맵)
 *   bonusItems  - 보상으로 추가 배치할 아이템 수
 *   theme       - 렌더링 테마 (assets에 실제로 있는 것이어야 합니다)
 *   flavour     - 등장 알림에 쓸 설명
 *   monsters    - 이 던전에서 나오는 몬스터 목록 (monsters.js의 id)
 *   boss        - 최하층에 한 마리만 배치할 네임드 몬스터
 */

/** @description 초·중반에 나타나는 특수 던전 */
const EARLY_AND_MID = {
    ossuary: {
        name: '납골당', minDepth: 2, maxDepth: 8, chance: 0.12,
        depth: 1, bonusItems: 5, theme: 'crypt', themeVariation: 1,
        flavour: '메마른 뼈 냄새가 풍기는 통로가 열렸다',
        monsters: ['zombie', 'skeleton', 'mummy'],
        boss: 'menkaure',
    },
    sewer: {
        name: '하수구', minDepth: 2, maxDepth: 8, chance: 0.12,
        depth: 1, bonusItems: 4, theme: 'cave', themeVariation: 2,
        flavour: '축축한 물소리가 아래에서 들려온다',
        monsters: ['rat', 'snake', 'kobold', 'frog'],
        boss: 'purgy',
    },
    bailey: {
        name: '성채', minDepth: 7, maxDepth: 14, chance: 0.1,
        depth: 1, bonusItems: 6, theme: 'orc', themeVariation: 1,
        flavour: '오크의 함성이 성벽 너머에서 울린다',
        monsters: ['orc', 'orc_warrior', 'goblin', 'centaur'],
    },
    iceCave: {
        name: '얼음 동굴', minDepth: 7, maxDepth: 14, chance: 0.1,
        depth: 1, bonusItems: 6, theme: 'ice', themeVariation: 1,
        flavour: '살을 에는 냉기가 새어 나온다',
        monsters: ['ice_beast', 'simulacrum', 'ice_giant'],
    },
    gauntlet: {
        name: '건틀릿', minDepth: 9, maxDepth: 16, chance: 0.08,
        depth: 1, bonusItems: 8, theme: 'vault', themeVariation: 1,
        flavour: '쇠창살 너머에서 미노타우로스의 발굽 소리가 난다',
        monsters: ['orc_warrior', 'beast', 'gargoyle'],
        boss: 'minotaur',
    },
    volcano: {
        name: '화산', minDepth: 9, maxDepth: 16, chance: 0.08,
        depth: 1, bonusItems: 7, theme: 'hell', themeVariation: 2,
        flavour: '뜨거운 재가 흩날리고 용암 냄새가 난다',
        monsters: ['fire_demon', 'gargoyle', 'centaur', 'hell_knight'],
    },
};

/**
 * @description 마법사의 연구소.
 * 메인 후반과 보물창고·심층부 깊이에서 나타나며, 제작자마다 테마가 다릅니다.
 * 기믹은 아직 구현되어 있지 않고 지금은 보상이 두둑한 단층 맵으로 동작합니다.
 */
const WIZARD_LABS = {
    saltFlats: { name: '소금의 황무지', flavour: '지평선까지 하얗게 마른 땅이 펼쳐진다', bonusItems: 12 },
    zigguratLab: { name: '시고투비의 생체 실험실', flavour: '변이의 안개가 스며 나온다', bonusItems: 9 },
    cloudMage: { name: '구름 마법사의 전당', flavour: '정전기 섞인 안개가 밀려온다', bonusItems: 9 },
    doroklohe: { name: '도로클로헤의 무덤', flavour: '엄폐물 하나 없는 방이 보인다', bonusItems: 9 },
    hellbinder: { name: '헬바인더의 회당', flavour: '악마를 부르는 주문이 들린다', bonusItems: 10 },
    iskenderun: { name: '이스켄데룬의 신비한 탑', flavour: '석상의 눈이 파괴의 구를 겨눈다', bonusItems: 10 },
    lehudib: { name: '레후딥의 달 기지', flavour: '어비스의 기운이 새어 나온다', bonusItems: 10 },
    gollubria: { name: '골루브리아의 룰렛', flavour: '유리벽 너머로 포탈들이 깜빡인다', bonusItems: 9 },
    wucadMu: { name: '우카드 무의 수도원', flavour: '끊임없이 무언가를 불러내는 소리가 난다', bonusItems: 9 },
    zonguldrok: { name: '종굴드록의 영묘', flavour: '언데드의 물결이 문 앞을 메우고 있다', bonusItems: 10 },
    eringya: { name: '에링야의 격식 정원', flavour: '기묘하게 정돈된 정원이 펼쳐진다', bonusItems: 9 },
    tukima: { name: '투키마의 촬영소', flavour: '주인 없는 무기들이 춤추고 있다', bonusItems: 9 },
    yara: { name: '야라의 결투가 학원', flavour: '결투의 구호가 규칙적으로 울린다', bonusItems: 9 },
    borgnjor: { name: '보르고뇨르의 영묘', flavour: '죽은 것들이 다시 일어서는 기척이 든다', bonusItems: 10 },
    maxwell: { name: '맥스웰의 작업장', flavour: '금속이 맞부딪는 소리가 규칙적으로 난다', bonusItems: 11 },
    alistair: { name: '알리스테어의 파티 저택', flavour: '흥청거리는 소리와 부식의 냄새가 뒤섞인다', bonusItems: 10 },
};

/** @description 특수한 목적의 이벤트 포탈 */
const EVENT_PORTALS = {
    necropolis: {
        name: '네크로폴리스', minDepth: 3, maxDepth: 24, chance: 0.1,
        // 다른 포탈과 달리 한 게임에 세 번까지 나타납니다.
        maxPerGame: 3, depth: 1, bonusItems: 6, theme: 'crypt', themeVariation: 2,
        flavour: '유령들의 거처가 모습을 드러낸다',
        monsters: ['spectre', 'skeleton', 'mummy', 'zombie'],
    },
    bazaar: {
        name: '시장', minDepth: 4, maxDepth: 20, chance: 0.12,
        depth: 1, bonusItems: 10, theme: 'vault', themeVariation: 1,
        flavour: '흥정하는 소리와 함께 시장이 열렸다',
        monsters: ['kobold', 'goblin', 'orc'],
    },
    treasureTrove: {
        name: '매장고', minDepth: 6, maxDepth: 22, chance: 0.07,
        depth: 1, bonusItems: 14, theme: 'vault', themeVariation: 2,
        flavour: '값비싼 무언가가 잠긴 문 뒤에서 반짝인다',
        monsters: ['gargoyle', 'hell_knight', 'demon'],
    },
};

/** @description 포탈이 닫히기까지의 기본 시간(ms). 발견하고 나서 정리할 여유는 주되, 미루면 놓칩니다. */
const DEFAULT_LIFETIME_MS = 90_000;

/** @description 포탈 던전 정의에 채워 넣을 기본값 */
const DEFAULTS = {
    maxPerGame: 1,
    lifetimeMs: DEFAULT_LIFETIME_MS,
    depth: 1,
    bonusItems: 6,
    theme: 'main',
    themeVariation: 1,
};

/** @description 연구소는 후반에만, 낮은 확률로 나타납니다. */
const WIZLAB_PLACEMENT = {
    minDepth: 13, maxDepth: 26, chance: 0.05, lifetimeMs: 120_000,
    theme: 'crypt', themeVariation: 2,
    monsters: ['demon', 'hell_knight', 'spectre', 'gargoyle', 'fire_demon'],
};

/**
 * 정의 표들을 하나로 합치고 기본값을 채웁니다.
 * @returns {object} id를 키로 하는 포탈 던전 정의
 */
function buildPortalTable() {
    const table = {};

    for (const [id, spec] of Object.entries(EARLY_AND_MID)) {
        table[id] = { id, isPortal: true, ...DEFAULTS, ...spec };
    }
    for (const [id, spec] of Object.entries(WIZARD_LABS)) {
        table[id] = { id, isPortal: true, isWizardLab: true, ...DEFAULTS, ...WIZLAB_PLACEMENT, ...spec };
    }
    for (const [id, spec] of Object.entries(EVENT_PORTALS)) {
        table[id] = { id, isPortal: true, ...DEFAULTS, ...spec };
    }
    return table;
}

/** @description 모든 포탈 던전 */
export const PORTAL_DUNGEONS = buildPortalTable();

/**
 * 주어진 깊이에서 아직 생성 한도가 남은 포탈 던전 목록을 반환합니다.
 * @param {number} dangerLevel - 현재 누적 깊이
 * @param {Record<string, number>} used - 지금까지 생성된 횟수
 * @returns {object[]} 후보 목록
 */
export function eligiblePortals(dangerLevel, used = {}) {
    return Object.values(PORTAL_DUNGEONS).filter(portal =>
        dangerLevel >= portal.minDepth &&
        dangerLevel <= portal.maxDepth &&
        (used[portal.id] || 0) < portal.maxPerGame
    );
}

/**
 * 이번 층에 나타날 포탈을 하나 고릅니다.
 *
 * 후보마다 확률을 굴리되 한 층에 하나만 나오게 합니다.
 * 여러 개가 동시에 열리면 어느 쪽을 먼저 갈지 고민할 틈도 없이 타이머가 겹치기 때문입니다.
 * @param {number} dangerLevel - 현재 누적 깊이
 * @param {Record<string, number>} used - 지금까지 생성된 횟수
 * @param {() => number} [random] - 난수 생성기
 * @returns {object|null} 선택된 포탈 던전, 없으면 null
 */
export function rollPortalForFloor(dangerLevel, used = {}, random = Math.random) {
    const winners = eligiblePortals(dangerLevel, used).filter(portal => random() < portal.chance);
    if (winners.length === 0) return null;
    return winners[Math.floor(random() * winners.length)];
}

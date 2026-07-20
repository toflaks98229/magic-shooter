/**
 * @fileoverview 던전 가지(branch) 정의.
 *
 * 어떤 던전이 어디에서 갈라져 나오는지, 몇 층인지, 룬을 주는지가 이 표에 모여 있습니다.
 * 새 가지를 추가하려면 여기에 한 항목만 넣으면 됩니다.
 * 입구 배치, 난이도 계산, 층 표시, 복귀 처리는 모두 이 표를 읽어 동작합니다.
 *
 * 구조는 Dungeon Crawl Stone Soup의 분기 구성을 따릅니다.
 *
 *   id        - 화면에 표시되는 식별 기호 (DCSS 관례: D:3, Lair:2)
 *   name      - 표시 이름
 *   parent    - 이 가지의 입구가 놓이는 상위 가지의 id. 최상위는 null.
 *   entryFrom - 상위 가지에서 입구가 나타날 수 있는 가장 얕은 층
 *   entryTo   - 가장 깊은 층. entryFrom과 같으면 그 층에 고정됩니다.
 *   depth     - 이 가지의 층수
 *   rune      - 최하층에서 룬을 얻을 수 있는지
 *   theme     - 렌더링에 쓸 테마 이름 (assets에 실제로 있는 것이어야 합니다)
 *   themeVariation - 테마 변형 번호
 *   exclusiveGroup - 같은 그룹의 가지 중 한 판에 하나만 생성됩니다.
 *                    늪지와 해안, 뱀굴과 거미 둥지가 그렇습니다.
 *                    넷 다 나오면 룬을 너무 쉽게 모으게 됩니다.
 */

import { PORTAL_DUNGEONS } from './portals.js';

/** @description 게임에 존재하는 모든 던전 가지 */
export const BRANCHES = {
    D: {
        id: 'D', name: '메인 던전', parent: null,
        entryFrom: 0, entryTo: 0, depth: 15, rune: false,
        theme: 'main', themeVariation: 1,
    },
    T: {
        id: 'T', name: '만신전', parent: 'D',
        entryFrom: 4, entryTo: 7, depth: 1, rune: false,
        theme: 'main', themeVariation: 2,
    },
    L: {
        id: 'L', name: '짐승굴', parent: 'D',
        entryFrom: 8, entryTo: 11, depth: 5, rune: false,
        theme: 'cave', themeVariation: 1,
    },
    S: {
        id: 'S', name: '늪지', parent: 'L',
        entryFrom: 2, entryTo: 3, depth: 4, rune: true,
        theme: 'cave', themeVariation: 2,
        exclusiveGroup: 'lair-wet',
    },
    A: {
        id: 'A', name: '해안', parent: 'L',
        entryFrom: 2, entryTo: 3, depth: 4, rune: true,
        theme: 'cave', themeVariation: 2,
        exclusiveGroup: 'lair-wet',
    },
    P: {
        id: 'P', name: '뱀굴', parent: 'L',
        entryFrom: 2, entryTo: 3, depth: 4, rune: true,
        theme: 'cave', themeVariation: 1,
        exclusiveGroup: 'lair-crawl',
    },
    N: {
        id: 'N', name: '거미 둥지', parent: 'L',
        entryFrom: 2, entryTo: 3, depth: 4, rune: true,
        theme: 'cave', themeVariation: 2,
        exclusiveGroup: 'lair-crawl',
    },
    M: {
        id: 'M', name: '슬라임굴', parent: 'L',
        entryFrom: 4, entryTo: 5, depth: 5, rune: true,
        theme: 'cave', themeVariation: 2,
    },
    O: {
        id: 'O', name: '오크 광산', parent: 'D',
        entryFrom: 9, entryTo: 12, depth: 2, rune: false,
        theme: 'main', themeVariation: 2,
    },
    E: {
        id: 'E', name: '엘프 회관', parent: 'O',
        entryFrom: 2, entryTo: 2, depth: 3, rune: false,
        theme: 'main', themeVariation: 1,
    },
    V: {
        id: 'V', name: '보물창고', parent: 'D',
        entryFrom: 13, entryTo: 14, depth: 5, rune: true,
        theme: 'main', themeVariation: 2,
    },
    C: {
        id: 'C', name: '납골당', parent: 'V',
        entryFrom: 2, entryTo: 3, depth: 3, rune: false,
        theme: 'main', themeVariation: 1,
    },
    W: {
        id: 'W', name: '고대의 무덤', parent: 'C',
        entryFrom: 3, entryTo: 3, depth: 3, rune: true,
        theme: 'hell', themeVariation: 2,
    },
    U: {
        id: 'U', name: '심층부', parent: 'D',
        // 자료에는 4층으로 적혀 있으나, 조트의 왕국 입구가 '심층부 5층'에 있다고 되어 있어
        // 그대로 두면 조트에 갈 수 없습니다. DCSS 원작대로 5층으로 맞췄습니다.
        entryFrom: 15, entryTo: 15, depth: 5, rune: false,
        theme: 'hell', themeVariation: 2,
    },
    H: {
        id: 'H', name: '지옥의 안뜰', parent: 'U',
        entryFrom: 1, entryTo: 4, depth: 1, rune: false,
        theme: 'hell', themeVariation: 1,
    },
    X: {
        id: 'X', name: '코키투스', parent: 'H',
        entryFrom: 1, entryTo: 1, depth: 7, rune: true,
        theme: 'hell', themeVariation: 1,
    },
    G: {
        id: 'G', name: '게헨나', parent: 'H',
        entryFrom: 1, entryTo: 1, depth: 7, rune: true,
        theme: 'hell', themeVariation: 1,
    },
    Y: {
        id: 'Y', name: '타르타로스', parent: 'H',
        entryFrom: 1, entryTo: 1, depth: 7, rune: true,
        theme: 'hell', themeVariation: 2,
    },
    I: {
        id: 'I', name: '철의 도시 디스', parent: 'H',
        entryFrom: 1, entryTo: 1, depth: 7, rune: true,
        theme: 'hell', themeVariation: 1,
    },
    Z: {
        id: 'Z', name: '조트의 왕국', parent: 'U',
        entryFrom: 5, entryTo: 5, depth: 5, rune: true,
        theme: 'hell', themeVariation: 2,
    },
};

/** @description 게임이 시작되는 가지 */
export const STARTING_BRANCH = 'D';

/**
 * 던전 정보를 조회합니다. 정규 가지와 포탈 던전을 모두 찾습니다.
 *
 * 포탈 던전도 일단 들어가고 나면 '지금 있는 던전'이라는 점에서 가지와 다르지 않습니다.
 * 층 표시, 최하층 판정, 복귀 처리가 모두 같은 코드를 타도록 조회를 하나로 둡니다.
 * @param {string} id - 던전 식별자
 * @returns {object} 던전 정의. 알 수 없으면 메인 던전.
 */
export function getBranch(id) {
    return BRANCHES[id] || PORTAL_DUNGEONS[id] || BRANCHES[STARTING_BRANCH];
}

/**
 * 한 판에 실제로 생성할 가지들을 고릅니다.
 * 배타 그룹에 속한 가지는 그룹마다 하나씩만 남깁니다.
 * @param {() => number} random - 난수 생성기 (테스트에서 대체할 수 있도록 주입받습니다)
 * @returns {object[]} 이번 판에 등장할 가지 목록
 */
export function rollBranchSelection(random = Math.random) {
    const groups = new Map();
    const selected = [];

    for (const branch of Object.values(BRANCHES)) {
        if (!branch.exclusiveGroup) {
            selected.push(branch);
            continue;
        }
        if (!groups.has(branch.exclusiveGroup)) groups.set(branch.exclusiveGroup, []);
        groups.get(branch.exclusiveGroup).push(branch);
    }

    for (const candidates of groups.values()) {
        selected.push(candidates[Math.floor(random() * candidates.length)]);
    }
    return selected;
}

/**
 * 특정 가지에서 갈라져 나오는 하위 가지 목록을 반환합니다.
 * @param {string} parentId - 상위 가지 식별 기호
 * @returns {object[]} 하위 가지 목록
 */
export function childBranchesOf(parentId) {
    return Object.values(BRANCHES).filter(branch => branch.parent === parentId);
}

/**
 * 가지 안에서의 층을 '게임 시작 지점으로부터의 깊이'로 환산합니다.
 * 적 스폰 수처럼 난이도에 관계된 계산은 이 값을 씁니다.
 * 짐승굴 3층은 메인 10층 언저리만큼 위험해야지, 3층만큼 쉬우면 안 되기 때문입니다.
 * @param {string} branchId - 가지 식별 기호
 * @param {number} depth - 가지 안에서의 층
 * @returns {number} 누적 깊이
 */
export function absoluteDepth(branchId, depth) {
    let total = depth;
    let branch = getBranch(branchId);

    // 상위 가지를 거슬러 올라가며 입구가 놓인 층을 더합니다.
    while (branch.parent) {
        const parent = getBranch(branch.parent);
        total += Math.round((branch.entryFrom + branch.entryTo) / 2);
        branch = parent;
    }
    return total;
}

/**
 * 화면에 표시할 위치 문자열을 만듭니다. (예: 'D:3', 'L:2')
 * @param {string} branchId - 가지 식별 기호
 * @param {number} depth - 가지 안에서의 층
 * @returns {string} 표시 문자열
 */
export function formatLocation(branchId, depth) {
    return `${getBranch(branchId).id}:${depth}`;
}

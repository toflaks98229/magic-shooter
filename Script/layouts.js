/**
 * @fileoverview 층 배치(레이아웃).
 *
 * DCSS 는 층을 만들 때 먼저 '이 층을 어떤 모양으로 만들 것인가'를 굴립니다.
 * dat/des/builder/layout.des 에 열한 가지가 들어 있고, 가지와 깊이마다 나올 수 있는 것이
 * 다르며 가중치도 다릅니다. 짐승굴이 메인 던전과 다르게 생긴 것이 이 표 때문입니다.
 *
 * 이 파일은 그 표를 옮긴 것입니다. DEPTH 와 WEIGHT 는 원본 layout.des 에서 그대로 읽어 왔고,
 * 실제로 그리는 일은 mapGenerator.js 가 합니다.
 *
 * 원본의 가지 이름과 이 게임의 가지 글자를 맞춘 표가 BRANCH_ALIAS 입니다.
 * 예를 들어 원본의 Lair 는 여기서 'L'(짐승굴)입니다.
 */

/** @description 원본 layout.des 의 가지 이름 -> 이 게임의 가지 글자 */
const BRANCH_ALIAS = {
    D: 'D', Lair: 'L', Snake: 'P', Swamp: 'S', Shoals: 'A', Spider: 'N', Slime: 'M',
    Orc: 'O', Elf: 'E', Vaults: 'V', Crypt: 'C', Tomb: 'W', Depths: 'U',
    Hell: 'H', Coc: 'X', Geh: 'G', Tar: 'Y', Dis: 'I', Zot: 'Z', Temple: 'T',
};

/**
 * @description 레이아웃 정의. 원본 layout.des 의 NAME/DEPTH/WEIGHT 를 옮긴 것입니다.
 *
 * branches - 어느 가지에서 나오는가. 원본 DEPTH 줄입니다.
 * minFloor - 그 가지에서 몇 층부터 나오는가. 원본의 'D:9-' 같은 표기입니다.
 * weight   - 뽑힐 가중치. 가지마다 다른 것은 객체로 적었습니다.
 * kind     - mapGenerator 가 어떤 방식으로 그릴지 고르는 값. 원본 layout_type_* 와 같습니다.
 */
export const LAYOUTS = {
    rooms: {
        name: '방과 복도', kind: 'rooms',
        branches: ['D', 'E', 'P', 'C'],
        weight: { D: 15, E: 10, P: 15, C: 10 },
    },
    roguey: {
        name: '격자 방', kind: 'rooms',
        branches: ['D', 'L', 'U'], minFloor: { D: 9 },
        weight: { D: 25, L: 10, U: 10 },
    },
    miscCorridors: {
        name: '뒤엉킨 복도', kind: 'corridors',
        branches: ['L', 'P', 'C', 'Z'],
        weight: { L: 5, default: 20 },
    },
    regularCity: {
        name: '반듯한 도시', kind: 'city',
        branches: ['L', 'C', 'I'],
        weight: { L: 15, default: 10 },
    },
    caves: {
        name: '동굴', kind: 'openCaves',
        branches: ['O', 'M'],
        weight: { default: 10 },
    },
    diamondMine: {
        name: '다이아몬드 광산', kind: 'narrowCaves',
        branches: ['O'],
        weight: { default: 5 },
    },
    subdivisions: {
        name: '구획', kind: 'divisions',
        branches: ['I'],
        weight: { default: 15 },
    },
    jigsaw: {
        name: '조각 맞추기', kind: 'divisions',
        branches: ['I'],
        weight: { default: 10 },
    },
    bigOctagon: {
        name: '큰 팔각형', kind: 'open',
        branches: ['D', 'U'], minFloor: { D: 9 },
        weight: { default: 3 },
    },
    cross: {
        name: '십자', kind: 'open',
        branches: ['D', 'U'], minFloor: { D: 9 },
        weight: { default: 2 },
    },
    forbiddenDonut: {
        name: '금단의 고리', kind: 'open',
        branches: ['U'],
        weight: { default: 5 },
    },
};

/**
 * 이 가지와 층에서 나올 수 있는 레이아웃과 가중치를 구합니다.
 * @param {string} branchId - 가지 글자
 * @param {number} floor - 그 가지 안에서의 층
 * @returns {Array<{id: string, weight: number}>} 후보 목록
 */
export function candidateLayouts(branchId, floor) {
    const candidates = [];

    for (const [id, layout] of Object.entries(LAYOUTS)) {
        if (!layout.branches.includes(branchId)) continue;

        // 'D:9-' 처럼 깊어져야 나오는 것들이 있습니다.
        const minFloor = layout.minFloor?.[branchId];
        if (minFloor !== undefined && floor < minFloor) continue;

        const weight = layout.weight[branchId] ?? layout.weight.default;
        if (!weight) continue;
        candidates.push({ id, weight });
    }

    return candidates;
}

/**
 * 이 가지와 층에 쓸 레이아웃을 굴립니다.
 *
 * 후보가 없는 가지도 있습니다. 원본 layout.des 가 모든 가지를 덮지는 않기 때문입니다.
 * 그런 층은 가장 무난한 '방과 복도'로 만듭니다.
 * @param {string} branchId - 가지 글자
 * @param {number} floor - 그 가지 안에서의 층
 * @returns {string} 레이아웃 키
 */
export function rollLayout(branchId, floor) {
    const candidates = candidateLayouts(branchId, floor);
    if (candidates.length === 0) return 'rooms';

    const total = candidates.reduce((sum, c) => sum + c.weight, 0);
    let roll = Math.random() * total;
    for (const candidate of candidates) {
        roll -= candidate.weight;
        if (roll < 0) return candidate.id;
    }
    return candidates[candidates.length - 1].id;
}

/**
 * 원본 가지 이름을 이 게임의 가지 글자로 옮깁니다. 표를 손볼 때 쓰라고 남겨 둡니다.
 * @param {string} crawlName - 원본 가지 이름 ('Lair' 등)
 * @returns {string|undefined} 가지 글자
 */
export function branchLetterFor(crawlName) {
    return BRANCH_ALIAS[crawlName];
}

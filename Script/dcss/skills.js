/**
 * @fileoverview DCSS 의 스킬 성장 체계입니다.
 *
 * 스킬은 0 에서 27 까지 오릅니다. 올리는 데 드는 비용은 두 겹으로 불어납니다.
 *
 *   1) 레벨이 높을수록 다음 레벨까지 필요한 스킬 점수가 많아집니다.
 *      기본이 25*L*(L+1) 이고, 9·18·26 을 넘길 때마다 절반씩 더 붙습니다.
 *   2) 캐릭터가 성장할수록 스킬 점수 하나의 값이 비싸집니다.
 *      1 에서 265 까지, 265 배로 오릅니다.
 *
 * 두 번째가 DCSS 성장의 성격을 정합니다. 초반에는 아무 스킬이나 쑥쑥 오르지만
 * 후반에는 한 스킬을 올리는 데 드는 경험치가 감당하기 어려워져,
 * 무엇을 포기할지 고르게 됩니다.
 *
 * 종족 적성이 첫 번째 비용에 곱해집니다. 적성 +4 는 절반 비용, -4 는 두 배 비용입니다.
 *
 * 출처: crawl-ref/source/skills.cc
 */

/** @description 스킬의 최고 레벨 */
export const MAX_SKILL_LEVEL = 27;

/**
 * @description 스킬 점수 하나에 드는 경험치. 캐릭터의 성장 단계로 색인합니다.
 * (skills.cc:167 calc_skill_cost)
 *
 * 이 표가 후반부의 성장을 좌우합니다. 마지막 값이 첫 값의 265 배입니다.
 */
const SKILL_COST_BY_LEVEL = [
    1, 2, 3, 4, 5,
    7, 8, 9, 13, 22,
    37, 48, 73, 98, 125,
    145, 170, 190, 212, 225,
    240, 255, 260, 265, 265,
    265, 265,
];

/** @description 비용이 한 번 더 꺾이는 지점들. (skills.cc:2570) */
const COST_BREAKPOINTS = [9, 18, 26];

/**
 * 레벨 하나에 해당하는 기본 비용을 구합니다. (skills.cc:2561)
 * @param {number} level - 스킬 레벨
 * @returns {number} 비용
 */
function moduloSkillCost(level) {
    return 25 * level * (level + 1);
}

/**
 * 어떤 레벨에 도달하기까지 필요한 누적 스킬 점수를 구합니다. (skills.cc:2568)
 *
 * 적성은 포함하지 않은 값입니다. 적성을 반영하려면 skillPointsNeeded 를 쓰십시오.
 * @param {number} level - 목표 레벨 (0~27)
 * @returns {number} 누적 스킬 점수
 */
export function baseSkillPointsFor(level) {
    if (level < 0 || level > MAX_SKILL_LEVEL) {
        throw new Error(`스킬 레벨은 0~${MAX_SKILL_LEVEL} 입니다: ${level}`);
    }

    let total = moduloSkillCost(level);
    for (const breakpoint of COST_BREAKPOINTS) {
        if (level <= breakpoint) break;
        total += Math.trunc(moduloSkillCost(level - breakpoint) / 2);
    }
    return total;
}

/**
 * 적성을 비용 배율로 바꿉니다. (skills.cc 의 species_apt_factor)
 *
 * 적성 0 이 기준이고, +1 마다 비용이 줄고 -1 마다 늘어납니다.
 * 문서의 표현대로 +4 는 두 배 빨리(비용 절반), -4 는 절반 속도(비용 두 배)입니다.
 * @param {number|null} aptitude - 종족 적성. null 이면 배울 수 없습니다
 * @returns {number} 비용 배율
 */
export function aptitudeFactor(aptitude) {
    if (aptitude === null || aptitude === undefined) return Infinity;
    return Math.pow(2, -aptitude / 4);
}

/**
 * 종족 적성을 반영해, 어떤 레벨에 도달하기까지 필요한 스킬 점수를 구합니다.
 * @param {number} level - 목표 레벨
 * @param {number|null} aptitude - 종족 적성
 * @returns {number} 필요한 스킬 점수. 배울 수 없으면 Infinity
 */
export function skillPointsNeeded(level, aptitude) {
    const factor = aptitudeFactor(aptitude);
    if (!Number.isFinite(factor)) return Infinity;
    return Math.round(baseSkillPointsFor(level) * factor);
}

/**
 * 쌓인 스킬 점수가 몇 레벨에 해당하는지 구합니다.
 * @param {number} points - 쌓인 스킬 점수
 * @param {number|null} aptitude - 종족 적성
 * @returns {number} 스킬 레벨 (0~27)
 */
export function skillLevelFor(points, aptitude) {
    if (aptitude === null || aptitude === undefined) return 0;

    let level = 0;
    while (level < MAX_SKILL_LEVEL && points >= skillPointsNeeded(level + 1, aptitude)) {
        level++;
    }
    return level;
}

/**
 * 레벨 사이의 진행도까지 포함한 스킬 값을 구합니다.
 *
 * DCSS 의 공식들은 스킬을 정수가 아니라 소수로 씁니다.
 * you.skill(SK_X, 100) 이 '레벨 x 100 + 진행도' 를 돌려주기 때문입니다.
 * 피해 배율과 명중 기여가 이 소수를 쓰므로, 정수로 자르면 성장이 계단처럼 끊깁니다.
 * @param {number} points - 쌓인 스킬 점수
 * @param {number|null} aptitude - 종족 적성
 * @returns {number} 소수를 포함한 스킬 값
 */
export function skillValueFor(points, aptitude) {
    const level = skillLevelFor(points, aptitude);
    if (level >= MAX_SKILL_LEVEL) return MAX_SKILL_LEVEL;

    const current = skillPointsNeeded(level, aptitude);
    const next = skillPointsNeeded(level + 1, aptitude);
    if (!Number.isFinite(next) || next <= current) return level;

    return level + (points - current) / (next - current);
}

/**
 * 캐릭터의 성장 단계에 따른 스킬 점수 하나의 경험치 비용을 구합니다. (skills.cc:167)
 * @param {number} skillCostLevel - 성장 단계 (1~27)
 * @returns {number} 스킬 점수 하나의 비용
 */
export function skillPointCost(skillCostLevel) {
    const index = Math.min(Math.max(Math.trunc(skillCostLevel), 1), SKILL_COST_BY_LEVEL.length);
    return SKILL_COST_BY_LEVEL[index - 1];
}

/**
 * 경험치를 스킬 점수로 바꿉니다.
 *
 * 남는 경험치는 버리지 않고 돌려줍니다. 다음에 이어서 쓸 수 있어야
 * 조금씩 얻는 경험치가 사라지지 않습니다.
 * @param {number} experience - 쓸 경험치
 * @param {number} skillCostLevel - 캐릭터의 성장 단계
 * @returns {{points: number, spent: number, leftover: number}} 얻은 점수와 남은 경험치
 */
export function trainWithExperience(experience, skillCostLevel) {
    const cost = skillPointCost(skillCostLevel);
    const points = Math.trunc(experience / cost);
    const spent = points * cost;
    return { points, spent, leftover: experience - spent };
}

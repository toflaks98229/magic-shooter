/**
 * @fileoverview 플레이어의 스킬이 자라는 방식입니다.
 *
 * DCSS 는 '쓰는 것이 는다'는 원칙을 씁니다. 무기를 휘두르면 그 무기 스킬이,
 * 맞으면 회피와 갑옷이 조금씩 오릅니다. 경험치를 어디에 넣을지 고르는 것이 아니라,
 * 무엇을 하고 있는지가 저절로 배분을 정합니다.
 *
 * 원본은 최근 백 번의 행동을 큐에 담아 그 비율로 경험치를 나눕니다. (skills.cc:849)
 * 여기서도 같은 방식을 씁니다. 큐 길이도 원본과 같은 백입니다.
 *
 * 스킬 점수를 얼마에 살 수 있는지는 skills.js 가 정합니다. 캐릭터가 성장할수록
 * 한 점의 값이 265 배까지 오르므로, 후반에는 무엇을 포기할지 고르게 됩니다.
 *
 * 출처: crawl-ref/source/skills.cc, exercise.cc
 */

import { skillPointCost, skillLevelFor, skillValueFor, MAX_SKILL_LEVEL } from './skills.js';

/** @description 훈련 배분을 정하는 최근 행동 큐의 길이. (defines.h:145) */
export const EXERCISE_QUEUE_SIZE = 100;

/**
 * 플레이어의 스킬 상태를 새로 만듭니다.
 *
 * world 에 담겨 저장되므로 전부 직렬화 가능한 값이어야 합니다.
 * @returns {object} 스킬 상태
 */
export function createSkillState() {
    return {
        /** @description 스킬마다 쌓인 점수 */
        points: {},
        /** @description 아직 스킬로 바꾸지 못한 경험치 */
        pool: 0,
        /** @description 지금까지 쓴 경험치의 총합. 스킬 점수의 값을 정합니다 */
        totalSpent: 0,

        /**
         * @description 지금까지 얻은 경험치의 총합.
         *
         * 쓴 것(totalSpent)과 다릅니다. 경험 수준은 얻은 것으로 정해집니다.
         * 스킬에 넣지 못하고 남은 것도 수준에는 들어갑니다.
         */
        totalGained: 0,
        /** @description 최근에 무엇을 했는지. 이 비율대로 경험치가 나뉩니다 */
        recent: [],
    };
}

/**
 * 캐릭터의 성장 단계를 구합니다.
 *
 * 쓴 경험치가 많을수록 스킬 점수 하나가 비싸집니다. 원본은 별도의 표로 단계를
 * 정하지만, 여기서는 쓴 경험치를 로그 눈금으로 나눠 같은 모양을 냅니다.
 * 중요한 것은 절대값이 아니라 '후반으로 갈수록 가팔라진다'는 성질입니다.
 * @param {object} state - 스킬 상태
 * @returns {number} 1~27 사이의 단계
 */
export function skillCostLevel(state) {
    if (state.totalSpent <= 0) return 1;
    const level = Math.floor(Math.log2(state.totalSpent / 25 + 1)) + 1;
    return Math.min(Math.max(level, 1), MAX_SKILL_LEVEL);
}

/**
 * 방금 한 행동을 기록합니다. 이것이 경험치의 배분을 정합니다.
 *
 * 원본처럼 최근 백 번만 봅니다. 오래된 행동이 계속 영향을 주면
 * 무기를 바꿔도 옛 스킬이 계속 오르게 됩니다.
 * @param {object} state - 스킬 상태
 * @param {string} skill - 스킬 이름
 */
export function exercise(state, skill) {
    state.recent.push(skill);
    while (state.recent.length > EXERCISE_QUEUE_SIZE) state.recent.shift();
}

/**
 * 경험치를 받아 최근에 쓴 스킬들에 나눠 넣습니다.
 *
 * 무엇을 했는지 기록이 없으면 쌓아 둡니다. 버리지 않는 것이 중요합니다.
 * 적을 죽였는데 아무 스킬도 오르지 않으면 경험치가 사라진 것처럼 보입니다.
 * @param {object} state - 스킬 상태
 * @param {number} experience - 얻은 경험치
 * @param {(skill: string) => number|null} aptitudeOf - 종족 적성을 돌려주는 함수
 * @returns {object} 이번에 오른 스킬과 점수
 */
export function gainExperience(state, experience, aptitudeOf) {
    state.pool += experience;
    state.totalGained = (state.totalGained ?? 0) + experience;
    if (state.recent.length === 0) return {};

    // 최근 행동의 비율대로 나눕니다.
    const weights = {};
    for (const skill of state.recent) weights[skill] = (weights[skill] ?? 0) + 1;

    const cost = skillPointCost(skillCostLevel(state));
    const gained = {};

    for (const [skill, count] of Object.entries(weights)) {
        // 배울 수 없는 스킬에는 넣지 않습니다. 넣으면 경험치만 사라집니다.
        if (aptitudeOf(skill) === null) continue;

        const share = Math.floor(state.pool * (count / state.recent.length));
        const points = Math.floor(share / cost);
        if (points <= 0) continue;

        state.points[skill] = (state.points[skill] ?? 0) + points;
        state.pool -= points * cost;
        state.totalSpent += points * cost;
        gained[skill] = points;
    }

    return gained;
}

/**
 * 스킬의 현재 레벨을 구합니다. 정수입니다.
 * @param {object} state - 스킬 상태
 * @param {string} skill - 스킬 이름
 * @param {number|null} aptitude - 종족 적성
 * @returns {number} 레벨 (0~27)
 */
export function skillLevel(state, skill, aptitude) {
    return skillLevelFor(state.points[skill] ?? 0, aptitude);
}

/**
 * 스킬의 현재 값을 구합니다. 레벨 사이를 소수로 잇습니다.
 *
 * DCSS 의 공식들은 이 소수를 씁니다. 정수로 자르면 성장이 계단처럼 끊깁니다.
 * @param {object} state - 스킬 상태
 * @param {string} skill - 스킬 이름
 * @param {number|null} aptitude - 종족 적성
 * @returns {number} 소수를 포함한 값
 */
export function skillValue(state, skill, aptitude) {
    return skillValueFor(state.points[skill] ?? 0, aptitude);
}

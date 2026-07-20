/**
 * @fileoverview 상태창에 띄울 플레이어의 값들을 구합니다.
 *
 * 원본의 상태창은 열세 줄이고 그중 다섯 줄이 숫자입니다.
 * AC·EV·SH 가 왼쪽, 힘·지능·민첩이 오른쪽, 그 아래에 경험 수준입니다.
 * 지금까지 이 게임에는 그 값들이 아예 없어서, 자리를 만들어도 빈칸만 찍혔습니다.
 *
 * 여기서 만드는 것은 표시용 값이 아니라 실제로 쓰이는 값입니다.
 * 회피는 이미 전투 판정이 쓰고 있었고 표시만 안 하고 있었습니다.
 * 경험 수준은 몬스터 난이도가 이미 보고 있습니다.
 *
 * 출처: crawl-ref/source/player.cc (3667 exp_needed, 2976 level_change),
 *       crawl-ref/source/output.cc (1104 AC, 1128 EV)
 */

import { MAX_SKILL_LEVEL } from './skills.js';
import { skillValue } from './training.js';
import { playerEvasion } from './combat.js';

/** @description 원본의 최대 경험 수준. (player.cc) */
export const MAX_EXPERIENCE_LEVEL = 27;

/** @description 3 레벨마다 능력치가 하나 오릅니다. (player.cc:2990) */
const LEVELS_PER_STAT_GAIN = 3;

/**
 * 그 수준에 이르는 데 필요한 경험치를 구합니다. (player.cc:3667 exp_needed)
 *
 * 원본의 세 구간을 그대로 옮겼습니다. 1~4 는 표로, 5~12 는 지수로,
 * 13 이상은 이차식으로 늡니다. 후반의 증가폭이 일정해지는 것이 요점입니다.
 * 그래서 깊이 들어갈수록 레벨이 아니라 장비와 스킬로 강해지게 됩니다.
 * @param {number} level - 경험 수준
 * @returns {number} 필요한 누적 경험치
 */
export function experienceNeeded(level) {
    if (level <= 1) return 0;
    if (level === 2) return 10;
    if (level === 3) return 30;
    if (level === 4) return 70;

    if (level < 13) {
        const step = level - 4;
        return 10 + 10 * step + (60 << step);
    }

    const step = level - 12;
    return 16675 + 5985 * step + 4235 * step * step;
}

/**
 * 누적 경험치에서 경험 수준을 구합니다.
 * @param {number} experience - 누적 경험치
 * @returns {number} 경험 수준 (1~27)
 */
export function experienceLevel(experience) {
    let level = 1;
    while (level < MAX_EXPERIENCE_LEVEL && experience >= experienceNeeded(level + 1)) {
        level++;
    }
    return level;
}

/**
 * 다음 수준까지 얼마나 왔는지 백분율로 구합니다. (output.cc:1611 get_exp_progress)
 * @param {number} experience - 누적 경험치
 * @returns {number} 0~99
 */
export function experienceProgress(experience) {
    const level = experienceLevel(experience);
    if (level >= MAX_EXPERIENCE_LEVEL) return 0;

    const current = experienceNeeded(level);
    const next = experienceNeeded(level + 1);
    if (next <= current) return 0;

    return Math.floor(((experience - current) * 100) / (next - current));
}

/**
 * 지금의 능력치를 구합니다.
 *
 * 종족의 시작값에 수준에 따른 성장을 더합니다. 원본은 세 수준마다 하나씩
 * 올리되 어느 것을 올릴지는 종족이 정합니다. 종족 정의에 그 표가 아직
 * 없으므로 가장 높은 것을 올립니다. 종족의 성격이 시간이 갈수록
 * 뚜렷해진다는 점은 같습니다.
 * @param {object} species - 종족 정의
 * @param {number} level - 경험 수준
 * @returns {{str: number, int: number, dex: number}} 능력치
 */
export function playerStats(species, level) {
    const stats = {
        str: species?.str ?? 8,
        int: species?.int ?? 8,
        dex: species?.dex ?? 8,
    };

    const gains = Math.floor((level - 1) / LEVELS_PER_STAT_GAIN);
    for (let i = 0; i < gains; i++) {
        const best = stats.str >= stats.int && stats.str >= stats.dex ? 'str'
            : stats.int >= stats.dex ? 'int' : 'dex';
        stats[best]++;
    }

    return stats;
}

/**
 * 지금의 방어도를 구합니다.
 *
 * 갑옷이 아직 없어 종족이 타고난 것만 셉니다. 값이 늘 0 이면 자리를
 * 만들어 둔 뜻이 없으므로, 원본에서 종족이 가진 자연 방어도를 옮겼습니다.
 * 갑옷이 들어오면 여기에 더하면 됩니다.
 * @param {object} species - 종족 정의
 * @param {number} level - 경험 수준
 * @returns {number} 방어도
 */
export function playerAC(species, level) {
    const natural = NATURAL_ARMOUR[species?.id] ?? 0;

    // 타고난 비늘은 수준에 따라 두꺼워집니다. (원본의 여러 종족 돌연변이)
    const growth = natural > 0 ? Math.floor(level / 9) : 0;
    return natural + growth;
}

/**
 * @description 타고난 방어도가 있는 종족. (mutation.cc 의 종족 돌연변이)
 * 표에 없으면 0 입니다.
 */
const NATURAL_ARMOUR = {
    gargoyle: 5, naga: 3, draconian: 3, troll: 3,
    'grey-draconian': 6, ghoul: 1, mummy: 3,
    formicid: 2, minotaur: 1, armataur: 2,
};

/**
 * 지금의 회피를 구합니다.
 *
 * 전투 판정과 상태창이 같은 값을 봐야 합니다. 따로 계산하면 화면에 뜨는
 * 숫자와 실제로 굴리는 값이 어긋나는데, 그런 어긋남은 눈으로 알아채기
 * 어렵습니다. 그래서 여기 한 곳에 둡니다.
 * @param {object} player - 플레이어
 * @param {object} species - 종족 정의
 * @param {function(string): number|null} aptitudeOf - 스킬 적성을 읽는 함수
 * @returns {number} 회피
 */
export function currentPlayerEvasion(player, species, aptitudeOf) {
    const dex = species?.dex ?? 8;
    const dodging = skillValue(player.skills, 'dodging', aptitudeOf('dodging'));
    return playerEvasion(dodging, dex);
}

/**
 * 지금의 방패 막기를 구합니다.
 *
 * 방패가 아직 없습니다. 0 을 돌려주되 자리는 만들어 둡니다.
 * 원본의 상태창에도 방패가 없으면 0 이 찍힙니다.
 * @returns {number} 막기 값
 */
export function playerSH() {
    return 0;
}

/**
 * 스킬 하나의 수준을 상태창에 쓸 정수로 만듭니다.
 * @param {number} value - 스킬 값
 * @returns {number} 0~27
 */
export function displaySkillLevel(value) {
    return Math.min(MAX_SKILL_LEVEL, Math.floor(value));
}

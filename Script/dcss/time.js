/**
 * @fileoverview DCSS 의 시간 단위를 실시간에 매핑합니다.
 *
 * DCSS 는 턴제이고 시간 단위가 aut 입니다. 10 aut 이 플레이어의 기본 행동 하나이며
 * (defines.h:149 BASELINE_DELAY), 몬스터 속도·가속·공격 주기가 전부 이 단위로
 * 정의되어 있습니다. 몬스터 speed: 10 은 '플레이어와 같은 속도'라는 뜻입니다.
 *
 * 이 파일이 하는 일은 그 aut 을 실시간 밀리초로 바꾸는 환산 하나입니다.
 * 비율만 고정하면 DCSS 의 상대 속도 관계가 그대로 보존됩니다.
 * 몬스터가 몇 배 빠른지, 가속이 얼마나 이득인지가 원본과 같아집니다.
 *
 * 원본의 에너지 시스템(임계값 80, roll_dice(1,10) 로 흩뿌리기)은 옮기지 않습니다.
 * 그것은 턴제에서 플레이어가 몬스터의 행동 타이밍을 세지 못하게 하려는 장치입니다.
 * 실시간에서는 셀 수 있는 턴이 없으므로 지터만 남습니다. 쿨다운 타이머로 대신합니다.
 *
 * 출처: crawl-ref/source/defines.h, player.cc, monster.cc
 */

import { divRandRound } from './random.js';

/**
 * @description 플레이어의 기본 행동 하나가 차지하는 aut. (defines.h:149)
 * DCSS 의 '1턴'이 이 값입니다.
 */
export const BASELINE_DELAY = 10;

/**
 * @description aut 하나의 실제 길이(ms).
 *
 * 이 프로젝트 전체에서 가장 중요한 상수입니다. 여기서 모든 속도가 파생됩니다.
 * 50ms 로 두면 기본 행동 하나가 0.5초가 되어, 초당 두 번 공격하는 셈이 됩니다.
 * FPS 로서 답답하지 않으면서 DCSS 의 상대 속도 관계를 유지할 수 있는 값입니다.
 *
 * 값을 바꾸면 게임 전체의 체감 속도가 함께 움직입니다.
 * 몬스터가 상대적으로 빨라지거나 느려지지는 않습니다. 비율은 그대로입니다.
 */
export const AUT_MS = 50;

/**
 * @description 플레이어가 낼 수 있는 가장 빠른 이동 속도(aut). (player.cc)
 * 원본 주석이 6보다 빠르면 지나치다고 못박아 두었습니다.
 */
export const FASTEST_PLAYER_MOVE_SPEED = 6;

/**
 * aut 을 밀리초로 바꿉니다.
 * @param {number} auts - 시간(aut)
 * @returns {number} 밀리초
 */
export function autToMs(auts) {
    return auts * AUT_MS;
}

/**
 * 밀리초를 aut 으로 바꿉니다.
 * @param {number} ms - 밀리초
 * @returns {number} aut
 */
export function msToAut(ms) {
    return ms / AUT_MS;
}

/**
 * 가속이 걸린 시간 비용. 원본의 haste_div 입니다. (defines.h:192-196)
 *
 * 이름이 헷갈립니다. 원본에서 haste_mul 은 시간을 '늘려' 느리게 만들고
 * haste_div 가 시간을 줄여 빠르게 만듭니다. 감속에 haste_mul 을 쓰는 이유입니다.
 * 여기서는 헷갈리지 않도록 이름을 효과 기준으로 바꿔 둡니다.
 * @param {number} cost - 원래 시간 비용
 * @returns {number} 2/3 로 줄어든 비용
 */
export function hastenCost(cost) {
    return divRandRound(cost * 2, 3);
}

/**
 * 감속이 걸린 시간 비용. 원본의 haste_mul 입니다.
 * @param {number} cost - 원래 시간 비용
 * @returns {number} 3/2 로 늘어난 비용
 */
export function slowCost(cost) {
    return divRandRound(cost * 3, 2);
}

/**
 * 몬스터의 speed 값을 행동 하나의 시간 비용(aut)으로 바꿉니다.
 *
 * speed 는 비용이 아니라 '비율'입니다. speed 10 이 기준이고 20 이면 두 배 빠릅니다.
 * 그래서 비용은 반비례합니다. (timed-effects.cc:1138 speed_to_duration 과 같은 관계)
 *
 * speed 0 은 '느린 것'이 아니라 '움직이지 않는 것'입니다.
 * 원본은 에너지를 줄 때 speed > 0 을 확인해(mon-act.cc:1732) 아예 거릅니다.
 * 식물·조형물·포탑 25종이 여기 해당하며, 기본값으로 되돌리면
 * 나무가 플레이어를 쫓아옵니다.
 * @param {number} speed - 몬스터의 speed 필드. 없으면 10 이 기본값입니다
 * @returns {number} 행동 하나의 시간(aut). 움직이지 않는 몬스터는 Infinity
 */
export function monsterActionAuts(speed = BASELINE_DELAY) {
    if (speed <= 0) return Infinity;
    return (BASELINE_DELAY * BASELINE_DELAY) / speed;
}

/**
 * 스스로 움직이거나 행동할 수 있는 몬스터인지 봅니다.
 * @param {number} speed - 몬스터의 speed 필드
 * @returns {boolean} 행동할 수 있으면 true
 */
export function canAct(speed = BASELINE_DELAY) {
    return speed > 0;
}

/**
 * 몬스터의 speed 값을 행동 주기(ms)로 바꿉니다.
 *
 * 원본은 에너지를 쌓아 임계값 80 을 넘으면 행동하는 방식이지만,
 * 실시간에서는 같은 결과를 주는 쿨다운으로 대신합니다.
 * speed 10 이면 500ms, speed 20 이면 250ms 입니다.
 * @param {number} speed - 몬스터의 speed 필드
 * @returns {number} 행동 주기(ms)
 */
export function monsterActionMs(speed = BASELINE_DELAY) {
    return autToMs(monsterActionAuts(speed));
}

/**
 * 몬스터의 speed 와 상태를 반영한 실제 행동 주기(ms).
 * @param {number} speed - 기본 speed
 * @param {{hasted?: boolean, slowed?: boolean}} [status] - 걸려 있는 상태
 * @returns {number} 행동 주기(ms)
 */
export function monsterActionMsWithStatus(speed = BASELINE_DELAY, status = {}) {
    // 몬스터의 speed 는 비율이므로 가속이 speed 를 곱하고 감속이 나눕니다.
    // 플레이어 쪽은 비용을 다루므로 반대입니다. (monster.cc:4959 calc_speed)
    let effective = speed;
    if (status.hasted) effective = divRandRound(effective * 3, 2);
    if (status.slowed) effective = divRandRound(effective * 2, 3);
    return monsterActionMs(effective);
}

/**
 * 행동 하나에 걸리는 시간을 구합니다. (monster.cc:5947 energy_cost)
 *
 * DCSS 는 속도를 두 축으로 나눕니다. speed 는 에너지를 버는 속도이고,
 * energy 는 행동 하나의 값입니다. 둘이 나뉘어 실제 속도가 정해집니다.
 *
 * 이 분리가 있어야 '걷기는 빠른데 크게 휘두르는' 몬스터를 표현할 수 있습니다.
 * 독사는 speed 13 에 물에서의 비용이 6 이라, 땅에서 1.3배인데 물에서는 2.17배입니다.
 * 하나의 숫자로 뭉뚱그리면 이 차이가 사라집니다.
 * @param {number} speed - 몬스터의 speed
 * @param {number} [cost] - 이 행동의 에너지 비용. 기본은 10
 * @returns {number} 걸리는 시간(aut). 행동할 수 없으면 Infinity
 */
export function actionAuts(speed, cost = BASELINE_DELAY) {
    if (!canAct(speed)) return Infinity;
    return (cost * BASELINE_DELAY) / speed;
}

/**
 * 행동 하나에 걸리는 시간을 밀리초로 구합니다.
 * @param {number} speed - 몬스터의 speed
 * @param {number} [cost] - 이 행동의 에너지 비용
 * @returns {number} 걸리는 시간(ms)
 */
export function actionMs(speed, cost = BASELINE_DELAY) {
    return autToMs(actionAuts(speed, cost));
}

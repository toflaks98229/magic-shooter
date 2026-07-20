/**
 * @fileoverview 몬스터가 플레이어를 알아채고, 쫓고, 잊는 규칙입니다.
 *
 * 지금까지 모든 적은 태어난 순간부터 플레이어의 위치를 알고 곧장 달려왔습니다.
 * 벽 뒤로 숨어도, 방을 나가도 소용이 없었습니다. 그래서 이 게임에는
 * '들키지 않는다'거나 '따돌린다'는 선택지가 없었습니다.
 *
 * DCSS 는 이것을 지능으로 나눕니다. 머리가 없는 것은 코앞의 것만 알아보고 금세 잊고,
 * 사람만큼 영리한 것은 멀리서 알아보고 오래 쫓아옵니다.
 * 실시간 FPS 에서 이 차이는 특히 크게 다가옵니다. 시야를 끊고 도망칠 수 있는지가
 * 매 전투의 선택지를 바꾸기 때문입니다.
 *
 * 소리는 그 반대편입니다. 한 마리가 울면 반경 안의 모두가 깨어납니다.
 * '옆방을 깨웠는가'는 실시간에서 일급 판단이 되고, 그 반경을 원본이 이미 정해 두었습니다.
 *
 * 출처: crawl-ref/source/mon-pathfind.cc, mon-behv.cc, mon-util.cc, shout.cc
 */

import { randomRange } from './random.js';
import { autToMs } from './time.js';

/**
 * @description 지능별로 플레이어를 알아보는 거리(타일). (mon-pathfind.cc:35)
 * 머리가 없는 것은 코앞만, 사람만큼 영리한 것은 방 하나 너머까지 봅니다.
 */
const TRACKING_RANGE_TILES = {
    brainless: 3,
    animal: 8,
    human: 11,
};

/**
 * @description 지능별로 놓친 적을 기억하는 시간의 범위(aut). (mon-behv.cc:680)
 * 사람만큼 영리한 것은 한참을 뒤지고 다니지만, 머리가 없는 것은 곧 잊습니다.
 */
const FOE_MEMORY_AUTS = {
    brainless: [100, 300],
    animal: [250, 550],
    human: [450, 1000],
};

/**
 * @description 우는 소리별 전달 반경(타일). (mon-util.cc:1207 get_shout_noise_level)
 *
 * 원본의 스물일곱 가지 소리를 여섯 단계로 접은 것이 이 표입니다.
 * 소리의 종류 자체는 연출이지만, 반경은 전투의 판을 정합니다.
 */
const SHOUT_RADIUS_TILES = {
    silent: 0,
    hiss: 4, skitter: 4, faint_skitter: 4, very_soft: 4,
    soft: 6,
    loud: 10,
    loud_roar: 12, very_loud: 12,
};

/** @description 표에 없는 소리의 기본 반경(타일). 원본의 default 와 같습니다. */
const DEFAULT_SHOUT_RADIUS_TILES = 8;

/**
 * 지능에 따른 인지 거리를 구합니다.
 * @param {string} intelligence - brainless / animal / human
 * @returns {number} 타일 수
 */
export function trackingRangeTiles(intelligence) {
    return TRACKING_RANGE_TILES[intelligence] ?? TRACKING_RANGE_TILES.human;
}

/**
 * 놓친 적을 얼마나 오래 기억할지 굴립니다.
 * @param {string} intelligence - 지능
 * @returns {number} 기억하는 시간(ms)
 */
export function rollFoeMemoryMs(intelligence) {
    const [low, high] = FOE_MEMORY_AUTS[intelligence] ?? FOE_MEMORY_AUTS.human;
    return autToMs(randomRange(low, high));
}

/**
 * 우는 소리가 닿는 반경을 구합니다.
 * @param {string} shout - 소리 종류
 * @returns {number} 타일 수. 0 이면 소리를 내지 않습니다
 */
export function shoutRadiusTiles(shout) {
    if (shout === 'silent' || !shout) return 0;
    return SHOUT_RADIUS_TILES[shout] ?? DEFAULT_SHOUT_RADIUS_TILES;
}

/**
 * 이 몬스터가 소리를 낼 수 있는지 봅니다.
 *
 * 원본은 머리가 없는 것은 울지 못하게 막습니다. (monster.cc:631)
 * 소리로 동료를 부르는 것은 어느 정도의 판단을 전제하기 때문입니다.
 * @param {object} monster - 몬스터 정의
 * @returns {boolean} 울 수 있으면 true
 */
export function canShout(monster) {
    if (monster.intelligence === 'brainless') return false;
    return shoutRadiusTiles(monster.shout) > 0;
}

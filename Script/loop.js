/**
 * @fileoverview 고정 타임스텝 시뮬레이션 루프.
 *
 * 이전에는 실제 프레임 간격을 그대로 시뮬레이션에 넘겼기 때문에,
 * 게임의 결과가 기기의 프레임레이트에 따라 달라졌습니다.
 * 30FPS에서는 한 스텝의 이동량이 커져 벽을 뚫을 수 있었고,
 * 144FPS에서는 lerp 기반 연출이 다른 속도로 수렴했습니다.
 *
 * 이제 시뮬레이션은 언제나 SIMULATION_STEP_MS 단위로만 전진합니다.
 * 화면 프레임에서 남은 시간은 누산기에 모아 두었다가 다음 프레임으로 넘깁니다.
 * 그 결과 어떤 프레임레이트에서도 같은 시간이 흐르면 같은 결과가 나옵니다.
 *
 * 이 파일이 main.js에서 분리되어 있는 이유는, main.js가 import되는 즉시
 * init()을 실행해 버려 테스트에서 불러올 수 없기 때문입니다.
 */

import * as C from './constants.js';
import { update } from './gameLogic.js';

/** @description 아직 시뮬레이션에 반영되지 않고 남아 있는 시간(ms) */
let accumulator = 0;

/**
 * 누산기를 비웁니다. 새 게임을 시작할 때 이전 판의 잔여 시간이 넘어오지 않게 합니다.
 */
export function resetLoop() {
    accumulator = 0;
}

/**
 * 화면 프레임 하나만큼 시간을 흘려보내고, 그동안 쌓인 만큼 시뮬레이션을 전진시킵니다.
 * @param {number} rawFrameTime - 이번 화면 프레임의 실제 길이(ms)
 * @returns {number} 이번 호출에서 실행한 시뮬레이션 스텝 수
 */
export function advanceSimulation(rawFrameTime) {
    // 탭 전환 후 복귀처럼 프레임 간격이 비정상적으로 벌어졌을 때를 대비해 여기서 상한을 둡니다.
    // 호출하는 쪽이 잊을 수 없도록 루프 안에서 처리합니다.
    accumulator += Math.min(rawFrameTime, C.MAX_FRAME_TIME);

    let steps = 0;
    while (accumulator >= C.SIMULATION_STEP_MS && steps < C.MAX_STEPS_PER_FRAME) {
        update(C.SIMULATION_STEP_MS);
        accumulator -= C.SIMULATION_STEP_MS;
        steps++;
    }

    // 상한까지 돌고도 시간이 남았다면 기기가 시뮬레이션을 따라잡지 못하는 상황입니다.
    // 남은 시간을 계속 쌓으면 다음 프레임의 부담이 더 커져 점점 느려지므로(죽음의 나선),
    // 여기서 버리고 게임이 조금 느려진 채로 계속 돌게 둡니다.
    if (steps === C.MAX_STEPS_PER_FRAME) accumulator = 0;

    return steps;
}

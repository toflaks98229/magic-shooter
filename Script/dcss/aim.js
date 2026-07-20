/**
 * @fileoverview 조준으로 명중을 정합니다.
 *
 * 예전에는 각도 허용치로 봐줬습니다. 총은 시야각의 1/8, 주먹은 1/4 안에 들어오면
 * 가장 가까운 적이 맞았습니다. 조준이 아니라 '대충 그쪽을 보고 있으면' 맞는 방식이라,
 * 화면 구석에 있는 적이 정면의 적보다 먼저 맞는 일도 생겼습니다.
 * 그 보정을 걷어내고, 실제로 겨눈 선이 몬스터의 몸을 지나는지만 봅니다.
 *
 * 대신 DCSS 의 회피를 버리지 않습니다. 회피가 높은 몬스터는 combat.js 의
 * aimRadius 가 과녁을 줄이므로, 더 정확히 겨눠야 맞습니다.
 * 주사위로 피하던 것을 '작아서 맞추기 어려운 것'으로 옮긴 셈입니다.
 *
 * 각도 허용치와 달리 이 방식은 거리에 따라 저절로 어려워집니다.
 * 멀리 있는 적은 화면에서 작아지고, 겨냥해야 할 각도도 그만큼 좁아집니다.
 */

/**
 * 겨눈 선이 원을 지나는지 봅니다.
 *
 * 플레이어에서 몬스터로 가는 벡터를 '바라보는 방향'과 '그에 수직인 방향'으로
 * 나눕니다. 앞쪽 성분이 양수여야 앞에 있는 것이고, 옆쪽 성분의 크기가
 * 반지름보다 작아야 선이 몸을 지납니다.
 * @param {object} shot - 쏘는 쪽
 * @param {number} shot.x - 쏘는 위치 X
 * @param {number} shot.y - 쏘는 위치 Y
 * @param {number} shot.angle - 바라보는 각도(라디안)
 * @param {object} target - 표적
 * @param {number} target.x - 표적 X
 * @param {number} target.y - 표적 Y
 * @param {number} radius - 맞아야 하는 반지름(픽셀)
 * @returns {{hit: boolean, forward: number, lateral: number}} 판정과 성분
 */
export function traceHit(shot, target, radius) {
    const dx = target.x - shot.x;
    const dy = target.y - shot.y;

    const cos = Math.cos(shot.angle);
    const sin = Math.sin(shot.angle);

    // 바라보는 방향으로의 거리. 음수면 등 뒤입니다.
    const forward = dx * cos + dy * sin;
    // 겨눈 선에서 옆으로 벗어난 거리.
    const lateral = Math.abs(dx * sin - dy * cos);

    return { hit: forward > 0 && lateral < radius, forward, lateral };
}

/**
 * 겨눈 선에 걸리는 표적 중 가장 가까운 것을 고릅니다.
 *
 * 거리 제한과 시야 확인은 호출부가 맡습니다. 여기서는 기하만 봅니다.
 * @param {object} shot - 쏘는 쪽 (x, y, angle)
 * @param {object[]} targets - 표적 목록
 * @param {(target: object) => number} radiusOf - 표적마다 맞아야 하는 반지름
 * @param {(target: object, forward: number) => boolean} [accept] - 추가 조건 (사거리·시야 등)
 * @returns {{target: object, distance: number}|null} 가장 가까운 명중. 없으면 null
 */
export function pickAimedTarget(shot, targets, radiusOf, accept) {
    let best = null;

    for (const target of targets) {
        const { hit, forward } = traceHit(shot, target, radiusOf(target));
        if (!hit) continue;
        if (accept && !accept(target, forward)) continue;

        // 겹쳐 선 적 중에서는 앞의 것이 막아섭니다.
        if (best === null || forward < best.distance) {
            best = { target, distance: forward };
        }
    }

    return best;
}

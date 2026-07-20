/**
 * @fileoverview 세션 한정 상태입니다. 저장 대상이 아닙니다.
 *
 * world.js와 나누는 기준은 "세이브 파일에 들어가야 하는가"입니다.
 * 게임을 껐다 켜면 초기화되어도 무방한 값(실행 중 여부, 화면 흔들림 위상,
 * 무기 교체 애니메이션 진행 여부 등)은 전부 이쪽에 둡니다.
 */

/** @description 세션 동안만 유지되는 실행 상태 */
export const runtime = {
    /** @description 게임이 현재 실행 중인지 여부 */
    isGameRunning: false,

    /** @description 플레이어가 이번 프레임에 움직이고 있는지 여부 */
    isMoving: false,

    /** @description 화면 흔들림(Bobbing) 효과를 위한 위상 각도 */
    bobbingAngle: 0,
    /** @description 화면 흔들림의 현재 수직 오프셋 */
    bobbingOffset: 0,
    /** @description 화면 흔들림의 현재 수평 오프셋 */
    bobbingOffsetX: 0,

    /** @description 무기 교체 애니메이션이 진행 중인지 여부 */
    isSwappingWeapon: false,

    /** @description 총 발사 등 동적인 광원 효과의 상태 */
    dynamicLight: { active: false, x: 0, y: 0, intensity: 0, falloff: 0.001 },
};

/**
 * 동적 광원 상태를 설정합니다.
 * @param {{active: boolean, x: number, y: number, intensity: number, falloff: number}} lightState
 */
export function setDynamicLight(lightState) {
    const light = runtime.dynamicLight;
    light.active = lightState.active;
    light.x = lightState.x;
    light.y = lightState.y;
    light.intensity = lightState.intensity;
    light.falloff = lightState.falloff;
}

/**
 * 새 게임/새 층을 시작할 때 세션 상태를 초기값으로 되돌립니다.
 * 이전 판의 흔들림 위상이나 교체 애니메이션 플래그가 남아 있으면
 * 재시작 직후 조작이 잠기는 문제가 생기므로 반드시 함께 초기화합니다.
 */
export function resetRuntime() {
    runtime.isMoving = false;
    runtime.bobbingAngle = 0;
    runtime.bobbingOffset = 0;
    runtime.bobbingOffsetX = 0;
    runtime.isSwappingWeapon = false;
    runtime.dynamicLight.active = false;
    runtime.dynamicLight.intensity = 0;
}

/**
 * @fileoverview 키보드, 마우스, 터치 등 모든 사용자 입력을 처리합니다.
 *
 * 이 파일은 게임 로직을 직접 부르지 않고, 입력을 '큐에 쌓기만' 합니다.
 * gameLogic이 매 시뮬레이션 스텝 시작 시점에 큐를 비우며 한꺼번에 반영합니다.
 *
 * 이전에는 mousemove 핸들러가 player.angle을 그 자리에서 바꿨기 때문에,
 * 플레이어 상태가 게임 루프 바깥에서 프레임 경계와 무관하게 변했습니다.
 * 그 상태로는 일시정지·리플레이·고정 타임스텝이 성립하지 않습니다.
 * 이제 모든 상태 변경은 시뮬레이션 스텝 안에서만 일어납니다.
 */

// --- 모듈 임포트 ---
import * as C from './constants.js';
import { runtime } from './runtime.js';
import { dom } from './dom.js';


// --- 모듈 내부 변수 (Private Member Variables) ---

/** @description 현재 눌려있는 키보드 키의 상태를 저장하는 객체 (e.g., keys['KeyW'] = true) */
const keys = {};

/** @description 현재 기기가 터치 입력을 지원하는지 여부를 감지하여 저장합니다. */
const isTouchDevice = 'ontouchstart' in window;

/** @description (모바일) 가상 조이스틱의 현재 입력값 (-1.0 ~ 1.0). x는 좌우, y는 상하. */
let moveInput = { x: 0, y: 0 };

/** @description 큐에 쌓을 수 있는 동작의 종류 */
export const INPUT_ACTIONS = {
    ATTACK: 'attack',
    INTERACT: 'interact',
};

/**
 * @description 아직 시뮬레이션에 반영되지 않은 단발성 동작들.
 * 이동처럼 '누르고 있는 상태'는 폴링(getPlayerMovement)으로 읽고,
 * 공격·상호작용처럼 '순간의 사건'만 이 큐에 쌓습니다.
 */
const actionQueue = [];

/**
 * @description 아직 반영되지 않은 시점 회전량(라디안).
 * 마우스 이동은 한 프레임에 여러 번 발생할 수 있으므로 누적해 두었다가 한 번에 적용합니다.
 */
let pendingLookDelta = 0;


// --- 외부 공개 함수 (Public Methods) ---

/**
 * 게임 조작에 필요한 모든 이벤트 리스너(키보드, 마우스, 터치)를 설정합니다.
 * 이 함수는 main.js에서 게임 초기화 시 한 번만 호출됩니다.
 */
export function setupInputHandlers() {
    // 키보드 이벤트 리스너: 키를 누르거나 뗄 때 'keys' 객체의 상태를 업데이트합니다.
    document.addEventListener('keydown', e => {
        keys[e.code] = true;
        // --- 새로운 로직: 상호작용 키 (스페이스바) ---
        if (e.code === 'Space' && runtime.isGameRunning) {
            e.preventDefault(); // 브라우저 기본 동작(페이지 스크롤) 방지
            queueAction(INPUT_ACTIONS.INTERACT);
        }
    });
    document.addEventListener('keyup', e => { keys[e.code] = false; });

    // 캔버스 클릭 시 마우스 포인터 잠금 (데스크톱 전용 기능)
    // 포인터 잠금은 게임 화면 밖으로 마우스가 나가는 것을 방지하여 1인칭 시점 조작을 편리하게 합니다.
    dom.canvas.addEventListener('click', () => {
        if (runtime.isGameRunning && !isTouchDevice) dom.canvas.requestPointerLock();
    });

    // 마우스 이동 시 플레이어 시점 회전 (포인터가 잠겨있을 때만 동작)
    document.addEventListener('mousemove', e => {
        if (document.pointerLockElement === dom.canvas && runtime.isGameRunning) {
            pendingLookDelta += e.movementX * C.MOUSE_SENSITIVITY * C.ROTATION_SPEED;
        }
    });

    // 마우스 클릭 시 공격
    dom.canvas.addEventListener('mousedown', () => {
        if (runtime.isGameRunning) queueAction(INPUT_ACTIONS.ATTACK);
    });

    // 터치 기기인 경우 모바일 전용 컨트롤러를 설정합니다.
    if (isTouchDevice) {
        setupMobileControls();
    }
}

/**
 * 현재 입력 상태(키보드 및 가상 조이스틱)를 기반으로 플레이어의 움직임 값을 계산하여 반환합니다.
 * @returns {{forward: number, strafe: number}} 전진/후진 및 좌/우 이동 값 (-1, 0, 또는 1)
 */
export function getPlayerMovement() {
    // 키보드 입력과 모바일 조이스틱 입력을 합산하여 최종 움직임을 결정합니다.
    // 이렇게 하면 키보드와 모바일 컨트롤을 동시에 사용할 수 있습니다.
    const stickX = isTouchDevice ? moveInput.x : 0;
    const stickY = isTouchDevice ? moveInput.y : 0;

    // 조이스틱의 y는 화면 좌표계(아래쪽이 +)이므로, 전진(+)으로 변환하려면 부호를 뒤집습니다.
    // 반면 x는 오른쪽이 +로 이미 strafe와 방향이 같으므로 그대로 더합니다.
    const forward = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0) - stickY;
    const strafe = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + stickX;
    return { forward, strafe };
}

/**
 * 쌓여 있는 단발성 동작을 순서대로 넘겨주고 큐를 비웁니다.
 * @param {(action: string) => void} handler - 각 동작을 처리할 콜백
 */
export function drainActionQueue(handler) {
    for (let i = 0; i < actionQueue.length; i++) handler(actionQueue[i]);
    actionQueue.length = 0;
}

/**
 * 누적된 시점 회전량을 반환하고 0으로 초기화합니다.
 * @returns {number} 적용해야 할 회전량(라디안)
 */
export function consumePendingLook() {
    const delta = pendingLookDelta;
    pendingLookDelta = 0;
    return delta;
}

/**
 * 쌓여 있는 입력을 모두 버립니다. (게임 시작·재시작 시 이전 판의 입력이 새 판에 새는 것을 방지)
 */
export function clearInputQueue() {
    actionQueue.length = 0;
    pendingLookDelta = 0;
}

// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 단발성 동작을 큐에 쌓습니다.
 * 루프가 멈춘 사이 입력이 무한히 쌓이지 않도록 상한을 둡니다.
 * @param {string} action - INPUT_ACTIONS 중 하나
 */
function queueAction(action) {
    if (actionQueue.length >= C.MAX_QUEUED_INPUTS) return;
    actionQueue.push(action);
}

/**
 * 모바일 터치 컨트롤(이동 스틱, 시점 조작, 공격 버튼)을 위한 이벤트 리스너를 설정합니다.
 */
function setupMobileControls() {
    dom.mobileControls.style.display = 'flex';
    dom.lookZone.style.display = 'block';

    let moveTouchId = null, lookTouchId = null; // 이동과 시점 조작 터치를 구분하기 위한 ID
    let moveStartPos = { x: 0, y: 0 }, lookStartPos = { x: 0, y: 0 }; // 터치 시작점 좌표

    // 터치가 끝났을 때 호출되는 공통 핸들러
    const handleEnd = (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === moveTouchId) { // 이동 터치가 끝났을 경우
                moveTouchId = null;
                moveInput = { x: 0, y: 0 }; // 이동 입력 초기화
                dom.moveStick.style.transform = `translate(0px, 0px)`; // 조이스틱 핸들을 중앙으로 복귀
            } else if (touch.identifier === lookTouchId) { // 시점 조작 터치가 끝났을 경우
                lookTouchId = null;
            }
        }
    };

    // 이동 스틱 영역 터치 시작
    dom.moveStickZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (moveTouchId === null) { // 다른 손가락이 이미 이동 스틱을 조작하고 있지 않을 때만
            moveTouchId = e.changedTouches[0].identifier;
            const rect = dom.moveStickZone.getBoundingClientRect(); // 스틱 존의 화면상 위치 계산
            moveStartPos = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
    }, { passive: false });

    // 시점 조작 영역 터치 시작
    dom.lookZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (lookTouchId === null) {
            const touch = e.changedTouches[0];
            lookTouchId = touch.identifier;
            lookStartPos = { x: touch.clientX, y: touch.clientY };
        }
    }, { passive: false });

    // 화면 전체에서 터치 이동 감지
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === moveTouchId) { // 이동 터치가 움직일 때
                const dx = touch.clientX - moveStartPos.x;
                const dy = touch.clientY - moveStartPos.y;
                const dist = Math.hypot(dx, dy);
                const maxDist = dom.moveStickZone.clientWidth / 2;
                const clampedDist = Math.min(dist, maxDist); // 조이스틱이 영역 밖으로 나가지 않도록 제한
                const angle = Math.atan2(dy, dx);
                // 최종 입력값 계산 (-1.0 ~ 1.0)
                moveInput.x = (Math.cos(angle) * clampedDist) / maxDist;
                moveInput.y = (Math.sin(angle) * clampedDist) / maxDist;
                // 조이스틱 핸들을 시각적으로 이동
                dom.moveStick.style.transform = `translate(${Math.cos(angle) * clampedDist}px, ${Math.sin(angle) * clampedDist}px)`;
            } else if (touch.identifier === lookTouchId) { // 시점 조작 터치가 움직일 때
                const dx = touch.clientX - lookStartPos.x;
                pendingLookDelta += dx * C.MOUSE_SENSITIVITY * C.ROTATION_SPEED * C.TOUCH_LOOK_MULTIPLIER;
                lookStartPos = { x: touch.clientX, y: touch.clientY }; // 현재 위치를 새 시작점으로 갱신하여 연속적인 움직임 구현
            }
        }
    }, { passive: false });

    // 터치 종료 이벤트 리스너 (touchend: 정상 종료, touchcancel: 예외 종료)
    document.addEventListener('touchend', handleEnd, { passive: false });
    document.addEventListener('touchcancel', handleEnd, { passive: false });

    // 공격 버튼 터치 이벤트
    dom.shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); queueAction(INPUT_ACTIONS.ATTACK); }, { passive: false });
}

/**
 * @fileoverview 키보드, 마우스, 터치 등 모든 사용자 입력을 처리합니다.
 */

// --- 모듈 임포트 ---
import * as S from './state.js';
import * as C from './constants.js';
import { attack, interactWithWorld } from './gameLogic.js';

// --- 모듈 내부 변수 (Private Member Variables) ---

/** @description 현재 눌려있는 키보드 키의 상태를 저장하는 객체 (e.g., keys['KeyW'] = true) */
const keys = {};

/** @description 현재 기기가 터치 입력을 지원하는지 여부를 감지하여 저장합니다. */
const isTouchDevice = 'ontouchstart' in window;

/** @description (모바일) 가상 조이스틱의 현재 입력값 (-1.0 ~ 1.0). x는 좌우, y는 상하. */
let moveInput = { x: 0, y: 0 };


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
        if (e.code === 'Space' && S.isGameRunning) {
            e.preventDefault(); // 브라우저 기본 동작(페이지 스크롤) 방지
            interactWithWorld();
        }
    });
    document.addEventListener('keyup', e => { keys[e.code] = false; });

    // 캔버스 클릭 시 마우스 포인터 잠금 (데스크톱 전용 기능)
    // 포인터 잠금은 게임 화면 밖으로 마우스가 나가는 것을 방지하여 1인칭 시점 조작을 편리하게 합니다.
    S.dom.canvas.addEventListener('click', () => {
        if (S.isGameRunning && !isTouchDevice) S.dom.canvas.requestPointerLock();
    });

    // 마우스 이동 시 플레이어 시점 회전 (포인터가 잠겨있을 때만 동작)
    document.addEventListener('mousemove', e => {
        if (document.pointerLockElement === S.dom.canvas && S.isGameRunning) {
            S.player.angle += e.movementX * 0.001 * C.ROTATION_SPEED;
        }
    });

    // 마우스 클릭 시 공격
    S.dom.canvas.addEventListener('mousedown', () => {
        if (S.isGameRunning) attack();
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
    const forward = (keys.KeyW ? 1 : 0) - (keys.KeyS ? 1 : 0) - (isTouchDevice ? moveInput.y : 0);
    const strafe = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) - (isTouchDevice ? -moveInput.x : 0);
    return { forward, strafe };
}

// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 모바일 터치 컨트롤(이동 스틱, 시점 조작, 공격 버튼)을 위한 이벤트 리스너를 설정합니다.
 */
function setupMobileControls() {
    S.dom.mobileControls.style.display = 'flex';
    S.dom.lookZone.style.display = 'block';

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
                S.dom.moveStick.style.transform = `translate(0px, 0px)`; // 조이스틱 핸들을 중앙으로 복귀
            } else if (touch.identifier === lookTouchId) { // 시점 조작 터치가 끝났을 경우
                lookTouchId = null;
            }
        }
    };

    // 이동 스틱 영역 터치 시작
    S.dom.moveStickZone.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (moveTouchId === null) { // 다른 손가락이 이미 이동 스틱을 조작하고 있지 않을 때만
            moveTouchId = e.changedTouches[0].identifier;
            const rect = S.dom.moveStickZone.getBoundingClientRect(); // 스틱 존의 화면상 위치 계산
            moveStartPos = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
    }, { passive: false });

    // 시점 조작 영역 터치 시작
    S.dom.lookZone.addEventListener('touchstart', (e) => {
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
                const maxDist = S.dom.moveStickZone.clientWidth / 2;
                const clampedDist = Math.min(dist, maxDist); // 조이스틱이 영역 밖으로 나가지 않도록 제한
                const angle = Math.atan2(dy, dx);
                // 최종 입력값 계산 (-1.0 ~ 1.0)
                moveInput.x = (Math.cos(angle) * clampedDist) / maxDist;
                moveInput.y = (Math.sin(angle) * clampedDist) / maxDist;
                // 조이스틱 핸들을 시각적으로 이동
                S.dom.moveStick.style.transform = `translate(${Math.cos(angle) * clampedDist}px, ${Math.sin(angle) * clampedDist}px)`;
            } else if (touch.identifier === lookTouchId) { // 시점 조작 터치가 움직일 때
                const dx = touch.clientX - lookStartPos.x;
                S.player.angle += dx * 0.001 * C.ROTATION_SPEED * 2; // 가로 이동량에 따라 플레이어 회전 (모바일 감도 2배)
                lookStartPos = { x: touch.clientX, y: touch.clientY }; // 현재 위치를 새 시작점으로 갱신하여 연속적인 움직임 구현
            }
        }
    }, { passive: false });

    // 터치 종료 이벤트 리스너 (touchend: 정상 종료, touchcancel: 예외 종료)
    document.addEventListener('touchend', handleEnd, { passive: false });
    document.addEventListener('touchcancel', handleEnd, { passive: false });

    // 공격 버튼 터치 이벤트
    S.dom.shootBtn.addEventListener('touchstart', (e) => { e.preventDefault(); attack(); }, { passive: false });
}

/**
 * @fileoverview 화면 알림 메시지.
 *
 * 포탈은 발견하지 못하면 그냥 지나치게 되고, 시간이 지나면 영구히 닫힙니다.
 * 열렸다는 사실과 닫혔다는 사실을 플레이어가 알 방법이 없으면 기믹이 성립하지 않습니다.
 * 그래서 게임 이벤트를 구독해 화면 위쪽에 잠시 띄우는 최소한의 알림을 둡니다.
 *
 * 어떤 사건을 어떤 색으로 알릴지는 EVENT_MESSAGES 표에 모여 있습니다.
 */

import { dom } from './dom.js';
import { on, EVENTS } from './events.js';
import { getBranch } from './branches.js';

/** @description 메시지 종류별 색상 */
export const MESSAGE_STYLES = {
    /** 포탈 발견처럼 놓치면 안 되는 기회 */
    opportunity: '#ffd54a',
    /** 룬 획득 같은 성취 */
    achievement: '#7cf07c',
    /** 포탈 폐쇄 같은 상실 */
    loss: '#ff8a6b',
    /** 그 외 안내 */
    info: '#d0d0d0',
};

/** @description 화면에 동시에 남겨둘 최대 메시지 수 */
const MAX_VISIBLE = 4;

/** @description 메시지 하나가 화면에 머무는 시간(ms) */
const MESSAGE_LIFETIME_MS = 6000;

/**
 * @description 어떤 이벤트를 어떤 문구와 색으로 알릴지 정의한 표.
 * 각 항목은 detail을 받아 { text, style }을 돌려줍니다.
 */
const EVENT_MESSAGES = {
    [EVENTS.PORTAL_APPEARED]: ({ name, flavour, closesInMs }) => ({
        text: `${flavour} — ${name} (${Math.round(closesInMs / 1000)}초 후 닫힘)`,
        style: 'opportunity',
    }),
    [EVENTS.PORTAL_CLOSED]: ({ name }) => ({
        text: `${name}의 입구가 닫혔다.`,
        style: 'loss',
    }),
    [EVENTS.RUNE_COLLECTED]: ({ branch, total }) => ({
        text: `${getBranch(branch).name}의 룬을 손에 넣었다. (${total}개)`,
        style: 'achievement',
    }),
    [EVENTS.BRANCH_ENTERED]: ({ name }) => ({
        text: `${name}에 발을 들였다.`,
        style: 'info',
    }),
};

/**
 * 게임 이벤트를 구독해 알림을 띄우도록 등록합니다.
 * main.js의 초기화 시점에 한 번만 호출됩니다.
 */
export function registerMessageHandlers() {
    for (const [eventName, format] of Object.entries(EVENT_MESSAGES)) {
        on(eventName, (detail) => {
            const { text, style } = format(detail);
            showMessage(text, style);
        });
    }
}

/**
 * 알림 한 줄을 띄웁니다.
 * @param {string} text - 표시할 문구
 * @param {keyof MESSAGE_STYLES} [style] - 색상 종류
 */
export function showMessage(text, style = 'info') {
    const log = dom.messageLogEl;
    if (!log) return;

    const line = document.createElement('div');
    line.className = 'message-line';
    line.textContent = text;
    line.style.color = MESSAGE_STYLES[style] || MESSAGE_STYLES.info;
    log.appendChild(line);

    // 오래된 줄부터 걷어내 화면을 가리지 않게 합니다.
    while (log.childElementCount > MAX_VISIBLE) log.removeChild(log.firstChild);

    setTimeout(() => line.remove(), MESSAGE_LIFETIME_MS);
}

/**
 * 화면에 남은 알림을 모두 지웁니다. 새 게임을 시작할 때 씁니다.
 */
export function clearMessages() {
    const log = dom.messageLogEl;
    if (!log) return;
    while (log.firstChild) log.removeChild(log.firstChild);
}

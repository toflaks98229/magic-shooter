/**
 * @fileoverview 게임 전역 이벤트 버스입니다.
 *
 * 리팩토링 이전에는 시뮬레이션(gameLogic)이 프레젠테이션(ui)과 사운드(window.playSound)를
 * 직접 호출했기 때문에, 연출을 하나 추가할 때마다 게임 규칙 코드를 열어야 했습니다.
 * 이제 시뮬레이션은 "무슨 일이 일어났는가"만 알리고, 그 사실에 어떻게 반응할지는
 * 각 표현 계층(ui.js, audio.js, main.js)이 스스로 구독하여 결정합니다.
 *
 * 디스패치는 동기적으로 동작합니다. 즉 emit()이 반환되는 시점에는 모든 구독자의 처리가
 * 끝나 있으므로, 기존의 직접 호출과 실행 순서가 완전히 동일합니다.
 */

/** @description 게임에서 발생하는 모든 이벤트의 이름. 문자열 오타를 막기 위해 상수로 관리합니다. */
export const EVENTS = {
    /** 플레이어가 피해를 입음. detail: { amount, source, hp } */
    PLAYER_DAMAGED: 'player:damaged',
    /** 플레이어가 회복함. detail: { amount, hp } */
    PLAYER_HEALED: 'player:healed',
    /** 플레이어의 체력이 0이 됨. detail: { floor } */
    PLAYER_DIED: 'player:died',

    /** 무기를 발사함. detail: { weapon } */
    WEAPON_FIRED: 'weapon:fired',
    /** 사용 무기가 바뀌기 시작함. detail: { from, to } */
    WEAPON_CHANGED: 'weapon:changed',

    /** 적이 피해를 입음. detail: { enemy, amount } */
    ENEMY_HIT: 'enemy:hit',
    /** 적이 사망함. detail: { enemy } */
    ENEMY_DIED: 'enemy:died',

    /** 아이템을 획득함. detail: { item } */
    ITEM_PICKED_UP: 'item:pickedUp',
    /** 문이 열림. detail: { tileX, tileY } */
    DOOR_OPENED: 'door:opened',
    /** 출구에 도달함. detail: { floor } */
    EXIT_REACHED: 'exit:reached',
    /** 층이 바뀜. detail: { floor } */
    FLOOR_CHANGED: 'floor:changed',

    /** 하위 던전에 진입함. detail: { branch, name, depth } */
    BRANCH_ENTERED: 'branch:entered',
    /** 상위 던전으로 복귀함. detail: { from, to, depth } */
    BRANCH_LEFT: 'branch:left',
    /** 룬을 획득함. detail: { branch, total } */
    RUNE_COLLECTED: 'rune:collected',
};

/** @description 실제 디스패치를 담당하는 내부 버스. 외부에 노출하지 않습니다. */
const bus = new EventTarget();

/**
 * @description 구독 해제를 위해 (핸들러 → 실제 등록된 래퍼)를 이벤트별로 기억해 둡니다.
 * 구독자는 detail만 받으면 되므로 CustomEvent를 벗겨주는 래퍼가 필요한데,
 * 이 래퍼를 기억해두지 않으면 removeEventListener로 해제할 수 없습니다.
 * @type {Map<string, Map<Function, Function>>}
 */
const wrappers = new Map();

/**
 * 이벤트를 구독합니다.
 * @param {string} type - EVENTS에 정의된 이벤트 이름
 * @param {(detail: any) => void} handler - 이벤트의 detail을 인자로 받는 콜백
 * @returns {() => void} 호출하면 구독이 해제되는 함수
 */
export function on(type, handler) {
    const wrapper = (event) => handler(event.detail);

    if (!wrappers.has(type)) wrappers.set(type, new Map());
    wrappers.get(type).set(handler, wrapper);

    bus.addEventListener(type, wrapper);
    return () => off(type, handler);
}

/**
 * 이벤트 구독을 해제합니다.
 * @param {string} type - 이벤트 이름
 * @param {Function} handler - on()에 넘겼던 것과 동일한 핸들러 참조
 */
export function off(type, handler) {
    const wrapper = wrappers.get(type)?.get(handler);
    if (!wrapper) return;

    bus.removeEventListener(type, wrapper);
    wrappers.get(type).delete(handler);
}

/**
 * 이벤트를 발행합니다. 모든 구독자가 동기적으로 즉시 실행됩니다.
 * @param {string} type - 이벤트 이름
 * @param {any} [detail] - 구독자에게 전달할 데이터
 */
export function emit(type, detail = null) {
    bus.dispatchEvent(new CustomEvent(type, { detail }));
}

/**
 * 등록된 모든 구독을 해제합니다.
 * 씬 전환(서브 던전 등)에서 리스너가 중복 등록되는 것을 막기 위한 정리용 함수입니다.
 */
export function clearAllSubscriptions() {
    for (const [type, handlerMap] of wrappers) {
        for (const wrapper of handlerMap.values()) bus.removeEventListener(type, wrapper);
    }
    wrappers.clear();
}

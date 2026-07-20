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
    /** 몬스터가 주문을 시전함. 연출과 소리가 이걸 듣습니다. */
    MONSTER_CAST: 'monster:cast',
    /** 불려 나온 적이 시간이 다해 사라짐. 죽은 것과 다릅니다. */
    ENEMY_DISMISSED: 'enemy:dismissed',

    /** 섬기는 신이 바뀜. detail: { god, name } */
    GOD_CHANGED: 'god:changed',
    /** 제단에서 거부당함. detail: { god, reason } */
    WORSHIP_REFUSED: 'god:refused',
    /** 신앙심의 단계(별)가 올라감. detail: { god, rank } */
    PIETY_RANK_CHANGED: 'god:pietyRank',

    /** 아이템을 주워 소지품에 넣음. detail: { item, definition } */
    ITEM_PICKED_UP: 'item:pickedUp',
    /** 소지품이 가득 차 줍지 못함. detail: { item, definition } */
    INVENTORY_FULL: 'inventory:full',
    /** 소지품의 아이템을 사용함. detail: { itemId, definition } */
    ITEM_USED: 'item:used',
    /** 문이 열림. detail: { tileX, tileY } */
    DOOR_OPENED: 'door:opened',
    /** 출구에 도달함. detail: { floor } */
    EXIT_REACHED: 'exit:reached',
    /** 층이 바뀜. detail: { floor } */
    FLOOR_CHANGED: 'floor:changed',
    /** 저장하고 나가기를 요청함. 프레임 경계에서만 발행됩니다. detail: null */
    SAVE_REQUESTED: 'game:saveRequested',

    /** 하위 던전에 진입함. detail: { branch, name, depth } */
    BRANCH_ENTERED: 'branch:entered',
    /** 상위 던전으로 복귀함. detail: { from, to, depth } */
    BRANCH_LEFT: 'branch:left',
    /** 룬을 획득함. detail: { branch, total } */
    RUNE_COLLECTED: 'rune:collected',

    /** 이 층에 포탈이 열림. detail: { id, name, flavour, closesInMs } */
    PORTAL_APPEARED: 'portal:appeared',
    /** 포탈이 시간이 다 되어 닫힘. detail: { id, name } */
    PORTAL_CLOSED: 'portal:closed',

    /** 지속 효과가 걸림. detail: { effect, durationMs } */
    BUFF_APPLIED: 'buff:applied',
    /** 지속 효과가 끝남. detail: { effect } */
    BUFF_EXPIRED: 'buff:expired',
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

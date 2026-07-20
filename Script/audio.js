/**
 * @fileoverview 사운드 재생 계층입니다.
 *
 * 이전에는 게임 로직과 UI가 window.playSound()를 직접 호출했기 때문에,
 * 효과음을 하나 바꾸려면 시뮬레이션 코드를 열어야 했습니다.
 * 이제 이 파일이 게임 이벤트를 구독해 스스로 소리를 냅니다.
 * 어떤 사건에 어떤 소리가 나는지가 EVENT_SOUNDS 한 표에 모여 있습니다.
 */

import * as C from './constants.js';
import { assets } from './assets.js';
import { on, EVENTS } from './events.js';

/** @description 웹 오디오 API 컨텍스트. 사용자의 첫 상호작용 시 생성되어 주입됩니다. */
let audioCtx = null;

/**
 * @description 어떤 게임 이벤트가 어떤 효과음을 내는지 정의한 표.
 * 사운드를 추가·교체할 때 손대야 하는 곳은 여기뿐입니다.
 */
const EVENT_SOUNDS = {
    [EVENTS.ENEMY_HIT]: 'ENEMY_HIT',
    [EVENTS.PLAYER_DAMAGED]: 'PLAYER_HIT',
    [EVENTS.ITEM_PICKED_UP]: 'ITEM_PICKUP',
    [EVENTS.WEAPON_CHANGED]: 'WEAPON_SWAP',
    [EVENTS.DOOR_OPENED]: 'DOOR_OPEN',
};

/**
 * 오디오 컨텍스트를 주입합니다.
 * 브라우저 정책상 사용자 상호작용 이후에만 생성할 수 있어, 생성 시점을 main.js가 결정합니다.
 * @param {AudioContext} ctx - 사용할 오디오 컨텍스트
 */
export function initAudio(ctx) {
    audioCtx = ctx;
}

/**
 * 지정된 키에 해당하는 사운드를 재생합니다.
 * @param {string} key - constants.js의 SOUNDS에 정의된 사운드 키
 */
export function playSound(key) {
    if (!audioCtx || !assets.sounds[key]) return;

    const source = audioCtx.createBufferSource();
    source.buffer = assets.sounds[key];
    source.connect(audioCtx.destination);
    source.start(0);
}

/**
 * 게임 이벤트를 구독해 대응하는 효과음을 재생하도록 등록합니다.
 * main.js의 초기화 시점에 한 번만 호출됩니다.
 */
export function registerAudioHandlers() {
    for (const [eventName, soundKey] of Object.entries(EVENT_SOUNDS)) {
        on(eventName, () => playSound(soundKey));
    }

    // 발사음은 무기마다 다르므로(주먹은 무음) 무기 정의에서 읽어옵니다.
    on(EVENTS.WEAPON_FIRED, ({ weapon }) => {
        const soundKey = C.WEAPONS[weapon]?.sound;
        if (soundKey) playSound(soundKey);
    });
}

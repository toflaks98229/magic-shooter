/**
 * @fileoverview 층에 놓인 기믹 — 가까이 가면 일어나는 일들.
 *
 * 볼트가 손으로 그린 방이라면, 트리거는 그 방이 하는 일입니다.
 * 밟으면 벽이 열리며 쥐가 쏟아지는 방, 다가가면 목소리가 들리는 방,
 * 우두머리가 죽으면 길이 열리는 방. 이것이 있어야 층에 사건이 생깁니다.
 *
 * 원본은 이것을 두 갈래로 나눕니다. (dgn-event.h:96)
 * 턴이 지났다·몬스터가 죽었다처럼 어디서든 일어나는 것은 목록 하나로 받고,
 * 밟았다·시야에 들어왔다처럼 자리가 있는 것은 타일마다 따로 걸어 둡니다.
 * 실시간에서는 플레이어가 매 프레임 움직이므로 그 자리별 색인이 원본보다
 * 오히려 더 중요합니다.
 *
 * 턴제와 다른 점이 하나 있습니다. 원본에서 '밟았다'는 턴마다 한 번인데,
 * 여기서는 플레이어가 타일 경계를 계속 넘나듭니다. 그대로 두면 초당 예순 번
 * 터집니다. 그래서 타일에 들어서는 순간만 보고, 한 번 터진 것은 기본적으로
 * 다시 터지지 않습니다. 원본의 Triggerable 도 같은 규칙입니다.
 *
 * 출처: crawl-ref/source/dgn-event.h, mapmark.h, dat/dlua/lm_trig.lua
 */

import { TILE_SIZE, TILE_IDS } from './constants.js';
import { emit, EVENTS } from './events.js';
import { world } from './world.js';

/**
 * @description 트리거가 반응하는 사건들.
 *
 * 원본의 열 몇 가지 중 이 게임에 뜻이 서는 것만 옮겼습니다.
 * 물건을 집었다·물건이 움직였다 같은 것은 대응물이 없어 넣지 않았습니다.
 */
export const TRIGGER_ON = {
    /** 플레이어가 그 타일에 들어섰다. */
    ENTER: 'enter',
    /** 플레이어가 그 타일을 시야에 담았다. 밟지 않아도 됩니다. */
    SIGHT: 'sight',
    /** 지정한 몬스터가 죽었다. 자리와 무관합니다. */
    MONSTER_DIED: 'monsterDied',
};

/**
 * @description 트리거가 일으키는 일들.
 *
 * 원본은 루아로 무엇이든 할 수 있지만, 여기서는 할 수 있는 일을 추려 둡니다.
 * 데이터로 적을 수 있어야 볼트에서 그대로 읽어 올 수 있기 때문입니다.
 */
export const TRIGGER_DO = {
    /** 표시해 둔 자리들의 지형을 바꿉니다. 벽이 열리는 것이 이것입니다. */
    CHANGE_TERRAIN: 'changeTerrain',
    /** 알립니다. 보이지 않는 곳에서 일어났을 때를 위한 문구가 따로 있습니다. */
    MESSAGE: 'message',
    /** 주변의 잠든 것들을 깨웁니다. */
    ROUSE: 'rouse',
};

/**
 * 이 층에 트리거를 하나 겁니다.
 *
 * @param {object} spec - 트리거 정의
 * @param {string} spec.on - 무엇에 반응하는가 (TRIGGER_ON)
 * @param {string} spec.action - 무엇을 하는가 (TRIGGER_DO)
 * @param {number} [spec.tileX] - 자리가 있는 트리거의 타일 X
 * @param {number} [spec.tileY] - 자리가 있는 트리거의 타일 Y
 * @param {boolean} [spec.repeats] - 여러 번 터지는가. 기본은 한 번뿐입니다
 * @param {object} [spec.data] - 하는 일에 필요한 값들
 */
export function addTrigger(spec) {
    world.triggers.push({
        on: spec.on,
        action: spec.action,
        tileX: spec.tileX ?? null,
        tileY: spec.tileY ?? null,
        repeats: spec.repeats ?? false,
        data: spec.data ?? {},
        fired: false,
    });
}

/**
 * 플레이어가 타일을 넘어설 때마다 살핍니다.
 *
 * 매 프레임 부르되 자리가 바뀌었을 때만 일합니다. 그래야 한 타일 안에서
 * 서성이는 동안 같은 트리거가 계속 터지지 않습니다.
 * @param {number} tileX - 플레이어가 지금 선 타일 X
 * @param {number} tileY - 플레이어가 지금 선 타일 Y
 */
export function checkPositionTriggers(tileX, tileY) {
    for (const trigger of world.triggers) {
        if (trigger.fired && !trigger.repeats) continue;
        if (trigger.on !== TRIGGER_ON.ENTER) continue;
        if (trigger.tileX !== tileX || trigger.tileY !== tileY) continue;

        fire(trigger);
    }
}

/**
 * 시야에 들어오는 것들을 살핍니다.
 *
 * 밟지 않아도 되는 트리거입니다. 방에 들어서는 순간 분위기를 알리는 데 씁니다.
 * @param {function(number, number): boolean} canSee - 그 타일이 보이는지 묻는 함수
 */
export function checkSightTriggers(canSee) {
    for (const trigger of world.triggers) {
        if (trigger.fired && !trigger.repeats) continue;
        if (trigger.on !== TRIGGER_ON.SIGHT) continue;
        if (!canSee(trigger.tileX, trigger.tileY)) continue;

        fire(trigger);
    }
}

/**
 * 몬스터가 죽었을 때 살핍니다.
 *
 * 자리와 무관합니다. 원본은 이런 트리거를 아무 벽 타일에나 걸어 두는데,
 * 마커가 어딘가에는 있어야 하기 때문입니다. 여기서는 자리를 비워 둡니다.
 * @param {string} monsterId - 죽은 몬스터
 */
export function checkDeathTriggers(monsterId) {
    for (const trigger of world.triggers) {
        if (trigger.fired && !trigger.repeats) continue;
        if (trigger.on !== TRIGGER_ON.MONSTER_DIED) continue;
        if (trigger.data.monsterId && trigger.data.monsterId !== monsterId) continue;

        fire(trigger);
    }
}

/**
 * 트리거를 터뜨립니다.
 * @param {object} trigger - 터뜨릴 트리거
 */
function fire(trigger) {
    trigger.fired = true;

    const handler = ACTIONS[trigger.action];
    if (handler) handler(trigger);

    emit(EVENTS.TRIGGER_FIRED, { trigger });
}

/**
 * @description 트리거가 할 수 있는 일들.
 */
const ACTIONS = {
    /**
     * 표시해 둔 자리의 지형을 바꿉니다.
     *
     * 벽이 열리는 것이 이것입니다. 원본의 쥐덫 볼트가 이 방식으로,
     * 압력판을 밟으면 벽 한 줄이 바닥이 되며 안에 있던 쥐들이 쏟아집니다.
     * @param {object} trigger - 터진 트리거
     */
    changeTerrain(trigger) {
        const tile = TILE_IDS[trigger.data.becomes] ?? TILE_IDS.FLOOR;

        for (const spot of trigger.data.spots ?? []) {
            if (world.map[spot.tileY]?.[spot.tileX] === undefined) continue;
            world.map[spot.tileY][spot.tileX] = tile;
        }

        // 지형이 바뀌었으니 경로와 렌더 캐시를 무효화해야 합니다.
        // 이것을 빼먹으면 벽은 열렸는데 적이 옛 길로만 다닙니다.
        world.mapRevision++;
    },

    /**
     * 알립니다.
     *
     * 원본은 보이는 경우와 보이지 않는 경우의 문구를 늘 함께 둡니다.
     * 벽이 열리는 것을 못 봤다면 '멀리서 갈리는 소리가 들린다'가 나갑니다.
     * @param {object} trigger - 터진 트리거
     */
    message(trigger) {
        emit(EVENTS.TRIGGER_MESSAGE, {
            text: trigger.data.text,
            unseenText: trigger.data.unseenText ?? trigger.data.text,
            tileX: trigger.tileX,
            tileY: trigger.tileY,
        });
    },

    /**
     * 주변의 잠든 것들을 깨웁니다.
     * @param {object} trigger - 터진 트리거
     */
    rouse(trigger) {
        const radius = (trigger.data.radiusTiles ?? 8) * TILE_SIZE;
        const originX = (trigger.tileX ?? 0) * TILE_SIZE;
        const originY = (trigger.tileY ?? 0) * TILE_SIZE;

        emit(EVENTS.TRIGGER_ROUSE, { x: originX, y: originY, radius });
    },
};

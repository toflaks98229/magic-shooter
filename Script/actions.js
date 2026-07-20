/**
 * @fileoverview 세계 상태를 바꾸는 유일한 통로입니다.
 *
 * 이전에는 `S.player.hp -= damage` 같은 문장이 여러 파일에 흩어져 있어,
 * 무적 판정이나 방어력 같은 규칙을 하나 넣으려면 모든 호출부를 찾아 고쳐야 했습니다.
 * 이제 상태 변경은 전부 이 파일을 거치므로, 규칙은 한 곳에서만 손보면 됩니다.
 * 동시에 각 변경은 이벤트로 알려지므로, 연출·사운드·통계는 이 파일을 몰라도 반응할 수 있습니다.
 */

import * as C from './constants.js';
import { world } from './world.js';
import { runtime, setDynamicLight } from './runtime.js';
import { emit, EVENTS } from './events.js';

// --- 게임 진행 상태 ---------------------------------------------------------

/**
 * 게임 실행 여부를 설정합니다.
 * @param {boolean} isRunning - 실행 중이면 true
 */
export function setGameRunning(isRunning) {
    runtime.isGameRunning = isRunning;
}

/**
 * 현재 층을 설정하고 층 변경을 알립니다.
 * @param {number} floor - 새 층 번호
 */
export function setFloor(floor) {
    world.floor = floor;
    emit(EVENTS.FLOOR_CHANGED, { floor });
}

// --- 플레이어 ---------------------------------------------------------------

/**
 * 플레이어에게 피해를 입힙니다.
 * 사망 판정은 여기서 하지 않습니다. 프레임 중간에 게임이 멈추면 나머지 갱신이
 * 건너뛰어져 상태가 어긋나므로, update()가 프레임 끝에서 한 번만 확인합니다.
 * @param {number} amount - 피해량
 * @param {object} [source] - 피해를 입힌 주체 (적, 발사체 등)
 */
export function damagePlayer(amount, source = null) {
    world.player.hp -= amount;
    emit(EVENTS.PLAYER_DAMAGED, { amount, source, hp: world.player.hp });
}

/**
 * 플레이어의 체력을 회복시킵니다. 최대 체력을 넘지 않습니다.
 * @param {number} amount - 회복량
 */
export function healPlayer(amount) {
    const player = world.player;
    player.hp = Math.min(player.maxHp, player.hp + amount);
    emit(EVENTS.PLAYER_HEALED, { amount, hp: player.hp });
}

/**
 * 탄약을 보충합니다. 최대 소지량을 넘지 않습니다.
 * @param {number} amount - 보충량
 */
export function giveAmmo(amount) {
    const player = world.player;
    player.ammo = Math.min(player.maxAmmo, player.ammo + amount);
}

/**
 * 탄약을 소모합니다.
 * @param {number} amount - 소모량
 */
export function spendAmmo(amount) {
    world.player.ammo -= amount;
}

/**
 * 플레이어의 사망을 확정하고 알립니다.
 */
export function killPlayer() {
    world.player.hp = 0;
    emit(EVENTS.PLAYER_DIED, { floor: world.floor });
}

/**
 * 현재 무기를 교체합니다.
 * @param {string} weapon - 무기 키 ('gun', 'fist')
 */
export function setWeapon(weapon) {
    world.player.weapon = weapon;
}

/**
 * 무기 교체를 요청합니다. 실제 교체는 교체 연출이 끝난 뒤 setWeapon()으로 이뤄집니다.
 * @param {string} nextWeapon - 교체할 무기 키
 */
export function requestWeaponChange(nextWeapon) {
    emit(EVENTS.WEAPON_CHANGED, { from: world.player.weapon, to: nextWeapon });
}

/**
 * 무기를 발사했음을 알립니다.
 * @param {string} weapon - 발사한 무기 키
 */
export function reportWeaponFired(weapon) {
    emit(EVENTS.WEAPON_FIRED, { weapon });
}

/**
 * 무기 정의에 따라 플레이어 위치에 동적 광원을 켭니다. (총구 섬광)
 * @param {object} weaponData - constants.js의 WEAPONS 항목
 */
export function setDynamicLightFromWeapon(weaponData) {
    setDynamicLight({
        active: true,
        x: world.player.x,
        y: world.player.y,
        intensity: weaponData.lightIntensity,
        falloff: weaponData.lightFalloff,
    });
}

// --- 적 ---------------------------------------------------------------------

/**
 * 적에게 피해를 입힙니다.
 * @param {object} enemy - 대상 적
 * @param {number} amount - 피해량
 * @param {number} now - 현재 시각 (피격 연출 타이밍에 사용)
 */
export function damageEnemy(enemy, amount, now) {
    enemy.hp -= amount;
    enemy.lastHitTime = now;
    emit(EVENTS.ENEMY_HIT, { enemy, amount });
}

/**
 * 죽은 적을 배열에서 제거하고, 확률에 따라 아이템을 떨어뜨립니다.
 * @param {number} index - world.enemies에서의 인덱스
 * @returns {object} 제거된 적
 */
export function killEnemyAt(index) {
    const deadEnemy = world.enemies.splice(index, 1)[0];

    if (Math.random() < 0.5) { // 50% 확률로 아이템 드랍
        const itemType = Math.random() < 0.6 ? 'AMMO' : 'HEALTH'; // 탄약 60%, 체력 40%
        world.items.push({
            ...C.ITEM_TYPES[itemType],
            x: deadEnemy.x,
            y: deadEnemy.y,
            z: C.TILE_SIZE / 2,
        });
    }

    emit(EVENTS.ENEMY_DIED, { enemy: deadEnemy });
    return deadEnemy;
}

// --- 아이템 -----------------------------------------------------------------

/**
 * 아이템을 획득 처리하고 배열에서 제거합니다.
 * @param {number} index - world.items에서의 인덱스
 */
export function pickUpItemAt(index) {
    const item = world.items[index];

    if (item.type === 'health') healPlayer(item.amount);
    else if (item.type === 'ammo') giveAmmo(item.amount);

    emit(EVENTS.ITEM_PICKED_UP, { item });
    world.items.splice(index, 1);
}

// --- 월드 오브젝트 ----------------------------------------------------------

/**
 * 문을 엽니다. 애니메이션 상태를 등록하고 즉시 통과 가능하게 만듭니다.
 * @param {number} tileX - 문의 타일 X 좌표
 * @param {number} tileY - 문의 타일 Y 좌표
 */
export function openDoor(tileX, tileY) {
    world.animatedWalls.push({
        mapX: tileX,
        mapY: tileY,
        z: 0,               // 시작 Z 좌표 (바닥 기준)
        wallType: 5,        // 맵에 기록된 문 타일 ID
        startTime: world.time,
        duration: 500,      // 0.5초 동안 애니메이션
    });

    // 오브젝트를 제거해 충돌을 없애고 통과 가능하게 만듭니다.
    world.objectMap[tileY][tileX] = 0;
    world.mapRevision++; // 통행 가능 여부가 바뀌었으므로 경로 캐시를 무효화합니다.

    emit(EVENTS.DOOR_OPENED, { tileX, tileY });
}

/**
 * 플레이어가 출구에 도달했음을 알립니다.
 */
export function reachExit() {
    emit(EVENTS.EXIT_REACHED, { floor: world.floor });
}

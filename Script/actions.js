/**
 * @fileoverview 세계 상태를 바꾸는 유일한 통로입니다.
 *
 * 이전에는 `S.player.hp -= damage` 같은 문장이 여러 파일에 흩어져 있어,
 * 무적 판정이나 방어력 같은 규칙을 하나 넣으려면 모든 호출부를 찾아 고쳐야 했습니다.
 * 이제 상태 변경은 전부 이 파일을 거치므로, 규칙은 한 곳에서만 손보면 됩니다.
 * 동시에 각 변경은 이벤트로 알려지므로, 연출·사운드·통계는 이 파일을 몰라도 반응할 수 있습니다.
 */

import * as C from './constants.js';
import { world, createWorld, setWorld } from './world.js';
import { getBranch, childBranchesOf, absoluteDepth, rollBranchSelection } from './branches.js';
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

// --- 던전 가지 이동 ---------------------------------------------------------

/**
 * @description 던전을 옮겨 다녀도 따라다니는 항목들.
 * 서브 던전에서 다치고 나왔는데 멀쩡해지면 안 되므로 복원 대상이 아닙니다.
 */
const CARRIED_FORWARD = ['runes', 'time', 'branchEntrances'];

/**
 * @description 플레이어 상태 중 '어디에 서 있는가'에 해당하는 항목.
 * 체력이나 탄약과 달리 이 값들은 던전마다 다르므로, 복귀할 때는 떠났던 자리로 되돌립니다.
 */
const PLAYER_POSITION_FIELDS = ['x', 'y', 'angle'];

/**
 * 현재 세계를 스택에 넣을 수 있는 형태로 만듭니다.
 * parentStack 자신은 제외해, 스택이 중첩되지 않고 평평하게 유지되도록 합니다.
 * @returns {object} 보관용 월드 스냅샷
 */
function snapshotForStack() {
    const { parentStack, ...rest } = world;
    return structuredClone(rest);
}

/**
 * 하위 던전으로 들어갑니다. 지금 세계는 스택에 보관되고, 새 세계가 시작됩니다.
 * @param {string} branchId - 들어갈 가지의 식별 기호
 * @returns {boolean} 실제로 진입했으면 true
 */
export function enterBranch(branchId) {
    const branch = getBranch(branchId);
    if (branch.id === world.branch) return false; // 이미 그 가지에 있음

    const stack = [...world.parentStack, snapshotForStack()];

    const next = createWorld();
    // 진행도와 플레이어 상태는 그대로 따라 들어갑니다.
    // 위치는 새 던전의 시작 지점으로 다시 잡히므로 여기서는 신경 쓰지 않습니다.
    for (const key of CARRIED_FORWARD) next[key] = structuredClone(world[key]);
    next.player = structuredClone(world.player);
    next.branch = branch.id;
    next.floor = 1;
    next.parentStack = stack;

    setWorld(next);
    emit(EVENTS.BRANCH_ENTERED, { branch: branch.id, name: branch.name, depth: stack.length });
    return true;
}

/**
 * 상위 던전으로 되돌아갑니다. 들어갈 때의 지형과 적이 그대로 복원되고,
 * 플레이어 상태와 획득한 룬은 서브 던전에서 나온 상태를 유지합니다.
 * @returns {boolean} 실제로 복귀했으면 true
 */
export function returnToParent() {
    if (world.parentStack.length === 0) return false; // 최상위 던전

    const stack = [...world.parentStack];
    const restored = stack.pop();

    // 서브 던전에서 얻은 것들을 복원된 세계로 옮겨 담습니다.
    for (const key of CARRIED_FORWARD) restored[key] = structuredClone(world[key]);

    // 체력·탄약·무기는 서브 던전에서 나온 상태 그대로,
    // 서 있는 위치는 서브 던전에 들어가기 직전 자리로 되돌립니다.
    const entrancePosition = {};
    for (const key of PLAYER_POSITION_FIELDS) entrancePosition[key] = restored.player[key];
    restored.player = { ...structuredClone(world.player), ...entrancePosition };

    restored.parentStack = stack;

    const leftBranch = world.branch;
    setWorld(restored);
    emit(EVENTS.BRANCH_LEFT, { from: leftBranch, to: restored.branch, depth: stack.length });
    return true;
}

/**
 * 현재 층에 놓을 하위 가지 입구 목록을 결정합니다.
 * 어느 층에 어떤 입구가 나올지는 게임 시작 시 한 번 정해져 world.branchEntrances에 남습니다.
 * @returns {string[]} 이 층에 놓아야 할 가지 식별 기호들
 */
export function branchEntrancesForCurrentFloor() {
    return childBranchesOf(world.branch)
        .filter(child => world.branchEntrances[child.id] === world.floor)
        .map(child => child.id);
}

/**
 * 각 하위 가지의 입구가 상위 가지의 몇 층에 놓일지 한 번에 뽑습니다.
 * 새 게임을 시작할 때 호출합니다.
 */
export function rollBranchEntrances() {
    const entrances = {};
    // 배타 그룹(늪지/해안 등)은 여기서 하나만 골라지므로, 고르지 못한 가지는
    // branchEntrances에 아예 들어가지 않아 이번 판에는 입구가 생기지 않습니다.
    for (const branch of rollBranchSelection()) {
        if (!branch.parent) continue;
        const span = branch.entryTo - branch.entryFrom;
        entrances[branch.id] = branch.entryFrom + Math.floor(Math.random() * (span + 1));
    }
    world.branchEntrances = entrances;
}

/**
 * 룬을 획득합니다.
 * @param {string} branchId - 룬이 나온 가지의 식별 기호
 */
export function collectRune(branchId) {
    if (world.runes.includes(branchId)) return;
    world.runes.push(branchId);
    emit(EVENTS.RUNE_COLLECTED, { branch: branchId, total: world.runes.length });
}

/**
 * 현재 위치의 누적 깊이를 반환합니다. 난이도 계산에 씁니다.
 * @returns {number} 게임 시작 지점으로부터의 깊이
 */
export function currentDangerLevel() {
    return absoluteDepth(world.branch, world.floor);
}

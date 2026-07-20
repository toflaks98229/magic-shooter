/**
 * @fileoverview 세계 상태를 바꾸는 유일한 통로입니다.
 *
 * 이전에는 `S.player.hp -= damage` 같은 문장이 여러 파일에 흩어져 있어,
 * 무적 판정이나 방어력 같은 규칙을 하나 넣으려면 모든 호출부를 찾아 고쳐야 했습니다.
 * 이제 상태 변경은 전부 이 파일을 거치므로, 규칙은 한 곳에서만 손보면 됩니다.
 * 동시에 각 변경은 이벤트로 알려지므로, 연출·사운드·통계는 이 파일을 몰라도 반응할 수 있습니다.
 */

import * as C from './constants.js';
import { world, createWorld, setWorld, FLOOR_SCOPED_COLLECTIONS } from './world.js';
import { getBranch, childBranchesOf, absoluteDepth, rollBranchSelection } from './branches.js';
import { rollPortalForFloor } from './portals.js';
import { getItem, rollItem, DROP_CHANCE, BUFF_MODIFIERS } from './items.js';
import { addToInventory, takeFromInventory } from './inventory.js';
import { runtime, setDynamicLight } from './runtime.js';
import { emit, EVENTS } from './events.js';
import { modifier, invalidateCharacter, isForbidden } from './character.js';
import { GODS, MAX_PIETY, pietyRank, startingPiety, canWorship } from './gods.js';
import { SPECIES } from './species.js';

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

/**
 * 갓 만들어진 층을 세계에 앉힙니다. 지형을 갈아 끼우고, 층에 매인 것들을 모두 비우고,
 * 플레이어를 시작 지점에 세웁니다.
 *
 * 비울 대상을 여기에 손으로 늘어놓지 않고 world.js의 FLOOR_SCOPED_COLLECTIONS를 읽는 것이
 * 핵심입니다. 새 컬렉션을 추가할 때 이 함수를 고치는 것을 잊어도, 목록에 분류해 넣기만 하면
 * 자동으로 비워집니다. 분류를 잊으면 world.test.js가 먼저 알려줍니다.
 * @param {{map: number[][], objectMap: number[][], playerStart: {x: number, y: number}}} dungeon - 새로 만들어진 층
 */
export function beginFloor(dungeon) {
    world.map = dungeon.map;
    world.objectMap = dungeon.objectMap;
    // 지형이 통째로 바뀌었으므로 경로 캐시와 렌더 캐시를 무효화합니다.
    world.mapRevision++;

    for (const key of FLOOR_SCOPED_COLLECTIONS) world[key].length = 0;

    world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
    world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;
}

/**
 * 이번 층에 쓸 테마를 기록합니다. 텍스처 자체가 아니라 이름만 담아 world를 직렬화 가능하게 둡니다.
 * @param {string|null} themeName - 테마 이름
 * @param {number|string|null} themeVariation - 변형 번호
 */
export function setFloorTheme(themeName, themeVariation) {
    world.themeName = themeName;
    world.themeVariation = themeVariation;
}

/**
 * 하위 가지로 내려가는 입구를 놓습니다.
 * @param {string} branchId - 이어질 가지의 식별 기호
 * @param {number} tileX - 놓을 타일 X 좌표
 * @param {number} tileY - 놓을 타일 Y 좌표
 */
export function placeBranchEntrance(branchId, tileX, tileY) {
    world.map[tileY][tileX] = C.TILE_IDS.BRANCH_ENTRANCE;
    world.entrances.push({ tileX, tileY, branch: branchId });
}

/**
 * 제단을 놓습니다.
 * @param {string} godId - 제단의 주인이 될 신의 식별 기호
 * @param {number} tileX - 놓을 타일 X 좌표
 * @param {number} tileY - 놓을 타일 Y 좌표
 */
export function placeAltar(godId, tileX, tileY) {
    world.map[tileY][tileX] = C.TILE_IDS.ALTAR;
    world.altars.push({ tileX, tileY, god: godId });
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
    // 보호 효과가 걸려 있으면 받는 피해가 줄어듭니다.
    // 물약의 보호 효과와 종족·신의 가호가 함께 반영됩니다.
    const taken = Math.max(1, Math.round(amount * buffModifier('damageTaken', 1) * modifier('damageTaken')));

    world.player.hp -= taken;
    emit(EVENTS.PLAYER_DAMAGED, { amount: taken, source, hp: world.player.hp });
}

/**
 * 현재 걸려 있는 지속 효과들의 배율을 곱해서 돌려줍니다.
 * @param {string} field - BUFF_MODIFIERS 의 항목 이름
 * @param {number} base - 아무 효과도 없을 때의 값
 * @returns {number} 적용된 배율
 */
export function buffModifier(field, base = 1) {
    let value = base;
    for (const buff of world.buffs) {
        const modifier = BUFF_MODIFIERS[buff.effect]?.[field];
        if (modifier !== undefined) value *= modifier;
    }
    return value;
}

/**
 * 특정 지속 효과가 걸려 있는지 확인합니다.
 * @param {string} effect - 효과 이름
 * @returns {boolean} 걸려 있으면 true
 */
export function hasBuff(effect) {
    return world.buffs.some(buff => buff.effect === effect);
}

/**
 * 지속 효과를 겁니다. 같은 효과가 이미 있으면 시간을 새로 채웁니다.
 * @param {string} effect - 효과 이름
 * @param {number} durationMs - 지속 시간
 */
export function applyBuff(effect, durationMs) {
    const expiresAt = world.time + durationMs;
    const existing = world.buffs.find(buff => buff.effect === effect);

    if (existing) existing.expiresAt = Math.max(existing.expiresAt, expiresAt);
    else world.buffs.push({ effect, expiresAt });

    emit(EVENTS.BUFF_APPLIED, { effect, durationMs });
}

/**
 * 시간이 다 된 지속 효과를 걷어냅니다. 매 프레임 확인합니다.
 */
export function expireBuffs() {
    for (let i = world.buffs.length - 1; i >= 0; i--) {
        if (world.time < world.buffs[i].expiresAt) continue;

        const [expired] = world.buffs.splice(i, 1);
        emit(EVENTS.BUFF_EXPIRED, { effect: expired.effect });
    }
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

    // 깊이에 맞는 아이템이 확률적으로 떨어집니다. 놀이나 고자그는 더 자주 떨어뜨립니다.
    if (Math.random() < DROP_CHANCE * modifier('itemDropRate')) {
        const itemId = rollItem(currentDangerLevel());
        if (itemId) dropItem(itemId, deadEnemy.x, deadEnemy.y);
    }

    // 마클렙은 죽일 때마다 체력을, 베후멧은 마력을 돌려줍니다.
    const hpOnKill = modifier('hpOnKill');
    if (hpOnKill > 0) healPlayer(hpOnKill);
    const mpOnKill = modifier('mpOnKill');
    if (mpOnKill > 0) giveAmmo(mpOnKill);

    gainPietyFromKill(deadEnemy);

    emit(EVENTS.ENEMY_DIED, { enemy: deadEnemy });
    return deadEnemy;
}

// --- 신앙 -------------------------------------------------------------------

/**
 * 적을 처치했을 때 신앙심을 올립니다.
 *
 * 원본에서 신마다 신앙심의 원천이 다릅니다. 처치로는 아무것도 얻지 못하는 신도 여럿입니다.
 * (엘리빌론과 네멜렉스는 탐험으로만, 우스카야우는 피해를 입힐 때만 오릅니다)
 * @param {object} enemy - 쓰러진 적
 */
function gainPietyFromKill(enemy) {
    const god = GODS[world.player.god];
    if (!god) return;

    if (god.piety === 'kill') {
        gainPiety(2);
    } else if (god.piety === 'killTough') {
        // 오카와루는 버거운 상대일수록 기뻐합니다. 약한 것을 잡아서는 거의 오르지 않습니다.
        gainPiety(Math.max(1, Math.round((enemy?.maxHp ?? 10) / 25)));
    }
}

/**
 * 층을 내려갔을 때 신앙심을 올립니다. 탐험으로 신앙심을 얻는 신들을 위한 것입니다.
 */
export function gainPietyFromExploration() {
    if (GODS[world.player.god]?.piety === 'explore') gainPiety(8);
}

/**
 * 적에게 피해를 입혔을 때 신앙심을 올립니다. 우스카야우만 여기서 얻습니다.
 * @param {number} amount - 입힌 피해
 */
export function gainPietyFromDamage(amount) {
    if (GODS[world.player.god]?.piety === 'damage') gainPiety(amount / 20);
}

/**
 * 신앙심을 올립니다. 최대치는 원본과 같은 200 입니다.
 * @param {number} amount - 올릴 양
 */
export function gainPiety(amount) {
    const god = GODS[world.player.god];
    if (!god || god.pietyOnlyDecreases) return;   // 이그니스의 신앙심은 줄기만 합니다.

    const before = pietyRank(world.player.piety);
    world.player.piety = Math.min(MAX_PIETY, world.player.piety + amount);
    const after = pietyRank(world.player.piety);

    if (after > before) emit(EVENTS.PIETY_RANK_CHANGED, { god: world.player.god, rank: after });
}

/**
 * 신앙심을 깎습니다. 금기를 어겼을 때 부릅니다.
 * @param {number} amount - 깎을 양
 */
export function losePiety(amount) {
    if (!world.player.god) return;
    world.player.piety = Math.max(0, world.player.piety - amount);
}

/**
 * 제단 앞에서 개종합니다.
 *
 * 이미 그 신을 섬기고 있으면 아무 일도 없고, 다른 신을 섬기던 중이면 갈아탑니다.
 * 원본에는 배신에 대한 벌(파문)이 있지만 여기서는 신앙심만 처음으로 돌아갑니다.
 * @param {string} godId - 제단의 신
 * @returns {{ok: boolean, reason: string}} 성공 여부
 */
export function worshipAtAltar(godId) {
    if (world.player.god === godId) {
        return { ok: false, reason: `이미 ${GODS[godId].name}을(를) 섬기고 있습니다` };
    }
    const result = worship(godId);
    if (!result.ok) emit(EVENTS.WORSHIP_REFUSED, { god: godId, reason: result.reason });
    return result;
}

/**
 * 신을 섬기기 시작합니다.
 *
 * 종족이 거부당하는 신이면 개종하지 않습니다. (언데드는 선한 신을 섬길 수 없습니다)
 * @param {string} godId - 신 키
 * @returns {{ok: boolean, reason: string}} 성공 여부
 */
export function worship(godId) {
    const check = canWorship(godId, SPECIES[world.player.species]);
    if (!check.allowed) return { ok: false, reason: check.reason };

    world.player.god = godId;
    world.player.piety = startingPiety(godId);
    invalidateCharacter();

    // 트로그를 섬기면 마법을 쓸 수 없게 되므로 지팡이를 내려놓습니다.
    if (isForbidden('magic')) {
        world.player.weapon = 'fist';
        world.player.ammo = 0;
        world.player.maxAmmo = 0;
    }

    emit(EVENTS.GOD_CHANGED, { god: godId, name: GODS[godId].name });
    return { ok: true, reason: '' };
}

// --- 아이템 -----------------------------------------------------------------

/**
 * 아이템을 획득 처리하고 배열에서 제거합니다.
 * @param {number} index - world.items에서의 인덱스
 */
export function pickUpItemAt(index) {
    const item = world.items[index];
    const definition = getItem(item.itemId);

    // 소지품이 가득 차면 줍지 않고 바닥에 그대로 둡니다.
    // 조용히 사라지면 무엇을 놓쳤는지 알 수 없습니다.
    if (!addToInventory(world.inventory, item.itemId)) {
        emit(EVENTS.INVENTORY_FULL, { item, definition });
        return false;
    }

    emit(EVENTS.ITEM_PICKED_UP, { item, definition });
    world.items.splice(index, 1);
    return true;
}

/**
 * 소지품의 한 칸을 사용합니다.
 * @param {number} index - 칸 번호
 * @returns {boolean} 실제로 썼으면 true
 */
export function useInventorySlot(index) {
    const slot = world.inventory[index];
    if (!slot) return false;

    const definition = getItem(slot.itemId);
    if (!definition) return false;

    takeFromInventory(world.inventory, index);
    applyItemEffect(definition);
    emit(EVENTS.ITEM_USED, { itemId: slot.itemId, definition });
    return true;
}

/**
 * @description 아이템 효과별 처리. items.js 의 effect 값이 이 표의 키와 일치해야 합니다.
 * 지속 효과는 여기서 시간을 걸어두고, 실제 영향은 buffModifier 를 읽는 쪽이 반영합니다.
 */
const ITEM_EFFECTS = {
    heal: (item) => healPlayer(item.amount),
    restoreAmmo: (item) => giveAmmo(item.amount),

    // 최대치를 올리면서 그만큼 채워줍니다. 올려놓고 비어 있으면 보상 같지 않습니다.
    maxHp: (item) => {
        world.player.maxHp += item.amount;
        world.player.hp += item.amount;
    },
    maxAmmo: (item) => {
        world.player.maxAmmo += item.amount;
        world.player.ammo = Math.min(world.player.maxAmmo, world.player.ammo + item.amount);
    },
};

/**
 * 아이템의 효과를 적용합니다.
 * @param {object} definition - items.js 의 아이템 정의
 */
function applyItemEffect(definition) {
    const apply = ITEM_EFFECTS[definition.effect];

    if (apply) apply(definition);
    else if (definition.durationMs) applyBuff(definition.effect, definition.durationMs);
    else console.warn(`알 수 없는 아이템 효과: ${definition.effect}`);
}

/**
 * 지정한 아이템을 바닥에 떨어뜨립니다.
 * @param {string} itemId - items.js 의 아이템 id
 * @param {number} x - 월드 X 좌표
 * @param {number} y - 월드 Y 좌표
 */
export function dropItem(itemId, x, y) {
    const definition = getItem(itemId);
    if (!definition) return;

    world.items.push({
        itemId,
        name: definition.name,
        spriteKey: definition.spriteKey,
        color: definition.color,
        size: definition.size,
        x, y, z: C.TILE_SIZE / 2,
    });
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
const CARRIED_FORWARD = ['runes', 'time', 'branchEntrances', 'portalsUsed', 'buffs', 'inventory'];

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
    // 포탈은 위치가 고정되어 있지 않으므로 들어온 깊이를 기억해 둡니다.
    next.portalDangerLevel = branch.isPortal ? currentDangerLevel() : null;

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

// --- 포탈 던전 --------------------------------------------------------------

/**
 * 이번 층에 포탈이 열릴지 굴리고, 열린다면 그 정보를 반환합니다.
 * 실제로 맵의 어디에 놓을지는 호출한 쪽이 정합니다.
 * @returns {object|null} 열린 포탈의 정의, 없으면 null
 */
export function rollPortalForCurrentFloor() {
    return rollPortalForFloor(currentDangerLevel(), world.portalsUsed);
}

/**
 * 포탈을 현재 층에 놓고 등록합니다.
 *
 * 타일을 칠하는 일까지 여기서 합니다. 닫힐 때 타일을 되돌리는 removePortalTile()이
 * 이미 이 파일에 있으므로, 놓는 쪽만 호출부에 흩어져 있으면 짝이 맞지 않습니다.
 * @param {object} portal - portals.js의 던전 정의
 * @param {number} tileX - 놓인 타일 X 좌표
 * @param {number} tileY - 놓인 타일 Y 좌표
 */
export function openPortal(portal, tileX, tileY) {
    world.map[tileY][tileX] = C.TILE_IDS.PORTAL;
    world.portals.push({
        id: portal.id, tileX, tileY,
        expiresAt: world.time + portal.lifetimeMs,
    });
    world.portalsUsed[portal.id] = (world.portalsUsed[portal.id] || 0) + 1;

    emit(EVENTS.PORTAL_APPEARED, {
        id: portal.id, name: portal.name, flavour: portal.flavour,
        closesInMs: portal.lifetimeMs,
    });
}

/**
 * 시간이 다 된 포탈을 닫습니다. 매 프레임 확인합니다.
 * 닫힌 자리는 평범한 바닥이 되어 다시는 들어갈 수 없습니다.
 */
export function closeExpiredPortals() {
    for (let i = world.portals.length - 1; i >= 0; i--) {
        const portal = world.portals[i];
        if (world.time < portal.expiresAt) continue;

        removePortalTile(portal);
        world.portals.splice(i, 1);
        emit(EVENTS.PORTAL_CLOSED, { id: portal.id, name: getBranch(portal.id).name });
    }
}

/**
 * 포탈 타일을 바닥으로 되돌립니다.
 * @param {{tileX: number, tileY: number}} portal - 대상 포탈
 */
function removePortalTile(portal) {
    const row = world.map[portal.tileY];
    if (!row || row[portal.tileX] !== C.TILE_IDS.PORTAL) return;

    row[portal.tileX] = C.TILE_IDS.FLOOR;
    world.mapRevision++; // 통행 가능 여부가 바뀌었으므로 경로 캐시를 무효화합니다.
}

/**
 * 포탈로 들어갑니다.
 *
 * 들어가는 순간 포탈은 닫힙니다. 그래야 나왔을 때 같은 곳을 다시 들어갈 수 없고,
 * 되돌아온 층에도 쓸모없는 입구가 남지 않습니다.
 * @param {string} portalId - 들어갈 포탈 던전의 식별자
 * @returns {boolean} 실제로 진입했으면 true
 */
export function enterPortal(portalId) {
    const index = world.portals.findIndex(p => p.id === portalId);
    if (index < 0) return false;

    removePortalTile(world.portals[index]);
    world.portals.splice(index, 1);

    return enterBranch(portalId);
}

/**
 * 현재 위치의 누적 깊이를 반환합니다. 난이도 계산에 씁니다.
 * @returns {number} 게임 시작 지점으로부터의 깊이
 */
export function currentDangerLevel() {
    // 포탈 던전은 들어온 깊이를 기준으로 삼습니다.
    if (world.portalDangerLevel !== null) {
        return world.portalDangerLevel + world.floor - 1;
    }
    return absoluteDepth(world.branch, world.floor);
}

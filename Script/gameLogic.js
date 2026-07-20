/**
 * @fileoverview 게임의 핵심 로직을 담당합니다. 상태 업데이트, 충돌 처리, AI 등을 포함합니다.
 *
 * 이 파일은 이제 화면이나 사운드를 알지 못합니다.
 * 상태 변경은 actions.js를 통하고, 그 결과로 발행되는 이벤트에 ui.js와 audio.js가
 * 스스로 반응합니다. 덕분에 이 파일은 브라우저 없이도 실행·테스트할 수 있습니다.
 */

// --- 모듈 임포트 ---
import * as C from './constants.js';
import * as A from './actions.js';
import { world } from './world.js';
import { runtime } from './runtime.js';
import { assets } from './assets.js';
import { getBranch } from './branches.js';
import { getMonster, rollMonsterFor, allMonsters } from './monsters.js';
import { ROLL_FOR_DEPTH, ROLL_FOR_DEPTH_TOUGH, ROLL_FOR_DEPTH_TOUGHER } from './vaults.js';
import { SPECIES } from './species.js';
import { getPlayerMovement, drainActionQueue, consumePendingLook, INPUT_ACTIONS } from './input.js';
import { modifier as characterModifier, aptitudeFor } from './character.js';
import { emit, EVENTS } from './events.js';
import { aimRadius, rollMonsterHp, monsterAttackRoll, playerEvasion, archerBonusDamage } from './dcss/combat.js';
import { pickAimedTarget } from './dcss/aim.js';
import { skillValue } from './dcss/training.js';
import { random2, randomRange, rollDice } from './dcss/random.js';
import { checkPositionTriggers, checkSightTriggers, checkDeathTriggers } from './triggers.js';
import { autToMs } from './dcss/time.js';
import { trackingRangeTiles, rollFoeMemoryMs, shoutRadiusTiles, canShout } from './dcss/awareness.js';
import {
    SPELL_EFFECTS, pickSpellSlot, pickEmergencySpell,
    rollSpellDamage, rollBreathCooldownMs, projectileSpeedFor,
} from './dcss/spells.js';

// --- 게임 생명주기 함수 (Unity의 Update와 유사) ---

/**
 * 매 프레임마다 호출되어 게임의 모든 동적 상태를 업데이트합니다.
 * @param {number} deltaTime - 이전 프레임과의 시간 간격 (밀리초)
 */
export function update(deltaTime) {
    if (!runtime.isGameRunning) return; // 게임이 실행 중이 아니면 아무 작업도 하지 않음

    // 게임 내부 시간을 먼저 전진시킵니다. 이후의 모든 쿨다운·애니메이션은 이 값을 기준으로 합니다.
    world.time += deltaTime;

    const now = world.time;
    const dtFactor = deltaTime / C.REFERENCE_FRAME_MS; // 속도 상수의 기준 프레임 대비 배율

    // 0. 프레임 경계에서 입력을 한꺼번에 반영합니다.
    //    이렇게 해야 플레이어 상태가 시뮬레이션 스텝 안에서만 변합니다.
    processQueuedInput();

    // 동적 광원 효과를 서서히 감소시킵니다.
    if (runtime.dynamicLight.active) {
        runtime.dynamicLight.intensity -= 0.1 * dtFactor;
        if (runtime.dynamicLight.intensity <= 0) {
            runtime.dynamicLight.active = false;
        }
    }

    // 1. 플레이어 이동 및 파티클 처리
    handlePlayerMovement(dtFactor);
    updateParticles(dtFactor);
    updateAnimatedWalls(now); // 애니메이션 벽(열리는 문) 상태 업데이트
    A.closeExpiredPortals();  // 시간이 다 된 포탈 닫기
    A.expireBuffs();          // 시간이 다 된 지속 효과 해제

    // 2. 무기 자동 전환 (탄약이 없으면 주먹으로)
    //    교체 연출이 진행 중일 때는 요청하지 않습니다. 실제 무기 변경은
    //    연출이 끝나는 시점에 ui.js가 actions.setWeapon()으로 확정합니다.
    const newWeapon = world.player.ammo > 0 ? 'gun' : 'fist';
    if (newWeapon !== world.player.weapon && !runtime.isSwappingWeapon) {
        A.requestWeaponChange(newWeapon);
    }

    // 3. 적 AI 및 로직 처리
    updateEnemies(now, dtFactor);

    // 4. 발사체 이동 및 충돌 처리
    updateProjectiles(dtFactor);

    // 5. 층에 걸린 기믹 확인
    //
    // 타일이 바뀌었을 때만 봅니다. 매 프레임 보면 한 타일 안에서 서성이는
    // 동안 같은 기믹이 초당 예순 번 터집니다. 원본에서 밟기는 턴마다 한 번인데,
    // 실시간에서는 경계를 계속 넘나들기 때문입니다.
    updateTriggers();

    // 6. 아이템 획득 처리
    handleItemPickup();

    // 7. 적 사망 처리 및 아이템 드랍
    handleEnemyDeaths();

    // 8. 플레이어 사망 확인
    //    피해를 입은 즉시가 아니라 프레임 끝에서 한 번만 확인합니다.
    //    중간에 게임을 멈추면 나머지 갱신이 건너뛰어져 상태가 어긋나기 때문입니다.
    if (world.player.hp <= 0) {
        A.killPlayer();
    }
}

// --- 외부 공개 함수 (Public Methods) ---

/**
 * 층에 걸린 기믹을 살핍니다.
 *
 * 플레이어가 선 타일이 바뀌었을 때만 일합니다. 매 프레임 보면 한 타일 안에서
 * 서성이는 동안 같은 기믹이 초당 예순 번 터집니다. 원본에서 밟기는 턴마다
 * 한 번인데 실시간에서는 경계를 계속 넘나들기 때문입니다.
 */
function updateTriggers() {
    const tileX = Math.floor(world.player.x / C.TILE_SIZE);
    const tileY = Math.floor(world.player.y / C.TILE_SIZE);

    if (tileX === lastPlayerTile.x && tileY === lastPlayerTile.y) return;
    lastPlayerTile = { x: tileX, y: tileY };

    checkPositionTriggers(tileX, tileY);
    checkSightTriggers((tx, ty) => hasLineOfSight(
        world.player.x, world.player.y,
        tx * C.TILE_SIZE + C.TILE_SIZE / 2, ty * C.TILE_SIZE + C.TILE_SIZE / 2,
    ));
}

/** @description 지난 스텝에 플레이어가 서 있던 타일. 경계를 넘었는지 보려고 기억합니다. */
let lastPlayerTile = { x: -1, y: -1 };

/**
 * 프레임 사이에 쌓인 입력을 시뮬레이션에 반영합니다.
 * 시점 회전을 먼저 적용해, 같은 프레임에 들어온 공격이 회전 이후의 방향을 기준으로 판정되게 합니다.
 */
function processQueuedInput() {
    const lookDelta = consumePendingLook();
    if (lookDelta !== 0) world.player.angle += lookDelta;

    drainActionQueue(action => {
        // 소지품 사용은 어느 칸인지가 함께 필요해 객체로 들어옵니다.
        if (typeof action === 'object') {
            if (action.type === 'useSlot') A.useInventorySlot(action.slotIndex);
            return;
        }

        if (action === INPUT_ACTIONS.ATTACK) attack();
        else if (action === INPUT_ACTIONS.INTERACT) interactWithWorld();
        else if (action === INPUT_ACTIONS.TOGGLE_INVENTORY) runtime.isInventoryOpen = !runtime.isInventoryOpen;
        // 저장은 시뮬레이션이 할 일이 아니므로 '요청이 있었다'는 사실만 알립니다.
        // 큐를 통해 들어오므로 프레임 한가운데가 아니라 스텝 경계에서만 발행됩니다.
        else if (action === INPUT_ACTIONS.SAVE_AND_QUIT) emit(EVENTS.SAVE_REQUESTED);
    });
}

/**
 * 플레이어의 공격 로직을 처리합니다. 현재 무기에 따라 다른 행동을 합니다.
 */
export function attack() {
    const now = world.time;
    const player = world.player;
    const weaponData = C.WEAPONS[player.weapon];
    // 공격 쿨다운이거나 무기 교체 중이면 공격할 수 없습니다.
    if (now - player.lastAttackTime < weaponData.cooldown || runtime.isSwappingWeapon) return;

    player.lastAttackTime = now;

    if (player.weapon === 'gun') {
        if (player.ammo <= 0) return; // 탄약이 없으면 발사 불가
        A.spendAmmo(1);
        // 발사 사실만 알립니다. 발사음과 총구 섬광은 audio.js/ui.js가 알아서 처리합니다.
        A.reportWeaponFired(player.weapon);

        // 발사 시 주변을 밝히는 동적 광원
        A.setDynamicLightFromWeapon(weaponData);

        const hit = aimAtEnemies(player);
        if (hit) {
            A.damageEnemy(hit.target, playerDamage(weaponData.damage), now);
            // 맞았을 때만 훈련합니다. 허공에 쏘면서 스킬이 오르면
            // 벽을 보고 난사하는 것이 최선의 성장법이 됩니다.
            A.practise('fighting');
            A.practise(weaponSkillOf(player.weapon));
        }

    } else if (player.weapon === 'fist') {
        // 주먹 휘두르기 연출은 ui.js가 WEAPON_FIRED를 받아 처리합니다.
        A.reportWeaponFired(player.weapon);

        // 주먹은 사거리가 짧을 뿐, 겨누는 방식은 총과 같습니다.
        const hit = aimAtEnemies(player, weaponData.range);
        if (hit) {
            A.damageEnemy(hit.target, playerDamage(weaponData.damage), now);
            A.practise('fighting');
            A.practise(weaponSkillOf(player.weapon));
        }
    }
}

/**
 * 겨눈 선에 걸리는 적 중 가장 가까운 것을 찾습니다.
 *
 * 예전에는 각도 허용치로 봐줬습니다. 총은 시야각의 1/8, 주먹은 1/4 안에만 들어오면
 * 가장 가까운 적이 맞는 방식이라, 화면 구석의 적이 정면의 적보다 먼저 맞기도 했습니다.
 * 그 보정을 걷어냈습니다. 이제 실제로 겨눈 선이 몸을 지나야 맞습니다.
 *
 * 회피는 버리지 않고 과녁 크기로 옮겼습니다. EV 가 높은 몬스터는 aimRadius 가
 * 과녁을 줄이므로 더 정확히 겨눠야 합니다. 주사위로 피하던 것을
 * '작아서 맞추기 어려운 것'으로 바꾼 셈입니다.
 * @param {object} player - 플레이어
 * @param {number} [maxRange] - 사거리. 없으면 시야가 닿는 데까지입니다
 * @returns {{target: object, distance: number}|null} 맞은 적
 */
function aimAtEnemies(player, maxRange = Infinity) {
    const toLand = playerToHit();

    return pickAimedTarget(
        player,
        world.enemies,
        enemy => aimRadius(enemy.size / 2, toLand, enemy.ev ?? 0),
        (enemy, forward) => forward <= maxRange
            && hasLineOfSight(player.x, player.y, enemy.x, enemy.y),
    );
}

/**
 * 알아챈 뒤에 어떻게 움직일지 정합니다.
 *
 * 성향은 원본의 깃발에서 옵니다. 거리를 두는 적과 정신없이 나는 적은
 * 처음부터 그렇게 움직여야, 쫓아와 때리는 적과 섞였을 때 차이가 읽힙니다.
 * @param {object} template - 몬스터 정의
 * @returns {string} 사냥을 시작할 때의 상태
 */
function initialState(template) {
    if (template.maintainRange) return 'kite';
    if (template.batty) return 'erratic';
    return 'chase';
}

/**
 * 이 몬스터가 지금 플레이어를 알아보는지 봅니다.
 *
 * 얼마나 멀리서 알아보는지는 지능이 정합니다. (mon-pathfind.cc:35)
 * 벽 너머는 보지 못하므로 시야도 함께 확인합니다.
 * @param {object} enemy - 몬스터
 * @param {number} distance - 플레이어까지의 거리(픽셀)
 * @returns {boolean} 알아보면 true
 */
function noticesPlayer(enemy, distance) {
    const range = trackingRangeTiles(enemy.intelligence) * C.TILE_SIZE;
    if (distance > range) return false;
    return hasLineOfSight(enemy.x, enemy.y, world.player.x, world.player.y);
}

/**
 * 사냥을 시작하거나, 이미 쫓고 있었다면 기억을 새로 채웁니다.
 *
 * 기억하는 시간은 지능이 정합니다. 사람만큼 영리한 것은 한참을 뒤지고 다니지만
 * 머리가 없는 것은 곧 잊습니다. 이 차이가 '따돌릴 수 있는가'를 만듭니다.
 * @param {object} enemy - 몬스터
 * @param {number} now - 게임 내부 시각
 */
function rousePlayerHunt(enemy, now) {
    enemy.huntUntil = now + rollFoeMemoryMs(enemy.intelligence);
}

/**
 * 우는 소리로 주변의 잠든 몬스터를 깨웁니다. (shout.cc:237)
 *
 * '옆방을 깨웠는가'는 실시간에서 일급 판단이 됩니다. 조용한 적을 하나씩 처리할지,
 * 시끄러운 적을 먼저 끊을지가 달라지기 때문입니다.
 * 반경은 원본이 소리 종류마다 정해 둔 값을 그대로 씁니다.
 * @param {object} shouter - 운 몬스터
 * @param {number} now - 게임 내부 시각
 */
function alertNeighbours(shouter, now) {
    if (!canShout(shouter)) return;

    const radius = shoutRadiusTiles(shouter.shout) * C.TILE_SIZE;
    if (radius <= 0) return;

    for (const other of world.enemies) {
        if (other === shouter || other.state !== 'idle') continue;
        if (Math.hypot(other.x - shouter.x, other.y - shouter.y) > radius) continue;

        // 소리는 벽을 넘어갑니다. 시야를 확인하지 않는 것이 요점입니다.
        rousePlayerHunt(other, now);
        other.state = initialState(other);
    }
}

/**
 * 정신없이 나는 적의 방향을 새로 뽑습니다.
 *
 * 원본은 속도에 비례한 턴 수만큼 헤맵니다. (mon-act.cc:2652)
 * 빠른 것일수록 오래 헤매므로 여기서도 속도로 시간을 정합니다.
 *
 * 무작위를 dcss/random 을 거쳐 뽑습니다. 나중에 결정론적 재생을 넣을 때
 * 이 파일 밖에서 Math.random 을 부르는 곳이 있으면 조용히 깨집니다.
 * @param {object} enemy - 대상
 * @param {number} now - 게임 내부 시각
 */
function scatterErratic(enemy, now) {
    enemy.erraticAngle = (random2(360) * Math.PI) / 180;
    enemy.erraticUntil = now + C.ERRATIC_LEG_MS * Math.max(1, enemy.dcssSpeed / 10);
}

// --- 주문 ---------------------------------------------------------------------

/**
 * 몬스터가 이번 차례에 주문을 쓸지 정하고, 쓴다면 실행합니다.
 *
 * 원본은 턴마다 한 번 이백면체를 굴립니다. 아무것도 고르지 못한 턴은 공짜라서
 * 몬스터는 대신 평소처럼 걸어오거나 때립니다. 이 성질 덕분에 시전자는
 * 멈춰 서서 주문만 쏘는 포탑이 아니라 '가끔 쏘면서 계속 다가오는 적'이 됩니다.
 *
 * 굴리는 간격이 이 이식의 핵심입니다. 원본의 빈도는 턴 기준으로 맞춰져 있어서,
 * 프레임마다 굴리면 주문 밀도가 예순 배가 됩니다.
 * @param {object} enemy - 시전자
 * @param {object} context - { now, distance, dx, dy }
 * @returns {boolean} 주문을 썼으면 true
 */
/**
 * 그 자리가 막혀 있는지 봅니다. 순간이동과 공기 강타가 씁니다.
 * @param {number} x - 픽셀 좌표
 * @param {number} y - 픽셀 좌표
 * @returns {boolean} 막혀 있으면 true
 */
function isSolidAt(x, y) {
    // tileAt 은 타일 좌표를 받습니다. 픽셀을 그대로 넘기면 언제나 맵 밖이 되어
    // 모든 자리가 막힌 것으로 나옵니다. 그러면 순간이동도 소환도 조용히 실패합니다.
    return C.tileAt(world.map, Math.floor(x / C.TILE_SIZE), Math.floor(y / C.TILE_SIZE)).solid;
}

function tryCastSpell(enemy, context) {
    if (!enemy.spellbook) return false;

    const { now, distance } = context;
    if (now - (enemy.lastSpellRoll ?? C.PAST_TIME) < enemy.spellCooldown) return false;
    enemy.lastSpellRoll = now;

    // 벽 너머로는 쏘지 못합니다. 원본도 시야를 요구합니다. (mon-act.cc:1857)
    if (!hasLineOfSight(enemy.x, enemy.y, world.player.x, world.player.y)) return false;

    const situation = {
        hpFraction: enemy.hp / enemy.maxHp,
        distanceTiles: distance / C.TILE_SIZE,
        breathReady: now >= (enemy.breathReadyAt ?? 0),
    };

    // 궁지에 몰리면 빈도를 무시하고 아무거나 집습니다.
    const slot = pickEmergencySpell(enemy.spellbook, situation)
        ?? pickSpellSlot(enemy.spellbook, situation);
    if (!slot) return false;

    const effect = SPELL_EFFECTS[slot.spell];
    if (distance > (effect.range ?? 8) * C.TILE_SIZE) return false;

    const cast = CAST_BY_KIND[effect.kind];
    if (!cast || !cast(enemy, slot, effect, context)) return false;

    // 숨결은 쓰고 나면 한동안 쉽니다. (mon-cast.cc:5943)
    if (slot.flags?.includes('BREATH')) {
        enemy.breathReadyAt = now + rollBreathCooldownMs();
    }

    emit(EVENTS.MONSTER_CAST, { enemy, spell: slot.spell, flavour: effect.flavour });
    return true;
}

/**
 * @description 원형별 시전 실행.
 *
 * 원본의 이백여든두 가지 주문을 다 만들지는 않았습니다. 만들지 않은 것은
 * spells.js 의 효과표에 없어 애초에 뽑히지 않습니다.
 * 없는 효과를 있는 척하는 것보다 조용히 넘어가는 편이 낫다고 보았습니다.
 */
const CAST_BY_KIND = {
    /** 곧게 날아가는 광선. 이 장르가 가장 잘 다루는 모양입니다. */
    bolt: castProjectile,
    dart: castProjectile,
    breath: castProjectile,

    /** 닿는 곳에서 터집니다. 옆으로 피하는 것만으로는 부족해집니다. */
    ball: castProjectile,

    /**
     * 자기 강화. 이미 걸려 있으면 다시 걸지 않습니다. (mon-cast.cc:224)
     */
    selfBuff(enemy, slot, effect, { now }) {
        if (now < (enemy.buffs?.[effect.buff] ?? 0)) return false;

        enemy.buffs = enemy.buffs ?? {};
        const [low, high] = effect.durationAuts;
        enemy.buffs[effect.buff] = now + autToMs(randomRange(low, high));
        return true;
    },

    /**
     * 순간이동. 데이터에서 가장 흔한 주문이고, 이 장르에서 특히 값을 합니다.
     * 가만히 서 있는 과녁이 되기를 거부하는 적이 되기 때문입니다.
     */
    blink(enemy, slot, effect, { now, distance }) {
        const player = world.player;
        const away = Math.atan2(enemy.y - player.y, enemy.x - player.x);

        let angle, hop;
        if (effect.bias === 'toward') { angle = away + Math.PI; hop = distance * 0.6; }
        else if (effect.bias === 'away') { angle = away; hop = C.BLINK_RANGE_TILES * C.TILE_SIZE; }
        else if (effect.bias === 'ideal') {
            const ideal = C.KITE_IDEAL_DISTANCE_TILES * C.TILE_SIZE;
            angle = distance < ideal ? away : away + Math.PI;
            hop = Math.abs(distance - ideal);
        } else {
            angle = (random2(360) * Math.PI) / 180;
            hop = C.BLINK_RANGE_TILES * C.TILE_SIZE;
        }

        const x = enemy.x + Math.cos(angle) * hop;
        const y = enemy.y + Math.sin(angle) * hop;
        if (isSolidAt(x, y)) return false;   // 벽 속으로는 못 갑니다

        enemy.x = x;
        enemy.y = y;
        return true;
    },

    /**
     * 치유. 반쯤 다쳤을 때만 씁니다. '치유하는 놈부터 잡는다'가 생깁니다.
     */
    heal(enemy, slot, effect) {
        const target = effect.target === 'ally' ? weakestAlly(enemy) : enemy;
        if (!target || target.hp > target.maxHp / 2) return false;

        // 2d(HD/2) 만큼 회복합니다. (mon-cast.cc:1349)
        const healed = rollDice(2, Math.max(1, Math.trunc(enemy.hd / 2)))
            * (effect.multiplier ?? 1);
        target.hp = Math.min(target.maxHp, target.hp + healed);
        return true;
    },

    /**
     * 소환. 판의 흐름을 바꿉니다. 한산하던 곳이 갑자기 붐빕니다.
     *
     * 수와 지속은 원본을 따르되 총량에 상한을 두었습니다. 원본은 한 턴에
     * 한 번 행동하니 견딜 만하지만, 실시간에서는 같은 수치가 금세 화면을 메웁니다.
     */
    summon(enemy, slot, effect, { now }) {
        if (world.enemies.length >= C.MAX_ENEMIES_ON_FLOOR) return false;

        // 한 마리가 부를 수 있는 총량을 막습니다.
        // 원본은 턴마다 한 번 행동하니 부르는 속도가 저절로 눌리지만,
        // 실시간에서는 같은 수치가 금세 화면을 메웁니다. 실제로 악마술사 하나가
        // 60초에 서른세 마리를 불러 층 상한을 쳤습니다.
        const livingSummons = () =>
            world.enemies.filter(e => e.summonedBy === enemy.monsterId).length;
        if (livingSummons() >= C.MAX_SUMMONS_PER_CASTER) return false;

        // 1 + random2(HD/10 + 1) 마리. (mon-cast.cc:7896)
        const count = 1 + random2(Math.trunc(enemy.hd / 10) + 1);
        // min(2 + HD/10, 6) 턴 동안 남습니다. (mon-cast.cc:7897)
        const lifetime = autToMs(Math.min(2 + Math.trunc(enemy.hd / 10), 6) * 10);

        let summoned = 0;
        for (let i = 0; i < count; i++) {
            if (world.enemies.length >= C.MAX_ENEMIES_ON_FLOOR) break;

            // 상한을 부르는 도중에도 봐야 합니다. 밖에서 한 번만 보면 한 번의
            // 시전이 여러 마리를 부르므로 그만큼 넘칩니다. 검사가 이것을 잡지 못한 채
            // 오래 통과했는데, 난수가 우연히 한 마리씩만 부르고 있었기 때문입니다.
            if (livingSummons() >= C.MAX_SUMMONS_PER_CASTER) break;

            const id = pickSummonId(effect, enemy);
            if (!id) break;

            const angle = (random2(360) * Math.PI) / 180;
            const x = enemy.x + Math.cos(angle) * C.TILE_SIZE;
            const y = enemy.y + Math.sin(angle) * C.TILE_SIZE;
            if (isSolidAt(x, y)) continue;

            const minion = spawnMonster(id, { x, y });
            if (!minion) continue;

            // 부른 것은 시간이 지나면 사라집니다. 부른 놈을 먼저 잡으면
            // 무리가 늘지 않는다는 판단이 생깁니다.
            minion.summonedUntil = now + lifetime;
            minion.summonedBy = enemy.monsterId;
            // 불려 나온 것은 이미 깨어 있습니다.
            minion.state = initialState(minion);
            minion.huntUntil = now + rollFoeMemoryMs(minion.intelligence);
            summoned++;
        }

        return summoned > 0;
    },

    /**
     * 동료 강화. 한 마리가 무리 전체를 세게 만들어 '먼저 끊어야 할 놈'이 생깁니다.
     */
    allyBuff(enemy, slot, effect, { now }) {
        const radius = C.HEAL_ALLY_RANGE_TILES * C.TILE_SIZE;
        let buffed = 0;

        for (const other of world.enemies) {
            if (other === enemy) continue;
            if (Math.hypot(other.x - enemy.x, other.y - enemy.y) > radius) continue;
            // 전투의 함성은 같은 종족만 북돋웁니다. (mon-cast.cc BATTLECRY)
            if (effect.sameKindOnly && other.glyph !== enemy.glyph) continue;
            if (now < (other.buffs?.[effect.buff] ?? 0)) continue;

            other.buffs = other.buffs ?? {};
            const [low, high] = effect.durationAuts;
            other.buffs[effect.buff] = now + autToMs(randomRange(low, high));
            buffed++;
        }

        return buffed > 0;
    },

    /**
     * 소리로 동료를 부릅니다. 이미 만들어 둔 우는 소리 규칙을 그대로 씁니다.
     */
    rouse(enemy, slot, effect, { now }) {
        const radius = effect.radiusTiles * C.TILE_SIZE;
        let woken = 0;

        for (const other of world.enemies) {
            if (other === enemy || other.state !== 'idle') continue;
            if (Math.hypot(other.x - enemy.x, other.y - enemy.y) > radius) continue;

            rousePlayerHunt(other, now);
            other.state = initialState(other);
            woken++;
        }

        // 아무도 없으면 부를 이유가 없습니다.
        return woken > 0;
    },

    /**
     * 빨아들이기. 때린 만큼 회복하므로 빨리 끊지 않으면 소모전에서 집니다.
     */
    drain(enemy, slot, effect, { distance }) {
        if (distance > effect.range * C.TILE_SIZE) return false;
        // 멀쩡할 때는 굳이 쓰지 않습니다. (mon-cast.cc:2280)
        if (enemy.hp >= enemy.maxHp) return false;

        const damage = rollSpellDamage(slot.spell, enemy.hd);
        A.damagePlayer(damage);
        if (effect.heals) enemy.hp = Math.min(enemy.maxHp, enemy.hp + damage);
        return true;
    },

    /**
     * 약화. 느려지는 것만 남겼습니다.
     *
     * 원본에는 마비와 혼란이 있지만 실시간 일인칭에서는 둘 다 견디기 어렵습니다.
     * 조작을 빼앗기거나 뒤집히면 대응할 여지가 없기 때문입니다.
     * 느려지는 것은 살아남을 수 있고, 대신 길을 다시 짜게 만듭니다.
     */
    debuff(enemy, slot, effect, { now, distance }) {
        if (distance > effect.range * C.TILE_SIZE) return false;
        if (now < (world.player.debuffs?.[effect.debuff] ?? 0)) return false;

        const [low, high] = effect.durationAuts;
        world.player.debuffs = world.player.debuffs ?? {};
        world.player.debuffs[effect.debuff] = now + autToMs(randomRange(low, high));
        return true;
    },
    /**
     * 겨눌 필요가 없는 것. 공기 강타 하나만 남겼습니다.
     *
     * 원본에는 이런 주문이 많지만 대부분 이 게임에 맞지 않습니다.
     * 겨누고 피하는 게임에서 피할 수 없는 피해는 잘 해낸 것을 벌하기 때문입니다.
     * 공기 강타만은 주변이 트여 있을수록 아파서 '트인 데 서 있지 마라'로 읽힙니다.
     */
    smite(enemy, slot, effect) {
        let damage = rollSpellDamage(slot.spell, enemy.hd);
        damage += openSpaceAround(world.player) * effect.openSpaceBonus;
        A.damagePlayer(damage);
        return true;
    },
};

/**
 * 발사체를 하나 띄웁니다.
 * @param {object} enemy - 시전자
 * @param {object} slot - 주문 슬롯
 * @param {object} effect - 효과 정의
 * @param {object} context - { dx, dy }
 * @returns {boolean} 언제나 true
 */
function castProjectile(enemy, slot, effect, { dx, dy }) {
    world.projectiles.push({
        x: enemy.x, y: enemy.y, z: C.TILE_SIZE / 2,
        angle: Math.atan2(dy, dx),
        speed: projectileSpeedFor(slot.spell),
        damage: rollSpellDamage(slot.spell, enemy.hd),
        size: C.PROJECTILE_TYPES.ENEMY_FIREBALL.size,
        from: 'enemy',
        spriteKey: C.PROJECTILE_TYPES.ENEMY_FIREBALL.spriteKey,

        // 뚫는 광선은 맞은 것을 지나 계속 날아갑니다. (zap-data.h 의 can_beam)
        pierce: effect.pierce ?? false,
        blastRadius: effect.blastTiles ? effect.blastTiles * C.TILE_SIZE : 0,
        flavour: effect.flavour,
    });
    return true;
}

/**
 * 무엇을 소환할지 고릅니다.
 *
 * 원본은 주문마다 부르는 종이 정해져 있습니다. 마흔 가지를 낱낱이 옮기는 대신
 * 계열로 묶었습니다. 악마를 부르는 주문은 악마를, 언데드를 부르는 주문은
 * 언데드를 부릅니다. 어느 종이 나오는지는 소환자의 HD 를 기준으로 뽑습니다.
 *
 * 정확한 이식은 아닙니다. 다만 부르는 쪽의 성격은 남습니다.
 * @param {object} effect - 주문 효과
 * @param {object} summoner - 부르는 몬스터
 * @returns {string|null} 몬스터 식별자
 */
function pickSummonId(effect, summoner) {
    // 부르는 것은 대개 부른 놈보다 약합니다. 더 센 것을 부르는 주문만 예외입니다.
    const ceiling = effect.stronger ? summoner.hd + 3
        : effect.weaker ? Math.max(1, Math.trunc(summoner.hd / 2))
            : Math.max(1, summoner.hd - 1);

    const candidates = summonCandidates(effect.family, ceiling);
    if (candidates.length === 0) return null;
    return candidates[random2(candidates.length)];
}

/**
 * @description 계열별 소환 후보를 기억해 둡니다.
 * 매번 육백여 종을 훑으면 소환 한 번에 그 비용이 듭니다.
 */
const summonCache = new Map();

/**
 * 어느 계열에서 HD 상한 아래의 것들을 모읍니다.
 * @param {string} family - 계열
 * @param {number} ceiling - HD 상한
 * @returns {Array<string>} 몬스터 식별자들
 */
function summonCandidates(family, ceiling) {
    const key = `${family}:${ceiling}`;
    if (summonCache.has(key)) return summonCache.get(key);

    const list = allMonsters()
        .filter(m => m.spawnable && m.canAct && m.hd <= ceiling
            && matchesFamily(m, family))
        .map(m => m.id);

    summonCache.set(key, list);
    return list;
}

/**
 * 이 몬스터가 그 계열에 속하는지 봅니다.
 * @param {object} monster - 몬스터 정의
 * @param {string} family - 계열
 * @returns {boolean} 속하면 true
 */
function matchesFamily(monster, family) {
    if (family === 'any') return true;
    if (family === 'dragon') return monster.glyph === 'D' || monster.glyph === 'd';
    if (family === 'spider') return monster.glyph === 's';
    if (family === 'eye') return monster.glyph === 'G';
    if (family === 'beast') return monster.glyph === 'r' || monster.glyph === 'b';
    return monster.holiness?.includes(family) ?? false;
}
/**
 * 가장 많이 다친 동료를 찾습니다. 치유 대상으로 씁니다.
 * @param {object} healer - 치유하는 몬스터
 * @returns {object|null} 대상
 */
function weakestAlly(healer) {
    let worst = null;
    for (const other of world.enemies) {
        if (other === healer || other.hp <= 0) continue;
        if (Math.hypot(other.x - healer.x, other.y - healer.y) > C.HEAL_ALLY_RANGE_TILES * C.TILE_SIZE) continue;
        if (!worst || other.hp / other.maxHp < worst.hp / worst.maxHp) worst = other;
    }
    return worst;
}

/**
 * 대상 주위에 트인 칸이 몇 개인지 셉니다. (mon-cast.cc:7663 공기 강타)
 *
 * 원본은 이 수에 비례해 피해를 올립니다. 벽을 등지면 덜 아프다는 뜻이라,
 * 실시간에서는 '트인 데 서 있지 마라'는 읽기 쉬운 규칙이 됩니다.
 * @param {object} target - 대상
 * @returns {number} 트인 칸 수 (0~8)
 */
function openSpaceAround(target) {
    const tx = Math.floor(target.x / C.TILE_SIZE);
    const ty = Math.floor(target.y / C.TILE_SIZE);
    let open = 0;
    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            if (!isSolidAt((tx + dx) * C.TILE_SIZE, (ty + dy) * C.TILE_SIZE)) open++;
        }
    }
    return open;
}

/**
 * 그 버프가 지금 걸려 있는지 봅니다.
 *
 * 버프를 걸어 두기만 하고 아무도 읽지 않으면, 시전은 성공하는데 아무 일도
 * 일어나지 않습니다. flies 깃발이 그랬듯 '반영되는 척'이 됩니다.
 * @param {object} actor - 몬스터
 * @param {string} name - 버프 이름
 * @returns {boolean} 걸려 있으면 true
 */
function hasBuff(actor, name) {
    return world.time < (actor.buffs?.[name] ?? 0);
}

/**
 * 플레이어에게 그 약화가 걸려 있는지 봅니다.
 * @param {string} name - 약화 이름
 * @returns {boolean} 걸려 있으면 true
 */
export function playerHasDebuff(name) {
    return world.time < (world.player.debuffs?.[name] ?? 0);
}

/**
 * 버프를 반영한 이동 속도를 구합니다.
 *
 * 가속은 원본에서 행동을 두 배 빠르게 만듭니다. 여기서는 이동으로 옮깁니다.
 * 광포는 그보다 조금 더 빠릅니다.
 * @param {object} enemy - 몬스터
 * @returns {number} 이 스텝의 이동 속도
 */
function effectiveSpeed(enemy) {
    let speed = enemy.speed;
    if (hasBuff(enemy, 'haste')) speed *= C.HASTE_SPEED_SCALE;
    if (hasBuff(enemy, 'berserk')) speed *= C.BERSERK_SPEED_SCALE;
    return speed;
}

/**
 * 몬스터가 플레이어를 한 번 때립니다.
 *
 * 예전에는 사거리 안에 들어오기만 하면 정해진 피해가 그대로 들어갔습니다.
 * 맞는 쪽에 아무 판정도 없어서 회피 스킬이 뜻을 가질 수 없었고,
 * 전투 숙련(fighter) 같은 원본의 성향도 반영할 자리가 없었습니다.
 *
 * 이제 DCSS 의 순서를 따릅니다. 명중값을 굴려 회피와 견주고, 맞았으면
 * 피해를 굴린 뒤 방어도로 감산합니다. 빗나가면 회피 스킬이 자랍니다.
 * @param {object} enemy - 때리는 몬스터
 */
function strikePlayer(enemy) {
    const result = monsterAttackRoll(enemy, {
        ev: currentPlayerEvasion(),
        ac: 0,   // 갑옷이 아직 없습니다. 들어오면 여기에 붙습니다.
    });

    // 맞든 빗나가든 피하려 애쓴 것이므로 회피가 자랍니다. (exercise.cc)
    A.practise('dodging');
    if (!result.hit) return;

    // 완력은 피해를 올립니다. 전투의 함성으로 북돋워진 무리가 이걸 씁니다.
    // 한 마리를 먼저 끊어야 할 이유가 여기서 생깁니다.
    const damage = hasBuff(enemy, 'might')
        ? Math.round(result.damage * C.MIGHT_DAMAGE_SCALE)
        : result.damage;

    A.damagePlayer(damage, enemy);
}

/**
 * 지금 플레이어의 회피를 구합니다.
 * @returns {number} 회피
 */
function currentPlayerEvasion() {
    const player = world.player;
    const dex = SPECIES[player.species]?.dex ?? 8;
    return playerEvasion(skillValue(player.skills, 'dodging', aptitudeFor('dodging')), dex);
}

/**
 * 이 무기가 어느 스킬을 쓰는지 정합니다.
 *
 * 이 게임의 무기는 주먹과 지팡이 둘뿐이라, DCSS 의 열 가지 무기 스킬 중
 * 대응하는 것만 씁니다. 무기가 늘면 여기에 붙입니다.
 * @param {string} weapon - 무기 키
 * @returns {string} 스킬 이름
 */
function weaponSkillOf(weapon) {
    return weapon === 'fist' ? 'unarmed_combat' : 'evocations';
}

/**
 * 플레이어의 명중값을 구합니다. (attack.cc:177 calc_pre_roll_to_hit 의 플레이어 가지)
 *
 * 원본은 15 + 민첩/2 에 격투와 무기 스킬을 각각 굴려 더합니다.
 * 굴리는 부분은 여기서 하지 않습니다. 이 값은 굴리기 전의 상한이고,
 * 실제 명중 여부는 조준이 정하기 때문입니다. 대신 이 상한이 회피와 비교되어
 * 과녁 크기를 정하므로(combat.aimRadius), 스킬이 오르면 맞추기 쉬워집니다.
 * @returns {number} 굴리기 전의 명중값
 */
function playerToHit() {
    const player = world.player;
    const dex = SPECIES[player.species]?.dex ?? 8;
    const weaponSkill = weaponSkillOf(player.weapon);

    return 15 + Math.trunc(dex / 2)
        + skillValue(player.skills, 'fighting', aptitudeFor('fighting'))
        + skillValue(player.skills, weaponSkill, aptitudeFor(weaponSkill));
}

/**
 * 지속 효과와 캐릭터를 반영한 플레이어의 공격력을 구합니다.
 *
 * 장갑은 근접, 지팡이는 마법으로 칩니다. 트롤의 힘이 지팡이 위력을 올리거나
 * 딥 엘프의 지능이 주먹을 세게 만드는 일이 없도록 갈라 둡니다.
 * @param {number} base - 무기의 기본 피해량
 * @returns {number} 실제로 들어갈 피해량
 */
function playerDamage(base) {
    const field = world.player.weapon === 'fist' ? 'meleeDamage' : 'magicDamage';
    return Math.round(base * A.buffModifier('damageMultiplier', 1) * characterModifier(field));
}

/**
 * 현재 층(floor)에 맞는 수의 적들을 스폰합니다.
 */
/**
 * 이 층에 걸어 다닐 수 있는 칸이 몇 개인지 셉니다.
 * @returns {number} 칸 수
 */
function countOpenTiles() {
    let open = 0;
    for (let y = 0; y < world.map.length; y++) {
        for (let x = 0; x < world.map[y].length; x++) {
            if (!C.tileAt(world.map, x, y).solid) open++;
        }
    }
    return open;
}

/**
 * 볼트가 지정한 자리에 몬스터를 놓습니다.
 *
 * 볼트에 적힌 종이 있으면 그것을, '깊이에 맡김' 표시면 그 층의 출현표에서 뽑습니다.
 * 원본은 0 을 이 깊이, 9 를 깊이+5, 8 을 (깊이+2)*2 에서 뽑습니다.
 */
function spawnVaultMonsters() {
    for (const vault of world.vaults ?? []) {
        for (const spawn of vault.spawns ?? []) {
            const id = resolveVaultMonster(spawn.id);
            if (!id) continue;

            // 볼트가 여기 선다고 정한 자리입니다. 그 위에 문이 얹혀 있으면
            // 나중에 얹은 쪽이 잘못이므로 걷어냅니다.
            //
            // 그대로 두면 문을 열 줄 모르는 짐승이 닫힌 문 안에 갇힙니다.
            // 실제로 이천이백 마리 중 다섯이 그런 상태였습니다.
            if (world.objectMap[spawn.tileY]?.[spawn.tileX] > 0) {
                world.objectMap[spawn.tileY][spawn.tileX] = 0;
                if (world.map[spawn.tileY][spawn.tileX] === C.TILE_IDS.DOOR) {
                    world.map[spawn.tileY][spawn.tileX] = C.TILE_IDS.FLOOR;
                }
                world.mapRevision++;
            }

            spawnMonster(id, {
                x: spawn.tileX * C.TILE_SIZE + C.TILE_SIZE / 2,
                y: spawn.tileY * C.TILE_SIZE + C.TILE_SIZE / 2,
            });
        }
    }
}

/**
 * 볼트의 몬스터 표시를 실제 종으로 바꿉니다.
 * @param {string} marker - 종 식별자 또는 깊이 표시
 * @returns {string|null} 몬스터 식별자
 */
function resolveVaultMonster(marker) {
    if (marker === ROLL_FOR_DEPTH) return rollMonsterFor(world.branch, world.floor);
    // 깊이보다 센 것. 원본의 9 와 8 에 해당합니다.
    if (marker === ROLL_FOR_DEPTH_TOUGH) return rollMonsterFor(world.branch, world.floor + 5);
    if (marker === ROLL_FOR_DEPTH_TOUGHER) return rollMonsterFor(world.branch, (world.floor + 2) * 2);
    return marker;
}

export function spawnEnemiesForFloor() {
    const dangerLevel = A.currentDangerLevel();
    const dungeon = getBranch(world.branch);

    // 어느 층에 무엇이 나오는가는 DCSS 의 출현표가 정합니다.
    // 예전에는 tier 라는 자체 값으로 대충 정했는데, 이제 원본의 난이도 곡선을 그대로 씁니다.
    // 출현표는 '가지 안에서 몇 층인가'로 색인합니다. 절대 깊이가 아닙니다.
    // 오크 광산의 표는 1~4 밖에 없는데 절대 깊이 12 를 넘기면 후보가 하나도 없어,
    // 그 던전에 적이 아예 나오지 않습니다. 실제로 오크 광산·뱀굴·엘프 회관이
    // 텅 비어 있었습니다. 적 수와 아이템 등급은 절대 깊이를 그대로 씁니다.
    // 깊이가 몇 마리인지를 정하고, 넓이가 그것을 보정합니다.
    //
    // 둘 중 큰 쪽을 쓰면 넓이가 깊이를 압도해 1층부터 상한까지 차오릅니다.
    // 실제로 그렇게 해 보니 1층과 12층의 적 수가 똑같이 30 이 되어,
    // 깊이가 위험도를 정한다는 원칙이 사라졌습니다.
    //
    // 그래서 곱합니다. 깊이가 정한 수를 넓이 비율로 늘리되, 늘어나는 폭에
    // 상한을 둡니다. 맵이 두 배 넓어지면 적도 두 배가 되지만,
    // 1층이 12층보다 위험해지는 일은 없습니다.
    const byDepth = dangerLevel * 2 + 3;
    // 아래로는 1 에서 멈춥니다. 넓이는 적을 늘리기만 하고 줄이지는 않습니다.
    // 줄이게 두면 좁은 층이 텅 비고, 무엇보다 아주 작은 맵에서 0 마리가 됩니다.
    const areaScale = Math.max(1, Math.min(C.MAX_AREA_SCALE,
        countOpenTiles() / (C.BASELINE_FLOOR_TILES || 1)));
    const count = Math.min(C.MAX_ENEMIES_PER_FLOOR, Math.round(byDepth * areaScale));
    for (let i = 0; i < count; i++) {
        const id = rollMonsterFor(world.branch, world.floor);
        if (id) spawnMonster(id, findSpawnPoint());
    }

    // 볼트가 지정한 자리에도 놓습니다.
    //
    // 볼트의 몬스터는 '이 방에 이것이 있다'는 설계입니다. 무작위 스폰과 달리
    // 자리와 종이 함께 정해져 있어, 쥐가 갇힌 금고나 코볼트 소굴 같은 것이 됩니다.
    // 그래서 층 전체 마릿수 예산과 별개로 놓습니다. 예산에 넣으면 볼트가 큰 층은
    // 나머지가 텅 비게 됩니다.
    spawnVaultMonsters();

    // 보스가 지정된 던전은 최하층에 한 마리만 배치합니다.
    if (dungeon.boss && world.floor >= dungeon.depth) {
        spawnMonster(dungeon.boss, findSpawnPoint());
    }
}

/**
 * 지정한 몬스터를 특정 위치에 생성합니다.
 * @param {string} id - monsters.js의 몬스터 id
 * @param {{x: number, y: number}} position - 생성할 월드 좌표
 * @returns {object|null} 생성된 적. 알 수 없는 id면 null.
 */
export function spawnMonster(id, position) {
    const template = getMonster(id);
    if (!template) {
        console.warn(`알 수 없는 몬스터: ${id}`);
        return null;
    }

    const enemy = {
        ...template,
        monsterId: id,
        x: position.x, y: position.y, z: C.TILE_SIZE / 2,
        // HP 는 정의된 값이 아니라 스폰할 때 굴립니다. DCSS 의 hp_10x 는
        // '평균 HP 의 열 배'라 같은 몬스터라도 개체마다 다릅니다.
        maxHp: rollMonsterHp(template.hp10x),
        // 스폰 직후 쿨다운에 걸리지 않도록 과거 시각으로 둡니다.
        lastAttackTime: C.PAST_TIME,
        lastHitTime: 0,
        // 아직 플레이어를 알아채지 못한 상태로 태어납니다. (ENEMY_STATES 참조)
        state: 'idle',
        huntUntil: 0,
    };

    // 굴린 최대치에서 시작합니다. maxHp 를 쓰는 자리에서 계산해야
    // 같은 개체의 hp 와 maxHp 가 어긋나지 않습니다.
    enemy.hp = enemy.maxHp;

    // 행동별로 필요한 상태를 붙입니다.
    if (template.behavior === 'exploder') enemy.fuseStartedAt = null;
    if (template.behavior === 'summoner') enemy.summonedCount = 0;

    world.enemies.push(enemy);
    return enemy;
}

/**
 * 플레이어의 상호작용 입력을 처리합니다. (예: 문 열기, 아이템 사용, 출구 이용)
 */
export function interactWithWorld() {
    const player = world.player;

    // 플레이어 바로 앞 타일의 월드 좌표를 계산합니다.
    const checkDist = C.TILE_SIZE * 0.75; // 상호작용 거리
    const checkX = player.x + Math.cos(player.angle) * checkDist;
    const checkY = player.y + Math.sin(player.angle) * checkDist;

    // 월드 좌표를 맵 타일 좌표로 변환합니다.
    const tileX = Math.floor(checkX / C.TILE_SIZE);
    const tileY = Math.floor(checkY / C.TILE_SIZE);

    // 1. 지형 자체와의 상호작용 (출구, 하위 던전 입구)
    const interaction = C.tileAt(world.map, tileX, tileY).interaction;

    if (interaction === 'exit') {
        A.reachExit(); // 다음 층으로 내려가거나, 최하층이면 상위 던전으로 복귀합니다.
        return;
    }

    if (interaction === 'branch') {
        const entrance = world.entrances.find(e => e.tileX === tileX && e.tileY === tileY);
        if (entrance) A.enterBranch(entrance.branch);
        return;
    }

    if (interaction === 'altar') {
        const altar = world.altars.find(a => a.tileX === tileX && a.tileY === tileY);
        if (altar) A.worshipAtAltar(altar.god);
        return;
    }

    if (interaction === 'portal') {
        const portal = world.portals.find(p => p.tileX === tileX && p.tileY === tileY);
        if (portal) A.enterPortal(portal.id);
        return;
    }

    // 2. objectMap에서 상호작용 가능한 오브젝트가 있는지 확인합니다.
    const objectId = world.objectMap[tileY]?.[tileX];
    if (objectId > 0) {
        const objectType = C.OBJECT_TYPES[objectId];
        if (objectType && objectType.interactive) {
            if (objectType.name === 'Door') {
                A.openDoor(tileX, tileY);
            }
            // 여기에 다른 오브젝트(분수, 보물상자 등)의 상호작용 로직을 추가할 수 있습니다.
        }
    }
}


// --- 적 행동 (Behaviours) ---
//
// 행동을 if/else 로 늘리면 유형이 많아질수록 손댈 수 없게 됩니다.
// 이름으로 찾아 실행하는 표로 두어, 새 행동을 더할 때 항목 하나만 추가하면 되게 합니다.
// monsters.js 의 behavior 값이 이 표의 키와 일치해야 합니다.

/**
 * @description 행동별 처리기. 각 처리기는 (enemy, context)를 받습니다.
 * context: { now, dtFactor, player, distance, dx, dy }
 */
const ENEMY_BEHAVIORS = {
    /** 붙어서 때린다 */
    melee(enemy, { now, distance }) {
        if (distance >= C.TILE_SIZE) return;
        if (now - enemy.lastAttackTime <= enemy.cooldown) return;

        enemy.lastAttackTime = now;
        strikePlayer(enemy);
    },

    /** 사거리 안에서 발사체를 쏜다 */
    ranged(enemy, { now, distance, dx, dy }) {
        if (distance >= enemy.range) return;

        // 붙으면 쏘지 못합니다. (mon-act.cc:1522)
        // 원본에서 몬스터는 바로 옆에 있는 상대에게 활을 쏘지 않습니다.
        // prefer_ranged 를 가진 것들만 예외입니다.
        // 이 규칙이 있어야 원거리 적에게 '거리를 좁힌다'는 대응이 생깁니다.
        if (distance < C.TILE_SIZE * 1.5 && !enemy.preferRanged) return;

        if (now - enemy.lastAttackTime <= enemy.cooldown) return;

        enemy.lastAttackTime = now;
        world.projectiles.push({
            x: enemy.x, y: enemy.y, z: C.TILE_SIZE / 2,
            angle: Math.atan2(dy, dx),
            speed: enemy.projectileSpeed,

            // 활잡이는 피해가 얹힙니다. (fight.cc:1671 archer_bonus_damage)
            // 명중값도 올라가지만 이 게임의 발사체는 굴림이 아니라 부딪힘으로
            // 맞는지를 정하므로, 그쪽은 반영할 자리가 없습니다.
            damage: enemy.damage + (enemy.archer ? archerBonusDamage(enemy.hd) : 0),

            size: C.PROJECTILE_TYPES.ENEMY_FIREBALL.size, from: 'enemy',
            spriteKey: C.PROJECTILE_TYPES.ENEMY_FIREBALL.spriteKey,
        });
    },

    /**
     * 가까워지면 점화하고, 잠시 뒤 터지며 스스로 사라진다.
     * 점화한 뒤에는 물러나도 늦으므로, 다가오는 것을 미리 처리해야 합니다.
     */
    exploder(enemy, { now, distance }) {
        if (enemy.fuseStartedAt === null || enemy.fuseStartedAt === undefined) {
            if (distance < C.TILE_SIZE * 1.2) enemy.fuseStartedAt = now;
            return;
        }
        if (now - enemy.fuseStartedAt < enemy.fuseMs) return;

        if (distance < enemy.blastRadius) {
            // 중심에서 멀수록 피해가 줄어듭니다.
            const falloff = 1 - distance / enemy.blastRadius;
            A.damagePlayer(Math.round(enemy.blastDamage * falloff), enemy);
        }
        createParticleExplosion(enemy.x, enemy.y, enemy.color);
        enemy.hp = 0; // 이번 프레임의 사망 처리에서 정리됩니다.
    },

    /** 근접 공격을 하면서 주기적으로 하수인을 부른다 */
    summoner(enemy, context) {
        ENEMY_BEHAVIORS.melee(enemy, context);

        const { now, distance } = context;
        if (distance > C.TILE_SIZE * 12) return;                  // 너무 멀면 부르지 않음
        if (enemy.summonedCount >= enemy.maxSummons) return;
        if (now - (enemy.lastSummonTime ?? C.PAST_TIME) <= enemy.summonCooldown) return;

        enemy.lastSummonTime = now;
        enemy.summonedCount++;
        spawnMonster(enemy.summonId, {
            x: enemy.x + (Math.random() - 0.5) * C.TILE_SIZE,
            y: enemy.y + (Math.random() - 0.5) * C.TILE_SIZE,
        });
    },
};

// --- 적 상태 기계 (FSM) -----------------------------------------------------
//
// 예전에는 모든 적이 조건 없이 플레이어를 향해 걷고, behavior 핸들러가 공격만 맡았습니다.
// 도망처럼 '걷는 방향이 달라지는' 행동을 넣을 자리가 없었습니다.
//
// 이제 적은 상태를 하나 갖고, 상태가 세 가지를 정합니다.
//   move - 이번 스텝에 어디로 움직이는가
//   act  - 움직인 뒤 무엇을 하는가 (behavior 핸들러는 여기서 불립니다)
//   next - 다음 스텝에 어떤 상태가 되는가
//
// behavior(무엇으로 싸우는가)와 state(지금 무엇을 하는가)는 다른 축입니다.
// 오크도 망령도 다치면 도망칠 수 있어야 하므로 둘을 곱하지 않고 나란히 둡니다.

/**
 * 지금 겁을 먹을 상황인지 판단합니다.
 *
 * 도망칠 수 있는 몬스터인지는 monsters.js 의 fleeBelow 가 정합니다.
 * 값이 없으면 끝까지 싸웁니다. 언데드나 구조물이 도망치면 어색하기 때문입니다.
 * @param {object} enemy - 판단할 적
 * @param {number} distance - 플레이어까지의 거리
 * @param {number} now - 게임 내부 시각
 * @returns {boolean} 도망쳐야 하면 true
 */
function isFrightened(enemy, distance, now) {
    if (!enemy.fleeBelow) return false;
    if (enemy.hp / enemy.maxHp >= enemy.fleeBelow) return false;

    // 방금 몰려서 돌아선 참이라면 한동안은 겁을 먹지 않습니다.
    // 이것이 없으면 몰린 적이 도망과 추격을 매 스텝 오가며 공격이 절반만 나갑니다.
    if (now < (enemy.corneredUntil ?? 0)) return false;

    // 이미 도망치는 중이라면 충분히 멀어질 때까지 계속 달아납니다.
    // 시작 거리와 그만두는 거리를 벌려 두어야 경계에서 진동하지 않습니다.
    const limit = enemy.state === 'flee' ? C.FLEE_STOP_DISTANCE_TILES : C.FLEE_START_DISTANCE_TILES;
    return distance < C.TILE_SIZE * limit;
}

/**
 * @description 적이 가질 수 있는 상태들.
 * 새 상태를 추가할 때는 move/act/next 셋을 모두 채우면 됩니다.
 */
const ENEMY_STATES = {
    /**
     * 아직 플레이어를 알아채지 못했다.
     *
     * 지금까지 모든 적은 태어난 순간부터 플레이어의 위치를 알고 곧장 달려왔습니다.
     * 벽 뒤로 숨어도 방을 나가도 소용이 없어서, 이 게임에는 '들키지 않는다'거나
     * '따돌린다'는 선택지가 아예 없었습니다.
     *
     * 이제 시야에 들어와야 알아챕니다. 얼마나 멀리서 알아보는지는 지능이 정합니다.
     * 머리가 없는 것은 코앞만 보고, 사람만큼 영리한 것은 방 하나 너머를 봅니다.
     */
    idle: {
        move() {
            // 제자리에 있습니다. 배회는 넣지 않았습니다.
            // 실시간에서 어슬렁거리는 적은 '깨어 있는 적'과 구분되지 않아,
            // 알아챈 것인지 아닌지가 오히려 읽기 어려워집니다.
        },
        act() {
            // 알아채기 전에는 아무것도 하지 않습니다.
        },
        next(enemy, { distance, now }) {
            if (!noticesPlayer(enemy, distance)) return 'idle';

            // 알아채는 순간 웁니다. 그 소리가 주변을 깨웁니다.
            rousePlayerHunt(enemy, now);
            alertNeighbours(enemy, now);
            return initialState(enemy);
        },
    },

    /**
     * 거리를 두고 쏜다. (mon-behv.cc:115 maintain_range)
     *
     * 원본은 시야의 절반쯤을 이상적인 거리로 잡고, 그보다 가까워지면 물러섭니다.
     * 쫓아가 때리는 적만 있으면 전투가 한 가지 모양으로 굳는데,
     * 다가오지 않는 적이 섞이면 플레이어가 거리를 좁힐지 말지를 고르게 됩니다.
     */
    kite: {
        move(enemy, dtFactor, { distance }) {
            // 너무 가까우면 물러서고, 너무 멀면 다가갑니다. 알맞으면 멈춥니다.
            if (distance < C.KITE_IDEAL_DISTANCE_TILES * C.TILE_SIZE) {
                enemy.cornered = !fleeAlongFlowField(enemy, dtFactor);
            } else if (distance > C.KITE_IDEAL_DISTANCE_TILES * C.TILE_SIZE * 1.4) {
                followFlowField(enemy, dtFactor);
            }
        },
        act(enemy, context) {
            const behave = ENEMY_BEHAVIORS[enemy.behavior];
            if (behave) behave(enemy, context);
        },
        next(enemy, { distance, now }) {
            // 몰려서 물러설 곳이 없으면 어쩔 수 없이 붙어 싸웁니다.
            if (enemy.cornered) {
                enemy.corneredUntil = now + C.CORNERED_FIGHT_MS;
                return 'chase';
            }
            return isFrightened(enemy, distance, now) ? 'flee' : 'kite';
        },
    },

    /**
     * 아무 데로나 정신없이 날아다닌다. (mon-act.cc:2652 BEH_BATTY)
     *
     * 박쥐와 나방이 이렇게 움직입니다. 겨눈 선으로 명중을 정하는 이 게임에서는
     * 특히 성가신 적이 됩니다. 앞을 예측해 쏘아야 하기 때문입니다.
     *
     * 원본은 속도에 비례한 턴 수만큼 이 상태에 머뭅니다. 빠른 것일수록 오래
     * 헤매므로, 여기서도 속도로 시간을 정합니다.
     */
    erratic: {
        move(enemy, dtFactor) {
            // 정한 방향으로 계속 나아갑니다. 매 스텝 방향을 새로 뽑으면
            // 제자리에서 떠는 것처럼 보입니다.
            const speed = effectiveSpeed(enemy) * dtFactor;
            moveEnemyBy(enemy, Math.cos(enemy.erraticAngle) * speed,
                Math.sin(enemy.erraticAngle) * speed);
        },
        act(enemy, context) {
            // 헤매는 중에도 옆에 있으면 뭅니다.
            const behave = ENEMY_BEHAVIORS[enemy.behavior];
            if (behave) behave(enemy, context);
        },
        next(enemy, { now, distance }) {
            if (now < (enemy.erraticUntil ?? 0)) return 'erratic';
            return isFrightened(enemy, distance, now) ? 'flee' : 'chase';
        },
    },

    /** 플레이어를 쫓아가 싸운다 */
    chase: {
        move(enemy, dtFactor) {
            followFlowField(enemy, dtFactor);
        },
        act(enemy, context) {
            const behave = ENEMY_BEHAVIORS[enemy.behavior];
            if (behave) behave(enemy, context);
        },
        next(enemy, { distance, now }) {
            return isFrightened(enemy, distance, now) ? 'flee' : 'chase';
        },
    },

    /**
     * 등을 돌리고 달아난다.
     *
     * 달아나는 동안은 공격하지 않습니다. 도망치면서 때리면 플레이어 입장에서는
     * 그냥 잡기 어려운 적일 뿐이고, 겁먹었다는 것이 읽히지 않습니다.
     */
    flee: {
        move(enemy, dtFactor) {
            // 막다른 곳이면 false 가 돌아옵니다. next 에서 씁니다.
            enemy.cornered = !fleeAlongFlowField(enemy, dtFactor);
        },
        act() {
            // 아무것도 하지 않습니다.
        },
        next(enemy, { distance, now }) {
            // 몰린 짐승은 돌아서서 뭅니다. 벽을 향해 떨듯이 서 있는 것보다 낫고,
            // 플레이어가 구석으로 몰아넣는 선택에 의미가 생깁니다.
            //
            // 체념한 시각을 적어 두는 것이 중요합니다. 돌아서기만 하고 끝내면
            // 다음 스텝에 다시 겁을 먹어 도망과 추격을 매 스텝 오갑니다.
            if (enemy.cornered) {
                enemy.corneredUntil = now + C.CORNERED_FIGHT_MS;
                return 'chase';
            }
            return isFrightened(enemy, distance, now) ? 'flee' : 'chase';
        },
    },
};

// --- 경로 탐색: 플로우 필드 (Flow Field) ---
//
// 이전에는 적마다 플레이어까지 BFS를 돌리고, 탐색 중인 경로 전체를 배열로 복사해
// 큐에 넣었습니다. 적이 늘어날수록 비용이 선형으로 늘고 임시 배열이 쏟아져
// 주기적인 프레임 끊김의 원인이었습니다.
//
// 이 게임에서 모든 적의 목표는 언제나 플레이어 한 곳입니다.
// 그래서 맵 전체에 대해 "플레이어까지 몇 걸음인가"를 한 번만 계산해 두면
// 적은 자기 칸에서 값이 가장 작은 이웃으로 한 걸음 옮기기만 하면 됩니다.
// 적이 몇 마리든 경로 탐색 비용은 그대로입니다.

/** @description 플로우 필드에서 '도달 불가'를 나타내는 값 */
const UNREACHABLE = -1;

/** @description 각 타일에서 플레이어까지의 걸음 수 */
/**
 * @description 무엇을 지나갈 수 있는지가 다르면 길도 달라지므로 격자를 따로 둡니다.
 *
 * 네 가지입니다. 나는가 × 문을 여는가.
 * 하나로 쓰면 나는 적이 물 위로 못 오거나, 짐승이 열 수도 없는 문을 향해
 * 걸어가 벽에 머리를 박습니다.
 *
 * 격자 하나가 5600 칸이고 플레이어가 타일을 넘을 때만 다시 계산하므로
 * 넷을 두어도 부담이 되지 않습니다.
 */
const FLOW_VARIANTS = 4;

/**
 * 변형 번호를 구합니다.
 * @param {boolean} flying - 나는가
 * @param {boolean} canOpen - 문을 여는가
 * @returns {number} 0~3
 */
function flowVariant(flying, canOpen) {
    return (flying ? 1 : 0) | (canOpen ? 2 : 0);
}

/** @description 변형별 격자. */
const flowFields = new Array(FLOW_VARIANTS).fill(null);

/** @description 변형별로 언제 다시 계산할지 판단하는 값들. */
const flowCaches = Array.from({ length: FLOW_VARIANTS },
    () => ({ tileX: -1, tileY: -1, map: null, revision: -1 }));

/** @description BFS에 재사용하는 큐. 프레임마다 새로 할당하지 않기 위해 보관합니다. */
let flowQueue = null;

/**
 * 플로우 필드가 최신인지 확인하고, 필요하면 다시 계산합니다.
 * 플레이어가 다른 칸으로 옮겼거나, 층이 바뀌었거나, 문이 열려 통행이 달라졌을 때만 계산합니다.
 */
function ensureFlowField(flying = false, canOpen = false) {
    const tileX = Math.floor(world.player.x / C.TILE_SIZE);
    const tileY = Math.floor(world.player.y / C.TILE_SIZE);

    const variant = flowVariant(flying, canOpen);
    const cache = flowCaches[variant];

    const isCurrent = flowFields[variant]
        && cache.tileX === tileX
        && cache.tileY === tileY
        && cache.map === world.map
        && cache.revision === world.mapRevision;
    if (isCurrent) return flowFields[variant];

    computeFlowField(tileX, tileY, flying, canOpen);
    flowCaches[variant] = { tileX, tileY, map: world.map, revision: world.mapRevision };

    return flowFields[variant];
}

/**
 * 플레이어 위치에서 시작하는 너비 우선 탐색으로 모든 칸의 걸음 수를 채웁니다.
 * @param {number} targetX - 플레이어의 타일 X 좌표
 * @param {number} targetY - 플레이어의 타일 Y 좌표
 */
function computeFlowField(targetX, targetY, flying = false, canOpen = false) {
    const width = C.MAP_WIDTH, height = C.MAP_HEIGHT;
    const size = width * height;

    const variant = flowVariant(flying, canOpen);
    if (!flowFields[variant] || flowFields[variant].length !== size) {
        for (let v = 0; v < FLOW_VARIANTS; v++) flowFields[v] = new Int32Array(size);
        flowQueue = new Int32Array(size);
    }

    const field = flowFields[variant];
    field.fill(UNREACHABLE);

    if (targetX < 0 || targetY < 0 || targetX >= width || targetY >= height) return;

    let head = 0, tail = 0;
    const start = targetY * width + targetX;
    field[start] = 0;
    flowQueue[tail++] = start;

    while (head < tail) {
        const node = flowQueue[head++];
        const x = node % width;
        const y = (node / width) | 0;
        const nextDistance = field[node] + 1;

        // 상하좌우 네 방향. 기존 BFS와 동일하게 대각선 이동은 허용하지 않습니다.
        for (let d = 0; d < 4; d++) {
            const nx = x + (d === 2 ? 1 : d === 3 ? -1 : 0);
            const ny = y + (d === 0 ? 1 : d === 1 ? -1 : 0);
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

            const neighbour = ny * width + nx;
            if (field[neighbour] !== UNREACHABLE) continue;
            if (!isPassable(nx, ny, flying, canOpen)) continue;

            field[neighbour] = nextDistance;
            flowQueue[tail++] = neighbour;
        }
    }
}

/**
 * 플로우 필드를 따라 적을 플레이어 쪽으로 한 걸음 옮깁니다.
 * @param {object} enemy - 이동시킬 적
 * @param {number} dtFactor - 프레임 시간 보정값
 */
function followFlowField(enemy, dtFactor) {
    const width = C.MAP_WIDTH;
    const tileX = Math.floor(enemy.x / C.TILE_SIZE);
    const tileY = Math.floor(enemy.y / C.TILE_SIZE);
    if (tileX < 0 || tileY < 0 || tileX >= width || tileY >= C.MAP_HEIGHT) return;

    // 나는 적은 자기 격자를 봅니다. 물 위로 곧장 올 수 있습니다.
    const field = ensureFlowField(!!enemy.flies, !!enemy.canOpenDoors);

    const here = field[tileY * width + tileX];
    if (here === UNREACHABLE || here === 0) return; // 길이 없거나 이미 플레이어 칸

    // 걸음 수가 더 작은 이웃 = 플레이어에게 더 가까운 칸
    let bestNode = -1;
    let bestDistance = here;
    for (let d = 0; d < 4; d++) {
        const nx = tileX + (d === 2 ? 1 : d === 3 ? -1 : 0);
        const ny = tileY + (d === 0 ? 1 : d === 1 ? -1 : 0);
        if (nx < 0 || ny < 0 || nx >= width || ny >= C.MAP_HEIGHT) continue;

        const neighbour = ny * width + nx;
        const distance = field[neighbour];
        if (distance !== UNREACHABLE && distance < bestDistance) {
            bestDistance = distance;
            bestNode = neighbour;
        }
    }
    if (bestNode < 0) return;

    const targetX = (bestNode % width) * C.TILE_SIZE + C.TILE_SIZE / 2;
    const targetY = ((bestNode / width) | 0) * C.TILE_SIZE + C.TILE_SIZE / 2;
    const angle = Math.atan2(targetY - enemy.y, targetX - enemy.x);
    const speed = effectiveSpeed(enemy) * dtFactor;

    // 좌표를 직접 옮기지 않고 moveEnemyBy 를 거칩니다.
    // 그래야 문 앞에서 문을 열고, 여는 연출도 함께 나갑니다.
    moveEnemyBy(enemy, Math.cos(angle) * speed, Math.sin(angle) * speed);
}

/**
 * 플로우 필드를 거꾸로 거슬러 적을 플레이어에게서 멀어지게 합니다.
 *
 * 추격에 쓰는 필드를 그대로 씁니다. 걸음 수가 '작아지는' 이웃으로 가면 다가가는 것이니,
 * '커지는' 이웃으로 가면 멀어집니다. 도망을 위해 따로 계산할 것이 없습니다.
 *
 * 여기서 벽을 피하는 판정을 따로 하지 않는 것은, 플로우 필드가 이미 통행 가능한 칸에만
 * 값을 채워 두었기 때문입니다. UNREACHABLE 인 이웃은 벽이거나 닿을 수 없는 곳입니다.
 * @param {object} enemy - 이동시킬 적
 * @param {number} dtFactor - 프레임 시간 보정값
 * @returns {boolean} 물러날 칸을 찾았으면 true, 막다른 곳이면 false
 */
function fleeAlongFlowField(enemy, dtFactor) {
    const width = C.MAP_WIDTH;
    const tileX = Math.floor(enemy.x / C.TILE_SIZE);
    const tileY = Math.floor(enemy.y / C.TILE_SIZE);
    if (tileX < 0 || tileY < 0 || tileX >= width || tileY >= C.MAP_HEIGHT) return false;

    // 도망도 자기 길을 봅니다. 문을 못 여는 짐승이 문 쪽으로 도망가면
    // 막다른 곳에 몰린 것과 같아집니다.
    const field = ensureFlowField(!!enemy.flies, !!enemy.canOpenDoors);

    const here = field[tileY * width + tileX];
    if (here === UNREACHABLE) return false;

    // 걸음 수가 더 큰 이웃 = 플레이어에게서 더 먼 칸
    let bestNode = -1;
    let bestDistance = here;
    for (let d = 0; d < 4; d++) {
        const nx = tileX + (d === 2 ? 1 : d === 3 ? -1 : 0);
        const ny = tileY + (d === 0 ? 1 : d === 1 ? -1 : 0);
        if (nx < 0 || ny < 0 || nx >= width || ny >= C.MAP_HEIGHT) continue;

        const neighbour = ny * width + nx;
        const distance = field[neighbour];
        if (distance !== UNREACHABLE && distance > bestDistance) {
            bestDistance = distance;
            bestNode = neighbour;
        }
    }
    if (bestNode < 0) return false; // 사방이 플레이어에게 더 가깝습니다. 몰렸습니다.

    const targetX = (bestNode % width) * C.TILE_SIZE + C.TILE_SIZE / 2;
    const targetY = ((bestNode / width) | 0) * C.TILE_SIZE + C.TILE_SIZE / 2;
    const angle = Math.atan2(targetY - enemy.y, targetX - enemy.x);
    const speed = effectiveSpeed(enemy) * dtFactor;

    // 좌표를 직접 옮기지 않고 moveEnemyBy 를 거칩니다.
    // 그래야 문 앞에서 문을 열고, 여는 연출도 함께 나갑니다.
    moveEnemyBy(enemy, Math.cos(angle) * speed, Math.sin(angle) * speed);
    return true;
}

// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 지정된 맵 좌표가 통과 가능한지 (벽이 아니고, 단단한 오브젝트가 없는지) 확인합니다.
 * @param {number} x - 맵 타일 X 좌표
 * @param {number} y - 맵 타일 Y 좌표
 * @returns {boolean} 통과 가능하면 true
 */
function isPassable(x, y, flying = false, canOpen = false) {
    // 1. 지형이 통행을 막는지 확인 (맵 밖은 벽으로 취급됩니다)
    const tile = C.tileAt(world.map, x, y);
    if (tile.solid) {
        // 깊은 물과 용암은 나는 것만 건넙니다.
        //
        // 이 규칙이 생기면서 flies 깃발이 처음으로 뜻을 갖습니다. 182종이
        // 갖고 있는데 지금까지 아무 일도 하지 않았습니다. 무시할 지형이
        // 없었기 때문입니다. 이제 물 건너의 적은 '날 수 있는가'로 갈립니다.
        if (!(flying && tile.crossableByFlight)) return false;
    }

    // 2. 오브젝트 맵에 'solid' 속성을 가진 오브젝트가 있는지 확인
    const objectId = world.objectMap[y]?.[x];
    if (objectId > 0) {
        const objectType = C.OBJECT_TYPES[objectId];
        if (objectType && objectType.solid) {
            // 닫힌 문은 열 줄 아는 것에게는 길입니다.
            //
            // 이것이 없으면 문이 몬스터에게 벽과 같아, 문 하나로 나뉜 방은
            // 영영 서로 닿지 않습니다. 원본에서는 물건을 다룰 줄 아는
            // 몬스터가 문을 엽니다. 짐승과 언데드는 열지 못해
            // 문이 실제로 벽 노릇을 합니다. (mon-util.cc:3836)
            if (canOpen && objectType.interactive) return true;
            return false;
        }
    }

    return true;
}

/**
 * 두 월드 좌표 사이에 시야가 통하는지(벽에 가리지 않는지) 검사합니다.
 * render.js의 castRay와 동일한 DDA 방식으로 타일 격자를 훑되, 렌더러에 의존하지 않도록
 * 게임 로직 쪽에 독립적으로 구현했습니다. 벽 판정 기준(map 값이 0보다 큼)도 castRay와 동일하게 맞춰,
 * "화면에 벽으로 보이는 것은 총알도 막는다"는 규칙이 성립하도록 합니다.
 * @param {number} x1 - 시작 월드 X 좌표
 * @param {number} y1 - 시작 월드 Y 좌표
 * @param {number} x2 - 목표 월드 X 좌표
 * @param {number} y2 - 목표 월드 Y 좌표
 * @returns {boolean} 시야가 통하면 true
 */
export function hasLineOfSight(x1, y1, x2, y2) {
    const posX = x1 / C.TILE_SIZE, posY = y1 / C.TILE_SIZE;
    const dx = x2 - x1, dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return true;

    const dirX = dx / dist, dirY = dy / dist;
    let mapX = Math.floor(posX), mapY = Math.floor(posY);
    const targetX = Math.floor(x2 / C.TILE_SIZE), targetY = Math.floor(y2 / C.TILE_SIZE);

    // 같은 칸 안에 있으면 사이를 막을 것이 없습니다.
    // 아래 반복문은 한 칸 옮긴 뒤에 도착 여부를 보기 때문에, 이 경우를 먼저 걸러내지 않으면
    // 출발 칸을 그냥 지나쳐 영영 목표에 닿지 못합니다. (코앞의 적을 못 맞히게 됩니다.)
    if (mapX === targetX && mapY === targetY) return true;

    // 광선이 X축/Y축 격자선을 하나 넘을 때마다 이동하는 거리
    const deltaDistX = dirX === 0 ? Infinity : Math.abs(1 / dirX);
    const deltaDistY = dirY === 0 ? Infinity : Math.abs(1 / dirY);

    let stepX, sideDistX, stepY, sideDistY;
    if (dirX < 0) { stepX = -1; sideDistX = (posX - mapX) * deltaDistX; }
    else { stepX = 1; sideDistX = (mapX + 1 - posX) * deltaDistX; }
    if (dirY < 0) { stepY = -1; sideDistY = (posY - mapY) * deltaDistY; }
    else { stepY = 1; sideDistY = (mapY + 1 - posY) * deltaDistY; }

    // 목표 타일에 도달하면 반드시 종료되지만, 부동소수점 오차로 인한 무한 루프를 막기 위해
    // 맵 대각선 길이를 넘어서는 탐색은 강제로 중단합니다.
    const maxSteps = C.MAP_WIDTH + C.MAP_HEIGHT;
    for (let i = 0; i < maxSteps; i++) {
        if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; }
        else { sideDistY += deltaDistY; mapY += stepY; }

        // 목표 타일에 도착했다면 도중에 막힌 벽이 없었다는 뜻입니다.
        if (mapX === targetX && mapY === targetY) return true;

        // 시야를 막는가만 봅니다. 막혀 있어도 보이는 타일(쇠창살)은 여기를 지나갑니다.
        // 맵 밖도 벽으로 취급되므로 함께 걸러집니다.
        if (C.tileAt(world.map, mapX, mapY).opaque) return false;
    }
    return false;
}

/**
 * 플레이어의 이동 입력을 받아 실제 위치를 업데이트하고 벽/오브젝트 충돌을 처리합니다.
 * @param {number} dtFactor - 프레임 시간 보정값
 */
function handlePlayerMovement(dtFactor) {
    const player = world.player;
    const move = getPlayerMovement(); // input.js에서 현재 입력 상태 가져오기
    runtime.isMoving = move.forward !== 0 || move.strafe !== 0;

    // 목표 bobbing(화면 흔들림) 오프셋 계산 (움직일 땐 sin/cos 값, 멈췄을 땐 0)
    const targetBobbingOffset = runtime.isMoving ? Math.sin(runtime.bobbingAngle) * C.BOB_AMOUNT : 0;
    const targetBobbingOffsetX = runtime.isMoving ? Math.cos(runtime.bobbingAngle * 0.5) * C.BOB_AMOUNT_X : 0; // 좌우 흔들림 추가 (속도를 다르게 하여 자연스럽게)

    // Lerp(선형 보간)를 사용하여 현재 오프셋에서 목표 오프셋으로 부드럽게 전환
    runtime.bobbingOffset += (targetBobbingOffset - runtime.bobbingOffset) * 0.1 * dtFactor;
    runtime.bobbingOffsetX += (targetBobbingOffsetX - runtime.bobbingOffsetX) * 0.1 * dtFactor;

    if (runtime.isMoving) {
        let { forward, strafe } = move;

        // 대각선 이동 시 속도가 빨라지는 것을 방지하기 위해 이동 벡터를 정규화합니다.
        const magnitude = Math.hypot(forward, strafe);
        if (magnitude > 1) {
            forward /= magnitude;
            strafe /= magnitude;
        }

        runtime.bobbingAngle += C.BOB_SPEED * dtFactor; // 화면 흔들림 각도 업데이트
        // 스프리건은 빠르고 나가는 느립니다. 케이브리아도스를 섬기면 더 느려집니다.
        // 감속에 걸리면 느려집니다. 원본의 마비와 달리 조작을 빼앗지 않아
        // 살아남을 수 있고, 대신 길을 다시 짜게 만듭니다.
        const slowScale = playerHasDebuff('slow') ? C.SLOW_SPEED_SCALE : 1;
        const moveSpeed = C.MOVE_SPEED * slowScale * dtFactor
            * A.buffModifier('speedMultiplier', 1) * characterModifier('moveSpeed');
        // 플레이어 시야 방향을 기준으로 한 이동 벡터 계산 (전진/후진, 좌/우)
        const moveX = (Math.cos(player.angle) * forward - Math.sin(player.angle) * strafe) * moveSpeed;
        const moveY = (Math.sin(player.angle) * forward + Math.cos(player.angle) * strafe) * moveSpeed;

        const nextX = player.x + moveX;
        const nextY = player.y + moveY;

        // isPassable 함수를 사용하여 벽과 단단한 오브젝트와의 충돌을 한 번에 처리합니다.
        if (isPassable(Math.floor(nextX / C.TILE_SIZE), Math.floor(player.y / C.TILE_SIZE))) {
            player.x = nextX;
        }
        if (isPassable(Math.floor(player.x / C.TILE_SIZE), Math.floor(nextY / C.TILE_SIZE))) {
            player.y = nextY;
        }
    }
}

/**
 * 모든 적의 AI 로직(이동, 공격)을 업데이트합니다.
 * @param {number} now - 현재 타임스탬프
 * @param {number} dtFactor - 프레임 시간 보정값
 */
function updateEnemies(now, dtFactor) {
    const player = world.player;

    // 모든 적이 같은 목표(플레이어)를 향하므로 경로는 프레임당 한 번만 계산하면 됩니다.
    ensureFlowField();

    // 소환으로 배열이 늘어날 수 있으므로 길이를 미리 고정해 순회합니다.
    // 이번 프레임에 태어난 하수인은 다음 프레임부터 움직입니다.
    const count = world.enemies.length;
    for (let i = 0; i < count; i++) {
        const enemy = world.enemies[i];
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.hypot(dx, dy);

        // 세이브에 state 가 없던 시절의 적은 추격으로 봅니다.
        const state = ENEMY_STATES[enemy.state] ?? ENEMY_STATES.chase;

        // 보이는 동안에는 기억이 계속 새로 채워집니다.
        // 시야가 끊긴 뒤부터 잊기까지의 시간이 지능에 따라 갈립니다.
        if (enemy.state !== 'idle') {
            if (noticesPlayer(enemy, distance)) rousePlayerHunt(enemy, now);
            else if (now > (enemy.huntUntil ?? 0)) {
                enemy.state = 'idle';
                continue;
            }
        }

        // 정신없이 나는 적은 방향이 정해져 있지 않으면 새로 뽑습니다.
        if (enemy.state === 'erratic' && now >= (enemy.erraticUntil ?? 0)) {
            scatterErratic(enemy, now);
        }

        const context = { now, dtFactor, player, distance, dx, dy };

        // 움직인 뒤 행동하고, 마지막에 다음 상태를 정합니다.
        // 상태 전이를 끝에 두어야 이번 스텝의 행동이 항상 한 상태 안에서 일어납니다.
        state.move(enemy, dtFactor, context);

        // 주문을 먼저 시도합니다. 성공하면 이번 차례의 평소 행동은 건너뜁니다.
        // 실패는 공짜라서(원본도 기력을 쓰지 않습니다) 그대로 때리러 갑니다.
        // 잠들어 있는 동안에는 시전하지 않습니다.
        const cast = enemy.state !== 'idle' && tryCastSpell(enemy, context);
        if (!cast) state.act(enemy, context);
        enemy.state = state.next(enemy, context);
    }

    // 걸음을 다 옮긴 뒤에 겹친 것을 풉니다.
    // 이동 중에 풀면 아직 움직이지 않은 적을 기준으로 밀어내게 되어,
    // 배열 순서에 따라 결과가 달라집니다.
    separateEnemies(dtFactor);
}

/**
 * 겹쳐 선 적들을 서로 밀어냅니다.
 *
 * 모든 적이 같은 플로우 필드를 따르고 그 필드가 네 방향만 보므로, 다들 같은 타일 중심을
 * 향해 걷습니다. 밀어내지 않으면 플레이어 앞에서 여러 마리가 한 점에 겹쳐 한 마리처럼
 * 보이고, 무엇을 상대하고 있는지 알 수 없게 됩니다.
 *
 * 모든 쌍을 보는 O(n²)입니다. 적은 층당 최대 서른 마리이므로 스텝당 435쌍이고,
 * 이 규모에서는 공간 분할을 두는 것이 오히려 손해입니다.
 * @param {number} dtFactor - 프레임 시간 보정값
 */
function separateEnemies(dtFactor) {
    const enemies = world.enemies;
    const strength = C.ENEMY_SEPARATION_STRENGTH * dtFactor;

    for (let i = 0; i < enemies.length; i++) {
        const a = enemies[i];
        for (let j = i + 1; j < enemies.length; j++) {
            const b = enemies[j];

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const minGap = ((a.size + b.size) / 2) * C.ENEMY_SEPARATION_RANGE;
            const gapSq = dx * dx + dy * dy;
            if (gapSq >= minGap * minGap) continue;

            // 완전히 같은 자리에 선 경우에는 밀어낼 방향이 없습니다.
            // 배열 순서로 방향을 정해 좌우로 갈라 세웁니다. 무작위를 쓰면
            // 같은 세이브를 불러올 때마다 결과가 달라집니다.
            let gap = Math.sqrt(gapSq);
            let nx, ny;
            if (gap < 1e-6) {
                const angle = (i * 2.399963) + (j * 0.5);   // 황금각으로 고르게 흩뿌립니다
                nx = Math.cos(angle);
                ny = Math.sin(angle);
                gap = 0;
            } else {
                nx = dx / gap;
                ny = dy / gap;
            }

            // 겹친 만큼을 둘이 절반씩 나눠 물러납니다.
            const push = ((minGap - gap) / 2) * strength;
            moveEnemyBy(a, -nx * push, -ny * push);
            moveEnemyBy(b, nx * push, ny * push);
        }
    }
}

/**
 * 적을 밀어냅니다. 벽을 뚫지 않도록 축을 나눠 각각 확인합니다.
 * 한 축이 막혀도 다른 축으로는 미끄러지므로, 벽에 붙은 적끼리도 옆으로 벌어집니다.
 * @param {object} enemy - 밀어낼 적
 * @param {number} dx - X 방향 이동량
 * @param {number} dy - Y 방향 이동량
 */
function moveEnemyBy(enemy, dx, dy) {
    const canOpen = !!enemy.canOpenDoors;

    const nextX = enemy.x + dx;
    const tileX = Math.floor(nextX / C.TILE_SIZE);
    if (isPassable(tileX, Math.floor(enemy.y / C.TILE_SIZE), !!enemy.flies, canOpen)) {
        openDoorIfBlocking(tileX, Math.floor(enemy.y / C.TILE_SIZE), canOpen);
        enemy.x = nextX;
    }

    const nextY = enemy.y + dy;
    const tileY = Math.floor(nextY / C.TILE_SIZE);
    if (isPassable(Math.floor(enemy.x / C.TILE_SIZE), tileY, !!enemy.flies, canOpen)) {
        openDoorIfBlocking(Math.floor(enemy.x / C.TILE_SIZE), tileY, canOpen);
        enemy.y = nextY;
    }
}

/**
 * 들어서려는 칸에 닫힌 문이 있으면 엽니다.
 *
 * 플레이어와 같은 경로를 씁니다. 그래야 문이 올라가는 연출도 같이 나갑니다.
 * 예전에는 문을 여는 곳이 플레이어의 상호작용 하나뿐이라, 몬스터는 문을
 * 아예 지나지 못했습니다. 문 하나로 나뉜 방은 서로 영영 닿지 않았습니다.
 * @param {number} tileX - 타일 X
 * @param {number} tileY - 타일 Y
 * @param {boolean} canOpen - 이 몬스터가 문을 열 줄 아는가
 */
function openDoorIfBlocking(tileX, tileY, canOpen) {
    if (!canOpen) return;

    const objectId = world.objectMap[tileY]?.[tileX];
    if (!objectId) return;

    const objectType = C.OBJECT_TYPES[objectId];
    if (objectType?.name !== 'Door') return;

    A.openDoor(tileX, tileY);
}

/**
 * 모든 발사체의 위치를 업데이트하고 충돌(벽, 플레이어)을 처리합니다.
 * @param {number} dtFactor - 프레임 시간 보정값
 */
function updateProjectiles(dtFactor) {
    const player = world.player;

    // 배열을 순회하면서 요소를 제거(splice)할 때는 역순으로 순회해야 인덱스 오류를 피할 수 있습니다.
    for (let i = world.projectiles.length - 1; i >= 0; i--) {
        const proj = world.projectiles[i];
        proj.x += Math.cos(proj.angle) * proj.speed * dtFactor;
        proj.y += Math.sin(proj.angle) * proj.speed * dtFactor;

        // 막힌 곳에 부딪히면 발사체가 터집니다.
        //
        // 막는 것이 곧 쏘는 것을 막는 것은 아닙니다. 쇠창살은 사이로 쏠 수 있고
        // 유리벽은 못 쏩니다. 둘 다 보이지만 대응이 갈립니다.
        //
        // 예전에는 '보이지 않는 것'(opaque)에 부딪혔습니다. 벽이 둘 다이던 때는
        // 같은 뜻이었지만, 보이면서 막는 타일(쇠창살)이 생기면 화살이 창살을
        // 그대로 지나갑니다. 막는가와 보이는가는 다른 축입니다.
        if (C.tileAt(world.map, Math.floor(proj.x / C.TILE_SIZE), Math.floor(proj.y / C.TILE_SIZE)).blocksShots !== false
            && C.tileAt(world.map, Math.floor(proj.x / C.TILE_SIZE), Math.floor(proj.y / C.TILE_SIZE)).solid) {
            const sheetKey = assets.spriteKeyToSheet[proj.spriteKey];
            const atlas = assets.spriteAtlases[sheetKey];
            const color = atlas?.sprites[proj.spriteKey]?.color || '#fff';
            createParticleExplosion(proj.x, proj.y, color);
            world.projectiles.splice(i, 1);
            continue; // 다음 발사체로 넘어감
        }

        // 플레이어와 충돌하면 발사체를 제거하고 플레이어에게 피해를 줍니다.
        if (proj.from === 'enemy' && Math.hypot(player.x - proj.x, player.y - proj.y) < player.size / 2) {
            A.damagePlayer(proj.damage, proj);
            world.projectiles.splice(i, 1);
        }
    }
}

/**
 * 플레이어와 아이템 간의 거리를 확인하고 아이템을 획득(사용)합니다.
 */
function handleItemPickup() {
    const player = world.player;

    for (let i = world.items.length - 1; i >= 0; i--) {
        const item = world.items[i];
        if (Math.hypot(player.x - item.x, player.y - item.y) < player.size) {
            A.pickUpItemAt(i);
        }
    }
}

/**
 * 체력이 0 이하인 적들을 제거하고, 확률적으로 아이템을 드랍합니다.
 */
function handleEnemyDeaths() {
    for (let i = world.enemies.length - 1; i >= 0; i--) {
        const enemy = world.enemies[i];

        // 불려 나온 것은 시간이 다하면 사라집니다.
        //
        // 이 규칙이 있어야 '부른 놈을 먼저 잡으면 무리가 줄어든다'는 판단이 생깁니다.
        // 영원히 남으면 소환자를 무시하고 눈앞의 것부터 치우는 편이 언제나 낫습니다.
        // 사라지는 것은 죽는 것과 달라서 경험치도 전리품도 남기지 않습니다.
        if (enemy.summonedUntil !== undefined && world.time >= enemy.summonedUntil) {
            A.dismissEnemyAt(i);
            continue;
        }

        if (enemy.hp <= 0) A.killEnemyAt(i);
    }
}

/**
 * 플레이어와 충분히 떨어져 있고 벽이 아닌 타일을 찾아 스폰 지점으로 반환합니다.
 * 무작위 탐색이 실패할 수 있는 좁은 맵에서도 반드시 값을 반환하도록 폴백 경로를 갖습니다.
 * @returns {{x: number, y: number}} 스폰할 월드 좌표
 */
/**
 * 그 칸까지 플레이어가 걸어갈 수 있는지 봅니다.
 *
 * 플로우 필드를 그대로 씁니다. 그것이 이미 플레이어에게서 걸어갈 수 있는 칸을
 * 전부 표시해 둔 것이라, 따로 탐색을 돌릴 필요가 없습니다.
 *
 * 이 검사가 없어서 적의 4%가 갈 수 없는 곳에 스폰되고 있었습니다.
 * 30x30 에서는 갇힌 구역이 거의 안 생겨 드러나지 않다가,
 * 맵을 80x70 으로 키우자 나타났습니다. 층을 다 뒤져도 찾을 수 없는 적이
 * 남으면 마지막 한 마리를 찾아 헤매게 됩니다.
 * @param {number} mapX - 타일 X
 * @param {number} mapY - 타일 Y
 * @returns {boolean} 갈 수 있으면 true
 */
function reachableByPlayer(mapX, mapY) {
    // 플레이어 기준입니다. 플레이어는 날지 못하고 문은 엽니다.
    const field = ensureFlowField(false, true);
    if (!field) return true;   // 아직 없으면 막지 않습니다
    return field[mapY * C.MAP_WIDTH + mapX] !== UNREACHABLE;
}

function findSpawnPoint() {
    const player = world.player;
    const minDistance = C.TILE_SIZE * C.SPAWN_MIN_DISTANCE_TILES;

    // 1. 조건을 만족하는 지점을 무작위로 탐색합니다. (대부분의 경우 몇 번 안에 성공)
    for (let attempt = 0; attempt < C.SPAWN_MAX_ATTEMPTS; attempt++) {
        const x = Math.random() * C.MAP_WIDTH * C.TILE_SIZE;
        const y = Math.random() * C.MAP_HEIGHT * C.TILE_SIZE;
        const mapX = Math.floor(x / C.TILE_SIZE);
        const mapY = Math.floor(y / C.TILE_SIZE);

        if (C.tileAt(world.map, mapX, mapY).spawnable
            && reachableByPlayer(mapX, mapY)
            && Math.hypot(x - player.x, y - player.y) >= minDistance) {
            return { x, y };
        }
    }

    // 2. 폴백: 조건을 만족하는 칸이 거의 없는 좁은 맵일 수 있으므로,
    //    바닥 타일을 전수 조사해 플레이어에게서 가장 먼 칸을 선택합니다.
    //    (기존의 do...while 방식은 이 상황에서 브라우저를 멈추게 했습니다.)
    let bestPoint = null;
    let bestDistance = -1;
    for (let mapY = 0; mapY < world.map.length; mapY++) {
        for (let mapX = 0; mapX < world.map[mapY].length; mapX++) {
            if (!C.tileAt(world.map, mapX, mapY).spawnable) continue;
            // 폴백에서도 갈 수 있는지 봐야 합니다. 여기를 빼먹어서
            // 무작위 탐색만 고쳤을 때 갈 수 없는 적이 그대로 남았습니다.
            if (!reachableByPlayer(mapX, mapY)) continue;
            const x = mapX * C.TILE_SIZE + C.TILE_SIZE / 2;
            const y = mapY * C.TILE_SIZE + C.TILE_SIZE / 2;
            const distance = Math.hypot(x - player.x, y - player.y);
            if (distance > bestDistance) {
                bestDistance = distance;
                bestPoint = { x, y };
            }
        }
    }

    if (bestPoint) {
        console.warn('Failed to find a random spawn point. Falling back to the farthest floor tile.');
        return bestPoint;
    }

    // 3. 바닥 타일이 하나도 없는 비정상적인 맵. 최후의 수단으로 플레이어 위치를 반환합니다.
    console.error('No valid spawn point exists on this map. Spawning at the player position.');
    return { x: player.x, y: player.y };
}

/**
 * 모든 파티클의 위치를 업데이트하고 수명을 관리합니다.
 * @param {number} dtFactor - 프레임 시간 보정값
 */
function updateParticles(dtFactor) {
    for (let i = world.particles.length - 1; i >= 0; i--) {
        const p = world.particles[i];
        p.x += p.vx * dtFactor;
        p.y += p.vy * dtFactor;
        p.z += p.vz * dtFactor;
        p.vz -= C.PARTICLE_GRAVITY * dtFactor; // 중력 적용
        p.lifespan -= dtFactor;

        // 막힌 곳에 부딪히면 튕깁니다. 보이는가가 아니라 막는가를 봅니다.
        if (C.tileAt(world.map, Math.floor(p.x / C.TILE_SIZE), Math.floor(p.y / C.TILE_SIZE)).solid) {
            p.vx *= -0.5;
            p.vy *= -0.5;
        }
        // 바닥과 충돌 시 튕김
        if (p.z <= 0) {
            p.z = 0;
            p.vz *= -0.5;
        }

        if (p.lifespan <= 0) {
            world.particles.splice(i, 1); // 수명이 다한 파티클 제거
        }
    }
}

/**
 * 지정된 위치에 여러 개의 파티클을 생성하여 폭발 효과를 만듭니다.
 * @param {number} x - 생성 x 좌표
 * @param {number} y - 생성 y 좌표
 * @param {string} color - 파티클 색상
 */
function createParticleExplosion(x, y, color = '#ffffff') {
    const count = 10; // 생성할 파티클 수
    for (let i = 0; i < count; i++) {
        world.particles.push({
            isParticle: true,
            x: x,
            y: y,
            z: C.TILE_SIZE / 4 + Math.random() * C.TILE_SIZE / 4, // 약간 위에서 생성
            vx: (Math.random() - 0.5) * 2, // x축 속도 (무작위)
            vy: (Math.random() - 0.5) * 2, // y축 속도 (무작위)
            vz: (Math.random() * 2),       // z축 속도 (위로 솟구침)
            lifespan: 20 + Math.random() * 20, // 수명 (무작위)
            color: color,
            size: 2 + Math.random() * 2 // 크기 (무작위)
        });
    }
}

/**
 * 애니메이션 중인 벽(예: 열리는 문)의 상태를 매 프레임 업데이트합니다.
 * @param {number} now - 현재 타임스탬프 (Date.now())
 */
function updateAnimatedWalls(now) {
    for (let i = world.animatedWalls.length - 1; i >= 0; i--) {
        const wall = world.animatedWalls[i];
        const elapsedTime = now - wall.startTime;
        const progress = Math.min(elapsedTime / wall.duration, 1);

        const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        wall.z = C.TILE_SIZE * easedProgress; // Z좌표를 업데이트하여 위로 올립니다.

        if (progress >= 1) {
            // 애니메이션이 끝나면 맵에서 해당 타일을 완전히 비워버립니다.
            world.map[wall.mapY][wall.mapX] = C.TILE_IDS.FLOOR;
            world.mapRevision++; // 통행 가능 여부가 바뀌었으므로 경로를 다시 계산해야 합니다.
            // 애니메이션 배열에서 제거합니다.
            world.animatedWalls.splice(i, 1);
        }
    }
}

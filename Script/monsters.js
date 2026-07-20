/**
 * @fileoverview DCSS 몬스터를 이 게임이 쓰는 형태로 옮깁니다.
 *
 * 수치는 Script/data/monsters.js 에 있고 그것은 DCSS 0.34 의 YAML 에서 나옵니다.
 * 이 파일이 하는 일은 그 수치를 실시간 FPS 의 단위로 바꾸는 환산입니다.
 *
 *   DCSS                     이 게임
 *   hp_10x                   스폰할 때 굴려서 정하는 HP (combat.rollMonsterHp)
 *   speed 10                 초당 두 번 행동. dcss/time.js 의 aut 매핑을 따릅니다
 *   attacks[].damage         공격 한 번의 피해 상한
 *   size 범주                충돌 반지름(픽셀)
 *   ac / ev                  전투 계산에 그대로 쓰입니다
 *
 * 어느 층에 무엇이 나오는가는 여기가 아니라 출현표가 정합니다.
 * (Script/data/spawn-tables.js, dcss/monster-pick.js)
 * 예전에는 tier 라는 자체 값으로 대충 정했는데, 이제 DCSS 의 난이도 곡선을 그대로 씁니다.
 */

import { MONSTER_DATA } from './data/monsters.js';
import { SPAWN_TABLES } from './data/spawn-tables.js';
import { TILE_SIZE, REFERENCE_FRAME_MS } from './constants.js';
import { monsterActionMs, monsterActionAuts, AUT_MS, canAct } from './dcss/time.js';
import { pickMonster } from './dcss/monster-pick.js';

/**
 * @description DCSS 의 글리프 색 이름을 실제 색으로 옮긴 표.
 * 그림이 없는 몬스터를 글리프로 그릴 때와, 피격 파티클 색으로 씁니다.
 */
const GLYPH_COLOURS = {
    black: '#4a4a4a', blue: '#3a3ac8', green: '#2f9c3a', cyan: '#2f9c9c',
    red: '#a83232', magenta: '#a832a8', brown: '#9a8f86', lightgrey: '#c8c8c0',
    darkgrey: '#74747c', lightblue: '#6a8fd8', lightgreen: '#5fd05f',
    lightcyan: '#5fd0d0', lightred: '#e05f5f', lightmagenta: '#d05fd0',
    yellow: '#d8c070', white: '#f0f0f0',
};

/**
 * @description 몬스터가 어떻게 싸우는지.
 *
 * DCSS 에서 이것은 주문 목록과 여러 깃발에서 나오는데, 주문을 아직 옮기지 않았습니다.
 * 그래서 지금은 근접이 기본이고, 확실한 것만 여기에 적어 둡니다.
 * 주문을 옮기면 이 표는 사라지고 데이터에서 나오게 됩니다.
 */
const BEHAVIOR_OVERRIDES = {
    centaur: 'ranged', 'centaur-warrior': 'ranged', yaktaur: 'ranged',
    'yaktaur-captain': 'ranged', 'naga-sharpshooter': 'ranged',
    'merfolk-javelineer': 'ranged', wraith: 'ranged', 'orc-priest': 'ranged',

    'ballistomycete-spore': 'exploder', 'bomblet': 'exploder',
    simulacrum: 'exploder', 'fire-vortex': 'exploder',

    'ironbound-convoker': 'summoner', menkaure: 'summoner',
    'deep-elf-demonologist': 'summoner', rakshasa: 'summoner',
};

/**
 * @description 겁을 먹는 몬스터와 그 기준.
 *
 * DCSS 에는 이런 값이 없습니다. 도망은 이 게임이 더한 것이라 여기서 정합니다.
 * 언데드·구조물·악마처럼 겁먹는 것이 어색한 쪽에는 넣지 않습니다.
 */
const FLEE_BELOW = {
    rat: 0.35, 'river-rat': 0.35, bat: 0.4, 'vampire-bat': 0.35,
    kobold: 0.3, 'kobold-brigand': 0.3, goblin: 0.3, hobgoblin: 0.3,
    gnoll: 0.25, jackal: 0.35, quokka: 0.4, frilled_lizard: 0.4,
    adder: 0.25, 'ball-python': 0.3, snake: 0.25, frog: 0.25, bullfrog: 0.25,
    centaur: 0.4, spider: 0.25, 'jumping-spider': 0.3,
    orc: 0.2, 'orc-wizard': 0.35, 'orc-priest': 0.3,
};

/**
 * @description 던전 가지 식별 기호를 DCSS 출현표 이름으로 잇는 표.
 * branches.js 는 DCSS 관례대로 한 글자를 쓰고, 출현표는 이름을 씁니다.
 */
const BRANCH_TABLE_NAMES = {
    D: 'Dungeon', T: 'Temple', L: 'Lair', S: 'Swamp', A: 'Shoals',
    P: 'Snake Pit', N: 'Spider Nest', M: 'Slime Pits', O: 'Orcish Mines',
    E: 'Elven Halls', V: 'The Vaults', C: 'Crypt', W: 'Tomb',
    U: 'Depths', H: 'Hell', Z: 'Zot',
};

/**
 * DCSS 의 speed 를 이 게임의 이동 속도(기준 프레임당 픽셀)로 바꿉니다.
 *
 * speed 10 은 10 aut 에 한 칸입니다. aut 하나가 50ms 이므로 0.5초에 32픽셀,
 * 기준 프레임(16.67ms)으로는 약 1.07픽셀이 됩니다.
 * 손으로 정하던 옛 값들이 1.0 안팎이었던 것과 우연히 잘 맞습니다.
 * @param {number} dcssSpeed - YAML 의 speed
 * @returns {number} 기준 프레임당 이동 픽셀
 */
function toMoveSpeed(dcssSpeed) {
    if (!canAct(dcssSpeed)) return 0;
    return (TILE_SIZE / (monsterActionAuts(dcssSpeed) * AUT_MS)) * REFERENCE_FRAME_MS;
}

/**
 * DCSS 몬스터 하나를 이 게임의 정의로 옮깁니다.
 * @param {object} data - data/monsters.js 의 항목
 * @returns {object} 게임이 쓰는 몬스터 정의
 */
function toRuntimeMonster(data) {
    const attack = data.attacks[0];

    return {
        id: data.id,
        enumName: data.enumName,
        name: data.name,

        // DCSS 에는 '분류용 자리표시자'가 섞여 있습니다. bear·dragon·snake 처럼
        // HD 도 공격도 0 인 항목들로, 실제로 나오는 몬스터가 아니라
        // 다형변신이나 무작위 하위 종류를 고를 때 쓰는 이름입니다.
        // 그대로 스폰하면 HP 0 으로 태어나 즉사합니다.
        spawnable: data.hp10x > 0 && data.attacks.length > 0,

        // 전투. DCSS 수치를 그대로 씁니다.
        hp10x: data.hp10x,
        hd: data.hd,
        ac: data.ac,
        ev: data.ev,
        will: data.will,
        exp: data.exp,
        damage: attack ? attack.damage : 0,
        attackType: attack ? attack.type : null,

        // 시간. aut 을 실시간으로 환산합니다.
        dcssSpeed: data.speed,
        speed: toMoveSpeed(data.speed),

        // 움직이지 않는 몬스터에 Infinity 를 담으면 안 됩니다.
        // world 는 JSON 으로 저장되는데 JSON.stringify(Infinity) 는 null 이 되어,
        // 세이브를 불러오는 순간 쿨다운 비교가 통째로 무너집니다.
        // 대신 canAct 로 표시하고 쿨다운은 유한한 값으로 둡니다.
        canAct: canAct(data.speed),
        cooldown: canAct(data.speed) ? monsterActionMs(data.speed) : 0,

        // 표현
        size: data.sizePixels,
        glyph: data.glyph,
        color: GLYPH_COLOURS[data.colour] ?? GLYPH_COLOURS.lightgrey,
        spriteKey: data.spriteKey,

        // 행동
        behavior: BEHAVIOR_OVERRIDES[data.id] ?? 'melee',
        fleeBelow: FLEE_BELOW[data.id],

        // 원거리·자폭·소환에 필요한 값. 아직 DCSS 주문을 옮기지 않아 여기서 정합니다.
        ...behaviorExtras(BEHAVIOR_OVERRIDES[data.id], data),
    };
}

/**
 * 행동 방식별로 필요한 추가 값을 만듭니다.
 * @param {string|undefined} behavior - 행동 방식
 * @param {object} data - 몬스터 데이터
 * @returns {object} 추가 값
 */
function behaviorExtras(behavior, data) {
    switch (behavior) {
        case 'ranged':
            return { projectileSpeed: 4.5, range: TILE_SIZE * 11 };
        case 'exploder':
            return {
                fuseMs: 800,
                blastRadius: TILE_SIZE * 2,
                blastDamage: Math.max(6, data.attacks[0]?.damage ?? 6),
            };
        case 'summoner':
            return { summonId: 'rat', summonCooldown: 6000, maxSummons: 3 };
        default:
            return {};
    }
}

/** @description id 로 찾을 수 있게 정리한 몬스터 표 */
export const MONSTERS = Object.fromEntries(
    MONSTER_DATA.map(data => [data.id, toRuntimeMonster(data)]));

/** @description 열거형 이름으로 id 를 찾기 위한 역방향 표. 출현표가 열거형을 쓰기 때문입니다. */
const ID_BY_ENUM = Object.fromEntries(
    MONSTER_DATA.map(data => [data.enumName, data.id]));

/**
 * 몬스터 정의를 찾습니다.
 * @param {string} id - 몬스터 id
 * @returns {object|undefined} 정의
 */
export function getMonster(id) {
    return MONSTERS[id];
}

/**
 * 어느 가지의 출현표를 쓸지 정합니다.
 * @param {string} branchId - branches.js 의 가지 식별 기호
 * @returns {object[]} 출현표 항목들. 없으면 메인 던전의 것
 */
export function spawnTableFor(branchId) {
    const name = BRANCH_TABLE_NAMES[branchId];
    const table = name ? SPAWN_TABLES[name] : null;

    // 포탈 던전처럼 DCSS 에 대응하는 표가 없는 곳은 메인 던전 표를 씁니다.
    // 깊이는 호출부가 그 던전의 위험도로 넘겨 주므로 난이도는 맞습니다.
    if (!table || table.entries.length === 0) return SPAWN_TABLES.Dungeon.entries;
    return table.entries;
}

/**
 * 가지와 깊이에 맞는 몬스터를 하나 뽑습니다.
 *
 * 예전에는 tier 라는 자체 값으로 '이 깊이면 이 몬스터들' 정도를 정했습니다.
 * 이제 DCSS 의 출현표를 그대로 써서, 같은 깊이에서 같은 것들이 같은 빈도로 나옵니다.
 * @param {string} branchId - 가지 식별 기호
 * @param {number} depth - 그 가지 안에서의 깊이
 * @returns {string|null} 몬스터 id
 */
export function rollMonsterFor(branchId, depth) {
    const chosen = pickMonster(spawnTableFor(branchId), depth, enumName => {
        // 표에는 있지만 정의가 없는 특수 항목과, 분류용 자리표시자를 걸러냅니다.
        const id = ID_BY_ENUM[enumName];
        return !id || !MONSTERS[id].spawnable;
    });

    return chosen ? ID_BY_ENUM[chosen] : null;
}

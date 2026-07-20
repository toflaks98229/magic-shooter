/**
 * @fileoverview 결정론적 헤드리스 시뮬레이션.
 *
 * 시드 난수와 가상 시계로 게임 루프를 재현하고, 끝에 월드 상태의 스냅샷을 반환합니다.
 * 같은 시드로 몇 번을 돌려도 결과가 완전히 동일하므로, 스냅샷이 바뀌었다는 것은
 * 곧 시뮬레이션 동작이 바뀌었다는 뜻입니다. (regression.test.js가 이를 이용합니다.)
 *
 * 시나리오는 아래 경로를 의도적으로 모두 통과합니다.
 *   이동 4방향 · 벽 충돌 · 시점 회전 · 공격(총→탄약 소진→주먹) · 무기 교체 연출
 *   적 BFS 추적 · 근접/원거리 공격 · 발사체 · 파티클 · 아이템 드랍과 획득
 *   문 열기 2회(애니메이션 벽) · 층 전환 · HUD 갱신
 */

import {
    installBrowserStubs, seedRandom, installClock, advanceClock,
    currentTime, fireDocumentEvent, bindStubDom,
} from './browser-stubs.js';

/** @description 시뮬레이션 시드. 바꾸면 스냅샷도 함께 갱신해야 합니다. */
const SEED = 0x5EED1234;
/** @description 재생할 프레임 수 (60FPS 기준 30초) */
const FRAMES = 1800;
/** @description 한 프레임의 길이(ms) */
const FRAME_MS = 1000 / 60;
/** @description 이동 키를 순환시킬 주기(프레임) */
const PHASE_FRAMES = 150;
/** @description 순환시킬 이동 키 */
const MOVE_KEYS = ['KeyW', 'KeyD', 'KeyS', 'KeyA'];
/** @description 매 프레임 넣을 마우스 이동량(픽셀). 시점이 계속 돌아가게 한다. */
const LOOK_DELTA_PX = 10;

/**
 * 시뮬레이션을 처음부터 실행하고 결과 스냅샷을 반환합니다.
 * @returns {Promise<object>} 월드 상태 스냅샷
 */
export async function runSimulation() {
    installBrowserStubs();
    seedRandom(SEED);
    installClock();

    // 스텁을 세운 뒤에 게임 모듈을 불러와야 window/document 참조가 성립합니다.
    const C = await import('../../Script/constants.js');
    const { world, serializeWorld } = await import('../../Script/world.js');
    const { dom } = await import('../../Script/dom.js');
    const events = await import('../../Script/events.js');
    const actions = await import('../../Script/actions.js');
    const gameLogic = await import('../../Script/gameLogic.js');
    const input = await import('../../Script/input.js');
    const ui = await import('../../Script/ui.js');
    const audio = await import('../../Script/audio.js');
    const { generateDungeon } = await import('../../Script/mapGenerator.js');
    const { advanceSimulation, resetLoop } = await import('../../Script/loop.js');

    bindStubDom(dom);

    // 실제 게임과 동일하게 각 계층을 이벤트에 연결합니다.
    ui.registerUiHandlers();
    audio.registerAudioHandlers();

    const stats = { sounds: 0, gameOvers: 0, floors: 1, attacks: 0, interacts: 0, doorsOpened: 0, hits: 0, kills: 0 };

    // 사운드 재생은 audioCtx가 없어 실제로는 일어나지 않으므로,
    // audio.js의 매핑과 동일한 이벤트를 구독해 '몇 번 울렸어야 하는지'를 센다.
    const E = events.EVENTS;
    for (const type of [E.ENEMY_HIT, E.PLAYER_DAMAGED, E.ITEM_PICKED_UP, E.WEAPON_CHANGED, E.DOOR_OPENED]) {
        events.on(type, () => { stats.sounds++; });
    }
    events.on(E.WEAPON_FIRED, ({ weapon }) => {
        if (C.WEAPONS[weapon]?.sound) stats.sounds++;
    });

    // main.js가 담당하는 흐름 제어를 테스트용으로 대체한다.
    events.on(E.PLAYER_DIED, () => {
        stats.gameOvers++;
        world.player.hp = world.player.maxHp; // 시뮬레이션을 계속 이어가기 위해 부활
    });
    events.on(E.EXIT_REACHED, () => {
        stats.floors++;
        world.floor += 1;
        buildFloor();
    });
    events.on(E.DOOR_OPENED, () => { stats.doorsOpened++; });

    // 공격 '횟수'와 '명중'은 다릅니다. 에임 보정을 걷어낸 뒤 한동안
    // 180번 쏘고도 적이 전부 무손상이었고, 피해와 사망 처리가 회귀 검사에서
    // 통째로 빠져 있었습니다. 그때 아무도 눈치채지 못했으므로 따로 셉니다.
    events.on(E.ENEMY_HIT, () => { stats.hits++; });
    events.on(E.ENEMY_DIED, () => { stats.kills++; });

    function buildFloor() {
        // 레이아웃을 고정합니다. 굴리게 두면 layouts.js 의 가중치를 손볼 때마다
        // 회귀 스냅샷이 통째로 달라져, 정작 무엇이 바뀌었는지 알 수 없게 됩니다.
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, { layout: 'rooms' });
        world.map = dungeon.map;
        world.objectMap = dungeon.objectMap;
        world.player.x = dungeon.playerStart.x * C.TILE_SIZE + C.TILE_SIZE / 2;
        world.player.y = dungeon.playerStart.y * C.TILE_SIZE + C.TILE_SIZE / 2;
        for (const list of [world.enemies, world.items, world.projectiles,
        world.particles, world.animatedObjects, world.animatedWalls]) list.length = 0;
        gameLogic.spawnEnemiesForFloor();
    }

    /**
     * 문 앞에 플레이어를 세우고 상호작용 입력을 넣는다.
     * 무작위 배회만으로는 문을 만나지 못하는 경우가 많아 명시적으로 통과시킨다.
     * 실제 문 열림은 다음 시뮬레이션 스텝에서 입력 큐가 소비될 때 일어난다.
     */
    function aimAtNearestDoor() {
        for (let y = 0; y < world.objectMap.length; y++) {
            for (let x = 0; x < world.objectMap[y].length; x++) {
                if (world.objectMap[y][x] !== 1) continue;
                world.player.x = (x - 1) * C.TILE_SIZE + C.TILE_SIZE / 2; // 문의 서쪽 칸
                world.player.y = y * C.TILE_SIZE + C.TILE_SIZE / 2;
                world.player.angle = 0;                                    // 동쪽을 바라봄
                pressInteract();
                return;
            }
        }
    }

    /**
     * 가장 가까운 적을 정면으로 겨누고 쏜다.
     *
     * 에임 보정을 걷어낸 뒤로는 무작위로 휘둘러서는 아무것도 맞지 않는다.
     * 실제로 180번 쏘고도 적 일곱이 전부 무손상으로 남았다.
     * 그러면 피해 계산과 사망 처리가 회귀 검사에서 통째로 빠지므로,
     * 시나리오가 의도적으로 겨누는 국면을 넣어 그 경로를 지나게 한다.
     */
    function aimAtNearestEnemy() {
        let nearest = null;
        let best = Infinity;
        for (const enemy of world.enemies) {
            const distance = Math.hypot(enemy.x - world.player.x, enemy.y - world.player.y);
            if (distance < best) { best = distance; nearest = enemy; }
        }
        if (!nearest) return;

        world.player.angle = Math.atan2(nearest.y - world.player.y, nearest.x - world.player.x);
        dom.canvas.fire('mousedown');
        stats.attacks++;
    }

    /** 스페이스바를 눌렀다 뗀다. 실제 input.js 경로를 통과해 큐에 쌓인다. */
    function pressInteract() {
        fireDocumentEvent('keydown', { code: 'Space' });
        fireDocumentEvent('keyup', { code: 'Space' });
    }

    input.setupInputHandlers();
    input.clearInputQueue();
    resetLoop();
    actions.setGameRunning(true);
    world.floor = 1;
    buildFloor();

    // 마우스 시점 조작이 동작하려면 포인터가 캔버스에 잠겨 있어야 한다.
    globalThis.document.pointerLockElement = dom.canvas;

    let heldKey = null;
    for (let frame = 0; frame < FRAMES; frame++) {
        // 이동 키를 순환시켜 4방향 이동과 벽 충돌을 모두 통과시킨다.
        const wantKey = MOVE_KEYS[Math.floor(frame / PHASE_FRAMES) % MOVE_KEYS.length];
        if (wantKey !== heldKey) {
            if (heldKey) fireDocumentEvent('keyup', { code: heldKey });
            fireDocumentEvent('keydown', { code: wantKey });
            heldKey = wantKey;
        }

        // 시점 회전·공격·상호작용을 모두 실제 입력 리스너를 통해 넣는다.
        // 이 값들은 즉시 반영되지 않고 큐에 쌓였다가 시뮬레이션 스텝에서 소비된다.
        fireDocumentEvent('mousemove', { movementX: LOOK_DELTA_PX });

        if (frame % 10 === 0) { dom.canvas.fire('mousedown'); stats.attacks++; }
        // 주기적으로 실제로 겨누어, 명중·피해·사망 경로를 지나가게 한다.
        if (frame % 25 === 12) aimAtNearestEnemy();
        if (frame % 97 === 0) { pressInteract(); stats.interacts++; }
        if (frame === 600) aimAtNearestDoor();
        if (frame === 1200) events.emit(E.EXIT_REACHED, { floor: world.floor });
        if (frame === 1210) aimAtNearestDoor();

        advanceClock(FRAME_MS);
        advanceSimulation(FRAME_MS); // 고정 타임스텝 루프를 통과시킨다
        ui.updateHUD();
    }

    return buildSnapshot({ world, serializeWorld, stats });
}

/**
 * 부동소수 오차가 아닌 실제 동작 변화만 잡도록 값을 정리해 스냅샷을 만듭니다.
 * @param {object} context - 시뮬레이션 결과
 * @returns {object} 비교 가능한 스냅샷
 */
function buildSnapshot({ world, serializeWorld, stats }) {
    const round = (n) => Number.isFinite(n) ? Number(n.toFixed(9)) : String(n);
    const checksum = (values) => values.reduce((acc, v, i) => (acc + v * (i + 1)) % 2147483647, 0);

    return {
        frames: FRAMES,
        stats,
        virtualTime: currentTime(),
        gameTime: Number(world.time.toFixed(6)),
        floor: world.floor,
        weapon: world.player.weapon,
        player: {
            x: round(world.player.x),
            y: round(world.player.y),
            angle: round(world.player.angle),
            hp: round(world.player.hp),
            ammo: world.player.ammo,
        },
        counts: {
            enemies: world.enemies.length,
            items: world.items.length,
            projectiles: world.projectiles.length,
            particles: world.particles.length,
            animatedWalls: world.animatedWalls.length,
        },
        enemies: world.enemies.map(e => ({
            sprite: e.spriteKey,
            x: round(e.x), y: round(e.y), hp: round(e.hp),
        })),
        items: world.items.map(i => ({ type: i.type, x: round(i.x), y: round(i.y) })),
        mapChecksum: checksum(world.map.flat()),
        objectMapChecksum: checksum(world.objectMap.flat()),
        // 월드가 통째로 직렬화되는지도 함께 확인합니다(리팩토링의 핵심 목표).
        serializable: (() => {
            try { serializeWorld(); return true; }
            catch (error) { return String(error.message); }
        })(),
    };
}

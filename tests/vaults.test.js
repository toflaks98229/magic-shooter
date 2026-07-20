/**
 * @fileoverview 손으로 그린 방(볼트)이 절차 생성된 층에 제대로 들어가는지 봅니다.
 *
 * 볼트에서 가장 조심할 것은 '갈 수 없는 방'입니다. 벽 속에 통째로 갇히거나,
 * 층을 두 동강 내거나, 시작 지점을 덮어 벽 속에서 시작하게 만들 수 있습니다.
 * 셋 다 실제로 만들다가 겪은 것이고, 그래서 셋 다 검사합니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { installBrowserStubs, seedRandom, bindStubDom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const { generateDungeon } = await import('../Script/mapGenerator.js');
const { placeMinivaults, vaultCount } = await import('../Script/vaults.js');
const { VAULTS } = await import('../Script/data/vaults.js');
const { getMonster } = await import('../Script/monsters.js');
const gameLogic = await import('../Script/gameLogic.js');
const actions = await import('../Script/actions.js');
const worldModule = await import('../Script/world.js');
const { dom } = await import('../Script/dom.js');

bindStubDom(dom);

/**
 * 시작 지점에서 걸어갈 수 있는 칸을 셉니다.
 * @param {number[][]} map - 층
 * @param {{x: number, y: number}} from - 시작 지점
 * @returns {boolean[][]} 갈 수 있으면 true
 */
function reachable(map, from) {
    const seen = map.map(row => row.map(() => false));
    const queue = [from];
    seen[from.y][from.x] = true;

    for (let head = 0; head < queue.length; head++) {
        const { x, y } = queue[head];
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const nx = x + dx, ny = y + dy;
            if (!map[ny]?.[nx] === undefined) continue;
            if (nx < 0 || ny < 0 || ny >= map.length || nx >= map[0].length) continue;
            if (seen[ny][nx] || C.tileAt(map, nx, ny).solid) continue;
            seen[ny][nx] = true;
            queue.push({ x: nx, y: ny });
        }
    }
    return seen;
}

// --- 가져온 데이터 ---------------------------------------------------------------

test('볼트를 가져왔다', () => {
    assert.ok(vaultCount() > 10, `볼트가 ${vaultCount()}개뿐입니다`);
});

test('가져온 볼트가 이 맵에 들어가는 크기다', () => {
    // 층 전체를 정의하는 원본 볼트들은 80x70 을 전제로 쓰여 있어 들어가지 않습니다.
    // 가져오는 단계에서 걸러야 하고, 걸러졌는지 여기서 확인합니다.
    for (const vault of VAULTS) {
        assert.ok(vault.rows.length < C.MAP_HEIGHT - 2,
            `${vault.name} 이 너무 높습니다 (${vault.rows.length})`);
        assert.ok(vault.rows[0].length < C.MAP_WIDTH - 2,
            `${vault.name} 이 너무 넓습니다 (${vault.rows[0].length})`);
    }
});

test('모든 줄의 길이가 같다', () => {
    // 짧은 줄이 섞여 있으면 찍을 때 격자가 어긋납니다.
    for (const vault of VAULTS) {
        const width = vault.rows[0].length;
        for (const row of vault.rows) {
            assert.equal(row.length, width, `${vault.name} 의 줄 길이가 다릅니다`);
        }
    }
});

// --- 찍어 넣기 -------------------------------------------------------------------

test('볼트는 이미 있는 바닥과 겹쳐 놓인다', () => {
    // 겹치지 않으면 벽 속에 갇힌 방이 됩니다. 원본도 이것을 요구합니다.
    // 통로를 뚫어 주는 방법도 있지만 '나중에 뚫은 티'가 납니다.
    // 여러 씨앗으로 돌려야 의미가 있습니다. 한 번만 보면 우연히 겹쳐
    // 규칙이 없어도 통과합니다.
    let checked = 0;
    for (let seed = 0; seed < 60; seed++) {
        seedRandom(seed);
        const map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(C.TILE_IDS.WALL));

        // 한가운데에만 작은 바닥을 둡니다. 볼트는 반드시 여기에 닿아야 합니다.
        for (let y = 14; y <= 16; y++) for (let x = 14; x <= 16; x++) map[y][x] = C.TILE_IDS.FLOOR;

        for (const vault of placeMinivaults(map, { count: 1 })) {
            checked++;
            const overlaps = vault.left <= 16 && vault.left + vault.width > 14
                && vault.top <= 16 && vault.top + vault.height > 14;
            assert.ok(overlaps, `씨앗 ${seed}: ${vault.name} 이 바닥과 떨어진 곳에 놓였습니다`);
        }
    }
    assert.ok(checked > 0, '예순 번을 돌려도 한 번도 놓이지 않았습니다');
});

test('볼트가 맵 가장자리를 넘지 않는다', () => {
    // 바깥 벽을 뚫으면 맵 밖으로 걸어 나갈 수 있습니다.
    for (let seed = 0; seed < 60; seed++) {
        seedRandom(seed);
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, {});

        for (const vault of dungeon.vaults ?? []) {
            assert.ok(vault.left >= 1, `${vault.name} 이 왼쪽 벽을 넘었습니다`);
            assert.ok(vault.top >= 1, `${vault.name} 이 위쪽 벽을 넘었습니다`);
            assert.ok(vault.left + vault.width <= C.MAP_WIDTH - 1,
                `${vault.name} 이 오른쪽 벽을 넘었습니다`);
            assert.ok(vault.top + vault.height <= C.MAP_HEIGHT - 1,
                `${vault.name} 이 아래쪽 벽을 넘었습니다`);
        }
    }
});

test('볼트가 시작 지점을 덮지 않는다', () => {
    // 덮으면 벽 속에서 시작합니다. 실제로 겪은 결함입니다.
    for (let seed = 0; seed < 80; seed++) {
        seedRandom(seed);
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, {});
        const start = dungeon.playerStart;

        assert.equal(C.tileAt(dungeon.map, start.x, start.y).solid, false,
            `씨앗 ${seed}: 시작 지점이 벽 속입니다`);
    }
});

test('볼트가 들어가도 출구까지 갈 수 있다', () => {
    // 볼트가 유일한 통로를 덮어 층을 두 동강 낼 수 있습니다.
    for (let seed = 0; seed < 60; seed++) {
        seedRandom(seed);
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, {});
        const seen = reachable(dungeon.map, dungeon.playerStart);

        let exitFound = false;
        for (let y = 0; y < C.MAP_HEIGHT; y++) {
            for (let x = 0; x < C.MAP_WIDTH; x++) {
                if (dungeon.map[y][x] !== C.TILE_IDS.EXIT) continue;
                // 출구는 벽이라 그 자체는 못 밟습니다. 옆에 설 수 있으면 됩니다.
                for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    if (seen[y + dy]?.[x + dx]) exitFound = true;
                }
            }
        }
        assert.ok(exitFound, `씨앗 ${seed}: 출구까지 갈 수 없습니다`);
    }
});

test('같은 볼트가 판마다 다르게 나올 수 있다', () => {
    // SUBST 는 볼트 안의 글리프를 굴려 바꿉니다. 이 하나만으로도
    // 같은 볼트가 판마다 달라 보입니다. 없으면 두 판 만에 질립니다.
    const withSubst = VAULTS.filter(v => (v.subst?.length ?? 0) > 0);
    assert.ok(withSubst.length > 0, 'SUBST 를 가진 볼트가 하나도 없습니다');

    const vault = withSubst[0];
    const shapes = new Set();
    for (let seed = 0; seed < 40; seed++) {
        seedRandom(seed);
        const map = Array.from({ length: C.MAP_HEIGHT },
            () => Array(C.MAP_WIDTH).fill(C.TILE_IDS.FLOOR));
        placeMinivaults(map, { count: 1 });
        shapes.add(map.map(r => r.join('')).join('|'));
    }
    assert.ok(shapes.size > 1, '판마다 똑같은 결과가 나왔습니다');
});

test('유리벽을 쓰는 볼트가 있다', () => {
    // 투시 타일을 만든 이유입니다. 유리 기둥이 늘어선 방은
    // 막혀 있으면서도 건너편이 보여, 이 장르에서 특히 잘 읽힙니다.
    const glassVaults = VAULTS.filter(v => v.rows.some(r => /[mno]/.test(r)));
    assert.ok(glassVaults.length > 0, '유리벽을 쓰는 볼트가 없습니다');
});

// --- 볼트가 지정한 몬스터 -------------------------------------------------------

test('몬스터가 배치된 볼트를 가져왔다', () => {
    // mini_features.des 하나만 가져왔을 때는 기믹도 몬스터도 없는
    // 순수 장식뿐이었습니다. 그것만으로는 볼트가 '방'이 되지 못합니다.
    const withMonsters = VAULTS.filter(v => (v.mons?.length ?? 0) > 0);
    assert.ok(withMonsters.length > 0, '몬스터를 가진 볼트가 하나도 없습니다');
});

test('볼트의 몬스터 슬롯이 실제 몬스터를 가리킨다', () => {
    // 원본 이름과 이 게임의 식별자가 다릅니다. (orc warrior / orc-warrior)
    // 잘못 옮기면 스폰이 조용히 실패해 빈 방이 됩니다.
    for (const vault of VAULTS) {
        for (const slot of vault.mons ?? []) {
            for (const id of slot) {
                assert.ok(getMonster(id), `${vault.name} 이 모르는 몬스터를 가리킵니다: ${id}`);
            }
        }
    }
});

test('볼트를 찍으면 몬스터 자리가 나온다', () => {
    let found = 0;
    for (let seed = 0; seed < 120 && found === 0; seed++) {
        seedRandom(seed);
        const map = Array.from({ length: C.MAP_HEIGHT },
            () => Array(C.MAP_WIDTH).fill(C.TILE_IDS.FLOOR));
        for (const vault of placeMinivaults(map, { count: 1 })) {
            found += vault.spawns?.length ?? 0;
        }
    }
    assert.ok(found > 0, '백스무 번을 찍어도 몬스터 자리가 하나도 안 나왔습니다');
});

test('볼트 몬스터가 실제로 층에 놓인다', () => {
    // 자리만 기록되고 스폰까지 이어지지 않으면 설계된 방이 빈 방이 됩니다.
    let spawnedSomewhere = false;

    for (let seed = 0; seed < 120 && !spawnedSomewhere; seed++) {
        seedRandom(seed);
        worldModule.resetWorld();
        actions.setGameRunning(true);

        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, {});
        const planned = (dungeon.vaults ?? []).reduce((n, v) => n + (v.spawns?.length ?? 0), 0);
        if (planned === 0) continue;

        actions.beginFloor(dungeon);
        gameLogic.spawnEnemiesForFloor();

        // 볼트가 지정한 자리에 적이 실제로 서 있는지 봅니다.
        for (const vault of dungeon.vaults) {
            for (const spawn of vault.spawns ?? []) {
                const standing = worldModule.world.enemies.some(e =>
                    Math.floor(e.x / C.TILE_SIZE) === spawn.tileX
                    && Math.floor(e.y / C.TILE_SIZE) === spawn.tileY);
                if (standing) spawnedSomewhere = true;
            }
        }
    }

    assert.ok(spawnedSomewhere, '볼트가 지정한 자리에 적이 하나도 서지 않았습니다');
});

// --- 개수를 고정하는 지시자 -------------------------------------------------------

test('NSUBST 를 쓰는 볼트를 가져왔다', () => {
    // 이것이 없어서 볼트 261 개를 버리고 있었습니다.
    const withNsubst = VAULTS.filter(v => (v.nsubst?.length ?? 0) > 0);
    assert.ok(withNsubst.length > 0, 'NSUBST 를 쓰는 볼트가 하나도 없습니다');
});

test('나머지 전부를 뜻하는 표시가 살아 있다', () => {
    // Infinity 로 담았다가 JSON 을 거치며 null 이 되어 개수가 통째로 사라졌습니다.
    // 예전에 몬스터 쿨다운에서 겪은 것과 같은 함정입니다.
    for (const vault of VAULTS) {
        for (const rule of vault.nsubst ?? []) {
            for (const spec of rule.specs) {
                assert.notEqual(spec.count, null,
                    `${vault.name} 의 NSUBST 개수가 사라졌습니다`);
            }
        }
    }
});

test('NSUBST 는 개수를 고정한다', () => {
    // SUBST 는 칸마다 확률을 굴려 개수가 들쭉날쭉합니다. NSUBST 는 고정합니다.
    // 문 하나, 계단 하나처럼 수가 중요한 볼트가 이걸 씁니다.
    const target = VAULTS.find(v => v.name === 'corexii_leaking_fountain');
    if (!target) return;   // 원본이 바뀌면 이 볼트가 없을 수 있습니다

    const counts = new Set();
    let stamped = 0;

    for (let seed = 0; seed < 400 && stamped < 5; seed++) {
        seedRandom(seed);
        const map = Array.from({ length: C.MAP_HEIGHT },
            () => Array(C.MAP_WIDTH).fill(C.TILE_IDS.FLOOR));
        const placed = placeMinivaults(map, { count: 1 });
        if (placed[0]?.name !== target.name) continue;

        stamped++;
        const box = placed[0];
        let shallow = 0;
        for (let y = box.top; y < box.top + box.height; y++) {
            for (let x = box.left; x < box.left + box.width; x++) {
                if (map[y][x] === C.TILE_IDS.SHALLOW_WATER) shallow++;
            }
        }
        counts.add(shallow);
    }

    assert.ok(stamped > 0, '그 볼트가 한 번도 찍히지 않았습니다');
    assert.equal(counts.size, 1, `개수가 판마다 달랐습니다: ${[...counts].join(', ')}`);
    assert.ok(counts.has(5), `다섯 칸이어야 하는데 ${[...counts].join(', ')} 였습니다`);
});

// --- 층 전체를 정의하는 볼트 -------------------------------------------------------

test('층 볼트를 가져왔다', () => {
    // 처음에는 ORIENT 가 붙은 볼트를 통째로 버렸습니다. 맵이 30x30 이던 시절에는
    // 정말로 들어가지 않았기 때문입니다. 80x70 으로 키우면서 그 이유는 사라졌는데
    // 필터는 그대로 두고 있었습니다.
    const floorVaults = VAULTS.filter(v => v.encompass);
    assert.ok(floorVaults.length > 0, '층 볼트가 하나도 없습니다');
});

test('층 볼트가 맵 안에 들어간다', () => {
    for (const vault of VAULTS.filter(v => v.encompass)) {
        assert.ok(vault.rows.length <= C.MAP_HEIGHT,
            `${vault.name} 이 맵보다 높습니다 (${vault.rows.length})`);
        assert.ok(vault.rows[0].length <= C.MAP_WIDTH,
            `${vault.name} 이 맵보다 넓습니다 (${vault.rows[0].length})`);
    }
});

test('층 볼트가 실제로 층이 된다', () => {
    // 절차 생성을 건너뛰고 볼트가 곧 층이 됩니다.
    let found = 0;
    for (let seed = 0; seed < 300 && found === 0; seed++) {
        seedRandom(seed);
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, {});
        if (dungeon.layout?.startsWith('vault:')) found++;
    }
    assert.ok(found > 0, '삼백 판을 돌려도 층 볼트가 한 번도 안 나왔습니다');
});

test('층 볼트로 만든 층도 걸어서 나갈 수 있다', () => {
    // 손으로 그린 판이라도 지켜야 할 것은 같습니다. 시작 지점에서 출구까지
    // 걸어갈 수 있어야 하고, 출구는 하나여야 하고, 맨바닥에서 시작해야 합니다.
    let checked = 0;

    for (let seed = 0; seed < 600 && checked < 25; seed++) {
        seedRandom(seed);
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, {});
        if (!dungeon.layout?.startsWith('vault:')) continue;
        checked++;

        assert.equal(dungeon.map[dungeon.playerStart.y][dungeon.playerStart.x], C.TILE_IDS.FLOOR,
            `${dungeon.layout}: 맨바닥에서 시작하지 않습니다`);

        const exits = dungeon.map.flat().filter(t => t === C.TILE_IDS.EXIT).length;
        assert.equal(exits, 1, `${dungeon.layout}: 출구가 ${exits} 개입니다`);

        const seen = reachable(dungeon.map, dungeon.playerStart);
        let exitReachable = false;
        for (let y = 0; y < C.MAP_HEIGHT; y++) {
            for (let x = 0; x < C.MAP_WIDTH; x++) {
                if (dungeon.map[y][x] !== C.TILE_IDS.EXIT) continue;
                for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    if (seen[y + dy]?.[x + dx]) exitReachable = true;
                }
            }
        }
        assert.ok(exitReachable, `${dungeon.layout}: 출구까지 갈 수 없습니다`);
    }

    assert.ok(checked > 0, '층 볼트가 한 번도 안 나왔습니다');
});

test('아무도 닫힌 문 안에서 시작하지 않는다', () => {
    // 문을 열 줄 모르는 짐승이 닫힌 문 안에 서면 영영 나오지 못합니다.
    // 볼트가 '여기 선다' 고 정한 자리를 나중에 놓는 문이 덮어서 생겼습니다.
    for (let seed = 0; seed < 150; seed++) {
        seedRandom(seed);
        worldModule.resetWorld();
        actions.setGameRunning(true);

        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, {});
        actions.beginFloor(dungeon);
        gameLogic.spawnEnemiesForFloor();

        for (const enemy of worldModule.world.enemies) {
            const tileX = Math.floor(enemy.x / C.TILE_SIZE);
            const tileY = Math.floor(enemy.y / C.TILE_SIZE);
            assert.ok(!(worldModule.world.objectMap[tileY]?.[tileX] > 0),
                `씨앗 ${seed}: ${enemy.monsterId} 가 닫힌 문 안에 있습니다`);
        }
    }
});

test('볼트 안에는 문을 놓지 않는다', () => {
    // 볼트는 손으로 그린 방입니다. 그 위에 문을 얹으면 설계가 무너집니다.
    // 원본도 볼트를 이런 후처리로부터 보호합니다.
    for (let seed = 0; seed < 120; seed++) {
        seedRandom(seed);
        const dungeon = generateDungeon(C.MAP_WIDTH, C.MAP_HEIGHT, {});

        for (const vault of dungeon.vaults ?? []) {
            // 볼트가 스스로 그린 문은 괜찮습니다. 나중에 얹힌 것만 봅니다.
            for (const spawn of vault.spawns ?? []) {
                assert.notEqual(dungeon.map[spawn.tileY][spawn.tileX], C.TILE_IDS.DOOR,
                    `씨앗 ${seed}: ${vault.name} 의 몬스터 자리에 문이 놓였습니다`);
            }
        }
    }
});

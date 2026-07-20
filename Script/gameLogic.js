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
import { getPlayerMovement, drainActionQueue, consumePendingLook, INPUT_ACTIONS } from './input.js';

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

    // 2. 무기 자동 전환 (탄약이 없으면 주먹으로)
    //    교체 연출이 진행 중일 때는 요청하지 않습니다. 실제 무기 변경은
    //    연출이 끝나는 시점에 ui.js가 actions.setWeapon()으로 확정합니다.
    const newWeapon = world.player.ammo > 0 ? 'gun' : 'fist';
    if (newWeapon !== world.player.weapon && !runtime.isSwappingWeapon) {
        A.requestWeaponChange(newWeapon);
    }

    // 3. 적 AI 및 로직 처리
    updateEnemies(now, dtFactor, deltaTime);

    // 4. 발사체 이동 및 충돌 처리
    updateProjectiles(dtFactor);

    // 5. 아이템 획득 처리
    handleItemPickup();

    // 6. 적 사망 처리 및 아이템 드랍
    handleEnemyDeaths();

    // 7. 플레이어 사망 확인
    //    피해를 입은 즉시가 아니라 프레임 끝에서 한 번만 확인합니다.
    //    중간에 게임을 멈추면 나머지 갱신이 건너뛰어져 상태가 어긋나기 때문입니다.
    if (world.player.hp <= 0) {
        A.killPlayer();
    }
}

// --- 외부 공개 함수 (Public Methods) ---

/**
 * 프레임 사이에 쌓인 입력을 시뮬레이션에 반영합니다.
 * 시점 회전을 먼저 적용해, 같은 프레임에 들어온 공격이 회전 이후의 방향을 기준으로 판정되게 합니다.
 */
function processQueuedInput() {
    const lookDelta = consumePendingLook();
    if (lookDelta !== 0) world.player.angle += lookDelta;

    drainActionQueue(action => {
        if (action === INPUT_ACTIONS.ATTACK) attack();
        else if (action === INPUT_ACTIONS.INTERACT) interactWithWorld();
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

        // 가장 가까운 적을 조준하여 공격 (약간의 조준 보정 포함)
        const hitEnemy = world.enemies
            .map(enemy => {
                const dx = enemy.x - player.x;
                const dy = enemy.y - player.y;
                const dist = Math.hypot(dx, dy);
                const angleToEnemy = Math.atan2(dy, dx);
                let angleDiff = player.angle - angleToEnemy;
                // 각도 차이를 -PI ~ PI 범위로 정규화하여 가장 작은 각도 차이를 구합니다.
                while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
                return { enemy, dist, angleDiff };
            })
            // 조준 보정 범위(FOV의 1/8) 내에 있는 적만 필터링합니다.
            .filter(({ angleDiff }) => Math.abs(angleDiff) < C.FOV / 8)
            // 가까운 순으로 정렬한 뒤, 벽에 가리지 않은 첫 번째 적을 명중 대상으로 삼습니다.
            // find를 사용하므로 시야 검사는 명중 대상을 찾을 때까지만 수행됩니다.
            .sort((a, b) => a.dist - b.dist)
            .find(({ enemy }) => hasLineOfSight(player.x, player.y, enemy.x, enemy.y));

        if (hitEnemy) {
            A.damageEnemy(hitEnemy.enemy, weaponData.damage, now);
        }

    } else if (player.weapon === 'fist') {
        // 주먹 휘두르기 연출은 ui.js가 WEAPON_FIRED를 받아 처리합니다.
        A.reportWeaponFired(player.weapon);

        let hasHit = false; // 한 번의 공격에 한 명의 적만 맞도록 하기 위한 플래그
        world.enemies.forEach(enemy => {
            if (hasHit) return;
            const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
            // 사거리 내에 있는지 확인
            if (dist < weaponData.range) {
                const angleToEnemy = Math.atan2(enemy.y - player.y, enemy.x - player.x);
                let angleDiff = player.angle - angleToEnemy;
                while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
                while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

                // 전방 부채꼴(FOV의 1/4) 범위 안에 있고, 벽에 가리지 않았는지 확인
                if (Math.abs(angleDiff) < C.FOV / 4 &&
                    hasLineOfSight(player.x, player.y, enemy.x, enemy.y)) {
                    A.damageEnemy(enemy, weaponData.damage, now);
                    hasHit = true;
                }
            }
        });
    }
}

/**
 * 현재 층(floor)에 맞는 수의 적들을 스폰합니다.
 */
export function spawnEnemiesForFloor() {
    const numEnemies = world.floor * 2 + 3; // 층이 올라갈수록 더 많은 적 스폰
    for (let i = 0; i < numEnemies; i++) spawnEnemy();
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

    // 1. 출구(4) 타일인지 확인합니다.
    if (world.map[tileY]?.[tileX] === 4) {
        A.reachExit(); // 다음 층으로 이동하는 처리는 main.js가 구독합니다.
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


// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 지정된 맵 좌표가 통과 가능한지 (벽이 아니고, 단단한 오브젝트가 없는지) 확인합니다.
 * @param {number} x - 맵 타일 X 좌표
 * @param {number} y - 맵 타일 Y 좌표
 * @returns {boolean} 통과 가능하면 true
 */
function isPassable(x, y) {
    // 1. 맵 경계를 벗어나거나 벽(0이 아닌 값)인지 확인
    if (world.map[y]?.[x] !== 0 && world.map[y]?.[x] !== 5) { // 문(5)도 통과 가능해야 합니다.
        return false;
    }

    // 2. 오브젝트 맵에 'solid' 속성을 가진 오브젝트가 있는지 확인
    const objectId = world.objectMap[y]?.[x];
    if (objectId > 0) {
        const objectType = C.OBJECT_TYPES[objectId];
        if (objectType && objectType.solid) {
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

        const tile = world.map[mapY]?.[mapX];
        if (tile === undefined) return false; // 맵 밖으로 나감
        if (tile > 0) return false;           // 벽/문/출구에 막힘
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
        const moveSpeed = C.MOVE_SPEED * dtFactor;
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
function updateEnemies(now, dtFactor, deltaTime) {
    const player = world.player;

    world.enemies.forEach(enemy => {
        const dx_player = player.x - enemy.x;
        const dy_player = player.y - enemy.y;
        const dist_player = Math.hypot(dx_player, dy_player);

        // --- 경로 탐색 및 이동 (Pathfinding & Movement) ---
        enemy.pathRecalculationTimer -= deltaTime;

        // 경로 재계산 타이머가 다 됐을 때 경로를 다시 찾습니다.
        if (enemy.pathRecalculationTimer <= 0) {
            enemy.pathRecalculationTimer = 1000 + Math.random() * 500; // 1 ~ 1.5초마다 재계산
            const startNode = { x: Math.floor(enemy.x / C.TILE_SIZE), y: Math.floor(enemy.y / C.TILE_SIZE) };
            const endNode = { x: Math.floor(player.x / C.TILE_SIZE), y: Math.floor(player.y / C.TILE_SIZE) };

            // 목표 지점이 바뀌었는지 확인합니다.
            const targetMoved = !enemy.pathTarget || enemy.pathTarget.x !== endNode.x || enemy.pathTarget.y !== endNode.y;

            // 경로가 아예 없거나(null), 경로가 비어있거나, 목표 지점이 바뀌었을 때만 경로를 재계산합니다.
            if (!enemy.path || enemy.path.length === 0 || targetMoved) {
                enemy.path = findPath(startNode, endNode);
                enemy.pathTarget = endNode;
            }
        }

        // 계산된 경로가 있고(null이 아니고) 경로에 다음 지점이 남아있을 때 이동합니다.
        if (enemy.path && enemy.path.length > 0) {
            const nextNode = enemy.path[0];
            const targetX = nextNode.x * C.TILE_SIZE + C.TILE_SIZE / 2;
            const targetY = nextNode.y * C.TILE_SIZE + C.TILE_SIZE / 2;

            const dx_node = targetX - enemy.x;
            const dy_node = targetY - enemy.y;
            const dist_node = Math.hypot(dx_node, dy_node);

            // 다음 경로 지점에 충분히 가까워지면 경로에서 해당 지점을 제거합니다.
            if (dist_node < enemy.speed * dtFactor * 1.5) {
                enemy.path.shift();
            } else { // 다음 경로 지점을 향해 이동합니다.
                const angle = Math.atan2(dy_node, dx_node);
                const speed = enemy.speed * dtFactor;
                enemy.x += Math.cos(angle) * speed;
                enemy.y += Math.sin(angle) * speed;
            }
        }

        // --- 공격 AI (플레이어와의 직접적인 거리를 기반으로) ---
        if (enemy.type === 'melee' && dist_player < C.TILE_SIZE) { // 근접 타입
            if (now - enemy.lastAttackTime > enemy.cooldown) {
                enemy.lastAttackTime = now;
                A.damagePlayer(enemy.damage, enemy);
            }
        } else if (enemy.type === 'ranged' && dist_player < enemy.range) { // 원거리 타입
            if (now - enemy.lastAttackTime > enemy.cooldown) {
                enemy.lastAttackTime = now;
                const angle = Math.atan2(dy_player, dx_player);
                // 발사체를 생성하여 배열에 추가합니다.
                world.projectiles.push({
                    x: enemy.x, y: enemy.y, z: C.TILE_SIZE / 2, angle,
                    speed: enemy.projectileSpeed, damage: enemy.damage,
                    size: C.PROJECTILE_TYPES.ENEMY_FIREBALL.size, from: 'enemy',
                    spriteKey: C.PROJECTILE_TYPES.ENEMY_FIREBALL.spriteKey
                });
            }
        }
    });
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

        // 벽과 충돌하면 발사체를 제거하고 파티클 효과를 생성합니다.
        if (world.map[Math.floor(proj.y / C.TILE_SIZE)]?.[Math.floor(proj.x / C.TILE_SIZE)] !== 0) {
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
        if (world.enemies[i].hp <= 0) {
            A.killEnemyAt(i);
        }
    }
}

/**
 * 무작위 유형의 적 한 마리를 맵의 안전한 위치(벽이 아니고 플레이어와 떨어진 곳)에 스폰합니다.
 */
function spawnEnemy() {
    const { x, y } = findSpawnPoint(); // 스폰 위치 탐색
    const enemyTypes = Object.keys(C.ENEMY_TYPES);
    const typeKey = enemyTypes[Math.floor(Math.random() * enemyTypes.length)]; // 스폰할 적 유형 무작위 선택
    const template = C.ENEMY_TYPES[typeKey];
    // 적 객체를 생성하여 배열에 추가
    world.enemies.push({
        ...template,
        x, y, z: C.TILE_SIZE / 2,
        maxHp: template.hp,
        // 스폰 직후 쿨다운에 걸리지 않도록 과거 시각으로 둡니다.
        lastAttackTime: C.PAST_TIME,
        lastHitTime: 0,
        path: [], // 길찾기 관련 속성 초기화
        pathRecalculationTimer: Math.random() * 500, // 초기 계산 시간을 분산시켜 성능 부담 완화
        pathTarget: null,
    });
}

/**
 * 플레이어와 충분히 떨어져 있고 벽이 아닌 타일을 찾아 스폰 지점으로 반환합니다.
 * 무작위 탐색이 실패할 수 있는 좁은 맵에서도 반드시 값을 반환하도록 폴백 경로를 갖습니다.
 * @returns {{x: number, y: number}} 스폰할 월드 좌표
 */
function findSpawnPoint() {
    const player = world.player;
    const minDistance = C.TILE_SIZE * C.SPAWN_MIN_DISTANCE_TILES;

    // 1. 조건을 만족하는 지점을 무작위로 탐색합니다. (대부분의 경우 몇 번 안에 성공)
    for (let attempt = 0; attempt < C.SPAWN_MAX_ATTEMPTS; attempt++) {
        const x = Math.random() * C.MAP_WIDTH * C.TILE_SIZE;
        const y = Math.random() * C.MAP_HEIGHT * C.TILE_SIZE;
        const mapX = Math.floor(x / C.TILE_SIZE);
        const mapY = Math.floor(y / C.TILE_SIZE);

        if (world.map[mapY]?.[mapX] === 0 && Math.hypot(x - player.x, y - player.y) >= minDistance) {
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
            if (world.map[mapY][mapX] !== 0) continue;
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

        // 간단한 충돌 처리: 벽과 충돌 시 속도 반감 및 방향 반전
        if (world.map[Math.floor(p.y / C.TILE_SIZE)]?.[Math.floor(p.x / C.TILE_SIZE)] !== 0) {
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
 * BFS(너비 우선 탐색) 알고리즘을 사용하여 시작 지점에서 목표 지점까지의 최단 경로를 찾습니다.
 * @param {{x: number, y: number}} startNode - 시작 타일 좌표
 * @param {{x: number, y: number}} endNode - 목표 타일 좌표
 * @returns {Array<{x: number, y: number}>|null} 경로 좌표 배열 또는 경로가 없으면 null
 */
function findPath(startNode, endNode) {
    const queue = [[startNode]]; // 탐색할 경로들을 담는 큐
    const visited = new Set([`${startNode.x},${startNode.y}`]); // 이미 방문한 노드를 기록
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]]; // 하, 상, 우, 좌

    while (queue.length > 0) {
        const path = queue.shift(); // 큐에서 가장 오래된 경로를 꺼냄
        const lastNode = path[path.length - 1];

        // 목표 지점에 도달하면 경로를 반환
        if (lastNode.x === endNode.x && lastNode.y === endNode.y) {
            return path.slice(1); // 시작 노드를 제외한 경로 반환
        }

        // 성능 제한: 너무 긴 경로는 탐색하지 않아 무한 루프나 과도한 계산을 방지
        if (path.length > 50) continue;

        // 현재 위치에서 4방향으로 탐색
        for (const [dx, dy] of directions) {
            const newX = lastNode.x + dx;
            const newY = lastNode.y + dy;
            const key = `${newX},${newY}`;

            // 맵 범위 안이고, 벽이 아니며, 아직 방문하지 않은 곳이라면
            if (newX >= 0 && newX < C.MAP_WIDTH &&
                newY >= 0 && newY < C.MAP_HEIGHT &&
                isPassable(newX, newY) && // isPassable 함수로 벽과 오브젝트를 모두 검사
                !visited.has(key)) {
                visited.add(key);
                const newPath = [...path, { x: newX, y: newY }]; // 새 경로 생성
                queue.push(newPath); // 큐에 추가하여 다음 탐색에 사용
            }
        }
    }
    return null; // 모든 경로를 탐색했지만 목표에 도달하지 못함
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
            world.map[wall.mapY][wall.mapX] = 0;
            // 애니메이션 배열에서 제거합니다.
            world.animatedWalls.splice(i, 1);
        }
    }
}

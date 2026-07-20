/**
 * @fileoverview 로그라이크 스타일의 무작위 던전 맵을 생성하는 유틸리티 함수입니다.
 */

// --- 외부 공개 함수 (Public Methods) ---

/**
 * 로그라이크 스타일의 던전 맵을 생성합니다.
 * 이 알고리즘은 무작위 방을 생성하고 복도로 연결하는 방식으로 동작합니다.
 * @param {number} width - 맵의 가로 크기 (타일 단위)
 * @param {number} height - 맵의 세로 크기 (타일 단위)
 * @param {number} maxRooms - 생성할 최대 방의 개수
 * @param {number} minRoomSize - 방의 최소 크기
 * @param {number} maxRoomSize - 방의 최대 크기
 * @returns {{map: number[][], objectMap: number[][], playerStart: {x: number, y: number}}} - 생성된 맵, 오브젝트 맵, 플레이어 시작 좌표
 */
export function generateDungeon(width, height, maxRooms, minRoomSize, maxRoomSize) {
    // 1. 맵을 모두 벽(1)으로, 오브젝트 맵은 비어있음(0)으로 초기화합니다.
    const map = Array(height).fill(0).map(() => Array(width).fill(1));
    const objectMap = Array(height).fill(0).map(() => Array(width).fill(0));
    const rooms = []; // 생성된 방의 정보를 저장할 배열

    // 2. 무작위 크기와 위치의 방을 생성합니다.
    // 시도 횟수(maxRooms * 5)를 늘려 방 생성 확률을 높입니다.
    for (let i = 0; i < maxRooms * 5 && rooms.length < maxRooms; i++) {
        const roomW = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
        const roomH = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
        // 맵 가장자리에 방이 생성되지 않도록 좌표를 조정합니다.
        const roomX = Math.floor(Math.random() * (width - roomW - 1)) + 1;
        const roomY = Math.floor(Math.random() * (height - roomH - 1)) + 1;
        const newRoom = { x: roomX, y: roomY, w: roomW, h: roomH };

        // 다른 방과 겹치는지 확인합니다.
        const overlaps = rooms.some(other => (
            newRoom.x < other.x + other.w && newRoom.x + newRoom.w > other.x &&
            newRoom.y < other.y + other.h && newRoom.y + newRoom.h > other.y
        ));

        if (!overlaps) {
            // 겹치지 않으면 맵에 방을 그리고(벽을 바닥(0)으로 변경) 배열에 추가합니다.
            createRoom(map, newRoom);
            rooms.push(newRoom);
        }
    }

    // 방 생성에 실패했을 경우, 무작위 패턴의 비상용 맵을 생성합니다.
    if (rooms.length === 0) {
        console.warn("Dungeon generation failed, creating a random fallback map.");
        return createFallbackDungeon(width, height);
    }

    // 3. 생성된 방들을 복도로 연결합니다. (생성된 순서대로)
    for (let i = 1; i < rooms.length; i++) {
        const prevCenter = { x: rooms[i - 1].x + Math.floor(rooms[i - 1].w / 2), y: rooms[i - 1].y + Math.floor(rooms[i - 1].h / 2) };
        const newCenter = { x: rooms[i].x + Math.floor(rooms[i].w / 2), y: rooms[i].y + Math.floor(rooms[i].h / 2) };

        // 무작위로 수평->수직 또는 수직->수평 복도를 생성하여 단조로움을 피합니다.
        if (Math.random() > 0.5) {
            createHTunnel(map, objectMap, prevCenter.x, newCenter.x, prevCenter.y);
            createVTunnel(map, objectMap, prevCenter.y, newCenter.y, newCenter.x);
        } else {
            createVTunnel(map, objectMap, prevCenter.y, newCenter.y, prevCenter.x);
            createHTunnel(map, objectMap, prevCenter.x, newCenter.x, newCenter.y);
        }
    }

    // 4. 플레이어 시작 지점을 첫 번째 방의 중심으로 설정합니다.
    const firstRoom = rooms[0];
    const playerStart = {
        x: firstRoom.x + Math.floor(firstRoom.w / 2),
        y: firstRoom.y + Math.floor(firstRoom.h / 2)
    };
    
    // 5. 다음 층으로 가는 출구를 마지막 방에 설정합니다.
    const lastRoom = rooms[rooms.length - 1];
    // 출구 타일(4)은 기존 타일 값과 무관하게 덮어쓰므로 별도의 초기화가 필요 없습니다.
    const exitY = lastRoom.y + Math.floor(lastRoom.h / 2);
    const exitX = lastRoom.x + Math.floor(lastRoom.w / 2);
    map[exitY][exitX] = 4; // 4는 출구 타일

    return { map, objectMap, playerStart };
}


// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 맵 배열에 직사각형 방을 그립니다 (벽을 바닥으로 만듭니다).
 * @param {number[][]} map - 수정할 맵 배열
 * @param {{x: number, y: number, w: number, h: number}} room - 방의 정보 (x, y, 너비, 높이)
 */
function createRoom(map, room) {
    for (let y = room.y; y < room.y + room.h; y++) {
        for (let x = room.x; x < room.x + room.w; x++) {
            // 맵 경계를 벗어나지 않는지 확인
            if (y > 0 && y < map.length -1 && x > 0 && x < map[0].length - 1) {
                map[y][x] = 0; // 방 내부를 모두 바닥으로
            }
        }
    }
}

/**
 * 맵 배열에 수평 복도를 그립니다.
 * @param {number[][]} map - 수정할 맵 배열
 * @param {number[][]} objectMap - 수정할 오브젝트 맵 배열
 * @param {number} x1 - 시작 x 좌표
 * @param {number} x2 - 끝 x 좌표
 * @param {number} y - 복도가 그려질 y 좌표
 */
function createHTunnel(map, objectMap, x1, x2, y) {
    const startX = Math.min(x1, x2);
    const endX = Math.max(x1, x2);
    for (let x = startX; x <= endX; x++) {
        if(map[y] && map[y][x] !== undefined) map[y][x] = 0;
    }

    // 복도 길이가 3 이상이고 30% 확률로 중앙에 문을 배치합니다.
    if (endX - startX > 2 && Math.random() < 0.3) {
        const doorX = startX + Math.floor((endX - startX) / 2);
        // 문 양 옆이 벽인지 확인하여 올바른 위치인지 검사합니다.
        if (map[y-1]?.[doorX] === 1 && map[y+1]?.[doorX] === 1) {
             objectMap[y][doorX] = 1; // 오브젝트 맵에 문(ID: 1)을 기록합니다.
             map[y][doorX] = 5; // 맵에는 렌더러가 인식할 수 있는 '문' 타일 ID(5)를 기록합니다.
        }
    }
}

/**
 * 맵 배열에 수직 복도를 그립니다.
 * @param {number[][]} map - 수정할 맵 배열
 * @param {number[][]} objectMap - 수정할 오브젝트 맵 배열
 * @param {number} y1 - 시작 y 좌표
 * @param {number} y2 - 끝 y 좌표
 * @param {number} x - 복도가 그려질 x 좌표
 */
function createVTunnel(map, objectMap, y1, y2, x) {
    const startY = Math.min(y1, y2);
    const endY = Math.max(y1, y2);
    for (let y = startY; y <= endY; y++) {
       if(map[y] && map[y][x] !== undefined) map[y][x] = 0;
    }

    // 복도 길이가 3 이상이고 30% 확률로 중앙에 문을 배치합니다.
    if (endY - startY > 2 && Math.random() < 0.3) {
        const doorY = startY + Math.floor((endY - startY) / 2);
        // 문 양 옆이 벽인지 확인하여 올바른 위치인지 검사합니다.
        if (map[doorY]?.[x-1] === 1 && map[doorY]?.[x+1] === 1) {
            objectMap[doorY][x] = 1; // 오브젝트 맵에 문(ID: 1)을 기록합니다.
            map[doorY][x] = 5; // 맵에는 렌더러가 인식할 수 있는 '문' 타일 ID(5)를 기록합니다.
        }
    }
}

/**
 * 방 생성에 실패했을 경우, 무작위 노이즈 패턴의 비상용 맵을 생성합니다.
 * @param {number} width - 맵 너비
 * @param {number} height - 맵 높이
 * @returns {{map: number[][], objectMap: number[][], playerStart: {x: number, y: number}}} - 생성된 맵, 오브젝트 맵, 플레이어 시작 좌표
 */
function createFallbackDungeon(width, height) {
    const fallbackMap = Array(height).fill(0).map(() => Array(width).fill(1));
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            fallbackMap[y][x] = Math.random() > 0.4 ? 0 : 1; // 60% 확률로 바닥 생성
        }
    }
    const playerStart = { x: Math.floor(width / 2), y: Math.floor(height / 2) };
    fallbackMap[playerStart.y][playerStart.x] = 0; // 플레이어 시작 지점은 항상 바닥으로 만듭니다.
    // 비상용 맵에도 출구를 추가합니다.
    fallbackMap[height - 2][width - 2] = 4;
    const objectMap = Array(height).fill(0).map(() => Array(width).fill(0)); // 빈 오브젝트 맵
    return { map: fallbackMap, objectMap, playerStart };
}

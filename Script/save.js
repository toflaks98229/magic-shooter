/**
 * @fileoverview 이어하기 한 칸을 localStorage 에 보관합니다.
 *
 * 원본 DCSS 의 관례를 그대로 따릅니다.
 *   - 저장은 '저장하고 나가기' 뿐입니다. 저장한 순간 판이 끝나고 제목 화면으로 돌아갑니다.
 *   - 불러오면 저장 파일이 지워집니다. 같은 지점을 두 번 불러올 수 없습니다.
 *   - 죽으면 지워집니다.
 * 덕분에 어려운 판을 되돌리는 세이브 스커밍이 불가능하고, 한 번의 죽음이 그대로 남습니다.
 * '이어하기'는 중단한 탐험을 잇는 장치이지 되돌리는 장치가 아닙니다.
 *
 * 저장할 수 있는 것은 world 뿐입니다. 텍스처나 DOM 참조가 섞이지 않도록 계층을 갈라 둔
 * 덕분에 JSON.stringify(world) 한 줄이면 되고, 서브 던전 스택도 그 안에 함께 담깁니다.
 * runtime 은 세션 값이라 저장하지 않고 불러올 때 초기화합니다.
 */

import { serializeWorld, deserializeWorld, world } from './world.js';
import { formatLocation } from './branches.js';

/**
 * @description 저장 칸의 이름. 판 구조가 바뀌어 옛 파일을 읽을 수 없게 되면 숫자를 올립니다.
 * 그러면 옛 파일은 조용히 무시되고 이어하기가 나타나지 않습니다.
 */
const SAVE_KEY = 'magic-shooter/save/v1';

/**
 * localStorage 를 쓸 수 있는지 확인합니다.
 *
 * 사생활 보호 모드나 저장 공간이 꽉 찬 상태에서는 접근 자체가 예외를 던집니다.
 * 그때 게임이 멈추면 안 되므로, 이어하기 기능만 조용히 사라지게 합니다.
 * @returns {Storage|null} 쓸 수 있으면 저장소, 아니면 null
 */
function storage() {
    try {
        const probe = '__probe__';
        localStorage.setItem(probe, probe);
        localStorage.removeItem(probe);
        return localStorage;
    } catch {
        return null;
    }
}

/**
 * 이어할 수 있는 탐험이 있는지 봅니다.
 * @returns {boolean} 저장된 판이 있으면 true
 */
export function hasSave() {
    return readSave() !== null;
}

/**
 * 저장된 판의 요약을 읽습니다. 제목 화면에 어디까지 갔는지 보여주기 위한 것입니다.
 * @returns {{location: string, floor: number, branch: string}|null} 요약, 없으면 null
 */
export function describeSave() {
    const save = readSave();
    if (!save) return null;
    return { location: save.location, floor: save.floor, branch: save.branch };
}

/**
 * 저장 파일을 읽어 유효한지 확인합니다.
 * 깨진 파일은 지우고 없는 것으로 취급합니다. 읽다가 죽는 것보다 이어하기가 사라지는 편이 낫습니다.
 * @returns {{world: string, location: string, floor: number, branch: string}|null} 저장 내용
 */
function readSave() {
    const store = storage();
    if (!store) return null;

    const raw = store.getItem(SAVE_KEY);
    if (!raw) return null;

    try {
        const save = JSON.parse(raw);
        if (typeof save?.world !== 'string') throw new Error('월드가 없습니다');
        // 실제로 되살릴 수 있는지 여기서 확인합니다. 제목 화면에서 이어하기를 눌렀는데
        // 그제서야 깨진 것을 아는 것보다, 아예 보이지 않는 편이 낫습니다.
        JSON.parse(save.world);
        return save;
    } catch (error) {
        console.warn('저장 파일을 읽을 수 없어 지웁니다.', error);
        deleteSave();
        return null;
    }
}

/**
 * 지금 판을 저장합니다.
 *
 * 저장에 실패하면 false 를 돌려줍니다. 호출부는 이때 판을 끝내지 말아야 합니다.
 * 저장된 줄 알고 나갔는데 아무것도 남지 않는 것이 가장 나쁜 결과입니다.
 * @returns {boolean} 저장했으면 true
 */
export function saveGame() {
    const store = storage();
    if (!store) return false;

    try {
        store.setItem(SAVE_KEY, JSON.stringify({
            world: serializeWorld(),
            // 아래 셋은 제목 화면에 보여주기 위한 것으로, 되살릴 때는 쓰지 않습니다.
            location: formatLocation(world.branch, world.floor),
            floor: world.floor,
            branch: world.branch,
        }));
        return true;
    } catch (error) {
        console.error('저장에 실패했습니다.', error);
        return false;
    }
}

/**
 * 저장된 판을 되살리고 저장 파일을 지웁니다.
 *
 * 지우는 것이 이 방식의 핵심입니다. 남겨 두면 같은 지점을 몇 번이고 다시 불러올 수 있어
 * 죽음의 무게가 사라집니다. world 를 되살리기 '전에' 지워, 되살리다 실패하더라도
 * 깨진 파일이 남지 않게 합니다.
 * @returns {boolean} 되살렸으면 true
 */
export function loadGame() {
    const save = readSave();
    if (!save) return false;

    const json = save.world;
    deleteSave();

    try {
        deserializeWorld(json);
        return true;
    } catch (error) {
        console.error('저장된 판을 되살리지 못했습니다.', error);
        return false;
    }
}

/**
 * 저장 파일을 지웁니다. 죽었을 때와 불러왔을 때 불립니다.
 */
export function deleteSave() {
    const store = storage();
    if (!store) return;

    try {
        store.removeItem(SAVE_KEY);
    } catch (error) {
        console.warn('저장 파일을 지우지 못했습니다.', error);
    }
}

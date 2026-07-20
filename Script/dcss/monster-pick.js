/**
 * @fileoverview DCSS 의 몬스터 출현 알고리즘입니다.
 *
 * "어느 층에서 무엇이 나오는가"가 곧 DCSS 의 난이도 곡선입니다.
 * 몬스터 수치를 아무리 정확히 옮겨도 이 표와 이 뽑기가 없으면 다른 게임이 됩니다.
 *
 * 출현표 항목 하나는 { min, max, weight, shape, monster } 이고,
 * shape 가 깊이에 따라 weight 를 어떻게 굽힐지 정합니다. 같은 몬스터라도
 * 범위 가운데에서 흔하고 끝자락에서 드물게 만드는 것이 이 부분입니다.
 *
 * 출처: crawl-ref/source/random-pick.h (rarity_at, pick), mon-pick.cc
 */

import { random2 } from './random.js';

/**
 * @description 가중치 계산에 쓰는 배율.
 * 원본 주석: 2520 은 1~10 의 어떤 수로도 나누어떨어져서, 극단적인 분포에서도
 * 반올림 오차가 문제되지 않을 만큼의 해상도를 줍니다.
 */
const RARITY_SCALE = 2520;

/**
 * 주어진 깊이에서 항목 하나의 실제 가중치를 구합니다.
 *
 * 범위를 벗어난 깊이로는 부르지 마십시오. 원본도 호출 전에 걸러냅니다.
 * @param {{min: number, max: number, weight: number, shape: string}} entry - 출현표 항목
 * @param {number} depth - 가지 안에서의 깊이 (1부터)
 * @returns {number} 가중치. 클수록 자주 나옵니다
 */
export function rarityAt(entry, depth) {
    const rar = entry.weight * RARITY_SCALE;
    const span = entry.max - entry.min;

    switch (entry.shape) {
        case 'FLAT':
            // 범위 내내 같은 확률입니다.
            return rar;

        case 'SEMI': {
            // 가운데가 100%, 양끝이 50%.
            // 범위가 한 층뿐이면 나눌 폭이 0 이 되므로 2 를 줍니다.
            const len = span ? span * 2 : 2;
            return Math.trunc(rar * (len - Math.abs(entry.min + entry.max - 2 * depth)) / len);
        }

        case 'PEAK': {
            // 가운데가 100%, 범위 밖에서 0 이 되도록 양끝이 낮습니다.
            // 끝에서 0 이 아니라 '끝 바깥에서' 0 이 되게 하려고 2 를 더합니다.
            const len = span + 2;
            return Math.trunc(rar * (len - Math.abs(entry.min + entry.max - 2 * depth)) / len);
        }

        case 'RISE':
            // 깊어질수록 늘어납니다.
            return Math.trunc(rar * (depth - entry.min + 1) / (span + 1));

        case 'FALL':
            // 깊어질수록 줄어듭니다.
            return Math.trunc(rar * (entry.max - depth + 1) / (span + 1));

        default:
            throw new Error(`알 수 없는 분포 모양입니다: ${entry.shape}`);
    }
}

/**
 * 주어진 깊이에서 뽑힐 수 있는 항목과 그 가중치를 모읍니다.
 * @param {object[]} entries - 출현표 항목들
 * @param {number} depth - 가지 안에서의 깊이
 * @param {(monster: string) => boolean} [veto] - 참을 돌려주면 그 몬스터를 제외합니다
 * @returns {{monster: string, rarity: number}[]} 후보 목록
 */
export function candidatesAt(entries, depth, veto) {
    const out = [];
    for (const entry of entries) {
        if (depth < entry.min || depth > entry.max) continue;
        if (veto && veto(entry.monster)) continue;

        const rarity = rarityAt(entry, depth);
        // 원본은 여기서 rar > 0 을 단언합니다. 0 이 나오면 표나 공식이 잘못된 것입니다.
        if (rarity <= 0) continue;

        out.push({ monster: entry.monster, rarity });
    }
    return out;
}

/**
 * 깊이에 맞는 몬스터를 하나 뽑습니다.
 *
 * 가중치를 모두 더한 뒤 random2 로 한 번 굴리고, 후보를 훑으며 빼 나가다
 * 음수가 되는 지점의 몬스터를 고릅니다. 원본과 같은 방식입니다.
 * @param {object[]} entries - 출현표 항목들
 * @param {number} depth - 가지 안에서의 깊이
 * @param {(monster: string) => boolean} [veto] - 제외 조건
 * @returns {string|null} 뽑힌 몬스터의 열거형 이름. 후보가 없으면 null
 */
export function pickMonster(entries, depth, veto) {
    const candidates = candidatesAt(entries, depth, veto);
    if (candidates.length === 0) return null;

    let total = candidates.reduce((sum, c) => sum + c.rarity, 0);
    let roll = random2(total);

    for (const candidate of candidates) {
        roll -= candidate.rarity;
        if (roll < 0) return candidate.monster;
    }

    // 여기 도달하면 가중치 합 계산이 어긋난 것입니다. 마지막 후보로 물러섭니다.
    return candidates[candidates.length - 1].monster;
}

/**
 * 특정 몬스터가 그 깊이에서 뽑힐 확률을 구합니다.
 *
 * 뽑기와 같은 가중치를 쓰되 굴리지 않습니다. 밸런스를 확인하거나
 * 표를 검증할 때 씁니다.
 * @param {object[]} entries - 출현표 항목들
 * @param {number} depth - 깊이
 * @param {string} monster - 열거형 이름
 * @returns {number} 0~1 사이의 확률
 */
export function probabilityAt(entries, depth, monster) {
    const candidates = candidatesAt(entries, depth);
    const total = candidates.reduce((sum, c) => sum + c.rarity, 0);
    if (total === 0) return 0;

    const mine = candidates.filter(c => c.monster === monster)
        .reduce((sum, c) => sum + c.rarity, 0);
    return mine / total;
}

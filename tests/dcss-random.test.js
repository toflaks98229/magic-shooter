/**
 * @fileoverview DCSS 난수 도우미가 원본과 같은 분포를 내는지 확인합니다.
 *
 * 이 파일이 이 이식 작업 전체의 토대입니다. 여기가 틀리면 AC 감산도 명중률도
 * 몬스터 HP 도 전부 미묘하게 어긋나는데, 수치 표는 멀쩡해 보이므로 알아채기 어렵습니다.
 *
 * 그래서 '실행되는지'가 아니라 '분포가 맞는지'를 봅니다.
 * 경계값은 결정적으로, 분포는 난수원을 고정하거나 표본을 크게 잡아 확인합니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

const R = await import('../Script/dcss/random.js');

/**
 * 난수원을 정해진 수열로 바꿔 결정적으로 만듭니다.
 * @param {number[]} values - 차례로 돌려줄 [0,1) 값들. 다 쓰면 처음으로 돌아갑니다
 */
function withSequence(values) {
    let i = 0;
    R.setRandomSource(() => values[i++ % values.length]);
}

/**
 * 함수를 여러 번 실행해 결과를 모읍니다.
 * @param {number} times - 실행 횟수
 * @param {() => number} fn - 실행할 함수
 * @returns {number[]} 결과 목록
 */
function sample(times, fn) {
    R.resetRandomSource();
    const out = [];
    for (let i = 0; i < times; i++) out.push(fn());
    return out;
}

/** @param {number[]} xs @returns {number} 평균 */
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

// --- random2 ------------------------------------------------------------------

test('random2 는 max 가 1 이하면 0 이다', () => {
    // random2(1) === 0 이라는 성질을 DCSS 가 곳곳에서 이용합니다.
    // 예를 들어 slaying +0 은 random2(1) 이라 아무것도 더하지 않습니다.
    // 여기서 1 을 0 처럼 다루지 않으면 slaying 이 전부 어긋납니다.
    R.resetRandomSource();
    assert.equal(R.random2(1), 0);
    assert.equal(R.random2(0), 0);
    assert.equal(R.random2(-5), 0);
});

test('random2 는 [0, max-1] 을 벗어나지 않는다', () => {
    const xs = sample(2000, () => R.random2(6));
    assert.equal(Math.min(...xs), 0);
    assert.equal(Math.max(...xs), 5, 'max 자신은 나오면 안 됩니다');
});

test('random2 의 평균이 (max-1)/2 에 수렴한다', () => {
    const xs = sample(20000, () => R.random2(10));
    assert.ok(Math.abs(mean(xs) - 4.5) < 0.15, `평균이 ${mean(xs).toFixed(3)} 입니다`);
});

test('random2 는 난수원의 경계를 원본처럼 다룬다', () => {
    withSequence([0]);
    assert.equal(R.random2(10), 0);
    withSequence([0.999999]);
    assert.equal(R.random2(10), 9);
    R.resetRandomSource();
});

// --- rollDice -----------------------------------------------------------------

test('rollDice 는 [num, num*size] 범위다', () => {
    const xs = sample(5000, () => R.rollDice(2, 6));
    assert.equal(Math.min(...xs), 2, '2d6 의 최소는 2 입니다');
    assert.equal(Math.max(...xs), 12, '2d6 의 최대는 12 입니다');
});

test('rollDice 의 평균이 num*(size+1)/2 다', () => {
    const xs = sample(20000, () => R.rollDice(2, 6));
    assert.ok(Math.abs(mean(xs) - 7) < 0.15, `2d6 평균이 ${mean(xs).toFixed(3)} 입니다`);
});

test('rollDice 는 인자가 0 이하면 예외 대신 0 을 준다', () => {
    // 계산 결과를 그대로 넘기는 호출부가 많아 원본이 일부러 이렇게 해 두었습니다.
    R.resetRandomSource();
    assert.equal(R.rollDice(0, 6), 0);
    assert.equal(R.rollDice(2, 0), 0);
    assert.equal(R.rollDice(-1, 6), 0);
});

// --- divRandRound -------------------------------------------------------------

test('divRandRound 는 나누어떨어지면 그대로다', () => {
    R.resetRandomSource();
    for (let i = 0; i < 50; i++) assert.equal(R.divRandRound(6, 2), 3);
});

test('divRandRound 는 floor 와 ceil 만 낸다', () => {
    const xs = sample(2000, () => R.divRandRound(7, 2));
    assert.deepEqual([...new Set(xs)].sort(), [3, 4]);
});

test('divRandRound 의 기댓값이 정확히 참값이다', () => {
    // 이것이 이 함수의 존재 이유입니다. floor 를 쓰면 편향이 누적되는데,
    // DCSS 는 이 함수를 도처에 써서 그것을 막습니다.
    const xs = sample(40000, () => R.divRandRound(7, 2));
    assert.ok(Math.abs(mean(xs) - 3.5) < 0.03, `기댓값이 ${mean(xs).toFixed(4)} 입니다`);
});

test('divRandRound 는 Math.floor 가 아니라 Math.trunc 로 자른다', () => {
    // C++ 의 정수 나눗셈은 0 쪽으로 자릅니다. 음수에서 floor 와 갈라집니다.
    withSequence([0]); // 나머지가 있어도 올리지 않도록 고정
    assert.equal(R.divRandRound(-7, 2), -3, 'floor 였다면 -4 가 됩니다');
    R.resetRandomSource();
});

// --- divRoundNear / divRoundUp ------------------------------------------------

test('divRoundNear 는 절반 이상이면 올린다', () => {
    R.resetRandomSource();
    assert.equal(R.divRoundNear(3, 2), 2, '1.5 는 2 로 올라갑니다');
    assert.equal(R.divRoundNear(149, 100), 1, '1.49 는 1 로 내려갑니다');
    assert.equal(R.divRoundNear(150, 100), 2, '1.50 은 2 로 올라갑니다');
});

test('divRoundUp 은 나머지가 있으면 항상 올린다', () => {
    R.resetRandomSource();
    assert.equal(R.divRoundUp(7, 2), 4);
    assert.equal(R.divRoundUp(6, 2), 3);
});

// --- random2avg ---------------------------------------------------------------

test('random2avg 는 random2 와 평균이 같고 분산이 작다', () => {
    const flat = sample(20000, () => R.random2(20));
    const tight = sample(20000, () => R.random2avg(20, 4));

    assert.ok(Math.abs(mean(flat) - mean(tight)) < 0.4,
        `평균이 달라졌습니다: ${mean(flat).toFixed(2)} vs ${mean(tight).toFixed(2)}`);

    const variance = (xs) => {
        const m = mean(xs);
        return mean(xs.map(x => (x - m) ** 2));
    };
    assert.ok(variance(tight) < variance(flat) / 2,
        `분산이 충분히 줄지 않았습니다: ${variance(flat).toFixed(1)} → ${variance(tight).toFixed(1)}`);
});

test('random2avg 는 첫 굴림만 max, 나머지는 max+1 을 쓴다', () => {
    // 대칭이 아닌 것이 의도된 부분입니다. 평균을 유지하면서 평균값이
    // max-1 근처까지 닿게 하는 장치라, 고치면 몬스터 HP 분포가 달라집니다.
    //
    // 최댓값으로는 구분할 수 없습니다. 정수 나눗셈이 차이를 가려서,
    // 모든 굴림에 max 를 써도 최댓값은 똑같이 max-1 이 나옵니다.
    // 평균만이 이 차이를 드러냅니다. 모든 굴림을 max 로 '정리'하면
    // 평균이 약 0.26 낮아지며, 그것이 몬스터 HP 분포를 통째로 밀어냅니다.
    R.resetRandomSource();
    const xs = sample(400000, () => R.random2avg(100, 2));

    // 원본: 약 49.49. 모든 굴림에 max 를 쓰면 약 49.23 으로 내려갑니다.
    assert.ok(Math.abs(mean(xs) - 49.49) < 0.13,
        `평균이 ${mean(xs).toFixed(4)} 입니다. ` +
        `49.23 근처라면 나머지 굴림에도 max 를 쓰고 있다는 뜻입니다.`);
});

test('random2avg 는 굴림이 많을수록 좁아진다', () => {
    const wide = sample(10000, () => R.random2avg(100, 2));
    const narrow = sample(10000, () => R.random2avg(100, 8));
    const spread = (xs) => Math.max(...xs) - Math.min(...xs);
    assert.ok(spread(narrow) < spread(wide),
        `8회(${spread(narrow)})가 2회(${spread(wide)})보다 좁아야 합니다`);
});

// --- randomRange --------------------------------------------------------------

test('randomRange 는 양끝을 모두 포함한다', () => {
    const xs = sample(3000, () => R.randomRange(3, 5));
    assert.deepEqual([...new Set(xs)].sort(), [3, 4, 5]);
});

// --- maybeRandom2Div ----------------------------------------------------------

test('maybeRandom2Div 는 분모를 더한 뒤 나눈다', () => {
    // random2(nom + denom) / denom 이지 random2(nom) / denom 이 아닙니다.
    // 이 한 칸 차이가 스킬 27 에서 명중 1 의 차이를 만듭니다.
    // 난수원을 최대로 고정하면 (nom + denom - 1) / denom 이 나와야 합니다.
    withSequence([0.999999]);
    // nom = 2700(스킬 27), denom = 100 → random2(2800) 최대 2799 → 27
    assert.equal(R.maybeRandom2Div(2700, 100, true), 27);
    // 분모를 더하지 않았다면 random2(2700) 최대 2699 → 26 이 됩니다
    R.resetRandomSource();
});

test('maybeRandom2Div 는 굴리지 않으면 절반을 준다', () => {
    R.resetRandomSource();
    assert.equal(R.maybeRandom2Div(2700, 100, false), 13);
});

// --- 확률 도우미 ---------------------------------------------------------------

test('xChanceInY 는 경계를 안전하게 다룬다', () => {
    R.resetRandomSource();
    assert.equal(R.xChanceInY(0, 100), false);
    assert.equal(R.xChanceInY(-1, 100), false);
    assert.equal(R.xChanceInY(100, 100), true);
    assert.equal(R.xChanceInY(200, 100), true);
});

test('xChanceInY 의 빈도가 확률과 맞는다', () => {
    R.resetRandomSource();
    let hits = 0;
    for (let i = 0; i < 40000; i++) if (R.xChanceInY(5, 100)) hits++;
    const rate = hits / 40000;
    assert.ok(Math.abs(rate - 0.05) < 0.005, `5% 여야 하는데 ${(rate * 100).toFixed(2)}% 입니다`);
});

test('bernoulli 는 여러 번 시도 중 한 번이라도 성공하면 참이다', () => {
    R.resetRandomSource();
    assert.equal(R.bernoulli(0, 0.5), false);
    assert.equal(R.bernoulli(5, 0), false);

    let hits = 0;
    for (let i = 0; i < 20000; i++) if (R.bernoulli(3, 0.5)) hits++;
    // 1 - 0.5^3 = 0.875
    assert.ok(Math.abs(hits / 20000 - 0.875) < 0.02, `기대 87.5%, 실제 ${(100 * hits / 20000).toFixed(1)}%`);
});

// --- applyChunkedAC -----------------------------------------------------------

test('applyChunkedAC 는 AC 가 오를수록 더 막는다', () => {
    R.resetRandomSource();
    const through = (ac) => mean(sample(2000, () => R.applyChunkedAC(100, ac)));

    const ac0 = through(0), ac20 = through(20), ac40 = through(40), ac80 = through(80);
    assert.ok(ac0 > ac20 && ac20 > ac40 && ac40 > ac80, '단조 감소해야 합니다');

    // 원본 주석: AC 20 은 22%, AC 40 은 39%, AC 80 은 63% 를 막습니다.
    assert.ok(Math.abs((100 - ac20) - 22) < 3, `AC20 이 ${(100 - ac20).toFixed(1)}% 막았습니다`);
    assert.ok(Math.abs((100 - ac40) - 39) < 3, `AC40 이 ${(100 - ac40).toFixed(1)}% 막았습니다`);
    assert.ok(Math.abs((100 - ac80) - 63) < 3, `AC80 이 ${(100 - ac80).toFixed(1)}% 막았습니다`);
});

test('applyChunkedAC 는 피해를 잘게 나눠도 기댓값이 같다', () => {
    // 규모 불변이 이 함수의 핵심 성질입니다. 일반 AC 감산과 달리
    // 같은 총량을 여러 번에 나눠 때려도 통과량이 달라지지 않습니다.
    R.resetRandomSource();
    const oneBig = mean(sample(3000, () => R.applyChunkedAC(60, 30)));
    const manySmall = mean(sample(3000, () => {
        let total = 0;
        for (let i = 0; i < 10; i++) total += R.applyChunkedAC(6, 30);
        return total;
    }));
    assert.ok(Math.abs(oneBig - manySmall) < 2,
        `한 번에 60: ${oneBig.toFixed(1)}, 여섯씩 열 번: ${manySmall.toFixed(1)}`);
});

// --- 난수원 교체 ---------------------------------------------------------------

test('난수원을 갈아 끼우면 결정적으로 재생된다', () => {
    // 세이브를 불러왔을 때 같은 상황에서 같은 결과가 나오려면 필요합니다.
    // 이 파일 밖에서 Math.random 을 부르는 곳이 생기면 조용히 깨지므로,
    // 앞으로 추가되는 공식은 반드시 이 모듈을 거쳐야 합니다.
    const roll = () => [R.random2(100), R.rollDice(3, 6), R.divRandRound(7, 2)];

    withSequence([0.1, 0.5, 0.9, 0.3]);
    const first = roll();
    withSequence([0.1, 0.5, 0.9, 0.3]);
    const second = roll();

    assert.deepEqual(first, second, '같은 씨앗에서 다른 결과가 나왔습니다');
    R.resetRandomSource();
});

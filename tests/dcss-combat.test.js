/**
 * @fileoverview DCSS 전투 수식과 조준 판정을 확인합니다.
 *
 * 수식은 굴림의 분포까지 원본과 같아야 합니다. 평균만 맞고 분포가 다르면
 * 표에 적힌 수치는 같은데 실제로 싸워 보면 다른 게임이 됩니다.
 *
 * 조준은 각도 허용치를 걷어낸 뒤의 동작을 봅니다. 예전에는 시야각의 1/8 안에만
 * 들어오면 맞았고, 그래서 화면 구석의 적이 정면의 적보다 먼저 맞기도 했습니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

const C = await import('../Script/dcss/combat.js');
const A = await import('../Script/dcss/aim.js');
const R = await import('../Script/dcss/random.js');

/** @param {number} n @param {() => number} fn @returns {number[]} 표본 */
function sample(n, fn) {
    R.resetRandomSource();
    const out = [];
    for (let i = 0; i < n; i++) out.push(fn());
    return out;
}
/** @param {number[]} xs @returns {number} 평균 */
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

// --- AC 감산 ------------------------------------------------------------------

test('일반 AC 는 평균 AC/2 만큼 뺀다', () => {
    // 비율이 아니라 뺄셈입니다. 이 성질이 DCSS 방어의 성격을 정합니다.
    const blocked = mean(sample(20000, () => 100 - C.applyAC(100, 20)));
    assert.ok(Math.abs(blocked - 10) < 0.3, `AC20 이 평균 ${blocked.toFixed(2)} 막았습니다`);
});

test('AC 는 피해를 0 아래로 내리지 않는다', () => {
    const xs = sample(3000, () => C.applyAC(1, 50));
    assert.equal(Math.min(...xs), 0);
});

test('AC 는 작은 피해 여러 번에 훨씬 강하다', () => {
    // 이 비대칭이 중요합니다. 큰 한 방은 거의 그대로 들어오고
    // 잔공격은 거의 다 막힙니다.
    const bigHit = mean(sample(5000, () => C.applyAC(100, 20))) / 100;
    const smallHits = mean(sample(5000, () => {
        let total = 0;
        for (let i = 0; i < 20; i++) total += C.applyAC(5, 20);
        return total;
    })) / 100;
    assert.ok(smallHits < bigHit / 2,
        `큰 한 방 ${(bigHit * 100).toFixed(0)}%, 잔공격 ${(smallHits * 100).toFixed(0)}% — 차이가 작습니다`);
});

test('비례 AC 는 규모에 무관하다', () => {
    // 잔공격이 많은 무기를 위한 규칙입니다. 나누어 때려도 총량이 같습니다.
    const opts = { rule: C.AC_RULE.PROPORTIONAL };
    const oneBig = mean(sample(3000, () => C.applyAC(60, 30, opts)));
    const manySmall = mean(sample(3000, () => {
        let t = 0;
        for (let i = 0; i < 10; i++) t += C.applyAC(6, 30, opts);
        return t;
    }));
    assert.ok(Math.abs(oneBig - manySmall) < 2,
        `한 번에 ${oneBig.toFixed(1)}, 나눠서 ${manySmall.toFixed(1)}`);
});

test('세 배 규칙은 세 번 굴려 더한다', () => {
    const blocked = mean(sample(10000, () => 200 - C.applyAC(200, 20, { rule: C.AC_RULE.TRIPLE })));
    assert.ok(Math.abs(blocked - 30) < 1, `기대 30, 실제 ${blocked.toFixed(2)}`);
});

test('AC 규칙 없음은 그대로 통과시킨다', () => {
    R.resetRandomSource();
    assert.equal(C.applyAC(37, 99, { rule: C.AC_RULE.NONE }), 37);
});

test('알 수 없는 AC 규칙은 조용히 넘어가지 않는다', () => {
    assert.throws(() => C.applyAC(10, 5, { rule: 'squishy' }), /알 수 없는 AC 규칙/);
});

test('GDR 은 낮은 굴림을 받쳐 주기만 한다', () => {
    // 좋은 굴림에 더해지지 않습니다. 하한일 뿐입니다.
    // 그래서 GDR 이 있어도 평균 감산이 크게 늘지는 않습니다.
    const gdr = C.gdrPercent(20);
    const withGdr = mean(sample(20000, () => 100 - C.applyAC(100, 20, { maxDamage: 100, gdr })));
    const without = mean(sample(20000, () => 100 - C.applyAC(100, 20)));
    assert.ok(withGdr >= without, 'GDR 이 있으면 덜 맞아야 합니다');
    assert.ok(withGdr - without < 6, `GDR 이 ${(withGdr - without).toFixed(1)} 만큼 더 막았습니다. 하한이 아니라 덧셈처럼 보입니다`);
});

test('GDR 비율이 원본 공식과 같다', () => {
    // gdr = floor(16 * AC^0.25) (player.cc:6806)
    assert.equal(C.gdrPercent(0), 0);
    assert.equal(C.gdrPercent(10), Math.trunc(16 * Math.pow(10, 0.25)));
    assert.equal(C.gdrPercent(40), Math.trunc(16 * Math.pow(40, 0.25)));
});

// --- 명중 --------------------------------------------------------------------

test('testHit 은 이미 굴린 값을 받는다', () => {
    // 상한과 굴린 값을 헷갈리면 명중률이 완전히 달라집니다.
    // 상한 30 을 그대로 넘기면 30-5=25 라 강제 무작위 구간을 빼고 언제나 맞습니다.
    R.resetRandomSource();
    let raw = 0;
    for (let i = 0; i < 20000; i++) if (C.testHit(30, 5) >= 0) raw++;
    assert.ok(raw / 20000 > 0.95, '상한을 그대로 넘기면 거의 언제나 맞습니다');

    // 굴려서 넘기면 (30-5)/30 = 0.833 이 되고, 강제 구간 보정 후 약 0.816 입니다.
    R.resetRandomSource();
    let rolled = 0;
    for (let i = 0; i < 20000; i++) if (C.testHit(C.rollToHit(30), 5) >= 0) rolled++;
    const rate = rolled / 20000;
    assert.ok(Math.abs(rate - 0.816) < 0.02, `기대 약 82%, 실제 ${(rate * 100).toFixed(1)}%`);
});

test('아무리 불리해도 최소 2.5% 는 맞는다', () => {
    // 강제 무작위 구간입니다. 수치로 절망적이어도 가끔 맞습니다.
    R.resetRandomSource();
    let hits = 0;
    for (let i = 0; i < 40000; i++) if (C.testHit(C.rollToHit(5), 1000) >= 0) hits++;
    const rate = hits / 40000;
    assert.ok(rate > 0.015 && rate < 0.04, `기대 약 2.5%, 실제 ${(rate * 100).toFixed(2)}%`);
});

test('아무리 유리해도 최소 2.5% 는 빗나간다', () => {
    R.resetRandomSource();
    let misses = 0;
    for (let i = 0; i < 40000; i++) if (C.testHit(1000, 0) < 0) misses++;
    const rate = misses / 40000;
    assert.ok(rate > 0.015 && rate < 0.04, `기대 약 2.5%, 실제 ${(rate * 100).toFixed(2)}%`);
});

test('명중 확률 계산이 실제 굴림과 맞는다', () => {
    // playerHitChance 는 굴리지 않고 확률만 구합니다. 히트박스 크기를 정하는 데 쓰이므로
    // 실제 굴림과 어긋나면 회피가 과녁에 잘못 반영됩니다.
    for (const [toLand, ev] of [[30, 5], [20, 10], [40, 30], [15, 14]]) {
        R.resetRandomSource();
        let hits = 0;
        const N = 40000;
        for (let i = 0; i < N; i++) if (C.testHit(C.rollToHit(toLand), ev) >= 0) hits++;

        const predicted = C.playerHitChance(toLand, ev);
        const actual = hits / N;
        assert.ok(Math.abs(predicted - actual) < 0.02,
            `to-hit ${toLand} vs EV ${ev}: 예측 ${predicted.toFixed(3)}, 실제 ${actual.toFixed(3)}`);
    }
});

test('몬스터 기본 명중값이 HD 를 따른다', () => {
    // mon_to_hit_base = 18 + hd * (숙련 ? 5 : 3) / 2 (fight.cc:239)
    assert.equal(C.monToHitBase(4, false), 18 + Math.trunc(4 * 3 / 2));
    assert.equal(C.monToHitBase(4, true), 18 + Math.trunc(4 * 5 / 2));
    assert.ok(C.monToHitBase(10) > C.monToHitBase(2), 'HD 가 높으면 잘 맞춰야 합니다');
});

// --- 회피 → 과녁 --------------------------------------------------------------

test('회피가 높을수록 과녁이 작아진다', () => {
    const base = 20;
    const easy = C.aimRadius(base, 30, 0);
    const hard = C.aimRadius(base, 30, 25);
    assert.ok(hard < easy, '회피가 높은 쪽이 작아야 합니다');
    assert.ok(easy <= base, '과녁이 기본 크기를 넘지 않아야 합니다');
    assert.ok(hard > 0, '과녁이 사라지면 영영 못 맞춥니다');
});

test('과녁은 넓이에 비례해 줄어든다', () => {
    // 명중 확률이 1/4 이면 넓이도 1/4, 즉 반지름은 절반이어야 합니다.
    // 반지름에 그대로 곱하면 회피의 영향이 지나치게 커집니다.
    const base = 100;
    const chance = C.playerHitChance(40, 30);
    const radius = C.aimRadius(base, 40, 30);
    assert.ok(Math.abs(radius / base - Math.sqrt(chance)) < 1e-9);
});

// --- 조준 판정 ----------------------------------------------------------------

const shooter = { x: 0, y: 0, angle: 0 };  // +x 방향을 봅니다

test('정면의 표적은 맞는다', () => {
    assert.equal(A.traceHit(shooter, { x: 100, y: 0 }, 10).hit, true);
});

test('등 뒤의 표적은 맞지 않는다', () => {
    // 겨눈 '선'이 아니라 '반직선'입니다. 뒤쪽으로 연장되면 안 됩니다.
    assert.equal(A.traceHit(shooter, { x: -100, y: 0 }, 10).hit, false);
});

test('과녁 밖으로 벗어나면 빗나간다', () => {
    assert.equal(A.traceHit(shooter, { x: 100, y: 9 }, 10).hit, true);
    assert.equal(A.traceHit(shooter, { x: 100, y: 11 }, 10).hit, false);
});

test('멀수록 같은 각도라도 맞추기 어렵다', () => {
    // 각도 허용치 방식과 갈라지는 지점입니다. 각도로 봐주면 거리와 무관하게
    // 같은 각도가 맞았지만, 겨눈 선으로 보면 멀어질수록 옆으로 벌어집니다.
    const angle = 0.05;
    const near = { x: 50 * Math.cos(angle), y: 50 * Math.sin(angle) };
    const far = { x: 400 * Math.cos(angle), y: 400 * Math.sin(angle) };

    assert.equal(A.traceHit(shooter, near, 10).hit, true, '가까우면 맞아야 합니다');
    assert.equal(A.traceHit(shooter, far, 10).hit, false, '같은 각도라도 멀면 빗나가야 합니다');
});

test('겹쳐 선 적 중 앞의 것이 막아선다', () => {
    const targets = [
        { id: 'far', x: 200, y: 0 },
        { id: 'near', x: 60, y: 0 },
    ];
    const hit = A.pickAimedTarget(shooter, targets, () => 10);
    assert.equal(hit.target.id, 'near');
});

test('겨눈 선 밖의 적은 가까워도 고르지 않는다', () => {
    // 예전 각도 보정의 가장 큰 문제였습니다. 옆에 붙어 선 적이
    // 정면의 적을 제치고 맞곤 했습니다.
    const targets = [
        { id: 'beside', x: 30, y: 25 },   // 가깝지만 옆
        { id: 'ahead', x: 150, y: 0 },    // 멀지만 정면
    ];
    const hit = A.pickAimedTarget(shooter, targets, () => 10);
    assert.equal(hit.target.id, 'ahead');
});

test('조건에 걸리면 고르지 않는다', () => {
    const targets = [{ id: 'blocked', x: 100, y: 0 }];
    assert.equal(A.pickAimedTarget(shooter, targets, () => 10, () => false), null);
});

test('사거리 밖은 고르지 않는다', () => {
    const targets = [{ id: 'far', x: 500, y: 0 }];
    assert.equal(A.pickAimedTarget(shooter, targets, () => 10, (_, forward) => forward <= 100), null);
});

// --- 몬스터 수치 --------------------------------------------------------------

test('몬스터 HP 가 문서화된 범위 안에 들어온다', () => {
    // 원본 주석: 평균에서 ±33% 를 넘지 않고, 95% 는 ±10% 안입니다.
    const xs = sample(20000, () => C.rollMonsterHp(130));  // 평균 13
    assert.ok(Math.abs(mean(xs) - 13) < 0.3, `평균이 ${mean(xs).toFixed(2)} 입니다`);
    assert.ok(Math.min(...xs) >= Math.floor(13 * 0.67) - 1, `최소가 ${Math.min(...xs)} 입니다`);
    assert.ok(Math.max(...xs) <= Math.ceil(13 * 1.33) + 1, `최대가 ${Math.max(...xs)} 입니다`);

    // 원본 주석은 '95% 가 ±10% 안'이라고 하지만 실제로는 그렇지 않습니다.
    // random2avg(2*variance, 8) 의 표준편차가 평균의 약 6.7% 라
    // ±10% 는 1.48 시그마, 즉 86% 남짓입니다. 주석이 낙관적인 것이지
    // 구현이 틀린 것이 아닙니다. 수식을 원본과 한 줄씩 대조해 확인했습니다.
    //
    // 그래서 주석의 숫자 대신, 구조적으로 보장되는 성질을 봅니다.
    // 반올림이 묻히도록 큰 몬스터로 확인합니다.
    const big = sample(20000, () => C.rollMonsterHp(5000));   // 평균 500

    // ±33% 는 구성상 넘을 수 없는 한계입니다.
    assert.ok(Math.min(...big) >= 500 * 0.66, `최소가 ${Math.min(...big)} 입니다`);
    assert.ok(Math.max(...big) <= 500 * 1.34, `최대가 ${Math.max(...big)} 입니다`);

    // 여덟 번 굴려 평균 내므로 가운데로 확실히 몰려야 합니다.
    const within20 = big.filter(h => Math.abs(h - 500) <= 100).length / big.length;
    assert.ok(within20 > 0.99, `±20% 안이 ${(within20 * 100).toFixed(1)}% 뿐입니다`);
});

test('몬스터 HP 는 최소 1 이다', () => {
    const xs = sample(2000, () => C.rollMonsterHp(1));
    assert.ok(Math.min(...xs) >= 1);
});

test('몬스터 피해는 1 부터 시작한다', () => {
    // 1 + random2(damage) 이므로 0 이 나오지 않습니다.
    const xs = sample(10000, () => C.rollMonsterDamage(6));
    assert.equal(Math.min(...xs), 1);
    assert.equal(Math.max(...xs), 6);
    assert.ok(Math.abs(mean(xs) - 3.5) < 0.1);
});

// --- 플레이어 피해 ------------------------------------------------------------

test('능력치가 높을수록 피해가 는다', () => {
    const weak = mean(sample(8000, () => C.rollPlayerDamage({ baseDamage: 10, attribute: 5 })));
    const strong = mean(sample(8000, () => C.rollPlayerDamage({ baseDamage: 10, attribute: 25 })));
    assert.ok(strong > weak * 1.3, `힘 5: ${weak.toFixed(2)}, 힘 25: ${strong.toFixed(2)}`);
});

test('스킬이 높을수록 피해가 는다', () => {
    const unskilled = mean(sample(8000, () =>
        C.rollPlayerDamage({ baseDamage: 10, attribute: 10, weaponSkill: 0, fightingSkill: 0 })));
    const skilled = mean(sample(8000, () =>
        C.rollPlayerDamage({ baseDamage: 10, attribute: 10, weaponSkill: 27, fightingSkill: 27 })));
    assert.ok(skilled > unskilled * 1.5, `스킬 0: ${unskilled.toFixed(2)}, 스킬 27: ${skilled.toFixed(2)}`);
});

test('주 굴림이 0 부터라 피해 편차가 크다', () => {
    // 원본 그대로입니다. FPS 손맛으로는 나쁠 수 있지만 임의로 좁히지 않았습니다.
    const xs = sample(8000, () => C.rollPlayerDamage({ baseDamage: 20, attribute: 10 }));
    assert.equal(Math.min(...xs), 0, '0 이 나오지 않으면 주 굴림이 원본과 다릅니다');
    assert.ok(Math.max(...xs) > 15, `최대가 ${Math.max(...xs)} 뿐입니다`);
});

test('살상 보정은 고정값이 아니라 굴림이다', () => {
    // +N 은 random2(N+1) 이라 평균이 N/2 입니다. 고정으로 더하면 두 배 세집니다.
    const added = mean(sample(20000, () => C.applySlaying(0, 10)));
    assert.ok(Math.abs(added - 5) < 0.15, `기대 5, 실제 ${added.toFixed(3)}`);
});

test('살상 +0 은 아무것도 더하지 않는다', () => {
    // random2(1) 이 0 이라는 성질에 기댑니다.
    R.resetRandomSource();
    for (let i = 0; i < 200; i++) assert.equal(C.applySlaying(7, 0), 7);
});

// --- 플레이어 HP --------------------------------------------------------------

test('플레이어 최대 HP 가 원본 공식과 같다', () => {
    // hp = floor(XL*11/2) + 8, 격투 스킬과 종족 보정이 더해집니다.
    assert.equal(C.playerMaxHp(1, 0, 0), Math.trunc(1 * 11 / 2) + 8);
    assert.equal(C.playerMaxHp(27, 0, 0), Math.trunc(27 * 11 / 2) + 8);
    assert.ok(C.playerMaxHp(10, 10, 0) > C.playerMaxHp(10, 0, 0), '격투 스킬이 HP 를 올려야 합니다');
    assert.ok(C.playerMaxHp(10, 0, 2) > C.playerMaxHp(10, 0, 0), '종족 보정이 반영되어야 합니다');
    assert.ok(C.playerMaxHp(1, 0, -30) >= 1, 'HP 는 최소 1 입니다');
});

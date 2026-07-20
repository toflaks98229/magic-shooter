/**
 * @fileoverview DCSS 의 aut 시간 단위가 실시간으로 옳게 환산되는지 확인합니다.
 *
 * 중요한 것은 절대 속도가 아니라 '비율'입니다. AUT_MS 를 바꾸면 게임 전체가
 * 함께 빨라지거나 느려질 뿐, 몬스터가 플레이어보다 몇 배 빠른지는 달라지면 안 됩니다.
 * 그 비율이 DCSS 밸런스 그 자체이기 때문입니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';

const T = await import('../Script/dcss/time.js');
const R = await import('../Script/dcss/random.js');

test('기본 행동 하나가 한 턴이다', () => {
    // DCSS 의 1턴 = 10 aut 이라는 정의 그 자체입니다.
    assert.equal(T.BASELINE_DELAY, 10);
    assert.equal(T.autToMs(T.BASELINE_DELAY), 500, '기본 행동은 0.5초여야 합니다');
});

test('aut 과 ms 는 서로 되돌릴 수 있다', () => {
    for (const auts of [1, 6, 10, 15, 33]) {
        assert.equal(T.msToAut(T.autToMs(auts)), auts);
    }
});

test('몬스터 speed 10 은 플레이어와 같은 속도다', () => {
    // 이것이 DCSS 몬스터 데이터를 읽는 기준입니다.
    // speed 필드가 없는 몬스터는 10 이 기본값이며, 플레이어와 대등하다는 뜻입니다.
    assert.equal(T.monsterActionAuts(10), T.BASELINE_DELAY);
    assert.equal(T.monsterActionMs(10), 500);
});

test('몬스터 speed 는 비율이라 두 배면 주기가 절반이다', () => {
    assert.equal(T.monsterActionMs(20), 250, 'speed 20 은 두 배 빠릅니다');
    assert.equal(T.monsterActionMs(5), 1000, 'speed 5 는 절반 속도입니다');
    // 나누어떨어지지 않는 speed 는 부동소수점 오차가 남으므로 허용 범위로 봅니다.
    assert.ok(Math.abs(T.monsterActionMs(15) - 1000 / 3) < 1e-9, 'speed 15 는 1.5배입니다');
});

test('speed 를 주지 않으면 기본값 10 으로 본다', () => {
    // 683종 중 249종만 speed 필드를 갖고 나머지는 생략되어 있습니다.
    // 생략은 '기본 속도'라는 뜻이므로 여기서 틀리면 몬스터 절반이 잘못된 속도가 됩니다.
    assert.equal(T.monsterActionMs(), T.monsterActionMs(10));
});

test('speed 0 은 느린 것이 아니라 움직이지 않는 것이다', () => {
    // 식물·조형물·포탑 25종이 speed 0 입니다.
    // 원본은 에너지를 줄 때 speed > 0 을 확인해 아예 거릅니다. (mon-act.cc:1732)
    // 이것을 기본값 10 으로 되돌리면 나무가 플레이어를 쫓아옵니다.
    assert.equal(T.monsterActionAuts(0), Infinity);
    assert.equal(T.monsterActionMs(0), Infinity);
    assert.equal(T.canAct(0), false);
    assert.equal(T.canAct(-1), false);
    assert.equal(T.canAct(10), true);
    assert.equal(T.canAct(), true, 'speed 를 생략하면 기본 속도입니다');
});

test('가속은 시간 비용을 2/3 로 줄인다', () => {
    // DCSS 의 haste 는 행동 속도 1.5배입니다. (defines.h:192-196)
    // divRandRound 를 쓰므로 매번 흔들립니다. 기댓값으로 확인합니다.
    R.resetRandomSource();
    let total = 0;
    for (let i = 0; i < 20000; i++) total += T.hastenCost(10);
    const avg = total / 20000;
    assert.ok(Math.abs(avg - 20 / 3) < 0.05, `기대 6.67, 실제 ${avg.toFixed(3)}`);
});

test('감속은 시간 비용을 3/2 로 늘린다', () => {
    R.resetRandomSource();
    let total = 0;
    for (let i = 0; i < 20000; i++) total += T.slowCost(10);
    const avg = total / 20000;
    assert.ok(Math.abs(avg - 15) < 0.05, `기대 15, 실제 ${avg.toFixed(3)}`);
});

test('가속과 감속은 서로를 되돌린다', () => {
    // 둘 다 걸리면 원래대로 돌아와야 합니다. 기댓값 기준입니다.
    R.resetRandomSource();
    let total = 0;
    for (let i = 0; i < 20000; i++) total += T.slowCost(T.hastenCost(10));
    assert.ok(Math.abs(total / 20000 - 10) < 0.1, `기대 10, 실제 ${(total / 20000).toFixed(3)}`);
});

test('몬스터 쪽 가속은 speed 를 곱한다', () => {
    // 플레이어는 '비용'을 다루고 몬스터는 '비율'을 다루므로 방향이 반대입니다.
    // 같은 매크로를 쓰면서 의미가 뒤집히는 지점이라 원본에서도 헷갈리는 부분입니다.
    R.resetRandomSource();
    let hasted = 0, normal = 0;
    for (let i = 0; i < 4000; i++) {
        hasted += T.monsterActionMsWithStatus(10, { hasted: true });
        normal += T.monsterActionMsWithStatus(10, {});
    }
    assert.ok(hasted / 4000 < normal / 4000,
        '가속된 몬스터가 더 자주 행동해야 합니다');
    assert.ok(Math.abs(hasted / 4000 - 500 / 1.5) < 20,
        `기대 약 333ms, 실제 ${(hasted / 4000).toFixed(0)}ms`);
});

test('몬스터 쪽 감속은 speed 를 나눈다', () => {
    R.resetRandomSource();
    let slowed = 0;
    for (let i = 0; i < 4000; i++) slowed += T.monsterActionMsWithStatus(10, { slowed: true });
    assert.ok(Math.abs(slowed / 4000 - 750) < 40,
        `기대 약 750ms, 실제 ${(slowed / 4000).toFixed(0)}ms`);
});

test('AUT_MS 를 바꿔도 속도 비율은 그대로다', () => {
    // 이것이 이 파일의 존재 이유입니다. AUT_MS 는 게임 전체의 체감 속도를 정하는
    // 손잡이일 뿐이고, 몬스터끼리의 상대 속도는 DCSS 그대로 유지되어야 합니다.
    const ratio = T.monsterActionMs(20) / T.monsterActionMs(10);
    assert.equal(ratio, 0.5, 'speed 20 은 언제나 speed 10 의 절반 주기입니다');

    const ratio15 = T.monsterActionMs(15) / T.monsterActionMs(10);
    assert.ok(Math.abs(ratio15 - 2 / 3) < 1e-9);
});

test('행동 비용이 속도와 따로 논다', () => {
    // DCSS 는 속도를 두 축으로 나눕니다. speed 는 에너지를 버는 속도,
    // energy 는 행동 하나의 값입니다. 이 분리가 있어야
    // '빠르게 다가와 크게 휘두르는' 적을 표현할 수 있습니다.
    assert.equal(T.actionAuts(10, 10), 10, '기준은 10 aut');
    assert.equal(T.actionAuts(20, 10), 5, '두 배 빠르면 절반');
    assert.equal(T.actionAuts(10, 20), 20, '비용이 두 배면 두 배');
    assert.equal(T.actionAuts(20, 20), 10, '둘이 상쇄되면 기준으로 돌아옵니다');
});

test('행동 비용을 주지 않으면 기준값을 쓴다', () => {
    assert.equal(T.actionAuts(13), T.actionAuts(13, 10));
});

test('움직이지 않는 몬스터는 어떤 행동도 하지 않는다', () => {
    assert.equal(T.actionAuts(0, 10), Infinity);
    assert.equal(T.actionMs(0, 5), Infinity);
});

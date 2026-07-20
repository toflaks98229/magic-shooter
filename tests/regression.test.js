/**
 * @fileoverview 시뮬레이션 회귀 검사.
 *
 * 결정론적 시나리오를 1800프레임 재생하고, 그 결과를 저장된 기준 스냅샷과 비교합니다.
 * 이 테스트가 깨졌다는 것은 게임 동작이 바뀌었다는 뜻입니다.
 * 의도한 변경이라면 `npm run test:update-snapshot`으로 기준을 갱신하십시오.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runSimulation } from './helpers/simulation.js';
import { SNAPSHOT_PATH } from './helpers/snapshot-path.js';

const snapshot = await runSimulation();

test('시뮬레이션 결과가 기준 스냅샷과 일치한다', () => {
    const expected = JSON.parse(readFileSync(SNAPSHOT_PATH, 'utf8'));
    assert.deepEqual(snapshot, expected,
        '게임 동작이 바뀌었습니다. 의도한 변경이면 npm run test:update-snapshot 을 실행하고 diff를 확인하십시오.');
});

test('시나리오가 의도한 경로를 실제로 통과한다', () => {
    // 스냅샷이 일치하더라도 시나리오가 비어 있으면 의미가 없으므로,
    // 주요 경로가 실제로 실행되었는지 별도로 확인합니다.
    assert.ok(snapshot.stats.attacks > 100, '공격이 충분히 수행되어야 한다');
    assert.ok(snapshot.stats.sounds > 0, '사운드 이벤트가 발생해야 한다');

    // 이 갈래에서는 싸울 수 없습니다. 적을 죽일 수단이 없는 것이 중심이라,
    // 명중이나 처치가 생기면 오히려 무언가 잘못된 것입니다.
    //
    // main 갈래에서는 이 자리가 반대였습니다. '한 번도 명중하지 않으면
    // 피해 계산이 검사되지 않는다' 를 지키고 있었고, 실제로 그 검사가
    // 커버리지 구멍을 세 번 잡았습니다. 되돌릴 때 그 뜻을 되살려야 합니다.
    assert.equal(snapshot.stats.hits, 0, '싸울 수 없는데 명중이 생겼습니다');
    assert.equal(snapshot.stats.kills, 0, '싸울 수 없는데 적이 죽었습니다');
    // 몇 번 열리는지는 플레이어가 어디로 걸었는지에 달린 부수적인 값입니다.
    // 전투가 바뀔 때마다 경로가 달라져 이 숫자도 흔들리므로,
    // '문 여는 경로를 지났는가'만 봅니다. 정확한 횟수는 스냅샷이 지킵니다.
    assert.ok(snapshot.stats.doorsOpened >= 1, '문 여는 경로를 지나야 한다');
    assert.equal(snapshot.stats.floors, 2, '층 전환이 한 번 일어나야 한다');
    assert.equal(snapshot.floor, 2, '최종 층은 2여야 한다');
    // 무기 교체는 전투에 딸린 것이라 이 갈래에서는 일어나지 않습니다.
    // 쏘지 않으니 탄약이 줄지 않고, 줄지 않으니 바뀔 일이 없습니다.
    assert.equal(snapshot.weapon, 'gun', '싸우지 않는데 무기가 바뀌었습니다');
});

test('월드가 통째로 직렬화된다', () => {
    // 서브 던전 스택과 저장/불러오기가 성립하기 위한 전제 조건입니다.
    assert.equal(snapshot.serializable, true);
});

test('시뮬레이션 결과에 NaN이나 무한대가 없다', () => {
    const numbers = JSON.stringify(snapshot).match(/-?\d+\.?\d*(e[+-]\d+)?/gi) || [];
    assert.ok(numbers.length > 0);
    assert.ok(!JSON.stringify(snapshot).includes('NaN'), 'NaN이 섞이면 안 된다');
    assert.ok(!JSON.stringify(snapshot).includes('Infinity'), '무한대가 섞이면 안 된다');
});

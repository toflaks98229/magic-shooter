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
    assert.equal(snapshot.stats.doorsOpened, 2, '문이 두 번 열려야 한다');
    assert.equal(snapshot.stats.floors, 2, '층 전환이 한 번 일어나야 한다');
    assert.equal(snapshot.floor, 2, '최종 층은 2여야 한다');
    assert.equal(snapshot.weapon, 'fist', '탄약 소진 후 주먹으로 교체되어야 한다');
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

/**
 * @fileoverview 회귀 검사용 기준 스냅샷을 갱신합니다.
 *
 *   npm run test:update-snapshot
 *
 * 게임 동작을 '의도적으로' 바꿨을 때만 실행하십시오.
 * 실행 후에는 반드시 git diff로 스냅샷의 변화가 의도한 변경과 일치하는지 확인해야 합니다.
 * 확인 없이 갱신하면 회귀 검사가 무의미해집니다.
 */

import { writeFileSync } from 'node:fs';
import { runSimulation } from './helpers/simulation.js';
import { SNAPSHOT_PATH } from './helpers/snapshot-path.js';

const snapshot = await runSimulation();
writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + '\n', 'utf8');

console.log(`기준 스냅샷을 갱신했습니다: ${SNAPSHOT_PATH}`);
console.log('git diff 로 변화가 의도한 것인지 반드시 확인하십시오.');

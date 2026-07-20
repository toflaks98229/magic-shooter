/**
 * @fileoverview 기준 스냅샷 파일의 경로.
 * 갱신 스크립트와 회귀 테스트가 같은 파일을 가리키도록 한 곳에서 정의합니다.
 */

import { fileURLToPath } from 'node:url';

/** @description tests/snapshot.json 의 절대 경로 */
export const SNAPSHOT_PATH = fileURLToPath(new URL('../snapshot.json', import.meta.url));

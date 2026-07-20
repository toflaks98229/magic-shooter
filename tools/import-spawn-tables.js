/**
 * @fileoverview DCSS 의 몬스터 출현표를 옮깁니다.
 *
 * 사용법:
 *   node tools/import-spawn-tables.js [크롤 소스 경로]
 *   기본값은 Data/crawl/crawl-ref/source 입니다 (DCSS 0.34 브랜치).
 *
 * mon-pick-data.h 는 던전 가지마다 "어느 깊이에서 어떤 몬스터가 얼마나 자주 나오는가"를
 * 정의합니다. 항목 하나는 { 최소깊이, 최대깊이, 가중치, 분포모양, 몬스터 } 이고,
 * 분포모양이 깊이에 따라 가중치를 어떻게 바꿀지 정합니다.
 *
 *   FLAT  범위 내내 같은 확률
 *   SEMI  가운데가 100%, 양끝이 50%
 *   PEAK  가운데가 100%, 범위 밖에서 0 이 되도록 양끝이 낮음
 *   RISE  깊어질수록 증가
 *   FALL  깊어질수록 감소
 *
 * 이 표가 곧 DCSS 의 난이도 곡선입니다. 층마다 무엇이 나오는지가 여기서 정해지므로,
 * 몬스터 수치를 아무리 정확히 옮겨도 이 표가 없으면 다른 게임이 됩니다.
 *
 * 출처: crawl-ref/source/mon-pick-data.h
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * 헤더에서 항목 줄을 뽑습니다.
 * 형식: `  { -3,  3,  250, SEMI, MONS_RAKSHASA },\`
 * @param {string} line - 한 줄
 * @returns {{min: number, max: number, weight: number, shape: string, monster: string}|null} 항목
 */
function parseEntry(line) {
    const m = line.match(/\{\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([A-Z]+)\s*,\s*(MONS_[A-Z0-9_]+)\s*\}/);
    if (!m) return null;
    return {
        min: parseInt(m[1], 10),
        max: parseInt(m[2], 10),
        weight: parseInt(m[3], 10),
        shape: m[4],
        monster: m[5],
    };
}

/**
 * mon-pick-data.h 를 읽어 가지별 출현표를 만듭니다.
 * @param {string} sourceDir - 크롤 소스 경로
 * @returns {{tables: object, depthsMacro: object[]}} 가지 이름 → 항목 목록
 */
export function importSpawnTables(sourceDir) {
    const text = fs.readFileSync(path.join(sourceDir, 'mon-pick-data.h'), 'utf8');
    const lines = text.split(/\r?\n/);

    // Depths 는 매크로로 빼내어 두 곳에서 재사용합니다. 먼저 모아 둡니다.
    const depthsMacro = [];
    let inMacro = false;
    for (const line of lines) {
        if (line.startsWith('#define POP_DEPTHS')) { inMacro = true; continue; }
        if (inMacro) {
            const entry = parseEntry(line);
            if (entry) depthsMacro.push(entry);
            // 매크로는 역슬래시로 이어지므로, 이어지지 않는 줄에서 끝납니다.
            if (!line.trimEnd().endsWith('\\')) inMacro = false;
        }
    }

    // population[] 안의 각 블록은 `{ // Dungeon (OOD cap: 27)` 로 시작합니다.
    // 매크로(POP_DEPTHS)만 `/* */` 주석을 쓰므로 여기서는 `//` 만 봅니다.
    const tables = {};
    let current = null;

    for (const line of lines) {
        const header = line.match(/^\{\s*\/\/\s*(.+?)\s*(?:\(OOD cap:\s*(\d+)\))?\s*$/);
        if (header) {
            current = header[1].trim();
            tables[current] = { oodCap: header[2] ? parseInt(header[2], 10) : null, entries: [] };
            continue;
        }

        if (!current) continue;

        if (line.includes('POP_DEPTHS')) {
            // 매크로를 펼쳐 넣습니다. Depths 는 두 가지가 같은 목록을 공유합니다.
            tables[current].entries.push(...depthsMacro);
            continue;
        }

        const entry = parseEntry(line);
        if (entry) { tables[current].entries.push(entry); continue; }

        // 블록의 끝. 항목도 헤더도 아닌 닫는 중괄호입니다.
        if (/^\}\s*,?\s*$/.test(line)) current = null;
    }

    // 항목이 하나도 없는 표는 몬스터가 나오지 않는 가지입니다. 그대로 둡니다.
    return { tables, depthsMacro };
}

/**
 * 데이터를 자바스크립트 모듈로 씁니다.
 *
 * JSON 으로 두면 브라우저에서 fetch 하거나 import 속성을 써야 하는데,
 * 이 프로젝트는 빌드 단계가 없고 모듈을 그대로 불러 쓰는 구조입니다.
 * .js 로 내보내면 Node 와 브라우저 양쪽에서 그냥 import 하면 됩니다.
 * @param {string} outPath - 쓸 경로
 * @param {string} name - export 할 이름
 * @param {*} value - 담을 값
 * @param {string} note - 파일 머리말에 남길 설명
 */
function writeDataModule(outPath, name, value, note) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath,
        `/**
 * @fileoverview ${note}
 *
`
        + ` * 이 파일은 손으로 고치지 마십시오. tools 의 이식기가 만들어 냅니다.
`
        + ` * 출처: Dungeon Crawl Stone Soup 0.34 (GPL-2.0-or-later)
 */

`
        + `export const ${name} = ${JSON.stringify(value, null, 1)};
`);
}

// --- 명령줄로 실행했을 때 ------------------------------------------------------

if (process.argv[1] && process.argv[1].endsWith('import-spawn-tables.js')) {
    // 기본 출처는 저장소 안에 둔 DCSS 0.34 클론입니다.
    // 버전이 어긋나면 수치가 조용히 달라지므로 경로를 함부로 바꾸지 마십시오.
    const sourceDir = process.argv[2] || 'Data/crawl/crawl-ref/source';

    const { tables } = importSpawnTables(sourceDir);
    const outPath = path.join('Script', 'data', 'spawn-tables.js');
    writeDataModule(outPath, 'SPAWN_TABLES', tables, 'DCSS 의 가지별 몬스터 출현표입니다.');

    const names = Object.keys(tables);
    const total = names.reduce((sum, n) => sum + tables[n].entries.length, 0);
    console.log(`출현표 ${names.length}개, 항목 ${total}개를 옮겼습니다.`);
    for (const n of names.slice(0, 12)) {
        console.log(`  ${n.padEnd(22)} ${String(tables[n].entries.length).padStart(4)}항목`);
    }
    console.log(`  → ${outPath}`);
}

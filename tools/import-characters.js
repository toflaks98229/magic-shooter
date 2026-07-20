/**
 * @fileoverview DCSS 의 종족과 직업을 옮깁니다.
 *
 * 사용법:
 *   node tools/import-characters.js [크롤 소스 경로]
 *   기본값은 Data/crawl/crawl-ref/source 입니다 (DCSS 0.34 브랜치).
 *
 * 적성표는 docs/aptitudes.txt 에도 있지만 그쪽은 사람이 보라고 만든 표입니다.
 * 종족 YAML 에 같은 값이 기계가 읽는 형태로 들어 있으므로 그쪽을 씁니다.
 *
 * 적성은 '얼마나 빨리 배우는가'입니다. 0 이 기준이고 +4 면 두 배 빨리,
 * -4 면 절반 속도로 배웁니다. 스킬 비용에 곱해지며, `--` 는 아예 배울 수 없다는 뜻입니다.
 *
 * 출처: crawl-ref/source/dat/species/*.yaml, dat/jobs/*.yaml
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseYaml } from './lib/mini-yaml.js';

/**
 * @description 적성 항목 중 스킬이 아닌 것들.
 * 나머지는 전부 스킬 이름으로 취급합니다.
 */
const NON_SKILL_APTITUDES = new Set(['xp', 'hp', 'mp_mod', 'wl']);

/**
 * @description DCSS 의 스킬 스물아홉 가지.
 *
 * 종족 파일은 0 이 아닌 적성만 적습니다. 드라코니안 밑틀처럼 열세 개만 적힌 것도 있어,
 * 적힌 것만 담으면 종족마다 스킬 목록이 달라집니다. 그러면 조회할 때마다
 * 없는 값을 만나 계산이 undefined 로 흘러가므로, 여기서 0 으로 채웁니다.
 */
const ALL_SKILLS = [
    'fighting', 'short_blades', 'long_blades', 'axes', 'maces_and_flails', 'polearms',
    'staves', 'ranged_weapons', 'throwing', 'unarmed_combat',
    'armour', 'dodging', 'stealth', 'shields', 'shapeshifting',
    'spellcasting', 'conjurations', 'hexes', 'summoning', 'forgecraft', 'necromancy',
    'translocations', 'fire_magic', 'ice_magic', 'air_magic', 'earth_magic', 'alchemy',
    'invocations', 'evocations',
];

/**
 * 종족 YAML 하나를 표 항목으로 옮깁니다.
 * @param {object} raw - 파싱된 YAML
 * @param {string} file - 파일 이름
 * @returns {object} 종족 정의
 */
function convertSpecies(raw, file) {
    for (const required of ['name', 'aptitudes', 'str', 'int', 'dex']) {
        if (raw[required] === undefined) throw new Error(`${file}: ${required} 가 없습니다`);
    }

    const apt = raw.aptitudes;

    // 적히지 않은 스킬은 적성 0 입니다. 먼저 0 으로 채운 뒤 적힌 값으로 덮어씁니다.
    const skills = {};
    for (const name of ALL_SKILLS) skills[name] = 0;

    for (const [key, value] of Object.entries(apt)) {
        if (NON_SKILL_APTITUDES.has(key)) continue;
        // 스킬 이름은 대부분 밑줄인데 'ranged weapons' 만 공백이라 여기서 맞춥니다.
        const name = key.replace(/ /g, '_');
        if (!(name in skills)) throw new Error(`${file}: 모르는 스킬입니다: ${key}`);

        // DCSS 는 배울 수 없는 스킬을 False 로 적습니다. (문서의 '--' 에 해당)
        // null 로 남겨 적성 0(배울 수 있고 평범함)과 확실히 구분합니다.
        skills[name] = value === false ? null : value;
    }

    return {
        id: path.basename(file, '.yaml'),
        enumName: raw.enum ?? null,
        name: raw.name,

        // 기본 능력치
        str: raw.str,
        int: raw.int,
        dex: raw.dex,

        // 특수 적성. 스킬이 아니라 캐릭터 전반에 걸립니다.
        hpMod: apt.hp ?? 0,
        mpMod: apt.mp_mod ?? 0,
        xpMod: apt.xp ?? 0,
        wlMod: apt.wl ?? 3,

        skillAptitudes: skills,

        levelupStatFrequency: raw.levelup_stat_frequency ?? null,
        levelupStats: raw.levelup_stats ?? [],
        mutations: raw.mutations ?? null,
        recommendedJobs: raw.recommended_jobs ?? [],

        // difficulty 가 False 인 종족은 캐릭터 생성에서 따로 고를 수 없습니다.
        // 색 드라코니안 아홉이 여기 해당합니다. 드라코니안을 고르면
        // 7레벨에 색이 정해지는 구조라, 목록에는 밑틀 하나만 나옵니다.
        difficulty: raw.difficulty === false ? null : (raw.difficulty ?? null),
        selectable: raw.difficulty !== false,
        genus: raw.genus ?? null,
    };
}

/**
 * 직업 YAML 하나를 표 항목으로 옮깁니다.
 * @param {object} raw - 파싱된 YAML
 * @param {string} file - 파일 이름
 * @returns {object} 직업 정의
 */
function convertJob(raw, file) {
    for (const required of ['name', 'str', 'int', 'dex']) {
        if (raw[required] === undefined) throw new Error(`${file}: ${required} 가 없습니다`);
    }

    return {
        id: path.basename(file, '.yaml'),
        enumName: raw.enum ?? null,
        name: raw.name,
        category: raw.category ?? null,

        // 직업이 더해 주는 능력치
        str: raw.str,
        int: raw.int,
        dex: raw.dex,

        // 시작 스킬 레벨
        startingSkills: raw.skills ?? {},
        equipment: raw.equipment ?? [],
        weaponChoice: raw.weapon_choice ?? null,
        recommendedSpecies: raw.recommended_species ?? [],
    };
}

/**
 * 종족과 직업을 모두 읽습니다.
 * @param {string} sourceDir - 크롤 소스 경로
 * @returns {{species: object[], jobs: object[]}} 변환 결과
 */
export function importCharacters(sourceDir) {
    const read = (dir, convert) => {
        const full = path.join(sourceDir, 'dat', dir);
        return fs.readdirSync(full)
            // 폐기된 것만 뺍니다. draconian-base 는 이름과 달리 실제로 고를 수 있는
            // '드라코니안' 그 자체이고, 색깔별 파일은 7레벨에 정해지는 모습입니다.
            .filter(f => f.endsWith('.yaml') && !f.startsWith('deprecated-'))
            .sort()
            .map(f => convert(parseYaml(fs.readFileSync(path.join(full, f), 'utf8')), f));
    };

    return {
        species: read('species', convertSpecies),
        jobs: read('jobs', convertJob),
    };
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

if (process.argv[1] && process.argv[1].endsWith('import-characters.js')) {
    // 기본 출처는 저장소 안에 둔 DCSS 0.34 클론입니다.
    const sourceDir = process.argv[2] || 'Data/crawl/crawl-ref/source';

    const { species, jobs } = importCharacters(sourceDir);
    writeDataModule('Script/data/species.js', 'SPECIES_DATA', species, 'DCSS 종족 정의를 옮겨 온 표입니다.');
    writeDataModule('Script/data/jobs.js', 'JOB_DATA', jobs, 'DCSS 직업 정의를 옮겨 온 표입니다.');

    const skillNames = new Set();
    for (const s of species) for (const k of Object.keys(s.skillAptitudes)) skillNames.add(k);

    console.log(`종족 ${species.length}종, 직업 ${jobs.length}종을 옮겼습니다.`);
    console.log(`  스킬 ${skillNames.size}종의 적성이 들어 있습니다.`);
    console.log(`  → Script/data/species.json, jobs.js`);
}

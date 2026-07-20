/**
 * @fileoverview 종족·직업 데이터가 DCSS 원본과 맞는지 대조합니다.
 *
 *   npm run verify:chargen
 *
 * species.js 와 backgrounds.js 의 수치는 손으로 옮긴 것이라 조용히 틀릴 수 있습니다.
 * 타일 좌표를 눈으로 고르다 'hell 벽인 줄 알았던 것이 황금 벽돌'이었던 것과 같은 종류의 실수입니다.
 * 그래서 원본 yaml 을 다시 받아 한 줄씩 맞춰 봅니다.
 *
 * 네트워크가 필요하므로 테스트가 아니라 도구로 두었습니다. 데이터를 손볼 때 돌리면 됩니다.
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const CACHE_DIR = projectRoot + 'Data/tiles/.source-cache/chargen/';
const TAG = '0.34.0';
const BASE = `https://raw.githubusercontent.com/crawl/crawl/${TAG}/crawl-ref/source/dat/`;

/** @description species.js 의 키 -> 원본 yaml 파일 이름 */
const SPECIES_FILES = {
    armataur: 'armataur', barachi: 'barachi', coglin: 'coglin', deepElf: 'deep-elf',
    demigod: 'demigod', demonspawn: 'demonspawn', djinni: 'djinni', draconian: 'draconian-base',
    felid: 'felid', formicid: 'formicid', gargoyle: 'gargoyle', gnoll: 'gnoll',
    human: 'human', kobold: 'kobold', merfolk: 'merfolk', minotaur: 'minotaur',
    mountainDwarf: 'mountain-dwarf', mummy: 'mummy', naga: 'naga', octopode: 'octopode',
    oni: 'oni', poltergeist: 'poltergeist', revenant: 'revenant', spriggan: 'spriggan',
    tengu: 'tengu', troll: 'troll', vineStalker: 'vine-stalker',
};

/** @description backgrounds.js 의 키 -> 원본 yaml 파일 이름 */
const JOB_FILES = {
    fighter: 'fighter', gladiator: 'gladiator', monk: 'monk', berserker: 'berserker',
    chaosKnight: 'chaos-knight', cinderAcolyte: 'cinder-acolyte', reaver: 'reaver',
    shapeshifter: 'shapeshifter', hunter: 'hunter', brigand: 'brigand', artificer: 'artificer',
    delver: 'delver', warper: 'warper', hexslinger: 'hexslinger', hedgeWizard: 'hedge-wizard',
    conjurer: 'conjurer', summoner: 'summoner', necromancer: 'necromancer',
    forgewright: 'forgewright', enchanter: 'enchanter', fireElementalist: 'fire-elementalist',
    iceElementalist: 'ice-elementalist', airElementalist: 'air-elementalist',
    earthElementalist: 'earth-elementalist', alchemist: 'alchemist', wanderer: 'wanderer',
};

/**
 * 원본 yaml 을 받아 옵니다. 한 번 받은 것은 캐시에 두고 다시 쓰지 않습니다.
 * @param {string} path - dat/ 아래 경로
 * @returns {Promise<string|null>} 파일 내용
 */
async function fetchYaml(path) {
    if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
    const cached = CACHE_DIR + path.replace(/\//g, '__');
    if (existsSync(cached)) return readFileSync(cached, 'utf8');

    const response = await fetch(BASE + path);
    if (!response.ok) return null;
    const text = await response.text();
    writeFileSync(cached, text);
    return text;
}

/**
 * yaml 에서 한 항목의 값을 꺼냅니다.
 *
 * 온전한 yaml 파서를 쓸 만큼 복잡한 파일이 아니라, 필요한 만큼만 읽습니다.
 * 들여쓰기 없는 최상위 항목과 aptitudes 안의 항목만 봅니다.
 * @param {string} yaml - 파일 내용
 * @param {string} key - 항목 이름
 * @param {boolean} [nested] - aptitudes 안쪽인지
 * @returns {number|null} 값
 */
function readNumber(yaml, key, nested = false) {
    const pattern = nested
        ? new RegExp(`^\\s+${key}:\\s*(-?\\d+)\\s*$`, 'm')
        : new RegExp(`^${key}:\\s*(-?\\d+)\\s*$`, 'm');
    const match = yaml.match(pattern);
    return match ? Number(match[1]) : null;
}

const problems = [];

/**
 * 한 값을 대조하고 어긋나면 기록합니다.
 * @param {string} who - 무엇에 대한 것인지
 * @param {string} field - 항목 이름
 * @param {number|null} mine - 이 저장소의 값
 * @param {number|null} theirs - 원본의 값
 */
function compare(who, field, mine, theirs) {
    if (theirs === null) return;             // 원본에 없는 항목은 넘어갑니다.
    if (mine === theirs) return;
    problems.push(`${who}: ${field} 가 ${mine} 인데 원본은 ${theirs} 입니다`);
}

const { SPECIES } = await import('../Script/species.js');
const { BACKGROUNDS } = await import('../Script/backgrounds.js');

process.stdout.write('종족 ');
for (const [id, file] of Object.entries(SPECIES_FILES)) {
    const yaml = await fetchYaml(`species/${file}.yaml`);
    if (!yaml) { problems.push(`${id}: 원본 yaml 을 받지 못했습니다 (species/${file}.yaml)`); continue; }

    const mine = SPECIES[id];
    if (!mine) { problems.push(`${id}: species.js 에 없습니다`); continue; }

    compare(id, 'hp', mine.hp, readNumber(yaml, 'hp', true));
    compare(id, 'mpMod', mine.mpMod, readNumber(yaml, 'mp_mod', true));
    compare(id, 'xp', mine.xp, readNumber(yaml, 'xp', true));
    compare(id, 'wl', mine.wl, readNumber(yaml, 'wl', true));
    compare(id, 'str', mine.str, readNumber(yaml, 'str'));
    compare(id, 'int', mine.int, readNumber(yaml, 'int'));
    compare(id, 'dex', mine.dex, readNumber(yaml, 'dex'));
    process.stdout.write('.');
}

process.stdout.write('\n직업 ');
for (const [id, file] of Object.entries(JOB_FILES)) {
    const yaml = await fetchYaml(`jobs/${file}.yaml`);
    if (!yaml) { problems.push(`${id}: 원본 yaml 을 받지 못했습니다 (jobs/${file}.yaml)`); continue; }

    const mine = BACKGROUNDS[id];
    if (!mine) { problems.push(`${id}: backgrounds.js 에 없습니다`); continue; }

    compare(id, 'str', mine.str, readNumber(yaml, 'str'));
    compare(id, 'int', mine.int, readNumber(yaml, 'int'));
    compare(id, 'dex', mine.dex, readNumber(yaml, 'dex'));
    process.stdout.write('.');
}

process.stdout.write('\n\n');

// 빠진 것이 없는지도 봅니다. 원본에 있는데 여기 없으면 조용히 사라진 것입니다.
const missingSpecies = Object.keys(SPECIES).filter(id => !SPECIES_FILES[id]);
const missingJobs = Object.keys(BACKGROUNDS).filter(id => !JOB_FILES[id]);
if (missingSpecies.length) problems.push(`대조하지 않은 종족: ${missingSpecies.join(', ')}`);
if (missingJobs.length) problems.push(`대조하지 않은 직업: ${missingJobs.join(', ')}`);

if (problems.length === 0) {
    console.log(`원본(${TAG})과 모두 일치합니다. 종족 ${Object.keys(SPECIES_FILES).length}종 · 직업 ${Object.keys(JOB_FILES).length}종`);
} else {
    console.log(`어긋난 곳 ${problems.length}개:`);
    for (const problem of problems) console.log('  ' + problem);
    process.exitCode = 1;
}

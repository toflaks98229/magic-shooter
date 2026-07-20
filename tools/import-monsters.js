/**
 * @fileoverview DCSS 몬스터 YAML 683종을 이 게임이 읽는 JSON 으로 옮깁니다.
 *
 * 사용법:
 *   node tools/import-monsters.js <크롤 소스 경로>
 *   예) node tools/import-monsters.js ../crawl/crawl-ref/source
 *
 * 옮기는 것은 수치뿐입니다. 그림은 별개의 문제입니다.
 * DCSS 몬스터 그림은 Data/tiles/main.png 안에 전부 들어 있지만(배포판과 바이트가
 * 같습니다) 좌표표가 빌드 산출물이라 지금은 43종만 잘라 쓰고 있습니다.
 * 그림이 없는 몬스터는 glyph 와 colour 로 대신 그리게 두고, 나중에 좌표를 뽑아
 * 이 표의 spriteKey 만 채우면 됩니다.
 *
 * 출처: crawl-ref/source/dat/mons/*.yaml
 */

import fs from 'node:fs';
import path from 'node:path';
import { parseYaml } from './lib/mini-yaml.js';

/** @description 우리 아틀라스에 그림이 있는 몬스터. YAML 이름 → 스프라이트 키 */
const SPRITE_BY_NAME = {
    'rat': 'enemy_rat',
    'kobold': 'enemy_kobold',
    'goblin': 'enemy_goblin',
    'snake': 'enemy_snake',
    'frog': 'enemy_frog',
    'orc': 'enemy_orc',
    'orc warrior': 'enemy_orc_warrior',
    'centaur': 'enemy_centaur',
    'spider': 'enemy_spider',
    'hydra': 'enemy_hydra',
    'jelly': 'enemy_jelly',
    'zombie': 'enemy_skeleton',
    'skeletal warrior': 'enemy_skeleton',
    'mummy': 'enemy_mummy',
    'ice beast': 'enemy_ice_beast',
    'ice dragon': 'enemy_ice_dragon',
    'frost giant': 'enemy_ice_giant',
    'fire giant': 'enemy_fire_giant',
    'gargoyle': 'enemy_gargoyle',
    'minotaur': 'enemy_minotaur',
    'naga': 'enemy_naga',
    'merfolk': 'enemy_merfolk',
    'killer bee': 'enemy_killer_bee',
    'mana viper': 'enemy_mana_viper',
    'menkaure': 'enemy_menkaure',
    'rakshasa': 'enemy_rakshasa',
    'simulacrum': 'enemy_simulacrum',
    'crocodile': 'enemy_crocodile',
    'cacodemon': 'enemy_cacodemon',
    'hell knight': 'enemy_hell_knight',
    'golem': 'enemy_golem',
    'deep elf knight': 'enemy_deep_elf_knight',
    'phantom': 'enemy_phantasmal',
    'wraith': 'enemy_spectre',
};

/** @description DCSS 의 크기 범주를 이 게임의 충돌 반경(픽셀)으로 옮긴 표 */
const SIZE_PIXELS = {
    tiny: 12, little: 15, small: 18, medium: 22, large: 26, giant: 32,
};

/**
 * 몬스터의 C++ 열거형 이름을 정합니다.
 * 출현표(mon-pick-data.h)가 이 이름으로 몬스터를 가리키므로 짝이 맞아야 합니다.
 *
 * YAML 에 enum 필드가 있으면 그것이 정답입니다. 표시 이름과 열거형이 어긋나는
 * 몬스터들이 있기 때문입니다. "small abomination" 의 열거형은
 * MONS_SMALL_ABOMINATION 이 아니라 MONS_ABOMINATION_SMALL 이고,
 * "walking frostbound tome" 은 MONS_FROSTBOUND_TOME 입니다.
 * 이름으로 추론하면 이런 것들이 조용히 출현표에서 빠집니다.
 * @param {object} raw - 파싱된 YAML
 * @returns {string} MONS_ 로 시작하는 열거형 이름
 */
export function toEnumName(raw) {
    const explicit = raw.enum;
    const base = explicit !== undefined ? String(explicit) : raw.name;
    return 'MONS_' + base.toUpperCase().replace(/['`]/g, '').replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
}

/**
 * 몬스터 YAML 하나를 이 게임의 표 항목으로 옮깁니다.
 * @param {object} raw - 파싱된 YAML
 * @param {string} file - 파일 이름 (오류 보고용)
 * @returns {object} 몬스터 정의
 */
function convert(raw, file) {
    for (const required of ['name', 'hd', 'hp_10x', 'ac', 'ev', 'attacks', 'size']) {
        if (raw[required] === undefined) throw new Error(`${file}: ${required} 가 없습니다`);
    }

    const attacks = (Array.isArray(raw.attacks) ? raw.attacks : [raw.attacks])
        .filter(a => a && a.damage > 0)
        .map(a => ({ type: a.type, damage: a.damage, flavour: a.flavour ?? 'plain' }));

    return {
        id: path.basename(file, '.yaml'),
        enumName: toEnumName(raw),
        name: raw.name,

        // 전투 수치. 그대로 옮깁니다.
        hd: raw.hd,
        hp10x: raw.hp_10x,
        ac: raw.ac,
        ev: raw.ev,
        will: raw.will ?? 0,
        exp: raw.exp ?? 0,
        attacks,

        // speed 를 생략한 몬스터가 434종입니다. 생략은 '기본 속도'라는 뜻이라
        // 여기서 기본값을 박아 두지 않으면 절반 이상이 잘못된 속도가 됩니다.
        speed: raw.speed ?? 10,

        // 표시용
        glyph: raw.glyph?.char ?? '?',
        colour: raw.glyph?.colour ?? 'lightgrey',
        spriteKey: SPRITE_BY_NAME[raw.name] ?? null,
        sizePixels: SIZE_PIXELS[raw.size] ?? SIZE_PIXELS.medium,

        // 분류
        size: raw.size,
        shape: raw.shape ?? null,
        intelligence: raw.intelligence ?? null,
        holiness: raw.holiness ?? null,
        genus: raw.genus ?? null,
        species: raw.species ?? null,
        flags: raw.flags ?? [],
        resists: raw.resists ?? null,
        spells: raw.spells ?? null,
        uses: raw.uses ?? null,
        habitat: raw.habitat ?? null,
    };
}

/**
 * 몬스터 YAML 을 모두 읽어 표를 만듭니다.
 * @param {string} sourceDir - 크롤 소스 경로 (crawl-ref/source)
 * @returns {{monsters: object[], skipped: string[]}} 변환 결과
 */
export function importMonsters(sourceDir) {
    const dir = path.join(sourceDir, 'dat', 'mons');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.yaml')).sort();

    const monsters = [];
    const skipped = [];

    for (const file of files) {
        // 테스트용과 '몬스터가 아닌 것'은 건너뜁니다.
        if (file.startsWith('TEST') || file.startsWith('sensed')) { skipped.push(file); continue; }

        const raw = parseYaml(fs.readFileSync(path.join(dir, file), 'utf8'));
        // 플레이어와 버그 표시용 항목은 실제 몬스터가 아닙니다.
        if (['player.yaml', 'program-bug.yaml', 'nobody.yaml'].includes(file)) {
            skipped.push(file);
            continue;
        }
        monsters.push(convert(raw, file));
    }

    return { monsters, skipped };
}

// --- 명령줄로 실행했을 때 ------------------------------------------------------

if (process.argv[1] && process.argv[1].endsWith('import-monsters.js')) {
    const sourceDir = process.argv[2];
    if (!sourceDir) {
        console.error('사용법: node tools/import-monsters.js <크롤 소스 경로>');
        process.exit(1);
    }

    const { monsters, skipped } = importMonsters(sourceDir);
    const outPath = path.join('Script', 'data', 'monsters.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(monsters, null, 1) + '\n');

    const withSprite = monsters.filter(m => m.spriteKey).length;
    console.log(`몬스터 ${monsters.length}종을 옮겼습니다. (건너뜀 ${skipped.length}개)`);
    console.log(`  그림 있음 ${withSprite}종, 글리프로 그릴 것 ${monsters.length - withSprite}종`);
    console.log(`  → ${outPath}`);
}

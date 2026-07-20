/**
 * @fileoverview 아틀라스 정합성 검증.
 *
 * 스프라이트 좌표가 틀리면 게임은 예외 없이 그냥 이상한 그림을 그립니다.
 * 브라우저로 확인할 수 없는 상황에서는 그 오류를 알아챌 방법이 없으므로,
 * 코드가 요구하는 스프라이트 키가 전부 존재하고 좌표가 시트 안에 들어오는지를 여기서 확인합니다.
 *
 * 아틀라스는 손으로 쓰는 파일이 아닙니다. `npm run build:atlas`로 생성하십시오.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import * as C from '../Script/constants.js';
import { MONSTERS } from '../Script/monsters.js';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const progression = JSON.parse(readFileSync(projectRoot + 'Data/dungeon_progression.json', 'utf8'));

/** 아틀라스 파일들을 모두 읽어 하나의 조회표로 합칩니다. */
const atlases = Object.entries(C.SPRITE_SHEET_URLS).map(([key, url]) => {
    const path = projectRoot + url;
    assert.ok(existsSync(path), `아틀라스가 없습니다: ${url} (npm run build:atlas 를 실행하십시오)`);
    const dir = url.slice(0, url.lastIndexOf('/') + 1);
    return { key, url, dir, data: JSON.parse(readFileSync(path, 'utf8')) };
});

/** @description 스프라이트 키 -> { 아틀라스, 좌표 } */
const sprites = new Map();
for (const atlas of atlases) {
    for (const [name, rect] of Object.entries(atlas.data.sprites)) {
        sprites.set(name, { atlas, rect });
    }
}

/**
 * PNG 헤더만 읽어 크기를 구합니다. (전체 디코딩 없이 빠르게 경계 검사를 하기 위함)
 * @param {string} path - PNG 경로
 * @returns {{width: number, height: number}} 이미지 크기
 */
function pngSize(path) {
    const header = readFileSync(path).subarray(0, 24);
    return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

test('모든 아틀라스가 실제 존재하는 시트를 가리킨다', () => {
    for (const atlas of atlases) {
        const sheetPath = projectRoot + atlas.dir + atlas.data.sheetFile;
        assert.ok(existsSync(sheetPath), `${atlas.url}가 없는 시트를 가리킵니다: ${atlas.data.sheetFile}`);
    }
});

test('모든 스프라이트 좌표가 시트 범위 안에 있다', () => {
    for (const atlas of atlases) {
        const { width, height } = pngSize(projectRoot + atlas.dir + atlas.data.sheetFile);
        for (const [name, rect] of Object.entries(atlas.data.sprites)) {
            assert.ok(rect.w > 0 && rect.h > 0, `${name}의 크기가 0 이하입니다`);
            assert.ok(rect.x >= 0 && rect.y >= 0, `${name}의 좌표가 음수입니다`);
            assert.ok(rect.x + rect.w <= width && rect.y + rect.h <= height,
                `${name}이 ${atlas.data.sheetFile}(${width}x${height}) 범위를 벗어납니다`);
        }
    }
});

test('constants.js가 참조하는 스프라이트가 모두 존재한다', () => {
    const required = [
        ...Object.values(MONSTERS).map(m => m.spriteKey),
        ...Object.values(C.ITEM_TYPES).map(t => t.spriteKey),
        ...Object.values(C.PROJECTILE_TYPES).map(t => t.spriteKey),
        ...Object.values(C.OBJECT_TYPES).map(t => t.spriteKey),
        ...Object.values(C.WEAPONS).flatMap(w => [w.sprite, w.fireSprite]),
        'exit', // render.js가 출구 타일에 쓰는 텍스처
    ].filter(Boolean);

    const missing = required.filter(key => !sprites.has(key));
    assert.deepEqual(missing, [], `아틀라스에 없는 스프라이트: ${missing.join(', ')}`);
});

test('dungeon_progression.json의 모든 층이 테마 텍스처를 갖는다', () => {
    const entries = [...progression.floors, progression.default];

    for (const entry of entries) {
        const label = entry.floor ? `${entry.floor}층` : 'default';
        for (const surface of ['wall', 'floor', 'ceiling']) {
            // render.js가 인식하는 이름 규칙: 종류_테마_변형_번호
            const prefix = `${surface}_${entry.theme}_${entry.variation}_`;
            const found = [...sprites.keys()].filter(k => k.startsWith(prefix));
            assert.ok(found.length > 0,
                `${label}(${entry.theme} v${entry.variation})의 ${surface} 텍스처가 없습니다`);
        }
    }
});

test('테마 텍스처 이름이 render.js의 파싱 규칙과 맞는다', () => {
    // prepareSprites가 이 정규식으로 테마를 수집합니다. 어긋나면 조용히 무시됩니다.
    const themePattern = /^(wall|floor|ceiling)_([a-zA-Z0-9]+)_(\d+)_(\d+)$/;
    const themeKeys = [...sprites.keys()].filter(k => /^(wall|floor|ceiling)_/.test(k));

    assert.ok(themeKeys.length > 0, '테마 텍스처가 하나도 없습니다');
    for (const key of themeKeys) {
        assert.match(key, themePattern, `${key}는 테마 이름 규칙에 맞지 않습니다`);
    }
});

test('벽·바닥·천장 텍스처는 렌더러가 요구하는 정사각 타일이다', () => {
    // renderWorld는 텍스처를 w로만 인덱싱하므로 정사각이 아니면 그림이 어긋납니다.
    for (const [name, { rect }] of sprites) {
        if (!/^(wall|floor|ceiling)_/.test(name)) continue;
        assert.equal(rect.w, rect.h, `${name}이 정사각형이 아닙니다 (${rect.w}x${rect.h})`);
        assert.equal(rect.w, C.TILE_SIZE, `${name}의 크기가 TILE_SIZE와 다릅니다`);
    }
});

test('HUD 얼굴 스프라이트는 아직 없다 (알려진 공백)', () => {
    // 이 타일셋(Dungeon Crawl Stone Soup)에는 Doom식 HUD 얼굴이 존재하지 않습니다.
    // ui.js가 플레이스홀더로 대체하므로 게임은 정상 동작합니다.
    // 나중에 얼굴 이미지를 넣으면 이 테스트가 실패하며, 그때 이 테스트를 지우면 됩니다.
    const faces = Object.values(C.FACE_SPRITES);
    const present = faces.filter(key => sprites.has(key));
    assert.deepEqual(present, [],
        `얼굴 스프라이트가 추가되었습니다(${present.join(', ')}). 이 테스트를 제거하십시오.`);
});

test('모든 던전의 테마가 실제 텍스처를 갖는다', async () => {
    // 분기와 포탈이 저마다 테마를 지정하므로, 오타 하나로 어느 던전만 조용히
    // 플레이스홀더가 되는 일이 생길 수 있습니다.
    const { BRANCHES } = await import('../Script/branches.js');
    const { PORTAL_DUNGEONS } = await import('../Script/portals.js');

    for (const dungeon of [...Object.values(BRANCHES), ...Object.values(PORTAL_DUNGEONS)]) {
        for (const surface of ['wall', 'floor', 'ceiling']) {
            const prefix = `${surface}_${dungeon.theme}_${dungeon.themeVariation}_`;
            const found = [...sprites.keys()].filter(k => k.startsWith(prefix));
            assert.ok(found.length > 0,
                `${dungeon.name}(${dungeon.theme} v${dungeon.themeVariation})의 ${surface} 텍스처가 없습니다`);
        }
    }
});

test('테마 텍스처가 crawl 저장소에서 확인된 좌표를 쓴다', () => {
    // 눈으로 고른 좌표는 조용히 틀립니다. locate-tiles.js 가 원본과 픽셀 대조로
    // 확정한 결과만 아틀라스에 들어가야 합니다.
    const locations = JSON.parse(readFileSync(projectRoot + 'Data/tiles/tile-locations.json', 'utf8'));
    const verified = new Set(Object.values(locations.tiles).map(t => `${t.sheet}:${t.x},${t.y}`));

    for (const [name, { atlas, rect }] of sprites) {
        if (!/^(wall|floor|ceiling)_/.test(name)) continue;
        assert.ok(verified.has(`${atlas.key}:${rect.x},${rect.y}`),
            `${name}의 좌표 (${rect.x},${rect.y})가 확인된 목록에 없습니다`);
    }
});

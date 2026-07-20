/**
 * @fileoverview 층의 벽과 바닥이 어느 가지에 있는가로 정해지는지 검사합니다.
 *
 * 지금까지는 층 번호가 정했습니다. 1~3층은 main, 4~5층은 cave 하는 식의
 * 자체 표였습니다. 원본은 그렇게 하지 않습니다. 오크 광산은 몇 층이든
 * 오크 광산처럼 생겼고, 짐승굴은 짐승굴처럼 생겼습니다.
 *
 * 층 번호로 고르면 같은 가지 안에서 벽이 바뀌어, 지금 어디에 있는지가
 * 지형으로 읽히지 않습니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { installRenderEnvironment } from '../tools/headless.js';

installRenderEnvironment({ width: 120, height: 80 });

const { assets } = await import('../Script/assets.js');
const render = await import('../Script/render.js');
const { BRANCHES } = await import('../Script/branches.js');

await render.loadAssets(null);

/** 지형 아틀라스의 좌표 파일. */
const atlas = JSON.parse(
    readFileSync(new URL('../Data/tiles/terrain_data.json', import.meta.url), 'utf8'),
);

/** 그 텍스처의 첫 줄 픽셀을 더해 그림을 구분하는 값으로 씁니다. */
function signature(key) {
    const texture = assets.textures[key];
    if (!texture?.data) return null;

    let sum = 0;
    for (let i = 0; i < 400; i += 4) sum += texture.data[i] * 31 + texture.data[i + 1];
    return sum;
}

// --- 아틀라스 --------------------------------------------------------------------

test('모든 가지에 벽과 바닥이 있다', () => {
    for (const branch of Object.keys(BRANCHES)) {
        assert.ok(atlas.sprites[`branch_wall_${branch}_0`],
            `${branch} 가지의 벽 타일이 없습니다`);
        assert.ok(atlas.sprites[`branch_floor_${branch}_0`],
            `${branch} 가지의 바닥 타일이 없습니다`);
    }
});

test('가지 타일 이름이 테마 이름과 겹치지 않는다', () => {
    // wall_D 처럼 두면 테마 이름 규칙(wall_main_1_1)을 훑는 쪽이
    // 잘못 집어 가 조용히 어긋납니다.
    const themePattern = /^(wall|floor|ceiling)_([a-zA-Z0-9]+)_(\d+)_(\d+)$/;

    for (const key of Object.keys(atlas.sprites)) {
        assert.ok(key.startsWith('branch_'),
            `${key} 에 가지 접두사가 없습니다`);
        assert.ok(!themePattern.test(key),
            `${key} 가 테마 이름 규칙과 겹칩니다`);
    }
});

// --- 실제로 실려 있는가 -----------------------------------------------------------

test('가지 텍스처가 픽셀을 갖고 실려 있다', () => {
    // 좌표만 있고 그림이 안 실리면 벽이 통째로 비어 보입니다.
    for (const branch of Object.keys(BRANCHES)) {
        for (const kind of ['wall', 'floor']) {
            const texture = assets.textures[`branch_${kind}_${branch}_0`];
            assert.ok(texture, `${branch} 의 ${kind} 텍스처가 실리지 않았습니다`);
            assert.ok(texture.data?.length > 0, `${branch} 의 ${kind} 에 픽셀이 없습니다`);
            assert.equal(texture.w, 32, `${branch} 의 ${kind} 이 32 칸이 아닙니다`);
        }
    }
});

test('가지마다 다른 그림을 쓴다', () => {
    // 같은 그림이면 가지를 옮겨도 눈에 아무 변화가 없습니다.
    // 그러면 이 표를 만든 뜻이 사라집니다.
    const walls = new Set();
    for (const branch of Object.keys(BRANCHES)) {
        const value = signature(`branch_wall_${branch}_0`);
        if (value !== null) walls.add(value);
    }

    // 원본에도 같은 벽을 쓰는 가지가 있어(메인 던전과 심층부) 전부 다르지는 않습니다.
    assert.ok(walls.size >= Object.keys(BRANCHES).length - 4,
        `가지 ${Object.keys(BRANCHES).length} 개인데 벽 그림이 ${walls.size} 종류뿐입니다`);
});

test('색만 바꿔 쓰는 벽도 서로 다르다', () => {
    // 조트 계열 벽은 원본에서 파란 그림 하나를 색상만 돌려 씁니다.
    // 돌리지 않고 그대로 쓰면 디스와 게헨나와 조트가 같은 색이 됩니다.
    const dis = signature('branch_wall_I_0');
    const gehenna = signature('branch_wall_G_0');
    const zot = signature('branch_wall_Z_0');

    assert.ok(dis !== null && gehenna !== null && zot !== null, '조트 계열 벽이 없습니다');
    assert.equal(new Set([dis, gehenna, zot]).size, 3,
        '조트 계열 세 벽이 같은 색입니다');
});

test('렌더러가 그 가지의 벽을 실제로 골라 쓴다', () => {
    // 아틀라스에 그림이 있어도 렌더러가 보지 않으면 화면은 그대로입니다.
    // 그 연결이 끊겨도 위의 검사들은 모두 통과합니다.
    const source = readFileSync(new URL('../Script/render.js', import.meta.url), 'utf8');

    assert.match(source, /branchTextures\('wall',\s*world\.branch\)/,
        '렌더러가 가지 벽을 꺼내지 않습니다');
    assert.match(source, /branchTextures\('floor',\s*world\.branch\)/,
        '렌더러가 가지 바닥을 꺼내지 않습니다');

    // 꺼내기만 하고 쓰지 않으면 뜻이 없습니다.
    assert.match(source, /if\s*\(branchWall\.length\s*>\s*0\s*&&\s*branchFloor\.length\s*>\s*0\)/,
        '가지 타일이 있어도 쓰지 않습니다');
});

test('가지마다 벽 변형이 여러 장이다', () => {
    // 한 장만 쓰면 같은 그림이 끝없이 이어져 벽면이 격자무늬처럼 보입니다.
    // 원본도 가지마다 변형을 여러 장 두고 섞습니다.
    for (const branch of Object.keys(BRANCHES)) {
        let count = 0;
        while (assets.textures[`branch_wall_${branch}_${count}`]?.data) count++;

        assert.ok(count > 1, `${branch} 가지의 벽 변형이 ${count} 장뿐입니다`);
    }
});

test('변형끼리도 서로 다른 그림이다', () => {
    // 같은 그림을 여러 번 담으면 변형을 가져온 뜻이 없습니다.
    const shapes = new Set();
    for (let i = 0; i < 4; i++) {
        const value = signature(`branch_wall_D_${i}`);
        if (value !== null) shapes.add(value);
    }

    assert.ok(shapes.size > 1, `메인 던전의 벽 변형이 모두 같은 그림입니다`);
});

test('렌더러가 변형 목록을 통째로 넘긴다', () => {
    // 여러 장을 가져와 놓고 첫 장만 넘기면 변형이 있으나 마나입니다.
    // 아틀라스만 보는 검사로는 그 끊김이 잡히지 않습니다.
    const source = readFileSync(new URL('../Script/render.js', import.meta.url), 'utf8');

    assert.match(source, /wallTextures\s*=\s*branchWall\s*;/,
        '벽 변형 목록을 그대로 넘기지 않습니다');
    assert.match(source, /floorTextures\s*=\s*branchFloor\s*;/,
        '바닥 변형 목록을 그대로 넘기지 않습니다');

    // 그리는 쪽이 타일 좌표로 골라 써야 벽면이 섞입니다.
    assert.match(source, /scene\.wallTextures\[Math\.abs\(wallHash\)\s*%\s*scene\.wallTextures\.length\]/,
        '벽을 그릴 때 변형을 고르지 않습니다');
});

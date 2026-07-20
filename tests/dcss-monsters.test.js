/**
 * @fileoverview 옮겨 온 DCSS 몬스터 표와 출현 알고리즘을 확인합니다.
 *
 * 데이터 이식은 조용히 어긋나는 종류의 작업입니다. 671종이 다 들어왔는지,
 * 필드가 빠지지 않았는지, 출현표가 부르는 몬스터가 실제로 존재하는지를
 * 사람이 눈으로 볼 수 없으므로 여기서 봅니다.
 *
 * 출현 알고리즘은 DCSS 난이도 곡선 그 자체입니다. 1층에서 오크 전사가 나오거나
 * 깊은 곳에서 쥐만 나오면 수치를 아무리 정확히 옮겨도 다른 게임이 됩니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const P = await import('../Script/dcss/monster-pick.js');
const R = await import('../Script/dcss/random.js');

const monsters = JSON.parse(fs.readFileSync('Script/data/monsters.json', 'utf8'));
const tables = JSON.parse(fs.readFileSync('Script/data/spawn-tables.json', 'utf8'));

/** @param {string} id @returns {object} 몬스터 정의 */
const byId = (id) => monsters.find(m => m.id === id);

// --- 몬스터 표 ----------------------------------------------------------------

test('몬스터가 충분히 들어왔다', () => {
    // 683개 YAML 중 테스트용·플레이어·버그표시를 뺀 수입니다.
    assert.ok(monsters.length > 650, `${monsters.length}종뿐입니다`);
});

test('모든 몬스터가 전투에 필요한 수치를 갖는다', () => {
    // 하나라도 빠지면 그 몬스터가 나오는 순간 전투가 깨집니다.
    for (const m of monsters) {
        assert.ok(typeof m.hd === 'number' && m.hd >= 0, `${m.id}: hd`);
        assert.ok(typeof m.hp10x === 'number' && m.hp10x >= 0, `${m.id}: hp10x`);
        assert.ok(typeof m.ac === 'number', `${m.id}: ac`);
        assert.ok(typeof m.ev === 'number', `${m.id}: ev`);
        assert.ok(typeof m.speed === 'number' && m.speed >= 0, `${m.id}: speed`);
        assert.ok(Array.isArray(m.attacks), `${m.id}: attacks`);
        assert.ok(typeof m.sizePixels === 'number' && m.sizePixels > 0, `${m.id}: sizePixels`);
        assert.ok(m.enumName.startsWith('MONS_'), `${m.id}: enumName=${m.enumName}`);
    }
});

test('열거형 이름이 겹치지 않는다', () => {
    // 겹치면 출현표가 엉뚱한 몬스터를 부르게 됩니다.
    const seen = new Map();
    for (const m of monsters) {
        if (seen.has(m.enumName)) {
            assert.fail(`${m.enumName} 이 ${seen.get(m.enumName)} 와 ${m.id} 에 겹칩니다`);
        }
        seen.set(m.enumName, m.id);
    }
});

test('표시 이름과 열거형이 다른 몬스터도 옳게 들어왔다', () => {
    // YAML 의 enum 필드를 무시하고 이름으로 추론하면 여기서 어긋납니다.
    // 실제로 처음에는 9종이 출현표에서 빠졌습니다.
    assert.equal(byId('abomination-small').enumName, 'MONS_ABOMINATION_SMALL');
    assert.equal(byId('abomination-small').name, 'small abomination');
    assert.equal(byId('frostbound-tome').enumName, 'MONS_FROSTBOUND_TOME');
    assert.equal(byId('frostbound-tome').name, 'walking frostbound tome');
});

test('원본 수치가 그대로 옮겨졌다', () => {
    // YAML 을 직접 대조한 값입니다. 변환 과정에서 단위가 바뀌면 여기서 걸립니다.
    const rat = byId('rat');
    assert.deepEqual(
        { hd: rat.hd, hp10x: rat.hp10x, ac: rat.ac, ev: rat.ev, speed: rat.speed },
        { hd: 1, hp10x: 25, ac: 1, ev: 10, speed: 10 });
    assert.deepEqual(rat.attacks, [{ type: 'bite', damage: 3, flavour: 'plain' }]);

    const orcWarrior = byId('orc-warrior');
    assert.deepEqual(
        { hd: orcWarrior.hd, hp10x: orcWarrior.hp10x, ac: orcWarrior.ac, ev: orcWarrior.ev },
        { hd: 4, hp10x: 280, ac: 0, ev: 13 });
});

test('speed 를 생략한 몬스터에 기본값이 채워졌다', () => {
    // 434종이 speed 를 생략합니다. 생략은 '기본 속도'라는 뜻이라
    // 여기서 비워 두면 절반 이상이 움직이지 않게 됩니다.
    assert.ok(monsters.every(m => typeof m.speed === 'number'));
    assert.ok(monsters.filter(m => m.speed === 10).length > 400,
        '기본 속도 몬스터가 너무 적습니다');
});

test('움직이지 않는 몬스터가 실제로 있다', () => {
    // 식물·조형물은 speed 0 입니다. 이것을 기본값으로 되돌리면 나무가 쫓아옵니다.
    const immobile = monsters.filter(m => m.speed === 0);
    assert.ok(immobile.length > 10, `${immobile.length}종뿐입니다`);
    assert.ok(immobile.some(m => m.id === 'plant' || m.id === 'fungus'),
        '식물이 움직이지 않는 목록에 없습니다');
});

// --- 출현표 -------------------------------------------------------------------

test('주요 가지의 출현표가 들어왔다', () => {
    for (const branch of ['Dungeon', 'Lair', 'Orcish Mines', 'The Vaults', 'Snake Pit']) {
        assert.ok(tables[branch], `${branch} 출현표가 없습니다`);
        assert.ok(tables[branch].entries.length > 0, `${branch} 항목이 비었습니다`);
    }
});

test('출현표가 부르는 몬스터가 실제로 존재한다', () => {
    // 이름 추론이 어긋나면 여기서 무더기로 걸립니다.
    // MONS_NO_MONSTER 는 '아무것도 안 나옴'을 뜻하는 센티널이고,
    // 나머지 둘은 YAML 이 없는 특수 몬스터라 예외로 둡니다.
    const allowed = new Set(['MONS_NO_MONSTER', 'MONS_DEEP_DWARF', 'MONS_ORB_OF_APPROPRIATENESS']);
    const known = new Set(monsters.map(m => m.enumName));

    const missing = new Set();
    for (const table of Object.values(tables)) {
        for (const entry of table.entries) {
            if (!known.has(entry.monster) && !allowed.has(entry.monster)) missing.add(entry.monster);
        }
    }
    assert.deepEqual([...missing], [], '출현표가 없는 몬스터를 부릅니다');
});

test('출현표 항목의 범위와 가중치가 온전하다', () => {
    for (const [name, table] of Object.entries(tables)) {
        for (const e of table.entries) {
            assert.ok(e.min <= e.max, `${name}: ${e.monster} 범위가 뒤집혔습니다`);
            assert.ok(e.weight > 0, `${name}: ${e.monster} 가중치가 ${e.weight} 입니다`);
            assert.ok(['FLAT', 'SEMI', 'PEAK', 'RISE', 'FALL'].includes(e.shape),
                `${name}: ${e.monster} 의 분포가 ${e.shape} 입니다`);
        }
    }
});

// --- 가중치 공식 --------------------------------------------------------------

test('FLAT 은 범위 내내 같다', () => {
    const e = { min: 1, max: 10, weight: 100, shape: 'FLAT' };
    assert.equal(P.rarityAt(e, 1), P.rarityAt(e, 5));
    assert.equal(P.rarityAt(e, 5), P.rarityAt(e, 10));
});

test('SEMI 는 가운데가 가장 높고 양끝이 절반이다', () => {
    const e = { min: 1, max: 11, weight: 100, shape: 'SEMI' };
    const middle = P.rarityAt(e, 6);
    const edge = P.rarityAt(e, 1);
    assert.ok(middle > edge, '가운데가 더 높아야 합니다');
    assert.ok(Math.abs(edge / middle - 0.5) < 0.06,
        `양끝이 절반이어야 하는데 ${(edge / middle).toFixed(3)} 입니다`);
});

test('PEAK 은 범위 밖에서 0 이 되도록 양끝이 낮다', () => {
    const e = { min: 5, max: 9, weight: 100, shape: 'PEAK' };
    const middle = P.rarityAt(e, 7);
    const edge = P.rarityAt(e, 5);
    assert.ok(edge > 0, '범위 안에서는 0 이 아니어야 합니다');
    assert.ok(edge < middle / 2, 'SEMI 보다 끝이 더 가팔라야 합니다');
});

test('RISE 는 깊어질수록 늘고 FALL 은 준다', () => {
    const rise = { min: 1, max: 10, weight: 100, shape: 'RISE' };
    const fall = { min: 1, max: 10, weight: 100, shape: 'FALL' };
    assert.ok(P.rarityAt(rise, 10) > P.rarityAt(rise, 1));
    assert.ok(P.rarityAt(fall, 10) < P.rarityAt(fall, 1));
});

test('한 층짜리 SEMI 도 0 이 되지 않는다', () => {
    // 범위가 한 층이면 나눌 폭이 0 이 되어 0 으로 나누기가 납니다.
    // 원본이 그때만 2 를 주는 이유입니다.
    const e = { min: 5, max: 5, weight: 100, shape: 'SEMI' };
    assert.ok(P.rarityAt(e, 5) > 0);
});

test('알 수 없는 분포는 조용히 넘어가지 않는다', () => {
    assert.throws(() => P.rarityAt({ min: 1, max: 5, weight: 10, shape: 'WOBBLE' }, 3),
        /알 수 없는 분포/);
});

// --- 뽑기 ---------------------------------------------------------------------

test('범위 밖의 몬스터는 후보에 들지 않는다', () => {
    const entries = [
        { min: 1, max: 3, weight: 100, shape: 'FLAT', monster: 'MONS_A' },
        { min: 8, max: 10, weight: 100, shape: 'FLAT', monster: 'MONS_B' },
    ];
    assert.deepEqual(P.candidatesAt(entries, 2).map(c => c.monster), ['MONS_A']);
    assert.deepEqual(P.candidatesAt(entries, 9).map(c => c.monster), ['MONS_B']);
    assert.deepEqual(P.candidatesAt(entries, 5).map(c => c.monster), []);
});

test('후보가 없으면 null 을 준다', () => {
    R.resetRandomSource();
    assert.equal(P.pickMonster([{ min: 1, max: 2, weight: 100, shape: 'FLAT', monster: 'MONS_A' }], 9), null);
});

test('가중치가 클수록 자주 뽑힌다', () => {
    R.resetRandomSource();
    const entries = [
        { min: 1, max: 10, weight: 900, shape: 'FLAT', monster: 'MONS_COMMON' },
        { min: 1, max: 10, weight: 100, shape: 'FLAT', monster: 'MONS_RARE' },
    ];
    const counts = { MONS_COMMON: 0, MONS_RARE: 0 };
    for (let i = 0; i < 20000; i++) counts[P.pickMonster(entries, 5)]++;

    const rate = counts.MONS_COMMON / 20000;
    assert.ok(Math.abs(rate - 0.9) < 0.02, `기대 90%, 실제 ${(rate * 100).toFixed(1)}%`);
});

test('veto 로 특정 몬스터를 뺄 수 있다', () => {
    R.resetRandomSource();
    const entries = [
        { min: 1, max: 10, weight: 100, shape: 'FLAT', monster: 'MONS_A' },
        { min: 1, max: 10, weight: 100, shape: 'FLAT', monster: 'MONS_B' },
    ];
    for (let i = 0; i < 200; i++) {
        assert.equal(P.pickMonster(entries, 5, m => m === 'MONS_A'), 'MONS_B');
    }
});

// --- 실제 표로 확인 -----------------------------------------------------------

test('1층에서는 약한 것만 나온다', () => {
    // DCSS 난이도 곡선이 실제로 옮겨졌는지 보는 검사입니다.
    // 1층 후보에 오크 전사나 용이 섞이면 표나 공식이 어긋난 것입니다.
    const shallow = P.candidatesAt(tables.Dungeon.entries, 1).map(c => c.monster);
    assert.ok(shallow.length > 0, '1층 후보가 없습니다');

    assert.ok(shallow.includes('MONS_RAT') || shallow.includes('MONS_BAT'),
        '1층에 쥐나 박쥐가 없습니다');
    for (const tough of ['MONS_ORC_WARRIOR', 'MONS_FIRE_DRAGON', 'MONS_STONE_GIANT']) {
        assert.ok(!shallow.includes(tough), `1층에 ${tough} 가 나옵니다`);
    }
});

test('깊어질수록 후보가 강해진다', () => {
    const hdOf = (enumName) => monsters.find(m => m.enumName === enumName)?.hd ?? 0;
    const avgHd = (depth) => {
        const c = P.candidatesAt(tables.Dungeon.entries, depth);
        return c.reduce((s, x) => s + hdOf(x.monster), 0) / c.length;
    };

    const shallow = avgHd(2), deep = avgHd(14);
    assert.ok(deep > shallow * 1.5,
        `2층 평균 HD ${shallow.toFixed(1)}, 14층 ${deep.toFixed(1)} — 충분히 강해지지 않았습니다`);
});

test('쥐는 얕은 곳에서 흔하고 깊은 곳에서 사라진다', () => {
    const shallow = P.probabilityAt(tables.Dungeon.entries, 1, 'MONS_RAT');
    const deep = P.probabilityAt(tables.Dungeon.entries, 15, 'MONS_RAT');
    assert.ok(shallow > 0, '1층에 쥐가 안 나옵니다');
    assert.ok(deep < shallow, '깊은 곳에서도 쥐가 그대로 나옵니다');
});

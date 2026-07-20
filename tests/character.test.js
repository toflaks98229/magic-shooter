/**
 * @fileoverview 종족 · 직업 · 신 검증.
 *
 * 수치가 원본과 맞는지는 npm run verify:chargen 이 원본 yaml 을 받아 대조합니다.
 * 여기서 보는 것은 그 수치가 실제로 게임에 반영되는가입니다.
 * 표에만 적혀 있고 아무 데도 쓰이지 않는 값은 없느니만 못하기 때문입니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installBrowserStubs, bindStubDom, seedRandom } from './helpers/browser-stubs.js';

installBrowserStubs();

const C = await import('../Script/constants.js');
const SP = await import('../Script/species.js');
const BG = await import('../Script/backgrounds.js');
const GD = await import('../Script/gods.js');
const CH = await import('../Script/character.js');
const worldModule = await import('../Script/world.js');
const { resetWorld, serializeWorld, deserializeWorld } = worldModule;
const { dom } = await import('../Script/dom.js');
const A = await import('../Script/actions.js');
const gameLogic = await import('../Script/gameLogic.js');

bindStubDom(dom);

/** 빈 방 하나짜리 세계에 캐릭터를 세웁니다. */
function startAs(speciesId, backgroundId, godId = null) {
    resetWorld();
    A.setGameRunning(true);
    worldModule.world.map = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.objectMap = Array.from({ length: C.MAP_HEIGHT }, () => Array(C.MAP_WIDTH).fill(0));
    worldModule.world.player.x = 10 * C.TILE_SIZE;
    worldModule.world.player.y = 10 * C.TILE_SIZE;
    return CH.applyCharacter(speciesId, backgroundId, godId);
}

// --- 데이터가 온전한가 -----------------------------------------------------

test('모든 종족이 필요한 값을 갖춘다', () => {
    for (const [id, species] of Object.entries(SP.SPECIES)) {
        assert.ok(species.name, `${id}에 이름이 없습니다`);
        assert.ok(species.enName, `${id}에 원본 이름이 없습니다`);
        assert.ok(['simple', 'intermediate', 'advanced'].includes(species.difficulty),
            `${id}의 난이도가 이상합니다: ${species.difficulty}`);
        assert.ok(Array.isArray(species.traits), `${id}의 특성이 배열이 아닙니다`);
        assert.ok(species.str > 0 && species.int > 0 && species.dex > 0, `${id}의 능력치가 0 이하입니다`);
    }
});

test('원본에서 고를 수 있는 만큼의 종족과 직업이 있다', () => {
    // 색깔 드라코니안 8종은 원본에서도 생성 때 고르는 것이 아니라 14레벨에 정해집니다.
    assert.equal(SP.selectableSpecies().length, 27, '원본 0.34 의 선택 가능 종족은 27종입니다');
    assert.equal(BG.selectableBackgrounds().length, 26, '원본 0.34 의 직업은 26종입니다');
    assert.equal(GD.allGods().length, 26, '원본 0.34 의 섬길 수 있는 신은 26위입니다');
});

test('직업이 추천하는 종족이 실재한다', () => {
    for (const [id, background] of Object.entries(BG.BACKGROUNDS)) {
        for (const speciesId of background.recommended) {
            assert.ok(SP.SPECIES[speciesId], `${id}가 없는 종족 ${speciesId}를 추천합니다`);
        }
    }
});

test('직업이 주는 아이템이 실재한다', async () => {
    const { ITEMS } = await import('../Script/items.js');
    for (const [id, background] of Object.entries(BG.BACKGROUNDS)) {
        for (const itemId of background.items) {
            assert.ok(ITEMS[itemId], `${id}가 없는 아이템 ${itemId}를 줍니다`);
        }
    }
});

// --- 종족이 실제로 다른가 ---------------------------------------------------

test('종족에 따라 체력이 달라진다', () => {
    startAs('troll', 'fighter');
    const trollHp = worldModule.world.player.maxHp;

    startAs('spriggan', 'fighter');
    const sprigganHp = worldModule.world.player.maxHp;

    // 원본에서 트롤은 hp +3, 스프리건은 -3 입니다. 뒤집히면 표를 잘못 옮긴 것입니다.
    assert.ok(trollHp > sprigganHp, `트롤 ${trollHp} vs 스프리건 ${sprigganHp}`);
});

test('딥 엘프가 미노타우로스보다 마력이 많다', () => {
    startAs('deep-elf', 'conjurer');
    const elfMp = worldModule.world.player.maxAmmo;

    startAs('minotaur', 'conjurer');
    const minotaurMp = worldModule.world.player.maxAmmo;

    assert.ok(elfMp > minotaurMp, `딥 엘프 ${elfMp} vs 미노타우로스 ${minotaurMp}`);
});

test('스프리건이 나가보다 빠르다', () => {
    startAs('spriggan', 'fighter');
    const fast = CH.modifier('moveSpeed');

    startAs('naga', 'fighter');
    const slow = CH.modifier('moveSpeed');

    assert.ok(fast > slow * 1.4, `스프리건 ${fast.toFixed(2)} vs 나가 ${slow.toFixed(2)}`);
});

test('돌로 된 몸이 받는 피해를 실제로 줄인다', () => {
    startAs('human', 'fighter');
    worldModule.world.player.hp = 100;
    A.damagePlayer(40);
    const humanLoss = 100 - worldModule.world.player.hp;

    startAs('gargoyle', 'fighter');
    worldModule.world.player.hp = 100;
    A.damagePlayer(40);
    const gargoyleLoss = 100 - worldModule.world.player.hp;

    assert.ok(gargoyleLoss < humanLoss, `인간 ${humanLoss} vs 가고일 ${gargoyleLoss}`);
});

// 공포 갈래에서는 싸울 수 없어 이 검사가 성립하지 않습니다.
// 지우지 않고 건너뜁니다. main 으로 되돌릴 때 다시 살아나야 합니다.
test.skip('힘센 종족이 근접 공격을 더 아프게 한다', () => {
    /** 좀비를 세우고 한 대 때려 들어간 피해를 잽니다. */
    const hitFor = (speciesId) => {
        startAs(speciesId, 'fighter');
        worldModule.world.player.weapon = 'fist';
        worldModule.world.player.angle = 0;
        const target = gameLogic.spawnMonster('zombie', {
            x: worldModule.world.player.x + 20,
            y: worldModule.world.player.y,
        });
        const before = target.hp;
        gameLogic.attack();
        return before - target.hp;
    };

    const troll = hitFor('troll');       // 힘 15
    const felid = hitFor('felid');       // 힘 4
    assert.ok(troll > felid, `트롤 ${troll} vs 펠리드 ${felid}`);
});

// --- 직업 -------------------------------------------------------------------

test('직업이 시작 소지품을 준다', () => {
    const items = startAs('minotaur', 'fighter');
    assert.deepEqual(items, ['might', 'might'], '전사는 힘의 물약 두 개로 시작합니다');
});

test('방랑자는 시작 소지품이 매번 다를 수 있다', () => {
    // 원본에서도 방랑자만 시작 장비를 그때그때 굴립니다.
    const rolls = new Set();
    for (let seed = 0; seed < 40; seed++) {
        seedRandom(0x9000 + seed);
        rolls.add(BG.rollStartingItems('wanderer').join(','));
    }
    assert.ok(rolls.size > 1, '방랑자의 시작 소지품이 늘 같습니다');
});

test('직업이 시작 무기를 정한다', () => {
    startAs('human', 'conjurer');
    assert.equal(worldModule.world.player.weapon, 'gun', '마법사는 지팡이로 시작합니다');

    startAs('human', 'fighter');
    assert.equal(worldModule.world.player.weapon, 'fist', '전사는 장갑으로 시작합니다');
});

// --- 신 ---------------------------------------------------------------------

test('신앙심 단계가 원본의 경계와 같다', () => {
    // religion.cc 의 breakpoints = {30, 50, 75, 100, 120, 160}
    assert.equal(GD.pietyRank(0), 0);
    assert.equal(GD.pietyRank(29), 0);
    assert.equal(GD.pietyRank(30), 1);
    assert.equal(GD.pietyRank(159), 5);
    assert.equal(GD.pietyRank(160), 6);
    assert.equal(GD.pietyRank(200), 6);
});

test('적을 잡으면 신앙심이 오른다', () => {
    startAs('human', 'fighter', 'makhleb');
    const before = worldModule.world.player.piety;

    gameLogic.spawnMonster('rat', { x: 5 * C.TILE_SIZE, y: 5 * C.TILE_SIZE });
    worldModule.world.enemies[0].hp = 0;
    A.killEnemyAt(0);

    assert.ok(worldModule.world.player.piety > before,
        `신앙심이 ${before} 에서 오르지 않았습니다`);
});

test('탐험으로 신앙심을 얻는 신은 처치로는 오르지 않는다', () => {
    // 엘리빌론은 원본에서도 죽이는 것으로는 신앙심을 주지 않습니다.
    startAs('human', 'fighter', 'elyvilon');
    const before = worldModule.world.player.piety;

    gameLogic.spawnMonster('rat', { x: 5 * C.TILE_SIZE, y: 5 * C.TILE_SIZE });
    worldModule.world.enemies[0].hp = 0;
    A.killEnemyAt(0);
    assert.equal(worldModule.world.player.piety, before, '엘리빌론이 처치로 신앙심을 주었습니다');

    A.gainPietyFromExploration();
    assert.ok(worldModule.world.player.piety > before, '탐험으로도 오르지 않았습니다');
});

test('마클렙은 죽일 때마다 체력을 돌려준다', () => {
    startAs('human', 'fighter', 'makhleb');
    worldModule.world.player.hp = 50;

    gameLogic.spawnMonster('rat', { x: 5 * C.TILE_SIZE, y: 5 * C.TILE_SIZE });
    worldModule.world.enemies[0].hp = 0;
    A.killEnemyAt(0);

    assert.ok(worldModule.world.player.hp > 50, '마클렙의 가호가 반영되지 않았습니다');
});

test('언데드 종족은 선한 신을 섬기지 못한다', () => {
    // 원본에서 진 · 빛나는 자 · 엘리빌론은 언데드를 받지 않습니다.
    assert.equal(GD.canWorship('zin', SP.SPECIES.mummy).allowed, false);
    assert.equal(GD.canWorship('theShiningOne', SP.SPECIES.poltergeist).allowed, false);
    assert.equal(GD.canWorship('elyvilon', SP.SPECIES.revenant).allowed, false);

    // 죽음의 신은 받아 줍니다.
    assert.equal(GD.canWorship('kikubaaqudgha', SP.SPECIES.mummy).allowed, true);
});

test('데미갓은 어떤 신도 섬기지 못한다', () => {
    for (const godId of GD.allGods()) {
        assert.equal(GD.canWorship(godId, SP.SPECIES.demigod).allowed, false,
            `데미갓이 ${godId}를 섬길 수 있게 되어 있습니다`);
    }
});

test('섬길 수 없는 신을 지정해도 무신론자로 시작한다', () => {
    // 원본에는 없는 조합이지만, 직업이 정해 주는 신을 종족이 거부하는 일이 생길 수 있습니다.
    startAs('demigod', 'berserker');   // 광전사는 트로그를 데리고 옵니다
    assert.equal(worldModule.world.player.god, null, '데미갓이 트로그를 섬기고 있습니다');
});

test('광전사는 트로그를 섬긴 채로 시작한다', () => {
    startAs('minotaur', 'berserker');
    assert.equal(worldModule.world.player.god, 'trog');
});

test('트로그를 섬기면 마법을 쓸 수 없다', () => {
    startAs('minotaur', 'berserker');

    // 원본에서 트로그만이 주문 자체를 금합니다. 여기서 지팡이는 마법이므로 들 수 없습니다.
    assert.equal(worldModule.world.player.weapon, 'fist', '트로그 신자가 지팡이를 들었습니다');
    assert.equal(worldModule.world.player.maxAmmo, 0, '트로그 신자에게 마력이 남아 있습니다');
    assert.equal(CH.isForbidden('magic'), true);
});

test('제단에서 개종하면 신앙심이 새로 시작된다', () => {
    startAs('human', 'fighter', 'makhleb');
    A.gainPiety(80);
    assert.ok(worldModule.world.player.piety > 80);

    A.worshipAtAltar('okawaru');
    assert.equal(worldModule.world.player.god, 'okawaru');
    assert.equal(worldModule.world.player.piety, GD.startingPiety('okawaru'),
        '갈아탔는데 이전 신앙심이 남아 있습니다');
});

test('섬길 수 없는 신의 제단은 거부한다', () => {
    startAs('mummy', 'necromancer');
    const result = A.worshipAtAltar('zin');

    assert.equal(result.ok, false);
    assert.notEqual(worldModule.world.player.god, 'zin', '미라가 진을 섬기게 되었습니다');
});

test('신앙심이 오르면 쓸 수 있는 능력이 늘어난다', () => {
    // 오카와루의 영웅심은 1단계(30), 기교는 4단계(100)입니다.
    assert.equal(GD.availableAbilities('okawaru', 10).length, 0);
    assert.equal(GD.availableAbilities('okawaru', 40).length, 1);
    assert.equal(GD.availableAbilities('okawaru', 120).length, 2);
});

// --- 저장 --------------------------------------------------------------------

test('캐릭터가 세이브와 던전 이동을 넘어 남는다', () => {
    startAs('gargoyle', 'gladiator', 'okawaru');
    A.gainPiety(50);

    const saved = serializeWorld();
    resetWorld();

    deserializeWorld(saved);
    assert.equal(worldModule.world.player.species, 'gargoyle');
    assert.equal(worldModule.world.player.background, 'gladiator');
    assert.equal(worldModule.world.player.god, 'okawaru');
    assert.ok(worldModule.world.player.piety > 50, '신앙심이 세이브에서 사라졌습니다');

    A.enterBranch('L');
    assert.equal(worldModule.world.player.god, 'okawaru', '던전을 옮기며 신을 잃었습니다');
});

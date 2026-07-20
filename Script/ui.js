/**
 * @fileoverview HTML 문서의 UI 요소를 업데이트하고 관리하는 모든 함수를 포함합니다.
 *
 * 이제 게임 로직이 이 파일의 함수를 직접 부르지 않습니다.
 * 대신 이 파일이 게임 이벤트를 구독해 스스로 반응합니다.
 * 연출을 바꾸거나 추가할 때 시뮬레이션 코드를 열 필요가 없습니다.
 */

// --- 모듈 임포트 ---
import * as C from './constants.js';
import { world } from './world.js';
import { runtime } from './runtime.js';
import { assets } from './assets.js';
import { dom } from './dom.js';
import { formatLocation } from './branches.js';
import { groupInventory, inventorySummary, describeStack, INVENTORY_SLOTS } from './inventory.js';
import { BUFF_MODIFIERS } from './items.js';
import { setWeapon } from './actions.js';
import { on, EVENTS } from './events.js';
import { describeCharacter, characterTitle } from './character.js';
import { titleLine } from './dcss/titles.js';
import {
    experienceLevel, experienceProgress, playerStats, playerAC, playerSH,
    currentPlayerEvasion,
    MAX_EXPERIENCE_LEVEL,
} from './dcss/playerStats.js';
import { SPECIES } from './species.js';
import { aptitudeFor } from './character.js';
import { BACKGROUNDS } from './backgrounds.js';
import { GODS, pietyRank, PIETY_BREAKPOINTS } from './gods.js';

// --- 연출 타이머 ---

/**
 * @description 아직 실행되지 않은 연출 타이머들.
 *
 * 이 파일의 연출은 setTimeout 으로 시간을 끌었다가 뒷정리를 합니다.
 * 문제는 그 사이에 판이 끝나거나 다시 시작될 수 있다는 것입니다.
 * 특히 무기 교체는 300ms 동안 두 단계로 진행되는데, 그 도중에 재시작하면
 * resetRuntime() 이 isSwappingWeapon 을 내려도 예약된 콜백은 그대로 살아남아
 * 새 판의 무기를 setWeapon() 으로 덮어썼습니다.
 *
 * 그래서 예약을 전부 여기 모아 두고, 판이 바뀔 때 resetUi() 가 한꺼번에 취소합니다.
 */
const pendingTimers = new Set();

/**
 * 뒷정리를 예약합니다. setTimeout 을 직접 부르는 대신 이것을 씁니다.
 * @param {Function} callback - 시간이 지난 뒤 실행할 함수
 * @param {number} delayMs - 기다릴 시간(ms)
 * @returns {number} 타이머 식별자
 */
function later(callback, delayMs) {
    const id = setTimeout(() => {
        pendingTimers.delete(id);
        callback();
    }, delayMs);
    pendingTimers.add(id);
    return id;
}

/**
 * 예약된 연출을 모두 취소하고 연출용 표시를 원래대로 돌립니다.
 * 새 판을 시작할 때 main.js 가 부릅니다.
 *
 * 취소만으로는 부족합니다. 중간에 멈춘 연출이 붙여 둔 CSS 클래스가 남으면
 * 무기가 화면 밖으로 내려간 채 돌아오지 않기 때문입니다.
 */
export function resetUi() {
    for (const id of pendingTimers) clearTimeout(id);
    pendingTimers.clear();

    // 교체 진행 플래그도 여기서 내립니다. 이 플래그를 세운 것이 교체 연출이고
    // 내리는 일은 취소된 콜백이 하기로 되어 있었으므로, 취소했다면 대신 내려야 합니다.
    // 남겨 두면 playWeaponSwapAnimation 이 "이미 교체 중"으로 보고 계속 되돌아가
    // 무기를 영영 바꿀 수 없게 됩니다. main.js 는 resetRuntime() 도 부르지만,
    // 호출 순서에 기대지 않도록 여기서 확실히 해 둡니다.
    runtime.isSwappingWeapon = false;

    dom.weaponSpriteEl.classList.remove('swapping-out', 'swapping-in');
    for (const weapon of Object.values(C.WEAPONS)) {
        if (weapon.attackAnimation) dom.weaponSpriteEl.classList.remove(weapon.attackAnimation);
    }
    dom.bloodSplatterEl.style.opacity = 0;
}

// --- 초기화 ---

/**
 * 게임 이벤트를 구독해 UI가 스스로 반응하도록 등록합니다.
 * main.js의 초기화 시점에 한 번만 호출됩니다.
 */
export function registerUiHandlers() {
    on(EVENTS.PLAYER_DAMAGED, showHitReaction);
    on(EVENTS.WEAPON_FIRED, showAttackEffect);
    on(EVENTS.WEAPON_CHANGED, ({ to }) => playWeaponSwapAnimation(to));

    // 소지품 창은 제목 줄을 눌러서도 접고 펼 수 있습니다.
}

// --- 외부 공개 함수 (Public Methods) ---

/**
 * 현재 게임 상태를 기반으로 HUD(Head-Up Display)의 모든 텍스트와 이미지를 업데이트합니다.
 * 매 프레임 호출되므로, 값이 실제로 바뀐 경우에만 DOM에 쓰도록 더티 체크를 합니다.
 */
export function updateHUD() {
    const player = world.player;

    // DCSS 처럼 현재값/최대값과 막대를 함께 보여줍니다.
    setText(dom.playerHpEl, `${Math.ceil(player.hp)}/${player.maxHp}`);
    setText(dom.playerAmmoEl, `${player.ammo}/${player.maxAmmo}`);
    setBarWidth(dom.hpBarFillEl, player.hp / player.maxHp);
    setBarWidth(dom.mpBarFillEl, player.ammo / player.maxAmmo);

    setText(dom.enemyCountEl, world.enemies.length);
    // 가지 안에서의 층만 보여주면 짐승굴 2층인지 메인 2층인지 알 수 없으므로
    // DCSS 관례대로 '가지:층' 형태로 표시합니다.
    setText(dom.floorCountEl, formatLocation(world.branch, world.floor));
    updateVitals();
    setText(dom.gameTimeEl, (world.time / 1000).toFixed(1));

    updateCharacterLine();
    updateGodLine();
    updateRuneCount();
    updateWieldedWeapon();
    updateBuffList();
    updateInventory();
    updateStatusFace(); // 상태 얼굴 업데이트
    updateWeaponSprite(); // 무기 스프라이트 업데이트
}

/**
 * 막대의 채워진 길이를 설정합니다.
 * @param {HTMLElement} element - 막대 요소
 * @param {number} ratio - 0~1 비율
 */
function setBarWidth(element, ratio) {
    const percent = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
    if (element.style.width !== percent) element.style.width = percent;
}

/**
 * @description 지속 효과의 표시 이름과 기호.
 * 기호는 DCSS 가 상태 이상에 쓰는 것을 그대로 가져왔습니다.
 */
const BUFF_DISPLAY = {
    might: { label: '힘', sprite: 'status_might' },
    haste: { label: '가속', sprite: 'status_haste' },
    resistance: { label: '보호', sprite: 'status_resistance' },
};

/** @description 마지막으로 그린 지속 효과 구성. 종류가 바뀔 때만 다시 만듭니다. */
let lastBuffSignature = null;

/**
 * 걸려 있는 지속 효과를 기호와 남은 시간으로 보여줍니다.
 * DCSS 가 상태 이상을 패널에 나열하는 자리입니다.
 */
function updateBuffList() {
    // 남은 시간은 매 프레임 바뀌지만 기호는 그대로이므로, 목록 자체는 종류가 바뀔 때만 다시 만듭니다.
    const signature = world.buffs.map(buff => buff.effect).join(',');
    if (signature !== lastBuffSignature) {
        lastBuffSignature = signature;
        dom.buffListEl.replaceChildren(...world.buffs.map(buff => buildBuffChip(buff)));
    }

    // 남은 시간만 갱신합니다.
    world.buffs.forEach((buff, index) => {
        const chip = dom.buffListEl.children[index];
        const seconds = chip?.querySelector?.('.status-time');
        if (seconds) setText(seconds, `${Math.ceil((buff.expiresAt - world.time) / 1000)}s`);
    });
}

/**
 * 지속 효과 하나를 나타내는 칩을 만듭니다.
 * @param {{effect: string}} buff - 지속 효과
 * @returns {HTMLElement} 표시 요소
 */
function buildBuffChip(buff) {
    const display = BUFF_DISPLAY[buff.effect] || { label: buff.effect };

    const chip = document.createElement('span');
    chip.className = 'status-chip';
    chip.title = display.label;

    const icon = spriteImage(display.sprite, display.label);
    if (icon) chip.appendChild(icon);

    const time = document.createElement('span');
    time.className = 'status-time';
    chip.appendChild(time);

    return chip;
}

/**
 * 스프라이트를 HTML 이미지 요소로 만듭니다.
 * 아직 에셋이 로드되지 않았거나 없는 스프라이트면 null 을 돌려줍니다.
 * @param {string} spriteKey - 스프라이트 키
 * @param {string} alt - 대체 문구
 * @returns {HTMLImageElement|null} 이미지 요소
 */
function spriteImage(spriteKey, alt) {
    const texture = assets.textures[spriteKey];
    if (!texture?.img?.src) return null;

    const image = document.createElement('img');
    image.className = 'sprite-icon';
    image.src = texture.img.src;
    image.alt = alt || spriteKey;
    return image;
}

/** @description 캐릭터 줄에 마지막으로 쓴 내용. 판 중에는 바뀌지 않습니다. */
let drawnCharacter = null;

/**
 * 원본 상태창의 5~8행을 채웁니다. 방어·능력치·경험 수준입니다.
 *
 * 표시용으로 새로 만든 값이 아닙니다. 회피는 이미 전투 판정이 쓰고 있었고
 * 표시만 안 하고 있었습니다. 경험 수준은 몬스터 난이도가 이미 봅니다.
 */
function updateVitals() {
    const player = world.player;
    const species = SPECIES[player.species];

    const experience = player.skills?.totalGained ?? 0;
    const level = experienceLevel(experience);
    const stats = playerStats(species, level);

    setText(dom.playerAcEl, String(playerAC(species, level)));
    setText(dom.playerEvEl, String(Math.round(currentPlayerEvasion(player, species, aptitudeFor))));
    setText(dom.playerShEl, String(playerSH()));

    setText(dom.playerStrEl, String(stats.str));
    setText(dom.playerIntEl, String(stats.int));
    setText(dom.playerDexEl, String(stats.dex));

    setText(dom.playerXlEl, String(level));
    setText(dom.playerXpNextEl,
        level >= MAX_EXPERIENCE_LEVEL ? '-' : `${experienceProgress(experience)}%`);

    // 능력치가 셋 이하로 떨어지면 붉게 물듭니다. (output.cc:1012)
    // 아직 능력치가 깎이는 일이 없어 늘 평상색이지만, 규칙은 여기 둡니다.
    for (const [el, value] of [
        [dom.playerStrEl, stats.str], [dom.playerIntEl, stats.int], [dom.playerDexEl, stats.dex],
    ]) {
        if (!el) continue;
        el.style.color = value <= 0 ? '#e05f5f' : value <= 3 ? '#a83232' : '';
    }
}

/**
 * 종족과 직업을 한 줄로 보여줍니다. DCSS 상태창 맨 위와 같은 자리입니다.
 */
function updateCharacterLine() {
    // 원본의 1행. 이름과 칭호입니다. 마흔두 칸을 넘으면 the 를 쉼표로 바꿉니다.
    const title = characterTitle();
    const heading = title ? titleLine(playerName(), title) : playerName();
    if (heading !== drawnTitle) {
        drawnTitle = heading;
        setText(dom.titleLineEl, heading || '-');
    }

    // 원본의 2행. 종족과 섬기는 신입니다.
    const line = describeCharacter();
    if (line === drawnCharacter) return;
    drawnCharacter = line;
    setText(dom.characterLineEl, line || '-');
}

/** @description 칭호 줄에 마지막으로 그린 내용 */
let drawnTitle = null;

/**
 * 플레이어의 이름을 구합니다.
 *
 * 아직 이름을 짓는 자리가 없어 직업 이름을 씁니다. 이름 입력이 들어오면
 * 여기만 고치면 됩니다.
 * @returns {string} 이름
 */
function playerName() {
    return BACKGROUNDS[world.player.background]?.name ?? '모험가';
}

/** @description 신 칸에 마지막으로 그린 내용 */
let drawnGod = null;

/**
 * 섬기는 신과 신앙심을 보여줍니다.
 *
 * DCSS 는 신앙심을 숫자가 아니라 별(*)로 보여줍니다. 여섯 칸이고, 채워지지 않은 자리는
 * 점(.)으로 남습니다. 숫자보다 한눈에 들어와 그대로 따랐습니다.
 */
function updateGodLine() {
    const godId = world.player.god;
    if (!godId) {
        if (drawnGod === null) return;
        drawnGod = null;
        setText(dom.godLineEl, '-');
        return;
    }

    const rank = pietyRank(world.player.piety);
    const stars = '*'.repeat(rank) + '.'.repeat(PIETY_BREAKPOINTS.length - rank);
    const line = `${GODS[godId].name} ${stars}`;
    if (line === drawnGod) return;
    drawnGod = line;
    setText(dom.godLineEl, line);
}

/** @description 룬 칸에 마지막으로 그린 개수. 매 프레임 그림을 새로 만들지 않기 위한 것입니다. */
let drawnRuneCount = -1;

/**
 * 룬 개수를 그림과 함께 보여줍니다.
 *
 * DCSS 는 모은 룬을 개수가 아니라 그림으로 늘어놓습니다. 여기서도 같은 방식으로 하되,
 * 다 모으면 열다섯 개가 되어 줄이 넘치므로 다섯 개까지만 그리고 나머지는 숫자로 덧붙입니다.
 */
function updateRuneCount() {
    const count = world.runes.length;
    if (count === drawnRuneCount) return;
    drawnRuneCount = count;

    if (count === 0) {
        dom.runeCountEl.replaceChildren();
        setText(dom.runeCountEl, '0');
        return;
    }

    const SHOWN = 5;
    const icons = [];
    for (let i = 0; i < Math.min(count, SHOWN); i++) {
        const icon = spriteImage('status_rune', '룬');
        if (icon) icons.push(icon);
    }

    // 그림이 아직 없으면(에셋 로딩 전) 숫자만이라도 보여야 합니다.
    if (icons.length === 0) {
        setText(dom.runeCountEl, String(count));
        return;
    }

    if (count > SHOWN) {
        const rest = document.createElement('span');
        rest.textContent = ` +${count - SHOWN}`;
        icons.push(rest);
    }
    dom.runeCountEl.replaceChildren(...icons);
}

/** @description 무기 칸에 마지막으로 그린 무기. 같은 무기면 다시 만들지 않습니다. */
let drawnWeapon = null;

/**
 * 들고 있는 무기를 그림과 이름으로 보여줍니다.
 *
 * 화면 아래 무기 그림은 1인칭 시점이라 무엇을 들었는지 한눈에 들어오지 않습니다.
 * DCSS 가 상태창에 들고 있는 것을 따로 적어 주는 것과 같은 이유로 여기에도 둡니다.
 */
function updateWieldedWeapon() {
    const key = world.player.weapon;
    if (key === drawnWeapon) return;
    drawnWeapon = key;

    const weapon = C.WEAPONS[key];
    if (!weapon) {
        dom.wieldedWeaponEl.replaceChildren();
        setText(dom.wieldedWeaponEl, '-');
        return;
    }

    const label = document.createElement('span');
    label.textContent = weapon.name || key;

    const icon = spriteImage(weapon.sprite, weapon.name);
    dom.wieldedWeaponEl.replaceChildren(...(icon ? [icon, label] : [label]));
}

/**
 * 소지품 창을 다시 그립니다.
 *
 * 매 프레임 호출되므로, 내용이 실제로 달라졌을 때만 DOM 을 새로 만듭니다.
 * 그렇지 않으면 초당 수십 번 목록 전체를 다시 만들게 됩니다.
 */
function updateInventory() {
    // 원본처럼 i 로 여는 전체 화면입니다. 상태 패널에 늘 띄워 두지 않습니다.
    dom.inventoryScreenEl.style.display = runtime.isInventoryOpen ? 'flex' : 'none';
    setText(dom.inventoryTitleEl, inventorySummary(world.inventory));

    const signature = world.inventory.map(slot => `${slot.itemId}:${slot.count}`).join(',');
    if (signature === lastInventorySignature) return;
    lastInventorySignature = signature;

    dom.inventoryBodyEl.replaceChildren(...buildInventoryRows());
}

/** @description 마지막으로 그린 소지품 내용. 달라졌을 때만 다시 그립니다. */
let lastInventorySignature = null;

/**
 * 다음 갱신에서 소지품과 상태 표시를 강제로 다시 그리게 합니다.
 * 에셋 로딩이 끝나 그림이 준비된 시점에 호출합니다.
 */
export function invalidateSpriteCache() {
    lastInventorySignature = null;
    lastBuffSignature = null;
    // 그림이 없던 동안 숫자와 글자로만 그려 두었으므로, 그림이 준비되면 다시 그려야 합니다.
    drawnRuneCount = -1;
    drawnWeapon = null;
    drawnCharacter = null;
    drawnGod = null;
}

/**
 * 소지품 목록의 DOM 요소들을 만듭니다.
 * @returns {HTMLElement[]} 표시할 줄들
 */
function buildInventoryRows() {
    if (world.inventory.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'inv-empty';
        empty.textContent = '가진 것이 없다.';
        return [empty];
    }

    const rows = [];
    for (const group of groupInventory(world.inventory)) {
        const heading = document.createElement('div');
        heading.className = 'inv-category';
        heading.textContent = group.name;
        rows.push(heading);

        for (const entry of group.entries) {
            const row = document.createElement('div');
            row.className = 'inv-item';

            const letter = document.createElement('span');
            letter.className = 'inv-letter';
            // 첫 아홉 칸은 숫자키로 곧바로 쓸 수 있어 그 숫자를 함께 보여줍니다.
            letter.textContent = entry.index < 9 ? `${entry.index + 1})` : `${entry.letter})`;
            row.appendChild(letter);

            // DCSS 처럼 물건의 그림을 함께 보여줍니다. 이름만으로는 한눈에 구분되지 않습니다.
            const icon = spriteImage(entry.item.spriteKey, entry.item.name);
            if (icon) row.appendChild(icon);

            const label = document.createElement('span');
            label.className = 'inv-name';
            label.textContent = describeStack(entry.itemId, entry.count);
            row.appendChild(label);

            rows.push(row);
        }
    }
    return rows;
}

// --- 이벤트 핸들러 (Private) ---

/**
 * 플레이어가 피격당했을 때 화면 효과와 얼굴 반응을 표시합니다.
 */
function showHitReaction() {
    // 화면에 붉은 혈흔 효과를 잠시 표시합니다.
    dom.bloodSplatterEl.style.opacity = 0.8;

    // 상태 얼굴을 일시적으로 피격 반응 얼굴로 변경합니다.
    updateStatusFace(C.FACE_SPRITES.HIT_REACTION);

    // 잠시 후, 혈흔 효과를 서서히 사라지게 하고 얼굴을 원래 상태로 되돌립니다.
    later(() => {
        dom.bloodSplatterEl.style.opacity = 0;
        updateHUD(); // HUD 전체를 업데이트하여 얼굴을 현재 체력 상태에 맞게 되돌립니다.
    }, C.HIT_REACTION_MS);
}

/**
 * 무기를 발사했을 때의 시각 효과를 무기 정의에 따라 표시합니다.
 * @param {{weapon: string}} detail - 발사한 무기 정보
 */
function showAttackEffect({ weapon }) {
    const weaponData = C.WEAPONS[weapon];
    if (!weaponData) return;

    // 총구 섬광처럼 별도 스프라이트가 정의된 무기는 스프라이트를 잠시 교체합니다.
    if (weaponData.fireSprite) showFireSprite(weaponData);

    // 주먹처럼 CSS 애니메이션으로 표현되는 무기는 클래스를 잠시 붙입니다.
    if (weaponData.attackAnimation) {
        const className = weaponData.attackAnimation;
        dom.weaponSpriteEl.classList.add(className);
        later(() => dom.weaponSpriteEl.classList.remove(className), C.WEAPON_ATTACK_ANIM_MS);
    }
}

/**
 * 발사 스프라이트를 잠시 표시했다가 원래 스프라이트로 되돌립니다.
 * @param {object} weaponData - constants.js의 WEAPONS 항목
 */
function showFireSprite(weaponData) {
    const fireSpriteTexture = assets.textures[weaponData.fireSprite];
    const normalSpriteTexture = assets.textures[weaponData.sprite];
    const placeholderTexture = assets.textures.placeholder;

    // 발사 스프라이트가 있으면 사용하고, 없으면 일반 스프라이트, 그것도 없으면 플레이스홀더를 사용합니다.
    const fireSrc = fireSpriteTexture?.img?.src || normalSpriteTexture?.img?.src || placeholderTexture?.img?.src;
    if (fireSrc && dom.weaponSpriteEl.src !== fireSrc) {
        dom.weaponSpriteEl.src = fireSrc;
    }

    // 효과가 끝난 후 복원할 스프라이트도 미리 확인합니다.
    const restoreSrc = normalSpriteTexture?.img?.src || placeholderTexture?.img?.src;

    later(() => {
        // 그 사이 무기가 바뀌었을 수 있으므로, 여전히 같은 무기를 들고 있을 때만 복원합니다.
        if (C.WEAPONS[world.player.weapon] === weaponData && !runtime.isSwappingWeapon && restoreSrc) {
            dom.weaponSpriteEl.src = restoreSrc;
        }
    }, C.MUZZLE_FLASH_MS);
}

/**
 * 무기 교체 애니메이션을 재생하고, 연출이 끝나는 시점에 실제 무기를 교체합니다.
 * @param {string} newWeapon - 새로 교체할 무기의 키 ('gun' 또는 'fist')
 */
function playWeaponSwapAnimation(newWeapon) {
    if (runtime.isSwappingWeapon) return; // 이미 교체 중이면 중복 실행을 방지합니다.

    runtime.isSwappingWeapon = true;
    dom.weaponSpriteEl.classList.add('swapping-out'); // 무기가 아래로 내려가는 애니메이션

    // 무기가 화면 아래로 사라진 후
    later(() => {
        setWeapon(newWeapon);  // 실제 무기 상태를 변경
        updateWeaponSprite();  // 새 무기 이미지로 교체
        dom.weaponSpriteEl.classList.remove('swapping-out');
        dom.weaponSpriteEl.classList.add('swapping-in'); // 새 무기가 위로 올라오는 애니메이션

        // 새 무기가 완전히 올라온 후
        later(() => {
            dom.weaponSpriteEl.classList.remove('swapping-in');
            runtime.isSwappingWeapon = false;
        }, C.WEAPON_SWAP_HALF_MS);
    }, C.WEAPON_SWAP_HALF_MS);
}

// --- 내부 헬퍼 함수 (Private Methods) ---

/**
 * 값이 실제로 바뀐 경우에만 textContent를 씁니다.
 * 매 프레임 무조건 쓰면 초당 수백 번의 불필요한 DOM 변경이 발생합니다.
 * @param {HTMLElement} element - 대상 요소
 * @param {string|number} value - 표시할 값
 */
function setText(element, value) {
    const text = String(value);
    if (element.textContent !== text) element.textContent = text;
}

/**
 * 플레이어의 현재 체력에 따라 상태 창의 얼굴 이미지를 변경합니다.
 * @param {string|null} overrideFaceKey - 특정 얼굴(예: 피격 반응)을 일시적으로 표시할 스프라이트 키.
 */
function updateStatusFace(overrideFaceKey = null) {
    const faceImg = dom.statusFaceImgEl;
    if (!faceImg) return;

    let faceKeyToShow = overrideFaceKey;

    if (!faceKeyToShow) {
        // 플레이어 체력 비율에 따라 다른 얼굴 스프라이트 키를 선택합니다.
        const healthRatio = world.player.hp / world.player.maxHp;
        if (healthRatio > 0.7) faceKeyToShow = C.FACE_SPRITES.HEALTHY;
        else if (healthRatio > 0.3) faceKeyToShow = C.FACE_SPRITES.HURT;
        else faceKeyToShow = C.FACE_SPRITES.BLOODY;
    }

    applySprite(faceImg, faceKeyToShow, 'Status face');
}

/**
 * 현재 선택된 무기에 맞는 스프라이트를 화면에 표시합니다.
 */
function updateWeaponSprite() {
    const weaponData = C.WEAPONS[world.player.weapon];
    if (!weaponData) return;

    applySprite(dom.weaponSpriteEl, weaponData.sprite, 'Weapon');
}

/**
 * @description 이미 경고한 텍스처 키. updateHUD가 매 프레임 호출되므로,
 * 누락된 스프라이트 하나가 초당 수십 줄의 콘솔 경고를 쏟아내는 것을 막습니다.
 */
const warnedTextures = new Set();

/**
 * 텍스처를 찾아 img 요소에 적용합니다. 없으면 플레이스홀더로 대체합니다.
 * @param {HTMLImageElement} imgEl - 대상 img 요소
 * @param {string} textureKey - 표시할 텍스처 키
 * @param {string} label - 경고 메시지에 쓸 이름
 */
function applySprite(imgEl, textureKey, label) {
    const texture = assets.textures[textureKey];
    const placeholder = assets.textures.placeholder;
    let newSrc = '';

    if (texture && texture.img) {
        newSrc = texture.img.src;
    } else if (placeholder && placeholder.img) {
        newSrc = placeholder.img.src;
        if (!warnedTextures.has(textureKey)) {
            warnedTextures.add(textureKey);
            console.warn(`${label} sprite not found: ${textureKey}. Using placeholder.`);
        }
    }

    // 현재 이미지와 다를 경우에만 src를 변경하여 불필요한 DOM 조작을 방지합니다.
    if (newSrc && imgEl.src !== newSrc) {
        imgEl.src = newSrc;
    }
}

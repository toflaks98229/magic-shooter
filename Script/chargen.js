/**
 * @fileoverview 캐릭터 생성 화면.
 *
 * DCSS 의 차례를 그대로 따릅니다. 종족을 고르고, 직업을 고르고, 시작합니다.
 * 신은 여기서 고르지 않습니다. 원본에서도 광전사(트로그)와 혼돈의 기사(좀) 둘만 신을 갖고
 * 시작하고, 나머지는 던전에서 제단을 만나야 섬길 수 있기 때문입니다.
 *
 * 화면 구성도 원본을 따랐습니다. 항목마다 글자가 붙고, 그 글자를 누르면 골라집니다.
 * 원본이 추천하는 조합은 밝게 표시되는데, 처음 하는 사람에게는 그 표시가 사실상
 * 유일한 길잡이라 빼지 않았습니다.
 */

import { dom } from './dom.js';
import { SPECIES, derive } from './species.js';
import { BACKGROUNDS, groupedBackgrounds, isRecommended } from './backgrounds.js';
import { GODS } from './gods.js';

/** @description 항목에 붙일 글자. 원본처럼 a 부터 차례로 붙입니다. */
const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

/** @description 고르는 중인 것. 직업 화면에서 뒤로 가면 종족 화면으로 돌아갑니다. */
let step = 'species';
/** @description 종족 화면에서 고른 것 */
let chosenSpecies = null;
/** @description 다 고르면 부를 함수 */
let onComplete = null;

/**
 * 캐릭터 생성을 시작합니다.
 * @param {(species: string, background: string) => void} done - 다 골랐을 때 부를 함수
 */
export function startCharacterCreation(done) {
    onComplete = done;
    step = 'species';
    chosenSpecies = null;
    dom.chargenScreen.style.display = 'flex';
    dom.startScreen.style.display = 'none';
    renderStep();
}

/** 캐릭터 생성 화면을 닫습니다. */
function close() {
    dom.chargenScreen.style.display = 'none';
}

/**
 * 지금 단계에 맞는 목록을 그립니다.
 */
function renderStep() {
    if (step === 'species') renderSpeciesStep();
    else renderBackgroundStep();
}

/**
 * 종족 목록을 그립니다. 원본처럼 난이도별로 묶습니다.
 */
function renderSpeciesStep() {
    dom.chargenPromptEl.textContent = '종족을 고르십시오';
    dom.chargenHintEl.textContent = '항목에 마우스를 올리면 어떤 종족인지 설명이 나옵니다.';
    dom.chargenDetailEl.textContent = '';

    const GROUPS = [
        { key: 'simple', name: '쉬움' },
        { key: 'intermediate', name: '보통' },
        { key: 'advanced', name: '어려움' },
    ];

    const nodes = [];
    let letterIndex = 0;

    for (const group of GROUPS) {
        const ids = Object.keys(SPECIES).filter(id => SPECIES[id].difficulty === group.key);
        if (ids.length === 0) continue;

        nodes.push(groupHeading(group.name));
        for (const id of ids) {
            const species = SPECIES[id];
            nodes.push(itemButton(LETTERS[letterIndex++], species.name, {
                onChoose: () => chooseSpecies(id),
                onDescribe: () => describeSpecies(id),
            }));
        }
    }

    dom.chargenGridEl.replaceChildren(...nodes);
}

/**
 * 직업 목록을 그립니다. 고른 종족에게 추천되는 직업은 밝게 표시됩니다.
 */
function renderBackgroundStep() {
    const species = SPECIES[chosenSpecies];
    dom.chargenPromptEl.textContent = `${species.name} — 직업을 고르십시오`;
    dom.chargenHintEl.textContent = '밝은 색은 이 종족에게 원본이 추천하는 직업이라는 뜻입니다.';
    dom.chargenDetailEl.textContent = '';

    const nodes = [];
    let letterIndex = 0;

    for (const group of groupedBackgrounds()) {
        nodes.push(groupHeading(group.name));
        for (const id of group.ids) {
            const background = BACKGROUNDS[id];
            nodes.push(itemButton(LETTERS[letterIndex++], background.name, {
                recommended: isRecommended(chosenSpecies, id),
                onChoose: () => chooseBackground(id),
                onDescribe: () => describeBackground(id),
            }));
        }
    }

    dom.chargenGridEl.replaceChildren(...nodes);
}

/**
 * 묶음 제목 줄을 만듭니다.
 * @param {string} text - 제목
 * @returns {HTMLElement} 제목 요소
 */
function groupHeading(text) {
    const heading = document.createElement('div');
    heading.className = 'chargen-group';
    heading.textContent = text;
    return heading;
}

/**
 * 고를 수 있는 한 줄을 만듭니다.
 * @param {string} letter - 앞에 붙일 글자
 * @param {string} label - 표시할 이름
 * @param {object} handlers - onChoose / onDescribe / recommended
 * @returns {HTMLElement} 버튼 요소
 */
function itemButton(letter, label, { onChoose, onDescribe, recommended = false }) {
    const button = document.createElement('button');
    button.className = recommended ? 'chargen-item recommended' : 'chargen-item';
    button.dataset.letter = letter;

    const key = document.createElement('span');
    key.className = 'menu-key';
    key.textContent = `(${letter})`;

    const name = document.createElement('span');
    name.textContent = label;

    button.append(key, name);
    button.addEventListener('click', onChoose);
    button.addEventListener('mouseenter', onDescribe);
    button.addEventListener('focus', onDescribe);
    return button;
}

/**
 * 종족 설명을 아래 칸에 씁니다.
 * @param {string} id - 종족 키
 */
function describeSpecies(id) {
    const species = SPECIES[id];
    const stats = derive(id);
    // 원본의 적성 수치를 그대로 보여줘도 와닿지 않으므로, 실제 체력과 마력으로 바꿔 보여줍니다.
    dom.chargenDetailEl.replaceChildren(
        detailLine(`${species.name} (${species.enName})`, species.note),
        detailLine('', `체력 ${stats.maxHp} · 마력 ${stats.maxMp} · 힘 ${species.str} · 지능 ${species.int} · 민첩 ${species.dex}`),
    );
}

/**
 * 직업 설명을 아래 칸에 씁니다.
 * @param {string} id - 직업 키
 */
function describeBackground(id) {
    const background = BACKGROUNDS[id];
    const god = background.god ? GODS[background.god] : null;

    const parts = [];
    if (god) parts.push(`${god.name}을(를) 섬긴 채로 시작합니다`);
    if (background.randomStart) parts.push('시작 소지품이 매번 달라집니다');
    parts.push(`무기: ${background.weapon === 'fist' ? '마법 장갑' : '마법 지팡이'}`);
    // 원본 장비를 그대로 줄 수 없으므로, 무엇을 대신 주는지 보이게 적습니다.
    if (background.sourceEquipment.length > 0) {
        parts.push(`원본 장비: ${background.sourceEquipment.join(', ')}`);
    }

    dom.chargenDetailEl.replaceChildren(
        detailLine(`${background.name} (${background.enName})`, parts.join(' · ')),
    );
}

/**
 * 설명 한 줄을 만듭니다.
 * @param {string} title - 굵게 쓸 앞부분
 * @param {string} text - 뒤에 붙일 설명
 * @returns {HTMLElement} 줄 요소
 */
function detailLine(title, text) {
    const line = document.createElement('div');
    if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title + ' — ';
        line.appendChild(strong);
    }
    line.appendChild(document.createTextNode(text));
    return line;
}

/**
 * 종족을 고르고 직업 화면으로 넘어갑니다.
 * @param {string} id - 종족 키
 */
function chooseSpecies(id) {
    chosenSpecies = id;
    step = 'background';
    renderStep();
}

/**
 * 직업을 고르고 캐릭터 생성을 끝냅니다.
 * @param {string} id - 직업 키
 */
function chooseBackground(id) {
    close();
    onComplete?.(chosenSpecies, id);
}

/**
 * 캐릭터 생성 화면에서의 키 입력을 처리합니다.
 *
 * 원본처럼 글자키로 곧바로 고를 수 있어야 합니다. 목록이 길어 마우스로만 고르게 하면
 * 원본과 조작감이 달라집니다.
 * @param {string} key - 눌린 키
 * @returns {boolean} 처리했으면 true
 */
export function handleChargenKey(key) {
    if (dom.chargenScreen.style.display === 'none') return false;

    if (key === 'Escape') {
        // 직업 화면에서는 종족 화면으로, 종족 화면에서는 타이틀로 돌아갑니다.
        if (step === 'background') {
            step = 'species';
            renderStep();
        } else {
            close();
            dom.startScreen.style.display = 'flex';
        }
        return true;
    }

    if (key === '*') {
        chooseRandom();
        return true;
    }

    const buttons = [...dom.chargenGridEl.children].filter(node => node.dataset?.letter);
    const match = buttons.find(button => button.dataset.letter === key.toLowerCase());
    if (!match) return false;

    match.click();
    return true;
}

/** 지금 화면에서 아무거나 하나 고릅니다. 원본의 * 와 같습니다. */
function chooseRandom() {
    const buttons = [...dom.chargenGridEl.children].filter(node => node.dataset?.letter);
    if (buttons.length === 0) return;
    buttons[Math.floor(Math.random() * buttons.length)].click();
}

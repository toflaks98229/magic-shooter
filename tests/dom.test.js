/**
 * @fileoverview HTML 과 dom.js 가 어긋나지 않는지 확인합니다.
 *
 * bindDom() 은 SELECTORS 표의 모든 항목을 HTML 에서 찾지 못하면 시작 시점에 멈춥니다.
 * 그 실패는 브라우저를 열어야만 보이는데, 이 저장소에서는 열 수 없습니다.
 * 마크업을 손볼 때마다 조용히 깨지는 것을 막기 위해 여기서 미리 대조합니다.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

/** 게임을 실행하는 HTML 문서를 찾습니다. */
const gamePage = readdirSync(projectRoot)
    .filter(name => name.endsWith('.html'))
    .find(name => readFileSync(projectRoot + name, 'utf8').includes('Script/main.js'));

assert.ok(gamePage, 'Script/main.js 를 불러오는 HTML 문서를 찾지 못했습니다');
const html = readFileSync(projectRoot + gamePage, 'utf8');

/** dom.js 에서 SELECTORS 표를 읽어옵니다. (모듈은 document 를 필요로 하므로 소스를 파싱합니다) */
const domSource = readFileSync(projectRoot + 'Script/dom.js', 'utf8');
const selectorBlock = domSource.slice(domSource.indexOf('const SELECTORS = {'), domSource.indexOf('};', domSource.indexOf('const SELECTORS = {')));
const selectors = [...selectorBlock.matchAll(/(\w+):\s*'([^']+)'/g)].map(([, key, selector]) => ({ key, selector }));

test('SELECTORS 표를 읽어냈다', () => {
    assert.ok(selectors.length > 10, `셀렉터를 ${selectors.length}개만 찾았습니다. 파싱이 잘못되었을 수 있습니다`);
});

test('dom.js 가 요구하는 요소가 HTML 에 모두 있다', () => {
    const missing = selectors.filter(({ selector }) => {
        if (selector.startsWith('#')) return !html.includes(`id="${selector.slice(1)}"`);
        if (selector.startsWith('.')) return !html.includes(`class="${selector.slice(1)}"`)
            && !new RegExp(`class="[^"]*\\b${selector.slice(1)}\\b`).test(html);
        return false;
    });

    assert.deepEqual(missing.map(m => `${m.key} (${m.selector})`), [],
        `HTML 에 없는 요소가 있어 bindDom() 이 시작 시점에 멈춥니다`);
});

test('id 가 중복되지 않는다', () => {
    // querySelector 는 첫 번째만 돌려주므로, 중복된 id 는 엉뚱한 요소를 잡습니다.
    const ids = [...html.matchAll(/id="([^"]+)"/g)].map(([, id]) => id);
    const duplicated = ids.filter((id, i) => ids.indexOf(id) !== i);

    assert.deepEqual([...new Set(duplicated)], [], '중복된 id 가 있습니다');
});

test('HTML 이 게임 스크립트를 모듈로 불러온다', () => {
    assert.match(html, /<script\s+type="module"\s+src="Script\/main\.js">/,
        'main.js 를 type="module" 로 불러와야 import 가 동작합니다');
});

test('소지품 창이 접기 위한 구조를 갖추고 있다', () => {
    // ui.js 가 이 구조를 전제로 클래스를 토글합니다.
    assert.match(html, /id="inventory"/, '소지품 창 컨테이너가 필요합니다');
    assert.match(html, /id="inventory-header"/, '눌러서 접을 제목 줄이 필요합니다');
    assert.match(html, /id="inventory-body"/, '접었을 때 숨길 본문이 필요합니다');
    assert.match(html, /#inventory\.collapsed\s+#inventory-body\s*\{\s*display:\s*none/,
        '접힌 상태에서 본문을 숨기는 규칙이 CSS 에 필요합니다');
});

test('게임 화면과 상태 패널이 나란히 놓인다', () => {
    // 캔버스가 창 전체를 차지하면 패널 밑으로 그림이 밀립니다.
    assert.match(html, /id="viewport"/, '캔버스를 감싸는 영역이 필요합니다');
    assert.match(html, /id="status-panel"/, '상태 패널이 필요합니다');
    assert.match(html, /#game-container\s*\{[^}]*display:\s*flex/,
        '게임 화면과 패널을 나란히 놓으려면 flex 배치가 필요합니다');
});

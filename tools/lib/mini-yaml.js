/**
 * @fileoverview DCSS 데이터 파일이 쓰는 만큼의 YAML 만 읽는 파서입니다.
 *
 * 이 저장소는 의존성이 없습니다. 몬스터 671종과 종족 48종을 읽자고 YAML 라이브러리를
 * 들이는 대신, 실제로 쓰이는 문법만 처리하는 파서를 둡니다.
 *
 * DCSS 데이터가 쓰는 문법은 이게 전부입니다.
 *   key: value                     평탄한 값
 *   key: {a: b, c: d}              인라인 맵
 *   key: [a, b, c]                 인라인 리스트
 *   key:                           블록 리스트
 *    - {type: hit, damage: 3}
 *   key:                           블록 맵 (종족의 aptitudes)
 *     sub: 1
 *   key:                           중첩된 블록 맵 (종족의 mutations)
 *     1:
 *       MUT_HORNS: 2
 *
 * 마지막 것이 중요합니다. 처음에는 한 단계만 다루도록 만들었는데,
 * 종족의 mutations 가 두 단계라 MUT_HORNS 가 mutations 바로 아래로 올라붙으면서
 * 레벨 정보가 사라졌습니다. 예외도 나지 않고 값이 그럴듯해 보여서
 * 종족을 실제로 대조해 보기 전에는 알 수 없는 종류의 손상이었습니다.
 * 그래서 들여쓰기를 스택으로 다루도록 다시 썼습니다.
 *
 * 앵커·별칭·여러 줄 문자열은 쓰이지 않으므로 지원하지 않습니다.
 * 모르는 문법을 만나면 조용히 넘기지 않고 예외를 던집니다.
 * 이식 도중 형식이 바뀌면 즉시 드러나야 하기 때문입니다.
 */

/**
 * 스칼라 하나를 자바스크립트 값으로 바꿉니다.
 * @param {string} raw - 다듬어진 문자열
 * @returns {string|number|boolean|null} 변환된 값
 */
function parseScalar(raw) {
    const text = raw.trim();
    if (text === '') return null;
    // DCSS 는 파이썬 도구로 이 파일들을 만들기 때문에 True/False 를 대문자로 씁니다.
    // 소문자만 보면 문자열 "False" 로 읽히는데, 그 값이 하필 그럴듯해서
    // 실제로 데미갓의 '발동술을 배울 수 없음'이 문자열로 들어가 있었습니다.
    if (text === 'true' || text === 'True') return true;
    if (text === 'false' || text === 'False') return false;
    if (text === 'null' || text === 'None' || text === '~') return null;

    // 따옴표가 있으면 문자열로 확정합니다. "10" 같은 값이 숫자로 바뀌면 안 됩니다.
    const quoted = text.match(/^"(.*)"$/) || text.match(/^'(.*)'$/);
    if (quoted) return quoted[1];

    // 부호를 명시한 숫자가 섞여 있습니다. 적성표에 `alchemy: +1` 처럼 적힌 곳이 있는데,
    // 더하기를 허용하지 않으면 문자열 "+1" 이 되어 계산이 조용히 NaN 으로 흘러갑니다.
    if (/^[+-]?\d+$/.test(text)) return parseInt(text, 10);
    if (/^[+-]?\d*\.\d+$/.test(text)) return parseFloat(text);
    return text;
}

/**
 * 인라인 표기 안에서 쉼표로 항목을 자릅니다.
 * 중첩된 괄호와 따옴표 안의 쉼표는 자르지 않습니다.
 * @param {string} body - 바깥 괄호를 뺀 내용
 * @returns {string[]} 항목들
 */
function splitInline(body) {
    const parts = [];
    let depth = 0, quote = null, current = '';

    for (const ch of body) {
        if (quote) {
            current += ch;
            if (ch === quote) quote = null;
            continue;
        }
        if (ch === '"' || ch === "'") { quote = ch; current += ch; continue; }
        if (ch === '{' || ch === '[') depth++;
        if (ch === '}' || ch === ']') depth--;
        if (ch === ',' && depth === 0) { parts.push(current); current = ''; continue; }
        current += ch;
    }
    if (current.trim() !== '') parts.push(current);
    return parts;
}

/**
 * 값 하나를 읽습니다. 인라인 맵·리스트면 펼치고, 아니면 스칼라로 봅니다.
 * @param {string} raw - 값 부분 문자열
 * @returns {*} 변환된 값
 */
function parseValue(raw) {
    const text = raw.trim();

    if (text.startsWith('{') && text.endsWith('}')) {
        const out = {};
        for (const part of splitInline(text.slice(1, -1))) {
            const colon = part.indexOf(':');
            if (colon < 0) throw new Error(`인라인 맵에 콜론이 없습니다: ${part}`);
            out[part.slice(0, colon).trim()] = parseValue(part.slice(colon + 1));
        }
        return out;
    }

    if (text.startsWith('[') && text.endsWith(']')) {
        return splitInline(text.slice(1, -1)).map(parseValue);
    }

    return parseScalar(text);
}

/**
 * 줄 끝에 달린 주석을 걷어냅니다.
 *
 * 종족 파일에 `species_flags: # n.b. ants have hair` 처럼 키 뒤에 주석이 붙은 곳이
 * 있습니다. 이것을 걷어내지 않으면 값이 비어 있다는 것을 알아채지 못하고
 * 주석 문자열 자체를 값으로 읽어, 뒤따르는 블록이 통째로 사라집니다.
 *
 * 따옴표 안의 # 은 주석이 아니므로 건너뜁니다.
 * @param {string} text - 다듬기 전의 줄
 * @returns {string} 주석을 걷어낸 줄
 */
function stripComment(text) {
    let quote = null;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (quote) {
            if (ch === quote) quote = null;
            continue;
        }
        if (ch === '"' || ch === "'") { quote = ch; continue; }
        // 줄 맨 앞이거나 앞이 공백일 때만 주석으로 봅니다.
        // 값 안에 쓰인 # 을 잘라내지 않기 위해서입니다.
        if (ch === '#' && (i === 0 || /\s/.test(text[i - 1]))) return text.slice(0, i);
    }
    return text;
}

/**
 * 주석과 빈 줄을 걷어내고, 각 줄의 들여쓰기 깊이를 함께 붙입니다.
 * @param {string} source - 파일 내용
 * @returns {{indent: number, text: string, line: number}[]} 의미 있는 줄들
 */
function meaningfulLines(source) {
    const out = [];
    source.split(/\r?\n/).forEach((raw, index) => {
        const text = stripComment(raw).trim();
        if (text === '') return;
        out.push({ indent: raw.length - raw.trimStart().length, text, line: index + 1 });
    });
    return out;
}

/**
 * DCSS YAML 문서 하나를 읽습니다.
 * @param {string} source - 파일 내용
 * @returns {object} 파싱된 객체
 * @throws {Error} 지원하지 않는 문법을 만나면
 */
export function parseYaml(source) {
    const lines = meaningfulLines(source);
    let cursor = 0;

    /**
     * 주어진 들여쓰기 깊이의 블록 하나를 읽습니다. 자신보다 얕은 줄을 만나면 멈춥니다.
     * @param {number} indent - 이 블록의 들여쓰기 깊이
     * @returns {object|Array} 읽어들인 맵 또는 리스트
     */
    function parseBlock(indent) {
        // 첫 줄이 '- ' 로 시작하면 리스트, 아니면 맵입니다.
        const isList = lines[cursor].text.startsWith('- ');
        const container = isList ? [] : {};

        while (cursor < lines.length && lines[cursor].indent >= indent) {
            const { indent: depth, text, line } = lines[cursor];

            // 더 깊은 줄은 이 자리에서 처리할 것이 아닙니다.
            // 값을 읽는 쪽에서 이미 소비했어야 하므로, 남아 있다면 형식이 이상한 것입니다.
            if (depth > indent) throw new Error(`${line}행: 들여쓰기가 맞지 않습니다: ${text}`);

            if (text.startsWith('- ')) {
                if (!isList) throw new Error(`${line}행: 맵 안에 리스트 항목이 왔습니다`);
                const rest = text.slice(2);

                // 항목이 여러 줄에 걸친 맵인 경우가 있습니다.
                //   fake_mutations:
                //     - long: You are resistant to damage.
                //       short: damage resistance
                // 인라인 맵도 리스트도 아니면서 콜론이 있으면 이쪽입니다.
                const isBlockMapItem = !rest.startsWith('{') && !rest.startsWith('[')
                    && rest.includes(':');

                if (isBlockMapItem) {
                    // '- ' 를 걷어내고 그 자리에서 시작하는 블록으로 다시 봅니다.
                    // 뒤따르는 줄들이 이미 같은 깊이로 들여쓰여 있으므로 그대로 이어집니다.
                    const contentIndent = depth + 2;
                    lines[cursor] = { indent: contentIndent, text: rest, line };
                    container.push(parseBlock(contentIndent));
                    continue;
                }

                container.push(parseValue(rest));
                cursor++;
                continue;
            }

            if (isList) throw new Error(`${line}행: 리스트 안에 맵 항목이 왔습니다`);

            const colon = text.indexOf(':');
            if (colon < 0) throw new Error(`${line}행: 콜론이 없습니다: ${text}`);

            const key = text.slice(0, colon).trim();
            const rest = text.slice(colon + 1).trim();
            cursor++;

            if (rest !== '') {
                container[key] = parseValue(rest);
                continue;
            }

            // 값이 비어 있으면 다음 줄부터가 이 키의 블록입니다.
            // 더 깊게 들여쓴 줄이 없으면 빈 값으로 둡니다.
            if (cursor < lines.length && lines[cursor].indent > depth) {
                container[key] = parseBlock(lines[cursor].indent);
            } else {
                container[key] = null;
            }
        }

        return container;
    }

    if (lines.length === 0) return {};
    return parseBlock(lines[0].indent);
}

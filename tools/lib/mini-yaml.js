/**
 * @fileoverview DCSS 데이터 파일이 쓰는 만큼의 YAML 만 읽는 파서입니다.
 *
 * 이 저장소는 의존성이 없습니다. 몬스터 683종을 읽자고 YAML 라이브러리를
 * 들이는 대신, 실제로 쓰이는 문법만 처리하는 100 줄짜리를 둡니다.
 *
 * DCSS 몬스터·종족 YAML 이 쓰는 문법은 이게 전부입니다.
 *   key: value                     평탄한 값
 *   key: {a: b, c: d}              인라인 맵
 *   key: [a, b, c]                 인라인 리스트
 *   key:                           블록 리스트
 *    - {type: hit, damage: 3}
 *   key:                           블록 맵 (종족의 aptitudes)
 *     sub: 1
 *
 * 앵커·별칭·여러 줄 문자열·주석 이어쓰기 같은 것은 쓰이지 않으므로 지원하지 않습니다.
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
    if (text === 'true') return true;
    if (text === 'false') return false;
    if (text === 'null' || text === '~') return null;

    // 따옴표가 있으면 문자열로 확정합니다. "10" 같은 값이 숫자로 바뀌면 안 됩니다.
    const quoted = text.match(/^"(.*)"$/) || text.match(/^'(.*)'$/);
    if (quoted) return quoted[1];

    if (/^-?\d+$/.test(text)) return parseInt(text, 10);
    if (/^-?\d*\.\d+$/.test(text)) return parseFloat(text);
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
 * DCSS YAML 문서 하나를 읽습니다.
 * @param {string} source - 파일 내용
 * @returns {object} 파싱된 객체
 * @throws {Error} 지원하지 않는 문법을 만나면
 */
export function parseYaml(source) {
    const lines = source.split(/\r?\n/);
    const root = {};

    // 블록으로 이어지는 키를 기억해 둡니다. 들여쓰기가 풀리면 지웁니다.
    let blockKey = null;
    let blockIndent = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '' || line.trim().startsWith('#')) continue;

        const indent = line.length - line.trimStart().length;
        const text = line.trim();

        // 블록 리스트 항목
        if (text.startsWith('- ')) {
            if (blockKey === null) throw new Error(`${i + 1}행: 딸린 키 없는 리스트 항목입니다`);
            root[blockKey].push(parseValue(text.slice(2)));
            continue;
        }

        const colon = text.indexOf(':');
        if (colon < 0) throw new Error(`${i + 1}행: 콜론이 없습니다: ${text}`);

        const key = text.slice(0, colon).trim();
        const rest = text.slice(colon + 1).trim();

        // 들여쓰기가 블록보다 깊으면 그 블록에 속한 값입니다.
        if (blockKey !== null && indent > blockIndent) {
            if (Array.isArray(root[blockKey])) {
                throw new Error(`${i + 1}행: 리스트 안에 맵 항목이 왔습니다`);
            }
            root[blockKey][key] = parseValue(rest);
            continue;
        }

        blockKey = null;

        if (rest === '') {
            // 다음 줄을 보고 리스트인지 맵인지 정합니다.
            const next = lines.slice(i + 1).find(l => l.trim() !== '' && !l.trim().startsWith('#'));
            root[key] = next && next.trim().startsWith('- ') ? [] : {};
            blockKey = key;
            blockIndent = indent;
            continue;
        }

        root[key] = parseValue(rest);
    }

    return root;
}

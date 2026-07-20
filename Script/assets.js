/**
 * @fileoverview 로드된 에셋 저장소입니다.
 *
 * 텍스처(ImageData/Image), 사운드 버퍼, 스프라이트 아틀라스처럼
 * 직렬화할 수 없고 게임 세션보다 수명이 긴 값들을 모아 둡니다.
 * world.js와 분리해 둔 덕분에 world는 순수 데이터로 남아 저장이 가능해집니다.
 */

/** @description 로드된 모든 에셋 */
export const assets = {
    /** @description 스프라이트 시트 이미지 (e.g., { main: Image, wall: Image }) */
    spriteSheets: {},
    /** @description 파싱된 스프라이트 시트 JSON 데이터 */
    spriteAtlases: {},
    /** @description 각 스프라이트 키가 어느 시트에 속하는지 매핑 */
    spriteKeyToSheet: {},
    /** @description 스프라이트 시트에서 잘라낸 개별 텍스처 데이터 */
    textures: {},
    /** @description 디코딩된 사운드 버퍼 */
    sounds: {},
    /** @description 스프라이트 이름 규칙으로부터 수집된 던전 테마별 텍스처 모음 */
    dungeonThemes: {},
    /** @description 로드된 층별 테마 진행도 데이터 (dungeon_progression.json) */
    dungeonProgression: null,
};

/**
 * 테마 이름과 변형 번호로 실제 텍스처 묶음을 조회합니다.
 * world에는 이름만 저장되므로, 렌더러는 매 층 이 함수로 텍스처를 해석합니다.
 * @param {string|null} themeName - 테마 이름 (e.g., 'main', 'cave')
 * @param {number|string|null} variation - 변형 번호
 * @returns {{wall: object[], floor: object[], ceiling: object[]}|null} 텍스처 묶음, 없으면 null
 */
export function resolveTheme(themeName, variation) {
    if (!themeName || variation === null || variation === undefined) return null;
    return assets.dungeonThemes[themeName]?.[`variation_${variation}`] || null;
}

/**
 * 해당 테마/변형이 실제로 로드되어 있는지 확인합니다.
 * @param {string} themeName - 테마 이름
 * @param {number|string} variation - 변형 번호
 * @returns {boolean} 사용 가능하면 true
 */
export function hasTheme(themeName, variation) {
    return resolveTheme(themeName, variation) !== null;
}

/**
 * 텍스처를 조회하되, 없으면 플레이스홀더를 반환합니다.
 * @param {string} key - 텍스처 키
 * @returns {object|undefined} 텍스처 데이터
 */
export function getTexture(key) {
    return assets.textures[key] || assets.textures.placeholder;
}

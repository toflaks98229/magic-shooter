/**
 * @fileoverview DCSS 의 난수 도우미를 그대로 옮긴 것입니다.
 *
 * DCSS 의 전투·성장 공식은 전부 이 함수들이 만드는 '특정 정수 분포'를 전제로 짜여
 * 있습니다. 예를 들어 AC 감산은 random2(1+AC) 라는 균등 분포이고, 몬스터 HP 는
 * random2avg 여덟 번의 좁은 분포입니다. 이것을 Math.random() 으로 근사하면
 * 표에 적힌 수치는 같은데 실제로 플레이해 보면 밸런스가 다른 게임이 됩니다.
 *
 * 그래서 여기서는 '깔끔하게 고치는 것'을 일부러 하지 않습니다.
 * 원본의 이상해 보이는 부분(random2avg 의 첫 굴림만 다른 것,
 * maybe_random2_div 가 분모를 더하고 나누는 것)은 전부 의도된 것이며 그대로 둡니다.
 *
 * 출처: crawl-ref/source/random.cc
 */

/**
 * @description 난수 공급원. 기본은 Math.random 입니다.
 *
 * 세이브를 불러왔을 때 같은 상황에서 같은 결과가 나오게 하려면(리플레이·결정론)
 * 여기를 씨앗 있는 생성기로 갈아 끼우면 됩니다. 그때 중요한 것은
 * 이 파일 밖에서 Math.random() 을 부르는 곳이 하나도 없어야 한다는 점입니다.
 * 한 군데라도 섞이면 결정론이 조용히 깨집니다.
 */
let source = Math.random;

/**
 * 난수 공급원을 교체합니다. 테스트와 결정론적 재생에 씁니다.
 * @param {() => number} next - [0, 1) 을 돌려주는 함수
 */
export function setRandomSource(next) {
    source = next;
}

/** 난수 공급원을 기본값으로 되돌립니다. */
export function resetRandomSource() {
    source = Math.random;
}

/**
 * [0, 1) 실수. DCSS 의 random_real().
 * @returns {number} 난수
 */
export function randomReal() {
    return source();
}

/**
 * [0, max-1] 균등 정수.
 *
 * max 가 1 이하면 0 입니다. 0 이 아니라 1 이 경계라는 점이 중요합니다.
 * DCSS 곳곳에서 random2(1) 이 0 이라는 성질을 이용합니다.
 * (예: slaying +0 은 random2(1) 이라 아무것도 더하지 않습니다)
 * @param {number} max - 상한(미포함)
 * @returns {number} [0, max-1] 의 정수
 */
export function random2(max) {
    if (max <= 1) return 0;
    return Math.floor(source() * max);
}

/**
 * NdS 주사위. [num, num*size] 범위입니다.
 *
 * 인자가 0 이하면 예외가 아니라 0 을 돌려줍니다.
 * 계산 결과를 그대로 넘기는 호출부가 많아 원본이 일부러 그렇게 해 두었습니다.
 * @param {number} num - 주사위 개수
 * @param {number} size - 주사위 면 수
 * @returns {number} 합
 */
export function rollDice(num, size) {
    if (num <= 0 || size <= 0) return 0;

    let total = num;  // random2 가 0 부터라 개수만큼 더해 보정합니다
    for (let i = 0; i < num; i++) total += random2(size);
    return total;
}

/**
 * 나눈 뒤 나머지를 확률로 삼아 올림합니다. 편향 없는 확률적 반올림입니다.
 *
 * div_rand_round(7, 2) 는 3 또는 4 를 절반씩 돌려주므로 기댓값이 정확히 3.5 입니다.
 * DCSS 가 floor 로 인한 편향이 누적되는 것을 막으려고 도처에 쓰는 도구입니다.
 *
 * C++ 의 정수 나눗셈은 0 쪽으로 자르므로 Math.floor 가 아니라 Math.trunc 입니다.
 * 음수를 넘기는 호출부는 거의 없지만, 부호 처리를 원본과 맞춰 둡니다.
 * @param {number} num - 피제수
 * @param {number} den - 제수
 * @returns {number} 확률적으로 반올림된 몫
 */
export function divRandRound(num, den) {
    const quotient = Math.trunc(num / den);
    const rem = num % den;
    if (rem === 0) return quotient;
    return quotient + (random2(den) < rem ? 1 : 0);
}

/**
 * 나눈 뒤 올림합니다. 확률이 아니라 항상 올립니다.
 * @param {number} num - 피제수
 * @param {number} den - 제수
 * @returns {number} 올림한 몫
 */
export function divRoundUp(num, den) {
    return Math.trunc(num / den) + (num % den !== 0 ? 1 : 0);
}

/**
 * 나눈 뒤 가장 가까운 정수로 반올림합니다. 1.5 는 2 로, 1.49 는 1 로 갑니다.
 * 플레이어 근접 피해의 주 굴림에 쓰이므로 정확해야 합니다. (attack.cc:1017)
 * @param {number} num - 피제수
 * @param {number} den - 제수
 * @returns {number} 반올림한 몫
 */
export function divRoundNear(num, den) {
    const rem = num % den;
    return Math.trunc(num / den) + (rem >= Math.trunc(den / 2) ? 1 : 0);
}

/**
 * 평균은 random2 와 같고 분산만 작은 분포.
 *
 * 첫 굴림만 random2(max) 이고 나머지는 random2(max + 1) 입니다.
 * 대칭이 아닌 것이 의도된 부분이라 고치지 마십시오.
 * 평균을 (max-1)/2 로 유지하면서 평균값이 max-1 근처까지 닿게 하는 장치입니다.
 * @param {number} max - 상한(미포함)
 * @param {number} rolls - 굴림 횟수. 2 이상이어야 의미가 있습니다
 * @returns {number} 평균값
 */
export function random2avg(max, rolls) {
    let sum = random2(max);
    for (let i = 0; i < rolls - 1; i++) sum += random2(max + 1);
    return Math.trunc(sum / rolls);
}

/**
 * [low, high] 균등 정수. 양쪽 끝을 모두 포함합니다.
 * @param {number} low - 하한(포함)
 * @param {number} high - 상한(포함)
 * @param {number} [rolls] - 주면 random2avg 로 분산을 줄입니다
 * @returns {number} 난수
 */
export function randomRange(low, high, rolls) {
    if (rolls === undefined) return low + random2(high - low + 1);
    return low + random2avg(high - low + 1, rolls);
}

/**
 * 난수 값이 max 이하인지 봅니다. random_factor 가 거짓이면 평균을 돌려줍니다.
 * 화면에 기댓값을 표시할 때 같은 코드를 쓰기 위한 장치입니다.
 * @param {number} x - 상한
 * @param {boolean} randomFactor - 굴릴지 여부
 * @returns {number} 굴린 값 또는 평균
 */
export function maybeRandom2(x, randomFactor) {
    if (x <= 1) return 0;
    return randomFactor ? random2(x) : Math.trunc(x / 2);
}

/**
 * 스킬이 명중에 기여하는 양을 구할 때 쓰는 도우미.
 *
 * random2(nom + denom) / denom 입니다. random2(nom) / denom 이 아닙니다.
 * 분모를 더하고 나누기 때문에 결과가 [0, ceil(nom/denom)] 이 되며,
 * 이 한 칸 차이가 스킬 27 에서 명중 1 의 차이를 만듭니다.
 * @param {number} nom - 분자
 * @param {number} denom - 분모
 * @param {boolean} randomFactor - 굴릴지 여부
 * @returns {number} 기여량
 */
export function maybeRandom2Div(nom, denom, randomFactor) {
    if (nom <= 0) return 0;
    if (randomFactor) return Math.trunc(random2(nom + denom) / denom);
    return Math.trunc(Math.trunc(nom / 2) / denom);
}

/**
 * 확률 x/y 로 참.
 * @param {number} x - 분자
 * @param {number} y - 분모
 * @returns {boolean} 성공 여부
 */
export function xChanceInY(x, y) {
    if (x <= 0) return false;
    if (x >= y) return true;
    return random2(y) < x;
}

/**
 * 1/a 확률로 참.
 * @param {number} a - 분모
 * @returns {boolean} 성공 여부
 */
export function oneChanceIn(a) {
    return random2(a) === 0;
}

/**
 * 동전 던지기.
 * @returns {boolean} 앞면이면 true
 */
export function coinflip() {
    return random2(2) === 1;
}

/**
 * n 번 시도해서 한 번이라도 성공했는지 봅니다.
 *
 * 이름과 달리 베르누이 시행 하나가 아닙니다. 시행 횟수가 소수여도 됩니다.
 * @param {number} nTrials - 시도 횟수(소수 가능)
 * @param {number} trialProb - 한 번의 성공 확률
 * @returns {boolean} 한 번이라도 성공했으면 true
 */
export function bernoulli(nTrials, trialProb) {
    if (nTrials <= 0 || trialProb <= 0) return false;
    return source() < 1 - Math.pow(1 - trialProb, nTrials);
}

/**
 * n 번 시행 중 성공 횟수.
 * @param {number} nTrials - 시행 횟수
 * @param {number} trialProb - 성공 확률의 분자
 * @param {number} [scale] - 성공 확률의 분모
 * @returns {number} 성공 횟수
 */
export function binomial(nTrials, trialProb, scale = 100) {
    let count = 0;
    for (let i = 0; i < nTrials; i++) if (xChanceInY(trialProb, scale)) count++;
    return count;
}

/**
 * 피해를 한 점씩 독립적으로 굴려 AC 로 막습니다. (fight.cc:963)
 *
 * AC 한 점마다 1/81 확률로 피해 한 점을 막습니다. 규모에 무관해서,
 * 같은 총량을 잘게 나눠 때려도 기댓값이 달라지지 않습니다.
 * 일반 AC 감산이 '작은 피해 여러 번'에 지나치게 강한 것과 대비됩니다.
 * @param {number} dam - 들어온 피해
 * @param {number} ac - 방어도
 * @returns {number} 통과한 피해
 */
export function applyChunkedAC(dam, ac) {
    const survive = Math.pow(80 / 81, ac);
    let hurt = 0;
    for (let i = 0; i < dam; i++) if (source() < survive) hurt++;
    return hurt;
}

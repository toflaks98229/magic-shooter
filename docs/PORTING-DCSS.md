# DCSS 이식 가이드라인

이 문서는 Dungeon Crawl Stone Soup 의 시스템을 이 프로젝트로 옮기는 작업의 기준입니다.
각 단계는 순서대로 실행하며, 앞 단계가 끝나기 전에 뒤 단계를 시작하지 않습니다.

## 출처

| 무엇 | 어디 |
|---|---|
| 몬스터 683종 · 종족 48종 · 직업 26종 | `crawl-ref/source/dat/mons·species·jobs/*.yaml` |
| 전투·성장 공식 | `crawl-ref/source/*.cc` (C++) |
| 맵과 볼트 | `Data/stone_soup-tiles-0.34/dat/des/*.des` |
| 스킬 적성표 | `Data/stone_soup-tiles-0.34/docs/aptitudes.txt` |
| 타일 | `Data/tiles/*.png` (이미 이식됨) |

라이선스는 GPL-2.0-or-later 로 맞췄습니다. `LICENSE` 참조.

## 기본 방침: C 라인 (하이브리드)

FPS 조작감과 DCSS 수치를 나눠 가집니다.

| 무엇 | 어느 쪽을 따르는가 |
|---|---|
| **명중 여부** | FPS. 조준이 결정합니다 |
| **명중 확률 보정** | DCSS. EV 를 명중 확률로 환산해 히트박스 크기에 반영 |
| **피해량** | DCSS 공식 그대로 |
| **AC 감산** | DCSS 공식 그대로 (굴림 포함) |
| **HP · MP · 스킬** | DCSS 공식 그대로 |
| **시간** | DCSS 의 aut 을 실시간에 고정 비율로 매핑 |
| **맵 · 몬스터 · UI** | DCSS 그대로 |

### 왜 명중만 FPS 인가

DCSS 는 명중을 `to-hit 굴림 vs EV` 로 정합니다. 조준이라는 개념이 없습니다.
그것을 그대로 옮기면 마우스가 방향 전환에만 쓰이고, 결과물은 FPS 가 아니라
1인칭 시점의 DCSS 가 됩니다. 그래서 명중만 조준에 맡기고,
DCSS 가 EV 로 표현하던 '맞추기 어려움'은 히트박스 크기로 옮깁니다.

## 시간 매핑 — 모든 것의 기준

DCSS 의 시간 단위는 `aut` 입니다. 10 aut = 1 턴 (`defines.h:149 BASELINE_DELAY`).

```
1 aut = 50ms        →  1 턴 = 0.5초
```

이 상수 하나에서 나머지가 전부 파생됩니다.

- 기본 이동: 10 aut = 0.5초에 한 칸
- 몬스터 `speed: 10` = 플레이어와 같은 속도. `speed: 20` = 두 배
- 몬스터 행동 주기 = `(10 / speed) * 0.5초`
- 가속 = 시간 비용 ×2/3 (행동 속도 1.5배), 감속 = ×3/2
- 무기 공격 주기 = `attack_delay_with()` aut × 50ms

**버리는 것**: 몬스터 에너지 임계값 80 과 `roll_dice(1,10)` 비동기화
(`monster.cc:5413`). 이것은 턴제에서 플레이어가 턴을 세지 못하게 하려는 장치라
실시간에서는 지터만 남습니다. 몬스터별 쿨다운 타이머로 대체합니다.

## 난수 — 가장 먼저, 가장 정확하게

DCSS 공식은 전부 특정 정수 난수 분포에 의존합니다.
`Math.random()` 으로 근사하면 수치는 같아 보여도 밸런스가 달라집니다.
아래를 `random.cc` 와 한 글자도 다르지 않게 옮깁니다.

| 함수 | 의미 | 함정 |
|---|---|---|
| `random2(max)` | `[0, max-1]` 균등 | `max <= 1` 이면 0. `random2(1) === 0` |
| `roll_dice(n, size)` | `[n, n*size]` | 인자가 0 이하면 0 반환 (예외 아님) |
| `div_rand_round(n, d)` | 나머지 확률로 올림 | `Math.trunc` 이지 `Math.floor` 가 아님 |
| `div_round_near(n, d)` | 반올림 | 주 피해 굴림에 쓰임 |
| `random2avg(max, rolls)` | 분산이 작은 `random2` | 첫 굴림만 `random2(max)`, 나머지는 `random2(max+1)`. 고치지 말 것 |
| `maybe_random2_div(n, d, r)` | 스킬→명중 기여 | `random2(n+d)/d` 이지 `random2(n)/d` 가 아님 |
| `random_range(lo, hi)` | 양끝 포함 | |
| `x_chance_in_y(x, y)` | 확률 x/y | `x <= 0` 이면 false |

## 핵심 공식 (출처: file:line)

### AC 감산 — `actor.cc:351-395`

```
saved = random2(1 + AC)              // ac_type::normal
damage = max(0, damage - saved)
```

평균 감산 `AC/2` 의 **뺄셈**입니다. 비율이 아닙니다.
작은 피해 여러 번에는 극도로 강하고 큰 한 방에는 약합니다.

GDR 은 몬스터→플레이어 근접에만 붙는 하한입니다 (`player.cc:6806`).
```
gdr = floor(16 * AC^0.25)                          // 백분율
saved = max(saved, min(gdr * max_damage / 100, div_rand_round(AC, 2)))
```
몬스터에게는 GDR 이 없습니다 (`monster.h:482`).

### 명중 확률 — `attack.cc:1046-1076`

플레이어→몬스터: `P(hit) = (to_land - EV) / to_land`
몬스터→플레이어: EV 가 `random2avg(2*EV, 2)` 로 굴려짐

양쪽 모두 **5% 강제 무작위 구간**이 있습니다 (`MIN_HIT_MISS_PERCENTAGE`).
```
p_final = p_raw * 0.975 + (1 - p_raw) * 0.025
```
즉 어떤 수치에서도 최소 2.5% 는 빗나가고 최소 2.5% 는 맞습니다.

**C 라인 환산**: 위로 `p_hit` 를 구한 뒤, 히트박스 반지름을 `sqrt(p_hit)` 배로
조절합니다(면적 비례). 조준으로 히트박스에 들어온 뒤 `p_hit` 를 한 번 더 굴리는
2단 판정이 원본에 더 가깝습니다.

### 플레이어 근접 피해 — `attack.cc:1008-1041`, `fight.cc:1753-1788`

```
scaled  = base_damage * 100
scaled  = scaled * max(1.0, 75 + 2.5 * STR_또는_DEX) / 100
damage  = div_round_near(random2(scaled + 1), 100)      // 주 굴림
damage  = damage * (2500 + random2(무기스킬*100 + 1)) / 2500
damage  = damage * (3000 + random2(격투스킬*100 + 1)) / 3000
damage  = damage + random2(1 + 무기보정 + slaying)
damage  = apply_ac(damage)
damage  = max(0, damage)
```

장검·단검·원거리는 DEX, 나머지는 STR 을 씁니다 (`fight.cc:1740`).

주 굴림이 `0 ~ 최대치` 균등이라 DCSS 근접 피해는 편차가 매우 큽니다.
FPS 에서 이대로면 손맛이 나쁠 수 있으므로, 평균을 유지한 채
`random2avg` 로 좁히는 것을 검토합니다. **다만 기본은 원본 그대로 둡니다.**

### 몬스터 피해 — `attack.cc:980-1006`

YAML 의 `attacks: [{type: hit, damage: 6}]` 는
```
damage = 1 + random2(6)          // [1, 6]
damage = apply_ac(damage, 6)     // max_damage=6 이라 GDR 이 여기서만 작동
```

### 플레이어 최대 HP — `player.cc:4356-4411`

```
hp  = floor(XL * 11 / 2) + 8
hp += XL * 격투스킬 * 5 / 70 + (격투스킬 * 3 + 1) / 2
hp  = hp * (10 + 종족hp_mod) / 10
```

### 몬스터 HP — `mon-util.cc:2287-2297`

YAML 의 `hp_10x` 는 평균 HP 의 10배입니다.
```
variance = div_rand_round(hp_10x * 33, 100)
hp = div_rand_round(hp_10x - variance + random2avg(variance * 2, 8), 10)
```

### 스킬 비용 — `skills.cc:167-179, 2561-2593`

```
누적 스킬포인트(레벨 L) = 25 * L * (L+1)  + 분기점(9,18,26) 초과분마다 절반씩 추가
스킬포인트 1점의 XP 비용 = cost[skill_cost_level]   // 1 → 265 까지 265배 상승
```

## 단계

각 단계는 독립적으로 커밋하고, 테스트가 통과해야 다음으로 갑니다.

### 1단계 — 난수와 시간의 토대
- `Script/dcss/random.js`: 위 난수 함수 전부
- `Script/dcss/time.js`: aut ↔ ms 변환, 행동 비용
- 테스트: 각 함수의 분포를 통계적으로 검증 (평균·범위·경계값)
- **이후 모든 단계가 여기에 의존하므로 여기서 틀리면 전부 틀립니다**

### 2단계 — 몬스터 데이터 이식
- `tools/import-monsters.js`: 683개 YAML → `Script/data/monsters.json`
- 필드: `name, glyph, hd, hp_10x, ac, ev, will, exp, attacks, flags, size, speed, resists, spells`
- 기존 `Script/monsters.js` 를 이 데이터로 교체
- 테스트: 전 몬스터가 필수 필드를 갖는지, HP 굴림이 문서화된 범위 안인지

### 3단계 — 전투 공식 교체
- `Script/dcss/combat.js`: AC·명중·피해 공식
- EV → 히트박스 환산
- 기존 `attack()` 과 몬스터 근접 피해를 이것으로 교체
- 테스트: 알려진 입력에 대한 확률 분포가 DCSS 계산과 일치하는지

### 4단계 — 종족·직업·스킬
- 48종족 · 26직업 YAML 이식, `docs/aptitudes.txt` 적성표
- 스킬 시스템 (27레벨, 비용 곡선, 훈련 큐)
- HP/MP/EV 공식 교체

### 5단계 — 맵과 볼트
- `.des` 파서, 볼트 배치
- 층 레이아웃을 DCSS 알고리즘으로 교체

### 6단계 — UI
- DCSS 화면 구성 재현

## 지키는 것

이전 시스템을 존중하지 않아도 된다는 지시를 받았지만, 아래는 유지합니다.
이것들은 DCSS 와 무관하게 이 프로젝트가 옳게 해 둔 부분이고,
버리면 이식 작업 자체가 어려워집니다.

- **계층별 상태 소유** (`world` / `runtime` / `assets` / `dom`) — 세이브가 여기 의존
- **고정 타임스텝** (`loop.js`) — aut 매핑이 여기 얹힘
- **`actions.js` 단일 변경 통로**
- **이벤트 버스** — 시뮬레이션과 표현 분리
- **201개 테스트** — 이식 중 회귀를 잡는 유일한 수단

## 검증 원칙

이 저장소에서 반복해서 확인된 것입니다.

1. **테스트를 쓴 뒤 구현을 되돌려 실제로 실패하는지 본다.** 통과만 확인하면
   아무것도 지키지 않는 테스트를 만들게 됩니다.
2. **성능은 같은 세션에서 A/B 로 잰다.** 세션이 다르면 머신 상태가 달라 속습니다.
3. **회귀 스냅샷은 최종 상태만 본다.** 도중에만 나타나는 동작은 따로 테스트해야 합니다.

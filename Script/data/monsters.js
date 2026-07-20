/**
 * @fileoverview DCSS 몬스터 정의를 옮겨 온 표입니다.
 *
 * 이 파일은 손으로 고치지 마십시오. tools 의 이식기가 만들어 냅니다.
 * 출처: Dungeon Crawl Stone Soup 0.34 (GPL-2.0-or-later)
 */

export const MONSTER_DATA = [
 {
  "id": "abomination-large",
  "enumName": "MONS_ABOMINATION_LARGE",
  "name": "large abomination",
  "hd": 11,
  "hp10x": 495,
  "ac": 11,
  "ev": 6,
  "will": 100,
  "exp": 710,
  "attacks": [
   {
    "type": "hit",
    "damage": 32,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "X",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": "abomination_small",
  "species": null,
  "flags": [],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "abomination-small",
  "enumName": "MONS_ABOMINATION_SMALL",
  "name": "small abomination",
  "hd": 6,
  "hp10x": 270,
  "ac": 6,
  "ev": 9,
  "will": 40,
  "exp": 163,
  "attacks": [
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "x",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "acid-blob",
  "enumName": "MONS_ACID_BLOB",
  "name": "acid blob",
  "hd": 18,
  "hp10x": 990,
  "ac": 1,
  "ev": 3,
  "will": 160,
  "exp": 1585,
  "attacks": [
   {
    "type": "hit",
    "damage": 42,
    "flavour": "acid"
   }
  ],
  "speed": 12,
  "glyph": "J",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "eat_doors",
   "see_invis",
   "unblindable",
   "amorphous",
   "acid_splash",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": "acid_spit",
  "uses": null,
  "habitat": null
 },
 {
  "id": "acid-dragon",
  "enumName": "MONS_ACID_DRAGON",
  "name": "acid dragon",
  "hd": 5,
  "hp10x": 275,
  "ac": 5,
  "ev": 10,
  "will": 20,
  "exp": 155,
  "attacks": [
   {
    "type": "bite",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {
   "poison": 1,
   "corr": 1
  },
  "spells": "acid_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "adder",
  "enumName": "MONS_ADDER",
  "name": "adder",
  "hd": 2,
  "hp10x": 110,
  "ac": 1,
  "ev": 15,
  "will": 10,
  "exp": 13,
  "attacks": [
   {
    "type": "bite",
    "damage": 4,
    "flavour": "poison"
   }
  ],
  "speed": 13,
  "glyph": "S",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "snake",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "agnes",
  "enumName": "MONS_AGNES",
  "name": "Agnes",
  "hd": 11,
  "hp10x": 990,
  "ac": 0,
  "ev": 20,
  "will": 100,
  "exp": 1441,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 18,
  "glyph": "i",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "spriggan",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "air-elemental",
  "enumName": "MONS_AIR_ELEMENTAL",
  "name": "air elemental",
  "hd": 6,
  "hp10x": 330,
  "ac": 2,
  "ev": 18,
  "will": "invuln",
  "exp": 219,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 25,
  "glyph": "E",
  "colour": "etc_air",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": "elemental",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "elec": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "air_elemental",
  "uses": null,
  "habitat": null
 },
 {
  "id": "aizul",
  "enumName": "MONS_AIZUL",
  "name": "Aizul",
  "hd": 14,
  "hp10x": 1400,
  "ac": 8,
  "ev": 18,
  "will": 120,
  "exp": 1374,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "S",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "snake",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "guardian_serpent",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "aizul",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "alderking",
  "enumName": "MONS_ALDERKING",
  "name": "alderking",
  "hd": 17,
  "hp10x": 1250,
  "ac": 16,
  "ev": 12,
  "will": 100,
  "exp": 1978,
  "attacks": [
   {
    "type": "hit",
    "damage": 50,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "f",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "plant",
  "intelligence": "human",
  "holiness": [
   "plant"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks"
  ],
  "resists": {
   "poison": 1,
   "fire": -1,
   "torment": 1
  },
  "spells": "alderking",
  "uses": null,
  "habitat": null
 },
 {
  "id": "alligator-snapping-turtle",
  "enumName": "MONS_ALLIGATOR_SNAPPING_TURTLE",
  "name": "alligator snapping turtle",
  "hd": 16,
  "hp10x": 1440,
  "ac": 19,
  "ev": 1,
  "will": 60,
  "exp": 834,
  "attacks": [
   {
    "type": "bite",
    "damage": 50,
    "flavour": "reach"
   }
  ],
  "speed": 8,
  "glyph": "t",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_tailless",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "snapping_turtle",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "alligator",
  "enumName": "MONS_ALLIGATOR",
  "name": "alligator",
  "hd": 12,
  "hp10x": 620,
  "ac": 4,
  "ev": 9,
  "will": 40,
  "exp": 842,
  "attacks": [
   {
    "type": "bite",
    "damage": 27,
    "flavour": "drag"
   },
   {
    "type": "tail_slap",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "l",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "giant_lizard",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "amaemon",
  "enumName": "MONS_AMAEMON",
  "name": "Amaemon",
  "hd": 7,
  "hp10x": 875,
  "ac": 3,
  "ev": 12,
  "will": 60,
  "exp": 767,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 12,
    "flavour": "plain"
   },
   {
    "type": "tail_slap",
    "damage": 8,
    "flavour": "poison"
   }
  ],
  "speed": 10,
  "glyph": "6",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural",
   "demonic"
  ],
  "genus": null,
  "species": "demonspawn",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {
   "torment": 1
  },
  "spells": "amaemon",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "anaconda",
  "enumName": "MONS_ANACONDA",
  "name": "anaconda",
  "hd": 11,
  "hp10x": 605,
  "ac": 4,
  "ev": 16,
  "will": 40,
  "exp": 838,
  "attacks": [
   {
    "type": "constrict",
    "damage": 6,
    "flavour": "crush"
   },
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 18,
  "glyph": "S",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "snake",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "ancestor-battlemage",
  "enumName": "MONS_ANCESTOR_BATTLEMAGE",
  "name": "battlemage",
  "hd": 1,
  "hp10x": 1,
  "ac": 5,
  "ev": 10,
  "will": 0,
  "exp": 1,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "ancestor",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial",
   "fast_regen",
   "no_poly_to",
   "ancestor",
   "no_gen_derived"
  ],
  "resists": {
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "ancestor-hexer",
  "enumName": "MONS_ANCESTOR_HEXER",
  "name": "hexer",
  "hd": 1,
  "hp10x": 1,
  "ac": 5,
  "ev": 10,
  "will": 0,
  "exp": 1,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "ancestor",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial",
   "fast_regen",
   "no_poly_to",
   "ancestor",
   "no_gen_derived"
  ],
  "resists": {
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "ancestor-knight",
  "enumName": "MONS_ANCESTOR_KNIGHT",
  "name": "knight",
  "hd": 1,
  "hp10x": 1,
  "ac": 5,
  "ev": 10,
  "will": 0,
  "exp": 1,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "ancestor",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial",
   "fast_regen",
   "no_poly_to",
   "ancestor",
   "no_gen_derived"
  ],
  "resists": {
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "ancestor",
  "enumName": "MONS_ANCESTOR",
  "name": "ancestor",
  "hd": 1,
  "hp10x": 1,
  "ac": 5,
  "ev": 10,
  "will": 0,
  "exp": 1,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial",
   "fast_regen",
   "no_poly_to",
   "ancestor",
   "no_gen_derived"
  ],
  "resists": {
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "ancient-champion",
  "enumName": "MONS_ANCIENT_CHAMPION",
  "name": "ancient champion",
  "hd": 14,
  "hp10x": 700,
  "ac": 15,
  "ev": 10,
  "will": 120,
  "exp": 1518,
  "attacks": [
   {
    "type": "hit",
    "damage": 32,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "z",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fighter"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "ancient_champion",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "ancient-lich",
  "enumName": "MONS_ANCIENT_LICH",
  "name": "ancient lich",
  "hd": 27,
  "hp10x": 1080,
  "ac": 20,
  "ev": 10,
  "will": "invuln",
  "exp": 4693,
  "attacks": [
   {
    "type": "touch",
    "damage": 20,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "L",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "lich",
  "flags": [
   "see_invis",
   "speaks"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "ancient_lich",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "ancient-zyme",
  "enumName": "MONS_ANCIENT_ZYME",
  "name": "ancient zyme",
  "hd": 8,
  "hp10x": 520,
  "ac": 6,
  "ev": 6,
  "will": 60,
  "exp": 324,
  "attacks": [
   {
    "type": "hit",
    "damage": 16,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 16,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "x",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "angel",
  "enumName": "MONS_ANGEL",
  "name": "angel",
  "hd": 12,
  "hp10x": 1020,
  "ac": 10,
  "ev": 20,
  "will": 120,
  "exp": 1155,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "A",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "holy"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "speaks"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "neg": 3
  },
  "spells": "angel",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "animated-tree",
  "enumName": "MONS_ANIMATED_TREE",
  "name": "animated tree",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "7",
  "colour": "etc_tree",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "antaeus",
  "enumName": "MONS_ANTAEUS",
  "name": "Antaeus",
  "hd": 22,
  "hp10x": 6820,
  "ac": 28,
  "ev": 4,
  "will": "invuln",
  "exp": 8877,
  "attacks": [
   {
    "type": "hit",
    "damage": 75,
    "flavour": "cold"
   },
   {
    "type": "hit",
    "damage": 30,
    "flavour": "cold"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "giant",
  "species": "titan",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "male",
   "tall_tile"
  ],
  "resists": {
   "elec": 3,
   "fire": -1,
   "cold": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "antaeus",
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "antique-champion",
  "enumName": "MONS_ANTIQUE_CHAMPION",
  "name": "antique champion",
  "hd": 20,
  "hp10x": 820,
  "ac": 18,
  "ev": 14,
  "will": 120,
  "exp": 1518,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "z",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "ancient_champion",
  "flags": [
   "fighter",
   "see_invis"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "antique_champion",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "apis",
  "enumName": "MONS_APIS",
  "name": "apis",
  "hd": 16,
  "hp10x": 960,
  "ac": 9,
  "ev": 5,
  "will": 100,
  "exp": 1042,
  "attacks": [
   {
    "type": "gore",
    "damage": 44,
    "flavour": "holy"
   }
  ],
  "speed": 10,
  "glyph": "Y",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "holy"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood",
   "has_aura"
  ],
  "resists": {
   "neg": 3
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "apocalypse-crab",
  "enumName": "MONS_APOCALYPSE_CRAB",
  "name": "apocalypse crab",
  "hd": 8,
  "hp10x": 480,
  "ac": 11,
  "ev": 5,
  "will": 60,
  "exp": 454,
  "attacks": [
   {
    "type": "bite",
    "damage": 14,
    "flavour": "chaotic"
   },
   {
    "type": "claw",
    "damage": 14,
    "flavour": "chaotic"
   }
  ],
  "speed": 10,
  "glyph": "t",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "demonic"
  ],
  "genus": "crab",
  "species": null,
  "flags": [
   "see_invis",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1,
   "fire": 2,
   "cold": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "apocalypse_crab",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "arachne",
  "enumName": "MONS_ARACHNE",
  "name": "Arachne",
  "hd": 23,
  "hp10x": 2040,
  "ac": 9,
  "ev": 12,
  "will": 80,
  "exp": 3900,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "H",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "arachnid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "spider",
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "web_immune",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "arachne",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "arcanist",
  "enumName": "MONS_ARCANIST",
  "name": "arcanist",
  "hd": 11,
  "hp10x": 460,
  "ac": 0,
  "ev": 15,
  "will": 60,
  "exp": 695,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "arcanist",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "armataur",
  "enumName": "MONS_ARMATAUR",
  "name": "armataur",
  "hd": 8,
  "hp10x": 450,
  "ac": 15,
  "ev": 5,
  "will": 10,
  "exp": 400,
  "attacks": [
   {
    "type": "hit",
    "damage": 18,
    "flavour": "plain"
   },
   {
    "type": "tail_slap",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "H",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "armour-echo",
  "enumName": "MONS_ARMOUR_ECHO",
  "name": "armour echo",
  "hd": 15,
  "hp10x": 350,
  "ac": 8,
  "ev": 5,
  "will": "invuln",
  "exp": 800,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "[",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "unblindable"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "asmodeus",
  "enumName": "MONS_ASMODEUS",
  "name": "Asmodeus",
  "hd": 17,
  "hp10x": 4505,
  "ac": 30,
  "ev": 7,
  "will": "invuln",
  "exp": 8018,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "&",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "hell_lord",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks",
   "unique",
   "male",
   "tall_tile",
   "fire_ring"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 3,
   "damnation": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "asmodeus",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "aspiring-flesh",
  "enumName": "MONS_ASPIRING_FLESH",
  "name": "aspiring flesh",
  "hd": 12,
  "hp10x": 1330,
  "ac": 2,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "*",
  "colour": "etc_random",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "fast_regen",
   "no_skeleton",
   "no_exp_gain",
   "no_poly_to",
   "no_zombie",
   "no_gen_derived"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "asterion",
  "enumName": "MONS_ASTERION",
  "name": "Asterion",
  "hd": 15,
  "hp10x": 1275,
  "ac": 4,
  "ev": 4,
  "will": 100,
  "exp": 1701,
  "attacks": [
   {
    "type": "hit",
    "damage": 35,
    "flavour": "plain"
   },
   {
    "type": "gore",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "H",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "minotaur",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "asterion",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "azrael",
  "enumName": "MONS_AZRAEL",
  "name": "Azrael",
  "hd": 11,
  "hp10x": 880,
  "ac": 10,
  "ev": 5,
  "will": 40,
  "exp": 988,
  "attacks": [
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": "efreet",
  "flags": [
   "flies",
   "speaks",
   "unique",
   "male"
  ],
  "resists": {
   "poison": 1,
   "fire": 3,
   "cold": -1,
   "damnation": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "azrael",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "azure-jelly",
  "enumName": "MONS_AZURE_JELLY",
  "name": "azure jelly",
  "hd": 15,
  "hp10x": 825,
  "ac": 5,
  "ev": 10,
  "will": 80,
  "exp": 1317,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "cold"
   },
   {
    "type": "hit",
    "damage": 12,
    "flavour": "cold"
   },
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "J",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "eat_doors",
   "see_invis",
   "unblindable",
   "amorphous",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "fire": -1,
   "cold": 1,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "bai-suzhen-dragon",
  "enumName": "MONS_BAI_SUZHEN_DRAGON",
  "name": "Bai Suzhen",
  "hd": 20,
  "hp10x": 2050,
  "ac": 22,
  "ev": 4,
  "will": 100,
  "exp": 3094,
  "attacks": [
   {
    "type": "bite",
    "damage": 30,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 16,
    "flavour": "plain"
   },
   {
    "type": "trample",
    "damage": 16,
    "flavour": "trample"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "etc_electricity",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "snake",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": "storm_dragon",
  "flags": [
   "flies",
   "see_invis",
   "speaks",
   "cold_blood",
   "unique",
   "female",
   "thunder_ring"
  ],
  "resists": {
   "elec": 3,
   "poison": 1,
   "cold": 1
  },
  "spells": "bai_suzhen_dragon",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "bai-suzhen",
  "enumName": "MONS_BAI_SUZHEN",
  "name": "Bai Suzhen",
  "hd": 20,
  "hp10x": 2050,
  "ac": 14,
  "ev": 8,
  "will": 100,
  "exp": 3094,
  "attacks": [
   {
    "type": "hit",
    "damage": 24,
    "flavour": "plain"
   },
   {
    "type": "tail_slap",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": "storm_dragon",
  "flags": [
   "see_invis",
   "speaks",
   "cold_blood",
   "unique",
   "female"
  ],
  "resists": {
   "elec": 3,
   "poison": 1,
   "cold": 1
  },
  "spells": "bai_suzhen",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "ball-lightning",
  "enumName": "MONS_BALL_LIGHTNING",
  "name": "ball lightning",
  "hd": 1,
  "hp10x": 10,
  "ac": 0,
  "ev": 10,
  "will": "invuln",
  "exp": 0,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 20,
  "glyph": "*",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "no_exp_gain",
   "peripheral",
   "unstable"
  ],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "ball-python",
  "enumName": "MONS_BALL_PYTHON",
  "name": "ball python",
  "hd": 1,
  "hp10x": 35,
  "ac": 0,
  "ev": 9,
  "will": 0,
  "exp": 1,
  "attacks": [
   {
    "type": "bite",
    "damage": 2,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 1,
    "flavour": "crush"
   }
  ],
  "speed": 12,
  "glyph": "S",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "snake",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "ballistomycete-spore",
  "enumName": "MONS_BALLISTOMYCETE_SPORE",
  "name": "ballistomycete spore",
  "hd": 1,
  "hp10x": 10,
  "ac": 0,
  "ev": 10,
  "will": "invuln",
  "exp": 0,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "*",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "fungus",
  "species": null,
  "flags": [
   "flies",
   "no_exp_gain",
   "unstable",
   "peripheral"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "ballistomycete",
  "enumName": "MONS_BALLISTOMYCETE",
  "name": "ballistomycete",
  "hd": 4,
  "hp10x": 260,
  "ac": 1,
  "ev": 0,
  "will": "invuln",
  "exp": 10,
  "attacks": [],
  "speed": 10,
  "glyph": "P",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "fungus",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "fungus",
  "species": null,
  "flags": [
   "stationary"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": "ballistomycete",
  "uses": null,
  "habitat": null
 },
 {
  "id": "balrug",
  "enumName": "MONS_BALRUG",
  "name": "balrug",
  "hd": 14,
  "hp10x": 770,
  "ac": 5,
  "ev": 12,
  "will": 160,
  "exp": 1202,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "fire"
   }
  ],
  "speed": 12,
  "glyph": "2",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis"
  ],
  "resists": {
   "poison": 1,
   "fire": 3,
   "cold": -1,
   "neg": 3,
   "torment": 1
  },
  "spells": "balrug",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "barachi",
  "enumName": "MONS_BARACHI",
  "name": "barachi",
  "hd": 3,
  "hp10x": 180,
  "ac": 0,
  "ev": 10,
  "will": 10,
  "exp": 39,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "F",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "frog",
  "species": null,
  "flags": [
   "speaks",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "basilisk",
  "enumName": "MONS_BASILISK",
  "name": "basilisk",
  "hd": 6,
  "hp10x": 360,
  "ac": 3,
  "ev": 12,
  "will": 20,
  "exp": 192,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "l",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "giant_lizard",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": "basilisk",
  "uses": null,
  "habitat": null
 },
 {
  "id": "bat",
  "enumName": "MONS_BAT",
  "name": "bat",
  "hd": 1,
  "hp10x": 35,
  "ac": 1,
  "ev": 14,
  "will": 0,
  "exp": 1,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 30,
  "glyph": "b",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "bat",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "unblindable",
   "batty",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "battlesphere",
  "enumName": "MONS_BATTLESPHERE",
  "name": "battlesphere",
  "hd": 5,
  "hp10x": 150,
  "ac": 0,
  "ev": 5,
  "will": "invuln",
  "exp": 140,
  "attacks": [],
  "speed": 30,
  "glyph": "*",
  "colour": "etc_magic",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "unblindable",
   "insubstantial",
   "no_poly_to",
   "maintain_range",
   "avatar"
  ],
  "resists": {
   "elec": 3,
   "fire": 2,
   "cold": 2,
   "corr": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "bear",
  "enumName": "MONS_BEAR",
  "name": "bear",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "h",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "bennu",
  "enumName": "MONS_BENNU",
  "name": "bennu",
  "hd": 14,
  "hp10x": 770,
  "ac": 6,
  "ev": 16,
  "will": 140,
  "exp": 1011,
  "attacks": [
   {
    "type": "peck",
    "damage": 46,
    "flavour": "holy"
   },
   {
    "type": "claw",
    "damage": 36,
    "flavour": "plain"
   }
  ],
  "speed": 16,
  "glyph": "b",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "bird",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "speaks",
   "warm_blood",
   "no_poly_to"
  ],
  "resists": {
   "poison": 1,
   "fire": 3,
   "neg": 3,
   "miasma": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "bes_kemwar",
  "enumName": "MONS_BES_KEMWAR",
  "name": "bes kemwar",
  "hd": 4,
  "hp10x": 260,
  "ac": 5,
  "ev": 10,
  "will": 10,
  "exp": 65,
  "attacks": [
   {
    "type": "bite",
    "damage": 8,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "W",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "bes_kemwar",
  "uses": null,
  "habitat": null
 },
 {
  "id": "black-bear",
  "enumName": "MONS_BLACK_BEAR",
  "name": "black bear",
  "hd": 6,
  "hp10x": 270,
  "ac": 2,
  "ev": 8,
  "will": 20,
  "exp": 128,
  "attacks": [
   {
    "type": "bite",
    "damage": 9,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 5,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "h",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped_tailless",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "bear",
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {},
  "spells": "bear",
  "uses": null,
  "habitat": null
 },
 {
  "id": "black-draconian",
  "enumName": "MONS_BLACK_DRACONIAN",
  "name": "black draconian",
  "hd": 14,
  "hp10x": 980,
  "ac": 9,
  "ev": 10,
  "will": 40,
  "exp": 1019,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "draconian",
  "species": null,
  "flags": [
   "flies",
   "speaks",
   "cold_blood"
  ],
  "resists": {
   "elec": 3
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "black-mamba",
  "enumName": "MONS_BLACK_MAMBA",
  "name": "black mamba",
  "hd": 7,
  "hp10x": 385,
  "ac": 4,
  "ev": 15,
  "will": 20,
  "exp": 456,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "poison"
   }
  ],
  "speed": 18,
  "glyph": "S",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "snake",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "blazeheart-core",
  "enumName": "MONS_BLAZEHEART_CORE",
  "name": "blazeheart core",
  "hd": 15,
  "hp10x": 50000,
  "ac": 0,
  "ev": 99,
  "will": 10,
  "exp": 0,
  "attacks": [],
  "speed": 50,
  "glyph": "*",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "insubstantial",
   "stationary",
   "no_exp_gain",
   "unstable",
   "peripheral"
  ],
  "resists": {
   "fire": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "blazeheart-golem",
  "enumName": "MONS_BLAZEHEART_GOLEM",
  "name": "blazeheart golem",
  "hd": 6,
  "hp10x": 400,
  "ac": 9,
  "ev": 2,
  "will": "invuln",
  "exp": 140,
  "attacks": [
   {
    "type": "punch",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "9",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "fighter"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "blink-frog",
  "enumName": "MONS_BLINK_FROG",
  "name": "blink frog",
  "hd": 6,
  "hp10x": 330,
  "ac": 0,
  "ev": 16,
  "will": 40,
  "exp": 264,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "blink"
   }
  ],
  "speed": 14,
  "glyph": "F",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped_tailless",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "frog",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": "blinker",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "blizzard-demon",
  "enumName": "MONS_BLIZZARD_DEMON",
  "name": "blizzard demon",
  "hd": 12,
  "hp10x": 660,
  "ac": 10,
  "ev": 10,
  "will": 140,
  "exp": 935,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "2",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "see_invis"
  ],
  "resists": {
   "elec": 3,
   "poison": 1,
   "fire": -1,
   "cold": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "blizzard_demon",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "bloated-husk",
  "enumName": "MONS_BLOATED_HUSK",
  "name": "bloated husk",
  "hd": 8,
  "hp10x": 250,
  "ac": 5,
  "ev": 5,
  "will": 40,
  "exp": 299,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "n",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "ghoul",
  "species": null,
  "flags": [
   "no_zombie"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": "amphibious"
 },
 {
  "id": "block-of-ice",
  "enumName": "MONS_BLOCK_OF_ICE",
  "name": "block of ice",
  "hd": 3,
  "hp10x": 285,
  "ac": 15,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "etc_ice",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "remnant",
   "no_threat"
  ],
  "resists": {
   "fire": -1,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": "amphibious"
 },
 {
  "id": "blorkula-the-orcula",
  "enumName": "MONS_BLORKULA_THE_ORCULA",
  "name": "Blorkula the orcula",
  "hd": 5,
  "hp10x": 315,
  "ac": 0,
  "ev": 9,
  "will": 20,
  "exp": 224,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "plain"
   },
   {
    "type": "bite",
    "damage": 6,
    "flavour": "vampiric"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "speaks",
   "see_invis",
   "warm_blood",
   "unique",
   "male",
   "no_zombie"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "blorkula",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "bog-body",
  "enumName": "MONS_BOG_BODY",
  "name": "bog body",
  "hd": 10,
  "hp10x": 390,
  "ac": 1,
  "ev": 9,
  "will": 40,
  "exp": 684,
  "attacks": [
   {
    "type": "touch",
    "damage": 20,
    "flavour": "cold"
   }
  ],
  "speed": 10,
  "glyph": "n",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "ghoul",
  "species": null,
  "flags": [
   "no_zombie"
  ],
  "resists": {
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "bog_body",
  "uses": "open_doors",
  "habitat": "amphibious"
 },
 {
  "id": "boggart",
  "enumName": "MONS_BOGGART",
  "name": "boggart",
  "hd": 4,
  "hp10x": 200,
  "ac": 0,
  "ev": 12,
  "will": 40,
  "exp": 117,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "g",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "warm_blood"
  ],
  "resists": {},
  "spells": "boggart",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "bombardier-beetle",
  "enumName": "MONS_BOMBARDIER_BEETLE",
  "name": "bombardier beetle",
  "hd": 2,
  "hp10x": 170,
  "ac": 4,
  "ev": 7,
  "will": 20,
  "exp": 46,
  "attacks": [
   {
    "type": "bite",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 6,
  "glyph": "B",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "insect",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": "bombardier_beetle",
  "uses": null,
  "habitat": null
 },
 {
  "id": "bomblet",
  "enumName": "MONS_BOMBLET",
  "name": "bomblet",
  "hd": 10,
  "hp10x": 150,
  "ac": 5,
  "ev": 17,
  "will": "invuln",
  "exp": 40,
  "attacks": [],
  "speed": 10,
  "glyph": "*",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "peripheral"
  ],
  "resists": {
   "fire": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "bone-dragon",
  "enumName": "MONS_BONE_DRAGON",
  "name": "bone dragon",
  "hd": 20,
  "hp10x": 1540,
  "ac": 18,
  "ev": 2,
  "will": 100,
  "exp": 2215,
  "attacks": [
   {
    "type": "bite",
    "damage": 30,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "trample",
    "damage": 20,
    "flavour": "trample"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "undead"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "see_invis"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "bone_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "boris",
  "enumName": "MONS_BORIS",
  "name": "Boris",
  "hd": 22,
  "hp10x": 1540,
  "ac": 12,
  "ev": 10,
  "will": "invuln",
  "exp": 1696,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "touch",
    "damage": 15,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "L",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "lich",
  "flags": [
   "see_invis",
   "speaks",
   "unique",
   "male"
  ],
  "resists": {
   "elec": 1,
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "boris",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "boulder-beetle",
  "enumName": "MONS_BOULDER_BEETLE",
  "name": "boulder beetle",
  "hd": 12,
  "hp10x": 765,
  "ac": 20,
  "ev": 2,
  "will": 40,
  "exp": 828,
  "attacks": [
   {
    "type": "bite",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "B",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "insect",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": "boulder_beetle",
  "uses": null,
  "habitat": null
 },
 {
  "id": "boulder",
  "enumName": "MONS_BOULDER",
  "name": "boulder",
  "hd": 10,
  "hp10x": 270,
  "ac": 10,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 20,
  "glyph": "*",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_exp_gain",
   "no_poly_to",
   "peripheral",
   "unstable"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "bound-soul",
  "enumName": "MONS_BOUND_SOUL",
  "name": "bound soul",
  "hd": 8,
  "hp10x": 440,
  "ac": 8,
  "ev": 5,
  "will": "invuln",
  "exp": 10,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 7,
  "glyph": "Z",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": "wraith",
  "species": "spectral_thing",
  "flags": [
   "flies",
   "see_invis",
   "insubstantial",
   "fast_regen"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "boundless-tesseract",
  "enumName": "MONS_BOUNDLESS_TESSERACT",
  "name": "boundless tesseract",
  "hd": 30,
  "hp10x": 2100,
  "ac": 10,
  "ev": 1,
  "will": "invuln",
  "exp": 9999,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "etc_orb_glow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "stationary",
   "insubstantial",
   "fast_regen"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "boundless_tesseract",
  "uses": null,
  "habitat": null
 },
 {
  "id": "brain-worm",
  "enumName": "MONS_BRAIN_WORM",
  "name": "brain worm",
  "hd": 5,
  "hp10x": 200,
  "ac": 1,
  "ev": 5,
  "will": 20,
  "exp": 92,
  "attacks": [
   {
    "type": "bite",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "w",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "snake",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "ribbon_worm",
  "species": null,
  "flags": [
   "fast_regen",
   "no_skeleton"
  ],
  "resists": {},
  "spells": "brain_worm",
  "uses": null,
  "habitat": null
 },
 {
  "id": "briar-patch",
  "enumName": "MONS_BRIAR_PATCH",
  "name": "briar patch",
  "hd": 10,
  "hp10x": 150,
  "ac": 10,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 0,
  "glyph": "P",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "plant",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "spiny",
   "no_threat"
  ],
  "resists": {
   "poison": 1,
   "fire": -1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "brimstone-fiend",
  "enumName": "MONS_BRIMSTONE_FIEND",
  "name": "Brimstone Fiend",
  "hd": 18,
  "hp10x": 990,
  "ac": 15,
  "ev": 6,
  "will": "invuln",
  "exp": 2027,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "1",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis"
  ],
  "resists": {
   "poison": 1,
   "fire": 3,
   "cold": -1,
   "damnation": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "brimstone_fiend",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "broodmother",
  "enumName": "MONS_BROODMOTHER",
  "name": "broodmother",
  "hd": 12,
  "hp10x": 1400,
  "ac": 2,
  "ev": 4,
  "will": 60,
  "exp": 1104,
  "attacks": [
   {
    "type": "bite",
    "damage": 40,
    "flavour": "spider"
   }
  ],
  "speed": 12,
  "glyph": "s",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "arachnid",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "spider",
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {},
  "spells": "broodmother",
  "uses": null,
  "habitat": null
 },
 {
  "id": "bullfrog",
  "enumName": "MONS_BULLFROG",
  "name": "bullfrog",
  "hd": 4,
  "hp10x": 220,
  "ac": 0,
  "ev": 12,
  "will": 20,
  "exp": 90,
  "attacks": [
   {
    "type": "hit",
    "damage": 9,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "F",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped_tailless",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "frog",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "bunyip",
  "enumName": "MONS_BUNYIP",
  "name": "bunyip",
  "hd": 12,
  "hp10x": 800,
  "ac": 6,
  "ev": 10,
  "will": 60,
  "exp": 992,
  "attacks": [
   {
    "type": "claw",
    "damage": 40,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 40,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "x",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "bunyip",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "burial-acolyte",
  "enumName": "MONS_BURIAL_ACOLYTE",
  "name": "burial acolyte",
  "hd": 4,
  "hp10x": 190,
  "ac": 0,
  "ev": 13,
  "will": 20,
  "exp": 72,
  "attacks": [
   {
    "type": "hit",
    "damage": 4,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "burial_acolyte",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "burstshroom",
  "enumName": "MONS_BURSTSHROOM",
  "name": "burstshroom",
  "hd": 1,
  "hp10x": 52,
  "ac": 1,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "P",
  "colour": "etc_earth",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "fungus",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "fungus",
  "species": null,
  "flags": [
   "stationary",
   "peripheral",
   "no_exp_gain"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "bush",
  "enumName": "MONS_BUSH",
  "name": "bush",
  "hd": 20,
  "hp10x": 1100,
  "ac": 15,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 0,
  "glyph": "P",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "plant",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "poison": 1,
   "fire": -1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "butterfly",
  "enumName": "MONS_BUTTERFLY",
  "name": "butterfly",
  "hd": 1,
  "hp10x": 10,
  "ac": 0,
  "ev": 20,
  "will": 0,
  "exp": 0,
  "attacks": [],
  "speed": 25,
  "glyph": "b",
  "colour": "etc_jewel",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "insect_winged",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "confused",
   "no_skeleton",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "poison": -1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "cacodemon",
  "enumName": "MONS_CACODEMON",
  "name": "cacodemon",
  "hd": 13,
  "hp10x": 975,
  "ac": 11,
  "ev": 10,
  "will": 160,
  "exp": 1139,
  "attacks": [
   {
    "type": "hit",
    "damage": 22,
    "flavour": "vuln"
   },
   {
    "type": "hit",
    "damage": 22,
    "flavour": "vuln"
   }
  ],
  "speed": 10,
  "glyph": "2",
  "colour": "yellow",
  "spriteKey": "enemy_cacodemon",
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "cacodemon",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "cactus-giant",
  "enumName": "MONS_CACTUS_GIANT",
  "name": "cactus giant",
  "hd": 9,
  "hp10x": 495,
  "ac": 1,
  "ev": 2,
  "will": 60,
  "exp": 600,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "plant"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "spiny",
   "no_poly_to"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "cane-toad",
  "enumName": "MONS_CANE_TOAD",
  "name": "cane toad",
  "hd": 7,
  "hp10x": 385,
  "ac": 6,
  "ev": 9,
  "will": 20,
  "exp": 407,
  "attacks": [
   {
    "type": "sting",
    "damage": 26,
    "flavour": "poison"
   }
  ],
  "speed": 12,
  "glyph": "F",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped_tailless",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "frog",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "cassandra",
  "enumName": "MONS_CASSANDRA",
  "name": "Cassandra",
  "hd": 7,
  "hp10x": 430,
  "ac": 0,
  "ev": 11,
  "will": 60,
  "exp": 350,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "see_invis",
   "warm_blood",
   "unique",
   "female",
   "priest"
  ],
  "resists": {},
  "spells": "cassandra",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "catoblepas",
  "enumName": "MONS_CATOBLEPAS",
  "name": "catoblepas",
  "hd": 14,
  "hp10x": 770,
  "ac": 10,
  "ev": 2,
  "will": 100,
  "exp": 843,
  "attacks": [
   {
    "type": "gore",
    "damage": 36,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Y",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "yak",
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {
   "petrify": 1
  },
  "spells": "catoblepas",
  "uses": null,
  "habitat": null
 },
 {
  "id": "caustic-shrike",
  "enumName": "MONS_CAUSTIC_SHRIKE",
  "name": "caustic shrike",
  "hd": 18,
  "hp10x": 1080,
  "ac": 8,
  "ev": 18,
  "will": 80,
  "exp": 2676,
  "attacks": [
   {
    "type": "claw",
    "damage": 36,
    "flavour": "acid"
   }
  ],
  "speed": 20,
  "glyph": "b",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "bird",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {
   "fire": 1,
   "cold": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "caustic-sporangium",
  "enumName": "MONS_CAUSTIC_SPORANGIUM",
  "name": "caustic sporangium",
  "hd": 1,
  "hp10x": 300,
  "ac": 0,
  "ev": 10,
  "will": "invuln",
  "exp": 0,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "*",
  "colour": "etc_gold",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "no_exp_gain",
   "peripheral"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "centaur-warrior",
  "enumName": "MONS_CENTAUR_WARRIOR",
  "name": "centaur warrior",
  "hd": 10,
  "hp10x": 550,
  "ac": 4,
  "ev": 8,
  "will": 40,
  "exp": 836,
  "attacks": [
   {
    "type": "hit",
    "damage": 16,
    "flavour": "plain"
   },
   {
    "type": "kick",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "c",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "centaur",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "centaur",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "archer"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "centaur",
  "enumName": "MONS_CENTAUR",
  "name": "centaur",
  "hd": 4,
  "hp10x": 220,
  "ac": 3,
  "ev": 7,
  "will": 20,
  "exp": 112,
  "attacks": [
   {
    "type": "hit",
    "damage": 7,
    "flavour": "plain"
   },
   {
    "type": "kick",
    "damage": 3,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "c",
  "colour": "brown",
  "spriteKey": "enemy_centaur",
  "sizePixels": 26,
  "size": "large",
  "shape": "centaur",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "archer"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "cerebov",
  "enumName": "MONS_CEREBOV",
  "name": "Cerebov",
  "hd": 21,
  "hp10x": 6510,
  "ac": 30,
  "ev": 8,
  "will": "invuln",
  "exp": 9999,
  "attacks": [
   {
    "type": "hit",
    "damage": 60,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "&",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "pandemonium_lord",
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "unique",
   "tall_tile",
   "gender_neutral"
  ],
  "resists": {
   "poison": 1,
   "fire": 3,
   "damnation": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "cerebov",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "cerulean-imp",
  "enumName": "MONS_CERULEAN_IMP",
  "name": "cerulean imp",
  "hd": 3,
  "hp10x": 135,
  "ac": 3,
  "ev": 14,
  "will": 40,
  "exp": 13,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "5",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "speaks"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "chaos-spawn",
  "enumName": "MONS_CHAOS_SPAWN",
  "name": "chaos spawn",
  "hd": 6,
  "hp10x": 300,
  "ac": 4,
  "ev": 12,
  "will": 60,
  "exp": 172,
  "attacks": [
   {
    "type": "random",
    "damage": 19,
    "flavour": "chaotic"
   }
  ],
  "speed": 10,
  "glyph": "4",
  "colour": "etc_random",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "cherub",
  "enumName": "MONS_CHERUB",
  "name": "cherub",
  "hd": 9,
  "hp10x": 765,
  "ac": 10,
  "ev": 20,
  "will": 100,
  "exp": 742,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "cherub",
    "damage": 8,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "A",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "holy"
  ],
  "genus": "angel",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "speaks",
   "archer"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 1,
   "neg": 3
  },
  "spells": "battlecry",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "chonchon",
  "enumName": "MONS_CHONCHON",
  "name": "chonchon",
  "hd": 14,
  "hp10x": 630,
  "ac": 6,
  "ev": 16,
  "will": 60,
  "exp": 1250,
  "attacks": [
   {
    "type": "headbutt",
    "damage": 32,
    "flavour": "chaotic"
   },
   {
    "type": "bite",
    "damage": 28,
    "flavour": "vampiric"
   }
  ],
  "speed": 20,
  "glyph": "x",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "batty",
   "warm_blood",
   "no_poly_to"
  ],
  "resists": {},
  "spells": "chonchon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "chuck",
  "enumName": "MONS_CHUCK",
  "name": "Chuck",
  "hd": 18,
  "hp10x": 1170,
  "ac": 14,
  "ev": 2,
  "will": 100,
  "exp": 1460,
  "attacks": [
   {
    "type": "hit",
    "damage": 45,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": "stone_giant",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "clockroach",
  "enumName": "MONS_CLOCKROACH",
  "name": "clockroach",
  "hd": 1,
  "hp10x": 110,
  "ac": 3,
  "ev": 10,
  "will": 20,
  "exp": 37,
  "attacks": [
   {
    "type": "bite",
    "damage": 4,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "B",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "insect",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warded",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": "clockroach",
  "uses": null,
  "habitat": null
 },
 {
  "id": "clockwork-bee-inactive",
  "enumName": "MONS_CLOCKWORK_BEE_INACTIVE",
  "name": "dormant clockwork bee",
  "hd": 5,
  "hp10x": 260,
  "ac": 13,
  "ev": 0,
  "will": "invuln",
  "exp": 10,
  "attacks": [],
  "speed": 15,
  "glyph": "*",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "insect_winged",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "killer_bee",
  "species": null,
  "flags": [
   "stationary"
  ],
  "resists": {
   "fire": 1,
   "elec": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "clockwork-bee",
  "enumName": "MONS_CLOCKWORK_BEE",
  "name": "clockwork bee",
  "hd": 5,
  "hp10x": 280,
  "ac": 6,
  "ev": 16,
  "will": "invuln",
  "exp": 80,
  "attacks": [
   {
    "type": "sting",
    "damage": 13,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "y",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "insect_winged",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "killer_bee",
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "fire": 1,
   "elec": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "cloud-mage",
  "enumName": "MONS_CLOUD_MAGE",
  "name": "Cloud Mage",
  "hd": 20,
  "hp10x": 1500,
  "ac": 0,
  "ev": 13,
  "will": 100,
  "exp": 1937,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "etc_silver",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "flies",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "cloud_mage",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "cognitogaunt",
  "enumName": "MONS_COGNITOGAUNT",
  "name": "cognitogaunt",
  "hd": 14,
  "hp10x": 780,
  "ac": 6,
  "ev": 16,
  "will": 80,
  "exp": 963,
  "attacks": [
   {
    "type": "claw",
    "damage": 28,
    "flavour": "confuse"
   },
   {
    "type": "touch",
    "damage": 22,
    "flavour": "pain"
   }
  ],
  "speed": 10,
  "glyph": "n",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "no_zombie",
   "speaks"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "cognitogaunt",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "colossal-amoeba",
  "enumName": "MONS_COLOSSAL_AMOEBA",
  "name": "colossal amoeba",
  "hd": 17,
  "hp10x": 1400,
  "ac": 3,
  "ev": 6,
  "will": 100,
  "exp": 1464,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "swarm"
   },
   {
    "type": "engulf",
    "damage": 23,
    "flavour": "drag"
   }
  ],
  "speed": 13,
  "glyph": "J",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "eat_doors",
   "see_invis",
   "unblindable",
   "fast_regen",
   "amorphous",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "crab",
  "enumName": "MONS_CRAB",
  "name": "crab",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "t",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "crawling-flesh-cage",
  "enumName": "MONS_CRAWLING_FLESH_CAGE",
  "name": "crawling flesh cage",
  "hd": 15,
  "hp10x": 900,
  "ac": 16,
  "ev": 4,
  "will": 60,
  "exp": 755,
  "attacks": [
   {
    "type": "tentacle_slap",
    "damage": 24,
    "flavour": "reach_cleave_ugly"
   }
  ],
  "speed": 10,
  "glyph": "x",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood",
   "herd",
   "no_poly_to",
   "no_skeleton",
   "no_zombie",
   "no_gen_derived"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 1,
   "cold": 1,
   "corr": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "crazy-yiuf",
  "enumName": "MONS_CRAZY_YIUF",
  "name": "Crazy Yiuf",
  "hd": 3,
  "hp10x": 195,
  "ac": 2,
  "ev": 9,
  "will": 10,
  "exp": 41,
  "attacks": [
   {
    "type": "hit",
    "damage": 9,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "j",
  "colour": "colour_undef",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "gnoll",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "creeping-inferno",
  "enumName": "MONS_CREEPING_INFERNO",
  "name": "creeping inferno",
  "hd": 15,
  "hp10x": 1110,
  "ac": 0,
  "ev": 10,
  "will": 60,
  "exp": 3,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "*",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "peripheral"
  ],
  "resists": {
   "fire": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "creeping-plasmodium",
  "enumName": "MONS_CREEPING_PLASMODIUM",
  "name": "creeping plasmodium",
  "hd": 10,
  "hp10x": 980,
  "ac": 17,
  "ev": 3,
  "will": 160,
  "exp": 1800,
  "attacks": [],
  "speed": 10,
  "glyph": "J",
  "colour": "etc_gold",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable",
   "amorphous",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": "creeping_plasmodium",
  "uses": null,
  "habitat": "walls_only"
 },
 {
  "id": "crimson-imp",
  "enumName": "MONS_CRIMSON_IMP",
  "name": "crimson imp",
  "hd": 3,
  "hp10x": 135,
  "ac": 3,
  "ev": 14,
  "will": 40,
  "exp": 49,
  "attacks": [
   {
    "type": "hit",
    "damage": 4,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "5",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "speaks",
   "fast_regen"
  ],
  "resists": {
   "poison": 1,
   "fire": 3,
   "cold": -1,
   "neg": 3,
   "torment": 1
  },
  "spells": "blinker",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "crocodile",
  "enumName": "MONS_CROCODILE",
  "name": "crocodile",
  "hd": 6,
  "hp10x": 360,
  "ac": 4,
  "ev": 12,
  "will": 20,
  "exp": 120,
  "attacks": [
   {
    "type": "bite",
    "damage": 15,
    "flavour": "drag"
   }
  ],
  "speed": 10,
  "glyph": "l",
  "colour": "brown",
  "spriteKey": "enemy_crocodile",
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "crystal-echidna",
  "enumName": "MONS_CRYSTAL_ECHIDNA",
  "name": "crystal echidna",
  "hd": 12,
  "hp10x": 640,
  "ac": 10,
  "ev": 10,
  "will": "invuln",
  "exp": 773,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 13,
  "glyph": "r",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "crystal_echidna",
  "uses": null,
  "habitat": null
 },
 {
  "id": "crystal-guardian",
  "enumName": "MONS_CRYSTAL_GUARDIAN",
  "name": "crystal guardian",
  "hd": 16,
  "hp10x": 600,
  "ac": 20,
  "ev": 0,
  "will": "invuln",
  "exp": 918,
  "attacks": [
   {
    "type": "hit",
    "damage": 42,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "9",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "see_invis",
   "speaks"
  ],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "crystal_guardian",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "crystal-tome",
  "enumName": "MONS_CRYSTAL_TOME",
  "name": "walking crystal tome",
  "hd": 15,
  "hp10x": 1000,
  "ac": 15,
  "ev": 5,
  "will": "invuln",
  "exp": 1809,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": ";",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "walking_tome",
  "species": "earthen_tome",
  "flags": [],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "walking_tome",
  "uses": null,
  "habitat": null
 },
 {
  "id": "culicivora",
  "enumName": "MONS_CULICIVORA",
  "name": "culicivora",
  "hd": 8,
  "hp10x": 390,
  "ac": 2,
  "ev": 16,
  "will": 20,
  "exp": 223,
  "attacks": [
   {
    "type": "bite",
    "damage": 27,
    "flavour": "vampiric"
   }
  ],
  "speed": 15,
  "glyph": "s",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "arachnid",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "spider",
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": "culicivora",
  "uses": null,
  "habitat": null
 },
 {
  "id": "curse-skull",
  "enumName": "MONS_CURSE_SKULL",
  "name": "curse skull",
  "hd": 13,
  "hp10x": 520,
  "ac": 35,
  "ev": 3,
  "will": "invuln",
  "exp": 1166,
  "attacks": [],
  "speed": 15,
  "glyph": "z",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "speaks"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "curse_skull",
  "uses": null,
  "habitat": null
 },
 {
  "id": "curse-toe",
  "enumName": "MONS_CURSE_TOE",
  "name": "curse toe",
  "hd": 14,
  "hp10x": 980,
  "ac": 25,
  "ev": 1,
  "will": "invuln",
  "exp": 2722,
  "attacks": [],
  "speed": 10,
  "glyph": "z",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "speaks"
  ],
  "resists": {
   "elec": 1,
   "fire": 3,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "curse_toe",
  "uses": null,
  "habitat": null
 },
 {
  "id": "cyclops",
  "enumName": "MONS_CYCLOPS",
  "name": "cyclops",
  "hd": 9,
  "hp10x": 495,
  "ac": 5,
  "ev": 3,
  "will": 40,
  "exp": 547,
  "attacks": [
   {
    "type": "hit",
    "damage": 35,
    "flavour": "plain"
   }
  ],
  "speed": 7,
  "glyph": "C",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "daeva",
  "enumName": "MONS_DAEVA",
  "name": "daeva",
  "hd": 14,
  "hp10x": 1190,
  "ac": 10,
  "ev": 13,
  "will": 140,
  "exp": 1321,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "A",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "holy"
  ],
  "genus": "angel",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "speaks"
  ],
  "resists": {
   "poison": 1,
   "neg": 3
  },
  "spells": "daeva",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "dancing-weapon",
  "enumName": "MONS_DANCING_WEAPON",
  "name": "dancing weapon",
  "hd": 15,
  "hp10x": 150,
  "ac": 10,
  "ev": 20,
  "will": "invuln",
  "exp": 20,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "(",
  "colour": "colour_undef",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "unblindable",
   "ghost_demon",
   "prefer_ranged"
  ],
  "resists": {
   "elec": 3,
   "fire": 2,
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "dart-slug",
  "enumName": "MONS_DART_SLUG",
  "name": "dart slug",
  "hd": 1,
  "hp10x": 100,
  "ac": 1,
  "ev": 1,
  "will": 0,
  "exp": 4,
  "attacks": [
   {
    "type": "bite",
    "damage": 3,
    "flavour": "plain"
   }
  ],
  "speed": 7,
  "glyph": "w",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "snail",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "elephant_slug",
  "species": null,
  "flags": [
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": "dart_slug",
  "uses": null,
  "habitat": null
 },
 {
  "id": "death-cob",
  "enumName": "MONS_DEATH_COB",
  "name": "death cob",
  "hd": 14,
  "hp10x": 910,
  "ac": 10,
  "ev": 15,
  "will": 40,
  "exp": 1513,
  "attacks": [
   {
    "type": "hit",
    "damage": 35,
    "flavour": "drain_speed"
   }
  ],
  "speed": 25,
  "glyph": "z",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "death-drake",
  "enumName": "MONS_DEATH_DRAKE",
  "name": "death drake",
  "hd": 9,
  "hp10x": 765,
  "ac": 6,
  "ev": 14,
  "will": 40,
  "exp": 737,
  "attacks": [
   {
    "type": "bite",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 13,
  "glyph": "k",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "drake",
  "species": null,
  "flags": [
   "flies",
   "cold_blood"
  ],
  "resists": {
   "poison": 1,
   "miasma": 1
  },
  "spells": "death_drake",
  "uses": null,
  "habitat": null
 },
 {
  "id": "death-knight",
  "enumName": "MONS_DEATH_KNIGHT",
  "name": "death knight",
  "hd": 14,
  "hp10x": 840,
  "ac": 6,
  "ev": 14,
  "will": 80,
  "exp": 1020,
  "attacks": [
   {
    "type": "hit",
    "damage": 32,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "death_knight",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "death-scarab",
  "enumName": "MONS_DEATH_SCARAB",
  "name": "death scarab",
  "hd": 8,
  "hp10x": 320,
  "ac": 7,
  "ev": 14,
  "will": 60,
  "exp": 812,
  "attacks": [
   {
    "type": "bite",
    "damage": 33,
    "flavour": "scarab"
   }
  ],
  "speed": 30,
  "glyph": "B",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "insect",
  "intelligence": "animal",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "batty",
   "web_immune",
   "no_skeleton",
   "no_zombie"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "death-yak",
  "enumName": "MONS_DEATH_YAK",
  "name": "death yak",
  "hd": 14,
  "hp10x": 770,
  "ac": 9,
  "ev": 5,
  "will": 100,
  "exp": 811,
  "attacks": [
   {
    "type": "gore",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Y",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "yak",
  "species": null,
  "flags": [
   "warm_blood",
   "herd"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "deathcap",
  "enumName": "MONS_DEATHCAP",
  "name": "deathcap",
  "hd": 13,
  "hp10x": 520,
  "ac": 5,
  "ev": 0,
  "will": 80,
  "exp": 6,
  "attacks": [
   {
    "type": "spore",
    "damage": 33,
    "flavour": "confuse"
   }
  ],
  "speed": 10,
  "glyph": "f",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "fungus",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": "fungus",
  "species": "wandering_mushroom",
  "flags": [],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "deathcap",
  "uses": null,
  "habitat": null
 },
 {
  "id": "deep-elf-air-mage",
  "enumName": "MONS_DEEP_ELF_AIR_MAGE",
  "name": "deep elf zephyrmancer",
  "hd": 9,
  "hp10x": 405,
  "ac": 0,
  "ev": 13,
  "will": 40,
  "exp": 599,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "deep_elf_air_mage",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-annihilator",
  "enumName": "MONS_DEEP_ELF_ANNIHILATOR",
  "name": "deep elf annihilator",
  "hd": 15,
  "hp10x": 675,
  "ac": 0,
  "ev": 13,
  "will": 120,
  "exp": 1004,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "annihilator",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-archer",
  "enumName": "MONS_DEEP_ELF_ARCHER",
  "name": "deep elf archer",
  "hd": 10,
  "hp10x": 500,
  "ac": 0,
  "ev": 15,
  "will": 80,
  "exp": 746,
  "attacks": [
   {
    "type": "hit",
    "damage": 21,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "speaks",
   "warm_blood",
   "archer"
  ],
  "resists": {},
  "spells": "deep_elf_archer",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-blademaster",
  "enumName": "MONS_DEEP_ELF_BLADEMASTER",
  "name": "deep elf blademaster",
  "hd": 16,
  "hp10x": 1040,
  "ac": 0,
  "ev": 25,
  "will": 120,
  "exp": 1664,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "e",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "two_weapons"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-death-mage",
  "enumName": "MONS_DEEP_ELF_DEATH_MAGE",
  "name": "deep elf death mage",
  "hd": 17,
  "hp10x": 775,
  "ac": 0,
  "ev": 13,
  "will": 120,
  "exp": 1027,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "deep_elf_death_mage",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-demonologist",
  "enumName": "MONS_DEEP_ELF_DEMONOLOGIST",
  "name": "deep elf demonologist",
  "hd": 12,
  "hp10x": 540,
  "ac": 0,
  "ev": 13,
  "will": 100,
  "exp": 1031,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "deep_elf_demonologist",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-elementalist",
  "enumName": "MONS_DEEP_ELF_ELEMENTALIST",
  "name": "deep elf elementalist",
  "hd": 14,
  "hp10x": 630,
  "ac": 0,
  "ev": 13,
  "will": 120,
  "exp": 1187,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "deep_elf_elementalist",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-fire-mage",
  "enumName": "MONS_DEEP_ELF_FIRE_MAGE",
  "name": "deep elf pyromancer",
  "hd": 9,
  "hp10x": 405,
  "ac": 0,
  "ev": 13,
  "will": 40,
  "exp": 600,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "deep_elf_fire_mage",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-high-priest",
  "enumName": "MONS_DEEP_ELF_HIGH_PRIEST",
  "name": "deep elf high priest",
  "hd": 11,
  "hp10x": 495,
  "ac": 3,
  "ev": 13,
  "will": 80,
  "exp": 896,
  "attacks": [
   {
    "type": "hit",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "deep_elf_high_priest",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-knight",
  "enumName": "MONS_DEEP_ELF_KNIGHT",
  "name": "deep elf knight",
  "hd": 11,
  "hp10x": 495,
  "ac": 0,
  "ev": 17,
  "will": 80,
  "exp": 777,
  "attacks": [
   {
    "type": "hit",
    "damage": 21,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "blue",
  "spriteKey": "enemy_deep_elf_knight",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "deep_elf_knight",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-master-archer",
  "enumName": "MONS_DEEP_ELF_MASTER_ARCHER",
  "name": "deep elf master archer",
  "hd": 15,
  "hp10x": 750,
  "ac": 0,
  "ev": 15,
  "will": 100,
  "exp": 1640,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "speaks",
   "warm_blood",
   "archer",
   "prefer_ranged"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-elf-sorcerer",
  "enumName": "MONS_DEEP_ELF_SORCERER",
  "name": "deep elf sorcerer",
  "hd": 14,
  "hp10x": 630,
  "ac": 0,
  "ev": 13,
  "will": 120,
  "exp": 1237,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "deep_elf_sorcerer",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "deep-troll-earth-mage",
  "enumName": "MONS_DEEP_TROLL_EARTH_MAGE",
  "name": "deep troll earth mage",
  "hd": 12,
  "hp10x": 480,
  "ac": 12,
  "ev": 10,
  "will": 40,
  "exp": 805,
  "attacks": [
   {
    "type": "bite",
    "damage": 27,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "T",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "troll",
  "species": "deep_troll",
  "flags": [
   "see_invis",
   "unblindable",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "deep_troll_earth_mage",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "deep-troll-shaman",
  "enumName": "MONS_DEEP_TROLL_SHAMAN",
  "name": "deep troll shaman",
  "hd": 12,
  "hp10x": 480,
  "ac": 6,
  "ev": 10,
  "will": 40,
  "exp": 814,
  "attacks": [
   {
    "type": "bite",
    "damage": 27,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "T",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "troll",
  "species": "deep_troll",
  "flags": [
   "see_invis",
   "unblindable",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "deep_troll_shaman",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "deep-troll",
  "enumName": "MONS_DEEP_TROLL",
  "name": "deep troll",
  "hd": 10,
  "hp10x": 550,
  "ac": 6,
  "ev": 10,
  "will": 40,
  "exp": 733,
  "attacks": [
   {
    "type": "bite",
    "damage": 27,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "T",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "troll",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable",
   "speaks",
   "warm_blood",
   "fast_regen"
  ],
  "resists": {},
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "demigod",
  "enumName": "MONS_DEMIGOD",
  "name": "demigod",
  "hd": 5,
  "hp10x": 375,
  "ac": 2,
  "ev": 12,
  "will": 20,
  "exp": 154,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "human",
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "demonic-crawler",
  "enumName": "MONS_DEMONIC_CRAWLER",
  "name": "demonic crawler",
  "hd": 9,
  "hp10x": 585,
  "ac": 10,
  "ev": 6,
  "will": 60,
  "exp": 800,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 13,
  "glyph": "s",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "centipede",
  "intelligence": "animal",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "web_immune",
   "fast_regen",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "demonic-plant",
  "enumName": "MONS_DEMONIC_PLANT",
  "name": "demonic plant",
  "hd": 10,
  "hp10x": 2000,
  "ac": 0,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 0,
  "glyph": "P",
  "colour": "etc_random",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "plant",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": null,
  "flags": [
   "fragile",
   "stationary",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "demonspawn-blood-saint",
  "enumName": "MONS_DEMONSPAWN_BLOOD_SAINT",
  "name": "demonspawn blood saint",
  "hd": 15,
  "hp10x": 925,
  "ac": 6,
  "ev": 12,
  "will": 60,
  "exp": 1104,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "fire"
   }
  ],
  "speed": 10,
  "glyph": "6",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural",
   "demonic"
  ],
  "genus": null,
  "species": "demonspawn",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "fire": 3,
   "torment": 1
  },
  "spells": "demonspawn_blood_saint",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "demonspawn-corrupter",
  "enumName": "MONS_DEMONSPAWN_CORRUPTER",
  "name": "demonspawn corrupter",
  "hd": 15,
  "hp10x": 925,
  "ac": 3,
  "ev": 15,
  "will": 60,
  "exp": 1120,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "kick",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "6",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural",
   "demonic"
  ],
  "genus": null,
  "species": "demonspawn",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "neg": 3,
   "torment": 1
  },
  "spells": "demonspawn_corrupter",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "demonspawn-soul-scholar",
  "enumName": "MONS_DEMONSPAWN_SOUL_SCHOLAR",
  "name": "demonspawn soul scholar",
  "hd": 15,
  "hp10x": 925,
  "ac": 9,
  "ev": 12,
  "will": 60,
  "exp": 1031,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "6",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural",
   "demonic"
  ],
  "genus": null,
  "species": "demonspawn",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "cold": 3,
   "torment": 1
  },
  "spells": "demonspawn_soul_scholar",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "demonspawn-warmonger",
  "enumName": "MONS_DEMONSPAWN_WARMONGER",
  "name": "demonspawn warmonger",
  "hd": 15,
  "hp10x": 1250,
  "ac": 3,
  "ev": 12,
  "will": 60,
  "exp": 1313,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "gore",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "6",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural",
   "demonic"
  ],
  "genus": null,
  "species": "demonspawn",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "torment": 1
  },
  "spells": "demonspawn_warmonger",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "demonspawn",
  "enumName": "MONS_DEMONSPAWN",
  "name": "demonspawn",
  "hd": 10,
  "hp10x": 925,
  "ac": 3,
  "ev": 12,
  "will": 40,
  "exp": 849,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "gore",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "6",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural",
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "no_poly_to"
  ],
  "resists": {
   "torment": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "diamond-obelisk",
  "enumName": "MONS_DIAMOND_OBELISK",
  "name": "diamond obelisk",
  "hd": 8,
  "hp10x": 96000,
  "ac": 12,
  "ev": 1,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "no_poly_to",
   "no_threat"
  ],
  "resists": {
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "diamond-sawblade",
  "enumName": "MONS_DIAMOND_SAWBLADE",
  "name": "diamond sawblade",
  "hd": 10,
  "hp10x": 700,
  "ac": 15,
  "ev": 0,
  "will": "invuln",
  "exp": 850,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "ETC_IRON",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_poly_to",
   "peripheral"
  ],
  "resists": {
   "elec": 3,
   "fire": 2,
   "cold": 2,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "sawblade",
  "uses": null,
  "habitat": null
 },
 {
  "id": "dire-elephant",
  "enumName": "MONS_DIRE_ELEPHANT",
  "name": "dire elephant",
  "hd": 15,
  "hp10x": 1125,
  "ac": 13,
  "ev": 2,
  "will": 100,
  "exp": 996,
  "attacks": [
   {
    "type": "trample",
    "damage": 40,
    "flavour": "trample"
   },
   {
    "type": "trunk_slap",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Y",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "elephant",
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "dispater",
  "enumName": "MONS_DISPATER",
  "name": "Dispater",
  "hd": 16,
  "hp10x": 4480,
  "ac": 35,
  "ev": 3,
  "will": "invuln",
  "exp": 5159,
  "attacks": [
   {
    "type": "hit",
    "damage": 50,
    "flavour": "corrode"
   }
  ],
  "speed": 10,
  "glyph": "&",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "hell_lord",
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "unique",
   "tall_tile",
   "gender_neutral"
  ],
  "resists": {
   "elec": 3,
   "poison": 1,
   "fire": 1,
   "cold": 1,
   "corr": 3,
   "damnation": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "dispater",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "dissolution",
  "enumName": "MONS_DISSOLUTION",
  "name": "Dissolution",
  "hd": 16,
  "hp10x": 1760,
  "ac": 10,
  "ev": 1,
  "will": 120,
  "exp": 7370,
  "attacks": [
   {
    "type": "hit",
    "damage": 50,
    "flavour": "acid"
   },
   {
    "type": "hit",
    "damage": 30,
    "flavour": "acid"
   }
  ],
  "speed": 10,
  "glyph": "J",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "blob",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "jelly",
  "flags": [
   "eat_doors",
   "see_invis",
   "unblindable",
   "amorphous",
   "speaks",
   "burrows",
   "unique",
   "acid_splash",
   "fast_regen",
   "no_skeleton",
   "gender_neutral"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": "dissolution",
  "uses": null,
  "habitat": null
 },
 {
  "id": "divine-tome",
  "enumName": "MONS_DIVINE_TOME",
  "name": "walking divine tome",
  "hd": 20,
  "hp10x": 1000,
  "ac": 10,
  "ev": 5,
  "will": "invuln",
  "exp": 1643,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": ";",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "walking_tome",
  "species": "earthen_tome",
  "flags": [],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "walking_tome",
  "uses": null,
  "habitat": null
 },
 {
  "id": "djinni",
  "enumName": "MONS_DJINNI",
  "name": "djinni",
  "hd": 8,
  "hp10x": 400,
  "ac": 5,
  "ev": 5,
  "will": 30,
  "exp": 363,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "speaks"
  ],
  "resists": {
   "fire": 2,
   "cold": -1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "donald",
  "enumName": "MONS_DONALD",
  "name": "Donald",
  "hd": 14,
  "hp10x": 840,
  "ac": 3,
  "ev": 10,
  "will": 100,
  "exp": 1374,
  "attacks": [
   {
    "type": "hit",
    "damage": 26,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "donald",
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "dowan",
  "enumName": "MONS_DOWAN",
  "name": "Dowan",
  "hd": 3,
  "hp10x": 240,
  "ac": 0,
  "ev": 13,
  "will": 20,
  "exp": 69,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "dowan",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "draconian-annihilator",
  "enumName": "MONS_DRACONIAN_ANNIHILATOR",
  "name": "draconian annihilator",
  "hd": 16,
  "hp10x": 800,
  "ac": -1,
  "ev": 0,
  "will": 40,
  "exp": 1119,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "q",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "draconian",
  "flags": [
   "speaks",
   "cold_blood"
  ],
  "resists": {},
  "spells": "annihilator",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "draconian-knight",
  "enumName": "MONS_DRACONIAN_KNIGHT",
  "name": "draconian knight",
  "hd": 16,
  "hp10x": 1120,
  "ac": 9,
  "ev": 2,
  "will": 40,
  "exp": 1280,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "q",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "draconian",
  "flags": [
   "fighter",
   "speaks",
   "cold_blood"
  ],
  "resists": {},
  "spells": "draconian_knight",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "draconian-monk",
  "enumName": "MONS_DRACONIAN_MONK",
  "name": "draconian monk",
  "hd": 16,
  "hp10x": 1120,
  "ac": -3,
  "ev": 10,
  "will": 40,
  "exp": 1304,
  "attacks": [
   {
    "type": "punch",
    "damage": 35,
    "flavour": "flank"
   },
   {
    "type": "kick",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "tail_slap",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "q",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "draconian",
  "flags": [
   "fighter",
   "speaks",
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "draconian-scorcher",
  "enumName": "MONS_DRACONIAN_SCORCHER",
  "name": "draconian scorcher",
  "hd": 16,
  "hp10x": 800,
  "ac": -1,
  "ev": 2,
  "will": 40,
  "exp": 1212,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "q",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "draconian",
  "flags": [
   "speaks",
   "cold_blood"
  ],
  "resists": {},
  "spells": "draconian_scorcher",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "draconian-shifter",
  "enumName": "MONS_DRACONIAN_SHIFTER",
  "name": "draconian shifter",
  "hd": 16,
  "hp10x": 960,
  "ac": -1,
  "ev": 6,
  "will": 40,
  "exp": 1237,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "q",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "draconian",
  "flags": [
   "speaks",
   "cold_blood"
  ],
  "resists": {},
  "spells": "draconian_shifter",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "draconian-stormcaller",
  "enumName": "MONS_DRACONIAN_STORMCALLER",
  "name": "draconian stormcaller",
  "hd": 16,
  "hp10x": 880,
  "ac": 0,
  "ev": 0,
  "will": 40,
  "exp": 1145,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "q",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "draconian",
  "flags": [
   "speaks",
   "cold_blood"
  ],
  "resists": {},
  "spells": "draconian_stormcaller",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "draconian",
  "enumName": "MONS_DRACONIAN",
  "name": "draconian",
  "hd": 8,
  "hp10x": 640,
  "ac": 10,
  "ev": 11,
  "will": 10,
  "exp": 530,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "cold_blood",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "dragon",
  "enumName": "MONS_DRAGON",
  "name": "dragon",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "D",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "drake",
  "enumName": "MONS_DRAKE",
  "name": "drake",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "k",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "draugr",
  "enumName": "MONS_DRAUGR",
  "name": "draugr",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 0,
  "exp": 9,
  "attacks": [],
  "speed": 5,
  "glyph": "Z",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_regen"
  ],
  "resists": {
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "dread-lich",
  "enumName": "MONS_DREAD_LICH",
  "name": "dread lich",
  "hd": 27,
  "hp10x": 1080,
  "ac": 20,
  "ev": 10,
  "will": "invuln",
  "exp": 5099,
  "attacks": [
   {
    "type": "touch",
    "damage": 20,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "L",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "lich",
  "flags": [
   "see_invis",
   "speaks"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "dread_lich",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "dream-sheep",
  "enumName": "MONS_DREAM_SHEEP",
  "name": "dream sheep",
  "hd": 9,
  "hp10x": 220,
  "ac": 2,
  "ev": 10,
  "will": 30,
  "exp": 255,
  "attacks": [
   {
    "type": "headbutt",
    "damage": 13,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Y",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped_tailless",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood",
   "herd"
  ],
  "resists": {},
  "spells": "dream_sheep",
  "uses": null,
  "habitat": null
 },
 {
  "id": "drowned-soul",
  "enumName": "MONS_DROWNED_SOUL",
  "name": "drowned soul",
  "hd": 13,
  "hp10x": 195,
  "ac": 0,
  "ev": 13,
  "will": 60,
  "exp": 8,
  "attacks": [],
  "speed": 12,
  "glyph": "W",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "phantom",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "speaks",
   "insubstantial"
  ],
  "resists": {
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "drude",
  "enumName": "MONS_DRUDE",
  "name": "drude",
  "hd": 4,
  "hp10x": 210,
  "ac": 4,
  "ev": 17,
  "will": 40,
  "exp": 38,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "doom"
   },
   {
    "type": "hit",
    "damage": 8,
    "flavour": "doom"
   }
  ],
  "speed": 13,
  "glyph": "5",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks"
  ],
  "resists": {
   "poison": 1,
   "fire": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "dryad",
  "enumName": "MONS_DRYAD",
  "name": "dryad",
  "hd": 8,
  "hp10x": 520,
  "ac": 6,
  "ev": 12,
  "will": 80,
  "exp": 344,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "cautious",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {
   "fire": -1
  },
  "spells": "dryad",
  "uses": null,
  "habitat": null
 },
 {
  "id": "duvessa",
  "enumName": "MONS_DUVESSA",
  "name": "Duvessa",
  "hd": 4,
  "hp10x": 360,
  "ac": 2,
  "ev": 9,
  "will": 40,
  "exp": 146,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "dwarf",
  "enumName": "MONS_DWARF",
  "name": "dwarf",
  "hd": 5,
  "hp10x": 275,
  "ac": 2,
  "ev": 12,
  "will": 20,
  "exp": 131,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "g",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "earth-elemental",
  "enumName": "MONS_EARTH_ELEMENTAL",
  "name": "earth elemental",
  "hd": 6,
  "hp10x": 450,
  "ac": 14,
  "ev": 4,
  "will": "invuln",
  "exp": 84,
  "attacks": [
   {
    "type": "hit",
    "damage": 36,
    "flavour": "plain"
   }
  ],
  "speed": 8,
  "glyph": "E",
  "colour": "etc_earth",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": "elemental",
  "species": null,
  "flags": [],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "wall"
 },
 {
  "id": "earthen-tome",
  "enumName": "MONS_EARTHEN_TOME",
  "name": "walking earthen tome",
  "hd": 27,
  "hp10x": 1000,
  "ac": 20,
  "ev": 5,
  "will": "invuln",
  "exp": 1737,
  "attacks": [
   {
    "type": "hit",
    "damage": 50,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": ";",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "walking_tome",
  "species": null,
  "flags": [],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "walking_tome",
  "uses": null,
  "habitat": null
 },
 {
  "id": "edmund",
  "enumName": "MONS_EDMUND",
  "name": "Edmund",
  "hd": 4,
  "hp10x": 440,
  "ac": 0,
  "ev": 10,
  "will": 20,
  "exp": 165,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "efreet",
  "enumName": "MONS_EFREET",
  "name": "efreet",
  "hd": 7,
  "hp10x": 385,
  "ac": 10,
  "ev": 5,
  "will": 20,
  "exp": 359,
  "attacks": [
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "speaks"
  ],
  "resists": {
   "poison": 1,
   "fire": 3,
   "cold": -1,
   "neg": 3,
   "torment": 1
  },
  "spells": "efreet",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "eidolon",
  "enumName": "MONS_EIDOLON",
  "name": "eidolon",
  "hd": 13,
  "hp10x": 715,
  "ac": 12,
  "ev": 10,
  "will": 140,
  "exp": 944,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "drain_speed"
   },
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "wraith",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "eidolon",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "eldritch-tentacle-segment",
  "enumName": "MONS_ELDRITCH_TENTACLE_SEGMENT",
  "name": "eldritch tentacle segment",
  "hd": 16,
  "hp10x": 1200,
  "ac": 13,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 12,
  "glyph": "*",
  "colour": "colour_undef",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": "eldritch_tentacle",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "stationary",
   "no_exp_gain",
   "no_poly_to",
   "no_threat",
   "peripheral"
  ],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "corr": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "eldritch_tentacle"
 },
 {
  "id": "eldritch-tentacle",
  "enumName": "MONS_ELDRITCH_TENTACLE",
  "name": "eldritch tentacle",
  "hd": 16,
  "hp10x": 1200,
  "ac": 13,
  "ev": 0,
  "will": "invuln",
  "exp": 1530,
  "attacks": [
   {
    "type": "tentacle_slap",
    "damage": 30,
    "flavour": "chaotic"
   },
   {
    "type": "claw",
    "damage": 40,
    "flavour": "chaotic"
   }
  ],
  "speed": 12,
  "glyph": "w",
  "colour": "colour_undef",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "stationary",
   "no_poly_to"
  ],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "corr": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "eldritch_tentacle"
 },
 {
  "id": "electric-eel",
  "enumName": "MONS_ELECTRIC_EEL",
  "name": "electric eel",
  "hd": 3,
  "hp10x": 165,
  "ac": 1,
  "ev": 15,
  "will": 10,
  "exp": 54,
  "attacks": [],
  "speed": 10,
  "glyph": "S",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cold_blood",
   "no_gen_derived"
  ],
  "resists": {
   "elec": 3
  },
  "spells": "zapper",
  "uses": null,
  "habitat": "water"
 },
 {
  "id": "electric-golem",
  "enumName": "MONS_ELECTRIC_GOLEM",
  "name": "electric golem",
  "hd": 15,
  "hp10x": 1350,
  "ac": 5,
  "ev": 20,
  "will": "invuln",
  "exp": 2013,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "elec"
   },
   {
    "type": "hit",
    "damage": 15,
    "flavour": "elec"
   },
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 16,
  "glyph": "9",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "insubstantial"
  ],
  "resists": {
   "elec": 3,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "electric_golem",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "eleionoma",
  "enumName": "MONS_ELEIONOMA",
  "name": "eleionoma",
  "hd": 16,
  "hp10x": 800,
  "ac": 2,
  "ev": 10,
  "will": 100,
  "exp": 1028,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "eleionoma",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "elemental-wellspring",
  "enumName": "MONS_ELEMENTAL_WELLSPRING",
  "name": "elemental wellspring",
  "hd": 18,
  "hp10x": 620,
  "ac": 8,
  "ev": 8,
  "will": "invuln",
  "exp": 1039,
  "attacks": [],
  "speed": 10,
  "glyph": "E",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": "elemental",
  "species": null,
  "flags": [
   "amorphous"
  ],
  "resists": {
   "elec": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "elemental_wellspring",
  "uses": null,
  "habitat": "water"
 },
 {
  "id": "elemental",
  "enumName": "MONS_ELEMENTAL",
  "name": "elemental",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "E",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "elephant-slug",
  "enumName": "MONS_ELEPHANT_SLUG",
  "name": "elephant slug",
  "hd": 20,
  "hp10x": 1300,
  "ac": 2,
  "ev": 1,
  "will": 80,
  "exp": 2,
  "attacks": [
   {
    "type": "bite",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 4,
  "glyph": "w",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "snail",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_skeleton",
   "cant_spawn"
  ],
  "resists": {
   "poison": -1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "elephant",
  "enumName": "MONS_ELEPHANT",
  "name": "elephant",
  "hd": 9,
  "hp10x": 675,
  "ac": 8,
  "ev": 2,
  "will": 60,
  "exp": 480,
  "attacks": [
   {
    "type": "trample",
    "damage": 20,
    "flavour": "trample"
   },
   {
    "type": "trunk_slap",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Y",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "elf",
  "enumName": "MONS_ELF",
  "name": "elf",
  "hd": 8,
  "hp10x": 290,
  "ac": 1,
  "ev": 16,
  "will": 40,
  "exp": 194,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "no_poly_to"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "emperor-scorpion",
  "enumName": "MONS_EMPEROR_SCORPION",
  "name": "emperor scorpion",
  "hd": 14,
  "hp10x": 1090,
  "ac": 18,
  "ev": 7,
  "will": 60,
  "exp": 1235,
  "attacks": [
   {
    "type": "sting",
    "damage": 30,
    "flavour": "poison"
   },
   {
    "type": "claw",
    "damage": 10,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "s",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "arachnid",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "scorpion",
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "enchantress",
  "enumName": "MONS_ENCHANTRESS",
  "name": "Enchantress",
  "hd": 15,
  "hp10x": 975,
  "ac": 1,
  "ev": 30,
  "will": 160,
  "exp": 2328,
  "attacks": [
   {
    "type": "hit",
    "damage": 26,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "i",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "spriggan",
  "flags": [
   "name_the",
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "enchantress",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "endoplasm",
  "enumName": "MONS_ENDOPLASM",
  "name": "endoplasm",
  "hd": 1,
  "hp10x": 60,
  "ac": 1,
  "ev": 3,
  "will": 0,
  "exp": 2,
  "attacks": [
   {
    "type": "hit",
    "damage": 3,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "J",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable",
   "amorphous",
   "no_skeleton"
  ],
  "resists": {
   "corr": 3
  },
  "spells": "endoplasm",
  "uses": null,
  "habitat": null
 },
 {
  "id": "entropy-weaver",
  "enumName": "MONS_ENTROPY_WEAVER",
  "name": "entropy weaver",
  "hd": 7,
  "hp10x": 715,
  "ac": 7,
  "ev": 13,
  "will": 60,
  "exp": 898,
  "attacks": [
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "B",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "web_immune",
   "warm_blood",
   "no_skeleton"
  ],
  "resists": {},
  "spells": "entropy_weaver",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "ereshkigal",
  "enumName": "MONS_ERESHKIGAL",
  "name": "Ereshkigal",
  "hd": 18,
  "hp10x": 3510,
  "ac": 10,
  "ev": 30,
  "will": "invuln",
  "exp": 6976,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "drain"
   }
  ],
  "speed": 14,
  "glyph": "&",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "hell_lord",
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "unique",
   "female",
   "tall_tile"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "ereshkigal",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "erica",
  "enumName": "MONS_ERICA",
  "name": "Erica",
  "hd": 9,
  "hp10x": 630,
  "ac": 0,
  "ev": 13,
  "will": 40,
  "exp": 839,
  "attacks": [
   {
    "type": "hit",
    "damage": 11,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 3,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "x",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "octopode",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "female",
   "no_skeleton"
  ],
  "resists": {},
  "spells": "erica",
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "erolcha",
  "enumName": "MONS_EROLCHA",
  "name": "Erolcha",
  "hd": 6,
  "hp10x": 540,
  "ac": 3,
  "ev": 7,
  "will": 60,
  "exp": 867,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "O",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "ogre",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "erolcha",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "erythrospite",
  "enumName": "MONS_ERYTHROSPITE",
  "name": "erythrospite",
  "hd": 3,
  "hp10x": 165,
  "ac": 0,
  "ev": 7,
  "will": 10,
  "exp": 42,
  "attacks": [
   {
    "type": "hit",
    "damage": 3,
    "flavour": "vampiric"
   }
  ],
  "speed": 10,
  "glyph": "E",
  "colour": "etc_blood",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "unblindable",
   "amorphous",
   "no_skeleton",
   "speaks",
   "warm_blood",
   "no_poly_to"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "ettin",
  "enumName": "MONS_ETTIN",
  "name": "ettin",
  "hd": 12,
  "hp10x": 660,
  "ac": 9,
  "ev": 4,
  "will": 40,
  "exp": 929,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "two_weapons"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "eustachio",
  "enumName": "MONS_EUSTACHIO",
  "name": "Eustachio",
  "hd": 4,
  "hp10x": 400,
  "ac": 0,
  "ev": 13,
  "will": 20,
  "exp": 200,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "eustachio",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "executioner",
  "enumName": "MONS_EXECUTIONER",
  "name": "Executioner",
  "hd": 12,
  "hp10x": 660,
  "ac": 10,
  "ev": 15,
  "will": 140,
  "exp": 1531,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 20,
  "glyph": "1",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fighter",
   "see_invis"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "executioner",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "eye-of-devastation",
  "enumName": "MONS_EYE_OF_DEVASTATION",
  "name": "eye of devastation",
  "hd": 10,
  "hp10x": 550,
  "ac": 16,
  "ev": 1,
  "will": 100,
  "exp": 464,
  "attacks": [],
  "speed": 8,
  "glyph": "G",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "floating_eye",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "no_skeleton"
  ],
  "resists": {
   "corr": 3
  },
  "spells": "eye_of_devastation",
  "uses": null,
  "habitat": null
 },
 {
  "id": "eye-of-draining",
  "enumName": "MONS_EYE_OF_DRAINING",
  "name": "eye of draining",
  "hd": 14,
  "hp10x": 780,
  "ac": 3,
  "ev": 1,
  "will": 80,
  "exp": 766,
  "attacks": [],
  "speed": 10,
  "glyph": "G",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "floating_eye",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "no_skeleton",
   "cautious"
  ],
  "resists": {
   "corr": 3
  },
  "spells": "eye_of_draining",
  "uses": null,
  "habitat": null
 },
 {
  "id": "fannar",
  "enumName": "MONS_FANNAR",
  "name": "Fannar",
  "hd": 10,
  "hp10x": 800,
  "ac": 4,
  "ev": 15,
  "will": 80,
  "exp": 882,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "e",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elf",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "gender_neutral"
  ],
  "resists": {},
  "spells": "fannar",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "faun",
  "enumName": "MONS_FAUN",
  "name": "faun",
  "hd": 10,
  "hp10x": 500,
  "ac": 2,
  "ev": 10,
  "will": 40,
  "exp": 538,
  "attacks": [
   {
    "type": "hit",
    "damage": 23,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "c",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "faun",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "felid",
  "enumName": "MONS_FELID",
  "name": "felid",
  "hd": 5,
  "hp10x": 175,
  "ac": 2,
  "ev": 18,
  "will": 40,
  "exp": 106,
  "attacks": [
   {
    "type": "claw",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "h",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "quadruped",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "fenstrider-witch",
  "enumName": "MONS_FENSTRIDER_WITCH",
  "name": "fenstrider witch",
  "hd": 16,
  "hp10x": 666,
  "ac": 3,
  "ev": 15,
  "will": 100,
  "exp": 1315,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "kick",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 13,
  "glyph": "H",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "poison": 1,
   "neg": 1
  },
  "spells": "fenstrider_witch",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "fire-bat",
  "enumName": "MONS_FIRE_BAT",
  "name": "fire bat",
  "hd": 5,
  "hp10x": 225,
  "ac": 1,
  "ev": 14,
  "will": 10,
  "exp": 196,
  "attacks": [
   {
    "type": "bite",
    "damage": 6,
    "flavour": "fire"
   }
  ],
  "speed": 30,
  "glyph": "b",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "bat",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "bat",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "unblindable",
   "batty",
   "warm_blood"
  ],
  "resists": {
   "fire": 3,
   "cold": -1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "fire-crab",
  "enumName": "MONS_FIRE_CRAB",
  "name": "fire crab",
  "hd": 8,
  "hp10x": 520,
  "ac": 9,
  "ev": 6,
  "will": 40,
  "exp": 764,
  "attacks": [
   {
    "type": "bite",
    "damage": 15,
    "flavour": "fire"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "fire"
   }
  ],
  "speed": 10,
  "glyph": "t",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "crab",
  "species": null,
  "flags": [
   "no_skeleton"
  ],
  "resists": {
   "poison": -1,
   "fire": 3
  },
  "spells": "fire_crab",
  "uses": null,
  "habitat": "amphibious_lava"
 },
 {
  "id": "fire-dragon",
  "enumName": "MONS_FIRE_DRAGON",
  "name": "fire dragon",
  "hd": 12,
  "hp10x": 900,
  "ac": 10,
  "ev": 8,
  "will": 60,
  "exp": 910,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 13,
    "flavour": "plain"
   },
   {
    "type": "trample",
    "damage": 13,
    "flavour": "trample"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {
   "poison": 1,
   "fire": 2,
   "cold": -1
  },
  "spells": "fire_dragon_breath",
  "uses": null,
  "habitat": null
 },
 {
  "id": "fire-elemental",
  "enumName": "MONS_FIRE_ELEMENTAL",
  "name": "fire elemental",
  "hd": 6,
  "hp10x": 330,
  "ac": 4,
  "ev": 12,
  "will": "invuln",
  "exp": 196,
  "attacks": [],
  "speed": 13,
  "glyph": "E",
  "colour": "etc_fire",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": "elemental",
  "species": null,
  "flags": [
   "insubstantial"
  ],
  "resists": {
   "elec": 1,
   "fire": 3,
   "cold": -1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious_lava"
 },
 {
  "id": "fire-giant",
  "enumName": "MONS_FIRE_GIANT",
  "name": "fire giant",
  "hd": 16,
  "hp10x": 960,
  "ac": 8,
  "ev": 4,
  "will": 80,
  "exp": 1281,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "red",
  "spriteKey": "enemy_fire_giant",
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "fire": 2
  },
  "spells": "fire_giant",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "fire-vortex",
  "enumName": "MONS_FIRE_VORTEX",
  "name": "fire vortex",
  "hd": 10,
  "hp10x": 300,
  "ac": 0,
  "ev": 5,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 15,
  "glyph": "v",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "confused",
   "insubstantial",
   "no_exp_gain",
   "peripheral"
  ],
  "resists": {
   "elec": 1,
   "fire": 3,
   "cold": -1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "flayed-ghost",
  "enumName": "MONS_FLAYED_GHOST",
  "name": "flayed ghost",
  "hd": 11,
  "hp10x": 605,
  "ac": 0,
  "ev": 14,
  "will": 60,
  "exp": 715,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "phantom",
  "species": null,
  "flags": [
   "flies",
   "speaks",
   "insubstantial"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "flayed_ghost",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "floating-eye",
  "enumName": "MONS_FLOATING_EYE",
  "name": "floating eye",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "G",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "formicid",
  "enumName": "MONS_FORMICID",
  "name": "formicid",
  "hd": 6,
  "hp10x": 420,
  "ac": 3,
  "ev": 10,
  "will": 40,
  "exp": 229,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "B",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "no_skeleton",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "formless-jellyfish",
  "enumName": "MONS_FORMLESS_JELLYFISH",
  "name": "formless jellyfish",
  "hd": 15,
  "hp10x": 1200,
  "ac": 0,
  "ev": 3,
  "will": 60,
  "exp": 1091,
  "attacks": [
   {
    "type": "sting",
    "damage": 37,
    "flavour": "minipara"
   },
   {
    "type": "constrict",
    "damage": 5,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "J",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "unblindable",
   "amorphous",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": "blink_close",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "foxfire",
  "enumName": "MONS_FOXFIRE",
  "name": "foxfire",
  "hd": 1,
  "hp10x": 10,
  "ac": 0,
  "ev": 10,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 50,
  "glyph": "v",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial",
   "no_exp_gain",
   "no_poly_to",
   "peripheral",
   "no_threat"
  ],
  "resists": {
   "fire": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "frances",
  "enumName": "MONS_FRANCES",
  "name": "Frances",
  "hd": 14,
  "hp10x": 1330,
  "ac": 0,
  "ev": 10,
  "will": 100,
  "exp": 1518,
  "attacks": [
   {
    "type": "hit",
    "damage": 29,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "frances",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "fravashi",
  "enumName": "MONS_FRAVASHI",
  "name": "fravashi",
  "hd": 13,
  "hp10x": 860,
  "ac": 11,
  "ev": 13,
  "will": 120,
  "exp": 912,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "A",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "holy"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "speaks"
  ],
  "resists": {
   "poison": 1,
   "neg": 3
  },
  "spells": "fravashi",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "frederick",
  "enumName": "MONS_FREDERICK",
  "name": "Frederick",
  "hd": 23,
  "hp10x": 1975,
  "ac": 0,
  "ev": 16,
  "will": 140,
  "exp": 5151,
  "attacks": [
   {
    "type": "hit",
    "damage": 44,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "demigod",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "frederick",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "freezing-wraith",
  "enumName": "MONS_FREEZING_WRAITH",
  "name": "freezing wraith",
  "hd": 8,
  "hp10x": 440,
  "ac": 12,
  "ev": 10,
  "will": 40,
  "exp": 354,
  "attacks": [
   {
    "type": "hit",
    "damage": 16,
    "flavour": "cold"
   },
   {
    "type": "hit",
    "damage": 15,
    "flavour": "drain_speed"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "wraith",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "fire": -1,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "frilled-lizard",
  "enumName": "MONS_FRILLED_LIZARD",
  "name": "frilled lizard",
  "hd": 1,
  "hp10x": 20,
  "ac": 0,
  "ev": 15,
  "will": 0,
  "exp": 1,
  "attacks": [
   {
    "type": "bite",
    "damage": 3,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "l",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "giant_lizard",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "frog",
  "enumName": "MONS_FROG",
  "name": "giant frog",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "F",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "frost-giant",
  "enumName": "MONS_FROST_GIANT",
  "name": "frost giant",
  "hd": 16,
  "hp10x": 1040,
  "ac": 9,
  "ev": 3,
  "will": 80,
  "exp": 1249,
  "attacks": [
   {
    "type": "hit",
    "damage": 35,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "lightblue",
  "spriteKey": "enemy_ice_giant",
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "cold": 2
  },
  "spells": "frost_giant",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "frostbound-tome",
  "enumName": "MONS_FROSTBOUND_TOME",
  "name": "walking frostbound tome",
  "hd": 20,
  "hp10x": 1000,
  "ac": 10,
  "ev": 10,
  "will": "invuln",
  "exp": 1641,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "cold"
   }
  ],
  "speed": 10,
  "glyph": ";",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "walking_tome",
  "species": "earthen_tome",
  "flags": [],
  "resists": {
   "fire": -1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "walking_tome",
  "uses": null,
  "habitat": null
 },
 {
  "id": "fulminant-prism",
  "enumName": "MONS_FULMINANT_PRISM",
  "name": "fulminant prism",
  "hd": 5,
  "hp10x": 150,
  "ac": 3,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "*",
  "colour": "etc_magic",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "stationary",
   "no_exp_gain",
   "no_poly_to",
   "peripheral",
   "unstable"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "fungus",
  "enumName": "MONS_FUNGUS",
  "name": "fungus",
  "hd": 8,
  "hp10x": 2000,
  "ac": 0,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 0,
  "glyph": "P",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "fungus",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fragile",
   "stationary",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "gargoyle",
  "enumName": "MONS_GARGOYLE",
  "name": "gargoyle",
  "hd": 6,
  "hp10x": 270,
  "ac": 18,
  "ev": 6,
  "will": 40,
  "exp": 414,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "9",
  "colour": "lightgray",
  "spriteKey": "enemy_gargoyle",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged_tailed",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "elec": 1,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "gargoyle",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "gastronok",
  "enumName": "MONS_GASTRONOK",
  "name": "Gastronok",
  "hd": 20,
  "hp10x": 1500,
  "ac": 2,
  "ev": 1,
  "will": 80,
  "exp": 1506,
  "attacks": [
   {
    "type": "bite",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 5,
  "glyph": "w",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "snail",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "elephant_slug",
  "flags": [
   "no_wand",
   "see_invis",
   "speaks",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "gastronok",
  "uses": "starting_equipment",
  "habitat": "amphibious"
 },
 {
  "id": "geryon",
  "enumName": "MONS_GERYON",
  "name": "Geryon",
  "hd": 15,
  "hp10x": 3000,
  "ac": 15,
  "ev": 6,
  "will": 120,
  "exp": 2622,
  "attacks": [
   {
    "type": "tail_slap",
    "damage": 35,
    "flavour": "reach"
   }
  ],
  "speed": 10,
  "glyph": "&",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "hell_lord",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks",
   "unique",
   "male",
   "tall_tile"
  ],
  "resists": {
   "neg": 3,
   "torment": 1
  },
  "spells": "geryon",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "ghost-crab",
  "enumName": "MONS_GHOST_CRAB",
  "name": "ghost crab",
  "hd": 9,
  "hp10x": 585,
  "ac": 9,
  "ev": 6,
  "will": 40,
  "exp": 849,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "drain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "t",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "undead"
  ],
  "genus": "crab",
  "species": null,
  "flags": [
   "no_skeleton",
   "no_zombie"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "ghost_crab",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "ghost-moth",
  "enumName": "MONS_GHOST_MOTH",
  "name": "ghost moth",
  "hd": 13,
  "hp10x": 715,
  "ac": 8,
  "ev": 10,
  "will": 100,
  "exp": 1196,
  "attacks": [
   {
    "type": "hit",
    "damage": 24,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 18,
    "flavour": "plain"
   },
   {
    "type": "sting",
    "damage": 18,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "y",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "insect_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "moth",
  "species": null,
  "flags": [
   "flies",
   "invis",
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "cold": 1
  },
  "spells": "ghost_moth",
  "uses": null,
  "habitat": null
 },
 {
  "id": "ghost",
  "enumName": "MONS_GHOST",
  "name": "ghost",
  "hd": 1,
  "hp10x": 10,
  "ac": 0,
  "ev": 0,
  "will": 0,
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "W",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "no_poly_to"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "ghoul",
  "enumName": "MONS_GHOUL",
  "name": "ghoul",
  "hd": 14,
  "hp10x": 1470,
  "ac": 4,
  "ev": 10,
  "will": 80,
  "exp": 1148,
  "attacks": [
   {
    "type": "claw",
    "damage": 30,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "n",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_zombie"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "giant-lizard",
  "enumName": "MONS_GIANT_LIZARD",
  "name": "giant lizard",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "l",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "giant",
  "enumName": "MONS_GIANT",
  "name": "giant",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "C",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "glass-eye",
  "enumName": "MONS_GLASS_EYE",
  "name": "glass eye",
  "hd": 9,
  "hp10x": 490,
  "ac": 2,
  "ev": 12,
  "will": 60,
  "exp": 261,
  "attacks": [],
  "speed": 10,
  "glyph": "G",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "floating_eye",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "no_skeleton",
   "cautious"
  ],
  "resists": {
   "corr": 3
  },
  "spells": "glass_eye",
  "uses": null,
  "habitat": null
 },
 {
  "id": "globe-of-annihilation",
  "enumName": "MONS_GLOBE_OF_ANNIHILATION",
  "name": "globe of annihilation",
  "hd": 5,
  "hp10x": 50000,
  "ac": 0,
  "ev": 10,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 15,
  "glyph": "*",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "no_exp_gain",
   "no_poly_to",
   "no_threat",
   "projectile"
  ],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "corr": 3,
   "damnation": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "gloorx-vloq",
  "enumName": "MONS_GLOORX_VLOQ",
  "name": "Gloorx Vloq",
  "hd": 16,
  "hp10x": 3520,
  "ac": 10,
  "ev": 10,
  "will": "invuln",
  "exp": 6736,
  "attacks": [
   {
    "type": "hit",
    "damage": 45,
    "flavour": "plain"
   }
  ],
  "speed": 20,
  "glyph": "&",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "pandemonium_lord",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks",
   "unique",
   "tall_tile",
   "gender_neutral"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "gloorx_vloq",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "glowing-orange-brain",
  "enumName": "MONS_GLOWING_ORANGE_BRAIN",
  "name": "glowing orange brain",
  "hd": 10,
  "hp10x": 550,
  "ac": 2,
  "ev": 4,
  "will": 100,
  "exp": 714,
  "attacks": [],
  "speed": 10,
  "glyph": "G",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "orb",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "unblindable",
   "warm_blood",
   "no_skeleton",
   "cautious",
   "has_aura"
  ],
  "resists": {
   "corr": 3
  },
  "spells": "glowing_orange_brain",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "glowing-shapeshifter",
  "enumName": "MONS_GLOWING_SHAPESHIFTER",
  "name": "glowing shapeshifter",
  "hd": 10,
  "hp10x": 550,
  "ac": 0,
  "ev": 10,
  "will": 80,
  "exp": 507,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "shapeshifter",
  "species": null,
  "flags": [],
  "resists": {},
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "gnoll-bouda",
  "enumName": "MONS_GNOLL_BOUDA",
  "name": "gnoll bouda",
  "hd": 3,
  "hp10x": 195,
  "ac": 2,
  "ev": 9,
  "will": 20,
  "exp": 40,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "j",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "gnoll",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "bouda",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "gnoll-sergeant",
  "enumName": "MONS_GNOLL_SERGEANT",
  "name": "gnoll sergeant",
  "hd": 4,
  "hp10x": 260,
  "ac": 2,
  "ev": 9,
  "will": 20,
  "exp": 86,
  "attacks": [
   {
    "type": "hit",
    "damage": 11,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "j",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "gnoll",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "gnoll",
  "enumName": "MONS_GNOLL",
  "name": "gnoll",
  "hd": 2,
  "hp10x": 130,
  "ac": 2,
  "ev": 9,
  "will": 10,
  "exp": 14,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "j",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "goblin-rider",
  "enumName": "MONS_GOBLIN_RIDER",
  "name": "goblin rider",
  "hd": 5,
  "hp10x": 295,
  "ac": 4,
  "ev": 10,
  "will": 10,
  "exp": 308,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "g",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "goblin",
  "flags": [
   "flies",
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "goblin",
  "enumName": "MONS_GOBLIN",
  "name": "goblin",
  "hd": 1,
  "hp10x": 40,
  "ac": 0,
  "ev": 12,
  "will": 0,
  "exp": 1,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "g",
  "colour": "lightgray",
  "spriteKey": "enemy_goblin",
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "god-wrath-avatar",
  "enumName": "MONS_GOD_WRATH_AVATAR",
  "name": "god wrath avatar",
  "hd": 1000,
  "hp10x": 10000000,
  "ac": 0,
  "ev": 0,
  "will": 20,
  "exp": 15,
  "attacks": [],
  "speed": 10,
  "glyph": "X",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "holy"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "fast_regen",
   "no_poly_to",
   "no_threat"
  ],
  "resists": {
   "neg": 3
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "golden-dragon",
  "enumName": "MONS_GOLDEN_DRAGON",
  "name": "golden dragon",
  "hd": 18,
  "hp10x": 1080,
  "ac": 15,
  "ev": 7,
  "will": 180,
  "exp": 2457,
  "attacks": [
   {
    "type": "bite",
    "damage": 40,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "trample",
    "damage": 20,
    "flavour": "trample"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "warm_blood"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 1,
   "cold": 1
  },
  "spells": "golden_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "golden-eye",
  "enumName": "MONS_GOLDEN_EYE",
  "name": "golden eye",
  "hd": 6,
  "hp10x": 120,
  "ac": 0,
  "ev": 20,
  "will": 60,
  "exp": 190,
  "attacks": [],
  "speed": 13,
  "glyph": "G",
  "colour": "etc_gold",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "floating_eye",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "batty",
   "no_skeleton"
  ],
  "resists": {
   "corr": 3
  },
  "spells": "golden_eye",
  "uses": null,
  "habitat": null
 },
 {
  "id": "golem",
  "enumName": "MONS_GOLEM",
  "name": "golem",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "9",
  "colour": "lightgray",
  "spriteKey": "enemy_golem",
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "goliath-frog",
  "enumName": "MONS_GOLIATH_FROG",
  "name": "goliath frog",
  "hd": 12,
  "hp10x": 420,
  "ac": 3,
  "ev": 16,
  "will": 60,
  "exp": 749,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "reach_tongue"
   }
  ],
  "speed": 12,
  "glyph": "F",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "quadruped_tailless",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "frog",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "great-orb-of-eyes",
  "enumName": "MONS_GREAT_ORB_OF_EYES",
  "name": "great orb of eyes",
  "hd": 13,
  "hp10x": 660,
  "ac": 10,
  "ev": 3,
  "will": 120,
  "exp": 878,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "G",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "orb",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "floating_eye",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "no_skeleton"
  ],
  "resists": {
   "corr": 3
  },
  "spells": "great_orb_of_eyes",
  "uses": null,
  "habitat": null
 },
 {
  "id": "green-death",
  "enumName": "MONS_GREEN_DEATH",
  "name": "green death",
  "hd": 13,
  "hp10x": 715,
  "ac": 5,
  "ev": 7,
  "will": 160,
  "exp": 928,
  "attacks": [
   {
    "type": "hit",
    "damage": 32,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "2",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis"
  ],
  "resists": {
   "poison": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "green_death",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "green-draconian",
  "enumName": "MONS_GREEN_DRACONIAN",
  "name": "green draconian",
  "hd": 14,
  "hp10x": 980,
  "ac": 9,
  "ev": 10,
  "will": 40,
  "exp": 1045,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "sting",
    "damage": 15,
    "flavour": "poison"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "draconian",
  "species": null,
  "flags": [
   "speaks",
   "cold_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "grey-draconian",
  "enumName": "MONS_GREY_DRACONIAN",
  "name": "grey draconian",
  "hd": 14,
  "hp10x": 980,
  "ac": 16,
  "ev": 10,
  "will": 40,
  "exp": 1054,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "tail_slap",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "draconian",
  "species": null,
  "flags": [
   "speaks",
   "cold_blood",
   "no_poly_to"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "grinder",
  "enumName": "MONS_GRINDER",
  "name": "Grinder",
  "hd": 6,
  "hp10x": 390,
  "ac": 3,
  "ev": 11,
  "will": 20,
  "exp": 279,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "pain"
   }
  ],
  "speed": 10,
  "glyph": "5",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": "shadow_imp",
  "flags": [
   "no_ht_wand",
   "speaks",
   "unique",
   "female"
  ],
  "resists": {
   "poison": 1,
   "cold": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "grinder",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "grum",
  "enumName": "MONS_GRUM",
  "name": "Grum",
  "hd": 4,
  "hp10x": 400,
  "ac": 2,
  "ev": 9,
  "will": 10,
  "exp": 191,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "j",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "gnoll",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "grunn",
  "enumName": "MONS_GRUNN",
  "name": "Grunn",
  "hd": 16,
  "hp10x": 2000,
  "ac": 6,
  "ev": 6,
  "will": 100,
  "exp": 1718,
  "attacks": [
   {
    "type": "hit",
    "damage": 50,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "j",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "gnoll",
  "flags": [
   "speaks",
   "unique",
   "male",
   "no_zombie"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "guardian-mummy",
  "enumName": "MONS_GUARDIAN_MUMMY",
  "name": "guardian mummy",
  "hd": 7,
  "hp10x": 455,
  "ac": 6,
  "ev": 9,
  "will": 40,
  "exp": 328,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 8,
  "glyph": "M",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "mummy",
  "flags": [
   "fighter"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "guardian-serpent",
  "enumName": "MONS_GUARDIAN_SERPENT",
  "name": "guardian serpent",
  "hd": 8,
  "hp10x": 440,
  "ac": 6,
  "ev": 14,
  "will": 60,
  "exp": 456,
  "attacks": [
   {
    "type": "hit",
    "damage": 26,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "S",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "snake",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "guardian_serpent",
  "uses": null,
  "habitat": null
 },
 {
  "id": "guardian-sphinx",
  "enumName": "MONS_GUARDIAN_SPHINX",
  "name": "guardian sphinx",
  "hd": 18,
  "hp10x": 1080,
  "ac": 10,
  "ev": 6,
  "will": 80,
  "exp": 1729,
  "attacks": [
   {
    "type": "bite",
    "damage": 30,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "H",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "sphinx",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "guardian_sphinx",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "halazid-warlock",
  "enumName": "MONS_HALAZID_WARLOCK",
  "name": "halazid warlock",
  "hd": 18,
  "hp10x": 750,
  "ac": 8,
  "ev": 12,
  "will": 100,
  "exp": 998,
  "attacks": [
   {
    "type": "touch",
    "damage": 20,
    "flavour": "pain"
   }
  ],
  "speed": 10,
  "glyph": "L",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "lich",
  "flags": [
   "see_invis",
   "speaks"
  ],
  "resists": {
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "halazid_warlock",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "halfling",
  "enumName": "MONS_HALFLING",
  "name": "halfling",
  "hd": 3,
  "hp10x": 105,
  "ac": 2,
  "ev": 12,
  "will": 10,
  "exp": 30,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "harold",
  "enumName": "MONS_HAROLD",
  "name": "Harold",
  "hd": 9,
  "hp10x": 765,
  "ac": 0,
  "ev": 8,
  "will": 60,
  "exp": 875,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "harold",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "harpy",
  "enumName": "MONS_HARPY",
  "name": "harpy",
  "hd": 7,
  "hp10x": 385,
  "ac": 2,
  "ev": 10,
  "will": 20,
  "exp": 622,
  "attacks": [
   {
    "type": "claw",
    "damage": 19,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 25,
  "glyph": "H",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "batty",
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "haunted-armour",
  "enumName": "MONS_HAUNTED_ARMOUR",
  "name": "haunted armour",
  "hd": 10,
  "hp10x": 320,
  "ac": 13,
  "ev": 10,
  "will": "invuln",
  "exp": 10,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "trickster"
   }
  ],
  "speed": 10,
  "glyph": "[",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "unblindable",
   "fighter"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "headmaster",
  "enumName": "MONS_HEADMASTER",
  "name": "Head Instructor",
  "hd": 20,
  "hp10x": 1500,
  "ac": 0,
  "ev": 18,
  "will": 100,
  "exp": 3034,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "@",
  "colour": "etc_iron",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood",
   "two_weapons"
  ],
  "resists": {},
  "spells": "headmaster",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "hell-hog",
  "enumName": "MONS_HELL_HOG",
  "name": "hell hog",
  "hd": 11,
  "hp10x": 595,
  "ac": 2,
  "ev": 9,
  "will": 40,
  "exp": 804,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "h",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "demonic"
  ],
  "genus": "hog",
  "species": null,
  "flags": [],
  "resists": {
   "fire": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "hell_hog",
  "uses": null,
  "habitat": null
 },
 {
  "id": "hell-hound",
  "enumName": "MONS_HELL_HOUND",
  "name": "hell hound",
  "hd": 5,
  "hp10x": 275,
  "ac": 6,
  "ev": 13,
  "will": 20,
  "exp": 146,
  "attacks": [
   {
    "type": "bite",
    "damage": 13,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "h",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "demonic"
  ],
  "genus": "hound",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable"
  ],
  "resists": {
   "fire": 3,
   "cold": -1,
   "neg": 3,
   "torment": 1
  },
  "spells": "hell_hound",
  "uses": null,
  "habitat": null
 },
 {
  "id": "hell-knight",
  "enumName": "MONS_HELL_KNIGHT",
  "name": "hell knight",
  "hd": 10,
  "hp10x": 650,
  "ac": 0,
  "ev": 10,
  "will": 40,
  "exp": 781,
  "attacks": [
   {
    "type": "hit",
    "damage": 26,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "red",
  "spriteKey": "enemy_hell_knight",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "fire": 3
  },
  "spells": "hell_knight",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "hell-lord",
  "enumName": "MONS_HELL_LORD",
  "name": "hell lord",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "&",
  "colour": "colour_undef",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "hell-rat",
  "enumName": "MONS_HELL_RAT",
  "name": "hell rat",
  "hd": 3,
  "hp10x": 165,
  "ac": 7,
  "ev": 10,
  "will": 20,
  "exp": 34,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "drain"
   }
  ],
  "speed": 12,
  "glyph": "r",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "demonic"
  ],
  "genus": "rat",
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "hell-sentinel",
  "enumName": "MONS_HELL_SENTINEL",
  "name": "Hell Sentinel",
  "hd": 19,
  "hp10x": 1425,
  "ac": 25,
  "ev": 3,
  "will": "invuln",
  "exp": 1822,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "1",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis"
  ],
  "resists": {
   "elec": 3,
   "poison": 3,
   "fire": 3,
   "cold": 3,
   "damnation": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "hell_sentinel",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "hellbinder",
  "enumName": "MONS_HELLBINDER",
  "name": "Hellbinder",
  "hd": 20,
  "hp10x": 1500,
  "ac": 0,
  "ev": 13,
  "will": 100,
  "exp": 2274,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "etc_fire",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "hellbinder",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "hellephant",
  "enumName": "MONS_HELLEPHANT",
  "name": "hellephant",
  "hd": 20,
  "hp10x": 1700,
  "ac": 13,
  "ev": 10,
  "will": 140,
  "exp": 1931,
  "attacks": [
   {
    "type": "trample",
    "damage": 45,
    "flavour": "trample"
   },
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "gore",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Y",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "demonic"
  ],
  "genus": "elephant",
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {
   "neg": 3,
   "torment": 1
  },
  "spells": "hellephant",
  "uses": null,
  "habitat": null
 },
 {
  "id": "hellfire-mortar",
  "enumName": "MONS_HELLFIRE_MORTAR",
  "name": "hellfire mortar",
  "hd": 10,
  "hp10x": 1500,
  "ac": 20,
  "ev": 0,
  "will": "invuln",
  "exp": 1650,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "see_invis",
   "stationary",
   "peripheral",
   "no_regen",
   "unstable"
  ],
  "resists": {
   "elec": 1,
   "fire": 3,
   "cold": 1,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "hellfire_mortar",
  "uses": null,
  "habitat": "lava"
 },
 {
  "id": "hellion",
  "enumName": "MONS_HELLION",
  "name": "hellion",
  "hd": 7,
  "hp10x": 385,
  "ac": 5,
  "ev": 10,
  "will": 60,
  "exp": 384,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "2",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "poison": 1,
   "damnation": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "hellion",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "hellwing",
  "enumName": "MONS_HELLWING",
  "name": "hellwing",
  "hd": 7,
  "hp10x": 455,
  "ac": 16,
  "ev": 10,
  "will": 60,
  "exp": 294,
  "attacks": [
   {
    "type": "hit",
    "damage": 17,
    "flavour": "swoop"
   },
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "4",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "poison": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "hippogriff",
  "enumName": "MONS_HIPPOGRIFF",
  "name": "hippogriff",
  "hd": 7,
  "hp10x": 425,
  "ac": 2,
  "ev": 7,
  "will": 20,
  "exp": 263,
  "attacks": [
   {
    "type": "peck",
    "damage": 12,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 9,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 9,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "H",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {},
  "spells": "hippogriff",
  "uses": null,
  "habitat": null
 },
 {
  "id": "hoarfrost-cannon",
  "enumName": "MONS_HOARFROST_CANNON",
  "name": "hoarfrost cannon",
  "hd": 8,
  "hp10x": 340,
  "ac": 9,
  "ev": 0,
  "will": "invuln",
  "exp": 515,
  "attacks": [],
  "speed": 5,
  "glyph": "I",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "see_invis",
   "stationary",
   "no_regen"
  ],
  "resists": {
   "elec": 1,
   "fire": -1,
   "cold": 3,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "hoarfrost_cannon",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "hobgoblin",
  "enumName": "MONS_HOBGOBLIN",
  "name": "hobgoblin",
  "hd": 1,
  "hp10x": 55,
  "ac": 2,
  "ev": 10,
  "will": 0,
  "exp": 2,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "g",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "goblin",
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "hog",
  "enumName": "MONS_HOG",
  "name": "hog",
  "hd": 6,
  "hp10x": 330,
  "ac": 2,
  "ev": 9,
  "will": 20,
  "exp": 196,
  "attacks": [
   {
    "type": "bite",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 13,
  "glyph": "h",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "holy-swine",
  "enumName": "MONS_HOLY_SWINE",
  "name": "holy swine",
  "hd": 11,
  "hp10x": 605,
  "ac": 2,
  "ev": 9,
  "will": 40,
  "exp": 792,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "holy"
   }
  ],
  "speed": 14,
  "glyph": "h",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "holy"
  ],
  "genus": "hog",
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "neg": 3
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "hornet",
  "enumName": "MONS_HORNET",
  "name": "hornet",
  "hd": 6,
  "hp10x": 330,
  "ac": 6,
  "ev": 14,
  "will": 30,
  "exp": 282,
  "attacks": [
   {
    "type": "sting",
    "damage": 18,
    "flavour": "poison_paralyse"
   }
  ],
  "speed": 15,
  "glyph": "y",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "insect_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "hound",
  "enumName": "MONS_HOUND",
  "name": "hound",
  "hd": 3,
  "hp10x": 165,
  "ac": 2,
  "ev": 13,
  "will": 10,
  "exp": 42,
  "attacks": [
   {
    "type": "bite",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "h",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "unblindable",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "howler-monkey",
  "enumName": "MONS_HOWLER_MONKEY",
  "name": "howler monkey",
  "hd": 3,
  "hp10x": 185,
  "ac": 1,
  "ev": 11,
  "will": 10,
  "exp": 54,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "h",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid_tailed",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {},
  "spells": "howler_monkey",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "human",
  "enumName": "MONS_HUMAN",
  "name": "human",
  "hd": 6,
  "hp10x": 330,
  "ac": 3,
  "ev": 13,
  "will": 20,
  "exp": 197,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "hydra",
  "enumName": "MONS_HYDRA",
  "name": "hydra",
  "hd": 13,
  "hp10x": 715,
  "ac": 0,
  "ev": 5,
  "will": 60,
  "exp": 862,
  "attacks": [
   {
    "type": "bite",
    "damage": 18,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "lightgreen",
  "spriteKey": "enemy_hydra",
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cold_blood",
   "fast_regen"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "ice-beast",
  "enumName": "MONS_ICE_BEAST",
  "name": "ice beast",
  "hd": 5,
  "hp10x": 275,
  "ac": 5,
  "ev": 10,
  "will": 20,
  "exp": 130,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "cold"
   }
  ],
  "speed": 10,
  "glyph": "Y",
  "colour": "lightblue",
  "spriteKey": "enemy_ice_beast",
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "fire": -1,
   "cold": 3
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "ice-devil",
  "enumName": "MONS_ICE_DEVIL",
  "name": "ice devil",
  "hd": 8,
  "hp10x": 440,
  "ac": 12,
  "ev": 10,
  "will": 80,
  "exp": 341,
  "attacks": [
   {
    "type": "hit",
    "damage": 16,
    "flavour": "cold"
   }
  ],
  "speed": 10,
  "glyph": "4",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "poison": 1,
   "fire": -1,
   "cold": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "ice-dragon",
  "enumName": "MONS_ICE_DRAGON",
  "name": "ice dragon",
  "hd": 12,
  "hp10x": 900,
  "ac": 10,
  "ev": 8,
  "will": 40,
  "exp": 867,
  "attacks": [
   {
    "type": "bite",
    "damage": 17,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 17,
    "flavour": "plain"
   },
   {
    "type": "trample",
    "damage": 17,
    "flavour": "trample"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "white",
  "spriteKey": "enemy_ice_dragon",
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "cold_blood"
  ],
  "resists": {
   "poison": 1,
   "fire": -1,
   "cold": 2
  },
  "spells": "ice_dragon_breath",
  "uses": null,
  "habitat": null
 },
 {
  "id": "ice-fiend",
  "enumName": "MONS_ICE_FIEND",
  "name": "Ice Fiend",
  "hd": 18,
  "hp10x": 990,
  "ac": 15,
  "ev": 6,
  "will": "invuln",
  "exp": 1816,
  "attacks": [
   {
    "type": "claw",
    "damage": 25,
    "flavour": "cold"
   },
   {
    "type": "claw",
    "damage": 25,
    "flavour": "cold"
   }
  ],
  "speed": 10,
  "glyph": "1",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis"
  ],
  "resists": {
   "poison": 1,
   "fire": -1,
   "cold": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "ice_fiend",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "ice-statue",
  "enumName": "MONS_ICE_STATUE",
  "name": "ice statue",
  "hd": 8,
  "hp10x": 720,
  "ac": 12,
  "ev": 1,
  "will": "invuln",
  "exp": 452,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "statue",
  "species": null,
  "flags": [
   "speaks",
   "stationary"
  ],
  "resists": {
   "elec": 1,
   "fire": -1,
   "cold": 3,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "ice_statue",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "ignacio",
  "enumName": "MONS_IGNACIO",
  "name": "Ignacio",
  "hd": 18,
  "hp10x": 2520,
  "ac": 10,
  "ev": 15,
  "will": 160,
  "exp": 6807,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 20,
  "glyph": "1",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": "executioner",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "unique",
   "male"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "ignacio",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "iguana",
  "enumName": "MONS_IGUANA",
  "name": "iguana",
  "hd": 3,
  "hp10x": 165,
  "ac": 5,
  "ev": 9,
  "will": 10,
  "exp": 37,
  "attacks": [
   {
    "type": "bite",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "l",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "giant_lizard",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "ijyb",
  "enumName": "MONS_IJYB",
  "name": "Ijyb",
  "hd": 3,
  "hp10x": 240,
  "ac": 2,
  "ev": 12,
  "will": 10,
  "exp": 36,
  "attacks": [
   {
    "type": "hit",
    "damage": 4,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "g",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "goblin",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "female",
   "always_wand"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "ilsuiw",
  "enumName": "MONS_ILSUIW",
  "name": "Ilsuiw",
  "hd": 16,
  "hp10x": 1520,
  "ac": 5,
  "ev": 18,
  "will": 140,
  "exp": 1338,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "m",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "merfolk",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "ilsuiw",
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "imperial-myrmidon",
  "enumName": "MONS_IMPERIAL_MYRMIDON",
  "name": "imperial myrmidon",
  "hd": 16,
  "hp10x": 750,
  "ac": 1,
  "ev": 22,
  "will": 60,
  "exp": 1223,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "vuln"
   }
  ],
  "speed": 12,
  "glyph": "a",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "imperial_myrmidon",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "inugami",
  "enumName": "MONS_INUGAMI",
  "name": "inugami",
  "hd": 4,
  "hp10x": 55,
  "ac": 5,
  "ev": 13,
  "will": 40,
  "exp": 34,
  "attacks": [
   {
    "type": "bite",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 13,
  "glyph": "h",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "hound",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable",
   "warm_blood",
   "ghost_demon",
   "no_poly_to",
   "no_zombie",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "iron-dragon",
  "enumName": "MONS_IRON_DRAGON",
  "name": "iron dragon",
  "hd": 18,
  "hp10x": 1170,
  "ac": 20,
  "ev": 6,
  "will": 160,
  "exp": 1231,
  "attacks": [
   {
    "type": "bite",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "trample",
    "damage": 25,
    "flavour": "trample"
   }
  ],
  "speed": 8,
  "glyph": "D",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "see_invis",
   "warm_blood"
  ],
  "resists": {
   "poison": 1,
   "fire": 1,
   "cold": 1
  },
  "spells": "iron_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "iron-elemental",
  "enumName": "MONS_IRON_ELEMENTAL",
  "name": "iron elemental",
  "hd": 12,
  "hp10x": 1080,
  "ac": 20,
  "ev": 2,
  "will": "invuln",
  "exp": 822,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 6,
  "glyph": "E",
  "colour": "etc_iron",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": "elemental",
  "species": null,
  "flags": [],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "iron_elemental",
  "uses": null,
  "habitat": null
 },
 {
  "id": "iron-giant",
  "enumName": "MONS_IRON_GIANT",
  "name": "iron giant",
  "hd": 18,
  "hp10x": 1800,
  "ac": 18,
  "ev": 2,
  "will": 120,
  "exp": 1993,
  "attacks": [
   {
    "type": "hit",
    "damage": 65,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "poison": 1,
   "fire": 1,
   "cold": 1
  },
  "spells": "iron_giant",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "iron-golem",
  "enumName": "MONS_IRON_GOLEM",
  "name": "iron golem",
  "hd": 15,
  "hp10x": 2700,
  "ac": 24,
  "ev": 2,
  "will": "invuln",
  "exp": 940,
  "attacks": [
   {
    "type": "punch",
    "damage": 50,
    "flavour": "plain"
   },
   {
    "type": "punch",
    "damage": 50,
    "flavour": "plain"
   }
  ],
  "speed": 7,
  "glyph": "9",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "iron-imp",
  "enumName": "MONS_IRON_IMP",
  "name": "iron imp",
  "hd": 3,
  "hp10x": 165,
  "ac": 6,
  "ev": 8,
  "will": 10,
  "exp": 40,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 8,
  "glyph": "5",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 3,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "iron-troll",
  "enumName": "MONS_IRON_TROLL",
  "name": "iron troll",
  "hd": 16,
  "hp10x": 880,
  "ac": 20,
  "ev": 4,
  "will": 100,
  "exp": 762,
  "attacks": [
   {
    "type": "bite",
    "damage": 35,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 7,
  "glyph": "T",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "troll",
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "fast_regen"
  ],
  "resists": {
   "fire": 1,
   "cold": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "ironbound-beastmaster",
  "enumName": "MONS_IRONBOUND_BEASTMASTER",
  "name": "ironbound beastmaster",
  "hd": 13,
  "hp10x": 660,
  "ac": 0,
  "ev": 14,
  "will": 40,
  "exp": 948,
  "attacks": [
   {
    "type": "hit",
    "damage": 45,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood",
   "has_aura"
  ],
  "resists": {},
  "spells": "ironbound_beastmaster",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "ironbound-convoker",
  "enumName": "MONS_IRONBOUND_CONVOKER",
  "name": "ironbound convoker",
  "hd": 9,
  "hp10x": 495,
  "ac": 0,
  "ev": 10,
  "will": 40,
  "exp": 644,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "ironbound_convoker",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "ironbound-frostheart",
  "enumName": "MONS_IRONBOUND_FROSTHEART",
  "name": "ironbound frostheart",
  "hd": 11,
  "hp10x": 600,
  "ac": 0,
  "ev": 10,
  "will": 40,
  "exp": 808,
  "attacks": [
   {
    "type": "touch",
    "damage": 25,
    "flavour": "cold"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "cold": 1
  },
  "spells": "ironbound_frostheart",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "ironbound-mechanist",
  "enumName": "MONS_IRONBOUND_MECHANIST",
  "name": "ironbound mechanist",
  "hd": 13,
  "hp10x": 645,
  "ac": 1,
  "ev": 13,
  "will": 80,
  "exp": 1000,
  "attacks": [
   {
    "type": "hit",
    "damage": 22,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 22,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "g",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "goblin",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "two_weapons"
  ],
  "resists": {},
  "spells": "ironbound_mechanist",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "ironbound-preserver",
  "enumName": "MONS_IRONBOUND_PRESERVER",
  "name": "ironbound preserver",
  "hd": 14,
  "hp10x": 1120,
  "ac": 0,
  "ev": 6,
  "will": 40,
  "exp": 1118,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "ironbound_preserver",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "ironbound-thunderhulk",
  "enumName": "MONS_IRONBOUND_THUNDERHULK",
  "name": "ironbound thunderhulk",
  "hd": 18,
  "hp10x": 880,
  "ac": 1,
  "ev": 8,
  "will": 40,
  "exp": 1070,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "O",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "ogre",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "ironbound_thunderhulk",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "jackal",
  "enumName": "MONS_JACKAL",
  "name": "jackal",
  "hd": 1,
  "hp10x": 55,
  "ac": 2,
  "ev": 12,
  "will": 0,
  "exp": 2,
  "attacks": [
   {
    "type": "bite",
    "damage": 3,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "h",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "hound",
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "jelly",
  "enumName": "MONS_JELLY",
  "name": "jelly",
  "hd": 3,
  "hp10x": 165,
  "ac": 0,
  "ev": 2,
  "will": 10,
  "exp": 42,
  "attacks": [
   {
    "type": "hit",
    "damage": 3,
    "flavour": "acid"
   }
  ],
  "speed": 10,
  "glyph": "J",
  "colour": "lightred",
  "spriteKey": "enemy_jelly",
  "sizePixels": 18,
  "size": "small",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "eat_doors",
   "see_invis",
   "unblindable",
   "splits",
   "amorphous",
   "acid_splash",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "jeremiah",
  "enumName": "MONS_JEREMIAH",
  "name": "Jeremiah",
  "hd": 8,
  "hp10x": 450,
  "ac": 2,
  "ev": 12,
  "will": 40,
  "exp": 386,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "F",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "frog",
  "species": "barachi",
  "flags": [
   "speaks",
   "unique",
   "gender_neutral"
  ],
  "resists": {},
  "spells": "jeremiah",
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "jessica",
  "enumName": "MONS_JESSICA",
  "name": "Jessica",
  "hd": 1,
  "hp10x": 95,
  "ac": 0,
  "ev": 10,
  "will": 10,
  "exp": 37,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "jessica",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "jiangshi",
  "enumName": "MONS_JIANGSHI",
  "name": "jiangshi",
  "hd": 10,
  "hp10x": 650,
  "ac": 10,
  "ev": 10,
  "will": 80,
  "exp": 909,
  "attacks": [
   {
    "type": "claw",
    "damage": 27,
    "flavour": "vampiric"
   },
   {
    "type": "claw",
    "damage": 27,
    "flavour": "vampiric"
   }
  ],
  "speed": 18,
  "glyph": "V",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "animal",
  "holiness": [
   "undead"
  ],
  "genus": "jiangshi",
  "species": "vampire",
  "flags": [
   "fighter"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "jorgrun",
  "enumName": "MONS_JORGRUN",
  "name": "Jorgrun",
  "hd": 15,
  "hp10x": 1200,
  "ac": 2,
  "ev": 15,
  "will": 120,
  "exp": 1873,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "g",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "dwarf",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "jorgrun",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "jorogumo",
  "enumName": "MONS_JOROGUMO",
  "name": "jorogumo",
  "hd": 12,
  "hp10x": 850,
  "ac": 4,
  "ev": 14,
  "will": 60,
  "exp": 847,
  "attacks": [
   {
    "type": "hit",
    "damage": 28,
    "flavour": "poison_paralyse"
   }
  ],
  "speed": 12,
  "glyph": "H",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "arachnid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "web_immune",
   "warm_blood"
  ],
  "resists": {},
  "spells": "jorogumo",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "jory",
  "enumName": "MONS_JORY",
  "name": "Jory",
  "hd": 18,
  "hp10x": 1800,
  "ac": 10,
  "ev": 15,
  "will": 160,
  "exp": 2381,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   },
   {
    "type": "bite",
    "damage": 15,
    "flavour": "vampiric"
   }
  ],
  "speed": 10,
  "glyph": "V",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "vampire",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "jory",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "joseph",
  "enumName": "MONS_JOSEPH",
  "name": "Joseph",
  "hd": 6,
  "hp10x": 660,
  "ac": 0,
  "ev": 10,
  "will": 40,
  "exp": 461,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "unique",
   "archer",
   "male"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "josephina",
  "enumName": "MONS_JOSEPHINA",
  "name": "Josephina",
  "hd": 21,
  "hp10x": 1500,
  "ac": 10,
  "ev": 21,
  "will": "invuln",
  "exp": 3438,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "cold"
   },
   {
    "type": "touch",
    "damage": 15,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "L",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "lich",
  "flags": [
   "see_invis",
   "speaks",
   "unique",
   "female"
  ],
  "resists": {
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "josephina",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "josephine",
  "enumName": "MONS_JOSEPHINE",
  "name": "Josephine",
  "hd": 10,
  "hp10x": 700,
  "ac": 0,
  "ev": 10,
  "will": 60,
  "exp": 912,
  "attacks": [
   {
    "type": "hit",
    "damage": 11,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {
   "neg": 3
  },
  "spells": "josephine",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "juggernaut",
  "enumName": "MONS_JUGGERNAUT",
  "name": "juggernaut",
  "hd": 20,
  "hp10x": 1700,
  "ac": 20,
  "ev": 5,
  "will": 120,
  "exp": 3979,
  "attacks": [
   {
    "type": "hit",
    "damage": 80,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "C",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "jumping-spider",
  "enumName": "MONS_JUMPING_SPIDER",
  "name": "jumping spider",
  "hd": 8,
  "hp10x": 320,
  "ac": 6,
  "ev": 12,
  "will": 20,
  "exp": 272,
  "attacks": [
   {
    "type": "pounce",
    "damage": 20,
    "flavour": "ensnare"
   },
   {
    "type": "bite",
    "damage": 8,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "s",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "arachnid",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "spider",
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": "jumping_spider",
  "uses": null,
  "habitat": null
 },
 {
  "id": "khufu",
  "enumName": "MONS_KHUFU",
  "name": "Khufu",
  "hd": 18,
  "hp10x": 2430,
  "ac": 10,
  "ev": 6,
  "will": 160,
  "exp": 4893,
  "attacks": [
   {
    "type": "hit",
    "damage": 35,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "M",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "mummy",
  "flags": [
   "see_invis",
   "speaks",
   "unique",
   "male"
  ],
  "resists": {
   "elec": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "khufu",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "killer-bee",
  "enumName": "MONS_KILLER_BEE",
  "name": "killer bee",
  "hd": 3,
  "hp10x": 165,
  "ac": 2,
  "ev": 18,
  "will": 10,
  "exp": 62,
  "attacks": [
   {
    "type": "sting",
    "damage": 10,
    "flavour": "poison"
   }
  ],
  "speed": 20,
  "glyph": "y",
  "colour": "brown",
  "spriteKey": "enemy_killer_bee",
  "sizePixels": 12,
  "size": "tiny",
  "shape": "insect_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "killer-klown",
  "enumName": "MONS_KILLER_KLOWN",
  "name": "Killer Klown",
  "hd": 20,
  "hp10x": 1500,
  "ac": 10,
  "ev": 15,
  "will": 160,
  "exp": 3010,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 13,
  "glyph": "p",
  "colour": "etc_random",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "human",
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": "killer_klown",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "kirke",
  "enumName": "MONS_KIRKE",
  "name": "Kirke",
  "hd": 16,
  "hp10x": 1120,
  "ac": 0,
  "ev": 10,
  "will": 100,
  "exp": 1439,
  "attacks": [
   {
    "type": "hit",
    "damage": 18,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "kirke",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "kobold-blastminer",
  "enumName": "MONS_KOBOLD_BLASTMINER",
  "name": "kobold blastminer",
  "hd": 8,
  "hp10x": 390,
  "ac": 4,
  "ev": 14,
  "will": 20,
  "exp": 466,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "K",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "kobold",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "kobold_blastminer",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "kobold-brigand",
  "enumName": "MONS_KOBOLD_BRIGAND",
  "name": "kobold brigand",
  "hd": 5,
  "hp10x": 275,
  "ac": 3,
  "ev": 12,
  "will": 20,
  "exp": 98,
  "attacks": [
   {
    "type": "hit",
    "damage": 7,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "K",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "kobold",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "kobold-demonologist",
  "enumName": "MONS_KOBOLD_DEMONOLOGIST",
  "name": "kobold demonologist",
  "hd": 6,
  "hp10x": 390,
  "ac": 2,
  "ev": 13,
  "will": 40,
  "exp": 370,
  "attacks": [
   {
    "type": "hit",
    "damage": 4,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "K",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "kobold",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "kobold_demonologist",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "kobold-fleshcrafter",
  "enumName": "MONS_KOBOLD_FLESHCRAFTER",
  "name": "kobold fleshcrafter",
  "hd": 13,
  "hp10x": 660,
  "ac": 8,
  "ev": 16,
  "will": 60,
  "exp": 955,
  "attacks": [
   {
    "type": "hit",
    "damage": 24,
    "flavour": "plain"
   },
   {
    "type": "tentacle_slap",
    "damage": 16,
    "flavour": "poison"
   }
  ],
  "speed": 10,
  "glyph": "K",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "kobold",
  "flags": [
   "speaks",
   "warm_blood",
   "fast_regen"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "kobold_fleshcrafter",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "kobold-geomancer",
  "enumName": "MONS_KOBOLD_GEOMANCER",
  "name": "kobold geomancer",
  "hd": 5,
  "hp10x": 290,
  "ac": 2,
  "ev": 13,
  "will": 20,
  "exp": 135,
  "attacks": [
   {
    "type": "hit",
    "damage": 4,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "K",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "kobold",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "kobold_geomancer",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "kobold",
  "enumName": "MONS_KOBOLD",
  "name": "kobold",
  "hd": 1,
  "hp10x": 35,
  "ac": 2,
  "ev": 12,
  "will": 0,
  "exp": 1,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "K",
  "colour": "brown",
  "spriteKey": "enemy_kobold",
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "komodo-dragon",
  "enumName": "MONS_KOMODO_DRAGON",
  "name": "komodo dragon",
  "hd": 8,
  "hp10x": 440,
  "ac": 7,
  "ev": 8,
  "will": 40,
  "exp": 361,
  "attacks": [
   {
    "type": "bite",
    "damage": 34,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "l",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "giant_lizard",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "kraken-tentacle-segment",
  "enumName": "MONS_KRAKEN_TENTACLE_SEGMENT",
  "name": "tentacle segment",
  "hd": 12,
  "hp10x": 480,
  "ac": 5,
  "ev": 7,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 18,
  "glyph": "*",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "kraken",
  "species": null,
  "flags": [
   "flies",
   "stationary",
   "cold_blood",
   "no_exp_gain",
   "no_poly_to",
   "no_threat",
   "peripheral"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "kraken-tentacle",
  "enumName": "MONS_KRAKEN_TENTACLE",
  "name": "tentacle",
  "hd": 12,
  "hp10x": 480,
  "ac": 5,
  "ev": 7,
  "will": "invuln",
  "exp": 0,
  "attacks": [
   {
    "type": "tentacle_slap",
    "damage": 29,
    "flavour": "plain"
   }
  ],
  "speed": 17,
  "glyph": "w",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "kraken",
  "species": null,
  "flags": [
   "flies",
   "stationary",
   "cold_blood",
   "no_exp_gain",
   "no_poly_to",
   "peripheral"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "kraken",
  "enumName": "MONS_KRAKEN",
  "name": "kraken",
  "hd": 16,
  "hp10x": 2080,
  "ac": 20,
  "ev": 0,
  "will": 60,
  "exp": 1525,
  "attacks": [
   {
    "type": "bite",
    "damage": 50,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "X",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cold_blood",
   "no_skeleton"
  ],
  "resists": {},
  "spells": "kraken",
  "uses": null,
  "habitat": "deep_water"
 },
 {
  "id": "laughing-skull",
  "enumName": "MONS_LAUGHING_SKULL",
  "name": "laughing skull",
  "hd": 5,
  "hp10x": 240,
  "ac": 4,
  "ev": 18,
  "will": 20,
  "exp": 125,
  "attacks": [
   {
    "type": "headbutt",
    "damage": 16,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "z",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "fire": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "laughing_skull",
  "uses": null,
  "habitat": null
 },
 {
  "id": "lava-snake",
  "enumName": "MONS_LAVA_SNAKE",
  "name": "lava snake",
  "hd": 3,
  "hp10x": 165,
  "ac": 2,
  "ev": 17,
  "will": 10,
  "exp": 48,
  "attacks": [
   {
    "type": "bite",
    "damage": 7,
    "flavour": "fire"
   }
  ],
  "speed": 10,
  "glyph": "S",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "snake",
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {
   "fire": 3,
   "cold": -1
  },
  "spells": "lava_snake",
  "uses": null,
  "habitat": "lava"
 },
 {
  "id": "lemure",
  "enumName": "MONS_LEMURE",
  "name": "lemure",
  "hd": 5,
  "hp10x": 275,
  "ac": 4,
  "ev": 12,
  "will": 20,
  "exp": 106,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "5",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks"
  ],
  "resists": {
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "lernaean-hydra",
  "enumName": "MONS_LERNAEAN_HYDRA",
  "name": "Lernaean hydra",
  "hd": 30,
  "hp10x": 1500,
  "ac": 0,
  "ev": 5,
  "will": 120,
  "exp": 3031,
  "attacks": [
   {
    "type": "bite",
    "damage": 18,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "hydra",
  "flags": [
   "name_the",
   "cold_blood",
   "unique",
   "fast_regen",
   "tall_tile"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "lich",
  "enumName": "MONS_LICH",
  "name": "lich",
  "hd": 20,
  "hp10x": 800,
  "ac": 10,
  "ev": 10,
  "will": "invuln",
  "exp": 1745,
  "attacks": [
   {
    "type": "touch",
    "damage": 15,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "L",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks"
  ],
  "resists": {
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "lich",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "lightning-spire",
  "enumName": "MONS_LIGHTNING_SPIRE",
  "name": "lightning spire",
  "hd": 10,
  "hp10x": 700,
  "ac": 13,
  "ev": 3,
  "will": "invuln",
  "exp": 613,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "etc_electricity",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_poly_to"
  ],
  "resists": {
   "elec": 3,
   "fire": 2,
   "cold": 2,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "zapper",
  "uses": null,
  "habitat": null
 },
 {
  "id": "lindwurm",
  "enumName": "MONS_LINDWURM",
  "name": "lindwurm",
  "hd": 9,
  "hp10x": 495,
  "ac": 8,
  "ev": 6,
  "will": 40,
  "exp": 644,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 10,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "k",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "drake",
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {},
  "spells": "lindwurm",
  "uses": null,
  "habitat": null
 },
 {
  "id": "living-spell",
  "enumName": "MONS_LIVING_SPELL",
  "name": "living spell",
  "hd": 1,
  "hp10x": 3,
  "ac": 0,
  "ev": 5,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "*",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "no_exp_gain"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "lodul",
  "enumName": "MONS_LODUL",
  "name": "Lodul",
  "hd": 6,
  "hp10x": 700,
  "ac": 3,
  "ev": 7,
  "will": 40,
  "exp": 754,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "O",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "ogre",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "lodul",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "lom-lobon",
  "enumName": "MONS_LOM_LOBON",
  "name": "Lom Lobon",
  "hd": 19,
  "hp10x": 3895,
  "ac": 10,
  "ev": 20,
  "will": "invuln",
  "exp": 6087,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "antimagic"
   }
  ],
  "speed": 10,
  "glyph": "&",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "pandemonium_lord",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks",
   "unique",
   "tall_tile",
   "gender_neutral"
  ],
  "resists": {
   "elec": 3,
   "poison": 1,
   "fire": 1,
   "cold": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "lom_lobon",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "lost-soul",
  "enumName": "MONS_LOST_SOUL",
  "name": "lost soul",
  "hd": 10,
  "hp10x": 250,
  "ac": 0,
  "ev": 10,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 13,
  "glyph": "*",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial",
   "no_exp_gain",
   "maintain_range"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "louise",
  "enumName": "MONS_LOUISE",
  "name": "Louise",
  "hd": 13,
  "hp10x": 1040,
  "ac": 0,
  "ev": 10,
  "will": 80,
  "exp": 1207,
  "attacks": [
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "louise",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "lurking-horror",
  "enumName": "MONS_LURKING_HORROR",
  "name": "lurking horror",
  "hd": 1,
  "hp10x": 10,
  "ac": 0,
  "ev": 10,
  "will": 10,
  "exp": 0,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "*",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "no_exp_gain"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "maggie",
  "enumName": "MONS_MAGGIE",
  "name": "Maggie",
  "hd": 5,
  "hp10x": 600,
  "ac": 0,
  "ev": 10,
  "will": 20,
  "exp": 399,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "maggie",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "malarious-merfolk-avatar",
  "enumName": "MONS_MALARIOUS_MERFOLK_AVATAR",
  "name": "malarious merfolk avatar",
  "hd": 3,
  "hp10x": 195,
  "ac": 4,
  "ev": 12,
  "will": 120,
  "exp": 31,
  "attacks": [],
  "speed": 10,
  "glyph": "m",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "merfolk",
  "flags": [
   "speaks",
   "warm_blood",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": "merfolk_avatar",
  "uses": "open_doors",
  "habitat": "amphibious"
 },
 {
  "id": "mana-viper",
  "enumName": "MONS_MANA_VIPER",
  "name": "mana viper",
  "hd": 10,
  "hp10x": 495,
  "ac": 3,
  "ev": 14,
  "will": 100,
  "exp": 718,
  "attacks": [
   {
    "type": "bite",
    "damage": 23,
    "flavour": "antimagic"
   }
  ],
  "speed": 14,
  "glyph": "S",
  "colour": "magenta",
  "spriteKey": "enemy_mana_viper",
  "sizePixels": 22,
  "size": "medium",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "snake",
  "species": null,
  "flags": [
   "see_invis",
   "cold_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "manticore",
  "enumName": "MONS_MANTICORE",
  "name": "manticore",
  "hd": 9,
  "hp10x": 495,
  "ac": 5,
  "ev": 7,
  "will": 40,
  "exp": 529,
  "attacks": [
   {
    "type": "bite",
    "damage": 26,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 14,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "H",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {},
  "spells": "manticore",
  "uses": null,
  "habitat": null
 },
 {
  "id": "mara",
  "enumName": "MONS_MARA",
  "name": "Mara",
  "hd": 18,
  "hp10x": 1440,
  "ac": 10,
  "ev": 14,
  "will": 140,
  "exp": 4630,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": "rakshasa",
  "flags": [
   "see_invis",
   "speaks",
   "unique",
   "male",
   "two_weapons"
  ],
  "resists": {
   "poison": 1,
   "fire": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "mara",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "margery",
  "enumName": "MONS_MARGERY",
  "name": "Margery",
  "hd": 22,
  "hp10x": 1650,
  "ac": 0,
  "ev": 10,
  "will": 140,
  "exp": 2809,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "margery",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "marrowcuda",
  "enumName": "MONS_MARROWCUDA",
  "name": "marrowcuda",
  "hd": 4,
  "hp10x": 235,
  "ac": 4,
  "ev": 11,
  "will": 10,
  "exp": 73,
  "attacks": [
   {
    "type": "bite",
    "damage": 8,
    "flavour": "swarm"
   }
  ],
  "speed": 13,
  "glyph": "F",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "fish",
  "intelligence": "animal",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "martyred-shade",
  "enumName": "MONS_MARTYRED_SHADE",
  "name": "martyred shade",
  "hd": 11,
  "hp10x": 320,
  "ac": 8,
  "ev": 18,
  "will": 60,
  "exp": 307,
  "attacks": [],
  "speed": 7,
  "glyph": "W",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "phantom",
  "species": null,
  "flags": [
   "flies",
   "speaks",
   "insubstantial",
   "fast_regen",
   "has_aura"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "maurice",
  "enumName": "MONS_MAURICE",
  "name": "Maurice",
  "hd": 5,
  "hp10x": 600,
  "ac": 1,
  "ev": 13,
  "will": 40,
  "exp": 526,
  "attacks": [
   {
    "type": "hit",
    "damage": 9,
    "flavour": "steal"
   },
   {
    "type": "bite",
    "damage": 9,
    "flavour": "antimagic"
   }
  ],
  "speed": 10,
  "glyph": "f",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "vine_stalker",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "fast_regen",
   "male",
   "no_skeleton",
   "always_wand"
  ],
  "resists": {},
  "spells": "maurice",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "meliai",
  "enumName": "MONS_MELIAI",
  "name": "meliai",
  "hd": 7,
  "hp10x": 245,
  "ac": 2,
  "ev": 14,
  "will": 20,
  "exp": 484,
  "attacks": [
   {
    "type": "hit",
    "damage": 14,
    "flavour": "plain"
   },
   {
    "type": "sting",
    "damage": 12,
    "flavour": "poison"
   }
  ],
  "speed": 20,
  "glyph": "y",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "insect_winged",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "killer_bee",
  "species": null,
  "flags": [
   "flies",
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": "meliai",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "menkaure",
  "enumName": "MONS_MENKAURE",
  "name": "Menkaure",
  "hd": 3,
  "hp10x": 240,
  "ac": 3,
  "ev": 6,
  "will": 20,
  "exp": 171,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 8,
  "glyph": "M",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "mummy",
  "flags": [
   "see_invis",
   "speaks",
   "unique",
   "male"
  ],
  "resists": {
   "fire": -1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "menkaure",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "mennas",
  "enumName": "MONS_MENNAS",
  "name": "Mennas",
  "hd": 19,
  "hp10x": 1520,
  "ac": 15,
  "ev": 28,
  "will": 160,
  "exp": 4370,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "A",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "holy"
  ],
  "genus": null,
  "species": "angel",
  "flags": [
   "flies",
   "fighter",
   "speaks",
   "unique",
   "male"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "neg": 3
  },
  "spells": "mennas",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "merfolk-aquamancer",
  "enumName": "MONS_MERFOLK_AQUAMANCER",
  "name": "merfolk aquamancer",
  "hd": 14,
  "hp10x": 630,
  "ac": 0,
  "ev": 12,
  "will": 80,
  "exp": 829,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "m",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "merfolk",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "merfolk_aquamancer",
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "merfolk-avatar",
  "enumName": "MONS_MERFOLK_AVATAR",
  "name": "merfolk avatar",
  "hd": 13,
  "hp10x": 845,
  "ac": 4,
  "ev": 12,
  "will": 120,
  "exp": 842,
  "attacks": [],
  "speed": 10,
  "glyph": "m",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "merfolk",
  "flags": [
   "speaks",
   "warm_blood",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": "merfolk_avatar",
  "uses": "open_doors",
  "habitat": "amphibious"
 },
 {
  "id": "merfolk-impaler",
  "enumName": "MONS_MERFOLK_IMPALER",
  "name": "merfolk impaler",
  "hd": 12,
  "hp10x": 780,
  "ac": 0,
  "ev": 18,
  "will": 40,
  "exp": 915,
  "attacks": [
   {
    "type": "hit",
    "damage": 22,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "m",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "merfolk",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "merfolk-javelineer",
  "enumName": "MONS_MERFOLK_JAVELINEER",
  "name": "merfolk javelineer",
  "hd": 13,
  "hp10x": 730,
  "ac": 0,
  "ev": 12,
  "will": 60,
  "exp": 920,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "m",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "merfolk",
  "flags": [
   "speaks",
   "warm_blood",
   "archer",
   "prefer_ranged"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "merfolk-siren",
  "enumName": "MONS_MERFOLK_SIREN",
  "name": "merfolk siren",
  "hd": 9,
  "hp10x": 405,
  "ac": 4,
  "ev": 12,
  "will": 60,
  "exp": 469,
  "attacks": [
   {
    "type": "hit",
    "damage": 19,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "m",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "merfolk",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "merfolk_siren",
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "merfolk",
  "enumName": "MONS_MERFOLK",
  "name": "merfolk",
  "hd": 10,
  "hp10x": 550,
  "ac": 4,
  "ev": 12,
  "will": 40,
  "exp": 301,
  "attacks": [
   {
    "type": "hit",
    "damage": 22,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "m",
  "colour": "lightred",
  "spriteKey": "enemy_merfolk",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "meteoran",
  "enumName": "MONS_METEORAN",
  "name": "meteoran",
  "hd": 5,
  "hp10x": 375,
  "ac": 2,
  "ev": 12,
  "will": 20,
  "exp": 156,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "minotaur",
  "enumName": "MONS_MINOTAUR",
  "name": "minotaur",
  "hd": 14,
  "hp10x": 780,
  "ac": 6,
  "ev": 9,
  "will": 100,
  "exp": 989,
  "attacks": [
   {
    "type": "hit",
    "damage": 35,
    "flavour": "plain"
   },
   {
    "type": "gore",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "H",
  "colour": "lightred",
  "spriteKey": "enemy_minotaur",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "mlioglotl",
  "enumName": "MONS_MLIOGLOTL",
  "name": "Mlioglotl",
  "hd": 15,
  "hp10x": 1400,
  "ac": 10,
  "ev": 5,
  "will": 120,
  "exp": 1805,
  "attacks": [
   {
    "type": "trample",
    "damage": 25,
    "flavour": "trample"
   },
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "X",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "thrashing_horror",
  "species": null,
  "flags": [
   "speaks",
   "unique",
   "male"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "mlioglotl",
  "uses": null,
  "habitat": null
 },
 {
  "id": "mnoleg",
  "enumName": "MONS_MNOLEG",
  "name": "Mnoleg",
  "hd": 17,
  "hp10x": 4210,
  "ac": 11,
  "ev": 29,
  "will": "invuln",
  "exp": 6890,
  "attacks": [
   {
    "type": "random",
    "damage": 47,
    "flavour": "chaotic"
   },
   {
    "type": "random",
    "damage": 41,
    "flavour": "plain"
   },
   {
    "type": "random",
    "damage": 37,
    "flavour": "blink"
   }
  ],
  "speed": 13,
  "glyph": "&",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "pandemonium_lord",
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "unique",
   "tall_tile",
   "gender_neutral"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "mnoleg",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "molten-gargoyle",
  "enumName": "MONS_MOLTEN_GARGOYLE",
  "name": "molten gargoyle",
  "hd": 7,
  "hp10x": 315,
  "ac": 14,
  "ev": 7,
  "will": 60,
  "exp": 431,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "fire"
   }
  ],
  "speed": 10,
  "glyph": "9",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged_tailed",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "elec": 1,
   "fire": 3,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "molten_gargoyle",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "monarch-bomb",
  "enumName": "MONS_MONARCH_BOMB",
  "name": "monarch bomb",
  "hd": 14,
  "hp10x": 440,
  "ac": 14,
  "ev": 9,
  "will": "invuln",
  "exp": 800,
  "attacks": [
   {
    "type": "hit",
    "damage": 24,
    "flavour": "bomblet"
   }
  ],
  "speed": 13,
  "glyph": "E",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "fire": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "monarch_bomb",
  "uses": null,
  "habitat": null
 },
 {
  "id": "moon-troll",
  "enumName": "MONS_MOON_TROLL",
  "name": "moon troll",
  "hd": 17,
  "hp10x": 1170,
  "ac": 20,
  "ev": 4,
  "will": 140,
  "exp": 1763,
  "attacks": [
   {
    "type": "bite",
    "damage": 35,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "T",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "troll",
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "fast_regen",
   "no_poly_to",
   "no_gen_derived",
   "warded"
  ],
  "resists": {
   "poison": 1,
   "fire": 1,
   "cold": 1
  },
  "spells": "moon_troll",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "morphogenic-ooze",
  "enumName": "MONS_MORPHOGENIC_OOZE",
  "name": "morphogenic ooze",
  "hd": 18,
  "hp10x": 1165,
  "ac": 2,
  "ev": 23,
  "will": 80,
  "exp": 1362,
  "attacks": [
   {
    "type": "random",
    "damage": 41,
    "flavour": "slimify"
   },
   {
    "type": "random",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "J",
  "colour": "etc_mutagenic",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "eat_doors",
   "see_invis",
   "unblindable",
   "amorphous",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "fire": 1,
   "cold": 1,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "moth-of-wrath",
  "enumName": "MONS_MOTH_OF_WRATH",
  "name": "moth of wrath",
  "hd": 9,
  "hp10x": 495,
  "ac": 0,
  "ev": 10,
  "will": 40,
  "exp": 501,
  "attacks": [
   {
    "type": "bite",
    "damage": 25,
    "flavour": "rage"
   }
  ],
  "speed": 12,
  "glyph": "y",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "insect_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "moth",
  "species": null,
  "flags": [
   "flies",
   "web_immune",
   "no_skeleton"
  ],
  "resists": {},
  "spells": "moth_of_wrath",
  "uses": null,
  "habitat": null
 },
 {
  "id": "moth",
  "enumName": "MONS_MOTH",
  "name": "moth",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "y",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "mountainshell",
  "enumName": "MONS_MOUNTAINSHELL",
  "name": "mountainshell",
  "hd": 12,
  "hp10x": 610,
  "ac": 7,
  "ev": 2,
  "will": 80,
  "exp": 870,
  "attacks": [
   {
    "type": "headbutt",
    "damage": 24,
    "flavour": "plain"
   }
  ],
  "speed": 7,
  "glyph": "t",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_tailless",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cold_blood",
   "warded"
  ],
  "resists": {},
  "spells": "mountainshell",
  "uses": null,
  "habitat": null
 },
 {
  "id": "mummy-priest",
  "enumName": "MONS_MUMMY_PRIEST",
  "name": "mummy priest",
  "hd": 10,
  "hp10x": 650,
  "ac": 8,
  "ev": 7,
  "will": 120,
  "exp": 920,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 8,
  "glyph": "M",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "mummy",
  "flags": [
   "speaks"
  ],
  "resists": {
   "elec": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "mummy_priest",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "mummy",
  "enumName": "MONS_MUMMY",
  "name": "mummy",
  "hd": 3,
  "hp10x": 195,
  "ac": 3,
  "ev": 6,
  "will": 20,
  "exp": 18,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 6,
  "glyph": "M",
  "colour": "lightgray",
  "spriteKey": "enemy_mummy",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "fire": -1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "murray",
  "enumName": "MONS_MURRAY",
  "name": "Murray",
  "hd": 14,
  "hp10x": 1610,
  "ac": 30,
  "ev": 10,
  "will": "invuln",
  "exp": 1586,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "z",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "curse_skull",
  "flags": [
   "see_invis",
   "speaks",
   "unique",
   "male"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "murray",
  "uses": null,
  "habitat": null
 },
 {
  "id": "mutant-beast",
  "enumName": "MONS_MUTANT_BEAST",
  "name": "mutant beast",
  "hd": 15,
  "hp10x": 825,
  "ac": 8,
  "ev": 5,
  "will": 0,
  "exp": 25,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "H",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "naga-mage",
  "enumName": "MONS_NAGA_MAGE",
  "name": "naga mage",
  "hd": 7,
  "hp10x": 385,
  "ac": 6,
  "ev": 10,
  "will": 60,
  "exp": 443,
  "attacks": [
   {
    "type": "hit",
    "damage": 14,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 4,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "N",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "naga",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "naga",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "naga_mage",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "naga-ritualist",
  "enumName": "MONS_NAGA_RITUALIST",
  "name": "naga ritualist",
  "hd": 8,
  "hp10x": 600,
  "ac": 6,
  "ev": 10,
  "will": 60,
  "exp": 686,
  "attacks": [
   {
    "type": "hit",
    "damage": 14,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 4,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "N",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "naga",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "naga",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "naga_ritualist",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "naga-sharpshooter",
  "enumName": "MONS_NAGA_SHARPSHOOTER",
  "name": "naga sharpshooter",
  "hd": 9,
  "hp10x": 720,
  "ac": 6,
  "ev": 10,
  "will": 80,
  "exp": 790,
  "attacks": [
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 5,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "N",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "naga",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "naga",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "archer",
   "prefer_ranged"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "naga_sharpshooter",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "naga-warrior",
  "enumName": "MONS_NAGA_WARRIOR",
  "name": "naga warrior",
  "hd": 10,
  "hp10x": 750,
  "ac": 6,
  "ev": 10,
  "will": 80,
  "exp": 791,
  "attacks": [
   {
    "type": "hit",
    "damage": 24,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 5,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "N",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "naga",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "naga",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "naga_warrior",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "naga",
  "enumName": "MONS_NAGA",
  "name": "naga",
  "hd": 5,
  "hp10x": 275,
  "ac": 6,
  "ev": 10,
  "will": 40,
  "exp": 161,
  "attacks": [
   {
    "type": "hit",
    "damage": 22,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 4,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "N",
  "colour": "green",
  "spriteKey": "enemy_naga",
  "sizePixels": 26,
  "size": "large",
  "shape": "naga",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "naga",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "nagaraja",
  "enumName": "MONS_NAGARAJA",
  "name": "nagaraja",
  "hd": 15,
  "hp10x": 825,
  "ac": 6,
  "ev": 10,
  "will": 140,
  "exp": 1323,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 7,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "N",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "naga",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "naga",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "nagaraja",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "nameless",
  "enumName": "MONS_NAMELESS",
  "name": "nameless horror",
  "hd": 15,
  "hp10x": 600,
  "ac": 8,
  "ev": 2,
  "will": "invuln",
  "exp": 11,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "antimagic"
   }
  ],
  "speed": 10,
  "glyph": "X",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "nameless",
  "uses": null,
  "habitat": null
 },
 {
  "id": "nargun",
  "enumName": "MONS_NARGUN",
  "name": "nargun",
  "hd": 22,
  "hp10x": 540,
  "ac": 25,
  "ev": 4,
  "will": 100,
  "exp": 1284,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "vuln"
   },
   {
    "type": "bite",
    "damage": 30,
    "flavour": "cold"
   }
  ],
  "speed": 10,
  "glyph": "9",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "blob",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "fighter",
   "see_invis"
  ],
  "resists": {
   "elec": 1,
   "cold": 3,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "nargun",
  "uses": null,
  "habitat": null
 },
 {
  "id": "nascent-plasmodium",
  "enumName": "MONS_NASCENT_PLASMODIUM",
  "name": "nascent plasmodium",
  "hd": 6,
  "hp10x": 260,
  "ac": 9,
  "ev": 3,
  "will": 160,
  "exp": 450,
  "attacks": [],
  "speed": 10,
  "glyph": "J",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable",
   "amorphous",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": "nascent_plasmodium",
  "uses": null,
  "habitat": "walls_only"
 },
 {
  "id": "natasha",
  "enumName": "MONS_NATASHA",
  "name": "Natasha",
  "hd": 3,
  "hp10x": 150,
  "ac": 2,
  "ev": 12,
  "will": 20,
  "exp": 35,
  "attacks": [
   {
    "type": "claw",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "h",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "quadruped",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "felid",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "natasha",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "necromancer",
  "enumName": "MONS_NECROMANCER",
  "name": "necromancer",
  "hd": 10,
  "hp10x": 400,
  "ac": 0,
  "ev": 13,
  "will": 60,
  "exp": 612,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "necromancer",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "necrophage",
  "enumName": "MONS_NECROPHAGE",
  "name": "necrophage",
  "hd": 5,
  "hp10x": 220,
  "ac": 2,
  "ev": 10,
  "will": 40,
  "exp": 76,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "n",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "ghoul",
  "species": null,
  "flags": [
   "no_zombie"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "nekomata",
  "enumName": "MONS_NEKOMATA",
  "name": "nekomata",
  "hd": 15,
  "hp10x": 880,
  "ac": 7,
  "ev": 23,
  "will": 120,
  "exp": 2054,
  "attacks": [
   {
    "type": "hit",
    "damage": 32,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 16,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "archer",
   "see_invis",
   "speaks"
  ],
  "resists": {
   "fire": 1,
   "poison": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "nekomata",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "nellie",
  "enumName": "MONS_NELLIE",
  "name": "Nellie",
  "hd": 20,
  "hp10x": 2400,
  "ac": 13,
  "ev": 10,
  "will": 140,
  "exp": 2087,
  "attacks": [
   {
    "type": "trample",
    "damage": 45,
    "flavour": "trample"
   },
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "gore",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Y",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "elephant",
  "species": "hellephant",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {
   "neg": 3,
   "torment": 1
  },
  "spells": "hellephant",
  "uses": null,
  "habitat": null
 },
 {
  "id": "neqoxec",
  "enumName": "MONS_NEQOXEC",
  "name": "neqoxec",
  "hd": 6,
  "hp10x": 330,
  "ac": 4,
  "ev": 12,
  "will": 40,
  "exp": 182,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "3",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "poison": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "neqoxec",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "nergalle",
  "enumName": "MONS_NERGALLE",
  "name": "Nergalle",
  "hd": 10,
  "hp10x": 600,
  "ac": 9,
  "ev": 11,
  "will": 60,
  "exp": 779,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "nergalle",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "nessos",
  "enumName": "MONS_NESSOS",
  "name": "Nessos",
  "hd": 9,
  "hp10x": 720,
  "ac": 4,
  "ev": 8,
  "will": 20,
  "exp": 1043,
  "attacks": [
   {
    "type": "hit",
    "damage": 13,
    "flavour": "plain"
   },
   {
    "type": "kick",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "c",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "centaur",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "centaur",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "archer",
   "gender_neutral"
  ],
  "resists": {},
  "spells": "nessos",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "nikola",
  "enumName": "MONS_NIKOLA",
  "name": "Nikola",
  "hd": 18,
  "hp10x": 1890,
  "ac": 1,
  "ev": 9,
  "will": 120,
  "exp": 2438,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "nikola",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "norris",
  "enumName": "MONS_NORRIS",
  "name": "Norris",
  "hd": 20,
  "hp10x": 2100,
  "ac": 1,
  "ev": 9,
  "will": 140,
  "exp": 2329,
  "attacks": [
   {
    "type": "hit",
    "damage": 36,
    "flavour": "confuse"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "norris",
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "oblivion-hound",
  "enumName": "MONS_OBLIVION_HOUND",
  "name": "oblivion hound",
  "hd": 20,
  "hp10x": 1100,
  "ac": 6,
  "ev": 13,
  "will": 20,
  "exp": 2059,
  "attacks": [
   {
    "type": "bite",
    "damage": 45,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 13,
  "glyph": "h",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "demonic"
  ],
  "genus": "hound",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable"
  ],
  "resists": {
   "neg": 3,
   "torment": 1
  },
  "spells": "oblivion_hound",
  "uses": null,
  "habitat": null
 },
 {
  "id": "obsidian-bat",
  "enumName": "MONS_OBSIDIAN_BAT",
  "name": "obsidian bat",
  "hd": 9,
  "hp10x": 425,
  "ac": 13,
  "ev": 13,
  "will": 20,
  "exp": 747,
  "attacks": [
   {
    "type": "bite",
    "damage": 21,
    "flavour": "hell_hunt"
   }
  ],
  "speed": 30,
  "glyph": "b",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "bat",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": "bat",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "unblindable",
   "batty",
   "speaks"
  ],
  "resists": {
   "fire": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "obsidian-statue",
  "enumName": "MONS_OBSIDIAN_STATUE",
  "name": "obsidian statue",
  "hd": 10,
  "hp10x": 700,
  "ac": 12,
  "ev": 1,
  "will": "invuln",
  "exp": 679,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "statue",
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "stationary"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "cold": 2,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "obsidian_statue",
  "uses": null,
  "habitat": null
 },
 {
  "id": "occultist",
  "enumName": "MONS_OCCULTIST",
  "name": "occultist",
  "hd": 13,
  "hp10x": 540,
  "ac": 0,
  "ev": 15,
  "will": 60,
  "exp": 794,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "occultist",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "octopode",
  "enumName": "MONS_OCTOPODE",
  "name": "octopode",
  "hd": 8,
  "hp10x": 560,
  "ac": 1,
  "ev": 5,
  "will": 10,
  "exp": 479,
  "attacks": [
   {
    "type": "tentacle_slap",
    "damage": 24,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 5,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "x",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "no_skeleton",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "ogre-mage",
  "enumName": "MONS_OGRE_MAGE",
  "name": "ogre mage",
  "hd": 10,
  "hp10x": 550,
  "ac": 1,
  "ev": 7,
  "will": 80,
  "exp": 848,
  "attacks": [
   {
    "type": "hit",
    "damage": 16,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "O",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "ogre",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "ogre_mage",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "ogre",
  "enumName": "MONS_OGRE",
  "name": "ogre",
  "hd": 5,
  "hp10x": 275,
  "ac": 1,
  "ev": 6,
  "will": 20,
  "exp": 119,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "O",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "oklob-plant",
  "enumName": "MONS_OKLOB_PLANT",
  "name": "oklob plant",
  "hd": 10,
  "hp10x": 550,
  "ac": 10,
  "ev": 0,
  "will": 40,
  "exp": 564,
  "attacks": [],
  "speed": 10,
  "glyph": "P",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "plant",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": null,
  "flags": [
   "stationary"
  ],
  "resists": {
   "poison": 1,
   "corr": 3,
   "torment": 1
  },
  "spells": "acid_spit",
  "uses": null,
  "habitat": null
 },
 {
  "id": "oklob-sapling",
  "enumName": "MONS_OKLOB_SAPLING",
  "name": "oklob sapling",
  "hd": 4,
  "hp10x": 220,
  "ac": 10,
  "ev": 0,
  "will": 20,
  "exp": 60,
  "attacks": [],
  "speed": 10,
  "glyph": "P",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "plant",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": "oklob_plant",
  "flags": [
   "stationary"
  ],
  "resists": {
   "poison": 1,
   "corr": 3,
   "torment": 1
  },
  "spells": "oklob_sapling",
  "uses": null,
  "habitat": null
 },
 {
  "id": "oni-incarcerator",
  "enumName": "MONS_ONI_INCARCERATOR",
  "name": "oni incarcerator",
  "hd": 19,
  "hp10x": 1500,
  "ac": 6,
  "ev": 8,
  "will": 100,
  "exp": 2712,
  "attacks": [
   {
    "type": "hit",
    "damage": 50,
    "flavour": "drag"
   },
   {
    "type": "headbutt",
    "damage": 24,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "O",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "oni",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "oni_incarcerator",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "oni",
  "enumName": "MONS_ONI",
  "name": "oni",
  "hd": 5,
  "hp10x": 275,
  "ac": 1,
  "ev": 6,
  "will": 20,
  "exp": 119,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "O",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "ophan",
  "enumName": "MONS_OPHAN",
  "name": "ophan",
  "hd": 15,
  "hp10x": 975,
  "ac": 10,
  "ev": 10,
  "will": 140,
  "exp": 1082,
  "attacks": [],
  "speed": 10,
  "glyph": "G",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "orb",
  "intelligence": "human",
  "holiness": [
   "holy"
  ],
  "genus": "angel",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "has_aura"
  ],
  "resists": {
   "neg": 3
  },
  "spells": "ophan",
  "uses": null,
  "habitat": null
 },
 {
  "id": "orange-demon",
  "enumName": "MONS_ORANGE_DEMON",
  "name": "orange demon",
  "hd": 8,
  "hp10x": 520,
  "ac": 3,
  "ev": 7,
  "will": 60,
  "exp": 421,
  "attacks": [
   {
    "type": "sting",
    "damage": 15,
    "flavour": "reach_sting"
   },
   {
    "type": "hit",
    "damage": 8,
    "flavour": "weakness"
   }
  ],
  "speed": 10,
  "glyph": "4",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "orange-statue",
  "enumName": "MONS_ORANGE_STATUE",
  "name": "orange crystal statue",
  "hd": 10,
  "hp10x": 700,
  "ac": 12,
  "ev": 1,
  "will": "invuln",
  "exp": 679,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "statue",
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "stationary"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "cold": 2,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "orange_crystal_statue",
  "uses": null,
  "habitat": null
 },
 {
  "id": "orb-guardian",
  "enumName": "MONS_ORB_GUARDIAN",
  "name": "Orb Guardian",
  "hd": 15,
  "hp10x": 825,
  "ac": 13,
  "ev": 13,
  "will": 120,
  "exp": 1752,
  "attacks": [
   {
    "type": "hit",
    "damage": 45,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "X",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "no_poly_to"
  ],
  "resists": {},
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "orb-of-destruction",
  "enumName": "MONS_ORB_OF_DESTRUCTION",
  "name": "orb of destruction",
  "hd": 5,
  "hp10x": 50000,
  "ac": 0,
  "ev": 10,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 30,
  "glyph": "*",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "no_exp_gain",
   "no_poly_to",
   "projectile",
   "no_threat"
  ],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "corr": 3,
   "damnation": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "orb-of-entropy",
  "enumName": "MONS_ORB_OF_ENTROPY",
  "name": "orb of entropy",
  "hd": 30,
  "hp10x": 1500,
  "ac": 20,
  "ev": 20,
  "will": "invuln",
  "exp": 4638,
  "attacks": [],
  "speed": 15,
  "glyph": "*",
  "colour": "etc_unholy",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "elec": 3,
   "fire": 1,
   "cold": 1,
   "corr": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "orb_of_entropy",
  "uses": null,
  "habitat": null
 },
 {
  "id": "orb-of-fire",
  "enumName": "MONS_ORB_OF_FIRE",
  "name": "orb of fire",
  "hd": 30,
  "hp10x": 1500,
  "ac": 20,
  "ev": 20,
  "will": "invuln",
  "exp": 4638,
  "attacks": [],
  "speed": 15,
  "glyph": "*",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "orb_of_fire",
  "uses": null,
  "habitat": null
 },
 {
  "id": "orb-of-winter",
  "enumName": "MONS_ORB_OF_WINTER",
  "name": "orb of winter",
  "hd": 30,
  "hp10x": 1500,
  "ac": 20,
  "ev": 20,
  "will": "invuln",
  "exp": 4638,
  "attacks": [],
  "speed": 15,
  "glyph": "*",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "elec": 3,
   "fire": 1,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "orb_of_winter",
  "uses": null,
  "habitat": null
 },
 {
  "id": "orb-spider",
  "enumName": "MONS_ORB_SPIDER",
  "name": "orb spider",
  "hd": 10,
  "hp10x": 420,
  "ac": 3,
  "ev": 10,
  "will": 40,
  "exp": 708,
  "attacks": [
   {
    "type": "bite",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "s",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "arachnid",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "spider",
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton",
   "maintain_range"
  ],
  "resists": {
   "poison": -1
  },
  "spells": "orb_spider",
  "uses": null,
  "habitat": null
 },
 {
  "id": "orc-apostle",
  "enumName": "MONS_ORC_APOSTLE",
  "name": "orc apostle",
  "hd": 9,
  "hp10x": 675,
  "ac": 2,
  "ev": 13,
  "will": 0,
  "exp": 35,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "ghost_demon",
   "no_poly_to",
   "no_zombie",
   "no_gen_derived",
   "fast_regen"
  ],
  "resists": {},
  "spells": "ghost",
  "uses": "starting_equipment",
  "habitat": "amphibious"
 },
 {
  "id": "orc-high-priest",
  "enumName": "MONS_ORC_HIGH_PRIEST",
  "name": "orc high priest",
  "hd": 11,
  "hp10x": 550,
  "ac": 1,
  "ev": 12,
  "will": 60,
  "exp": 795,
  "attacks": [
   {
    "type": "hit",
    "damage": 7,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "orc_high_priest",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "orc-knight",
  "enumName": "MONS_ORC_KNIGHT",
  "name": "orc knight",
  "hd": 9,
  "hp10x": 675,
  "ac": 2,
  "ev": 13,
  "will": 40,
  "exp": 617,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "orc_knight",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "orc-priest",
  "enumName": "MONS_ORC_PRIEST",
  "name": "orc priest",
  "hd": 3,
  "hp10x": 150,
  "ac": 1,
  "ev": 10,
  "will": 20,
  "exp": 42,
  "attacks": [
   {
    "type": "hit",
    "damage": 3,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "orc_priest",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "orc-sorcerer",
  "enumName": "MONS_ORC_SORCERER",
  "name": "orc sorcerer",
  "hd": 9,
  "hp10x": 315,
  "ac": 5,
  "ev": 12,
  "will": 40,
  "exp": 559,
  "attacks": [
   {
    "type": "hit",
    "damage": 7,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "orc_sorcerer",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "orc-warlord",
  "enumName": "MONS_ORC_WARLORD",
  "name": "orc warlord",
  "hd": 15,
  "hp10x": 1125,
  "ac": 3,
  "ev": 10,
  "will": 60,
  "exp": 1144,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "battlecry",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "orc-warrior",
  "enumName": "MONS_ORC_WARRIOR",
  "name": "orc warrior",
  "hd": 4,
  "hp10x": 280,
  "ac": 0,
  "ev": 13,
  "will": 20,
  "exp": 133,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "yellow",
  "spriteKey": "enemy_orc_warrior",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "orc-wizard",
  "enumName": "MONS_ORC_WIZARD",
  "name": "orc wizard",
  "hd": 3,
  "hp10x": 150,
  "ac": 1,
  "ev": 12,
  "will": 20,
  "exp": 35,
  "attacks": [
   {
    "type": "hit",
    "damage": 2,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "orc_wizard",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "orc",
  "enumName": "MONS_ORC",
  "name": "orc",
  "hd": 1,
  "hp10x": 70,
  "ac": 0,
  "ev": 10,
  "will": 0,
  "exp": 3,
  "attacks": [
   {
    "type": "hit",
    "damage": 2,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "lightred",
  "spriteKey": "enemy_orc",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "pale-draconian",
  "enumName": "MONS_PALE_DRACONIAN",
  "name": "pale draconian",
  "hd": 14,
  "hp10x": 980,
  "ac": 9,
  "ev": 14,
  "will": 40,
  "exp": 997,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "draconian",
  "species": null,
  "flags": [
   "speaks",
   "cold_blood",
   "no_poly_to"
  ],
  "resists": {
   "steam": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "pandemonium-lord",
  "enumName": "MONS_PANDEMONIUM_LORD",
  "name": "pandemonium lord",
  "hd": 19,
  "hp10x": 1710,
  "ac": 1,
  "ev": 2,
  "will": 0,
  "exp": 80,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "&",
  "colour": "colour_undef",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "ghost_demon",
   "tall_tile"
  ],
  "resists": {
   "poison": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "ghost",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "parghit",
  "enumName": "MONS_PARGHIT",
  "name": "Parghit",
  "hd": 27,
  "hp10x": 1200,
  "ac": 1,
  "ev": 12,
  "will": 140,
  "exp": 3146,
  "attacks": [
   {
    "type": "bite",
    "damage": 50,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 40,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "T",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "troll",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "fast_regen",
   "male"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "pargi",
  "enumName": "MONS_PARGI",
  "name": "Pargi",
  "hd": 5,
  "hp10x": 350,
  "ac": 1,
  "ev": 12,
  "will": 10,
  "exp": 135,
  "attacks": [
   {
    "type": "bite",
    "damage": 9,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 4,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 4,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "T",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "troll",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "fast_regen",
   "male"
  ],
  "resists": {},
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "peacekeeper",
  "enumName": "MONS_PEACEKEEPER",
  "name": "peacekeeper",
  "hd": 12,
  "hp10x": 450,
  "ac": 20,
  "ev": 3,
  "will": "invuln",
  "exp": 859,
  "attacks": [
   {
    "type": "bite",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "9",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped_tailless",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "see_invis"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "peacekeeper",
  "uses": null,
  "habitat": null
 },
 {
  "id": "pearl-dragon",
  "enumName": "MONS_PEARL_DRAGON",
  "name": "pearl dragon",
  "hd": 18,
  "hp10x": 1170,
  "ac": 10,
  "ev": 15,
  "will": 160,
  "exp": 2256,
  "attacks": [
   {
    "type": "bite",
    "damage": 35,
    "flavour": "holy"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "holy"
   }
  ],
  "speed": 12,
  "glyph": "D",
  "colour": "etc_holy",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "holy"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "warm_blood"
  ],
  "resists": {
   "neg": 3
  },
  "spells": "pearl_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "petrified-flower",
  "enumName": "MONS_PETRIFIED_FLOWER",
  "name": "petrified flower",
  "hd": 12,
  "hp10x": 840,
  "ac": 12,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "P",
  "colour": "etc_silver",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving",
   "plant"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "fire": 1,
   "cold": 1,
   "elec": 1,
   "poison": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "phalanx-beetle",
  "enumName": "MONS_PHALANX_BEETLE",
  "name": "phalanx beetle",
  "hd": 11,
  "hp10x": 580,
  "ac": 12,
  "ev": 12,
  "will": "invuln",
  "exp": 500,
  "attacks": [
   {
    "type": "bite",
    "damage": 21,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "B",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "insect",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "has_aura"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "phantasmal-warrior",
  "enumName": "MONS_PHANTASMAL_WARRIOR",
  "name": "phantasmal warrior",
  "hd": 9,
  "hp10x": 495,
  "ac": 12,
  "ev": 10,
  "will": 80,
  "exp": 638,
  "attacks": [
   {
    "type": "hit",
    "damage": 39,
    "flavour": "vuln"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "wraith",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "blink_close",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "phantom",
  "enumName": "MONS_PHANTOM",
  "name": "phantom",
  "hd": 6,
  "hp10x": 270,
  "ac": 3,
  "ev": 13,
  "will": 40,
  "exp": 105,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "blink_with"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "blue",
  "spriteKey": "enemy_phantasmal",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial"
  ],
  "resists": {
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "pharaoh-ant",
  "enumName": "MONS_PHARAOH_ANT",
  "name": "pharaoh ant",
  "hd": 10,
  "hp10x": 360,
  "ac": 4,
  "ev": 8,
  "will": 60,
  "exp": 758,
  "attacks": [
   {
    "type": "bite",
    "damage": 43,
    "flavour": "drain"
   }
  ],
  "speed": 14,
  "glyph": "B",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "insect",
  "intelligence": "animal",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "pikel",
  "enumName": "MONS_PIKEL",
  "name": "Pikel",
  "hd": 6,
  "hp10x": 390,
  "ac": 4,
  "ev": 12,
  "will": 20,
  "exp": 647,
  "attacks": [
   {
    "type": "hit",
    "damage": 9,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "K",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "kobold",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "pile-of-debris",
  "enumName": "MONS_PILE_OF_DEBRIS",
  "name": "pile of debris",
  "hd": 8,
  "hp10x": 800,
  "ac": 8,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fragile",
   "stationary",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "fire": 1,
   "cold": 1,
   "elec": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "pile-of-flesh",
  "enumName": "MONS_PILE_OF_FLESH",
  "name": "pile of flesh",
  "hd": 6,
  "hp10x": 660,
  "ac": 2,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "no_threat",
   "no_poly_to",
   "no_skeleton",
   "no_zombie",
   "no_gen_derived"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "pillar-of-rime",
  "enumName": "MONS_PILLAR_OF_RIME",
  "name": "pillar of rime",
  "hd": 3,
  "hp10x": 375,
  "ac": 15,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "etc_ice",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "remnant",
   "no_threat"
  ],
  "resists": {
   "fire": -1,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": "amphibious"
 },
 {
  "id": "pillar-of-salt",
  "enumName": "MONS_PILLAR_OF_SALT",
  "name": "pillar of salt",
  "hd": 1,
  "hp10x": 10,
  "ac": 1,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "remnant",
   "no_threat"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "plant",
  "enumName": "MONS_PLANT",
  "name": "plant",
  "hd": 10,
  "hp10x": 2000,
  "ac": 0,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 0,
  "glyph": "P",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "plant",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fragile",
   "stationary",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "platinum-paragon",
  "enumName": "MONS_PLATINUM_PARAGON",
  "name": "platinum paragon",
  "hd": 15,
  "hp10x": 1000,
  "ac": 20,
  "ev": 20,
  "will": "invuln",
  "exp": 2700,
  "attacks": [],
  "speed": 10,
  "glyph": "9",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "see_invis",
   "ghost_demon"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "player-ghost",
  "enumName": "MONS_PLAYER_GHOST",
  "name": "player ghost",
  "hd": 4,
  "hp10x": 140,
  "ac": 1,
  "ev": 2,
  "will": 0,
  "exp": 65,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "phantom",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "speaks",
   "ghost_demon",
   "insubstantial",
   "no_poly_to"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "ghost",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "player-illusion",
  "enumName": "MONS_PLAYER_ILLUSION",
  "name": "player illusion",
  "hd": 4,
  "hp10x": 140,
  "ac": 1,
  "ev": 2,
  "will": 0,
  "exp": 40,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "speaks",
   "ghost_demon",
   "insubstantial",
   "no_poly_to"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "ghost",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "player-shadow",
  "enumName": "MONS_PLAYER_SHADOW",
  "name": "shadow",
  "hd": 1,
  "hp10x": 10,
  "ac": 7,
  "ev": 20,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "@",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "no_exp_gain",
   "no_poly_to",
   "two_weapons"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "polar-bear",
  "enumName": "MONS_POLAR_BEAR",
  "name": "polar bear",
  "hd": 7,
  "hp10x": 455,
  "ac": 7,
  "ev": 8,
  "will": 20,
  "exp": 295,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 5,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "h",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_tailless",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "bear",
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {
   "cold": 1
  },
  "spells": "bear",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "poltergeist",
  "enumName": "MONS_POLTERGEIST",
  "name": "poltergeist",
  "hd": 11,
  "hp10x": 650,
  "ac": 6,
  "ev": 18,
  "will": 80,
  "exp": 7,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "v",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "polterguardian",
  "enumName": "MONS_POLTERGUARDIAN",
  "name": "polterguardian",
  "hd": 11,
  "hp10x": 650,
  "ac": 6,
  "ev": 18,
  "will": 80,
  "exp": 539,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "v",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "cautious",
   "has_aura"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "polterguardian",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "polyphemus",
  "enumName": "MONS_POLYPHEMUS",
  "name": "Polyphemus",
  "hd": 16,
  "hp10x": 1520,
  "ac": 10,
  "ev": 3,
  "will": 60,
  "exp": 1540,
  "attacks": [
   {
    "type": "hit",
    "damage": 45,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": "cyclops",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "polyphemus",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "prince-ribbit",
  "enumName": "MONS_PRINCE_RIBBIT",
  "name": "Prince Ribbit",
  "hd": 6,
  "hp10x": 390,
  "ac": 0,
  "ev": 16,
  "will": 40,
  "exp": 276,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "F",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped_tailless",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "frog",
  "species": "human",
  "flags": [
   "speaks",
   "cold_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "blinker",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "profane-servitor",
  "enumName": "MONS_PROFANE_SERVITOR",
  "name": "profane servitor",
  "hd": 18,
  "hp10x": 1530,
  "ac": 10,
  "ev": 20,
  "will": 140,
  "exp": 2323,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "vampiric"
   },
   {
    "type": "hit",
    "damage": 10,
    "flavour": "drain"
   }
  ],
  "speed": 15,
  "glyph": "A",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "angel",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks"
  ],
  "resists": {
   "elec": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "protean-progenitor",
  "enumName": "MONS_PROTEAN_PROGENITOR",
  "name": "protean progenitor",
  "hd": 14,
  "hp10x": 820,
  "ac": 7,
  "ev": 8,
  "will": 120,
  "exp": 1314,
  "attacks": [
   {
    "type": "random",
    "damage": 55,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "C",
  "colour": "etc_random",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "fast_regen",
   "no_poly_to",
   "no_zombie",
   "no_gen_derived"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "protean_progenitor",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "purple-draconian",
  "enumName": "MONS_PURPLE_DRACONIAN",
  "name": "purple draconian",
  "hd": 14,
  "hp10x": 980,
  "ac": 9,
  "ev": 10,
  "will": 120,
  "exp": 997,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "draconian",
  "species": null,
  "flags": [
   "speaks",
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "putrid-mouth",
  "enumName": "MONS_PUTRID_MOUTH",
  "name": "putrid mouth",
  "hd": 14,
  "hp10x": 700,
  "ac": 5,
  "ev": 14,
  "will": 100,
  "exp": 1023,
  "attacks": [
   {
    "type": "bite",
    "damage": 30,
    "flavour": "poison_strong"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "wraith",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "putrid_mouth",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "queen-bee",
  "enumName": "MONS_QUEEN_BEE",
  "name": "queen bee",
  "hd": 7,
  "hp10x": 385,
  "ac": 10,
  "ev": 10,
  "will": 20,
  "exp": 303,
  "attacks": [
   {
    "type": "sting",
    "damage": 20,
    "flavour": "poison"
   }
  ],
  "speed": 10,
  "glyph": "y",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "insect_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "killer_bee",
  "species": null,
  "flags": [
   "flies",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": "queen_bee",
  "uses": null,
  "habitat": null
 },
 {
  "id": "quicksilver-dragon",
  "enumName": "MONS_QUICKSILVER_DRAGON",
  "name": "quicksilver dragon",
  "hd": 16,
  "hp10x": 880,
  "ac": 10,
  "ev": 15,
  "will": 140,
  "exp": 1641,
  "attacks": [
   {
    "type": "bite",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "D",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "warm_blood"
  ],
  "resists": {},
  "spells": "quicksilver_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "quicksilver-elemental",
  "enumName": "MONS_QUICKSILVER_ELEMENTAL",
  "name": "quicksilver elemental",
  "hd": 16,
  "hp10x": 800,
  "ac": 1,
  "ev": 20,
  "will": "invuln",
  "exp": 1243,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "antimagic"
   }
  ],
  "speed": 20,
  "glyph": "E",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": "elemental",
  "species": null,
  "flags": [
   "see_invis",
   "batty"
  ],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "quicksilver_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "quokka",
  "enumName": "MONS_QUOKKA",
  "name": "quokka",
  "hd": 1,
  "hp10x": 55,
  "ac": 2,
  "ev": 13,
  "will": 0,
  "exp": 2,
  "attacks": [
   {
    "type": "bite",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "r",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "radroach",
  "enumName": "MONS_RADROACH",
  "name": "radroach",
  "hd": 12,
  "hp10x": 800,
  "ac": 13,
  "ev": 5,
  "will": 60,
  "exp": 839,
  "attacks": [
   {
    "type": "bite",
    "damage": 28,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 16,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "B",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "insect",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {},
  "spells": "radroach",
  "uses": null,
  "habitat": null
 },
 {
  "id": "ragged-hierophant",
  "enumName": "MONS_RAGGED_HIEROPHANT",
  "name": "ragged hierophant",
  "hd": 9,
  "hp10x": 1200,
  "ac": 0,
  "ev": 10,
  "will": 40,
  "exp": 897,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "a",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "ragged_hierophant",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "raiju",
  "enumName": "MONS_RAIJU",
  "name": "raiju",
  "hd": 7,
  "hp10x": 385,
  "ac": 4,
  "ev": 14,
  "will": 20,
  "exp": 264,
  "attacks": [
   {
    "type": "bite",
    "damage": 11,
    "flavour": "elec"
   }
  ],
  "speed": 10,
  "glyph": "h",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "hound",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable"
  ],
  "resists": {
   "elec": 3
  },
  "spells": "raiju",
  "uses": null,
  "habitat": null
 },
 {
  "id": "rakshasa",
  "enumName": "MONS_RAKSHASA",
  "name": "rakshasa",
  "hd": 11,
  "hp10x": 660,
  "ac": 6,
  "ev": 14,
  "will": 140,
  "exp": 870,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "yellow",
  "spriteKey": "enemy_rakshasa",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis"
  ],
  "resists": {
   "poison": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "rakshasa",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "rat",
  "enumName": "MONS_RAT",
  "name": "rat",
  "hd": 1,
  "hp10x": 25,
  "ac": 1,
  "ev": 10,
  "will": 0,
  "exp": 1,
  "attacks": [
   {
    "type": "bite",
    "damage": 3,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "r",
  "colour": "brown",
  "spriteKey": "enemy_rat",
  "sizePixels": 12,
  "size": "tiny",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "raven",
  "enumName": "MONS_RAVEN",
  "name": "raven",
  "hd": 7,
  "hp10x": 320,
  "ac": 2,
  "ev": 15,
  "will": 20,
  "exp": 210,
  "attacks": [
   {
    "type": "peck",
    "damage": 19,
    "flavour": "plain"
   }
  ],
  "speed": 20,
  "glyph": "b",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "bird",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "speaks"
  ],
  "resists": {},
  "spells": "raven",
  "uses": null,
  "habitat": null
 },
 {
  "id": "reaper",
  "enumName": "MONS_REAPER",
  "name": "reaper",
  "hd": 14,
  "hp10x": 710,
  "ac": 15,
  "ev": 10,
  "will": 100,
  "exp": 1133,
  "attacks": [
   {
    "type": "hit",
    "damage": 36,
    "flavour": "drag"
   }
  ],
  "speed": 10,
  "glyph": "2",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks"
  ],
  "resists": {
   "poison": 1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "red-devil",
  "enumName": "MONS_RED_DEVIL",
  "name": "red devil",
  "hd": 7,
  "hp10x": 315,
  "ac": 7,
  "ev": 13,
  "will": 60,
  "exp": 319,
  "attacks": [
   {
    "type": "hit",
    "damage": 19,
    "flavour": "barbs"
   }
  ],
  "speed": 10,
  "glyph": "4",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "fighter"
  ],
  "resists": {
   "poison": 1,
   "fire": 3,
   "cold": -1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "red-draconian",
  "enumName": "MONS_RED_DRACONIAN",
  "name": "red draconian",
  "hd": 14,
  "hp10x": 980,
  "ac": 9,
  "ev": 10,
  "will": 40,
  "exp": 997,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "draconian",
  "species": null,
  "flags": [
   "speaks",
   "cold_blood"
  ],
  "resists": {
   "fire": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "redback",
  "enumName": "MONS_REDBACK",
  "name": "redback",
  "hd": 9,
  "hp10x": 270,
  "ac": 2,
  "ev": 12,
  "will": 20,
  "exp": 181,
  "attacks": [
   {
    "type": "bite",
    "damage": 18,
    "flavour": "poison_strong"
   }
  ],
  "speed": 15,
  "glyph": "s",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "arachnid",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "spider",
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "rending-blade",
  "enumName": "MONS_RENDING_BLADE",
  "name": "rending blade",
  "hd": 5,
  "hp10x": 400,
  "ac": 15,
  "ev": 10,
  "will": "invuln",
  "exp": 120,
  "attacks": [],
  "speed": 20,
  "glyph": "(",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "wraith",
  "species": null,
  "flags": [
   "flies",
   "peripheral"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "revenant-soulmonger",
  "enumName": "MONS_REVENANT_SOULMONGER",
  "name": "revenant soulmonger",
  "hd": 18,
  "hp10x": 810,
  "ac": 8,
  "ev": 12,
  "will": "invuln",
  "exp": 1345,
  "attacks": [
   {
    "type": "claw",
    "damage": 26,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "z",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks"
  ],
  "resists": {
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "revenant",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "revenant",
  "enumName": "MONS_REVENANT",
  "name": "revenant",
  "hd": 6,
  "hp10x": 360,
  "ac": 4,
  "ev": 10,
  "will": "invuln",
  "exp": 200,
  "attacks": [
   {
    "type": "claw",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "z",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "ribbon-worm",
  "enumName": "MONS_RIBBON_WORM",
  "name": "ribbon worm",
  "hd": 4,
  "hp10x": 180,
  "ac": 1,
  "ev": 5,
  "will": 10,
  "exp": 4,
  "attacks": [
   {
    "type": "bite",
    "damage": 9,
    "flavour": "plain"
   }
  ],
  "speed": 8,
  "glyph": "w",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fast_regen",
   "no_skeleton"
  ],
  "resists": {},
  "spells": "ribbon_worm",
  "uses": null,
  "habitat": null
 },
 {
  "id": "rime-drake",
  "enumName": "MONS_RIME_DRAKE",
  "name": "rime drake",
  "hd": 6,
  "hp10x": 330,
  "ac": 3,
  "ev": 12,
  "will": 20,
  "exp": 372,
  "attacks": [
   {
    "type": "bite",
    "damage": 8,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "k",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "drake",
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {
   "cold": 1
  },
  "spells": "rime_drake",
  "uses": null,
  "habitat": null
 },
 {
  "id": "river-rat",
  "enumName": "MONS_RIVER_RAT",
  "name": "river rat",
  "hd": 2,
  "hp10x": 110,
  "ac": 5,
  "ev": 11,
  "will": 10,
  "exp": 13,
  "attacks": [
   {
    "type": "bite",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "r",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "rat",
  "species": null,
  "flags": [
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "robin",
  "enumName": "MONS_ROBIN",
  "name": "Robin",
  "hd": 2,
  "hp10x": 160,
  "ac": 1,
  "ev": 8,
  "will": 10,
  "exp": 15,
  "attacks": [
   {
    "type": "hit",
    "damage": 2,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "g",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "goblin",
  "species": "hobgoblin",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "gender_neutral"
  ],
  "resists": {},
  "spells": "robin",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "rock-fish",
  "enumName": "MONS_ROCK_FISH",
  "name": "rock fish",
  "hd": 5,
  "hp10x": 180,
  "ac": 11,
  "ev": 7,
  "will": 20,
  "exp": 75,
  "attacks": [
   {
    "type": "bite",
    "damage": 13,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "F",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "fish",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "elec": 1,
   "fire": 1,
   "petrify": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "wall"
 },
 {
  "id": "rockslime",
  "enumName": "MONS_ROCKSLIME",
  "name": "rockslime",
  "hd": 20,
  "hp10x": 600,
  "ac": 27,
  "ev": 2,
  "will": 60,
  "exp": 1312,
  "attacks": [
   {
    "type": "hit",
    "damage": 50,
    "flavour": "trample"
   }
  ],
  "speed": 12,
  "glyph": "J",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "eat_doors",
   "see_invis",
   "unblindable",
   "amorphous",
   "no_skeleton"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 2,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "roxanne",
  "enumName": "MONS_ROXANNE",
  "name": "Roxanne",
  "hd": 14,
  "hp10x": 1820,
  "ac": 20,
  "ev": 0,
  "will": "invuln",
  "exp": 1368,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": "statue",
  "flags": [
   "no_wand",
   "speaks",
   "stationary",
   "unique",
   "female"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "cold": 2,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "roxanne",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "royal-jelly",
  "enumName": "MONS_ROYAL_JELLY",
  "name": "Royal Jelly",
  "hd": 21,
  "hp10x": 2310,
  "ac": 8,
  "ev": 4,
  "will": 180,
  "exp": 7603,
  "attacks": [
   {
    "type": "hit",
    "damage": 50,
    "flavour": "acid"
   },
   {
    "type": "hit",
    "damage": 30,
    "flavour": "acid"
   }
  ],
  "speed": 14,
  "glyph": "J",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "jelly",
  "flags": [
   "name_the",
   "eat_doors",
   "see_invis",
   "unblindable",
   "amorphous",
   "unique",
   "acid_splash",
   "no_skeleton",
   "tall_tile"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "royal-mummy",
  "enumName": "MONS_ROYAL_MUMMY",
  "name": "royal mummy",
  "hd": 15,
  "hp10x": 1950,
  "ac": 10,
  "ev": 6,
  "will": 160,
  "exp": 3477,
  "attacks": [
   {
    "type": "hit",
    "damage": 35,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "M",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "mummy",
  "flags": [
   "see_invis",
   "speaks"
  ],
  "resists": {
   "elec": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "royal_mummy",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "rupert",
  "enumName": "MONS_RUPERT",
  "name": "Rupert",
  "hd": 16,
  "hp10x": 1200,
  "ac": 0,
  "ev": 10,
  "will": 100,
  "exp": 1862,
  "attacks": [
   {
    "type": "hit",
    "damage": 21,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "rupert",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "rust-devil",
  "enumName": "MONS_RUST_DEVIL",
  "name": "rust devil",
  "hd": 8,
  "hp10x": 440,
  "ac": 10,
  "ev": 8,
  "will": 60,
  "exp": 455,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "corrode"
   }
  ],
  "speed": 10,
  "glyph": "4",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 3,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "sacred-lotus",
  "enumName": "MONS_SACRED_LOTUS",
  "name": "sacred lotus",
  "hd": 22,
  "hp10x": 1600,
  "ac": 24,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 0,
  "glyph": "P",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "plant",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": null,
  "flags": [
   "stationary",
   "fast_regen",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "miasma": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "water"
 },
 {
  "id": "saint-roka",
  "enumName": "MONS_SAINT_ROKA",
  "name": "Saint Roka",
  "hd": 18,
  "hp10x": 1980,
  "ac": 3,
  "ev": 10,
  "will": 80,
  "exp": 2900,
  "attacks": [
   {
    "type": "hit",
    "damage": 35,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "unique",
   "gender_neutral"
  ],
  "resists": {},
  "spells": "saint_roka",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "salamander-mystic",
  "enumName": "MONS_SALAMANDER_MYSTIC",
  "name": "salamander mystic",
  "hd": 10,
  "hp10x": 650,
  "ac": 5,
  "ev": 7,
  "will": 60,
  "exp": 759,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "fire"
   }
  ],
  "speed": 10,
  "glyph": "N",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "naga",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "naga",
  "species": "salamander",
  "flags": [
   "warm_blood"
  ],
  "resists": {
   "fire": 3,
   "cold": -1
  },
  "spells": "salamander_mystic",
  "uses": "weapons_armour",
  "habitat": "amphibious_lava"
 },
 {
  "id": "salamander-tyrant",
  "enumName": "MONS_SALAMANDER_TYRANT",
  "name": "salamander tyrant",
  "hd": 15,
  "hp10x": 675,
  "ac": 5,
  "ev": 7,
  "will": 60,
  "exp": 863,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "fire"
   }
  ],
  "speed": 10,
  "glyph": "N",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "naga",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "naga",
  "species": "salamander",
  "flags": [
   "warm_blood"
  ],
  "resists": {
   "fire": 3,
   "cold": -1
  },
  "spells": "salamander_tyrant",
  "uses": "open_doors",
  "habitat": "amphibious_lava"
 },
 {
  "id": "salamander",
  "enumName": "MONS_SALAMANDER",
  "name": "salamander",
  "hd": 8,
  "hp10x": 640,
  "ac": 5,
  "ev": 7,
  "will": 40,
  "exp": 530,
  "attacks": [
   {
    "type": "hit",
    "damage": 13,
    "flavour": "fire"
   }
  ],
  "speed": 10,
  "glyph": "N",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "naga",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "naga",
  "species": null,
  "flags": [
   "fighter",
   "warm_blood"
  ],
  "resists": {
   "fire": 3,
   "cold": -1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": "amphibious_lava"
 },
 {
  "id": "saltling",
  "enumName": "MONS_SALTLING",
  "name": "saltling",
  "hd": 8,
  "hp10x": 270,
  "ac": 15,
  "ev": 5,
  "will": "invuln",
  "exp": 271,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "9",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "satyr",
  "enumName": "MONS_SATYR",
  "name": "satyr",
  "hd": 12,
  "hp10x": 660,
  "ac": 2,
  "ev": 12,
  "will": 40,
  "exp": 821,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "c",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "faun",
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "archer",
   "prefer_ranged"
  ],
  "resists": {},
  "spells": "satyr",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "scorpion",
  "enumName": "MONS_SCORPION",
  "name": "scorpion",
  "hd": 4,
  "hp10x": 180,
  "ac": 5,
  "ev": 10,
  "will": 20,
  "exp": 83,
  "attacks": [
   {
    "type": "sting",
    "damage": 8,
    "flavour": "poison"
   }
  ],
  "speed": 12,
  "glyph": "s",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "arachnid",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "screaming-refraction",
  "enumName": "MONS_SCREAMING_REFRACTION",
  "name": "screaming refraction",
  "hd": 12,
  "hp10x": 585,
  "ac": 15,
  "ev": 2,
  "will": 60,
  "exp": 680,
  "attacks": [
   {
    "type": "gore",
    "damage": 32,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "z",
  "colour": "etc_bone",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis"
  ],
  "resists": {
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "screaming_refraction",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "scrub-nettle",
  "enumName": "MONS_SCRUB_NETTLE",
  "name": "scrub nettle",
  "hd": 3,
  "hp10x": 280,
  "ac": 8,
  "ev": 0,
  "will": 40,
  "exp": 39,
  "attacks": [],
  "speed": 10,
  "glyph": "P",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "plant",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": "bush",
  "flags": [
   "see_invis",
   "stationary"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": "scrub_nettle",
  "uses": null,
  "habitat": null
 },
 {
  "id": "sea-snake",
  "enumName": "MONS_SEA_SNAKE",
  "name": "sea snake",
  "hd": 10,
  "hp10x": 650,
  "ac": 2,
  "ev": 15,
  "will": 40,
  "exp": 739,
  "attacks": [
   {
    "type": "bite",
    "damage": 24,
    "flavour": "poison_strong"
   }
  ],
  "speed": 12,
  "glyph": "S",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "snake",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "searing-wretch",
  "enumName": "MONS_SEARING_WRETCH",
  "name": "searing wretch",
  "hd": 18,
  "hp10x": 1600,
  "ac": 4,
  "ev": 8,
  "will": 80,
  "exp": 1625,
  "attacks": [
   {
    "type": "claw",
    "damage": 50,
    "flavour": "fire"
   },
   {
    "type": "bite",
    "damage": 30,
    "flavour": "sear"
   }
  ],
  "speed": 10,
  "glyph": "n",
  "colour": "etc_fire",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "ghoul",
  "species": null,
  "flags": [
   "no_zombie"
  ],
  "resists": {
   "fire": 3,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": "amphibious_lava"
 },
 {
  "id": "seismosaurus-egg",
  "enumName": "MONS_SEISMOSAURUS_EGG",
  "name": "seismosaurus egg",
  "hd": 11,
  "hp10x": 440,
  "ac": 15,
  "ev": 0,
  "will": "invuln",
  "exp": 10,
  "attacks": [],
  "speed": 10,
  "glyph": "*",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "orb",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_skeleton",
   "no_poly_to",
   "no_zombie",
   "no_gen_derived"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "seismosaurus",
  "enumName": "MONS_SEISMOSAURUS",
  "name": "seismosaurus",
  "hd": 11,
  "hp10x": 810,
  "ac": 13,
  "ev": 5,
  "will": 80,
  "exp": 799,
  "attacks": [
   {
    "type": "tail_slap",
    "damage": 31,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "l",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "giant_lizard",
  "species": null,
  "flags": [
   "cold_blood",
   "no_poly_to",
   "no_zombie"
  ],
  "resists": {},
  "spells": "seismosaurus",
  "uses": null,
  "habitat": null
 },
 {
  "id": "seraph",
  "enumName": "MONS_SERAPH",
  "name": "seraph",
  "hd": 25,
  "hp10x": 2125,
  "ac": 10,
  "ev": 20,
  "will": 160,
  "exp": 6070,
  "attacks": [
   {
    "type": "hit",
    "damage": 50,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "A",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "holy"
  ],
  "genus": "angel",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks",
   "tall_tile"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 3,
   "neg": 3
  },
  "spells": "seraph",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "serpent-of-hell-cocytus",
  "enumName": "MONS_SERPENT_OF_HELL_COCYTUS",
  "name": "Serpent of Hell",
  "hd": 17,
  "hp10x": 3230,
  "ac": 20,
  "ev": 12,
  "will": 180,
  "exp": 6666,
  "attacks": [
   {
    "type": "bite",
    "damage": 35,
    "flavour": "cold"
   },
   {
    "type": "bite",
    "damage": 35,
    "flavour": "cold"
   },
   {
    "type": "bite",
    "damage": 35,
    "flavour": "cold"
   },
   {
    "type": "trample",
    "damage": 25,
    "flavour": "trample"
   }
  ],
  "speed": 14,
  "glyph": "D",
  "colour": "etc_ice",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "dragon",
  "species": "serpent_of_hell",
  "flags": [
   "name_the",
   "crash_doors",
   "flies",
   "see_invis",
   "unique",
   "tall_tile"
  ],
  "resists": {
   "poison": 1,
   "cold": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "serpent_of_hell_coc",
  "uses": null,
  "habitat": null
 },
 {
  "id": "serpent-of-hell-dis",
  "enumName": "MONS_SERPENT_OF_HELL_DIS",
  "name": "Serpent of Hell",
  "hd": 17,
  "hp10x": 3230,
  "ac": 28,
  "ev": 4,
  "will": 180,
  "exp": 6666,
  "attacks": [
   {
    "type": "bite",
    "damage": 40,
    "flavour": "reach"
   },
   {
    "type": "bite",
    "damage": 40,
    "flavour": "reach"
   },
   {
    "type": "bite",
    "damage": 40,
    "flavour": "reach"
   },
   {
    "type": "trample",
    "damage": 35,
    "flavour": "trample"
   }
  ],
  "speed": 14,
  "glyph": "D",
  "colour": "etc_iron",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "dragon",
  "species": "serpent_of_hell",
  "flags": [
   "name_the",
   "crash_doors",
   "see_invis",
   "unique",
   "tall_tile"
  ],
  "resists": {
   "poison": 1,
   "fire": 1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "serpent_of_hell_dis",
  "uses": null,
  "habitat": null
 },
 {
  "id": "serpent-of-hell-tartarus",
  "enumName": "MONS_SERPENT_OF_HELL_TARTARUS",
  "name": "Serpent of Hell",
  "hd": 17,
  "hp10x": 3230,
  "ac": 16,
  "ev": 12,
  "will": 180,
  "exp": 6666,
  "attacks": [
   {
    "type": "bite",
    "damage": 35,
    "flavour": "drain"
   },
   {
    "type": "bite",
    "damage": 35,
    "flavour": "drain"
   },
   {
    "type": "bite",
    "damage": 35,
    "flavour": "drain"
   },
   {
    "type": "trample",
    "damage": 25,
    "flavour": "trample"
   }
  ],
  "speed": 14,
  "glyph": "D",
  "colour": "etc_death",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "dragon",
  "species": "serpent_of_hell",
  "flags": [
   "name_the",
   "crash_doors",
   "flies",
   "see_invis",
   "unique",
   "tall_tile"
  ],
  "resists": {
   "poison": 1,
   "cold": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "serpent_of_hell_tar",
  "uses": null,
  "habitat": null
 },
 {
  "id": "serpent-of-hell",
  "enumName": "MONS_SERPENT_OF_HELL",
  "name": "Serpent of Hell",
  "hd": 17,
  "hp10x": 3230,
  "ac": 16,
  "ev": 12,
  "will": 180,
  "exp": 6666,
  "attacks": [
   {
    "type": "bite",
    "damage": 35,
    "flavour": "fire"
   },
   {
    "type": "bite",
    "damage": 35,
    "flavour": "fire"
   },
   {
    "type": "bite",
    "damage": 35,
    "flavour": "fire"
   },
   {
    "type": "trample",
    "damage": 25,
    "flavour": "trample"
   }
  ],
  "speed": 14,
  "glyph": "D",
  "colour": "etc_fire",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": "dragon",
  "species": "serpent_of_hell",
  "flags": [
   "name_the",
   "crash_doors",
   "flies",
   "see_invis",
   "unique",
   "tall_tile"
  ],
  "resists": {
   "poison": 1,
   "fire": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "serpent_of_hell_geh",
  "uses": null,
  "habitat": null
 },
 {
  "id": "servant-of-whispers",
  "enumName": "MONS_SERVANT_OF_WHISPERS",
  "name": "servant of whispers",
  "hd": 12,
  "hp10x": 800,
  "ac": 1,
  "ev": 12,
  "will": 60,
  "exp": 870,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "a",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "servant_of_whispers",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "shadow-demon",
  "enumName": "MONS_SHADOW_DEMON",
  "name": "shadow demon",
  "hd": 10,
  "hp10x": 550,
  "ac": 7,
  "ev": 12,
  "will": 100,
  "exp": 713,
  "attacks": [
   {
    "type": "hit",
    "damage": 21,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "2",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis"
  ],
  "resists": {
   "poison": 1,
   "cold": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "shadow_demon",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "shadow-dragon",
  "enumName": "MONS_SHADOW_DRAGON",
  "name": "shadow dragon",
  "hd": 17,
  "hp10x": 1275,
  "ac": 15,
  "ev": 10,
  "will": 120,
  "exp": 1406,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "drain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "cold_blood"
  ],
  "resists": {
   "poison": 1,
   "cold": 2,
   "neg": 3
  },
  "spells": "shadow_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "shadow-imp",
  "enumName": "MONS_SHADOW_IMP",
  "name": "shadow imp",
  "hd": 2,
  "hp10x": 110,
  "ac": 3,
  "ev": 11,
  "will": 10,
  "exp": 11,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "5",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks"
  ],
  "resists": {
   "poison": 1,
   "cold": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "shadow_imp",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "shadow-prism",
  "enumName": "MONS_SHADOW_PRISM",
  "name": "shadow prism",
  "hd": 8,
  "hp10x": 250,
  "ac": 5,
  "ev": 20,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "*",
  "colour": "etc_dithmenos",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "stationary",
   "no_exp_gain",
   "no_poly_to",
   "peripheral",
   "unstable"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "shadow-puppet",
  "enumName": "MONS_SHADOW_PUPPET",
  "name": "shadow puppet",
  "hd": 10,
  "hp10x": 350,
  "ac": 5,
  "ev": 20,
  "will": "invuln",
  "exp": 0,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "swoop"
   },
   {
    "type": "hit",
    "damage": 1,
    "flavour": "flank"
   },
   {
    "type": "hit",
    "damage": 1,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "E",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "insubstantial",
   "no_exp_gain",
   "no_poly_to"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "shadow-turret",
  "enumName": "MONS_SHADOW_TURRET",
  "name": "shadow turret",
  "hd": 10,
  "hp10x": 250,
  "ac": 9,
  "ev": 15,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 5,
  "glyph": "I",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "insubstantial",
   "no_exp_gain",
   "no_poly_to",
   "see_invis",
   "stationary"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "shadow_turret",
  "uses": null,
  "habitat": null
 },
 {
  "id": "shadow-wraith",
  "enumName": "MONS_SHADOW_WRAITH",
  "name": "shadow wraith",
  "hd": 10,
  "hp10x": 550,
  "ac": 7,
  "ev": 7,
  "will": 100,
  "exp": 761,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "drain_speed"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "wraith",
  "species": null,
  "flags": [
   "flies",
   "invis",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "shadowghast",
  "enumName": "MONS_SHADOWGHAST",
  "name": "shadowghast",
  "hd": 6,
  "hp10x": 240,
  "ac": 7,
  "ev": 10,
  "will": 40,
  "exp": 218,
  "attacks": [
   {
    "type": "claw",
    "damage": 14,
    "flavour": "shadowstab"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "animal",
  "holiness": [
   "undead"
  ],
  "genus": "wraith",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "shadowghast",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "shambling-mangrove",
  "enumName": "MONS_SHAMBLING_MANGROVE",
  "name": "shambling mangrove",
  "hd": 13,
  "hp10x": 910,
  "ac": 13,
  "ev": 3,
  "will": 100,
  "exp": 899,
  "attacks": [
   {
    "type": "hit",
    "damage": 41,
    "flavour": "plain"
   }
  ],
  "speed": 8,
  "glyph": "f",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "plant",
  "intelligence": "human",
  "holiness": [
   "plant"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": "shambling_mangrove",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "shapeshifter",
  "enumName": "MONS_SHAPESHIFTER",
  "name": "shapeshifter",
  "hd": 7,
  "hp10x": 385,
  "ac": 0,
  "ev": 10,
  "will": 40,
  "exp": 295,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {},
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "shard-shrike",
  "enumName": "MONS_SHARD_SHRIKE",
  "name": "shard shrike",
  "hd": 21,
  "hp10x": 1050,
  "ac": 2,
  "ev": 18,
  "will": 80,
  "exp": 3031,
  "attacks": [
   {
    "type": "claw",
    "damage": 21,
    "flavour": "cold"
   }
  ],
  "speed": 30,
  "glyph": "b",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "bird",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "batty",
   "warm_blood"
  ],
  "resists": {
   "cold": 2
  },
  "spells": "shard_shrike",
  "uses": null,
  "habitat": null
 },
 {
  "id": "shining-eye",
  "enumName": "MONS_SHINING_EYE",
  "name": "shining eye",
  "hd": 10,
  "hp10x": 580,
  "ac": 3,
  "ev": 1,
  "will": 100,
  "exp": 546,
  "attacks": [],
  "speed": 10,
  "glyph": "G",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "floating_eye",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "no_skeleton",
   "cautious"
  ],
  "resists": {
   "corr": 3
  },
  "spells": "shining_eye",
  "uses": null,
  "habitat": null
 },
 {
  "id": "shock-serpent",
  "enumName": "MONS_SHOCK_SERPENT",
  "name": "shock serpent",
  "hd": 10,
  "hp10x": 550,
  "ac": 2,
  "ev": 15,
  "will": 40,
  "exp": 788,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "elec"
   }
  ],
  "speed": 15,
  "glyph": "S",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "snake",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {
   "elec": 3
  },
  "spells": "shock_serpent",
  "uses": null,
  "habitat": null
 },
 {
  "id": "shooting-star",
  "enumName": "MONS_SHOOTING_STAR",
  "name": "shooting star",
  "hd": 1,
  "hp10x": 1,
  "ac": 0,
  "ev": 20,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 20,
  "glyph": "v",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial",
   "no_exp_gain",
   "no_poly_to",
   "peripheral",
   "no_threat"
  ],
  "resists": {
   "elec": 3,
   "fire": 3,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "sickly-merfolk-siren",
  "enumName": "MONS_SICKLY_MERFOLK_SIREN",
  "name": "sickly merfolk siren",
  "hd": 3,
  "hp10x": 135,
  "ac": 4,
  "ev": 12,
  "will": 60,
  "exp": 34,
  "attacks": [
   {
    "type": "hit",
    "damage": 19,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "m",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "merfolk",
  "flags": [
   "speaks",
   "warm_blood",
   "no_poly_to"
  ],
  "resists": {},
  "spells": "merfolk_siren",
  "uses": "weapons_armour",
  "habitat": "amphibious"
 },
 {
  "id": "sigmund",
  "enumName": "MONS_SIGMUND",
  "name": "Sigmund",
  "hd": 3,
  "hp10x": 270,
  "ac": 0,
  "ev": 11,
  "will": 10,
  "exp": 229,
  "attacks": [
   {
    "type": "hit",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "orc_wizard",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "silent-spectre",
  "enumName": "MONS_SILENT_SPECTRE",
  "name": "silent spectre",
  "hd": 8,
  "hp10x": 440,
  "ac": 5,
  "ev": 15,
  "will": 40,
  "exp": 312,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "wraith",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "speaks",
   "insubstantial"
  ],
  "resists": {
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "simulacrum",
  "enumName": "MONS_SIMULACRUM",
  "name": "simulacrum",
  "hd": 2,
  "hp10x": 110,
  "ac": 10,
  "ev": 4,
  "will": 0,
  "exp": 9,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 7,
  "glyph": "Z",
  "colour": "lightblue",
  "spriteKey": "enemy_simulacrum",
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_regen"
  ],
  "resists": {
   "fire": -1,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "sin-beast",
  "enumName": "MONS_SIN_BEAST",
  "name": "sin beast",
  "hd": 12,
  "hp10x": 810,
  "ac": 5,
  "ev": 14,
  "will": 20,
  "exp": 1287,
  "attacks": [
   {
    "type": "bite",
    "damage": 28,
    "flavour": "antimagic"
   },
   {
    "type": "trample",
    "damage": 20,
    "flavour": "trample"
   }
  ],
  "speed": 15,
  "glyph": "2",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fighter"
  ],
  "resists": {
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "sixfirhy",
  "enumName": "MONS_SIXFIRHY",
  "name": "sixfirhy",
  "hd": 9,
  "hp10x": 385,
  "ac": 2,
  "ev": 20,
  "will": 60,
  "exp": 760,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "elec"
   }
  ],
  "speed": 40,
  "glyph": "3",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "elec": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "skeletal-warrior",
  "enumName": "MONS_SKELETAL_WARRIOR",
  "name": "skeletal warrior",
  "hd": 10,
  "hp10x": 650,
  "ac": 15,
  "ev": 10,
  "will": 100,
  "exp": 759,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "z",
  "colour": "cyan",
  "spriteKey": "enemy_skeleton",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "fighter"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "sky-beast",
  "enumName": "MONS_SKY_BEAST",
  "name": "sky beast",
  "hd": 6,
  "hp10x": 275,
  "ac": 3,
  "ev": 13,
  "will": 20,
  "exp": 130,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "airstrike"
   }
  ],
  "speed": 10,
  "glyph": "F",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "fish",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "no_skeleton"
  ],
  "resists": {
   "elec": 3
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "skyshark",
  "enumName": "MONS_SKYSHARK",
  "name": "skyshark",
  "hd": 10,
  "hp10x": 750,
  "ac": 6,
  "ev": 8,
  "will": 40,
  "exp": 767,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "bloodzerk"
   },
   {
    "type": "tail_slap",
    "damage": 10,
    "flavour": "plain"
   },
   {
    "type": "tail_slap",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "F",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "fish",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "cold_blood",
   "no_skeleton"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "sleepcap",
  "enumName": "MONS_SLEEPCAP",
  "name": "sleepcap",
  "hd": 3,
  "hp10x": 270,
  "ac": 5,
  "ev": 0,
  "will": 10,
  "exp": 38,
  "attacks": [
   {
    "type": "spore",
    "damage": 9,
    "flavour": "sleep"
   }
  ],
  "speed": 10,
  "glyph": "f",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "fungus",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "fungus",
  "species": null,
  "flags": [],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "slime-creature",
  "enumName": "MONS_SLIME_CREATURE",
  "name": "slime creature",
  "hd": 11,
  "hp10x": 605,
  "ac": 1,
  "ev": 4,
  "will": 40,
  "exp": 236,
  "attacks": [
   {
    "type": "hit",
    "damage": 22,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "J",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "unblindable",
   "amorphous",
   "no_skeleton",
   "herd"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "slymdra",
  "enumName": "MONS_SLYMDRA",
  "name": "slymdra",
  "hd": 18,
  "hp10x": 400,
  "ac": 10,
  "ev": 3,
  "will": 120,
  "exp": 3100,
  "attacks": [
   {
    "type": "hit",
    "damage": 33,
    "flavour": "acid"
   }
  ],
  "speed": 10,
  "glyph": "J",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "eat_doors",
   "see_invis",
   "unblindable",
   "amorphous",
   "no_skeleton",
   "fast_regen",
   "herd"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "smoke-demon",
  "enumName": "MONS_SMOKE_DEMON",
  "name": "smoke demon",
  "hd": 7,
  "hp10x": 385,
  "ac": 5,
  "ev": 9,
  "will": 60,
  "exp": 428,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "3",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial"
  ],
  "resists": {
   "poison": 1,
   "fire": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "smoke_demon",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "snake",
  "enumName": "MONS_SNAKE",
  "name": "snake",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "S",
  "colour": "lightgreen",
  "spriteKey": "enemy_snake",
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "snaplasher-vine-segment",
  "enumName": "MONS_SNAPLASHER_VINE_SEGMENT",
  "name": "snaplasher vine segment",
  "hd": 12,
  "hp10x": 360,
  "ac": 6,
  "ev": 0,
  "will": 40,
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "*",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": "snaplasher_vine",
  "flags": [
   "stationary",
   "no_exp_gain",
   "no_poly_to",
   "no_threat",
   "peripheral"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "snaplasher-vine",
  "enumName": "MONS_SNAPLASHER_VINE",
  "name": "snaplasher vine",
  "hd": 12,
  "hp10x": 240,
  "ac": 4,
  "ev": 7,
  "will": 40,
  "exp": 0,
  "attacks": [
   {
    "type": "hit",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 13,
  "glyph": "w",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "snake",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "no_poly_to",
   "peripheral"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "snapping-turtle",
  "enumName": "MONS_SNAPPING_TURTLE",
  "name": "snapping turtle",
  "hd": 10,
  "hp10x": 600,
  "ac": 16,
  "ev": 5,
  "will": 40,
  "exp": 251,
  "attacks": [
   {
    "type": "bite",
    "damage": 35,
    "flavour": "reach"
   }
  ],
  "speed": 8,
  "glyph": "t",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped_tailless",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "snorg",
  "enumName": "MONS_SNORG",
  "name": "Snorg",
  "hd": 8,
  "hp10x": 960,
  "ac": 0,
  "ev": 10,
  "will": 60,
  "exp": 946,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "T",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "troll",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "fast_regen",
   "female"
  ],
  "resists": {},
  "spells": "snorg",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "sojobo",
  "enumName": "MONS_SOJOBO",
  "name": "Sojobo",
  "hd": 20,
  "hp10x": 1500,
  "ac": 2,
  "ev": 22,
  "will": 140,
  "exp": 3464,
  "attacks": [
   {
    "type": "hit",
    "damage": 28,
    "flavour": "plain"
   },
   {
    "type": "peck",
    "damage": 14,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Q",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "tengu",
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "sojobo",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "solar-ember",
  "enumName": "MONS_SOLAR_EMBER",
  "name": "solar ember",
  "hd": 5,
  "hp10x": 320,
  "ac": 5,
  "ev": 15,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 40,
  "glyph": "*",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "unblindable",
   "insubstantial",
   "no_exp_gain",
   "no_poly_to",
   "avatar",
   "fast_regen"
  ],
  "resists": {
   "fire": 3,
   "cold": -1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "sonja",
  "enumName": "MONS_SONJA",
  "name": "Sonja",
  "hd": 6,
  "hp10x": 300,
  "ac": 2,
  "ev": 24,
  "will": 10,
  "exp": 780,
  "attacks": [
   {
    "type": "hit",
    "damage": 9,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "K",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "kobold",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "sonja",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "soul-eater",
  "enumName": "MONS_SOUL_EATER",
  "name": "soul eater",
  "hd": 11,
  "hp10x": 605,
  "ac": 18,
  "ev": 10,
  "will": 140,
  "exp": 779,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "3",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis"
  ],
  "resists": {
   "poison": 1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "soul_eater",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "soul-wisp",
  "enumName": "MONS_SOUL_WISP",
  "name": "soul wisp",
  "hd": 2,
  "hp10x": 65,
  "ac": 3,
  "ev": 11,
  "will": 10,
  "exp": 11,
  "attacks": [
   {
    "type": "touch",
    "damage": 4,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "*",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "orb",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "spark-wasp",
  "enumName": "MONS_SPARK_WASP",
  "name": "spark wasp",
  "hd": 12,
  "hp10x": 660,
  "ac": 9,
  "ev": 14,
  "will": 40,
  "exp": 981,
  "attacks": [
   {
    "type": "sting",
    "damage": 33,
    "flavour": "elec"
   }
  ],
  "speed": 15,
  "glyph": "y",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "insect_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "elec": 3,
   "poison": -1
  },
  "spells": "spark_wasp",
  "uses": null,
  "habitat": null
 },
 {
  "id": "spatial-maelstrom",
  "enumName": "MONS_SPATIAL_MAELSTROM",
  "name": "spatial maelstrom",
  "hd": 10,
  "hp10x": 750,
  "ac": 0,
  "ev": 5,
  "will": "invuln",
  "exp": 756,
  "attacks": [
   {
    "type": "touch",
    "damage": 20,
    "flavour": "distort"
   },
   {
    "type": "engulf",
    "damage": 20,
    "flavour": "distort"
   }
  ],
  "speed": 16,
  "glyph": "v",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "batty",
   "insubstantial"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "spatial-vortex",
  "enumName": "MONS_SPATIAL_VORTEX",
  "name": "spatial vortex",
  "hd": 6,
  "hp10x": 540,
  "ac": 0,
  "ev": 5,
  "will": "invuln",
  "exp": 167,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "distort"
   }
  ],
  "speed": 15,
  "glyph": "v",
  "colour": "etc_random",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "confused",
   "insubstantial",
   "peripheral"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "spectator",
  "enumName": "MONS_SPECTATOR",
  "name": "spectator",
  "hd": 20,
  "hp10x": 1000,
  "ac": 0,
  "ev": 10,
  "will": 20,
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "p",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "human",
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "no_exp_gain",
   "no_poly_to",
   "no_gen_derived",
   "no_threat"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "spectral-thing",
  "enumName": "MONS_SPECTRAL_THING",
  "name": "spectral thing",
  "hd": 8,
  "hp10x": 440,
  "ac": 8,
  "ev": 5,
  "will": "invuln",
  "exp": 11,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 7,
  "glyph": "Z",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": "wraith",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "spectral-weapon",
  "enumName": "MONS_SPECTRAL_WEAPON",
  "name": "spectral weapon",
  "hd": 5,
  "hp10x": 250,
  "ac": 5,
  "ev": 10,
  "will": "invuln",
  "exp": 0,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 30,
  "glyph": "(",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "wraith",
  "species": null,
  "flags": [
   "flies",
   "unblindable",
   "ghost_demon",
   "insubstantial",
   "no_exp_gain",
   "avatar"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "spellspark-servitor",
  "enumName": "MONS_SPELLSPARK_SERVITOR",
  "name": "spellspark servitor",
  "hd": 8,
  "hp10x": 800,
  "ac": 10,
  "ev": 10,
  "will": "invuln",
  "exp": 1450,
  "attacks": [],
  "speed": 10,
  "glyph": "9",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "flies",
   "no_poly_to"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "sphinx-marauder",
  "enumName": "MONS_SPHINX_MARAUDER",
  "name": "sphinx marauder",
  "hd": 13,
  "hp10x": 840,
  "ac": 4,
  "ev": 12,
  "will": 60,
  "exp": 1615,
  "attacks": [
   {
    "type": "pounce",
    "damage": 13,
    "flavour": "airstrike"
   }
  ],
  "speed": 12,
  "glyph": "H",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_winged",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "sphinx",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "sphinx_marauder",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "sphinx",
  "enumName": "MONS_SPHINX",
  "name": "sphinx",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "H",
  "colour": "lightgrey",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "spider",
  "enumName": "MONS_SPIDER",
  "name": "spider",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": "s",
  "colour": "cyan",
  "spriteKey": "enemy_spider",
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "splinterfrost-barricade",
  "enumName": "MONS_SPLINTERFROST_BARRICADE",
  "name": "splinterfrost barricade",
  "hd": 10,
  "hp10x": 380,
  "ac": 15,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "fire": -1,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "spriggan-air-mage",
  "enumName": "MONS_SPRIGGAN_AIR_MAGE",
  "name": "spriggan air mage",
  "hd": 14,
  "hp10x": 490,
  "ac": 1,
  "ev": 20,
  "will": 140,
  "exp": 851,
  "attacks": [
   {
    "type": "hit",
    "damage": 16,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "i",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "spriggan",
  "flags": [
   "flies",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "spriggan_air_mage",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "spriggan-berserker",
  "enumName": "MONS_SPRIGGAN_BERSERKER",
  "name": "spriggan berserker",
  "hd": 12,
  "hp10x": 540,
  "ac": 2,
  "ev": 18,
  "will": 120,
  "exp": 792,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "i",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "spriggan",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "spriggan_berserker",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "spriggan-defender",
  "enumName": "MONS_SPRIGGAN_DEFENDER",
  "name": "spriggan defender",
  "hd": 15,
  "hp10x": 675,
  "ac": 3,
  "ev": 22,
  "will": 140,
  "exp": 1116,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 16,
  "glyph": "i",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "spriggan",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "spriggan-druid",
  "enumName": "MONS_SPRIGGAN_DRUID",
  "name": "spriggan druid",
  "hd": 11,
  "hp10x": 440,
  "ac": 1,
  "ev": 18,
  "will": 100,
  "exp": 726,
  "attacks": [
   {
    "type": "hit",
    "damage": 18,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "i",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "spriggan",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "spriggan_druid",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "spriggan-rider",
  "enumName": "MONS_SPRIGGAN_RIDER",
  "name": "spriggan rider",
  "hd": 11,
  "hp10x": 605,
  "ac": 1,
  "ev": 18,
  "will": 100,
  "exp": 734,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "i",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "spriggan",
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "poison": -1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "spriggan",
  "enumName": "MONS_SPRIGGAN",
  "name": "spriggan",
  "hd": 7,
  "hp10x": 245,
  "ac": 1,
  "ev": 18,
  "will": 60,
  "exp": 217,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "i",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "sprozz",
  "enumName": "MONS_SPROZZ",
  "name": "Sprozz",
  "hd": 5,
  "hp10x": 660,
  "ac": 0,
  "ev": 10,
  "will": 60,
  "exp": 575,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "g",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "goblin",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male",
   "two_weapons"
  ],
  "resists": {},
  "spells": "sprozz",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "star-jelly",
  "enumName": "MONS_STAR_JELLY",
  "name": "star jelly",
  "hd": 16,
  "hp10x": 805,
  "ac": 5,
  "ev": 12,
  "will": 80,
  "exp": 1350,
  "attacks": [
   {
    "type": "engulf",
    "damage": 34,
    "flavour": "antimagic"
   },
   {
    "type": "hit",
    "damage": 18,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "J",
  "colour": "etc_magic",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable",
   "amorphous",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "fire": 1,
   "cold": 1,
   "elec": 1,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "starcursed-mass",
  "enumName": "MONS_STARCURSED_MASS",
  "name": "starcursed mass",
  "hd": 12,
  "hp10x": 1500,
  "ac": 10,
  "ev": 0,
  "will": 100,
  "exp": 993,
  "attacks": [
   {
    "type": "engulf",
    "damage": 16,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "X",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "amorphous"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "starflower",
  "enumName": "MONS_STARFLOWER",
  "name": "starflower",
  "hd": 16,
  "hp10x": 900,
  "ac": 16,
  "ev": 0,
  "will": 100,
  "exp": 1062,
  "attacks": [
   {
    "type": "tentacle_slap",
    "damage": 22,
    "flavour": "rift"
   },
   {
    "type": "tentacle_slap",
    "damage": 17,
    "flavour": "reach"
   },
   {
    "type": "tentacle_slap",
    "damage": 13,
    "flavour": "distort"
   }
  ],
  "speed": 10,
  "glyph": "P",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "plant",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": null,
  "flags": [
   "stationary"
  ],
  "resists": {
   "poison": 1,
   "fire": 1,
   "cold": 1,
   "corr": 1,
   "torment": 1
  },
  "spells": "starflower",
  "uses": null,
  "habitat": null
 },
 {
  "id": "starspawn-tentacle-segment",
  "enumName": "MONS_STARSPAWN_TENTACLE_SEGMENT",
  "name": "starspawn tentacle segment",
  "hd": 11,
  "hp10x": 220,
  "ac": 8,
  "ev": 2,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "*",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "tentacled_starspawn",
  "species": null,
  "flags": [
   "flies",
   "stationary",
   "no_exp_gain",
   "no_poly_to",
   "no_threat",
   "peripheral"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "starspawn-tentacle",
  "enumName": "MONS_STARSPAWN_TENTACLE",
  "name": "starspawn tentacle",
  "hd": 21,
  "hp10x": 220,
  "ac": 8,
  "ev": 2,
  "will": "invuln",
  "exp": 0,
  "attacks": [
   {
    "type": "constrict",
    "damage": 4,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "w",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "snake",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "tentacled_starspawn",
  "species": null,
  "flags": [
   "flies",
   "stationary",
   "no_exp_gain",
   "no_poly_to",
   "peripheral"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "statue",
  "enumName": "MONS_STATUE",
  "name": "statue",
  "hd": 8,
  "hp10x": 720,
  "ac": 12,
  "ev": 1,
  "will": "invuln",
  "exp": 10,
  "attacks": [
   {
    "type": "weap_only",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "I",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "stationary",
   "archer",
   "no_poly_to",
   "prefer_ranged"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "cold": 2,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "steam-dragon",
  "enumName": "MONS_STEAM_DRAGON",
  "name": "steam dragon",
  "hd": 4,
  "hp10x": 300,
  "ac": 5,
  "ev": 10,
  "will": 20,
  "exp": 184,
  "attacks": [
   {
    "type": "bite",
    "damage": 12,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {
   "steam": 1
  },
  "spells": "steam_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "steelbarb-worm",
  "enumName": "MONS_STEELBARB_WORM",
  "name": "steelbarb worm",
  "hd": 10,
  "hp10x": 690,
  "ac": 11,
  "ev": 7,
  "will": 10,
  "exp": 634,
  "attacks": [
   {
    "type": "hit",
    "damage": 29,
    "flavour": "barbs"
   }
  ],
  "speed": 12,
  "glyph": "w",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "ribbon_worm",
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "fire": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "stoker",
  "enumName": "MONS_STOKER",
  "name": "stoker",
  "hd": 13,
  "hp10x": 800,
  "ac": 5,
  "ev": 12,
  "will": 120,
  "exp": 831,
  "attacks": [
   {
    "type": "touch",
    "damage": 15,
    "flavour": "fire"
   }
  ],
  "speed": 10,
  "glyph": "L",
  "colour": "etc_fire",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "lich",
  "species": null,
  "flags": [
   "no_skeleton"
  ],
  "resists": {
   "fire": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "stoker",
  "uses": null,
  "habitat": "amphibious_lava"
 },
 {
  "id": "stone-giant",
  "enumName": "MONS_STONE_GIANT",
  "name": "stone giant",
  "hd": 16,
  "hp10x": 880,
  "ac": 12,
  "ev": 2,
  "will": 80,
  "exp": 1084,
  "attacks": [
   {
    "type": "hit",
    "damage": 45,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "storm-dragon",
  "enumName": "MONS_STORM_DRAGON",
  "name": "storm dragon",
  "hd": 14,
  "hp10x": 1050,
  "ac": 13,
  "ev": 10,
  "will": 100,
  "exp": 1391,
  "attacks": [
   {
    "type": "bite",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "trample",
    "damage": 15,
    "flavour": "trample"
   }
  ],
  "speed": 12,
  "glyph": "D",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {
   "elec": 3
  },
  "spells": "storm_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "strange-machine",
  "enumName": "MONS_STRANGE_MACHINE",
  "name": "strange machine",
  "hd": 21,
  "hp10x": 900,
  "ac": 12,
  "ev": 1,
  "will": "invuln",
  "exp": 1370,
  "attacks": [],
  "speed": 10,
  "glyph": "I",
  "colour": "etc_silver",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary",
   "no_poly_to"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "cold": 2,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "strange_machine",
  "uses": null,
  "habitat": null
 },
 {
  "id": "sun-demon",
  "enumName": "MONS_SUN_DEMON",
  "name": "sun demon",
  "hd": 10,
  "hp10x": 550,
  "ac": 10,
  "ev": 12,
  "will": 80,
  "exp": 777,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "fire"
   }
  ],
  "speed": 12,
  "glyph": "3",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "orb",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 3,
   "cold": -1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "sun-moth",
  "enumName": "MONS_SUN_MOTH",
  "name": "sun moth",
  "hd": 9,
  "hp10x": 605,
  "ac": 6,
  "ev": 12,
  "will": 60,
  "exp": 697,
  "attacks": [
   {
    "type": "bite",
    "damage": 27,
    "flavour": "swoop"
   }
  ],
  "speed": 12,
  "glyph": "y",
  "colour": "etc_gold",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "insect_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "moth",
  "species": null,
  "flags": [
   "flies",
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "fire": 2
  },
  "spells": "sun_moth",
  "uses": null,
  "habitat": null
 },
 {
  "id": "swamp-dragon",
  "enumName": "MONS_SWAMP_DRAGON",
  "name": "swamp dragon",
  "hd": 9,
  "hp10x": 675,
  "ac": 7,
  "ev": 7,
  "will": 40,
  "exp": 703,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 11,
    "flavour": "plain"
   },
   {
    "type": "trample",
    "damage": 11,
    "flavour": "trample"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "swamp_dragon",
  "uses": null,
  "habitat": null
 },
 {
  "id": "swamp-drake",
  "enumName": "MONS_SWAMP_DRAKE",
  "name": "swamp drake",
  "hd": 4,
  "hp10x": 300,
  "ac": 3,
  "ev": 11,
  "will": 20,
  "exp": 135,
  "attacks": [
   {
    "type": "bite",
    "damage": 14,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "k",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "drake",
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "swamp_drake",
  "uses": null,
  "habitat": null
 },
 {
  "id": "swamp-worm",
  "enumName": "MONS_SWAMP_WORM",
  "name": "swamp worm",
  "hd": 10,
  "hp10x": 350,
  "ac": 3,
  "ev": 12,
  "will": 10,
  "exp": 162,
  "attacks": [
   {
    "type": "bite",
    "damage": 26,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "w",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "ribbon_worm",
  "species": null,
  "flags": [
   "no_skeleton"
  ],
  "resists": {},
  "spells": "swamp_worm",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "tainted-leviathan",
  "enumName": "MONS_TAINTED_LEVIATHAN",
  "name": "tainted leviathan",
  "hd": 18,
  "hp10x": 1500,
  "ac": 15,
  "ev": 2,
  "will": 120,
  "exp": 1771,
  "attacks": [
   {
    "type": "hit",
    "damage": 50,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 30,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood",
   "no_zombie",
   "miasma_ring"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "tainted_leviathan",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "tarantella",
  "enumName": "MONS_TARANTELLA",
  "name": "tarantella",
  "hd": 8,
  "hp10x": 280,
  "ac": 3,
  "ev": 14,
  "will": 20,
  "exp": 277,
  "attacks": [
   {
    "type": "touch",
    "damage": 19,
    "flavour": "confuse"
   }
  ],
  "speed": 15,
  "glyph": "s",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "arachnid",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "spider",
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "tengu-conjurer",
  "enumName": "MONS_TENGU_CONJURER",
  "name": "tengu conjurer",
  "hd": 7,
  "hp10x": 315,
  "ac": 2,
  "ev": 17,
  "will": 20,
  "exp": 341,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   },
   {
    "type": "peck",
    "damage": 5,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Q",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "tengu",
  "flags": [
   "flies",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "tengu_conjurer",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "tengu-reaver",
  "enumName": "MONS_TENGU_REAVER",
  "name": "tengu reaver",
  "hd": 17,
  "hp10x": 850,
  "ac": 2,
  "ev": 17,
  "will": 60,
  "exp": 1406,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   },
   {
    "type": "peck",
    "damage": 11,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 11,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Q",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "tengu",
  "flags": [
   "flies",
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "tengu_reaver",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "tengu-warrior",
  "enumName": "MONS_TENGU_WARRIOR",
  "name": "tengu warrior",
  "hd": 10,
  "hp10x": 600,
  "ac": 2,
  "ev": 17,
  "will": 40,
  "exp": 808,
  "attacks": [
   {
    "type": "hit",
    "damage": 16,
    "flavour": "flank"
   },
   {
    "type": "peck",
    "damage": 8,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 8,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Q",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "tengu",
  "flags": [
   "flies",
   "fighter",
   "speaks",
   "warm_blood",
   "archer"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "tengu",
  "enumName": "MONS_TENGU",
  "name": "tengu",
  "hd": 5,
  "hp10x": 225,
  "ac": 2,
  "ev": 12,
  "will": 20,
  "exp": 118,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   },
   {
    "type": "peck",
    "damage": 5,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Q",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "speaks",
   "no_poly_to",
   "no_gen_derived",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "tentacled-monstrosity",
  "enumName": "MONS_TENTACLED_MONSTROSITY",
  "name": "tentacled monstrosity",
  "hd": 23,
  "hp10x": 1265,
  "ac": 5,
  "ev": 5,
  "will": 160,
  "exp": 1843,
  "attacks": [
   {
    "type": "tentacle_slap",
    "damage": 22,
    "flavour": "plain"
   },
   {
    "type": "tentacle_slap",
    "damage": 17,
    "flavour": "plain"
   },
   {
    "type": "tentacle_slap",
    "damage": 13,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 6,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "X",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "fire": 1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": "amphibious"
 },
 {
  "id": "tentacled-starspawn",
  "enumName": "MONS_TENTACLED_STARSPAWN",
  "name": "tentacled starspawn",
  "hd": 16,
  "hp10x": 880,
  "ac": 5,
  "ev": 5,
  "will": 120,
  "exp": 1507,
  "attacks": [
   {
    "type": "bite",
    "damage": 40,
    "flavour": "plain"
   },
   {
    "type": "engulf",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "X",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "tentacled_starspawn",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "terence",
  "enumName": "MONS_TERENCE",
  "name": "Terence",
  "hd": 2,
  "hp10x": 200,
  "ac": 0,
  "ev": 10,
  "will": 10,
  "exp": 36,
  "attacks": [
   {
    "type": "hit",
    "damage": 5,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "@",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "thermic-dynamo",
  "enumName": "MONS_THERMIC_DYNAMO",
  "name": "thermic dynamo",
  "hd": 10,
  "hp10x": 380,
  "ac": 4,
  "ev": 16,
  "will": "invuln",
  "exp": 634,
  "attacks": [
   {
    "type": "touch",
    "damage": 18,
    "flavour": "fire"
   },
   {
    "type": "engulf",
    "damage": 14,
    "flavour": "cold"
   }
  ],
  "speed": 10,
  "glyph": "v",
  "colour": "etc_vehumet",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "fire_vortex",
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "speaks"
  ],
  "resists": {
   "fire": 3,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "thermic_dynamo",
  "uses": null,
  "habitat": null
 },
 {
  "id": "thorn-hunter",
  "enumName": "MONS_THORN_HUNTER",
  "name": "thorn hunter",
  "hd": 15,
  "hp10x": 975,
  "ac": 9,
  "ev": 9,
  "will": 100,
  "exp": 1431,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 23,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "f",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "plant",
  "intelligence": "animal",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": null,
  "flags": [
   "see_invis"
  ],
  "resists": {
   "poison": 1,
   "fire": -1,
   "torment": 1
  },
  "spells": "thorn_hunter",
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "thrashing-horror",
  "enumName": "MONS_THRASHING_HORROR",
  "name": "thrashing horror",
  "hd": 9,
  "hp10x": 495,
  "ac": 5,
  "ev": 10,
  "will": 60,
  "exp": 795,
  "attacks": [
   {
    "type": "trample",
    "damage": 17,
    "flavour": "trample"
   },
   {
    "type": "trample",
    "damage": 9,
    "flavour": "trample"
   }
  ],
  "speed": 25,
  "glyph": "X",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "batty",
   "no_poly_to"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "thrashing_horror",
  "uses": null,
  "habitat": null
 },
 {
  "id": "tiamat",
  "enumName": "MONS_TIAMAT",
  "name": "Tiamat",
  "hd": 22,
  "hp10x": 3850,
  "ac": 30,
  "ev": 10,
  "will": 140,
  "exp": 5133,
  "attacks": [
   {
    "type": "hit",
    "damage": 60,
    "flavour": "plain"
   },
   {
    "type": "tail_slap",
    "damage": 45,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "colour_undef",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid_winged_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "draconian",
  "flags": [
   "flies",
   "see_invis",
   "speaks",
   "cold_blood",
   "unique",
   "female"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "titan",
  "enumName": "MONS_TITAN",
  "name": "titan",
  "hd": 20,
  "hp10x": 1100,
  "ac": 10,
  "ev": 3,
  "will": 180,
  "exp": 1664,
  "attacks": [
   {
    "type": "hit",
    "damage": 55,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "C",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "giant",
  "species": null,
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "elec": 3
  },
  "spells": "titan",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "toadstool",
  "enumName": "MONS_TOADSTOOL",
  "name": "toadstool",
  "hd": 1,
  "hp10x": 30,
  "ac": 1,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 0,
  "glyph": "P",
  "colour": "colour_undef",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "fungus",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "fungus",
  "species": null,
  "flags": [
   "stationary",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "toenail-golem",
  "enumName": "MONS_TOENAIL_GOLEM",
  "name": "toenail golem",
  "hd": 9,
  "hp10x": 585,
  "ac": 8,
  "ev": 5,
  "will": "invuln",
  "exp": 477,
  "attacks": [
   {
    "type": "gore",
    "damage": 13,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "9",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "tormentor",
  "enumName": "MONS_TORMENTOR",
  "name": "tormentor",
  "hd": 7,
  "hp10x": 385,
  "ac": 12,
  "ev": 12,
  "will": 60,
  "exp": 348,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "pain"
   },
   {
    "type": "hit",
    "damage": 8,
    "flavour": "pain"
   }
  ],
  "speed": 13,
  "glyph": "2",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks"
  ],
  "resists": {
   "poison": 1,
   "fire": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "tormentor",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "torpor-snail",
  "enumName": "MONS_TORPOR_SNAIL",
  "name": "torpor snail",
  "hd": 10,
  "hp10x": 600,
  "ac": 8,
  "ev": 1,
  "will": 80,
  "exp": 423,
  "attacks": [
   {
    "type": "bite",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 7,
  "glyph": "w",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "snail",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "elephant_slug",
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton",
   "has_aura"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "training-dummy",
  "enumName": "MONS_TRAINING_DUMMY",
  "name": "training dummy",
  "hd": 1,
  "hp10x": 60,
  "ac": 0,
  "ev": 0,
  "will": "invuln",
  "exp": 10,
  "attacks": [
   {
    "type": "weap_only",
    "damage": 1,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "I",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "stationary"
  ],
  "resists": {
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "troll",
  "enumName": "MONS_TROLL",
  "name": "troll",
  "hd": 7,
  "hp10x": 385,
  "ac": 3,
  "ev": 10,
  "will": 20,
  "exp": 307,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "T",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "fast_regen"
  ],
  "resists": {},
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "twister",
  "enumName": "MONS_TWISTER",
  "name": "twister",
  "hd": 12,
  "hp10x": 120000,
  "ac": 0,
  "ev": 5,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 10,
  "glyph": "v",
  "colour": "etc_air",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "fire_vortex",
  "species": null,
  "flags": [
   "flies",
   "confused",
   "batty",
   "insubstantial",
   "no_exp_gain",
   "no_poly_to"
  ],
  "resists": {
   "elec": 3,
   "fire": 1,
   "cold": 3,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "two-headed-ogre",
  "enumName": "MONS_TWO_HEADED_OGRE",
  "name": "two-headed ogre",
  "hd": 10,
  "hp10x": 550,
  "ac": 3,
  "ev": 6,
  "will": 40,
  "exp": 824,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "O",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "ogre",
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "two_weapons"
  ],
  "resists": {},
  "spells": null,
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "tyrant-leech",
  "enumName": "MONS_TYRANT_LEECH",
  "name": "tyrant leech",
  "hd": 12,
  "hp10x": 600,
  "ac": 5,
  "ev": 15,
  "will": 40,
  "exp": 287,
  "attacks": [
   {
    "type": "bite",
    "damage": 35,
    "flavour": "vampiric"
   }
  ],
  "speed": 8,
  "glyph": "w",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_skeleton"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "tzitzimitl",
  "enumName": "MONS_TZITZIMITL",
  "name": "Tzitzimitl",
  "hd": 22,
  "hp10x": 1050,
  "ac": 12,
  "ev": 16,
  "will": "invuln",
  "exp": 2056,
  "attacks": [
   {
    "type": "engulf",
    "damage": 25,
    "flavour": "drain_speed"
   },
   {
    "type": "bite",
    "damage": 25,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "1",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "cold": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "tzitzimitl",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "ufetubus",
  "enumName": "MONS_UFETUBUS",
  "name": "ufetubus",
  "hd": 1,
  "hp10x": 90,
  "ac": 2,
  "ev": 15,
  "will": 10,
  "exp": 8,
  "attacks": [
   {
    "type": "hit",
    "damage": 6,
    "flavour": "flank"
   },
   {
    "type": "hit",
    "damage": 6,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "5",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "bird",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "fire": -1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "ugly-thing",
  "enumName": "MONS_UGLY_THING",
  "name": "ugly thing",
  "hd": 12,
  "hp10x": 660,
  "ac": 4,
  "ev": 10,
  "will": 40,
  "exp": 555,
  "attacks": [
   {
    "type": "hit",
    "damage": 17,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "u",
  "colour": "colour_undef",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood",
   "ghost_demon",
   "herd",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "undertaker",
  "enumName": "MONS_UNDERTAKER",
  "name": "undertaker",
  "hd": 19,
  "hp10x": 1240,
  "ac": 18,
  "ev": 9,
  "will": "invuln",
  "exp": 2415,
  "attacks": [
   {
    "type": "claw",
    "damage": 42,
    "flavour": "drag"
   },
   {
    "type": "punch",
    "damage": 32,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "9",
  "colour": "etc_bone",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "undertaker",
  "uses": "open_doors",
  "habitat": "wall"
 },
 {
  "id": "undying-armoury",
  "enumName": "MONS_UNDYING_ARMOURY",
  "name": "undying armoury",
  "hd": 17,
  "hp10x": 970,
  "ac": 11,
  "ev": 19,
  "will": 120,
  "exp": 1673,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "v",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "insubstantial",
   "fighter"
  ],
  "resists": {
   "fire": 1,
   "cold": 1,
   "elec": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "undying_armoury",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "unseen-horror",
  "enumName": "MONS_UNSEEN_HORROR",
  "name": "unseen horror",
  "hd": 7,
  "hp10x": 385,
  "ac": 5,
  "ev": 10,
  "will": 20,
  "exp": 384,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 30,
  "glyph": "x",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "invis",
   "see_invis",
   "batty"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "urug",
  "enumName": "MONS_URUG",
  "name": "Urug",
  "hd": 9,
  "hp10x": 675,
  "ac": 2,
  "ev": 13,
  "will": 40,
  "exp": 795,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "o",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "orc",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "ushabti",
  "enumName": "MONS_USHABTI",
  "name": "ushabti",
  "hd": 7,
  "hp10x": 455,
  "ac": 9,
  "ev": 6,
  "will": "invuln",
  "exp": 205,
  "attacks": [
   {
    "type": "headbutt",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 8,
  "glyph": "9",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "fighter",
   "see_invis"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "ushabti",
  "uses": null,
  "habitat": null
 },
 {
  "id": "vampire-bat",
  "enumName": "MONS_VAMPIRE_BAT",
  "name": "vampire bat",
  "hd": 3,
  "hp10x": 145,
  "ac": 1,
  "ev": 14,
  "will": 10,
  "exp": 64,
  "attacks": [
   {
    "type": "bite",
    "damage": 6,
    "flavour": "vampiric"
   }
  ],
  "speed": 30,
  "glyph": "b",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "bat",
  "intelligence": "animal",
  "holiness": [
   "undead"
  ],
  "genus": "bat",
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "batty",
   "warm_blood",
   "no_poly_to"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "vampire-bloodprince",
  "enumName": "MONS_VAMPIRE_BLOODPRINCE",
  "name": "vampire bloodprince",
  "hd": 17,
  "hp10x": 1250,
  "ac": 15,
  "ev": 10,
  "will": 120,
  "exp": 2240,
  "attacks": [
   {
    "type": "claw",
    "damage": 45,
    "flavour": "plain"
   },
   {
    "type": "bite",
    "damage": 25,
    "flavour": "vampiric"
   }
  ],
  "speed": 10,
  "glyph": "V",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "vampire",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood",
   "gender_neutral",
   "flies"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "vampire_bloodprince",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "vampire-knight",
  "enumName": "MONS_VAMPIRE_KNIGHT",
  "name": "vampire knight",
  "hd": 11,
  "hp10x": 715,
  "ac": 10,
  "ev": 10,
  "will": 80,
  "exp": 1049,
  "attacks": [
   {
    "type": "hit",
    "damage": 33,
    "flavour": "plain"
   },
   {
    "type": "bite",
    "damage": 15,
    "flavour": "vampiric"
   }
  ],
  "speed": 10,
  "glyph": "V",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "vampire",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "vampire_knight",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "vampire-mage",
  "enumName": "MONS_VAMPIRE_MAGE",
  "name": "vampire mage",
  "hd": 10,
  "hp10x": 550,
  "ac": 10,
  "ev": 10,
  "will": 80,
  "exp": 802,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "bite",
    "damage": 15,
    "flavour": "vampiric"
   }
  ],
  "speed": 10,
  "glyph": "V",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": "vampire",
  "flags": [
   "flies",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "vampire_mage",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "vampire-mosquito",
  "enumName": "MONS_VAMPIRE_MOSQUITO",
  "name": "vampire mosquito",
  "hd": 5,
  "hp10x": 275,
  "ac": 2,
  "ev": 15,
  "will": 20,
  "exp": 179,
  "attacks": [
   {
    "type": "bite",
    "damage": 13,
    "flavour": "vampiric"
   }
  ],
  "speed": 19,
  "glyph": "y",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "insect_winged",
  "intelligence": "animal",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "no_skeleton",
   "no_zombie"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "vampire",
  "enumName": "MONS_VAMPIRE",
  "name": "vampire",
  "hd": 6,
  "hp10x": 330,
  "ac": 10,
  "ev": 10,
  "will": 40,
  "exp": 214,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   },
   {
    "type": "bite",
    "damage": 15,
    "flavour": "vampiric"
   }
  ],
  "speed": 10,
  "glyph": "V",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "vampire",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "vashnia",
  "enumName": "MONS_VASHNIA",
  "name": "Vashnia",
  "hd": 16,
  "hp10x": 1600,
  "ac": 6,
  "ev": 18,
  "will": 120,
  "exp": 3195,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "constrict",
    "damage": 7,
    "flavour": "crush"
   }
  ],
  "speed": 10,
  "glyph": "N",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "naga",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "naga",
  "flags": [
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "archer",
   "female",
   "prefer_ranged"
  ],
  "resists": {
   "poison": 1
  },
  "spells": "vashnia",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "vault-guard",
  "enumName": "MONS_VAULT_GUARD",
  "name": "vault guard",
  "hd": 13,
  "hp10x": 715,
  "ac": 1,
  "ev": 13,
  "will": 60,
  "exp": 869,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "vault-sentinel",
  "enumName": "MONS_VAULT_SENTINEL",
  "name": "vault sentinel",
  "hd": 8,
  "hp10x": 520,
  "ac": 1,
  "ev": 13,
  "will": 40,
  "exp": 448,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "vault_sentinel",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "vault-warden",
  "enumName": "MONS_VAULT_WARDEN",
  "name": "vault warden",
  "hd": 16,
  "hp10x": 880,
  "ac": 1,
  "ev": 13,
  "will": 60,
  "exp": 1219,
  "attacks": [
   {
    "type": "hit",
    "damage": 36,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "p",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "fighter",
   "see_invis",
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "vault_warden",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "very-ugly-thing",
  "enumName": "MONS_VERY_UGLY_THING",
  "name": "very ugly thing",
  "hd": 18,
  "hp10x": 990,
  "ac": 6,
  "ev": 10,
  "will": 40,
  "exp": 1094,
  "attacks": [
   {
    "type": "hit",
    "damage": 27,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "u",
  "colour": "colour_undef",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "ugly_thing",
  "species": null,
  "flags": [
   "warm_blood",
   "ghost_demon",
   "herd",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "vine-stalker",
  "enumName": "MONS_VINE_STALKER",
  "name": "vine stalker",
  "hd": 8,
  "hp10x": 360,
  "ac": 2,
  "ev": 12,
  "will": 40,
  "exp": 390,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   },
   {
    "type": "bite",
    "damage": 10,
    "flavour": "antimagic"
   }
  ],
  "speed": 10,
  "glyph": "f",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "fast_regen",
   "no_skeleton",
   "no_poly_to",
   "no_gen_derived"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "void-ooze",
  "enumName": "MONS_VOID_OOZE",
  "name": "void ooze",
  "hd": 13,
  "hp10x": 500,
  "ac": 3,
  "ev": 15,
  "will": "invuln",
  "exp": 1110,
  "attacks": [
   {
    "type": "engulf",
    "damage": 27,
    "flavour": "flood"
   },
   {
    "type": "touch",
    "damage": 15,
    "flavour": "dim"
   }
  ],
  "speed": 16,
  "glyph": "J",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "blob",
  "intelligence": "brainless",
  "holiness": [
   "natural"
  ],
  "genus": "jelly",
  "species": null,
  "flags": [
   "eat_doors",
   "see_invis",
   "unblindable",
   "amorphous",
   "no_skeleton"
  ],
  "resists": {
   "poison": 1,
   "corr": 3
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "vv",
  "enumName": "MONS_VV",
  "name": "Vv",
  "hd": 23,
  "hp10x": 2700,
  "ac": 27,
  "ev": 12,
  "will": 140,
  "exp": 3226,
  "attacks": [
   {
    "type": "hit",
    "damage": 35,
    "flavour": "cold"
   },
   {
    "type": "hit",
    "damage": 35,
    "flavour": "fire"
   }
  ],
  "speed": 10,
  "glyph": "9",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "unique",
   "female"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "vv",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "walking-alembic",
  "enumName": "MONS_WALKING_ALEMBIC",
  "name": "walking alembic",
  "hd": 9,
  "hp10x": 580,
  "ac": 9,
  "ev": 8,
  "will": "invuln",
  "exp": 350,
  "attacks": [
   {
    "type": "punch",
    "damage": 19,
    "flavour": "alembic"
   }
  ],
  "speed": 10,
  "glyph": "9",
  "colour": "etc_elven",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "fighter"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "walking-tome",
  "enumName": "MONS_WALKING_TOME",
  "name": "walking tome",
  "hd": 0,
  "hp10x": 0,
  "ac": 0,
  "ev": 0,
  "will": 10,
  "exp": 10,
  "attacks": [],
  "speed": 0,
  "glyph": ";",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "cant_spawn"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "wandering-mushroom",
  "enumName": "MONS_WANDERING_MUSHROOM",
  "name": "wandering mushroom",
  "hd": 8,
  "hp10x": 440,
  "ac": 5,
  "ev": 0,
  "will": 40,
  "exp": 315,
  "attacks": [
   {
    "type": "spore",
    "damage": 20,
    "flavour": "confuse"
   }
  ],
  "speed": 10,
  "glyph": "f",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "fungus",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "fungus",
  "species": null,
  "flags": [],
  "resists": {
   "poison": 1,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "war-gargoyle",
  "enumName": "MONS_WAR_GARGOYLE",
  "name": "war gargoyle",
  "hd": 10,
  "hp10x": 520,
  "ac": 25,
  "ev": 4,
  "will": 100,
  "exp": 992,
  "attacks": [
   {
    "type": "hit",
    "damage": 40,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "9",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged_tailed",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": "golem",
  "species": null,
  "flags": [
   "flies",
   "fighter",
   "see_invis"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "petrify": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "war_gargoyle",
  "uses": "starting_equipment",
  "habitat": null
 },
 {
  "id": "warg",
  "enumName": "MONS_WARG",
  "name": "warg",
  "hd": 5,
  "hp10x": 325,
  "ac": 9,
  "ev": 12,
  "will": 40,
  "exp": 187,
  "attacks": [
   {
    "type": "bite",
    "damage": 25,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "h",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "hound",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable",
   "warm_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "water-elemental",
  "enumName": "MONS_WATER_ELEMENTAL",
  "name": "water elemental",
  "hd": 6,
  "hp10x": 420,
  "ac": 4,
  "ev": 7,
  "will": "invuln",
  "exp": 212,
  "attacks": [
   {
    "type": "engulf",
    "damage": 22,
    "flavour": "flood"
   }
  ],
  "speed": 10,
  "glyph": "E",
  "colour": "etc_water",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": "elemental",
  "species": null,
  "flags": [
   "amorphous"
  ],
  "resists": {
   "elec": 1,
   "fire": -1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "water-moccasin",
  "enumName": "MONS_WATER_MOCCASIN",
  "name": "water moccasin",
  "hd": 5,
  "hp10x": 275,
  "ac": 2,
  "ev": 15,
  "will": 20,
  "exp": 149,
  "attacks": [
   {
    "type": "bite",
    "damage": 10,
    "flavour": "poison"
   }
  ],
  "speed": 14,
  "glyph": "S",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "snake",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "snake",
  "species": null,
  "flags": [
   "cold_blood"
  ],
  "resists": {
   "poison": 1
  },
  "spells": null,
  "uses": null,
  "habitat": "amphibious"
 },
 {
  "id": "water-nymph",
  "enumName": "MONS_WATER_NYMPH",
  "name": "water nymph",
  "hd": 10,
  "hp10x": 400,
  "ac": 2,
  "ev": 13,
  "will": 100,
  "exp": 660,
  "attacks": [
   {
    "type": "touch",
    "damage": 12,
    "flavour": "drown"
   }
  ],
  "speed": 10,
  "glyph": "m",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood"
  ],
  "resists": {},
  "spells": "water_nymph",
  "uses": "open_doors",
  "habitat": "amphibious"
 },
 {
  "id": "weeping-skull",
  "enumName": "MONS_WEEPING_SKULL",
  "name": "weeping skull",
  "hd": 5,
  "hp10x": 280,
  "ac": 7,
  "ev": 3,
  "will": 20,
  "exp": 98,
  "attacks": [
   {
    "type": "touch",
    "damage": 10,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "z",
  "colour": "lightblue",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "misc",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "weeping_skull",
  "uses": null,
  "habitat": null
 },
 {
  "id": "wendigo",
  "enumName": "MONS_WENDIGO",
  "name": "wendigo",
  "hd": 15,
  "hp10x": 880,
  "ac": 4,
  "ev": 20,
  "will": 140,
  "exp": 994,
  "attacks": [
   {
    "type": "claw",
    "damage": 30,
    "flavour": "cold"
   },
   {
    "type": "bite",
    "damage": 20,
    "flavour": "vampiric"
   }
  ],
  "speed": 10,
  "glyph": "R",
  "colour": "blue",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis"
  ],
  "resists": {
   "poison": 1,
   "fire": -1,
   "cold": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "wendigo",
  "uses": null,
  "habitat": null
 },
 {
  "id": "white-draconian",
  "enumName": "MONS_WHITE_DRACONIAN",
  "name": "white draconian",
  "hd": 14,
  "hp10x": 980,
  "ac": 9,
  "ev": 10,
  "will": 40,
  "exp": 997,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "draconian",
  "species": null,
  "flags": [
   "speaks",
   "cold_blood"
  ],
  "resists": {
   "cold": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "white-imp",
  "enumName": "MONS_WHITE_IMP",
  "name": "white imp",
  "hd": 2,
  "hp10x": 110,
  "ac": 4,
  "ev": 10,
  "will": 10,
  "exp": 10,
  "attacks": [
   {
    "type": "hit",
    "damage": 4,
    "flavour": "cold"
   }
  ],
  "speed": 10,
  "glyph": "5",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "speaks"
  ],
  "resists": {
   "poison": 1,
   "fire": -1,
   "cold": 2,
   "neg": 3,
   "torment": 1
  },
  "spells": "white_imp",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "wight",
  "enumName": "MONS_WIGHT",
  "name": "wight",
  "hd": 3,
  "hp10x": 165,
  "ac": 4,
  "ev": 10,
  "will": 20,
  "exp": 73,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "drain"
   }
  ],
  "speed": 10,
  "glyph": "z",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [],
  "resists": {
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "wiglaf",
  "enumName": "MONS_WIGLAF",
  "name": "Wiglaf",
  "hd": 15,
  "hp10x": 1570,
  "ac": 4,
  "ev": 7,
  "will": 100,
  "exp": 1913,
  "attacks": [
   {
    "type": "hit",
    "damage": 26,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "g",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "dwarf",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "unique",
   "male"
  ],
  "resists": {},
  "spells": "wiglaf",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "will-o-the-wisp",
  "enumName": "MONS_WILL_O_THE_WISP",
  "name": "will-o-the-wisp",
  "hd": 10,
  "hp10x": 400,
  "ac": 4,
  "ev": 10,
  "will": "invuln",
  "exp": 532,
  "attacks": [],
  "speed": 10,
  "glyph": "v",
  "colour": "green",
  "spriteKey": null,
  "sizePixels": 12,
  "size": "tiny",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "elec": 1,
   "fire": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "will_o_the_wisp",
  "uses": null,
  "habitat": null
 },
 {
  "id": "wind-drake",
  "enumName": "MONS_WIND_DRAKE",
  "name": "wind drake",
  "hd": 8,
  "hp10x": 600,
  "ac": 3,
  "ev": 14,
  "will": 40,
  "exp": 285,
  "attacks": [
   {
    "type": "bite",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 12,
  "glyph": "k",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "drake",
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {},
  "spells": "wind_drake",
  "uses": null,
  "habitat": null
 },
 {
  "id": "withered-plant",
  "enumName": "MONS_WITHERED_PLANT",
  "name": "withered plant",
  "hd": 10,
  "hp10x": 2000,
  "ac": 0,
  "ev": 0,
  "will": "invuln",
  "exp": 0,
  "attacks": [],
  "speed": 0,
  "glyph": "P",
  "colour": "darkgray",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "plant",
  "intelligence": "brainless",
  "holiness": [
   "plant"
  ],
  "genus": "plant",
  "species": null,
  "flags": [
   "fragile",
   "stationary",
   "no_exp_gain",
   "no_threat"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "wolf-spider",
  "enumName": "MONS_WOLF_SPIDER",
  "name": "wolf spider",
  "hd": 11,
  "hp10x": 550,
  "ac": 3,
  "ev": 10,
  "will": 20,
  "exp": 564,
  "attacks": [
   {
    "type": "hit",
    "damage": 25,
    "flavour": "plain"
   },
   {
    "type": "bite",
    "damage": 15,
    "flavour": "poison"
   }
  ],
  "speed": 15,
  "glyph": "s",
  "colour": "white",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "arachnid",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "spider",
  "species": null,
  "flags": [
   "web_immune",
   "no_skeleton"
  ],
  "resists": {
   "poison": -1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "wolf",
  "enumName": "MONS_WOLF",
  "name": "wolf",
  "hd": 4,
  "hp10x": 220,
  "ac": 4,
  "ev": 15,
  "will": 20,
  "exp": 117,
  "attacks": [
   {
    "type": "bite",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 17,
  "glyph": "h",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": "hound",
  "species": null,
  "flags": [
   "see_invis",
   "unblindable",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "worldbinder",
  "enumName": "MONS_WORLDBINDER",
  "name": "worldbinder",
  "hd": 8,
  "hp10x": 400,
  "ac": 12,
  "ev": 4,
  "will": 60,
  "exp": 512,
  "attacks": [
   {
    "type": "hit",
    "damage": 8,
    "flavour": "plain"
   },
   {
    "type": "hit",
    "damage": 8,
    "flavour": "plain"
   }
  ],
  "speed": 14,
  "glyph": "x",
  "colour": "cyan",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "worldbinder",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "wraith",
  "enumName": "MONS_WRAITH",
  "name": "wraith",
  "hd": 6,
  "hp10x": 330,
  "ac": 10,
  "ev": 10,
  "will": 60,
  "exp": 209,
  "attacks": [
   {
    "type": "hit",
    "damage": 15,
    "flavour": "drain_speed"
   }
  ],
  "speed": 10,
  "glyph": "W",
  "colour": "lightgray",
  "spriteKey": "enemy_spectre",
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "wretched-star",
  "enumName": "MONS_WRETCHED_STAR",
  "name": "wretched star",
  "hd": 10,
  "hp10x": 700,
  "ac": 10,
  "ev": 10,
  "will": "invuln",
  "exp": 770,
  "attacks": [],
  "speed": 10,
  "glyph": "*",
  "colour": "magenta",
  "spriteKey": null,
  "sizePixels": 15,
  "size": "little",
  "shape": "orb",
  "intelligence": "human",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "elec": 1,
   "fire": 1,
   "cold": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "wretched_star",
  "uses": null,
  "habitat": null
 },
 {
  "id": "wyrmhole",
  "enumName": "MONS_WYRMHOLE",
  "name": "wyrmhole",
  "hd": 18,
  "hp10x": 845,
  "ac": 8,
  "ev": 22,
  "will": "invuln",
  "exp": 2297,
  "attacks": [
   {
    "type": "bite",
    "damage": 44,
    "flavour": "blink_with"
   }
  ],
  "speed": 12,
  "glyph": "k",
  "colour": "lightmagenta",
  "spriteKey": null,
  "sizePixels": 18,
  "size": "small",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "nonliving"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "see_invis",
   "insubstantial"
  ],
  "resists": {
   "fire": 1,
   "cold": 1,
   "elec": 1,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": "wyrmhole",
  "uses": null,
  "habitat": null
 },
 {
  "id": "wyvern",
  "enumName": "MONS_WYVERN",
  "name": "wyvern",
  "hd": 5,
  "hp10x": 275,
  "ac": 5,
  "ev": 10,
  "will": 20,
  "exp": 207,
  "attacks": [
   {
    "type": "bite",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 15,
  "glyph": "k",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped_winged",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies",
   "warm_blood"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "xakkrixis",
  "enumName": "MONS_XAKKRIXIS",
  "name": "Xak'krixis",
  "hd": 17,
  "hp10x": 1650,
  "ac": 3,
  "ev": 10,
  "will": 80,
  "exp": 1492,
  "attacks": [
   {
    "type": "hit",
    "damage": 24,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "B",
  "colour": "lightgreen",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "formicid",
  "species": null,
  "flags": [
   "see_invis",
   "speaks",
   "unique",
   "warm_blood",
   "no_skeleton",
   "gender_neutral",
   "burrows"
  ],
  "resists": {},
  "spells": "xakkrixis",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "xtahua",
  "enumName": "MONS_XTAHUA",
  "name": "Xtahua",
  "hd": 20,
  "hp10x": 2350,
  "ac": 18,
  "ev": 7,
  "will": 180,
  "exp": 3664,
  "attacks": [
   {
    "type": "bite",
    "damage": 44,
    "flavour": "plain"
   },
   {
    "type": "claw",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "trample",
    "damage": 27,
    "flavour": "trample"
   }
  ],
  "speed": 10,
  "glyph": "D",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 32,
  "size": "giant",
  "shape": "quadruped_winged",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "dragon",
  "species": "fire_dragon",
  "flags": [
   "crash_doors",
   "flies",
   "see_invis",
   "speaks",
   "warm_blood",
   "unique",
   "gender_neutral"
  ],
  "resists": {
   "poison": 1,
   "fire": 2,
   "cold": -1
  },
  "spells": "xtahua",
  "uses": null,
  "habitat": null
 },
 {
  "id": "yak",
  "enumName": "MONS_YAK",
  "name": "yak",
  "hd": 7,
  "hp10x": 385,
  "ac": 4,
  "ev": 7,
  "will": 20,
  "exp": 204,
  "attacks": [
   {
    "type": "gore",
    "damage": 18,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "Y",
  "colour": "brown",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "quadruped",
  "intelligence": "animal",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "warm_blood",
   "herd"
  ],
  "resists": {},
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "yaktaur-captain",
  "enumName": "MONS_YAKTAUR_CAPTAIN",
  "name": "yaktaur captain",
  "hd": 14,
  "hp10x": 770,
  "ac": 5,
  "ev": 5,
  "will": 60,
  "exp": 895,
  "attacks": [
   {
    "type": "hit",
    "damage": 30,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "c",
  "colour": "lightred",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "centaur",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "yaktaur",
  "flags": [
   "fighter",
   "speaks",
   "warm_blood",
   "archer"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "yaktaur",
  "enumName": "MONS_YAKTAUR",
  "name": "yaktaur",
  "hd": 8,
  "hp10x": 440,
  "ac": 4,
  "ev": 4,
  "will": 40,
  "exp": 360,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "c",
  "colour": "red",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "centaur",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "speaks",
   "warm_blood",
   "archer"
  ],
  "resists": {},
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "yellow-draconian",
  "enumName": "MONS_YELLOW_DRACONIAN",
  "name": "yellow draconian",
  "hd": 14,
  "hp10x": 980,
  "ac": 9,
  "ev": 10,
  "will": 40,
  "exp": 1042,
  "attacks": [
   {
    "type": "hit",
    "damage": 20,
    "flavour": "plain"
   },
   {
    "type": "bite",
    "damage": 12,
    "flavour": "acid"
   }
  ],
  "speed": 10,
  "glyph": "d",
  "colour": "yellow",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_tailed",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": "draconian",
  "species": null,
  "flags": [
   "speaks",
   "cold_blood"
  ],
  "resists": {
   "corr": 1
  },
  "spells": null,
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "ynoxinul",
  "enumName": "MONS_YNOXINUL",
  "name": "ynoxinul",
  "hd": 6,
  "hp10x": 330,
  "ac": 3,
  "ev": 10,
  "will": 40,
  "exp": 212,
  "attacks": [
   {
    "type": "hit",
    "damage": 12,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "3",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid_winged",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "flies"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "cold": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "ynoxinul",
  "uses": "open_doors",
  "habitat": null
 },
 {
  "id": "zenata",
  "enumName": "MONS_ZENATA",
  "name": "Zenata",
  "hd": 15,
  "hp10x": 1800,
  "ac": 10,
  "ev": 10,
  "will": 100,
  "exp": 1864,
  "attacks": [
   {
    "type": "hit",
    "damage": 35,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "a",
  "colour": "lightgray",
  "spriteKey": null,
  "sizePixels": 22,
  "size": "medium",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "natural"
  ],
  "genus": null,
  "species": "human",
  "flags": [
   "speaks",
   "warm_blood",
   "unique",
   "female"
  ],
  "resists": {},
  "spells": "zenata",
  "uses": "weapons_armour",
  "habitat": null
 },
 {
  "id": "zombie",
  "enumName": "MONS_ZOMBIE",
  "name": "zombie",
  "hd": 1,
  "hp10x": 75,
  "ac": 0,
  "ev": 4,
  "will": 0,
  "exp": 9,
  "attacks": [
   {
    "type": "hit",
    "damage": 10,
    "flavour": "plain"
   }
  ],
  "speed": 5,
  "glyph": "Z",
  "colour": "brown",
  "spriteKey": "enemy_skeleton",
  "sizePixels": 18,
  "size": "small",
  "shape": "misc",
  "intelligence": "brainless",
  "holiness": [
   "undead"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "no_regen"
  ],
  "resists": {
   "cold": 2,
   "poison": 3,
   "neg": 3,
   "torment": 1
  },
  "spells": null,
  "uses": null,
  "habitat": null
 },
 {
  "id": "zykzyl",
  "enumName": "MONS_ZYKZYL",
  "name": "zykzyl",
  "hd": 11,
  "hp10x": 1145,
  "ac": 3,
  "ev": 7,
  "will": 160,
  "exp": 1200,
  "attacks": [
   {
    "type": "hit",
    "damage": 31,
    "flavour": "plain"
   }
  ],
  "speed": 10,
  "glyph": "2",
  "colour": "lightcyan",
  "spriteKey": null,
  "sizePixels": 26,
  "size": "large",
  "shape": "humanoid",
  "intelligence": "human",
  "holiness": [
   "demonic"
  ],
  "genus": null,
  "species": null,
  "flags": [
   "see_invis"
  ],
  "resists": {
   "elec": 1,
   "poison": 1,
   "neg": 3,
   "torment": 1
  },
  "spells": "zykzyl",
  "uses": "open_doors",
  "habitat": null
 }
];

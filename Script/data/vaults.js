/**
 * @fileoverview DCSS 0.34 미니볼트. tools/import-vaults.js 가 만듭니다.
 *
 * 손으로 고치지 마세요. 원본은 crawl-ref/source/dat/des/ 입니다.
 *
 * 볼트는 손으로 그린 방입니다. 절차 생성이 만든 층 위에 찍어 넣으면
 * '누군가 설계한 곳'이 섞여 들어갑니다.
 *
 * 여기 있는 것은 방 하나 크기의 미니볼트뿐입니다. 층 전체를 정의하는
 * 볼트들은 80x70 을 전제로 쓰여 있어 이 게임의 30x30 에 들어가지 않습니다.
 *
 * 볼트 26개.
 */

export const VAULTS = [
    {"name":"glass_columns_a","weight":5,"tags":["serial_glass","transparent","allow_dup"],"rows":[".....",".m.m.",".....",".m.m.","....."],"subst":[]},
    {"name":"glass_columns_b","weight":3,"tags":["serial_glass","transparent","allow_dup"],"rows":[".......",".m.m.m.",".......",".m.m.m.",".......",".m.m.m.","......."],"subst":[]},
    {"name":"glass_columns_c","weight":2,"tags":["serial_glass","transparent","vaults_room","allow_dup"],"rows":[".........",".m.m.m.m.",".........",".m.m.m.m.",".........",".m.m.m.m.",".........",".m.m.m.m.","........."],"subst":[]},
    {"name":"small_statue_intersection","weight":10,"tags":["transparent","allow_dup","no_hmirror","no_vmirror","extra","ruin_lair","ruin_abyss","decor"],"rows":["xx.xx","xG.Gx",".....","xG.Gx","xx.xx"],"subst":[]},
    {"name":"minmay_strange_pillars","weight":10,"tags":["serial_glass_rare","transparent"],"rows":[" ...   ... ","..m.. ..m..",".mbm...mbm.","..m.. ..m.."," ...   ... ","  .     .  "," ...   ... ","..m.. ..m..",".mbm...mbm.","..m.. ..m.."," ...   ... "],"subst":[]},
    {"name":"minmay_fountain_box","weight":10,"tags":["transparent","extra","decor"],"rows":["xxxx+xxxx","x.......x","x.T...T.x","x.......x","+...U...+","x.......x","x.T...T.x","x.......x","xxxx+xxxx"],"subst":[{"from":"x","once":true,"choices":[{"glyph":"x","weight":10},{"glyph":"x","weight":10},{"glyph":"x","weight":10},{"glyph":"x","weight":10},{"glyph":"c","weight":10},{"glyph":"c","weight":10},{"glyph":"b","weight":10},{"glyph":"v","weight":10}]}]},
    {"name":"minmay_misc_feat_square","weight":10,"tags":["transparent","extra"],"rows":[".......",".xxxxx.",".xxxxx.",".xxxxx.",".xxxxx.",".xxxxx.","......."],"subst":[{"from":"x","once":false,"choices":[{"glyph":"x","weight":10},{"glyph":"'","weight":10}]}]},
    {"name":"minmay_misc_feat_plants","weight":10,"tags":["transparent","extra","decor"],"rows":["    ....    ","  ........  "," ...x..x... "," .......... ","..x......x..","............","............","..x......x.."," .......... "," ...x..x... ","  ........  ","    ....    "],"subst":[{"from":"x","once":true,"choices":[{"glyph":"x","weight":10},{"glyph":"x","weight":10},{"glyph":"x","weight":10},{"glyph":"x","weight":10},{"glyph":"c","weight":10},{"glyph":"v","weight":10},{"glyph":"b","weight":10},{"glyph":"m","weight":10},{"glyph":"G","weight":10},{"glyph":"t","weight":10},{"glyph":"1","weight":10},{"glyph":"2","weight":10},{"glyph":"3","weight":10}]}]},
    {"name":"minmay_misc_feat_rows","weight":10,"tags":["transparent","extra"],"rows":[".......",".xxxxx.",".......",".xxxxx.",".......",".xxxxx.",".......",".xxxxx.",".......",".xxxxx.","......."],"subst":[]},
    {"name":"minmay_misc_feat_doors","weight":10,"tags":["transparent","extra","decor"],"rows":["x.x.x.x.x",".........","x.xx+xx.x","..x...x..","x.+...+.x","..x...x..","x.xx+xx.x",".........","x.x.x.x.x"],"subst":[]},
    {"name":"minmay_misc_feat_five","weight":10,"tags":["transparent","extra","decor"],"rows":["...   ...",".x.....x.","....x....",".x.....x.","...   ..."],"subst":[{"from":"x","once":true,"choices":[{"glyph":"x","weight":10},{"glyph":"x","weight":10},{"glyph":"x","weight":10},{"glyph":"x","weight":10},{"glyph":"c","weight":10},{"glyph":"v","weight":10},{"glyph":"b","weight":10},{"glyph":"m","weight":10}]}]},
    {"name":"minmay_misc_feat_chi","weight":10,"tags":["transparent","extra","decor"],"rows":["..........",".xx.....x.","...x....x.","....x..x..","....xxx...","...xxx....","..x..x....",".x....x...",".x.....xx.",".........."],"subst":[]},
    {"name":"minmay_misc_feat_iff","weight":10,"tags":["transparent","extra","decor"],"rows":["  ........  "," ...xxxx... ","..xxx..xxx..",".xx......xx.",".....XX.....","....XXXX....","....XXXX....",".....XX.....",".xx......xx.","..xxx..xxx.."," ...xxxx... ","  ........  "],"subst":[{"from":"X","once":true,"choices":[{"glyph":"x","weight":10},{"glyph":"c","weight":10},{"glyph":"v","weight":10},{"glyph":"b","weight":10},{"glyph":".","weight":10}]}]},
    {"name":"minmay_misc_feat_columns","weight":10,"tags":["transparent","extra","decor"],"rows":["...      ",".x.      ",".x....   ",".x..x.   ","....x....","   .x..x.","   ....x.","      .x.","      ..."],"subst":[]},
    {"name":"minmay_misc_feat_cross","weight":10,"tags":["transparent","extra","decor"],"rows":["...........",".xxx.X.xxx.",".xxx.X.xxx.",".xxc.X.cxx.",".....X.....",".XXXXXXXXX.",".....X.....",".xxc.X.cxx.",".xxx.X.xxx.",".xxx.X.xxx.","..........."],"subst":[{"from":"X","once":true,"choices":[{"glyph":"x","weight":10},{"glyph":".","weight":10}]},{"from":"c","once":true,"choices":[{"glyph":"c","weight":10},{"glyph":"c","weight":10},{"glyph":"x","weight":10}]}]},
    {"name":"minmay_misc_feat_four_crosses","weight":10,"tags":["transparent","extra","decor"],"rows":["... ... ...",".G...G...G.","...c...c..."," .ccc.ccc. ","...c...c...",".G...G...G.","...c...c..."," .ccc.ccc. ","...c...c...",".G...G...G.","... ... ..."],"subst":[{"from":"c","once":true,"choices":[{"glyph":"c","weight":10},{"glyph":"c","weight":10},{"glyph":"x","weight":10}]},{"from":"G","once":true,"choices":[{"glyph":"G","weight":10},{"glyph":"G","weight":10},{"glyph":"G","weight":10},{"glyph":"b","weight":10}]}]},
    {"name":"minmay_misc_feat_tiny","weight":10,"tags":["transparent","extra","decor"],"rows":["......",".xx.x.",".x.xx.",".xx.x.",".x.xx.","......"],"subst":[]},
    {"name":"roderic_st_hans_cross","weight":1,"tags":["transparent","extra","decor"],"rows":["+xxxxxxxxxx+","x...xxxx...x","x.x.xxxx.x.x","x..........x","xxx.xxxx.xxx","xxx.xxxx.xxx","xxx.xxxx.xxx","xxx.xxxx.xxx","x..........x","x.x.xxxx.x.x","x...xxxx...x","+xxxxxxxxxx+"],"subst":[]},
    {"name":"roderic_malta_cross","weight":1,"tags":["transparent","allow_dup","extra","decor"],"rows":[" ......... ","...ccccc...","....ccc....",".c...c...c.",".cc..c..cc.",".ccccccccc.",".cc..c..cc.",".c...c...c.","....ccc....","...ccccc..."," ......... "],"subst":[]},
    {"name":"hex_tiny","weight":10,"tags":["transparent","extra","decor"],"rows":["  ...  "," .x.x. "," ..... ",".x.x.x."," ..... "," .x.x. ","  ...  "],"subst":[]},
    {"name":"grunt_decor_one_mirror","weight":10,"tags":["transparent","extra","decor"],"rows":["  ...  "," ..b.. ",".bb.bb.",".b.G.b.",".bb.bb."," ..b.. ","  ...  "],"subst":[{"from":"G","once":false,"choices":[{"glyph":"t","weight":10},{"glyph":"T","weight":10},{"glyph":"T","weight":10},{"glyph":"V","weight":10},{"glyph":"U","weight":10},{"glyph":"G","weight":10}]}]},
    {"name":"minivault_19","weight":10,"tags":["transparent","allow_dup","extra","ruin_lair","ruin_abyss","decor"],"rows":["............",".xx......xx.",".xxx....xxx.","..xxx..xxx..","...xxxxxx...","....xxxx....","....xxxx....","...xxxxxx...","..xxx..xxx..",".xxx....xxx.",".xx......xx.","............"],"subst":[]},
    {"name":"minivault_23","weight":10,"tags":["transparent","allow_dup","extra","ruin_lair","ruin_abyss","decor"],"rows":["x.x.x.x.x.x.",".x.x.x.x.x.x","x.x.x.x.x.x.",".x.x.x.x.x.x","x.x.x.x.x.x.",".x.x.x.x.x.x","x.x.x.x.x.x.",".x.x.x.x.x.x","x.x.x.x.x.x.",".x.x.x.x.x.x","x.x.x.x.x.x.",".x.x.x.x.x.x"],"subst":[]},
    {"name":"minivault_24","weight":10,"tags":["transparent","allow_dup","extra","ruin_lair","ruin_abyss","decor"],"rows":["............","....xxxx....","....xxxx....","....xxxx....",".xxxx.x.xxx.",".xxx.x.xxxx.",".xxxx.x.xxx.",".xxx.x.xxxx.","....xxxx....","....xxxx....","....xxxx....","............"],"subst":[]},
    {"name":"minivault_26","weight":10,"tags":["transparent","allow_dup","extra","ruin_lair","ruin_abyss","decor"],"rows":["c..........c",".c...cc...c.","..c..cc..c..","...c....c...","....c..c....",".cc..cc..cc.",".cc..cc..cc.","....c..c....","...c....c...","..c..cc..c..",".c...cc...c.","c..........c"],"subst":[]},
    {"name":"minivault_27","weight":10,"tags":["transparent","allow_dup","extra","ruin_lair","ruin_abyss","decor"],"rows":["............",".x.xxxxxxxx.",".x........x.",".xxxxxxxx.x.",".x........x.",".x.xxxxxxxx.",".x........x.",".xxxxxxxx.x.",".x........x.",".x.xxxxxxxx.","............"],"subst":[]},
];

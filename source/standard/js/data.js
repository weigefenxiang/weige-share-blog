// data.js —— 静态数据层(替代桌面版 VolumeCorrectionValue.db)
// 数据来源: StandardSolutionReviewSystem dbUtil.py (GB/T 601 体积温度补正值, 20℃基准, mL/1000mL)
// 温度范围 5~36℃(整数); null 表示该温度下无数据
'use strict';

var SSR_DATA = {};

// 体积校正表: SSR_DATA.table[温度][列名] -> 每1000mL的校正值(mL)
SSR_DATA.table = {
  5: {water__0_05: 1.38, water__0_1__0_2: 1.7, HCl__0_5: 1.9, HCl__1: 2.3, SA05_NaOH05: 2.4, SA1_NaOH1: 3.6, Na2CO3: 3.3, KOH_ethanol: null},
  6: {water__0_05: 1.38, water__0_1__0_2: 1.7, HCl__0_5: 1.9, HCl__1: 2.2, SA05_NaOH05: 2.3, SA1_NaOH1: 3.4, Na2CO3: 3.2, KOH_ethanol: null},
  7: {water__0_05: 1.36, water__0_1__0_2: 1.6, HCl__0_5: 1.8, HCl__1: 2.2, SA05_NaOH05: 2.2, SA1_NaOH1: 3.2, Na2CO3: 3.0, KOH_ethanol: null},
  8: {water__0_05: 1.33, water__0_1__0_2: 1.6, HCl__0_5: 1.8, HCl__1: 2.1, SA05_NaOH05: 2.2, SA1_NaOH1: 3.0, Na2CO3: 2.8, KOH_ethanol: null},
  9: {water__0_05: 1.29, water__0_1__0_2: 1.5, HCl__0_5: 1.7, HCl__1: 2.0, SA05_NaOH05: 2.1, SA1_NaOH1: 2.7, Na2CO3: 2.6, KOH_ethanol: null},
  10: {water__0_05: 1.23, water__0_1__0_2: 1.5, HCl__0_5: 1.6, HCl__1: 1.9, SA05_NaOH05: 2.0, SA1_NaOH1: 2.5, Na2CO3: 2.4, KOH_ethanol: 10.8},
  11: {water__0_05: 1.17, water__0_1__0_2: 1.4, HCl__0_5: 1.5, HCl__1: 1.8, SA05_NaOH05: 1.8, SA1_NaOH1: 2.3, Na2CO3: 2.2, KOH_ethanol: 9.6},
  12: {water__0_05: 1.1, water__0_1__0_2: 1.3, HCl__0_5: 1.4, HCl__1: 1.6, SA05_NaOH05: 1.7, SA1_NaOH1: 2.0, Na2CO3: 2.0, KOH_ethanol: 8.5},
  13: {water__0_05: 0.99, water__0_1__0_2: 1.1, HCl__0_5: 1.2, HCl__1: 1.4, SA05_NaOH05: 1.5, SA1_NaOH1: 1.8, Na2CO3: 1.8, KOH_ethanol: 7.4},
  14: {water__0_05: 0.88, water__0_1__0_2: 1.0, HCl__0_5: 1.1, HCl__1: 1.2, SA05_NaOH05: 1.3, SA1_NaOH1: 1.6, Na2CO3: 1.5, KOH_ethanol: 6.5},
  15: {water__0_05: 0.77, water__0_1__0_2: 0.9, HCl__0_5: 0.9, HCl__1: 1.0, SA05_NaOH05: 1.1, SA1_NaOH1: 1.3, Na2CO3: 1.3, KOH_ethanol: 5.2},
  16: {water__0_05: 0.64, water__0_1__0_2: 0.7, HCl__0_5: 0.8, HCl__1: 0.8, SA05_NaOH05: 0.9, SA1_NaOH1: 1.1, Na2CO3: 1.1, KOH_ethanol: 4.2},
  17: {water__0_05: 0.5, water__0_1__0_2: 0.6, HCl__0_5: 0.6, HCl__1: 0.6, SA05_NaOH05: 0.7, SA1_NaOH1: 0.8, Na2CO3: 0.8, KOH_ethanol: 3.1},
  18: {water__0_05: 0.34, water__0_1__0_2: 0.4, HCl__0_5: 0.4, HCl__1: 0.4, SA05_NaOH05: 0.5, SA1_NaOH1: 0.6, Na2CO3: 0.6, KOH_ethanol: 2.1},
  19: {water__0_05: 0.18, water__0_1__0_2: 0.2, HCl__0_5: 0.2, HCl__1: 0.2, SA05_NaOH05: 0.2, SA1_NaOH1: 0.3, Na2CO3: 0.3, KOH_ethanol: 1.0},
  20: {water__0_05: 0.0, water__0_1__0_2: 0.0, HCl__0_5: 0.0, HCl__1: 0.0, SA05_NaOH05: 0.0, SA1_NaOH1: 0.0, Na2CO3: 0.0, KOH_ethanol: 0.0},
  21: {water__0_05: -0.18, water__0_1__0_2: -0.2, HCl__0_5: -0.2, HCl__1: -0.2, SA05_NaOH05: -0.2, SA1_NaOH1: -0.3, Na2CO3: -0.3, KOH_ethanol: -1.1},
  22: {water__0_05: -0.38, water__0_1__0_2: -0.4, HCl__0_5: -0.4, HCl__1: -0.5, SA05_NaOH05: -0.5, SA1_NaOH1: -0.6, Na2CO3: -0.6, KOH_ethanol: -2.2},
  23: {water__0_05: -0.58, water__0_1__0_2: -0.6, HCl__0_5: -0.7, HCl__1: -0.7, SA05_NaOH05: -0.8, SA1_NaOH1: -0.9, Na2CO3: -0.9, KOH_ethanol: -3.3},
  24: {water__0_05: -0.8, water__0_1__0_2: -0.9, HCl__0_5: -0.9, HCl__1: -1.0, SA05_NaOH05: -1.0, SA1_NaOH1: -1.2, Na2CO3: -1.0, KOH_ethanol: -4.2},
  25: {water__0_05: -1.03, water__0_1__0_2: -1.1, HCl__0_5: -1.1, HCl__1: -1.2, SA05_NaOH05: -1.3, SA1_NaOH1: -1.5, Na2CO3: -1.5, KOH_ethanol: -5.3},
  26: {water__0_05: -1.26, water__0_1__0_2: -1.4, HCl__0_5: -1.4, HCl__1: -1.4, SA05_NaOH05: -1.5, SA1_NaOH1: -1.8, Na2CO3: -1.8, KOH_ethanol: -6.4},
  27: {water__0_05: -1.51, water__0_1__0_2: -1.7, HCl__0_5: -1.7, HCl__1: -1.7, SA05_NaOH05: -1.8, SA1_NaOH1: -2.1, Na2CO3: -2.1, KOH_ethanol: -7.5},
  28: {water__0_05: -1.76, water__0_1__0_2: -2.0, HCl__0_5: -2.0, HCl__1: -2.0, SA05_NaOH05: -2.1, SA1_NaOH1: -2.4, Na2CO3: -2.4, KOH_ethanol: -8.5},
  29: {water__0_05: -2.01, water__0_1__0_2: -2.3, HCl__0_5: -2.3, HCl__1: -2.3, SA05_NaOH05: -2.4, SA1_NaOH1: -2.8, Na2CO3: -2.8, KOH_ethanol: -9.6},
  30: {water__0_05: -2.3, water__0_1__0_2: -2.5, HCl__0_5: -2.5, HCl__1: -2.6, SA05_NaOH05: -2.8, SA1_NaOH1: -3.2, Na2CO3: -3.1, KOH_ethanol: -10.6},
  31: {water__0_05: -2.58, water__0_1__0_2: -2.7, HCl__0_5: -2.7, HCl__1: -2.9, SA05_NaOH05: -3.1, SA1_NaOH1: -3.5, Na2CO3: null, KOH_ethanol: -11.6},
  32: {water__0_05: -2.86, water__0_1__0_2: -3.0, HCl__0_5: -3.0, HCl__1: -3.2, SA05_NaOH05: -3.4, SA1_NaOH1: -3.9, Na2CO3: null, KOH_ethanol: -12.6},
  33: {water__0_05: -3.04, water__0_1__0_2: -3.2, HCl__0_5: -3.3, HCl__1: -3.5, SA05_NaOH05: -3.7, SA1_NaOH1: -4.2, Na2CO3: null, KOH_ethanol: -13.7},
  34: {water__0_05: -3.47, water__0_1__0_2: -3.7, HCl__0_5: -3.6, HCl__1: -3.8, SA05_NaOH05: -4.1, SA1_NaOH1: -4.6, Na2CO3: null, KOH_ethanol: -14.8},
  35: {water__0_05: -3.78, water__0_1__0_2: -4.0, HCl__0_5: -4.0, HCl__1: -4.1, SA05_NaOH05: -4.4, SA1_NaOH1: -5.0, Na2CO3: null, KOH_ethanol: -16.0},
  36: {water__0_05: -4.1, water__0_1__0_2: -4.3, HCl__0_5: -4.3, HCl__1: -4.4, SA05_NaOH05: -4.7, SA1_NaOH1: -5.3, Na2CO3: null, KOH_ethanol: -17.0}
};

// 校正列 -> 中文说明
SSR_DATA.columnNames = {
  water__0_05:      '水或水溶液(≤0.05mol/L)',
  water__0_1__0_2:  '水或水溶液(0.1~0.2mol/L)',
  HCl__0_5:         '盐酸(0.5mol/L)',
  HCl__1:           '盐酸(1mol/L)',
  SA05_NaOH05:      '硫酸/氢氧化钠(0.5mol/L)',
  SA1_NaOH1:        '硫酸/氢氧化钠(1mol/L)',
  Na2CO3:           '碳酸钠(1mol/L)',
  KOH_ethanol:      '氢氧化钾-乙醇(0.1mol/L)'
};

// 标液种类 -> 基准物质名称与摩尔质量 (与桌面版 TypeTitrantList 一致)
SSR_DATA.titrants = {
  '盐酸':        { ref: '无水碳酸钠',     molarMass: '52.994' },
  '氢氧化钠':    { ref: '邻苯二甲酸氢钾', molarMass: '204.22' },
  '高锰酸钾':    { ref: '草酸钠',         molarMass: '66.999' },
  '硝酸银':      { ref: '氯化钠',         molarMass: '58.442' },
  '硫代硫酸钠':  { ref: '重铬酸钾',       molarMass: '49.031' },
  '氯化锌':      { ref: 'EDTA',           molarMass: '0.05'  },
  'EDTA':        { ref: '氯化锌',         molarMass: '81.39' },
  '硫酸':        { ref: '无水碳酸钠',     molarMass: '52.994' },
  '碳酸钠':      { ref: '无水碳酸钠',     molarMass: '52.994' },
  '氢氧化钾-乙醇': { ref: '邻苯二甲酸氢钾', molarMass: '204.22' }
};

SSR_DATA.concOptions = ['0.05 or less', '0.1 or 0.2', '0.5', '1'];
SSR_DATA.typeOptions = ['水或水溶液', '盐酸', '氢氧化钠', '高锰酸钾', '硝酸银',
                        '硫代硫酸钠', '氯化锌', 'EDTA', '硫酸', '碳酸钠', '氢氧化钾-乙醇'];

// 标液种类 + 浓度 -> 校正列 (与桌面版 _Calculate 分支同序;
// 修正: 氢氧化钾-乙醇在桌面版因比较 '0.1' 永远不命中, 此处使用其专用列)
SSR_DATA.pickColumn = function (type, conc) {
  if (type === '盐酸' && conc === '1') return 'HCl__1';
  if (type === '盐酸' && conc === '0.5') return 'HCl__0_5';
  if ((type === '氢氧化钠' || type === '硫酸') && conc === '1') return 'SA1_NaOH1';
  if ((type === '氢氧化钠' || type === '硫酸') && conc === '0.5') return 'SA05_NaOH05';
  if (type === '碳酸钠' && conc === '1') return 'Na2CO3';
  if (type === '氢氧化钾-乙醇' && conc === '0.1 or 0.2') return 'KOH_ethanol';
  if (conc === '0.1 or 0.2') return 'water__0_1__0_2';
  if (conc === '0.05 or less') return 'water__0_05';
  return null;
};

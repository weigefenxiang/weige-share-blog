# -*- coding: utf-8 -*-
"""
与桌面版 Flu_Main.py 逐行同源的参考计算脚本。
用途:
  1. 生成 ../js/data.js      (温度体积校正表, 替代 VolumeCorrectionValue.db)
  2. 生成 ../test/vectors.js (测试向量: 输入 + 桌面版同源算法的期望输出)
运行: python tools/gen_vectors.py
算法函数 significant_figures / count_decimal_places / Calculate_average /
温度校正 / 实际体积 / 浓度 / 相对极差 均从 Flu_Main.py 原样移植(含 prec=10、
Decimal(float)、浓度字符串字典序排序等细节), 保证期望值与桌面版 exe 完全一致。
"""
import json, math, os
from decimal import Decimal, getcontext

getcontext().prec = 10  # 与 Flu_Main.py 一致

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---- 校正表: 与 dbUtil.py datalist 完全一致, 温度 5~36 ----
# 列顺序: water__0_05, water__0_1__0_2, HCl__0_5, HCl__1,
#         SA05_NaOH05, SA1_NaOH1, Na2CO3, KOH_ethanol
ROWS = [
    (1.38, 1.7, 1.9, 2.3, 2.4, 3.6, 3.3, None),
    (1.38, 1.7, 1.9, 2.2, 2.3, 3.4, 3.2, None),
    (1.36, 1.6, 1.8, 2.2, 2.2, 3.2, 3.0, None),
    (1.33, 1.6, 1.8, 2.1, 2.2, 3.0, 2.8, None),
    (1.29, 1.5, 1.7, 2.0, 2.1, 2.7, 2.6, None),

    (1.23, 1.5, 1.6, 1.9, 2.0, 2.5, 2.4, 10.8),
    (1.17, 1.4, 1.5, 1.8, 1.8, 2.3, 2.2, 9.6),
    (1.10, 1.3, 1.4, 1.6, 1.7, 2.0, 2.0, 8.5),
    (0.99, 1.1, 1.2, 1.4, 1.5, 1.8, 1.8, 7.4),
    (0.88, 1.0, 1.1, 1.2, 1.3, 1.6, 1.5, 6.5),

    (0.77, 0.9, 0.9, 1.0, 1.1, 1.3, 1.3, 5.2),
    (0.64, 0.7, 0.8, 0.8, 0.9, 1.1, 1.1, 4.2),
    (0.50, 0.6, 0.6, 0.6, 0.7, 0.8, 0.8, 3.1),
    (0.34, 0.4, 0.4, 0.4, 0.5, 0.6, 0.6, 2.1),
    (0.18, 0.2, 0.2, 0.2, 0.2, 0.3, 0.3, 1.0),

    (0.00, 0.00, 0.00, 0.0, 0.00, 0.00, 0.0, 0.0),
    (-0.18, -0.2, -0.2, -0.2, -0.2, -0.3, -0.3, -1.1),
    (-0.38, -0.4, -0.4, -0.5, -0.5, -0.6, -0.6, -2.2),
    (-0.58, -0.6, -0.7, -0.7, -0.8, -0.9, -0.9, -3.3),
    (-0.80, -0.9, -0.9, -1.0, -1.0, -1.2, -1.0, -4.2),

    (-1.03, -1.1, -1.1, -1.2, -1.3, -1.5, -1.5, -5.3),
    (-1.26, -1.4, -1.4, -1.4, -1.5, -1.8, -1.8, -6.4),
    (-1.51, -1.7, -1.7, -1.7, -1.8, -2.1, -2.1, -7.5),
    (-1.76, -2.0, -2.0, -2.0, -2.1, -2.4, -2.4, -8.5),
    (-2.01, -2.3, -2.3, -2.3, -2.4, -2.8, -2.8, -9.6),

    (-2.30, -2.5, -2.5, -2.6, -2.8, -3.2, -3.1, -10.6),
    (-2.58, -2.7, -2.7, -2.9, -3.1, -3.5, None, -11.6),
    (-2.86, -3.0, -3.0, -3.2, -3.4, -3.9, None, -12.6),
    (-3.04, -3.2, -3.3, -3.5, -3.7, -4.2, None, -13.7),
    (-3.47, -3.7, -3.6, -3.8, -4.1, -4.6, None, -14.8),

    (-3.78, -4.0, -4.0, -4.1, -4.4, -5.0, None, -16.0),
    (-4.10, -4.3, -4.3, -4.4, -4.7, -5.3, None, -17.0),
]
COLS = ["water__0_05", "water__0_1__0_2", "HCl__0_5", "HCl__1",
        "SA05_NaOH05", "SA1_NaOH1", "Na2CO3", "KOH_ethanol"]
TABLE = {t: dict(zip(COLS, row)) for t, row in zip(range(5, 37), ROWS)}


def pick_column(sol_type, conc):
    """溶液种类 + 浓度 -> 校正列。与 Flu_Main._Calculate 的分支同序。
    修正: 氢氧化钾-乙醇 exe 判断 '0.1' 永远不成立, 此处用其专用列。"""
    if sol_type == '盐酸' and conc == '1':
        return 'HCl__1'
    if sol_type == '盐酸' and conc == '0.5':
        return 'HCl__0_5'
    if sol_type in ('氢氧化钠', '硫酸') and conc == '1':
        return 'SA1_NaOH1'
    if sol_type in ('氢氧化钠', '硫酸') and conc == '0.5':
        return 'SA05_NaOH05'
    if sol_type == '碳酸钠' and conc == '1':
        return 'Na2CO3'
    if sol_type == '氢氧化钾-乙醇' and conc == '0.1 or 0.2':
        return 'KOH_ethanol'
    if conc == '0.1 or 0.2':
        return 'water__0_1__0_2'
    if conc == '0.05 or less':
        return 'water__0_05'
    return None


# ---------- 以下函数与 Flu_Main.py 原样一致 ----------
def count_decimal_places(num):
    num_str = str(num)
    if '.' in num_str:
        return len(num_str.split('.')[1])
    return 0


def significant_figures(value, sig=2, ActualVolume=None):
    if value == 0:
        return "0.00"
    n = sig - int(math.floor(math.log10(abs(value)))) - 1
    value_no0 = round(value, n)
    return f'%.{n}f' % value_no0


def Calculate_average(lst, Final=False):
    begin = 0
    for i in lst:
        begin += Decimal(i)
    NumDecimals = count_decimal_places(i)
    if Final:
        return str(round(Decimal(begin / len(lst)), NumDecimals - 1))
    return str(round(Decimal(begin / len(lst)), NumDecimals))


def compute(case):
    """复刻 _Calculate 主流程 (输入均为字符串)。"""
    t = int(case['temp'])
    col = pick_column(case['type'], case['conc'])
    assert col is not None, case['name']
    vcv = TABLE[t][col]          # sqlite 返回 float, 保持 float
    assert vcv is not None, case['name']

    M = case['molarMass']
    masses, vols = case['masses'], case['vols']
    bur, blank = case['burette'], case['blank']

    tempCorr = [str(round(Decimal(vcv) * Decimal(v) / 1000, 3)) for v in vols]

    actual = []
    for i in range(8):
        b = bur[0] if i < 4 else bur[1]
        bl = blank[0] if i < 4 else blank[1]
        s = float(vols[i]) + float(b) + float(tempCorr[i]) + float(bl)
        actual.append(significant_figures(s, 5, True))

    conc = []
    for i in range(8):
        if case['type'] == '氯化锌':
            c = float(masses[i]) * float(M) / float(actual[i])
        else:
            c = float(masses[i]) * 1000 / float(M) / float(actual[i])
        conc.append(significant_figures(c, 5))

    single1 = Calculate_average(conc[:4])
    single2 = Calculate_average(conc[4:])
    double = Calculate_average(conc)
    report = Calculate_average(conc, Final=True)
    report = str(round(Decimal(report), count_decimal_places(report)))

    p1 = sorted(conc[:4], reverse=True)
    p2 = sorted(conc[4:], reverse=True)
    rr1 = '{:.2%}'.format((float(p1[0]) - float(p1[-1])) / float(single1))
    rr2 = '{:.2%}'.format((float(p2[0]) - float(p2[-1])) / float(single2))
    pall = sorted(p1 + p2, reverse=True)
    rr = '{:.2%}'.format((float(pall[0]) - float(pall[-1])) / float(double))

    return {
        'corrValue': repr(vcv), 'column': col,
        'tempCorr': tempCorr, 'actual': actual, 'conc': conc,
        'single1': single1, 'single2': single2,
        'rr1': rr1, 'rr2': rr2,
        'double': double, 'rr': rr, 'report': report,
    }


CASES = [
    dict(name='default_naoh_1_23',
         desc='默认示例: NaOH 1mol/L @23℃ (须与桌面版截图逐位一致)',
         type='氢氧化钠', conc='1', temp='23', molarMass='204.22',
         masses=['7.5629', '7.5185', '7.5328', '7.5069', '7.4750', '7.4820', '7.4637', '7.4871'],
         vols=['36.60', '36.36', '36.43', '36.30', '36.15', '36.20', '36.11', '36.24'],
         burette=['-0.02', '-0.02'], blank=['0', '0']),
    dict(name='hcl_1_23', desc='盐酸 1mol/L @23℃',
         type='盐酸', conc='1', temp='23', molarMass='52.994',
         masses=['1.9341', '1.9298', '1.9350', '1.9312', '1.9280', '1.9265', '1.9333', '1.9308'],
         vols=['36.50', '36.42', '36.53', '36.45', '36.40', '36.36', '36.49', '36.44'],
         burette=['-0.02', '-0.01'], blank=['0', '0']),
    dict(name='hcl_05_15', desc='盐酸 0.5mol/L @15℃ (浓度<1, 5位小数分支)',
         type='盐酸', conc='0.5', temp='15', molarMass='52.994',
         masses=['0.9672', '0.9648', '0.9660', '0.9635', '0.9701', '0.9688', '0.9645', '0.9670'],
         vols=['36.50', '36.41', '36.46', '36.37', '36.61', '36.55', '36.40', '36.50'],
         burette=['-0.01', '-0.02'], blank=['0.01', '0.01']),
    dict(name='naoh_05_30', desc='氢氧化钠 0.5mol/L @30℃ (负校正大值)',
         type='氢氧化钠', conc='0.5', temp='30', molarMass='204.22',
         masses=['3.6820', '3.6754', '3.6801', '3.6772', '3.6905', '3.6889', '3.6850', '3.6912'],
         vols=['36.10', '36.03', '36.08', '36.05', '36.20', '36.18', '36.14', '36.21'],
         burette=['-0.02', '-0.02'], blank=['0', '0']),
    dict(name='h2so4_1_23', desc='硫酸 1mol/L @23℃ (与NaOH同列)',
         type='硫酸', conc='1', temp='23', molarMass='52.994',
         masses=['1.9080', '1.9110', '1.9066', '1.9092', '1.9121', '1.9099', '1.9111', '1.9076'],
         vols=['36.00', '36.06', '35.97', '36.02', '36.08', '36.04', '36.06', '35.99'],
         burette=['0.01', '0.01'], blank=['0', '0']),
    dict(name='na2co3_1_20', desc='碳酸钠 1mol/L @20℃ (校正值为0)',
         type='碳酸钠', conc='1', temp='20', molarMass='52.994',
         masses=['1.9081', '1.9105', '1.9066', '1.9092', '1.9120', '1.9098', '1.9110', '1.9075'],
         vols=['36.00', '36.05', '35.97', '36.02', '36.08', '36.04', '36.06', '35.99'],
         burette=['0.01', '0.02'], blank=['0', '0']),
    dict(name='koh_ethanol_01_25', desc='氢氧化钾-乙醇 0.1mol/L @25℃ (使用专用校正列, 修正 exe 映射bug)',
         type='氢氧化钾-乙醇', conc='0.1 or 0.2', temp='25', molarMass='204.22',
         masses=['0.4102', '0.4088', '0.4110', '0.4095', '0.4120', '0.4105', '0.4098', '0.4115'],
         vols=['20.10', '20.04', '20.15', '20.07', '20.18', '20.11', '20.08', '20.17'],
         burette=['-0.01', '-0.01'], blank=['0.02', '0.02']),
    dict(name='zncl2_005_23', desc='氯化锌 @23℃ (专用公式: 量取体积×EDTA浓度/实际体积)',
         type='氯化锌', conc='0.05 or less', temp='23', molarMass='0.05',
         masses=['10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00'],
         vols=['10.02', '10.05', '10.03', '10.04', '10.06', '10.05', '10.07', '10.04'],
         burette=['-0.01', '-0.01'], blank=['0', '0']),
    dict(name='water_012_5', desc='水或水溶液 0.1 or 0.2 @5℃ (表格下边界)',
         type='水或水溶液', conc='0.1 or 0.2', temp='5', molarMass='60.00',
         masses=['0.2205', '0.2198', '0.2210', '0.2201', '0.2215', '0.2208', '0.2199', '0.2212'],
         vols=['36.20', '36.09', '36.28', '36.13', '36.36', '36.25', '36.10', '36.31'],
         burette=['0', '0'], blank=['0', '0']),
    dict(name='agno3_005_23', desc='硝酸银 0.05mol/L @23℃ (6位小数分支)',
         type='硝酸银', conc='0.05 or less', temp='23', molarMass='58.442',
         masses=['0.1053', '0.1049', '0.1056', '0.1051', '0.1060', '0.1055', '0.1047', '0.1058'],
         vols=['36.05', '35.92', '36.15', '35.98', '36.30', '36.12', '35.85', '36.22'],
         burette=['-0.02', '-0.02'], blank=['0', '0']),
    dict(name='naoh_1_36', desc='NaOH 1mol/L @36℃ (表格上边界)',
         type='氢氧化钠', conc='1', temp='36', molarMass='204.22',
         masses=['7.5629', '7.5185', '7.5328', '7.5069', '7.4750', '7.4820', '7.4637', '7.4871'],
         vols=['36.60', '36.36', '36.43', '36.30', '36.15', '36.20', '36.11', '36.24'],
         burette=['-0.02', '-0.02'], blank=['0', '0']),
    dict(name='dyadic_tie_20', desc='二进制精确平局: 36.5625 在3位小数处半偶舍入 (@20℃ 校正为0)',
         type='氢氧化钠', conc='1', temp='20', molarMass='204.22',
         masses=['7.5629', '7.5185', '7.5328', '7.5069', '7.4750', '7.4820', '7.4637', '7.4871'],
         vols=['36.5625', '36.36', '36.43', '36.30', '36.15', '36.20', '36.1875', '36.24'],
         burette=['0', '0'], blank=['0', '0']),
    dict(name='straddle_10', desc='浓度跨越10: 桌面版对浓度字符串做字典序排序的极差行为',
         type='水或水溶液', conc='0.1 or 0.2', temp='20', molarMass='100.00',
         masses=['10.0010', '9.9990', '9.9995', '10.0000', '10.0005', '9.9985', '10.0010', '9.9995'],
         vols=['10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00'],
         burette=['0', '0'], blank=['0', '0']),
]


def js_table():
    lines = []
    for t in range(5, 37):
        vals = []
        for c in COLS:
            v = TABLE[t][c]
            vals.append('null' if v is None else repr(v))
        lines.append(f'  {t}: {{' + ', '.join(f'{c}: {v}' for c, v in zip(COLS, vals)) + '}')
    return '{\n' + ',\n'.join(lines) + '\n}'


def main():
    os.makedirs(os.path.join(OUT, 'js'), exist_ok=True)
    os.makedirs(os.path.join(OUT, 'test'), exist_ok=True)

    # ---------- js/data.js ----------
    data_js = """// data.js —— 静态数据层(替代桌面版 VolumeCorrectionValue.db)
// 数据来源: StandardSolutionReviewSystem dbUtil.py (GB/T 601 体积温度补正值, 20℃基准, mL/1000mL)
// 温度范围 5~36℃(整数); null 表示该温度下无数据
'use strict';

var SSR_DATA = {};

// 体积校正表: SSR_DATA.table[温度][列名] -> 每1000mL的校正值(mL)
SSR_DATA.table = __TABLE__;

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
"""
    data_js = data_js.replace('__TABLE__', js_table())
    with open(os.path.join(OUT, 'js', 'data.js'), 'w', encoding='utf-8') as f:
        f.write(data_js)

    # ---------- test/vectors.js ----------
    vectors = []
    for case in CASES:
        exp = compute(case)
        vectors.append({
            'name': case['name'], 'desc': case['desc'],
            'inputs': {k: case[k] for k in
                       ('type', 'conc', 'temp', 'molarMass', 'masses', 'vols', 'burette', 'blank')},
            'expected': exp,
        })

    with open(os.path.join(OUT, 'test', 'vectors.js'), 'w', encoding='utf-8') as f:
        f.write('// vectors.js —— 由 Python 参考脚本(与桌面版 Flu_Main.py 同源算法)生成的测试向量\n')
        f.write('// 请勿手改; 重新生成: python tools/gen_vectors.py\n')
        f.write('var TEST_VECTORS = ')
        f.write(json.dumps(vectors, ensure_ascii=False, indent=2))
        f.write(';\n')

    # 控制台输出默认样例, 供与桌面版截图人工核对
    d = vectors[0]['expected']
    print('=== default_naoh_1_23 (须与截图一致) ===')
    print('tempCorr :', d['tempCorr'])
    print('actual   :', d['actual'])
    print('conc     :', d['conc'])
    print('single   :', d['single1'], d['single2'])
    print('rr       :', d['rr1'], d['rr2'], d['rr'])
    print('double   :', d['double'], ' report:', d['report'])
    print()
    for v in vectors[1:]:
        e = v['expected']
        print(f"{v['name']:<20} col={e['column']:<16} corr={e['corrValue']:>6} "
              f"c1={e['conc'][0]} single1={e['single1']} rr={e['rr']} report={e['report']}")


if __name__ == '__main__':
    main()

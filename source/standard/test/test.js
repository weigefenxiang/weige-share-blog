// test.js —— 本地测试模块
// 双击 test.html 即可运行, 无需任何依赖/服务器。
// 覆盖: ① 校正表数据完整性 ② 舍入/格式化单元测试
//       ③ 与 Python 参考实现(桌面版同源算法)生成的 11 组向量逐位比对
//       ④ 输入校验错误用例
'use strict';

(function () {
  var suites = [];
  var current = null;

  function suite(name) {
    current = { name: name, tests: [] };
    suites.push(current);
  }
  function check(name, pass, detail) {
    current.tests.push({ name: name, pass: !!pass, detail: detail || '' });
  }
  function eq(name, actual, expected) {
    var pass = actual === expected;
    check(name, pass, pass ? '' : '期望 ' + JSON.stringify(expected) + ' , 实际 ' + JSON.stringify(actual));
  }
  function arrEq(name, actual, expected) {
    var pass = Array.isArray(actual) && actual.length === expected.length &&
      actual.every(function (v, i) { return v === expected[i]; });
    check(name, pass, pass ? '' : '期望 ' + JSON.stringify(expected) + '\n实际 ' + JSON.stringify(actual));
  }

  // ============ ① 校正表数据完整性 ============
  suite('校正表数据 (data.js ↔ dbUtil.py)');
  (function () {
    var cols = ['water__0_05', 'water__0_1__0_2', 'HCl__0_5', 'HCl__1',
                'SA05_NaOH05', 'SA1_NaOH1', 'Na2CO3', 'KOH_ethanol'];
    var okRange = true, okCols = true;
    for (var t = 5; t <= 36; t++) {
      var row = SSR_DATA.table[t];
      if (!row) { okRange = false; break; }
      for (var i = 0; i < cols.length; i++) {
        if (!(cols[i] in row)) { okCols = false; }
      }
    }
    check('温度范围 5~36℃ 共 32 行齐全', okRange && !SSR_DATA.table[4] && !SSR_DATA.table[37]);
    check('每行含全部 8 列', okCols);
    eq('20℃ 全列基准为 0', JSON.stringify(cols.map(function (c) { return SSR_DATA.table[20][c]; })),
       JSON.stringify([0, 0, 0, 0, 0, 0, 0, 0]));
    eq('23℃ 硫酸/氢氧化钠(1) = -0.9', SSR_DATA.table[23].SA1_NaOH1, -0.9);
    eq('5℃ 氢氧化钾-乙醇 无数据(null)', SSR_DATA.table[5].KOH_ethanol, null);
    eq('31℃ 碳酸钠 无数据(null)', SSR_DATA.table[31].Na2CO3, null);
    eq('36℃ 水(≤0.05) = -4.1', SSR_DATA.table[36].water__0_05, -4.1);
    eq('10℃ 氢氧化钾-乙醇 = 10.8', SSR_DATA.table[10].KOH_ethanol, 10.8);
    eq('列映射: NaOH+1 → SA1_NaOH1', SSR_DATA.pickColumn('氢氧化钠', '1'), 'SA1_NaOH1');
    eq('列映射: 盐酸+0.5 → HCl__0_5', SSR_DATA.pickColumn('盐酸', '0.5'), 'HCl__0_5');
    eq('列映射: KOH-乙醇+0.1 or 0.2 → 专用列(修正桌面版bug)',
       SSR_DATA.pickColumn('氢氧化钾-乙醇', '0.1 or 0.2'), 'KOH_ethanol');
    eq('列映射: 高锰酸钾+1 → 无(null)', SSR_DATA.pickColumn('高锰酸钾', '1'), null);
    eq('列映射: 硝酸银+0.05 → water__0_05', SSR_DATA.pickColumn('硝酸银', '0.05 or less'), 'water__0_05');
  })();

  // ============ ② 舍入/格式化单元测试 ============
  suite('舍入与格式化 (银行家舍入 ↔ Python Decimal)');
  (function () {
    var d = SSRCalc._dec;
    var r3 = function (s) { return d.toFixed(d.roundHalfEven(d.parse(s), 3)); };
    eq('0.0325 →3位 银行家舍入取偶 0.032', r3('0.0325'), '0.032');
    eq('-0.0325 →3位 -0.032', r3('-0.0325'), '-0.032');
    eq('0.0335 →3位 0.034', r3('0.0335'), '0.034');
    eq('0.032499 →3位 0.032', r3('0.032499'), '0.032');
    eq('0.032501 →3位 0.033', r3('0.032501'), '0.033');
    eq('-0.0001 →3位 保留负号 -0.000', r3('-0.0001'), '-0.000');

    eq('温度校正: -0.9 × 36.60/1000 = -0.033', SSRCalc.tempCorrection(-0.9, '36.60'), '-0.033');
    eq('温度校正: -0.9 × 36.11/1000 = -0.032', SSRCalc.tempCorrection(-0.9, '36.11'), '-0.032');
    eq('温度校正: 0 × 36.60/1000 = 0.000', SSRCalc.tempCorrection(0, '36.60'), '0.000');
    eq('温度校正: -5.3 × 20.10/1000 = -0.107', SSRCalc.tempCorrection(-5.3, '20.10'), '-0.107');

    eq('sigFig(36.546999…, 5) = 36.547', SSRCalc.sigFig(36.60 + (-0.02) + (-0.033) + 0, 5), '36.547');
    eq('sigFig(0, 5) = "0.00"', SSRCalc.sigFig(0, 5), '0.00');
    eq('sigFig(0.0137, 5) = 0.013700', SSRCalc.sigFig(0.0137, 5), '0.013700');
    eq('sigFig 二进制精确平局 36.5625 → 36.562 (半偶, 非 toFixed 的 36.563)',
       SSRCalc.sigFig(36.5625, 5), '36.562');
    eq('sigFig 二进制精确平局 36.1875 → 36.188 (半偶进位)',
       SSRCalc.sigFig(36.1875, 5), '36.188');
    eq('fmtRound(0.125, 2) = 0.12 (半偶)', SSRCalc.fmtRound(0.125, 2), '0.12');
    eq('sigFig 极小值 1.3387e-17 → 21位小数正常输出(对齐桌面版 %.21f)',
       SSRCalc.sigFig(1.3387e-17, 5), '0.000000000000000013387');
    eq('全角数字归一化 ３６.６０ → 36.60', SSRCalc.normDigits('３６.６０'), '36.60');

    // Decimal prec=10 语义: 中间加法丢弃远小于10位有效数字的项, 商平局半偶取偶
    eq('average 复刻 prec=10: 混合量级 → 1000.0000 (精确算法会得 1000.0001)',
       SSRCalc.average(['7999.0', '0.00040000', '0.0000000000000080000', '0.00', '0.00', '0.00', '0.00', '1.0000'], false),
       '1000.0000');
    (function () {
      var threw = false;
      try {
        SSRCalc.average(['79990.0', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00010000'], false);
      } catch (e) { threw = true; }
      check('average 量化超过10位有效数字时抛错(复刻 Decimal InvalidOperation)', threw);
    })();

    eq('四平行均值 1.01385 → 1.0138 (取偶)',
       SSRCalc.average(['1.0133', '1.0140', '1.0140', '1.0141'], false), '1.0138');
    eq('报出浓度: 八平行均值少留一位 → 1.014',
       SSRCalc.average(['1.0133', '1.0140', '1.0140', '1.0141', '1.0140', '1.0136', '1.0136', '1.0131'], true), '1.014');

    var V = SSRCalc.validNum;
    check('有效数字判定', V('1.5') && V('-0.02') && V('+.5') && V('5.') && V(' 12 ') &&
      !V('') && !V('abc') && !V('1.2.3') && !V('--1') && !V('1-2') && !V('+'));
  })();

  // ============ ③ Python 同源向量逐位比对 ============
  suite('与桌面版同源算法向量比对 (' + TEST_VECTORS.length + ' 组)');
  TEST_VECTORS.forEach(function (vec) {
    var r = SSRCalc.calculate(vec.inputs);
    var e = vec.expected;
    if (!r.ok) {
      check(vec.name + ' — ' + vec.desc, false, '计算返回错误: ' + r.error);
      return;
    }
    arrEq(vec.name + ' · 温度校正值', r.tempCorr, e.tempCorr);
    arrEq(vec.name + ' · 实际体积', r.actual, e.actual);
    arrEq(vec.name + ' · 标液浓度', r.conc, e.conc);
    eq(vec.name + ' · 单人四平行(主标)', r.single1, e.single1);
    eq(vec.name + ' · 单人四平行(副标)', r.single2, e.single2);
    eq(vec.name + ' · 主标相对极差', r.rr1, e.rr1);
    eq(vec.name + ' · 副标相对极差', r.rr2, e.rr2);
    eq(vec.name + ' · 双人八平行浓度', r.double, e.double);
    eq(vec.name + ' · 双人相对极差', r.rr, e.rr);
    eq(vec.name + ' · 报出浓度', r.report, e.report);
  });

  // ============ ④ 输入校验错误用例 ============
  suite('输入校验与错误提示');
  (function () {
    var base = TEST_VECTORS[0].inputs;
    function calcWith(patch) {
      var inp = JSON.parse(JSON.stringify(base));
      Object.keys(patch).forEach(function (k) { inp[k] = patch[k]; });
      return SSRCalc.calculate(inp);
    }
    function expectError(name, patch, keyword) {
      var r = calcWith(patch);
      var pass = !r.ok && r.error.indexOf(keyword) >= 0;
      check(name, pass, pass ? '' : '期望含「' + keyword + '」的错误, 实际: ' +
        (r.ok ? '计算成功(不应成功)' : r.error));
    }
    expectError('温度 4 → 越下界', { temp: '4' }, '温度');
    expectError('温度 37 → 越上界', { temp: '37' }, '温度');
    expectError('温度 23.5 → 非整数', { temp: '23.5' }, '温度');
    expectError('温度 -5 → 负数', { temp: '-5' }, '温度');
    expectError('温度 空 → 报错', { temp: '' }, '温度');
    expectError('摩尔质量非数字', { molarMass: 'abc' }, '摩尔质量');
    expectError('未选标液浓度', { conc: '' }, '标液浓度');
    expectError('未选标液种类', { type: '' }, '标液种类');
    expectError('基准物质的量非法', { masses: ['x', '1', '1', '1', '1', '1', '1', '1'] }, '基准物质');
    expectError('消耗体积非法', { vols: ['1.2.3', '1', '1', '1', '1', '1', '1', '1'] }, '消耗体积');
    expectError('滴定管校正值非法', { burette: ['--1', '0'] }, '滴定管校正值');
    expectError('空白非法', { blank: ['1a', '0'] }, '空白');
    expectError('高锰酸钾 + 1mol/L → 无校正列', { type: '高锰酸钾', conc: '1' }, '无体积校正值');
    expectError('氯化锌 + 0.5 → 无校正列', { type: '氯化锌', conc: '0.5' }, '无体积校正值');
    expectError('碳酸钠 @31℃ → 表内 null', { type: '碳酸钠', conc: '1', temp: '31' }, '无温度校正数据');
    expectError('KOH-乙醇 @8℃ → 表内 null',
      { type: '氢氧化钾-乙醇', conc: '0.1 or 0.2', temp: '8' }, '无温度校正数据');
    expectError('基准物质量全为 0 → 均值为 0 明确报错(桌面版为除零异常)',
      { masses: ['0', '0', '0', '0', '0', '0', '0', '0'] }, '均值为 0');

    var fwInputs = JSON.parse(JSON.stringify(base));
    fwInputs.vols = fwInputs.vols.slice();
    fwInputs.vols[0] = '３６.６０';   // 全角输入, 桌面版 float() 可接受
    var fwRes = SSRCalc.calculate(fwInputs);
    check('全角数字输入可正常计算且结果一致',
      fwRes.ok && fwRes.actual[0] === TEST_VECTORS[0].expected.actual[0],
      fwRes.ok ? ('actual[0]=' + fwRes.actual[0]) : fwRes.error);

    var okDefault = SSRCalc.calculate(base);
    check('默认示例可正常计算且极差未超限',
      okDefault.ok && !okDefault.exceed1 && !okDefault.exceed2 && !okDefault.exceedDouble,
      okDefault.ok ? '' : okDefault.error);
  })();

  // ============ 渲染报告 ============
  var total = 0, passed = 0;
  suites.forEach(function (s) {
    s.tests.forEach(function (t) { total++; if (t.pass) passed++; });
  });

  var root = document.getElementById('report');
  var banner = document.getElementById('banner');
  var allPass = passed === total;
  banner.className = 'banner ' + (allPass ? 'pass' : 'fail');
  banner.innerHTML = (allPass ? '✅ 全部通过' : '❌ 存在失败') +
    ' <span class="count">' + passed + ' / ' + total + '</span>' +
    '<div class="banner-sub">测试向量由 Python 参考脚本(与桌面版 Flu_Main.py 同源算法)生成，逐位比对输出字符串</div>';

  suites.forEach(function (s) {
    var sp = s.tests.filter(function (t) { return t.pass; }).length;
    var div = document.createElement('div');
    div.className = 'suite';
    div.innerHTML = '<h2>' + s.name + ' <span class="scount ' + (sp === s.tests.length ? 'ok' : 'bad') + '">' +
      sp + '/' + s.tests.length + '</span></h2>';
    var list = document.createElement('div');
    s.tests.forEach(function (t) {
      var row = document.createElement('div');
      row.className = 'trow ' + (t.pass ? 'pass' : 'fail');
      row.innerHTML = '<span class="mark">' + (t.pass ? '✔' : '✘') + '</span><span class="tname"></span>';
      row.querySelector('.tname').textContent = t.name;
      if (!t.pass && t.detail) {
        var pre = document.createElement('pre');
        pre.textContent = t.detail;
        row.appendChild(pre);
      }
      list.appendChild(row);
    });
    div.appendChild(list);
    root.appendChild(div);
  });

  document.title = (allPass ? '✅ ' : '❌ ') + passed + '/' + total + ' · 标准溶液计算审核 · 本地测试';
})();

// calc.js —— 计算引擎(与桌面版 Flu_Main.py 逐位对齐)
// 关键点:
//   1. 温度校正值 / 各类均值走十进制精确运算(BigInt), 舍入采用银行家舍入
//      (ROUND_HALF_EVEN), 并复刻 Python Decimal prec=10 的逐步舍入语义;
//   2. 实际体积 / 浓度 / 相对极差走 IEEE754 双精度浮点(与 Python float 一致);
//      浮点格式化不用 toFixed(其平局向上舍入), 而是从 IEEE754 位模式提取
//      精确十进制展开后做银行家舍入, 等价于 Python 的 round(float,n)+'%.nf'
//      (如 36.5625 → 3位小数 → '36.562' 而非 toFixed 的 '36.563');
//   3. 相对极差复刻桌面版对浓度字符串的字典序排序取极值;
//   4. 所有输出均为字符串, 保留位数与桌面版完全一致。
'use strict';

var SSRCalc = (function () {

  // ---------- 十进制精确运算 (scaled BigInt) ----------
  var P10_CACHE = [1n];
  function P10(k) {
    while (P10_CACHE.length <= k) P10_CACHE.push(P10_CACHE[P10_CACHE.length - 1] * 10n);
    return P10_CACHE[k];
  }

  // '36.60' -> {sign:1, int:3660n, scale:2}; sign 与数字分离, 以保留 -0.000 的符号
  function decParse(str) {
    var s = String(str).trim();
    var sign = 1;
    if (s.charAt(0) === '+') s = s.slice(1);
    else if (s.charAt(0) === '-') { sign = -1; s = s.slice(1); }
    var dot = s.indexOf('.');
    var scale = 0, digits = s;
    if (dot >= 0) {
      scale = s.length - dot - 1;
      digits = s.slice(0, dot) + s.slice(dot + 1);
    }
    if (digits === '') digits = '0';
    return { sign: sign, int: BigInt(digits), scale: scale };
  }

  // 双精度浮点 -> 精确十进制展开 (double 是二进制有理数 m×2^e, 十进制展开有限)
  function floatToDec(v) {
    if (!isFinite(v)) throw new Error('非有限数值: ' + v);
    var buf = new DataView(new ArrayBuffer(8));
    buf.setFloat64(0, v);
    var bits = (BigInt(buf.getUint32(0)) << 32n) | BigInt(buf.getUint32(4));
    var sign = (bits >> 63n) === 1n ? -1 : 1;
    var exp = Number((bits >> 52n) & 0x7FFn);
    var frac = bits & 0xFFFFFFFFFFFFFn;
    var m, e;                                   // |v| = m × 2^e
    if (exp === 0) { m = frac; e = -1074; }
    else { m = frac | (1n << 52n); e = exp - 1075; }
    if (m === 0n) return { sign: sign, int: 0n, scale: 0 };
    if (e >= 0) return { sign: sign, int: m << BigInt(e), scale: 0 };
    var k = -e;                                 // m/2^k = m×5^k / 10^k
    return { sign: sign, int: m * 5n ** BigInt(k), scale: k };
  }

  // 银行家舍入到 target 位小数 (等价 Python round(Decimal, target))
  function decRoundHalfEven(a, target) {
    if (a.scale <= target) {
      return { sign: a.sign, int: a.int * P10(target - a.scale), scale: target };
    }
    var k = a.scale - target;
    var p = P10(k);
    var q = a.int / p;
    var r = a.int % p;
    var half = 5n * P10(k - 1);
    if (r > half || (r === half && q % 2n === 1n)) q += 1n;
    return { sign: a.sign, int: q, scale: target };
  }

  // 舍入到 prec 位有效数字 (等价 Python Decimal 上下文的每步运算舍入)
  function decRoundSig(a, prec) {
    if (a.int === 0n) return a;
    var digits = a.int.toString().length;
    if (digits <= prec) return a;
    return decRoundHalfEven(a, a.scale - (digits - prec));
  }

  // 固定 scale 位小数输出字符串 (保留符号, 含 '-0.000' 场景)
  function decToFixed(a) {
    var digits = a.int.toString();
    while (digits.length < a.scale + 1) digits = '0' + digits;
    var out = a.scale === 0
      ? digits
      : digits.slice(0, digits.length - a.scale) + '.' + digits.slice(digits.length - a.scale);
    return (a.sign < 0 ? '-' : '') + out;
  }

  function decAdd(a, b) {
    var scale = Math.max(a.scale, b.scale);
    var av = BigInt(a.sign) * a.int * P10(scale - a.scale);
    var bv = BigInt(b.sign) * b.int * P10(scale - b.scale);
    var sum = av + bv;
    return { sign: sum < 0n ? -1 : 1, int: sum < 0n ? -sum : sum, scale: scale };
  }

  // Python round(v, n) + '%.nf' 的等价实现: 对 double 的精确十进制值做银行家舍入
  function fmtRound(v, n) {
    return decToFixed(decRoundHalfEven(floatToDec(v), n));
  }

  // ---------- 与 Flu_Main.py 同名逻辑 ----------

  // count_decimal_places
  function decimalsOf(str) {
    var s = String(str);
    var dot = s.indexOf('.');
    return dot >= 0 ? s.length - dot - 1 : 0;
  }

  // 温度校正值 = 表值 × 消耗体积 / 1000, 银行家舍入保留3位小数
  function tempCorrection(corrValue, volStr) {
    var a = decParse(String(corrValue));
    var b = decParse(volStr);
    var prod = { sign: a.sign * b.sign, int: a.int * b.int, scale: a.scale + b.scale + 3 };
    return decToFixed(decRoundHalfEven(prod, 3));
  }

  // significant_figures: value 保留 sig 位有效数字 (0 -> "0.00")
  function sigFig(value, sig) {
    if (value === 0) return '0.00';
    var n = sig - Math.floor(Math.log10(Math.abs(value))) - 1;
    if (n < 0) throw new Error('数值过大, 无法按 ' + sig + ' 位有效数字格式化: ' + value);
    return fmtRound(value, n);
  }

  // Calculate_average: 小数位取列表末元素的小数位(与桌面版一致); final 时少留一位。
  // 每步加法与除法均舍入到 10 位有效数字(复刻 Decimal prec=10);
  // 最终 quantize 结果超过 10 位有效数字时抛错(复刻 InvalidOperation)。
  var DECIMAL_PREC = 10;
  function average(list, final) {
    var D = decimalsOf(list[list.length - 1]);
    var acc = { sign: 1, int: 0n, scale: 0 };
    for (var i = 0; i < list.length; i++) {
      acc = decRoundSig(decAdd(acc, decParse(list[i])), DECIMAL_PREC);
    }
    var n = list.length;                       // 仅 4 或 8
    var mul = n === 4 ? 25n : 125n;            // ÷4 = ×25/100, ÷8 = ×125/1000, 十进制精确
    var extra = n === 4 ? 2 : 3;
    var q = decRoundSig({ sign: acc.sign, int: acc.int * mul, scale: acc.scale + extra }, DECIMAL_PREC);
    var t = final ? D - 1 : D;
    if (t < 0) t = 0;
    var res = decRoundHalfEven(q, t);
    if (res.int !== 0n && res.int.toString().length > DECIMAL_PREC) {
      throw new Error('均值量化超出 ' + DECIMAL_PREC + ' 位有效数字精度');
    }
    return decToFixed(res);
  }

  // '{:.2%}' 等价: v×100 后按精确十进制银行家舍入保留2位小数 + '%'
  function percent2(v) {
    return fmtRound(v * 100, 2) + '%';
  }

  // 全角数字 ０-９ 归一化为半角 (桌面版 float()/isdigit() 本就接受全角数字)
  function normDigits(s) {
    return String(s).replace(/[０-９]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
    });
  }

  // 有效数字校验: 可选正负号开头 + 数字, 至多一个小数点 (与 all_elements_are_valid_numbers 一致)
  var NUM_RE = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
  function validNum(s) {
    return NUM_RE.test(String(s).trim());
  }
  function allValid(list) {
    for (var i = 0; i < list.length; i++) if (!validNum(list[i])) return false;
    return true;
  }

  // 复刻桌面版: 对浓度"字符串"列表做字典序降序排序后取 首-尾 计算极差
  function rangeByStringSort(concStrs, avgStr) {
    var sorted = concStrs.slice().sort();
    sorted.reverse();
    var span = parseFloat(sorted[0]) - parseFloat(sorted[sorted.length - 1]);
    return percent2(span / parseFloat(avgStr));
  }

  // ---------- 主计算 ----------
  // inputs: {type, conc, temp, molarMass, masses[8], vols[8], burette[2], blank[2]} 全为字符串
  // 返回 {ok:true, ...结果} 或 {ok:false, error}
  function calculate(inputs) {
    var temp = normDigits(inputs.temp || '').trim();
    var molarMass = normDigits(inputs.molarMass || '');
    var masses = inputs.masses.map(normDigits);
    var vols = inputs.vols.map(normDigits);
    var burette = inputs.burette.map(normDigits);
    var blank = inputs.blank.map(normDigits);

    if (!/^\d+$/.test(temp) || parseInt(temp, 10) < 5 || parseInt(temp, 10) > 36) {
      return { ok: false, error: '温度：请输入 5~36℃ 之间的整数' };
    }
    if (!molarMass || !validNum(molarMass)) {
      return { ok: false, error: '摩尔质量：请输入有效数字' };
    }
    if (!inputs.conc) return { ok: false, error: '标液浓度：请选择一个标液浓度' };
    if (!inputs.type) return { ok: false, error: '标液种类：请选择一个标液种类' };
    if (!allValid(masses)) return { ok: false, error: '基准物质的量：请输入有效数字' };
    if (!allValid(vols)) return { ok: false, error: '滴定液消耗体积：请输入有效数字' };
    if (!allValid(burette)) return { ok: false, error: '滴定管校正值：请输入有效数字' };
    if (!allValid(blank)) return { ok: false, error: '空白：请输入有效数字' };

    var column = SSR_DATA.pickColumn(inputs.type, inputs.conc);
    if (!column) {
      return { ok: false, error: '该标液种类在此浓度下无体积校正值，请更换浓度或滴定液' };
    }
    var row = SSR_DATA.table[parseInt(temp, 10)];
    var corr = row ? row[column] : null;
    if (corr === null || corr === undefined) {
      return { ok: false, error: '「' + SSR_DATA.columnNames[column] + '」在 ' + temp + '℃ 下无温度校正数据（GB/T 601 未收录），请更换温度' };
    }

    try {
      var isZnCl2 = inputs.type === '氯化锌';
      var M = parseFloat(molarMass);
      var tempCorr = [], actual = [], conc = [];

      for (var i = 0; i < 8; i++) {
        tempCorr.push(tempCorrection(corr, vols[i]));
      }
      for (i = 0; i < 8; i++) {
        var bur = parseFloat(burette[i < 4 ? 0 : 1]);
        var blk = parseFloat(blank[i < 4 ? 0 : 1]);
        // 加法顺序与桌面版一致: 消耗体积 + 滴定管校正 + 温度校正 + 空白
        var v = parseFloat(vols[i]) + bur + parseFloat(tempCorr[i]) + blk;
        actual.push(sigFig(v, 5));
      }
      for (i = 0; i < 8; i++) {
        var m = parseFloat(masses[i]);
        var c = isZnCl2
          ? m * M / parseFloat(actual[i])          // 氯化锌: 量取体积×EDTA浓度/实际体积
          : m * 1000 / M / parseFloat(actual[i]);  // 常规: m×1000/M/V
        conc.push(sigFig(c, 5));
      }

      var single1 = average(conc.slice(0, 4), false);
      var single2 = average(conc.slice(4), false);
      var double_ = average(conc, false);
      var report = average(conc, true);

      // 桌面版此处为 float 除零异常; 网页版给出明确错误
      if (parseFloat(single1) === 0 || parseFloat(single2) === 0 || parseFloat(double_) === 0) {
        return { ok: false, error: '平行浓度均值为 0，无法计算相对极差，请检查输入数据' };
      }

      var rr1 = rangeByStringSort(conc.slice(0, 4), single1);
      var rr2 = rangeByStringSort(conc.slice(4), single2);
      var rr = rangeByStringSort(conc, double_);

      return {
        ok: true,
        column: column, corrValue: corr,
        tempCorr: tempCorr, actual: actual, conc: conc,
        single1: single1, single2: single2,
        rr1: rr1, rr2: rr2,
        double: double_, rr: rr, report: report,
        // 极差限值判定: 四平行 ≤0.15%, 八平行 ≤0.18%
        exceed1: parseFloat(rr1) > 0.15,
        exceed2: parseFloat(rr2) > 0.15,
        exceedDouble: parseFloat(rr) > 0.18
      };
    } catch (e) {
      return { ok: false, error: '计算失败：' + e.message };
    }
  }

  return {
    calculate: calculate,
    // 以下导出仅供测试
    tempCorrection: tempCorrection,
    sigFig: sigFig,
    average: average,
    percent2: percent2,
    validNum: validNum,
    normDigits: normDigits,
    fmtRound: fmtRound,
    _dec: { parse: decParse, roundHalfEven: decRoundHalfEven, toFixed: decToFixed, add: decAdd, fromFloat: floatToDec }
  };
})();

// app.js —— 界面交互(对应桌面版 MainWidget 的槽函数与默认值逻辑)
'use strict';

(function () {
  function $(id) { return document.getElementById(id); }
  function ids(prefix, n) {
    var arr = [];
    for (var i = 0; i < n; i++) arr.push($(prefix + i));
    return arr;
  }

  var els = {
    conc: $('selConc'), type: $('selType'),
    mass: $('inpMass'), lblMass: $('lblMass'), vol: $('inpVol'),
    basis: $('inpBasis'), dry: $('inpDry'),
    temp: $('inpTemp'), molar: $('inpMolar'), lblMolar: $('lblMolar'),
    dateMake: $('dateMake'), dateFrom: $('dateFrom'), dateTo: $('dateTo'), dateReg: $('dateReg'),
    main: $('inpMain'), sub: $('inpSub'),
    m: ids('m', 8), v: ids('v', 8),
    bur: [$('bur0'), $('bur1')], blk: [$('blk0'), $('blk1')],
    tc: ids('tc', 8), av: ids('av', 8), c: ids('c', 8),
    s1: $('outS1'), s2: $('outS2'),
    rr1: $('outRR1'), rr2: $('outRR2'), rrD: $('outRRD'),
    dp: $('outDP'), report: $('outReport')
  };
  var outputs = els.tc.concat(els.av, els.c,
    [els.s1, els.s2, els.rr1, els.rr2, els.rrD, els.dp, els.report]);

  // ---------- Toast ----------
  function toast(kind, title, msg, duration) {
    var root = $('toast-root');
    var node = document.createElement('div');
    node.className = 'toast ' + kind;
    var icon = kind === 'success' ? '✅' : kind === 'warning' ? '⚠️' : '❌';
    node.innerHTML = '<span>' + icon + '</span><span class="t-title"></span><span class="t-msg"></span>';
    node.querySelector('.t-title').textContent = title;
    node.querySelector('.t-msg').textContent = msg;
    root.appendChild(node);
    setTimeout(function () {
      node.classList.add('hide');
      setTimeout(function () { root.removeChild(node); }, 260);
    }, duration || (kind === 'error' ? 4200 : 2200));
  }

  // ---------- 工具 ----------
  function todayStr() {
    var d = new Date();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }
  function setVals(list, values) {
    for (var i = 0; i < list.length; i++) list[i].value = values[i] !== undefined ? values[i] : '';
  }
  function clearOutputs() {
    outputs.forEach(function (el) {
      el.value = '';
      el.classList.remove('exceed');
    });
  }

  // ---------- 标液种类联动(对应 _getMolarMass) ----------
  function applyType() {
    var t = els.type.value;
    var info = SSR_DATA.titrants[t];
    if (!info) {  // 水或水溶液 / 未选择: 不改动
      return;
    }
    els.molar.value = info.molarMass;
    if (t === '氯化锌') {
      els.lblMolar.textContent = info.ref + ' mol/L';   // EDTA mol/L
      els.lblMass.textContent = '量取体积';
      els.mass.placeholder = '量取体积 mL';
      els.molar.classList.add('molar-alert');
      setVals(els.m, ['10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00', '10.00']);
    } else {
      els.lblMolar.textContent = info.ref + ' g/mol';
      els.lblMass.textContent = '称取质量';
      els.mass.placeholder = '称取质量 g';
      els.molar.classList.remove('molar-alert');
    }
  }

  // ---------- 默认值(对应 _DefaultBegin, 不改动日期) ----------
  function fillDefaults() {
    els.conc.value = '1';
    els.type.value = '氢氧化钠';
    applyType();
    els.temp.value = '23';
    els.molar.value = '204.22';
    setVals(els.m, ['7.5629', '7.5185', '7.5328', '7.5069', '7.4750', '7.4820', '7.4637', '7.4871']);
    setVals(els.v, ['36.60', '36.36', '36.43', '36.30', '36.15', '36.20', '36.11', '36.24']);
    setVals(els.bur, ['-0.02', '-0.02']);
    setVals(els.blk, ['0', '0']);
    clearOutputs();
  }

  function resetDates() {
    var d = todayStr();
    els.dateMake.value = d; els.dateFrom.value = d; els.dateTo.value = d; els.dateReg.value = d;
  }

  // ---------- 清空(对应 clear_form) ----------
  function clearForm() {
    [els.mass, els.vol, els.basis, els.dry, els.temp, els.molar, els.main, els.sub]
      .concat(els.m, els.v, els.bur, els.blk)
      .forEach(function (el) { el.value = ''; });
    els.conc.value = '';
    els.type.value = '';
    els.lblMolar.textContent = '摩尔质量 g/mol';
    els.lblMass.textContent = '称取质量';
    els.mass.placeholder = '称取质量 g';
    els.molar.classList.remove('molar-alert');
    resetDates();
    clearOutputs();
    toast('success', 'Success', '表单已清空');
  }

  // ---------- 计算(对应 _Calculate) ----------
  function runCalculate() {
    var val = function (el) { return el.value; };
    var res = SSRCalc.calculate({
      type: els.type.value,
      conc: els.conc.value,
      temp: els.temp.value,
      molarMass: els.molar.value,
      masses: els.m.map(val),
      vols: els.v.map(val),
      burette: els.bur.map(val),
      blank: els.blk.map(val)
    });
    if (!res.ok) {
      toast('error', 'Error', res.error);
      return;
    }
    setVals(els.tc, res.tempCorr);
    setVals(els.av, res.actual);
    setVals(els.c, res.conc);
    els.s1.value = res.single1; els.s2.value = res.single2;
    els.rr1.value = res.rr1; els.rr2.value = res.rr2;
    els.rrD.value = res.rr;
    els.dp.value = res.double;
    els.report.value = res.report;

    els.rr1.classList.toggle('exceed', res.exceed1);
    els.rr2.classList.toggle('exceed', res.exceed2);
    els.rrD.classList.toggle('exceed', res.exceedDouble);

    if (res.exceed1 || res.exceed2 || res.exceedDouble) {
      toast('warning', 'Warning', '相对极差超限：四平行应≤0.15%，双人八平行应≤0.18%', 4500);
    } else {
      toast('success', 'Success', '计算完成！');
    }
  }

  // ---------- 界面缩放(自动记忆) ----------
  var ZOOM_KEY = 'ssr-zoom';
  var zoom = 1;
  function applyZoom(z) {
    if (!isFinite(z)) z = 1;
    zoom = Math.min(1.8, Math.max(0.6, Math.round(z * 10) / 10));
    document.body.style.zoom = zoom;
    $('zoomReset').textContent = Math.round(zoom * 100) + '%';
    try { localStorage.setItem(ZOOM_KEY, String(zoom)); } catch (e) { /* 隐私模式等场景忽略 */ }
  }
  $('zoomIn').addEventListener('click', function () { applyZoom(zoom + 0.1); });
  $('zoomOut').addEventListener('click', function () { applyZoom(zoom - 0.1); });
  $('zoomReset').addEventListener('click', function () { applyZoom(1); });
  try { applyZoom(parseFloat(localStorage.getItem(ZOOM_KEY))); } catch (e) { applyZoom(1); }

  // ---------- 事件绑定 ----------
  els.type.addEventListener('change', applyType);
  // 滴定管校正值2 自动补充(对应 textChange / editingFinished)
  els.bur[0].addEventListener('change', function () {
    els.bur[1].value = els.bur[0].value;
  });
  $('btnCalc').addEventListener('click', runCalculate);
  $('btnDefault').addEventListener('click', function () {
    fillDefaults();
    toast('success', 'Success', '已填入默认示例数据');
  });
  $('btnClear').addEventListener('click', clearForm);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') runCalculate();
  });

  // 启动即填默认示例、日期置为今天(与桌面版一致)
  fillDefaults();
  resetDates();
})();

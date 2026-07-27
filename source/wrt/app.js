/*
 * OpenWrt 固件在线定制器前端脚本,由 site/wrt/index.html 直接加载 / Front-end script of the online firmware customizer, loaded directly by site/wrt/index.html.
 * 机型/插件/文案数据全部来自 data/ 下的 JSON,带多级 CDN 回退与 localStorage 缓存 / All device/plugin/i18n data comes from JSON under data/, with tiered CDN fallback and localStorage caching.
 * 无构建步骤、无第三方依赖,以原生 ES 语法直接在浏览器运行 / No build step, no third-party deps; runs as plain native ES in the browser.
 */
'use strict';

/* ============ 常量 / Constants ============ */
const OFFICIAL_REPO = 'weigefenxiang/WeiG-OpenWrt-AutoBuild';
const REPO_NAME = OFFICIAL_REPO.split('/')[1];
const BRANCH = 'main';
const FALLBACK = 'en';               // 译文缺失时的兜底语言 / Fallback language when a translation is missing
const SOURCE_LANG = 'zh-CN';         // 源语言,词条必须完整 / Source language; its entries must be complete
const GROUP_ICONS = {
  '系统基础': '🧱', '魔法与加速': '🚀', '广告过滤与DNS': '🛡️', '内网穿透与组网': '🌐',
  '存储与下载': '💾', '多媒体与外设': '🎵', '网络管理': '⚙️',
  '监控统计': '📊', '管控与安全': '🔒', '定时与唤醒': '⏰',
  '校园网认证': '🎓', '系统工具': '🧰', '其他与高级': '🧩',
};

const state = {
  device: null,
  source: null,        // 当前选中的源对象 / Currently selected source object
  version: null,       // 当前选中的版本对象 / Currently selected version object
  variant: null,       // 当前选中的变体对象 / Currently selected variant object
  sel: new Set(),      // 用户勾选的插件 id,含高级模式强制项 / Plugin ids checked by the user, incl. advanced-mode forced items
  removed: new Set(),  // 高级模式下被取消勾选的内置项 id / Builtin plugin ids deselected in advanced mode
  advanced: localStorage.getItem('wrt_adv') === '1',
  lang: localStorage.getItem('wrt_lang') || '',
  mode: localStorage.getItem('wrt_mode') || 'official',
  owner: localStorage.getItem('wrt_owner') || '',
  lanip: localStorage.getItem('wrt_lanip') || '192.168.1.1',   // 后台登录地址,默认 192.168.1.1 / admin LAN IP, defaults to 192.168.1.1
};
const LANIP_RE = /^(192\.168|10\.\d{1,3}|172\.(1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}$/;   // 仅接受内网 IPv4 / private IPv4 only
let DEVICES = null, PLUGINS = null, I18N = null;
let PLUG_I18N = null;                  // 插件名/说明多语言表,非中文界面按需加载 / plugin name/desc i18n table, lazy-loaded for non-Chinese UIs
let plugI18nLoading = false;           // 防止重复请求 / guards against duplicate fetches
let PKGDATA = null;                    // 开发者模式的全量软件包表,按需加载 / raw package table, lazy-loaded in developer mode
const devPkgs = new Set();             // 开发者勾选编入的原始包 / raw packages to build in (=y)
const devRemoved = new Set();          // 开发者取消的已内置原始包 / builtin raw packages to remove
let devAllowGrey = false;              // V10:灰色插件二级门禁,不落盘,每次都从未勾开始 / V10: second gate for grey plugins; never persisted, always starts unticked
const collapsed = new Set();

const $ = (id) => document.getElementById(id);
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* 存储满或被禁用时静默忽略 / Silently ignore when storage is full or disabled */ } };

/* ============ 多语言 / i18n ============ */
function pickLang() {
  if (state.lang && I18N.strings['app.title'] && I18N.strings['app.title'][state.lang]) return state.lang;
  const avail = I18N.languages.map((l) => l.id);
  for (const nav of navigator.languages || [navigator.language || '']) {
    // 中文细分:zh-TW/zh-HK/zh-Hant* → 繁中,其余 zh 一律简中 / Chinese split: zh-TW/zh-HK/zh-Hant* → Traditional, any other zh → Simplified
    if (/^zh(-|$)/i.test(nav)) return /^zh-(TW|HK|Hant)/i.test(nav) ? 'zh-TW' : 'zh-CN';
    if (avail.includes(nav)) return nav;
    const base = nav.split('-')[0];
    const hit = avail.find((a) => a === base || a.split('-')[0] === base);
    if (hit) return hit;
  }
  return FALLBACK;   // 侦测不到匹配语言时默认英文(用户定) / unmatched browsers default to English (per user decision)
}
function t(key, params) {
  const row = I18N && I18N.strings[key];
  let s = row ? (row[state.lang] || row[FALLBACK] || row[SOURCE_LANG]) : key;
  if (params) for (const k in params) s = s.split('{' + k + '}').join(params[k]);
  return s;
}
const isZh = () => String(state.lang).startsWith('zh');

/* ============ 插件名/说明多语言 / Plugin name & description i18n ============ */
/* 非中文界面惰性加载 plugins-i18n.json,一次性缓存;失败静默回退原文 / Lazily load plugins-i18n.json for non-Chinese UIs, cache once; fall back to original text silently on failure */
function ensurePlugI18n() {
  if (isZh() || PLUG_I18N || plugI18nLoading) return;
  plugI18nLoading = true;
  loadJson('plugins-i18n.json')
    .then((d) => { PLUG_I18N = d; if (PLUGINS) renderGroups(); })
    .catch(() => { /* 加载失败静默回退原文,下次语言切换可重试 / Silent fallback to original text; next language switch may retry */ })
    .finally(() => { plugI18nLoading = false; });
}
/* 展示层取词:中文界面(简繁 zh* 均含)维持原行为(名称打码/说明原文,插件暂不繁译),其他语言走 目标语→en→原文 回退链且不打码 / Display-layer lookup: any Chinese UI (all zh*, Simplified & Traditional) keeps the original behavior (masked name / raw desc, plugins not yet translated to Traditional); other languages use target→en→original fallback without masking */
function pName(p) {
  if (isZh()) return maskText(p.name);
  const row = PLUG_I18N && PLUG_I18N.plugins && PLUG_I18N.plugins[p.id];
  const m = row && row.name;
  return (m && (m[state.lang] || m[FALLBACK])) || p.name;
}
function pDesc(p) {
  if (isZh()) return maskText(p.desc || '');
  const row = PLUG_I18N && PLUG_I18N.plugins && PLUG_I18N.plugins[p.id];
  const m = row && row.desc;
  return (m && (m[state.lang] || m[FALLBACK])) || p.desc || '';
}

/* V8c:体积人性化显示,输入单位为 MB / V8c: human-readable size, input value in MB */
function fmtSize(mb) {
  mb = Number(mb) || 0;
  if (mb >= 1000) return (Math.round(mb / 100) / 10) + ' GB';   // 一位小数,整数时自然去掉 .0 / one decimal; trailing .0 drops naturally
  if (mb >= 0.95) return (Math.round(mb * 10) / 10) + ' MB';
  const kb = mb * 1024;
  if (kb >= 1) return Math.round(kb) + ' KB';
  return Math.max(0, Math.round(kb * 1024)) + ' B';
}

function applyI18n() {
  ensurePlugI18n();   // 非中文界面需要插件译名,未加载则触发并在完成后重渲染 / non-Chinese UIs need translated plugin names; trigger the load, re-render on completion
  document.documentElement.lang = state.lang;
  document.title = 'Wei.G · ' + t('app.title');   // 品牌名不随语言变 / brand name stays across languages
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = t('app.desc');
  $('advLabel').title = t('adv.title');
  // Fork 提示内嵌两个链接,不能整段 textContent,需拆分文案后用 DOM 节点拼装 / The fork hint embeds two links, so the text is split and assembled from DOM nodes instead of one textContent
  const hint = $('selfHint');
  hint.textContent = '';
  const parts = t('mode.self.hint').split(t('mode.self.fork'));
  const mkA = (href, text) => { const a = document.createElement('a'); a.href = href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = text; return a; };
  const repo = targetRepoBase();
  if (parts.length === 2) {
    hint.appendChild(document.createTextNode(parts[0]));
    hint.appendChild(mkA('https://github.com/' + OFFICIAL_REPO + '/fork', t('mode.self.fork')));
    hint.appendChild(document.createTextNode(parts[1] + ' '));
  } else {
    hint.appendChild(document.createTextNode(t('mode.self.hint') + ' '));
  }
  hint.appendChild(mkA('https://github.com/' + OFFICIAL_REPO + '#fork-自建', t('mode.self.tutorial')));
  applyThemeIcon();
  if (PLUGINS) { renderDevices(); renderSources(); renderGroups(); updateStats(); updateLoginInfo(); }
}
function targetRepoBase() { return OFFICIAL_REPO; }

/* ============ 中文敏感词处理,仅中文界面生效,其他语言不改 / Sensitive-word masking, applied to the Chinese UI only ============ */
/* 中文敏感词直接替换为隐晦说法 / Chinese sensitive terms are replaced with euphemisms */
const ZH_SUB = [['科学上网', '魔法上网'], ['科学', '魔法'], ['代理', '魔法'], ['翻墙', '魔法'], ['梯子', '魔法']];
/* 英文品牌/协议名保留首尾、中间打星;按长度降序排序防止短词抢先匹配 / English brand/protocol names keep head and tail with stars between; sorted longest-first so short words cannot match early */
const EN_MASK = ['shadowsocks', 'passwall', 'trojan', 'proxy', 'v2ray', 'socks', 'brook', 'clash', 'xray', 'vpn', 'ssr']
  .sort((a, b) => b.length - a.length);
const EN_RE = new RegExp(EN_MASK.join('|'), 'gi');
function starMask(w) {
  if (w.length <= 2) return w[0] + '*';
  if (w.length === 3) return w[0] + '*' + w[2];
  const stars = Math.min(Math.max(w.length - 3, 2), 4);
  return w.slice(0, 2) + '*'.repeat(stars) + w.slice(-1);
}
function maskText(s) {
  if (!isZh()) return String(s);            // 非中文界面完全不处理 / Non-Chinese UIs are left untouched
  let out = String(s);
  for (const [from, to] of ZH_SUB) out = out.split(from).join(to);
  return out.replace(EN_RE, starMask);
}
const groupLabel = (g) => maskText(t('group.' + g));

/* ============ 数据加载 / Data loading ============ */
function dataUrls(path) {
  if (path.includes('..') || !/^[\w./-]+$/.test(path)) throw new Error('非法数据路径: ' + path);
  return [
    './data/' + path,
    'https://cdn.jsdelivr.net/gh/' + OFFICIAL_REPO + '@' + BRANCH + '/site/wrt/data/' + path,
    'https://raw.githubusercontent.com/' + OFFICIAL_REPO + '/' + BRANCH + '/site/wrt/data/' + path,
  ];
}
async function fetchData(path) {
  for (const u of dataUrls(path)) {
    try { const r = await fetch(u, { cache: 'no-cache' }); if (r.ok) return r; } catch (e) { /* 失败则回退到下一级镜像 / Fall through to the next mirror tier */ }
  }
  throw new Error('数据加载失败: ' + path);
}
async function loadJson(path) {
  const key = 'wrt_cache:' + path;
  const cached = localStorage.getItem(key);
  const refresh = async () => {
    const text = await (await fetchData(path)).text();
    if (text !== cached) { safeSet(key, text); if (cached) showToast(t('toast.dataUpdated')); }
    return text;
  };
  if (cached) { refresh().catch(() => {}); return JSON.parse(cached); }
  return JSON.parse(await refresh());
}

/* ============ 轻提示 / Toast ============ */
let toastTimer = 0;
function showToast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.hidden = false;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.remove('show'); el.hidden = true; }, 2800);
}

/* ============ 气泡说明 / Info popover ============ */
const popover = $('popover');
function showPopover(anchor, title, body) {
  $('popTitle').textContent = title;
  $('popBody').textContent = body;
  popover.hidden = false;
  const r = anchor.getBoundingClientRect();
  const pw = Math.min(320, window.innerWidth - 24);
  let left = r.left + window.scrollX;
  if (left + pw > window.scrollX + window.innerWidth - 12) left = window.scrollX + window.innerWidth - pw - 12;
  popover.style.left = left + 'px';
  popover.style.top = (r.bottom + window.scrollY + 8) + 'px';
}
function hidePopover() { popover.hidden = true; }
document.addEventListener('click', (e) => {
  if (!popover.hidden && !popover.contains(e.target) && !e.target.closest('.info')) hidePopover();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { hidePopover(); closeModal(); } });
window.addEventListener('scroll', hidePopover, { passive: true });

function makePill(label, infoTitle, infoBody, onSelect) {
  const pill = document.createElement('button');
  pill.type = 'button';
  pill.className = 'pill';
  pill.setAttribute('aria-pressed', 'false');
  pill.appendChild(document.createTextNode(label));
  if (infoBody) {
    const info = document.createElement('span');
    info.className = 'info';
    info.textContent = 'ⓘ';
    info.setAttribute('role', 'button');
    info.setAttribute('tabindex', '0');
    info.setAttribute('aria-label', label);
    const show = (e) => { e.preventDefault(); e.stopPropagation(); showPopover(pill, infoTitle, infoBody); };
    info.addEventListener('click', show);
    info.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') show(e); });
    pill.appendChild(info);
    pill.addEventListener('dblclick', () => showPopover(pill, infoTitle, infoBody));
  }
  pill.addEventListener('click', onSelect);
  return pill;
}
function setActive(row, pill) {
  row.querySelectorAll('.pill').forEach((p) => { p.classList.remove('pill-active'); p.setAttribute('aria-pressed', 'false'); });
  pill.classList.add('pill-active');
  pill.setAttribute('aria-pressed', 'true');
}

/* ============ 初始化 / Init ============ */
async function init() {
  try {
    I18N = await loadJson('i18n.json');
    state.lang = pickLang();
    renderLangSel();
    DEVICES = await loadJson('devices.json');
    const first = DEVICES.devices.find((d) => d.enabled === true) || DEVICES.devices[0];
    await switchDevice(first, true);
    renderModes();
    applyI18n();
    $('advMode').checked = state.advanced;
    resetAdvGrey();   // V10:门禁行随记忆的开发者模式显隐,但永远从未勾开始 / V10: gate row follows the remembered developer mode, but always starts unticked
    $('loading').hidden = true;
    $('form').hidden = false;
    $('actionbar').hidden = false;
    if (localStorage.getItem('wrt_risk') !== 'ok') $('riskBar').hidden = false;
    updateStats();
  } catch (err) {
    $('loading').textContent = (I18N ? t('loading.fail', { msg: err.message }) : '加载失败: ' + err.message);
  }
}

/* 下拉里中文用精简双字名,其余语言用自称 / Chinese uses short two-char labels in the dropdown; other languages keep their native names */
const LANG_SHORT = { 'zh-CN': '简中', 'zh-TW': '繁中' };
function renderLangSel() {
  const sel = $('langSel');
  sel.textContent = '';
  for (const l of I18N.languages) {
    const o = document.createElement('option');
    o.value = l.id;
    o.textContent = LANG_SHORT[l.id] || l.native || l.name;
    if (l.id === state.lang) o.selected = true;
    sel.appendChild(o);
  }
  sel.addEventListener('change', () => {
    state.lang = sel.value;
    safeSet('wrt_lang', state.lang);
    applyI18n();
  });
}

let switchSeq = 0;
async function switchDevice(dev, first) {
  const seq = ++switchSeq;
  state.device = dev;
  const data = await loadJson(dev.plugins === 'seed' ? 'seed/plugins.json' : dev.id + '/plugins.json');
  if (seq !== switchSeq) return;
  PLUGINS = data;
  state.sel.clear();
  state.removed.clear();
  devPkgs.clear();
  devRemoved.clear();
  PKGDATA = null;   // 软件包表按机型加载 / package table is per-device
  collapsed.clear();
  PLUGINS.groups.forEach((g) => collapsed.add(g));
  renderDevices();
  renderSources();
  renderGroups();
  updateStats();
  updateLoginInfo();
  updateDevpkgBox();
  if (!first) showToast(t('toast.deviceSwitched', { name: dev.name }));
}

/* 机型两级选择:先品牌后机型;机型气泡列出可用产线 / Two-level picker: brand first, then model; the model popover lists its available source pipelines */
let curBrand = null;
function renderDevices() {
  if (!curBrand && state.device) curBrand = state.device.brand;
  const brandRow = $('brandRow');
  brandRow.textContent = '';
  const brands = [...new Set(DEVICES.devices.map((d) => d.brand))];
  for (const b of brands) {
    const models = DEVICES.devices.filter((d) => d.brand === b);
    const anyOn = models.some((d) => d.enabled === true);
    const pill = makePill(b, b, models.length + ' 款 · ' + models.map((d) => d.name).slice(0, 8).join('、') + (models.length > 8 ? '…' : ''), () => {
      curBrand = b;
      renderDevices();
    });
    if (!anyOn) pill.classList.add('pill-locked');
    brandRow.appendChild(pill);
    if (b === curBrand) setActive(brandRow, pill);
  }

  const row = $('deviceRow');
  row.textContent = '';
  for (const d of DEVICES.devices.filter((x) => x.brand === curBrand)) {
    const enabled = d.enabled === true;
    const srcList = (d.sources || []).map((s) => s.label).join(' · ');
    const info = (d.note || '') + (srcList ? '\n\n' + t('device.sources', { list: srcList }) : '') +
      (enabled ? '' : '\n\n' + t('device.locked.note'));
    const pill = makePill(d.name, d.name + ' · ' + d.chip, info, () => {
      if (!enabled) { showToast(t('device.locked')); return; }
      if (state.device.id !== d.id) switchDevice(d);
    });
    if (!enabled) pill.classList.add('pill-locked');
    row.appendChild(pill);
    if (state.device && d.id === state.device.id) setActive(row, pill);
  }
}

function renderSources() {
  const row = $('sourceRow');
  row.textContent = '';
  state.device.sources.forEach((s, i) => {
    const pill = makePill(s.label, s.label + ' · ' + s.repo, s.desc, () => {
      state.source = s;
      setActive(row, pill);
      renderVersions();
      renderVariants();
      renderGroups();
      updateStats();
      updateLoginInfo();
      updateDevpkgBox();
    });
    row.appendChild(pill);
    if (i === 0) { state.source = s; setActive(row, pill); }
  });
  renderVersions();
  renderVariants();
}

function renderVersions() {
  const row = $('versionRow');
  row.textContent = '';
  state.version = state.source.versions[0];
  state.source.versions.forEach((v) => {
    const pill = makePill(v.label, v.label + ' · ' + v.branch, v.note || '', () => {
      state.version = v;
      setActive(row, pill);
      updateStats();
    });
    row.appendChild(pill);
    if (v.id === state.version.id) setActive(row, pill);
  });
}

function renderVariants() {
  const row = $('variantRow');
  row.textContent = '';
  state.variant = state.source.variants[0];
  state.source.variants.forEach((v) => {
    const pill = makePill(v.name, v.name, v.note || '', () => {
      state.variant = v;
      setActive(row, pill);
      updateStats();
    });
    row.appendChild(pill);
    if (v.id === state.variant.id) setActive(row, pill);
  });
}

function renderModes() {
  const row = $('modeRow');
  row.querySelectorAll('.pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      state.mode = pill.dataset.mode;
      setActive(row, pill);
      $('selfBox').hidden = state.mode !== 'self';
      safeSet('wrt_mode', state.mode);
    });
    if (pill.dataset.mode === state.mode) setActive(row, pill);
  });
  $('selfBox').hidden = state.mode !== 'self';
  $('ownerBox').value = state.owner;
  $('ownerBox').addEventListener('input', () => {
    state.owner = $('ownerBox').value.trim();
    safeSet('wrt_owner', state.owner);
  });
  $('lanipBox').value = state.lanip;
  $('lanipBox').addEventListener('change', () => {
    const v = $('lanipBox').value.trim();
    if (LANIP_RE.test(v)) { state.lanip = v; safeSet('wrt_lanip', v); }
    else { $('lanipBox').value = state.lanip = '192.168.1.1'; safeSet('wrt_lanip', state.lanip); showToast(t('lanip.invalid')); }
  });
  // 初始密码:可选;@empty 表示清空该源自带的初始密码;不持久化(是密码) / optional initial password; @empty blanks a shipped password; never persisted
  $('rootpwBox').addEventListener('change', () => {
    const v = $('rootpwBox').value.trim();
    if (v === '' || v === '@empty' || /^[A-Za-z0-9@#%^&*_+=.,:!?-]{4,32}$/.test(v)) state.rootpw = v;
    else { $('rootpwBox').value = ''; state.rootpw = ''; showToast(t('rootpw.invalid')); }
  });
}

/* 当前源的登录信息提示,root 与密码状态着色强调 / per-source login hint with colored emphasis on "root" and the password value */
function updateLoginInfo() {
  if (!state.source) return;
  const box = $('loginInfo');
  box.textContent = '';
  const pwText = t(state.source.loginPw ? 'login.pw.' + state.source.loginPw : 'login.pw.none');
  //  作密码占位,模板任意语言通用 /  marks the password slot, language-agnostic
  const parts = t('login.info', { pw: '' }).split('');
  const addWithRoot = (str) => {
    for (const seg of str.split(/(root)/i)) {
      if (/^root$/i.test(seg)) {
        const em = document.createElement('em');
        em.className = 'login-user';
        em.textContent = seg;
        box.appendChild(em);
      } else if (seg) box.appendChild(document.createTextNode(seg));
    }
  };
  addWithRoot(parts[0] || '');
  // 密码"值"金色强调,括号里的附注保持普通样式并留空格 / gold-highlight only the password value; the parenthetical note stays plain, space-separated
  const noteAt = pwText.search(/[((]/);
  const pw = document.createElement('em');
  pw.className = 'login-pw';
  pw.textContent = noteAt > 0 ? pwText.slice(0, noteAt).trim() : pwText;
  box.appendChild(pw);
  if (noteAt > 0) box.appendChild(document.createTextNode('  ' + pwText.slice(noteAt)));
  addWithRoot(parts[1] || '');
}

/* ============ 插件列表 / Plugin list ============ */
function pluginState(p) {
  if (p.builtin && p.builtin[state.source.id]) return 'builtin';
  if (state.source.append) return 'ok';   // append 模式产线:所有插件按追加方式可勾 / append-mode source: every plugin is selectable by appending
  if (!p.pkgs[state.source.id]) return 'unavailable';
  return 'ok';
}
const byId = (id) => PLUGINS.plugins.find((x) => x.id === id);

/* 搜索匹配串:原文名/说明/id/包名 + en 名 + 当前语言名,任何语言下输英文名或本语言名都能命中 / Search haystack: original name/desc/id/package name + English name + current-language name, so English or localized names match in any UI language */
function searchHay(p) {
  const row = PLUG_I18N && PLUG_I18N.plugins && PLUG_I18N.plugins[p.id];
  const nm = row && row.name;
  return [p.id, p.name, p.desc || '', (state.source && p.pkgs[state.source.id]) || p.pkg || '',
    (nm && nm[FALLBACK]) || '', (nm && nm[state.lang]) || ''].join(' ').toLowerCase();
}

function renderGroups() {
  const box = $('groups');
  box.textContent = '';
  const kw = $('searchBox').value.trim().toLowerCase();
  const hotOnly = $('hotOnly').checked;
  const searching = !!kw || hotOnly;

  for (const g of PLUGINS.groups) {
    const items = PLUGINS.plugins.filter((p) => p.group === g)
      .filter((p) => !hotOnly || p.hot)
      .filter((p) => !kw || searchHay(p).includes(kw));
    if (!items.length) continue;

    const group = document.createElement('div');
    group.className = 'group' + (!searching && collapsed.has(g) ? ' collapsed' : '') + (searching ? ' searching' : '');
    group.dataset.group = g;

    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'group-head';
    head.setAttribute('aria-expanded', String(searching || !collapsed.has(g)));
    const ico = document.createElement('span');
    ico.className = 'group-ico';
    ico.setAttribute('aria-hidden', 'true');
    ico.textContent = GROUP_ICONS[g] || '📦';
    head.appendChild(ico);
    head.appendChild(document.createTextNode(groupLabel(g)));
    const badge = document.createElement('span');
    badge.className = 'group-badge';
    badge.dataset.badge = g;
    head.appendChild(badge);
    const cnt = document.createElement('span');
    cnt.className = 'group-count';
    cnt.textContent = t('plugin.group.count', { n: items.length });
    head.appendChild(cnt);
    const chev = document.createElement('span');
    chev.className = 'chev';
    chev.setAttribute('aria-hidden', 'true');
    chev.textContent = '▾';
    head.appendChild(chev);
    head.addEventListener('click', () => {
      if (searching) return;
      if (collapsed.has(g)) collapsed.delete(g); else collapsed.add(g);
      group.classList.toggle('collapsed');
      head.setAttribute('aria-expanded', String(!collapsed.has(g)));
      if (!collapsed.has(g)) fitPluginNames(group);   // 折叠时量不到高度,展开后补测 / heights are unmeasurable while collapsed, so re-check on expand
    });
    group.appendChild(head);

    const grid = document.createElement('div');
    grid.className = 'plugin-grid';
    for (const p of items) grid.appendChild(renderPlugin(p));
    group.appendChild(grid);
    box.appendChild(group);
  }
  if (!box.children.length) {
    const empty = document.createElement('p');
    empty.className = 'hint empty-hint';
    empty.textContent = t('search.empty');
    box.appendChild(empty);
  }
  updateLegend();
  updateGroupBadges();
  fitPluginNames();
}

/* V11:插件名适配:默认单行,溢出先缩 1px,再分两行,再缩 1px(共 −2px),极端长名靠两行内省略号兜底 / V11: plugin-name fitting: single line by default; on overflow shrink 1px, then wrap to two lines, then shrink 1px more (−2px total); extreme names fall back to the two-line ellipsis */
function fitOneName(el) {
  el.classList.remove('fit-s1', 'two-line', 'fit-s2');
  if (!el.clientWidth) return;   // 折叠分组量不到尺寸,展开时再补测 / collapsed groups are unmeasurable; re-checked on expand
  const over = () => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
  if (!over()) return;
  el.classList.add('fit-s1');    // ① 字号 −1px / step 1: font −1px
  if (!over()) return;
  el.classList.add('two-line');  // ② 允许两行 / step 2: allow two lines
  if (!over()) return;
  el.classList.remove('fit-s1');
  el.classList.add('fit-s2');    // ③ 再 −1px(共 −2px),到此为止 / step 3: another −1px (−2px total); stop here
}
function fitPluginNames(scope) {
  (scope || document).querySelectorAll('.plugin-name').forEach(fitOneName);
}
/* 窗口尺寸变化后防抖重测 / debounced re-fit on window resize */
let fitTimer = 0;
window.addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(() => fitPluginNames(), 150); });

/* 插件项只显示名字以保持列表紧凑,说明收进气泡,点名字才弹出 / Plugin rows show only the name to keep the list compact; details live in a popover opened by clicking the name */
function renderPlugin(p) {
  const st = pluginState(p);
  const adv = state.advanced;
  const canForce = adv && devAllowGrey;   // V10:灰色项需开发者模式 + 二级门禁双开 / V10: grey items need developer mode AND the second gate
  // 必选项(locked):内置且任何模式都不可取消 / locked items stay checked & disabled even in advanced mode
  const lockedItem = p.locked && st === 'builtin';
  const item = document.createElement('div');
  item.className = 'plugin' +
    (st === 'unavailable' ? (canForce ? ' plugin-forceable' : ' plugin-disabled') : '') +
    (st === 'builtin' ? (adv && !lockedItem ? ' plugin-removable' : ' plugin-builtin') : '');

  const cbId = 'pcb-' + p.id;
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.id = cbId;
  cb.dataset.pid = p.id;
  cb.checked = st === 'builtin' ? !state.removed.has(p.id) : state.sel.has(p.id);
  // V10:灰色项只看双开关,其余沿用旧规则 / V10: grey items obey the double gate; everything else keeps the old rule
  cb.disabled = lockedItem || (st === 'unavailable' ? !canForce : (!adv && st !== 'ok'));
  cb.setAttribute('aria-label', pName(p));
  cb.addEventListener('change', () => {
    if (st === 'builtin') {
      if (cb.checked) {
        state.removed.delete(p.id);
      } else {
        state.removed.add(p.id);
        if (p.warn) showToast(t(p.warn));   // 取消高风险内置项时同样提示 / warn when removing a risky builtin too
      }
    } else if (cb.checked) {
      state.sel.add(p.id);
      applyRequires(p);
      if (p.warn) showToast(t(p.warn));   // 资源警告(如 Docker)勾选即弹 / resource warning pops right on ticking
    } else {
      state.sel.delete(p.id);
      warnDependents(p);
    }
    updateStats();
  });
  item.appendChild(cb);

  const nameBtn = document.createElement('button');
  nameBtn.type = 'button';
  nameBtn.className = 'plugin-name';
  nameBtn.appendChild(document.createTextNode(pName(p)));
  if (p.hot) {
    const hot = document.createElement('span');
    hot.className = 'hot';
    hot.textContent = t('plugin.hot');
    nameBtn.appendChild(hot);
  }
  if (canForce && st === 'unavailable') {
    const f = document.createElement('span');
    f.className = 'flag flag-force';
    f.textContent = t('adv.forced');
    nameBtn.appendChild(f);
  }
  if (lockedItem) {
    const f = document.createElement('span');
    f.className = 'flag flag-required';
    f.textContent = t('plugin.required');
    nameBtn.appendChild(f);
  }
  const detail = (st === 'builtin' ? t('plugin.builtin')
    : st === 'unavailable' ? t('plugin.unavailable')
    : pDesc(p)) + (p.warn ? '\n' + t(p.warn) : '');
  const pkg = p.pkgs[state.source.id] || p.pkg;
  nameBtn.title = detail;
  nameBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showPopover(nameBtn, pName(p), detail + '\n' + pkg + ' · ' + t('drawer.size', { n: fmtSize(p.size || 1) }));
  });
  item.appendChild(nameBtn);
  return item;
}

function applyRequires(p) {
  if (!p.requires) return;
  const added = [];
  for (const rid of p.requires) {
    const rp = byId(rid);
    if (!rp || pluginState(rp) !== 'ok' || state.sel.has(rid)) continue;
    state.sel.add(rid);
    const cb = document.querySelector('input[data-pid="' + rid + '"]');
    if (cb) cb.checked = true;
    added.push(pName(rp));
  }
  if (added.length) showToast(t('toast.depAdded', { list: added.join('、') }));
}
function warnDependents(p) {
  const deps = PLUGINS.plugins.filter((q) => state.sel.has(q.id) && q.requires && q.requires.includes(p.id));
  if (deps.length) showToast(t('toast.depWarn', { list: deps.map((q) => pName(q)).join('、') }));
}

/* ============ 开发者模式:全量软件包搜索 / developer mode: raw package browser ============ */
async function ensurePkgData() {
  if (PKGDATA || state.device.plugins === 'seed') return;
  try { PKGDATA = await loadJson(state.device.id + '/packages.json'); } catch (e) { PKGDATA = null; }
}
function updateDevpkgBox() {
  const show = state.advanced && state.device && state.device.plugins !== 'seed';
  $('devpkgBox').hidden = !show;
  if (show) ensurePkgData().then(renderPkgList);
}
function renderPkgList() {
  const box = $('pkgList');
  box.textContent = '';
  if (!PKGDATA) return;
  $('devpkgCount').textContent = PKGDATA.count;
  const kw = $('pkgSearch').value.trim().toLowerCase();
  if (kw.length < 2) {
    const p = document.createElement('p');
    p.className = 'hint';
    p.textContent = t('devpkg.empty', { n: PKGDATA.count });
    box.appendChild(p);
    return;
  }
  const names = Object.keys(PKGDATA.pkgs).filter((n) => n.toLowerCase().includes(kw));
  for (const name of names.slice(0, 200)) {
    const st = PKGDATA.pkgs[name][state.source.id];   // off / y / m / undefined = 该源没有此包 / undefined = source lacks the pkg
    const row = document.createElement('label');
    row.className = 'pkg-item';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.disabled = st === undefined;
    cb.checked = st === 'y' ? !devRemoved.has(name) : devPkgs.has(name);
    cb.addEventListener('change', () => {
      if (st === 'y') { if (cb.checked) devRemoved.delete(name); else devRemoved.add(name); }
      else { if (cb.checked) devPkgs.add(name); else devPkgs.delete(name); }
      updateStats();
    });
    row.appendChild(cb);
    const span = document.createElement('span');
    span.className = 'pkg-name';
    span.textContent = name;
    span.title = name + ' · ' + (st === undefined ? t('plugin.unavailable') : st === 'y' ? '=y' : st === 'm' ? '=m' : 'not set');
    row.appendChild(span);
    if (st === 'y') {
      const f = document.createElement('span');
      f.className = 'flag flag-remove';
      f.textContent = '=y';
      row.appendChild(f);
    }
    box.appendChild(row);
  }
  if (names.length > 200) {
    const p = document.createElement('p');
    p.className = 'hint';
    p.textContent = t('devpkg.more', { n: names.length - 200 });
    box.appendChild(p);
  }
}
let pkgSearchTimer = 0;
$('pkgSearch').addEventListener('input', () => { clearTimeout(pkgSearchTimer); pkgSearchTimer = setTimeout(renderPkgList, 150); });

/* V10:清掉已强制勾选的灰色项并轻提示,门禁取消与关闭开发者模式共用 / V10: drop force-selected grey items with a light toast; shared by gate-off and developer-mode-off */
function clearForcedGrey() {
  const dropped = [];
  for (const id of [...state.sel]) {
    const p = byId(id);
    if (p && pluginState(p) !== 'ok') { state.sel.delete(id); dropped.push(pName(p)); }
  }
  if (dropped.length) showToast(t('drawer.inactive', { list: dropped.join('、') }));
}
/* V10:门禁复位:不记忆,开发者模式每次开/关都回到未勾 / V10: reset the gate; no memory — it returns to unticked on every developer-mode flip */
function resetAdvGrey() {
  devAllowGrey = false;
  $('advGrey').checked = false;
  $('advGreyRow').hidden = !state.advanced;
}
/* V10:灰色门禁子开关:勾选必须过确认弹窗,取消立即清理强制项 / V10: the grey-gate sub-toggle; ticking requires a confirm dialog, unticking cleans forced items at once */
$('advGrey').addEventListener('change', () => {
  if ($('advGrey').checked) {
    if (!confirm(t('adv.grey.confirm'))) { $('advGrey').checked = false; return; }   // 取消则回弹不勾 / cancel bounces it back unticked
    devAllowGrey = true;
  } else {
    devAllowGrey = false;
    clearForcedGrey();
  }
  renderGroups();
  updateStats();
});

/* 开发者模式开关(原"高级模式") / developer-mode toggle (formerly advanced mode) */
$('advMode').addEventListener('change', () => {
  if ($('advMode').checked) {
    if (!confirm(t('adv.confirm'))) { $('advMode').checked = false; return; }
    state.advanced = true;
    showToast(t('adv.on'));
  } else {
    state.advanced = false;
    // 关闭时清掉仅开发者模式才成立的选择,避免普通模式携带非法状态 / On turning off, drop selections only valid in developer mode so normal mode never carries illegal state
    clearForcedGrey();
    state.removed.clear();
    devPkgs.clear();
    devRemoved.clear();
  }
  resetAdvGrey();   // V10:门禁随开发者模式开/关一律复位 / V10: the gate resets on every developer-mode flip
  safeSet('wrt_adv', state.advanced ? '1' : '0');
  renderGroups();
  updateStats();
  updateDevpkgBox();
});

let searchTimer = 0;
$('searchBox').addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(renderGroups, 150); });
$('hotOnly').addEventListener('change', renderGroups);

/* 当前源下真正生效的选择,勾选项在换源后可能不再可用 / Selections actually effective under the current source; checked items may become unavailable after switching sources */
function effectiveSelection() {
  const normal = [], forced = [], removed = [];
  for (const p of PLUGINS.plugins) {
    const st = pluginState(p);
    if (st === 'builtin') { if (state.removed.has(p.id)) removed.push(p); continue; }
    if (!state.sel.has(p.id)) continue;
    if (st === 'ok') normal.push(p);
    else if (state.advanced) forced.push(p);
  }
  return { normal, forced, removed, all: normal.concat(forced) };
}

function updateLegend() {
  let ok = 0, builtin = 0, off = 0;
  for (const p of PLUGINS.plugins) {
    const st = pluginState(p);
    if (st === 'ok') ok++; else if (st === 'builtin') builtin++; else off++;
  }
  $('availStats').textContent = t('legend.stats', { ok, builtin, off });
}
function updateGroupBadges() {
  document.querySelectorAll('.group-badge').forEach((b) => {
    const g = b.dataset.badge;
    const n = PLUGINS.plugins.filter((p) => p.group === g && (state.sel.has(p.id) || state.removed.has(p.id))).length;
    b.textContent = n ? t('plugin.group.selected', { n }) : '';
  });
}

function updateStats() {
  const sel = effectiveSelection();
  const n = sel.all.length + sel.removed.length;
  $('selCount').textContent = t('bar.selected', { n });
  const sizeSum = sel.all.reduce((s, p) => s + (p.size || 1), 0);
  const budget = (state.variant && state.variant.capacity) || 60;
  const pct = Math.min(100, Math.round((sizeSum / budget) * 100));
  const fill = $('capFill');
  fill.style.width = pct + '%';
  fill.className = 'cap-fill' + (pct >= 100 ? ' over' : pct >= 75 ? ' warn' : '');
  $('capText').textContent = t('bar.capacity', { pct }) + (pct >= 100 ? ' ' + t('bar.capacity.over') : '');
  updateGroupBadges();
}

/* ============ 已选清单 / Selected list ============ */
function openSelectedDrawer() {
  const sel = effectiveSelection();
  const rows = sel.normal.concat(sel.forced).map((p) => ({ p, kind: sel.forced.includes(p) ? 'force' : '' }))
    .concat(sel.removed.map((p) => ({ p, kind: 'remove' })));
  openModal(t('drawer.title'));
  const mb = $('modalBody');
  mb.textContent = '';
  if (!rows.length) {
    const p = document.createElement('p');
    p.textContent = t('drawer.empty');
    mb.appendChild(p);
    return;
  }
  const list = document.createElement('div');
  list.className = 'sel-list';
  for (const { p, kind } of rows) {
    const row = document.createElement('div');
    row.className = 'sel-row';
    const name = document.createElement('span');
    name.textContent = pName(p);
    if (kind) {
      const f = document.createElement('span');
      f.className = 'flag ' + (kind === 'force' ? 'flag-force' : 'flag-remove');
      f.textContent = kind === 'force' ? t('adv.forced') : t('adv.removed');
      name.appendChild(f);
    }
    const sz = document.createElement('span');
    sz.className = 'sel-size';
    sz.textContent = t('drawer.size', { n: fmtSize(p.size || 1) });
    const rm = document.createElement('button');
    rm.type = 'button';
    rm.className = 'sel-rm';
    rm.textContent = '✕';
    rm.setAttribute('aria-label', t('drawer.remove', { name: pName(p) }));
    rm.addEventListener('click', () => {
      if (kind === 'remove') state.removed.delete(p.id); else state.sel.delete(p.id);
      const cb = document.querySelector('input[data-pid="' + p.id + '"]');
      if (cb) cb.checked = kind === 'remove';
      if (kind !== 'remove') warnDependents(p);
      updateStats();
      row.remove();
      if (!list.children.length) closeModal();
    });
    row.appendChild(name); row.appendChild(sz); row.appendChild(rm);
    list.appendChild(row);
  }
  mb.appendChild(list);
  const inactive = PLUGINS.plugins.filter((p) => state.sel.has(p.id) && pluginState(p) === 'unavailable' && !state.advanced);
  if (inactive.length) {
    const note = document.createElement('p');
    note.className = 'hint';
    note.textContent = t('drawer.inactive', { list: inactive.map((p) => pName(p)).join('、') });
    mb.appendChild(note);
  }
}
$('selCount').addEventListener('click', openSelectedDrawer);

/* ============ 生成 .config / Generate the .config ============ */
function applyToConfig(text, sel) {
  const src = state.source.id;
  for (const pair of state.variant.patch || []) text = text.split(pair.from).join(pair.to);
  const setY = (pkg) => {
    const notset = '# CONFIG_PACKAGE_' + pkg + ' is not set';
    const asM = 'CONFIG_PACKAGE_' + pkg + '=m';
    const asY = 'CONFIG_PACKAGE_' + pkg + '=y';
    if (text.includes(notset)) text = text.replace(notset, asY);
    else if (text.includes(asM + '\n') || text.endsWith(asM)) text = text.replace(asM, asY);
    else if (!text.includes(asY)) text += '\n' + asY;
  };
  for (const p of sel.all) setY(p.pkgs[src] || p.pkg);
  for (const p of sel.removed) {
    const pkg = p.pkgs[src] || p.pkg;
    text = text.replace('CONFIG_PACKAGE_' + pkg + '=y', '# CONFIG_PACKAGE_' + pkg + ' is not set');
  }
  // 开发者模式原始软件包 / raw package ops from developer mode
  if (state.advanced) {
    for (const name of devPkgs) setY(name);
    for (const name of devRemoved) text = text.replace('CONFIG_PACKAGE_' + name + '=y', '# CONFIG_PACKAGE_' + name + ' is not set');
  }
  return '# Generated by WeiG-OpenWrt-AutoBuild web customizer\n' +
    '# device=' + state.device.id + ' source=' + src + ' version=' + state.version.id +
    ' (' + state.version.branch + ') variant=' + state.variant.id + '\n' +
    '# plugins: ' + (sel.normal.map((p) => p.id).join(' ') || '(none)') + '\n' +
    (sel.forced.length ? '# forced (advanced): ' + sel.forced.map((p) => p.id).join(' ') + '\n' : '') +
    (sel.removed.length ? '# removed builtin (advanced): ' + sel.removed.map((p) => p.id).join(' ') + '\n' : '') + text;
}

async function downloadConfig() {
  const btn = $('dlBtn');
  btn.disabled = true;
  btn.textContent = t('btn.download.busy');
  try {
    const raw = await (await fetchData(state.device.id + '/' + state.source.config)).text();
    const text = applyToConfig(raw, effectiveSelection());
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = String(now.getFullYear()).slice(-2) + pad(now.getMonth() + 1) + pad(now.getDate()) +
      '_' + pad(now.getHours()) + pad(now.getMinutes());   // 浏览器本地时间 / browser-local time
    a.download = [state.device.id, stamp, state.source.id, state.version.id, state.variant.id].join('-') + '.config';
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (err) {
    alert(t('btn.download.fail', { msg: err.message }));
  } finally {
    btn.disabled = false;
    btn.textContent = t('btn.download');
  }
}

/* ============ 提交云编译 / Submit a cloud build ============ */
function targetRepo() {
  if (state.mode === 'self') {
    const owner = state.owner.replace(/[^A-Za-z0-9-]/g, '');
    return owner ? owner + '/' + REPO_NAME : null;
  }
  return OFFICIAL_REPO;
}

let lastFocus = null;
function openModal(title) {
  $('modalTitle').textContent = title;
  lastFocus = document.activeElement;
  $('modal').hidden = false;
  document.body.classList.add('modal-open');
  $('modalClose').focus();
}
function closeModal() {
  if ($('modal').hidden) return;
  $('modal').hidden = true;
  $('modal').querySelector('.modal').classList.remove('modal-wide');   // 宽版仅用于说明弹窗 / wide layout is help-modal-only
  document.body.classList.remove('modal-open');
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}
$('modalClose').addEventListener('click', closeModal);
$('modal').addEventListener('click', (e) => { if (e.target === $('modal')) closeModal(); });
$('modal').addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const els = [...$('modal').querySelectorAll('button, a[href], input, textarea, select')].filter((el) => !el.disabled && el.offsetParent !== null);
  if (!els.length) return;
  const first = els[0], last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

function openSubmitModal() {
  const repo = targetRepo();
  if (!repo) { alert(t('owner.required')); $('ownerBox').focus(); return; }
  const sel = effectiveSelection();
  const tag = ($('tagBox').value.trim() || t('tag.anonymous')).slice(0, 24);
  const plugins = sel.normal.map((p) => p.id)
    .concat(sel.forced.map((p) => '+' + p.id))
    .concat(sel.removed.map((p) => '-' + p.id));
  const payload = {
    device: state.device.id, source: state.source.id, version: state.version.id,
    variant: state.variant.id, plugins, tag, lanip: state.lanip,
  };
  if (state.rootpw) payload.rootpw = state.rootpw;   // 留空不进载荷 / omitted when empty
  // 开发者模式的原始软件包操作:'-' 前缀表示移除内置 / raw package ops from developer mode; '-' prefix means remove a builtin
  const rawOps = state.advanced ? [...devPkgs].concat([...devRemoved].map((n) => '-' + n)) : [];
  if (rawOps.length) payload.packages = rawOps;
  const title = '[build] ' + tag + ' · ' + payload.device + '/' + payload.source + '/' + payload.version + '/' + payload.variant;
  const body = '提交后请勿修改本 issue,机器人会自动开始构建并在评论区回复进度与产物位置。\n\n' +
    '```json\n' + JSON.stringify(payload, null, 2) + '\n```\n';
  const issueUrl = 'https://github.com/' + repo + '/issues/new?title=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(body);
  const dispatchUrl = 'https://github.com/' + repo + '/actions/workflows/custom-build.yml';
  const dispatchParams = 'device: ' + payload.device + '\nsource: ' + payload.source + '\nversion: ' + payload.version +
    '\nvariant: ' + payload.variant + '\nplugins: ' + plugins.join(' ') + '\ntag: ' + tag + '\nlanip: ' + payload.lanip +
    (payload.rootpw ? '\nrootpw: ' + payload.rootpw : '') +
    (payload.packages ? '\npackages: ' + payload.packages.join(' ') : '');

  openModal(t('btn.submit'));
  const mb = $('modalBody');
  mb.textContent = '';
  const sum = document.createElement('div');
  sum.className = 'summary-box';
  sum.textContent = t('submit.summary', {
    device: state.device.name, source: state.source.label, version: state.version.label,
    variant: state.variant.name, n: plugins.length,
    list: plugins.length ? ':' + sel.all.concat(sel.removed).map((p) => pName(p)).join('、') : '',
    tag,
  });
  mb.appendChild(sum);

  const card = (titleKey, descText, btnKey, href, extra) => {
    const c = document.createElement('div');
    c.className = 'method-card';
    const h = document.createElement('h4');
    h.textContent = t(titleKey);
    c.appendChild(h);
    const p = document.createElement('p');
    p.textContent = descText;
    c.appendChild(p);
    if (extra) c.appendChild(extra);
    const a = document.createElement('a');
    a.className = 'btn' + (btnKey === 'submit.m1.btn' ? ' btn-primary' : '');
    a.href = href; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = t(btnKey);
    c.appendChild(a);
    mb.appendChild(c);
  };
  card('submit.m1.title', state.mode === 'self' ? t('submit.m1.descSelf') : t('submit.m1.desc'), 'submit.m1.btn', issueUrl);
  const ta = document.createElement('textarea');
  ta.className = 'copy-area';
  ta.readOnly = true;
  ta.value = dispatchParams;
  ta.addEventListener('click', () => ta.select());
  card('submit.m2.title', t('submit.m2.desc'), 'submit.m2.btn', dispatchUrl, ta);

  const p3 = document.createElement('p');
  p3.textContent = t('submit.footer', { tag });
  mb.appendChild(p3);
}
$('dlBtn').addEventListener('click', downloadConfig);
$('submitBtn').addEventListener('click', openSubmitModal);

/* ============ 一键自检 / One-click self test ============ */
async function timedFetch(url, timeout) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout || 8000);
  const start = performance.now();
  try {
    const r = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    const ms = Math.round(performance.now() - start);
    if (!r.ok) return { ok: false, ms, msg: 'HTTP ' + r.status };
    const text = await r.text();
    return { ok: true, ms: Math.round(performance.now() - start), size: text.length, text };
  } catch (e) {
    return { ok: false, ms: Math.round(performance.now() - start), msg: e.name === 'AbortError' ? t('st.timeout') : t('st.connFail') };
  } finally { clearTimeout(timer); }
}
const TIER_NAMES = ['local', 'jsDelivr', 'raw.github'];

async function runSelfTest() {
  openModal(t('st.title'));
  const mb = $('modalBody');
  mb.textContent = '';
  const intro = document.createElement('p');
  intro.className = 'hint';
  intro.textContent = t('st.intro');
  mb.appendChild(intro);

  function addRow(name) {
    const row = document.createElement('div');
    row.className = 'st-row';
    const ic = document.createElement('span');
    ic.className = 'st-ic';
    ic.textContent = '⏳';
    const box = document.createElement('div');
    const b = document.createElement('b');
    b.textContent = name;
    const msg = document.createElement('span');
    msg.className = 'st-msg';
    msg.textContent = t('st.checking');
    box.appendChild(b); box.appendChild(msg);
    row.appendChild(ic); row.appendChild(box);
    mb.appendChild(row);
    return (status, text) => {
      ic.textContent = status === 'ok' ? '✓' : status === 'warn' ? '⚠' : '✗';
      row.className = 'st-row st-' + status;
      msg.textContent = text;
    };
  }

  const d1 = addRow(t('st.browser'));
  const missing = ['fetch', 'URL', 'Blob', 'AbortController', 'localStorage'].filter((k) => !(k in window));
  d1(missing.length ? 'fail' : 'ok', missing.length ? t('st.browser.fail', { list: missing.join('、') }) : t('st.browser.ok'));

  const d2 = addRow(t('st.data'));
  const path2 = state.device ? state.device.id + '/plugins.json' : 'devices.json';
  const tiers = [];
  for (const [i, u] of dataUrls(path2).entries()) {
    const r = await timedFetch(u, 6000);
    tiers.push(TIER_NAMES[i] + (r.ok ? ' ✓ ' + r.ms + 'ms' : ' ✗ ' + r.msg));
    if (i === 0 && r.ok) { tiers.push(t('st.data.localHit')); break; }
  }
  const anyOk = tiers.some((x) => x.includes('✓'));
  const localOk = tiers[0].includes('✓');
  d2(anyOk ? (localOk ? 'ok' : 'warn') : 'fail',
    tiers.join(' · ') + (anyOk ? (localOk ? '' : t('st.data.cdnFallback')) : t('st.data.allFail')));

  const src = state.source;
  const d3 = addRow(t('st.config') + (src ? ' (' + src.label + ')' : ''));
  let cfgText = null, tierHit = '';
  if (!src) d3('fail', t('st.config.noData'));
  else {
    for (const [i, u] of dataUrls(state.device.id + '/' + src.config).entries()) {
      const r = await timedFetch(u, 10000);
      if (r.ok) { cfgText = r.text; tierHit = TIER_NAMES[i] + ' · ' + r.ms + 'ms · ' + Math.round(r.size / 1024) + 'KB'; break; }
    }
    d3(cfgText ? 'ok' : 'fail', cfgText ? t('st.config.ok', { tier: tierHit }) : t('st.config.fail'));
  }

  const d4 = addRow(t('st.gen'));
  if (!src || !cfgText || !PLUGINS) d4('fail', t('st.gen.skip'));
  else {
    const patches = (state.variant && state.variant.patch) || [];
    let text = cfgText, hit = 0;
    for (const pair of patches) { if (text.includes(pair.from)) hit++; text = text.split(pair.from).join(pair.to); }
    const probes = PLUGINS.plugins.filter((p) => pluginState(p) === 'ok').slice(0, 2);
    let flip = 0;
    for (const p of probes) {
      const pkg = p.pkgs[src.id];
      if (text.includes('# CONFIG_PACKAGE_' + pkg + ' is not set') || text.includes('CONFIG_PACKAGE_' + pkg + '=m') || text.includes('CONFIG_PACKAGE_' + pkg + '=y')) flip++;
    }
    const okAll = hit === patches.length && flip === probes.length;
    d4(okAll ? 'ok' : 'fail',
      t('st.gen.ok', { hit, total: patches.length, flip, ftotal: probes.length }) + (okAll ? '' : t('st.gen.fail')));
  }

  const d5 = addRow(t('st.github'));
  const gh = await timedFetch('https://api.github.com/', 6000);
  d5(gh.ok ? 'ok' : 'warn', gh.ok ? t('st.github.ok', { ms: gh.ms }) : t('st.github.fail', { msg: gh.msg }));
}
$('selfTestBtn').addEventListener('click', () => { runSelfTest().catch((e) => showToast(t('toast.selfTestError', { msg: e.message }))); });

/* ============ V11:Aa 字号面板(整页缩放),替代旧密度切换 / V11: Aa font-size panel (whole-page zoom), replaces the old density toggle ============ */
const FONT_DEF = 17, FONT_MIN = 14, FONT_MAX = 24;
let fontPx = parseInt(localStorage.getItem('wrt_font'), 10);
if (!fontPx && localStorage.getItem('wrt_density') === '1') { fontPx = 16; safeSet('wrt_font', '16'); }   // 旧紧凑档用户迁移为 16px / legacy compact-density users migrate to 16px
try { localStorage.removeItem('wrt_density'); } catch (e) { /* 隐私模式可能抛错,忽略 / may throw in private mode; ignore */ }
if (!(fontPx >= FONT_MIN && fontPx <= FONT_MAX)) fontPx = FONT_DEF;
function applyFont(px, save) {
  fontPx = Math.min(FONT_MAX, Math.max(FONT_MIN, Math.round(Number(px)) || FONT_DEF));
  document.body.style.zoom = fontPx === FONT_DEF ? '' : String(fontPx / FONT_DEF);   // 17px = 原始大小 / 17px = original size
  $('fontInput').value = fontPx;
  if (save) safeSet('wrt_font', String(fontPx));
  fitPluginNames();   // 缩放改变有效布局宽度,重测名称适配 / zoom changes the effective layout width; re-fit names
}
function toggleFontPanel(show) {
  const open = show !== undefined ? show : $('fontPanel').hidden;
  if (!open && $('fontPanel').contains(document.activeElement)) $('densityBtn').focus();   // 关闭时焦点还给 Aa / hand focus back to Aa on close
  $('fontPanel').hidden = !open;
  $('densityBtn').setAttribute('aria-expanded', String(open));
  if (open) $('fontDec').focus();
}
$('densityBtn').addEventListener('click', (e) => { e.stopPropagation(); toggleFontPanel(); });
$('fontDec').addEventListener('click', () => applyFont(fontPx - 1, true));
$('fontInc').addEventListener('click', () => applyFont(fontPx + 1, true));
$('fontReset').addEventListener('click', () => applyFont(FONT_DEF, true));
$('fontInput').addEventListener('change', () => applyFont($('fontInput').value, true));
document.addEventListener('click', (e) => {
  if (!$('fontPanel').hidden && !$('fontPanel').contains(e.target)) toggleFontPanel(false);   // 点外部关闭 / close on outside click
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleFontPanel(false); });
applyFont(fontPx, false);

/* ============ 使用说明弹窗:序号徽章 + 引号关键词高亮 / Help modal: numbered badges + quoted-keyword highlights ============ */
$('helpBtn').addEventListener('click', () => {
  openModal(t('help.title'));
  $('modal').querySelector('.modal').classList.add('modal-wide');
  const mb = $('modalBody');
  mb.textContent = '';
  for (const line of t('help.body').split('\n')) {
    const m = line.match(/^([①②③④⑤⑥⑦⑧⑨⑩]|\d+\.)\s*(.*)$/);
    const row = document.createElement('div');
    row.className = 'help-item';
    const num = document.createElement('span');
    num.className = 'help-num';
    num.textContent = m ? m[1].replace('.', '') : '·';
    row.appendChild(num);
    const body = document.createElement('span');
    body.className = 'help-text';
    // 中英引号里的词高亮为主题蓝 / words inside quotes get accent-colored
    const text = m ? m[2] : line;
    let last = 0;
    for (const q of text.matchAll(/"([^"]+)"|'([^']+)'|“([^”]+)”/g)) {
      body.appendChild(document.createTextNode(text.slice(last, q.index)));
      const em = document.createElement('em');
      em.textContent = q[1] || q[2] || q[3];
      body.appendChild(em);
      last = q.index + q[0].length;
    }
    body.appendChild(document.createTextNode(text.slice(last)));
    row.appendChild(body);
    mb.appendChild(row);
  }
});

/* ============ 悬浮坞收起/展开(记忆状态;手机首次默认只留 ⚙) / dock collapse toggle (persisted; first mobile visit starts as gear only) ============ */
const savedDock = localStorage.getItem('wrt_dock');
if (savedDock === '1' || (savedDock === null && matchMedia('(max-width: 560px)').matches)) {
  $('sideDock').classList.add('collapsed');
}
$('dockToggle').setAttribute('aria-expanded', String(!$('sideDock').classList.contains('collapsed')));
$('dockToggle').addEventListener('click', () => {
  const collapsed = $('sideDock').classList.toggle('collapsed');
  $('dockToggle').setAttribute('aria-expanded', String(!collapsed));
  safeSet('wrt_dock', collapsed ? '1' : '0');
});

/* ============ 风险横幅 / Risk banner ============ */
$('riskOk').addEventListener('click', () => { $('riskBar').hidden = true; safeSet('wrt_risk', 'ok'); });

/* ============ 主题三态 / Tri-state theme ============ */
let themeMode = localStorage.getItem('wrt_theme') || 'auto';
const THEME_ICON = { auto: '◐', light: '☀', dark: '☾' };
function applyThemeIcon() {
  $('themeBtn').textContent = THEME_ICON[themeMode];
  $('themeBtn').title = t('theme.' + themeMode);
  $('themeBtn').setAttribute('aria-label', t('theme.' + themeMode));
}
function applyTheme(mode) {
  themeMode = (mode === 'light' || mode === 'dark') ? mode : 'auto';
  if (themeMode === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = themeMode;
  applyThemeIcon();
  if (themeMode === 'auto') { try { localStorage.removeItem('wrt_theme'); } catch (e) { /* 隐私模式下 localStorage 可能抛错,忽略 / localStorage may throw in private mode; ignore */ } }
  else safeSet('wrt_theme', themeMode);
}
$('themeBtn').addEventListener('click', () => {
  applyTheme(themeMode === 'auto' ? 'light' : themeMode === 'light' ? 'dark' : 'auto');
});
applyTheme(themeMode);

init();

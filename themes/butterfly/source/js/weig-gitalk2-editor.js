/* Accessible composer controls for the existing Preact Gitalk 2.x widget.
 * Never move, clone, replace or set the value of an upstream textarea. */
(() => {
  'use strict';
  if (window.__weigGitalk2EditorInitialized) return;
  window.__weigGitalk2EditorInitialized = true;

  const KEY = 'weig-gitalk2-editor-v1';
  const MIN_FONT = 14;
  const MAX_FONT = 22;
  const LIMIT_HEIGHT = [120, 900];
  const defaults = { font: 16, main: 210, reply: 210 };
  const dictionary = {
    'zh-CN': ['主评论', '回复', '缩小字体', '增大字体', '扩大窗口', '恢复窗口', '全屏编辑', '退出全屏', '还原设置', '评论编辑工具'],
    'zh-TW': ['主評論', '回覆', '縮小字體', '增大字體', '擴大視窗', '還原視窗', '全螢幕編輯', '結束全螢幕', '還原設定', '留言編輯工具'],
    en: ['New comment', 'Reply', 'Smaller text', 'Larger text', 'Expand editor', 'Collapse editor', 'Fullscreen editor', 'Exit fullscreen', 'Reset settings', 'Comment editor tools'],
    ja: ['コメント', '返信', '文字を縮小', '文字を拡大', '入力欄を拡大', '元に戻す', '全画面表示', '全画面を終了', '設定をリセット', 'コメント入力ツール'],
    ko: ['새 댓글', '답글', '글자 축소', '글자 확대', '편집창 확대', '편집창 축소', '전체 화면', '전체 화면 닫기', '설정 초기화', '댓글 편집 도구'],
    de: ['Kommentar', 'Antwort', 'Kleinere Schrift', 'Größere Schrift', 'Editor vergrößern', 'Editor verkleinern', 'Vollbild', 'Vollbild verlassen', 'Zurücksetzen', 'Kommentarwerkzeuge'],
    fr: ['Commentaire', 'Réponse', 'Réduire le texte', 'Agrandir le texte', 'Agrandir la zone', 'Réduire la zone', 'Plein écran', 'Quitter le plein écran', 'Réinitialiser', 'Outils de commentaire'],
    es: ['Comentario', 'Respuesta', 'Reducir letra', 'Aumentar letra', 'Ampliar editor', 'Reducir editor', 'Pantalla completa', 'Salir de pantalla completa', 'Restablecer', 'Herramientas de comentario'],
    pt: ['Comentário', 'Resposta', 'Reduzir fonte', 'Aumentar fonte', 'Expandir editor', 'Recolher editor', 'Tela cheia', 'Sair da tela cheia', 'Restaurar', 'Ferramentas de comentários'],
    ru: ['Комментарий', 'Ответ', 'Уменьшить шрифт', 'Увеличить шрифт', 'Развернуть', 'Свернуть', 'На весь экран', 'Закрыть полный экран', 'Сбросить', 'Инструменты комментариев']
  };
  const clamp = (number, minimum, maximum, fallback) => {
    const value = Number(number);
    return Number.isFinite(value) ? Math.min(maximum, Math.max(minimum, Math.round(value))) : fallback;
  };
  const read = () => {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(KEY));
      if (!parsed || typeof parsed !== 'object') return { ...defaults };
      return {
        font: clamp(parsed.font, MIN_FONT, MAX_FONT, defaults.font),
        main: clamp(parsed.main, ...LIMIT_HEIGHT, defaults.main),
        reply: clamp(parsed.reply, ...LIMIT_HEIGHT, defaults.reply)
      };
    } catch (_) { return { ...defaults }; }
  };
  let sizes = read();
  let mode = 'normal';
  let kind = 'main';
  let section = null;
  let host = null;
  let tools = null;
  let observer = null;
  let previousFocus = null;
  let scrollY = 0;

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(sizes)); } catch (_) {}
  }
  function activeTextarea(type) {
    return host?.querySelector(type === 'reply' ? '.gt-reply-box .gt-reply-textarea' : '.gt-header-textarea') || null;
  }
  function locale() {
    const lang = document.documentElement.lang || 'en';
    return dictionary[lang] || dictionary[lang.split('-')[0]] || dictionary.en;
  }
  function applySizes() {
    if (!section) return;
    section.style.setProperty('--weig-editor-font', sizes.font + 'px');
    section.style.setProperty('--weig-editor-main-height', sizes.main + 'px');
    section.style.setProperty('--weig-editor-reply-height', sizes.reply + 'px');
  }
  function updateToolbar() {
    if (!section || !tools) return;
    const editor = activeTextarea(kind);
    tools.hidden = !editor;
    tools.querySelector('[data-weig-value]').textContent = sizes.font + 'px';
    tools.querySelector('[data-weig-context]').textContent = locale()[kind === 'reply' ? 1 : 0];
    const expanded = tools.querySelector('[data-weig-action="expand"]');
    const full = tools.querySelector('[data-weig-action="full"]');
    expanded.textContent = locale()[mode === 'expanded' ? 5 : 4];
    full.textContent = locale()[mode === 'full' ? 7 : 6];
    expanded.setAttribute('aria-pressed', String(mode === 'expanded'));
    full.setAttribute('aria-pressed', String(mode === 'full'));
    expanded.setAttribute('aria-label', expanded.textContent);
    full.setAttribute('aria-label', full.textContent);
    tools.querySelector('[data-weig-action="smaller"]').disabled = sizes.font <= MIN_FONT;
    tools.querySelector('[data-weig-action="larger"]').disabled = sizes.font >= MAX_FONT;
  }
  // Browser top-layer fullscreen prevents Butterfly transforms, sidebar,
  // scroll containers and docked composers from trapping the editor.
  // Never move an existing Preact node or create a second draft editor.
  function changeMode(next) {
    if (!section) return;
    if (next === 'full') {
      if (!section.requestFullscreen) {
        changeMode('expanded');
        return;
      }
      previousFocus = document.activeElement;
      scrollY = window.scrollY;
      const result = section.requestFullscreen();
      if (result && typeof result.catch === 'function') {
        result.catch(() => changeMode('expanded'));
      }
      return;
    }
    if (document.fullscreenElement === section) {
      const result = document.exitFullscreen();
      if (result && typeof result.catch === 'function') result.catch(() => {});
    }
    mode = next;
    section.classList.toggle('weig-editor-expanded', mode === 'expanded');
    section.classList.remove('weig-editor-full', 'weig-editor-native-full');
    document.body.classList.remove('weig-editor-overlay-open');
    updateToolbar();
    if (next === 'normal' && previousFocus?.isConnected) {
      previousFocus.focus({ preventScroll: true });
      previousFocus = null;
    }
  }
  function fullscreenChanged() {
    if (!section) return;
    const active = document.fullscreenElement === section;
    if (active) {
      mode = 'full';
      section.classList.remove('weig-editor-expanded', 'weig-editor-full');
      section.classList.add('weig-editor-native-full');
      document.body.classList.add('weig-editor-overlay-open');
      activeTextarea(kind)?.focus({ preventScroll: true });
    } else if (mode === 'full') {
      mode = 'normal';
      section.classList.remove('weig-editor-full', 'weig-editor-native-full');
      document.body.classList.remove('weig-editor-overlay-open');
      window.scrollTo(0, scrollY);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      previousFocus = null;
    }
    updateToolbar();
  }
  document.addEventListener('fullscreenchange', fullscreenChanged);
  function choose(type) {
    if (kind === type) return;
    // A reply can unmount on cancellation or submission. Never leave a
    // detached editor in fullscreen, nor silently jump between drafts.
    if (mode === 'full') changeMode('normal');
    kind = type;
    section.classList.toggle('weig-editor-target-main', kind === 'main');
    section.classList.toggle('weig-editor-target-reply', kind === 'reply');
    updateToolbar();
  }
  function buildButton(action, content, title) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.weigAction = action;
    button.textContent = content;
    button.title = title;
    button.setAttribute('aria-label', title);
    return button;
  }
  function createTools() {
    const names = locale();
    const bar = document.createElement('div');
    bar.className = 'weig-editor-tools';
    bar.hidden = true;
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', names[9]);
    const context = document.createElement('span');
    context.dataset.weigContext = '';
    context.className = 'weig-editor-context';
    bar.appendChild(context);
    bar.appendChild(buildButton('smaller', 'A−', names[2]));
    const size = document.createElement('output');
    size.dataset.weigValue = '';
    bar.appendChild(size);
    bar.appendChild(buildButton('larger', 'A+', names[3]));
    bar.appendChild(buildButton('expand', names[4], names[4]));
    bar.appendChild(buildButton('full', names[6], names[6]));
    bar.appendChild(buildButton('reset', '↺', names[8]));
    bar.addEventListener('click', event => {
      const button = event.target.closest('[data-weig-action]');
      if (!button || button.disabled) return;
      if (!activeTextarea(kind)) return;
      switch (button.dataset.weigAction) {
        case 'smaller': sizes.font = Math.max(MIN_FONT, sizes.font - 2); save(); applySizes(); break;
        case 'larger': sizes.font = Math.min(MAX_FONT, sizes.font + 2); save(); applySizes(); break;
        case 'expand': changeMode(mode === 'expanded' ? 'normal' : 'expanded'); break;
        case 'full': changeMode(mode === 'full' ? 'normal' : 'full'); break;
        case 'reset':
          changeMode('normal');
          sizes = { ...defaults }; save(); applySizes();
          host.querySelectorAll('.gt-header-textarea, .gt-reply-textarea').forEach(t => { t.style.height = ''; });
          break;
      }
      updateToolbar();
    });
    return bar;
  }
  function sync() {
    if (!host || !host.isConnected || !section || !section.isConnected) {
      unmount();
      return;
    }
    if (kind === 'reply' && !activeTextarea('reply')) choose('main');
    else if (kind === 'main' && !activeTextarea('main') && activeTextarea('reply')) choose('reply');
    updateToolbar();
  }
  function unmount() {
    if (mode === 'full') changeMode('normal');
    if (observer) { observer.disconnect(); observer = null; }
    if (tools) { tools.remove(); tools = null; }
    if (section) section.classList.remove('weig-editor-target-main', 'weig-editor-target-reply', 'weig-editor-expanded', 'weig-editor-full');
    document.body.classList.remove('weig-editor-overlay-open');
    section = null;
    host = null;
    kind = 'main';
    mode = 'normal';
  }
  function boot() {
    const next = document.querySelector('#post-comment');
    const nextHost = next?.querySelector('#gitalk-container');
    if (!next || !nextHost) { if (host) unmount(); return; }
    if (host === nextHost && tools?.isConnected) { sync(); return; }
    unmount();
    section = next;
    host = nextHost;
    tools = createTools();
    const head = section.querySelector('.comment-head');
    if (head) head.insertAdjacentElement('afterend', tools);
    else section.prepend(tools);
    section.classList.add('weig-editor-target-main');
    applySizes();
    observer = new MutationObserver(sync);
    observer.observe(host, { childList: true, subtree: true });
    sync();
  }
  document.addEventListener('focusin', event => {
    if (!host || !host.contains(event.target)) return;
    if (event.target.matches('.gt-reply-textarea')) choose('reply');
    else if (event.target.matches('.gt-header-textarea')) choose('main');
  });
  // Native resize changes the textarea inline height. Persist only on drag
  // completion in normal mode, never on textarea input / preview / fullscreen.
  function recordDrag(event) {
    const t = event.target;
    if (!host || mode !== 'normal' || !host.contains(t) || !t.matches('.gt-header-textarea, .gt-reply-textarea')) return;
    const type = t.matches('.gt-reply-textarea') ? 'reply' : 'main';
    const height = t.getBoundingClientRect().height;
    if (!height || Math.abs(height - sizes[type]) < 3) return;
    sizes[type] = clamp(height, ...LIMIT_HEIGHT, defaults[type]);
    save(); applySizes();
  }
  document.addEventListener('pointerup', recordDrag, true);
  document.addEventListener('touchend', recordDrag, true);
  // Fullscreen toolbar belongs to the top-layer section; no overlay offsets.
  // Capture Escape before Gitalk's reply textarea onEscape handler: browser
  // fullscreen should close without invoking cancelReply (which clears drafts).
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || document.fullscreenElement !== section) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    changeMode('normal');
  }, true);
  document.addEventListener('DOMContentLoaded', boot);
  document.addEventListener('pjax:complete', boot);
  if (document.readyState !== 'loading') boot();
})();

/* WeiG Gitalk 2.x – one global comment integration, no diagnostic/demo pages. */
(() => {
  'use strict';
  if (window.__weigGitalk2Boot) {
    window.__weigGitalk2Boot();
    return;
  }

  function articleTerm() {
    const canonical = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    let path = location.pathname;
    try { if (canonical) path = new URL(canonical.href, location.href).pathname; } catch (_) {}
    path = path.replace(/^\/(?:zh-CN|zh-TW|ja|ko|de|fr|es|pt|ru)\//, '/');
    const match = path.match(/^\/posts\/([^/]+)\/?$/);
    return match ? 'posts/' + match[1] + '/' : path.replace(/^\/+/, '');
  }

  function loadComments() {
    const host = document.getElementById('gitalk-container');
    if (!host || host.dataset.weigGitalk2Ready) return;
    const cfg = window.WEIG_GITALK2_CONFIG;
    if (!cfg || !cfg.clientID || !cfg.proxy || !window.Gitalk) {
      host.textContent = '评论组件暂时不可用，请稍后刷新。';
      return;
    }
    const term = articleTerm();
    const options = {
      clientID: cfg.clientID,
      proxy: cfg.proxy,
      owner: cfg.owner,
      repo: cfg.repo,
      admin: cfg.admin,
      backend: 'discussions',
      id: term,
      language: document.documentElement.lang || 'en',
      perPage: 10,
      sortDirection: 'last',
      createIssueManually: true,
      reactions: true
    };
    // Same thread #10 for all translations of the original OpenWrt guide.
    if (term === 'posts/WeiG-OpenWrt-AutoBuild-Guide/') options.number = 10;
    host.dataset.weigGitalk2Ready = '1';
    try {
      new window.Gitalk(options).render('gitalk-container');
    } catch (err) {
      delete host.dataset.weigGitalk2Ready;
      host.textContent = '评论加载失败，请刷新重试。';
      console.error('[WeiG Gitalk 2.x] initialization failed:', err);
    }
  }

  // Event delegation: Gitalk re-renders comments asynchronously, so never
  // rewrite or clone the existing image nodes or their signed GitHub URLs.
  const viewer = (() => {
    let dialog, stage, large, zoomLabel, previousFocus;
    let scale = 1, panX = 0, panY = 0;
    const pointers = new Map();
    let dragStart = null, pinchStart = null;

    const clamp = value => Math.max(0.5, Math.min(6, value));
    function paint() {
      if (!large) return;
      large.style.transform = 'translate3d(' + panX + 'px,' + panY + 'px,0) scale(' + scale + ')';
      zoomLabel.textContent = Math.round(scale * 100) + '%';
    }
    function zoomTo(next, x, y) {
      const s = clamp(next);
      if (s === scale) return;
      const rect = stage.getBoundingClientRect();
      const cx = x == null ? rect.left + rect.width / 2 : x;
      const cy = y == null ? rect.top + rect.height / 2 : y;
      const ox = cx - rect.left - rect.width / 2;
      const oy = cy - rect.top - rect.height / 2;
      panX = ox - (ox - panX) * s / scale;
      panY = oy - (oy - panY) * s / scale;
      scale = s;
      paint();
    }
    function close() {
      if (!dialog || !dialog.classList.contains('is-open')) return;
      dialog.classList.remove('is-open');
      document.body.classList.remove('weig-gitalk2-zoom-open');
      pointers.clear();
      large.removeAttribute('src');
      if (previousFocus && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    }
    function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
    function ensure() {
      if (dialog) return;
      dialog = document.createElement('div');
      dialog.id = 'weig-gitalk2-lightbox';
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-label', '评论图片预览');
      dialog.innerHTML = '<div class="weig-gt2-toolbar">' +
        '<button type="button" data-action="out" aria-label="缩小">−</button>' +
        '<output aria-live="off">100%</output>' +
        '<button type="button" data-action="in" aria-label="放大">+</button>' +
        '<button type="button" data-action="reset">重置</button>' +
        '<button type="button" data-action="close" aria-label="关闭图片">×</button>' +
        '</div><div class="weig-gt2-stage"><img alt="评论图片大图"></div>';
      document.body.appendChild(dialog);
      stage = dialog.querySelector('.weig-gt2-stage');
      large = stage.querySelector('img');
      zoomLabel = dialog.querySelector('output');
      dialog.addEventListener('click', event => {
        const btn = event.target.closest('[data-action]');
        if (!btn) {
          if (event.target === dialog) close();
          return;
        }
        const action = btn.dataset.action;
        if (action === 'close') close();
        else if (action === 'reset') { scale = 1; panX = 0; panY = 0; paint(); }
        else if (action === 'in') zoomTo(scale * 1.3);
        else if (action === 'out') zoomTo(scale / 1.3);
      });
      stage.addEventListener('wheel', event => {
        event.preventDefault();
        zoomTo(scale * Math.exp(-event.deltaY * 0.0018), event.clientX, event.clientY);
      }, { passive: false });
      stage.addEventListener('pointerdown', event => {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        event.preventDefault();
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        stage.setPointerCapture(event.pointerId);
        if (pointers.size === 1) dragStart = { x: event.clientX, y: event.clientY, panX, panY };
        if (pointers.size === 2) {
          const [a, b] = [...pointers.values()];
          pinchStart = { distance: distance(a, b), scale };
          dragStart = null;
        }
      });
      stage.addEventListener('pointermove', event => {
        if (!pointers.has(event.pointerId)) return;
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pointers.size === 2 && pinchStart && pinchStart.distance > 0) {
          const [a, b] = [...pointers.values()];
          zoomTo(pinchStart.scale * distance(a, b) / pinchStart.distance,
            (a.x + b.x) / 2, (a.y + b.y) / 2);
        } else if (pointers.size === 1 && dragStart) {
          panX = dragStart.panX + event.clientX - dragStart.x;
          panY = dragStart.panY + event.clientY - dragStart.y;
          paint();
        }
      });
      const finishPointer = event => {
        pointers.delete(event.pointerId);
        pinchStart = null;
        dragStart = null;
        if (pointers.size === 1) {
          const remaining = [...pointers.values()][0];
          dragStart = { x: remaining.x, y: remaining.y, panX, panY };
        }
      };
      stage.addEventListener('pointerup', finishPointer);
      stage.addEventListener('pointercancel', finishPointer);
      document.addEventListener('keydown', event => {
        if (!dialog.classList.contains('is-open')) return;
        if (event.key === 'Escape') { event.preventDefault(); close(); }
        else if (event.key === '+' || event.key === '=') zoomTo(scale * 1.3);
        else if (event.key === '-') zoomTo(scale / 1.3);
      });
    }
    function open(img) {
      const url = img.currentSrc || img.src;
      if (!/^https?:\/\//i.test(url)) return;
      ensure();
      previousFocus = img.closest('a') || img;
      large.src = url;
      large.alt = img.alt || '评论图片大图';
      scale = 1; panX = 0; panY = 0; paint();
      dialog.classList.add('is-open');
      document.body.classList.add('weig-gitalk2-zoom-open');
      dialog.querySelector('[data-action="close"]').focus({ preventScroll: true });
    }
    document.addEventListener('click', event => {
      if (event.button !== 0 || event.defaultPrevented) return;
      const img = event.target.closest && event.target.closest('#gitalk-container .gt-comment-body img');
      if (!img) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      open(img);
    }, true);
    return { close };
  })();

  window.__weigGitalk2Boot = loadComments;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComments, { once: true });
  } else {
    loadComments();
  }
  document.addEventListener('pjax:complete', loadComments);
})();

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
    // Gitalk 2.x resolves Discussions by their title, not by the page id alone.
    // The first qB discussion was created on the English page using
    // document.title; keep that exact title for all locales to reuse it.
    // For other guides, the language-neutral path is a stable Discussion title,
    // preserving old giscus discussion terms and preventing per-locale splits.
    const existingEnglishTitles = {
      'posts/WeiG-qB-WebUI-Guide/':
        'WeiG qB WebUI: A Beginner’s Guide to qBittorrent’s Alternative WebUI | Wei.G Share Blog'
    };
    const sharedTitle = existingEnglishTitles[term] || term;
    const options = {
      clientID: cfg.clientID,
      proxy: cfg.proxy,
      owner: cfg.owner,
      repo: cfg.repo,
      admin: cfg.admin,
      backend: 'discussions',
      id: term,
      title: sharedTitle,
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
      setupNestedReplies(host);
    } catch (err) {
      delete host.dataset.weigGitalk2Ready;
      host.textContent = '评论加载失败，请刷新重试。';
      console.error('[WeiG Gitalk 2.x] initialization failed:', err);
    }
  }

  // Gitalk 2.x renders reply actions on top-level comments only. Add a
  // native-looking action to each existing nested reply without rewriting the
  // comment body, touching image nodes or patching Gitalk internals.
  let nestedReplyHost = null;
  let nestedReplyObserver = null;
  let nestedReplyScanPending = false;
  let nestedReplyRequest = 0;

  function githubLogin(author) {
    if (!author) return '';
    const link = author.closest('a[href]') || author.querySelector('a[href]');
    if (link) {
      try {
        const url = new URL(link.href, location.href);
        const match = url.pathname.match(new RegExp('^/([A-Za-z0-9-]{1,39})/?$'));
        if ((url.hostname === 'github.com' || url.hostname === 'www.github.com') && match) {
          return match[1];
        }
      } catch (_) {}
    }
    // Upstream renders a GitHub login in the accessible author label even
    // when the visible name is a human-friendly display name.
    const label = [author.getAttribute('aria-label'), author.getAttribute('title')]
      .filter(Boolean).join(' ');
    const match = label.match(/@([A-Za-z0-9-]{1,39})(?![A-Za-z0-9-])/);
    return match ? match[1] : '';
  }

  function topLevelReplyButton(parent) {
    return parent.querySelector(
      ':scope > .gt-comment-main > .gt-comment-content > .gt-comment-actions > .gt-comment-reply'
    );
  }

  function nativeReplyEditor(parent) {
    return parent.querySelector(
      ':scope > .gt-comment-main > .gt-comment-content > .gt-reply-box .gt-reply-textarea'
    );
  }

  function replyToNestedComment(button) {
    const nested = button.closest('.gt-comment-reply-item');
    const parent = nested?.closest('.gt-comment-replies')?.closest('.gt-comment');
    const parentButton = parent && topLevelReplyButton(parent);
    if (!parentButton) return;

    const login = button.dataset.weigReplyLogin || '';
    const request = ++nestedReplyRequest;

    // Clicking an already-open parent reply button would CLOSE that editor.
    // If it is open, preserve any existing draft instead of toggling it away.
    if (!nativeReplyEditor(parent)) parentButton.click();

    function insertMention(remainingFrames) {
      if (request !== nestedReplyRequest || !parent.isConnected) return;
      const editor = nativeReplyEditor(parent);
      if (!editor) {
        // When signed out, Gitalk's original button handles the OAuth flow.
        // A signed-in editor normally appears on the next Preact render.
        if (remainingFrames > 0) requestAnimationFrame(() => insertMention(remainingFrames - 1));
        return;
      }
      if (!login) { editor.focus({ preventScroll: true }); return; }
      const mention = '@' + login + ' ';
      const current = editor.value;
      if (!current.includes(mention)) {
        const glue = current && !/\s$/.test(current) ? '\n' : '';
        const next = current + glue + mention;
        editor.value = next;
        // MentionTextarea is controlled by Preact. Its onInput callback must
        // update Gitalk's replyDraft; setting DOM value alone is not enough.
        editor.dispatchEvent(new Event('input', { bubbles: true }));
      }
      editor.focus({ preventScroll: true });
      const end = editor.value.length;
      editor.setSelectionRange(end, end);
      editor.scrollIntoView?.({ block: 'nearest' });
    }

    requestAnimationFrame(() => insertMention(8));
  }

  function setupNestedReplies(host) {
    if (nestedReplyHost === host) return;
    nestedReplyObserver?.disconnect();
    nestedReplyHost = host;

    // Gitalk beta builds do not all produce an action bar for nested replies.
    // Detect nesting from the reply list, not from an optional child class,
    // and create the row's action bar ourselves when it is missing.
    function addNestedButtons() {
      if (nestedReplyHost !== host || !host.isConnected) return;
      const nestedRows = host.querySelectorAll('.gt-comment-replies .gt-comment');
      for (const row of nestedRows) {
        const replyList = row.closest('.gt-comment-replies');
        const parent = replyList?.closest('.gt-comment');
        if (!parent || row === parent || row.querySelector('.weig-gitalk2-nested-reply')) continue;

        const parentButton = topLevelReplyButton(parent) ||
          parent.querySelector('.gt-comment-actions .gt-comment-reply:not(.weig-gitalk2-nested-reply)');
        if (!parentButton) continue;

        const content = row.querySelector('.gt-comment-main .gt-comment-content') ||
          row.querySelector('.gt-comment-content');
        if (!content) continue;

        let actions = content.querySelector('.gt-comment-actions');
        if (!actions) {
          actions = document.createElement('div');
          actions.className = 'gt-comment-actions c-acts';
          content.appendChild(actions);
        }

        const author = row.querySelector('.gt-comment-header .gt-comment-username');
        const login = githubLogin(author);
        const label = parentButton.textContent.trim() || '回复';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gt-comment-reply act weig-gitalk2-nested-reply';
        button.textContent = label;
        button.title = login ? label + ' @' + login : label;
        button.setAttribute('aria-label', button.title);
        if (login) button.dataset.weigReplyLogin = login;
        actions.appendChild(button);
      }
    }

    host.addEventListener('click', (event) => {
      const button = event.target.closest?.('.weig-gitalk2-nested-reply');
      if (!button || !host.contains(button)) return;
      event.preventDefault();
      event.stopPropagation();
      replyToNestedComment(button);
    });

    const schedule = () => {
      if (nestedReplyScanPending) return;
      nestedReplyScanPending = true;
      requestAnimationFrame(() => {
        nestedReplyScanPending = false;
        addNestedButtons();
      });
    };
    nestedReplyObserver = new MutationObserver(schedule);
    nestedReplyObserver.observe(host, { childList: true, subtree: true });
    addNestedButtons();
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

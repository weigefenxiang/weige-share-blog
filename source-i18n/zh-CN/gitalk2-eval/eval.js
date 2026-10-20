// WeiG isolated Gitalk 2.x beta read-only evaluation, preview branch only.
(() => {
  'use strict'
  const target = document.getElementById('gitalk-container')
  const status = document.getElementById('load-status')
  const log = []
  const state = { focusReturns: 0, apiReads: 0, imagesAdded: 0, imagesRemoved: 0, initialized: false }
  const since = performance.now()
  const imgPath = node => {
    try { const u = new URL(node.currentSrc || node.src, location.href); return u.hostname + u.pathname }
    catch { return 'unavailable' }
  }
  const logEvent = (kind, fields = {}) => {
    log.push({ atMs: Math.round(performance.now() - since), kind, ...fields })
    if (log.length > 1500) log.shift()
  }
  const countImages = () => target.querySelectorAll('.gt-comment-body img').length
  const renderCounts = () => {
    for (const [id, val] of Object.entries({
      'focus-count': state.focusReturns,
      'api-count': state.apiReads,
      'image-added': state.imagesAdded,
      'image-removed': state.imagesRemoved,
      'image-now': countImages()
    })) document.getElementById(id).textContent = String(val)
  }
  const capture = kind => logEvent(kind, {
    visible: document.visibilityState,
    scrollY: Math.round(scrollY),
    documentHeight: document.documentElement.scrollHeight,
    commentImages: countImages(),
    completedImages: [...target.querySelectorAll('.gt-comment-body img')].filter(x => x.complete && x.naturalWidth > 0).length,
    topLevelComments: target.querySelectorAll('.gt-comments > .gt-comment').length,
    replies: target.querySelectorAll('.gt-comment-reply-item').length
  })
  function imagesWithin(element) {
    if (!element || element.nodeType !== 1) return []
    const out = []
    if (element.matches?.('.gt-comment-body img')) out.push(element)
    element.querySelectorAll?.('.gt-comment-body img').forEach(n => out.push(n))
    // For detached subtrees, match their former .gt-comment-body ancestor.
    if (element.matches?.('.gt-comment-body') || element.closest?.('.gt-comment-body')) {
      if (element.tagName === 'IMG') out.push(element)
      element.querySelectorAll?.('img').forEach(n => { if (!out.includes(n)) out.push(n) })
    }
    return out
  }
  const observer = new MutationObserver(records => {
    let add = [], del = []
    for (const r of records) {
      r.addedNodes.forEach(n => { add.push(...imagesWithin(n)) })
      r.removedNodes.forEach(n => { del.push(...imagesWithin(n)) })
    }
    if (!add.length && !del.length) return
    state.imagesAdded += add.length
    state.imagesRemoved += del.length
    logEvent('image-dom-change', {
      added: add.length,
      removed: del.length,
      addedPaths: add.map(imgPath).slice(0,12),
      removedPaths: del.map(imgPath).slice(0,12)
    })
    renderCounts()
  })
  observer.observe(target, { subtree: true, childList: true })
  const originalFetch = window.fetch.bind(window)
  window.fetch = function(input, init) {
    const method = String(init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase()
    let host = ''
    try { host = new URL(input instanceof Request ? input.url : String(input), location.href).hostname } catch {}
    // This test must never post/edit/delete comments or request tokens.
    if (method !== 'GET' && method !== 'HEAD') {
      logEvent('blocked-non-read-request', { method, host })
      return Promise.reject(new Error('WeiG read-only evaluation blocked non-GET request'))
    }
    const isGitHub = host === 'api.github.com'
    if (isGitHub) {
      state.apiReads++
      logEvent('api-get', { host })
      renderCounts()
    }
    const started = performance.now()
    return originalFetch(input, init).then(response => {
      if (isGitHub) logEvent('api-response', { status: response.status, elapsedMs: Math.round(performance.now() - started) })
      return response
    })
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      state.focusReturns++
      capture('tab-return')
    } else capture('tab-hidden')
    renderCounts()
  })
  document.getElementById('export-log').addEventListener('click', () => {
    capture('export')
    const report = { tool: 'WeiG Gitalk2 read-only comparison', version: '1.0', branch: 'dev-gitalk2-eval',
      discussion: 'weigefenxiang/weige-share-blog#10', url: location.href,
      statistics: {...state}, events: log }
    const url = URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}))
    const a = document.createElement('a')
    a.href=url;a.download='weig-gitalk2-eval-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json'
    a.click()
    setTimeout(()=>URL.revokeObjectURL(url),1000)
  })
  document.getElementById('reset-log').addEventListener('click', () => {
    log.length=0
    state.focusReturns=0;state.apiReads=0;state.imagesAdded=0;state.imagesRemoved=0
    capture('reset');renderCounts()
  })
  const setStatus = (message, kind) => {status.textContent=message;status.dataset.status=kind;logEvent('status',{message,kind})}
  if (window.__gitalkBundleFailed || typeof window.Gitalk !== 'function') {
    setStatus('Gitalk 2.x CDN 未成功加载；不要将该实验判为通过。请导出日志反馈。','fail')
    renderCounts()
    return
  }
  try {
    const instance = new window.Gitalk({
      clientID: '',
      owner: 'weigefenxiang',
      repo: 'weige-share-blog',
      admin: [],
      backend: 'discussions',
      number: 10,
      language: 'zh-CN',
      perPage: 10,
      sortDirection: 'last',
      reactions: false,
      createIssueManually: true
    })
    instance.render('gitalk-container')
    state.initialized=true
    setStatus('Gitalk 2.x 已初始化（只读）。请确认评论、回复和 7 张图片实际显示。','ok')
    capture('render-start')
    renderCounts()
    setTimeout(() => {
      const seen=target.querySelectorAll('.gt-comment-body').length
      if (!seen) setStatus('Gitalk 已初始化，但未读取到评论正文；可能是 CDN、匿名 API、网络权限或后端兼容问题。请导出日志。','fail')
      else { setStatus('已看到 '+seen+' 个评论正文容器。仍需确认 7 张图片、回复与切回测试。','ok');capture('render-ready') }
      renderCounts()
    },12000)
  } catch(e) {setStatus('Gitalk 2.x 初始化失败：'+e.message,'fail')}
  renderCounts()
})()

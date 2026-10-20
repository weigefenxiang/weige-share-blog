/* Isolated article-level Gitalk 2.x evaluation. Never included in production. */
(() => {
  'use strict'
  const root = document.getElementById('wg-gitalk2-eval')
  if (!root) return
  const el = id => root.querySelector('#' + id)
  const container = el('gitalk-container')
  const indicator = el('wg-gt-status')
  const start = performance.now()
  const records = []
  const totals = { returns: 0, added: 0, removed: 0 }
  const counts = () => ({
    parents: container.querySelectorAll('.gt-comments > .gt-comment').length,
    replies: container.querySelectorAll('.gt-comment-reply-item').length,
    pictures: container.querySelectorAll('.gt-comment-body img').length,
    loadedPictures: [...container.querySelectorAll('.gt-comment-body img')].filter(n => n.complete && n.naturalWidth > 0).length
  })
  const add = (kind, extra = {}) => {
    records.push({ ms: Math.round(performance.now() - start), kind, ...extra })
    if (records.length > 1500) records.shift()
  }
  const update = () => {
    const c = counts()
    el('wg-gt-focus').textContent = String(totals.returns)
    el('wg-gt-top').textContent = String(c.parents)
    el('wg-gt-replies').textContent = String(c.replies)
    el('wg-gt-images').textContent = String(c.pictures) + ' / ' + String(c.loadedPictures) + ' 已加载'
    el('wg-gt-rebuild').textContent = String(totals.removed)
  }
  const status = (message, kind) => { indicator.textContent = message; indicator.dataset.status = kind; add('status', { status: kind }) }
  const imagePaths = nodes => nodes.map(n => {
    try { const u = new URL(n.currentSrc || n.src, location.href); return u.hostname + u.pathname }
    catch { return 'unknown' }
  }).slice(0, 9)
  const findImages = node => {
    if (node.nodeType !== 1) return []
    let found = []
    if (node.matches?.('.gt-comment-body img') || (node.tagName === 'IMG' && node.closest?.('.gt-comment-body'))) found.push(node)
    if (node.matches?.('.gt-comment-body')) node.querySelectorAll('img').forEach(n => { if (!found.includes(n)) found.push(n) })
    else node.querySelectorAll?.('.gt-comment-body img').forEach(n => { if (!found.includes(n)) found.push(n) })
    return found
  }
  new MutationObserver(mutations => {
    let added = [], removed = []
    for (const change of mutations) {
      change.addedNodes.forEach(node => { added.push(...findImages(node)) })
      change.removedNodes.forEach(node => { removed.push(...findImages(node)) })
    }
    if (!added.length && !removed.length) return
    totals.added += added.length
    totals.removed += removed.length
    add('image-dom', { added: added.length, removed: removed.length, addedPaths: imagePaths(added), removedPaths: imagePaths(removed), ...counts() })
    update()
  }).observe(container, { childList: true, subtree: true })
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return
    totals.returns += 1
    add('tab-return', { ...counts(), scrollY: Math.round(scrollY), totalHeight: document.documentElement.scrollHeight })
    update()
  })
  el('wg-gt-export').addEventListener('click', () => {
    add('export', { ...counts(), ...totals })
    const result = { tool: 'WeiG Gitalk2 article preview', branch: 'dev-gitalk2-eval', discussion: 10,
      path: location.pathname, totals, final: counts(), events: records }
    const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url; a.download = 'weige-gitalk2-article-eval.json'; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  })
  el('wg-gt-reset').addEventListener('click', () => {
    records.length = 0; totals.returns = 0; totals.added = 0; totals.removed = 0
    add('reset', counts()); update()
  })
  // Only public parameters are injected at build time. App secret, private key
  // and session encryption key MUST stay in the Gitalk Cloudflare Worker.
  const publicConfig = window.__WEIG_GITALK_PUBLIC_CONFIG__ || {}
  const authReady = publicConfig.enabled === true &&
    typeof publicConfig.clientID === 'string' &&
    /^Iv[a-z0-9_-]{4,128}$/i.test(publicConfig.clientID) &&
    typeof publicConfig.proxy === 'string' &&
    /^https:\/\/[^/]+\/?$/.test(publicConfig.proxy)
  const authState = el('wg-gt-auth-state')
  if (authReady) {
    authState.textContent = ''
    authState.hidden = true
    add('auth-configured', { enabled: true })
  } else {
    authState.textContent = '当前为评论预览：GitHub 登录尚待管理员部署并授权 GitHub App，暂不能发评论。历史评论与图片正常可读。'
    authState.hidden = false
    add('auth-configured', { enabled: false })
  }
  if (window.__wgGitalkArticleBundleFailed || typeof window.Gitalk !== 'function') {
    status('无法加载 Gitalk 2.x beta 组件。请勿将页面无闪烁视为测试成功。', 'fail')
    authState.hidden = false
    authState.textContent = '评论组件加载失败，请刷新重试或反馈。'
    update(); return
  }
  try {
    new window.Gitalk({
      clientID: authReady ? publicConfig.clientID : '',
      proxy: authReady ? publicConfig.proxy : undefined,
      owner: 'weigefenxiang',
      repo: 'weige-share-blog',
      admin: authReady ? ['weigefenxiang'] : [],
      number: 10,
      backend: 'discussions',
      language: 'zh-CN',
      perPage: 10,
      sortDirection: 'last',
      createIssueManually: true,
      reactions: authReady
    }).render('gitalk-container')
    status('Gitalk 已初始化，正在等待完整评论和图片……', 'pending')
    add('widget-initialized', { authReady })
  } catch(error) {
    status('初始化失败：' + error.message, 'fail')
    authState.hidden = false
    authState.textContent = '评论区初始化失败，请展开开发诊断检查。'
    update(); return
  }
  update()
  setTimeout(() => {
    const c = counts()
    if (c.parents >= 1 && c.replies >= 5 && c.loadedPictures >= 7) {
      status('评论、回复及 7 张图片加载完成。可以开始切标签页测试。', 'ready')
      add('ready', c)
    } else {
      status('未验证完整内容：目前有 ' + c.parents + ' 条顶层评论、' + c.replies + ' 条回复、' + c.loadedPictures + ' 张已加载图片。请先核对再测试。', 'fail')
      add('incomplete', c)
    }
    update()
  }, 15000)
})()

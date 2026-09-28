(() => {
  'use strict'

  const cookieName = 'wg_lang_v5'

  const languages = [
    ['en', 'English'],
    ['zh-CN', '简中'],
    ['zh-TW', '繁中'],
    ['ja', '日本語'],
    ['ko', '한국어'],
    ['de', 'Deutsch'],
    ['fr', 'Français'],
    ['es', 'Español'],
    ['pt', 'Português'],
    ['ru', 'Русский']
  ]

  const titles = {
    en: 'Language',
    'zh-CN': '语言',
    'zh-TW': '語言',
    ja: '言語',
    ko: '언어',
    de: 'Sprache',
    fr: 'Langue',
    es: 'Idioma',
    pt: 'Idioma',
    ru: 'Язык'
  }

  const autoLabels = {
    en: 'Auto (Browser)',
    'zh-CN': '自动（跟随浏览器）',
    'zh-TW': '自動（跟隨瀏覽器）',
    ja: '自動（ブラウザー）',
    ko: '자동 (브라우저)',
    de: 'Automatisch (Browser)',
    fr: 'Auto (navigateur)',
    es: 'Automático (navegador)',
    pt: 'Automático (navegador)',
    ru: 'Авто (браузер)'
  }

  const prefixes = {
    'zh-CN': '/zh-CN/',
    'zh-TW': '/zh-TW/',
    ja: '/ja/',
    ko: '/ko/',
    de: '/de/',
    fr: '/fr/',
    es: '/es/',
    pt: '/pt/',
    ru: '/ru/'
  }

  function languageFromPath () {
    const pathname = location.pathname || '/'

    for (const [code, prefix] of Object.entries(prefixes)) {
      const bare = prefix.slice(0, -1)
      if (pathname === bare || pathname.startsWith(prefix)) return code
    }

    return 'en'
  }

  function readCookie (name) {
    for (const item of document.cookie.split(';')) {
      const [key, ...value] = item.trim().split('=')
      if (key === name) return decodeURIComponent(value.join('='))
    }
    return ''
  }

  function preference () {
    const saved = readCookie(cookieName)
    return languages.some(([code]) => code === saved) ? saved : 'auto'
  }

  function currentLanguage () {
    return languageFromPath()
  }

  function closeMenu () {
    const menu = document.getElementById('wg-language-menu')
    const button = document.getElementById('wg-language-switcher')
    if (menu) menu.classList.remove('show')
    if (button) button.setAttribute('aria-expanded', 'false')
  }

  function positionMenu () {
    const menu = document.getElementById('wg-language-menu')
    const button = document.getElementById('wg-language-switcher')
    if (!menu || !button || !menu.classList.contains('show')) return

    const buttonRect = button.getBoundingClientRect()
    const menuRect = menu.getBoundingClientRect()

    let top = buttonRect.top + (buttonRect.height - menuRect.height) / 2
    top = Math.max(12, Math.min(top, window.innerHeight - menuRect.height - 12))

    const left = Math.max(12, buttonRect.left - menuRect.width - 10)

    menu.style.top = Math.round(top) + 'px'
    menu.style.left = Math.round(left) + 'px'
  }

  function toggleMenu () {
    const menu = document.getElementById('wg-language-menu')
    const button = document.getElementById('wg-language-switcher')
    if (!menu || !button) return

    const show = !menu.classList.contains('show')
    menu.classList.toggle('show', show)
    button.setAttribute('aria-expanded', show ? 'true' : 'false')

    if (show) requestAnimationFrame(positionMenu)
  }

  function addItem (menu, code, label, active, extraClass) {
    const link = document.createElement('a')
    link.href = '/lang/' + code + '?from=' + encodeURIComponent(location.pathname)
    link.textContent = label
    link.dataset.locale = code
    link.setAttribute('role', 'menuitem')

    if (extraClass) link.classList.add(extraClass)

    if (code === active) {
      link.classList.add('active')
      link.setAttribute('aria-current', 'true')
    }

    menu.appendChild(link)
  }

  function buildMenu () {
    const old = document.getElementById('wg-language-menu')
    if (old) old.remove()

    const pageLanguage = currentLanguage()
    const selected = preference()

    const menu = document.createElement('div')
    menu.id = 'wg-language-menu'
    menu.setAttribute('role', 'menu')
    menu.setAttribute('aria-label', titles[pageLanguage] || 'Language')

    addItem(menu, 'auto', autoLabels[pageLanguage] || autoLabels.en, selected, 'wg-language-auto')

    for (const [code, label] of languages) {
      addItem(menu, code, label, selected)
    }

    document.body.appendChild(menu)
    return menu
  }

  function mount () {
    const rightside = document.getElementById('rightside-config-show')
    if (!rightside) return

    const oldButton = document.getElementById('wg-language-switcher')
    if (oldButton) oldButton.remove()

    buildMenu()

    const pageLanguage = currentLanguage()
    const button = document.createElement('button')
    button.id = 'wg-language-switcher'
    button.type = 'button'
    button.title = titles[pageLanguage] || 'Language'
    button.setAttribute('aria-label', button.title)
    button.setAttribute('aria-haspopup', 'menu')
    button.setAttribute('aria-expanded', 'false')
    button.innerHTML = '<i class="fas fa-language" aria-hidden="true"></i>'
    button.addEventListener('click', event => {
      event.stopPropagation()
      toggleMenu()
    })

    const goUp = document.getElementById('go-up')
    if (goUp && goUp.parentElement === rightside) rightside.insertBefore(button, goUp)
    else rightside.appendChild(button)
  }

  document.addEventListener('click', event => {
    const menu = document.getElementById('wg-language-menu')
    const button = document.getElementById('wg-language-switcher')
    if (!menu || !button) return
    if (!menu.contains(event.target) && !button.contains(event.target)) closeMenu()
  })

  window.addEventListener('resize', closeMenu, { passive: true })
  window.addEventListener('scroll', closeMenu, { passive: true })

  document.addEventListener('pjax:complete', () => {
    closeMenu()
    mount()
  })

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true })
  } else {
    mount()
  }
})()

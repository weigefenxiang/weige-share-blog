const supported = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru']

const prefix = {
  en: '/',
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

function readCookie (request, name) {
  const raw = request.headers.get('Cookie') || ''
  for (const item of raw.split(';')) {
    const [key, ...value] = item.trim().split('=')
    if (key === name) return decodeURIComponent(value.join('='))
  }
  return ''
}

function normalizeLanguage (tag) {
  const value = String(tag || '').trim().toLowerCase()

  if (value === 'zh-hant' || value.startsWith('zh-hant-') ||
      value === 'zh-tw' || value.startsWith('zh-tw-') ||
      value === 'zh-hk' || value.startsWith('zh-hk-') ||
      value === 'zh-mo' || value.startsWith('zh-mo-')) return 'zh-TW'

  if (value === 'zh-hans' || value.startsWith('zh-hans-') ||
      value === 'zh-cn' || value.startsWith('zh-cn-') ||
      value === 'zh-sg' || value.startsWith('zh-sg-') ||
      value === 'zh' || value.startsWith('zh-')) return 'zh-CN'

  for (const locale of ['ja', 'ko', 'de', 'fr', 'es', 'pt', 'ru', 'en']) {
    if (value === locale || value.startsWith(locale + '-')) return locale
  }

  return ''
}

function detectLanguage (header) {
  const ranked = String(header || '')
    .split(',')
    .map((part, index) => {
      const bits = part.trim().split(';')
      const tag = bits.shift() || ''
      let q = 1

      for (const bit of bits) {
        const match = bit.trim().match(/^q=([0-9.]+)$/i)
        if (match) q = Number(match[1])
      }

      return { tag, q: Number.isFinite(q) ? q : 0, index }
    })
    .filter(item => item.tag && item.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)

  for (const item of ranked) {
    const locale = normalizeLanguage(item.tag)
    if (locale) return locale
  }

  return 'en'
}

function isLocalizedPath (pathname) {
  return supported.some(locale => {
    if (locale === 'en') return false
    const base = prefix[locale]
    return pathname === base.slice(0, -1) || pathname.startsWith(base)
  })
}

function isTranslatablePath (pathname) {
  if (pathname === '/' ||
      pathname === '/about/' ||
      pathname === '/archives/' ||
      pathname === '/categories/' ||
      pathname === '/tags/') return true

  return /^\/posts\/[^/]+\/?$/.test(pathname)
}

function localizedPath (locale, pathname) {
  if (locale === 'en') return pathname
  return prefix[locale] + pathname.replace(/^\//, '')
}

export async function onRequest (context) {
  const { request } = context

  if (!['GET', 'HEAD'].includes(request.method)) return context.next()

  const url = new URL(request.url)
  const pathname = url.pathname

  if (isLocalizedPath(pathname) || !isTranslatablePath(pathname)) {
    return context.next()
  }

  const saved = readCookie(request, 'wg_lang_v5')
  const locale = supported.includes(saved)
    ? saved
    : detectLanguage(request.headers.get('Accept-Language'))

  if (locale === 'en') return context.next()

  url.pathname = localizedPath(locale, pathname)

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      'Cache-Control': 'private, no-store',
      Vary: 'Accept-Language, Cookie'
    }
  })
}

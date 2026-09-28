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

function stripLocalePrefix (pathname) {
  for (const locale of supported) {
    if (locale === 'en') continue

    const base = prefix[locale]
    const bare = base.slice(0, -1)

    if (pathname === bare || pathname === base) return '/'
    if (pathname.startsWith(base)) {
      return '/' + pathname.slice(base.length)
    }
  }

  return pathname || '/'
}

function normalizePage (pathname, locale) {
  const path = stripLocalePrefix(pathname)

  if (path === '/' ||
      path === '/about/' ||
      path === '/archives/' ||
      path === '/categories/' ||
      path === '/tags/') return path

  if (/^\/posts\/[^/]+\/?$/.test(path)) {
    if (path === '/posts/Hello-Butterfly/' && locale !== 'zh-CN') return '/'
    return path.endsWith('/') ? path : path + '/'
  }

  return '/'
}

function requestedPage (request, url, locale) {
  const from = url.searchParams.get('from')
  if (from && from.startsWith('/')) {
    return normalizePage(from, locale)
  }

  const referer = request.headers.get('Referer')
  if (!referer) return '/'

  try {
    const ref = new URL(referer)
    if (ref.origin !== url.origin) return '/'
    return normalizePage(ref.pathname, locale)
  } catch {}

  return '/'
}

function targetPath (locale, page) {
  if (locale === 'en') return page
  return prefix[locale] + page.replace(/^\//, '')
}

export async function onRequest (context) {
  const { request, params } = context
  const requestedLocale = String(params.locale || '')
  const isAuto = requestedLocale === 'auto'

  if (!isAuto && !supported.includes(requestedLocale)) {
    return new Response('Unsupported language', { status: 404 })
  }

  const locale = isAuto
    ? detectLanguage(request.headers.get('Accept-Language'))
    : requestedLocale

  const url = new URL(request.url)
  const page = requestedPage(request, url, locale)

  url.pathname = targetPath(locale, page)
  url.search = ''
  url.hash = ''

  const cookie = isAuto
    ? 'wg_lang_v5=; Path=/; Max-Age=0; SameSite=Lax; Secure'
    : 'wg_lang_v5=' + encodeURIComponent(locale) + '; Path=/; Max-Age=31536000; SameSite=Lax; Secure'

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      'Set-Cookie': cookie,
      'Cache-Control': 'private, no-store',
      Vary: 'Accept-Language'
    }
  })
}

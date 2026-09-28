'use strict'

const locales = [
  ['en', '/'],
  ['zh-CN', '/zh-CN/'],
  ['zh-TW', '/zh-TW/'],
  ['ja', '/ja/'],
  ['ko', '/ko/'],
  ['de', '/de/'],
  ['fr', '/fr/'],
  ['es', '/es/'],
  ['pt', '/pt/'],
  ['ru', '/ru/']
]

function routeFromPath (path, root) {
  if (!path || !path.endsWith('.html')) return null
  let route = '/' + path.replace(/^\/+/, '')
  if (route.endsWith('index.html')) route = route.slice(0, -10)
  else route = route.slice(0, -5)
  if (!route.endsWith('/')) route += '/'
  if (root && root !== '/' && route.startsWith(root)) {
    route = '/' + route.slice(root.length).replace(/^\/+/, '')
  }
  return route
}

function hasLocalizedEquivalent (route) {
  return route === '/' ||
    route === '/about/' ||
    route === '/archives/' ||
    (route.startsWith('/posts/') && route !== '/posts/Hello-Butterfly/')
}

hexo.extend.filter.register('after_render:html', function (html, data) {
  const route = routeFromPath(data.path, hexo.config.root)
  if (!route || !html.includes('</head>')) return html

  const base = String(hexo.config.url || '').replace(/\/$/, '')

  if (route === '/posts/Hello-Butterfly/') {
    return html.replace(
      '</head>',
      `<link rel="alternate" hreflang="zh-CN" href="${base}/zh-CN/posts/Hello-Butterfly/">\n</head>`
    )
  }

  if (!hasLocalizedEquivalent(route)) return html

  const links = []
  for (const [lang, prefix] of locales) {
    const href = prefix === '/' ? base + route : base + prefix.slice(0, -1) + route
    links.push(`<link rel="alternate" hreflang="${lang}" href="${href}">`)
  }
  links.push(`<link rel="alternate" hreflang="x-default" href="${base}${route}">`)

  return html.replace('</head>', links.join('\n') + '\n</head>')
})

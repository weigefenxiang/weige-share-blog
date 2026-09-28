'use strict'

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const yaml = require('js-yaml')

const root = path.resolve(__dirname, '..')
const publicDir = path.join(root, 'public')
const dbPath = path.join(root, 'db.json')
const multiConfigPath = path.join(root, '_multiconfig.yml')
const tempConfigPath = path.join(root, '.multilang-build.yml')
const hexoBin = path.join(root, 'node_modules', 'hexo', 'bin', 'hexo')

const builds = [
  { code: 'en', name: 'English', config: '_config.en.yml', output: 'public' },
  { code: 'zh-CN', name: '简中', config: '_config.zh-CN.yml', output: 'public/zh-CN' },
  { code: 'zh-TW', name: '繁中', config: '_config.zh-TW.yml', output: 'public/zh-TW' },
  { code: 'ja', name: '日本語', config: '_config.ja.yml', output: 'public/ja' },
  { code: 'ko', name: '한국어', config: '_config.ko.yml', output: 'public/ko' },
  { code: 'de', name: 'Deutsch', config: '_config.de.yml', output: 'public/de' },
  { code: 'fr', name: 'Français', config: '_config.fr.yml', output: 'public/fr' },
  { code: 'es', name: 'Español', config: '_config.es.yml', output: 'public/es' },
  { code: 'pt', name: 'Português', config: '_config.pt.yml', output: 'public/pt' },
  { code: 'ru', name: 'Русский', config: '_config.ru.yml', output: 'public/ru' }
]

const requiredPosts = [
  'PicList-Cloudflare-R2-Guide',
  'StandardSolution-Review-Soft',
  'WeiG-OpenWrt-AutoBuild-Guide',
  'WeiG-qB-WebUI-Guide'
]

function isObject (value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function mergeConfig (target, source) {
  const output = isObject(target) ? { ...target } : {}

  for (const [key, value] of Object.entries(source || {})) {
    if (Array.isArray(value)) {
      output[key] = value.slice()
    } else if (isObject(value)) {
      output[key] = mergeConfig(isObject(output[key]) ? output[key] : {}, value)
    } else {
      output[key] = value
    }
  }

  return output
}

function readYaml (file) {
  return yaml.load(fs.readFileSync(path.join(root, file), 'utf8')) || {}
}

function cleanHexoState () {
  fs.rmSync(dbPath, { force: true })
  fs.rmSync(multiConfigPath, { force: true })
  fs.rmSync(tempConfigPath, { force: true })
}

function assertFile (file, message) {
  if (!fs.existsSync(file)) throw new Error(message + ': ' + file)
}

function frontMatter (file) {
  const text = fs.readFileSync(file, 'utf8')
  const match = text.match(/^---\s*\n([\s\S]*?)\n---(?:\s*\n|$)/)
  if (!match) throw new Error('Missing front matter: ' + file)
  return yaml.load(match[1]) || {}
}

function sourcePostFile (mergedConfig, slug) {
  return path.join(root, mergedConfig.source_dir, '_posts', slug + '.md')
}

function validateSourceFrontMatter (build, mergedConfig) {
  const postDir = path.join(root, mergedConfig.source_dir, '_posts')
  assertFile(postDir, 'Missing post directory for ' + build.name)

  const postFiles = fs.readdirSync(postDir)
    .filter(name => name.toLowerCase().endsWith('.md'))
    .sort()

  for (const name of postFiles) {
    const file = path.join(postDir, name)
    try {
      frontMatter(file)
    } catch (error) {
      throw new Error(
        'Invalid front matter for ' + build.name + ': ' + file + '\n' + error.message
      )
    }
  }

  const aboutFile = path.join(root, mergedConfig.source_dir, 'about', 'index.md')
  assertFile(aboutFile, 'Missing About source for ' + build.name)

  try {
    frontMatter(aboutFile)
  } catch (error) {
    throw new Error(
      'Invalid About front matter for ' + build.name + ': ' + aboutFile + '\n' + error.message
    )
  }
}

function buildMetadata (build, mergedConfig, localeConfig) {
  const menu = localeConfig.theme_config && localeConfig.theme_config.menu
  const menuEntries = menu ? Object.entries(menu) : []
  if (menuEntries.length < 6) {
    throw new Error('Locale ' + build.code + ' must define the full Butterfly navigation menu')
  }

  const homeLabel = menuEntries[0][0]
  const homeSpec = menuEntries[0][1]
  const homeHref = String(homeSpec).split('||')[0].trim()
  const titles = {}

  for (const slug of requiredPosts) {
    const file = sourcePostFile(mergedConfig, slug)
    assertFile(file, 'Missing source post for ' + build.name)
    titles[slug] = String(frontMatter(file).title || '')
    if (!titles[slug]) throw new Error('Missing source title for ' + build.name + ': ' + slug)
  }

  const aboutFile = path.join(root, mergedConfig.source_dir, 'about', 'index.md')
  assertFile(aboutFile, 'Missing About source for ' + build.name)
  const aboutTitle = String(frontMatter(aboutFile).title || '')

  return {
    homeLabel,
    homeHref,
    titles,
    aboutTitle,
    sourceDir: mergedConfig.source_dir,
    publicDir: mergedConfig.public_dir,
    rootPath: mergedConfig.root,
    language: mergedConfig.language
  }
}

function writeBuildConfig (build) {
  const baseConfig = readYaml('_config.yml')
  const localeConfig = readYaml(build.config)
  const mergedConfig = mergeConfig(baseConfig, localeConfig)

  for (const key of ['language', 'root', 'source_dir', 'public_dir']) {
    if (!mergedConfig[key]) throw new Error('Missing ' + key + ' in ' + build.config)
  }

  if (!localeConfig.theme_config || !localeConfig.theme_config.menu) {
    throw new Error('Missing theme_config.menu in ' + build.config)
  }

  fs.writeFileSync(
    tempConfigPath,
    yaml.dump(mergedConfig, { noRefs: true, lineWidth: -1 }),
    'utf8'
  )

  return {
    mergedConfig,
    localeConfig,
    meta: buildMetadata(build, mergedConfig, localeConfig)
  }
}

function htmlLanguageMatches (html, language) {
  return html.includes('lang="' + language + '"') || html.includes("lang='" + language + "'")
}

function validateMenu (html, build, meta) {
  const start = html.indexOf('id="menus"')
  const end = start >= 0 ? html.indexOf('</nav>', start) : -1
  if (start < 0 || end < 0) throw new Error('Missing #menus in ' + build.name + ' home page')

  const menuHtml = html.slice(start, end)
  if (!menuHtml.includes(meta.homeLabel)) {
    throw new Error('Missing localized navigation label in ' + build.name + ': ' + meta.homeLabel)
  }
  const renderedHomeHref = meta.rootPath === '/'
    ? meta.homeHref
    : (meta.rootPath + meta.homeHref).replace(/\/{2,}/g, '/')

  if (!menuHtml.includes('href="' + renderedHomeHref + '"')) {
    throw new Error('Missing localized home href in ' + build.name + ': ' + renderedHomeHref)
  }
  if (menuHtml.includes('fa-language')) {
    throw new Error('Language menu must not be in the top navigation for ' + build.name)
  }
}

function validateBuild (build, meta, englishTitles) {
  const output = path.join(root, build.output)
  const home = path.join(output, 'index.html')
  const about = path.join(output, 'about', 'index.html')

  assertFile(home, 'Missing ' + build.name + ' home page')
  assertFile(about, 'Missing ' + build.name + ' About page')

  const homeHtml = fs.readFileSync(home, 'utf8')
  if (!homeHtml.includes('Wei.G Share Blog')) {
    throw new Error('Wrong site title in ' + build.name + ' home page')
  }
  if (!htmlLanguageMatches(homeHtml, meta.language)) {
    throw new Error('Wrong html lang in ' + build.name + '; expected ' + meta.language)
  }

  validateMenu(homeHtml, build, meta)

  if (!homeHtml.includes('/css/language-switcher.css') ||
      !homeHtml.includes('/js/language-switcher.js')) {
    throw new Error('Missing Butterfly inject assets in ' + build.name)
  }

  const switcherJs = fs.readFileSync(path.join(publicDir, 'js', 'language-switcher.js'), 'utf8')
  if (!switcherJs.includes('wg_lang_v5') || !switcherJs.includes('/lang/')) {
    throw new Error('Language switcher asset is stale or incomplete')
  }

  for (const slug of requiredPosts) {
    const article = path.join(output, 'posts', slug, 'index.html')
    assertFile(article, 'Missing ' + build.name + ' post ' + slug)

    const articleHtml = fs.readFileSync(article, 'utf8')
    const localizedTitle = meta.titles[slug]

    if (!homeHtml.includes(localizedTitle)) {
      throw new Error('Home page is not using ' + build.name + ' title for ' + slug + ': ' + localizedTitle)
    }
    if (!articleHtml.includes(localizedTitle)) {
      throw new Error('Article page is not using ' + build.name + ' title for ' + slug + ': ' + localizedTitle)
    }
    if (!htmlLanguageMatches(articleHtml, meta.language)) {
      throw new Error('Wrong article html lang in ' + build.name + ': ' + slug)
    }

    if (build.code !== 'en' && englishTitles[slug] &&
        localizedTitle !== englishTitles[slug] &&
        (homeHtml.includes(englishTitles[slug]) || articleHtml.includes(englishTitles[slug]))) {
      throw new Error('English title leaked into ' + build.name + ': ' + englishTitles[slug])
    }
  }

  const aboutHtml = fs.readFileSync(about, 'utf8')
  if (meta.aboutTitle && !aboutHtml.includes(meta.aboutTitle)) {
    throw new Error('About page is not localized for ' + build.name + ': ' + meta.aboutTitle)
  }

  const hello = path.join(output, 'posts', 'Hello-Butterfly', 'index.html')
  if (build.code === 'zh-CN') {
    assertFile(hello, 'Hello-Butterfly must exist in 简中')
  } else if (fs.existsSync(hello)) {
    throw new Error('Hello-Butterfly must not exist in ' + build.name)
  }

  const sample = path.join(output, 'posts', 'hello-world', 'index.html')
  if (fs.existsSync(sample)) {
    throw new Error('hello-world must not exist in ' + build.name)
  }
}

const requested = process.argv[2]
const selected = requested ? builds.filter(item => item.code === requested) : builds

if (requested && selected.length === 0) {
  console.error('Unknown locale: ' + requested)
  process.exit(2)
}

for (const build of selected) {
  const mergedConfig = mergeConfig(readYaml('_config.yml'), readYaml(build.config))
  validateSourceFrontMatter(build, mergedConfig)
}

const englishConfig = mergeConfig(readYaml('_config.yml'), readYaml('_config.en.yml'))
const englishTitles = {}
for (const slug of requiredPosts) {
  englishTitles[slug] = String(frontMatter(sourcePostFile(englishConfig, slug)).title || '')
}

if (!requested) {
  fs.rmSync(publicDir, { recursive: true, force: true })
} else if (selected[0].code === 'en') {
  fs.rmSync(publicDir, { recursive: true, force: true })
} else {
  fs.rmSync(path.join(root, selected[0].output), { recursive: true, force: true })
}

try {
  for (const build of selected) {
    cleanHexoState()

    if (build.code !== 'en') {
      fs.rmSync(path.join(root, build.output), { recursive: true, force: true })
    }

    const resultConfig = writeBuildConfig(build)
    const meta = resultConfig.meta

    console.log('\n=== Building ' + build.name + ' ===')
    console.log('source=' + meta.sourceDir + ' public=' + meta.publicDir + ' root=' + meta.rootPath + ' language=' + meta.language)

    const result = spawnSync(process.execPath, [
      hexoBin,
      'generate',
      '--bail',
      '--config',
      path.basename(tempConfigPath)
    ], {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        WEIG_BUILD_LOCALE: String(meta.language),
        WEIG_BUILD_ROOT: String(meta.rootPath),
        WEIG_BUILD_SOURCE: String(meta.sourceDir),
        WEIG_BUILD_PUBLIC: String(meta.publicDir),
        WEIG_BUILD_HOME_LABEL: String(meta.homeLabel),
        WEIG_BUILD_HOME_HREF: String(meta.homeHref)
      }
    })

    if (result.error) throw result.error
    if (result.status !== 0) process.exitCode = result.status || 1
    if (process.exitCode) break

    validateBuild(build, meta, englishTitles)
  }

  if (!process.exitCode && (!requested || selected[0].code === 'en')) {
    assertFile(path.join(publicDir, 'css', 'language-switcher.css'), 'Missing language switcher CSS')
    assertFile(path.join(publicDir, 'js', 'language-switcher.js'), 'Missing language switcher JS')
  }
} finally {
  cleanHexoState()
}

if (process.exitCode) process.exit(process.exitCode)

console.log('\nMultilingual build validation passed.')

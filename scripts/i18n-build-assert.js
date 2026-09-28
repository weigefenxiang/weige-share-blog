'use strict'

const expectedLocale = process.env.WEIG_BUILD_LOCALE

if (expectedLocale) {
  hexo.extend.filter.register('before_generate', () => {
    const expectedRoot = process.env.WEIG_BUILD_ROOT
    const expectedSource = process.env.WEIG_BUILD_SOURCE
    const expectedPublic = process.env.WEIG_BUILD_PUBLIC
    const expectedHomeLabel = process.env.WEIG_BUILD_HOME_LABEL
    const expectedHomeHref = process.env.WEIG_BUILD_HOME_HREF

    const language = Array.isArray(hexo.config.language)
      ? String(hexo.config.language[0] || '')
      : String(hexo.config.language || '')

    if (language !== expectedLocale) {
      throw new Error('Build locale mismatch: expected ' + expectedLocale + ', got ' + language)
    }
    if (String(hexo.config.root) !== expectedRoot) {
      throw new Error('Build root mismatch for ' + expectedLocale + ': ' + hexo.config.root)
    }
    if (String(hexo.config.source_dir) !== expectedSource) {
      throw new Error('Build source_dir mismatch for ' + expectedLocale + ': ' + hexo.config.source_dir)
    }
    if (String(hexo.config.public_dir) !== expectedPublic) {
      throw new Error('Build public_dir mismatch for ' + expectedLocale + ': ' + hexo.config.public_dir)
    }

    const menu = hexo.theme && hexo.theme.config && hexo.theme.config.menu
    if (!menu || !Object.prototype.hasOwnProperty.call(menu, expectedHomeLabel)) {
      throw new Error('Butterfly menu mismatch for ' + expectedLocale + '; missing ' + expectedHomeLabel)
    }

    const homeSpec = String(menu[expectedHomeLabel] || '')
    if (!homeSpec.startsWith(expectedHomeHref)) {
      throw new Error('Butterfly home href mismatch for ' + expectedLocale + ': ' + homeSpec)
    }


    hexo.log.info(
      '[i18n-check] %s source=%s root=%s menu=%s',
      expectedLocale,
      expectedSource,
      expectedRoot,
      expectedHomeLabel
    )
  }, 999)
}

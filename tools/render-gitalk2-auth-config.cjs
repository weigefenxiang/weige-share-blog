'use strict'
// Runs after the complete multilingual Hexo build. Writes ONLY public OAuth
// client ID and proxy origin into a generated Pages asset; never any secrets.
const fs = require('node:fs')
const path = require('node:path')
const output = path.resolve(__dirname, '../public/zh-CN/gitalk2-eval/runtime-config.js')
const clientID = String(process.env.WEIG_GITALK_CLIENT_ID || '').trim()
const proxyInput = String(process.env.WEIG_GITALK_PROXY_ORIGIN || '').trim()
if (Boolean(clientID) !== Boolean(proxyInput)) {
  throw new Error('Gitalk OAuth requires BOTH WEIG_GITALK_CLIENT_ID and WEIG_GITALK_PROXY_ORIGIN')
}
if (clientID && !/^Iv[a-z0-9_-]{4,128}$/i.test(clientID)) {
  throw new Error('WEIG_GITALK_CLIENT_ID is not a valid public GitHub App Client ID')
}
let proxy = ''
if (proxyInput) {
  let url
  try { url = new URL(proxyInput) } catch { throw new Error('WEIG_GITALK_PROXY_ORIGIN must be a valid https origin') }
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash ||
      url.pathname !== '/' || url.origin !== proxyInput.replace(/\/$/, '')) {
    throw new Error('WEIG_GITALK_PROXY_ORIGIN must be an https origin without a path, credentials or query')
  }
  proxy = url.origin
  if (url.hostname === 'gitalk-proxy.aispin-abf.workers.dev') {
    throw new Error('Default Gitalk proxy is not approved for your blog origin; deploy your own proxy')
  }
}
const enabled = Boolean(clientID && proxy)
const config = { enabled, clientID, proxy }
fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output,
  '// Generated public client configuration. No GitHub App secret is included.\n' +
  'window.__WEIG_GITALK_PUBLIC_CONFIG__ = Object.freeze(' + JSON.stringify(config) + ');\n',
  'utf8')
console.log('Gitalk OAuth public config:', enabled ? 'ENABLED (public client ID + proxy origin)' : 'NOT CONFIGURED (anonymous read-only)')

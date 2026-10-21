/**
 * Optional Gitalk attachments service. Deployed separately from the static blog.
 * Fail closed when bindings are absent. Never embed R2 credentials in the page.
 *
 * Required Cloudflare bindings:
 *  COMMENTS_BUCKET (R2), UPLOAD_RATE_LIMITER (Rate Limiting API binding)
 * Required vars: ALLOWED_ORIGINS (CSV), PUBLIC_ASSET_BASE (HTTPS origin)
 * Optional: ENABLE_ARCHIVES=true after malware-scanning policy is deployed.
 */
const MAX_IMAGE = 10 * 1024 * 1024
const MAX_FILE = 25 * 1024 * 1024
const TYPES = Object.freeze({
  'image/png': { ext: '.png', max: MAX_IMAGE, inline: true },
  'image/jpeg': { ext: '.jpg', max: MAX_IMAGE, inline: true },
  'image/webp': { ext: '.webp', max: MAX_IMAGE, inline: true },
  'image/gif': { ext: '.gif', max: MAX_IMAGE, inline: true },
  'application/pdf': { ext: '.pdf', max: MAX_FILE, inline: false },
  'text/plain': { ext: '.txt', max: MAX_FILE, inline: false },
  'application/zip': { ext: '.zip', max: MAX_FILE, inline: false }
})

function json(status, value, origin = null) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Vary'] = 'Origin'
  }
  return new Response(JSON.stringify(value), { status, headers })
}
function signature(bytes, type) {
  const at = (...numbers) => numbers.every((v, i) => bytes[i] === v)
  const ascii = (n, value) => String.fromCharCode(...bytes.slice(n, n + value.length)) === value
  if (type === 'image/png') return at(137,80,78,71,13,10,26,10)
  if (type === 'image/jpeg') return at(255,216,255)
  if (type === 'image/gif') return ascii(0, 'GIF87a') || ascii(0, 'GIF89a')
  if (type === 'image/webp') return ascii(0,'RIFF') && ascii(8,'WEBP')
  if (type === 'application/pdf') return ascii(0, '%PDF-')
  if (type === 'application/zip') return at(80,75,3,4)
  if (type === 'text/plain') {
    if (bytes.includes(0)) return false
    try { new TextDecoder('utf-8', { fatal: true }).decode(bytes); return true } catch { return false }
  }
  return false
}
function filename(raw, ext) {
  let value
  try { value = decodeURIComponent(raw || 'attachment') } catch { return null }
  value = value.split(/[\\/]/).pop()?.replace(/[\x00-\x1f\x7f<>:"|?*]/g,'').trim() ?? ''
  if (!value || value.length > 120 || !value.toLowerCase().endsWith(ext)) return null
  return value
}
function allowedOrigin(request, env) {
  const origin = request.headers.get('Origin')
  if (!origin || !env.ALLOWED_ORIGINS) return null
  const allowed = env.ALLOWED_ORIGINS.split(',').map(x => x.trim()).filter(Boolean)
  return allowed.includes(origin) ? origin : null
}
function validConfig(env) {
  try {
    const url = new URL(env.PUBLIC_ASSET_BASE)
    return url.protocol === 'https:' && !!env.COMMENTS_BUCKET &&
      !!env.UPLOAD_RATE_LIMITER && !!env.ALLOWED_ORIGINS
  } catch { return false }
}

export default {
  async fetch(request, env) {
    if (!validConfig(env)) return json(503, { error: 'Upload service is not configured' })
    const origin = allowedOrigin(request, env)
    if (!origin) return json(403, { error: 'Origin not allowed' })
    const url = new URL(request.url)
    if (url.pathname !== '/api/upload') return json(404, { error: 'Not found' }, origin)
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: {
        'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Upload-Filename',
        'Access-Control-Max-Age': '600', 'Vary': 'Origin'
      } })
    }
    if (request.method !== 'POST') return json(405, { error: 'Method not allowed' }, origin)
    const match = /^Bearer ([A-Za-z0-9_-]{15,300})$/.exec(request.headers.get('Authorization') || '')
    if (!match) return json(401, { error: 'GitHub login required' }, origin)
    const type = (request.headers.get('Content-Type') || '').split(';')[0].toLowerCase()
    const policy = TYPES[type]
    if (!policy || (type === 'application/zip' && env.ENABLE_ARCHIVES !== 'true')) {
      return json(415, { error: 'File type not accepted' }, origin)
    }
    const name = filename(request.headers.get('X-Upload-Filename'), policy.ext)
    if (!name) return json(400, { error: 'Invalid filename' }, origin)
    const declared = Number(request.headers.get('Content-Length'))
    if (!Number.isSafeInteger(declared) || declared < 1 || declared > policy.max) {
      return json(413, { error: 'File size exceeds limit or length is missing' }, origin)
    }
    let user
    try {
      const response = await fetch('https://api.github.com/user', { headers: {
        Authorization: 'Bearer ' + match[1], Accept: 'application/vnd.github+json',
        'User-Agent': 'WeiG-Gitalk-Attachments'
      }, redirect: 'error' })
      if (!response.ok) return json(401, { error: 'GitHub authentication failed' }, origin)
      user = await response.json()
      if (!Number.isSafeInteger(user.id) || user.id < 1) throw Error('invalid identity')
    } catch { return json(502, { error: 'Unable to verify GitHub identity' }, origin) }
    try {
      const limit = await env.UPLOAD_RATE_LIMITER.limit({ key: String(user.id) })
      if (!limit.success) return json(429, { error: 'Upload rate limit reached' }, origin)
    } catch { return json(503, { error: 'Upload rate limiter unavailable' }, origin) }
    let bytes
    try { bytes = new Uint8Array(await request.arrayBuffer()) }
    catch { return json(400, { error: 'Could not read file' }, origin) }
    if (!bytes.length || bytes.length > policy.max || bytes.length !== declared || !signature(bytes,type)) {
      return json(400, { error: 'File payload failed validation' }, origin)
    }
    const objectKey = 'comments/' + user.id + '/' + new Date().toISOString().slice(0,7) +
      '/' + crypto.randomUUID() + policy.ext
    const disposition = policy.inline ? 'inline' : 'attachment'
    try {
      await env.COMMENTS_BUCKET.put(objectKey, bytes, { httpMetadata: {
        contentType: type,
        contentDisposition: disposition + '; filename="' + name.replace(/["\\]/g,'') + '"',
        cacheControl: 'public, max-age=31536000, immutable'
      }, customMetadata: { uploaderId: String(user.id) } })
    } catch { return json(503, { error: 'Storage unavailable' }, origin) }
    const base = env.PUBLIC_ASSET_BASE.replace(/\/+$/, '')
    return json(201, { url: base + '/' + objectKey, filename: name, mime: type, size: bytes.length }, origin)
  }
}

import test from 'node:test'
import assert from 'node:assert/strict'
import worker from './worker.mjs'

const ORIGIN = 'https://dev.weige-share-blog.pages.dev'
const png = Uint8Array.from([137,80,78,71,13,10,26,10,1,2,3,4])
function fixtures() {
  const stored = []
  const env = {
    ALLOWED_ORIGINS: ORIGIN + ',https://weigshare.com',
    PUBLIC_ASSET_BASE: 'https://attachments.example.test',
    COMMENTS_BUCKET: { async put(key, bytes, meta) { stored.push({ key, size: bytes.length, meta }) } },
    UPLOAD_RATE_LIMITER: { async limit() { return { success: true } } }
  }
  return { env, stored }
}
function request(bytes = png, overrides = {}) {
  const headers = {
    Origin: ORIGIN,
    Authorization: 'Bearer ghu_FAKE_TEST_CREDENTIAL',
    'Content-Type': 'image/png',
    'Content-Length': String(bytes.length),
    'X-Upload-Filename': 'diagram.png',
    ...(overrides.headers ?? {})
  }
  return new Request('https://uploads.example.test/api/upload', {
    method: overrides.method ?? 'POST',
    headers,
    body: overrides.method === 'OPTIONS' ? undefined : bytes
  })
}
async function withGitHubUser(fn) {
  const old = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify({ id: 42, login: 'tester' }), { status: 200 })
  try { return await fn() } finally { globalThis.fetch = old }
}

test('misconfigured storage and untrusted origins fail closed', async () => {
  const { env } = fixtures()
  assert.equal((await worker.fetch(request(), {})).status, 503)
  assert.equal((await worker.fetch(request(png, { headers: { Origin: 'https://hostile.example' } }), env)).status, 403)
})

test('unauthenticated requests and disallowed file types cannot upload', async () => {
  const { env, stored } = fixtures()
  assert.equal((await worker.fetch(request(png,{headers:{ Authorization: ''}}), env)).status, 401)
  assert.equal((await worker.fetch(request(png,{headers:{'Content-Type':'text/html'}}), env)).status, 415)
  assert.equal(stored.length, 0)
})

test('images require valid signatures and sizes', async () => {
  const { env, stored } = fixtures()
  await withGitHubUser(async () => {
    assert.equal((await worker.fetch(request(Uint8Array.from([1,2,3,4])), env)).status, 400)
    assert.equal((await worker.fetch(request(png,{headers:{'Content-Length':'100000001'}}), env)).status, 413)
  })
  assert.equal(stored.length, 0)
})

test('verified GitHub image is saved with a generated non-script URL', async () => {
  const { env, stored } = fixtures()
  await withGitHubUser(async () => {
    const res = await worker.fetch(request(), env)
    assert.equal(res.status, 201)
    const body = await res.json()
    assert.match(body.url, /^https:\/\/attachments\.example\.test\/comments\/42\//)
    assert.equal(body.filename, 'diagram.png')
    assert.equal(res.headers.get('Access-Control-Allow-Origin'), ORIGIN)
  })
  assert.equal(stored.length, 1)
  assert.match(stored[0].key, /^comments\/42\//)
  assert.equal(stored[0].meta.httpMetadata.contentType, 'image/png')
  assert.equal(stored[0].meta.httpMetadata.contentDisposition.includes('inline'), true)
})

test('rate limiter denial blocks storage and archive upload is off by default', async () => {
  const { env, stored } = fixtures()
  await withGitHubUser(async () => {
    env.UPLOAD_RATE_LIMITER.limit = async () => ({ success: false })
    assert.equal((await worker.fetch(request(), env)).status, 429)
  })
  assert.equal(stored.length, 0)
  const archive = Uint8Array.from([80,75,3,4,0])
  const res = await worker.fetch(request(archive,{headers:{'Content-Type':'application/zip','X-Upload-Filename':'data.zip'}}),env)
  assert.equal(res.status, 415)
})

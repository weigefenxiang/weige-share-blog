'use strict'

/** Focused offline contract checks for the Gitalk 401 recovery added to the
 * pinned upstream source. Run after adapt(core), before the network build. */
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const assert = require('node:assert/strict')

const core = process.argv[2]
if (!core) throw new Error('Usage: node test-gitalk2-401.cjs <pinned-upstream-core>')
const auth = fs.readFileSync(path.join(core, 'src', 'auth.ts'), 'utf8')
const client = fs.readFileSync(path.join(core, 'src', 'api', 'client.ts'), 'utf8')
const widget = fs.readFileSync(path.join(core, 'src', 'use-gitalk.ts'), 'utf8')

function between(source, first, last) {
  const start = source.indexOf(first)
  const end = source.indexOf(last, start + first.length)
  assert.ok(start >= 0 && end > start, 'Expected pinned source markers: ' + first)
  return source.slice(start + first.length, end)
}

const recoverBody = between(auth,
  '  async recoverUnauthorizedToken(rejected: string): Promise<void> {',
  '\n  }\n\n  /** Persist draft')
const recoverFactory = new Function('removeStored', 'STORAGE_KEY', 'EXPIRES_KEY',
  'return async function (rejected) {' + recoverBody + '\n}')
const retryBlock = between(client,
  '    // Only retry safe reads. The callback may renew the session or drop a\n',
  '    if (response.status === 429) throw new RateLimitError()')
assert.match(retryBlock, /response\.status === 401/)
assert.match(retryBlock, /method \?\? 'GET'/)
assert.match(widget, /rejected => \{/)
assert.match(widget, /recoverUnauthorizedToken\(rejected\)/)
assert.match(widget, /err\.status === 401 && !auth\.getToken\(\)/)

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const evalRetry = new AsyncFunction('response', 'token', 'init', 'headers',
  'path', 'fetch', 'GitalkError',
  retryBlock.replaceAll('(err as Error)', 'err') + '\nreturn response')

function fixture(renew) {
  const data = new Map([
    ['GT_ACCESS_TOKEN', 'old-token'],
    ['GT_TOKEN_EXPIRES_AT', '999999999'],
    ['GT_COMMENT', 'unsent-draft'],
    ['giscus-session', 'unrelated-session'],
    ['GT_SESSION', 'refresh-session']
  ])
  const auth = {
    token: 'old-token', expiresAt: 999999999, session: 'refresh-session',
    unauthorizedRecovery: null,
    getToken() { return this.token },
    hasSession() { return Boolean(this.session) },
    async refresh() { return renew?.(this) ?? false }
  }
  auth.recoverUnauthorizedToken = recoverFactory(key => data.delete(key),
    'GT_ACCESS_TOKEN', 'GT_TOKEN_EXPIRES_AT')
  return { auth, data }
}

function mockResponse(status) {
  return { status, ok: status >= 200 && status < 300, headers: { get: () => null } }
}

async function retry(auth, input, responses, calls, onUnauthorized) {
  const fetch = async (url, req) => {
    calls.push({ url, authorization: req.headers.Authorization })
    return responses.shift() || mockResponse(401)
  }
  const clientContext = {
    baseUrl: 'https://api.github.com',
    getToken: () => auth.getToken(),
    onUnauthorized: onUnauthorized || (token => auth.recoverUnauthorizedToken(token))
  }
  return evalRetry.call(clientContext,
    input.response || mockResponse(401), input.token === undefined ? 'old-token' : input.token,
    input.init || { method: 'GET' },
    { Authorization: 'Bearer old-token' }, '/repos/example/issues', fetch, Error)
}

test('rejected token without a refresh session falls back to anonymous GET', async () => {
  const { auth, data } = fixture()
  auth.session = null
  const calls = []
  const result = await retry(auth, {}, [mockResponse(200)], calls)
  assert.equal(result.status, 200)
  assert.deepEqual(calls.map(c => c.authorization), [undefined])
  assert.equal(auth.getToken(), null)
  assert.equal(data.has('GT_ACCESS_TOKEN'), false)
  assert.equal(data.has('GT_TOKEN_EXPIRES_AT'), false)
  assert.equal(data.get('GT_COMMENT'), 'unsent-draft')
  assert.equal(data.get('giscus-session'), 'unrelated-session')
  assert.equal(data.get('GT_SESSION'), 'refresh-session')
})

test('valid refresh retries GET using only the rotated token', async () => {
  const { auth } = fixture(a => { a.token = 'fresh-token'; a.session = 'new-session'; return true })
  const calls = []
  const result = await retry(auth, {}, [mockResponse(200)], calls)
  assert.equal(result.status, 200)
  assert.deepEqual(calls.map(c => c.authorization), ['Bearer fresh-token'])
  assert.equal(auth.getToken(), 'fresh-token')
})

test('failed renewal preserves a potentially usable session and retries anonymously', async () => {
  const { auth, data } = fixture(() => { throw new Error('temporary outage') })
  const calls = []
  await retry(auth, {}, [mockResponse(200)], calls)
  assert.equal(auth.getToken(), null)
  assert.equal(auth.session, 'refresh-session')
  assert.equal(data.get('GT_COMMENT'), 'unsent-draft')
  assert.equal(calls[0].authorization, undefined)
})

test('concurrent rejected reads share a single refresh flight', async () => {
  let resolveRenew
  let refreshCount = 0
  const gate = new Promise(resolve => { resolveRenew = resolve })
  const { auth } = fixture(async a => {
    refreshCount++
    await gate
    a.token = 'new-token'
    return true
  })
  const a = auth.recoverUnauthorizedToken.call(auth, 'old-token')
  const b = auth.recoverUnauthorizedToken.call(auth, 'old-token')
  resolveRenew()
  await Promise.all([a, b])
  assert.equal(refreshCount, 1)
  assert.equal(auth.token, 'new-token')
})

test('one 401 retry only; repeated GET failures do not recurse', async () => {
  const { auth } = fixture()
  auth.session = null
  const calls = []
  const result = await retry(auth, {}, [mockResponse(401)], calls)
  assert.equal(result.status, 401)
  assert.equal(calls.length, 1)
})

test('writes are not automatically retried, even on 401', async () => {
  const { auth } = fixture()
  const calls = []
  const result = await retry(auth, { init: { method: 'POST' } }, [], calls)
  assert.equal(result.status, 401)
  assert.equal(calls.length, 0)
  assert.equal(auth.getToken(), 'old-token')
})

test('healthy GET never invokes recovery', async () => {
  const { auth } = fixture()
  const calls = []
  const result = await retry(auth, { response: mockResponse(200) }, [], calls)
  assert.equal(result.status, 200)
  assert.equal(calls.length, 0)
  assert.equal(auth.getToken(), 'old-token')
})

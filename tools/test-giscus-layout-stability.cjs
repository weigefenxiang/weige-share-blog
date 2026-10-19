'use strict'
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const vm = require('node:vm')

const script = fs.readFileSync(path.join(__dirname, '../source/js/giscus-layout-stability.js'), 'utf8')

function setup ({ hasHost = true } = {}) {
  const listeners = new Map()
  let id = 0
  let pending = new Map()
  const frame = { src: 'https://giscus.app/zh-CN/widget', contentWindow: {} }
  const host = { style: {}, querySelector: () => frame }
  const window = {
    addEventListener: (type, fn) => listeners.set(type, fn),
    removeEventListener: type => listeners.delete(type),
  }
  vm.runInNewContext(script, {
    window,
    document: { getElementById: () => hasHost ? host : null },
    URL,
    Number,
    Math,
    setTimeout: callback => {
      const key = ++id
      pending.set(key, callback)
      return key
    },
    clearTimeout: key => pending.delete(key)
  })
  return {
    host,
    listeners,
    message: (height, options = {}) => listeners.get('message')?.({
      source: options.source || frame.contentWindow,
      origin: options.origin || 'https://giscus.app',
      data: { giscus: { resizeHeight: height } }
    }),
    settle: () => {
      const toRun = [...pending.values()]
      pending = new Map()
      toRun.forEach(fn => fn())
    },
    pending: () => pending.size
  }
}

test('normal growth reserves the complete comment height', () => {
  const page = setup()
  page.message(2969.3)
  assert.equal(page.host.style.minHeight, '2970px')
  page.message(4897)
  assert.equal(page.host.style.minHeight, '4897px')
})

test('focus revalidation cannot collapse the host while images reload', () => {
  const page = setup()
  page.message(4897)
  page.message(2648)
  assert.equal(page.host.style.minHeight, '4897px')
  page.message(2969)
  page.message(3933)
  assert.equal(page.host.style.minHeight, '4897px')
  page.message(4897)
  page.settle()
  assert.equal(page.host.style.minHeight, '4897px')
  assert.equal(page.pending(), 0)
})

test('sustained genuine shrinking is applied after settling', () => {
  const page = setup()
  page.message(5000)
  page.message(4000)
  page.message(3600)
  assert.equal(page.host.style.minHeight, '5000px')
  page.settle()
  assert.equal(page.host.style.minHeight, '3600px')
})

test('untrusted messages and invalid dimensions are ignored', () => {
  const page = setup()
  page.message(1000)
  page.message(3000, { origin: 'https://evil.example' })
  page.message(3000, { source: {} })
  page.message(Number.NaN)
  page.message(-100)
  assert.equal(page.host.style.minHeight, '1000px')
})

test('no comment container means no listener', () => {
  const page = setup({ hasHost: false })
  assert.equal(page.listeners.has('message'), false)
})

test('page unload detaches listeners and pending state', () => {
  const page = setup()
  page.message(1000)
  page.message(100)
  page.listeners.get('pagehide')?.({ persisted: false })
  assert.equal(page.listeners.has('message'), false)
  assert.equal(page.pending(), 0)
})

test('back-forward cache navigation preserves live resize handling', () => {
  const page = setup()
  page.message(4897)
  page.listeners.get('pagehide')?.({ persisted: true })
  assert.equal(page.listeners.has('message'), true)
  page.message(2648)
  assert.equal(page.host.style.minHeight, '4897px')
})

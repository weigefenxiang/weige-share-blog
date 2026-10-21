'use strict'

/** Regression tests against the actual adapted pinned Gitalk source. */
const fs = require('node:fs')
const path = require('node:path')
const { test } = require('node:test')
const assert = require('node:assert/strict')

const core = process.argv[2]
if (!core) throw new Error('Usage: node test-gitalk2-reply-login.cjs <core>')
const use = fs.readFileSync(path.join(core, 'src/use-gitalk.ts'), 'utf8')
const widget = fs.readFileSync(path.join(core, 'src/widget.tsx'), 'utf8')
const comment = fs.readFileSync(path.join(core, 'src/components/comment.tsx'), 'utf8')
const css = fs.readFileSync(path.join(__dirname, '../themes/butterfly/source/css/weig-gitalk2-editor.css'), 'utf8')

test('anonymous top-level and nested reply buttons route to a login prompt', () => {
  assert.match(widget, /onReply=\{\s*meta\.authenticated\s*\?\s*actions\.replyTo\s*:\s*\(\) => actions\.requireLogin\('reply'\)/)
  assert.match(widget, /onReplyToNested=\{meta\.authenticated\s*\?\s*actions\.replyToNested\s*:\s*\(\) => actions\.requireLogin\('reply'\)/)
  assert.match(comment, /onClick=\{\(\) => onReply!\(comment\)\}/)
  assert.match(comment, /onClick=\{\(\) => onReplyToNested\(comment, reply\)\}/)
})

test('requireLogin uses reason-specific state; other interactions keep their notice', () => {
  const start = use.indexOf('  const requireLogin = useCallback(')
  const end = use.indexOf('\n\n  const dismissNotice =', start)
  assert.ok(start >= 0 && end > start)
  const fragment = use.slice(start, end).replace('(reason: LoginReason)', '(reason)')
  const calls = []
  const getCallback = new Function('useCallback', 't', 'patch',
    fragment + '\nreturn requireLogin')
  const action = getCallback(fn => fn, text => text, value => calls.push(value))
  for (const kind of ['reply', 'comment', 'react', 'upvote']) action(kind)
  assert.deepEqual(calls, [
    { notice: 'login-to-reply', replyLoginPrompt: true },
    { notice: 'login-to-comment', replyLoginPrompt: false },
    { notice: 'login-to-react', replyLoginPrompt: false },
    { notice: 'login-to-upvote', replyLoginPrompt: false }
  ])
})

test('dialog is native, top-layer, focusable, translatable, and dismissible', () => {
  assert.match(use, /replyLoginPrompt: boolean/)
  assert.match(use, /replyLoginPrompt: false/)
  assert.match(use, /patch\(\{ notice: null, replyLoginPrompt: false \}\)/)
  assert.match(widget, /<dialog[\s\S]*?ref=\{replyLoginDialogRef\}/)
  assert.match(widget, /dialog\.showModal\(\)/)
  assert.match(widget, /className="gt-reply-login-dialog"/)
  assert.match(widget, /aria-label=\{t\("login-to-reply"\)\}/)
  assert.match(widget, /onCancel=\{\(event\) => \{ event\.preventDefault\(\); actions\.dismissNotice\(\) \}\}/)
  assert.match(widget, /onClose=\{actions\.dismissNotice\}/)
  assert.match(widget, /onClick=\{actions\.dismissNotice\}/)
  assert.match(widget, /className="gt-reply-login-confirm" href=\{loginHref\} onClick=\{onLoginClick\}/)
  assert.match(widget, /\{t\("login-with-github"\)\}/)
  assert.match(widget, /\{t\("cancel"\)\}/)
  assert.match(widget, /\{state\.notice && !state\.replyLoginPrompt \? \(/)
})

test('dialog inherits both theme colors, avoids hard-coded white border', () => {
  assert.match(css, /gt-reply-login-dialog/)
  assert.match(css, /::backdrop/)
  assert.match(css, /var\(--gt-color-panel-line-strong, var\(--weig-tools-line\)\)/)
  assert.match(css, /var\(--gt-color-panel-solid, var\(--weig-tools-surface\)\)/)
  assert.match(css, /:focus-visible/)
})

test('the login prompt never opens or submits a reply without authorization', () => {
  assert.match(widget, /onClick=\{onLoginClick\}/)
  assert.match(widget, /const onLoginClick = \(event:/)
  assert.match(widget, /actions\.login\(\)/)
  assert.match(use, /const login = useCallback\(\(\) => \{/)
  assert.match(use, /auth\.saveDraft\(state\.draft\)/)
  assert.match(use, /if \(!auth\.getToken\(\)\) \{\s*requireLogin\('reply'\)/)
})

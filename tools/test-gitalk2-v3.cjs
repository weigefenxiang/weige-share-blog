'use strict'
/** V3 shared-editor integration and pure Markdown command regression tests. */
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const ts = require(path.join(process.argv[2], 'node_modules', 'typescript', 'lib', 'typescript.js'))
const { test } = require('node:test')
const assert = require('node:assert/strict')
const core = process.argv[2]
if (!core) throw new Error('Usage: node test-gitalk2-v3.cjs <core>')
const read = file => fs.readFileSync(path.join(core, 'src', file), 'utf8')
const widget = read('widget.tsx')
const comment = read('components/comment.tsx')
const input = read('components/mention-textarea.tsx')
const editor = read('components/comment-editor.tsx')
const toolbar = read('components/markdown-toolbar.tsx')
const reply = read('components/reply-box.tsx')

const compiled = ts.transpileModule(read('markdown-commands.ts'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText
const mod = { exports: {} }
vm.runInNewContext('((exports,module) => {' + compiled + '\n})(module.exports,module)',
  { module: mod }, { timeout: 500 })
const apply = mod.exports.applyMarkdownCommand

test('pure commands preserve selection, avoid replacing text outside the range', () => {
  const a = apply('say hello here', 4, 9, 'bold')
  assert.equal(a.text, 'say **hello** here')
  assert.equal(a.selectionStart, 6)
  assert.equal(a.selectionEnd, 11)
  const b = apply('line 1\nline 2\nline 3', 8, 11, 'quote')
  assert.equal(b.text, 'line 1\n> line 2\nline 3')
  const c = apply('a\nb', 0, 3, 'ordered')
  assert.equal(c.text, '1. a\n2. b')
  const d = apply('text', 0, 4, 'link')
  assert.equal(d.text, '[text](https://)')
  const e = apply('task', 0, 4, 'task')
  assert.equal(e.text, '- [ ] task')
  const f = apply('foo', 0, 3, 'codeblock')
  assert.ok(f.text.includes('foo'))
  assert.ok(f.text.includes(String.fromCharCode(96).repeat(3)))
})

test('one editor shell is shared by main composer and nested reply box', () => {
  assert.match(widget, /<CommentEditor/)
  assert.match(reply, /<CommentEditor/)
  assert.match(editor, /<MarkdownToolbar/)
  assert.match(editor, /<MentionTextarea/)
  assert.match(editor, /<MarkdownBody/)
  assert.doesNotMatch(reply, /<MentionTextarea/)
  assert.doesNotMatch(widget, /className=\{\x60gt-composer-body/)
  assert.equal((comment.match(/onPreview=\{onReplyPreview\}/g) || []).length, 2)
})

test('formatting is routed through the original caret-aware native textarea', () => {
  assert.match(input, /handleRef\.current = \{ insertAtCaret, format \}/)
  assert.match(input, /applyMarkdownCommand\(current, start, end, command\)/)
  assert.match(input, /el\.setSelectionRange\(caret, selectionEnd\)/)
  assert.match(input, /e\.key\.toLowerCase\(\) === "b"/)
  assert.match(input, /e\.key\.toLowerCase\(\) === "i"/)
  assert.match(toolbar, /onMouseDown=\{\(event\) => event\.preventDefault\(\)\}/)
})

test('every reply location gets account strip and identical controls', () => {
  assert.equal((comment.match(/<ReplyBox/g) || []).length, 2)
  assert.equal((comment.match(/currentUser=\{currentUser\}/g) || []).length, 2)
  assert.equal((comment.match(/onLogout=\{onLogout\}/g) || []).length, 2)
  assert.match(widget, /<AccountStrip/)
  assert.match(reply, /<AccountStrip/)
  assert.match(widget, /const logoutSafely = \(\) =>/)
  assert.match(widget, /window\.confirm/)
})

test('previews ignore stale async results and attachments have no fictitious UI', () => {
  assert.match(reply, /seq === request\.current && snapshot === current\.current/)
  assert.match(editor, /props\.previewing/)
  assert.match(widget, /meta\.canUploadImage \? \(/)
  assert.doesNotMatch(toolbar, /upload|attachment|paperclip/i)
})

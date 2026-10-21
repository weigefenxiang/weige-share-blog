'use strict'
/**
 * V3 native editor integration.
 * This adapter only connects shared versioned source modules to the pinned
 * upstream Gitalk shell. No DOM reconstruction or per-reply feature forks.
 */
const fs = require('node:fs')
const path = require('node:path')

function replaceOne(source, before, after, label) {
  const i = source.indexOf(before)
  if (i < 0 || source.indexOf(before, i + before.length) !== -1) {
    throw new Error('V3 upstream contract changed: ' + label)
  }
  return source.slice(0, i) + after + source.slice(i + before.length)
}

module.exports = function installV3(core, site) {
  const folder = path.join(site, 'tools', 'gitalk2-src')
  const src = path.join(core, 'src')
  const modules = [
    'markdown-commands.ts',
    'components/markdown-toolbar.tsx',
    'components/comment-editor.tsx',
    'components/account-strip.tsx',
    'components/reply-box.tsx'
  ]
  const rewrite = (name, fn) => {
    const file = path.join(src, name)
    const before = fs.readFileSync(file, 'utf8')
    const after = fn(before)
    if (before === after) throw new Error('V3 empty source change: ' + name)
    fs.writeFileSync(file, after)
  }

  // One Markdown editing implementation for all depths.
  rewrite('components/mention-textarea.tsx', original => {
    let s = replaceOne(original,
      "import { Avatar } from './avatar'",
      "import { Avatar } from './avatar'\nimport { applyMarkdownCommand } from '../markdown-commands'\nimport type { MarkdownCommand } from '../markdown-commands'",
      'shared commands import')
    s = replaceOne(s,
      '  insertAtCaret: (text: string) => void',
      '  insertAtCaret: (text: string) => void\n  format: (command: MarkdownCommand) => void',
      'shared editor handle')
    s = replaceOne(s,
      '  const pendingCaret = useRef<number | null>(null)',
      '  const pendingCaret = useRef<number | null>(null)\n  const pendingSelectionEnd = useRef<number | null>(null)',
      'selection range state')
    s = replaceOne(s,
      '    pendingCaret.current = null\n    pendingValue.current = null\n    el.focus()\n    try {\n      el.setSelectionRange(caret, caret)',
      '    pendingCaret.current = null\n    pendingValue.current = null\n    const selectionEnd = pendingSelectionEnd.current ?? caret\n    pendingSelectionEnd.current = null\n    el.focus()\n    try {\n      el.setSelectionRange(caret, selectionEnd)',
      'selection range restore')
    const format = [
      '  const format = useCallback((command: MarkdownCommand) => {',
      '    const el = ref.current',
      '    const current = el?.value ?? value',
      '    const start = caretAvailable && el ? el.selectionStart ?? current.length : current.length',
      '    const end = caretAvailable && el ? el.selectionEnd ?? start : current.length',
      '    const edit = applyMarkdownCommand(current, start, end, command)',
      '    pendingCaret.current = edit.selectionStart',
      '    pendingSelectionEnd.current = edit.selectionEnd',
      '    pendingValue.current = edit.text',
      '    onInput(edit.text)',
      '  }, [caretAvailable, onInput, value])',
      ''
    ].join('\n')
    s = replaceOne(s,
      '  // Keep the host\'s handle pointed at the latest closure',
      format + '\n  // Keep the host\'s handle pointed at the latest closure',
      'format operation')
    s = replaceOne(s,
      '    handleRef.current = { insertAtCaret }',
      '    handleRef.current = { insertAtCaret, format }',
      'publish format handle')
    s = replaceOne(s,
      '  }, [handleRef, insertAtCaret])',
      '  }, [handleRef, insertAtCaret, format])',
      'latest formatting callback')
    s = replaceOne(s,
      "    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {",
      [
        '    if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === "b" || e.key.toLowerCase() === "i")) {',
        '      e.preventDefault()',
        '      format(e.key.toLowerCase() === "b" ? "bold" : "italic")',
        '      return',
        '    }',
        '',
        "    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {"
      ].join('\n'), 'shared markdown shortcuts')
    return s
  })

  rewrite('components/comment.tsx', original => {
    let s = replaceOne(original,
      'GitalkComment, GitalkReply, PendingComment, Reaction',
      'GitalkComment, GitalkReply, GitalkUser, PendingComment, Reaction',
      'account type import')
    s = replaceOne(s, '  mentionLabel: string\n',
      '  mentionLabel: string\n  logout: string\n', 'localized logout')
    s = replaceOne(s,
      '  onReplyInput: (value: string) => void',
      '  currentUser?: Pick<GitalkUser, "login" | "avatarUrl"> | null\n  onLogout?: () => void\n  onReplyInput: (value: string) => void',
      'shared reply account props')
    s = replaceOne(s, '  onReplyInput,\n  onReplyPreview,',
      '  onReplyInput,\n  onReplyPreview,\n  currentUser,\n  onLogout,',
      'shared reply account destructure')
    let n = 0
    s = s.replace(/(<ReplyBox\s*\n\s*)value=\{replyDraft\}/g, (_match, head) => {
      n++
      return head + 'value={replyDraft}\n' +
        '              language={locale}\n              currentUser={currentUser}\n' +
        '              logoutLabel={labels.logout}\n              onLogout={onLogout}'
    })
    if (n !== 2) throw new Error('V3 expects two native reply render sites, found ' + n)
    return s
  })

  rewrite('widget.tsx', original => {
    let s = replaceOne(original,
      "import { AvatarMenu } from './components/avatar-menu'\nimport { MarkdownBody } from './components/markdown-body'",
      "import { AccountStrip } from './components/account-strip'\nimport { CommentEditor } from './components/comment-editor'",
      'shared editor imports')
    s = replaceOne(s, "import { MentionTextarea } from './components/mention-textarea'\n", '',
      'remove duplicate main input import')
    s = replaceOne(s, "      mentionLabel: t('mention-label'),",
      "      mentionLabel: t('mention-label'),\n      logout: t('logout'),",
      'reply account labels')
    s = replaceOne(s,
      '                  labels={labels}\n',
      '                  labels={labels}\n                  currentUser={state.user}\n                  onLogout={logoutSafely}\n',
      'share current account with replies')
    const anchor = '  const expand = () => {'
    s = replaceOne(s, anchor, [
      '  const logoutSafely = () => {',
      '    if ((state.draft.trim() || state.replyDraft.trim()) &&',
      '      !window.confirm(/^(zh)/i.test(options.language ?? "")',
      '        ? "有未发送的评论或回复草稿，退出可能丢失。确定退出登录？"',
      '        : "Unsent comment or reply text may be lost. Sign out?")) return',
      '    actions.logout()',
      '  }',
      '',
      anchor
    ].join('\n'), 'account logout confirmation')
    const avatarStart = s.indexOf('            {state.user ? (', s.indexOf('ref={composerRef}'))
    const avatarEnd = s.indexOf('            <div className="gt-header-comment">', avatarStart)
    if (avatarStart < 0 || avatarEnd <= avatarStart) throw new Error('V3 composer identity location changed')
    s = s.slice(0, avatarStart) + s.slice(avatarEnd)
    const editorStart = s.indexOf('                  <div className={' + String.fromCharCode(96) + 'gt-composer-body')
    const editorEnd = s.indexOf('                  <div className="gt-header-controls">', editorStart)
    if (editorStart < 0 || editorEnd <= editorStart) throw new Error('V3 main editor location changed')
    const component = [
      '                  <CommentEditor',
      '                    className="gt-composer-body"',
      '                    textareaClassName="gt-header-textarea"',
      '                    previewClassName="gt-composer-preview"',
      '                    value={state.draft} candidates={candidates}',
      '                    placeholder={t("leave-a-comment")}',
      '                    listLabel={t("mention-label")}',
      '                    editLabel={t("edit")} previewLabel={t("preview")}',
      '                    language={options.language}',
      '                    previewing={state.previewing} previewBusy={state.previewBusy}',
      '                    previewHtml={state.previewHtml}',
      '                    onTogglePreview={togglePreview}',
      '                    onInput={actions.setDraft}',
      '                    onSubmit={() => void actions.submit()}',
      '                    submitOnPlainEnter={options.submitOnEnter === true}',
      '                    handleRef={editorRef} rtl={direction === "rtl"}',
      '                  />',
      ''
    ].join('\n')
    s = s.slice(0, editorStart) + component + s.slice(editorEnd)
    s = replaceOne(s,
      '                  <div className="gt-header-controls">\n',
      '                  <div className="gt-header-controls gt-editor-footer">\n' +
        '                    <AccountStrip user={state.user} logoutLabel={t("logout")} onLogout={logoutSafely} />\n',
      'main editor account strip')
    // Legacy preview button is replaced with shared Editor/Preview tabs.
    const obsoleteStart = s.indexOf('                    {/*\n                      Manual source/preview switch')
    const obsoleteEnd = s.indexOf('                    {meta.authenticated || meta.canLogin ? (', obsoleteStart)
    if (obsoleteStart < 0 || obsoleteEnd <= obsoleteStart) throw new Error('V3 obsolete preview control changed')
    s = s.slice(0, obsoleteStart) + s.slice(obsoleteEnd)
    return s
  })

  // Native components live in separately reviewable source files, rather than
  // extra line-number-sensitive string patches in the build script.
  for (const name of modules) {
    const from = path.join(folder, name)
    const dest = path.join(src, name)
    if (!fs.existsSync(from)) throw new Error('V3 tracked source missing: ' + name)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.copyFileSync(from, dest)
  }
}

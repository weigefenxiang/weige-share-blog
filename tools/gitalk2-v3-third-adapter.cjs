'use strict'
/** V3 batch 3: native input history + mention controls and common 3-slot footer.
 * Runs after the pinned Gitalk, V3 and optional-upload adapters.
 * Guard every upstream contract; never rewrite the rendered DOM.
 */
const fs = require('node:fs')
const path = require('node:path')
const change = (s, before, after, name) => {
  const i = s.indexOf(before)
  if (i < 0 || s.indexOf(before, i + before.length) !== -1) {
    throw new Error('V3 batch3 source contract changed: ' + name)
  }
  return s.slice(0,i) + after + s.slice(i+before.length)
}

module.exports = function installBatch3(core, site) {
  const base = path.join(core, 'src')
  const local = path.join(site, 'tools', 'gitalk2-src')
  for (const name of ['editor-history.ts', 'components/editor-footer.tsx']) {
    const from = path.join(local, name)
    if (!fs.existsSync(from)) throw new Error('Missing tracked shared module: ' + name)
    const destination = path.join(base, name)
    fs.mkdirSync(path.dirname(destination), { recursive: true })
    fs.copyFileSync(from, destination)
  }
  const edit = (file, fn) => {
    const full = path.join(base, file)
    const previous = fs.readFileSync(full,'utf8')
    const next = fn(previous)
    if (next === previous) throw new Error('Unchanged V3 batch3 file: '+file)
    fs.writeFileSync(full, next)
  }

  edit('components/mention-textarea.tsx', original => {
    let s = change(original,
      "import { applyMarkdownCommand } from '../markdown-commands'",
      "import { applyMarkdownCommand } from '../markdown-commands'\nimport { EditorHistory } from '../editor-history'",
      'central history import')
    s = change(s,
      '  format: (command: MarkdownCommand) => void',
      '  format: (command: MarkdownCommand) => void\n  mention: () => void\n  undo: () => void\n  redo: () => void',
      'editor controller commands')
    s = change(s,
      '  onInput: (value: string) => void',
      '  onInput: (value: string) => void\n  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void',
      'history callback prop')
    s = change(s,
      '  onInput,\n  onEscape,',
      '  onInput,\n  onHistoryChange,\n  onEscape,',
      'history callback destructure')
    s = change(s, '  const ref = useRef<HTMLTextAreaElement>(null)',
      '  const ref = useRef<HTMLTextAreaElement>(null)\n  const history = useRef(new EditorHistory(value))',
      'one history per textarea')
    const log = [
      '  // Native typing, Markdown formats, mentions and uploads go through',
      '  // the same bounded undo history; host-controlled resets clear it.',
      '  const recordText = useCallback((next: string, caret: number) => {',
      '    history.current.record(next, caret)',
      '    onHistoryChange?.(history.current.canUndo(), history.current.canRedo())',
      '    onInput(next)',
      '  }, [onInput, onHistoryChange])',
      '  useEffect(() => {',
      '    history.current.sync(value)',
      '    onHistoryChange?.(history.current.canUndo(), history.current.canRedo())',
      '  }, [value, onHistoryChange])',
      ''
    ].join('\n')
    s = change(s,'  const handleInput = (e: TargetedInputEvent<HTMLTextAreaElement>) => {',
      log+'  const handleInput = (e: TargetedInputEvent<HTMLTextAreaElement>) => {',
      'controlled history')
    s = change(s,'    onInput(e.currentTarget.value)\n    sync()',
      '    recordText(e.currentTarget.value, e.currentTarget.selectionStart ?? 0)\n    sync()',
      'typing history')
    s = change(s,'      onInput(next.text)\n    },\n    [closeMenu, onInput, token]',
      '      recordText(next.text, caret)\n    },\n    [closeMenu, recordText, token]',
      'mention selection history')
    s = change(s,'      onInput(next)\n    },\n    [caretAvailable, onInput, value]',
      '      recordText(next, start)\n    },\n    [caretAvailable, recordText, value]',
      'paste markdown history')
    s = change(s,'    onInput(edit.text)\n  }, [caretAvailable, onInput, value])',
      '    recordText(edit.text, start)\n  }, [caretAvailable, recordText, value])',
      'format history')
    const controls = [
      '  const mention = useCallback(() => {',
      '    const el = ref.current',
      '    const current = el?.value ?? value',
      '    const start = caretAvailable && el ? el.selectionStart ?? current.length : current.length',
      '    const end = caretAvailable && el ? el.selectionEnd ?? start : current.length',
      '    const next = current.slice(0, start) + "@" + current.slice(end)',
      '    pendingCaret.current = start + 1',
      '    pendingValue.current = next',
      '    closedToken.current = null',
      '    tokenKey.current = String(start) + ":"',
      '    setToken({ start, query: "" })',
      '    setActive(0)',
      '    recordText(next, start)',
      '  }, [caretAvailable, recordText, value])',
      '  const restoreHistory = useCallback((direction: "undo" | "redo") => {',
      '    const el = ref.current',
      '    const caret = el?.selectionStart ?? value.length',
      '    const snapshot = direction === "undo"',
      '      ? history.current.undo(caret) : history.current.redo(caret)',
      '    if (!snapshot) return',
      '    pendingCaret.current = snapshot.caret',
      '    pendingValue.current = snapshot.text',
      '    closedToken.current = null',
      '    setToken(null)',
      '    onHistoryChange?.(history.current.canUndo(), history.current.canRedo())',
      '    onInput(snapshot.text)',
      '  }, [onHistoryChange, onInput, value])',
      '  const undo = useCallback(() => restoreHistory("undo"), [restoreHistory])',
      '  const redo = useCallback(() => restoreHistory("redo"), [restoreHistory])',
      ''
    ].join('\n')
    s = change(s,'  // Keep the host\'s handle pointed at the latest closure',
      controls+'  // Keep the host\'s handle pointed at the latest closure',
      'caret-safe history methods')
    s = change(s,'handleRef.current = { insertAtCaret, format }',
      'handleRef.current = { insertAtCaret, format, mention, undo, redo }',
      'published editor methods')
    s = change(s,'[handleRef, insertAtCaret, format]',
      '[handleRef, insertAtCaret, format, mention, undo, redo]',
      'editor method closure lifetime')
    const shortcuts = [
      '    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.isComposing) {',
      '      const key = e.key.toLowerCase()',
      '      if (key === "z" || key === "y") {',
      '        e.preventDefault()',
      '        if (key === "y" || e.shiftKey) redo()',
      '        else undo()',
      '        return',
      '      }',
      '    }',
      ''
    ].join('\n')
    s = change(s,'    if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === "b"',
      shortcuts+'    if ((e.metaKey || e.ctrlKey) && (e.key.toLowerCase() === "b"',
      'native undo redo keyboard')
    return s
  })

  edit('widget.tsx', original => {
    let s = change(original,
      "import { EditorUpload } from './components/editor-upload'",
      "import { EditorUpload } from './components/editor-upload'\nimport { EditorFooter } from './components/editor-footer'",
      'shared footer import')
    const start = s.indexOf('<div className="gt-header-controls gt-editor-footer">')
    const actions = s.indexOf('{meta.authenticated || meta.canLogin ? (',start)
    const end = s.indexOf('\n                  </div>',actions)
    if (start < 0 || actions < 0 || end < 0) throw new Error('Root footer contracts moved')
    const left = [
      '<EditorFooter className="gt-header-controls"',
      '                    account={<AccountStrip user={state.user} logoutLabel={t("logout")} onLogout={logoutSafely} />}',
      '                    upload={<EditorUpload config={meta.canUploadImage ? {',
      '                      ...sharedUpload,',
      '                      onFiles: (files) => { void uploadFiles(files) },',
      '                      retry: () => { const failed = state.imageUploadError; if (failed) void uploadFiles(failed.files) }',
      '                    } : undefined} />}>',
      '                    '
    ].join('\n')
    s = s.slice(0,start)+left+s.slice(actions,end).replace(/\s+$/,'')+
      '\n                  </EditorFooter>'+s.slice(end + '\n                  </div>'.length)
    return s
  })
}

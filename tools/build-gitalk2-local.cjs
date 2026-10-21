'use strict'

/** Source-level native inline reply customization for Gitalk 2.x.
 * Original source: github.com/gitalk/gitalk (MIT), pinned SHA below.
 * Builds are deliberately fail-closed; no obsolete CDN/DOM bridge fallback.
 */
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const https = require('node:https')
const { spawnSync } = require('node:child_process')
const { pipeline } = require('node:stream/promises')

const SHA = 'b1b478e877fac68d6632b843b00c33d3f32c2dad'
const site = path.resolve(__dirname, '..')

function replaceOne(source, before, after, name) {
  const i = source.indexOf(before)
  if (i < 0 || source.indexOf(before, i + before.length) >= 0) {
    throw new Error('Pinned Gitalk source contract changed: ' + name)
  }
  return source.slice(0, i) + after + source.slice(i + before.length)
}

function patch(filename, change) {
  const before = fs.readFileSync(filename, 'utf8')
  const after = change(before)
  if (before === after) throw new Error('Empty patch: ' + filename)
  fs.writeFileSync(filename, after)
}

function run(exe, argv, cwd) {
  const proc = spawnSync(exe, argv, { cwd, stdio: 'inherit' })
  if (proc.error) throw proc.error
  if (proc.status !== 0) throw new Error(exe + ' failed with ' + proc.status)
}

function download(url, dest, remaining = 4) {
  if (!url.startsWith('https://')) return Promise.reject(new Error('HTTPS required'))
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume()
        if (!remaining) return reject(new Error('Too many source redirects'))
        download(new URL(response.headers.location, url).href, dest, remaining - 1).then(resolve, reject)
        return
      }
      if (response.statusCode !== 200) {
        response.resume()
        return reject(new Error('Pinned Gitalk download HTTP ' + response.statusCode))
      }
      pipeline(response, fs.createWriteStream(dest)).then(resolve, reject)
    }).on('error', reject)
  })
}

function adapt(core) {
  patch(path.join(core, 'src', 'use-gitalk.ts'), original => {
    let s = replaceOne(original,
      'replyTarget: { id: number; login: string } | null',
      'replyTarget: { id: number; login: string; replyId?: number } | null',
      'replyTarget type')
    const action = [
      '  // Render this reply inside the clicked child, but publish to parent.id.',
      '  const replyToNested = useCallback((parent: GitalkComment, reply: GitalkReply) => {',
      '    setState(prev => {',
      '      if (prev.replyTarget?.id === parent.id && prev.replyTarget?.replyId === reply.id) {',
      "        return { ...prev, replyTarget: null, replyDraft: '' }",
      '      }',
      '      return {',
      '        ...prev,',
      '        replyTarget: { id: parent.id, login: parent.user.login, replyId: reply.id },',
      "        replyDraft: '@' + reply.user.login + ' '",
      '      }',
      '    })',
      '  }, [])',
      ''
    ].join('\n')
    s = replaceOne(s, '  const cancelReply = useCallback(() => {',
      action + '\n  const cancelReply = useCallback(() => {', 'nested reply action')
    return replaceOne(s, '      replyTo,\n      cancelReply,',
      '      replyTo,\n      replyToNested,\n      cancelReply,', 'action export')
  })

  patch(path.join(core, 'src', 'widget.tsx'), original => {
    let s = replaceOne(original,
      'replying={state.replyTarget?.id === comment.id}',
      'replying={state.replyTarget?.id === comment.id && state.replyTarget.replyId == null}\n' +
      '                  replyingId={state.replyTarget?.id === comment.id ? state.replyTarget.replyId : undefined}',
      'reply editor placement')
    return replaceOne(s, '                  onReplyInput={actions.setReplyDraft}',
      '                  onReplyToNested={meta.authenticated\n' +
      '                    ? actions.replyToNested\n' +
      "                    : () => actions.requireLogin('reply')}\n" +
      '                  onReplyInput={actions.setReplyDraft}', 'nested action wiring')
  })

  patch(path.join(core, 'src', 'components', 'comment.tsx'), original => {
    let s = replaceOne(original, '  replying: boolean\n',
      '  replying: boolean\n  replyingId?: number\n', 'reply id prop')
    s = replaceOne(s, '  onReply?: (comment: GitalkComment) => void\n',
      '  onReply?: (comment: GitalkComment) => void\n' +
      '  onReplyToNested?: (parent: GitalkComment, reply: GitalkReply) => void\n',
      'nested prop')
    s = replaceOne(s, '  replying,\n  replyDraft,',
      '  replying,\n  replyingId,\n  replyDraft,', 'reply id destructure')
    s = replaceOne(s, '  onReply,\n  onReplyInput,',
      '  onReply,\n  onReplyToNested,\n  onReplyInput,', 'nested action destructure')

    const start = s.indexOf('              {replies.map((reply) => (')
    const end = s.indexOf('              {pending.map((entry) => (', start)
    if (start < 0 || end < start) throw new Error('Pinned nested comment layout changed')
    let chunk = s.slice(start, end)
    chunk = replaceOne(chunk,
      '                          ) : null}\n                        </div>\n                      ) : null}',
      [
        '                          ) : null}',
        '                          {canReply && onReplyToNested ? (',
        '                            <button',
        '                              type="button"',
        '                              className="gt-comment-reply act"',
        '                              title={labels.reply}',
        '                              aria-expanded={replyingId === reply.id}',
        '                              onClick={() => onReplyToNested(comment, reply)}',
        '                            >',
        '                              {labels.reply}',
        '                            </button>',
        '                          ) : null}',
        '                        </div>',
        '                      ) : null}'
      ].join('\n'), 'nested reply button')
    chunk = replaceOne(chunk,
      '                      ) : null}\n                    </div>\n                  </div>\n                </article>',
      [
        '                      ) : null}',
        '                      {replyingId === reply.id && canReply ? (',
        '                        <ReplyBox',
        '                          value={replyDraft}',
        '                          candidates={candidates}',
        '                          submitting={replySubmitting}',
        '                          placeholder={labels.replyTo(reply.user.login)}',
        '                          mentionLabel={labels.mentionLabel}',
        '                          cancelLabel={labels.cancel}',
        '                          submitLabel={labels.submit}',
        '                          onInput={onReplyInput}',
        '                          onSubmit={onReplySubmit}',
        '                          onCancel={onReplyCancel}',
        '                        />',
        '                      ) : null}',
        '                    </div>',
        '                  </div>',
        '                </article>'
      ].join('\n'), 'native inline nested reply composer')
    return s.slice(0, start) + chunk + s.slice(end)
  })

  // Native reply preview extension: both parent and nested ReplyBox instances
  // use the existing trusted Gitalk backend Markdown renderer. Keep its state
  // separate from the top-level composer's preview to avoid draft collisions.
  patch(path.join(core, 'src', 'use-gitalk.ts'), original => {
    let s = replaceOne(original,
      '      refreshPreview,\n      toggleSort,',
      '      refreshPreview,\n      previewReply,\n      toggleSort,', 'reply preview action export')
    const action = [
      '  const previewReply = useCallback(async (body: string): Promise<string | null> => {',
      '    if (!body.trim()) return null',
      '    try {',
      '      return await backend.preview(body)',
      '    } catch (err) {',
      '      reportFailure(patch, err)',
      '      return null',
      '    }',
      '  }, [backend, patch])',
      ''
    ].join('\n')
    return replaceOne(s,
      '  const refreshPreview = useCallback(async () => {',
      action + '\n  const refreshPreview = useCallback(async () => {',
      'reply preview callback')
  })

  patch(path.join(core, 'src', 'widget.tsx'), original =>
    replaceOne(original,
      '                  onReplyInput={actions.setReplyDraft}',
      '                  onReplyPreview={actions.previewReply}\n                  onReplyInput={actions.setReplyDraft}',
      'reply preview callback wiring'))

  patch(path.join(core, 'src', 'components', 'comment.tsx'), original => {
    let s = replaceOne(original,
      '  onReplyInput: (value: string) => void',
      '  onReplyPreview?: (body: string) => Promise<string | null>\n  onReplyInput: (value: string) => void',
      'reply preview prop')
    s = replaceOne(s,
      '  onReplyInput,\n  onReplySubmit,',
      '  onReplyInput,\n  onReplyPreview,\n  onReplySubmit,',
      'reply preview destructure')
    const from = '              onInput={onReplyInput}'
    const to = '              onPreview={onReplyPreview}\n              previewLabel={labels.preview}\n              editLabel={labels.edit}\n              onInput={onReplyInput}'
    // Two ReplyBoxes: the root reply and the nested reply injected earlier.
    const matches = s.split(from).length - 1
    if (matches !== 2) throw new Error('Expected two native reply preview render sites, got ' + matches)
    s = s.split(from).join(to)
    s = replaceOne(s,
      '  mentionLabel: string\n  replyTo: (login: string) => string',
      '  mentionLabel: string\n  preview: string\n  edit: string\n  replyTo: (login: string) => string',
      'reply preview labels')
    return s
  })

  patch(path.join(core, 'src', 'widget.tsx'), original =>
    replaceOne(original,
      "      mentionLabel: t('mention-label'),",
      "      mentionLabel: t('mention-label'),\n      preview: t('preview'),\n      edit: t('edit'),",
      'reply preview translated labels'))

  patch(path.join(core, 'src', 'components', 'reply-box.tsx'), original => {
    let s = replaceOne(original,
      "import { useEffect, useRef } from 'preact/hooks'",
      "import { useEffect, useRef, useState } from 'preact/hooks'\nimport { MarkdownBody } from './markdown-body'",
      'native preview imports')
    s = replaceOne(s,
      '  submitLabel: string\n  onInput:',
      '  submitLabel: string\n  previewLabel?: string\n  editLabel?: string\n  onPreview?: (body: string) => Promise<string | null>\n  onInput:',
      'native preview prop types')
    s = replaceOne(s,
      '  submitLabel,\n  onInput,',
      '  submitLabel,\n  previewLabel,\n  editLabel,\n  onPreview,\n  onInput,',
      'native preview prop destructure')
    s = replaceOne(s,
      'const rootRef = useRef<HTMLDivElement>(null)',
      [
        'const rootRef = useRef<HTMLDivElement>(null)',
        'const previewSeq = useRef(0)',
        'const currentDraft = useRef(value)',
        'currentDraft.current = value',
        'const [previewHtml, setPreviewHtml] = useState<string | null>(null)',
        'const [previewBusy, setPreviewBusy] = useState(false)',
        'useEffect(() => () => { previewSeq.current++ }, [])',
        'const togglePreview = async () => {',
        '  if (previewHtml !== null) {',
        '    previewSeq.current++',
        '    setPreviewHtml(null)',
        '    setPreviewBusy(false)',
        '    return',
        '  }',
        '  if (!value.trim() || !onPreview || previewBusy) return',
        '  const seq = ++previewSeq.current',
        '  setPreviewBusy(true)',
        '  try {',
        '    const html = await onPreview(value)',
        '    if (seq === previewSeq.current && currentDraft.current === value && html !== null) setPreviewHtml(html)',
        '  } finally {',
        '    if (seq === previewSeq.current) setPreviewBusy(false)',
        '  }',
        '}'
      ].join('\n'), 'native reply preview state')
    const from = '      <MentionTextarea\n        className="gt-reply-textarea"'
    const to = '      <div className={previewHtml === null ? "gt-reply-editor" : "gt-reply-editor is--preview"}>\n        <MentionTextarea\n        className="gt-reply-textarea"'
    s = replaceOne(s, from, to, 'reply preview editor wrapper')
    s = replaceOne(s,
      '      <div className="gt-reply-actions">',
      [
        '        {previewHtml !== null ? (',
        '          <div className="gt-reply-preview markdown-body" role="region" aria-label={previewLabel ?? "Preview"}>',
        '            <MarkdownBody className="preview-body markdown-body" html={previewHtml} />',
        '          </div>',
        '        ) : null}',
        '      </div>',
        '      <div className="gt-reply-actions">',
        '        {onPreview ? (',
        '          <Button className="gt-btn-preview-reply"',
        '            disabled={!value.trim() || previewBusy}',
        '            onClick={() => { void togglePreview() }}>',
        '            {previewHtml === null ? (previewLabel ?? "Preview") : (editLabel ?? "Edit")}',
        '          </Button>',
        '        ) : null}'
      ].join('\n'), 'native preview markup')
    return s
  })


  // A revoked GitHub App user token can survive in localStorage. On a 401
  // from a TOKEN-AUTHENTICATED READ, renew once (singleflight), otherwise
  // discard only that invalid access token and retry the GET anonymously.
  // Never replay writes; neither draft text nor unrelated storage is touched.
  patch(path.join(core, 'src', 'auth.ts'), original => {
    let s = replaceOne(original,
      '  private expiresAt = 0',
      '  private expiresAt = 0\n  private unauthorizedRecovery: Promise<void> | null = null',
      '401 recovery singleflight field')
    const method = [
      '  /** Recover one rejected access token without clearing drafts or a usable session. */',
      '  async recoverUnauthorizedToken(rejected: string): Promise<void> {',
      '    if (!rejected || this.getToken() !== rejected) return',
      '    if (this.unauthorizedRecovery) {',
      '      await this.unauthorizedRecovery',
      '      return',
      '    }',
      '    const pending = (async () => {',
      '      try {',
      '        if (this.hasSession()) await this.refresh()',
      '      } catch {',
      '        // A transient proxy error is not proof that the refresh session is invalid.',
      '      }',
      '      // Do not erase a newer token established by another in-flight login.',
      '      if (this.getToken() === rejected) {',
      '        this.token = null',
      '        this.expiresAt = 0',
      '        removeStored(STORAGE_KEY)',
      '        removeStored(EXPIRES_KEY)',
      '      }',
      '    })()',
      '    this.unauthorizedRecovery = pending',
      '    try { await pending } finally {',
      '      if (this.unauthorizedRecovery === pending) this.unauthorizedRecovery = null',
      '    }',
      '  }',
      ''
    ].join('\n')
    return replaceOne(s, '  /** Persist draft so a round trip to GitHub does not lose it. */',
      method + '\n  /** Persist draft so a round trip to GitHub does not lose it. */',
      '401 recovery Auth method')
  })

  patch(path.join(core, 'src', 'api', 'client.ts'), original => {
    let s = replaceOne(original,
      '    private readonly baseUrl: string = GITHUB_API\n  ) {}',
      '    private readonly baseUrl: string = GITHUB_API,\n' +
      '    private readonly onUnauthorized?: (rejectedToken: string) => Promise<void>\n  ) {}',
      '401 recovery optional callback')
    const retry = [
      '    // Only retry safe reads. The callback may renew the session or drop a',
      '    // rejected token, allowing public comments to load anonymously.',
      '    // Never automatically repeat POST/mutations or loop on a second 401.',
      "    if (response.status === 401 && token && (init.method ?? 'GET').toUpperCase() === 'GET' && this.onUnauthorized) {",
      '      await this.onUnauthorized(token)',
      '      const replacement = this.getToken()',
      '      const retryHeaders = { ...headers }',
      '      if (replacement) retryHeaders.Authorization = "Bearer " + replacement',
      '      else delete retryHeaders.Authorization',
      '      try {',
      '        response = await fetch(this.baseUrl + path, { ...init, headers: retryHeaders })',
      '      } catch (err) {',
      '        throw new GitalkError("Network error: " + (err as Error).message)',
      '      }',
      '    }',
      ''
    ].join('\n')
    return replaceOne(s, '    if (response.status === 429) throw new RateLimitError()',
      retry + '\n    if (response.status === 429) throw new RateLimitError()',
      '401 retry only GET')
  })

  patch(path.join(core, 'src', 'use-gitalk.ts'), original =>
    replaceOne(original,
      '    () => new HttpClient(() => auth.getToken()),',
      [ 
        '    () => new HttpClient(() => auth.getToken(), GITHUB_API, async rejected => {',
        '      await auth.recoverUnauthorizedToken(rejected)',
        '      if (!auth.getToken()) patch({ user: null })',
        '    }),'
      ].join('\n'),
      '401 recovery client wiring'))


  // /user requires authentication, so its anonymous retry after an invalid
  // token legitimately returns 401. Treat it as signed-out, not a page error.
  patch(path.join(core, 'src', 'use-gitalk.ts'), original => {
    let s = replaceOne(original,
      '    const me = await http.get<{',
      '    const me = await http.get<{',
      '401 viewer read anchor')
    const old = [
      "    }>('/user')",
      "    // A sign-out can land while"
    ].join('\n')
    const newer = [
      "    }>('/user').catch(err => {",
      "      if (err instanceof GitalkError && err.status === 401 && !auth.getToken()) return null",
      "      throw err",
      "    })",
      "    if (!me) {",
      "      viewerRef.current = null",
      "      patch({ user: null })",
      "      return null",
      "    }",
      "    // A sign-out can land while"
    ].join('\n')
    return replaceOne(s, old, newer, '401 anonymous /user handling')
  })


  // Keep the login prompt at the clicked reply, not at the top of the
  // potentially long scrolling comment list. Both parent and nested buttons
  // already route unauthenticated clicks through requireLogin('reply').
  patch(path.join(core, 'src', 'use-gitalk.ts'), original => {
    let s = replaceOne(original,
      '  notice: string | null\n',
      '  notice: string | null\n  replyLoginPrompt: boolean\n',
      'reply prompt state type')
    s = replaceOne(s,
      '    notice: null,\n    imageUploading:',
      '    notice: null,\n    replyLoginPrompt: false,\n    imageUploading:',
      'reply prompt state initial')
    s = replaceOne(s,
      '      patch({ notice: message })',
      "      patch({ notice: message, replyLoginPrompt: reason === 'reply' })",
      'reply prompt routing')
    return replaceOne(s,
      '  const dismissNotice = useCallback(() => patch({ notice: null }), [patch])',
      '  const dismissNotice = useCallback(() => patch({ notice: null, replyLoginPrompt: false }), [patch])',
      'reply prompt dismissal')
  })

  patch(path.join(core, 'src', 'widget.tsx'), original => {
    let s = replaceOne(original,
      '  const fabRef = useRef<HTMLButtonElement>(null)',
      '  const fabRef = useRef<HTMLButtonElement>(null)\n  const replyLoginDialogRef = useRef<HTMLDialogElement>(null)',
      'reply prompt dialog ref')
    s = replaceOne(s,
      '  const expand = () => {',
      [
        '  // A modal dialog is in the browser top layer: it stays visible even',
        '  // when the reply is far down an overflow-clipped comments list.',
        '  useEffect(() => {',
        '    const dialog = replyLoginDialogRef.current',
        '    if (!dialog || !state.replyLoginPrompt) return',
        '    if (!dialog.open) {',
        '      if (typeof dialog.showModal === "function") dialog.showModal()',
        '      else dialog.setAttribute("open", "")',
        '    }',
        '  }, [state.replyLoginPrompt])',
        '',
        '  const expand = () => {'
      ].join('\n'), 'reply dialog top layer effect')
    s = replaceOne(s,
      '      {state.notice ? (',
      '      {state.notice && !state.replyLoginPrompt ? (',
      'hide offscreen duplicate reply notice')
    const prompt = [
      '      {state.replyLoginPrompt && !meta.authenticated ? (',
      '        <dialog',
      '          ref={replyLoginDialogRef}',
      '          className="gt-reply-login-dialog"',
      '          aria-label={t("login-to-reply")}',
      '          onCancel={(event) => { event.preventDefault(); actions.dismissNotice() }}',
      '          onClose={actions.dismissNotice}',
      '        >',
      '          <p className="gt-reply-login-message">{t("login-to-reply")}</p>',
      '          <div className="gt-reply-login-actions">',
      '            <button type="button" className="gt-reply-login-cancel" onClick={actions.dismissNotice}>',
      '              {t("cancel")}',
      '            </button>',
      '            {meta.canLogin ? (',
      '              <a className="gt-reply-login-confirm" href={loginHref} onClick={onLoginClick}>',
      '                {t("login-with-github")}',
      '              </a>',
      '            ) : null}',
      '          </div>',
      '        </dialog>',
      '      ) : null}',
      ''
    ].join('\n')
    return replaceOne(s,
      '      {state.error ? (',
      prompt + '\n      {state.error ? (',
      'native reply prompt markup')
  })


  // The signed-out composer shares the reply login dialog (rather than being
  // a read-only dead textarea). Both its field and its green button require
  // an explicit confirmation before starting the existing OAuth flow.
  patch(path.join(core, 'src', 'use-gitalk.ts'), original =>
    replaceOne(original,
      "      patch({ notice: message, replyLoginPrompt: reason === 'reply' })",
      "      patch({ notice: message, replyLoginPrompt: reason === 'reply' || reason === 'comment' })",
      'anonymous composer modal routing'))

  patch(path.join(core, 'src', 'widget.tsx'), original => {
    let s = replaceOne(original,
      '          aria-label={t("login-to-reply")}',
      '          aria-label={state.notice || t("login-to-reply")}',
      'modal label for comments and replies')
    s = replaceOne(s,
      '          <p className="gt-reply-login-message">{t("login-to-reply")}</p>',
      '          <p className="gt-reply-login-message">{state.notice || t("login-to-reply")}</p>',
      'modal message for comments and replies')
    s = replaceOne(s,
      [
        '                  <textarea',
        '                    className="gt-composer-login-field"',
        '                    readOnly',
        '                    rows={1}',
        "                    placeholder={t('login-placeholder')}",
        "                    aria-label={t('login-placeholder')}",
        '                  />'
      ].join('\n'),
      [
        '                  <button',
        '                    type="button"',
        '                    className="gt-composer-login-field"',
        "                    title={t('login-to-comment')}",
        "                    aria-label={t('login-to-comment')}",
        "                    onClick={() => actions.requireLogin('comment')}",
        '                  >',
        "                    {t('login-placeholder')}",
        '                  </button>'
      ].join('\n'), 'signed-out composer accessible click target')
    s = replaceOne(s,
      '                    className="gt-btn gt-btn-login gt-composer-login-btn"\n                    href={loginHref}\n                    onClick={onLoginClick}',
      '                    className="gt-btn gt-btn-login gt-composer-login-btn"\n                    href={loginHref}\n                    onClick={(event) => { event.preventDefault(); actions.requireLogin("comment") }}',
      'signed-out small login button modal route')
    return replaceOne(s,
      "                    <span className=\"gt-btn-text\">{t('login')}</span>",
      "                    <span className=\"gt-btn-text\">{t('login-with-github')}</span>",
      'signed-out login button explicit GitHub label')
  })

}

async function main() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'weig-gitalk2-'))
  try {
    const tgz = path.join(temp, 'upstream.tar.gz')
    await download('https://codeload.github.com/gitalk/gitalk/tar.gz/' + SHA, tgz)
    run('tar', ['-xzf', tgz, '-C', temp], temp)
    const dir = fs.readdirSync(temp).find(x => x.startsWith('gitalk-') &&
      fs.statSync(path.join(temp, x)).isDirectory())
    if (!dir) throw new Error('Pinned source directory missing')
    const core = path.join(temp, dir, 'packages', 'core')
    const manifest = JSON.parse(fs.readFileSync(path.join(core, 'package.json'), 'utf8'))
    if (manifest.version !== '2.0.0-beta.0') throw new Error('Unexpected Gitalk version')
    adapt(core)
    // Offline regression checks run on the actual patched TypeScript before
    // fetching npm dependencies. TypeScript checks the full core before bundling.
    run(process.execPath, [path.join(site, 'tools', 'test-gitalk2-401.cjs'), core], core)
    run(process.execPath, [path.join(site, 'tools', 'test-gitalk2-reply-login.cjs'), core], core)
    run('npm', ['install', '--no-audit', '--no-fund', '--no-package-lock'], core)
    run(process.execPath, [path.join(core, 'node_modules', 'typescript', 'bin', 'tsc'), '-p', 'tsconfig.types.json'], core)
    const vite = path.join(core, 'node_modules', 'vite', 'bin', 'vite.js')
    run(process.execPath, [vite, 'build'], core)
    run(process.execPath, [vite, 'build', '--config', 'vite.iife.config.ts'], core)
    for (const [filename, target] of [
      ['gitalk.js', path.join(site, 'themes/butterfly/source/js/weig-gitalk2-vendor.js')],
      ['gitalk.css', path.join(site, 'themes/butterfly/source/css/weig-gitalk2-vendor.css')]
    ]) {
      const source = path.join(core, 'dist', filename)
      if (!fs.existsSync(source)) throw new Error('Missing Gitalk build asset: ' + filename)
      fs.mkdirSync(path.dirname(target), { recursive: true })
      fs.copyFileSync(source, target)
    }
    console.log('Gitalk native inline nested reply bundle generated from ' + SHA)
  } finally {
    fs.rmSync(temp, { recursive: true, force: true })
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })

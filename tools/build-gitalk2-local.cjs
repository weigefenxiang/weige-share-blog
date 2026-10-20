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
    run('npm', ['install', '--no-audit', '--no-fund', '--no-package-lock'], core)
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

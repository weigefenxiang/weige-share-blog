import { useState } from 'preact/hooks'

/** Trust only a confirmed GitHub Discussions URL from the active Gitalk
 * thread, and a comment permalink belonging to that same Discussion.
 * Never generate a number from a translated article title.
 */
export function resolveGitHubDiscussionUrl(
  threadUrl: string | null | undefined,
  commentUrl?: string | null
): string | null {
  if (!threadUrl) return null
  try {
    const thread = new URL(threadUrl)
    if (thread.protocol !== 'https:' || thread.hostname !== 'github.com' ||
        thread.username || thread.password || thread.search ||
        !/^\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/discussions\/[1-9][0-9]*\/?$/.test(thread.pathname)) return null
    thread.hash = ''
    if (!commentUrl) return thread.href
    const target = new URL(commentUrl)
    // DiscussionComment permalinks are returned by GitHub, not constructed here.
    if (target.origin === thread.origin &&
        target.pathname.replace(/\/$/, '') === thread.pathname.replace(/\/$/, '') &&
        !target.username && !target.password && !target.search &&
        /^#discussioncomment-[A-Za-z0-9_-]+$/.test(target.hash)) return target.href
    return thread.href
  } catch {
    return null
  }
}

interface GitHubDraftLinkProps {
  threadUrl: string | null | undefined
  commentUrl?: string | null
  draft: string
  language?: string
}

/** A native target=_blank link guarantees the blog stays open. Clipboard
 * copy is initiated by the same trusted click, without blocking navigation.
 * Failure shows a manual-copy field while the original draft stays intact.
 */
export function GitHubDraftLink({ threadUrl, commentUrl, draft, language }: GitHubDraftLinkProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'manual'>('idle')
  const href = resolveGitHubDiscussionUrl(threadUrl, commentUrl)
  const zh = /^zh/i.test(language ?? '')
  const title = zh ? 'GitHub 上传附件' : 'Upload on GitHub'
  const copy = () => {
    if (!draft) { setStatus('idle'); return }
    const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined
    if (!clipboard?.writeText) { setStatus('manual'); return }
    try {
      void clipboard.writeText(draft).then(
        () => setStatus('copied'),
        () => setStatus('manual')
      )
    } catch {
      setStatus('manual')
    }
  }
  return (
    <div className="gt-github-draft-transfer">
      {href ? (
        <a className="gt-github-draft-link" href={href} target="_blank"
          rel="noopener noreferrer" onClick={copy} title={title}
          aria-label={title}>
          <span aria-hidden="true">📎</span>
          <span className="gt-github-draft-label">{title}</span>
          <span aria-hidden="true">↗</span>
        </a>
      ) : (
        <button type="button" className="gt-github-draft-link" disabled
          title={zh ? '尚未找到对应讨论' : 'Discussion not available'}>{title}</button>
      )}
      {status === 'copied' && draft ? (
        <span className="gt-github-draft-status" role="status">
          {zh ? '已复制评论内容' : 'Comment copied'}
        </span>
      ) : null}
      {status === 'manual' ? (
        <label className="gt-github-copy-fallback">
          <span>{zh ? '复制未成功' : 'Copy failed'}</span>
          <textarea readOnly value={draft}
            aria-label={zh ? '手动复制评论' : 'Copy comment manually'}
            onFocus={event => event.currentTarget.select()} />
        </label>
      ) : null}
    </div>
  )
}

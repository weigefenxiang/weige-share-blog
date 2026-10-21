import { useEffect, useRef, useState } from 'preact/hooks'
import type { MentionCandidate } from '../mentions'
import type { MentionTextareaHandle } from './mention-textarea'
import { CommentEditor } from './comment-editor'
import { AccountStrip } from './account-strip'
import { Button } from './button'
import { EditorUpload } from './editor-upload'
import { EditorFooter } from './editor-footer'
import type { EditorUploadConfig } from './editor-upload'
import { buildImageMarkdown } from '../images'
import type { GitalkUploadedImage } from '../types'

interface ReplyBoxProps {
  value: string
  candidates: MentionCandidate[]
  submitting: boolean
  placeholder: string
  mentionLabel: string
  cancelLabel: string
  submitLabel: string
  editLabel?: string
  previewLabel?: string
  onPreview?: (body: string) => Promise<string | null>
  language?: string
  currentUser?: { login: string; avatarUrl: string } | null
  logoutLabel?: string
  onLogout?: () => void
  upload?: Omit<EditorUploadConfig, 'onFiles' | 'retry'> & {
    uploadFiles: (files: File[]) => Promise<GitalkUploadedImage[] | null>
  }
  onInput: (value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

/** Reuses the same editor shell, formatting commands, and GitHub preview as
 * the main composer. Backend replies still target their top-level parent. */
export function ReplyBox(props: ReplyBoxProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<MentionTextareaHandle | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const request = useRef(0)
  const current = useRef(props.value)
  current.current = props.value

  useEffect(() => {
    const el = rootRef.current
    if (typeof window === 'undefined' || !el) return
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView?.({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
  }, [])
  useEffect(() => () => { request.current++ }, [])

  const uploadFiles = async (files: File[]) => {
    const images = await props.upload?.uploadFiles(files)
    if (!images) return
    handleRef.current?.insertAtCaret(images.map(buildImageMarkdown).join('\n\n'))
    request.current++
    setPreviewHtml(null)
    setBusy(false)
  }
  const update = (next: string) => {
    current.current = next
    request.current++
    setPreviewHtml(null)
    setBusy(false)
    props.onInput(next)
  }
  const togglePreview = async () => {
    if (previewHtml !== null) {
      request.current++
      setPreviewHtml(null)
      setBusy(false)
      return
    }
    if (!props.onPreview || !props.value.trim() || busy) return
    const seq = ++request.current
    const snapshot = props.value
    setBusy(true)
    try {
      const html = await props.onPreview(snapshot)
      if (seq === request.current && snapshot === current.current && html !== null) setPreviewHtml(html)
    } finally {
      if (seq === request.current) setBusy(false)
    }
  }

  return (
    <div ref={rootRef} className="gt-reply-box" role="group" aria-label={props.placeholder}>
      <CommentEditor
        className="gt-reply-editor"
        textareaClassName="gt-reply-textarea"
        previewClassName="gt-reply-preview"
        value={props.value}
        candidates={props.candidates}
        placeholder={props.placeholder}
        listLabel={props.mentionLabel}
        language={props.language}
        editLabel={props.editLabel ?? 'Edit'}
        previewLabel={props.previewLabel ?? 'Preview'}
        previewing={previewHtml !== null}
        previewHtml={previewHtml ?? ''}
        previewBusy={busy}
        onTogglePreview={() => { void togglePreview() }}
        onInput={update}
        onSubmit={props.onSubmit}
        onEscape={props.onCancel}
        handleRef={handleRef}
        onFiles={props.upload ? (files) => { void uploadFiles(files) } : undefined}
        autoFocus
      />
      <EditorFooter className="gt-reply-actions"
        account={<AccountStrip user={props.currentUser ?? null}
          logoutLabel={props.logoutLabel ?? 'Logout'} onLogout={props.onLogout ?? (() => {})} />}
        upload={<EditorUpload config={props.upload ? {
          ...props.upload,
          onFiles: files => { void uploadFiles(files) },
          retry: () => { const failed = props.upload?.error; if (failed) void uploadFiles(failed.files) }
        } : undefined} />}>
        <Button className="gt-btn-cancel-reply" onClick={props.onCancel}>{props.cancelLabel}</Button>
        <Button className="gt-btn-public gt-btn-submit-reply"
          loading={props.submitting} disabled={!props.value.trim()} onClick={props.onSubmit}>
          {props.submitLabel}
        </Button>
      </EditorFooter>
    </div>
  )
}

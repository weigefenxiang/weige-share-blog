import { useRef, useState } from 'preact/hooks'
import type { MentionCandidate } from '../mentions'
import type { MarkdownCommand } from '../markdown-commands'
import { MarkdownBody } from './markdown-body'
import { MentionTextarea } from './mention-textarea'
import type { MentionTextareaHandle } from './mention-textarea'
import { MarkdownToolbar } from './markdown-toolbar'

interface CommentEditorProps {
  value: string
  candidates: MentionCandidate[]
  className: string
  textareaClassName: string
  previewClassName: string
  placeholder: string
  listLabel: string
  language?: string
  previewLabel: string
  editLabel: string
  previewing: boolean
  previewBusy: boolean
  previewHtml: string
  onTogglePreview: () => void
  onInput: (next: string) => void
  onSubmit: () => void
  onEscape?: () => void
  handleRef?: { current: MentionTextareaHandle | null }
  autoFocus?: boolean
  submitOnPlainEnter?: boolean
  rtl?: boolean
}

/** One shared editor shell for main comments and all reply targets.
 * Backend submission, draft ownership and upload transport stay in the host.
 */
export function CommentEditor(props: CommentEditorProps) {
  const ownHandle = useRef<MentionTextareaHandle | null>(null)
  const handle = props.handleRef ?? ownHandle
  const [history, setHistory] = useState({ undo: false, redo: false })
  const format = (command: MarkdownCommand) => {
    if (!props.previewing) handle.current?.format(command)
  }
  return (
    <div className={props.className + ' gt-shared-editor' + (props.previewing ? ' is--preview' : '')}>
      <div className="gt-shared-editor-top">
        <div className="gt-editor-tabs" role="group" aria-label="Markdown">
          <button type="button" className="gt-editor-tab"
            aria-pressed={!props.previewing} onClick={props.previewing ? props.onTogglePreview : undefined}>
            {props.editLabel}
          </button>
          <button type="button" className="gt-editor-tab"
            aria-pressed={props.previewing} disabled={!props.value.trim() || props.previewBusy}
            onClick={!props.previewing ? props.onTogglePreview : undefined}>
            {props.previewLabel}
          </button>
        </div>
        <MarkdownToolbar language={props.language} disabled={props.previewing} onCommand={format}
          onMention={() => handle.current?.mention()}
          onUndo={() => handle.current?.undo()}
          onRedo={() => handle.current?.redo()}
          canUndo={history.undo} canRedo={history.redo} />
      </div>
      <div className="gt-shared-editor-stage">
        <MentionTextarea className={props.textareaClassName}
          value={props.value} candidates={props.candidates}
          placeholder={props.placeholder} ariaLabel={props.placeholder}
          listLabel={props.listLabel} rows={3} autoFocus={props.autoFocus}
          handleRef={handle} caretAvailable={!props.previewing}
          onHistoryChange={(undo, redo) => setHistory(previous =>
            previous.undo === undo && previous.redo === redo ? previous : {undo, redo})}
          onInput={props.onInput} onSubmit={props.onSubmit}
          onEscape={props.onEscape} submitOnPlainEnter={props.submitOnPlainEnter} />
        {props.previewing ? (
          <div className={props.previewClassName} role="region" aria-label={props.previewLabel}>
            <MarkdownBody className="preview-body markdown-body" html={props.previewHtml} rtl={props.rtl} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

import { useRef } from 'preact/hooks'
import type { MarkdownCommand } from '../markdown-commands'

interface MarkdownToolbarProps {
  language?: string
  disabled?: boolean
  onCommand: (command: MarkdownCommand) => void
  onMention: () => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
}
const FORMATS: ReadonlyArray<{ command: MarkdownCommand; symbol: string; label: string }> = [
  { command: 'heading', symbol: 'H', label: 'Heading' },
  { command: 'bold', symbol: 'B', label: 'Bold' },
  { command: 'italic', symbol: 'I', label: 'Italic' },
  { command: 'quote', symbol: '❝', label: 'Quote' },
  { command: 'code', symbol: '<>', label: 'Inline code' },
  { command: 'codeblock', symbol: '{}', label: 'Code block' },
  { command: 'link', symbol: '↗', label: 'Link' },
  { command: 'unordered', symbol: '•', label: 'Bullet list' },
  { command: 'ordered', symbol: '1.', label: 'Numbered list' },
  { command: 'task', symbol: '☑', label: 'Task list' }
]
const ZH: Record<MarkdownCommand, string> = {
  heading: '标题', bold: '粗体', italic: '斜体', quote: '引用',
  code: '行内代码', codeblock: '代码块', link: '链接',
  unordered: '无序列表', ordered: '有序列表', task: '任务列表'
}
const LOCALES: Record<string, Partial<Record<MarkdownCommand, string>>> = {
  'zh-cn': ZH, 'zh-tw': ZH,
  ja: {heading:'見出し',bold:'太字',italic:'斜体',quote:'引用',link:'リンク'},
  ko: {heading:'제목',bold:'굵게',italic:'기울임꼴',quote:'인용',link:'링크'},
  de: {heading:'Überschrift',bold:'Fett',italic:'Kursiv',quote:'Zitat',link:'Link'},
  fr: {heading:'Titre',bold:'Gras',italic:'Italique',quote:'Citation',link:'Lien'},
  es: {heading:'Título',bold:'Negrita',italic:'Cursiva',quote:'Cita',link:'Enlace'},
  pt: {heading:'Título',bold:'Negrito',italic:'Itálico',quote:'Citação',link:'Ligação'},
  ru: {heading:'Заголовок',bold:'Жирный',italic:'Курсив',quote:'Цитата',link:'Ссылка'}
}
type ToolbarAction = MarkdownCommand | 'mention' | 'undo' | 'redo'
const EXTRA: ReadonlyArray<{command: ToolbarAction; symbol: string; label: string}> = [
  { command: 'mention', symbol: '@', label: 'Mention a participant' },
  { command: 'undo', symbol: '↶', label: 'Undo' },
  { command: 'redo', symbol: '↷', label: 'Redo' }
]



/** Common editor toolbar at every reply depth.
 * Container queries select wide or compact presentation, never render
 * a second editor or duplicate draft state.
 */
/** Shared toolbar, with real commands and one compact overflow menu. */
export function MarkdownToolbar({
  language = 'en', disabled, onCommand, onMention, onUndo, onRedo, canUndo, canRedo
}: MarkdownToolbarProps) {
  const labels = LOCALES[language.toLowerCase()] ?? LOCALES[language.slice(0, 2).toLowerCase()] ?? {}
  const dropdown = useRef<HTMLDetailsElement>(null)
  const chinese = /^zh/i.test(language)
  const compactName = chinese ? '更多格式' : 'More formatting'
  const extraLabels = chinese
    ? { mention: '提及用户', undo: '撤销', redo: '重做' }
    : { mention: 'Mention a participant', undo: 'Undo', redo: 'Redo' }
  const primary: ReadonlyArray<{command: ToolbarAction; symbol: string; label: string}> =
    [...FORMATS.slice(0, 3), EXTRA[0]]
  const extended: ReadonlyArray<{command: ToolbarAction; symbol: string; label: string}> =
    [...FORMATS.slice(3), EXTRA[1], EXTRA[2]]
  const action = (command: ToolbarAction) => {
    if (command === 'mention') onMention()
    else if (command === 'undo') onUndo()
    else if (command === 'redo') onRedo()
    else onCommand(command)
  }
  const button = ({ command, symbol, label }: typeof primary[number], compact = false) => {
    const labelText = command === 'mention' || command === 'undo' || command === 'redo'
      ? extraLabels[command]
      : labels[command] ?? label
    return (
      <button key={command} type="button"
        className={'gt-format-btn' + (compact ? ' gt-format-in-menu' : '')}
        data-command={command}
        aria-label={labelText} title={labelText}
        disabled={disabled || (command === 'undo' && !canUndo) || (command === 'redo' && !canRedo)}
        onMouseDown={event => event.preventDefault()}
        onClick={() => {
          action(command)
          if (compact && dropdown.current) dropdown.current.open = false
        }}>
        <span aria-hidden="true">{symbol}</span>
      </button>
    )
  }
  return (
    <div className="gt-markdown-toolbar" role="toolbar" aria-label="Markdown">
      {primary.map(item => button(item))}
      <span className="gt-format-extra">{extended.map(item => button(item))}</span>
      <details className="gt-format-overflow" ref={dropdown}>
        <summary title={compactName} aria-label={compactName}>⋯</summary>
        <div className="gt-format-menu" role="group" aria-label={compactName}>
          {extended.map(item => button(item, true))}
        </div>
      </details>
    </div>
  )
}

import type { MarkdownCommand } from '../markdown-commands'

interface MarkdownToolbarProps {
  language?: string
  disabled?: boolean
  onCommand: (command: MarkdownCommand) => void
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

export function MarkdownToolbar({ language = 'en', disabled, onCommand }: MarkdownToolbarProps) {
  const labels = LOCALES[language.toLowerCase()] ?? LOCALES[language.slice(0, 2).toLowerCase()] ?? {}
  return (
    <div className="gt-markdown-toolbar" role="toolbar" aria-label="Markdown">
      {FORMATS.map(({ command, symbol, label }) => (
        <button key={command} type="button" className="gt-format-btn"
          data-command={command}
          aria-label={labels[command] ?? label}
          title={labels[command] ?? label}
          disabled={disabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onCommand(command)}>
          <span aria-hidden="true">{symbol}</span>
        </button>
      ))}
    </div>
  )
}

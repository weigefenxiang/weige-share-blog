/** Pure Markdown edits: no DOM access, shared by main and nested composers. */
export type MarkdownCommand = 'heading' | 'bold' | 'italic' | 'quote' | 'code' | 'codeblock' | 'link' | 'unordered' | 'ordered' | 'task'
export interface MarkdownEdit { text: string; selectionStart: number; selectionEnd: number }

export function applyMarkdownCommand(text: string, begin: number, finish: number, command: MarkdownCommand): MarkdownEdit {
  const start = Math.max(0, Math.min(text.length, begin))
  const end = Math.max(start, Math.min(text.length, finish))
  const selection = text.slice(start, end)
  let from = start
  let to = end
  let inserted = ''
  let caretFrom = start
  let caretTo = start
  const tick = String.fromCharCode(96)

  const wrapped = (left: string, right: string, fallback: string) => {
    const value = selection || fallback
    inserted = left + value + right
    caretFrom = start + left.length
    caretTo = caretFrom + value.length
  }
  const lineCommand = (prefix: (index: number) => string) => {
    from = text.lastIndexOf('\n', start - 1) + 1
    to = text.indexOf('\n', end)
    if (to === -1) to = text.length
    const lines = text.slice(from, to).split('\n')
    inserted = lines.map((line, index) => prefix(index) + line).join('\n')
    caretFrom = from
    caretTo = from + inserted.length
  }
  switch (command) {
    case 'heading': lineCommand(() => '## '); break
    case 'quote': lineCommand(() => '> '); break
    case 'unordered': lineCommand(() => '- '); break
    case 'ordered': lineCommand(i => String(i + 1) + '. '); break
    case 'task': lineCommand(() => '- [ ] '); break
    case 'bold': wrapped('**', '**', 'bold'); break
    case 'italic': wrapped('*', '*', 'italic'); break
    case 'code': wrapped(tick, tick, 'code'); break
    case 'codeblock': {
      const value = selection || 'code'
      const fence = tick.repeat(3)
      inserted = '\n' + fence + '\n' + value + '\n' + fence + '\n'
      caretFrom = start + fence.length + 2
      caretTo = caretFrom + value.length
      break
    }
    case 'link': wrapped('[', '](https://)', 'link text'); break
  }
  return { text: text.slice(0, from) + inserted + text.slice(to), selectionStart: caretFrom, selectionEnd: caretTo }
}

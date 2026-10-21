/** Undo/redo for the controlled Gitalk editor. One instance per textarea.
 * Pure and bounded, so programmatic Markdown edits and user typing share history.
 */
export interface EditorSnapshot {
  text: string
  caret: number
}
export class EditorHistory {
  private current: string
  private past: EditorSnapshot[] = []
  private future: EditorSnapshot[] = []
  private readonly limit: number
  constructor(initial: string, limit = 100) { this.current = initial; this.limit = limit }

  /** Called when the host replaces the draft (login, reply target, reset). */
  sync(next: string) {
    if (next === this.current) return
    this.current = next
    this.past = []
    this.future = []
  }
  record(next: string, caret: number) {
    if (next === this.current) return
    this.past.push({ text: this.current, caret: Math.max(0, caret) })
    if (this.past.length > this.limit) this.past.shift()
    this.current = next
    this.future = []
  }
  undo(caret: number): EditorSnapshot | null {
    const previous = this.past.pop()
    if (!previous) return null
    this.future.push({ text: this.current, caret })
    this.current = previous.text
    return previous
  }
  redo(caret: number): EditorSnapshot | null {
    const next = this.future.pop()
    if (!next) return null
    this.past.push({ text: this.current, caret })
    this.current = next.text
    return next
  }
  canUndo() { return this.past.length > 0 }
  canRedo() { return this.future.length > 0 }
}

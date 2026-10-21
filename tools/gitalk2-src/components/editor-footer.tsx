import type { ComponentChildren } from 'preact'

interface EditorFooterProps {
  className?: string
  account?: ComponentChildren
  external?: ComponentChildren
  children: ComponentChildren
}
/** Main comment and all reply levels use the same three footer slots. */
export function EditorFooter({ className = '', account, external, children }: EditorFooterProps) {
  return (
    <div className={(className + ' gt-editor-footer').trim()}>
      <div className="gt-footer-account">{account}</div>
      <div className="gt-footer-center">{external}</div>
      <div className="gt-footer-actions">{children}</div>
    </div>
  )
}

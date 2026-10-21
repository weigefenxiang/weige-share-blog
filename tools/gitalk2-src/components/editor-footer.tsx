import type { ComponentChildren } from 'preact'

interface EditorFooterProps {
  className?: string
  account?: ComponentChildren
  upload?: ComponentChildren
  children: ComponentChildren
}
/** Main comment and all reply levels use the same three footer slots. */
export function EditorFooter({ className = '', account, upload, children }: EditorFooterProps) {
  return (
    <div className={(className + ' gt-editor-footer').trim()}>
      <div className="gt-footer-account">{account}</div>
      <div className="gt-footer-center">{upload}</div>
      <div className="gt-footer-actions">{children}</div>
    </div>
  )
}

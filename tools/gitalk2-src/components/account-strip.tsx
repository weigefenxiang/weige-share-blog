import { Avatar } from './avatar'

interface AccountStripProps {
  user: { login: string; avatarUrl: string } | null
  logoutLabel: string
  onLogout: () => void
}
/** Shared account footer. The host owns the logout/draft confirmation policy. */
export function AccountStrip({ user, logoutLabel, onLogout }: AccountStripProps) {
  if (!user) return null
  return (
    <div className="gt-editor-account">
      <Avatar className="gt-editor-account-avatar" src={user.avatarUrl} alt={user.login} />
      <span className="gt-editor-account-login" title={'@' + user.login}>@{user.login}</span>
      <button type="button" className="gt-editor-account-logout" onClick={onLogout}>
        <span className="gt-editor-logout-text">{logoutLabel}</span>
        <span className="gt-editor-logout-icon" aria-hidden="true">⇥</span>
      </button>
    </div>
  )
}

import { ImageUploadButton, ImageUploadError } from './image-upload'
import type { GitalkImageUploadError } from '../types'
import type { Translator } from '../i18n'

/** Shared footer upload action for the root and every reply. No configured
 * authenticated handler => no button, no simulated upload or stored token.
 */
export interface EditorUploadConfig {
  t: Translator
  label?: string
  uploading: boolean
  progress: { loaded: number; total: number } | null
  error: GitalkImageUploadError | null
  accept?: string
  onFiles: (files: File[]) => void
  cancel: () => void
  retry: () => void
}

export function EditorUpload({ config }: { config?: EditorUploadConfig }) {
  if (!config) return null
  return (
    <div className="gt-footer-upload">
      <ImageUploadButton
        uploading={config.uploading}
        progress={config.progress}
        label={config.label ?? config.t('upload-image')}
        uploadingLabel={config.t('uploading-image')}
        cancelLabel={config.t('cancel')}
        accept={config.accept}
        onFiles={config.onFiles}
        onCancel={config.cancel}
      />
      {config.error ? <ImageUploadError error={config.error} t={config.t} onRetry={config.retry} /> : null}
    </div>
  )
}

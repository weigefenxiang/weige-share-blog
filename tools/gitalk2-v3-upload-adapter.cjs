'use strict'
/** Optional file upload wiring for pinned Gitalk V3.
 * Works on already adapted native sources; no DOM patching or fake controls.
 * Leaves the upload action hidden when no verified host transport is configured.
 */
const fs = require('node:fs')
const path = require('node:path')
const replaceOne = (src, from, to, name) => {
  const at = src.indexOf(from)
  if (at < 0 || src.indexOf(from, at + from.length) >= 0) throw new Error('Upload source contract changed: ' + name)
  return src.slice(0, at) + to + src.slice(at + from.length)
}
module.exports = function adaptUploads(core, site) {
  const base = path.join(core, 'src')
  const edit = (name, fn) => {
    const dest = path.join(base, name)
    const prior = fs.readFileSync(dest, 'utf8')
    const next = fn(prior)
    if (prior === next) throw new Error('Empty upload adaptation: ' + name)
    fs.writeFileSync(dest, next)
  }

  edit('types.ts', original => {
    let s = replaceOne(original, '  url: string\n  /** Optional alt text.',
      '  url: string\n  kind?: "image" | "file"\n  /** Optional alt text.',
      'upload result kind')
    return replaceOne(s, '  onUploadImage?: GitalkUploadImageHandler',
      '  onUploadImage?: GitalkUploadImageHandler\n  onUploadFile?: GitalkUploadImageHandler',
      'optional attachment handler')
  })
  edit('images.ts', original => {
    const tick = String.fromCharCode(96)
    const dollar = '$'
    const before = '  return ' + tick + '![' + dollar + '{alt}](' + dollar + '{destination})' + tick
    const after = '  return ' + tick + dollar + '{image.kind === "file" ? "" : "!"}[' + dollar + '{alt}](' + dollar + '{destination})' + tick
    let s = replaceOne(original, before, after, 'file markdown link')
    return replaceOne(s, '    return { url: url.trim(), alt }',
      '    const kind = typeof item === "object" && item !== null && item.kind === "file" ? "file" as const : "image" as const\n    return { url: url.trim(), alt, kind }',
      'validated uploaded kind')
  })
  edit('components/image-upload.tsx', original => {
    let s = replaceOne(original, '  onFiles: (files: File[]) => void',
      '  accept?: string\n  onFiles: (files: File[]) => void', 'file picker accept type')
    s = replaceOne(s, '  cancelLabel,\n  onFiles,',
      '  cancelLabel,\n  accept = "image/*",\n  onFiles,', 'file picker accept default')
    return replaceOne(s, '        accept="image/*"', '        accept={accept}', 'file picker types')
  })
  edit('use-gitalk.ts', original => {
    let s = replaceOne(original, '    onUploadImage: raw.onUploadImage,',
      '    onUploadImage: raw.onUploadImage,\n    onUploadFile: raw.onUploadFile,',
      'normalised optional file handler')
    s = replaceOne(s, 'useRef(opts.onUploadImage)',
      'useRef(opts.onUploadFile ?? opts.onUploadImage)', 'current upload handler')
    s = replaceOne(s, 'uploadHandlerRef.current = opts.onUploadImage',
      'uploadHandlerRef.current = opts.onUploadFile ?? opts.onUploadImage', 'updated upload handler')
    s = replaceOne(s, "if (files.some((file) => !file.type?.startsWith('image/'))) {",
      "if (files.some(file => opts.onUploadFile\n          ? !['image/png','image/jpeg','image/webp','image/gif','application/pdf','text/plain'].includes(file.type || (file.name.toLowerCase().endsWith('.log') ? 'text/plain' : ''))\n          : !file.type?.startsWith('image/'))) {",
      'safe attachment types')
    return replaceOne(s, 'canUploadImage: Boolean(opts.onUploadImage) && Boolean(auth.getToken())',
      'canUploadImage: Boolean(opts.onUploadFile ?? opts.onUploadImage) && Boolean(auth.getToken())',
      'authenticated upload visibility')
  })
  edit('components/mention-textarea.tsx', original => {
    let s = replaceOne(original, '  onEscape?: () => void',
      '  onEscape?: () => void\n  onFiles?: (files: File[]) => void', 'native file input callback')
    s = replaceOne(s, '  onEscape,\n  handleRef,',
      '  onEscape,\n  onFiles,\n  handleRef,', 'native file callback destructure')
    return replaceOne(s, '        onInput={handleInput}', [
      '        onPaste={(event) => {',
      '          const files = Array.from(event.clipboardData?.files ?? [])',
      '          if (onFiles && files.length) { event.preventDefault(); onFiles(files) }',
      '        }}',
      '        onDragOver={(event) => {',
      '          if (onFiles && Array.from(event.dataTransfer?.types ?? []).includes("Files")) event.preventDefault()',
      '        }}',
      '        onDrop={(event) => {',
      '          const files = Array.from(event.dataTransfer?.files ?? [])',
      '          if (onFiles && files.length) { event.preventDefault(); onFiles(files) }',
      '        }}',
      '        onInput={handleInput}'
    ].join('\n'), 'native paste and drop')
  })
  edit('components/comment.tsx', original => {
    let s = replaceOne(original, "import { ReplyBox } from './reply-box'",
      "import { ReplyBox } from './reply-box'\nimport type { EditorUploadConfig } from './editor-upload'",
      'reply upload import')
    s = replaceOne(s, '  onReplyInput: (value: string) => void',
      '  upload?: Omit<EditorUploadConfig, "onFiles" | "retry"> & { uploadFiles: (files: File[]) => Promise<import("../types").GitalkUploadedImage[] | null> }\n  onReplyInput: (value: string) => void',
      'reply upload props')
    s = replaceOne(s, '  currentUser,\n  onLogout,\n  onReplySubmit,',
      '  currentUser,\n  onLogout,\n  upload,\n  onReplySubmit,',
      'reply upload destructure')
    const marker = '              onLogout={onLogout}'
    const count = s.split(marker).length - 1
    if (count !== 2) throw new Error('Expected two shared native reply locations: ' + count)
    return s.split(marker).join(marker + '\n              upload={upload}')
  })
  edit('widget.tsx', original => {
    let s = replaceOne(original,
      "import { CommentEditor } from './components/comment-editor'",
      "import { CommentEditor } from './components/comment-editor'\nimport { EditorUpload } from './components/editor-upload'",
      'widget shared upload import')
    const anchor = '  const expand = () => {'
    const upload = [
      '  const sharedUpload = {',
      '    t, uploading: state.imageUploading, progress: state.imageUploadProgress,',
      '    error: state.imageUploadError,',
      '    label: options.onUploadFile',
      '      ? (/^zh/i.test(options.language ?? "")',
      '          ? "粘贴、拖拽或点击添加图片及附件" : "Paste, drop, or click to add files")',
      '      : t("upload-image"),',
      '    accept: options.onUploadFile',
      '      ? "image/png,image/jpeg,image/webp,image/gif,application/pdf,text/plain"',
      '      : "image/*",',
      '    uploadFiles: actions.uploadImage, cancel: actions.cancelImageUpload',
      '  }',
      ''
    ].join('\n')
    s = replaceOne(s, anchor, upload + anchor, 'shared file upload state')
    s = replaceOne(s, '                  onLogout={logoutSafely}\n',
      '                  onLogout={logoutSafely}\n                  upload={meta.canUploadImage ? sharedUpload : undefined}\n',
      'reply uploader assignment')
    s = replaceOne(s, '                    handleRef={editorRef} rtl={direction === "rtl"}',
      '                    handleRef={editorRef} rtl={direction === "rtl"}\n' +
      '                    onFiles={meta.canUploadImage ? (files) => { void uploadFiles(files) } : undefined}',
      'root paste drop assignment')
    const start = s.indexOf('                    {meta.canUploadImage ? (', s.indexOf('gt-header-controls gt-editor-footer'))
    const end = s.indexOf('                    {meta.authenticated || meta.canLogin ? (', start)
    if (start < 0 || end <= start) throw new Error('Legacy root-only uploader / preview controls changed')
    const element = [
      '                    <EditorUpload config={meta.canUploadImage ? {',
      '                      ...sharedUpload,',
      '                      onFiles: (files) => { void uploadFiles(files) },',
      '                      retry: () => { const failed = state.imageUploadError; if (failed) void uploadFiles(failed.files) }',
      '                    } : undefined} />',
      ''
    ].join('\n')
    s = s.slice(0,start) + element + s.slice(end)
    const errStart = s.indexOf('              {/*\n                Failures are never silent:')
    const errEndMarker = '              ) : null}'
    if (errStart < 0) throw new Error('Legacy standalone upload error location changed')
    const errEnd = s.indexOf(errEndMarker,errStart)
    if (errEnd < 0) throw new Error('Cannot find end of standalone upload error')
    s = s.slice(0,errStart) + s.slice(errEnd+errEndMarker.length)
    return s
  })

  const modules = ['components/comment-editor.tsx','components/reply-box.tsx','components/editor-upload.tsx']
  for (const name of modules) {
    const from = path.join(site, 'tools', 'gitalk2-src', name)
    const dest = path.join(base, name)
    if (!fs.existsSync(from)) throw new Error('Missing tracked upload module: ' + name)
    fs.copyFileSync(from, dest)
  }
}

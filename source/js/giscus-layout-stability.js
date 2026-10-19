/*
 * Keep the host document stable while giscus revalidates image-heavy comments.
 * Giscus is cross-origin: listen to its resize message, never inspect the iframe.
 * A sustained resize is applied after a short settle window so genuine changes
 * (e.g. hiding replies) remain possible; temporary collapses do not move the page.
 */
(() => {
  'use strict'

  const host = document.getElementById('giscus-wrap')
  if (!host) return

  const settleDelayMs = 3000
  let reservedHeight = 0
  let latestHeight = 0
  let settleTimer = null

  const onGiscusMessage = event => {
    const frame = host.querySelector('iframe.giscus-frame')
    if (!frame || event.source !== frame.contentWindow ||
        event.origin !== new URL(frame.src).origin) return

    const height = event.data?.giscus?.resizeHeight
    if (!Number.isFinite(height) || height <= 0) return

    latestHeight = Math.ceil(height)
    if (settleTimer !== null) clearTimeout(settleTimer)
    settleTimer = null

    if (latestHeight >= reservedHeight) {
      reservedHeight = latestHeight
      host.style.minHeight = `${reservedHeight}px`
      return
    }

    settleTimer = setTimeout(() => {
      reservedHeight = latestHeight
      host.style.minHeight = `${reservedHeight}px`
      settleTimer = null
    }, settleDelayMs)
  }

  window.addEventListener('message', onGiscusMessage)
  window.addEventListener('pagehide', event => {
    // A bfcache page resumes without rerunning scripts; keep its listener.
    if (event.persisted) return
    window.removeEventListener('message', onGiscusMessage)
    if (settleTimer !== null) clearTimeout(settleTimer)
  }, { once: true })
})()

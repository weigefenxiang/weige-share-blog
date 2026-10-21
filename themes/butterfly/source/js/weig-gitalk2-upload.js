/* WeiG Gitalk optional upload bridge. No endpoint configured => no handler/UI.
 * Never sends GitHub access tokens to untrusted or non-HTTPS upload services.
 * Actual R2 storage and Worker require separate deployment and verification. */
(() => {
  'use strict';
  const ALLOWED_HOST = /(?:^|\.)weigshare\.com$|(?:^|\.)weige-share-blog\.pages\.dev$/i;
  const ALLOWED_MIME = new Set([
    'image/png','image/jpeg','image/webp','image/gif',
    'application/pdf','text/plain'
  ]);
  const EXTS = new Set(['png','jpg','jpeg','webp','gif','pdf','txt','log']);
  function create(endpoint) {
    let server;
    try {
      server = new URL(endpoint);
      if (server.protocol !== 'https:' || !ALLOWED_HOST.test(server.hostname) ||
          server.username || server.password || server.search || server.hash ||
          server.pathname !== '/api/upload') return null;
    } catch { return null; }
    return async (files, { signal, onProgress } = {}) => {
      const token = localStorage.getItem('GT_ACCESS_TOKEN');
      if (!token || !/^gh[uo]_[A-Za-z0-9_-]{16,}$/.test(token)) {
        throw new Error('GitHub login required for uploads');
      }
      const results = [];
      let total = 0;
      for (const file of files) {
        const extension = file.name.split('.').pop()?.toLowerCase()
        const mime = file.type || (extension === 'log' ? 'text/plain' : '')
        if (!ALLOWED_MIME.has(mime) ||
            !EXTS.has(extension) ||
            file.size <= 0 || file.size > (mime.startsWith('image/') ? 10 : 25) * 1048576) {
          throw new Error('Unsupported file format or size');
        }
        total += file.size;
      }
      let uploaded = 0;
      for (const file of files) {
        if (signal?.aborted) throw new DOMException('Upload cancelled', 'AbortError');
        const extension = file.name.split('.').pop()?.toLowerCase()
        const mime = file.type || (extension === 'log' ? 'text/plain' : '')
        const response = await fetch(server.href, {
          method: 'POST',
          redirect: 'error',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': mime,
            'X-Upload-Filename': encodeURIComponent(file.name)
          },
          body: file,
          signal
        });
        if (!response.ok) {
          throw new Error('Upload failed (HTTP ' + response.status + ')');
        }
        const asset = await response.json();
        let assetUrl;
        try {
          assetUrl = new URL(asset.url);
          if (assetUrl.protocol !== 'https:' || assetUrl.username || assetUrl.password) throw Error();
        } catch { throw new Error('Invalid upload response'); }
        results.push({
          url: assetUrl.href,
          alt: file.name,
          kind: mime.startsWith('image/') ? 'image' : 'file'
        });
        uploaded += file.size;
        onProgress?.(uploaded, total);
      }
      return results;
    };
  }
  window.WEIG_GITALK_UPLOAD = { create };
})();
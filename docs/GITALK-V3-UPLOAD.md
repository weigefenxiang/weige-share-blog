# WeiG Gitalk V3 — optional image/attachment service

The Markdown editor does not need a file server. Real uploads require
an explicitly deployed Cloudflare Worker and a dedicated R2 bucket.
**None of these changes enables uploads on the live site.**

## Deployment prerequisites

1. Create a separate R2 bucket, not the blog source or backup bucket.
2. Bind R2 as COMMENTS_BUCKET to the Worker. Give read-only public access
   through a dedicated asset domain, never the blog's own origin.
3. Bind a Cloudflare Rate Limiting service named UPLOAD_RATE_LIMITER.
   Add account-level WAF/bot limits and verify monthly R2 budgets.
4. Set exact ALLOWED_ORIGINS for the branch/production sites and
   PUBLIC_ASSET_BASE for the dedicated HTTPS asset domain; no wildcards.
5. Deploy the Worker with Cloudflare Wrangler; first verify anonymous
   rejection, logged-in image/PDF upload, cross-origin denial, rate limits.
6. Enable monitoring and moderation, deletion/expiry of orphan files, and
   a malware scanning policy before permitting archive files.

The wrangler.toml.example file is a **template**, not a valid provisioned
bucket binding. No upload tokens or R2 keys are stored in the repository.

## Worker contract

POST /api/upload; headers: Authorization: Bearer (GitHub user token),
Origin, Content-Type, Content-Length and URL-encoded X-Upload-Filename,
body: raw file bytes. The Worker verifies the token against GitHub /user,
enforces user rate limits, validates MIME/extension/signature/size, stores
a random R2 object key and returns a JSON document:

    {"url":"https://assets.example/comments/42/2026-10/uuid.png",
     "filename":"diagram.png","mime":"image/png","size":1234}

Only PNG/JPEG/WebP/GIF (max 10 MiB) and PDF/plain text (max 25 MiB) are
allowed by default. ZIP requires an external malware scanning policy and
must not be enabled merely because the source supports an opt-in flag.
Executable files, HTML and SVG are not permitted.

Browser-side integration status: OPTIONAL, DISABLED BY DEFAULT.
The shared editor supports image paste, drag/drop, and file pick at each
reply depth through the pinned native Gitalk uploader. The blog only
configures onUploadFile when theme.gitalk.option.upload_endpoint is an HTTPS
URL on a controlled hostname and the Worker exists.

No live Cloudflare R2 bucket, Worker deployment or verified upload endpoint
has been configured in this repository. Therefore uploads stay hidden in
dev and production until provisioning, policy review and real E2E tests.
Do NOT claim this optional service has been deployed.

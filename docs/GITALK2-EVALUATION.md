# Gitalk 2.x independent evaluation — dev-gitalk2-eval

Source branch: blog `main` at `0ed650e8af7c2c2857029d3552adf0ac641222d3`. Does not merge into `main` or overwrite existing `dev`.

## Open the test
From the latest **Cloudflare Pages Preview deployment** for this branch, visit:
`https://<preview>.weige-share-blog.pages.dev/zh-CN/gitalk2-eval/`

The existing OpenWrt blog article and giscus integration are untouched. A standalone HTML page loads pinned `@aifire/gitalk@2.0.0-beta.0` from jsDelivr, reads existing Discussion #10 in the same repository, and tracks focus returns / image DOM replacements.

The candidate is a **beta**, not a verified production replacement.
It has no GitHub App ID and no auth proxy. `clientID: ''`, `admin: []` and the page's fetch guard reject POST/PUT/PATCH/DELETE, so this is **anonymous read-only**. The blocked POST includes Gitalk's optional anonymous GraphQL proxy path; Gitalk documents REST fallback for the no-proxy case. It can hit anonymous 60 requests/hour limits; test status must disclose failures.

### Acceptance
1. Cloudflare built HTML, JS, CSS reachable; pinned CDN bundle loads.
2. Gitalk renders Discussion #10 with **1 parent, 5 replies, 7 user screenshots** (the original test-thread expectation).
3. After initial image load, switch away/back 10 times; image nodes should not be discarded/reloaded on focus, and no sudden page-height shrink.
4. Export JSON (no signed query strings, no comment text) and check `focusReturns`, `imagesRemoved`, and API requests.
5. Authentication, reply creation and full multilingual support require separate GitHub App / proxy trials, not in scope. No releases or merges before human PASS.

### Important limits
- Network access to jsDelivr from the tool environment could not be verified. Successful Hexo CI **does not prove** the CDN package exists or loads.
- Source in `gitalk/gitalk` is presently `2.0.0-beta.0`. CDN is pinned to that candidate, not Gitalk 1.x.
- Gitalk's read-only REST fallback may differ from authenticated GraphQL/proxy rendering. If it fails, report the failure; do not silently substitute custom rendering.
- Pages Preview may need branch deployment enabled under Cloudflare Pages settings.
## Phase 2: article-level integration (experimental branch only)

The original Simplified Chinese OpenWrt guide on this branch has `comments: false`
so Butterfly does not initialize its original giscus embed. A separate, clearly
labeled, read-only Gitalk 2.x block is added at the end of the *same article*.
This is the first layout-level A/B test comparing the same long article and
Discussion #10. All other articles, languages, branch heads and existing
Discussions are unchanged.

Open `/zh-CN/posts/WeiG-OpenWrt-AutoBuild-Guide/` on the NEW Preview deployment,
not the earlier `69ca83d1` build. The block must show **1 parent, 5 replies,
7 images loaded** before results count. After 10 focus returns export the JSON.
If the widget is empty, only some replies render, images fail or URL/query
rotation still produces DOM replacement, the migration has NOT passed.

Use `/zh-CN/gitalk2-eval/` as the independent comparison fixture. No GitHub App,
OAuth client secret, posting permissions, or worker is configured for these tests.


## Phase 3: clean article UI + complete OAuth integration wiring (branch only)

After the user's visual test (1 top-level comment, **6 replies**, **7/7 images**
loaded, **0 image DOM removals** after switching tabs), the noisy diagnostic
panel is folded by default under **开发诊断**. These counters are developer
instrumentation, not a Gitalk bug or end-user UI. This experiment still reads
the same Discussion #10 and never modifies `main` or the existing `dev`.

GitHub login is a separate capability: Gitalk 2.x **requires a GitHub App**
with Discussions read/write installed on the comments repository AND a
self-deployed OAuth proxy. The independent comparison page stays read-only.

All source and article wiring is ready. In Cloudflare **Pages Preview**
environment variables, configure BOTH:

- `WEIG_GITALK_CLIENT_ID` — the **public** GitHub App client ID (looks like `Iv...`)
- `WEIG_GITALK_PROXY_ORIGIN` — the **public** HTTPS origin of your deployed
  Gitalk OAuth Cloudflare Worker (no path)

The `postbuild` step emits only those two public values to
`/zh-CN/gitalk2-eval/runtime-config.js`. Neither credential is a secret.
If missing, the page remains openly readable but explicitly explains that
GitHub login is not configured; it does not show a misleading broken login
button. If only one is set, the build correctly fails rather than silently
deploying a broken auth flow.

**Never** enter the GitHub App's client secret, PEM private key, Cloudflare
API token or session encryption key into ChatGPT, GitHub tracked files, or
Cloudflare Pages public environment variables. They belong to the separate
Cloudflare Worker **secrets** only. Use the upstream gitalk-deploy CLI, whose
source of truth is
`https://github.com/gitalk/gitalk/blob/main/packages/gitalk-deploy/README-CN.md`.

Requirements before claiming OAuth PASS:
1. GitHub App owned by `weigefenxiang`; **Discussions: Read and write**,
   **Metadata: Read**; installed only on `weige-share-blog`.
2. Worker deployed with server-side App ID, client ID/secret, PEM private key,
   session encryption secret, and **exact allowed origins** for the
   testing Preview URL. Cloudflare's branch alias can be used when verified.
3. GitHub App callback URL exactly `https://<worker-origin>/oauth/callback`.
4. Preview public client ID and worker origin configured, redeployed. Verify
   login, logout, adding/editing replies on a designated test Discussion,
   permissions, token refresh, reactions, and preview-to-article redirect.
   Do **not** post test comments into the original Discussion #10 without
   explicit approval.
5. New uploads are not automatically supported: Gitalk's image-upload button
   requires a separately configured `onUploadImage` handler. Document the
   parity gap instead of claiming full migration until tested.

Status: browser image-stability **HUMAN_PASS (visual)**, authentication
**BLOCKED_ON_USER_GITHUB_APP_AND_WORKER**, migration **NOT_RELEASED**.

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

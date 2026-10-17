# Shared giscus discussions across blog translations

## Invariant

All localized versions of the same post share a single GitHub Discussion.
The mapping term is the **existing language-neutral route** (for example,
`posts/WeiG-OpenWrt-AutoBuild-Guide/`). The browser derives it from the
`hreflang="x-default"` link produced by `scripts/hreflang.js`.

- `giscus.pug` uses giscus' native `specific` mapping for translated posts.
- A `giscus:backlink` meta tag links new discussions to the neutral URL.
- Untranslated posts (including `Hello-Butterfly`) and unrelated pages
  retain the configured `pathname` mapping.
- giscus `data-lang` and the existing language switcher are unchanged.
- No database, third-party script, or second locale/slug registry is needed.

## Rollout and historical comment preservation

Changing giscus mapping does **not** move or delete GitHub comments. The
matching Discussion must be verified, and existing replies must be preserved.

1. The owner confirmed [Discussion #10](https://github.com/weigefenxiang/weige-share-blog/discussions/10)
   in a screenshot. Its title is
   `zh-CN/posts/WeiG-OpenWrt-AutoBuild-Guide/`, category `Comments`;
   it contains **1 comment from GXLCLC and 1 maintainer reply**.
   Keep the exact Discussion number, body, replies and authors.
2. Before rollout, inspect the [Discussions listing](https://github.com/weigefenxiang/weige-share-blog/discussions)
   for discussions about the same article in other languages. If any already
   contain replies, preserve them; do not silently merge/delete them.
3. **Do not rename #10 yet.** With `data-strict: '0'`, giscus searches
   Discussion titles using `in:title` and the specified term. The existing
   Chinese title already **contains** the neutral term
   `posts/WeiG-OpenWrt-AutoBuild-Guide/`, so a non-strict search may find
   #10 without any rename. GitHub search behavior is fuzzy, and collisions
   from other discussions are possible: this is a hypothesis to validate,
   not a guarantee.
4. Prepare the rollout in a quiet window. Deploy the change and immediately
   verify on the live English, Chinese and Japanese URLs that the giscus
   widget opens **the existing Discussion #10** and shows GXLCLC's
   comment and the maintainer reply. Inspect other translated posts as well.
   Do not submit test comments or reactions until existing identity is checked.
5. If the existing discussion is **not** selected, pause; avoid creating new
   discussions. Coordinate a brief fix/rollback. If necessary, **rename**
   the existing Discussion #10 title to the exact neutral term
   `posts/WeiG-OpenWrt-AutoBuild-Guide/` while preserving its ID/body/replies,
   then verify live again. Renaming is optional if #10 already resolves.
6. Keep `data-strict: '0'` during the rollout. Switching to strict matching
   additionally requires ensuring the Discussion body contains the correct
   SHA-1 marker, and should be a separate change.

The original Chinese backlink in #10's body can remain; new discussions get
the canonical-language backlink automatically. No Discussion titles or
comments are changed by this code-only PR.

## Validation

- Run `npm ci && npm run build`. Existing multilingual build assertions
  check all shared posts in every locale for the neutral `x-default` URL and
  matching `giscus:backlink`.
- Confirm different post slugs do not share a Discussion.
- Confirm localized giscus UI strings and theme switching are unchanged.
- Confirm the Chinese-only `Hello-Butterfly` article still uses its own
  pathname mapping; do not accidentally collapse its thread.
- Manual live check: all translations resolve to the **existing** GitHub
  Discussion URL, including prior comments (such as GXLCLC's).
- Rollback: revert this code deployment; do not remove or delete Discussions.
  If titles were renamed, keep a record of previous titles to restore them.

Note: no Discussion titles are modified by this repository change. Discussion
history must be checked and migrated separately with appropriate GitHub access.

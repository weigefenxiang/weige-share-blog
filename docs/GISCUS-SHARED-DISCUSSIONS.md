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

## Migration required **before** deploying

Changing the mapping alone **does not move comments**. GitHub Discussions
are the source of truth and existing replies must not be deleted.

1. Review [GitHub Discussions](https://github.com/weigefenxiang/weige-share-blog/discussions).
   Record the discussion URL/number, title, and reply count for every
   article and language. The prior giscus setting was `pathname`, so the
   Chinese discussion for the guide is likely titled
   `zh-CN/posts/WeiG-OpenWrt-AutoBuild-Guide/` (verify the actual title).
2. For each article, choose the **existing** Discussion that contains the
   historical conversation. Back up its URL and current title, then edit its
   title to the exact neutral term, e.g.
   `posts/WeiG-OpenWrt-AutoBuild-Guide/`. Keep the same Discussion number
   and all its replies. Do not create a new Discussion as a substitute.
3. If multiple localized Discussions already contain replies, **stop** and
   decide how to preserve them. GitHub does not merge Discussion comments
   automatically; do not delete any. Consider cross-linking old threads.
4. Keep `data-strict: '0'` initially. Enabling strict matching may require
   updating discussion-body SHA-1 markers; it is a separate migration.
5. Only deploy the code after titles have been reconciled. On the live site,
   verify that the same Discussion URL and existing replies appear from
   `/posts/...`, `/zh-CN/posts/...`, `/ja/posts/...` and the other locales.

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

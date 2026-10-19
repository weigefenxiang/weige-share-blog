# Giscus focus revalidation: root-cause analysis (HUMAN_FAIL / ROOT_CAUSE_CONFIRMED)

## Status

**Not fixed** in the official giscus widget, and **not human-verified**.
This note records the cause without claiming the Hexo/Butterfly site can disable
a cross-origin widget's network revalidation through its own configuration.

## Evidence from browser reproduction

On the WeiG OpenWrt AutoBuild guide, a read-only cross-origin diagnostic captured
315 events in one session (2026-10-19 23:32 UTC). On six successive tab returns:

1. The existing giscus iframe resumed visibility. There were no additional
   top-document navigation events or iframe `load` events in this session.
2. Roughly 1.0-1.4 seconds later, `/api/discussions` returned HTTP 200.
3. The giscus comment-content DOM removed **7** image elements and added **7**
   image elements. Source URLs did not change. The comment body count did not
   change.
4. The iframe's inner content height dropped from about **4,849px** to
   **2,600px**, then increased again as the images loaded.

This is not the page itself reloading; it is a repeatable giscus comment-image
DOM replacement and subsequent reflow following focus-triggered revalidation.
Do not publish user-provided raw event logs (which contain image URLs and
browser metadata) in the repository.

## Underlying source paths

- `giscus/giscus/services/giscus/discussions.ts` uses SWR's
  `revalidateOnFocus` and `revalidateOnReconnect` for the discussion query.
- `giscus/giscus/components/Giscus.tsx` rerenders the discussion comments when
  SWR produces updated discussion data.
- `giscus/giscus/components/Comment.tsx` and `components/Reply.tsx`
  construct comment content through `dangerouslySetInnerHTML` with
  `processCommentBody(...)`. On the focus-triggered updates, the observed
  comment images are recreated even when their `src` values are unchanged.
- `giscus/giscus/components/Widget.tsx` sends `ResizeObserver` height
  changes to the parent; `client.ts` applies them to the iframe.

The data and timing conclusively establish focus revalidation followed by
comment-image node replacement and reflow. An upstream regression test is still
needed to pin down the exact React update responsible.

## Correct fix boundary

The appropriate fix belongs in the **giscus render/data lifecycle**, not
Butterfly's general comment template or Cloudflare routing. Ideally, the
upstream widget should preserve unchanged rendered comment HTML and image DOM
across SWR revalidation, while still updating edited comments, reactions,
new replies, and authentication state. A targeted upstream fix should include
a test asserting that the same image DOM nodes survive a successful
revalidation with semantically unchanged comment HTML.

The official `giscus.json` currently supports default sort order and origins,
**not** disabling `revalidateOnFocus`. The host document cannot reach into
cross-origin `giscus.app` to change SWR or React behavior. A pinned or
self-hosted widget would be a separate, higher-maintenance deployment decision,
not an innocuous blog setting.

## Retired workaround

The previous `giscus-layout-stability.js` adjusted the host or iframe's
`min-height` in response to cross-origin resize messages. Repeated real
browser tests showed that the images still disappeared and reloaded. That
workaround and its focused tests were therefore removed from `dev` instead of
keeping a timer-based symptom mask in production.

## What remains safe and complete in dev

- Original multilingual Discussion identity mapping remains unchanged.
- Official newest-first `giscus.json` setting remains in place (effective
  when it reaches the Discussions repository's default branch).
- Native `<details open>` comment folding remains in place.
- Existing multilingual Hexo CI continues to validate generated articles.

**Release gate:** do not merge into `main` or claim `VERIFIED_DONE` until the
actual focus-triggered image replacement is fixed and a human has tested tab
switching with many image-heavy replies. Defer upstream issue submission until
the user requests/approves it.

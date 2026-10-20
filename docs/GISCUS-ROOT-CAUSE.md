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

## Confirmed: viewport visibility is NOT the trigger (v1.2)

The independent Violentmonkey diagnostic v1.2 recorded **302 events** from
the Cloudflare Preview article on 2026-10-20 00:03 UTC. The iframe was
actually within the browser viewport during **all 9** measured returns.

| Focus returns with iframe visible | Image nodes replaced | Discussion API response |
| ---: | ---: | ---: |
| 9 | 5 | 5 |

For each of these five events, the comment DOM removed **7** image nodes and
created **7** replacements (same URLs, comment body count unchanged). All
seven newly created images were pending again immediately after replacement.
The first replacement followed tab return after
**1115, 1222, 1381, 1384, and 1392 milliseconds** respectively.
The other four returns did not trigger a discussion fetch or replacement.
The iframe was in view (often 1108 visible pixels), and the comment
heading being outside the viewport did not prevent revalidation.

This rejects the theory that scrolling the comment iframe out of view is
necessary. The timing and alternating successful revalidations are consistent
with SWR's throttled focus-triggered revalidation, although the exact throttle
configuration should be confirmed against the deployed SWR version.

**Confirmed causal sequence:** tab focus -> discussion API request/response ->
comment-image DOM replacement -> pending images -> reload/reflow.
The evidence does NOT yet establish whether `bodyHTML` differs
byte-for-byte across responses or whether React writes identical HTML again.
To make a final, production-worthy upstream patch, capture/compare the
comment body HTML before and after revalidation and test preservation of
unchanged image nodes on a local giscus build. Do not substitute more iframe
height clamps or a visibility-based skip, since both have failed real tests.

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

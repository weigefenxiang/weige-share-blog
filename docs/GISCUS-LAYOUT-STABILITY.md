# Giscus layout stability on the blog

## Scope
`giscus-layout-stability.js` reserves the height of `#giscus-wrap` while
Giscus temporarily reports a smaller cross-origin iframe height (e.g. when
its image-heavy GitHub Discussions thread revalidates after returning to a tab).

Only messages sent from the actual `iframe.giscus-frame` and the origin
of that iframe are used; there is no cross-origin DOM access. Temporary
decreases are held for 3 seconds after the last decrease, while increases are
applied immediately. Sustained decreases are eventually applied. Page unload
removes the listener and timer.

The script is attached through Butterfly's existing `inject.bottom` setting.
It does not fork or modify the theme or Giscus, change comment fetching or
create nested scrolling regions. The `giscus.json` newest-first setting and
the existing shared Discussion mapping remain independent.

## Known limits
- This stabilizes host-page layout; Giscus may still independently revalidate
  or visually repaint its images on tab focus.
- The very first image-heavy comment load can still increase document height.
- If the discussion genuinely becomes shorter, space can remain reserved
  for up to three seconds before adjusting.
- Treat the fix as **not verified** until a browser regression with long
  comments, focus switching, dark mode, mobile and folding passes.

## Tests
`node --test tools/test-giscus-layout-stability.cjs`, followed by
`npm run build` (existing multilingual verifier). Only promote `dev` after
human browser acceptance.

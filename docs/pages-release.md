# GitHub Pages release

Prepared site: `docs/site`. Intended URL: https://selimharfouche.github.io/ghost-beta/.

The website is static: recordings, interactive reports, installation links. Ghost's browser workers and Codex authentication remain local to each developer.

The owner approved making `selimharfouche/ghost-beta` public under the included MIT license; GitHub Pages is now live. The public repository includes reviewed demo evidence and synthetic browser recordings. It excludes `.env`, local runs, dependencies, scratch work, and SDK state.

Use a `gh-pages` branch containing only `docs/site`, then configure GitHub Pages to publish that branch's root. No Actions workflow permission, domain purchase, or subscription is required. Verify the public landing page, video playback, two report links, and source ZIP after deployment.

The active real-app video builder is `node scripts/build-real-video.js 5ca3d8ea-f00a-4e7e-88d8-867ffd48961d`. It creates `launch-demo.mp4`, `launch-demo.webm` and `launch-poster.jpg` from the local completed run. Historical video builders remain for earlier demo artifacts. Regenerate the current report and landing page with `node scripts/build-showcase.js 5ca3d8ea-f00a-4e7e-88d8-867ffd48961d` (requires local evidence).

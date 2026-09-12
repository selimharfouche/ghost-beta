# Ghost publication handoff

The release is a local developer tool plus a static, interactive recorded demo. The static site never runs against the maker's Codex account.

## Review before public release

- Source: private repository https://github.com/selimharfouche/ghost-beta.
- Landing page and interactive evidence: `docs/site/index.html`.
- Video: `docs/assets/ghost-demo.mp4` (captioned, time-compressed screenshot replay, no synthetic UI).
- Gallery: `docs/assets/completed-report.png`, `live-exploration.png`, `mobile-evidence.png`.
- Listing and maker comment: `docs/launch-copy.md`.
- Validation: `docs/validation.md` and `docs/real-app-demo.md`.

## Owner actions required

1. Approve making the reviewed repository public under the proposed MIT license, with the reviewed demo evidence. No credentials, raw SDK session files, or personal browser profiles are included in the release.
2. After public visibility is approved, publish `docs/site` to a `gh-pages` branch and enable GitHub Pages from that branch. This uses the existing repository access. The optional Actions template is saved at `docs/deploy/pages.yml`; activating it would require separate workflow permission. Verify the deployed URL.
3. Sign into Product Hunt personally through https://www.producthunt.com/posts/new?contest=gpt-6-astra-challenge&ref=contest_preview.
4. Review contest eligibility and binding terms, including the Codex SDK subscription route. The public guide does not establish every term or a separate scheduling cutoff.
5. Review the prepared fields, upload the gallery, and host/upload the MP4 where the form accepts a video URL. Approve the final public submission and schedule for September 18, 2026 at 12:01 AM Pacific if the authenticated contest flow confirms the guide.

No workflow has been dispatched, repository visibility changed, terms accepted, or Product Hunt launch scheduled. No paid plan is needed for the proposed public static GitHub Pages release, subject to account availability at publication time. No payment is authorized by this handoff.

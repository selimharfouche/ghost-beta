# Validation record — September 12, 2026

## Real end-to-end results

- Real Chrome instrumentation run: three independent contexts, 54 actions, 57 screenshots; four of five planted defects detected without model calls. Run c5c8042b-ce9c-408c-aa81-d7f77b5fb983.
- Astra SDK smoke: one persona, six actions, successful subscription inference and a trip-creation finding. Run daae5a91-293d-417b-8620-2372ba2bfb07.
- Astra concurrency benchmark: three personas, maximum twelve actions each; all three completed. Combined Astra observations + browser instrumentation detected all five planted defects. Run 4046b6e1-8479-4c2a-a579-47a4a616ed25. This is one seeded-demo run, not a statistically established success rate.
- Search failure, trip creation and persistence, mobile overflow and missing help were confirmed against the saved observations; export HTTP 500 was captured by browser instrumentation. Additional UX findings are review candidates, not additional planted bugs.
- Ten automated tests pass: input/action validation, clustering, generic exploration, runner context independence, final-frame capture, cancellation, startup failures, semantic-group evidence conservation.
- Live HTTP checks pass: ChatGPT auth detected, foreign-origin POST rejected, concurrent session refused, artifact paths validated, JPEG evidence served, Markdown exported.
- Dashboard inspected at desktop and 390px mobile width. Visible mobile controls fit the viewport. Issue details and evidence replay opened; slider position and before/after action captions were corrected.

## Environment issue resolved

The initial task sandbox blocked Chromium and nested Codex startup. Running the server with normal process access resolved it. A second issue was the Terminal PATH lacking Codex; the desktop executable is now detected automatically. No security setting was disabled and no login token was copied.

## Release limits

No API charges, paid hosting, domain, subscription purchase or other external spend: $0. Codex subscription allowance was consumed. Final public release and Product Hunt scheduling remain pending. The exact scheduling cutoff and contest terms still need inspection in the maker’s authenticated submission flow.

## Final grouping

Astra reduced 22 overlapping reports to nine grouped issues. All 32 original occurrences were retained, including each source, reproduction trail and screenshot reference. Ten tests validate evidence coverage and other core behavior. The demo used roughly 4.56 million SDK-reported input/output tokens including grouping; most input is carried context, and the counter is not dollar spend. Further memory compaction is an optimization opportunity.

## Release-candidate checks

- Eleven tests pass after adding synthetic-upload and extended-action guards.
- A clean directory installed the exact lockfile using the existing offline dependency cache; all eleven tests also passed against that installation. This checks reproducible dependencies on this Mac, not installation on a second machine.
- Each decision now uses a fresh SDK context with recent textual observations and action history, preventing all prior screenshots from accumulating.
- MarkerPad's live web beta completed a genuine twelve-action exploration (181,910 tokens). It created and edited a synthetic document and reached export options. Three accessibility candidates remain unconfirmed; see real-app-demo.md.
- The interactive static report was opened in the browser and a finding correctly selected Sana and step 6 (frame 7 of 13).
- Gallery images, a 240px thumbnail, and a captioned MP4 were prepared. The video explicitly identifies screenshot replay and time compression.

# Ghost project review — September 12, 2026

Ghost has a working exploration and evidence pipeline. The idea is incomplete at the point where a developer must decide whether a finding is real, reproduce it, and verify a fix. A polished exploration video demonstrates agency; it does not by itself demonstrate useful testing. The independently reproduced MarkerPad checkbox finding is one positive data point, not broad validation.

## Findings, in priority order

| Priority | Finding and evidence | Practical consequence / next step |
|---|---|---|
| High | `src/runner.js` marks an action executed when Playwright returns. Exports/downloads are disabled and there is no automatic fresh-session reproduction or fix verification. | Clicking Export does not establish a valid exported file. Add explicit observable outcome checks and a confirmed/suspected/rejected review state, then rerun a confirmed reproduction after a fix. |
| High | `observe()` uses a partial DOM label heuristic, omits `aria-labelledby`, caps controls at 80, and does not cover arbitrary frames/canvas/dragging. Mobile is a narrow desktop browser viewport, not touch-device emulation. | Ghost can mistake its own observation limits for product bugs. Improve accessible-name extraction and explicitly report coverage barriers. The checkbox finding was therefore independently checked through the normal browser accessibility tree. |
| High | All cross-origin requests, popups, service workers and downloads are blocked. `src/brain.js` warns the model about this, but enforcement cannot prevent mistaken interpretation of indirect symptoms. | Real integrations may break only in Ghost. Every proposed issue needs environment-aware triage and reproduction in a normal browser. Do not loosen the local tool into a public worker without redesign. |
| High | Reproduction steps are the accumulated action history, including failed attempts. Browser errors are uniformly high severity; overflow can be intentional. Clustering merges wording, not independently verified causes. | Reports can be noisy and hard to act on. Minimize reproduction steps, retain failed outcomes explicitly, distinguish affected user tasks from background errors, and make severity reviewable. |
| Medium | Public GitHub Pages is a static showcase; executing Ghost requires local Node, Chrome, a compatible Codex binary and model access through the developer's account. | Visitors can watch evidence but cannot enter their own URL on the public site. Keep that clear and verify installation on another machine/account. That remains untested. |
| Medium | The seeded benchmark scores lexical matches against five known faults. Tests cover validation and simulated runner lifecycles; they do not measure false-positive rates or multi-app reliability. | 5/5 seeded recall is not general accuracy. Build a small reviewed corpus of real findings, rejected findings and missed journeys before making reliability or competitor claims. |
| Medium | Model calls have timeouts and cancellation coverage, but there is no per-run token budget or automatic resume. Triage lacks the added abortable wrapper used by exploration. CLI runs and the server do not share an active-run lock or live refresh mechanism. | Runs can consume substantial subscription allowance, and independently started jobs can overlap or appear stale. Establish one run coordinator and test timeout/restart behavior against actual providers. |
| Medium | Recording changes interaction behavior: progressive keyboard input and deliberate pointer movement differ from default fill/click timing. | Video and non-video runs are not identical experiments. Separate visual instrumentation from input semantics where practical; document timing-sensitive differences. |
| Medium | Screenshot masks do not redact all visible text. Videos are unmasked. Static export removes thread IDs but is not a comprehensive sanitizer. `safeAction` is label-based, not a security boundary. | Continue using synthetic, authorized staging data. Public export needs a deliberate review; automatic publishing of arbitrary runs would be unsafe. |
| Medium | The local file server has no byte-range handling; multiple historical video builders and duplicate encodings remain. | Local seeking and asset maintenance can be confusing. Keep one documented current builder and retire obsolete assets deliberately, after checking links. |
| Launch | Contest scheduling cutoff, SDK-only eligibility and final terms are not verified. Product Hunt fields/gallery/scheduling are not finalized. | Do not call the contest entry ready to submit until these gates are resolved. No benchmark demonstrates superiority over other models. |

## Inconsistencies found

README and deployment docs still called the repository private/public release pending. README and asset specs called the current video a screenshot slideshow. The demo flow still led with Waypoint, while the public website leads with MarkerPad. Pages instructions named an obsolete video builder and run IDs. The launch checklist combined already completed public-release/name tasks with still-unfinished installation and final-field checks. The real-app notes called an older screenshot run the final run. These documentation contradictions were corrected in this update; historical run evidence remains unchanged.

## What closes the MVP gap

1. One real finding with autonomous discovery evidence, independent reproduction and a maintainer-ready report. The MarkerPad checkbox report now meets discovery/reproduction; maintainer delivery/acknowledgment is tracked separately.
2. A reliable review and retest loop: classify candidates, save a minimal reproduction, and verify the expected behavior after a fix. This is the missing product capability with the most value.
3. A clean first install on a second machine/account, consistent demo and launch materials, and verified contest eligibility/submission state.

iOS, enterprise accounts and a hosted worker fleet are not required to close those gaps.

## Validation performed

Read the runner, observation/action guards, Codex integration, triage, server, showcase exporter, video builder and launch documentation. All 13 existing tests passed. The updated MP4 decoded without errors and its closing credit was visually inspected. MarkerPad checkbox semantics were checked in a separate browser session, after reload, and after toggling a checkbox. This is a scoped code/product review, not a penetration test or an exhaustive accessibility audit.

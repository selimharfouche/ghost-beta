# Ghost

Autonomous beta testers powered by **GPT-6 Astra through the Codex SDK**. Give Ghost a staging URL; independent browser explorers discover journeys and return findings with evidence, reproduction steps, and screenshot replay.

**Status:** local web MVP validated with real Chrome and Astra through a ChatGPT subscription. All three personas completed a seeded demo; the combined model + browser report found all five planted defects in this one run. This is a demo result, not a general reliability guarantee. The source repository and GitHub Pages showcase are public. Product Hunt scheduling is pending.

## Start on your Mac

Requirements: Node.js 22.9+ (tested development tooling with Node 23.7), Google Chrome, and Codex CLI signed in with ChatGPT. The ChatGPT desktop app’s Codex executable is detected automatically on macOS; CODEX_BINARY can override it.

```bash
npm ci
npm start
```

Open http://127.0.0.1:4318. Waypoint, the planted-bug staging app, runs on http://127.0.0.1:4319.

If Codex is not on PATH but the ChatGPT desktop app is installed:

```bash
CODEX_BINARY="/Applications/ChatGPT.app/Contents/Resources/codex" npm start
```

For ordinary standalone Codex installations, use `codex login` once and complete the ChatGPT login yourself. Ghost checks that the active session uses ChatGPT. API-key authentication is rejected, and API key environment variables are omitted from SDK processes.

Select **Use planted-bug demo**, **Astra · Codex login**, 1 Ghost, and 6 steps for the first smoke run. Then use three Ghosts and 12–20 steps to exercise diverse exploration. Runs use your subscription allowance; no API credits or purchases are needed. **Runner check · no AI** exercises the same browser loop with deterministic control selection. It is explicitly not an Astra benchmark.

## What is implemented

- Node HTTP server and responsive local dashboard, with a separate demo origin.
- Official @openai/codex-sdk, gpt-6-astra, low reasoning effort, structured action decisions, screenshot inputs, usage counters, and independent Codex threads.
- Up to three independent Playwright browser contexts with desktop/mobile viewports and diverse personas.
- Visible-page observation, discovered journey labels, bounded click/fill/select/key/scroll/back/wait actions, step limits, timeouts and cancellation.
- Timestamped events and screenshots, browser runtime/HTTP/overflow detection, and Astra findings with evidence step references.
- Live route/source-aware clustering plus a final Astra grouping pass that preserves evidence, per-occurrence reproduction steps, screenshot timeline and Markdown export.
- Disk persistence, interrupted-run recovery, same-origin request checks, strict artifact paths and localhost binding.
- Waypoint planted-bug app, benchmark scorer, tests and Product Hunt launch materials.

No iOS/device infrastructure, account system, cloud worker pool or shared subscription proxy is included.

## Commands

```bash
npm test                  # component and simulated runner lifecycle tests
npm run check             # syntax checks
npm run benchmark         # real-browser instrumentation check; no model calls
BENCHMARK_MODE=codex GHOST_COUNT=1 GHOST_STEPS=6 npm run benchmark
BENCHMARK_MODE=codex GHOST_COUNT=3 GHOST_STEPS=18 npm run benchmark
```

Keep the server running in a separate Terminal. Benchmark output is saved to docs/benchmark-MODE.json. Read its status; a failed run is not a zero-recall model result. The scorer matches five expected faults after exploration; human review is still required for precision and unplanted findings.

## Architecture

`src/server.js` serves the local dashboard, run APIs and a separate demo server. `src/runner.js` controls browser contexts and the observe → decide → act → capture loop. `src/brain.js` connects the Codex SDK and supplies an explicitly non-AI runner-check alternative. `src/core.js` validates decisions, groups issues and exports reports.

The SDK launches `scripts/codex-bridge.js`, which invokes Codex with user configuration disabled to avoid inheriting personal plugins, hooks and MCP servers. Authentication still belongs to the user. Agent shell tools and web search are disabled, the workspace is read-only, and each Ghost starts in an empty working directory. The model receives visible observations, not the demo source or answer key.

Evidence is stored under `runs/RUN_ID/ghost-N/NNN.jpg` and `run.json`; exports remain local. Screenshots are observations, not video recordings or executable Playwright traces. The UI’s replay is a slideshow synchronized to action records. Reports do not claim that re-executing a journey will always reproduce a defect.

## Scope and limits

Use authorized staging apps and synthetic data. Ghost blocks cross-origin requests and new tabs, which can prevent fonts, CDNs, OAuth and integrations from loading. This is deliberate for the first local release and must be considered during triage. Same-origin effects remain possible: use a disposable staging environment. Recognizable purchase, deletion, communication, login and legal-acceptance controls are gated; these heuristics are not a complete safety boundary.

Password/email inputs and `[data-ghost-private]` regions are masked in screenshots. Visible text elsewhere can still contain private information and is sent to Codex. Do not use production data. URLs in observations omit query/hash data, but the entered run URL is saved: do not paste tokenized URLs. Authentication, CAPTCHAs, iframes, canvas apps and complex custom controls may require manual testing. Findings are hypotheses or observed symptoms, not guaranteed diagnoses. Live clustering is lexical; final Astra grouping may still over/under-merge related reports. Each original observation remains attached.

One active run at a time, maximum three explorers and thirty actions each. No background retry loops. Long reasoning turns time out. Usage shown is SDK-reported tokens and consumes the account’s subscription limits; it is not a dollar bill. External spend so far: $0.

## Troubleshooting

**Chrome exits immediately inside a Codex task:** macOS sandboxing may deny Chromium Mach port communication. Start Ghost yourself from a normal Terminal. Do not disable Gatekeeper, SIP, browser security, or use a sandbox-bypass flag. The task’s existing server must stop first to free ports 4318/4319.

**Codex startup denied / read-only state database:** run the server in your normal user Terminal so the SDK can use its standard local session storage. Ghost does not copy or export login tokens.

**Codex not found:** set CODEX_BINARY to your installed executable. The bridge requires a Codex version supporting `exec --ignore-user-config` (built against 0.154.0).

**Chrome not installed:** install Chrome from its official source, or set CHROME_PATH to an existing compatible Chromium executable. No browser is downloaded automatically.

**Port already in use:** stop your earlier Ghost server with Ctrl+C, or set PORT and DEMO_PORT together. Update the benchmark URL for nondefault ports.

## Launch

Read docs/launch-checklist.md, docs/launch-copy.md, docs/demo-flow.md, docs/assets-spec.md and docs/deployment.md. The organizer guide specifies September 18, 2026 at 12:01 AM Pacific for the launch. The separate scheduling cutoff, terms and SDK-only eligibility still need verification in the authenticated contest flow. The maker has signed in and opened a Product Hunt draft; no final submission, scheduling or legal acceptance has been completed.

## Review without running an agent

Open `http://127.0.0.1:4318/showcase/` while Ghost is running, or serve `docs/site` with a static web server. The recorded report needs no login and makes no model calls. It preserves the original observations and lets viewers select a finding and jump to its screenshot.

The captioned MP4 is `docs/assets/ghost-demo.mp4`. It contains edited highlights from a continuous real MarkerPad browser recording, with normal-speed actions and a closing maker credit. Publication steps are in `docs/publish-handoff.md`.

Recent runner additions include synthetic video uploads (`fixtures/sample-video.mp4` only), hover, double-click and explicitly logged accessibility-button activation. Each Astra decision starts with bounded recent observations rather than retaining every prior screenshot. Complex canvas interfaces can still limit coverage; see `docs/real-app-demo.md`.

### Continuous browser recordings

The dashboard can optionally record each browser session as a continuous WebM video. These videos are **unmasked**; use synthetic data. Screenshots and step-by-step evidence remain available independently.

Install the recorder once with `PLAYWRIGHT_BROWSERS_PATH=work/playwright-browsers npx playwright install ffmpeg`, set `PLAYWRIGHT_BROWSERS_PATH=work/playwright-browsers` in `.env`, and restart Ghost. Enable the recording checkbox before starting a run. Completed agent cards link to the original video.

Recording mode shows a pointer driven by real mouse events, preserves its position across navigation, and includes click rings and gradual typing. The public demo adds plain-language captions and gentle close-ups, keeps actions at normal speed, and shortens reasoning pauses; the uncut recordings are linked separately. The main video uses MarkerPad; the controlled planted-bug benchmark is linked separately.

### Real-app walkthrough

The [public showcase](https://selimharfouche.github.io/ghost-beta/) now leads with a real MarkerPad exploration: document creation, full Markdown entry, formatted preview, and the export flow. The video includes a cursor, click indicators, close-ups, and plain-language captions. Inspect the complete recording and report beside it. Export completion is not claimed, and the checklist accessibility candidate has now been independently reproduced in a normal browser; see [the detailed report](docs/markerpad-bug-report.md). Maintainer confirmation is pending. The planted-bug benchmark is presented separately.

## Project review

See [the project review](docs/project-review.md) for current product gaps, evidence limits and release blockers.

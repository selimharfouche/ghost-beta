# 75-second genuine demo

Record only after the real Astra benchmark succeeds. The separate runner-check mode must never be passed off as AI exploration.

1. **0–10s:** Show Ghost’s dashboard and the Waypoint staging app. “My tests cover the paths I expect. Ghost looks for the paths I didn’t write down.”
2. **10–20s:** Select the planted-bug URL, three Ghosts, 12 steps, Astra mode. Release Ghosts. Show the Codex subscription connection.
3. **20–40s:** Show each persona’s live screenshots and different journey labels. Speed up long reasoning waits; label the time compression.
4. **40–60s:** Open a genuine finding. Show expected/observed behavior, reproduction steps, and the evidence frame. Scrub backward to the action that triggered it.
5. **60–70s:** Show a second finding from a different persona, then export the report.
6. **70–75s:** End on “Fresh eyes before launch” and the verified product URL. Invite feedback.

## Benchmark protocol

The demo has five intentional faults: trip creation throws, export returns HTTP 500, help is 404, comparison table overflows mobile, search changes opacity without filtering.

Astra receives only screenshots, visible controls/text and its own recent action history. It receives no planted-bug list. The benchmark scorer reads the expected faults after the run. Heuristic mode has no bug-specific scripts but is a deterministic DOM explorer for instrumentation testing; it cannot establish model quality.

Run at least one complete three-persona Astra session. Record steps, tokens, time, discovered planted bugs, unplanted findings and false positives. Review every finding manually. Label sample size; do not market a single seeded-demo recall result as general reliability. Repeat after runner changes only if changes affect behavior.

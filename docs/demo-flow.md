# Current real-app demo

The main video shows MarkerPad, an independently operated browser document editor. Astra chooses the journey: create a document, enter Markdown, inspect the rendered note and explore export. Captions explain each step. Actions play at normal speed; waiting and unsuccessful attempts are omitted from the highlights and retained in the linked uncut recording. Download completion is not claimed.

End with a brief card: **Built by Selim Harfouche using GPT-6 Astra.** Website credits remain visible independently.

The checklist accessibility finding has a separate independent reproduction report in `markerpad-bug-report.md`. A future bug-focused cut should show the actual discovery and independent verification, with submission status stated accurately. Do not imply that the current exploration video includes maintainer confirmation.

## Benchmark protocol

The demo has five intentional faults: trip creation throws, export returns HTTP 500, help is 404, comparison table overflows mobile, search changes opacity without filtering.

Astra receives only screenshots, visible controls/text and its own recent action history. It receives no planted-bug list. The benchmark scorer reads the expected faults after the run. Heuristic mode has no bug-specific scripts but is a deterministic DOM explorer for instrumentation testing; it cannot establish model quality.

Run at least one complete three-persona Astra session. Record steps, tokens, time, discovered planted bugs, unplanted findings and false positives. Review every finding manually. Label sample size; do not market a single seeded-demo recall result as general reliability. Repeat after runner changes only if changes affect behavior.

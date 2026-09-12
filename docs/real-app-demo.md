# Real-app exploration

## Target selection

MarkerPad identifies itself as a web beta: https://markerpad.app/. Its interface says it is local by default and requires no account. The exploration uses a fresh browser context and synthetic content; no personal files, credentials, or existing documents are supplied. One Ghost runs at a time, with a twelve-action ceiling. Off-origin requests remain blocked.

OpenCut Classic was also evaluated as a local target. The official repository was cloned at cf5e79e919144200294fb9fed22a222592a0aeea. Its development build did not become usable within our startup checks, and the server was stopped. No source defects were planted. OpenCut is not used as a successful Ghost demo and its clone is not distributed with Ghost.

## Coverage limitation discovered

First MarkerPad run: c7d0e92f-9038-4dce-9f3d-ac0d42a92777. One Ghost stopped after four actions and five screenshots because it could not activate the canvas app's accessibility entry point. It consumed 72,342 SDK-reported input/output tokens. Its finding describes an automation/accessibility coverage barrier, not a confirmed defect in MarkerPad. Google account requests were blocked by Ghost's environment policy.

This prompted two runner changes: remove stale control IDs on each observation and provide explicitly logged accessibility click activation for button controls. Pointer clicks and accessibility activations remain distinguishable in the action record. Consequential-action guards apply to both.

The showcase must identify limitations honestly. A completed exploration means the agent stopped cleanly; it does not mean every workflow was tested or the app is bug-free. No issue has been sent to the MarkerPad maintainers, and no endorsement is implied.

## Successful bounded exploration

Earlier screenshot-only run: 3c643512-edd7-4252-869c-c25c2410075b. One Astra Ghost completed twelve actions and thirteen screenshots. It activated accessibility, created a synthetic document, edited Markdown source, checked rendered formatting, and opened export options. It did not download an export or prove reload persistence. No manual journey script or expected defect list was supplied.

Astra produced three review candidates: delayed accessibility controls, unnamed checklist controls, and an undiscoverable blank-editor text input. These remain unconfirmed. In particular, Ghost's DOM label extraction and observation timing can explain some accessibility symptoms; the report is not a definitive accessibility audit of MarkerPad. The original model confidence labels remain preserved in the raw record.

Usage: 180,790 input + 1,120 output = 181,910 subscription tokens. This is not a dollar charge or a controlled efficiency comparison with the earlier three-persona demo. External spend remains $0. Another attempt, cd93e24a-8584-48f6-a4b5-a4ffc3b5f9e4, timed out during initial navigation with zero model usage; it is not included as a successful run.

## Current main recording and verification

The main recorded run is `5ca3d8ea-f00a-4e7e-88d8-867ffd48961d`: twelve decisions, thirteen observations, a full Markdown note and export-menu exploration. `scripts/build-real-video.js` builds the captioned highlights. The checkbox naming finding was independently reproduced on September 12 in a normal browser, including after reload and state toggle; see the local review shortlist. Historical confidence notes above describe the state at the time of those runs. Maintainer delivery is tracked in the bug report.

# Real-app launch video

The main website video now shows Ghost exploring https://markerpad.app/, an independent public web beta. No affiliation or endorsement is implied.

Evidence run: `5ca3d8ea-f00a-4e7e-88d8-867ffd48961d`. One curious explorer, 12 decision steps, 13 observation frames. The run completed. Ghost declined optional analytics, worked through accessibility activation, created a synthetic document, entered Markdown, returned to the formatted editor, opened export options, and selected PDF.

The rendered editor visibly contains a heading, paragraph, checklist, bold/italic/code text, quote, and table. A PDF download and reload persistence were not verified. The single checklist accessibility candidate is unconfirmed: Ghost's label extraction may be responsible for the reported empty names. It is not advertised as a confirmed MarkerPad bug.

The approximately one-minute main video is edited real browser footage. It includes cursor movement and real click indicators, normal-speed actions, plain-language captions, and gentle close-ups. Waiting and unsuccessful attempts are omitted from the highlights. The separate full recording retains the entire session, including unsuccessful attempts.

Build: `node scripts/build-real-video.js <run-id>`, then `node scripts/build-showcase.js <run-id>`. These scripts require the private local run artifacts. GitHub Pages publishes only the curated static site; credentials and raw SDK session state stay local.

The earlier Waypoint runs remain available as a separate, explicitly planted-bug benchmark. They are not the main video.

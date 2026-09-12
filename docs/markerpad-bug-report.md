# MarkerPad: rendered checklist checkboxes have no accessible names

Reporter: **Selim Harfouche**, maker of [Ghost](https://github.com/selimharfouche/ghost-beta), built using GPT-6 Astra. Date: September 12, 2026.

Status: independently reproduced in a normal browser after Astra flagged it. Maintainer confirmation and delivery to MarkerPad are pending. This is an external-app finding, not a defect in Ghost. No affiliation or endorsement is implied.

## Reproduction

1. Open https://markerpad.app/ and enable accessibility if prompted.
2. Create a document using synthetic content.
3. Open **Markdown source** and type:

```markdown
# Ghost verification

- [ ] Review draft
- [x] Write summary

Synthetic testing content.
```

4. Return to the editor.
5. Inspect the browser's accessibility tree. Each checkbox exposes its checked state but no name; the task text is a separate text node.
6. Reload the page and enable accessibility again. The document persists and both checkboxes remain unnamed.
7. Toggle the first checkbox. Its state changes from unchecked to checked, but it still has no name.

Expected: each checkbox has the corresponding task text as its accessible name, so assistive-technology users can identify which task they are toggling.

Observed in the browser accessibility tree before reload:

```text
text Ghost verification
checkbox Value: 0
text Review draft
checkbox Value: 1
text Write summary
text Synthetic testing content.
```

The same structure was observed after reload; toggling the first checkbox changed its value to 1. This was independently reproduced in the Codex in-app browser outside Ghost's cross-origin request restrictions. Verification was performed by Codex under the maker's direction. A separate VoiceOver/NVDA session was not performed; this report does not claim specific spoken output or a full accessibility audit.

## Discovery evidence

Astra initially flagged **“Checklist controls lack accessible labels”** at zero-based step 10 in run `5ca3d8ea-f00a-4e7e-88d8-867ffd48961d`, after autonomously creating a document and entering a formatted note. The reproduction above uses a new document and different synthetic task text. No expected defect list was supplied to the exploration agent.

- [Original Ghost report](https://selimharfouche.github.io/ghost-beta/5ca3d8ea-f00a-4e7e-88d8-867ffd48961d.html)
- [Original discovery screenshot](https://selimharfouche.github.io/ghost-beta/evidence/5ca3d8ea-f00a-4e7e-88d8-867ffd48961d/ghost-1/010.jpg)
- [Uncut browser recording](https://selimharfouche.github.io/ghost-beta/recordings/markerpad-ghost-1.webm)

The initial finding was cautiously labelled unconfirmed because Ghost's label extractor is incomplete. The independent browser accessibility-tree reproduction supports the narrower finding above. Other accessibility candidates remain unconfirmed. No claim of first-ever discovery is made.

Public attribution: [GitHub evidence issue #1](https://github.com/selimharfouche/ghost-beta/issues/1), published from the maker’s account.

## Maintainer handoff

MarkerPad's official [feedback page](https://www.markerpad.app/feedback.html) directs reports to **markerpad@uniqh.com**. No official public issue tracker was found. A public report in Ghost's repository provides attribution and evidence; it is not proof of delivery to MarkerPad. Delivery status must be updated only after a successful send.

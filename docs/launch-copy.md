# Product Hunt launch copy

Prepared for maker review. No fields have been submitted.

**Name:** Ghost

**Tagline:** AI beta testers that explore your app before users do

**Description:** Give Ghost a staging URL. Independent AI testers explore your app, find bugs and UX friction, and return evidence, reproduction steps, and screenshot replays. Powered by GPT-6 Astra through the Codex SDK. Runs locally with your Codex login.

**Topics:** Developer Tools, Artificial Intelligence, Software Testing (choose the closest available topics; maximum three).

**Shoutouts:** ChatGPT, OpenAI, Codex, Playwright.

## Maker comment

Hi Product Hunt — I built Ghost because passing tests doesn’t tell you what happens when someone meets your product for the first time.

Give Ghost a staging URL. A curious newcomer, an impatient visitor, and a mobile explorer discover their own journeys, record what happens, and bring back findings with reproduction steps and screenshot replays.

GPT-6 Astra makes the exploration decisions through the Codex SDK. Playwright carries them out and captures browser evidence. Ghost runs locally using your own Codex login and subscription allowance, with no separate API key.

In our planted-bug demo, all three explorers completed their runs. Browser signals and Astra observations together surfaced all five intentional defects. That is one controlled demo, not a general accuracy claim. The recorded report is open for inspection, including suspected friction and repeated observations.

A lesson from building this: evidence and context limits matter as much as exploration. Repeated screenshots made the first concurrent run expensive in subscription tokens, so I bounded the context. Real-app testing also exposed limitations in canvas-based controls; Ghost records those barriers instead of pretending it covered the whole product.

I’d love feedback on which findings you would act on, what Ghost missed, and where autonomous exploration fits into your release process.

## Launch post

Meet Ghost: independent AI beta testers powered by GPT-6 Astra. Give it a staging URL; get explored journeys, findings, reproduction steps, and screenshot replays. Runs locally through the Codex SDK. Try the recorded demo and tell me which findings you would actually fix.

Add the verified live Product Hunt link after scheduling. Do not ask for votes.

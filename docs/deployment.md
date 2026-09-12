# Deployment and distribution

## Recommended contest release

Distribute Ghost as a local developer tool. Each developer runs Node + Chrome + Codex, using their own ChatGPT login. This preserves the requested subscription route. Do not host an unauthenticated public endpoint that runs commands against the maker’s Codex account.

1. Complete the real-browser/Astra validation gates in launch-checklist.md.
2. Create a public source repository under the maker’s account, or upload a release archive. The local Git repository is ready, and the owner’s existing GitHub login is available. Private repository: https://github.com/selimharfouche/ghost-beta. Public distribution is a separate release step.
3. Exclude `.env`, runs, node_modules, local SDK session files, credentials and raw private screenshots. Review the staged file list before pushing.
4. Set the Product Hunt website URL to a public readme/release or an independently hosted marketing page that links to the release. The local `/about` route contains finished landing-page copy.
5. Test the install/download on a separate machine. Capture a real demo video and upload real product screenshots.
6. Schedule the contest entry only after confirming rules and launch readiness.

No external hosting was provisioned; no paid plan or domain was purchased. A public landing page can be deployed after a source/download URL exists. The browser worker requires a full process runtime, so it is not a normal static/serverless web deployment.

## Local operating model

The app binds to 127.0.0.1 and rejects foreign Host/Origin headers. It has no public authentication or tenant isolation. Keep it local; do not expose through a tunnel. Runs can contain staging data. Store them privately and remove them manually when no longer needed.

The launcher uses Google Chrome by default. Configuration examples are in .env.example. Keep the terminal open during runs. Ctrl+C cancels active runs and shuts down the local servers. Interrupted records remain visible after restart.

## If a hosted product is wanted later

That is a separate architecture decision: authenticated users, isolated browser workers, an egress policy with DNS/IP enforcement, per-tenant evidence storage, billing control and a supported model authentication route. Do not deploy the owner’s subscription credentials to a shared service. This is outside the contest MVP and would require account/payment approval where applicable.

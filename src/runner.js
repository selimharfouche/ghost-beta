import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PERSONAS,
  cleanUrl,
  safeAction,
  cluster,
  reportMarkdown,
} from "./core.js";
import { createBrain, heuristicDecision } from "./brain.js";
import { triage } from "./triage.js";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
export async function observe(page, step) {
  return page.evaluate((step) => {
    for (const e of document.querySelectorAll("[data-ghost-id]"))
      e.removeAttribute("data-ghost-id");
    const controls = [
      ...document.querySelectorAll(
        'a,button,input,textarea,select,[role="button"],[role="tab"],[role="menuitem"],[role="checkbox"],[contenteditable="true"]',
      ),
    ]
      .filter(
        (e) =>
          (e.getClientRects().length &&
            getComputedStyle(e).visibility !== "hidden") ||
          e.type === "file",
      )
      .slice(0, 80)
      .map((e, i) => {
        e.setAttribute("data-ghost-id", String(i + 1));
        const label = (
          e.getAttribute("aria-label") ||
          e.labels?.[0]?.innerText ||
          e.innerText ||
          e.getAttribute("title") ||
          e.getAttribute("placeholder") ||
          e.getAttribute("name") ||
          ""
        )
          .trim()
          .slice(0, 140);
        return {
          id: i + 1,
          tag: e.tagName.toLowerCase(),
          type: e.getAttribute("type") || "",
          role: e.getAttribute("role") || "",
          value: /password|email/i.test(e.type)
            ? "[masked]"
            : (e.value || "").slice(0, 200),
          label,
          disabled: !!e.disabled,
          options:
            e.tagName === "SELECT"
              ? [...e.options].map((o) => ({ label: o.label, value: o.value }))
              : undefined,
        };
      });
    const u = new URL(location.href);
    u.search = "";
    u.hash = "";
    return {
      step,
      url: u.href,
      title: document.title,
      text: document.body.innerText.slice(0, 6500),
      controls,
      overflow: document.documentElement.scrollWidth > innerWidth + 8,
    };
  }, step);
}
export async function runGhosts(run, { root, save, signal, browserFactory }) {
  let browser;
  try {
    browser = await (browserFactory || ((opts) => chromium.launch(opts)))(
      process.env.CHROME_PATH
        ? { executablePath: process.env.CHROME_PATH }
        : { channel: process.env.BROWSER_CHANNEL || "chrome" },
    );
    await Promise.all(
      run.ghosts.map(async (ghost) => {
        const persona = PERSONAS.find((p) => p.id === ghost.persona);
        const dir = path.join(root, run.id, ghost.id);
        await fs.mkdir(dir, { recursive: true });
        const ctx = await browser.newContext({
          viewport: { width: persona.width, height: persona.height },
          serviceWorkers: "block",
          acceptDownloads: false,
        });
        const origin = new URL(run.url).origin;
        const blockedOrigins = new Set();
        await ctx.route("**/*", (route) => {
          let u;
          try {
            u = new URL(route.request().url());
          } catch {
            return route.abort();
          }
          if (u.origin === origin || ["blob:", "data:"].includes(u.protocol))
            return route.continue();
          blockedOrigins.add(u.origin);
          return route.abort();
        });
        const page = await ctx.newPage();
        page.setDefaultTimeout(5000);
        page.setDefaultNavigationTimeout(45000);
        ctx.on("page", (p) => {
          if (p !== page) p.close().catch(() => {});
        });
        page.on("dialog", (d) => d.dismiss().catch(() => {}));
        let pending = [];
        page.on("pageerror", (e) =>
          pending.push({ kind: "runtime", message: e.message.slice(0, 500) }),
        );
        page.on("response", (r) => {
          if (r.status() >= 400)
            pending.push({
              kind: "http",
              message: `HTTP ${r.status()} at ${cleanUrl(r.url())}`,
            });
        });
        ghost.status = "running";
        save();
        let decide,
          history = [];
        try {
          if (run.mode === "codex") {
            const workspace = path.join(dir, "workspace");
            await fs.mkdir(workspace, { recursive: true });
            decide = createBrain(workspace);
          }
          await page.goto(run.url, { waitUntil: "domcontentloaded" });
          for (let i = 0; i <= run.maxSteps; i++) {
            if (signal.aborted) throw Error("Cancelled by user");
            await delay(250);
            const obs = await observe(page, i);
            obs.environment = {
              externalRequestsBlocked: [...blockedOrigins],
              syntheticFixtures: ["sample-video"],
            };
            ghost.environment = obs.environment;
            const file = `${i.toString().padStart(3, "0")}.jpg`;
            const screenshot = path.join(dir, file);
            await page.screenshot({
              path: screenshot,
              type: "jpeg",
              quality: 65,
              mask: [
                page.locator(
                  'input[type="password"],input[type="email"],[data-ghost-private]',
                ),
              ],
            });
            const frame = `/artifacts/${run.id}/${ghost.id}/${file}`;
            const step = {
              index: i,
              at: new Date().toISOString(),
              url: obs.url,
              title: obs.title,
              screenshot: frame,
              journey: "Observe",
              thought: "Inspect the current page",
              action: null,
              signals: pending.splice(0),
            };
            ghost.steps.push(step);
            const repro = () => [
              `Open ${run.url}`,
              ...ghost.steps
                .filter((s) => s.action)
                .map(
                  (s) =>
                    `${s.action.action} ${s.action.label || ""}${s.action.value ? " = " + s.action.value : ""} — ${s.url}`,
                ),
            ];
            const add = (f) => {
              ghost.findings.push({
                ...f,
                ghost: ghost.id,
                url: obs.url,
                step: i,
                screenshot: frame,
                repro: repro(),
              });
            };
            for (const event of step.signals)
              add({
                title:
                  event.kind === "runtime"
                    ? "Uncaught application error"
                    : "Failed HTTP response",
                severity: "high",
                expected:
                  "The page completes the requested operation without errors.",
                actual: event.message,
                confidence: "observed",
                source: "browser",
                fingerprint: event.message,
              });
            if (obs.overflow)
              add({
                title: "Content overflows the viewport",
                severity: "medium",
                expected:
                  "Content fits the viewport without horizontal scrolling.",
                actual: `Document wider than ${persona.width}px viewport.`,
                confidence: "observed",
                source: "browser",
                fingerprint: "overflow",
              });
            if (i === run.maxSteps) {
              step.thought = "Step limit reached; final state captured.";
              break;
            }
            let d;
            if (decide) {
              step.thought = "Astra is choosing the next step…";
              save();
              const timeout = AbortSignal.timeout(150000);
              const result = await decide({
                persona,
                observation: obs,
                history,
                screenshot,
                signal: AbortSignal.any([signal, timeout]),
              });
              d = result.decision;
              ghost.threadId = result.threadId;
              ghost.usage.input_tokens += result.usage?.input_tokens || 0;
              ghost.usage.output_tokens += result.usage?.output_tokens || 0;
            } else d = heuristicDecision(obs, history, persona);
            step.thought = d.thought;
            step.journey = d.journey;
            for (const f of d.findings) {
              if (
                !f.evidenceSteps.length ||
                f.evidenceSteps.some((s) => s < 0 || s > i)
              )
                continue;
              add({ ...f, source: "Astra" });
            }
            if (d.action === "done") break;
            const target = obs.controls.find((c) => c.id === d.target);
            const signature = obs.url + "|" + target?.tag + "|" + target?.label;
            step.action = {
              action: d.action,
              label: target?.label || "",
              target: d.target,
              value: d.value,
            };
            try {
              safeAction(d, target);
              const locator = page.locator(`[data-ghost-id="${d.target}"]`);
              if (d.action === "click") await locator.click();
              if (d.action === "activate") {
                if (target.role !== "button" && target.tag !== "button")
                  throw Error("Accessibility activation requires a button");
                await locator.dispatchEvent("click");
              }
              if (d.action === "doubleclick") await locator.dblclick();
              if (d.action === "hover") await locator.hover();
              if (d.action === "upload") {
                const fixture = fileURLToPath(
                  new URL("../fixtures/sample-video.mp4", import.meta.url),
                );
                if (target.type === "file")
                  await locator.setInputFiles(fixture);
                else {
                  const chooserPromise = page.waitForEvent("filechooser", {
                    timeout: 5000,
                  });
                  await locator.click();
                  await (await chooserPromise).setFiles(fixture);
                }
              }
              if (d.action === "fill") await locator.fill(d.value);
              if (d.action === "select") await locator.selectOption(d.value);
              if (d.action === "press") {
                const focused = await page.evaluate(() => {
                  const e = document.activeElement;
                  return {
                    label: (
                      e?.getAttribute("aria-label") ||
                      e?.textContent ||
                      ""
                    ).slice(0, 200),
                    type: e?.getAttribute("type") || "",
                  };
                });
                if (["Enter", "Space"].includes(d.value))
                  safeAction({ action: "click" }, focused);
                await page.keyboard.press(d.value);
              }
              if (d.action === "scroll")
                await page.mouse.wheel(0, d.value === "up" ? -650 : 650);
              if (d.action === "back")
                await page.goBack({ waitUntil: "domcontentloaded" });
              if (d.action === "wait") await delay(1000);
              step.outcome = "executed";
            } catch (e) {
              step.outcome = e.message.split("\n")[0].slice(0, 250);
            }
            history.push({
              step: i,
              url: obs.url,
              action: step.action,
              outcome: step.outcome,
              signature,
              journey: d.journey,
              observedText: obs.text.slice(0, 2000),
              signals: step.signals,
            });
            run.issues = cluster(run.ghosts.flatMap((g) => g.findings));
            save();
          }
          ghost.status = "completed";
        } catch (e) {
          ghost.status = signal.aborted ? "cancelled" : "failed";
          ghost.error = e.message.slice(0, 500);
        } finally {
          await ctx.close();
          run.issues = cluster(run.ghosts.flatMap((g) => g.findings));
          save();
        }
      }),
    );
    run.status = signal.aborted
      ? "cancelled"
      : run.ghosts.every((g) => g.status === "completed")
        ? "completed"
        : run.ghosts.every((g) => g.status === "failed")
          ? "failed"
          : "partial";
  } catch (e) {
    run.status = "failed";
    run.error =
      "Browser runner could not start. Run Ghost from your local Terminal with Chrome installed; see README troubleshooting.";
    run.diagnostic = e.message.slice(-4000);
    for (const g of run.ghosts) {
      if (["queued", "running"].includes(g.status)) g.status = "failed";
    }
  } finally {
    await browser?.close();
    const finalStatus = run.status;
    if (run.mode === "codex" && !signal.aborted) {
      try {
        run.status = "running";
        run.triage = { status: "grouping" };
        save();
        await triage(run, root, signal);
      } catch (e) {
        run.triage = { status: "failed", error: e.message.slice(0, 250) };
      }
    }
    run.status = signal.aborted ? "cancelled" : finalStatus;
    run.finishedAt = new Date().toISOString();
    if (run.triage?.status !== "completed")
      run.issues = cluster(run.ghosts.flatMap((g) => g.findings));
    save();
    await fs.writeFile(
      path.join(root, run.id, "report.md"),
      reportMarkdown(run),
    );
  }
}

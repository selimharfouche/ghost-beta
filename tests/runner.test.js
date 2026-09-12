import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { runGhosts } from "../src/runner.js";
const makeRun = () => ({
  id: "test-session",
  url: "http://staging.test/",
  mode: "heuristic",
  status: "running",
  maxSteps: 2,
  issues: [],
  ghosts: ["curious", "mobile"].map((persona, i) => ({
    id: "ghost-" + i,
    persona,
    status: "queued",
    steps: [],
    findings: [],
    usage: { input_tokens: 0, output_tokens: 0 },
  })),
});
function fixture() {
  let contexts = 0,
    closed = 0;
  const browser = {
    newContext: async () => {
      contexts++;
      let page;
      return {
        route: async () => {},
        on: () => {},
        close: async () => {
          closed++;
        },
        newPage: async () => {
          let handlers = {};
          page = {
            setDefaultTimeout() {},
            setDefaultNavigationTimeout() {},
            on(k, f) {
              handlers[k] = f;
            },
            goto: async () => {},
            evaluate: async (fn, step) => ({
              step,
              url: "http://staging.test/",
              title: "Synthetic test fixture",
              text: "",
              controls: [{ id: 1, tag: "button", label: "Explore" }],
              overflow: true,
            }),
            screenshot: async () => {},
            locator: () => ({
              click: async () =>
                handlers.pageerror?.(new Error("synthetic failure")),
            }),
            goBack: async () => {},
          };
          return page;
        },
      };
    },
    close: async () => {},
  };
  return { factory: async () => browser, stats: () => ({ contexts, closed }) };
}
test("independent contexts, final evidence frame, grouping and report survive a whole run", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ghost-test-"));
  const run = makeRun(),
    f = fixture();
  let saves = 0;
  await runGhosts(run, {
    root,
    save: () => saves++,
    signal: new AbortController().signal,
    browserFactory: f.factory,
  });
  assert.equal(run.status, "completed");
  assert.deepEqual(f.stats(), { contexts: 2, closed: 2 });
  assert.equal(run.ghosts[0].steps.length, 3);
  assert.ok(run.issues.some((i) => i.actual === "synthetic failure"));
  assert.ok(run.issues.some((i) => i.occurrences.length > 1));
  assert.ok(
    (await fs.readFile(path.join(root, run.id, "report.md"), "utf8")).includes(
      "synthetic failure",
    ),
  );
  assert.ok(saves > 2);
  await fs.rm(root, { recursive: true, force: true });
});
test("cancelled runs stop and close every context", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ghost-test-"));
  const run = makeRun(),
    f = fixture(),
    c = new AbortController();
  c.abort();
  await runGhosts(run, {
    root,
    save: () => {},
    signal: c.signal,
    browserFactory: f.factory,
  });
  assert.equal(run.status, "cancelled");
  assert.ok(run.ghosts.every((g) => g.status === "cancelled"));
  assert.equal(f.stats().closed, 2);
  await fs.rm(root, { recursive: true, force: true });
});
test("startup failure marks queued Ghosts failed", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "ghost-test-"));
  const run = makeRun();
  await fs.mkdir(path.join(root, run.id));
  await runGhosts(run, {
    root,
    save: () => {},
    signal: new AbortController().signal,
    browserFactory: async () => {
      throw Error("launch blocked");
    },
  });
  assert.equal(run.status, "failed");
  assert.ok(run.ghosts.every((g) => g.status === "failed"));
  await fs.rm(root, { recursive: true, force: true });
});

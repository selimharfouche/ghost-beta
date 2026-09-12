import fs from "node:fs/promises";
const base = process.env.GHOST_URL || "http://127.0.0.1:4318";
const mode = process.env.BENCHMARK_MODE || "heuristic";
const response = await fetch(base + "/api/runs", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "http://127.0.0.1:4319/",
    mode,
    count: Number(process.env.GHOST_COUNT || 3),
    maxSteps: Number(process.env.GHOST_STEPS || 18),
  }),
});
let lastProgress = "";
let run = await response.json();
if (!response.ok) throw Error(run.error);
console.log("Started", run.id, mode);
while (run.status === "running") {
  await new Promise((r) => setTimeout(r, 2000));
  run = await fetch(base + "/api/runs/" + run.id).then((r) => r.json());
  const progress = run.ghosts
    .map((g) => `${g.name}:${g.steps.length}:${g.status}`)
    .join(" ");
  if (progress !== lastProgress) console.log(progress);
  lastProgress = progress;
}
const truth = [
  {
    id: "trip-crash",
    label: "Trip creation throws",
    match: (f) => /itinerary|trip creation/i.test(f.actual),
  },
  {
    id: "export-500",
    label: "Export returns HTTP 500",
    match: (f) => /500.*export|export.*unavailable/i.test(f.actual),
  },
  {
    id: "help-404",
    label: "Help returns 404",
    match: (f) => /404/i.test(f.actual),
  },
  {
    id: "mobile-overflow",
    label: "Comparison overflows mobile",
    match: (f) => /overflow|wider than/i.test(f.title + " " + f.actual),
  },
  {
    id: "search-no-effect",
    label: "Search does not filter",
    match: (f) => /search|filter/i.test(f.title + " " + f.actual),
  },
];
const results = truth.map((t) => ({
  id: t.id,
  label: t.label,
  detected: run.issues.some(t.match),
}));
const out = {
  runId: run.id,
  mode,
  status: run.status,
  completedGhosts: run.ghosts.filter((g) => g.status === "completed").length,
  planted: truth.length,
  detected: results.filter((r) => r.detected).length,
  results,
  issues: run.issues.map((f) => ({
    title: f.title,
    actual: f.actual,
    source: f.source,
  })),
  note:
    mode === "heuristic"
      ? "Instrumentation benchmark, not Astra quality. Human review is required."
      : "Astra-driven exploration plus browser instrumentation. String matching is a scoring aid; inspect evidence for recall and precision.",
};
await fs.mkdir("docs", { recursive: true });
await fs.writeFile(`docs/benchmark-${mode}.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
if (run.status !== "completed") process.exitCode = 1;

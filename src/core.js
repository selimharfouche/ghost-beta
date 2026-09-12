import { createHash } from "node:crypto";
export const PERSONAS = [
  {
    id: "curious",
    name: "Mira",
    label: "The curious newcomer",
    brief:
      "You are a curious first-time visitor. Discover what this product does, try its main promise, and follow unfamiliar paths.",
    width: 1280,
    height: 800,
  },
  {
    id: "hurried",
    name: "Leo",
    label: "The impatient visitor",
    brief:
      "You have little time. Skim, take shortcuts, try search and the fastest path to value. Notice confusing feedback and dead ends.",
    width: 1280,
    height: 800,
  },
  {
    id: "mobile",
    name: "Sana",
    label: "The mobile explorer",
    brief:
      "You use a narrow mobile browser. Explore primary workflows and forms. Notice clipping, navigation friction and unusable controls.",
    width: 390,
    height: 844,
  },
];
export const decisionSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thought: { type: "string" },
    journey: { type: "string" },
    action: {
      type: "string",
      enum: [
        "click",
        "fill",
        "select",
        "press",
        "scroll",
        "back",
        "wait",
        "done",
      ],
    },
    target: { type: "integer" },
    value: { type: "string" },
    findings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          expected: { type: "string" },
          actual: { type: "string" },
          confidence: { type: "string", enum: ["observed", "suspected"] },
          evidenceSteps: { type: "array", items: { type: "integer" } },
        },
        required: [
          "title",
          "severity",
          "expected",
          "actual",
          "confidence",
          "evidenceSteps",
        ],
      },
    },
  },
  required: ["thought", "journey", "action", "target", "value", "findings"],
};
export function validateDecision(d) {
  if (
    !d ||
    !decisionSchema.properties.action.enum.includes(d.action) ||
    !Number.isInteger(d.target) ||
    typeof d.value !== "string" ||
    d.value.length > 1000 ||
    typeof d.thought !== "string" ||
    typeof d.journey !== "string" ||
    !Array.isArray(d.findings)
  )
    throw Error("Invalid agent decision");
  for (const f of d.findings) {
    if (
      !f ||
      !["high", "medium", "low"].includes(f.severity) ||
      !["observed", "suspected"].includes(f.confidence) ||
      !["title", "expected", "actual"].every(
        (k) => typeof f[k] === "string" && f[k].length <= 3000,
      ) ||
      !Array.isArray(f.evidenceSteps) ||
      !f.evidenceSteps.every(Number.isInteger)
    )
      throw Error("Invalid finding");
  }
  return d;
}
export const cleanUrl = (raw) => {
  const u = new URL(raw);
  u.search = "";
  u.hash = "";
  u.username = "";
  u.password = "";
  return u.href;
};
export function validateUrl(raw) {
  const u = new URL(raw);
  if (!["http:", "https:"].includes(u.protocol) || u.username || u.password)
    throw Error("Use an HTTP(S) staging URL without embedded credentials");
  return u;
}
export function safeAction(d, target) {
  if (["click", "fill", "select"].includes(d.action) && !target)
    throw Error("Target no longer exists");
  if (
    target &&
    /password|credit.?card|\bcvv\b|\bssn\b/i.test(
      target.type + " " + target.label,
    )
  )
    throw Error("Sensitive field: manual testing required");
  if (
    d.action === "click" &&
    /\b(delete|remove account|purchase|pay now|place order|subscribe|send|invite|publish|accept|agree|sign in|log in|login|sign up|register)\b/i.test(
      target?.label || "",
    )
  )
    throw Error("Consequential action requires a human");
  if (
    d.action === "press" &&
    !["Tab", "Enter", "Escape", "ArrowDown", "ArrowUp", "Space"].includes(
      d.value,
    )
  )
    throw Error("Unsupported key");
}
export function cluster(findings) {
  const groups = [];
  for (const f of findings) {
    const tokens = (s) =>
      new Set(
        s
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, " ")
          .split(/\s+/)
          .filter((x) => x.length > 2),
      );
    const a = tokens(f.title + " " + f.actual);
    const group = groups.find((g) => {
      if (g.url !== f.url || g.source !== f.source) return false;
      if (g.fingerprint && g.fingerprint === f.fingerprint) return true;
      const b = tokens(g.title + " " + g.actual);
      let n = 0;
      for (const x of a) if (b.has(x)) n++;
      return n / Math.max(1, new Set([...a, ...b]).size) > 0.58;
    });
    if (group) {
      group.occurrences.push(f);
      if (
        ["low", "medium", "high"].indexOf(f.severity) >
        ["low", "medium", "high"].indexOf(group.severity)
      )
        group.severity = f.severity;
    } else
      groups.push({
        ...f,
        id: createHash("sha256")
          .update(f.url + f.title + groups.length)
          .digest("hex")
          .slice(0, 10),
        occurrences: [f],
      });
  }
  return groups.sort(
    (a, b) =>
      ({ high: 0, medium: 1, low: 2 })[a.severity] -
      { high: 0, medium: 1, low: 2 }[b.severity],
  );
}
export function reportMarkdown(run) {
  return `# Ghost beta report\n\nTarget: ${run.url}\n\nMode: ${run.mode} · Model: ${run.model || "no model"} · Status: ${run.status}\n\n${run.issues.length} grouped findings · ${run.ghosts.reduce((n, g) => n + g.steps.length, 0)} observations\n\n${run.issues.map((f, i) => `## ${i + 1}. [${f.severity}] ${f.title}\n\n${f.confidence}; ${f.source}. ${f.occurrences.length} occurrence(s).\n\nExpected: ${f.expected}\n\nObserved: ${f.actual}\n\nURL: ${f.url}\n\n${f.occurrences.map((o) => `### ${o.ghost}\n\n${o.repro.map((r, j) => `${j + 1}. ${r}`).join("\n")}\n\nEvidence: ${o.screenshot || "none"}\n`).join("\n")}`).join("\n")}\n\nAutomated findings need human triage. A screenshot replay records observations; it does not re-execute the actions.\n`;
}

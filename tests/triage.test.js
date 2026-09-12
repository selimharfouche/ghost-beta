import { test } from "node:test";
import assert from "node:assert/strict";
import { applyGroups } from "../src/triage.js";
const issues = [
  {
    id: "a",
    source: "browser",
    severity: "high",
    title: "Crash",
    occurrences: [{ step: 1 }],
  },
  {
    id: "b",
    source: "Astra",
    severity: "medium",
    title: "No result",
    occurrences: [{ step: 2 }],
  },
];
test("semantic grouping preserves every occurrence and strongest severity", () => {
  const r = applyGroups(issues, [{ ids: ["a", "b"], representative: "b" }]);
  assert.equal(r.length, 1);
  assert.equal(r[0].title, "No result");
  assert.equal(r[0].severity, "high");
  assert.equal(r[0].occurrences.length, 2);
});
test("invalid semantic groups cannot discard or fabricate evidence", () => {
  assert.throws(() =>
    applyGroups(issues, [{ ids: ["a"], representative: "a" }]),
  );
  assert.throws(() =>
    applyGroups(issues, [{ ids: ["a", "a", "b"], representative: "a" }]),
  );
  assert.throws(() =>
    applyGroups(issues, [{ ids: ["a", "b", "x"], representative: "a" }]),
  );
});

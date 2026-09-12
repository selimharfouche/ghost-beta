import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateUrl,
  validateDecision,
  safeAction,
  cluster,
  cleanUrl,
} from "../src/core.js";
test("URL policy rejects credentials and local file scheme", () => {
  assert.throws(() => validateUrl("file:///etc/passwd"));
  assert.throws(() => validateUrl("https://u:p@example.com"));
  assert.equal(validateUrl("https://example.com").hostname, "example.com");
  assert.equal(
    cleanUrl("https://example.com/x?token=secret#secret"),
    "https://example.com/x",
  );
});
test("action guard refuses purchases, sensitive fields, arbitrary keys and missing targets", () => {
  assert.throws(() => safeAction({ action: "click" }, { label: "Pay now" }));
  assert.throws(() => safeAction({ action: "fill" }, { type: "password" }));
  assert.throws(() => safeAction({ action: "press", value: "Meta+r" }));
  assert.throws(() => safeAction({ action: "click" }));
  safeAction({ action: "fill" }, { label: "Trip name", type: "text" });
});
test("clustering combines equivalent evidence across personas but not different routes", () => {
  const a = {
    url: "https://a.test/x",
    title: "Runtime error",
    actual: "itinerary undefined",
    source: "browser",
    severity: "high",
    fingerprint: "err",
  };
  const r = cluster([
    a,
    { ...a, ghost: "two" },
    { ...a, url: "https://a.test/y" },
  ]);
  assert.equal(r.length, 2);
  assert.equal(r[0].occurrences.length, 2);
});
test("untrusted model response is validated before execution", () => {
  assert.throws(() =>
    validateDecision({ action: "shell", target: 1, value: "x" }),
  );
  assert.throws(() =>
    validateDecision({ action: "click", target: "selector", value: "x" }),
  );
});

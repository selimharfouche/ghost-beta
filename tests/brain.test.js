import { test } from "node:test";
import assert from "node:assert/strict";
import { heuristicDecision } from "../src/brain.js";
test("free explorer chooses visible controls without a planted-bug script", () => {
  const obs = {
    url: "https://test/",
    controls: [{ id: 9, tag: "button", label: "An unfamiliar thing" }],
  };
  assert.equal(heuristicDecision(obs, [], { id: "curious" }).target, 9);
  assert.equal(
    heuristicDecision(
      obs,
      [{ signature: "https://test/|button|An unfamiliar thing" }],
      { id: "curious" },
    ).action,
    "back",
  );
});

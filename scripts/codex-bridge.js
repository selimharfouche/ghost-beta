#!/usr/bin/env node
import { spawn } from "node:child_process";
// Keep the owner's authentication, but do not load their plugins, hooks or MCP servers.
const args = process.argv.slice(2);
if (args[0] === "exec") args.splice(1, 0, "--ignore-user-config");
const child = spawn(process.env.CODEX_BINARY || "codex", args, {
  stdio: "inherit",
});
process.on("SIGTERM", () => child.kill("SIGTERM"));
process.on("SIGINT", () => child.kill("SIGINT"));
child.on("error", (e) => {
  console.error(e.message);
  process.exit(1);
});
child.on("exit", (code) => process.exit(code ?? 1));

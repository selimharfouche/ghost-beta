import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { PERSONAS, validateUrl, reportMarkdown } from "./core.js";
import { authStatus } from "./brain.js";
import { runGhosts } from "./runner.js";
const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.resolve(process.env.RUNS_DIR || path.join(base, "runs"));
fs.mkdirSync(root, { recursive: true });
const port = Number(process.env.PORT || 4318),
  demoPort = Number(process.env.DEMO_PORT || 4319),
  host = "127.0.0.1";
const runs = new Map();
const controllers = new Map();
for (const id of fs.readdirSync(root)) {
  try {
    const r = JSON.parse(
      fs.readFileSync(path.join(root, id, "run.json"), "utf8"),
    );
    if (r.status === "running") {
      r.status = "interrupted";
      r.error = "Server restarted; start a new run.";
      for (const g of r.ghosts)
        if (["queued", "running"].includes(g.status)) g.status = "interrupted";
    }
    runs.set(id, r);
  } catch {}
}
const json = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
};
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".md": "text/markdown",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};
function file(res, p) {
  if (!fs.existsSync(p) || !fs.statSync(p).isFile())
    return json(res, 404, { error: "Not found" });
  res.writeHead(200, {
    "Content-Type": types[path.extname(p)] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  });
  fs.createReadStream(p).pipe(res);
}
async function body(req) {
  let data = "";
  for await (const chunk of req) {
    data += chunk;
    if (data.length > 10000) throw Error("Request too large");
  }
  return JSON.parse(data || "{}");
}
const server = http.createServer(async (req, res) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  const authority = `${host}:${port}`;
  if (![authority, `localhost:${port}`].includes(req.headers.host))
    return json(res, 403, { error: "Invalid host" });
  if (
    req.headers.origin &&
    !["http://" + authority, `http://localhost:${port}`].includes(
      req.headers.origin,
    )
  )
    return json(res, 403, { error: "Cross-origin requests are blocked" });
  const u = new URL(req.url, `http://${authority}`);
  const parts = u.pathname.split("/").filter(Boolean);
  try {
    if (u.pathname === "/api/config")
      return json(res, 200, {
        personas: PERSONAS,
        demoUrl: `http://${host}:${demoPort}/`,
        model: "gpt-6-astra",
        auth: authStatus(),
        externalSpend: 0,
      });
    if (u.pathname === "/api/runs" && req.method === "GET")
      return json(
        res,
        200,
        [...runs.values()]
          .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
          .map((r) => ({
            id: r.id,
            url: r.url,
            mode: r.mode,
            status: r.status,
            createdAt: r.createdAt,
            issueCount: r.issues.length,
          })),
      );
    if (u.pathname === "/api/runs" && req.method === "POST") {
      if (controllers.size)
        return json(res, 409, {
          error:
            "A session is already running. Stop it before starting another.",
        });
      const b = await body(req);
      const url = validateUrl(b.url);
      if (
        url.port === String(port) &&
        ["127.0.0.1", "localhost"].includes(url.hostname)
      )
        throw Error("Use a staging app, not the Ghost dashboard");
      if (!["codex", "heuristic"].includes(b.mode))
        throw Error("Choose an exploration mode");
      if (b.mode === "codex" && !authStatus())
        throw Error(
          "Sign into Codex with ChatGPT first. API-key sessions are not used.",
        );
      if (b.mode === "heuristic" && url.origin !== `http://${host}:${demoPort}`)
        throw Error(
          "The free runner check is limited to the planted-bug demo. Use Astra for staging apps.",
        );
      const count = Number(b.count || 3),
        maxSteps = Number(b.maxSteps || 12);
      if (
        !Number.isInteger(count) ||
        count < 1 ||
        count > 3 ||
        !Number.isInteger(maxSteps) ||
        maxSteps < 1 ||
        maxSteps > 30
      )
        throw Error("Use 1–3 Ghosts and 1–30 steps.");
      const id = randomUUID();
      const run = {
        id,
        url: url.href,
        mode: b.mode,
        model: b.mode === "codex" ? "gpt-6-astra" : null,
        status: "running",
        createdAt: new Date().toISOString(),
        maxSteps,
        recordVideo: b.recordVideo === true,
        issues: [],
        ghosts: PERSONAS.slice(0, count).map((p, i) => ({
          id: `ghost-${i + 1}`,
          persona: p.id,
          name: p.name,
          label: p.label,
          status: "queued",
          steps: [],
          findings: [],
          usage: { input_tokens: 0, output_tokens: 0 },
        })),
      };
      await fsp.mkdir(path.join(root, id));
      runs.set(id, run);
      const controller = new AbortController();
      controllers.set(id, controller);
      const save = () => {
        const p = path.join(root, id, "run.json");
        fs.writeFileSync(p + ".tmp", JSON.stringify(run, null, 2));
        fs.renameSync(p + ".tmp", p);
      };
      save();
      runGhosts(run, { root, save, signal: controller.signal })
        .catch((e) => {
          run.status = "failed";
          run.error = e.message;
          save();
        })
        .finally(() => controllers.delete(id));
      return json(res, 202, run);
    }
    if (parts[0] === "api" && parts[1] === "runs" && parts[2]) {
      const r = runs.get(parts[2]);
      if (!r) return json(res, 404, { error: "Run not found" });
      if (parts[3] === "cancel" && req.method === "POST") {
        controllers.get(r.id)?.abort();
        return json(res, 200, { ok: true });
      }
      if (parts[3] === "report") {
        res.writeHead(200, {
          "Content-Type": "text/markdown",
          "Content-Disposition": 'attachment; filename="ghost-report.md"',
        });
        return res.end(reportMarkdown(r));
      }
      return json(res, 200, r);
    }
    if (parts[0] === "artifacts") {
      if (
        parts.length !== 4 ||
        !/^[a-f0-9-]{36}$/.test(parts[1]) ||
        !/^ghost-[1-3]$/.test(parts[2]) ||
        !/^(\d{3}\.jpg|browser\.webm)$/.test(parts[3])
      )
        return json(res, 404, { error: "Not found" });
      return file(res, path.join(root, ...parts.slice(1)));
    }
    if (u.pathname.startsWith("/showcase/")) {
      const relative =
        decodeURIComponent(u.pathname.slice("/showcase/".length)) ||
        "index.html";
      const showcaseRoot = path.join(base, "docs", "site");
      const target = path.resolve(showcaseRoot, relative);
      if (
        !target.startsWith(showcaseRoot + path.sep) ||
        !/\.(html|css|svg|jpg|png|mp4|webm|js|vtt)$/.test(target)
      )
        return json(res, 404, { error: "Not found" });
      return file(res, target);
    }
    const publicFiles = {
      "/": "index.html",
      "/app.js": "app.js",
      "/style.css": "style.css",
      "/about": "landing.html",
      "/logo.svg": "logo.svg",
    };
    if (publicFiles[u.pathname])
      return file(res, path.join(base, "public", publicFiles[u.pathname]));
    json(res, 404, { error: "Not found" });
  } catch (e) {
    json(res, 400, { error: e.message });
  }
});
const demo = http.createServer((req, res) => {
  const u = new URL(req.url, `http://${host}:${demoPort}`);
  if (u.pathname === "/api/export")
    return json(res, 500, {
      error: "Export service unavailable. Please try later.",
    });
  if (u.pathname === "/help") {
    res.writeHead(404, { "Content-Type": "text/html" });
    return res.end(
      '<h1>404 — Page not found</h1><p>This help page is unavailable.</p><a href="/">Return to Waypoint</a>',
    );
  }
  file(res, path.join(base, "public", "demo.html"));
});
for (const service of [server, demo])
  service.on("error", (error) => {
    console.error(
      error.code === "EADDRINUSE"
        ? "Ghost port already in use. Open the running dashboard at http://127.0.0.1:" +
            port +
            " or choose PORT and DEMO_PORT in .env."
        : error.message,
    );
    shutdown();
  });
server.listen(port, host, () => console.log(`Ghost: http://${host}:${port}`));
demo.listen(demoPort, host, () =>
  console.log(`Demo: http://${host}:${demoPort}`),
);
function shutdown() {
  for (const c of controllers.values()) c.abort();
  server.close();
  demo.close();
  setTimeout(() => process.exit(), 3000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let config, run, currentId, replayGhost, playing, activeId;
let pollBusy = false;
async function api(url, options) {
  const r = await fetch(url, options);
  const data = await r.json();
  if (!r.ok) throw Error(data.error || "Request failed");
  return data;
}
function showError(e) {
  $("#error").textContent = e.message;
}
function personaCard(p) {
  return `<article class="ghost-card"><div class="ghost-head"><div class="avatar">${esc(p.name[0])}</div><div><strong>${esc(p.name)}</strong><small>${esc(p.label)}</small></div></div><p>${esc(p.brief.split(".").slice(0, 2).join("."))}.</p><div class="ghost-state"><span>${p.width === 390 ? "390 × 844 · Mobile" : "1280 × 800 · Desktop"}</span><span>Ready</span></div></article>`;
}
async function sessions() {
  const all = await api("/api/runs");
  activeId = all.find((r) => r.status === "running")?.id;
  $("#start").disabled = !!activeId;
  $("#sessions").innerHTML = all
    .slice(0, 7)
    .map(
      (r) =>
        `<button class="session" data-run="${r.id}">${esc(new URL(r.url).hostname)}<small>${esc(r.status)} · ${esc(r.mode === "codex" ? "Astra" : "runner check")}</small></button>`,
    )
    .join("");
  return all;
}
async function select(id) {
  currentId = id;
  run = await api("/api/runs/" + id);
  render();
}
function render() {
  if (!run) return;
  $("#workspace").hidden = false;
  $("#empty").hidden = true;
  $("#run-status").textContent = run.status;
  $("#run-title").textContent =
    run.status === "running"
      ? "Fresh eyes on your product"
      : "Your beta report";
  $("#run-label").textContent =
    run.mode === "codex" ? "ASTRA EXPLORATION" : "RUNNER CHECK · NO AI";
  $("#download").href = `/api/runs/${run.id}/report`;
  $("#cancel").hidden = run.status !== "running";
  $("#start").disabled = run.status === "running" || !!activeId;
  const steps = run.ghosts.reduce(
      (n, g) => n + g.steps.filter((s) => s.action).length,
      0,
    ),
    tokens =
      run.ghosts.reduce(
        (n, g) => n + g.usage.input_tokens + g.usage.output_tokens,
        0,
      ) +
      (run.triage?.usage?.input_tokens || 0) +
      (run.triage?.usage?.output_tokens || 0);
  $("#metrics").innerHTML = [
    [run.issues.length, "Grouped findings"],
    [steps, "Actions recorded"],
    [
      new Set(run.ghosts.flatMap((g) => g.steps.map((s) => s.journey))).size,
      "Journey labels",
    ],
    [
      tokens.toLocaleString(),
      run.mode === "codex" ? "Subscription tokens" : "Model tokens",
    ],
  ]
    .map(
      ([v, l]) =>
        `<div class="metric"><strong>${v}</strong><span>${l}</span></div>`,
    )
    .join("");
  $("#ghosts").innerHTML = run.ghosts
    .map((g) => {
      const s = g.steps.at(-1);
      return `<article class="ghost-card"><div class="ghost-head"><div class="avatar">${esc(g.name[0])}</div><div><strong>${esc(g.name)}</strong><small>${esc(g.label)}</small></div></div>${s ? `<img class="shot" src="${s.screenshot}" alt="Latest observation from ${esc(g.name)}"><p class="ghost-thought">${esc(s.thought)}</p>` : `<p>${g.status === "queued" ? "Waiting to explore." : g.status === "running" ? "Opening a fresh browser session…" : "No browser observations recorded."}</p>`}<div class="ghost-state"><span>${esc(g.status)}</span><span>${g.steps.filter((s) => s.action).length} / ${run.maxSteps} steps</span></div>${g.error ? `<p class="error">${esc(g.error)}</p>` : ""}<button class="secondary" data-replay="${g.id}" ${g.steps.length ? "" : "disabled"}>Replay journey ▷</button></article>`;
    })
    .join("");
  if (run.error) showError(Error(run.error));
  renderIssues();
}
function renderIssues() {
  if (!run) return;
  const fs = run.issues.filter(
    (f) => $("#filter").value === "all" || f.severity === $("#filter").value,
  );
  $("#issue-count").textContent = run.issues.length;
  const openIds = new Set(
    [...document.querySelectorAll(".issue[open]")].map((e) => e.dataset.issue),
  );
  $("#findings").innerHTML = fs.length
    ? fs
        .map(
          (f) =>
            `<details class="issue" data-issue="${f.id}" ${openIds.has(f.id) ? "open" : ""}><summary><span class="severity ${f.severity}">${f.severity}</span><span class="issue-title">${esc(f.title)}</span><span class="issue-meta">${esc(f.confidence)} · ${f.occurrences.length} occurrence${f.occurrences.length === 1 ? "" : "s"} &nbsp; +</span></summary><div class="issue-body"><b>Expected</b><p>${esc(f.expected)}</p><b>Observed</b><p>${esc(f.actual)}</p><b>Evidence source</b><p>${esc(f.source)} · ${esc(f.url)}</p>${f.occurrences.map((o) => `<b>${esc(run.ghosts.find((g) => g.id === o.ghost)?.name || o.ghost)} · ${esc(o.source)} evidence</b><p>${esc(o.actual)}</p><b>Reproduction</b><ol>${o.repro.map((r) => `<li>${esc(r)}</li>`).join("")}</ol><button class="secondary" data-replay="${o.ghost}" data-step="${o.step}">View evidence at step ${o.step} ↗</button>`).join("<hr>")}</div></details>`,
        )
        .join("")
    : `<div class="no-findings">${run.status === "running" ? "The Ghosts are exploring. Findings will appear here as evidence arrives." : "No findings match this view. This is not a guarantee that the product is bug-free."}</div>`;
}
function frame(n) {
  if (!replayGhost) return;
  const steps = replayGhost.steps;
  n = Math.max(0, Math.min(n, steps.length - 1));
  const s = steps[n];
  $("#scrubber").max = steps.length - 1;
  $("#scrubber").value = n;
  $("#frame").src = s.screenshot;
  $("#frame-number").textContent = `${n + 1} / ${steps.length}`;
  $("#frame-caption").innerHTML =
    `<strong>${esc(s.journey)}</strong> · ${esc(s.url)}<p>${esc(s.thought)}</p>${s.signals?.length ? `<p class="error">${s.signals.map((e) => esc(e.message)).join("<br>")}</p>` : ""}${n > 0 && steps[n - 1].action ? `<p>Captured after: ${esc(steps[n - 1].action.action)} ${esc(steps[n - 1].action.label || steps[n - 1].action.value)}</p>` : ""}${s.action ? `<p>Next action: ${esc(s.action.action)} ${esc(s.action.label || s.action.value)} · ${esc(s.outcome || "pending")}</p>` : ""}`;
}
function stopPlay() {
  clearInterval(playing);
  playing = null;
  $("#play").textContent = "Play";
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-run],[data-replay]");
  if (!t) return;
  if (t.dataset.run) select(t.dataset.run).catch(showError);
  else {
    replayGhost = run.ghosts.find((g) => g.id === t.dataset.replay);
    $("#replay-title").textContent = `${replayGhost.name} · Journey replay`;
    frame(Number(t.dataset.step || 0));
    $("#replay").showModal();
  }
});
$("#close-replay").onclick = () => {
  $("#replay").close();
  stopPlay();
};
$("#replay").addEventListener("close", stopPlay);
$("#scrubber").oninput = (e) => frame(Number(e.target.value));
$("#prev").onclick = () => frame(Number($("#scrubber").value) - 1);
$("#next").onclick = () => frame(Number($("#scrubber").value) + 1);
$("#play").onclick = () => {
  if (playing) return stopPlay();
  if (Number($("#scrubber").value) >= replayGhost.steps.length - 1) frame(0);
  $("#play").textContent = "Pause";
  playing = setInterval(() => {
    const n = Number($("#scrubber").value) + 1;
    if (n >= replayGhost.steps.length) return stopPlay();
    frame(n);
  }, 1300);
};
$("#filter").onchange = renderIssues;
$("#demo").onclick = () => {
  $("#url").value = config.demoUrl;
  $("#url").focus();
};
$("#cancel").onclick = async () => {
  try {
    await api(`/api/runs/${run.id}/cancel`, { method: "POST" });
    $("#cancel").textContent = "Stopping…";
  } catch (e) {
    showError(e);
  }
};
$("#launch").onsubmit = async (e) => {
  e.preventDefault();
  $("#error").textContent = "";
  $("#start").disabled = true;
  try {
    run = await api("/api/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: $("#url").value,
        mode: $("#mode").value,
        count: Number($("#count").value),
        maxSteps: Number($("#steps").value),
      }),
    });
    currentId = run.id;
    $("#cancel").textContent = "Stop session";
    render();
    await sessions();
  } catch (e) {
    showError(e);
    $("#start").disabled = false;
  }
};
try {
  config = await api("/api/config");
  $("#personas").innerHTML = config.personas.map(personaCard).join("");
  $("#connection").textContent = config.auth
    ? "Codex connected · uses your subscription"
    : "Codex login needed for Astra · runner check available";
  $("#url").value = config.demoUrl;
  const all = await sessions();
  if (all[0]) await select(all[0].id);
} catch (e) {
  showError(e);
}
setInterval(async () => {
  if (pollBusy) return;
  pollBusy = true;
  try {
    await sessions();
    if (currentId && (run?.status === "running" || activeId === currentId))
      await select(currentId);
  } catch (e) {
    showError(e);
  } finally {
    pollBusy = false;
  }
}, 2000);

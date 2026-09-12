import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("docs/site");
await fs.mkdir(root, { recursive: true });
for (const f of ["style.css", "logo.svg"])
  await fs.copyFile("public/" + f, root + "/" + f);
const ids = process.argv.slice(2);
if (!ids.length) throw Error("Supply at least one completed run ID");
const entries = [];
for (const id of ids) {
  if (!/^[a-f0-9-]{36}$/.test(id)) throw Error("Invalid run ID");
  const r = JSON.parse(await fs.readFile("runs/" + id + "/run.json", "utf8"));
  if (r.status !== "completed")
    throw Error("Only completed runs may be showcased");
  for (const g of r.ghosts) {
    delete g.threadId;
    for (const s of g.steps) {
      const src = "runs/" + s.screenshot.replace("/artifacts/", "");
      const dest = "evidence/" + id + "/" + g.id + "/" + path.basename(src);
      await fs.mkdir(path.dirname(root + "/" + dest), { recursive: true });
      try {
        await fs.access(root + "/" + dest);
      } catch {
        await fs.copyFile(src, root + "/" + dest);
      }
      s.screenshot = dest;
    }
  }
  const dto = {
    id: r.id,
    url: r.url,
    mode: r.mode,
    model: r.model,
    status: r.status,
    createdAt: r.createdAt,
    maxSteps: r.maxSteps,
    ghosts: r.ghosts,
    issues: r.issues,
    triage: r.triage,
  };
  const file = id + ".html";
  const data = JSON.stringify(dto).replaceAll("<", "\\u003c");
  await fs.writeFile(
    root + "/" + file,
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ghost — recorded beta report</title><link rel="stylesheet" href="style.css"><style>body{max-width:1240px;margin:auto;padding:32px}header{margin-bottom:36px}.layout{display:grid;grid-template-columns:1.3fr 1fr;gap:28px}#screen{width:100%;height:480px;object-fit:contain;background:#080f0d;border-radius:16px}#controls{display:flex;gap:12px;align-items:center;margin:15px 0}#seek{flex:1}.finding{border:1px solid var(--line);padding:18px;border-radius:12px;margin-bottom:12px}.finding p{font-size:14px}#caption{min-height:120px}select{max-width:100%}@media(max-width:850px){.layout{grid-template-columns:1fr}#screen{height:350px}}</style><header><a class="brand" href="index.html"><img src="logo.svg" width="36" alt="">ghost</a><span class="pill">Recorded Astra run · no login needed</span></header><span class="eyebrow">REAL BROWSER OBSERVATIONS</span><h1>Follow the evidence.</h1><p id="summary"></p><p class="muted">This interactive screenshot replay shows a completed run. Playback is time-compressed; it does not launch agents or re-execute actions.</p>${r.url.includes("markerpad.app") ? "<p class=muted>Review in progress: automated findings are retained as original observations. Ghost’s control extraction and timing may explain some symptoms. Read the recorded steps to see exactly what was exercised; a visible export menu does not establish successful download or persistence.</p>" : ""}<div class="layout"><section><select id="person"></select><img id="screen" alt="Recorded browser observation"><div id="controls"><button id="play" class="secondary">Play</button><input id="seek" type="range" min="0" value="0"><span id="position"></span></div><div id="caption"></div></section><section><h2>Grouped findings</h2><p class="muted">Automated findings need human review. Suspected friction is not a confirmed defect.</p><div id="findings"></div></section></div><script>const run=${data};const $=s=>document.querySelector(s);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));let ghost=run.ghosts[0],timer;$('#summary').textContent=run.url+' · '+run.ghosts.length+' independent testers · '+run.issues.length+' grouped findings · '+new Date(run.createdAt).toLocaleDateString();$('#person').innerHTML=run.ghosts.map(g=>'<option value="'+g.id+'">'+esc(g.name+' — '+g.label)+'</option>').join('');function frame(n){n=Math.max(0,Math.min(n,ghost.steps.length-1));const s=ghost.steps[n];$('#seek').max=ghost.steps.length-1;$('#seek').value=n;$('#screen').src=s.screenshot;$('#position').textContent=(n+1)+' / '+ghost.steps.length;$('#caption').innerHTML='<strong>'+esc(s.journey)+'</strong><p>'+esc(s.thought)+'</p><small>'+esc(s.action?'Next: '+s.action.action+' '+s.action.label+' · '+s.outcome:'Final observation')+'</small>'}function stop(){clearInterval(timer);timer=null;$('#play').textContent='Play'}$('#play').onclick=()=>{if(timer)return stop();if(+$('#seek').value>=ghost.steps.length-1)frame(0);$('#play').textContent='Pause';timer=setInterval(()=>{let n=+$('#seek').value+1;if(n>=ghost.steps.length)return stop();frame(n)},1600)};$('#person').onchange=e=>{stop();ghost=run.ghosts.find(g=>g.id===e.target.value);frame(0)};$('#seek').oninput=e=>{stop();frame(+e.target.value)};$('#findings').innerHTML=run.issues.map(f=>'<details class="finding"><summary><span class="severity '+f.severity+'">'+esc(f.severity)+'</span> '+esc(f.title)+'</summary><p>'+esc(f.confidence+' · '+f.source)+'</p><p>'+esc(f.actual)+'</p>'+f.occurrences.map(o=>'<button class="secondary" data-ghost="'+o.ghost+'" data-step="'+o.step+'">'+esc(run.ghosts.find(g=>g.id===o.ghost)?.name)+' · step '+o.step+'</button><ol>'+o.repro.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ol>').join('')+'</details>').join('');document.addEventListener('click',e=>{const b=e.target.closest('[data-ghost]');if(!b)return;stop();ghost=run.ghosts.find(g=>g.id===b.dataset.ghost);$('#person').value=ghost.id;frame(+b.dataset.step)});frame(0)</script></html>`,
  );
  entries.push({
    file,
    label: r.url.includes(":4319")
      ? "Waypoint: planted-bug benchmark"
      : new URL(r.url).hostname + ": real-app exploration",
    id,
  });
}
await fs.copyFile("public/showcase.html", root + "/index.html");
await fs.writeFile(root + "/.nojekyll", "");
console.log("Static showcase built:", entries.map((e) => e.file).join(", "));

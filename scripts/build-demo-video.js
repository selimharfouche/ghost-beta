import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const base = process.cwd();
const scratch = path.resolve("work/video-build");
fs.mkdirSync(scratch, { recursive: true });
const out = path.join(base, "docs/assets/ghost-demo.mp4");
const r = JSON.parse(
  fs.readFileSync("runs/4046b6e1-8479-4c2a-a579-47a4a616ed25/run.json", "utf8"),
);
const picks = [
  {
    image: "docs/assets/live-exploration.png",
    caption: "Ghost: independent AI beta testers explore a staging URL.",
    seconds: 7,
  },
  {
    image: "docs/assets/completed-report.png",
    caption:
      "A real GPT-6 Astra run. Three personas, 34 actions, 37 observations.",
    seconds: 7,
  },
  ...r.ghosts[0].steps
    .filter((s) => [0, 1, 2, 3, 4, 5].includes(s.index))
    .map((s) => ({
      image: "runs/" + s.screenshot.replace("/artifacts/", ""),
      caption: "Mira / step " + s.index + " / " + s.journey,
      seconds: 4,
    })),
  {
    image: "docs/assets/mobile-evidence.png",
    caption: "Review the mobile finding and its reproduction steps.",
    seconds: 8,
  },
  {
    image: "docs/assets/completed-report.png",
    caption: "5 of 5 planted defects surfaced through browser signals + Astra.",
    seconds: 7,
  },
  {
    image: "docs/assets/live-exploration.png",
    caption: "Runs locally with your Codex login. No separate API key.",
    seconds: 7,
  },
];
const realId = process.argv[2];
if (realId) {
  const real = JSON.parse(
    fs.readFileSync("runs/" + realId + "/run.json", "utf8"),
  );
  for (const s of real.ghosts[0].steps
    .filter((s) => [4, 8, 10, 11].includes(s.index))
    .slice(0, 4))
    picks.splice(picks.length - 2, 0, {
      image: "runs/" + s.screenshot.replace("/artifacts/", ""),
      caption:
        new URL(real.url).hostname + " / real-app exploration / " + s.journey,
      seconds: 4,
    });
}
for (let i = 0; i < picks.length; i++) {
  const p = picks[i],
    caption = path.join(scratch, "caption-" + i + ".txt");
  fs.writeFileSync(caption, p.caption);
  const file = path.join(scratch, "clip-" + i + ".mp4");
  const filter = `scale=1280:620:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:0:color=0x0b1411,drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:textfile='${caption}':fontcolor=white:fontsize=24:x=40:y=640,drawtext=fontfile=/System/Library/Fonts/Supplemental/Arial.ttf:text='Recorded screenshot replay - time compressed':fontcolor=0xb3c2b9:fontsize=16:x=40:y=683`;
  const q = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-loop",
      "1",
      "-i",
      path.resolve(p.image),
      "-vf",
      filter,
      "-t",
      String(p.seconds),
      "-r",
      "24",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-pix_fmt",
      "yuv420p",
      file,
    ],
    { stdio: "inherit" },
  );
  if (q.status) process.exit(q.status);
}
const list = path.join(scratch, "clips.txt");
fs.writeFileSync(
  list,
  picks
    .map((_, i) => `file '${path.join(scratch, "clip-" + i + ".mp4")}'`)
    .join("\n"),
);
const q = spawnSync(
  "ffmpeg",
  [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    list,
    "-c",
    "copy",
    "-movflags",
    "+faststart",
    out,
  ],
  { stdio: "inherit" },
);
if (q.status) process.exit(q.status);
console.log(out);

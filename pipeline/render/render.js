#!/usr/bin/env node
// Usage: node pipeline/render/render.js <episode-dir> [--stills 1.5,7,20] [--draft]
// Full render -> <ep>/build/video_noaudio.mp4, <ep>/build/cues.json, <ep>/final/<slug>.srt
const fs = require('fs'), path = require('path'), { spawn } = require('child_process');
const { W, H, FPS, createCanvas } = require('./engine');

const epDir = path.resolve(process.argv[2]);
const args = process.argv.slice(3);
const ep = JSON.parse(fs.readFileSync(path.join(epDir, 'episode.json'), 'utf8'));
const tl = JSON.parse(fs.readFileSync(path.join(epDir, 'build/timeline.json'), 'utf8'));
const scene = require(`./episodes/${ep.id}.js`).build(tl);
const build = path.join(epDir, 'build'), final = path.join(epDir, 'final');
fs.mkdirSync(final, { recursive: true });

const canvas = createCanvas(W, H), ctx = canvas.getContext('2d');

function srtTime(s) {
  const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
}
function writeSrt() {
  const c = scene.chunks, out = [];
  c.forEach((k, i) => {
    const next = c[i + 1];
    const end = next ? Math.min(next.start - 0.04, k.end + 0.45) : k.end + 0.45;
    out.push(`${i + 1}\n${srtTime(Math.max(0, k.start - 0.04))} --> ${srtTime(end)}\n${k.text.replace(/\*/g, '')}\n`);
  });
  const f = path.join(final, `${ep.id}-${ep.slug}.srt`);
  fs.writeFileSync(f, out.join('\n')); return f;
}

async function main() {
  const si = args.indexOf('--stills');
  if (si >= 0) {
    const dir = path.join(build, 'stills'); fs.mkdirSync(dir, { recursive: true });
    for (const t of args[si + 1].split(',').map(Number)) {
      scene.draw(ctx, t);
      fs.writeFileSync(path.join(dir, `t${t.toFixed(2)}.png`), canvas.toBuffer('image/png'));
    }
    console.log('stills ->', dir); return;
  }
  const duration = Math.ceil((scene.duration + 0.1) * FPS) / FPS;
  const frames = Math.round(duration * FPS);
  const out = path.join(build, 'video_noaudio.mp4');
  const draft = args.includes('--draft');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', draft ? 'veryfast' : 'slow', '-crf', draft ? '26' : '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    scene.draw(ctx, f / FPS);
    const buf = Buffer.from(ctx.getImageData(0, 0, W, H).data.buffer);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % 150 === 0) process.stdout.write(`frame ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s\n`);
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on('close', (c) => (c === 0 ? r() : j(new Error('ffmpeg ' + c)))));
  fs.writeFileSync(path.join(build, 'cues.json'), JSON.stringify({ duration, cues: scene.cues }, null, 1));
  console.log('video ->', out, `${frames} frames, ${duration.toFixed(3)}s`);
  console.log('srt   ->', writeSrt());
}
main().catch((e) => { console.error(e); process.exit(1); });

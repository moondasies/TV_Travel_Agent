// Core drawing + timing helpers shared by every episode.
const path = require('path');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');

const ROOT = path.resolve(__dirname, '../..');
const T = require(path.join(ROOT, 'brand/tokens.json'));
const C = T.color;
const W = T.canvas.width, H = T.canvas.height, FPS = T.canvas.fps;

const FONT_DIR = path.join(ROOT, 'brand/fonts');
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'Baloo2_800ExtraBold.ttf'), 'Baloo XB');
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'Baloo2_700Bold.ttf'), 'Baloo B');
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'Baloo2_600SemiBold.ttf'), 'Baloo SB');
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'JetBrainsMono_700Bold.ttf'), 'JB B');
GlobalFonts.registerFromPath(path.join(FONT_DIR, 'JetBrainsMono_500Medium.ttf'), 'JB M');
const F = {
  xb: (s) => `${s}px "Baloo XB"`, b: (s) => `${s}px "Baloo B"`, sb: (s) => `${s}px "Baloo SB"`,
  code: (s) => `${s}px "JB M"`, codeB: (s) => `${s}px "JB B"`,
};

// ---------- timing ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, start, dur) => clamp((t - start) / dur);
const E = {
  outCubic: (x) => 1 - Math.pow(1 - x, 3),
  inCubic: (x) => x * x * x,
  inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outBack: (x) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
  outElastic: (x) => (x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
};
// visibility envelope: fades in at a, out at b
function env(t, a, b, fin = 0.3, fout = 0.25) {
  if (t < a || t > b) return 0;
  return Math.min(E.outCubic(prog(t, a, fin)), 1 - E.inCubic(prog(t, b - fout, fout)));
}
// deterministic pseudo-random
function rand(seed) { const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); }

// ---------- primitives ----------
function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function withAlpha(ctx, a, fn) { if (a <= 0.001) return; ctx.save(); ctx.globalAlpha *= a; fn(); ctx.restore(); }
// transform around a pivot: scale + rotate + translate
function xf(ctx, x, y, s = 1, rot = 0, fn) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); fn(); ctx.restore(); }

function shadowed(ctx, color, blur, fn, oy = 0) {
  ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.shadowOffsetY = oy; fn(); ctx.restore();
}
function text(ctx, str, x, y, font, color, align = 'center', base = 'middle') {
  ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base; ctx.fillText(str, x, y);
}
function strokeText(ctx, str, x, y, font, fill, stroke, lw, align = 'center') {
  ctx.font = font; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.strokeText(str, x, y); ctx.fillStyle = fill; ctx.fillText(str, x, y);
}
function arrow(ctx, x1, y1, x2, y2, color, lw = 10, head = 26, p = 1) {
  const x = lerp(x1, x2, p), y = lerp(y1, y2, p), a = Math.atan2(y2 - y1, x2 - x1);
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x - Math.cos(a) * head * 0.6, y - Math.sin(a) * head * 0.6); ctx.stroke();
  if (p > 0.15) {
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.lineTo(x - Math.cos(a - 0.5) * head, y - Math.sin(a - 0.5) * head);
    ctx.lineTo(x - Math.cos(a + 0.5) * head, y - Math.sin(a + 0.5) * head); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// ---------- background ----------
let grain = null;
function makeGrain() {
  const g = createCanvas(256, 256), c = g.getContext('2d'), img = c.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = rand(i) * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 10;
  }
  c.putImageData(img, 0, 0); return g;
}
function background(ctx, t, glow = C.violet, glowY = 700) {
  ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W / 2, glowY, 40, W / 2, glowY, 1000);
  g.addColorStop(0, glow + '40'); g.addColorStop(0.55, glow + '12'); g.addColorStop(1, '#00000000');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // drifting dot grid
  const step = 54, off = (t * 12) % step;
  ctx.fillStyle = '#ffffff14';
  for (let y = -step + off; y < H + step; y += step)
    for (let x = 27; x < W; x += step) { ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill(); }
  if (!grain) grain = makeGrain();
  ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = ctx.createPattern(grain, 'repeat'); ctx.fillRect(0, 0, W, H); ctx.restore();
}

// Brand scene transition: diagonal violet->lime swipe. p in [0,1]; screen fully covered at p=0.5.
function swipe(ctx, p) {
  if (p <= 0 || p >= 1) return;
  const x = lerp(-W * 1.9, W * 1.9, E.inOutCubic(p)), slant = 520;
  const band = (dx, w, col) => {
    ctx.beginPath(); ctx.moveTo(x + dx, 0); ctx.lineTo(x + dx + w, 0);
    ctx.lineTo(x + dx + w - slant, H); ctx.lineTo(x + dx - slant, H); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  };
  band(-W * 0.9 - 160, W * 1.8 + 160, C.violetDeep);
  band(W * 0.9, 120, C.lime);
  band(-W * 0.9 - 300, 120, C.violet);
}

module.exports = { W, H, FPS, C, F, T, ROOT, clamp, lerp, prog, E, env, rand, rr, withAlpha, xf, shadowed, text, strokeText, arrow, background, swipe, createCanvas };

// Reusable motion-graphics components (series-wide).
const { W, H, C, F, T, rr, text, strokeText, shadowed, E, prog, clamp, lerp } = require('./engine');

// ---------- captions ----------
// chunk.text may contain *term* markup -> highlighted in lime.
function parseTerms(str) {
  const parts = []; const re = /\*([^*]+)\*/g; let last = 0, m;
  while ((m = re.exec(str))) { if (m.index > last) parts.push([str.slice(last, m.index), false]); parts.push([m[1], true]); last = re.lastIndex; }
  if (last < str.length) parts.push([str.slice(last), false]);
  return parts;
}
function layoutWords(ctx, str, font, maxW) {
  const words = [];
  for (const [seg, term] of parseTerms(str)) for (const w of seg.split(/\s+/).filter(Boolean)) words.push({ w, term });
  ctx.font = font; const space = ctx.measureText(' ').width;
  const lines = [[]]; let lw = 0;
  for (const wd of words) {
    wd.width = ctx.measureText(wd.w).width;
    if (lw > 0 && lw + space + wd.width > maxW) { lines.push([]); lw = 0; }
    lines[lines.length - 1].push(wd); lw += (lw > 0 ? space : 0) + wd.width;
  }
  return { lines, space };
}
function caption(ctx, chunk, t) {
  if (!chunk) return;
  const cfg = T.caption, font = F.xb(cfg.size);
  const p = prog(t, chunk.start, 0.16), s = lerp(0.82, 1, E.outBack(p));
  const { lines, space } = layoutWords(ctx, chunk.text.toUpperCase().replace(/\*([^*]+)\*/g, '*$1*'), font, cfg.maxWidth);
  const lh = cfg.size * 1.08, y0 = cfg.centerY - ((lines.length - 1) * lh) / 2;
  ctx.save(); ctx.translate(W / 2, cfg.centerY); ctx.scale(s, s); ctx.translate(-W / 2, -cfg.centerY);
  ctx.globalAlpha = clamp(p * 3);
  lines.forEach((ln, i) => {
    const total = ln.reduce((a, w) => a + w.width, 0) + space * (ln.length - 1);
    let x = W / 2 - total / 2; const y = y0 + i * lh;
    for (const wd of ln) {
      ctx.font = font; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
      ctx.strokeStyle = C.ink; ctx.lineWidth = cfg.strokeWidth; ctx.strokeText(wd.w, x, y);
      ctx.fillStyle = wd.term ? C.lime : C.cream; ctx.fillText(wd.w, x, y);
      x += wd.width + space;
    }
  });
  ctx.restore();
}

// ---------- header: episode pill + series progress ----------
function header(ctx, ep, total, label) {
  ctx.save();
  ctx.font = F.sb(26); const lw = ctx.measureText(label).width;
  ctx.fillStyle = '#ffffff10'; rr(ctx, 60, 108, 176 + lw, 64, 32); ctx.fill();
  ctx.fillStyle = C.lime; ctx.beginPath(); ctx.arc(96, 140, 11, 0, Math.PI * 2); ctx.fill();
  text(ctx, `EP ${String(ep).padStart(2, '0')}`, 120, 142, F.xb(34), C.cream, 'left');
  text(ctx, label, 210, 143, F.sb(26), C.muted, 'left');
  // series map: first 12 dots, current filled
  for (let i = 0; i < 12; i++) {
    ctx.fillStyle = i < ep ? C.lime : '#ffffff22';
    ctx.beginPath(); ctx.arc(640 + i * 30, 140, i < ep ? 9 : 6, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// ---------- phone ----------
function phone(ctx, x, y, w, h, drawScreen) {
  shadowed(ctx, '#00000090', 60, () => { ctx.fillStyle = '#26214A'; rr(ctx, x - w / 2, y - h / 2, w, h, 70); ctx.fill(); }, 20);
  ctx.strokeStyle = '#3B3570'; ctx.lineWidth = 6; rr(ctx, x - w / 2, y - h / 2, w, h, 70); ctx.stroke();
  ctx.fillStyle = '#0F0C22'; rr(ctx, x - w / 2 + 18, y - h / 2 + 18, w - 36, h - 36, 54); ctx.fill();
  ctx.save(); rr(ctx, x - w / 2 + 18, y - h / 2 + 18, w - 36, h - 36, 54); ctx.clip();
  drawScreen(x - w / 2 + 18, y - h / 2 + 18, w - 36, h - 36);
  ctx.restore();
  ctx.fillStyle = '#26214A'; rr(ctx, x - 70, y - h / 2 + 30, 140, 34, 17); ctx.fill(); // notch
}

// chat bubble with sender line
function bubble(ctx, x, y, w, sender, lines, { color = '#2A2552', senderColor = C.muted, font = F.b(40), lh = 50 } = {}) {
  const h = 70 + lines.length * lh;
  ctx.fillStyle = color; rr(ctx, x, y, w, h, 34); ctx.fill();
  text(ctx, sender, x + 32, y + 40, F.sb(28), senderColor, 'left');
  lines.forEach((l, i) => {
    if (typeof l === 'function') l(x + 32, y + 90 + i * lh);
    else text(ctx, l, x + 32, y + 92 + i * lh, font, C.cream, 'left');
  });
  return h;
}

// rubber stamp
function stamp(ctx, x, y, label, color, p, rot = -0.22) {
  if (p <= 0) return;
  const s = lerp(2.4, 1, E.outCubic(clamp(p * 1.4))), a = clamp(p * 4);
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = a;
  ctx.font = F.xb(130); const tw = ctx.measureText(label).width;
  ctx.strokeStyle = color; ctx.lineWidth = 12; rr(ctx, -tw / 2 - 40, -88, tw + 80, 176, 26); ctx.stroke();
  ctx.lineWidth = 4; rr(ctx, -tw / 2 - 26, -74, tw + 52, 148, 18); ctx.stroke();
  text(ctx, label, 0, 12, F.xb(130), color);
  ctx.restore();
}

// small message card (used in data streams)
function msgCard(ctx, x, y, w, msg, label, { s = 1, a = 1, rot = 0 } = {}) {
  const isSpam = label === 'SPAM', col = isSpam ? C.coral : C.lime;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= a;
  shadowed(ctx, '#00000080', 24, () => { ctx.fillStyle = C.panel; rr(ctx, -w / 2, -58, w, 116, 26); ctx.fill(); }, 8);
  ctx.fillStyle = col; rr(ctx, -w / 2, -58, 14, 116, 7); ctx.fill();
  text(ctx, msg, -w / 2 + 40, -4, F.b(34), C.cream, 'left');
  if (label) {
    ctx.font = F.xb(26); const lw = ctx.measureText(label).width + 30;
    ctx.fillStyle = col; rr(ctx, w / 2 - lw - 18, -78, lw, 44, 22); ctx.fill();
    text(ctx, label, w / 2 - 18 - lw / 2, -54, F.xb(26), C.ink);
  }
  ctx.restore();
}

// pill chip with optional icon fn
function chip(ctx, x, y, label, col, { s = 1, a = 1, font = F.xb(40), icon } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a;
  ctx.font = font; const tw = ctx.measureText(label).width, pad = icon ? 84 : 40, w = tw + pad + 36;
  ctx.fillStyle = col + '26'; rr(ctx, -w / 2, -40, w, 80, 40); ctx.fill();
  ctx.strokeStyle = col; ctx.lineWidth = 4; rr(ctx, -w / 2, -40, w, 80, 40); ctx.stroke();
  if (icon) icon(-w / 2 + 52, 0);
  text(ctx, label, -w / 2 + pad + tw / 2 - (icon ? 0 : 2), 4, font, col);
  ctx.restore();
  return w;
}

// labelled box for equations
function eqBox(ctx, x, y, w, h, label, col, { s = 1, a = 1, filled = false, font = F.xb(44) } = {}) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= a;
  shadowed(ctx, col + '66', filled ? 40 : 0, () => {
    ctx.fillStyle = filled ? col : col + '1F'; rr(ctx, -w / 2, -h / 2, w, h, 28); ctx.fill();
  });
  ctx.strokeStyle = col; ctx.lineWidth = 5; rr(ctx, -w / 2, -h / 2, w, h, 28); ctx.stroke();
  text(ctx, label, 0, 5, font, filled ? C.ink : col);
  ctx.restore();
}

// icons
function linkIcon(ctx, x, y, col, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.7); ctx.strokeStyle = col; ctx.lineWidth = 7;
  rr(ctx, -30, -11, 34, 22, 11); ctx.stroke(); rr(ctx, -4, -11, 34, 22, 11); ctx.stroke(); ctx.restore();
}
function alertIcon(ctx, x, y, col, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(24, 20); ctx.lineTo(-24, 20); ctx.closePath(); ctx.fill();
  text(ctx, '!', 0, 6, F.xb(32), C.ink); ctx.restore();
}
function rupeeIcon(ctx, x, y, col, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col;
  ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill(); text(ctx, '₹', 0, 3, F.xb(34), C.ink); ctx.restore();
}
function check(ctx, x, y, col, s = 1, p = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(-6, 16); if (p > 0.4) ctx.lineTo(lerp(-6, 24, (p - 0.4) / 0.6), lerp(16, -18, (p - 0.4) / 0.6)); ctx.stroke(); ctx.restore();
}
function cross(ctx, x, y, col, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-18, -18); ctx.lineTo(18, 18); ctx.moveTo(18, -18); ctx.lineTo(-18, 18); ctx.stroke(); ctx.restore();
}
function speech(ctx, x, y, w, h, label, col = C.cream, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = col; rr(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-20, h / 2 - 4); ctx.lineTo(-44, h / 2 + 30); ctx.lineTo(10, h / 2 - 4); ctx.fill();
  text(ctx, label, 0, 6, F.xb(Math.round(h * 0.62)), C.ink); ctx.restore();
}

module.exports = { caption, header, phone, bubble, stamp, msgCard, chip, eqBox, linkIcon, alertIcon, rupeeIcon, check, cross, speech, parseTerms };

// BITU — the series mascot. A small learning robot that stands for "the machine / the model".
// Brand rule: Bitu is a metaphor for software, never presented as a thinking human.
// Drawn fully in code so it stays pixel-identical across episodes.
const { C, rr, E, clamp } = require('./engine');

/**
 * opts: x, y (centre of head), s (scale), t (time, for idle motion),
 * mood: 'idle' | 'curious' | 'happy' | 'scan' | 'shock',
 * look: -1..1 horizontal gaze, glow: antenna colour, screen: optional fn(ctx) drawn on face screen
 * blinkSeed: offsets the blink cycle
 */
function drawBitu(ctx, o) {
  const { x, y, s = 1, t = 0, mood = 'idle', look = 0, glow = C.lime, blinkSeed = 0, arms = 'down' } = o;
  const bob = Math.sin(t * Math.PI * 2 / 2.2) * 8;
  ctx.save();
  ctx.translate(x, y + bob); ctx.scale(s, s);

  // hover shadow
  ctx.save(); ctx.globalAlpha = 0.35 - bob * 0.01; ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.ellipse(0, 250 - bob, 120, 18, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();

  // antenna
  ctx.strokeStyle = C.violet; ctx.lineWidth = 10; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -128); ctx.quadraticCurveTo(10, -165, 0, -190); ctx.stroke();
  const pulse = 0.6 + 0.4 * Math.sin(t * 6);
  ctx.save(); ctx.shadowColor = glow; ctx.shadowBlur = 30 * pulse; ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(0, -198, 18, 0, Math.PI * 2); ctx.fill(); ctx.restore();

  // body (small capsule under head)
  const bodyG = ctx.createLinearGradient(0, 110, 0, 230);
  bodyG.addColorStop(0, C.violetDeep); bodyG.addColorStop(1, '#3A2696');
  ctx.fillStyle = bodyG; rr(ctx, -82, 112, 164, 112, 50); ctx.fill();
  ctx.fillStyle = C.lime; ctx.beginPath(); ctx.arc(0, 168, 13, 0, Math.PI * 2); ctx.fill(); // chest light

  // arms
  const armUp = arms === 'up' ? 1 : arms === 'wave' ? 0.5 + 0.5 * Math.sin(t * 9) : 0;
  for (const side of [-1, 1]) {
    ctx.save(); ctx.translate(side * 92, 140); ctx.rotate(side * (0.35 + armUp * 1.9) * (side === -1 ? 1 : 1) * (arms === 'wave' && side === -1 ? 0.2 : 1));
    ctx.fillStyle = C.violet; rr(ctx, -16, -10, 32, 78, 16); ctx.fill();
    ctx.fillStyle = C.cream; ctx.beginPath(); ctx.arc(0, 74, 18, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // head
  const headG = ctx.createLinearGradient(0, -130, 0, 120);
  headG.addColorStop(0, '#9C84FF'); headG.addColorStop(1, C.violetDeep);
  ctx.fillStyle = headG; rr(ctx, -150, -130, 300, 250, 92); ctx.fill();
  ctx.fillStyle = '#ffffff22'; rr(ctx, -120, -116, 140, 40, 20); ctx.fill(); // shine
  // ears
  ctx.fillStyle = C.violetDeep;
  rr(ctx, -172, -30, 30, 80, 14); ctx.fill(); rr(ctx, 142, -30, 30, 80, 14); ctx.fill();

  // face screen
  ctx.fillStyle = '#120F2A'; rr(ctx, -116, -84, 232, 170, 64); ctx.fill();
  ctx.save(); rr(ctx, -116, -84, 232, 170, 64); ctx.clip();
  if (o.screen) o.screen(ctx); else face(ctx, t, mood, look, blinkSeed);
  ctx.restore();

  ctx.restore();
}

function face(ctx, t, mood, look, seed) {
  const cyc = (t + seed) % 3.1, blink = cyc < 0.12 ? 1 - Math.abs(cyc - 0.06) / 0.06 : 0;
  const ex = look * 16, ey = -12;
  ctx.fillStyle = C.lime; ctx.strokeStyle = C.lime; ctx.lineCap = 'round';
  ctx.save(); ctx.shadowColor = C.lime; ctx.shadowBlur = 16;
  if (mood === 'happy') {
    ctx.lineWidth = 12;
    for (const sx of [-48, 48]) { ctx.beginPath(); ctx.arc(sx + ex, ey + 10, 24, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  } else if (mood === 'scan') {
    const sy = Math.sin(t * 7) * 40;
    ctx.globalAlpha = 0.9; ctx.fillRect(-100, sy - 4, 200, 8);
    ctx.globalAlpha = 0.25; ctx.fillRect(-100, sy - 22, 200, 44);
  } else {
    const h = mood === 'shock' ? 50 : mood === 'curious' ? 40 : 38;
    const wid = mood === 'shock' ? 34 : 30;
    for (const [i, sx] of [[0, -48], [1, 48]]) {
      const hh = h * (1 - blink * 0.92) * (mood === 'curious' && i === 0 ? 0.75 : 1);
      ctx.beginPath(); ctx.ellipse(sx + ex, ey, wid / 2, Math.max(2, hh / 2), 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  // mouth
  ctx.lineWidth = 9;
  ctx.beginPath();
  if (mood === 'shock') { ctx.ellipse(ex * 0.5, 44, 14, 18, 0, 0, Math.PI * 2); ctx.stroke(); }
  else if (mood === 'curious') { ctx.ellipse(ex * 0.5, 44, 9, 11, 0, 0, Math.PI * 2); ctx.fill(); }
  else { ctx.arc(ex * 0.5, 30, 24, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); }
  ctx.restore();
}

module.exports = { drawBitu };

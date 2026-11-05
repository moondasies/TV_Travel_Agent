// EP01 — "Machine Learning kya hai? Rules vs Examples"
// Every animation is keyed to the narration timeline produced by tts/synth.py,
// so re-recording the voice automatically re-times the visuals.
const { W, H, C, F, clamp, lerp, prog, E, env, rand, rr, withAlpha, xf, shadowed, text, strokeText, arrow, background, swipe } = require('../engine');
const K = require('../components');
const { drawBitu } = require('../bitu');

function build(tl) {
  const L = Object.fromEntries(tl.lines.map((l) => [l.id, l]));
  const ch = (id, i) => L[id].chunks[i];
  const END = tl.duration;
  const sw = [L.L3.start - 0.25, L.L5.start - 0.22, L.L8.start - 0.22, L.L11.start - 0.18];
  const cues = [];
  const cue = (t, type, extra = {}) => cues.push({ t: +t.toFixed(3), type, ...extra });
  sw.forEach((s) => cue(s - 0.18, 'whoosh'));

  // ---------- G1: hook + stamp ----------
  const tBubble = ch('L1', 0).start + 0.25, tStamp = ch('L2', 1).start - 0.06, tAsk = ch('L2', 2).start;
  cue(0.05, 'rise'); cue(tBubble, 'notify'); cue(tStamp, 'stamp'); cue(tAsk + 0.1, 'pop');
  function g1(ctx, t) {
    const shake = (1 - prog(t, tStamp, 0.35)) * (t > tStamp ? 1 : 0) * 12;
    ctx.save(); ctx.translate(Math.sin(t * 90) * shake, Math.cos(t * 70) * shake);
    const pAsk = E.inOutCubic(prog(t, tAsk, 0.5));
    const px = lerp(540, 390, pAsk), ps = lerp(1, 0.84, pAsk);
    const py = lerp(1700, 760, E.outBack(prog(t, 0, 0.6)));
    xf(ctx, px, py, ps, 0, () => {
      K.phone(ctx, 0, 0, 640, 1080, (x, y, w) => {
        text(ctx, 'Messages', x + 50, y + 110, F.xb(54), C.cream, 'left');
        text(ctx, 'Aaj', x + w / 2, y + 190, F.sb(28), C.muted);
        const pb = prog(t, tBubble, 0.4);
        if (pb > 0) xf(ctx, x + 30, y + 240, E.outBack(pb), 0, () => {
          const spam = t > tStamp + 0.05;
          K.bubble(ctx, 0, 0, w - 60, '+91 9XXXX XXX21 · Unknown', [
            'Congratulations!!', 'Aapne ₹10,00,000', 'jeete! Claim karo:',
            (bx, by) => { text(ctx, 'jeeto-abhi.xyz/claim', bx, by, F.b(38), C.cyan, 'left'); ctx.fillStyle = C.cyan; ctx.fillRect(bx, by + 24, 370, 4); },
          ], { color: spam ? '#4A1E36' : '#2A2552', lh: 56 });
        });
        if (t > tStamp + 0.5) withAlpha(ctx, prog(t, tStamp + 0.5, 0.3), () => {
          ctx.fillStyle = C.coral + '33'; rr(ctx, x + 30, y + 640, w - 60, 90, 45); ctx.fill();
          text(ctx, 'Spam folder mein bhej diya', x + w / 2, y + 688, F.b(34), C.coral);
        });
        K.stamp(ctx, x + w / 2, y + 420, 'SPAM', C.coral, prog(t, tStamp, 0.3));
      });
    });
    ctx.restore();
    // Bitu asks the question
    const pb = prog(t, tAsk + 0.05, 0.5);
    if (pb > 0) {
      drawBitu(ctx, { x: 820, y: lerp(1500, 1040, E.outBack(pb)), s: 0.62, t, mood: 'curious', look: -1, glow: C.sun });
      const pq = E.outBack(prog(t, tAsk + 0.35, 0.35));
      if (pq > 0) K.speech(ctx, 880, 740, 130, 120, '?', C.sun, pq);
    }
  }

  // ---------- G2: hand-written rule, then it breaks ----------
  const code1 = 'if "lottery" in message:', code2 = '    return "SPAM"';
  const tType1 = ch('L3', 1).start, tType1e = ch('L3', 2).end, tType2 = ch('L3', 3).start, tType2e = ch('L3', 3).end;
  const tMsg1 = ch('L3', 2).start, tVerd1 = ch('L3', 3).start + 0.1;
  const tMsg2 = ch('L4', 0).start, tZero = ch('L4', 0).start + (ch('L4', 0).end - ch('L4', 0).start) * 0.55;
  const tVerd2 = ch('L4', 1).start + 0.15, tFail = ch('L4', 2).start;
  cue(tType1, 'type', { until: tType1e }); cue(tType2, 'type', { until: tType2e });
  cue(tMsg1, 'pop'); cue(tVerd1, 'ding'); cue(tMsg2, 'pop'); cue(tZero, 'blip'); cue(tVerd2, 'ding'); cue(tFail, 'fail');
  const variants = ['l0ttery', '1ottery', 'lotery', 'L-O-T-T-E-R-Y', 'lott3ry', 'l.o.t.t.e.r.y'];
  variants.forEach((_, i) => cue(tFail + 0.22 + i * 0.07, 'tick'));
  function g2(ctx, t) {
    const fail = prog(t, tFail, 0.3), shake = t > tFail ? (1 - prog(t, tFail, 0.45)) * 14 : 0;
    // label
    text(ctx, 'PURANA TAREEKA', 540, 262, F.xb(40), C.muted);
    text(ctx, 'hand-written rules', 540, 312, F.sb(32), C.muted + 'AA');
    // code card
    ctx.save(); ctx.translate(Math.sin(t * 95) * shake, 0);
    const cy = 370, ch_ = 300;
    shadowed(ctx, '#000000A0', 50, () => { ctx.fillStyle = C.panel; rr(ctx, 70, cy, 940, ch_, 36); ctx.fill(); }, 16);
    if (fail > 0) { ctx.fillStyle = C.coral + Math.round(fail * 50).toString(16).padStart(2, '0'); rr(ctx, 70, cy, 940, ch_, 36); ctx.fill(); }
    ctx.strokeStyle = fail > 0 ? C.coral : C.panelLine; ctx.lineWidth = 4; rr(ctx, 70, cy, 940, ch_, 36); ctx.stroke();
    ['#FF5C7A', '#FFC83D', '#C6FF3D'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(120 + i * 38, cy + 44, 11, 0, Math.PI * 2); ctx.fill(); });
    text(ctx, 'spam_filter.py', 990 - 24, cy + 46, F.code(28), C.muted, 'right');
    const n1 = Math.floor(code1.length * prog(t, tType1, tType1e - tType1)), n2 = Math.floor(code2.length * prog(t, tType2, tType2e - tType2 - 0.1));
    const drawCode = (str, n, x, y) => {
      ctx.font = F.codeB(46); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      let cx = x; const s = str.slice(0, n);
      // highlight the keyword "lottery"
      const k0 = str.indexOf('"lottery"'), k1 = k0 + 9;
      for (let i = 0; i < s.length; i++) {
        const isKey = k0 >= 0 && i >= k0 && i < k1;
        ctx.fillStyle = isKey ? (t > tVerd2 ? C.coral : C.lime) : (str === code2 && i > 10 ? C.coral : C.cream);
        ctx.fillText(s[i], cx, y); cx += ctx.measureText(s[i]).width;
      }
      return cx;
    };
    const ex1 = drawCode(code1, n1, 120, cy + 140), ex2 = drawCode(code2, n2, 120, cy + 220);
    const typing = (t > tType1 && t < tType1e) ? [ex1, cy + 140] : (t > tType2 && t < tType2e + 0.6) ? [ex2, cy + 220] : null;
    if (typing && Math.floor(t * 4) % 2 === 0) { ctx.fillStyle = C.lime; ctx.fillRect(typing[0] + 4, typing[1] - 26, 22, 52); }
    // crack
    if (fail > 0) {
      ctx.strokeStyle = C.cream; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.beginPath();
      const pts = [[620, cy], [585, cy + 70], [640, cy + 120], [590, cy + 190], [655, cy + 240], [615, cy + ch_]];
      const n = Math.max(2, Math.ceil(pts.length * fail));
      ctx.moveTo(...pts[0]); for (let i = 1; i < n; i++) ctx.lineTo(...pts[i]); ctx.stroke();
    }
    ctx.restore();
    K.stamp(ctx, 540, cy + 150, 'FAIL', C.coral, prog(t, tFail + 0.05, 0.3), 0.12);

    // incoming message -> verdict
    const out1 = E.inCubic(prog(t, tMsg2 - 0.05, 0.3));
    const p1 = E.outBack(prog(t, tMsg1, 0.4));
    const my = 860;
    if (p1 > 0 && out1 < 1) {
      K.msgCard(ctx, lerp(540, -500, out1), my, 760, 'Aapne LOTTERY jeeti!', null, { s: p1 });
    }
    const p2 = E.outBack(prog(t, tMsg2, 0.4));
    if (p2 > 0) {
      const x = lerp(1500, 540, p2);
      ctx.save(); ctx.translate(x, my); ctx.scale(p2 > 0 ? 1 : 0, 1);
      shadowed(ctx, '#00000080', 24, () => { ctx.fillStyle = C.panel; rr(ctx, -380, -58, 760, 116, 26); ctx.fill(); }, 8);
      ctx.fillStyle = C.muted; rr(ctx, -380, -58, 14, 116, 7); ctx.fill();
      ctx.font = F.b(46); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      const a = 'Aapne L', b = t > tZero ? '0' : 'O', c = 'TTERY jeeti!';
      const zFont = t > tZero ? F.codeB(50) : F.b(46);
      const wa = ctx.measureText(a).width, wc = ctx.measureText(c).width;
      ctx.font = zFont; const wb = ctx.measureText(b).width; ctx.font = F.b(46);
      let sx = -(wa + wb + wc) / 2 + 10;
      ctx.fillStyle = C.cream; ctx.fillText(a, sx, -2); sx += wa;
      const zp = prog(t, tZero, 0.35), zs = 1 + 0.6 * Math.sin(Math.PI * zp);
      ctx.save(); ctx.translate(sx + wb / 2, -2); ctx.scale(zs, zs);
      if (t > tZero) { ctx.fillStyle = C.coral + '44'; rr(ctx, -wb / 2 - 8, -34, wb + 16, 68, 12); ctx.fill(); }
      ctx.font = zFont; ctx.fillStyle = t > tZero ? C.coral : C.cream; ctx.textAlign = 'center'; ctx.fillText(b, 0, 0); ctx.restore();
      sx += wb; ctx.font = F.b(46); ctx.fillStyle = C.cream; ctx.textAlign = 'left'; ctx.fillText(c, sx, -2);
      ctx.restore();
    }
    // verdict pill
    const v1 = t > tVerd1 && t < tMsg2, v2 = t > tVerd2;
    if (v1 || v2) {
      const tv = v1 ? tVerd1 : tVerd2, pv = E.outBack(prog(t, tv, 0.35));
      arrow(ctx, 540, my + 80, 540, my + 200, C.muted, 9, 26, clamp(pv));
      const col = v1 ? C.coral : C.lime, lbl = v1 ? 'SPAM' : 'INBOX  (safe?!)';
      xf(ctx, 540, my + 290, pv, 0, () => {
        ctx.font = F.xb(52); const w = ctx.measureText(lbl).width + 140;
        ctx.fillStyle = col + '22'; rr(ctx, -w / 2, -52, w, 104, 52); ctx.fill();
        ctx.strokeStyle = col; ctx.lineWidth = 5; rr(ctx, -w / 2, -52, w, 104, 52); ctx.stroke();
        (v1 ? K.check : K.cross)(ctx, -w / 2 + 62, 0, v1 ? C.lime : C.coral, 1, 1);
        text(ctx, lbl, 34, 4, F.xb(52), col);
      });
    }
    // endless variants => rules can't keep up
    variants.forEach((v, i) => {
      const pv = E.outBack(prog(t, tFail + 0.22 + i * 0.07, 0.3));
      if (pv <= 0) return;
      const pos = [[230, 1260], [850, 1240], [190, 1180], [880, 1170], [360, 1270], [720, 1275]][i];
      const pos2 = [[200, 220], [870, 230], [150, 760], [930, 760], [200, 1010], [880, 1010]][i];
      K.chip(ctx, pos2[0], pos2[1], v, C.coral, { s: pv * 0.78, font: F.codeB(34) });
    });
  }

  // ---------- G3: ML flips it -> examples -> patterns ----------
  const tFlip = ch('L5', 1).start, tEx = L.L6.start, tPat = L.L7.start;
  cue(L.L5.start, 'pop'); cue(tFlip, 'flip');
  const stream = [
    ['URGENT: KYC update karo!', 'SPAM'], ['Mummy: Khana kha liya?', 'NOT SPAM'], ['Free gift! Link kholo', 'SPAM'],
    ['Riya: notes bhej de', 'NOT SPAM'], ['Loan approved! Call now', 'SPAM'], ['Class 10 baje hai', 'NOT SPAM'],
    ['Aapne iPhone jeeta!!', 'SPAM'], ['Papa: auto mil gaya?', 'NOT SPAM'], ['Account block hoga!', 'SPAM'],
    ['Rahul: match dekha?', 'NOT SPAM'], ['₹5000 FREE, abhi claim', 'SPAM'], ['Exam schedule out', 'NOT SPAM'],
    ['Bank: OTP kisi ko mat do', 'NOT SPAM'], ['Lucky draw winner!', 'SPAM'],
  ];
  const s0 = tEx + 0.15, gapS = 0.32;
  stream.forEach((_, i) => { if (i % 2 === 0) cue(s0 + i * gapS + 0.9, 'blip'); });
  const tHold1 = ch('L6', 2).start, tHold2 = ch('L6', 3).start;
  cue(tHold1, 'pop'); cue(tHold2, 'pop');
  const tChip = [ch('L7', 2).start, ch('L7', 3).start, ch('L7', 4).start];
  tChip.forEach((tc) => cue(tc, 'pop'));
  function g3(ctx, t) {
    const exitTitle = E.inOutCubic(prog(t, tEx - 0.1, 0.4));
    // title
    withAlpha(ctx, 1 - exitTitle, () => {
      const pt = E.outBack(prog(t, L.L5.start, 0.45));
      xf(ctx, 540, 420, pt, 0, () => {
        strokeText(ctx, 'MACHINE', 0, -60, F.xb(150), C.cream, C.ink, 12);
        strokeText(ctx, 'LEARNING', 0, 80, F.xb(150), C.lime, C.ink, 12);
      });
      // the flip: old way turns upside-down into the new way
      const pf = prog(t, tFlip, 0.6), sy = Math.cos(Math.PI * E.inOutCubic(pf));
      const pr = E.outBack(prog(t, L.L5.start + 0.2, 0.4));
      xf(ctx, 540, 730, pr, 0, () => {
        ctx.save(); ctx.scale(1, Math.abs(sy) < 0.02 ? 0.02 : Math.abs(sy));
        const newWay = pf > 0.5;
        ctx.fillStyle = (newWay ? C.lime : C.coral) + '1F'; rr(ctx, -440, -70, 880, 140, 70); ctx.fill();
        ctx.strokeStyle = newWay ? C.lime : C.coral; ctx.lineWidth = 5; rr(ctx, -440, -70, 880, 140, 70); ctx.stroke();
        text(ctx, newWay ? 'EXAMPLES do  →  khud seekho' : 'RULES likho  →  answers lo', 0, 6, F.xb(52), newWay ? C.lime : C.coral);
        ctx.restore();
      });
    });
    // Bitu
    const pbIn = E.outBack(prog(t, L.L5.start + 0.1, 0.5));
    const by = lerp(1600, 1040, pbIn), bs = lerp(0.95, 0.82, E.inOutCubic(prog(t, tEx, 0.5)));
    const mood = t < tEx ? 'happy' : t < tPat + 0.3 ? 'scan' : 'happy';
    const glow = t > tPat ? C.lime : C.cyan;
    // data stream (behind Bitu)
    const counterA = env(t, tEx, sw[2] + 0.3, 0.3, 0.2);
    withAlpha(ctx, counterA, () => {
      const n = Math.round(lerp(0, 10000, E.inOutCubic(prog(t, tEx, L.L7.end - tEx))));
      ctx.fillStyle = C.cyan + '22'; rr(ctx, 270, 220, 540, 84, 42); ctx.fill();
      text(ctx, `EXAMPLES: ${n.toLocaleString('en-IN')}${n >= 10000 ? '+' : ''}`, 540, 266, F.xb(44), C.cyan);
    });
    const streamDim = t > tPat ? lerp(0.35, 0, prog(t, tPat, 0.4)) : t > tHold1 ? lerp(1, 0.35, prog(t, tHold1, 0.25)) : 1;
    withAlpha(ctx, streamDim, () => {
      for (let k = 0; k < 40; k++) {
        const i = k % stream.length, st = s0 + k * gapS;
        const p = prog(t, st, 1.25);
        if (p <= 0 || p >= 1 || st > L.L7.end) continue;
        const side = k % 2 === 0 ? -1 : 1;
        const x = lerp(540 + side * 190, 540, E.inCubic(p)) + Math.sin(k * 1.7) * 20;
        const y = lerp(380, by - 40, E.inCubic(p));
        K.msgCard(ctx, x, y, 560, stream[i][0], stream[i][1], { s: lerp(0.9, 0.18, E.inCubic(p)), a: p > 0.85 ? (1 - p) / 0.15 : 1, rot: side * 0.05 * (1 - p) });
      }
    });
    // two held examples, with their labels (the "answers")
    const holdOut = E.inCubic(prog(t, tPat - 0.15, 0.35));
    [[tHold1, 'Aapne ₹10 lakh jeete!', 'SPAM', 470], [tHold2, 'Mummy: Khana kha liya?', 'NOT SPAM', 640]].forEach(([th, m, l, y]) => {
      const ph = E.outBack(prog(t, th, 0.35));
      if (ph > 0 && holdOut < 1) K.msgCard(ctx, 540, lerp(y, by - 60, holdOut), 760, m, l, { s: ph * lerp(1.1, 0.2, holdOut), a: 1 - holdOut });
    });
    // patterns found
    if (t > tPat) {
      withAlpha(ctx, E.outCubic(prog(t, ch('L7', 1).start, 0.3)), () => {
        strokeText(ctx, 'PATTERNS', 540, 380, F.xb(92), C.lime, C.ink, 10);
      });
      const items = [['AJEEB LINKS', K.linkIcon, 520], ['"URGENT"', K.alertIcon, 640], ['PAISON KA LAALACH', K.rupeeIcon, 760]];
      items.forEach(([lbl, icon, y], i) => {
        const pc = prog(t, tChip[i], 0.45);
        if (pc <= 0) return;
        const e = E.outBack(pc);
        const yy = lerp(by - 160, y, E.outCubic(pc));
        ctx.save(); ctx.strokeStyle = C.coral + '55'; ctx.lineWidth = 4; ctx.setLineDash([10, 12]);
        ctx.beginPath(); ctx.moveTo(540, by - 200); ctx.lineTo(540, yy + 40); ctx.stroke(); ctx.restore();
        K.chip(ctx, 540, yy, lbl, C.coral, { s: e, icon: (x, y2) => icon(ctx, x, y2, C.coral, 1) });
      });
      withAlpha(ctx, prog(t, tChip[2] + 0.3, 0.4), () => text(ctx, '*simplified: asal mein yeh patterns numbers (weights) hote hain', 540, 1288, F.sb(28), C.muted));
    }
    drawBitu(ctx, { x: 540, y: by, s: bs, t, mood, glow, arms: t > tFlip && t < tEx ? 'up' : 'down' });
  }

  // ---------- G4: the two equations, then MODEL ----------
  const r1 = 520, r2 = 900;
  const tR1 = [ch('L8', 0).start, ch('L8', 1).start, ch('L8', 1).start + (ch('L8', 1).end - ch('L8', 1).start) * 0.55, ch('L8', 2).start];
  const tR2 = [ch('L9', 0).start, ch('L9', 1).start, ch('L9', 1).start + (ch('L9', 1).end - ch('L9', 1).start) * 0.55, ch('L9', 2).start, ch('L9', 3).start];
  const tModel = ch('L10', 2).start, tFly = L.L10.start, tNew = ch('L10', 2).start + 0.3, tOut = tNew + 0.55;
  [...tR1.slice(1), ...tR2.slice(1, 4)].forEach((x) => cue(x, 'pop'));
  cue(tModel, 'model'); cue(tNew, 'whooshSmall'); cue(tOut, 'ding');
  function g4(ctx, t) {
    const fade = 1 - E.inOutCubic(prog(t, tFly, 0.45));
    withAlpha(ctx, fade, () => {
      // row 1
      withAlpha(ctx, E.outCubic(prog(t, tR1[0], 0.3)), () => {
        text(ctx, 'NORMAL PROGRAMMING', 540, r1 - 150, F.xb(44), C.muted);
      });
      K.eqBox(ctx, 190, r1, 230, 120, 'RULES', C.coral, { s: E.outBack(prog(t, tR1[1], 0.35)), a: clamp(prog(t, tR1[1], 0.1)) });
      withAlpha(ctx, prog(t, tR1[2], 0.2), () => text(ctx, '+', 340, r1 + 4, F.xb(70), C.cream));
      K.eqBox(ctx, 480, r1, 210, 120, 'DATA', C.cyan, { s: E.outBack(prog(t, tR1[2], 0.35)), a: clamp(prog(t, tR1[2], 0.1)) });
      if (t > tR1[3]) arrow(ctx, 600, r1, 690, r1, C.cream, 9, 26, E.outCubic(prog(t, tR1[3], 0.25)));
      // ANSWERS (row 1) - later flies down into row 2 input: the "ulta"
      const fly = E.inOutCubic(prog(t, tR2[1] + 0.2, 0.6));
      const ax = lerp(860, 480, fly), ay = lerp(r1, r2, fly);
      K.eqBox(ctx, ax, ay, 280, 120, 'ANSWERS', C.lime, { s: E.outBack(prog(t, tR1[3] + 0.1, 0.35)), a: clamp(prog(t, tR1[3] + 0.1, 0.1)) });
      if (fly > 0) withAlpha(ctx, 0.35, () => K.eqBox(ctx, 860, r1, 280, 120, 'ANSWERS', C.lime, {}));
      // row 2
      withAlpha(ctx, E.outCubic(prog(t, tR2[0], 0.3)), () => {
        ctx.fillStyle = C.lime + '14'; rr(ctx, 40, r2 - 230, 1000, 400, 40); ctx.fill();
        text(ctx, 'MACHINE LEARNING', 540, r2 - 150, F.xb(48), C.lime);
      });
      K.eqBox(ctx, 190, r2, 230, 120, 'DATA', C.cyan, { s: E.outBack(prog(t, tR2[1], 0.35)), a: clamp(prog(t, tR2[1], 0.1)) });
      withAlpha(ctx, prog(t, tR2[2], 0.2), () => text(ctx, '+', 330, r2 + 4, F.xb(70), C.cream));
      if (t > tR2[3]) arrow(ctx, 625, r2, 700, r2, C.cream, 9, 26, E.outCubic(prog(t, tR2[3], 0.25)));
    });
    // PATTERNS box -> MODEL
    const pp = E.outBack(prog(t, tR2[3] + 0.1, 0.4));
    const mv = E.inOutCubic(prog(t, tFly, 0.8));
    const morph = prog(t, tModel, 0.45);
    if (pp > 0) {
      const x = lerp(870, 540, mv), y = lerp(r2, 900, mv), s = pp * lerp(1, 1.0, mv);
      if (morph <= 0) K.eqBox(ctx, x, y, 290, 120, 'PATTERNS', C.lime, { s, filled: true });
    }
    if (t > tR2[4] && mv < 1) withAlpha(ctx, E.outCubic(prog(t, tR2[4], 0.3)) * (1 - mv), () => {
      text(ctx, 'machine khud seekhti hai', 600, r2 + 120, F.sb(34), C.lime);
    });
    if (morph > 0) {
      const fl = 1 - prog(t, tModel, 0.5);
      if (fl > 0) withAlpha(ctx, fl * 0.7, () => { ctx.fillStyle = C.lime; ctx.beginPath(); ctx.arc(540, 900, 200 + 900 * (1 - fl), 0, Math.PI * 2); ctx.fill(); });
      cube(ctx, 540, 900, 1.15 * E.outBack(morph), t);
      withAlpha(ctx, morph, () => strokeText(ctx, 'MODEL', 540, 1150, F.xb(96), C.lime, C.ink, 12));
    }
    // a brand-new message the model has never seen -> prediction
    const pn = prog(t, tNew, 0.5);
    if (t > tNew) {
      withAlpha(ctx, env(t, tNew, END, 0.3, 0.2), () => text(ctx, 'NAYA message (pehle kabhi nahi dekha)', 540, 330, F.sb(36), C.muted));
      if (pn < 1) K.msgCard(ctx, 540, lerp(470, 820, E.inCubic(pn)), 800, 'KYC update karo, warna block!', null, { s: lerp(1, 0.3, E.inCubic(pn)), a: pn > 0.8 ? (1 - pn) / 0.2 : 1 });
      const po = E.outBack(prog(t, tOut, 0.35));
      if (po > 0) xf(ctx, 540, 520, po, 0, () => {
        ctx.fillStyle = C.coral; rr(ctx, -250, -60, 500, 120, 60); ctx.fill();
        text(ctx, 'SPAM · 97%', 0, 6, F.xb(60), C.ink);
      });
    }
  }
  function cube(ctx, x, y, s, t) {
    if (s <= 0) return;
    ctx.save(); ctx.translate(x, y + Math.sin(t * 2.4) * 8); ctx.scale(s, s);
    shadowed(ctx, C.lime, 60, () => {
      const a = 120, h = 70;
      ctx.fillStyle = '#B3F02C'; ctx.beginPath(); ctx.moveTo(0, -a); ctx.lineTo(a, -a + h); ctx.lineTo(0, -a + 2 * h); ctx.lineTo(-a, -a + h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#8FCB1C'; ctx.beginPath(); ctx.moveTo(-a, -a + h); ctx.lineTo(0, -a + 2 * h); ctx.lineTo(0, a + 20); ctx.lineTo(-a, a - 50); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#6FA80F'; ctx.beginPath(); ctx.moveTo(a, -a + h); ctx.lineTo(0, -a + 2 * h); ctx.lineTo(0, a + 20); ctx.lineTo(a, a - 50); ctx.closePath(); ctx.fill();
    });
    // circuitry lines on faces
    ctx.strokeStyle = '#0D0B1E66'; ctx.lineWidth = 5;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-100, -20 + i * 40); ctx.lineTo(-20, 20 + i * 40); ctx.stroke(); ctx.beginPath(); ctx.moveTo(100, -20 + i * 40); ctx.lineTo(20, 20 + i * 40); ctx.stroke(); }
    ctx.restore();
  }

  // ---------- G5: outro / next-episode hook ----------
  cue(L.L11.start + 0.1, 'pop');
  function g5(ctx, t) {
    const p = E.outBack(prog(t, L.L11.start - 0.05, 0.45));
    // orbiting question marks = the open question for EP02
    for (let i = 0; i < 3; i++) {
      const a = t * 1.3 + (i * Math.PI * 2) / 3, r = 330;
      const q = E.outBack(prog(t, L.L11.start + 0.2 + i * 0.12, 0.35));
      if (q > 0) xf(ctx, 540 + Math.cos(a) * r, 860 + Math.sin(a) * r * 0.45, q, Math.sin(a) * 0.2, () => text(ctx, '?', 0, 0, F.xb(110), [C.sun, C.lime, C.cyan][i]));
    }
    drawBitu(ctx, { x: 540, y: lerp(1500, 900, p), s: 1.05, t, mood: 'curious', look: Math.sin(t * 2) * 0.8, glow: C.sun });
    const pn = E.outBack(prog(t, ch('L11', 2).start, 0.4));
    xf(ctx, 540, 330, pn, 0, () => {
      ctx.fillStyle = C.lime; rr(ctx, -220, -50, 440, 100, 50); ctx.fill();
      text(ctx, 'NEXT · EP 02', 0, 6, F.xb(52), C.ink);
    });
    withAlpha(ctx, prog(t, ch('L11', 2).start + 0.3, 0.4), () => text(ctx, 'Follow karo — series yahin se shuru', 540, 1270, F.sb(36), C.muted));
  }

  // ---------- compose ----------
  const groups = [[0, sw[0], g1, C.violet], [sw[0], sw[1], g2, C.coral], [sw[1], sw[2], g3, C.cyan], [sw[2], sw[3], g4, C.lime], [sw[3], END + 1, g5, C.sun]];
  const chunks = tl.lines.flatMap((l) => l.chunks.map((c) => ({ ...c, lineEnd: l.end })));
  function activeChunk(t) {
    let cur = null;
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i], next = chunks[i + 1];
      if (t >= c.start - 0.04 && t < (next ? Math.min(next.start - 0.04, c.end + 0.45) : c.end + 0.45)) cur = c;
    }
    return cur;
  }
  function draw(ctx, t) {
    const gi = groups.findIndex(([a, b]) => t >= a && t < b);
    const [, , fn, glow] = groups[Math.max(0, gi)];
    background(ctx, t, glow);
    fn(ctx, t);
    K.header(ctx, 1, 12, 'AI · zero se');
    for (const s of sw) swipe(ctx, prog(t, s - 0.21, 0.42));
    K.caption(ctx, activeChunk(t), t);
  }
  return { draw, cues, chunks, duration: END };
}

module.exports = { build };

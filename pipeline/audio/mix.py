#!/usr/bin/env python3
"""Mix narration + procedural SFX + lo-fi music bed, loudness-normalise, mux with video.

Usage: python3 pipeline/audio/mix.py episodes/<ep-folder>
All sounds are synthesised here (no third-party samples -> no licensing issues).
Target: -14 LUFS integrated, -1.5 dBTP (YouTube/Instagram normalise near -14).
"""
import json, re, subprocess, sys, wave
from pathlib import Path
import numpy as np

SR = 48000
rng = np.random.default_rng(7)


def tt(d): return np.arange(int(d * SR)) / SR
def envexp(d, k): return np.exp(-tt(d) * k)
def lp(x, a):  # one-pole low-pass, a in (0,1): higher = brighter
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += a * (v - acc); y[i] = acc
    return y


def noise(d): return rng.uniform(-1, 1, int(d * SR))


def sfx(kind):
    if kind in ("whoosh", "whooshSmall", "flip"):
        d = 0.45 if kind != "whooshSmall" else 0.3
        n = noise(d); t = tt(d); e = np.sin(np.pi * t / d) ** 2
        cut = np.linspace(0.02, 0.35, len(n)) if kind != "flip" else np.linspace(0.05, 0.5, len(n))
        y = np.empty_like(n); acc = 0.0
        for i, v in enumerate(n): acc += cut[i] * (v - acc); y[i] = acc
        return y * e * (0.9 if kind == "whoosh" else 0.6)
    if kind == "rise":
        t = tt(0.5); f = 200 + 500 * t / 0.5
        return 0.25 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.5)
    if kind == "notify":
        out = np.zeros(int(0.45 * SR))
        for i, f in enumerate((988, 1319)):
            t = tt(0.3); s = int(i * 0.11 * SR)
            out[s:s + len(t)] += 0.32 * np.sin(2 * np.pi * f * t) * envexp(0.3, 14)
        return out
    if kind == "stamp":
        t = tt(0.4); f = 110 * np.exp(-t * 9) + 45
        body = np.sin(2 * np.pi * np.cumsum(f) / SR) * envexp(0.4, 9)
        return 0.95 * body + 0.35 * lp(noise(0.4), 0.3) * envexp(0.4, 30)
    if kind == "pop":
        t = tt(0.12); f = 900 * np.exp(-t * 22) + 300
        return 0.35 * np.sin(2 * np.pi * np.cumsum(f) / SR) * envexp(0.12, 30)
    if kind == "blip":
        t = tt(0.07); return 0.18 * np.sin(2 * np.pi * 1500 * t) * envexp(0.07, 50)
    if kind == "tick":
        t = tt(0.05); return 0.22 * np.sin(2 * np.pi * 2200 * t) * envexp(0.05, 80)
    if kind == "ding":
        t = tt(0.8); y = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((1047, .5), (2094, .2), (3140, .08)))
        return 0.4 * y * envexp(0.8, 6)
    if kind == "fail":
        t = tt(0.55); f = 330 * np.exp(-t * 2.2)
        saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
        return 0.3 * lp(saw, 0.25) * np.minimum(1, (0.55 - t) * 8)
    if kind == "model":
        out = np.zeros(int(1.4 * SR))
        for i, f in enumerate((523, 659, 784, 1047)):
            t = tt(1.0); s = int(i * 0.07 * SR)
            out[s:s + len(t)] += 0.16 * np.sin(2 * np.pi * f * t) * envexp(1.0, 4)
        t = tt(1.4); out += 0.5 * np.sin(2 * np.pi * 55 * t) * envexp(1.4, 5)
        return out
    raise ValueError(kind)


def music_bed(dur, bpm=96):
    """Gentle lo-fi loop: pad chords (Am F C G), soft kick, hats. Original, procedural."""
    n = int(dur * SR); out = np.zeros(n); beat = 60 / bpm
    chords = [(220.0, 261.6, 329.6), (174.6, 220.0, 261.6), (130.8, 164.8, 196.0), (196.0, 246.9, 293.7)]
    bar = 4 * beat; t_all = np.arange(n) / SR
    for b in range(int(dur / bar) + 1):
        s, e = int(b * bar * SR), min(n, int((b + 1) * bar * SR))
        if s >= n: break
        t = t_all[s:e] - b * bar
        pad = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) for f in chords[b % 4])
        att = np.minimum(1, t / 0.4) * np.minimum(1, (bar - t) / 0.3)
        out[s:e] += 0.05 * pad * att
    kick_t = tt(0.25); kick = np.sin(2 * np.pi * np.cumsum(90 * np.exp(-kick_t * 18) + 40) / SR) * envexp(0.25, 14)
    hat = lp(noise(0.05), 0.9) - lp(noise(0.05), 0.2); hat *= envexp(0.05, 70)
    k = 0
    while k * beat / 2 < dur:
        s = int(k * beat / 2 * SR)
        if k % 4 in (0, 3) and s + len(kick) < n: out[s:s + len(kick)] += 0.35 * kick
        if k % 2 == 1 and s + len(hat) < n: out[s:s + len(hat)] += 0.08 * hat
        k += 1
    fade = int(0.8 * SR); out[-fade:] *= np.linspace(1, 0, fade); out[:int(0.3 * SR)] *= np.linspace(0, 1, int(0.3 * SR))
    return out


def read_wav(p):
    with wave.open(str(p)) as w:
        sr = w.getframerate(); x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float64) / 32768
    if sr != SR:  # linear resample (narration is 24k -> 48k, exact 2x)
        x = np.interp(np.arange(int(len(x) * SR / sr)) * sr / SR, np.arange(len(x)), x)
    return x


def write_wav(p, x):
    with wave.open(str(p), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())


def main(ep_dir):
    ep_dir = Path(ep_dir); b = ep_dir / "build"
    ep = json.loads((ep_dir / "episode.json").read_text())
    cues = json.loads((b / "cues.json").read_text())
    dur = cues["duration"]; n = int(dur * SR)
    voice = np.zeros(n); v = read_wav(b / "narration.wav"); voice[:min(n, len(v))] = v[:n]
    fx = np.zeros(n)
    for c in cues["cues"]:
        kinds = []
        if c["type"] == "type":  # keyboard clicks between t and until
            tk = c["t"]
            while tk < c["until"]:
                kinds.append((tk, "tick", 0.45)); tk += 0.075 + rng.uniform(0, 0.05)
        else:
            kinds.append((c["t"], c["type"], 1.0))
        for t0, k, g in kinds:
            s = sfx(k) * g; i = int(t0 * SR)
            if 0 <= i < n: fx[i:i + len(s)] += s[: n - i]
    bed = music_bed(dur)
    # duck the bed under narration (smoothed voice envelope)
    env = np.abs(voice); win = int(0.15 * SR)
    env = np.convolve(env, np.ones(win) / win, mode="same")
    duck = 1 - 0.55 * np.clip(env / (env.max() * 0.25), 0, 1)
    mix = voice * 1.0 + fx * 0.55 + bed * 0.55 * duck
    raw = b / "mix_raw.wav"; write_wav(raw, mix / max(1e-9, np.abs(mix).max()) * 0.9)
    # measured gain to -14 LUFS, then a true-peak limiter (-1.5 dBTP)
    def lufs(path):
        e = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
        return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1])
    gain = -14.0 - lufs(raw)
    final = ep_dir / "final"; final.mkdir(exist_ok=True)
    out = final / f"{ep['id']}-{ep['slug']}.mp4"
    for _ in range(3):  # converge on the *delivered* file's loudness
        af = f"volume={gain:.2f}dB,alimiter=limit=0.84:attack=2:release=60:level=disabled,aresample=48000"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(b / "video_noaudio.mp4"), "-i", str(raw), "-af", af,
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-ar", "48000", "-shortest", "-movflags", "+faststart", str(out)], check=True)
        delta = -14.0 - lufs(out)
        if abs(delta) < 0.2: break
        gain += delta
    print("final ->", out)


if __name__ == "__main__":
    main(sys.argv[1])

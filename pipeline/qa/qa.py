#!/usr/bin/env python3
"""Automated export QA. Usage: python3 pipeline/qa/qa.py episodes/<ep-folder>
Writes <ep>/final/qa.json and <ep>/final/contact_sheet.png. Exit code 1 on any FAIL."""
import json, re, subprocess, sys, wave
from pathlib import Path
import numpy as np


def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)


def main(ep_dir):
    ep_dir = Path(ep_dir); ep = json.loads((ep_dir / "episode.json").read_text())
    final = ep_dir / "final"; mp4 = final / f"{ep['id']}-{ep['slug']}.mp4"; srt = final / f"{ep['id']}-{ep['slug']}.srt"
    tl = json.loads((ep_dir / "build/timeline.json").read_text())
    R, checks = {}, []
    def check(name, ok, detail): checks.append({"check": name, "result": "PASS" if ok else "FAIL", "detail": detail})

    pr = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-count_frames", "-of", "json", str(mp4)]).stdout)
    v = next(s for s in pr["streams"] if s["codec_type"] == "video"); a = next((s for s in pr["streams"] if s["codec_type"] == "audio"), None)
    dur = float(pr["format"]["duration"]); fps = eval(v["r_frame_rate"])
    nb = int(v.get("nb_read_frames", 0))
    R.update(container=pr["format"]["format_name"], duration_s=round(dur, 3), width=v["width"], height=v["height"], fps=fps,
             video_codec=v["codec_name"], pix_fmt=v["pix_fmt"], frames=nb, audio_codec=a and a["codec_name"],
             audio_sr=a and int(a["sample_rate"]), audio_channels=a and a["channels"], size_mb=round(int(pr["format"]["size"]) / 1e6, 2))
    check("resolution 1080x1920", (v["width"], v["height"]) == (1080, 1920), f"{v['width']}x{v['height']}")
    check("duration <= 45s", dur <= 45.0, f"{dur:.3f}s")
    check("mp4/h264/yuv420p", "mp4" in pr["format"]["format_name"] and v["codec_name"] == "h264" and v["pix_fmt"] == "yuv420p", f"{v['codec_name']} {v['pix_fmt']}")
    exp = round(float(v.get("duration", dur)) * fps)
    check("no missing frames", abs(nb - exp) <= 1, f"{nb} frames decoded, {exp} expected @ {fps:g}fps")
    check("audio stream present", a is not None, f"{R['audio_codec']} {R['audio_sr']}Hz {R['audio_channels']}ch")

    bd = run(["ffmpeg", "-i", str(mp4), "-vf", "blackdetect=d=0.1:pix_th=0.05", "-an", "-f", "null", "-"]).stderr
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", bd)
    check("no black-screen segments", not blacks, f"{len(blacks)} found {blacks[:3]}")

    lu = run(["ffmpeg", "-i", str(mp4), "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", lu)[-1]); TP = float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", lu)[-1])
    R.update(loudness_lufs=I, true_peak_dbtp=TP)
    check("loudness -14 LUFS +-1", abs(I + 14) <= 1, f"{I} LUFS")
    check("true peak <= -1 dBTP (no clipping)", TP <= -1.0, f"{TP} dBTP")

    with wave.open(str(ep_dir / "build/narration.wav")) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(float) / 32768; sr = w.getframerate()
    clip = int(np.sum(np.abs(x) > 0.999)); R["narration_peak"] = round(float(np.abs(x).max()), 3)
    check("narration not clipped", clip == 0, f"{clip} clipped samples, peak {R['narration_peak']}")
    # longest silence inside narration (detects TTS dropouts)
    fr = int(0.02 * sr); rms = np.sqrt(np.convolve(x ** 2, np.ones(fr) / fr, "same"))[::fr]
    sil, longest, cur = rms < 0.01, 0, 0
    first, last = np.argmax(~sil), len(sil) - np.argmax(~sil[::-1])
    for s in sil[first:last]: cur = cur + 1 if s else 0; longest = max(longest, cur)
    R["longest_internal_silence_s"] = round(longest * 0.02, 2)
    allowed = max(l.get("gapAfter", 0.15) for l in ep["lines"][:-1]) + 0.6  # designed pause + TTS edge silence
    check("no TTS dropouts", longest * 0.02 <= allowed, f"longest pause {longest * 0.02:.2f}s (allowed {allowed:.2f}s = longest designed gap + 0.6s)")

    # subtitles
    cues = re.findall(r"(\d+)\n(\d\d:\d\d:\d\d,\d{3}) --> (\d\d:\d\d:\d\d,\d{3})\n(.+?)\n", srt.read_text() + "\n", re.S)
    ts = lambda s: int(s[:2]) * 3600 + int(s[3:5]) * 60 + int(s[6:8]) + int(s[9:]) / 1000
    mono = all(ts(c[1]) < ts(c[2]) for c in cues) and all(ts(cues[i][2]) <= ts(cues[i + 1][1]) for i in range(len(cues) - 1))
    check("SRT cues ordered, non-overlapping", mono, f"{len(cues)} cues")
    check("SRT within video duration", ts(cues[-1][2]) <= dur, f"last cue ends {cues[-1][2]}")
    script = [c[0].replace("*", "") for l in ep["lines"] for c in l["chunks"]]
    check("SRT text == script captions", [c[3].strip() for c in cues] == script, "word-for-word match with episode.json")
    spoken_ok = all(abs(ts(c[1]) - (k["start"] - 0.04)) < 0.002 for c, k in zip(cues, [k for l in tl["lines"] for k in l["chunks"]]))
    check("SRT timing from TTS alignment", spoken_ok, "cue starts = model duration-predictor chunk starts")
    maxcps = max(len(c[3]) / max(0.3, ts(c[2]) - ts(c[1])) for c in cues)
    R["max_chars_per_sec"] = round(maxcps, 1)
    check("caption reading speed <= 25 cps", maxcps <= 25, f"max {maxcps:.1f} chars/s")

    # contact sheet (one frame every 3 s)
    run(["ffmpeg", "-y", "-i", str(mp4), "-vf", "fps=1/3,scale=270:480,tile=8x2:padding=4", "-frames:v", "1", str(final / "contact_sheet.png")])
    R["checks"] = checks
    (final / "qa.json").write_text(json.dumps(R, indent=1))
    for c in checks: print(f"[{c['result']}] {c['check']:<38} {c['detail']}")
    sys.exit(1 if any(c["result"] == "FAIL" for c in checks) else 0)


if __name__ == "__main__":
    main(sys.argv[1])

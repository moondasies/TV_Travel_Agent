#!/usr/bin/env python3
"""Narration synthesis + alignment for one episode.

Usage:  python3 pipeline/tts/synth.py episodes/<ep-folder>

Reads  <ep>/episode.json and pipeline/tts/voice.json
Writes <ep>/build/narration.wav   mono 24 kHz narration
       <ep>/build/timeline.json   line + chunk start/end times (seconds)
       <ep>/build/phonemes.txt    phoneme dump for pronunciation review

Alignment (kokoro provider): the ONNX graph is patched once to also output the
duration predictor's rounded per-token durations (/encoder/Round_output_0).
Each duration unit is exactly 600 samples at 24 kHz, so chunk boundaries are
taken from the model's own timing, not estimated from text length.
"""
import json, os, re, sys, wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
CFG = json.loads((ROOT / "pipeline/tts/voice.json").read_text())
MODELS = Path(os.environ.get("KOKORO_MODEL_DIR", ROOT / "pipeline/.models"))
HOP = 600  # samples per duration unit (verified: len(audio) == sum(durations) * 600)


def ensure_kokoro():
    import urllib.request
    MODELS.mkdir(parents=True, exist_ok=True)
    k = CFG["kokoro"]
    for key, name in (("model_url", "kokoro-v1.0.onnx"), ("voices_url", "voices-v1.0.bin")):
        p = MODELS / name
        if not p.exists():
            print(f"downloading {name} ...")
            urllib.request.urlretrieve(k[key], p)
    dur = MODELS / "kokoro-v1.0-dur.onnx"
    if not dur.exists():
        import onnx
        m = onnx.load(MODELS / "kokoro-v1.0.onnx")
        m.graph.output.append(onnx.helper.make_tensor_value_info(
            "/encoder/Round_output_0", onnx.TensorProto.FLOAT, None))
        onnx.save(m, dur)
    return MODELS / "kokoro-v1.0.onnx", MODELS / "voices-v1.0.bin", dur


def apply_lexicon(text):
    lex = {k: v for k, v in CFG.get("lexicon", {}).items() if not k.startswith("_")}
    for k, v in lex.items():
        if v.startswith("ipa:"):
            continue
        if k.isascii():
            text = re.sub(rf"\b{re.escape(k)}\b", v, text)
        else:  # Devanagari: \b is unreliable around combining vowel signs
            text = text.replace(k, v)
    return text


class KokoroAligned:
    def __init__(self):
        import onnxruntime as ort
        from kokoro_onnx import Kokoro
        model, voices, dur = ensure_kokoro()
        self.k = Kokoro(str(model), str(voices))
        self.sess = ort.InferenceSession(str(dur))
        c = CFG["kokoro"]
        self.voice, self.lang, self.speed, self.sr = os.environ.get("KOKORO_VOICE", c["voice"]), c["lang"], c["speed"], c["sample_rate"]

    def phonemize(self, text):
        ipa = {k: v[4:] for k, v in CFG.get("lexicon", {}).items() if v.startswith("ipa:")}
        if text.strip() in ipa:
            return ipa[text.strip()]
        ph = self.k.tokenizer.phonemize(apply_lexicon(text), self.lang)
        return re.sub(r"\((en|hi|[a-z-]{2,6})\)", "", ph).strip()  # drop espeak language-switch markers

    def line(self, chunks):
        """chunks: list of spoken strings. Returns audio, [(t0,t1)...] per chunk, phonemes."""
        phs = [self.phonemize(c) for c in chunks]
        toks, spans = [], []
        for i, p in enumerate(phs):
            t = self.k.tokenizer.tokenize(p + (" " if i < len(phs) - 1 else ""))
            spans.append((len(toks), len(toks) + len(t)))
            toks += t
        assert len(toks) <= 510, "line too long for one Kokoro pass - split it"
        style = np.array(self.k.voices[self.voice][len(toks)], dtype=np.float32).reshape(1, 256)
        audio, dur = self.sess.run(None, {
            "tokens": np.array([[0, *toks, 0]], dtype=np.int64),
            "style": style, "speed": np.array([self.speed], dtype=np.float32)})
        dur = dur.reshape(-1)  # includes leading/trailing pad token
        assert abs(len(audio) - dur.sum() * HOP) < HOP, "duration/audio mismatch"
        cum = np.concatenate([[0], np.cumsum(dur)]) * HOP / self.sr
        times = [(float(cum[a + 1]), float(cum[b + 1])) for a, b in spans]  # +1 skips pad token
        # trim the model's pad-token silence, keeping a small natural margin
        margin = 0.06
        t0, t1 = max(0.0, times[0][0] - margin), min(len(audio) / self.sr, times[-1][1] + margin)
        audio = audio[int(t0 * self.sr):int(t1 * self.sr)].copy()
        fade = int(0.012 * self.sr)
        audio[:fade] *= np.linspace(0, 1, fade); audio[-fade:] *= np.linspace(1, 0, fade)
        times = [(a - t0, b - t0) for a, b in times]
        return audio.astype(np.float32), times, phs


class ElevenLabs:
    """Optional provider (not exercised in the pilot: api.elevenlabs.io is unreachable
    from the build sandbox). Uses /with-timestamps character alignment."""
    def __init__(self):
        self.key = os.environ["ELEVENLABS_API_KEY"]
        self.c = CFG["elevenlabs"]
        assert self.c["voice_id"], "set elevenlabs.voice_id in voice.json"
        self.sr = 24000

    def line(self, chunks):
        import base64, urllib.request
        text = " ".join(chunks)
        body = json.dumps({"text": text, "model_id": self.c["model_id"], "voice_settings": {
            k: self.c[k] for k in ("stability", "similarity_boost", "style", "speed")}}).encode()
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{self.c['voice_id']}/with-timestamps?output_format=pcm_24000",
            data=body, headers={"xi-api-key": self.key, "Content-Type": "application/json"})
        r = json.loads(urllib.request.urlopen(req).read())
        audio = np.frombuffer(base64.b64decode(r["audio_base64"]), dtype="<i2").astype(np.float32) / 32768
        st, en = r["alignment"]["character_start_times_seconds"], r["alignment"]["character_end_times_seconds"]
        times, pos = [], 0
        for c in chunks:
            a, b = pos, min(pos + len(c), len(st)) - 1
            times.append((st[a], en[b])); pos += len(c) + 1
        return audio, times, chunks


def write_wav(path, audio, sr):
    pcm = np.clip(audio, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((pcm * 32767).astype("<i2").tobytes())


def main(ep_dir):
    ep_dir = Path(ep_dir)
    ep = json.loads((ep_dir / "episode.json").read_text())
    out = ep_dir / "build"; out.mkdir(exist_ok=True)
    tts = KokoroAligned() if CFG["provider"] == "kokoro" else ElevenLabs()
    sr = tts.sr
    lead = 0.25  # silence before first word (lets the hook visual land)
    parts, t = [np.zeros(int(lead * sr), np.float32)], lead
    lines, phon = [], []
    for ln in ep["lines"]:
        spoken = [c[1] for c in ln["chunks"]]
        audio, times, phs = tts.line(spoken)
        chunks = [{"text": c[0], "spoken": c[1], "start": round(t + a, 3), "end": round(t + b, 3)}
                  for c, (a, b) in zip(ln["chunks"], times)]
        lines.append({"id": ln["id"], "beat": ln["beat"], "start": round(t + times[0][0], 3),
                      "end": round(t + times[-1][1], 3), "chunks": chunks})
        phon.append(f"## {ln['id']}\n" + "\n".join(f"  {c[1]:<40} -> {p}" for c, p in zip(ln["chunks"], phs)))
        parts.append(audio); t += len(audio) / sr
        gap = ln.get("gapAfter", 0.15)
        parts.append(np.zeros(int(gap * sr), np.float32)); t += gap
    audio = np.concatenate(parts)
    peak = np.abs(audio).max()
    audio = audio / peak * 0.89  # -1 dBFS peak; loudness is finalised in the mix stage
    write_wav(out / "narration.wav", audio, sr)
    tl = {"episode": ep["id"], "sampleRate": sr, "duration": round(len(audio) / sr, 3),
          "voice": CFG["provider"] + ":" + (CFG["kokoro"]["voice"] if CFG["provider"] == "kokoro" else CFG["elevenlabs"]["voice_id"]),
          "lines": lines}
    (out / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1))
    (out / "phonemes.txt").write_text("\n".join(phon) + "\n", encoding="utf-8")
    print(f"narration {tl['duration']:.2f}s  ({len(lines)} lines) -> {out}")


if __name__ == "__main__":
    main(sys.argv[1])

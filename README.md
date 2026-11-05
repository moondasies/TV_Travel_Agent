# Bitu Universe — AI/ML from zero, in Hinglish (45-second shorts)

A structured short-form video series that takes a complete beginner from "what is Machine Learning?" to how LLMs,
RAG and AI agents work, one ≤45 s episode at a time. *Bitu Universe* / *AI zero se* are working names.

**Status:** Pilot **EP01 "Machine Learning kya hai? — Rules vs Examples"** rendered and awaiting review.
No further episodes will be produced until the pilot is approved.

## 👉 Review the pilot
- Video: [`episodes/ep01-machine-learning-kya-hai/final/ep01-machine-learning-kya-hai.mp4`](episodes/ep01-machine-learning-kya-hai/final/ep01-machine-learning-kya-hai.mp4) (43.7 s, 1080×1920)
- Subtitles: [`…/final/ep01-machine-learning-kya-hai.srt`](episodes/ep01-machine-learning-kya-hai/final/ep01-machine-learning-kya-hai.srt)
- Quality report: [`…/quality-report.md`](episodes/ep01-machine-learning-kya-hai/quality-report.md)

## Deliverables map
| Brief item | Where |
|---|---|
| A. Research | `research/sources_and_verification.md` (sources, access log, verified facts) · `research/topic_selection_and_pedagogy.md` (topic rationale, learning outcome, pedagogy) |
| Curriculum | `curriculum/curriculum.md` (64 slots / ~70 episodes, prerequisites, objectives, examples, visuals, misconceptions, refs, links) |
| B. Script | `episodes/ep01-…/script.md` (source of truth: `episode.json`) |
| C. Storyboard | `episodes/ep01-…/storyboard.md` + `final/contact_sheet.png` |
| D. Audio | `episodes/ep01-…/audio/` (final narration, voice config, pronunciation checks, 4 voice samples) |
| E. Visual assets | `brand/` (design system, tokens, fonts) · `pipeline/render/bitu.js` (mascot) · `pipeline/render/components.js` (reusable motion graphics) |
| F. Video | `episodes/ep01-…/final/*.mp4` |
| G. Subtitles | `episodes/ep01-…/final/*.srt` |
| H. Social | `episodes/ep01-…/social.md` |
| I. Quality report | `episodes/ep01-…/quality-report.md` + `final/qa.json` |

## Production pipeline (fully code-driven, deterministic)
```
episode.json ──► tts/synth.py ──► narration.wav + timeline.json (real per-phoneme alignment)
                                        │
                 render/render.js ◄─────┘  Node + @napi-rs/canvas → raw frames → ffmpeg H.264
                        │                  (+ SRT, + SFX cue list)
                 audio/mix.py  ──► SFX + music bed + −14 LUFS ──► final MP4
                 qa/qa.py      ──► 15 automated checks + contact sheet
```
Why this stack: no browser or Remotion licence needed; every visual (including the mascot) is code, so it is
reusable and identical across episodes. All timing derives from the narration, so re-voicing re-times everything.

### Run it
Requirements: Node 18+, Python 3.10+, ffmpeg.
```bash
cd pipeline && npm install && cd ..
```
```bash
pip install kokoro-onnx onnx onnxruntime numpy soundfile
```
```bash
./produce.sh episodes/ep01-machine-learning-kya-hai
```
Kokoro model files (~350 MB) are downloaded to `pipeline/.models/` on first run (git-ignored).
Optional: `ELEVENLABS_API_KEY` env var + `provider: "elevenlabs"` in `pipeline/tts/voice.json` to switch narrator (credentials are never stored in the repo).

### Making the next episode (after approval)
1. Research pass → add to `research/`, verify every claim.
2. Write `episodes/epNN-slug/episode.json` (caption ↔ spoken chunks, beats).
3. Write `pipeline/render/episodes/epNN.js` using the engine, components and Bitu (scenes keyed to `beat`s/chunks).
4. `./produce.sh episodes/epNN-slug` → QA must pass → manual review → your approval → publish.

# EP01 quality report

Final file: `final/ep01-machine-learning-kya-hai.mp4` · Subtitles: `final/ep01-machine-learning-kya-hai.srt` · Machine-readable: `final/qa.json`
All automated checks are produced by `pipeline/qa/qa.py` (re-run with `./produce.sh`).

## Technical export
| Check | Result | Value |
|---|---|---|
| Duration ≤ 45 s | ✅ | **43.73 s** |
| Resolution | ✅ | **1080 × 1920** (9:16) |
| Container / codec | ✅ | MP4, H.264 High, yuv420p, 30 fps, CRF 17, +faststart, 19.1 MB |
| Missing frames | ✅ | 1312 decoded = 1312 expected |
| Black-screen segments | ✅ | 0 (ffmpeg blackdetect, 0.1 s / 5%) |
| Frozen video | ✅ | none ≥ 2 s (ffmpeg freezedetect) |
| Audio stream | ✅ | AAC-LC 48 kHz stereo 192 kbps |

## Audio
| Check | Result | Value |
|---|---|---|
| Integrated loudness | ✅ | −14.2 LUFS (target −14; YouTube/IG reference) |
| True peak | ✅ | −3.7 dBTP (≤ −1.5 limit) |
| Narration clipping | ✅ | 0 clipped samples; peak 0.89 |
| TTS dropouts | ✅ | longest internal pause 1.72 s, the deliberate pause for the MODEL inference demo (designed 1.2 s + edge silence) |
| Pronunciation | ✅ with caveats | phonemes reviewed for every chunk; 3 Hindi schwa errors fixed via lexicon (see `audio/README.md`); English terms use British phonemes |
| Listening test | ⚠️ **not performed** | The sandbox has no audio playback. Naturalness has not been judged by ear. Please listen. |

## Subtitles
| Check | Result | Value |
|---|---|---|
| SRT text = spoken script | ✅ | 36 cues, word-for-word match with `episode.json` |
| Sync | ✅ | cue starts = the TTS model's own duration-predictor timings (not estimates), 40 ms lead |
| Ordered / non-overlapping / within duration | ✅ | last cue ends 43.685 s |
| Reading speed | ✅ | max 21.6 chars/s (≤ 25) |
| Burned-in captions | ✅ | 1–2 lines, max width 880 px, centre y 1395: above the Shorts/Reels UI zone (y > 1520), never over the explanatory visuals (y 170–1290). Checked on stills from the final MP4. |
| Note | — | Captions match the spoken *words*, written as Roman Hinglish. "10 lakh" is shown for spoken "दस लाख" (standard numeral captioning). |

## Visual QA (manual, on frames from the final MP4)
Issues found during review and fixed before final render:
1. The "rule fail" moment was hidden by the scene-swipe after 0.6 s → added a 0.5 s pause and sped up the variant chips.
2. Ghost stream cards cluttered the PATTERNS title → the stream now fades out when patterns appear.
3. The model's "SPAM · 97%" verdict showed for only ~0.1 s → the demo now starts on the word "model", with a 1.2 s pause.
4. Variant chips overlapped the INBOX verdict pill → repositioned.
5. In the Baloo font, "0" was indistinguishable from "O" (killing the scam joke) → the swapped glyph now uses JetBrains Mono's dotted zero.
6. Bitu's outro face read as sad → changed to a curious "o" mouth.

## Educational review
| Area | Assessment |
|---|---|
| Technical accuracy | Claims checked against `research/sources_and_verification.md`. "Patterns" instead of "rules" for what ML learns, plus an on-screen weights footnote. We don't claim ML can't be fooled. The 97% score is illustrative. |
| Beginner understanding | No prior knowledge assumed. One example throughout; exactly one new technical term (*model*); concrete → abstract progression. |
| Visual clarity | Every scene visualises the sentence being spoken (Mayer: coherence/signaling). Colour carries meaning (coral = wrong, lime = learned). |
| Engagement | Hook in < 1 s with a universally familiar scam SMS; open question at 6 s; a joke at 13 s (INBOX safe?!); payoff at 38 s; new open loop for EP02. |
| Pacing | ~2.6 words/s narration at speed 1.2. Dense but every chunk is captioned. Worth confirming by ear. |

## Known limitations
1. **Voice quality is the biggest risk.** Kokoro Hindi voices are serviceable but not premium, and I could not listen to them. ElevenLabs is wired in but untested (no key; API blocked from this sandbox).
2. **Research was snippet-based.** Primary sites (Google MLCC, d2l.ai, deeplearningbook.org, etc.) were blocked by the sandbox network. The episode deliberately uses no statistics, so nothing on screen depends on an unverified number. The access log in `research/` states exactly what was and wasn't read.
3. The music bed and SFX are procedurally synthesised: original and licence-free, but simpler than produced library music.
4. Captions are chunk-level (2–5 words), not word-by-word karaoke.
5. Fictional phone number / domain on screen (`+91 9XXXX XXX21`, `jeeto-abhi.xyz`) are masked or invented.

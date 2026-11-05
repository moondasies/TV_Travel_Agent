# EP01 audio

| File | What |
|---|---|
| `narration_final_24k.wav` | Final narrator track (mono, 24 kHz, 16-bit, peak −1 dBFS) exactly as used in the video |
| `phonemes.txt` | Phoneme dump for every chunk (pronunciation review record) |
| `voice-samples/*.wav` | First 3 lines read by each of the 4 available Hindi voices, so you can pick the series narrator |

## Narrator configuration (frozen for the series): `pipeline/tts/voice.json`
| Setting | Value |
|---|---|
| Provider | **Kokoro-82M v1.0** (open-weight, Apache-2.0 → commercial use OK), ONNX build from `thewh1teagle/kokoro-onnx` GitHub release |
| Voice | `hm_omega` (Hindi, male) |
| Language / G2P | `hi` via espeak-ng: Devanagari → Hindi phonemes; Latin-script English terms are switched to English phonemes automatically |
| Speed | 1.2 |
| Per-line synthesis | one pass per sentence (natural prosody), with model pad-silence trimmed to 60 ms and designed pauses added from `episode.json` (`gapAfter`) |
| Alignment | The ONNX graph is patched to also output the duration predictor's per-phoneme durations (`/encoder/Round_output_0`, 1 unit = 600 samples @ 24 kHz; verified `len(audio) == Σdur × 600`). Caption and SRT timings and all animation cues come from these real durations, not from text-length estimates. |
| Mix | 48 kHz stereo AAC 192 kbps, −14 LUFS integrated, ≤ −1.5 dBTP limiter, lo-fi bed ducked under voice |

## Why Kokoro and not ElevenLabs / Azure / Edge TTS
I evaluated these options against the environment available for this build:
- **ElevenLabs** (`eleven_multilingual_v2` handles Hinglish well and returns character timestamps): no API key was configured, and `api.elevenlabs.io` is blocked by this sandbox's network policy. A provider is **already implemented** in `synth.py` (`provider: "elevenlabs"`, `ELEVENLABS_API_KEY` env var, `/with-timestamps` alignment) but it is **untested**.
- **Microsoft Edge/Azure neural voices** (`hi-IN-MadhurNeural` etc.): the endpoint is blocked here. Edge's read-aloud API is also not licensed for commercial production.
- **Kokoro**: runs locally and deterministically, costs nothing, and its licence allows commercial use. It has 4 Hindi voices, and its duration predictor gives exact alignment.

**Honest quality note:** Kokoro's Hindi voices are rated grade C by their authors (less natural than its English voices, and well below ElevenLabs). **I could not listen to the audio in this sandbox.** Naturalness, pacing and pronunciation were checked only objectively (phonemes, clipping, silences, loudness), not by ear. Please listen to `voice-samples/` and the final video. If the voice isn't good enough, the fastest upgrade is ElevenLabs: set `provider: "elevenlabs"`, add a `voice_id` and the env key, then run `./produce.sh episodes/ep01-…`. Everything else re-times automatically.

## Pronunciation checks performed
1. Dumped phonemes for every chunk (`phonemes.txt`) and reviewed them.
2. Found 3 Hindi words where espeak inserted a spurious schwa and fixed them in the **series-wide lexicon** (respellings fed to the phonemiser; captions are unaffected):

| Word | Before | After |
|---|---|---|
| पहले (pehle) | pʌhəleː ("pa-ha-le") | pʌhleː |
| ढूँढती (dhoondhti) | ɖʰũnɖʰəti ("dhoondh-a-ti") | ɖʰũɖʰti |
| कहलाता (kehlaata) | kəhəlaːtaː | kəhlaːtaː |

3. English terms come out in British-English phonemes (e.g. *answers* /ˈansəz/, *zero* /ˈziəɹəʊ/), which are understandable to Indian listeners but not Indian-English. This is a known limitation.
4. The script avoids the ₹ symbol and numerals in spoken text (they're spelled out: दस लाख) to prevent the TTS reading digits.

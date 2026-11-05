# Bitu Universe — design system (v1)

*Working channel name. Rename freely; nothing in the pipeline depends on it.*
Machine-readable tokens: [`tokens.json`](tokens.json). Code: `pipeline/render/{engine,components,bitu}.js`.

## Identity in one line
A dark "night-study" canvas, lit by **meaning-coded neon**, where a small robot, **Bitu**, learns along with the viewer.

## Colour = meaning (never decorative)
| Token | Hex | Means | Used for |
|---|---|---|---|
| ink | `#0D0B1E` | canvas | background (with drifting dot grid + film grain) |
| violet | `#7C5CFF` | the machine | Bitu, transitions |
| lime | `#C6FF3D` | learning / correct / not-spam | highlighted terms, MODEL, "answers" |
| coral | `#FF5C7A` | error / spam / failure | stamps, broken rules, spam labels |
| cyan | `#3DE0FF` | data / examples | data boxes, example counters, links |
| sun | `#FFC83D` | curiosity / open question | "?" moments, next-episode hooks |
| cream | `#FFF6E9` | text | captions, body text |
| muted | `#A49FC8` | secondary | labels, footnotes |

A viewer who watches 3 episodes should learn the code: **coral = something's wrong, lime = something was learned.**
Each scene group also tints the background glow with its colour (hook violet → rule coral → data cyan → model lime → outro sun).

## Typography
- **Baloo 2 ExtraBold**: captions, titles. Rounded, friendly, designed by an Indian foundry (Ek Type) with Latin + Devanagari support, so it can carry Devanagari later.
- **Baloo 2 SemiBold/Bold**: UI labels, message text.
- **JetBrains Mono**: code, and any character-level trick (its dotted zero makes "L0TTERY" readable).
- All fonts are SIL OFL, bundled in `brand/fonts/`.

## Bitu (mascot)
- Rounded-rectangle violet head, dark face-screen, lime LED eyes, antenna whose light colour signals state (lime = learning, sun = curious, cyan = taking in data, coral = alert).
- Moods: `idle`, `curious` (one squinted eye, little "o" mouth), `happy` (^ ^ eyes), `scan` (scanning bar = processing data), `shock`.
- Always hovers (±8 px, 2.2 s sine) and never walks. Bitu is software, not a creature.
- **Brand rule:** Bitu is a metaphor for "the machine/model". Narration never says Bitu "thinks" or "understands". On-screen footnotes mark simplifications.
- Drawn 100% in code (`bitu.js`), so it is pixel-identical in every episode and costs nothing to re-pose.

## Layout & safe zones (1080×1920)
- **Header (y 108–172):** episode pill "EP NN · AI · zero se" + a 12-dot season progress map (series continuity).
- **Visual zone (y 170–1290):** all explanatory animation.
- **Caption zone (centre y ≈ 1395):** 78 px Baloo XB, cream with 14 px ink stroke, technical terms in **lime**, uppercase, 1–2 lines, max width 880.
- **y > 1520 kept free** for the YouTube Shorts / Instagram Reels UI (title, buttons, progress bar). Keep the right 60 px clear of critical content.

## Motion principles
1. **Every motion explains something.** No idle decoration except Bitu's hover and the background drift.
2. **Narration-locked.** Scene events are keyed to the TTS-aligned timeline (`build/timeline.json`), not to hand-typed timecodes.
3. **Pop in** (easeOutBack 0.35–0.45 s), **leave fast** (easeIn 0.25 s).
4. **Emphasis** = stamp (scale 2.4→1 + rotation + 12 px camera shake + thud).
5. **Scene change** = brand swipe: violet panel with lime leading/trailing stripes, 0.42 s, cut hidden at the midpoint, with a whoosh.
6. **Build equations piece by piece**, one box per spoken phrase (Mayer: segmenting/signaling).
7. **Concrete → abstract** inside each episode (real message → labelled cards → boxes → cube).

## Episode structure (≤45 s)
| Beat | Time | Purpose |
|---|---|---|
| Hook | 0–6 s | A relatable moment and a question (curiosity gap) |
| Old way / problem | 6–15 s | Show why the naive approach fails |
| Mechanism | 15–27 s | The new idea, animated |
| Reveal | 27–39 s | Proper terminology mapped onto the analogy |
| Takeaway + next hook | 39–45 s | Close the gap, open the next one |

## Voice
- One narrator for the series: **Kokoro-82M (Apache-2.0), voice `hm_omega` (Hindi male), speed 1.2, lang `hi`**, config frozen in `pipeline/tts/voice.json`.
- Text is fed as Hindi in Devanagari + technical English in Latin script. espeak-ng phonemises Hindi words natively and English words in English automatically (code-mixed Hinglish).
- Recasting (e.g. to ElevenLabs) is a deliberate one-time decision for the whole series. The provider hook already exists.

## Sound
All sounds are procedurally synthesised in `pipeline/audio/mix.py`: original, deterministic, licence-free.
Lo-fi 96 BPM bed (Am–F–C–G), ducked ~55% under the voice. SFX vocabulary: whoosh (scene), pop (element in), stamp (verdict), fail (buzz), ding (correct output), tick/typing, model (rising arpeggio).
Delivered at −14 LUFS integrated, ≤ −1.5 dBTP.

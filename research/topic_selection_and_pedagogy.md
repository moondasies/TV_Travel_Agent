# Pilot topic selection, learning outcome & teaching approach

## Chosen pilot: EP01 "Machine Learning kya hai? — Rules vs Examples"

**One learning objective:** after 45 seconds a complete beginner can explain the difference between
*traditional programming* (a human writes rules, the computer applies them to data) and *machine learning*
(we give data **plus** the correct answers, and the machine learns the patterns itself). They can also name what
gets learned: a **model**.

### Why this topic (and not "What is AI?", ChatGPT, or neural networks)

| Criterion from the brief | How EP01 meets it |
|---|---|
| Beginner can understand | Needs zero maths or code. Everyone in India has had a "Congratulations, you won ₹10 lakh" SMS. |
| Fundamental | It is the idea every later episode depends on: features and labels, training vs inference, loss, gradient descent, neural nets and LLMs are all "learning from examples". Starting with "What is AI?" gives a definition with no mechanism. Starting with ChatGPT or neural nets would skip the base concept. |
| Strong visual storytelling | A clear 3-act conflict: a rule works → a scammer swaps O for 0 and the rule breaks → ML flips the approach. The core diagram (rules+data→answers vs data+answers→patterns) animates well. |
| Fits in 45 s | One contrast, one example, one new term (*model*). |
| Makes viewers want EP02 | It ends on an open question it deliberately does not answer: "machine *seekhti* kaise hai?" (how does learning actually happen?), which EP02 answers. |
| Establishes the channel identity | It introduces Bitu (our "machine" mascot), the colour semantics (coral = error/spam, lime = learning/correct, cyan = data) and the swipe transition. |

### Intended learning outcomes (checkable)
1. A viewer can say why hand-written rules break: the world changes faster than humans can write rules.
2. A viewer can state the flip: ML = data + answers in, patterns out.
3. A viewer knows the word **model** = the learned pattern, used on *new* messages it has never seen.
4. Not claimed: that ML is magic or can't be fooled. The on-screen footnote says the "patterns" are really numbers (weights), which sets up later episodes.

### Accuracy decisions (from `sources_and_verification.md`)
- We say **patterns**, not "rules", for what ML learns. The research showed "learned rules" is a simplification, so an on-screen footnote says *"simplified: asal mein yeh patterns numbers (weights) hote hain"*.
- We **don't** claim ML can't be fooled (learned filters can also be attacked by obfuscation and label poisoning). The script claims only that hand-written rules can't keep up.
- The "SPAM · 97%" output is an illustrative confidence score, not a real benchmark number.
- No statistics are spoken or shown in the pilot, because every number found (Truecaller, Paul Graham) could only be read from search snippets. That makes the video robust without blocking on verification.

## Teaching approach (how research shaped the format)

| Finding | Source (see access log) | Applied in EP01 |
|---|---|---|
| Shorter, enthusiastic, personal videos hold attention better | Guo, Kim & Rubin 2014 (MOOC data; directional only) | 43.9 s; fast but clear narration (speed 1.2); direct "tum/aap" address |
| Curiosity comes from a felt information gap | Loewenstein 1994 | First 6 s: phone flags spam → "Par yeh sikhaya kisne?" The gap is closed at 38 s. A new gap opens at the end for EP02. |
| Coherence: one example, no tangents | Mayer | Spam SMS is the only example, start to finish |
| Signaling | Mayer | The 0 gets a coral highlight; terms are lime in captions; colour = meaning |
| Redundancy: don't duplicate narration as paragraphs of text | Mayer | On-screen labels are 1–3 words; full words appear only in the caption bar |
| Segmenting / one concept per episode | Mayer | Equations are built one box per spoken phrase |
| Concreteness fading | Fyfe et al. 2014 | Real SMS (concrete) → labelled stream of SMS (semi-abstract) → equation boxes (abstract) → MODEL cube |
| Personalisation, conversational style | Mayer | Hinglish, desi examples ("Mummy: Khana kha liya?") |

### Technique study of reference creators
This is from Claude's own knowledge of their published work. Their channels were not reachable from the build
sandbox, so none were re-watched for this project.
- **3Blue1Brown**: animate the *mechanism*, not decoration, and let visuals carry the proof. → Every scene in EP01 shows the mechanism being said.
- **StatQuest**: break one idea into tiny steps, repeat the key term, and leave a running "bam" moment. → Each equation box lands on its own beat. The MODEL reveal is the payoff.
- **Fireship**: high density, dry humour, zero filler. → No intro sting, the hook in under 1 s, and a joke ("INBOX (safe?!)").
- **Branch Education / Computerphile**: one concrete artefact explored deeply. → The single SMS.
- **What we avoid:** their look and voices. Bitu, the palette, the swipe and the caption style are original.

## Hinglish decision
The brief's update asked for Hinglish. The narration is Hindi-English code-mixed: Hindi carries the grammar and
emotion, English carries every technical term exactly as the viewer will meet it later (*Machine Learning, examples,
patterns, data, answers, model*). That way learners don't have to re-learn vocabulary when they move on to English
resources. Captions use Roman-script Hinglish, the way Gen Z actually types. The TTS is fed Devanagari for the Hindi
words so pronunciation is native (see `episodes/ep01-…/audio/README.md`).
The research found no data on Hinglish learning outcomes, so this rests on audience fit, not on an efficacy claim.

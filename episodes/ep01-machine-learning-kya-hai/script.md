# EP01 — Machine Learning kya hai? (Rules vs Examples): script

**Duration:** 43.7 s · **Language:** Hinglish (Hindi grammar, English technical terms) · **Narrator:** Kokoro `hm_omega`
**Learning objective:** Traditional programming = rules + data → answers. Machine Learning = data + answers → learned patterns = **model**.
**Source of truth:** [`episode.json`](episode.json) (caption text ↔ spoken text, pauses). Times below are the *actual* aligned times from `build/timeline.json`.

| Time | Beat | Narration (caption, Roman Hinglish) | Spoken to TTS | English meaning | Visual direction |
|---|---|---|---|---|---|
| 0.31–2.98 | Hook | Message aaya: "Aapne 10 lakh jeete!" | Message आया: आपने दस लाख जीते! | A message arrived: "You won 10 lakh!" | Phone rises; scam SMS bubble pops in with a ding |
| 3.19–6.69 | Hook / gap | Phone ne turant bola: **SPAM**. Par yeh sikhaya kisne? | फ़ोन ने तुरंत बोला: spam. पर यह सिखाया किसने? | The phone instantly said: SPAM. But who taught it that? | SPAM stamp slams (shake + thud); phone slides left; Bitu pops up with a "?" |
| 7.00–11.35 | Old way | Pehle programmers **rules** likhte the: message mein "lottery" hai, toh spam. | पहले programmers rules लिखते थे: message में lottery है, तो spam. | Earlier, programmers wrote rules: if the message has "lottery", it's spam. | Code card types `if "lottery" in message: return "SPAM"` in sync; test message → SPAM ✓ |
| 11.55–15.10 | Problem | Scammers ne O ki jagah zero likh diya... rule fail. | Scammers ने O की जगह zero लिख दिया... rule fail. | Scammers wrote zero instead of O… the rule fails. | O morphs into a coral 0; verdict "INBOX (safe?!)"; card cracks, FAIL stamp; 6 more spelling variants burst out |
| 15.69–18.29 | Flip | **Machine Learning** ulta kaam karta hai. | Machine Learning उल्टा काम करता है। | Machine Learning works the other way round. | Big title; a pill flips upside-down: "RULES likho → answers lo" becomes "EXAMPLES do → khud seekho"; Bitu cheers |
| 18.47–21.97 | Mechanism | Rules nahi — hazaaron **examples**: yeh spam, yeh nahi. | Rules नहीं, हज़ारों examples: यह spam, यह नहीं। | Not rules: thousands of examples. This is spam, this isn't. | Labelled cards stream into Bitu (scan face); counter climbs to 10,000+; two held examples (SPAM / NOT SPAM) |
| 22.16–26.63 | Mechanism | Machine khud **patterns** dhoondhti hai: ajeeb links, "urgent", paison ka laalach. | Machine ख़ुद patterns ढूँढती है: अजीब links, urgent, पैसों का लालच। | The machine finds patterns itself: weird links, "urgent", money bait. | Stream fades; "PATTERNS" title; three coral pattern chips emerge from Bitu one per phrase; footnote: *simplified: patterns are really numbers (weights)* |
| 26.91–30.41 | Reveal 1 | Programming mein: **rules** plus **data** do, **answers** milte hain. | Programming में: rules plus data दो, answers मिलते हैं। | In programming: give rules plus data, you get answers. | Row 1 boxes pop one per word: RULES + DATA → ANSWERS |
| 30.62–35.45 | Reveal 2 | Machine Learning mein: **data** plus **answers** do, **patterns** machine khud seekhti hai. | Machine Learning में: data plus answers दो, patterns machine ख़ुद सीखती है। | In ML: give data plus answers, and the machine learns the patterns itself. | Row 2: DATA +, the ANSWERS box *flies down from row 1 into the input side* (the flip made literal) → PATTERNS (lime, filled) |
| 35.65–38.58 | Term | Yeh seekha hua pattern kehlata hai... **MODEL**. | यह सीखा हुआ pattern कहलाता है... model. | This learned pattern is called… a MODEL. | Rows fade; PATTERNS box flies to centre, lime flash, morphs into a glowing MODEL cube |
| 38.58–39.86 | (no VO) | — | — | — | A NEW, never-seen message "KYC update karo, warna block!" drops into the cube → "SPAM · 97%" (inference/generalisation) |
| 39.86–43.23 | Next hook | Par machine seekhti kaise hai? Agle episode mein! | पर machine सीखती कैसे है? अगले episode में! | But how does the machine learn? Next episode! | Swipe; Bitu curious with orbiting "?"; "NEXT · EP 02" pill; "Follow karo — series yahin se shuru" |

## Technical terminology introduced
| Term | How it's defined in-video | Depth level |
|---|---|---|
| Machine Learning | Learning patterns from examples + answers, instead of hand-written rules | intuition |
| rules (traditional programming) | human-written if-then logic | intuition |
| examples / data | many messages | intuition (features: EP04) |
| answers | the spam / not-spam tags (*labels*: the formal word comes in EP05) | intuition |
| patterns | what the machine extracts; footnote says they're really numbers (weights) | intuition (parameters: EP03) |
| **model** | "yeh seekha hua pattern", the thing then used on new messages | intuition, the core new term |

## Technical validation
- ✅ Spam filtering is a standard supervised classification example (GMLCC framing; DLB ch.1). See `research/sources_and_verification.md` §2.1.
- ✅ Rules + data → answers vs data + answers → learned "rules" is a standard framing (Chollet, *Deep Learning with Python* ch.1). We say "patterns" rather than "rules", and add the weights footnote (§2.4).
- ✅ Keyword rules are brittle against character substitution (§2.2). ⚠️ We deliberately do **not** say ML is immune; learned filters are also attacked.
- ✅ A model is applied to unseen inputs (inference): shown with a new KYC message.
- ⚠️ "Hazaaron examples": real spam filters train on far more (millions). "Thousands" is a floor, not a claim about any system.
- ⚠️ "SPAM · 97%" is an illustrative model score, not a measured value.
- Not covered on purpose (reserved for later episodes): labels/features as terms, how training adjusts numbers, evaluation, the risk of false positives.

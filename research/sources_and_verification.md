# Sources & Verification — Pilot: "What is Machine Learning?" (spam-filter example)

Research date: 2026-11-05. Prepared for the 45-sec Hinglish AI/ML shorts series.

## Honesty note on method (read first)

- **WebFetch failed for every host tried** (developers.google.com, d2l.ai, deeplearningbook.org, paulgraham.com) with DNS "ENOTFOUND", i.e. those domains are blocked by this session's network allowlist. After those failures, no more direct fetches were attempted.
- **All findings below come from WebSearch result summaries/snippets** (search-engine extracts of the pages), not from reading full pages. "Snippet" in the table = search engine surfaced text from that URL; I did not open the page myself.
- Before any of this is used in a public script or caption, someone with normal web access should open the primary URLs and confirm wording. That matters most for numbers.

## 1. Access log

| Source | URL | Accessed? | What was used |
|---|---|---|---|
| Google MLCC: Framing / ML terminology | https://developers.google.com/machine-learning/crash-course/framing/ml-terminology | Snippet only (fetch blocked) | Spam example: labels = user-marked spam/not spam; features = words, sender address, time sent; labeled vs unlabeled examples; classification |
| Google MLCC framing spam exercise | https://developers.google.com/machine-learning/crash-course/MCE/mc-il-framing-spam | Snippet only | Note that user labels are noisy and spammers can poison labels |
| Google Intro to ML (what-is-ml, supervised) | https://developers.google.com/machine-learning/intro-to-ml/what-is-ml | **Not accessed** (DNS blocked; nothing in search) | none |
| d2l.ai Ch.1 Introduction | https://d2l.ai/chapter_introduction/index.html | Fetch blocked; snippets via arXiv mirror https://arxiv.org/pdf/2106.11342 and Cambridge excerpt https://assets.cambridge.org/97810093/89433/excerpt/9781009389433_excerpt.pdf | Wake-word example; "programming with data"; flexible program with parameters tuned on labeled data |
| Deep Learning book (Goodfellow et al.) Ch.1 | https://www.deeplearningbook.org/contents/intro.html | Fetch blocked; snippets from lecture slides reproducing Ch.1 (https://mnassar.github.io/deeplearninghandbook/slides/01_intro.pdf, https://aykuterdem.github.io/classes/comp541.f24/slides/lec1-introduction.pdf) | Fig 1.4 Venn: AI ⊃ ML ⊃ representation learning ⊃ deep learning; naive Bayes separating legitimate vs spam email |
| udlbook (Prince) | https://udlbook.github.io/udlbook | **Not accessed** (only aggregator snippets) | Confirmed only that Ch.2 is "Supervised learning" and book is free online; no definitions used |
| MML book | https://mml-book.github.io | **Not accessed** (only a KDnuggets list mentioning it) | nothing substantive |
| Stanford CS229 | https://cs229.stanford.edu | **Not accessed** | nothing |
| fast.ai course | https://course.fast.ai | **Not accessed** | nothing |
| Hugging Face Learn | https://huggingface.co/learn | **Not accessed** | nothing |
| Arthur Samuel 1959 | https://en.wikipedia.org/wiki/Arthur_Samuel_(computer_scientist); https://www.fermatslibrary.com/s/some-studies-in-machine-learning-using-the-game-of-checkers; https://michalbrennek.github.io/research/people/Samuel.html | Snippets only | Attribution dispute (see Definitions) |
| Tom Mitchell 1997 | https://www.kdnuggets.com/2018/10/mitchell-paradigm-concise-explanation-learning-algorithms.html (+ secondary book excerpts) | Snippets only | T/P/E structure; chess example |
| Paul Graham "A Plan for Spam" (2002) | https://paulgraham.com/spam.html | Fetch blocked; snippet only | Bayesian filter result on his own mail |
| Paul Graham "Better Bayesian Filtering" (2003) | https://paulgraham.com/better.html (URL inferred from search summary; not opened) | Snippet only | 99.5% / <0.03% FP figures |
| Chollet, *Deep Learning with Python* ch.1 | https://www.perlego.com/book/1469354/deep-learning-with-python-pdf (excerpt) | Snippet only (secondary excerpt) | Rules+data→answers vs data+answers→rules; "trained rather than explicitly programmed" |
| IBM ML explainer | https://www.ibm.com/think/machine-learning | Snippet only | ML = subset of AI learning patterns from training data; DL subset of ML |
| Spam obfuscation literature | https://trec.nist.gov/pubs/trec15/papers/tuftsu.spam.final.pdf; https://www.virusbulletin.com/virusbulletin/2006/03/fighting-spam-data-compression-models/; https://www.ijimai.org/index.php/ijimai/article/view/340 | Snippets only | Misspelling/char substitution as known attack on word-based filters |
| Guo, Kim & Rubin 2014 | https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf ; https://pg.ucsd.edu/publications/edX-MOOC-video-production-and-engagement_LAS-2014.txt | Snippets only | 6.9M sessions, 4 edX courses; short videos, enthusiasm/speaking rate, Khan-style, personal feel |
| Mayer multimedia principles | https://ugc.futurelearn.com/uploads/files/7d/d6/7dd6188d-c343-4311-b064-ac98d2c95abc/Multimedia_Principles._R._E._Mayer__2020.pdf ; https://lucidea.com/blog/mayers-12-principles-of-multimedia-learning | Snippets only | Principles list (see Pedagogy) |
| Loewenstein 1994 | https://stafforini.com/works/loewenstein-1994-psychology-curiosity-review/ | Snippet (abstract) | Information-gap theory |
| Concreteness fading | https://www.doi.org/10.1007/S10648-014-9249-3 ; https://pcl.sitehost.iu.edu/rgoldsto/courses/cogscilearning/McNeilFyfe12.pdf | Snippets only | Concrete → gradually abstract |
| Truecaller 2025 India report (press coverage) | https://www.businesstoday.in/india/story/indians-received-over-4000-crore-spam-calls-in-2025-1189-crore-blocked-report-515765-2026-02-11 ; https://www.deccanherald.com/technology/truecaller-report-india-hit-by-4168-crore-spam-calls-in-2025-3896311 | Snippets only | Spam call/SMS volumes (see India) |
| TRAI 2025 crackdown (press) | https://www.deccanherald.com/india/trai-spam-crackdown-7-lakh-notices-56-lakh-curbs-on-telemarketers-in-2025-3987342 | Snippet only | Notices / disconnections |
| Hinglish growth study (2024) | https://www.nature.com/articles/s41599-024-03058-6.pdf | Snippet only | Hinglish growth on Twitter 2014–2022 |

## 2. Key technical facts — verification

| # | Claim | Status | Basis |
|---|---|---|---|
| 1 | Spam filtering is a canonical supervised classification example (labels spam / not spam) | **VERIFIED** (via snippet of primary source) | Google MLCC framing page uses exactly this: emails users marked "spam"/"not spam" as labels; spam-or-not as a classification question. DL book Ch.1 (via slides) also uses naive Bayes spam separation as a motivating example. https://developers.google.com/machine-learning/crash-course/framing/ml-terminology |
| 2 | Hand-written keyword rules are brittle against obfuscation; learned filters generalize better | **PARTLY** | Obfuscation (deliberate misspelling / character substitution) is a documented attack on word-based filters (TREC 2006 Tufts paper; Virus Bulletin 2006). Graham reports his learned Bayesian filter beat what he got from hand-built approaches (his 2002 essay; numbers below). BUT: the sources also show *learned token-based* filters are themselves fooled by obfuscation, needing char n-grams / deobfuscation. So "ML adapts better because it can be retrained on new examples and learns many weak signals" is fair; "ML is immune to l0ttery" is NOT. |
| 3 | Supervised training data = examples with features + labels | **VERIFIED** (snippet) | Google MLCC: labeled example = features + label; model then predicts labels on unlabeled examples. d2l (arXiv mirror): dataset of labeled audio snippets. |
| 4 | A trained model is the learned mapping/function from inputs to outputs, not literally human-readable rules | **PARTLY** | d2l describes a flexible program whose behavior is set by parameters tuned on data (supports "learned function with numbers inside"). Chollet's framing literally says "out come the rules", so if you use that diagram add the nuance that the "rules" are numeric parameters/patterns. IBM snippet notes deep learning is less interpretable than classical ML. No single fetched source states "not human-readable" verbatim. |
| 5 | ML ⊂ AI; DL ⊂ ML | **VERIFIED** (snippets) | Goodfellow et al. Fig 1.4 (reproduced in course slides); IBM Think ML guide. Note the book adds a middle ring (representation learning). |

Extra numbers seen (Paul Graham, via search snippet only — confirm on page before quoting):
- *A Plan for Spam* (Aug 2002): on his own mail corpus, filter missed fewer than 5 per 1,000 spams with 0 false positives.
- *Better Bayesian Filtering* (Jan 2003): ~99.5% caught, <0.03% false positives.
- Caveat: personal mailbox tests, not a benchmark. The snippet also says he argues that a false positive (real mail lost) is much worse than a missed spam.

## 3. Definitions

**Arthur Samuel (1959)**: the popular line ("field of study that gives computers the ability to learn without being explicitly programmed") is **not verified as verbatim from Samuel's 1959 IBM paper**. One secondary source says it is a paraphrase that does not appear in the paper. The paper's real sentence is about programming a computer to play better checkers than the person who wrote the program. Other sites (Fermat's Library, Wiktionary) repeat the attribution without showing the text. **Script guidance:** say "Arthur Samuel ke idea ko aksar aise summarize kiya jaata hai…", or skip the attribution. Do not put it in quote marks as his words.

**Tom Mitchell (1997, *Machine Learning*, McGraw-Hill)**: a program learns from experience E for tasks T, measured by P, if its performance on T (as measured by P) improves with E. Spam mapping for the video: T = label messages spam/not-spam; P = % classified correctly (or spam caught without blocking real messages); E = lots of messages people have already labeled. Exact wording not checked against the book (snippets only).

**Chollet (*Deep Learning with Python*, ch.1)**: classical/symbolic programming means humans give rules + data and get answers. ML means humans give data + expected answers and get rules, which are then applied to new data. The system is "trained rather than explicitly programmed". Seen only through an ebook-site excerpt, so paraphrase it and credit Chollet for the framing. Do not reproduce his figure.

**Working definition for the episode** (our own wording): ML means a computer finds patterns from lots of labeled examples instead of a person writing every rule. The "model" is the pattern-finder it ends up with: a function full of tuned numbers that takes a new message and outputs spam / not spam.

## 4. Pedagogy findings → application to 45-sec Hinglish shorts

**Guo, Kim & Rubin (2014, ACM Learning@Scale)**: 6.9M video sessions across 4 edX courses (snippet). Reported findings (from summaries): shorter videos were more engaging; faster, more enthusiastic speaking engaged more (speaking rate and enthusiasm are correlated but not the same thing); Khan-style hand-drawn tutorials beat slides; a more personal, informal feel helped. The "≤6 minutes" guideline appears in summary slides; I did not confirm the exact threshold in the paper text.
→ Apply: 45 s is well inside the guideline. Use an energetic, fast-but-clear delivery, draw or annotate on screen (the spam message gets "circled"), and talk to one viewer directly. Caveat: the study measured MOOC watch time, not short-form vertical video or learning gains.

**Mayer's multimedia principles** (2nd ed. groups them as reducing extraneous / managing essential / fostering generative processing; the 2020 list has 15):
- *Coherence*: cut extra material → one example only (spam), no side tangents.
- *Signaling*: highlight what matters → flash "l0ttery" with a red box; show the arrows in the "rules+data → answers" vs "data+answers → rules" diagram.
- *Redundancy*: avoid on-screen text that repeats the narration word for word alongside graphics → use short keyword captions rather than a full transcript. (Shorts usually need captions for sound-off viewers. Keep them, but make them crisp.)
- *Segmenting*: chunk content → one concept per episode; within 45 s use 3 beats (problem → rule breaks → ML flips it).
- *Pretraining*: teach key names first → introduce the words "label" and "model" briefly before the flip diagram, or save them for episode 2.
- *Personalization*: conversational style beats formal → Hinglish "tu/aap" direct address fits.
- *Modality*: narration + visuals beats printed text + visuals (with an expertise-reversal caveat).
- Caveat: the numbering and wording of the principles differs between secondary sources.

**Loewenstein (1994, Psychological Bulletin 116(1):75–98)**: curiosity arises when people notice a gap in what they know, and they are motivated to close it. Popular write-ups add that the gap should be neither too small nor too large, and that learners need some starting knowledge.
→ Apply: open with a gap in the first 2–3 s, e.g. "Spam filter ko 'lottery' pakadna aata hai… phir 'l0ttery' kaise nikal gaya?". Close the gap by the end so the payoff lands.

**Concreteness fading (Fyfe, McNeil, Son & Goldstone 2014, Educ. Psych. Review; McNeil & Fyfe 2012)**: start concrete and fade explicitly and gradually to the abstract. In the reported studies this helped transfer more than concrete-only teaching. The evidence is mostly from maths/science.
→ Apply: real-looking SMS (concrete) → a pile of labeled SMS tagged spam / not-spam (semi-abstract) → the "data + answers → model" diagram (abstract). No source was found that tests analogies specifically. The analogy angle is our design choice, not something the evidence covers.

## 5. India context

**Spam/scam prevalence (snippets of press coverage; primary report not opened):**
- Truecaller 2025 India Insights (reported Feb 2026): ~4,168 crore (41.68 bn) spam calls flagged in 2025; 1,189 crore blocked by users; ~770 crore fraud calls detected; **over 12,903 crore spam SMS identified**. About 66% of unknown calls to Truecaller users in India were spam, which puts India 5th most spam-affected. These are estimates from one app's user base, not official totals. Sources: businesstoday.in and deccanherald.com URLs in the access log; https://wionews.com/trending/41-68-billion-spam-calls-in-india-66-per-cent-of-unknown-numbers-on-truecaller-were-spam-whatever-happened-to-do-not-disturb-1778144364126
- TRAI 2025 enforcement (press): 7.31 lakh+ notices; 89,936 repeat offenders barred for up to 6 months; 184,482 telecom resources disconnected; DND app installs +84.43% YoY. Source: deccanherald.com TRAI crackdown URL.
- Unconfirmed: complaint counts attributed to TRAI (13.62 lakh in 2023 → 19.38 lakh in 2024 → 31.09 lakh in 2025) appeared only in a Kerala Kaumudi piece (https://keralakaumudi.com/en/news/news.php?id=1730287). I could not trace the primary source, so **do not use**.
- Safe on-screen line: "India mein 2025 mein Truecaller ne 12,000 crore+ spam SMS pakde (Truecaller report)". Use only after opening the report or a reputable article to confirm.

**Hinglish:**
- A 2024 *Humanities & Social Sciences Communications* (Nature portfolio) study of Twitter found Hinglish usage grew steadily 2014–2022 (~1.2% annualized growth in the Hinglish-using population per snippet). Code-mixing is described as a dominant conversational mode for Hindi speakers online and offline. https://www.nature.com/articles/s41599-024-03058-6.pdf
- **No credible data was found on Hinglish use in Indian edtech/YouTube or on its learning outcomes.** Do not claim "most Indian learners prefer Hinglish" without a source. A fair framing is that Hinglish is common in Indian social media and entertainment.

## 6. Caveats

1. Every source was accessed only through search snippets. Primary pages were blocked (developers.google.com, d2l.ai, deeplearningbook.org, paulgraham.com) or not reached (udlbook, mml-book, cs229, course.fast.ai, huggingface.co/learn, Google intro-to-ml). Re-verify before publishing, especially numbers and quotes.
2. Do not imply ML filters "can't be fooled". Spammers also attack learned filters through obfuscation and label poisoning (Google MLCC notes poisoning). The honest pitch is that ML learns from many examples and can be retrained as scams change.
3. "Data + answers → rules" is a simplification. The learned "rules" are numeric parameters, not if-else lines a human could read. Add a 1-line nuance or a visual (rules shown as a "black box of numbers").
4. The Samuel quote is a disputed paraphrase. Mitchell's exact wording is unverified here.
5. Guo et al. studied MOOC videos (watch time), not 45-s vertical shorts. Treat it as directional evidence.
6. Truecaller numbers are company estimates from its own users and cover calls+SMS in different ways. Do not compare them with TRAI complaint figures.
7. No verbatim passages are copied above beyond short phrases; everything is paraphrased.

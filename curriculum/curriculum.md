# Bitu Universe — AI/ML from zero: curriculum (v1)

64 numbered slots, about 70 episodes (slots 62–64 are 3-part mini-arcs), in 7 planned seasons, with Season 8 to be
planned from audience feedback. Each episode is ≤45 s with exactly one learning objective, and each builds on the one
before it. Watched in order, the series takes a beginner from "what is a model" to how LLM agents work and how
real AI systems are shipped.

**Design principles**
- **Intuition → mechanism → maths.** Every hard idea gets an intuition episode first, then a mechanism episode. Formal notation appears only in Season 3 and later, and always after its picture.
- **One running example per season**, so viewers never pay context-switching costs (S1 spam SMS, S2 house rent prices in a city, S3 a hill to walk down, S4 recognising chai vs coffee photos, S5–6 texting/autocomplete, S7 a study-buddy agent).
- **Recap cards:** every 8th episode is a 45-s "map" episode that connects the season.
- **Prerequisites are explicit**, so a viewer who lands mid-series is told which episode to watch first (pinned comment).
- **Misconceptions are named** in the episode where they are most likely to form.

Reference keys: **GMLCC** Google ML Crash Course · **100P** Burkov, The Hundred-Page ML Book · **HOML** Géron, Hands-On ML · **DLB** Goodfellow et al., Deep Learning · **UDL** Prince, Understanding Deep Learning · **D2L** Dive into Deep Learning · **LLMS** Raschka, Build an LLM from Scratch · **AIMA** Russell & Norvig · **MML** Mathematics for ML · **CS229/231n/224N** Stanford · **HF** Hugging Face Learn · **IT** Alammar, Illustrated Transformer · **3B1B** 3Blue1Brown · **SQ** StatQuest · **Paper** = the original paper named in the row.
(These are planning references. Each episode's research pass verifies the claims it actually makes before scripting, as was done for EP01.)

---

## Season 1 — "Machine kaise seekhti hai?" (Foundations) · running example: spam SMS

| # | Topic | Prerequisite | Learning objective | Real-world example | Visual idea | Misconception to avoid | Refs | → Next |
|---|---|---|---|---|---|---|---|---|
| 1 ✅ PILOT | What is ML? Rules vs examples | none | ML = data + answers → learned patterns (model); rules = human-written | Spam SMS filter | Rule card cracks on "l0ttery"; equation flip; MODEL cube | "ML learns readable if-else rules" / "ML can't be fooled" | GMLCC framing; DLB ch1; D2L ch1 | "How does it *learn*?" |
| 2 | How learning happens: guess → check → adjust | 1 | Learning = repeatedly adjusting to reduce mistakes | Spam filter getting better week by week | Bitu turns a knob; a mistake counter drops | "The machine understands like a human" | GMLCC; 100P ch1 | "What exactly gets adjusted?" |
| 3 | What is a model? | 2 | A model = a function with adjustable numbers (parameters) | Rent = f(size, area) | A machine box with dials; input → output | "Model = the data" or "model = the app" | 100P; HOML ch1 | "What goes in?" |
| 4 | Features | 3 | Features = the measurable clues we feed in | Links, word count, sender unknown? | Message dissected into labelled chips | "More features is always better" | GMLCC | "And the answers?" |
| 5 | Labels | 4 | Labels = the correct answers attached to examples | Users tapping "Report spam" | Stickers on cards; unlabelled pile vs labelled pile | "Labels are always correct" (noisy labels) | GMLCC | "Learning vs using" |
| 6 | Training vs inference | 5 | Training = learning from labelled data; inference = using the model on new data | Filter trained in the lab, used on your phone | Gym (training) vs match day (inference) | "The model keeps learning every time you use it" | GMLCC; HF | "Different kinds of learning" |
| 7 | Algorithm vs model | 6 | The algorithm is the recipe for learning; the model is what it produces | Recipe vs the cake | Recipe card → oven → cake | Using the words interchangeably | 100P; HOML | "3 ways to learn" |
| 8 | MAP: the ML pipeline | 1–7 | Recall data → features → labels → train → model → inference | Whole spam pipeline | Metro map of S1 stations | — | — | Season 2 |

## Season 2 — "Kis type ki learning?" (ML fundamentals) · running example: rent prices + a music app

| # | Topic | Prereq | Objective | Example | Visual | Misconception | Refs | → Next |
|---|---|---|---|---|---|---|---|---|
| 9 | Supervised learning | 5,6 | Learning with labelled answers | Spam / rent prediction | Teacher with answer key | "All ML is supervised" | GMLCC; 100P ch3 | Two kinds of answers |
| 10 | Regression | 9 | Predicting a number | Flat rent in Pune | Dots + line; slider moves | "Regression = only straight lines" | HOML ch4; SQ | Categories? |
| 11 | Classification | 9 | Predicting a category | Spam / not-spam; dog breeds | Sorting into bins | "Classifiers give certainty" (they give scores) | GMLCC | No labels? |
| 12 | Unsupervised learning & clustering | 4 | Finding groups without labels | Music app grouping listeners | Dots drift into colour clusters | "Clusters have built-in meanings" | 100P ch9; HOML ch9 | Learning by reward |
| 13 | Reinforcement learning (intro) | 6 | Learning from rewards via trial and error | Game-playing bot | Bitu in a maze, + / − points | "RL needs labelled answers" | AIMA ch22; Sutton&Barto | Simple models |
| 14 | Decision trees | 11 | A model as a series of yes/no questions | Loan approval | A growing tree | "Trees are always interpretable" (deep ones aren't) | HOML ch6; SQ | One tree overfits… |
| 15 | Random forests | 14 | Many trees vote → more stable | Crowd guessing jar of sweets | Forest votes | "More trees = memorises more" | HOML ch7; SQ | How good is it? |
| 16 | Train / validation / test split | 6 | Hold out data to check honestly | Practice tests vs board exam | Deck split into 3 piles | "Testing on training data is fine" | GMLCC; HOML ch2 | Measuring mistakes |
| 17 | Evaluation: accuracy, precision, recall | 11,16 | Accuracy can lie; precision/recall trade-off | Spam filter: block real OTP vs miss scam | Two nets catching fish | "99% accuracy = great model" (class imbalance) | GMLCC; SQ | Learning too much |
| 18 | Overfitting | 16 | Memorising ≠ learning | Rattafication before exams | Wiggly curve through every dot fails new dot | "Lower training error always better" | GMLCC; UDL ch8 | Learning too little |
| 19 | Underfitting & bias-variance (intuition) | 18 | Too simple also fails; aim for the sweet spot | Straight line through a curve | Goldilocks dial | "Bigger model always better" | HOML ch4; UDL | Better data? |
| 20 | Data quality & bias in data | 5,18 | Garbage in, garbage out; skewed data → skewed model | Face filter failing on darker skin | Funnel with polluted input | "Algorithms are neutral" | GMLCC fairness | Recap |
| 21 | MAP: choosing an ML approach | 9–20 | Map problem type → approach | 4 quick scenarios | Decision flowchart | — | — | Season 3 |

## Season 3 — "Maths, bina dar ke" (mathematical intuition) · running example: hiking down a hill

| # | Topic | Prereq | Objective | Example | Visual | Misconception | Refs | → Next |
|---|---|---|---|---|---|---|---|---|
| 22 | Vectors | 4 | A feature list is a vector, an arrow in space | Your Spotify taste as numbers | Arrow in 2D from (energy, sadness) | "Vectors are only physics" | MML ch2; 3B1B | Many vectors |
| 23 | Matrices | 22 | A table of vectors; a matrix transforms vectors | Class marks sheet | Grid that stretches space | "Matrix = just a table" | MML ch2; 3B1B | Similarity |
| 24 | Dot product & similarity | 22 | Dot product measures alignment | Two friends' music tastes | Arrows rotating; score meter | "Similar = equal" | MML ch3 | Uncertainty |
| 25 | Probability basics | 11 | Models output probabilities, not certainties | Weather "70% rain" | Bucket of coloured balls | "70% wrong if it doesn't rain" | MML ch6; SQ | Summaries of data |
| 26 | Mean, variance, distributions | 25 | Describing data spread | Exam marks spread | Histogram morphing to bell curve | "Average tells everything" | MML ch6 | Scoring mistakes |
| 27 | Loss functions | 2,10 | Loss = one number for "how wrong" | Darts distance from bullseye | Error bars squared and summed | "Loss = accuracy" | GMLCC; UDL ch5 | Which way to move? |
| 28 | Derivatives & slope | 27 | Slope tells direction and steepness | Feeling the slope with your feet | Tangent line sliding on curve | "Derivatives are just formulas" | 3B1B; MML ch5 | Many directions |
| 29 | Gradients | 28,22 | Gradient = slope in many directions at once | Hill in fog | 3D landscape arrows | "Gradient points downhill" (it points uphill) | MML ch5 | Walking down |
| 30 | Gradient descent | 29 | Step opposite the gradient to reduce loss | Hiker in fog | Ball rolling into valley | "Always reaches the best point" | GMLCC; D2L ch12 | Step size |
| 31 | Learning rate | 30 | Too big overshoots, too small is slow | Baby steps vs long jumps | Three hikers side by side | "Higher LR = faster learning always" | GMLCC | Recap |
| 32 | MAP: the learning loop in maths | 27–31 | predict → loss → gradient → update | Spam model training | Loop diagram + live loss curve | — | — | Season 4 |

## Season 4 — "Neural Networks" (deep learning) · running example: chai vs coffee photo classifier

| # | Topic | Prereq | Objective | Example | Visual | Misconception | Refs | → Next |
|---|---|---|---|---|---|---|---|---|
| 33 | Artificial neuron | 24,3 | Neuron = weighted sum + bias → activation | Deciding to go out (weather, friends, money) | Inputs flowing with thick/thin weights | "It's a copy of a brain neuron" | DLB ch6; UDL ch3 | Many neurons |
| 34 | Weights & biases | 33 | Weights = importance; bias = baseline nudge | Same decision, changed priorities | Dials on each wire | "Weights are set by hand" | UDL ch3 | Non-linearity |
| 35 | Activation functions | 33 | Non-linearity lets networks bend | ReLU as a gate | Line → bent line | "Activations are optional" | UDL ch3; D2L ch5 | Stacking |
| 36 | Neural network (layers) | 35 | Layers build features from simple to complex | Edges → shapes → cup | Layered nodes lighting up | "More layers always better" | 3B1B NN; DLB ch6 | Forward pass |
| 37 | Forward propagation | 36 | Data flows layer by layer to a prediction | One chai photo → "chai 82%" | Light pulse travelling | "The network 'looks' like we do" | D2L ch5 | How it learns |
| 38 | Backpropagation (intuition) | 30,37 | Blame for the error flows backward to each weight | Group project blame | Red pulse running backward | "Backprop is a different learning algorithm from GD" | 3B1B; UDL ch7 | Faster learning |
| 39 | Optimizers (SGD, momentum, Adam) | 38,31 | Smarter ways to step | Ball with momentum | Three balls racing down | "Adam always wins" | D2L ch12 | Images specifically |
| 40 | CNNs: convolutions | 37 | Small filters slide over images to find patterns | Edge detector on a photo | Torch sliding across image | "CNNs see whole objects at once" | CS231n; UDL ch10 | Sequences |
| 41 | RNNs & sequences | 37 | Memory across time steps (and its limits) | Predicting next word in a sentence | Conveyor with a backpack of memory | "RNNs remember everything" | D2L ch9 | Words as numbers |
| 42 | Embeddings | 22,24 | Learned vectors where meaning ≈ position | "chai" near "coffee", far from "cricket" | Words floating into clusters | "Embeddings are dictionaries" | D2L ch15; IT | Recap |
| 43 | MAP: anatomy of a deep net | 33–42 | Assemble the full training picture | Chai/coffee classifier end-to-end | Exploded diagram | — | — | Season 5 |

## Season 5 — "ChatGPT andar se" (Generative AI & LLMs) · running example: phone keyboard autocomplete

| # | Topic | Prereq | Objective | Example | Visual | Misconception | Refs | → Next |
|---|---|---|---|---|---|---|---|---|
| 44 | What is Generative AI? | 11,25 | Generative models produce new samples from learned patterns | Image + text generators | Classifier "judges" vs generator "creates" | "It copies & pastes training data" | UDL ch1; HF | Pieces of text |
| 45 | Tokens & tokenization | 44 | Text is split into tokens (often sub-words) | "unbelievable" → un/believ/able; Hinglish splits oddly | Sentence breaking into coloured blocks | "1 token = 1 word" | LLMS ch2; HF | Tokens → numbers |
| 46 | Token embeddings & position | 42,45 | Each token becomes a vector + its position | "dog bites man" vs "man bites dog" | Blocks get coordinates + seat numbers | "Order doesn't matter to models" | LLMS ch2 | Which words matter? |
| 47 | Attention (intuition) | 46 | Each token looks at others to decide what matters | "bank" in river vs money sentence | Spotlights between words | "Attention = human attention/understanding" | IT; D2L ch11 | Self-attention |
| 48 | Self-attention (Q, K, V) | 47,24 | Queries match keys to mix values | Library search: query, index, book | Three-coloured arrows; dot-product scores | "Q/K/V are separate inputs" | IT; LLMS ch3; Paper: Vaswani 2017 | Stack it |
| 49 | Transformer block | 48,36 | Attention + feed-forward + residuals, stacked | — | Lego tower of blocks | "Transformers = only for text" | IT; D2L ch11 | What it's trained to do |
| 50 | Next-token prediction | 45,49 | LLMs predict a probability for the next token | Keyboard autocomplete, scaled up | Probability bars, sampling a token | "It retrieves stored answers" | LLMS ch4–5 | Learning from the internet |
| 51 | Pretraining | 50,6 | Self-supervised learning on huge text | Fill-in-the-blank at scale | Library pouring into model | "Pretrained = knows facts reliably" | LLMS ch5; HF | Teaching manners |
| 52 | Fine-tuning & instruction tuning (+RLHF intro) | 51,13 | Adapting a base model to tasks and preferences | Base model vs chat assistant | Raw clay → shaped pot | "Fine-tuning adds unlimited new knowledge" | LLMS ch6–7; Paper: Ouyang 2022 | Using it |
| 53 | Inference, temperature & sampling | 50 | Same prompt, different outputs; temperature controls randomness | Writing a poem twice | Dice weighted by probabilities | "Temperature = intelligence" | HF | Memory limits |
| 54 | Context windows | 45,53 | The model only "sees" a limited number of tokens | Long chat forgetting the start | Sliding window over a scroll | "The model remembers past chats by itself" | vendor docs (verify current numbers) | Making things up |
| 55 | Hallucinations | 50,54 | Fluent ≠ true: the model predicts likely text, not checked facts | Fake citations | Confident Bitu with a wobbly bridge | "Hallucinations are bugs that will just disappear" | Paper: Ji 2023 survey | Fix: give it sources |
| 56 | MAP: how ChatGPT-style models work | 44–55 | Tokens → transformer → next token → loop | One prompt, end to end | Full pipeline animation | — | — | Season 6 |

## Season 6 — "LLM + duniya" (RAG, tools, agents, multimodal) · running example: college study assistant

| # | Topic | Prereq | Objective | Example | Visual | Misconception | Refs | → Next |
|---|---|---|---|---|---|---|---|---|
| 57 | Retrieval-Augmented Generation | 55,42 | Retrieve relevant docs, put them in context, then answer | Asking about your college syllabus PDF | Librarian Bitu fetching pages | "RAG retrains the model" | Paper: Lewis 2020; HF | Where docs live |
| 58 | Vector databases & semantic search | 42,24,57 | Store embeddings; search by meaning | "cheap food near campus" finds "budget dhaba" | Points in space; nearest-neighbour ring | "Vector DB understands text" | HF; vendor docs | Doing, not just saying |
| 59 | Tool calling | 53 | Model outputs a structured request; software executes it | Checking train PNR status | Bitu hands a form to a calculator robot | "The LLM itself runs the code/browses" | vendor docs (Anthropic/OpenAI) | Many steps |
| 60 | AI agents (loop: plan → act → observe) | 59,13 | Agent = LLM in a loop with tools and goals | Study planner booking slots | Loop track with checkpoints | "Agents are autonomous beings" | AIMA ch2; vendor docs | Beyond text |
| 61 | Multimodal AI | 46,40 | Images, audio and text mapped into a shared token/embedding space | Photo of homework → explanation | Image patches turning into tokens | "It sees like a human" | Paper: ViT (Dosovitskiy 2020), CLIP | Responsibility |

## Season 7 — "Real-world AI" (safety, fairness, deployment, MLOps)

| # | Topic | Prereq | Objective | Example | Visual | Misconception | Refs | → Next |
|---|---|---|---|---|---|---|---|---|
| 62 | AI safety, bias & interpretability (3-part mini-arc, eps 62a–c) | 20,55 | Why models can be unfair, unsafe or opaque, and the tools to probe them | Loan model, jailbreaks, saliency maps | X-ray goggles on a model | "If it's accurate, it's fair" | GMLCC fairness; Distill | Shipping |
| 63 | Deployment: latency, quantization, distillation (mini-arc 63a–c) | 37,53 | Making models fast and small enough for phones | On-device keyboard model | Big teacher → small student; number precision shrinking | "Smaller = always worse" | HF; Paper: Hinton 2015 distillation | Keeping it healthy |
| 64 | Monitoring, drift & MLOps (mini-arc 64a–c) | 16,63 | Data changes, so models must be monitored and retrained | Scammers' new tricks → spam drift (callback to EP01!) | Dashboard with drifting graph | "Train once, done forever" | Chip Huyen *Designing ML Systems*; GMLCC production | Season 8 (computer vision, speech AI, research frontiers), planned after audience feedback |

> Season 8 (computer vision deep-dives, speech AI, diffusion models, modern research directions) will be planned from viewer questions and from AI developments at the time. Fast-moving topics (S5–S8) are re-verified against current primary docs when each episode is scripted.

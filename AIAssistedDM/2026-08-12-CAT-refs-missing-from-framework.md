# Candidate studies from the CAT thesis document, not yet in the Framework Evidence Base

Source: `_PhD__CAT_Regina_V4.pdf` — Chapter 2 (Related Work, pp. 5–11) + full Bibliography (143 refs).
Checked against the 47 rows currently in the Notion "Framework Evidence Base" (33 coded + 14 uncoded).
Date: 2026-08-12

---

## Tier 1 — Cited in Related Work, core AI-assisted DM user studies (9)

These are empirical human-subject studies on AI-assisted decision-making that Chapter 2 leans on but the framework does not contain.

| # | Ref | Study | Venue / Year | Why it belongs |
|---|-----|-------|--------------|----------------|
| 1 | [23] / [45] | Wang & Yin — *Are explanations helpful? A comparative study of the effects of explanations in AI-assisted decision-making* | IUI 2021 | Cited 3× in Ch. 2 as the key evidence that feature-importance explanations induce over-reliance. Canonical XAI × task-familiarity study. |
| 2 | [64] | Munyaka, Ashktorab, Dugan, Johnson, Pan — *Decision making strategies and team efficacy in human-AI teams* | CSCW 2023 | Directly cited in the Research Gap on group AI-assisted DM (human-AI-AI vs human-human-AI, autocratic AI). |
| 3 | [65] | Zheng, Wu, Shi, Ma, Luo, Ma — *Competent but rigid: Identifying the gap in empowering AI to participate equally in group decision-making* | CHI 2023 | Cited in the Research Gap; AI as a voting group member. |
| 4 | [69] | Schoeffer, De-Arteaga, Kuehl — *Explanations, fairness, and appropriate reliance in human-AI decision-making* | CHI 2024 | Fairness is an outcome column in the framework and no study currently populates it well. |
| 5 | [70] | Tschandl et al. — *Human–computer collaboration for skin cancer recognition* | Nature Medicine 2020 | Large multi-reader clinician study; expertise × AI interaction. High-stakes medical imaging. |
| 6 | [71] | Panigutti, Beretta, Giannotti, Pedreschi — *Understanding the impact of explanations on advice-taking: a user study for AI-based clinical DSS* | CHI 2022 | Clinical DSS + explanations, advice-taking measures. |
| 7 | [74] | Jacobs, He, Pradier, Lam, Ahn, McCoy, Perlis, Doshi-Velez, Gajos — *Designing AI for trust and collaboration in time-constrained medical decisions* | CHI 2021 | One of the few studies that populates **Time constraint / stress = Present** in a clinical setting. |
| 8 | [37] | Hemmer, Schemmer, Kühl, Vössing, Satzger — *On the effect of information asymmetry in human-AI teams* | 2022 (preprint / workshop) | Cited as the evidence base for complementary expertise; relevant to AI-performance-relative-to-human coding. |
| 9 | [10] | Eiband, Buschek, Kremer, Hussmann — *The impact of placebic explanations on trust in intelligent systems* | CHI EA 2019 | The placebo-explanation claim in §2.2.3 rests on this. Short paper but empirical. |

---

## Tier 2 — Cited in Related Work, adjacent user studies (6)

Empirical, but either not a decision-accuracy task or focused on explanation comprehension rather than reliance. Worth coding if the framework is meant to cover XAI-interaction studies broadly.

| # | Ref | Study | Venue / Year | Note |
|---|-----|-------|--------------|------|
| 10 | [50] | Nguyen, Schlötterer, Seifert — *From black boxes to conversations: Incorporating XAI in a conversational agent* | xAI 2023 (Springer) | Conversational XAI; pairs with the He et al. entry already coded. |
| 11 | [51] | Shen, Huang, Wu, Huang — *ConvXAI: Delivering heterogeneous AI explanations via conversations* | CSCW 2023 Companion | Scientific-writing task, not a decision task — flag if out of scope. |
| 12 | [52] | Hernandez-Bocanegra & Ziegler — *Explaining recommendations through conversations: dialog model and the effects of interface type and degree of interactivity* | ACM TiiS 2023 | Manipulates interactivity — maps onto your AI design column. |
| 13 | [31] | Nimmo, Constantinides, Zhou, Quercia, Stumpf — *User characteristics in explainable AI: the rabbit hole of personalization?* | CHI 2024 | Directly about the Human component; tests whether individual differences matter at all. |
| 14 | [28] | Kaur, Nori, Jenkins, Caruana, Wallach, Wortman Vaughan — *Interpreting interpretability: Understanding data scientists' use of interpretability tools* | CHI 2020 | AI expertise as a factor; not a decision-accuracy study. |
| 15 | [14] | Kim, Watkins, Russakovsky, Fong, Monroy-Hernández — *"Help me help the AI": Understanding how explainability can support human-AI interaction* | CHI 2023 | Mostly qualitative; bird-ID app. |

---

## Tier 3 — Embodiment (cited in Related Work, 2)

Relevant to Chapter 5 but a different paradigm; only code if the framework adds an Embodiment factor.

| # | Ref | Study | Venue / Year |
|---|-----|-------|--------------|
| 16 | [40] | Wang & Rau — *Influence of embodiment and substrate of social robots on users' decision-making and attitude* | Int. J. Social Robotics 2019 |
| 17 | [42] | Cominelli et al. — *Promises and trust in human–robot interaction* | Scientific Reports 2021 |

---

## Tier 4 — In the bibliography but not cited in Chapter 2 (13)

Strong AI-assisted DM user studies that appear elsewhere in the document (mostly Chapters 5–8). These are arguably the highest-value additions per unit of effort, since several manipulate factors the framework currently has thin coverage of.

| # | Ref | Study | Venue / Year | Factor coverage gap it fills |
|---|-----|-------|--------------|------------------------------|
| 18 | [126] | Rosbach et al. — *"When two wrongs don't make a right": Confirmation bias and the role of time pressure during human-AI collaboration in computational pathology* | CHI 2025 | Time pressure × experts × pathology |
| 19 | [93] | Chiang, Lu, Li, Yin — *Enhancing AI-assisted group decision making through LLM-powered devil's advocate* | IUI 2024 | Group + deliberative AI. **Note:** distinct from the *Amplifying Minority Voices* (IUI 2025) row already in Notion. |
| 20 | [97] | Chiang & Yin — *You'd better stop! Understanding human reliance on ML models under covariate shift* | WebSci 2021 | Reliance under distribution shift |
| 21 | [84] | Nourani, Roy, Block, Honeycutt, Rahman, Ragan, Gogate — *Anchoring bias affects mental model formation and user reliance in explainable AI systems* | IUI 2021 | Cognitive bias × mental models |
| 22 | [78] | Leichtmann, Hinterreiter, Humer, Streit, Mara — *Explainable AI improves human decision-making: mushroom picking at a public art festival* | IJHCI 2024 | Field study, lay users, mushroom task |
| 23 | [95] | Prabhudesai, Yang, Asthana, Huan, Liao, Banovic — *Understanding uncertainty: How lay decision-makers perceive and interpret uncertainty in human-AI decision making* | IUI 2023 | Uncertainty communication |
| 24 | [123] | Lee & Chew — *Understanding the effect of counterfactual explanations on trust and reliance on AI for human-AI collaborative clinical decision making* | CSCW 2023 | Counterfactual XAI + clinical |
| 25 | [124] | Celar & Byrne — *How people reason with counterfactual and causal explanations for AI decisions in familiar and unfamiliar domains* | Memory & Cognition 2023 | Counterfactual vs causal; domain familiarity |
| 26 | [125] | Lim, Cahaly, Sng, Chew — *Diagrammatization and abduction to improve AI interpretability with domain-aligned explanations for medical diagnosis* | CHI 2025 | Novel XAI type, medical |
| 27 | [127] | Wolf et al. — *How a clinical decision support system changed the diagnosis process: full-scale anesthesiology simulation* | CHI 2025 | Full clinical process, high fidelity — closest analogue to your Chapter 7 |
| 28 | [140] | Reicherts, Zhang, von Oswald, Liu, Rogers, Hassib — *AI, help me think — but for myself: Assisting people in complex decision-making by providing different kinds of cognitive support* | CHI 2025 | Cognitive support types |
| 29 | [105] | Horne, Nevo, O'Donovan, Cho, Adalı — *Rating reliability and bias in news articles: Does AI assistance help everyone?* | ICWSM 2019 | Misinformation task, expertise moderation |
| 30 | [92] | van der Veer et al. — *Trading off accuracy and explainability in AI decision-making: findings from 2 citizens' juries* | JAMIA 2021 | Deliberative/group, non-experimental |

---

## Already in the framework (no action)

Confirmed present: [5] [7] [8] [9] [11] [12] [13] [15] [16] [19] [20] [21] [24] [25] [26] [27] [32] [33] [34] [35] [36] [38] [39] [44] [46] [49] [53]/[120] [58] [59] [72] [73] [99]/[118]

## Excluded as non-empirical

Reviews, meta-analyses, position papers and technical/method references: [1] [2] [3] [4] [6] [17] [18] [22] [29] [30] [41] [43] [47] [48] [54]–[57] [60]–[63] [66]–[68] [75]–[77] [79]–[83] [85]–[91] [94] [96] [98] [100]–[104] [106]–[122] [128]–[143]

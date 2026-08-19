# Mechanisms proposal — derived from 33 coded studies

Bottom-up re-derivation of the Mechanisms database from the Framework Evidence Base. Nothing has been written to Notion. Status column untouched throughout.

**Headline:** the existing 12 mechanisms survive, but four of them are doing work that should be split, one is a ghost with no linked studies, and the evidence base supports **five mechanisms that are currently missing** — the most important being complementarity through error independence, which is arguably the single best-supported claim in the whole base and has no row.

Note: the base holds **33** coded studies, not 35.

---

## Part 1 — The five missing mechanisms

### N1. Complementarity comes from error independence, not from comparable accuracy

**Component:** AI Ecosystem · **Sub-factor:** AI performance relative to human · **Affects:** Decision accuracy, Reliance

A human-AI team can only beat both members when the AI is right where the human is wrong. Matching or exceeding human accuracy is neither necessary nor sufficient: a system weaker than the average human produces complementarity if its errors fall elsewhere, and a system stronger than the human produces none if their errors coincide. This is why so many studies find assistance raising accuracy over the unaided human while never reaching the AI alone — the overlap, not the interface, sets the ceiling.

| Supporting | What it contributes |
|---|---|
| Zhang, Lee & Carter 2022 | The decisive test. AI competence held constant at three of six categories while *where* that competence sat was varied; performance rose monotonically with complementarity (η² = .737), and first-guess performance was unaffected, so the gain was selective reliance |
| Bansal et al. 2021 | Names the mechanism. Amzbook AI errors correlated with human errors and gained least; participants there reported ignoring the AI most (30%) |
| Zhang, Liao & Bellamy 2020 | The negative case. Confidence calibrated trust but bought no accuracy because the model was uncertain exactly where humans were wrong |
| Reverberi et al. 2022 | Complementarity achieved with no explanation at all, through case-by-case weighting of two reliabilities |
| Cabitza et al. 2023 (*Rams*) | Hybrid beat AI alone at 70% and 80% AI accuracy, at or below the average reader |
| Chen et al. 2023 | Example-based condition exceeded both human alone and AI alone on both tasks |
| Rastogi et al. 2022 | Engineered complementary knowledge deliberately, concentrated in low-confidence trials |
| Alufaisan et al. 2021 | Scarcity evidence: only 7% of participants exceeded their own AI |

**Supporting: 8 · Contradicting: 0**

---

### N2. An explanation helps only if it can be checked against the case; otherwise it displaces the user's judgement

**Component:** AI Ecosystem · **Sub-factor:** Explanation type · **Affects:** Over-reliance, Decision accuracy, Understanding of AI

The useful distinction is not how much an explanation explains but whether the user can hold it against the evidence and see a mismatch. Explanations inspectable at a glance — similar cases as images, a highlight on the artefact itself — let people form their own view first and expose errors directly. Explanations that must be reasoned about in the abstract — feature weights, counterfactuals, fluent prose — are visually or rhetorically dominant, suppress the user's own reading, and are accepted without check. Fluency makes this worse, not better.

| Supporting | What it contributes |
|---|---|
| Chen et al. 2023 | The cleanest within-study contrast: example-based achieved complementarity, feature-based achieved none and hurt when the AI was wrong. Participants "scanned the pink and the blue instead of reading" |
| Buçinca et al. 2020 | Inductive explanations protected on AI-error items (0.63 vs 0.48) — and were the *less* preferred design |
| Vasconcelos et al. 2023 | Highlight beat written explanations at both difficulties; the maximally salient explanation drove over-reliance to 0% |
| de Brito Duarte et al. 2023 | LIME moved every measure; counterfactuals were indistinguishable from no explanation for non-experts |
| He et al. 2025 | Fluency backfires: the GPT-4 arm produced the worst self-reliance and the worst objective understanding simultaneously |
| Leichtmann et al. 2023 | Grad-CAM plus nearest examples improved accuracy on precisely the AI-error items |

**Contradicting:** Cabitza et al. 2023 (*Rams*) — saliency maps, an inspectable form, were clearly detrimental under human-first protocols.

**Supporting: 6 · Contradicting: 1**

*This is currently the only unused sub-factor in the Mechanisms table — the gap is structural, not accidental.*

---

### N3. The interventions that protect decisions are the ones users like least

**Component:** Human · **Sub-factor:** Explanation cognitive load · **Affects:** Satisfaction / preference, Trust, Decision accuracy

Subjective measures do not merely fail to track performance; across this base they run against it. Designs that reduce over-reliance impose effort, and effort is experienced as a worse system. Any evaluation resting on trust, preference, perceived understanding or intention to use will systematically select the more harmful design.

| Supporting | What it contributes |
|---|---|
| Buçinca et al. 2021 | The direct measurement. Trust correlated **negatively** with performance on AI-error items (r = −.24, p = .0003) and preference likewise (r = −.16) |
| Buçinca et al. 2020 | Double dissociation; the explanation type trusted less, preferred less and found less helpful was the one that protected against errors |
| Leichtmann et al. 2023 | Explanations improved accuracy while lowering trust, perceived understanding, app rating *and* intention to use |
| Ma et al. 2025 | Deliberation raised accuracy, lowered trust and satisfaction |
| Green & Chen 2019 | Self-reported confidence unrelated to performance, negatively related in two cases |
| Westphal et al. 2023 | Explanations raised perceived task complexity, which impaired trust, understanding and compliance |
| Sivaraman et al. 2023 | Explanations raised perceived case difficulty without changing decisions |
| Cabitza et al. 2025 | Less experienced clinicians rated the protective protocol more fatiguing and less useful |

**Contradicting:** Calisto et al. 2023 — preference and accuracy moved together for novices under the assertive agent.

**Supporting: 8 · Contradicting: 1**

---

### N4. Reliance is a see-saw: cutting over-reliance raises under-reliance

**Component:** AI Ecosystem · **Sub-factor:** Explanation presence · **Affects:** Over-reliance, Under-reliance, Decision accuracy

Almost every intervention that reduces uncritical acceptance also increases rejection of good advice, and the two cancel in aggregate accuracy. This is why so many designs "work" on one reliance measure and vanish on decision quality. The exceptions are informative and rare.

| Supporting | What it contributes |
|---|---|
| Lu, Wang & Yin 2024 | Explicit and pre-registered: over-reliance down (d .26–.44), under-reliance up (d .14–.22), appropriate reliance unchanged |
| Buçinca et al. 2021 | Over-reliance on error items fell, overall performance did not rise — the gain was offset elsewhere |
| Chiang et al. 2023 | The mirror image: groups cut under-reliance (.37→.24) but raised over-reliance (.53→.68), accuracy flat |
| Salimzadeh et al. 2024 | RAIR rose while RSR fell across complexity — movement without calibration |
| Schemmer et al. 2023 | The partial exception: RAIR rose while RSR held, so the gain was discriminating rather than compensated |

**Contradicting:** Ma et al. 2025 — deliberation cut over-reliance (.65→.47) with **no** rise in under-reliance, which the authors attribute to engagement with the reasoning rather than raised effort. This is the one clean escape from the see-saw in the base and deserves following up.

**Supporting: 5 · Contradicting: 1**

---

### N5. Expertise decides who benefits, but not in a fixed direction

**Component:** Human · **Sub-factor:** Task expertise · **Affects:** Decision accuracy, Over-reliance, Reliance

The literature contains no stable law relating expertise to reliance. The same class of support raises novices to expert level in one study and helps only experts in another; experts are variously more discriminating and less so. Measured knowledge frequently predicts nothing at all. What appears to matter is whether the support fits the user's existing process, which is why tailoring beats any fixed policy.

| Supporting | What it contributes |
|---|---|
| Cabitza et al. 2023 (*Rams*) | Support pulled novices up to expert level; expertise stopped separating readers after assistance |
| Cabitza et al. 2024 (*pro-hoc*) | The reversal. Residents beat specialists unaided; only specialists improved, no resident did; automation bias 2.5× larger in residents |
| Cabitza et al. 2025 | Benefit confined to experienced clinicians; non-inferiority could not be established for the less experienced |
| Reverberi et al. 2022 | Non-experts gained more, yet experts were *worse* at telling good advice from bad |
| Kiani et al. 2020 | Benefit confined to an experience band; conditional model effect held at every level |
| Calisto et al. 2023 | Direct prescription: assertive register for novices, suggestive for experts |

**Contradicting:** Sivaraman et al. 2023 — the four behaviour patterns were explicitly *not* explained by seniority, contrary to prior work. Leichtmann et al. 2023 also undercuts it: measured domain and AI knowledge predicted nothing (β = .06 and .05).

**Supporting: 6 · Contradicting: 2**

---

## Part 2 — Changes to the existing 12

| # | Existing mechanism | Verdict | Change |
|---|---|---|---|
| 1 | Error boundary / mental model | **Keep** | Add Kiani, Reverberi as support; add Green & Chen and Chiang as contradicting (participants could not estimate model accuracy at all; understanding of AI ≈ 0) |
| 2 | Engagement cost (difficulty, time, load) | **Keep** | Add Swaroop 2024 (time pressure raised over-reliance .41→.59) and Salimzadeh |
| 3 | Verification impossible ≠ expensive | **Keep** | Add Buçinca 2025: on AI-error items assisted accuracy fell to 0.14 against 0.29 unaided **in every condition** — the strongest statement of this claim in the base |
| 4 | Coherent explanation substitutes for verification | **Keep** | Add He 2025 (illusion of explanatory depth) and Cabitza 2025 (persuasion without any authority to defer to) |
| 5 | Withheld conclusion builds skill | **Narrow** | Split the claim. Buçinca 2025 shows learning gains **without** any reduction in over-reliance, and Gajos shows learning without accuracy gain. The row should claim *learning*, not *learning and reduced over-reliance*; the over-reliance half belongs to #2 |
| 6 | Reliance is not one quantity | **Keep** | Its "practical rule" note is really N3, and its trade-off note is really N4 — both now have their own rows, so this becomes a cleaner measurement claim |
| 7 | Requested vs imposed advice | **Keep** | Add Buçinca 2021's on-request arm |
| 8 | Register / tone | **Keep, flag** | Rests on Calisto plus Zhang, Lee & Carter — but the ZLC coded row evidences complementarity, not language. Either the row's Summary of findings needs the study-2 language manipulation added, or this is a 1-study mechanism. **Also: its sub-factor is `Confidence display`, which is wrong** — should be `AI modality / embodiment` |
| 9 | Human-first can backfire | **Keep** | Now in direct tension with Cabitza 2025 from the same group. Add Swaroop as partial support (AI-before faster at equal accuracy, but higher over-reliance) |
| 10 | Group deliberation | **Keep** | Unchanged, still 1 study |
| 11 | Acceptance is path-dependent | **Fix — currently a ghost** | Zero linked studies; its only cited source (Wang, Lu & Yin) is not in the base. It can now be supported from within: Bansal 2019a (four-stage unlearn/relearn across 150 rounds), Bansal 2019b (simple regret falling over rounds), Green & Chen (unaided predictions improved across 40 trials), Zhang, Lee & Carter (agreement diverged across trials, β = .117 vs −.145) |
| 12 | Explanation effects are conditional (Contested) | **Keep** | Add Leichtmann and Vasconcelos as the positive-conditions side |

---

## Part 3 — Consistency issues found

1. **Sub-factor mis-assignment.** The register/tone mechanism sits under `Confidence display`; no mechanism uses `Explanation type`, `Task expertise`, `AI expertise`, `Personality / Need for Cognition`, `Stakes`, `Time pressure` or `Group decision mode`. Two of those gaps are filled by N2 and N5.
2. **Two mechanisms cite studies not in the evidence base** (Wang & Yin; Wang, Lu & Yin). Either code those papers or remove the claims resting on them.
3. **Component assignment is skewed:** 9 of 12 existing mechanisms are AI Ecosystem, 2 Human, 1 Task. The additions bring Human to 4 and Task to 1. Task remains thin — plausibly correct, since most studies manipulate the interface rather than the task.
4. **Need for Cognition** appears as a moderator in three studies (Gajos, Vasconcelos, Swaroop) with inconsistent results and has no row. Below bar on my reading, but worth a row if you want the gap visible.
5. **Stakes** has a sub-factor and no mechanism. Only de Brito Duarte manipulated risk directly, finding it lowers trust only when the model is weak. One study.

---

## Proposed final list: 17 mechanisms

12 existing (1 narrowed, 1 rescued from ghost status, 1 flagged for sub-factor correction) + 5 new.

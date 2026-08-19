# AI-Assisted Decision-Making — Interactive Framework Site

**Build spec for Claude Code.** Companion data file: `2026-08-05-aidm-framework-data.json`.

---

## 1. What this is

An interactive artifact presenting a framework for AI-assisted decision-making, backed by a coded evidence base of 35 studies. Author: Regina de Brito Duarte (PhD, Human-AI decision-making, IST Lisbon).

The framework's central argument, which the design must make visible without stating it twice: **the three AI Ecosystem factors are levers you can design; the Human and Task factors are constraints you inherit.**

**Audience: layered.** A practitioner or policy reader should get the argument from the surface. A researcher should be able to drill to the study coding and the DOI. Do not require a drill-down to understand the top level.

---

## 2. Structure — two levels, plus study pages

| | What | Where |
|---|---|---|
| **Level 1** | Framework figure + narrative on the main mechanisms | The page |
| **Level 2** | Factor detail | **Modal** over Level 1. Closes, returns to Level 1. |
| **Study** | One study in full | **Separate page**, not a modal |

Level 2 does *not* contain study detail. It lists studies as links out to their pages.

### Routing

Single `index.html`, hash-routed. This works from `file://`, on GitHub Pages with no server config, and keeps the whole thing self-contained.

```
#/                    framework (default)
#/factor/<factor-id>  framework + factor modal open
#/study/<study-id>    study page
```

Requirements:
- Every state is linkable and shareable.
- Browser back/forward works. Back from an open modal closes it and returns to `#/`. Back from a study page returns to whatever was open before.
- Unknown id → fall back to `#/`, don't crash on a blank screen.

---

## 3. Data contract

Load `2026-08-05-aidm-framework-data.json` — inline it in the HTML as a `<script type="application/json">` block so the file opens from `file://` (a `fetch()` of a local JSON will fail there). All IDs are stable slugs; join on them, never on titles.

Top-level keys: `meta`, `components`, `factors` (9), `mechanisms` (12), `studies` (35).

**Relationships are already resolved and verified bidirectionally.** Don't recompute them:

```
factor.mechanisms[]              -> mechanism ids
mechanism.factor                 -> factor id
mechanism.supporting_studies[]   -> study ids
mechanism.contradicting_studies[]-> study ids
study.supports_mechanisms[]      -> mechanism ids
study.contradicts_mechanisms[]   -> mechanism ids
mechanism.n_support / n_contradict — precomputed counts
```

### Field gotchas — read these before writing any render code

1. **`factor.sub_factors` is a single string**, not an array. Delimiter is ` · ` (space, middle dot, space). Split on it to get chips.
2. **`study.manipulated_factors[]` entries are prefixed strings** like `"XAI: Feature importance"`. The prefix identifies the factor. Use this map (note **two prefixes map to `f-difficulty`**):

   | Prefix | Factor id |
   |---|---|
   | `Expertise` | `f-expertise` |
   | `Team` | `f-team-composition` |
   | `Difficulty` | `f-difficulty` |
   | `Uncertainty` | `f-difficulty` |
   | `Stakes` | `f-stakes` |
   | `Time` | `f-stress-time` |
   | `AI performance` | `f-ai-performance` |
   | `AI design` | `f-ai-design` |
   | `XAI` | `f-xai` |

   There is no `Need for Cognition` prefix — nothing manipulates it. That is a finding, not a bug.
3. **`study.coding`** is an object with 9 keys mirroring the factors: `expertise_level`, `need_for_cognition`, `team_composition`, `difficulty`, `stakes`, `stress_time`, `ai_performance`, `ai_design`, `xai`.
4. **Optional flags** appear on some studies only: `own_work: true` (one study), `incomplete: true` (one study). Absent means false.
5. **Nulls exist.** `study.link`, `summary_of_findings`, `authors_framing` are `null` on `s-timepressure-2024`. Never render "null".
6. `meta.data_notes[]` documents known data-integrity issues. Surface it on an About/Method section, not on the main flow.

---

## 4. Level 1 — the page

Vertical flow, in order:

### 4.1 Header
Title, one-line description, then intro text (2–3 short paragraphs). Content placeholder — Regina supplies the copy. Leave clearly marked `<!-- COPY: intro -->` slots rather than inventing prose.

### 4.2 The framework figure

Three columns side by side: **Human · Task · AI Ecosystem**, in that order. Each column holds its factors as nodes, sorted by `factor.order`.

Per column header, show the component label and its type from `components[].type`. **The AI Ecosystem column must read visually as the lever column** — distinct treatment (accent colour, container, explicit "designable" label). Human and Task read as inherited constraints. This contrast is the point of the figure; it should survive being screenshotted for a slide.

Each node shows:
- Factor name
- A **coverage badge**: `Well evidenced` (5) · `Contested` (1) · `Thin` (2) · `No evidence yet` (1). Use a colour scale, not just text.
- Optionally, the mechanism count.

Node states: default, hover, focus (keyboard), selected. Clicking or pressing Enter opens the Level 2 modal and sets the hash.

**Empty-state factors.** `f-need-for-cognition` and `f-stakes` have **zero mechanisms**. Do not hide them and do not let them look broken. They are still clickable, and their modal leads with the gap. Their emptiness is part of the argument.

Responsive: three columns on desktop, stacked on mobile with column headers retained.

### 4.3 Narrative — the main mechanisms

Below the figure. This is the layer that carries the argument for a reader who never clicks anything.

Render only mechanisms with `status` of **`Above bar (2+ support)`** or **`Contested`** — 9 of 12. This follows the rule recorded in the Notion schema ("Only Above bar and Contested render in the public artifact"). The 3 `Below bar (1 study)` mechanisms are reachable inside the factor modal, not here.

Per mechanism, show:
- `claim` — the headline. It is written as a full plain-language sentence; let it be the heading, don't truncate it.
- `direction` badge (`Increases` / `Decreases` / `No effect` / `Conditional`)
- `status` badge
- Evidence count from `n_support` / `n_contradict`, e.g. "7 supporting · 1 contradicting"
- `affects[]` as outcome chips
- The parent factor, as a link that opens that factor's modal

Give `m-explanation-null` (the one `Contested`) visibly different treatment from the above-bar ones. A contested claim shown identically to a settled one misrepresents the evidence.

`mechanism.notes` is long, dense, and researcher-facing. Put it behind a "the evidence in detail" disclosure — collapsed by default. This is the layering: practitioner reads claims, researcher expands.

Connective prose between mechanisms is a **content task, not a build task**. Leave `<!-- COPY: -->` slots. Do not generate scientific commentary.

### 4.4 About / method
Short section: what the evidence base is, how studies were coded, the bar for a mechanism, and `meta.data_notes[]` rendered honestly. Link to the Notion source.

---

## 5. Level 2 — factor modal

Opens over Level 1. Level 1 stays visible behind a scrim.

Contents, in order:

1. **Factor name** + component + type (`Lever (designable)` / `Constraint (inherited)`) + coverage badge
2. **`definition`** — full text, prominent
3. **Sub-factors** — `sub_factors` split on ` · `, rendered as chips
4. **Mechanisms** — numbered list of `factor.mechanisms[]`. Per mechanism: `claim`, `direction`, `status`, and its supporting and contradicting studies **as links to `#/study/<id>`**, labelled by author + year, visibly separated into supporting vs contradicting. Include below-bar mechanisms here, marked as such and de-emphasised.
5. **`gap_note`** — visually distinct block ("what's missing"). These are candid and written in the first person about Regina's own thesis; render them as-is, they are a feature.
6. Link to the Notion page via `notion_url` — optional, decide with Regina before publishing (the workspace may be private).

**Zero-mechanism factors:** skip section 4, lead with the gap note, make the empty state deliberate ("No mechanism has cleared the evidence bar for this factor yet") rather than a blank panel.

Modal behaviour — non-negotiable:
- Close on ✕, Esc, scrim click, and browser back
- Focus moves into the modal on open, returns to the originating node on close
- Focus trapped while open
- `role="dialog"`, `aria-modal="true"`, labelled by the factor name
- Background scroll locked
- Long content scrolls inside the modal, not the page

---

## 6. Study page

Own route. Full-page, not a modal. Reachable from mechanism study links.

Layout, following the sketch:

**Header** — `study` (title), `author`, `year`, `venue`. Badges where applicable: `read` status, `own_work` → "Author's own work", `incomplete` → a plain warning that this record is incomplete.

**Manipulated-factors figure** — a compact version of the three-column framework, with the factors this study manipulated **highlighted**. Derive from `manipulated_factors[]` via the prefix map in §3. Beneath it, list the specific manipulated categories as chips grouped by factor. This is the "highlights factors manipulated" element in the sketch and it is the study page's signature — it shows at a glance where in the framework each study sits.

**Coding table** — all 9 `coding` values against their factor names. Mark `Manipulated` values distinctly from `Not reported` / `Not measured`; the difference between "varied" and "never recorded" carries meaning here.

**Outcomes measured** — `outcomes_measured[]` as chips.

**Findings** — `summary_of_findings`, then `authors_framing`, then `design_notes`, each clearly labelled. These are long paragraphs with heavy use of CAPS for emphasis; render as prose in readable measure (~65–75ch). Do not restyle the caps.

**Evidence links** — which mechanisms this study supports and contradicts, each linking back to `#/factor/<id>` of that mechanism's parent factor.

**External link** — `link` (DOI/arXiv), `target="_blank" rel="noopener"`. Hide the element entirely when `link` is null.

**Back to framework** — always present.

### Handle `s-timepressure-2024`
Author is `"UNRESOLVED"`, `link` is null, `summary_of_findings` and `authors_framing` are null, no mechanism links. Render the page with an honest "this record is incomplete" state. Do not fabricate, do not 404, do not print "null" or "UNRESOLVED" as if it were an author name.

---

## 7. Visual design

**Read the `rbd-design` skill first** and use its palette, type scale, and components. This is part of Regina's personal brand (AI · HCI · evidence-based public policy) and must match her other assets.

Beyond that:
- The framework figure is the hero. It should be legible screenshotted into a slide or a LinkedIn post.
- Coverage and status badges need a consistent, learnable colour language — one scale, used the same way everywhere.
- Body text at a readable measure. Several fields are 100+ word paragraphs.
- Restrained motion. Modal fade/scale and disclosure expand only; respect `prefers-reduced-motion`.

---

## 8. Technical constraints

- **One self-contained `index.html`.** All CSS, JS, and the JSON inlined. No build step, no bundler, no framework.
- Must work three ways: double-clicked from disk (`file://`), served from GitHub Pages, and dropped into an existing site later. Keep CSS scoped (prefix or a single wrapper class) so it can be lifted without collisions.
- **No `localStorage` / `sessionStorage`.** In-memory state only.
- No external requests except fonts, and only if `rbd-design` specifies them — with a system-font fallback so `file://` still renders correctly.
- Vanilla JS. No CDN dependencies.
- Keyboard operable throughout. Visible focus rings. Colour contrast ≥ 4.5:1 for text.

---

## 9. Acceptance checklist

- [ ] 9 factors render in 3 columns, correct component, ordered by `order`
- [ ] AI Ecosystem is visually identifiable as the lever column without reading the label
- [ ] All 9 factors open a modal, including the two with zero mechanisms
- [ ] Narrative section shows exactly 9 mechanisms (8 above bar + 1 contested); the 3 below-bar appear only in modals
- [ ] The contested mechanism is visually distinguished
- [ ] Every study link from every mechanism resolves to a study page — 35 studies, no dead links
- [ ] Manipulated-factor highlighting is correct, including `Uncertainty:` → `f-difficulty`
- [ ] `s-timepressure-2024` renders as incomplete without fabricated content and without "null" on screen
- [ ] Sub-factor chips split correctly on ` · ` for all 9 factors
- [ ] Esc, ✕, scrim click, and browser back all close the modal; focus returns to the originating node
- [ ] Every hash route is directly loadable by pasting the URL
- [ ] Opens correctly from `file://` with no console errors
- [ ] Usable at 375px width
- [ ] Full keyboard traversal: node → modal → study link → study page → back

---

## 10. Open decisions for Regina

1. **Notion links** — include `notion_url` on factor modals and study pages, or strip them for a public build?
2. **Below-bar mechanisms** — currently shown inside modals, de-emphasised. Alternative is hiding them entirely per the strict schema note. Recommend keeping them: two of the three are Regina's own thesis openings, and their thinness is the argument.
3. **`s-timepressure-2024`** — fix the Notion row and re-export, or ship with the incomplete state?
4. **Own-work badge** — flag `s-debritoduarte-2023` as Regina's own, or leave it unmarked?

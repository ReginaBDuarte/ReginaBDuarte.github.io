# ReginaBDuarte.github.io — rewrite guide

This file is the persistent brief for rebuilding this site. It merges `website-brief.md`
(Regina's build brief, kept as-is at repo root) with a review of what's actually in the repo
today. Read this before touching any page. When the brief and this file conflict, this file
wins — it reflects decisions made after the brief was written.

**A note on the copy quoted throughout this file (added 2026-08-19).** Several sections below
quote specific English strings (Hero headline/lead, Currently items, Contact heading/body,
Research framing paragraph, etc.) as they stood when that section was last edited. A
2026-08-19 audit found that `src/i18n/ui.ts` had drifted from several of these quotes — real
copy edits happened without this file being updated alongside them, which is exactly the
silent-drift risk the "Pattern to watch for going forward" note under Home already warns
about. **Treat `src/i18n/ui.ts` as the source of truth for live copy; treat quotes in this
file as a record of intent/reasoning that may lag it.** If you're about to change copy, diff
against `src/i18n/ui.ts` directly rather than trusting a quote here, and update both the code
and this file's quote in the same pass.

## Where things stand (2026-08-19)

The rewrite is **scaffolded, building, and Regina has called it ready to publish** — but
still **entirely uncommitted**: `git log` only shows the three old-site commits; everything
under `src/`, `.claude/`, `.github/`, `astro.config.mjs`, `package.json`, etc. is untracked.
Nothing has been pushed, so the GitHub Actions deploy workflow has never run for real and the
live site is still whatever GitHub Pages was last serving from the `main` branch.

**Old HTML5 UP site removed (2026-08-19, Regina's explicit call).** The old single-page site
(`index.html`, `assets/`, `images/`, `LICENSE.txt`, `README.txt`) and the unused
`html5up-arcana.zip` template are gone from the working tree. These files were tracked in
git (from the three old-site commits), so the deletions are currently **unstaged working-tree
changes** — they need to go into the same commit that first ships the Astro site, or a
preceding one. For the record, what the old site got wrong (first-year-PhD Regina, not
last-year): IST/GAIPS affiliation with no health/policy framing, a keyword-cloud publications
section (the brief explicitly forbids this — §11), only 2 stale publications, an IST
TagusPark office address and embedded Google Map, no Framework/Writing/Currently concepts at
all. None of that copy or structure was reused except the two known publications and contact
handles, both since replaced with confirmed data (see Research page and Contact below).

## Decisions made and implemented

1. **Design tokens**: the `rbd-design` skill now exists at `.claude/skills/rbd-design/`
   (added 2026-07-15). Its tokens/fonts/base styles have been copied into
   `src/styles/rbd/` (colors, typography, layout tokens; Bricolage Grotesque + Public Sans +
   IBM Plex Mono via Google Fonts CDN) and composed in `src/styles/global.css`. Component
   `.jsx` files under the skill are React and were **not** used as-is (this site is plain
   Astro/HTML, no React runtime) — component visual patterns were reimplemented as `.astro`
   components instead (see Project structure). The skill's `ui_kits/personal-website/index.html`
   is a **generic demo with fabricated content** (fake papers, no Framework section, card-style
   research listing) — useful only as a token/spacing/motion reference, not as a structural or
   content template. Do not copy its content or its card-based research layout; the brief's
   row-based layout and Framework-first structure override it.
2. **Tech stack**: Astro (static output, no client JS framework), confirmed 2026-07-15.
   Content Collections power `research`, `framework`, and `writing` (schemas in
   `src/content/config.ts`). Deploys to GitHub Pages via GitHub Actions
   (`.github/workflows/deploy.yml`, builds `dist/` and publishes with
   `actions/deploy-pages`).
3. **Manual step still required**: the repo's GitHub Pages source needs to be switched from
   "Deploy from branch" to "GitHub Actions" in repo Settings → Pages before the new workflow
   can actually publish anything. Not done yet — this changes production deployment and
   should be confirmed with Regina first, not done silently.

## Project structure (Astro)

```
astro.config.mjs        site: https://reginabduarte.github.io, no base path (user page)
                         i18n: en default (unprefixed), pt under /pt/
src/
  i18n/ui.ts             translation dictionary (en/pt) + routing helpers — see i18n below
  data/aidm-framework.json  canonical framework evidence-base snapshot — see Framework page
  lib/aidm.ts             typed data access + helpers over aidm-framework.json
  content/
    config.ts            collection schemas: research, framework, writing
    research/*.md         one file per publication (frontmatter: title, authors, venue,
                           year, type, selected, soWhat, seriesLabel, links; no Markdown body
                           — research entries are frontmatter-only, nothing ever calls
                           `.render()`/`<Content />` on this collection, only `writing` does).
                           NOT locale-split: paper titles/venues/authors stay as published,
                           same for both languages (standard academic practice)
    framework/en.md,pt.md page chrome only per locale (name, version, updated, licence,
                           whatItIs, feedbackEmail) — the framework's actual content is
                           data-driven, see Framework page below. No framingQuestion or
                           changelog field — both were deliberately removed, see Framework
                           page below.
    writing/              empty on purpose — do not seed fake posts; add real ones when ready
  components/
    aidm/                 FrameworkFigure, FactorModal, MechanismCard, ProseBlocks,
                           AuthorQuotes — see Framework page below
    Header, Footer, FrameworkCard, ResearchRow, Placeholder
  layouts/
    Layout.astro           shared site shell (Header + <slot> + Footer), imports global.css,
                           sets <html lang>, emits hreflang alternates
    FrameworkLayout.astro  standalone shell for /framework/** — NO site Header/Footer, see
                           Framework page below
  pages/
    index.astro            home: hero, selected research, currently (no Framework section —
                           see nav simplification under Site map below)
    research/index.astro   full research page
    framework/index.astro  framework resource page — 3-column figure, narrative mechanism
                           grid, factor modals (see Framework page below)
    framework/study/[id].astro  one static page per coded study (56 pages as of 2026-08-19,
                           see Framework page below for current factor/mechanism/study counts)
    about/index.astro      full page (not a homepage section — see About below)
    writing/index.astro    list (route exists, NOT linked in Header nav — see brief §7)
    writing/[...slug].astro per-post template (English-only for now, see i18n below)
    pt/                    thin wrapper routes — see i18n below
  styles/
    rbd/                   copied verbatim from the rbd-design skill (tokens, fonts, base)
    global.css             site-level composition + .placeholder-chip + layout helpers
public/
  motifs/agent-bloom.png
  favicon.svg              coral "rbd" monogram, matches the header brand mark
AIAssistedDM/              source material for the Framework page's evidence base — see
                           Framework page below. Not part of the build path except as the
                           origin of src/data/aidm-framework.json.
.github/workflows/deploy.yml
```

## i18n (added 2026-07-15, Regina's explicit request)

English is the default locale, served unprefixed (`/`, `/research/`, ...). Portuguese lives
under `/pt/` (`/pt/`, `/pt/research/`, ...), configured via Astro's built-in `i18n` routing in
`astro.config.mjs` (`prefixDefaultLocale: false`).

**Pattern — read this before adding a page.** Every page/component determines its own
language via `Astro.currentLocale` (derived from the request URL) — never via a prop. This
means the *same* page file can be rendered as both the English page and, unmodified, as the
Portuguese page's content: `src/pages/pt/index.astro` just does
`import Home from '../index.astro'; <Home />`, and because `Astro.currentLocale` is resolved
from the actual URL being rendered (`/pt/`), the imported component picks up Portuguese
automatically. This is why `src/pages/pt/{index,research,framework,about}/index.astro` are
all 3-line wrapper files — **do not duplicate markup into them**, just import and render the
canonical page. Confirmed working (verified in build output and in-browser) before relying on
it further.

Inside a lang-aware file: `const lang = (Astro.currentLocale ?? defaultLang) as Lang; const t
= useTranslations(lang);` (from `src/i18n/ui.ts`), then reference `t.section.key` for every
string. Internal links must go through `localizePath(path, lang)` so they stay on the current
locale (e.g. the "All publications →" link, the Framework card's CTA, nav links).

**What's translated vs. not:**
- Fully translated: nav, hero, framework-card chrome, selected-research/currently/about/
  research-page/framework-page/footer copy, meta titles/descriptions. All professional PT-PT,
  drafted by Claude — **Regina should proofread it**, it has not been reviewed by a native
  speaker beyond the translator (Claude) itself.
- The Framework's real content (`whatItIs`) is locale-split (`src/content/framework/en.md` /
  `pt.md`) and both are translated. Its one still-placeholder field (`version`) is also
  translated *as a placeholder label* — `[VERSÃO]` on the PT side — since the real version
  number doesn't exist yet in either language. (`framingQuestion` was removed from this
  collection entirely on 2026-08-05 — see Framework page below — so it's no longer part of
  this picture.)
- **Not translated, by design**: research publication titles, authors, and venues — these
  stay in their original published form in both locales (translating a paper's title would
  misrepresent it). `soWhat` (the plain-language summary on the 3 selected papers) **is now
  real text, written in English only** (resolved 2026-08-06, see Research page below) — the PT
  pages currently show the same English `soWhat` sentence, which is a real translation gap, not
  placeholder bookkeeping. **When Regina wants PT so-what summaries, the `research` collection
  schema will need a per-locale field** (e.g. `soWhat_pt`) or a locale split like `framework/`;
  it isn't set up for that yet. (The `context` field this note used to also mention was removed
  outright on 2026-08-06 — it was always English-only placeholder text and never shipped.)
- **Not built at all**: `/pt/writing/` and per-locale post routing. Writing has zero posts and
  isn't in the nav yet, so this was deferred rather than speculatively designed. Decide the
  approach (mirrored posts per locale vs. single-language posts cross-linked) when the first
  post is actually written.

**Language switcher**: in `Header.astro`, `EN / PT`, always links to the equivalent path in
the other locale (via `getCanonicalPath` + `localizePath`), with the active language
highlighted in coral.

**Placeholder rendering**: any frontmatter/copy value that's still a literal `[BRACKETED]`
token renders through `<Placeholder value={...} />` as a visibly-distinct dashed iris chip
(`.placeholder-chip` in `global.css`) instead of shipping silently as real content. Check
`src/lib/placeholder.ts` before adding new owed-content fields — reuse the same pattern.

**Adding content**: new publication → add a `.md` file under `src/content/research/`. Update
the framework → edit `src/content/framework/framework.md` frontmatter directly (that's the
whole point of the Markdown/frontmatter approach — no component changes needed). New writing
post → add a `.md` file under `src/content/writing/`, then move the `Writing` link into
`src/components/Header.astro`'s `nav` array once the first one ships.

**Verified 2026-07-15**: `npm install && npm run build` succeeds. Dev server smoke-tested with
Playwright — home, /research/, /framework/ all render correctly against the design tokens,
zero console errors. (One rendering bug was found and fixed during that check:
`.placeholder-chip` was sized in `em` units, which blew up inside large display headings and
caused overlapping text — it's now fixed-size with `line-height: 1.5` and
`vertical-align: middle`, see `src/styles/global.css`.)

**Verified 2026-08-05**: after the Framework page rebuild, `npm run build` produces 44 static
pages (up from single digits — the 35 study pages account for most of that) with no errors.
Playwright-tested the interactive parts specifically, since those are new: clicking a factor
node opens its modal and updates the URL hash; Esc closes it, clears the hash, and returns
focus to the node that opened it; loading `/framework/#factor-<id>` directly opens the right
modal (including one of the two zero-mechanism factors, to confirm the empty state renders
deliberately rather than looking broken); the `s-timepressure-2024` incomplete-record study
page renders with no literal "null" or "UNRESOLVED" text on screen. Zero console errors
throughout.

**Verified 2026-08-19** (post cleanup-pass): `npm run build` produces 65 static pages (56 study
pages + 9 others — see Data model above for why the study count grew from 35), no errors,
after: removing dead code from `src/lib/aidm.ts` and `FrameworkFigure.astro` (see Data model
above), removing the dormant research-page type-filter mechanism (see Research page below),
stripping the internal note bodies from all 8 research entries, and deleting the old root
HTML5 UP site. Not re-run through Playwright this pass (the changes were dead-code removal and
content edits, not new interactive behaviour) — worth a fresh interactive check before this
goes live if it's been a while since the 2026-08-05 pass above.

## Remaining steps (not yet done)

- [ ] Nothing is committed yet — first commit + push of the Astro site is still pending.
      Until that happens, none of the below (Pages source switch, deploy workflow) has
      anything to act on. The commit needs to include both the new `src/` etc. and the
      2026-08-19 deletion of the old root site files (see Where things stand above).
- [ ] Ask Regina before switching GitHub Pages source to "GitHub Actions" in repo settings —
      required for `.github/workflows/deploy.yml` to actually publish.
- [x] ~~Ask Regina before removing the old root `index.html` / `assets/` / `images/`~~ —
      **done 2026-08-19**, Regina asked for it directly (see Where things stand above).
- [ ] Placeholders below filled in by Regina.
- [ ] Writing's first post (SNS AI-adoption policy brief) — once written, add the nav link.
- [ ] Re-confirm the "Currently" section dates/wording are still true before shipping — it was
      drafted 2026-07-15 and rewritten at least once since (current copy is in `src/i18n/ui.ts`,
      not necessarily verbatim what's quoted under Currently below — that section's quoted
      block may lag actual copy; treat `src/i18n/ui.ts` as the source of truth and diff against
      it rather than trusting the quote). Re-check on every pass through this file.

## Positioning (the one thing every page must serve)

> I study how people and AI make decisions together — and I'm moving that work toward health
> systems and public policy.

Audience: someone from health policy, research, or an institution (FFMS, JRC, a think tank)
looking her up, who needs to confirm this within a few seconds. Not an academic homepage —
no teaching tab, no "research interests" list, no third-person bio. Publications are present
and complete but are not the argument.

## Site map

| Page | Nav label | Status at launch |
|---|---|---|
| Home | — | Ship |
| Research | Research | Ship |
| Framework (resource 1) | — (not in nav) | Ship — reachable only via the Research page's highlight card and its own `/framework/` URL, **deviates from the original brief** (see below) |
| About | About | Ship — **full page at `/about/`, deviates from the original brief** (see below) |
| Writing | Writing | Build route + template, **do not add to nav** until ≥1 post exists |
| Contact | Contact | Ship (footer strip is fine, doesn't need its own page) |
| Resource 2 | — | **Do not build.** Not decided yet. Only prep: make the Framework page a reusable template (header/meta bar/changelog/citation block) so a second, differently-shaped resource can reuse it without a refactor. No "Resources" nav item, no index page for a single resource. |

Nav: `Research · About · Contact` (three items — see deviation below).

**Deviation from the original brief (2026-08-05, Regina's explicit call — "simplify at
maximum")**: the brief put Framework in the main nav alongside Research/About/Contact. Regina
asked for it removed from the nav entirely — Framework should be reachable only from the
Research page (where the highlight card already lived) and by its own direct URL, not
advertised as a top-level site section. `src/components/Header.astro`'s `nav` array now has
three items; `t.nav.framework` was removed from `src/i18n/ui.ts` as unused. The homepage's own
Framework highlight section was removed too (`src/pages/index.astro` no longer imports
`FrameworkCard`) — Home is now Hero → Selected research → Currently → Contact strip. The
Research page's Framework card is unchanged and is now the *only* on-site promotion of it.

**Deviation from the original brief (2026-07-15, Regina's explicit call)**: the brief said
About should stay a homepage scroll-to section unless the copy outgrew it. Regina asked for it
to be a real, dedicated page instead — not something people scroll toward. It now lives at
`src/pages/about/index.astro`, written in a professional-but-first-person voice (background,
current direction, one paragraph on outside interests). The Header nav link points to
`/about/`, not `/#about`. The old homepage About section and its portrait block were removed
from `src/pages/index.astro`; the portrait placeholder now lives on the About page only.

**Resolved (2026-08-06)**: portrait is `public/portrait.jpg` (Regina added it directly, renamed
from the original `IMG_7078 (1).jpg` — no spaces/parens in the served filename). Rendered as a
real `<img>` in the `.portrait` box in `src/pages/about/index.astro` (`object-fit: cover`,
`overflow: hidden` on the container so it respects the rounded corners); the iris→coral
gradient background is still there underneath as a fallback if the image ever fails to load.
`t.about.portraitPlaceholder` is gone from `src/i18n/ui.ts` (both locales) — no longer needed.

**Title and header removed (2026-08-06, Regina's explicit call)**: the page's `<h1>`
("Research that takes human judgment seriously.") and its lead paragraph (the "I'm Regina de
Brito Duarte, a PhD candidate..." self-intro) are gone — both restated things already said on
Home, and Regina didn't want that repeated here. The page is now portrait + plain prose only,
no heading of any kind. Structurally: the old two-section layout (`.header` grid with
portrait+intro, then a separate `.body` prose section) collapsed into one `.content` section —
portrait and the full paragraph block now sit side by side in the same grid
(`align-items: start`, since the text column is much taller than the square portrait).
`t.about.heading` and `t.about.lead` are gone from `src/i18n/ui.ts` on both locales — if
either is ever wanted back, they'll need re-adding, they're not just hidden.

**Real background content, replacing the placeholder (2026-08-06)**: the "before the PhD"
placeholder is gone — Regina rewrote `about` entirely as four real paragraphs (`paragraph1`–
`paragraph4` in `src/i18n/ui.ts`, both locales): PhD focus and affiliations (IST, INESC-ID,
Center for Responsible AI), education (BSc Applied Mathematics, FCUL; MSc Data Science and
Engineering, IST) and three years' industry experience before the PhD (Data & AI Consultant at
Unipartner, then Risk Data Scientist at BNP Paribas Personal Finance), current research and
publications, and the move toward public policy (postgraduate in Evaluation of Public Policy
at ISCTE, starting September 2026 — plus a nice detail: her first research work in 2019 used
complex networks and evolutionary game theory to study corruption dynamics). No more
`Placeholder` import needed in `src/pages/about/index.astro` — nothing on this page is
placeholder content anymore. `beforePhdPrefix`/`beforePhdPlaceholder` are gone from
`src/i18n/ui.ts` on both locales, replaced by a plain `paragraph2`.

**Pattern to watch for going forward**: this edit also touched `hero.lead`, `currently.items`,
`researchPage.framing`, and `footer.heading`/`body` on the `en` block, all with real, richer
copy. Since `pt` is a separate hand-maintained object (not auto-translated), **any edit to
`en` in `src/i18n/ui.ts` needs its `pt` counterpart updated in the same pass, or the two
locales silently drift** — TypeScript's `pt: typeof en` typing only catches *shape* mismatches
(added/removed keys), not stale *content* in a key that still exists on both sides. All four
of the above were re-translated into PT-PT as part of this fix; check `git diff` on this file
if new drift is suspected later.

## Global rules

**Voice.** First person. Sentence case everywhere except mono eyebrows (uppercase, wide
tracking). Short sentences, one idea per line. Lead with the finding, then the nuance.
Specific numbers set in display or mono, never buried in prose. No emoji.

**No em dashes (2026-08-12, Regina's explicit call, reversing the earlier "Em-dashes fine"
rule).** Site prose now uses periods, commas, colons, semicolons, or parentheses instead,
whichever reads most naturally in context; title/meta separators (`"Research · Regina de
Brito Duarte"` etc.) switched to the interpunct `·` already used for metadata elsewhere on
the site (subline, meta rows), rather than an en dash. Applied throughout `src/i18n/ui.ts`
(both `en` and `pt`), `src/content/framework/{en,pt}.md`, the hardcoded English prose in
`src/pages/framework/index.astro` ("The framework" / "Where the evidence stands" / "About the
evidence base" sections), `src/pages/framework/study/[id].astro` (title template, the
"Findings" disclosure summary renamed to "Full findings", the incomplete-record note), the
`writing/[...slug].astro` title template, and two research venue strings
(`src/content/research/2025-amplifying-effect-explainability-groups.md`,
`2026-llm-esc-cardiovascular-risk.md`). **Deliberately not applied** to
`src/data/aidm-framework.json` (factor/mechanism/study text, e.g. `factor.definition`, still
has em dashes) — that file is a Notion export, and per the note in `src/lib/aidm.ts`, individual
records shouldn't be hand-edited; it gets re-synced wholesale. If Regina wants the evidence
base itself dash-free, that has to happen at the Notion source and be re-exported, not patched
here.

**Mono eyebrows are gone from the entire site, including `Eyebrow.astro` itself (removed
outright at some point after 2026-08-12 — not dated precisely, caught during the 2026-08-19
cleanup pass when the component no longer existed in `src/components/`).** The brief
originally specified an uppercase mono kicker above most headings (`AI · HCI ·
EVIDENCE-BASED POLICY`, `CURRENTLY`, `PEER-REVIEWED`, `PUBLICATIONS`, `ABOUT`, `CONTACT`,
`RESOURCE · WORKING DRAFT`, "Coded study" on study pages). Regina found them crowding rather
than explaining and had them removed everywhere, first from the main site (2026-08-05) and
since then from the standalone Framework study pages too — `src/pages/framework/study/[id].astro`
has no eyebrow above its `<h1>` today. **Don't add an Eyebrow component back reflexively** —
if a section needs a label, reach for the heading text itself first. When editing a page that
had one, its heading loses the top margin that used to separate it from the eyebrow (margins
were tuned assuming the eyebrow sat above); check the heading is the first element in its
section before restyling.

**Design** (tokens live in `src/styles/rbd/tokens/*.css`, from the `rbd-design` skill). Ivory
canvas (`--ivory #FAF6EF`), white cards, coral (`--coral-300 #F6956A`) as the signature accent
carrying the single most important idea per screen, iris (`--iris-200 #D8C7FA`) as support.
Max two background colours per page. Cards 16px radius (`--radius-lg`), pill buttons
(`--radius-pill`). Soft warm shadows used sparingly — prefer hairline borders
(`--border-soft`). Content max ~1120px (`--maxw-content`), prose ~68ch (`--maxw-prose`).

**Motion.** Restrained: fade-up on entrance, `translateY(-3px)` lift on card hover. Nothing
bouncy, nothing looping.

**Placeholders.** Anything not yet confirmed by Regina renders as an iris-tinted inline chip,
visibly distinct from real content — never ships silently as lorem ipsum. Every open
placeholder gets listed at the top of the PR that introduces it.

## Home — section order

**Hero → Selected research → Currently → Contact strip.**

**Resolved (2026-08-05)**: the homepage's Framework highlight section was removed as part of
the nav simplification above — Framework is promoted from the Research page only now, not
from Home. The section spec below is kept for reference (the same card still exists, just
relocated) and because the Research page's copy of it is identical.

### Hero
- ~~Eyebrow: `AI · HCI · EVIDENCE-BASED POLICY`~~ **Removed 2026-08-05** — see mono eyebrows
  note under Global rules above. `t.hero.eyebrow` no longer exists in `src/i18n/ui.ts`.
- Headline (display, 800, ~56px desktop, max-width ~880px): originally "I study how people and
  AI make decisions together — and I'm moving that work toward health systems and public
  policy." **Shortened 2026-08-05 (Regina's explicit call, "title is too long")**: now just
  "I study how people and AI make decisions together." The dropped clause isn't lost from the
  page — the Lead line right below still carries the health/policy angle implicitly.
- Lead (~19px, `--ink-600`, max-width ~600px): "My research is about the moment a person has
  to decide whether to believe a machine. I'm interested in what that means once the machine
  is inside a hospital, and once a public institution is the one that bought it."
- Sub-line (mono, `--text-faint`): `PhD candidate, [INSTITUTION] · Lisbon, Portugal`.
  **Resolved (2026-07-15)**: institution is "IST and INESC-ID" (`src/pages/index.astro`).
- Optional `agent-bloom.png` motif, top-right, ~180px, low emphasis. No portrait here — that
  belongs in About.

### Framework card — now on the Research page only
Full-width card. Frame explicitly as a working draft (not a finished product) — version number
visible, so it's honest and free to change.
- ~~Eyebrow: `RESOURCE · WORKING DRAFT`~~ **Removed 2026-08-05**, same as elsewhere.
- ~~Heading: `[FRAMEWORK NAME] — a framework for human–AI decision-making`~~ **Tagline dropped
  2026-08-05 (Regina's explicit call)** — heading is now just the framework name on its own,
  no suffix. `FrameworkCard.astro`'s `<h2>` no longer references a `headingSuffix`; the key is
  gone from `src/i18n/ui.ts` on both locales (it briefly existed only on `pt` after an edit —
  cleaned up so the two locales can't drift out of sync like that again).
- Body: "A structured way to think about when a person should rely on an AI recommendation,
  and when the design should make it easier to say no. It comes out of my PhD, it's public,
  and it changes as the research does."
- Meta row: `Version [0.1]` · `Updated [DATE]` · CTA `Read the framework →`

**Resolved (2026-08-05)**: the framework has a real name now — "AI-Assisted Decision-Making"
— and real body copy (see Framework page below). `Version` is still a placeholder; `Updated`
is real (originally `2026-08-05`, the data export date).

**Updated (2026-08-19, Regina's explicit request)**: the `updated` field in
`src/content/framework/{en,pt}.md` was bumped from `2026-08-05` to `2026-08-19`. This was a
manual date refresh only — no new data export happened, `src/data/aidm-framework.json` is
unchanged. If `updated` is meant to always track the actual data export date going forward,
re-sync it whenever `aidm-framework.json` is re-exported rather than bumping it standalone.

**Colour changed (2026-08-05, Regina's explicit call)**: originally an `ink-900` (near-black)
background. Regina didn't like the dark card and asked for a purple from the palette instead —
`FrameworkCard.astro` now uses `--iris-700` (`#564085`) with `--iris-100`/`--iris-300` for
body/meta text (was warm greys tuned for near-black) and `--shadow-iris` instead of
`--shadow-lg`. Coral eyebrow/CTA unchanged — coral-on-iris still reads clearly. If this card is
ever restyled again, `--iris-700` is the "dark purple card" reference point, the same role
`--ink-900` used to play.

### Selected research
Two or three highlights, **list rows, not cards** (cards inflate three papers into a display
case). ~~Eyebrow `PEER-REVIEWED`~~ **removed 2026-08-05**, heading `Selected research`. Row =
`year · title · one-line "so what" · venue`, hairline rule between rows. The "so what" line is
plain language for someone outside the field, not the abstract. Three rows max, then
`All publications →` linking to /research.

### Currently — states the goals, reads as direction not a job ad
~~Eyebrow `CURRENTLY`~~ **removed 2026-08-05**, heading `Where the work is heading`. Mono label
+ text list.

**Rewritten 2026-08-05 (Regina's explicit call — "simplify at maximum")**: cut from 4 items to
2. The dropped "Studying"/"Working on" content (IPPS-Iscte, Hospital da Luz, co-supervision)
isn't lost from the site — the Hospital da Luz/co-supervision detail still lives in the About
page's third paragraph. Current copy, in `src/i18n/ui.ts`'s `currently.items`:

```
FINISHING  Final year of my PhD at IST, on AI-assisted decision-making.
NEXT       A postgraduate in public policy evaluation at IPPS-Iscte, focused on AI policy
           for science and health.
```
No "seeking opportunities" language. **A stale Currently block is the most damaging thing on
a personal site — whoever picks this work back up should check these dates are still true
before shipping, and re-check periodically after.**

### Contact strip
Dark footer, ink-900. Heading + one line on what she's open to + links. Full copy under
Contact below.

## Research page

Purpose: completeness, not persuasion — exists so nobody can dismiss her as unserious.

1. Header — ~~eyebrow `PUBLICATIONS`~~ **removed 2026-08-05**, heading `Research`, 2–3 sentence
   framing paragraph: "My research asks how people rely on AI when the stakes are real — when
   they over-rely, when they override, and what design and evaluation should do about it.
   Increasingly I'm asking the same question one level up: how institutions decide to adopt
   these systems in the first place."
2. Framework card repeated (same as homepage) — it's the thing she wants people to leave
   with, so it appears in both places. **Now the *only* place Framework is promoted on-site**
   — see nav simplification under Site map above; it's not in the Header nav or on Home
   anymore.
3. ~~Selected work — same 2–3 highlights, same row format, plus one extra sentence of context
   each.~~ **Removed 2026-08-05 (Regina's explicit call, "simplify at maximum")** — it
   duplicated the Home page's Selected Research rows in the same format. Research now flows
   straight from the framework card into the full list. **Cleaned up 2026-08-06**:
   `ResearchRow`'s now-dead `showContext` prop and the `context` schema field it rendered were
   removed entirely (not just left unused) — see the resolved note below.
4. Full list — everything, grouped by year, reverse chronological. Plain rows: authors,
   title, venue, year, links (PDF/DOI/code where they exist). No cards, no tags, no
   thumbnails. Dense and scannable.
5. ~~Optional type filter chips (Conference/Journal/Workshop/Preprint) only if the list
   exceeds ~15 items.~~ **Removed outright 2026-08-19 (Regina's explicit call — "I deal with
   more than 15 items later on").** The mechanism (`showTypeFilters`, the `filtersNote` i18n
   key, the `.filters-note` style) is gone entirely, not just dormant — with 8 entries it was
   dead code today and Regina would rather design the real filter UI when the list actually
   grows past 15 than carry a placeholder for it now. If/when that happens, it needs
   rebuilding from scratch (real chips filtering `blocks`/`allResearch` by `entry.data.type`,
   not just resurrecting the removed note).

**Publication data sourced from Google Scholar**
(`https://scholar.google.com/citations?user=pL_DRrQAAAAJ`). Originally seeded as 13 entries,
then **curated down to 8 by Regina** (2026-07-15) — she removed workshop/doctoral-consortium
pieces and superseded preprint/duplicate versions that weren't full papers, and added the real
PDF link to every remaining entry. **Links confirmed 2026-08-19**: Regina checked all 8
entries' data, so the internal Markdown-body notes each file carried below its frontmatter
("Source: Google Scholar. Confirm links...") were removed — research entries are frontmatter-
only now (nothing ever rendered that body text on-site; it was a private checklist, not
placeholder content, but it was also stale — a couple of entries still said "add the
plain-language summary" after `soWhat` had already been filled in). Also fixed a typo while in
there: `2023-ai-trust-explainable.md`'s `soWhat` had "not garannteed" → "not guaranteed".
Current full list, in `src/content/research/`:
- "AI trust: Can explainable AI enhance warranted trust?" — Human Behavior and Emerging
  Technologies, 2023. **Selected.**
- "The amplifying effect of explainability in AI-assisted decision-making in groups" —
  CHI 2025. **Selected.**
- "AI assistance in medical decision-making: the role of recommendations and explanations in
  simulated clinical cases" — ACM Transactions on Computing for Healthcare, 2026. **Selected.**
- "Effects of interaction and explanation type on human-AI collaboration for fake news
  detection" — IEEE Access, 2026.
- "Large language models approach clinician performance in ESC cardiovascular risk
  stratification" — European Heart Journal – Digital Health, 2026.
- "Dissecting medical referrals in health services: role of physician professional networks" —
  BMC Health Services Research, 2026.
- "Assistant robots with an agenda foster uncooperative behaviors" — IEEE RO-MAN, 2025.
- "Looking for cognitive bias in AI-assisted decision-making" — HHAI Workshops, 2024.

**Resolved (2026-08-06)**: `soWhat` (the plain-language summary shown on Home and Research) is
now real text on all three selected entries, written by Regina directly in each entry's
frontmatter. `context` (the one extra sentence that was meant to show *only* in the Research
page's "Selected work" section) was never filled in beyond its
`[ONE EXTRA SENTENCE OF CONTEXT...]` placeholder, and had been fully dead since "Selected work"
was removed from the Research page (nothing read it anymore). **Removed outright** as part of a
2026-08-06 cleanup pass: the `context` field is gone from `src/content/config.ts`'s `research`
schema, the placeholder line is gone from all three selected entries' frontmatter, and
`ResearchRow`'s `showContext` prop plus its `.context` styles are gone from the component. If a
per-paper "extra sentence for Research specifically" concept is wanted again later, it'll need
re-adding from scratch, including a page section that actually renders it.

**Series clustering**: the `research` schema still has an optional `seriesLabel` field
(`src/content/config.ts`) and `src/pages/research/index.astro` still knows how to render
entries sharing a label as one cluster instead of splitting them by year — this was used for a
referral-mechanisms cluster (GNN paper → arXiv preprint → BMC journal paper) that no longer
applies now that the preprint and workshop versions were removed as duplicates. The mechanism
is dormant, not deleted — reuse it if a future publication has multiple citable versions
(e.g. a preprint that later gets a journal DOI).

## Framework page (resource 1)

Purpose: the site's one piece of genuine infrastructure at launch — something people link to
for its own sake.

**Rebuilt 2026-08-05 around real content.** The framework has a name now
("AI-Assisted Decision-Making") and a real evidence base — this is no longer a placeholder
page. Source material lives in `AIAssistedDM/` at the repo root:
`2026-08-05-aidm-framework-data.json` (the data) and `2026-08-05-aidm-website-spec.md` (the
original build spec, written independently of this Astro site — it specifies a portable
single-file HTML artifact with hash-based routing throughout; **this implementation adapts
that spec to the site's actual multi-page Astro architecture rather than following it
literally** — see deviations below). Still present but no longer needed for the build:
`Framework.xlsx` (the pre-export spreadsheet) and `_PhD__CAT_Regina_V4.pdf` (the thesis-
proposal deck the framework is drawn from) — reference material, not build inputs.

**Data model.**
- `src/data/aidm-framework.json` — canonical copy of the JSON snapshot. **Counts have grown
  since the original 2026-08-05 export and are worth re-checking with
  `node -e "const d=require('./src/data/aidm-framework.json'); console.log(d.factors.length,
  d.mechanisms.length, d.studies.length)"` rather than trusting a number written here** — as
  of 2026-08-19 it's **10 factors, 23 mechanisms, 56 coded studies** (up from the original 9 /
  12 / 35; see `src/lib/aidm.ts`'s comments for what changed: `f-need-for-cognition` was
  removed as a factor, `f-task-uncertainty` was split out of `f-difficulty`, and
  `f-number-of-ai-advisors` was added, alongside 5 new mechanisms and 4 new coding fields —
  `advice_stance`, `advisor_agreement`, `number_of_advisors`, `interaction_modality`). All
  relationships pre-resolved. **To update the framework's content: re-export from Notion and
  replace this file wholesale — don't hand-edit individual records.**
- `src/lib/aidm.ts` — typed data access: `factors`, `mechanisms`, `studies` arrays plus
  helpers (`getFactorsByComponent`, `getMechanismsBySupport`, `getMechanismsForFactor`,
  `parseManipulatedFactors` for the `"XAI: Feature importance"`-style prefix strings,
  `splitSubFactors` for the ` · ` delimiter, `getAiDesignSubfields`/`getXaiSubfields`/
  `getAdvisorSubfields`/`getTeamSubfields` and their `is*Trivial` counterparts for the
  per-study figure personalization on study pages, etc.). Read this file's comments before
  touching the data shape — it documents the field gotchas from the spec (e.g. both
  `Difficulty:` and `Uncertainty:` prefixes used to map to `f-difficulty`, back when task
  uncertainty was a sub-factor rather than its own node; `f-stakes` and
  `f-need-for-cognition` — the latter now removed as a factor entirely, see above — have/had
  zero mechanisms by design, not by bug). **Cleaned up 2026-08-19**: the unused `getComponent`
  helper, the unused `slugify` helper, and the unused `meta` export (plus the `AidmData.meta`
  type) were removed — nothing on the site ever read Notion's export metadata
  (title/exported/source/counts/etc.), only the factors/mechanisms/studies arrays.
- `src/content/framework/{en,pt}.md` — NOT the framework's substantive content anymore (the
  old `elements[]` field is gone). Just page chrome: `name`, `version`, `updated`, `licence`,
  `whatItIs`, `feedbackEmail`. No `framingQuestion` or `changelog[]` — both were removed from
  the schema outright (see the "Simplified after Regina's first review pass" and "Made
  standalone" notes further down).

**Pages.** (Both sections below are stale on a few specifics relative to the live implementation
— see "Simplified after Regina's first review pass" and the intro-copy note under Placeholders
further down for what actually changed and when.)
- `src/pages/framework/index.astro` — Level 1: header/meta-bar/cite-this (from the content
  collection), a "What it is" / "Why it matters" intro section (the latter citing EU AI Act
  Article 14 — this is real written copy now, not a placeholder, see
  `t.frameworkPage.whatItIsText`/`whyItMattersText` in `src/i18n/ui.ts`), the three-column
  figure (`FrameworkFigure`, interactive) with a short intro and a "every framework is a
  simplification" caveat note, a mechanism grid (`MechanismCard`, all mechanisms ordered by
  support via `getMechanismsBySupport()` — **there is no above/below-bar split anymore**; the
  first 4 show and a "Show all N mechanisms →" button reveals the rest), an About/Method
  section on how the evidence base was built (with two live links out to Regina's Notion
  workspace — see the 2026-08-12 resolved note further down), and a feedback/maintainer line.
  All factor modals (`FactorModal.astro`, one per factor — 10 as of 2026-08-19, see Data model
  above) render at the bottom of the page and are opened/closed by a small vanilla-JS block
  (see below).
- `src/pages/framework/study/[id].astro` — one real static page per study (56 pages as of
  2026-08-19, `getStaticPaths` off `src/lib/aidm.ts`'s `studies` array — re-run the node
  one-liner under Data model above if this count is suspected stale). Header with read/own-work/
  incomplete badges, a compact `FrameworkFigure` personalized to that study's own coding (no
  separate coding table — see "Simplified" note below), outcomes chips, findings prose
  (research questions/authors' framing/design notes/summary of findings — sections skipped
  rather than printing "null"), evidence links back to the framework, and the external
  DOI/arXiv link (hidden when absent).

**Deviations from the original spec** (`2026-08-05-aidm-website-spec.md`), and why:
1. **Not one self-contained `index.html`.** The spec's hash-routing-everything and inlined-
   JSON requirements existed to make the artifact portable (`file://`, drop into any site, no
   build step). Once this lives inside the Astro site, none of that applies — Astro already
   provides the build step, and the JSON is imported as a normal module.
2. **Study pages are real static routes** (`/framework/study/<id>/`), not `#/study/<id>` hash
   routes. Strictly better here: real crawlable URLs, works without JS, no reason to give that
   up now that portability isn't a constraint.
3. **The factor modal still uses a `#factor-<id>` hash** (close to the spec's
   `#/factor/<factor-id>`) for shareability/back-button support, implemented with the native
   `<dialog>` element (`showModal()`) rather than a hand-rolled modal — native `<dialog>`
   already gives focus trap, `role="dialog"`/`aria-modal`, and Esc-to-close for free, which
   covers most of the spec's "non-negotiable" modal behaviour list with far less code. Scrim
   click, focus-return-to-opener, and hash sync are the only custom bits, in
   `framework/index.astro`'s inline `<script>`.

**Resolved (2026-08-12): two Notion links, not the per-record `notion_url`s.** Regina asked
for the "About the evidence base" section's first paragraph rewritten (first-person account of
how the framework's factors/mechanisms emerged from coding papers — the old stats paragraph
using `meta.structure`/`meta.counts` is gone, and the `meta` import was dropped as unused).
Within that new copy, two phrases are now live outbound links to specific Notion pages Regina
provided: "Framework Evidence Base" →
`https://app.notion.com/p/8d6bcfe05aa943a7ae89ba583c9166e9?v=c5071d1615b54d41879f885bc52ba45c&source=copy_link`,
"Codebook" →
`https://app.notion.com/p/1544452761aa4c4bac2fa7407af1cdf1?v=25f4ff182ef4492192540eab1d5e8261&source=copy_link`
(both `target="_blank" rel="noopener"`, styled via a new `.about-section p a` rule). This is
narrower than the original open question below — it's two hand-picked share links, not the
per-record `notion_url` field on every factor/mechanism/study, which remains unresolved:

**Open decisions carried over from the spec's own §10 — not resolved, ask Regina:**
- **Per-record Notion links.** The raw JSON still carries a `notion_url` on every
  factor/mechanism/study record, plus a top-level `meta.source_url` — but `src/lib/aidm.ts`
  no longer even types or reads `meta` at all (removed 2026-08-19 as dead code, see Data model
  above), so this would need adding back to the `Factor`/`Mechanism`/`Study` interfaces if
  ever rendered. **None of these are rendered anywhere on the site** — the workspace may be
  private, and the spec itself flags this as undecided. Safe default until Regina confirms
  either way.
- ~~Below-bar mechanisms~~ — **moot, overtaken by a redesign.** The spec's above-bar/
  below-bar split doesn't exist in the current implementation at all: `/framework/` now shows
  every mechanism (23 as of 2026-08-19) ordered by support via `getMechanismsBySupport()`,
  with the first 4 visible and a "Show all N mechanisms →" button revealing the rest — no
  mechanism is hidden inside a modal-only "below bar" tier. If Regina ever wants a
  strong/weak-evidence visual distinction back, that's a fresh design decision now, not a
  resolution of this old one.
- **`s-timepressure-2024`** — shipped with the honest incomplete state the spec describes
  (blanked author/link/summary in the source data). Not fixed at the Notion level.
- **Own-work badge** — `s-debritoduarte-2023` is flagged "Author's own work" on its study
  page. Could be removed if Regina would rather it not stand out.

**i18n scope decision (2026-08-05):** the framework's actual evidence-base content — the
figure's factor names/definitions, the narrative mechanism cards, the About/Method prose, all
56 study pages (count as of 2026-08-19, see Data model above) — is **English-only**, on both
`/framework/` and `/pt/framework/`. This is dense, technical, evidence-graded material;
translating it carelessly risks misrepresenting what a mechanism's evidence actually supports,
which matters more here than elsewhere on the site. The `/pt/framework/` page shows a
translated banner saying so (`t.frameworkPage.dataNote` in `src/i18n/ui.ts`) and everything
*around* the evidence base (nav, meta bar, cite-this, feedback line, `whatItIs`) is still
fully translated, same as the rest of the site. If Regina wants the evidence base translated
later, do it deliberately with her review, not as a bulk auto-translate pass.

**Colour language (corrected 2026-08-19 — the previous version of this note described a
`{Coverage,Status,Direction}Badge.astro` component set that no longer exists in the repo; it
was presumably replaced by a simpler design at some undocumented point).** There's no
above/below-bar or coverage-strength colour scale anymore (see the "moot, overtaken by a
redesign" note under Open decisions above). What's actually there today: in `FactorModal`,
supporting evidence links are labelled green and contradicting evidence links red
(`.evidence-label.support`/`.contradict`); a study's "Author's own work" tag is iris and its
"This record is incomplete" tag is amber (`src/pages/framework/study/[id].astro`); manipulated
factors get a coral "Manipulated" flag on the figure node; mechanism "affects" tags are a
neutral steel colour with no valence attached (a mechanism "increasing" something isn't
inherently good or bad — increasing over-reliance is bad, increasing accuracy is good — so the
chip colour doesn't try to imply one).

**Simplified after Regina's first review pass (2026-08-05):**
1. **Study pages personalize the figure instead of duplicating a coding table.** Each factor
   node on a study page now shows that study's own coded value directly (e.g. "Expertise
   level — Low (lay users)", "Need for Cognition — Not measured") instead of the generic
   coverage badge/mechanism count, and the component description text is dropped in this mode
   — both were repeating information already on the main framework page rather than saying
   anything about the study itself. The standalone "Coding" table is gone; `FrameworkFigure`
   takes a `codingByFactor` prop (`src/components/aidm/FrameworkFigure.astro`) that switches
   each node into this personalized display, and manipulated factors (`coding.<field> ===
   'Manipulated'`) get the highlight ring instead of a separately-computed set. The "specific
   categories manipulated" chips below the figure (e.g. `Stakes: Low / High`) stayed — that's
   still new information the coding value alone doesn't carry.
2. **The Level 1 page dropped the framing-question display and the section jump-menu.** Both
   the "When should a person trust the machine..." display line and the sticky `The framework
   · The evidence · About the evidence base · Changelog` nav are gone from
   `src/pages/framework/index.astro`. The `framingQuestion` field is gone from the content
   collection schema and both `en.md`/`pt.md` entirely (it's genuinely unused now, not just
   hidden) — if a framing statement is wanted back later, it'll need re-adding to the schema.
3. **Factor modals dropped "What's missing."** `FactorModal.astro` no longer renders
   `factor.gap_note` at all, in either its zero-mechanism lead state or the closing block after
   a factor's mechanism list. Zero-mechanism factors now show one plain sentence ("No mechanism
   has cleared the evidence bar for this factor yet.") with no label. The `gap_note` field is
   still present in the JSON data model (`src/lib/aidm.ts`'s `Factor` interface) — it's simply
   not rendered anywhere; harmless to leave in the data even though nothing reads it.

**Made standalone, on Regina's explicit request (2026-08-05).** The framework is reachable
*from* the main site (Header nav "Framework" link, the `FrameworkCard` teaser on Home/Research
— both unchanged) but once a visitor is on `/framework/` or a study page, it no longer looks
like a page *of* reginabduarte.github.io:
- **`src/layouts/FrameworkLayout.astro`** replaces the site's `Layout.astro` for both
  `src/pages/framework/index.astro` and `src/pages/framework/study/[id].astro`. No `Header`
  (site nav: Research/Framework/About/Contact, the `rbd` brand mark), no `Footer` (the dark
  site-wide contact strip). It's a bare `<html>` shell — just meta tags, favicon, and `<slot
  />` — plus the `hreflang`/canonical tags every page needs regardless of chrome. Take a
  `translated={false}` prop on pages with no locale counterpart (the study pages — see below)
  so it doesn't emit `hreflang="pt"` links to URLs that don't exist.
- **The "RESOURCE · WORKING DRAFT" eyebrow is gone** from the Level 1 header — that framing
  only made sense when the page read as one resource among several on Regina's site.
- **The EN/PT language toggle moved from the site Header into the page itself** — a small
  inline element at the top of `framework/index.astro`'s header section, built the same way
  Header.astro's used to (`getCanonicalPath` + `localizePath` from `src/i18n/ui.ts`). Study
  pages don't have one; they're English-only with no PT route at all (nothing changed there).
- **Exactly one link back to the main site, and it's absolute on purpose.** The feedback line
  at the bottom of the Level 1 page now reads "...I'd genuinely like to hear it —
  [email]. This framework is maintained by **Regina de Brito Duarte**" with the name linking to
  `MAIN_SITE_URL = 'https://reginabduarte.github.io/'`, hardcoded as a literal constant in
  `framework/index.astro` — deliberately not a relative `/`, which would resolve to the wrong
  place the moment this framework is hosted somewhere else. This is the **only** intentional
  outbound link to the personal site anywhere in the framework pages; study pages don't have
  one at all.
- **Changelog is gone — not hidden, removed.** No changelog section renders anywhere, and the
  `changelog` field is gone from the framework content-collection schema and both `en.md`/
  `pt.md` files (same "genuinely unused, not just hidden" treatment as `framingQuestion`
  above). Revision history for the framework lives in this file and in git, not on the page.

**Portability, per Regina's request ("easy to put the framework into a completely different
server and website").** The self-contained set of files is: `src/pages/framework/**`,
`src/layouts/FrameworkLayout.astro`, `src/components/aidm/**`, `src/lib/aidm.ts`,
`src/data/aidm-framework.json`. Two shared dependencies remain, both easy to carry over or
drop: `src/styles/global.css` (the `rbd-design` tokens — just CSS, portable as-is) and
`src/i18n/ui.ts` (only needed for the Level 1 EN/PT toggle; strip it, and the toggle, if the
framework moves somewhere that doesn't need Portuguese). If this actually moves to a different
server later, update `MAIN_SITE_URL` above only if reginabduarte.github.io's own URL changes —
it doesn't need to change just because the framework moved.

## Writing page

Build the route and template now. **Do not add to nav until ≥1 item exists** — an empty
Writing tab advertises the exact gap the site exists to close.

Template per piece: title, one-line standfirst, date, reading time, and — for briefs
specifically — a 3-bullet "recommendations" block near the top, before the body (many readers
never open the PDF; the page has to work standalone).

Index page: reverse-chronological list, title + standfirst + date. That's all.

First item, when it exists: policy brief on AI adoption in the SNS.

## Contact

Can be a footer strip on every page rather than its own page.
- ~~Eyebrow: `CONTACT`~~ **Removed 2026-08-05**, same as elsewhere on the main site.
- Heading: "If you're working on how AI lands in health systems, I'd like to hear from you."
- Body: "Open to policy briefs and commissioned analysis, advisory work with hospitals and
  public institutions, and conversations about research that needs translating into something
  usable."
- Links: `[EMAIL]` · LinkedIn · Google Scholar · `[CV (PDF)]`
- Name what she's open to explicitly — implicit invitations don't get taken up.

**Resolved (2026-07-15)**: email is `reginaduarte@tecnico.ulisboa.pt` (confirmed by Regina —
supersedes both addresses on the old site); Google Scholar is
`https://scholar.google.com/citations?user=pL_DRrQAAAAJ&hl=pt-PT&oi=ao`. Both are live in
`src/components/Footer.astro` and the framework page's `feedbackEmail`. LinkedIn
(`https://www.linkedin.com/in/regina-duarte/`) carried over from the old site, unconfirmed.

**Resolved (2026-08-06)**: CV is `public/CV_ReginaDuarte_2026.pdf` (Regina added the file
directly). `Footer.astro`'s `cvHref` points at `/CV_ReginaDuarte_2026.pdf`, opens in a new tab
(`target="_blank"`, matching LinkedIn/Scholar), and `t.footer.cvLabel` in `src/i18n/ui.ts` is
now plain "CV (PDF)" text on both locales — no longer a placeholder chip. **If the CV is ever
replaced, either overwrite this exact filename in `public/`, or update both `cvHref` here and
the filename to match** — nothing derives the link from the file automatically.

## Placeholders Regina owes (block launch until filled)

**Resolved, no longer owed (both caught stale during the 2026-08-19 cleanup pass — this list
had not been re-checked against the actual site since the Framework page grew):**
- ~~`[VERSION]` for the framework meta bar~~ — `version` is `"V1.0.0"` in both
  `src/content/framework/{en,pt}.md`, real content, not a bracketed placeholder. `updated` is
  also real (`2026-08-19`, see the dated note under Framework card above).
- ~~The framework's intro copy (2–3 short paragraphs) at the top of `/framework/`~~ — this is
  now the "What it is" / "Why it matters" section, real written copy (`t.frameworkPage.
  whatItIsText`/`whyItMattersText` in `src/i18n/ui.ts`), not a placeholder chip. No
  `<Placeholder>` is used anywhere on `/framework/` for this content.

**Still open:**
- The four open decisions on the Framework page carried over from the build spec's own §10
  (Notion links, below-bar mechanism visibility, the `s-timepressure-2024` incomplete record,
  the own-work badge) — see Framework page above
- Whether the Hospital da Luz field study can be named publicly yet
- LinkedIn URL (confirm still current)
- **Native-speaker proofread of all Portuguese copy** in `src/i18n/ui.ts` and
  `src/content/framework/pt.md` — drafted by Claude to a professional PT-PT standard, and
  re-synced + polished on 2026-08-06 after the English copy changed (hero, currently, about,
  footer, research framing), specifically checking for PT-BR interference (calibrated against
  a native PT-PT reference source). Still not reviewed by an actual native speaker or by
  Regina — an AI proofreading pass, however careful, isn't a substitute for that. **Caught and
  fixed 2026-08-12**: "framework" (an English loanword kept as-is in the PT copy, per the
  brief) had been treated as grammatically masculine throughout ("o framework", "este
  framework", "um framework", plus agreeing adjectives like "mantido"/"construído") — Regina
  flagged that it reads as feminine ("a framework", "esta framework"). Fixed everywhere it
  occurred: `src/i18n/ui.ts`'s `pt` block (`frameworkCard.cta`, `frameworkPage.
  maintainedByPrefix`/`dataNote`/`disclaimer`, `meta.frameworkDescription`) and
  `src/content/framework/pt.md`'s `whatItIs` (including the participle `construído` →
  `construída` and the predicate adjective `público` → `pública`; the predicate noun "um
  rascunho" stayed masculine on purpose, since predicate nouns don't agree with the subject's
  gender in Portuguese). This is a spot-fix, not the missing native review above — worth
  re-checking for the same masculine-default reflex elsewhere if more PT copy is added later.

## Explicitly do not do

- No empty sections shipped live
- No "coming soon"
- No third-person bio
- No stock photography
- No dark mode (system is light-first by design)
- No tags/keyword clouds on publications (current site's "Keywords" icon list is exactly what
  this rules out — do not carry it forward)
- No plural nav for a single resource
- No teaching tab, no "research interests" list

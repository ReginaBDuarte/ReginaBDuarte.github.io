# Regina de Brito Duarte — Design System

A personal brand system for a PhD researcher working at the intersection of **AI, human-computer interaction (HCI), and evidence-based public policy**. It powers three surfaces: **LinkedIn carousels**, a **personal website**, and **slide decks**.

The visual identity was derived from the user's thesis-proposal deck *"Calibrating Reliance in Human-AI Decision-Making"* (Técnico Lisboa · INESC-ID). The colors are taken directly from that deck; the type and reusable system are new.

## Sources
- `uploads/CAT_small.pdf` — the source thesis-proposal deck (24 image-based slides). Palette and layout motifs were sampled from it. A reference render is kept at `uploads/render/page-01.png`.
- No logo or codebase existed; this system proposes the identity from scratch.

> **⚠️ Fonts.** The deck's fonts were undefined, so the three families below are *substitution choices* (confirmed OK by Regina). The mark is an **`rbd` monogram** (Regina de Brito Duarte). Institutional affiliations are intentionally kept **out** of the personal branding.

---

## Brand at a glance

- **Voice:** a researcher who translates rigorous evidence into plain, useful language. Smart but never stuffy; warm but precise.
- **Palette:** warm **ivory** canvas, **coral** as the signature accent, soft **iris** purple for support, **rose** + **steel blue** as tertiaries (steel = data/charts).
- **Type:** Bricolage Grotesque (display) · Public Sans (text) · IBM Plex Mono (labels/data).
- **Feel:** flat color, rounded corners, generous whitespace, a hand-drawn squiggle and a simple coral human pictogram as recurring motifs.

---

## CONTENT FUNDAMENTALS — how the copy reads

- **Person & address:** first person for the personal brand ("I study how people and AI decide together"), second person when teaching ("when *you* override the AI"). Approachable, not corporate.
- **Tone:** *accessible & explanatory* — research translated for a broad audience. Confident claims, backed by numbers, stated plainly. Think "smart friend who reads the papers," not "abstract of the paper."
- **Casing:** sentence case for headlines and buttons (not Title Case, not ALL CAPS). The **only** uppercase is the mono **eyebrow/kicker** (e.g. `AI · HCI · EVIDENCE-BASED POLICY`), always with wide letter-spacing.
- **Sentence shape:** short. One idea per line. Lead with the finding, then the nuance. Em-dashes and the occasional rhetorical question ("When should we trust the machine?") are on-brand.
- **Numbers:** front and center and specific — `−27%`, `n = 1,240`, `p < 0.001`. Set figures in the display font or mono; never bury them in prose.
- **Emphasis:** highlight a single keyword with a coral/iris pill or coral text — never bold-spam. Key verbs: *calibrate, rely, over-rely, decide, override, translate*.
- **Emoji:** none. The mono eyebrow, the squiggle, and the `·` middot do the "personality" work instead.
- **Vibe in one line:** *evidence you can act on, said like a human.*

Examples: `"More accurate AI doesn't mean better decisions."` · `"A good explanation should make it easier to say no."` · `"From lab to ledger: evidence standards for AI in public services."`

---

## VISUAL FOUNDATIONS

**Color.** Warm ivory `#FAF6EF` is the default canvas (never pure white for full backgrounds; white is for cards). **Coral `#F6956A`** is the signature — it leads, carrying the single most important idea on any surface (use the deeper `coral-500 #E2682F` for interactive/text). **Iris `#D8C7FA`** supports — context, secondary categories, grouping. **Rose** and **steel blue** are tertiaries; steel is the default data-series color in charts (paired with coral). Ink `#1E1B18` for text and for the bold diagram arrows. Two background colors max per artifact (ivory + one of ink/coral/iris for emphasis slides).

**Type.** Display = **Bricolage Grotesque** (700–800, tracking −0.02em) — characterful and modern. Text = **Public Sans** (400–700) — neutral and credible (it is literally the U.S. government typeface, a quiet nod to evidence-based policy). Mono = **IBM Plex Mono** (400–600) for eyebrows, data, captions, and tags. Headlines are tight and large; body is calm and readable at 16–18px.

**Spacing & layout.** 4px base grid. Generous margins; content maxes around 1120px, prose around 68ch. Fixed elements: a sticky translucent (blurred) site header; carousel/slide footers carry the `@handle` and page indicator.

**Backgrounds.** Flat color only — **no gradients** except the one decorative `agent-bloom` motif. No photographic full-bleeds by default; imagery, when present, sits in rounded cards or tinted panels. The portrait placeholder uses a soft iris→coral gradient as a stand-in only.

**Corners & cards.** Rounded throughout. Cards = 16px radius, buttons & pills = fully rounded (999px). Default card: white fill, 1px `--border-soft` hairline, soft `--shadow-sm`. Tinted cards (coral/iris) drop the shadow and border. "Float" cards use `--shadow-lg`.

**Shadows.** Soft and warm-tinted (brown-based rgba, never gray/black). The brand is mostly flat — reach for borders and fills before shadows. Colored shadows (`--shadow-accent`, `--shadow-iris`) only under solid coral/iris buttons.

**Borders.** Hairline `1px` for surfaces; `2px` for button outlines and the diagram arrows are heavier (7px) and ink-black.

**Motion.** Restrained. Fade-up on entrance (`rbdFadeUp`, ~14px rise). Hover = lift `translateY(-3px)` on cards, darken fill on buttons. Press = `translateY(1px)` + slight scale-down. Easing `--ease-out` cubic-bezier(0.22,1,0.36,1); ~140–220ms. No bounce on content, no infinite loops.

**Transparency & blur.** Only the sticky header (color-mix ivory + blur). Otherwise opaque.

**Imagery vibe.** Warm, light, optimistic — coral/iris on cream. No dark mode by default (the system is light-first; an emphasis slide may invert to ink-900).

**Signature motifs.** (1) the **coral human pictogram** (`PersonMark`) marking the human in human-AI diagrams; (2) the **hand-drawn squiggle** (`Squiggle`) under headline words; (3) the **agent bloom** (`assets/motifs/agent-bloom.png`) — the rainbow mandala standing in for "the AI/agent"; (4) **bold black branching arrows** (A/B outcomes) for decision diagrams.

---

## ICONOGRAPHY

- The source deck uses **almost no UI icons** — its visual language is *pictograms and diagrams*, not an icon set. Honor that: prefer the brand motifs and bold arrows over a generic icon tray.
- **Unicode glyphs** carry light iconography on-brand: arrows `→ ↑ ↓`, the middot `·` as a separator, `◆` as a token marker. Set them in the display or mono font.
- **No emoji.**
- Brand-specific marks are **components, not icon fonts**: `PersonMark` and `Squiggle` are recolorable SVG. The `agent-bloom` mandala is a real PNG asset.
- If you genuinely need utility icons (e.g. a website with social links), use **Lucide** (`https://unpkg.com/lucide-static`) at ~1.75px stroke to match the friendly-but-precise feel — and flag it as an addition, since it is not in the source.
- Brand mark: the **`rbd` monogram** in a coral rounded square (lowercase, tight tracking). No third-party / institutional logos are used in the personal branding.

---

## INDEX — what's in here

**Foundations (root):**
- `styles.css` — the single entry point consumers link (import list only).
- `fonts.css` — Google Fonts `@import` (Bricolage Grotesque, Public Sans, IBM Plex Mono).
- `tokens/colors.css` · `tokens/typography.css` · `tokens/layout.css` — all CSS custom properties.
- `base.css` — light resets + helper classes (`.rbd-eyebrow`, `.rbd-card`, `.rbd-underline`).

**Components** (`components/`, namespace `window.ReginaDeBritoDuarteDesignSystem_6df855`):
- `core/` — `Button`, `Tag`, `Badge`, `Eyebrow`, `Card`, `Callout`, `Stat`
- `brand/` — `PersonMark`, `Squiggle`, `Avatar`
- Each has `.jsx` + `.d.ts` + `.prompt.md`; demo cards: `buttons`, `tags`, `surfaces`, `motifs`.

**Templates** (`templates/`, editable Design Components):
- `linkedin-carousel/LinkedinCarousel.dc.html` — 5-page 1080×1350 carousel.
- `slide-deck/SlideDeck.dc.html` — 6 slides, 1280×720, mirrors the thesis deck.

**UI kit** (`ui_kits/`):
- `personal-website/index.html` — researcher home page (also a Starting Point).

**Specimen cards** (`guidelines/foundations/`) — populate the Design System tab: colors (coral / iris / rose+steel / neutrals), type (display / text / mono / scale), spacing / radius / elevation, brand (palette-in-use / identity).

**Assets** (`assets/`): `motifs/agent-bloom.png`.

---

## Caveats & options

1. **Fonts** — Bricolage Grotesque + Public Sans + IBM Plex Mono (confirmed). Easy to swap system-wide via the `--font-*` tokens if you ever change your mind.
2. **Mark** — the `rbd` coral monogram is the working logo. Happy to explore a more custom mark whenever you want.
3. **Fonts load from the Google CDN**, not self-hosted. Say the word and I'll self-host for offline use.
4. **Live details** — LinkedIn (`linkedin.com/in/regina-duarte`) and your bio are wired into the website; carousel/deck footers use the LinkedIn URL. Email, Google Scholar, CV, and publication links are still placeholders (`#`) — send them and I'll fill them in.

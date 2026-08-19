---
name: rbd-design
description: Use this skill to generate well-branded interfaces and assets for Regina de Brito Duarte's personal brand (AI · HCI · evidence-based public policy) — LinkedIn carousels, a personal website, and slide decks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping or production.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, carousels, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Where things live
- `styles.css` — the single stylesheet to link. It `@import`s `fonts.css` + `tokens/*` + `base.css`. Linking it gives you every color/type/spacing token as a CSS custom property.
- `tokens/colors.css`, `tokens/typography.css`, `tokens/layout.css` — design tokens (`--coral-300`, `--font-display`, `--space-4`, …).
- `components/core` + `components/brand` — React components. Their `.prompt.md` files show usage; the bundle exposes them on `window.ReginaDeBritoDuarteDesignSystem_6df855`.
- `templates/` — copy-ready starting points: `linkedin-carousel/` (1080×1350) and `slide-deck/` (1280×720).
- `ui_kits/personal-website/index.html` — the website home page.
- `assets/` — `motifs/agent-bloom.png` and affiliation logos.

## Brand in 30 seconds
- **Colors:** ivory canvas `#FAF6EF`; coral `#F6956A` is the signature (lead with it); iris `#D8C7FA` supports; steel blue for data. Two background colors max.
- **Type:** Bricolage Grotesque (display, sentence case, tight) · Public Sans (body) · IBM Plex Mono (UPPERCASE eyebrows, data, captions).
- **Copy:** first person, accessible, lead with the finding, specific numbers, no emoji. The mono eyebrow + hand-drawn squiggle carry personality.
- **Form:** flat color, rounded corners (cards 16px, buttons pill), soft warm shadows, generous whitespace, restrained fade/lift motion.
- **Motifs:** coral human pictogram, hand-drawn squiggle, agent-bloom mandala, bold black A/B decision arrows.

## Quick start for a new HTML artifact
1. Copy `styles.css`, `fonts.css`, `tokens/`, `base.css`, and any `assets/` you need into your output folder (keep relative paths intact).
2. `<link rel="stylesheet" href="styles.css">`.
3. Use tokens in inline or block CSS (`color: var(--ink-900)`, `background: var(--ivory)`, `font-family: var(--font-display)`).
4. For sizes: LinkedIn carousel = 1080×1350, slide = 1280×720 (or 1920×1080), web = ~1120px content width.
5. Honor the copy and motif rules above.

> Fonts are substitution choices and the logo is a proposed `rd` monogram — confirm with the user before treating them as final. Affiliation logos are low-res; ask for official versions.

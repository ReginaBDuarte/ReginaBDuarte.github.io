// Data access + helpers for the AI-Assisted Decision-Making framework.
// Source of truth: src/data/aidm-framework.json, a snapshot exported from
// Regina's Notion evidence base. Re-export from Notion and replace that file
// to update the framework's real content — nothing here should be hand-edited
// per record. See AIAssistedDM/2026-08-05-aidm-website-spec.md for the full
// build spec this was implemented from.
import raw from '../data/aidm-framework.json';

export interface Component {
  id: string;
  label: string;
  type: string;
  note: string;
}

export interface Factor {
  id: string;
  notion_url: string;
  factor: string;
  component: string;
  type: string;
  order: number;
  definition: string;
  sub_factors: string;
  gap_note: string;
  mechanisms: string[];
}

export interface Mechanism {
  id: string;
  notion_url: string;
  claim: string;
  component: string;
  factor: string;
  sub_factor: string;
  description: string;
  affects: string[];
  n_support: number;
  n_contradict: number;
  supporting_studies: string[];
  contradicting_studies: string[];
  notes: string;
}

// Matches CODING_FIELDS in AIAssistedDM/notionRetrieve.py exactly (plus the overlay-only
// need_for_cognition — see apply_study_overlay_coding there). This drifted out of sync
// with the real synced shape for a while (a stale single "xai" field, no
// task_uncertainty/group_size/group_mode at all) without TypeScript ever catching it,
// because aidm.ts casts the whole JSON with `as AidmData` — see the note by that cast.
export interface StudyCoding {
  expertise_level: string;
  need_for_cognition?: string;
  team_composition: string;
  group_size: string;
  group_mode: string;
  difficulty: string;
  task_uncertainty: string;
  stakes: string;
  stress_time: string;
  ai_performance: string;
  ai_design: string;
  xai_present: string;
  xai_type: string;
  xai_quality: string;
  // Four fields added 2026-08-18, alongside the new "Number of AI advisors" factor and
  // the AI design factor's two new sub-dimensions (advice stance, interaction modality)
  // — see notionRetrieve.py's CODING_FIELDS for the Notion property each reads from.
  advice_stance: string;
  advisor_agreement: string;
  number_of_advisors: string;
  interaction_modality: string;
}

export interface Study {
  id: string;
  notion_url: string;
  study: string;
  author: string;
  year: number;
  venue: string;
  link: string | null;
  read: string;
  own_work?: boolean;
  incomplete?: boolean;
  sample_size: number | null;
  decision_task_type: string[];
  coding: StudyCoding;
  manipulated_factors: string[];
  outcomes_measured: string[];
  supports_mechanisms: string[];
  contradicts_mechanisms: string[];
  research_questions: string;
  ai_accuracy_details: string;
  summary_of_findings: string | null;
  authors_framing: string | null;
  design_notes: string;
}

interface AidmData {
  components: Component[];
  factors: Factor[];
  mechanisms: Mechanism[];
  studies: Study[];
}

const data = raw as AidmData;

export const components = data.components;
export const factors = data.factors;
export const mechanisms = data.mechanisms;
export const studies = data.studies;

export function getFactorsByComponent(componentLabel: string): Factor[] {
  return factors.filter((f) => f.component === componentLabel).sort((a, b) => a.order - b.order);
}

export function getFactor(id: string): Factor | undefined {
  return factors.find((f) => f.id === id);
}

export function getMechanism(id: string): Mechanism | undefined {
  return mechanisms.find((m) => m.id === id);
}

export function getStudy(id: string): Study | undefined {
  return studies.find((s) => s.id === id);
}

// Split "Task expertise · AI expertise / AI literacy · ..." into chips. Only splits on
// " · " at paren depth 0 — a sub-factor's own parenthetical aside is sometimes itself a
// " · "-separated list of examples (e.g. "explanation type (feature importance ·
// example-based · ...)"), and that inner list must stay part of the one chip it
// belongs to rather than exploding into chips of its own.
export function splitSubFactors(subFactors: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < subFactors.length; i++) {
    const ch = subFactors[i];
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth <= 0 && subFactors.slice(i, i + 3) === ' · ') {
      parts.push(current.trim());
      current = '';
      i += 2;
      continue;
    }
    current += ch;
  }
  parts.push(current.trim());
  return parts.filter(Boolean);
}

// All mechanisms, strongest evidence first. There's no above/below-bar split anymore —
// every mechanism shows, ordered by how many studies support it. mechanisms is already
// exported in this order from the sync script (see notionRetrieve.py's main()), but
// re-sort here too so the ordering contract doesn't silently depend on that.
export function getMechanismsBySupport(): Mechanism[] {
  return [...mechanisms].sort((a, b) => b.n_support - a.n_support);
}

// Same strongest-evidence-first ordering as getMechanismsBySupport, scoped to one
// factor's mechanisms (factor.mechanisms[] is Notion relation order, not support order).
export function getMechanismsForFactor(factor: Factor): Mechanism[] {
  return factor.mechanisms
    .map((id) => getMechanism(id))
    .filter((m): m is Mechanism => Boolean(m))
    .sort((a, b) => b.n_support - a.n_support);
}

// `study.manipulated_factors[]` entries are prefixed strings like
// "XAI: Feature importance". Map the prefix to a factor id — labels here must match
// MANIPULATION_PAIRS' label column in AIAssistedDM/notionRetrieve.py exactly, since that
// map isn't derived from Notion and the two aren't type-checked against each other.
// "Uncertainty" used to map to f-difficulty, back when Task uncertainty was folded into
// Difficulty as a sub-factor rather than its own factor — now it has its own node.
const PREFIX_TO_FACTOR: Record<string, string> = {
  Expertise: 'f-expertise',
  Team: 'f-team-composition',
  Difficulty: 'f-difficulty',
  Uncertainty: 'f-task-uncertainty',
  Stakes: 'f-stakes',
  Time: 'f-stress-time',
  'AI performance': 'f-ai-performance',
  'AI design': 'f-ai-design',
  XAI: 'f-xai',
  'XAI quality': 'f-xai',
  // Added 2026-08-18, matching the four new MANIPULATION_PAIRS label strings in
  // notionRetrieve.py exactly (same "keep in sync by hand" contract as the rest of
  // this map). "Advice stance" and "Interaction modality" are sub-dimensions of the
  // AI design factor, not their own node — see AI design's "Sub-factors" text in
  // Notion. "Advisor agreement" and "Advisor count" both belong to the new
  // "Number of AI advisors" factor.
  'Advice stance': 'f-ai-design',
  'Interaction modality': 'f-ai-design',
  'Advisor agreement': 'f-number-of-ai-advisors',
  'Advisor count': 'f-number-of-ai-advisors',
};

export interface ManipulatedFactorEntry {
  raw: string;
  prefix: string;
  category: string;
  factorId: string | undefined;
}

// "manipulated (levels not discretised)" means the study varied this factor without
// naming discrete levels — there's no real category value to show as a chip, so it
// normalizes to '' and callers filter it out rather than rendering the annotation
// itself as if it were a category.
const NO_DISCRETE_LEVELS = /^manipulated\s*\(levels not discretis(?:e|z)d\)$/i;

export function parseManipulatedFactors(entries: string[]): ManipulatedFactorEntry[] {
  return entries.map((raw) => {
    const [prefix, ...rest] = raw.split(':');
    let category = rest.join(':').trim();
    if (NO_DISCRETE_LEVELS.test(category)) category = '';
    return { raw, prefix: prefix.trim(), category, factorId: PREFIX_TO_FACTOR[prefix.trim()] };
  });
}

// Site style avoids em dashes (see CLAUDE.md's "No em dashes" rule) but the Notion
// export still has them throughout its free-text fields. Rather than hand-editing the
// JSON, which gets replaced wholesale on every re-sync (see the file header above),
// dashes are stripped at render time here. This is a mechanical comma substitution, not
// editorial judgement, so it won't always land on the punctuation a human editor would
// pick — but it's consistently readable for the aside/connector usage this text uses an
// em dash for, and it survives re-syncs without anyone remembering to redo it. Only
// applied to Regina's own paraphrased/coded text (description, definition,
// research_questions, design_notes, summary_of_findings, ai_accuracy_details) — never to
// a paper's own title/venue (quoted verbatim, must not be altered) or authors_framing
// (a direct quotation of the paper's own words, see formatQuotes below).
export function stripEmDash(text: string): string {
  return text.replace(/\s*—\s*/g, ', ').replace(/,\s*,/g, ',').replace(/ {2,}/g, ' ').trim();
}

// Free text out of Notion (research_questions, design_notes, summary_of_findings,
// mechanism.description) is unstructured prose, written a study/mechanism at a time
// with no enforced convention — but in practice it's consistently blank-line-separated
// blocks, and some fields are runs of one-per-item lines (RQ1:, H1:, → for a supporting
// example, etc.) — sometimes each on its own blank-line-separated block (RQ1 \n\n RQ2
// \n\n RQ3), sometimes packed into one block separated only by single newlines
// (Experiment 1: \n H1: ... \n H2: ...). Rather than hand-formatting ~150+ text blocks,
// classify each blank-line block on its own: a block that's almost entirely marker
// lines becomes a list (with a leading non-marker line kept as its own intro
// paragraph); everything else is a paragraph. A block that's a single marker line by
// itself (no siblings) is provisionally neither: consecutive single-marker blocks are
// then merged into one shared list (the common "RQ1 \n\n RQ2 \n\n RQ3" pattern), while a
// truly isolated one stays a plain paragraph — except a lone arrow, which always means
// "this is a discrete point" even with nothing beside it (a mechanism's description is
// often just an intro paragraph plus one supporting example). See ProseBlocks.astro for
// the render side.
export interface ProseBlock {
  type: 'p' | 'ul';
  text?: string;
  items?: string[];
}

const LIST_MARKER = /^(RQ\s*\d*[:.]?|H\d+[:.]|\d+[.):]|[-•]|→)\s+/i;
const ARROW_PREFIX = /^→\s*/;

// Arrow bullets are a pure "this is a point" signal with no informational content of
// their own, so the arrow is dropped from the rendered item (the <ul> supplies a bullet
// instead, see .prose-list in ProseBlocks.astro). RQ:/H1:/numbered markers stay on the
// item text, since the label itself is informative (which hypothesis this is).
function cleanListItem(line: string): string {
  return stripEmDash(line.replace(ARROW_PREFIX, '').trim());
}

type RawBlock =
  | { kind: 'list'; items: string[] }
  | { kind: 'introList'; intro: string; items: string[] }
  | { kind: 'soloMarker'; item: string; isArrow: boolean }
  | { kind: 'text'; text: string };

function classifyBlock(blockText: string): RawBlock {
  const lines = blockText.split('\n').map((l) => l.trim()).filter(Boolean);
  const listLines = lines.filter((l) => LIST_MARKER.test(l));

  if (lines.length >= 2 && listLines.length >= 2 && listLines.length >= lines.length - 1) {
    if (LIST_MARKER.test(lines[0])) {
      return { kind: 'list', items: lines.map(cleanListItem) };
    }
    return { kind: 'introList', intro: stripEmDash(lines[0]), items: lines.slice(1).map(cleanListItem) };
  }
  if (lines.length === 1 && LIST_MARKER.test(lines[0])) {
    return { kind: 'soloMarker', item: cleanListItem(lines[0]), isArrow: ARROW_PREFIX.test(lines[0]) };
  }
  return { kind: 'text', text: stripEmDash(lines.join(' ')) };
}

export function formatProse(text: string): ProseBlock[] {
  const raw = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean).map(classifyBlock);

  const out: ProseBlock[] = [];
  let pendingSolo: { item: string; isArrow: boolean }[] = [];

  const appendList = (items: string[]) => {
    const prev = out[out.length - 1];
    if (prev?.type === 'ul') prev.items!.push(...items);
    else out.push({ type: 'ul', items: [...items] });
  };
  const appendParagraph = (t: string) => out.push({ type: 'p', text: t });
  const flushSolo = () => {
    if (pendingSolo.length === 0) return;
    if (pendingSolo.length >= 2 || pendingSolo[0].isArrow) {
      appendList(pendingSolo.map((s) => s.item));
    } else {
      appendParagraph(pendingSolo[0].item);
    }
    pendingSolo = [];
  };

  for (const block of raw) {
    if (block.kind === 'soloMarker') {
      pendingSolo.push({ item: block.item, isArrow: block.isArrow });
      continue;
    }
    flushSolo();
    if (block.kind === 'list') appendList(block.items);
    else if (block.kind === 'introList') {
      appendParagraph(block.intro);
      appendList(block.items);
    } else {
      appendParagraph(block.text);
    }
  }
  flushSolo();
  return out;
}

// authors_framing is consistently written as one quoted excerpt per blank-line block,
// each ending in a parenthetical source label — '"quote text" (results, experiment 1)'.
// Split it into quote + source pairs for blockquote/cite rendering. See AuthorQuotes.astro.
export interface AuthorQuote {
  quote: string;
  source: string | null;
}

const QUOTE_SOURCE = /\s*\(([^()]{2,80})\)\s*$/;

export function formatQuotes(text: string): AuthorQuote[] {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks.map((block) => {
    const m = block.match(QUOTE_SOURCE);
    return m
      ? { quote: block.slice(0, m.index).trim(), source: m[1].trim() }
      : { quote: block, source: null };
  });
}

// Studies that reference a mechanism whose parent factor is `factorId`,
// split into supporting vs contradicting, for the factor modal's evidence list.
export function studiesForMechanism(mechanism: Mechanism) {
  return {
    supporting: mechanism.supporting_studies.map(getStudy).filter((s): s is Study => Boolean(s)),
    contradicting: mechanism.contradicting_studies.map(getStudy).filter((s): s is Study => Boolean(s)),
  };
}

// One coding field -> one factor, for every factor except f-xai and f-ai-design.
// need_for_cognition is also left out: it used to map to a f-need-for-cognition factor,
// but that factor was removed from Notion (folded out of the framework entirely) — the
// coding value still exists per study, it just has nowhere to render on the figure now.
// f-xai and f-ai-design are both one-node-many-fields: f-xai has three coding dimensions
// (xai_present, xai_type, xai_quality) and f-ai-design has three of its own (ai_design,
// advice_stance, interaction_modality — see AI design's "Sub-factors" text in Notion).
// Both get the same small multi-line display — see getXaiSubfields/getAiDesignSubfields
// below and FrameworkFigure's xaiSubfields/aiDesignSubfields props, called separately
// from this map in study/[id].astro. f-number-of-ai-advisors and f-team-composition are
// similar (advisor_agreement, group_size and group_mode are each a second/third
// dimension, left out of this map same as the others) but number_of_advisors and
// team_composition stay mapped here too, since study/[id].astro also uses these plain
// values as the one-line fallback for the common single-advisor/single-decision-maker
// case — see isAdvisorsTrivial/isTeamTrivial.
export const CODING_FIELD_TO_FACTOR: Partial<Record<keyof StudyCoding, string>> = {
  expertise_level: 'f-expertise',
  team_composition: 'f-team-composition',
  difficulty: 'f-difficulty',
  task_uncertainty: 'f-task-uncertainty',
  stakes: 'f-stakes',
  stress_time: 'f-stress-time',
  ai_performance: 'f-ai-performance',
  number_of_advisors: 'f-number-of-ai-advisors',
};

// f-ai-design's per-study display on FrameworkFigure: three short labelled lines
// instead of one value, since ai_design/advice_stance/interaction_modality are three
// independent coding dimensions of the same node (see the comment on
// CODING_FIELD_TO_FACTOR above). Each line's "manipulated" categories are pulled from
// study.manipulated_factors by matching MANIPULATION_PAIRS' label column exactly (the
// prefix on each "Label: category" entry) — not by factorId, since all three prefixes
// resolve to the same f-ai-design factor and would otherwise collide.
export interface AiDesignSubfield {
  label: string;
  value: string;
  manipulated: boolean;
  categories: string[];
}

// Shared by every factor whose subfields are each coded with a literal "Manipulated"
// value when varied (AI design's three dimensions, the advisor factor's two, team
// composition's three — f-xai's don't all follow this rule, see getXaiSubfields below,
// so it stays bespoke). A subfield whose own field is never coded "Manipulated" (team
// composition's size/mode included, see TEAM_SUBFIELDS below) just falls through as a
// plain, never-manipulated value — harmless, and simpler than special-casing it out.
function subfieldsFromLiteralManipulated(
  coding: StudyCoding,
  manipulatedFactors: string[],
  config: { field: keyof StudyCoding; label: string; prefix: string }[],
): AiDesignSubfield[] {
  const parsed = parseManipulatedFactors(manipulatedFactors);
  return config.map(({ field, label, prefix }) => {
    const value = (coding[field] as string) || 'Not reported';
    const manipulated = value === 'Manipulated';
    const categories = manipulated
      ? parsed.filter((e) => e.prefix === prefix && e.category).map((e) => e.category)
      : [];
    return { label, value, manipulated, categories };
  });
}

const AI_DESIGN_SUBFIELDS: { field: keyof StudyCoding; label: string; prefix: string }[] = [
  { field: 'ai_design', label: 'Protocol', prefix: 'AI design' },
  { field: 'advice_stance', label: 'AI stance', prefix: 'Advice stance' },
  { field: 'interaction_modality', label: 'Interactivity', prefix: 'Interaction modality' },
];

export function getAiDesignSubfields(coding: StudyCoding, manipulatedFactors: string[]): AiDesignSubfield[] {
  return subfieldsFromLiteralManipulated(coding, manipulatedFactors, AI_DESIGN_SUBFIELDS);
}

// f-number-of-ai-advisors' per-study display: how many advisors and, when there's more
// than one, whether/how they agreed. The overwhelming majority of studies use a single
// advisor with agreement coded "Not applicable" — for those, study/[id].astro skips this
// entirely and shows the plain "One" value instead (see isAdvisorsTrivial below), so this
// two-line breakdown only actually renders for the few studies that vary advisor count
// or agreement.
const ADVISOR_SUBFIELDS: { field: keyof StudyCoding; label: string; prefix: string }[] = [
  { field: 'number_of_advisors', label: 'Count', prefix: 'Advisor count' },
  { field: 'advisor_agreement', label: 'Agreement', prefix: 'Advisor agreement' },
];

// f-team-composition's per-study display: individual-vs-group, group size, and group
// decision mode — the fourth sub-factor Notion lists, "leadership and hierarchy", was
// never coded and is deliberately left out (same treatment as XAI's cognitive load).
// Size and mode are free-text/descriptive fields, not coded "Manipulated" the way
// composition is, so they always come through as plain values here (see the comment on
// subfieldsFromLiteralManipulated above) — nothing in the data varies them
// independently of composition anyway; every non-individual study's manipulated_factors
// entries live under the single "Team" prefix regardless of which dimension they
// describe, so they all surface as composition's categories rather than being split
// further. The overwhelming majority of studies are a single decision-maker — for
// those, study/[id].astro skips this entirely and shows the plain "Individual" value
// instead (see isTeamTrivial below).
const TEAM_SUBFIELDS: { field: keyof StudyCoding; label: string; prefix: string }[] = [
  { field: 'team_composition', label: 'Composition', prefix: 'Team' },
  { field: 'group_size', label: 'Size', prefix: 'Team' },
  { field: 'group_mode', label: 'Mode', prefix: 'Team' },
];

export function getTeamSubfields(coding: StudyCoding, manipulatedFactors: string[]): AiDesignSubfield[] {
  return subfieldsFromLiteralManipulated(coding, manipulatedFactors, TEAM_SUBFIELDS);
}

// True when a study used a single decision-maker — the common case (see TEAM_SUBFIELDS
// comment above) where the three-line breakdown would just repeat "Individual" for
// nothing. study/[id].astro uses this to fall back to the ordinary one-line factor
// display instead.
export function isTeamTrivial(coding: StudyCoding): boolean {
  return coding.team_composition === 'Individual';
}

export function getAdvisorSubfields(coding: StudyCoding, manipulatedFactors: string[]): AiDesignSubfield[] {
  return subfieldsFromLiteralManipulated(coding, manipulatedFactors, ADVISOR_SUBFIELDS);
}

// f-xai's per-study display on FrameworkFigure: three short labelled lines (mirrors
// f-ai-design's getAiDesignSubfields above), covering presence/type/quality — the
// fourth sub-factor Notion lists for XAI, "explanation cognitive load", was never
// coded and is deliberately left out. Presence and quality are coded with a literal
// "Manipulated" value when varied, same as most AI design subfields, so they reuse
// that check directly. Type never is: xai_type instead holds the joined list of
// explanation conditions tested (e.g. "None · Feature importance"), so its manipulated
// flag comes from the presence of "XAI: <type>" entries in manipulated_factors — and
// since that value string is already the human-readable category list, it isn't
// repeated as a parenthetical the way presence/quality's would be.
export function getXaiSubfields(coding: StudyCoding, manipulatedFactors: string[]): AiDesignSubfield[] {
  const parsed = parseManipulatedFactors(manipulatedFactors);
  const typeManipulated = parsed.some((e) => e.prefix === 'XAI' && e.category);
  const qualityManipulated = coding.xai_quality === 'Manipulated';
  return [
    {
      label: 'Presence',
      value: coding.xai_present || 'Not reported',
      manipulated: coding.xai_present === 'Manipulated',
      categories: [],
    },
    {
      label: 'Type',
      value: coding.xai_type || 'Not reported',
      manipulated: typeManipulated,
      categories: [],
    },
    {
      label: 'Quality',
      value: coding.xai_quality || 'Not reported',
      manipulated: qualityManipulated,
      categories: qualityManipulated
        ? parsed.filter((e) => e.prefix === 'XAI quality' && e.category).map((e) => e.category)
        : [],
    },
  ];
}

// True when a study didn't use XAI at all, or never recorded whether it did — the
// three-line Presence/Type/Quality breakdown would just repeat "Not present"/"Not
// reported" for nothing. study/[id].astro uses this to fall back to the ordinary
// one-line factor display instead, same wording deriveXaiCondition used to produce
// before this factor got the subfield treatment.
export function isXaiTrivial(coding: StudyCoding): boolean {
  return coding.xai_present === 'No' || coding.xai_present === 'Not reported';
}

// True when a study used a single advisor with no agreement dimension to speak of — the
// common case (see ADVISOR_SUBFIELDS comment above) where the two-line breakdown would
// just repeat "One" / "Not applicable" for nothing. study/[id].astro uses this to fall
// back to the ordinary one-line factor display instead.
export function isAdvisorsTrivial(coding: StudyCoding): boolean {
  return coding.number_of_advisors === 'One' && coding.advisor_agreement === 'Not applicable';
}

import { defineCollection, z } from 'astro:content';

// One entry per publication. "selected" marks the 2-3 highlights that
// appear on the homepage and again (with extra context) on /research.
const research = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    year: z.number(),
    type: z.enum(['Conference', 'Journal', 'Workshop', 'Preprint']).optional(),
    selected: z.boolean().default(false),
    // Plain-language "so what" — required for anything marked selected.
    soWhat: z.string().optional(),
    // Shared label for publications that are versions/parts of the same line of
    // work (e.g. a preprint and its journal publication, or a study and its
    // direct predecessor) — the /research full list clusters these together
    // instead of splitting them apart by year.
    seriesLabel: z.string().optional(),
    links: z
      .object({
        pdf: z.string().url().optional(),
        doi: z.string().url().optional(),
        code: z.string().url().optional(),
      })
      .default({}),
  }),
});

// Site-level metadata for the Framework page (meta bar, citation, feedback
// email) — one entry per locale. The framework's actual substantive content
// (factors/mechanisms/studies) is NOT here; it's data-driven from
// src/data/aidm-framework.json via src/lib/aidm.ts. This collection only
// holds the page chrome around it. No changelog field on purpose — Regina
// doesn't want one displayed; revision history lives in git/CLAUDE.md instead.
const framework = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    version: z.string(),
    updated: z.string(),
    licence: z.string(),
    whatItIs: z.string(),
    feedbackEmail: z.string(),
  }),
});

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    standfirst: z.string(),
    date: z.date(),
    readingTime: z.string(),
    // Briefs get a 3-bullet recommendations block near the top.
    recommendations: z.array(z.string()).optional(),
  }),
});

export const collections = { research, framework, writing };

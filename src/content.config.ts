import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const publications = defineCollection({
  loader: file('src/content/publications/publications.json'),
  schema: z.object({
    id: z.string(),
    authors: z.array(z.string()),
    // Exact author-string to bold in rendering, e.g. "Mondal A" or "Mondal AK"
    piHighlight: z.string().optional(),
    title: z.string(),
    journal: z.string(),
    year: z.number().int(),
    month: z.string().optional(),
    volume: z.string().optional(),
    issue: z.string().optional(),
    pages: z.string().optional(),
    articleNumber: z.string().optional(),
    doi: z.string().url().optional(),
    url: z.string().url().optional(),
    type: z.enum(['journal-article', 'review', 'book-chapter']).default('journal-article'),
    featured: z.boolean().default(false),
    // A short original summary in plain language — not the published
    // abstract verbatim (that's the publisher's copyrighted text; the DOI
    // link is where a reader gets the real abstract and figures).
    summary: z.string().optional(),
    // Real subject-matter tags, drawn from a controlled vocabulary shared
    // across entries so overlapping keywords form a meaningful graph — used
    // to drive the Home page's keyword-network hero.
    keywords: z.array(z.string()).default([]),
    // From Google Scholar (scholar.google.com/citations?user=hEeFsEYAAAAJ) —
    // powers sort/filter on the Publications page.
    citations: z.number().int().optional(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().max(240),
    tags: z.array(z.string()).default([]),
    relatedPublication: z.string().optional(),
    // Flags bootstrap/seed content so it's easy to find and replace later.
    placeholder: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    photo: z.string().optional(),
    order: z.number().default(0),
    bioShort: z.string().optional(),
    interests: z.array(z.string()).default([]),
    email: z.string().email().optional(),
    isPI: z.boolean().default(false),
  }),
});

export const collections = { publications, news, team };

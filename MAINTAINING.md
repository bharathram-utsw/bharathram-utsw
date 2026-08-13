# Maintaining this site

This is the step-by-step guide for adding and updating content — publications, news,
team members, research copy — without needing to touch design/layout code. It also
explains which visuals update themselves and which don't.

The short version: **publications, news, and team are all "content collections."**
Editing their source files and rebuilding is the entire workflow — nothing else needs
to be told about the change.

## Add a publication

Edit `src/content/publications/publications.json` — it's a single JSON array, one
object per paper. Copy an existing entry as a template. Fields:

| Field         | Required | Notes                                                                 |
| :------------ | :------- | :--------------------------------------------------------------------- |
| `id`          | yes      | Unique slug, e.g. `"song-2025-elife"`                                  |
| `authors`     | yes      | Array of author strings, in order                                      |
| `piHighlight` | no       | Exact author string to bold, e.g. `"Mondal AK"`                        |
| `title`       | yes      |                                                                          |
| `journal`     | yes      |                                                                          |
| `year`        | yes      | Number, not string                                                      |
| `month`, `volume`, `issue`, `pages`, `articleNumber`, `doi`, `url` | no | |
| `type`        | no       | `"journal-article"` (default), `"review"`, or `"book-chapter"`         |
| `featured`    | no       | Boolean, default `false`                                                |
| `keywords`    | **yes, in practice** | Array of subject tags — see below, this is the important one |
| `citations`   | no       | From Google Scholar; powers the "Most cited" sort                       |

**`keywords` is what drives the site's visuals.** Reuse existing keyword strings where
the paper is genuinely about the same topic (`"Retina"`, `"Epigenetics"`, `"Multiomics"`,
etc.) rather than inventing near-duplicates — the Home hero and the Publications topic
network both work by matching *identical* keyword strings across papers, so
`"Multiomics"` and `"Multi-omics"` are two different nodes to the code even though they
mean the same thing to a person. Skim a few existing entries' `keywords` arrays before
adding new tags.

Run `npx astro check` after editing — the build fails loudly (with a field-level error
message) on a typo'd field name or wrong type, before it ever reaches a page.

### What updates automatically from this file

- **Publications page**: the new card appears, sorted into place by year/citations —
  every publication shows here, regardless of era.
- **Publications page topic network** and **Home page hero** (the circular keyword
  diagram): both recomputed from scratch on every build, and both scoped to *vision-era*
  publications only (see [Vision-era filtering](#vision-era-filtering-in-the-visuals)
  below) — a new vision-era paper's `keywords` shift the network/hero automatically,
  including which topics appear, how big their nodes are, and which topics connect.
- **Home page "Publications" stat**: the count in the bento stats row (counts every
  publication, all eras).

Nothing above needs a separate edit. There is no "regenerate the chart" step — the chart
*is* the keyword data, recomputed at build time.

## Add a news post

Add a new Markdown file to `src/content/news/`, e.g. `2026-09-01-new-grant.md`. The
filename becomes the URL slug. Frontmatter:

```markdown
---
title: "New R01 grant funded"
date: 2026-09-01
excerpt: "One-sentence summary, 240 characters max — shows in list views."
tags: ["Funding"]
relatedPublication: "song-2025-elife" # optional, must match a publication id
placeholder: false
draft: false
---

Full post body in Markdown goes here.
```

Set `draft: true` to write a post without publishing it yet. Set `placeholder: true`
only for bootstrap/seed content that should stay easy to find-and-replace (the initial
"Welcome to the new lab site" post uses this).

### What updates automatically

- **News page**: lists every non-draft post, newest first.
- **Home page "News" tile**: shows the 2 most recent non-draft posts.

## Add a team member

Add a new Markdown file to `src/content/team/`, e.g. `jane-doe.md`:

```markdown
---
name: "Jane Doe, Ph.D."
role: "Postdoctoral Fellow"
order: 1
bioShort: "One-sentence bio for compact views (Home page tile)."
interests: ["Machine learning", "Retinal imaging"]
email: "jane.doe@utsouthwestern.edu"
isPI: false
---

Longer bio in Markdown, shown on the Team page.
```

`order` controls display order on the Team page (lower first). Exactly one entry should
have `isPI: true` — that person is who the Home page's "Led by" tile pulls automatically.

### What updates automatically

- **Team page**: new card appears, ordered by `order`.
- **Home page "Led by" tile**: only changes if you add/move the `isPI: true` entry —
  otherwise unaffected by adding non-PI members.
- **Team-member avatar**: `Avatar.astro` generates a deterministic geometric icon from
  the person's `name` — no photo upload needed unless you want one (`photo` field is
  optional and not yet wired to a component; ask before relying on it).

## Research page copy

Unlike the three collections above, the Research page's theme descriptions (the two
paragraphs of prose) are hand-written directly in `src/pages/research.astro` and in the
matching bento tiles on `src/pages/index.astro` — there's no `research` content
collection. Edit the text in both files directly when the framing of a research theme
changes. This is deliberate: theme descriptions change rarely and read better hand-tuned
than templated.

The UpSet plot on the Research page (`ResearchUpset.astro`) is different from the graph
this section used to describe — it's **real, computed data**, not hand-authored. It
classifies every vision-era publication's own keywords into four broad research themes
(`CATEGORY_KEYWORDS` in that file) and plots the real combinations of themes that occur
across the actual publication record, with real counts. Adding a vision-era publication
with keywords already covered by `CATEGORY_KEYWORDS` updates this automatically — nothing
to do. If a new publication's keywords don't match any existing category (rare, since the
four themes are broad), it simply won't count toward any column until someone adds the
new keyword to the relevant category's set in `ResearchUpset.astro`.

## Gallery page

There's no Gallery page or content collection yet — it doesn't exist in the current
build. If you want one (lab photos, event/conference pictures, microscopy images), it
should follow the same content-collection pattern as News/Team so photos can be added by
dropping a file in a folder rather than editing page code. Flag this if you want it built.

## Vision-era filtering in the visuals

The PI's publication record spans two eras: current retina/vision research at UT
Southwestern, and earlier microbial/comparative-genomics work from his PhD. The PhD-era
work is real and stays fully visible in the Publications page list — but it's not the
lab's current focus, so the site's two computed visuals (Home hero keyword diagram,
Publications page topic network) are scoped to vision-era papers only.

This is decided by a keyword allow-list in `src/lib/publications.ts`
(`PRE_VISION_KEYWORDS`) and its exported `isVisionEra(keywords)` check, imported by both
`NetworkHero.astro` and `PublicationNetwork.astro`: if a paper carries *any* keyword from
that set (`"Tuberculosis"`, `"CRISPR-Cas"`, `"Mycobacterium"`, etc.), it's excluded from
both visuals. This means:

- A new vision-era paper is included in both visuals automatically — nothing to update.
- A new paper revisiting one of the older genomics-era keywords is excluded
  automatically — nothing to update.
- The one manual step: if a new paper introduces a genomics-era keyword that isn't in
  `PRE_VISION_KEYWORDS` yet, it will default to *included* until someone adds that
  keyword string to the list. In practice this should come up rarely to never — that
  chapter of the PI's research is finished, so the list shouldn't need to grow.

## Commands

| Command             | Action                                              |
| :------------------ | :--------------------------------------------------- |
| `astro dev --background` | Start the local dev server (see `CLAUDE.md`)     |
| `npx astro check`   | Type-check + validate all content collection schemas |
| `npx astro build`   | Build the production site to `./dist/`                |
| `npx axe <url> --exit` | Accessibility check against a running page          |

Always run `astro check` after editing a content file — it validates the JSON/frontmatter
against the schemas in `src/content.config.ts` and will catch a bad field before it ever
reaches a page.

# Maintaining this site

Step-by-step guide for adding and updating content — Research, Team, Publications, and
News & Gallery — without touching layout code. Team, Publications, News, and Gallery are
all **content collections**: add or edit a file in the right folder, rebuild, and the
change shows up in the right place automatically. Research is the one exception — it's
short, hand-written copy directly in a page.

## Add a research program

Unlike everything else in this guide, the two program cards on the Research page aren't a
content collection — they're a `processes` array written directly into the page, since
there are only ever a couple of these and each one needs a specific hand-picked diagram.

**File:** `src/pages/research.astro`

```js
{
  title: 'Your Research Theme Title',
  glyphSeed: 2, // one higher than the last entry in the array
  body: 'One paragraph describing the program. This is the only text shown — there is no separate short/expanded split.',
  image: '/images/your-diagram.png',
  imageAlt: 'Plain-language description of what the diagram shows',
}
```

Add a new object to the `processes` array near the top of the file. `glyphSeed` just
needs to be a number nothing else in the array is already using — it seeds
`ThemeGlyph.astro`'s small decorative mark next to the title. Drop the diagram file into
`public/images/` first (see [Images](#images), below) before referencing it.

The lede paragraph under the "Research" heading ("Two convergent research programs...")
is also plain text in this same file, just above the `processes` array.

### What updates automatically

Nothing — this is the one section where every change is a direct edit to the page.

## Add a team member

**Folder:** `src/content/team/` — one Markdown file per person, e.g. `jane-doe.md`. The
filename doesn't affect anything shown on the site.

```markdown
---
name: "Jane Doe"
role: "Graduate Student"
order: 3
isPI: false
---

**Field** — Ph.D. candidate, Institution (expected 2028)

A couple of paragraphs about their background and current work — see
`ema-bidiwala.md` or `bharathram-uppili.md` for the current tone/length reference.
```

| Field                | Required | Notes                                                                                  |
| :------------------- | :------- | :-------------------------------------------------------------------------------------- |
| `name`               | yes      |                                                                                           |
| `role`               | yes      | Shown right under the name, e.g. `"Postdoctoral Fellow"`                                |
| `order`              | yes      | Lower numbers appear first in the roster. The PI should stay at `0`.                     |
| `isPI`               | yes      | `true` for exactly one person — gives them the bigger, featured card at the top          |
| `bioShort`           | no       | One sentence — shown **only** in the Home page's Principal Investigator box, not on the Team page itself |
| `email`              | no       | Rendered as a `mailto:` link on their card                                              |
| `photo`              | no       | Defined in the schema but not yet wired to a component — ask before relying on it        |

Leave the Markdown body empty and the card shows "Bio coming soon." instead — that's how
a new hire gets added on day one, bio to follow later.

### What updates automatically

- **Team page**: new card appears in the roster, ordered by `order`.
- **Home page's Principal Investigator box**: only changes if you add or move the
  `isPI: true` entry.
- **Avatar**: `Avatar.astro` generates a deterministic geometric icon from the person's
  `name` — no photo upload required.

## Add a publication

**File:** `src/content/publications/publications.json` — a single JSON array, one object
per paper. Copy an existing entry as a starting template; one misplaced comma breaks the
whole file.

```json
{
  "id": "doe-2026-nature",
  "authors": ["Doe J", "Mondal AK"],
  "piHighlight": "Mondal AK",
  "title": "Paper title exactly as published",
  "journal": "Nature",
  "year": 2026,
  "doi": "https://doi.org/10.xxxx/xxxxx",
  "keywords": ["Retina", "Aging"],
  "citations": 0
}
```

| Field                                                               | Required | Notes                                                                                    |
| :------------------------------------------------------------------- | :------- | :----------------------------------------------------------------------------------------- |
| `id`                                                                  | yes      | Unique slug, e.g. `"song-2025-elife"`                                                       |
| `authors`                                                             | yes      | Array of author strings, in order                                                           |
| `piHighlight`                                                         | no       | Exact author string to bold, e.g. `"Mondal AK"`                                             |
| `title`, `journal`, `year`                                            | yes      | `year` is a number, not a string                                                            |
| `month`, `volume`, `issue`, `pages`, `articleNumber`                  | no       |                                                                                               |
| `doi` / `url`                                                         | no       | Must be a full URL (`"https://doi.org/10.xxxx/..."`), not a bare DOI string                  |
| `type`                                                                | no       | `"journal-article"` (default), `"review"`, or `"book-chapter"`                              |
| `featured`                                                            | no       | Boolean, default `false`                                                                    |
| `keywords`                                                            | **yes, in practice** | Drives the topic network graph on the Publications page — see below                |
| `citations`                                                           | no       | From Google Scholar; powers the "Most cited" sort                                            |
| `summary`                                                             | no, but recommended | A short *original* summary in plain language — see below                            |
| `image`, `imageAlt`                                                   | no       | A real figure from the paper — see [Images](#images); most entries don't have one yet        |

**`summary` must not be the published abstract copied verbatim** — that text is the
publisher's copyrighted material. Write a couple of original sentences describing what
the paper found, and let `doi`/`url` be where a reader goes for the real abstract and
figures.

**`keywords` is what drives the topic network graph** on the Publications page. Reuse
existing keyword strings where the paper is genuinely about the same topic (`"Retina"`,
`"Epigenome"`, `"Aging"`, etc.) rather than inventing near-duplicates — the graph works by
matching *identical* keyword strings across papers, so `"Multiomics"` and `"Multi-omics"`
are two different nodes to the code even though they mean the same thing to a person.
Skim a few existing entries' `keywords` arrays before adding new tags.

### What updates automatically

- **Publications page**: the new card appears in the masonry grid, sorted into place by
  year/citations.
- **Publications page topic network**: recomputed from every publication's `keywords` on
  every build — a new paper's keywords shift which topics appear, how big their nodes
  are, and which topics connect, automatically.
- **Home page "Recent Publications" carousel**: shows the most recent papers; a new
  publication with a later year appears there automatically.

## Add a news post

**Folder:** `src/content/news/` — one Markdown file per post, e.g.
`2026-09-10-new-grant.md`. The filename becomes the URL slug.

```markdown
---
title: "New R01 grant funded"
date: 2026-09-10
excerpt: "One-sentence summary, 240 characters max — shown on the card."
tags: ["Funding"]
type: "post"
---

Full post body in Markdown goes here.
```

Press coverage of the lab uses the same collection with `type: "press"` and skips the
body — the card links straight out to the outlet instead of an internal page:

```markdown
---
title: "Mondal Lab featured in UTSW spotlight"
date: 2026-09-01
excerpt: "Short line describing the coverage."
type: "press"
sourceName: "UT Southwestern"
externalUrl: "https://www.utsouthwestern.edu/..."
---
```

| Field                | Required | Notes                                                                 |
| :------------------- | :------- | :---------------------------------------------------------------------- |
| `title`, `date`      | yes      |                                                                           |
| `excerpt`            | yes      | 240 characters max                                                       |
| `type`               | no       | `"post"` (default, lab-written) or `"press"` (external coverage)         |
| `externalUrl`, `sourceName` | required when `type: "press"` | Where the card links out to  |
| `tags`               | no       | Array of short labels shown on the card                                 |
| `relatedPublication` | no       | Must match an existing publication `id`                                 |
| `placeholder`        | no       | For bootstrap/seed content that should stay easy to find-and-replace     |
| `draft`              | no       | Set `true` to write a post without publishing it yet                    |

### What updates automatically

- **News & Gallery page, News tab**: lists every non-draft post, newest first, alongside
  a chronological "Archive" list in the sidebar linking straight to each one.
- **Home page "Updates" box**: shows the 3 most recent non-draft posts. Nothing is ever
  deleted — older posts just drop out of this short preview and stay on the full News
  list and in the Archive sidebar.

## Add a gallery photo

**Folder:** `src/content/gallery/` — one Markdown file per photo. Lives under the same
"News & Gallery" nav item as News, as a second tab on the same page.

```markdown
---
caption: "Lab retreat, Fall 2026"
alt: "The Mondal Lab team standing outside the retreat venue"
date: 2026-10-15
image: "/images/gallery/retreat-2026.jpg"
placeholder: false
order: 0
---
```

| Field         | Required | Notes                                                          |
| :------------ | :------- | :----------------------------------------------------------------- |
| `caption`     | yes      | Shown under the photo                                               |
| `alt`         | yes      | Plain-language description, for screen readers                      |
| `date`        | yes      | Not displayed, but available for sorting later                      |
| `order`       | no       | Lower numbers appear first in the grid                              |
| `image`       | no       | Omit while `placeholder: true`                                      |
| `placeholder` | no       | Defaults to `true` — set to `false` once `image` is filled in       |

Until `image` is set, the tile shows a plain "coming soon" placeholder instead of a
broken image.

### What updates automatically

- **News & Gallery page, Gallery tab**: new tile appears in the grid, ordered by `order`.

## Images

Frontmatter/JSON fields never hold an uploaded file — they hold a path to one that
already exists in the repo.

1. Put the file itself in `public/images/` — publication figures go in
   `public/images/publications/` specifically, so they stay easy to find.
2. Reference it starting with `/images/...` in the frontmatter or JSON (e.g.
   `/images/publications/doe-2026-nature.jpg`). The site adds its own deployment base
   path automatically (see [Deployment](#deployment) below) — never write the full URL.
3. Keep figures under ~1200px on the long edge and re-compress to JPEG quality ~80 before
   adding them (`sips -Z 1200 -s formatOptions 80 file.jpg` on macOS) — keeps the page
   fast with no visible quality loss.

## Funding and Resources

Two more content collections exist for completeness but aren't both wired to a page
right now:

- **Resources** (`src/content/resources/`, fields: `title`, `description`, `url`,
  `order`) renders at the bottom of the Publications page. Add a Markdown file the same
  way as News/Team/Gallery to add a new one.
- **Funding** (`src/content/funding/`, fields: `funder`, `title`, `period`,
  `grantNumber`, `order`) is defined in `src/content.config.ts` but not currently
  rendered on any page — it was removed from the Research page. Ask before relying on it
  if you need a funding list back on the site.

## Commands

| Command                    | Action                                                          |
| :-------------------------- | :---------------------------------------------------------------- |
| `astro dev --background`   | Start the local dev server (see `CLAUDE.md`); manage with `astro dev stop` / `status` / `logs` |
| `npx astro check`          | Type-check + validate all content collection schemas against `src/content.config.ts` |
| `npx astro build`          | Build the production site to `./dist/`                              |
| `npx axe <url> --exit`     | Accessibility check against a running page                          |

Always run `astro check` (or a full `astro build`) after editing a content file — it
validates the JSON/frontmatter against the schemas in `src/content.config.ts` and will
catch a bad field before it ever reaches a page.

# Mondal Lab website

Source for the Mondal Lab site (UT Southwestern, Dept. of Ophthalmology). Built with
[Astro](https://astro.build) — static output, content managed as Markdown/JSON content
collections, no server required.

## Project structure

```text
src/
  content.config.ts        # Zod schemas for every content collection
  content/
    publications/publications.json   # one JSON array, every citation
    news/*.md                        # one file per news post (or press mention)
    team/*.md                        # one file per team member
    gallery/*.md                     # one file per lab photo
    resources/*.md                   # one file per external resource (Publications page)
    funding/*.md                     # defined, not currently rendered on any page
  layouts/                 # BaseLayout (site chrome), ArticleLayout (news posts)
  components/               # nav (SiteHeader), SiteFooter, motif (NetworkHero/
                             # NetworkDivider/ThemeGlyph/TopicIcon), content cards
  pages/                    # Home, Research, Team, Publications, News & Gallery,
                             # Contact, 404 — Gallery is a tab on the News page, not
                             # its own route
  styles/                   # tokens.css (design tokens), global.css, network-motif.css
public/
  images/                   # real content images (publications/, gallery/, research diagrams)
  network-hero-fallback.svg # static fallback for the Home hero (no-JS / narrow screens)
```

## Editing content

See **[MAINTAINING.md](./MAINTAINING.md)** for the full step-by-step guide — adding a
research program, team member, publication, news post, or gallery photo, and exactly
which visuals regenerate automatically from that content versus which page copy is
hand-maintained.

Quick reference:

- **Research**: the two program cards are hand-written directly in `src/pages/research.astro`
  (a `processes` array), not a content collection — the only section where that's true.
- **Team**: add a new Markdown file to `src/content/team/` — the Team page loops over
  every entry automatically, ordered by the `order` field.
- **Publications**: add an entry to `src/content/publications/publications.json`. Fields
  are validated against the schema in `src/content.config.ts` — the build fails loudly on
  a typo'd field.
- **News & Gallery**: add a Markdown file to `src/content/news/` or `src/content/gallery/`
  — both collections render as two tabs on the same page (`/news`).
- **Contact details**: `src/components/ContactBlock.astro` currently renders email/phone/
  social as explicit "coming soon" placeholders (nothing was published on the previous
  site to carry over) — fill those in directly once real values exist.

## Commands

| Command                  | Action                                                        |
| :------------------------ | :-------------------------------------------------------------- |
| `npm install`              | Install dependencies                                              |
| `astro dev --background`  | Start the local dev server in the background (see `CLAUDE.md`) — manage with `astro dev stop` / `astro dev status` / `astro dev logs` |
| `npm run build`            | Build the production site to `./dist/`                            |
| `npm run preview`          | Serve the production build locally                                |
| `npx astro check`          | Type-check + validate content collection schemas                  |
| `npx axe <url> --exit`     | Run automated accessibility checks (dev dependency)               |

## Design notes

- **Design tokens** live in `src/styles/tokens.css` (colors, type scale, spacing,
  elevation). Change the site's look from one place.
- **Elevation**: cards use a shared soft drop shadow (`--shadow-card`/`--shadow-card-hover`
  in tokens.css) instead of borders — apply it via the `.widget` utility class
  (`global.css`) where possible rather than a one-off `box-shadow` per component.
- **Fonts** are self-hosted via `@fontsource` packages — Archivo (headings), Inter (body),
  IBM Plex Mono (labels, code, mono text) — no external font CDN request.
- **The network/graph motif** — the "nerdy lab" visual signature — has several
  touchpoints: `NetworkHero` (a live canvas sketch, Home hero), `PublicationNetwork` (the
  interactive topic graph on the Publications page), and `NetworkDivider`/`ThemeGlyph`
  (static, used elsewhere).
- **Header and footer are both fixed** (`position: fixed`), not in normal document flow —
  `body` reserves `--header-height` and `--taskbar-height` in `tokens.css` so page content
  never sits underneath either one.

## Deployment

The site builds to fully static output (`dist/`) — no server/adapter required. Currently
deployed to **GitHub Pages** via `.github/workflows/deploy.yml`, which builds and deploys
on every push to `main`. `site`/`base` in `astro.config.mjs` are set for the temporary
`bharathram-utsw/bharathram-utsw` GitHub Pages project site — update both (and drop
`base` entirely for a custom domain or an `<org>.github.io` root repo) once the lab's
permanent hosting is set up.

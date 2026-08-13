# Mondal Lab website

Source for the Mondal Lab site (UT Southwestern, Dept. of Ophthalmology). Built with
[Astro](https://astro.build) — static output, content managed as Markdown/JSON content
collections, no server required.

## Project structure

```text
src/
  content.config.ts        # Zod schemas for publications / news / team
  content/
    publications/publications.json   # one JSON array, all citations
    news/*.md                        # one file per news post
    team/*.md                        # one file per team member
  layouts/                # BaseLayout (site chrome), ArticleLayout (news posts)
  components/              # nav, motif (NetworkHero/NetworkDivider/ThemeGlyph), content cards
  pages/                   # Home, Research, Team, Publications, News, Contact, 404
  styles/                  # tokens.css (design tokens), global.css, network-motif.css
public/
  network-hero-fallback.svg  # static fallback for the Home hero (no-JS / narrow screens)
```

## Editing content

See **[MAINTAINING.md](./MAINTAINING.md)** for the full step-by-step guide — adding a
publication, news post, or team member, and exactly which visuals (Home hero, PCA plot)
regenerate automatically from that content versus which page copy is hand-maintained.

Quick reference:

- **Publications**: add an entry to `src/content/publications/publications.json`. Fields
  are validated against the schema in `src/content.config.ts` — the build fails loudly on
  a typo'd field.
- **News**: add a new Markdown file to `src/content/news/` (filename becomes the URL
  slug, e.g. `2026-09-01-new-grant.md`). Set `placeholder: true` in frontmatter for
  bootstrap/seed posts that should be easy to find and replace.
- **Team**: add a new Markdown file to `src/content/team/` — the Team page loops over
  every entry automatically, ordered by the `order` field.
- **Contact details**: `src/components/ContactBlock.astro` currently renders email/phone/
  social as explicit "coming soon" placeholders (nothing was published on the previous
  site to carry over) — fill those in directly once real values exist.

## Commands

| Command             | Action                                            |
| :------------------- | :------------------------------------------------ |
| `npm install`         | Install dependencies                               |
| `npm run dev`          | Start the local dev server at `localhost:4321`     |
| `npm run build`        | Build the production site to `./dist/`             |
| `npm run preview`      | Serve the production build locally                 |
| `npx astro check`      | Type-check + validate content collection schemas   |
| `npx axe <url> ...`    | Run automated accessibility checks (dev dependency) |

## Design notes

- **Design tokens** live in `src/styles/tokens.css` (colors, type scale, spacing). Change
  the site's look from one place.
- **Fonts** are self-hosted via `@fontsource` packages (IBM Plex Sans, Source Serif 4,
  IBM Plex Mono) — no external font CDN request.
- **The network/graph motif** — the "nerdy lab" visual signature — has three touchpoints:
  `NetworkHero` (a live p5.js sketch, Home page only), `NetworkDivider` and `ThemeGlyph`
  (static SVG, used everywhere else). Every page except Home ships zero JavaScript.

## Deployment

The site builds to fully static output (`dist/`) — no server/adapter required. Recommended
host: [Netlify](https://netlify.com) (auto-detects Astro; build command `astro build`,
publish directory `dist`). Update `site` in `astro.config.mjs` if the deploy domain
changes from `https://www.mondal-lab.com`.

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Temporary GitHub Pages project-site hosting (bharathram-utsw/bharathram-utsw)
// until the lab's permanent GitHub Pages repo is set up — at that point,
// update `site`/`base` to match (drop `base` entirely for a custom domain
// or a `<org>.github.io` root repo).
export default defineConfig({
  site: 'https://bharathram-utsw.github.io',
  base: '/bharathram-utsw',
  integrations: [sitemap()],
  // Gallery lives as a tab on the News page now, not its own route — this
  // keeps any old/external link to /gallery landing somewhere real instead
  // of a 404, with the Gallery tab pre-selected (see news/index.astro).
  redirects: {
    // Astro doesn't prepend `base` to a redirect target automatically —
    // written out in full so it still lands correctly under /bharathram-utsw.
    '/gallery': '/bharathram-utsw/news#gallery',
  },
});

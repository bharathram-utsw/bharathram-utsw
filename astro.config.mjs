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
});

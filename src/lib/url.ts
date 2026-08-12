// Prefixes an internal absolute path with the configured base path
// (astro.config.mjs `base`), so links keep working whether the site is
// hosted at a domain root or a GitHub Pages project subpath.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

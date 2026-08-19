import { defineConfig } from 'astro/config';

// User (apex) GitHub Pages site — served from the repo root, no base path.
export default defineConfig({
  site: 'https://reginabduarte.github.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://theemiratesguide.tourground.com',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [sitemap({ filter: (p) => !p.endsWith('/404/') })],
  markdown: { smartypants: true },
  image: { responsiveStyles: false },
});

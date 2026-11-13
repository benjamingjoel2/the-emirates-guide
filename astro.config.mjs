import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import rehypeRaw from 'rehype-raw';
import rehypePhotos from './src/lib/rehype-photos.mjs';

const SITE = 'https://theemiratesguide.tourground.com';
// Last-modified dates for the sitemap, read from each post's "updated" field.
const postsDir = path.resolve('./src/content/posts');
const updated = {};
let newest = '2026-11-11';
for (const f of fs.existsSync(postsDir) ? fs.readdirSync(postsDir) : []) {
  if (!f.endsWith('.md')) continue;
  const m = fs.readFileSync(path.join(postsDir, f), 'utf8').match(/^updated:\s*"?(\d{4}-\d{2}-\d{2})/m);
  if (m) { updated[f.replace(/\.md$/, '')] = m[1]; if (m[1] > newest) newest = m[1]; }
}

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      filter: (p) => !p.endsWith('/404/'),
      serialize(item) {
        const m = item.url.match(/\/stories\/([^/]+)\/$/);
        const date = m && updated[m[1]] ? updated[m[1]] : newest;
        item.lastmod = new Date(date + 'T00:00:00Z').toISOString();
        return item;
      },
    }),
  ],
  markdown: { smartypants: true, rehypePlugins: [rehypeRaw, rehypePhotos] },
  image: { responsiveStyles: false },
});

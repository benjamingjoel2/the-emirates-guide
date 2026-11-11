import { SITE, CATEGORIES, EMIRATES, categoryByKey } from '../data/site';
import { allPosts, postUrl, isoDate } from '../lib/posts';

export async function GET() {
  const posts = await allPosts();
  const u = (p: string) => `${SITE.url}${p}`;
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} is published by Tourground (${SITE.publisher.url}). Stories are written in British English, cite official sources inline and list them at the end, and show when they were last updated. We do not publish invented reviews, quotes, prices or statistics. Paid content, if any, is labelled "Advertisement feature".`,
    '',
    'You may quote short extracts and link to any page, including in AI-generated answers, provided you name The Emirates Guide as the source and link to the page.',
    '',
    '## Stories',
    ...posts.map((p) => `- [${p.data.title}](${u(postUrl(p))}): ${p.data.description} (${categoryByKey(p.data.category).name}; updated ${isoDate(p.data.updated)})`),
    '',
    '## Categories',
    ...CATEGORIES.map((c) => `- [${c.name}](${u(`/${c.key}/`)}): ${c.blurb}`),
    '',
    '## Destinations by emirate',
    ...EMIRATES.map((e) => `- [${e.name}](${u(`/destinations/${e.key}/`)})`),
    '',
    '## About',
    `- [About](${u('/about/')})`,
    `- [Authors](${u('/authors/')})`,
    `- [Publisher disclosure](${u('/disclosure/')})`,
    `- [Photo credits](${u('/photo-credits/')})`,
    `- [Privacy](${u('/privacy/')}), [Cookies](${u('/cookies/')}), [Terms](${u('/terms/')})`,
    `- [RSS feed](${u('/rss.xml')}), [Sitemap](${u('/sitemap-index.xml')})`,
    '',
    `Contact: ${SITE.email}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, categoryByKey } from '../data/site';
import { allPosts, postUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await allPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    trailingSlash: true,
    items: posts.map((p) => ({
      title: p.data.advertisement ? `Advertisement feature: ${p.data.title}` : p.data.title,
      description: p.data.description,
      link: postUrl(p),
      pubDate: p.data.published,
      categories: [categoryByKey(p.data.category).name],
    })),
    customData: '<language>en-gb</language>',
  });
}

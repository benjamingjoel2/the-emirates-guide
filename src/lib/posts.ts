import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

export async function allPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf() || a.data.title.localeCompare(b.data.title));
}

export const postUrl = (p: Post) => `/stories/${p.id}/`;

export function readingMinutes(p: Post): number {
  const words = (p.body ?? '').replace(/[#>*_`\[\]\(\)-]/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function related(p: Post, posts: Post[], n = 3): Post[] {
  const score = (o: Post) =>
    (o.data.category === p.data.category ? 2 : 0) + o.data.emirates.filter((e) => p.data.emirates.includes(e)).length;
  return posts
    .filter((o) => o.id !== p.id)
    .map((o, i) => ({ o, s: score(o), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, n)
    .map((x) => x.o);
}

const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const formatDate = (d: Date) => fmt.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

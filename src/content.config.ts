import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['destinations', 'itineraries', 'desert-adventure', 'food-culture', 'where-to-stay', 'travel-tips']),
    emirates: z.array(z.enum(['abu-dhabi', 'dubai', 'sharjah', 'ajman', 'umm-al-quwain', 'ras-al-khaimah', 'fujairah'])).default([]),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    author: z.enum(['editors']).default('editors'),
    hero: z.string(),
    heroAlt: z.string(),
    featured: z.boolean().default(false),
    startHere: z.boolean().default(false),
    /** Paid placements must set this; they are labelled "Advertisement feature" everywhere. */
    advertisement: z.boolean().default(false),
    advertiser: z.string().optional(),
    plan: z.string(),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
  }),
});

export const collections = { posts };

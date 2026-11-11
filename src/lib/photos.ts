import type { ImageMetadata } from 'astro';
import credits from '../data/photos.json';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

export type Credit = { file: string; author: string; license: string; licenseUrl: string; source: string; description?: string };

export function photo(key: string): { src: ImageMetadata; credit: Credit } {
  const mod = files[`../assets/photos/${key}.jpg`];
  const credit = (credits as Record<string, Credit>)[key];
  if (!mod || !credit) throw new Error(`Missing photo or credit for "${key}"`);
  return { src: mod.default, credit };
}

export const allCredits = () => Object.entries(credits as Record<string, Credit>).sort(([a], [b]) => a.localeCompare(b));

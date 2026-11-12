import type { ImageMetadata } from 'astro';
import credits from '../data/photos.json';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

export type Credit = { file: string; author: string; license: string; licenseUrl: string; source: string; description?: string };

// If a requested photo is not available yet, fall back to the closest existing one.
const FALLBACK: Record<string, string> = {
  'burj-al-arab': 'dubai-burj-ferry', 'dubai-marina': 'dubai-burj-ferry', 'dubai-frame': 'dubai-burj-ferry', 'museum-of-the-future': 'dubai-burj-ferry',
  'palm-jumeirah': 'dubai-burj-ferry', 'jumeirah-beach': 'dubai-burj-ferry', 'dubai-metro': 'dubai-burj-ferry', 'dubai-fountain': 'dubai-burj-ferry',
  'kite-beach': 'dubai-burj-ferry', 'jumeirah-mosque': 'abu-dhabi-mosque', 'etihad-museum': 'al-fahidi', 'al-seef': 'al-fahidi', 'gold-souk': 'spice-souk',
  'dubai-creek-dhow': 'dubai-creek-abras', 'hatta-heritage': 'hatta-dam', 'desert-camp': 'camels-dunes', 'camel-racing': 'camels-dunes', 'falconry': 'camels-dunes',
  'arabian-oryx': 'liwa-dune', 'moreeb-dune': 'liwa-dune', 'sir-bani-yas': 'liwa-dune', 'dates-market': 'arabic-coffee',
  'qasr-al-watan': 'abu-dhabi-mosque', 'qasr-al-hosn': 'abu-dhabi-mosque', 'abu-dhabi-corniche': 'abu-dhabi-mosque', 'abu-dhabi-skyline': 'abu-dhabi-mosque',
  'yas-island': 'abu-dhabi-mosque', 'mangrove-abu-dhabi': 'musandam-dhow', 'louvre-exterior': 'louvre-abu-dhabi', 'jahili-fort': 'dhayah-fort',
  'jebel-hafit': 'jebel-jais-sunset', 'hili-park': 'dhayah-fort', 'sharjah-islamic-museum': 'sharjah-heritage', 'al-noor-mosque': 'sharjah-heritage',
  'sharjah-corniche': 'sharjah-heritage', 'khorfakkan': 'al-bidya-mosque', 'fujairah-fort': 'al-bidya-mosque', 'snoopy-island': 'musandam-dhow',
  'dibba': 'al-bidya-mosque', 'wadi-shawka': 'jebel-jais-sunset', 'jazirat-al-hamra': 'dhayah-fort', 'ajman-museum': 'ajman-corniche',
  'rak-beach': 'jebel-jais-sunset', 'musandam-fjord': 'musandam-dhow', 'muscat-mosque': 'musandam-dhow',
};

export function photo(key: string): { src: ImageMetadata; credit: Credit } {
  const tryKey = (k: string) => {
    const mod = files[`../assets/photos/${k}.jpg`];
    const credit = (credits as Record<string, Credit>)[k];
    return mod && credit ? { src: mod.default, credit } : null;
  };
  const hit = tryKey(key) ?? tryKey(FALLBACK[key] ?? '') ?? tryKey('dubai-creek-abras');
  if (!hit) throw new Error(`Missing photo for "${key}"`);
  return hit;
}

export const allCredits = () => Object.entries(credits as Record<string, Credit>).sort(([a], [b]) => a.localeCompare(b));

export const SITE = {
  name: 'The Emirates Guide',
  url: 'https://theemiratesguide.tourground.com',
  description:
    'Story-led, practical travel guides to the United Arab Emirates: where to go, when to go, what it is really like, and how to book safely with a verified local operator. Published by Tourground.',
  tagline: 'Story-led, practical guides to the seven emirates, written for people planning a trip.',
  email: 'theemiratesguide@tourground.com',
  locale: 'en_GB',
  launched: '2026-11-11',
  publisher: { name: 'Tourground', url: 'https://tourground.com' },
  /** Where "Plan this trip" boxes send readers: the Tourground directory for travellers. */
  directoryUrl: 'https://tourground.com/#/travellers',
  sisterSite: { name: 'Trusted Ground', url: 'https://trustedground.tourground.com' },
};

export const AUTHORS = {
  editors: {
    key: 'editors',
    name: 'The Emirates Guide editors',
    role: 'Editorial desk, Tourground',
    bio: 'The Emirates Guide is written and edited by Tourground’s editorial desk. We check every rule, opening arrangement and entry requirement against official sources, link them in the story, and date every page so you can see when it was last checked.',
  },
} as const;
export type AuthorKey = keyof typeof AUTHORS;

export const CATEGORIES = [
  { key: 'destinations', name: 'Destinations', blurb: 'All seven emirates, one by one: what each is like, who it suits and how it fits into a trip.' },
  { key: 'itineraries', name: 'Itineraries', blurb: 'Day-by-day routes with realistic pacing, built around the heat, the weekend and the distances.' },
  { key: 'desert-adventure', name: 'Desert & Adventure', blurb: 'Dunes, mountains, wadis and the sea: what outdoor trips involve and how to do them safely.' },
  { key: 'food-culture', name: 'Food & Culture', blurb: 'Emirati food, customs and etiquette, and how to be a considerate guest.' },
  { key: 'where-to-stay', name: 'Where to Stay', blurb: 'Choosing a base: which city, which kind of neighbourhood, and why it matters for your days.' },
  { key: 'travel-tips', name: 'Travel Tips', blurb: 'Seasons, Ramadan, entry rules and the practical things that shape a UAE trip.' },
] as const;
export type CategoryKey = (typeof CATEGORIES)[number]['key'];
export const categoryByKey = (k: string) => CATEGORIES.find((c) => c.key === k)!;

/** Emirate intros are drawn from the UAE Government portal (u.ae), "The Seven Emirates". */
export const EMIRATES_SOURCE = { title: 'UAE Government portal: The Seven Emirates', url: 'https://u.ae/en/about-the-uae/the-seven-emirates' };
export const EMIRATES = [
  { key: 'abu-dhabi', name: 'Abu Dhabi', photo: 'abu-dhabi-mosque', photoAlt: 'The palm-lined approach to the Sheikh Zayed Grand Mosque in Abu Dhabi', official: { name: 'Visit Abu Dhabi', url: 'https://visitabudhabi.ae/en' },
    intro: 'Abu Dhabi is the federal capital of the UAE and its largest emirate. It takes in the island city with its corniche, the Sheikh Zayed Grand Mosque and the museums of Saadiyat, the garden city of Al Ain near the Omani border, and the long sands of Liwa on the edge of the Empty Quarter.' },
  { key: 'dubai', name: 'Dubai', photo: 'dubai-creek-abras', photoAlt: 'Wooden abra boats moored on Dubai Creek', official: { name: 'Visit Dubai', url: 'https://www.visitdubai.com/en' },
    intro: 'Dubai is the second-largest emirate and, for most visitors, the way in. Beyond the towers and the beach there is the older city around the Creek, with its abras, souks and wind-tower lanes, and the desert and Hajar mountains at Hatta.' },
  { key: 'sharjah', name: 'Sharjah', photo: 'sharjah-heritage', photoAlt: 'Restored coral-stone buildings in the Heart of Sharjah heritage area', official: { name: 'Visit Sharjah', url: 'https://www.visitsharjah.com/en/' },
    intro: 'Sharjah, the third-largest emirate, sits right next to Dubai and is known for its museums, its restored heritage quarter and a more conservative, family-focused feel. Inland, the desert around Mleiha holds some of the country’s oldest archaeological sites.' },
  { key: 'ajman', name: 'Ajman', photo: 'ajman-corniche', photoAlt: 'Waves breaking on the rocks along the Ajman corniche at dusk', official: null,
    intro: 'Ajman is the smallest of the seven emirates: a compact coastal city with a long beachfront corniche, a short drive up the coast from Sharjah. Its inland territory includes the mountain enclave of Masfout.' },
  { key: 'umm-al-quwain', name: 'Umm Al Quwain', photo: 'uaq-fort', photoAlt: 'The white watchtower of Umm Al Quwain Fort between date palms', official: null,
    intro: 'Umm Al Quwain is the second-smallest emirate and the least populated, a place of lagoons, mangroves and an old town on a narrow peninsula. Fishing has long been central to its economy, and it is the quietest stop on the west coast.' },
  { key: 'ras-al-khaimah', name: 'Ras Al Khaimah', photo: 'jebel-jais-sunset', photoAlt: 'Late-afternoon light on the Jebel Jais mountains in Ras Al Khaimah', official: { name: 'Visit Ras Al Khaimah', url: 'https://visitrasalkhaimah.com' },
    intro: 'Ras Al Khaimah, the fourth-largest emirate, is the northernmost: beaches and lagoons on one side, and the Hajar mountains, including Jebel Jais, rising behind. It has old forts and archaeological sites, and the road on to Oman’s Musandam peninsula.' },
  { key: 'fujairah', name: 'Fujairah', photo: 'al-bidya-mosque', photoAlt: 'Al Bidya Mosque, a small domed mosque of stone and clay, below the hills of Fujairah', official: { name: 'Fujairah Tourism', url: 'https://fujairahtourism.ae' },
    intro: 'Fujairah is the only emirate that lies entirely on the UAE’s east coast, facing the Gulf of Oman rather than the Arabian Gulf. Mountains come down almost to the sea, and its economy has traditionally rested on fishing and agriculture.' },
] as const;
export type EmirateKey = (typeof EMIRATES)[number]['key'];
export const emirateByKey = (k: string) => EMIRATES.find((e) => e.key === k)!;

# The Emirates Guide

Story-led, practical travel guides to the United Arab Emirates. Published by Tourground.
Live at https://theemiratesguide.tourground.com (Vercel project `the-emirates-guide`).

Built with Astro as a static site. Sister site: https://trustedground.tourground.com

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```

## Content

- Posts: `src/content/posts/<slug>.md`. Frontmatter schema in `src/content.config.ts`.
  - `updated` drives the "Last updated" line. Change it whenever you re-check facts.
  - `sources` must list every external URL cited inline in the body.
  - Paid placements must set `advertisement: true` (and `advertiser`); they are labelled "Advertisement feature" on cards, on the post and in JSON-LD.
- Categories, emirates, authors and site settings: `src/data/site.ts`.
  - `directoryUrl` is where every "Plan this trip" box links (the Tourground directory).
- Photos: `src/assets/photos/<key>.jpg` with credits in `src/data/photos.json` (shown on each page and on /photo-credits/).

## House rules

No invented reviews, quotes, prices or statistics. Facts that change (visas, opening times, dress codes, Ramadan hours) link the official source inline. British English, no em dashes.

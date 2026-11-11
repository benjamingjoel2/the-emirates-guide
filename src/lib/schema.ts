import { SITE } from '../data/site';

export const ORG_ID = `${SITE.url}/#publisher`;
export const SITE_ID = `${SITE.url}/#website`;

export const organization = () => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.publisher.name,
  url: SITE.publisher.url,
  email: SITE.email,
});

export const website = () => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  name: SITE.name,
  url: `${SITE.url}/`,
  description: SITE.description,
  inLanguage: 'en-GB',
  publisher: { '@id': ORG_ID },
});

export type Crumb = { name: string; path: string };
export const breadcrumbs = (crumbs: Crumb[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: `${SITE.url}${c.path}` })),
});

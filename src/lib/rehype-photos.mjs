// Turns <photo-set layout="pair" keys="a,b" alts="Alt A|Alt B" caption="..."></photo-set> in posts
// into captioned, credited figures. Layouts: wide, full, pair, trio, inset-left, inset-right, mosaic.
import fs from 'node:fs';
const LAYOUTS = { wide: 1, full: 1, pair: 2, trio: 3, 'inset-left': 1, 'inset-right': 1, mosaic: 3 };
const SIZES = { wide: '(min-width: 1100px) 1024px, 100vw', full: '100vw', pair: '(min-width: 1100px) 512px, 100vw', trio: '(min-width: 1100px) 340px, 50vw', 'inset-left': '(min-width: 900px) 320px, 100vw', 'inset-right': '(min-width: 900px) 320px, 100vw', mosaic: '(min-width: 1100px) 512px, 100vw' };
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const el = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const txt = (value) => ({ type: 'text', value });

export default function rehypePhotos() {
  return (tree, file) => {
    const credits = load('src/data/photos.json');
    let man = {};
    try { man = load('src/data/img-manifest.json'); } catch {}
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.map((c) => {
        if (c.type === 'element' && c.tagName === 'photo-set') return build(c, credits, man, file);
        // Markdown wraps a lone tag in <p>; unwrap it so the figure is not inside a paragraph.
        if (c.type === 'element' && c.tagName === 'p') {
          const kids = (c.children || []).filter((k) => !(k.type === 'text' && !k.value.trim()));
          if (kids.length === 1 && kids[0].type === 'element' && kids[0].tagName === 'photo-set') return build(kids[0], credits, man, file);
        }
        walk(c);
        return c;
      });
    };
    walk(tree);
  };
}

function build(node, credits, man, file) {
  const p = node.properties || {};
  const layout = String(p.layout || 'wide');
  const keys = String(p.keys || '').split(',').map((s) => s.trim()).filter(Boolean);
  const alts = String(p.alts || '').split('|').map((s) => s.trim());
  const where = file?.path ? ` in ${file.path}` : '';
  if (!LAYOUTS[layout]) throw new Error(`photo-set: unknown layout "${layout}"${where}`);
  if (keys.length !== LAYOUTS[layout]) throw new Error(`photo-set: layout "${layout}" needs ${LAYOUTS[layout]} photo(s), got ${keys.length}${where}`);
  const imgs = keys.map((k, i) => {
    const c = credits[k];
    if (!c) throw new Error(`photo-set: no photo "${k}"${where}`);
    if (!alts[i]) throw new Error(`photo-set: missing alt text for "${k}"${where}`);
    const d = man[k] || { w: 1280, h: 853 };
    const h640 = Math.round((Math.min(640, d.w) / d.w) * d.h);
    return el('img', { src: `/img/${k}-1280.webp`, srcSet: `/img/${k}-640.webp 640w, /img/${k}-1280.webp ${Math.min(1280, d.w)}w`, sizes: SIZES[layout], width: Math.min(640, d.w), height: h640, alt: alts[i], loading: 'lazy', decoding: 'async' });
  });
  const seen = new Set();
  const people = keys.map((k) => credits[k]).filter((c) => { const id = `${c.author}|${c.license}`; if (seen.has(id)) return false; seen.add(id); return true; });
  const creditNodes = [txt(people.length > 1 ? 'Photos: ' : 'Photo: ')];
  people.forEach((c, i) => {
    if (i) creditNodes.push(txt('; '));
    creditNodes.push(el('a', { href: c.source }, [txt(c.author)]), txt(' · '), el('a', { href: c.licenseUrl || c.source }, [txt(c.license)]));
  });
  const cap = [];
  if (p.caption) cap.push(el('span', { className: ['ps__caption'] }, [txt(String(p.caption))]));
  cap.push(el('span', { className: ['ps__credit'] }, creditNodes));
  return el('figure', { className: ['ps', `ps--${layout}`] }, [el('div', { className: ['ps__grid'] }, imgs), el('figcaption', {}, cap)]);
}

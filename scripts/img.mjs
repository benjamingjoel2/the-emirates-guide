// Builds web-ready copies of every photo for in-post layouts (public/img) and a size manifest.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const SRC = 'src/assets/photos', OUT = 'public/img', MAN = 'src/data/img-manifest.json';
fs.mkdirSync(OUT, { recursive: true });
const man = {};
const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.jpg'));
await Promise.all(files.map(async (f) => {
  const key = f.slice(0, -4);
  const meta = await sharp(path.join(SRC, f)).metadata();
  man[key] = { w: meta.width, h: meta.height };
  for (const w of [640, 1280]) {
    const out = path.join(OUT, `${key}-${w}.webp`);
    if (!fs.existsSync(out)) await sharp(path.join(SRC, f)).resize({ width: Math.min(w, meta.width) }).webp({ quality: 72 }).toFile(out);
  }
}));
fs.writeFileSync(MAN, JSON.stringify(man));
console.log(`img: ${files.length} photos ready`);

import sharp from 'sharp';
import path from 'node:path';

export async function GET() {
  const src = path.join(process.cwd(), 'src/assets/photos/dubai-creek-abras.jpg');
  const buf = await sharp(src).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 78 }).toBuffer();
  return new Response(new Uint8Array(buf), { headers: { 'Content-Type': 'image/jpeg' } });
}

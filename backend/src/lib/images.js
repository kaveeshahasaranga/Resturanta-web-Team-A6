import multer from 'multer';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fail } from './validation.js';
export const uploadDir = fileURLToPath(new URL('../../uploads/menu/', import.meta.url));
export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } }).single('image');
export async function saveImage(file) {
  if (!file) throw fail('Select an image');
  const b = file.buffer;
  let ext;
  if (b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) ext = 'png';
  else if (b[0] === 255 && b[1] === 216 && b[2] === 255) ext = 'jpg';
  else if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') ext = 'webp';
  else throw fail('Only JPEG, PNG and WebP images are supported');
  const name = `${randomUUID()}.${ext}`;
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, name), b, { flag: 'wx' });
  return `/uploads/menu/${name}`;
}
export async function removeImage(url) {
  if (!/^\/uploads\/menu\/[a-f0-9-]+\.(png|jpg|webp)$/.test(url || '')) return;
  await unlink(join(uploadDir, url.split('/').pop())).catch(err => { if (err.code !== 'ENOENT') console.error('Image cleanup failed:', err.message); });
}

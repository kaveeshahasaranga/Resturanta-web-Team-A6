import multer from 'multer';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fail } from './validation.js';
export const uploadDir = fileURLToPath(new URL('../../uploads/menu/', import.meta.url));
export const chefUploadDir = fileURLToPath(new URL('../../uploads/chefs/', import.meta.url));
export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } }).single('image');
async function saveToDirectory(file, directory, urlPrefix) {
  if (!file) throw fail('Select an image');
  const b = file.buffer;
  let ext;
  if (b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) ext = 'png';
  else if (b[0] === 255 && b[1] === 216 && b[2] === 255) ext = 'jpg';
  else if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') ext = 'webp';
  else throw fail('Only JPEG, PNG and WebP images are supported');
  const name = `${randomUUID()}.${ext}`;
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, name), b, { flag: 'wx' });
  return `${urlPrefix}/${name}`;
}

export const saveImage = file => saveToDirectory(file, uploadDir, '/uploads/menu');
export const saveChefImage = file => saveToDirectory(file, chefUploadDir, '/uploads/chefs');

async function removeFromDirectory(url, pattern, directory) {
  if (!pattern.test(url || '')) return;
  await unlink(join(directory, url.split('/').pop())).catch(err => {
    if (err.code !== 'ENOENT') console.error('Image cleanup failed:', err.message);
  });
}

export const removeImage = url => removeFromDirectory(url, /^\/uploads\/menu\/[a-f0-9-]+\.(png|jpg|webp)$/, uploadDir);
export const removeChefImage = url => removeFromDirectory(url, /^\/uploads\/chefs\/[a-f0-9-]+\.(png|jpg|webp)$/, chefUploadDir);

import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(root, '.env.local') });

const { v2: cloudinary } = await import('cloudinary');

const SOURCE_DIR = process.env.INVITATION_GALLERY_SOURCE ?? path.join(root, 'photo');
const FOLDER = 'wedding_invitation';
const overwrite = process.argv.includes('--overwrite');

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.error('Missing CLOUDINARY_URL (or CLOUDINARY_* trio) in .env.local');
    process.exit(1);
  }
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const files = (await readdir(SOURCE_DIR))
  .map((name) => {
    const match = name.match(/^LINE_ALBUM_電子喜帖_261126_(\d+)\.jpe?g$/i);
    return match ? { name, number: Number(match[1]) } : null;
  })
  .filter(Boolean)
  .sort((a, b) => a.number - b.number);

if (!files.length) {
  console.error(`No invitation JPEG files in ${SOURCE_DIR}`);
  process.exit(1);
}

const results = [];

for (const file of files) {
  const publicId = file.number <= 20
    ? String(file.number).padStart(2, '0')
    : file.number === 21
      ? 'portrait-groom'
      : file.number === 22
        ? 'portrait-bride'
        : null;

  if (!publicId) continue;

  try {
    const result = await cloudinary.uploader.upload(path.join(SOURCE_DIR, file.name), {
      folder: FOLDER,
      public_id: publicId,
      overwrite,
      resource_type: 'image',
      unique_filename: false,
      use_filename: false,
    });
    results.push({ publicId: result.public_id, status: 'uploaded', url: result.secure_url });
    console.log(`✓ ${file.name} → ${result.public_id}`);
  } catch (err) {
    const msg = err?.message ?? String(err);
    if (!overwrite && /already exists|Resource with the given public ID already exists/i.test(msg)) {
      results.push({ publicId: `${FOLDER}/${publicId}`, status: 'skipped' });
      console.log(`– ${file.name} → ${FOLDER}/${publicId} (exists, skipped)`);
      continue;
    }
    console.error(`✗ ${file.name}: ${msg}`);
    process.exitCode = 1;
  }
}

console.log('\n--- publicIds for constants ---');
for (const row of results) {
  if (row.status !== 'failed') console.log(row.publicId);
}

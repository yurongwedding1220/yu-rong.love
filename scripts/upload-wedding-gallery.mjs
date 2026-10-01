import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(root, '.env.local') });

const { v2: cloudinary } = await import('cloudinary');

const SOURCE_DIR = process.env.WEDDING_GALLERY_SOURCE
  ?? '/Users/d246810g2000/Downloads/婚紗';
const FOLDER = 'wedding_gallery';
const overwrite = process.argv.includes('--overwrite');

function configureCloudinary() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
    return;
  }
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    });
    return;
  }
  console.error('Missing CLOUDINARY_URL (or CLOUDINARY_* trio) in .env.local');
  process.exit(1);
}

configureCloudinary();

const files = (await readdir(SOURCE_DIR))
  .filter((name) => /\.jpe?g$/i.test(name))
  .sort();

if (!files.length) {
  console.error(`No JPEG files in ${SOURCE_DIR}`);
  process.exit(1);
}

const results = [];

for (const file of files) {
  const publicId = path.basename(file, path.extname(file));
  const fullPublicId = `${FOLDER}/${publicId}`;

  try {
    const result = await cloudinary.uploader.upload(path.join(SOURCE_DIR, file), {
      folder: FOLDER,
      public_id: publicId,
      overwrite,
      resource_type: 'image',
      unique_filename: false,
      use_filename: false,
    });
    results.push({ file, publicId: result.public_id, status: 'uploaded', bytes: result.bytes });
    console.log(`✓ ${file} → ${result.public_id}`);
  } catch (err) {
    const msg = err?.message ?? String(err);
    if (!overwrite && /already exists|Resource with the given public ID already exists/i.test(msg)) {
      results.push({ file, publicId: fullPublicId, status: 'skipped' });
      console.log(`– ${file} → ${fullPublicId} (exists, skipped)`);
      continue;
    }
    console.error(`✗ ${file}: ${msg}`);
    process.exitCode = 1;
  }
}

console.log('\n--- publicIds for constants.ts ---');
for (const row of results) {
  if (row.status !== 'failed') console.log(row.publicId);
}

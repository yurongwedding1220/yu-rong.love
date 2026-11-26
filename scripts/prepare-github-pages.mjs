import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve('dist');
const indexPath = resolve(dist, 'index.html');
const SITE_BASE = 'https://yurongwedding1220.github.io/yu-rong.love';

const HOME_FONTS =
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Noto+Serif+TC:wght@300;400;500;700&family=Inter:wght@300;400;500&family=Viaoda+Libre&family=The+Nautigal:wght@400;700&family=Ms+Madi&display=swap';

const INVITATION_FONTS =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Noto+Serif+TC:wght@300;400;500;700&family=Viaoda+Libre&family=The+Nautigal:wght@400;700&display=swap';

const ROUTE_OG = {
  rsvp: {
    title: '政憲 & 幸容 · 確認登船',
    description: '誠邀您確認出席，與我們一同見證靠岸的這一天。',
    url: `${SITE_BASE}/rsvp`,
    image: `${SITE_BASE}/og-image.png`,
    fonts: HOME_FONTS,
  },
  invitation: {
    title: '政憲 & 幸容 · 電子喜帖',
    description: '誠摯邀請您蒞臨我們的婚禮。2026年12月20日（日）12:00，斗六緻麗伯爵酒店 12F 皇家宴。',
    url: `${SITE_BASE}/invitation`,
    image: `${SITE_BASE}/invitation-og-image.png`,
    fonts: INVITATION_FONTS,
  },
};

function upsertMetaDescription(html, description) {
  if (/<meta name="description"/.test(html)) {
    return html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`);
  }
  return html.replace('</title>', `</title>\n    <meta name="description" content="${description}" />`);
}

function upsertProperty(html, property, content) {
  const pattern = new RegExp(`(<meta property="${property}" content=")[^"]*(")`);
  if (pattern.test(html)) {
    return html.replace(pattern, `$1${content}$2`);
  }
  return html.replace(
    /(<meta property="og:image" content="[^"]*" \/>)/,
    `$1\n    <meta property="${property}" content="${content}" />`,
  );
}

function applyRouteMeta(html, og) {
  let next = html
    .replace(/<title>[^<]*<\/title>/, `<title>${og.title}</title>`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${og.url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${og.title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${og.description}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${og.image}$2`)
    .replace(/(<meta property="twitter:title" content=")[^"]*(")/, `$1${og.title}$2`)
    .replace(/(<meta property="twitter:description" content=")[^"]*(")/, `$1${og.description}$2`)
    .replace(/(<meta property="twitter:image" content=")[^"]*(")/, `$1${og.image}$2`);

  next = upsertMetaDescription(next, og.description);
  next = upsertProperty(next, 'og:image:width', og.imageWidth ?? '1200');
  next = upsertProperty(next, 'og:image:height', og.imageHeight ?? '630');
  next = upsertProperty(next, 'og:image:type', 'image/png');
  next = upsertProperty(next, 'og:locale', 'zh_TW');

  if (og.fonts) {
    next = next.replace(/href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*"/, `href="${og.fonts}"`);
  }

  return next;
}

const baseHtml = await readFile(indexPath, 'utf8');

for (const route of Object.keys(ROUTE_OG)) {
  const routeDir = resolve(dist, route);
  await mkdir(routeDir, { recursive: true });
  const html = applyRouteMeta(baseHtml, ROUTE_OG[route]);
  await writeFile(resolve(routeDir, 'index.html'), html, 'utf8');
  await writeFile(resolve(dist, `${route}.html`), html, 'utf8');
}

console.log(`Prepared direct GitHub Pages routes: ${Object.keys(ROUTE_OG).join(', ')}`);

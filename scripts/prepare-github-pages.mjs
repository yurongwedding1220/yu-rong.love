import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const dist = resolve('dist');
const indexPath = resolve(dist, 'index.html');
const SITE_BASE = 'https://yurongwedding1220.github.io/yu-rong.love';

const ROUTE_OG = {
  rsvp: {
    title: '政憲 & 幸容 · 出席回函',
    description: '誠邀您填寫出席回函，與我們一同見證靠岸的這一天。',
    url: `${SITE_BASE}/rsvp`,
    image: `${SITE_BASE}/og-image.png`,
  },
  invitation: {
    title: '政憲 & 幸容 · 電子喜帖',
    description: '宿霧、仙本那、蘇美、宮古——四年島旅行後，我們在斗六靠岸。',
    url: `${SITE_BASE}/invitation`,
    image: `${SITE_BASE}/og-image.png`,
  },
};

function applyRouteMeta(html, og) {
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${og.title}</title>`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${og.url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${og.title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${og.description}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${og.image}$2`)
    .replace(/(<meta property="twitter:title" content=")[^"]*(")/, `$1${og.title}$2`)
    .replace(/(<meta property="twitter:description" content=")[^"]*(")/, `$1${og.description}$2`)
    .replace(/(<meta property="twitter:image" content=")[^"]*(")/, `$1${og.image}$2`);
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

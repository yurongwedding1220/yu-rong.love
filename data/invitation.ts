// ==========================================
// 電子喜帖 — invitation content
// ==========================================

const CLOUDINARY_CLOUD = 'djqnqxzha';
const ALBUM_FOLDER = 'wedding_invitation';

export const INVITATION = {
  groom: '政憲',
  bride: '幸容',
  coupleName: '政憲 & 幸容',
  eyebrow: '~我們結婚囉~',
  dateISO: '2026-12-20T12:00:00+08:00',
  dateLabel: '2026年12月20日',
  year: 2026,
  month: 12,
  day: 20,
  weekday: '星期日',
  time: '12:00',
  lunar: '農曆丙午年冬月十二',
  venueAddress: '雲林縣斗六市信義里中山路6號12樓 皇家宴12F',
  mapsQuery: '緻麗伯爵酒店 斗六',
  mapEmbedUrl:
    'https://maps.google.com/maps?q=%E8%87%B4%E9%BA%97%E4%BC%AF%E7%88%B5%E9%85%92%E5%BA%97%20%E6%96%97%E5%85%AD&z=16&output=embed',
  mapDirectionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=%E9%9B%B2%E6%9E%97%E7%B8%A3%E6%96%97%E5%85%AD%E5%B8%82%E4%BF%A1%E7%BE%A9%E9%87%8C%E4%B8%AD%E5%B1%B1%E8%B7%AF6%E8%99%9F',
  calendarUrl:
    'https://www.google.com/calendar/render?action=TEMPLATE' +
    '&text=%E6%94%BF%E6%86%B2%20%26%20%E5%B9%B8%E5%AE%B9%20%E5%A9%9A%E7%A6%AE' +
    '&dates=20261220T040000Z/20261220T060000Z' +
    '&ctz=Asia/Taipei' +
    '&details=%E8%AA%A0%E6%91%AF%E9%82%80%E8%AB%8B%E6%82%A8%E8%92%9E%E8%87%A8%E6%94%BF%E6%86%B2%E8%88%87%E5%B9%B8%E5%AE%B9%E7%9A%84%E5%A9%9A%E5%AE%B4%E3%80%82' +
    '&location=%E9%9B%B2%E6%9E%97%E7%B8%A3%E6%96%97%E5%85%AD%E5%B8%82%E4%BF%A1%E7%BE%A9%E9%87%8C%E4%B8%AD%E5%B1%B1%E8%B7%AF6%E8%99%9F12%E6%A8%93%20%E7%9A%87%E5%AE%B6%E5%AE%B412F',
  dressCode: '天空藍、奶茶、白色',
  dressColors: [
    { name: '天空藍', hex: '#87ceeb' },
    { name: '奶茶', hex: '#ecdcc2' },
    { name: '白色', hex: '#ffffff' },
  ],
  parents: {
    groom: { honorific: '男方主婚人', names: ['尤吉棟', '葉秋錦'] as const },
    bride: { honorific: '女方主婚人', names: ['李周安', '陳素貞'] as const },
  },
  parking: {
    title: '停車資訊',
    name: '俥亭停車-斗六停三立體停車場',
    url: 'https://maps.app.goo.gl/hCDt6FEp9TwzvC5AA',
  },
  portraits: {
    groom: `${ALBUM_FOLDER}/portrait-groom`,
    bride: `${ALBUM_FOLDER}/portrait-bride`,
  },
  album: Array.from({ length: 20 }, (_, index) => ({
    id: String(index + 1).padStart(2, '0'),
    publicId: `${ALBUM_FOLDER}/${String(index + 1).padStart(2, '0')}`,
    alt: `政憲與幸容的婚紗照 ${index + 1}`,
  })),
} as const;

export const cloudinaryImage = (publicId: string, width = 1200) =>
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/f_auto,q_auto,c_limit,w_${width}/${publicId}`;

export const cloudinaryPortrait = (publicId: string, width = 900) =>
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/f_auto,q_auto,c_fill,g_auto,ar_2:3,w_${width}/${publicId}`;

/** Envelope hero portraits: head-to-waist / head-to-bouquet framing that keeps
 *  the groom's face clear of the overlapping bride photo. c_thumb+z is ignored
 *  on these assets, so we use c_crop+g_face+z (0.40 matched the approved frame). */
export const cloudinaryHeroPortrait = (publicId: string, width = 900) =>
  `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/f_auto,q_auto,c_crop,g_face,z_0.40,ar_3:4/c_fill,g_center,ar_3:4,w_${width}/${publicId}`;

export const cloudinarySrcSet = (
  builder: (publicId: string, width: number) => string,
  publicId: string,
  widths: readonly number[]
) => widths.map((width) => `${builder(publicId, width)} ${width}w`).join(', ');

export const invitationThemeAsset = (file: string) =>
  `${import.meta.env.BASE_URL}invitation/theme/${file}`;

export const invitationAsset = (file: string) =>
  `${import.meta.env.BASE_URL}invitation/${file}`;

const preloadCache = new Set<string>();

export const preloadImage = (url: string) => {
  if (typeof window === 'undefined' || preloadCache.has(url)) return;
  preloadCache.add(url);
  const image = new Image();
  image.decoding = 'async';
  image.src = url;
};

export const preloadInvitationPortraits = () => {
  [INVITATION.portraits.groom, INVITATION.portraits.bride].forEach((id) => {
    preloadImage(cloudinaryHeroPortrait(id, 900));
  });
};

export const preloadInvitationOpening = () => {
  ['envelope-pocket.webp', 'envelope-flap.webp', 'wax-seal.webp'].forEach((file) => {
    preloadImage(invitationThemeAsset(file));
  });
};

const prefersSaveData = () =>
  typeof navigator !== 'undefined' &&
  'connection' in navigator &&
  Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

export const invitationLightboxWidth = () => {
  if (typeof window === 'undefined') return 1800;
  const cssWidth = window.innerWidth || 1200;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  return cssWidth * dpr <= 1200 ? 1200 : 1800;
};

export const preloadInvitationNeighbors = (
  index: number,
  options?: { includeLightbox?: boolean }
) => {
  if (typeof window === 'undefined') return;
  const total = INVITATION.album.length;
  if (total === 0) return;

  const radius = prefersSaveData() ? 1 : 1;
  const lightboxWidth = invitationLightboxWidth();

  for (let delta = -radius; delta <= radius; delta += 1) {
    const photoIndex = ((index + delta) % total + total) % total;
    const photo = INVITATION.album[photoIndex];
    preloadImage(cloudinaryPortrait(photo.publicId, delta === 0 ? 1200 : 700));
    if (options?.includeLightbox) {
      preloadImage(cloudinaryImage(photo.publicId, lightboxWidth));
    }
  }
};

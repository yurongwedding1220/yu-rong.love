// ==========================================
// Yu & Rong — island invitation content
// ==========================================

export const ISLAND_ROUTE = ['宿霧', '仙本那', '蘇美', '宮古'] as const;

export const APP_CONTENT = {
  coupleName: 'Yu & Rong',
  chineseNames: '政憲 ❤️ 幸容',
  date: '2026年12月20日（六）',
  dateISO: '2026-12-20T11:30:00+08:00',
  location: '雲林縣斗六市',
  venueName: '緻麗伯爵酒店',
  venueHall: '12F 皇家宴',
  venueAddress: '雲林縣斗六市中山路 6 號',
  venueDescription: '座落斗六市中心，婚宴於 12 樓皇家宴會廳舉行。',
  quote: '宿霧、仙本那、蘇美、宮古——四年島旅行後，我們在斗六靠岸。',
  intro: '誠邀你來見證我們靠岸的這一天。',
  googleScriptUrl: '',
  lineLink: '',
  lineQrCode: 'qrcode.png',
  mapsQuery: '緻麗伯爵酒店 斗六',
};

export const TIMELINE_EVENTS = [
  {
    time: '11:30',
    title: 'Guest Arrival',
    chineseTitle: '賓客入席',
    description: '歡迎蒞臨，與親友寒暄、留下合影。',
  },
  {
    time: '12:00',
    title: 'Grand Opening',
    chineseTitle: '幸福開席',
    description: '婚禮正式開始，敬備佳餚，共饗盛宴。',
  },
  {
    time: '15:00',
    title: 'Farewell',
    chineseTitle: '送客合影',
    description: '感謝您的參與，與新人留下美好回憶。',
  },
];

export const TRANSPORT_INFO = [
  {
    icon: '🚗',
    title: 'Driving',
    chineseTitle: '自行開車',
    description:
      '國道三號下斗六交流道，依指標往斗六市區／中山路即可抵達。酒店備有停車場。',
  },
  {
    icon: '🚆',
    title: 'Train',
    chineseTitle: '台鐵火車',
    description: '搭乘火車至【斗六站】下車，步行約 5 分鐘即可抵達緻麗伯爵酒店。',
  },
  {
    icon: '🚄',
    title: 'HSR',
    chineseTitle: '台灣高鐵',
    description:
      '建議於【高鐵台中站】或【高鐵嘉義站】轉乘台鐵／客運／計程車至斗六市區（細節待補）。',
  },
];

/** 精選照（非相簿）— 新人照片到位後替換 src */
export type FeaturedPhoto = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

export const FEATURED_PHOTOS: FeaturedPhoto[] = [
  {
    id: 'f1',
    src: 'featured/placeholder-1.svg',
    alt: '精選照片 1（占位）',
    caption: '宮古 · 待補',
  },
  {
    id: 'f2',
    src: 'featured/placeholder-2.svg',
    alt: '精選照片 2（占位）',
    caption: '蘇美 · 待補',
  },
  {
    id: 'f3',
    src: 'featured/placeholder-3.svg',
    alt: '精選照片 3（占位）',
    caption: '仙本那 · 待補',
  },
  {
    id: 'f4',
    src: 'featured/placeholder-4.svg',
    alt: '精選照片 4（占位）',
    caption: '宿霧 · 待補',
  },
];

/** 月曆封面占位（無 Cloudinary 時用漸層／空字串） */
export const CALENDAR_COVER_IMAGE = '';

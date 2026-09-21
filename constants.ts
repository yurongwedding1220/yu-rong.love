// ==========================================
// Yu & Rong — island invitation content
// ==========================================

export const APP_CONTENT = {
  coupleName: 'Yu & Rong',
  chineseNames: '政憲 ❤️ 幸容',
  date: '2026年12月20日（日）',
  dateISO: '2026-12-20T11:30:00+08:00',
  location: '雲林縣斗六市',
  venueName: '緻麗伯爵酒店',
  venueHall: '12F 皇家宴',
  venueAddress: '雲林縣斗六市中山路 6 號',
  venueDescription: '座落斗六市中心，婚宴於 12 樓皇家宴會廳舉行。',
  intro: '誠邀你來見證我們靠岸的這一天。',
  googleScriptUrl:
    'https://script.google.com/macros/s/AKfycbyHpBAbJVEftXr2cunc1M7sMlcZSxxLc-4GGvwpK3ZRZL_n0Aqo0FF5XX5Hsy0LLZOO/exec',
  lineLink: '',
  lineQrCode: '',
  mapsQuery: '緻麗伯爵酒店 斗六',
};

/** 全站航程敘事文案 */
export const VOYAGE_NARRATIVE = {
  loadingHint: '船即將入港…',
  countdownLabel: '距靠岸還有',
  interludeChapter: '第一章 · 啟程',
  interludeTitle: '航程開始',
  interludeBody: '接下來，是我們航程上的幾段回憶。繼續往下滑，一座一座島會慢慢浮現。',
  galleryChapter: '第二章 · 航程',
  galleryTitle: '婚紗藝廊',
  galleryIntro: '每一段風景，都是不同的冒險篇章。',
  harborChapter: '第三章 · 靠岸',
  harborTitle: '靠岸日',
  harborIntro: '我們在斗六靠岸，等你一起見證這一天。',
  programChapter: '第四章 · 宴會',
  programTitle: '婚禮流程',
  programIntro: '靠岸之後的午後，誠摯邀請你與我們共度。',
  berthChapter: '第五章 · 停泊',
  berthTitle: '停泊資訊',
  berthIntro: '婚禮當天的交通與抵達方式。',
  contactChapter: '聯絡',
  contactTitle: '聯絡我們',
  contactIntro: '有任何問題，歡迎透過 LINE 與我們聯繫。',
  finaleChapter: '終章 · 登船',
  finaleTitle: '這趟航程，希望你能同行',
  finaleIntro: '您的蒞臨是我們最大的榮幸。請盡早確認出席，讓我們好好準備。',
  guestbookChapter: '第六章 · 祝福',
  guestbookTitle: '祝福留言',
  guestbookIntro: '寫下你想對新人說的話，我們會珍惜每一份心意。填寫 RSVP 時也可同步發佈到留言板。',
  rsvpCta: '確認登船',
};

/** 留言板主貼文封面（占位，可替換為婚紗照） */
export const THREADS_POST_IMAGE = 'featured/placeholder-1.svg';

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
];

export const TRANSPORT_INFO = [
  {
    icon: '🚗',
    title: 'Driving',
    chineseTitle: '自行開車',
    description:
      '俥亭停車－斗六停三立體停車場（到會場提供車號，可折抵三小時停車費）',
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
      '高鐵雲林站下車；有接送需求請於 RSVP 表單填寫 LINE ID，我們將建立聯絡群組',
  },
];

/** 婚紗藝廊篇章 — 以風格／色調分章，新人照片到位後替換 src */
export type GalleryPhoto = {
  id: string;
  src: string;
  alt: string;
};

export type GalleryChapter = {
  id: string;
  title: string;
  subtitle: string;
  /** 篇章短旁白（可替換為新人親筆話） */
  story: string;
  /** 通往下一座島的轉場句 */
  transition?: string;
  palette: {
    deep: string;
    sea: string;
    accent: string;
    glow: string;
  };
  photos: GalleryPhoto[];
};

/** 啟程 → 第一座島（對齊全頁海面層） */
export const GALLERY_SURFACE_HANDOFF: GalleryChapter['palette'] = {
  deep: '#1B4D6E',
  sea: '#3A8FB7',
  accent: '#7EC8E3',
  glow: '#7EC8E3',
};

/** 末島 → 靠岸日（暖沙港灣） */
export const GALLERY_HARBOR_HANDOFF: GalleryChapter['palette'] = {
  deep: '#8B7355',
  sea: '#C4A882',
  accent: '#E8D5BC',
  glow: '#F4E8D8',
};

/** 四座小島對應的全頁 depth 錨點（surface 0.18 → harbor 0.36 之間） */
export const GALLERY_ISLAND_DEPTHS = [0.22, 0.26, 0.3, 0.34] as const;

export const WEDDING_GALLERY_CHAPTERS: GalleryChapter[] = [
  {
    id: 'azure',
    title: '蔚藍',
    subtitle: '沉靜藍調',
    story: '海面安靜得像一幅畫，我們在這裡留下第一張婚紗回憶。',
    transition: '海霧散去，下一座島就在眼前。',
    palette: {
      deep: '#0f3550',
      sea: '#1B4D6E',
      accent: '#3A8FB7',
      glow: '#7EC8E3',
    },
    photos: [
      { id: 'azure-1', src: 'featured/placeholder-1.svg', alt: '婚紗藝廊 · 蔚藍（占位）' },
    ],
  },
  {
    id: 'lagoon',
    title: '淺灣',
    subtitle: '清透海色',
    story: '水色透亮，笑聲也被海風拉得很長。',
    transition: '船身輕晃，沙色的地平線慢慢浮現。',
    palette: {
      deep: '#1a5f7a',
      sea: '#2d8fad',
      accent: '#5ec4e0',
      glow: '#a8e6f5',
    },
    photos: [
      { id: 'lagoon-1', src: 'featured/placeholder-2.svg', alt: '婚紗藝廊 · 淺灣（占位）' },
    ],
  },
  {
    id: 'sand',
    title: '白沙',
    subtitle: '暖沙晨光',
    story: '腳踩在溫熱的沙上，光線剛好落在彼此眼裡。',
    transition: '夕陽把海面染成珊瑚色，航程即將靠岸。',
    palette: {
      deep: '#8b7355',
      sea: '#c4a882',
      accent: '#e8d5bc',
      glow: '#F4E8D8',
    },
    photos: [
      { id: 'sand-1', src: 'featured/placeholder-3.svg', alt: '婚紗藝廊 · 白沙（占位）' },
    ],
  },
  {
    id: 'coral',
    title: '暮色',
    subtitle: '珊瑚暖光',
    story: '最後一座島的黃昏，我們知道，該靠岸了。',
    palette: {
      deep: '#6b3d2e',
      sea: '#c4704a',
      accent: '#E8A87C',
      glow: '#f5c9a8',
    },
    photos: [
      { id: 'coral-1', src: 'featured/placeholder-4.svg', alt: '婚紗藝廊 · 暮色（占位）' },
    ],
  },
];

/** 月曆封面背景（無文字；文案由元件疊加） */
export const CALENDAR_COVER_IMAGE = 'calendar-cover-v2.png';

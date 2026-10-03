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
      '高鐵雲林站下車；接送聯絡資訊將於婚禮前通知',
  },
];

/** 婚紗藝廊篇章 — 以風格／色調分章，圖片由 Cloudinary publicId 提供 */
export type GalleryPhoto = {
  id: string;
  publicId: string;
  alt: string;
  orientation?: 'portrait' | 'landscape';
  kind?: 'couple' | 'solo';
  subject?: 'rong' | 'yu';
  /** 主視覺裁切重心（Cloudinary g_face） */
  heroGravity?: 'face';
  /** 主視覺橫幅較寬（適合橫式合照） */
  heroWide?: boolean;
  /** CSS object-position 微調 */
  objectPosition?: string;
  /** 拼貼格放大（>1 微幅 zoom in） */
  tileScale?: number;
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
      { id: '01-1', publicId: 'wedding_gallery/01_1', alt: '婚紗 · 蔚藍', orientation: 'portrait', kind: 'couple' },
      { id: '01-2', publicId: 'wedding_gallery/01_2', alt: '婚紗 · 蔚藍', orientation: 'landscape', kind: 'couple' },
      { id: '01-3', publicId: 'wedding_gallery/01_3_rong', alt: '婚紗 · 蔚藍', orientation: 'portrait', kind: 'solo', subject: 'rong' },
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
      {
        id: '02-2',
        publicId: 'wedding_gallery/02_2_yu',
        alt: '婚紗 · 淺灣',
        orientation: 'landscape',
        kind: 'solo',
        subject: 'yu',
        heroGravity: 'face',
        objectPosition: 'center center',
      },
      {
        id: '02-1',
        publicId: 'wedding_gallery/02_1_rong',
        alt: '婚紗 · 淺灣',
        orientation: 'portrait',
        kind: 'solo',
        subject: 'rong',
        objectPosition: 'center 30%',
        tileScale: 1.22,
      },
      {
        id: '02-4',
        publicId: 'wedding_gallery/02_4',
        alt: '婚紗 · 淺灣',
        orientation: 'portrait',
        kind: 'couple',
        objectPosition: '75% center',
      },
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
      {
        id: '03-4',
        publicId: 'wedding_gallery/03_4_rong',
        alt: '婚紗 · 白沙',
        orientation: 'portrait',
        kind: 'solo',
        subject: 'rong',
        heroGravity: 'face',
        objectPosition: 'center center',
      },
      {
        id: '03-3',
        publicId: 'wedding_gallery/03_3',
        alt: '婚紗 · 白沙',
        orientation: 'portrait',
        kind: 'couple',
        objectPosition: 'center 28%',
      },
      { id: '03-1', publicId: 'wedding_gallery/03_1', alt: '婚紗 · 白沙', orientation: 'landscape', kind: 'couple' },
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
      {
        id: '04-2',
        publicId: 'wedding_gallery/04_2',
        alt: '婚紗 · 暮色',
        orientation: 'landscape',
        kind: 'couple',
        heroWide: true,
        objectPosition: 'center center',
      },
      {
        id: '04-1',
        publicId: 'wedding_gallery/04_1',
        alt: '婚紗 · 暮色',
        orientation: 'portrait',
        kind: 'couple',
        objectPosition: 'center 75%',
      },
      {
        id: '04-3',
        publicId: 'wedding_gallery/04_3',
        alt: '婚紗 · 暮色',
        orientation: 'portrait',
        kind: 'couple',
        objectPosition: 'center 35%',
      },
    ],
  },
];

/** 月曆封面背景（無文字；文案由元件疊加） */
export const CALENDAR_COVER_IMAGE = 'calendar-cover-v2.png';

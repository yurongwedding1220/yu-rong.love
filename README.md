# yu-rong.love

政憲 & 幸容 電子喜帖（自 yu-rong.love 骨架複製，內容待換成新人資料）。

## 開發

```bash
npm install
npm run dev
```

## 部署（GitHub Pages）

1. 把 `package.json` 的 `homepage`、`vite.config.ts` 的 `base` 改成你的 GitHub 帳號路徑
2. `npm run deploy`

## 待補資料

- `constants.ts` → 姓名、日期、場地、LINE、表單 Script
- 精選照片 5～8 張
- `public/` 封面／favicon／OG 圖

## 電子喜帖

線上地址：<https://yurongwedding1220.github.io/yu-rong.love/invitation>

### 專屬賓客連結

封面可依網址參數問候賓客，例如：

`https://yurongwedding1220.github.io/yu-rong.love/invitation?to=王小明`

會顯示「誠摯邀請 王小明」。從名單批次產生連結：

```bash
node scripts/make-invite-links.mjs scripts/guest-names.example.txt
# 或自訂名單（每行一個姓名）
node scripts/make-invite-links.mjs guests.txt
```

姓名會經過 URL 編碼、去掉首尾空白，最長約 20 字；請以純文字顯示，不要自行拼接 HTML。

### 加入日曆

喜帖內「添加到日曆」可選 Google 日曆，或下載 `public/invitation/wedding.ics`（Apple／Outlook，2026-12-20 12:00–14:00，Asia/Taipei）。

### 分享預覽圖

LINE／社群預覽使用 `public/invitation-og-image.png`（1200×630）。若需重繪：

```bash
npm run generate:invitation-og-image
```

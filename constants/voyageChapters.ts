/** 全頁航程章節 — 供進度指示器使用 */
export type VoyageChapter = {
  id: string;
  label: string;
  /** depth 達此值即進入本章 */
  depthStart: number;
};

export const VOYAGE_CHAPTERS: VoyageChapter[] = [
  { id: 'depart', label: '啟程', depthStart: 0 },
  { id: 'photos', label: '航程', depthStart: 0.17 },
  { id: 'harbor', label: '靠岸', depthStart: 0.33 },
  { id: 'submerge', label: '入水', depthStart: 0.44 },
  { id: 'timeline', label: '宴會', depthStart: 0.54 },
  { id: 'location', label: '停泊', depthStart: 0.7 },
  { id: 'finale', label: '約定', depthStart: 0.84 },
];

export function getChapterAtDepth(depth: number): {
  index: number;
  chapter: VoyageChapter;
  localProgress: number;
} {
  let index = 0;
  for (let i = VOYAGE_CHAPTERS.length - 1; i >= 0; i--) {
    if (depth >= VOYAGE_CHAPTERS[i].depthStart) {
      index = i;
      break;
    }
  }
  const chapter = VOYAGE_CHAPTERS[index];
  const next = VOYAGE_CHAPTERS[index + 1];
  const span = (next?.depthStart ?? 1) - chapter.depthStart;
  const local = span > 0 ? (depth - chapter.depthStart) / span : 1;
  return { index, chapter, localProgress: Math.min(1, Math.max(0, local)) };
}

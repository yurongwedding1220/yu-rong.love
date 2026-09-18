import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WEDDING_GALLERY_CHAPTERS, GalleryChapter, GalleryPhoto } from '../../constants';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';

type PhotoShape = 'arch' | 'capsule' | 'leaf' | 'pebble';

type IslandLayout = {
  titleAlign: 'left' | 'right' | 'center';
  titleInset: string;
  photoAlign: 'left' | 'right' | 'center';
  photoInset: string;
  photoShape: PhotoShape;
  photoWidth: string;
  photoRotate: number;
  terrainShift: string;
  skyGlowAt: string;
  sunClass: string;
  emerge: { x: number; y: number; rotate: number };
};

const ISLAND_LAYOUTS: IslandLayout[] = [
  {
    titleAlign: 'right',
    titleInset: 'md:pr-6',
    photoAlign: 'left',
    photoInset: 'md:pl-4',
    photoShape: 'arch',
    photoWidth: 'min(74vw, 260px)',
    photoRotate: -4,
    terrainShift: 'translate-x-[6%]',
    skyGlowAt: '68% 12%',
    sunClass: 'right-[14%] top-[8%]',
    emerge: { x: 20, y: 18, rotate: 4 },
  },
  {
    titleAlign: 'left',
    titleInset: 'md:pl-6',
    photoAlign: 'right',
    photoInset: 'md:pr-2',
    photoShape: 'capsule',
    photoWidth: 'min(68vw, 230px)',
    photoRotate: 5,
    terrainShift: '-translate-x-[8%]',
    skyGlowAt: '28% 14%',
    sunClass: 'left-[10%] top-[10%]',
    emerge: { x: -22, y: 20, rotate: -4 },
  },
  {
    titleAlign: 'left',
    titleInset: 'md:pl-10',
    photoAlign: 'center',
    photoInset: 'md:translate-x-6',
    photoShape: 'leaf',
    photoWidth: 'min(72vw, 270px)',
    photoRotate: -2,
    terrainShift: 'translate-x-[2%] scale-[1.06]',
    skyGlowAt: '50% 8%',
    sunClass: 'right-[20%] top-[8%]',
    emerge: { x: 0, y: 22, rotate: 2 },
  },
  {
    titleAlign: 'right',
    titleInset: 'md:pr-8',
    photoAlign: 'right',
    photoInset: 'md:pr-16',
    photoShape: 'pebble',
    photoWidth: 'min(76vw, 285px)',
    photoRotate: 3,
    terrainShift: '-translate-x-[4%]',
    skyGlowAt: '72% 18%',
    sunClass: 'left-[16%] top-[12%]',
    emerge: { x: 18, y: 16, rotate: 3 },
  },
];

const SHAPE_CLASS: Record<PhotoShape, string> = {
  arch: 'island-photo-arch',
  capsule: 'island-photo-capsule',
  leaf: 'island-photo-leaf',
  pebble: 'island-photo-pebble',
};

const alignClass = (align: 'left' | 'right' | 'center') => {
  if (align === 'right') return 'self-end text-right';
  if (align === 'left') return 'self-start text-left';
  return 'self-center text-center';
};

const ChapterWaveCap: React.FC<{ fill: string }> = ({ fill }) => (
  <svg
    className="pointer-events-none absolute inset-x-0 top-0 h-12 w-full md:h-16"
    viewBox="0 0 1440 60"
    preserveAspectRatio="none"
    aria-hidden
  >
    <path
      fill={fill}
      d="M0,32 C200,58 400,8 600,28 C800,48 1000,12 1200,30 C1320,42 1380,24 1440,34 L1440,0 L0,0 Z"
    />
  </svg>
);

const IslandTerrain: React.FC<{
  chapterId: string;
  palette: GalleryChapter['palette'];
  shiftClass: string;
}> = ({ chapterId, palette, shiftClass }) => {
  const terrains: Record<string, { back: string; mid: string; front: string }> = {
    azure: {
      back: 'M0,120 L0,55 Q80,25 200,42 T420,28 L560,38 L560,120 Z',
      mid: 'M0,120 L0,72 Q140,58 280,68 T560,62 L560,120 Z',
      front: 'M0,120 L0,88 Q200,78 360,92 T560,85 L560,120 Z',
    },
    lagoon: {
      back: 'M0,120 L0,70 Q120,55 240,62 T480,52 L560,58 L560,120 Z',
      mid: 'M0,120 L0,82 Q160,72 320,80 T560,76 L560,120 Z',
      front: 'M0,120 L0,95 Q220,88 400,96 T560,92 L560,120 Z',
    },
    sand: {
      back: 'M0,120 L0,65 Q100,48 220,58 T440,48 L560,52 L560,120 Z',
      mid: 'M0,120 L0,78 Q180,68 340,76 T560,72 L560,120 Z',
      front: 'M0,120 L0,92 Q240,85 400,94 T560,90 L560,120 Z',
    },
    coral: {
      back: 'M0,120 L0,48 Q70,18 180,35 T380,22 L560,32 L560,120 Z',
      mid: 'M0,120 L0,68 Q130,52 260,62 T560,55 L560,120 Z',
      front: 'M0,120 L0,86 Q200,76 380,88 T560,82 L560,120 Z',
    },
  };

  const t = terrains[chapterId] ?? terrains.azure;

  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-[32%] min-h-[160px] ${shiftClass}`}>
      <svg
        className="absolute inset-0 h-full w-[112%] -left-[6%]"
        viewBox="0 0 560 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={t.back} fill={palette.deep} opacity={0.32} />
        <path d={t.mid} fill={palette.sea} opacity={0.42} />
        <path d={t.front} fill={palette.accent} opacity={0.5} />
      </svg>
    </div>
  );
};

const SceneWaves: React.FC<{ palette: GalleryChapter['palette']; animate: boolean }> = ({
  palette,
  animate,
}) => (
  <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[10vh] overflow-hidden">
    <svg
      className={`absolute bottom-0 h-full w-[130%] ${animate ? 'island-wave-drift-slow' : ''}`}
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill={palette.glow}
        opacity={0.55}
        d="M0,40 C240,68 480,18 720,38 S1200,65 1440,34 L1440,80 L0,80 Z"
      />
    </svg>
  </div>
);

const PhotoPortal: React.FC<{
  photo: GalleryPhoto;
  chapter: GalleryChapter;
  layout: IslandLayout;
  photoIndex: number;
  animate: boolean;
  onClick: () => void;
}> = ({ photo, chapter, layout, photoIndex, animate, onClick }) => {
  const shapeClass = SHAPE_CLASS[layout.photoShape];

  const body = (
    <button
      type="button"
      onClick={onClick}
      className="island-photo-portal island-focus group relative block"
      style={{
        width: layout.photoWidth,
        '--photo-rotate': `${layout.photoRotate}deg`,
        transform: `rotate(${layout.photoRotate}deg)`,
      } as React.CSSProperties}
    >
      <div
        className="absolute -inset-4 rounded-[50%] opacity-50 blur-xl transition-opacity group-hover:opacity-70"
        style={{ background: `radial-gradient(circle, ${chapter.palette.glow}77, transparent 70%)` }}
        aria-hidden
      />
      <div className={`${shapeClass} relative overflow-hidden`}>
        <img
          src={`${import.meta.env.BASE_URL}${photo.src}`}
          alt={photo.alt}
          className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${
            layout.photoShape === 'capsule' ? 'aspect-[3/5]' : 'aspect-[4/5]'
          }`}
          loading="lazy"
          decoding="async"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/6"
          aria-hidden
        />
      </div>
      <p
        className={`mt-3 font-display text-[9px] tracking-[0.32em] text-white/50 ${
          layout.photoAlign === 'right'
            ? 'text-right'
            : layout.photoAlign === 'left'
              ? 'text-left'
              : 'text-center'
        }`}
      >
        {chapter.title}
      </p>
    </button>
  );

  if (!animate) return body;

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: layout.emerge.x,
        y: layout.emerge.y,
        scale: 0.96,
        rotate: layout.emerge.rotate,
      }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: layout.photoRotate }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay: photoIndex * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {body}
    </motion.div>
  );
};

const IslandAdventureChapter: React.FC<{
  chapter: GalleryChapter;
  index: number;
  layout: IslandLayout;
  nextChapter?: GalleryChapter;
  animate: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPhotoClick: (photo: GalleryPhoto) => void;
}> = ({ chapter, index, layout, nextChapter, animate, isFirst, isLast, onPhotoClick }) => {
  const titleBlock = (
    <div className={`max-w-[min(78vw,300px)] ${layout.titleInset}`}>
      <p className="font-display text-[9px] tracking-[0.38em] text-white/50">
        航程 · 第 {String(index + 1).padStart(2, '0')} 座島
      </p>
      <h3 className="island-heading mt-2 font-serif text-[2.25rem] font-light leading-[1.05] text-white drop-shadow-md md:text-[2.65rem]">
        {chapter.title}
      </h3>
      <p className="mt-2 font-serif text-sm tracking-[0.12em] text-white/80">{chapter.subtitle}</p>
      <p className="island-heading-pretty mt-3 text-xs leading-[1.9] text-white/65 md:text-sm">
        {chapter.story}
      </p>
    </div>
  );

  return (
    <article
      className="island-chapter-flow relative w-full overflow-hidden"
      style={{
        background: `linear-gradient(188deg, ${chapter.palette.glow}26 0%, ${chapter.palette.sea} 42%, ${chapter.palette.deep} 88%)`,
      }}
    >
      {isFirst && <ChapterWaveCap fill="#f4e8d8" />}

      {/* 與下一座島自然衔接 */}
      {!isLast && nextChapter && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32 md:h-40"
          style={{
            background: `linear-gradient(to bottom, transparent, ${nextChapter.palette.sea}55)`,
          }}
          aria-hidden
        />
      )}

      <div
        className={`pointer-events-none absolute ${layout.sunClass} h-14 w-14 rounded-full blur-md md:h-16 md:w-16`}
        style={{ background: `radial-gradient(circle, ${chapter.palette.glow}88, transparent)` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 55% at ${layout.skyGlowAt}, ${chapter.palette.accent}20, transparent 68%)`,
        }}
        aria-hidden
      />

      <IslandTerrain
        chapterId={chapter.id}
        palette={chapter.palette}
        shiftClass={layout.terrainShift}
      />
      <SceneWaves palette={chapter.palette} animate={animate} />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-14 px-5 py-16 md:gap-20 md:px-8 md:py-24">
        {animate ? (
          <motion.div
            className={alignClass(layout.titleAlign)}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {titleBlock}
          </motion.div>
        ) : (
          <div className={alignClass(layout.titleAlign)}>{titleBlock}</div>
        )}

        <div className={`${alignClass(layout.photoAlign)} ${layout.photoInset}`}>
          {chapter.photos.map((photo, photoIndex) => (
            <PhotoPortal
              key={photo.id}
              photo={photo}
              chapter={chapter}
              layout={layout}
              photoIndex={photoIndex}
              animate={animate}
              onClick={() => onPhotoClick(photo)}
            />
          ))}
        </div>

        {!isLast && chapter.transition && (
          <p className="island-transition-quote mx-auto max-w-xs text-center text-xs text-white/50 md:max-w-sm md:text-sm">
            「{chapter.transition}」
          </p>
        )}
      </div>
    </article>
  );
};

export const IslandVoyageGallery: React.FC = () => {
  const lite = isLowPerf(usePerfMode());
  const animate = !lite;
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);

  if (!WEDDING_GALLERY_CHAPTERS.length) return null;

  return (
    <div className="relative w-full">
      {WEDDING_GALLERY_CHAPTERS.map((chapter, index) => (
        <IslandAdventureChapter
          key={chapter.id}
          chapter={chapter}
          index={index}
          layout={ISLAND_LAYOUTS[index % ISLAND_LAYOUTS.length]}
          nextChapter={WEDDING_GALLERY_CHAPTERS[index + 1]}
          animate={animate}
          isFirst={index === 0}
          isLast={index === WEDDING_GALLERY_CHAPTERS.length - 1}
          onPhotoClick={setLightbox}
        />
      ))}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={lite ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.alt}
            className="island-lightbox fixed inset-0 z-[80] flex items-center justify-center bg-[#1B4D6E]/92 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.img
              initial={lite ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              src={`${import.meta.env.BASE_URL}${lightbox.src}`}
              alt={lightbox.alt}
              className="island-lightbox__img max-h-[85vh] max-w-full rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              aria-label="關閉"
              className="island-focus absolute right-5 top-5 rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-sm text-white backdrop-blur-sm hover:bg-white/25"
              onClick={() => setLightbox(null)}
            >
              關閉
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

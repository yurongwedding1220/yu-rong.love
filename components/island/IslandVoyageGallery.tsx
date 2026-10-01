import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  GALLERY_ISLAND_DEPTHS,
  WEDDING_GALLERY_CHAPTERS,
  GalleryChapter,
  GalleryPhoto,
} from '../../constants';
import { useScrollJourney } from '../../hooks/ScrollJourneyContext';
import { usePerfMode, isLowPerf } from '../../hooks/usePerfMode';
import type { IslandPalette } from '../../utils/colorBlend';
import {
  getChapterSkyAccent,
  getChapterSunGradient,
  getGalleryPaletteAtDepth,
} from '../../utils/galleryDepthPalette';
import {
  GALLERY_HERO_SIZES,
  GALLERY_TILE_SIZES,
  getGalleryHeroSrcSet,
  getGalleryHeroUrl,
  getGalleryTileSrcSet,
  getGalleryTileUrl,
  getLightboxDisplayUrl,
  getThumbUrl,
} from '../../utils/photoUrls';

type PhotoShape = 'arch' | 'lagoon' | 'leaf' | 'pebble';

type IslandLayout = {
  titleAlign: 'left' | 'right' | 'center';
  titleInset: string;
  photoShape: PhotoShape;
  photoRotate: number;
  terrainShift: string;
  skyGlowAt: string;
  sunClass: string;
  emerge: { x: number; y: number; rotate: number };
  isReversed?: boolean;
};

type LightboxState = {
  photos: GalleryPhoto[];
  index: number;
};

type PhotoVariant = 'hero' | 'tile';

/** 每座島的造型差異 */
const ISLAND_VISUALS: Omit<IslandLayout, 'titleAlign' | 'titleInset' | 'isReversed'>[] = [
  {
    photoShape: 'arch',
    photoRotate: -3,
    terrainShift: 'translate-x-[6%]',
    skyGlowAt: '68% 12%',
    sunClass: 'right-[14%] top-[8%]',
    emerge: { x: 16, y: 14, rotate: 3 },
  },
  {
    photoShape: 'lagoon',
    photoRotate: 4,
    terrainShift: '-translate-x-[8%]',
    skyGlowAt: '28% 14%',
    sunClass: 'left-[10%] top-[10%]',
    emerge: { x: -16, y: 14, rotate: -3 },
  },
  {
    photoShape: 'leaf',
    photoRotate: -2,
    terrainShift: 'translate-x-[2%] scale-[1.06]',
    skyGlowAt: '50% 8%',
    sunClass: 'right-[20%] top-[8%]',
    emerge: { x: 14, y: 16, rotate: 2 },
  },
  {
    photoShape: 'pebble',
    photoRotate: 3,
    terrainShift: '-translate-x-[4%]',
    skyGlowAt: '72% 18%',
    sunClass: 'left-[16%] top-[12%]',
    emerge: { x: -14, y: 16, rotate: -2 },
  },
];

const getChapterLayout = (index: number): IslandLayout => {
  const visual = ISLAND_VISUALS[index % ISLAND_VISUALS.length];
  const isReversed = index % 2 === 1;
  return {
    ...visual,
    isReversed,
    titleAlign: isReversed ? 'right' : 'left',
    titleInset: '',
    emerge: {
      ...visual.emerge,
      x: isReversed ? -Math.abs(visual.emerge.x) : Math.abs(visual.emerge.x),
    },
  };
};

const SHAPE_CLASS: Record<PhotoShape, string> = {
  arch: 'island-photo-arch',
  lagoon: 'island-photo-lagoon',
  leaf: 'island-photo-leaf',
  pebble: 'island-photo-pebble',
};

const copyAlignClass = (align: 'left' | 'right') =>
  align === 'right' ? 'text-center md:text-right' : 'text-center md:text-left';

const tileStripClass = (photo: GalleryPhoto) =>
  photo.orientation === 'landscape'
    ? 'island-gallery-strip-item island-gallery-strip-item--landscape'
    : 'island-gallery-strip-item island-gallery-strip-item--portrait';

const aspectClass = (photo: GalleryPhoto, variant: PhotoVariant) => {
  if (variant === 'tile') {
    return photo.orientation === 'landscape' ? 'aspect-[4/3]' : 'aspect-[4/5]';
  }
  if (photo.heroWide || photo.orientation === 'landscape') {
    return 'aspect-[16/10]';
  }
  return 'aspect-[4/5]';
};

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
  layout: IslandLayout;
  photoIndex: number;
  total: number;
  variant: PhotoVariant;
  palette: IslandPalette;
  animate: boolean;
  onClick: () => void;
}> = ({ photo, layout, photoIndex, total, variant, palette, animate, onClick }) => {
  const isHero = variant === 'hero';
  const shapeClass = isHero ? SHAPE_CLASS[layout.photoShape] : '';
  const rotate = isHero ? layout.photoRotate : 0;

  const heroOpts = photo.heroGravity ? { gravity: photo.heroGravity } : undefined;
  const tileScale = !isHero && photo.tileScale && photo.tileScale > 1 ? photo.tileScale : 1;
  const src = isHero
    ? getGalleryHeroUrl(photo.publicId, 900, heroOpts)
    : getGalleryTileUrl(photo.publicId, Math.round(720 * tileScale));
  const srcSet = isHero
    ? getGalleryHeroSrcSet(photo.publicId, heroOpts)
    : getGalleryTileSrcSet(photo.publicId, tileScale);
  const sizes = isHero ? GALLERY_HERO_SIZES : GALLERY_TILE_SIZES;
  const imgStyle: React.CSSProperties = {
    ...(photo.objectPosition ? { objectPosition: photo.objectPosition } : {}),
    ...(tileScale > 1
      ? {
          transform: `scale(${tileScale})`,
          transformOrigin: photo.objectPosition ?? 'center center',
        }
      : {}),
    ...(tileScale > 1 ? ({ '--tile-scale': tileScale } as React.CSSProperties) : {}),
  };

  const body = (
    <button
      type="button"
      onClick={onClick}
      className="island-photo-portal island-focus group relative block h-full w-full"
      style={
        isHero
          ? ({
              '--photo-rotate': `${rotate}deg`,
              transform: `rotate(${rotate}deg)`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {isHero && (
        <div
          className="pointer-events-none absolute -inset-5 rounded-[50%] opacity-45 blur-2xl transition-opacity group-hover:opacity-65"
          style={{ background: `radial-gradient(circle, ${palette.glow}88, transparent 72%)` }}
          aria-hidden
        />
      )}
      <div
        className={`island-photo-frame relative h-full w-full ${
          isHero ? `island-photo-frame--hero ${shapeClass}` : 'island-photo-frame--tile'
        }`}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={photo.alt}
          className={`island-photo-frame__img ${aspectClass(photo, variant)}`}
          style={Object.keys(imgStyle).length > 0 ? imgStyle : undefined}
          loading="lazy"
          decoding="async"
        />
        <div className="island-photo-frame__veil" aria-hidden />
      </div>
    </button>
  );

  const shellClass = isHero ? 'h-full' : `h-full ${tileStripClass(photo)}`;

  if (!animate) {
    return <div className={shellClass}>{body}</div>;
  }

  return (
    <motion.div
      className={shellClass}
      initial={{
        opacity: 0,
        y: isHero ? layout.emerge.y : 10,
        x: isHero ? layout.emerge.x : 0,
        scale: 0.97,
      }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay: photoIndex * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {body}
    </motion.div>
  );
};

const IslandAdventureChapter: React.FC<{
  chapter: GalleryChapter;
  index: number;
  layout: IslandLayout;
  palette: IslandPalette;
  animate: boolean;
  isLast: boolean;
  onPhotoClick: (photo: GalleryPhoto, chapterPhotos: GalleryPhoto[]) => void;
}> = ({ chapter, index, layout, palette, animate, isLast, onPhotoClick }) => {
  const depthValue = GALLERY_ISLAND_DEPTHS[index] ?? GALLERY_ISLAND_DEPTHS.at(-1)!;
  const isReversed = layout.isReversed ?? index % 2 === 1;
  const heroPhoto = chapter.photos[0];
  const tilePhotos = chapter.photos.slice(1);
  const copyAlign = layout.titleAlign === 'right' ? 'right' : 'left';

  const titleBlock = (
    <div
      className={`island-gallery-copy mx-auto max-w-xs md:mx-0 md:max-w-[15rem] ${copyAlignClass(copyAlign)} ${layout.titleInset}`}
    >
      <p className="font-display text-[9px] tracking-[0.38em] text-white/50">
        航程 · 第 {String(index + 1).padStart(2, '0')} 座島
      </p>
      <h3 className="island-heading mt-2 font-serif text-[2.1rem] font-light leading-[1.05] text-white drop-shadow-md md:text-[2.55rem]">
        {chapter.title}
      </h3>
      <p className="mt-2 font-serif text-sm tracking-[0.12em] text-white/82">{chapter.subtitle}</p>
      <p className="island-heading-pretty mt-3 text-xs leading-[1.9] text-white/65 md:text-sm">
        {chapter.story}
      </p>
    </div>
  );

  const copyWing = (
    <div className="island-gallery-chapter__wing island-gallery-chapter__wing--copy">{titleBlock}</div>
  );

  const tilesWing = (
    <div className="island-gallery-chapter__wing island-gallery-chapter__wing--tiles">
      {tilePhotos.length > 1 && (
        <p className="island-gallery-strip-hint md:hidden" aria-hidden>
          <span aria-hidden>←</span>
          <span>左右滑動瀏覽</span>
          <span aria-hidden>→</span>
        </p>
      )}
      <div
        className={`island-gallery-wing-tiles island-gallery-wing-tiles--${tilePhotos.length}`}
      >
        <div className="island-gallery-wing-tiles__track">
          {tilePhotos.map((photo, tileIndex) => (
            <PhotoPortal
              key={photo.id}
              photo={photo}
              layout={layout}
              photoIndex={tileIndex + 1}
              total={chapter.photos.length}
              variant="tile"
              palette={palette}
              animate={animate}
              onClick={() => onPhotoClick(photo, chapter.photos)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const heroColumn = heroPhoto ? (
    <div className="island-gallery-chapter__hero">
      <PhotoPortal
        photo={heroPhoto}
        layout={layout}
        photoIndex={0}
        total={chapter.photos.length}
        variant="hero"
        palette={palette}
        animate={animate}
        onClick={() => onPhotoClick(heroPhoto, chapter.photos)}
      />
    </div>
  ) : null;

  const wingStart = isReversed ? tilesWing : copyWing;
  const wingEnd = isReversed ? copyWing : tilesWing;

  return (
    <article
      data-depth-value={depthValue}
      className="island-chapter-flow relative w-full overflow-hidden"
    >
      <div
        className={`pointer-events-none absolute ${layout.sunClass} h-14 w-14 rounded-full blur-md md:h-16 md:w-16`}
        style={{ background: getChapterSunGradient(index, palette) }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[45%]"
        style={{
          background: `radial-gradient(ellipse 70% 80% at ${layout.skyGlowAt}, ${getChapterSkyAccent(index, palette)}, transparent 72%)`,
        }}
        aria-hidden
      />

      <IslandTerrain chapterId={chapter.id} palette={palette} shiftClass={layout.terrainShift} />
      <SceneWaves palette={palette} animate={animate} />

      <div className="island-chapter-flow__body relative z-10 mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-20">
        <div
          className={`island-gallery-chapter island-gallery-chapter--triad ${
            isReversed ? 'island-gallery-chapter--triad-reverse' : 'island-gallery-chapter--triad-forward'
          }`}
        >
          <div className="island-gallery-chapter__wing-start">{wingStart}</div>
          {heroColumn}
          <div className="island-gallery-chapter__wing-end">{wingEnd}</div>
        </div>

        <div className="island-transition-slot">
          {!isLast && chapter.transition ? (
            <p className="island-transition-quote mx-auto max-w-sm text-center text-xs text-white/50 md:text-sm">
              「{chapter.transition}」
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
};

const GalleryLightbox: React.FC<{
  state: LightboxState;
  lite: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}> = ({ state, lite, onClose, onNavigate }) => {
  const filmstripRef = useRef<HTMLDivElement>(null);
  const photo = state.photos[state.index];
  const hasPrev = state.index > 0;
  const hasNext = state.index < state.photos.length - 1;

  const lightboxSrc = useMemo(
    () => getLightboxDisplayUrl(photo.publicId, window.innerWidth),
    [photo.publicId]
  );

  useEffect(() => {
    const strip = filmstripRef.current;
    const active = strip?.querySelector<HTMLElement>('[data-active="true"]');
    active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [state.index]);

  return (
    <motion.div
      initial={lite ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      className="island-lightbox fixed inset-0 z-[80] flex items-center justify-center bg-[#0f2d42]/94 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="island-lightbox__stage" onClick={(e) => e.stopPropagation()}>
        <motion.img
          key={photo.id}
          initial={lite ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          src={lightboxSrc}
          alt={photo.alt}
          className="island-lightbox__img max-h-[72vh] w-auto max-w-full rounded-2xl object-contain"
          draggable={false}
        />

        <p className="island-lightbox__caption">{photo.alt}</p>

        {state.photos.length > 1 && (
          <div ref={filmstripRef} className="island-lightbox__filmstrip" aria-label="章節照片">
            {state.photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                data-active={i === state.index ? 'true' : 'false'}
                aria-label={`第 ${i + 1} 張`}
                aria-current={i === state.index ? 'true' : undefined}
                className={`island-lightbox__thumb island-focus ${i === state.index ? 'island-lightbox__thumb--active' : ''}`}
                onClick={() => onNavigate(i)}
              >
                <img src={getThumbUrl(p.publicId, 72)} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        )}
      </div>

      {hasPrev && (
        <button
          type="button"
          aria-label="上一張"
          className="island-focus island-touch absolute left-3 rounded-full border border-white/20 bg-white/12 px-3 py-2 text-lg text-white backdrop-blur-sm hover:bg-white/22 md:left-6"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(state.index - 1);
          }}
        >
          ‹
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          aria-label="下一張"
          className="island-focus island-touch absolute right-3 rounded-full border border-white/20 bg-white/12 px-3 py-2 text-lg text-white backdrop-blur-sm hover:bg-white/22 md:right-6"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(state.index + 1);
          }}
        >
          ›
        </button>
      )}

      <button
        type="button"
        aria-label="關閉"
        className="island-focus island-touch absolute right-5 rounded-full border border-white/20 bg-white/12 px-4 py-1.5 text-sm text-white backdrop-blur-sm hover:bg-white/22"
        style={{ top: 'max(1.25rem, env(safe-area-inset-top))' }}
        onClick={onClose}
      >
        關閉
      </button>

      {state.photos.length > 1 && (
        <p
          className="pointer-events-none absolute bottom-5 text-[10px] tracking-[0.35em] text-white/50"
          aria-hidden
        >
          {state.index + 1} / {state.photos.length}
        </p>
      )}
    </motion.div>
  );
};

export const IslandVoyageGallery: React.FC = () => {
  const { depth } = useScrollJourney();
  const lite = isLowPerf(usePerfMode());
  const animate = !lite;
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const palette = useMemo(() => getGalleryPaletteAtDepth(depth), [depth]);

  const openLightbox = useCallback((photo: GalleryPhoto, chapterPhotos: GalleryPhoto[]) => {
    const index = chapterPhotos.findIndex((p) => p.id === photo.id);
    setLightbox({ photos: chapterPhotos, index: index >= 0 ? index : 0 });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft' && lightbox.index > 0) {
        setLightbox({ ...lightbox, index: lightbox.index - 1 });
      }
      if (e.key === 'ArrowRight' && lightbox.index < lightbox.photos.length - 1) {
        setLightbox({ ...lightbox, index: lightbox.index + 1 });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightbox]);

  if (!WEDDING_GALLERY_CHAPTERS.length) return null;

  return (
    <div className="relative w-full">
      {WEDDING_GALLERY_CHAPTERS.map((chapter, index) => (
        <IslandAdventureChapter
          key={chapter.id}
          chapter={chapter}
          index={index}
          layout={getChapterLayout(index)}
          palette={palette}
          animate={animate}
          isLast={index === WEDDING_GALLERY_CHAPTERS.length - 1}
          onPhotoClick={openLightbox}
        />
      ))}

      <AnimatePresence>
        {lightbox && (
          <GalleryLightbox
            state={lightbox}
            lite={lite}
            onClose={() => setLightbox(null)}
            onNavigate={(index) => setLightbox({ ...lightbox, index })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

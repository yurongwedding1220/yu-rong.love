import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cloudinaryImage, cloudinaryPortrait } from '../../data/invitation';

type Photo = {
  id: string;
  publicId: string;
  alt: string;
};

type Props = {
  photos: readonly Photo[];
};

const VISIBLE_SLOTS = 3;

const getOffset = (index: number, position: number, length: number) => {
  const raw = index - position;
  return ((raw + length / 2) % length + length) % length - length / 2;
};

const getCardStyle = (offset: number): React.CSSProperties => {
  const distance = Math.abs(offset);
  const direction = Math.sign(offset);

  if (distance > VISIBLE_SLOTS) {
    return {
      transform: `translateX(${direction * 180}%) translateZ(-450px) rotateY(${direction * 135}deg) scale(0.7)`,
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none',
    };
  }

  if (distance === 0) {
    return {
      transform: 'translateX(0%) translateZ(0px) rotateY(0deg) scale(1)',
      opacity: 1,
      zIndex: 100,
    };
  }

  return {
    transform: `translateX(${direction * distance * 60}%) translateZ(${-distance * 150}px) rotateY(${direction * distance * 45}deg) scale(${distance === 1 ? 0.85 : 0.7})`,
    opacity: distance === 1 ? 0.75 : distance === 2 ? 0.5 : 0.3,
    zIndex: 100 - distance,
  };
};

export const PhotoCarousel: React.FC<Props> = ({ photos }) => {
  const [position, setPosition] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = photos.length;
  const activeIndex = ((position % total) + total) % total;
  const activePhoto = photos[activeIndex];

  const go = useCallback((delta: number) => {
    setPosition((current) => current + delta);
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowLeft') setPosition((current) => current - 1);
      if (event.key === 'ArrowRight') setPosition((current) => current + 1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen]);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;

    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  const lightbox = lightboxOpen
    ? createPortal(
        <AnimatePresence>
          <motion.div
            className="inv-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="婚紗照相簿"
          >
            <button
              type="button"
              className="inv-lightbox-close"
              onClick={() => setLightboxOpen(false)}
              aria-label="關閉"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="inv-lightbox-stage" onClick={(event) => event.stopPropagation()}>
              <motion.img
                key={activePhoto.id}
                src={cloudinaryImage(activePhoto.publicId, 1800)}
                alt={activePhoto.alt}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
              />
            </div>

            <button
              type="button"
              className="inv-lightbox-arrow inv-lightbox-arrow--prev"
              onClick={(event) => {
                event.stopPropagation();
                go(-1);
              }}
              aria-label="上一張"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              className="inv-lightbox-arrow inv-lightbox-arrow--next"
              onClick={(event) => {
                event.stopPropagation();
                go(1);
              }}
              aria-label="下一張"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <p className="inv-lightbox-counter">
              {activeIndex + 1} <span>/</span> {total}
            </p>
          </motion.div>
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <div className="inv-album">
      <div
        className="inv-carousel"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          className="inv-carousel-arrow inv-carousel-arrow--prev"
          onClick={() => go(-1)}
          aria-label="上一張"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="inv-carousel-stage">
          {photos.map((photo, index) => {
            const offset = getOffset(index, position, total);
            const isActive = offset === 0;

            return (
              <div
                key={photo.id}
                className={`inv-carousel-card${isActive ? ' is-active' : ''}`}
                style={getCardStyle(offset)}
                onClick={() => {
                  if (isActive) {
                    setLightboxOpen(true);
                  } else if (Math.abs(offset) <= VISIBLE_SLOTS) {
                    go(offset);
                  }
                }}
                role={isActive ? 'button' : undefined}
                tabIndex={isActive ? 0 : -1}
                aria-label={isActive ? `放大第 ${index + 1} 張照片` : undefined}
                onKeyDown={(event) => {
                  if (isActive && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault();
                    setLightboxOpen(true);
                  }
                }}
              >
                <img
                  src={cloudinaryPortrait(photo.publicId, isActive ? 1200 : 700)}
                  alt={photo.alt}
                  loading={Math.abs(offset) <= 1 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        <button
          type="button"
          className="inv-carousel-arrow inv-carousel-arrow--next"
          onClick={() => go(1)}
          aria-label="下一張"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <p className="inv-carousel-counter" aria-live="polite">
        {activeIndex + 1} <span>/</span> {total}
      </p>

      {lightbox}
    </div>
  );
};

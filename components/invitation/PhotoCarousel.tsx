import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cloudinaryPortrait, cloudinarySrcSet, preloadInvitationNeighbors } from '../../data/invitation';
import { InvitationLightbox } from './InvitationLightbox';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useModalHistory } from '../../hooks/useModalHistory';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Photo = {
  id: string;
  publicId: string;
  alt: string;
};

type Props = {
  photos: readonly Photo[];
};

const VISIBLE_SLOTS = 3;
const CAROUSEL_WIDTHS = [400, 700, 1200] as const;
const CAROUSEL_SIZES = '(max-width: 767px) 80vw, 420px';

const getOffset = (index: number, position: number, length: number) => {
  const raw = index - position;
  return ((raw + length / 2) % length + length) % length - length / 2;
};

const getCardStyle = (offset: number, reducedMotion: boolean): React.CSSProperties => {
  const distance = Math.abs(offset);
  const direction = Math.sign(offset);

  if (reducedMotion) {
    if (distance !== 0) {
      return {
        transform: `translateX(${direction * 110}%)`,
        opacity: 0,
        zIndex: 0,
        pointerEvents: 'none',
      };
    }
    return {
      transform: 'translateX(0%)',
      opacity: 1,
      zIndex: 100,
    };
  }

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
  const triggerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const total = photos.length;
  const activeIndex = ((position % total) + total) % total;
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useBodyScrollLock(lightboxOpen);
  useModalHistory(lightboxOpen, closeLightbox);

  const go = useCallback((delta: number) => {
    setPosition((current) => current + delta);
  }, []);

  const goTo = useCallback((index: number) => {
    setPosition((current) => {
      const currentIndex = ((current % total) + total) % total;
      let delta = index - currentIndex;
      if (delta > total / 2) delta -= total;
      if (delta < -total / 2) delta += total;
      return current + delta;
    });
  }, [total]);

  const openLightbox = useCallback((eventTarget?: EventTarget | null) => {
    triggerRef.current = (eventTarget as HTMLElement) ?? (document.activeElement as HTMLElement);
    setLightboxOpen(true);
  }, []);

  useEffect(() => {
    preloadInvitationNeighbors(activeIndex, { includeLightbox: lightboxOpen });
  }, [activeIndex, lightboxOpen]);

  const wasLightboxOpen = useRef(false);
  useEffect(() => {
    if (lightboxOpen) {
      wasLightboxOpen.current = true;
      return;
    }
    if (wasLightboxOpen.current) {
      triggerRef.current?.focus();
      wasLightboxOpen.current = false;
    }
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
            const nearby = Math.abs(offset) <= 1;

            return (
              <div
                key={photo.id}
                className={`inv-carousel-card${isActive ? ' is-active' : ''}`}
                style={getCardStyle(offset, reducedMotion)}
                onClick={(event) => {
                  if (isActive) {
                    openLightbox(event.currentTarget);
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
                    openLightbox(event.currentTarget);
                  }
                }}
              >
                <img
                  src={cloudinaryPortrait(photo.publicId, isActive ? 1200 : 700)}
                  srcSet={cloudinarySrcSet(cloudinaryPortrait, photo.publicId, CAROUSEL_WIDTHS)}
                  sizes={CAROUSEL_SIZES}
                  alt={photo.alt}
                  loading={nearby ? 'eager' : 'lazy'}
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

      {lightboxOpen && (
        <InvitationLightbox
          photos={photos}
          activeIndex={activeIndex}
          reducedMotion={reducedMotion}
          onClose={closeLightbox}
          onGo={go}
          onGoTo={goTo}
        />
      )}
    </div>
  );
};

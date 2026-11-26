import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  cloudinaryImage,
  cloudinaryPortrait,
  cloudinarySrcSet,
  invitationLightboxWidth,
  preloadInvitationNeighbors,
} from '../../data/invitation';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
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
const LIGHTBOX_WIDTHS = [1200, 1800] as const;
const CAROUSEL_SIZES = '(max-width: 767px) 80vw, 420px';
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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

const LightboxPhoto: React.FC<{ src: string; srcSet: string; alt: string }> = ({ src, srcSet, alt }) => {
  const [shownSrc, setShownSrc] = useState(src);
  const [shownSrcSet, setShownSrcSet] = useState(srcSet);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    const markReady = () => {
      if (cancelled) return;
      setShownSrc(src);
      setShownSrcSet(srcSet);
      setReady(true);
    };
    setReady(false);
    image.onload = markReady;
    image.onerror = markReady;
    image.srcset = srcSet;
    image.src = src;
    if (image.complete && image.naturalWidth > 0) {
      markReady();
    }
    return () => {
      cancelled = true;
    };
  }, [src, srcSet]);

  return (
    <img
      src={shownSrc}
      srcSet={shownSrcSet}
      sizes="100vw"
      alt={alt}
      className={ready ? 'is-ready' : ''}
      draggable={false}
    />
  );
};

export const PhotoCarousel: React.FC<Props> = ({ photos }) => {
  const [position, setPosition] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const total = photos.length;
  const activeIndex = ((position % total) + total) % total;
  const activePhoto = photos[activeIndex];
  const lightboxWidth = invitationLightboxWidth();

  useBodyScrollLock(lightboxOpen);

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

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false);
      if (event.key === 'ArrowLeft') setPosition((current) => current - 1);
      if (event.key === 'ArrowRight') setPosition((current) => current + 1);

      if (event.key !== 'Tab') return;
      const root = lightboxRef.current;
      if (!root) return;
      const list = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true'
      );
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(focusTimer);
      triggerRef.current?.focus();
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
        <div
          ref={lightboxRef}
          className="inv-lightbox"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="婚紗照相簿"
        >
          <p className="inv-lightbox-counter">
            {activeIndex + 1} <span>/</span> {total}
          </p>

          <button
            ref={closeButtonRef}
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
            <LightboxPhoto
              src={cloudinaryImage(activePhoto.publicId, lightboxWidth)}
              srcSet={cloudinarySrcSet(cloudinaryImage, activePhoto.publicId, LIGHTBOX_WIDTHS)}
              alt={activePhoto.alt}
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

          <div
            className="inv-lightbox-thumbs"
            onClick={(event) => event.stopPropagation()}
          >
            {photos.map((photo, index) => (
              <button
                type="button"
                key={photo.id}
                className={`inv-lightbox-thumb${index === activeIndex ? ' is-active' : ''}`}
                onClick={() => goTo(index)}
                aria-label={`第 ${index + 1} 張照片`}
                aria-current={index === activeIndex ? 'true' : undefined}
              >
                <img
                  src={cloudinaryPortrait(photo.publicId, 200)}
                  alt=""
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>,
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

      {lightbox}
    </div>
  );
};

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  cloudinaryImage,
  cloudinaryPortrait,
  cloudinarySrcSet,
  invitationLightboxWidth,
  preloadInvitationNeighbors,
} from '../../data/invitation';
import { useLightboxZoom } from '../../hooks/useLightboxZoom';

type Photo = {
  id: string;
  publicId: string;
  alt: string;
};

type Props = {
  photos: readonly Photo[];
  activeIndex: number;
  reducedMotion: boolean;
  onClose: () => void;
  onGo: (delta: number) => void;
  onGoTo: (index: number) => void;
};

const LIGHTBOX_WIDTHS = [1200, 1800] as const;
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

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

export const InvitationLightbox: React.FC<Props> = ({
  photos,
  activeIndex,
  reducedMotion,
  onClose,
  onGo,
  onGoTo,
}) => {
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const total = photos.length;
  const activePhoto = photos[activeIndex];
  const lightboxWidth = invitationLightboxWidth();

  const {
    scale,
    offset,
    reset: resetZoom,
    containerRef,
    isZoomed,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDoubleClick,
  } = useLightboxZoom(true);

  const close = useCallback(() => {
    resetZoom();
    onClose();
  }, [onClose, resetZoom]);

  useEffect(() => {
    resetZoom();
    preloadInvitationNeighbors(activeIndex, { includeLightbox: true });
  }, [activeIndex, resetZoom]);

  useEffect(() => {
    const activeThumb = thumbsRef.current?.querySelector<HTMLElement>('.inv-lightbox-thumb.is-active');
    activeThumb?.scrollIntoView({
      behavior: reducedMotion ? 'instant' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onGo(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onGo(1);
      }

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
    };
  }, [close, onGo]);

  const onSwipe = useCallback(
    (result: { direction: 'left' | 'right' | 'down' | null }) => {
      if (result.direction === 'down') close();
      if (result.direction === 'right') onGo(-1);
      if (result.direction === 'left') onGo(1);
    },
    [close, onGo]
  );

  const handleBackdrop = () => {
    if (isZoomed) {
      resetZoom();
      return;
    }
    close();
  };

  return createPortal(
    <div
      ref={lightboxRef}
      className={`inv-lightbox${isZoomed ? ' is-zoomed' : ''}`}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="婚紗照相簿"
    >
      <p className="inv-lightbox-counter">
        {activeIndex + 1} <span>/</span> {total}
      </p>

      {isZoomed && (
        <button
          type="button"
          className="inv-lightbox-reset"
          onClick={(event) => {
            event.stopPropagation();
            resetZoom();
          }}
        >
          還原
        </button>
      )}

      <button
        ref={closeButtonRef}
        type="button"
        className="inv-lightbox-close"
        onClick={(event) => {
          event.stopPropagation();
          close();
        }}
        aria-label="關閉"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div
        ref={containerRef}
        className="inv-lightbox-stage"
        onClick={(event) => event.stopPropagation()}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={(event) => handleTouchEnd(event, onSwipe)}
        onTouchCancel={(event) => handleTouchEnd(event, onSwipe)}
      >
        <div
          className="inv-lightbox-zoom"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
            transition: isZoomed || reducedMotion ? undefined : 'transform 0.2s ease-out',
            willChange: isZoomed ? 'transform' : undefined,
          }}
        >
          <LightboxPhoto
            src={cloudinaryImage(activePhoto.publicId, lightboxWidth)}
            srcSet={cloudinarySrcSet(cloudinaryImage, activePhoto.publicId, LIGHTBOX_WIDTHS)}
            alt={activePhoto.alt}
          />
        </div>
      </div>

      {!isZoomed && (
        <>
          <button
            type="button"
            className="inv-lightbox-arrow inv-lightbox-arrow--prev"
            onClick={(event) => {
              event.stopPropagation();
              onGo(-1);
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
              onGo(1);
            }}
            aria-label="下一張"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      <div
        ref={thumbsRef}
        className="inv-lightbox-thumbs"
        onClick={(event) => event.stopPropagation()}
      >
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.id}
            className={`inv-lightbox-thumb${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => onGoTo(index)}
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
  );
};

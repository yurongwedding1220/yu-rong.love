import React, { useCallback, useRef, useState } from 'react';
import { INVITATION, invitationAsset } from '../../data/invitation';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type ColorId = (typeof INVITATION.dressColors)[number]['id'];

const DEFAULT_COLOR: ColorId = 'skyblue';

const preloadFiles = (files: readonly string[]) => {
  files.forEach((file) => {
    const image = new Image();
    image.src = invitationAsset(file);
  });
};

export const DressPreview: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [colorId, setColorId] = useState<ColorId>(DEFAULT_COLOR);
  const [index, setIndex] = useState(0);
  const [hint, setHint] = useState(true);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const colors = INVITATION.dressColors;
  const color = colors.find((item) => item.id === colorId) ?? colors[0];
  const total = color.outfits.length;

  const dismissHint = useCallback(() => setHint(false), []);

  const preloadColor = useCallback((id: ColorId) => {
    const next = colors.find((item) => item.id === id);
    if (next) preloadFiles(next.outfits.map((outfit) => outfit.file));
  }, [colors]);

  const selectColor = (id: ColorId) => {
    dismissHint();
    preloadColor(id);
    if (id === colorId) return;
    setColorId(id);
    setIndex(0);
  };

  const go = (delta: number) => {
    dismissHint();
    setIndex((current) => (current + delta + total) % total);
    preloadColor(colorId);
  };

  const goTo = (next: number) => {
    dismissHint();
    setIndex(next);
    preloadColor(colorId);
  };

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
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div className="inv-dress-preview">
      <div className="inv-swatches" role="group" aria-label="選擇服裝顏色">
        {colors.map((item) => {
          const selected = item.id === colorId;
          return (
            <button
              type="button"
              key={item.id}
              className={`inv-swatch${selected ? ' is-active' : ''}`}
              style={{ ['--swatch-color' as string]: item.hex } as React.CSSProperties}
              aria-pressed={selected}
              aria-label={`選擇${item.name}`}
              onClick={() => selectColor(item.id)}
              onMouseEnter={() => preloadColor(item.id)}
              onFocus={() => preloadColor(item.id)}
            >
              <span className="inv-swatch-dot" aria-hidden="true" />
              <span className="inv-swatch-name">{item.name}</span>
            </button>
          );
        })}
      </div>

      {hint && (
        <p className="inv-swatch-hint">點選色塊，預覽穿搭</p>
      )}

      <h3 className="inv-dress-preview-title">穿搭預覽</h3>
      <p className="inv-dress-preview-lead">點選上方色塊，預覽您的婚禮穿搭！</p>

      <div
        className={`inv-dress-stage${reducedMotion ? ' is-static' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          className="inv-dress-arrow inv-dress-arrow--prev"
          onClick={() => go(-1)}
          aria-label="上一套穿搭"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="inv-dress-viewport">
          <div
            key={colorId}
            className="inv-dress-track"
            style={{ transform: `translateX(${-index * 100}%)` }}
            aria-live="polite"
            aria-atomic="true"
          >
            {color.outfits.map((outfit, outfitIndex) => {
              const isDefault = colorId === DEFAULT_COLOR && outfitIndex === 0;
              return (
                <figure className="inv-dress-slide" key={outfit.file}>
                  <span className="inv-dress-shadow" aria-hidden="true" />
                  <img
                    src={invitationAsset(outfit.file)}
                    alt={outfit.alt}
                    width={450}
                    height={600}
                    loading={isDefault ? 'eager' : 'lazy'}
                    decoding="async"
                    draggable={false}
                  />
                </figure>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="inv-dress-arrow inv-dress-arrow--next"
          onClick={() => go(1)}
          aria-label="下一套穿搭"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="inv-dress-dots" role="tablist" aria-label={`${color.name}穿搭`}>
        {color.outfits.map((outfit, outfitIndex) => (
          <button
            type="button"
            key={outfit.file}
            role="tab"
            aria-selected={outfitIndex === index}
            aria-label={`${color.name}穿搭 ${outfitIndex + 1}`}
            className={`inv-dress-dot${outfitIndex === index ? ' is-active' : ''}`}
            onClick={() => goTo(outfitIndex)}
          />
        ))}
      </div>
    </div>
  );
};

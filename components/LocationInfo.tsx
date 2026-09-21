import React, { useEffect, useRef, useState } from 'react';
import { APP_CONTENT, TRANSPORT_INFO } from '../constants';

export const LocationInfo: React.FC = () => {
  const mapsQuery = APP_CONTENT.mapsQuery || `${APP_CONTENT.venueName} ${APP_CONTENT.venueAddress}`;
  const mapRef = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`;

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="space-y-12">
      <div className="island-card relative overflow-hidden rounded-2xl p-8 md:p-10">
        <div className="flex w-full flex-col items-stretch gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <p className="island-section-label mb-2">停泊港</p>
            <h3 className="island-heading font-serif text-2xl font-light text-[#1A3344] md:text-3xl">
              {APP_CONTENT.venueName}
            </h3>
            <h4 className="mt-1 font-serif text-base italic text-[#3A8FB7] md:text-lg">
              {APP_CONTENT.venueHall}
            </h4>
            <p className="island-prose mt-4 max-w-md md:hidden">
              {APP_CONTENT.venueDescription}
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 md:items-end">
            <p className="hidden max-w-xs text-right font-sans text-base leading-relaxed text-[#5A7380] md:block">
              {APP_CONTENT.venueDescription}
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="island-btn island-focus flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium shadow-md"
            >
              Google 地圖導航
            </a>
          </div>
        </div>
      </div>

      <div
        ref={mapRef}
        className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-[#3A8FB7]/15 bg-[#e8f0f4] shadow-sm md:h-[350px]"
      >
        {showMap ? (
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${APP_CONTENT.venueName} 地圖`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#5A7380]">
            地圖載入中…
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/60 bg-white/95 p-4 text-left shadow-lg backdrop-blur-sm md:right-auto md:max-w-xs">
          <p className="text-base font-medium text-[#1A3344]">{APP_CONTENT.venueName}</p>
          <p className="mt-1 text-sm leading-relaxed text-[#5A7380]">{APP_CONTENT.venueAddress}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TRANSPORT_INFO.map((item, idx) => (
          <div
            key={idx}
            className="island-card island-transport-card flex flex-col items-center rounded-2xl p-6 text-center md:p-7"
          >
            <div className="mb-4 text-3xl opacity-75 grayscale" aria-hidden>{item.icon}</div>
            <h4 className="mb-2 font-display text-[11px] uppercase tracking-[0.22em] text-[#3A8FB7]">
              {item.title}
            </h4>
            <span className="island-heading mb-3 block font-serif text-lg text-[#1A3344]">
              {item.chineseTitle}
            </span>
            <p className="island-prose text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

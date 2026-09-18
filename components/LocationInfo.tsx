import React, { useEffect, useRef, useState } from 'react';
import { APP_CONTENT, TRANSPORT_INFO } from '../constants';

export const LocationInfo: React.FC = () => {
  const mapsQuery = APP_CONTENT.mapsQuery || `${APP_CONTENT.venueName} ${APP_CONTENT.venueAddress}`;
  const mapRef = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);

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
      <div className="island-card relative overflow-hidden rounded-2xl p-8">
        <div className="flex w-full flex-col items-stretch gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <h3 className="mb-1 font-display text-xl tracking-wide text-[#1A3344] md:text-2xl">
              {APP_CONTENT.venueName}
            </h3>
            <h4 className="font-serif text-base italic text-[#3A8FB7] md:text-lg">
              {APP_CONTENT.venueHall}
            </h4>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="island-btn flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium shadow-lg md:hidden"
          >
            Google 地圖導航
          </a>

          <p className="hidden max-w-md text-left font-sans text-sm leading-relaxed text-[#5A7380] md:block md:text-right">
            {APP_CONTENT.venueDescription}
          </p>
        </div>
      </div>

      <div
        ref={mapRef}
        className="relative h-[280px] w-full overflow-hidden rounded-2xl border border-[#3A8FB7]/20 bg-[#e8f0f4] shadow-sm md:h-[350px]"
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
            title="Venue Map"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#5A7380]">
            地圖載入中…
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/60 bg-white/95 p-4 text-left shadow-lg md:right-auto">
          <p className="text-sm font-medium text-[#1A3344]">{APP_CONTENT.venueName}</p>
          <p className="mt-1 text-xs text-[#5A7380]">{APP_CONTENT.venueAddress}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TRANSPORT_INFO.map((item, idx) => (
          <div
            key={idx}
            className="island-card flex flex-col items-center rounded-2xl p-6 text-center"
          >
            <div className="mb-4 text-3xl opacity-80 grayscale">{item.icon}</div>
            <h4 className="mb-2 font-display text-xs uppercase tracking-widest text-[#3A8FB7]">
              {item.title}
            </h4>
            <span className="mb-3 block font-serif text-lg text-[#1A3344]">
              {item.chineseTitle}
            </span>
            <p className="text-xs leading-relaxed text-[#5A7380]">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

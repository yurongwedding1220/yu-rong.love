import React from 'react';
import { APP_CONTENT, TRANSPORT_INFO } from '../constants';

export const LocationInfo: React.FC = () => {
  const mapsQuery = APP_CONTENT.mapsQuery || `${APP_CONTENT.venueName} ${APP_CONTENT.venueAddress}`;

  return (
    <div className="space-y-12">
      <div className="island-card relative overflow-hidden rounded-2xl p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-[#7EC8E3]/40 blur-2xl" />

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
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Google 地圖導航
          </a>

          <p className="hidden max-w-md text-left font-sans text-sm leading-relaxed text-[#5A7380] md:block md:text-right">
            {APP_CONTENT.venueDescription}
          </p>
        </div>
      </div>

      <div className="group relative h-[350px] w-full overflow-hidden rounded-2xl border border-[#3A8FB7]/20 shadow-sm">
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Venue Map"
          className="opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/50 bg-white/90 p-4 text-left shadow-lg backdrop-blur-md md:right-auto">
          <p className="text-sm font-medium text-[#1A3344]">{APP_CONTENT.venueName}</p>
          <p className="mt-1 text-xs text-[#5A7380]">{APP_CONTENT.venueAddress}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TRANSPORT_INFO.map((item, idx) => (
          <div
            key={idx}
            className="island-card flex flex-col items-center rounded-2xl p-6 text-center transition-colors hover:bg-white/80"
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

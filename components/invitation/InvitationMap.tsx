import React, { useEffect, useRef, useState } from 'react';
import { INVITATION } from '../../data/invitation';

export const InvitationMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowMap(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {showMap ? (
        <iframe
          className="inv-map"
          title="婚宴地點地圖"
          src={INVITATION.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="inv-map" aria-hidden="true" />
      )}
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { INVITATION, invitationAsset } from '../../data/invitation';

export const InvitationAddToCalendar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const icsUrl = invitationAsset('wedding.ics');

  useEffect(() => {
    if (!open) return undefined;

    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="inv-calendar-actions" ref={rootRef}>
      <button
        type="button"
        className="inv-calendar-link inv-calendar-toggle"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        添加到日曆
      </button>
      {open && (
        <div className="inv-calendar-menu" role="menu">
          <a
            role="menuitem"
            className="inv-calendar-choice"
            href={INVITATION.calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google 日曆
          </a>
          <a role="menuitem" className="inv-calendar-choice" href={icsUrl}>
            Apple 日曆
          </a>
        </div>
      )}
    </div>
  );
};

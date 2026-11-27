import React from 'react';
import { INVITATION, invitationAsset } from '../../data/invitation';

export const InvitationAddToCalendar: React.FC = () => {
  const icsUrl = invitationAsset('wedding.ics');

  return (
    <div className="inv-calendar-actions">
      <a
        className="inv-calendar-link"
        href={INVITATION.calendarUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        加入 Google 日曆
      </a>
      <a className="inv-calendar-link" href={icsUrl}>
        Apple 日曆
      </a>
    </div>
  );
};

import React from 'react';
import { INVITATION } from '../../data/invitation';

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];
const DAYS_IN_MONTH = 31;
// 2026-12-01 is a Tuesday; the reference calendar starts the week on Monday.
const LEADING_EMPTY_DAYS = 1;

const HeartIcon: React.FC = () => (
  <svg viewBox="0 0 24 22" aria-hidden="true">
    <path d="M12 21C12 21 1.5 13.5 1.5 7.5C1.5 4.46 3.96 2 7 2C8.76 2 10.35 2.81 11.4 4.09L12 4.8L12.6 4.09C13.65 2.81 15.24 2 17 2C20.04 2 22.5 4.46 22.5 7.5C22.5 13.5 12 21 12 21Z" />
  </svg>
);

export const InvitationCalendar: React.FC = () => {
  const cells: Array<number | null> = [
    ...Array.from({ length: LEADING_EMPTY_DAYS }, () => null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, index) => index + 1),
  ];

  return (
    <div className="inv-calendar">
      <div className="inv-calendar-month">{INVITATION.year}年{INVITATION.month}月</div>

      <div className="inv-calendar-weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="inv-calendar-grid">
        {cells.map((day, index) => {
          const isWeddingDay = day === INVITATION.day;

          return (
            <div key={`${day ?? 'empty'}-${index}`} className="inv-calendar-cell">
              {day !== null && (
                isWeddingDay ? (
                  <span className="inv-calendar-heart">
                    <HeartIcon />
                    <span>{day}</span>
                  </span>
                ) : (
                  <span>{day}</span>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

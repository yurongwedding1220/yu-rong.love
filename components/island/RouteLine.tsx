import React from 'react';
import { ISLAND_ROUTE } from '../../constants';

export const RouteLine: React.FC<{ className?: string; light?: boolean }> = ({
  className = '',
  light = false,
}) => (
  <p
    className={`font-sans text-[10px] md:text-xs tracking-[0.28em] uppercase ${
      light ? 'text-white/70' : 'text-[#3A8FB7]'
    } ${className}`}
  >
    {ISLAND_ROUTE.join(' → ')}
  </p>
);

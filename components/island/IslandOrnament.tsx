import React from 'react';
import { SeaMotif, SeaMotifType, motifFromSeed } from './IslandSeaMotifs';

type IslandOrnamentProps = {
  /** 未指定時依 seed 自動選圖騰 */
  motif?: SeaMotifType;
  seed?: string;
  align?: 'center' | 'left';
  className?: string;
};

export const IslandOrnament: React.FC<IslandOrnamentProps> = ({
  motif,
  seed = '',
  align = 'center',
  className = '',
}) => {
  const type = motif ?? motifFromSeed(seed);
  const alignClass =
    align === 'left' ? 'island-ornament island-ornament--left' : 'island-ornament';

  return (
    <div className={`${alignClass} ${className}`} aria-hidden>
      <span className="island-ornament__mark island-ornament__mark--sea">
        <SeaMotif type={type} className="h-3.5 w-3.5 md:h-4 md:w-4" />
      </span>
    </div>
  );
};

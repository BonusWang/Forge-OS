import React from 'react';

interface AsciiProgressProps {
  current: number;
  total: number;
  width?: number;
  showPercent?: boolean;
  className?: string;
}

const AsciiProgress: React.FC<AsciiProgressProps> = ({
  current,
  total,
  width = 20,
  showPercent = true,
  className = '',
}) => {
  if (total <= 0) {
    return (
      <span className={`ascii-progress font-mono-data ${className}`} style={{ color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--text-muted)' }}>[{'░'.repeat(width)}]</span>
        {' '}0%
      </span>
    );
  }

  const percent = Math.min(100, Math.max(0, (current / total) * 100));
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  return (
    <span className={`ascii-progress font-mono-data ${className}`}>
      <span style={{ color: 'var(--accent-success)' }}>[{bar}]</span>
      {' '}
      <span style={{ color: 'var(--text-secondary)' }}>
        {showPercent ? `${Math.round(percent)}%` : `${current}/${total}`}
      </span>
    </span>
  );
};

export default AsciiProgress;

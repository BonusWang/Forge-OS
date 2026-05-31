import React from 'react';

interface AsciiBoxProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const AsciiBox: React.FC<AsciiBoxProps> = ({ title, children, className = '', style }) => {
  return (
    <div className={`ascii-box ${className}`} style={style}>
      {title && (
        <div className="ascii-box-title font-h2">
          {title}
        </div>
      )}
      <div className="ascii-box-content">
        {children}
      </div>
      <style>{`
        .ascii-box {
          border: 1px solid var(--border-primary);
          background-color: var(--bg-secondary);
          padding: 0;
          margin-bottom: var(--space-4);
          transition: border-color var(--duration-instant) var(--ease-instant);
        }
        .ascii-box:hover {
          border-color: var(--border-hover);
        }
        .ascii-box-title {
          color: var(--accent-gold);
          padding: var(--space-2) var(--space-3);
          border-bottom: 1px solid var(--border-primary);
          white-space: pre;
        }
        .ascii-box-content {
          padding: var(--space-3);
        }
      `}</style>
    </div>
  );
};

export default AsciiBox;

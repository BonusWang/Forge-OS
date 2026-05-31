import React from 'react';
import type { Reflection } from '../../types';

interface ReflectionCardProps {
  reflection: Reflection;
  onClick?: () => void;
}

const ReflectionCard: React.FC<ReflectionCardProps> = ({ reflection, onClick }) => {
  const stars = '★'.repeat(Math.round(reflection.answers.control / 2)) + '☆'.repeat(5 - Math.round(reflection.answers.control / 2));

  return (
    <div
      className="reflection-card"
      onClick={onClick}
      style={{
        border: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-secondary)',
        padding: 'var(--space-3)',
        cursor: onClick ? 'pointer' : 'default',
        transition: `border-color var(--duration-instant) var(--ease-instant), transform var(--duration-instant) var(--ease-instant)`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)';
        e.currentTarget.style.transform = 'translateY(2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-primary)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
        <span className="font-h3" style={{ color: 'var(--text-primary)' }}>
          {reflection.date}
        </span>
        <span style={{ color: 'var(--accent-gold)' }}>{stars}</span>
      </div>

      <div style={{ marginBottom: 'var(--space-2)' }}>
        <div className="font-caption" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-1)' }}>
          最大障碍:
        </div>
        <div className="font-body" style={{ color: 'var(--text-primary)' }}>
          {reflection.answers.obstacle || '—'}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
        {reflection.tags.map((tag) => (
          <span
            key={tag}
            className="font-caption"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              padding: 'var(--space-1) var(--space-2)',
              border: '1px solid var(--border-primary)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {onClick && (
        <div style={{ marginTop: 'var(--space-2)', textAlign: 'right' }}>
          <span className="font-caption" style={{ color: 'var(--text-muted)' }}>[查看详情]</span>
        </div>
      )}
    </div>
  );
};

export default ReflectionCard;

import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AsciiBox from '../../components/AsciiBox';
import { aloCopy } from '../../copy/alo-copy';

const EntertainmentPanel: React.FC = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');
  const { entertainments, addEntertainment, deleteEntertainment } = useAppStore();

  const today = new Date().toISOString().split('T')[0];
  const todayEnts = entertainments.filter((e) => e.date === today);

  const handleAdd = () => {
    if (newContent.trim()) {
      addEntertainment(newContent.trim(), today);
      setNewContent('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setNewContent('');
      setIsAdding(false);
    }
  };

  return (
    <AsciiBox title="ENTERTAINMENT">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {todayEnts.map((ent) => (
          <li
            key={ent.id}
            className="font-body"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-1) 0',
              borderBottom: '1px solid var(--border-primary)',
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>- {ent.content}</span>
            <button
              onClick={() => deleteEntertainment(ent.id)}
              className="font-caption"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-danger)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                transition: `color var(--duration-instant) var(--ease-instant)`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--accent-danger)';
              }}
            >
              [x]
            </button>
          </li>
        ))}
      </ul>

      {todayEnts.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-3) 0' }}>
          <img
            src="app://resources/alo-empty-state.png"
            alt="Empty state"
            style={{ width: '80px', height: 'auto', opacity: 0.5, marginBottom: 'var(--space-2)' }}
          />
          <div className="font-body" style={{ color: 'var(--text-muted)' }}>
            {aloCopy.emptyStates.inbox}
          </div>
        </div>
      )}

      {isAdding ? (
        <input
          autoFocus
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!newContent.trim()) setIsAdding(false);
          }}
          placeholder="输入娱乐活动..."
          className="font-body"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--accent-gold)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            padding: 'var(--space-1) 0',
            width: '100%',
            marginTop: 'var(--space-2)',
            outline: 'none',
            caretColor: 'var(--accent-gold)',
          }}
        />
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="font-caption"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            marginTop: 'var(--space-2)',
            textTransform: 'uppercase',
            transition: `color var(--duration-instant) var(--ease-instant)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          [+ 添加娱乐]
        </button>
      )}
    </AsciiBox>
  );
};

export default EntertainmentPanel;

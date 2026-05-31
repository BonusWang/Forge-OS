import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import ReflectionForm from './ReflectionForm';

const ReflectionQuickEntry: React.FC = () => {
  const { reflections } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayReflection = reflections.find((r) => r.date === today);

  if (todayReflection && !showForm) {
    return (
      <div>
        <div className="font-body" style={{ color: 'var(--accent-success)', marginBottom: 'var(--space-2)' }}>
          ☑ 今日已反思
        </div>
        <div className="font-caption" style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
          掌控感: {todayReflection.answers.control}/10
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="font-caption"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
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
          [查看/编辑]
        </button>
      </div>
    );
  }

  return (
    <div>
      {showForm && todayReflection ? (
        <ReflectionForm
          date={today}
          existingReflection={todayReflection}
          onSave={() => setShowForm(false)}
        />
      ) : (
        <ReflectionForm
          date={today}
          onSave={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ReflectionQuickEntry;

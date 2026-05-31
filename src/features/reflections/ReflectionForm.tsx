import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { generateTags } from '../../hooks/useReflectionTags';
import type { Reflection } from '../../types';

interface ReflectionFormProps {
  date: string;
  existingReflection?: Reflection;
  onSave?: () => void;
}

const ReflectionForm: React.FC<ReflectionFormProps> = ({
  date,
  existingReflection,
  onSave,
}) => {
  const { saveReflection } = useAppStore();

  const [answers, setAnswers] = useState({
    obstacle: existingReflection?.answers.obstacle || '',
    solution: existingReflection?.answers.solution || '',
    effective: existingReflection?.answers.effective || '',
    adjustment: existingReflection?.answers.adjustment || '',
    control: existingReflection?.answers.control || 5,
  });

  const handleSubmit = () => {
    if (!answers.obstacle.trim()) return;

    const tags = generateTags('obstacle-breakthrough', answers);

    saveReflection({
      date,
      template: 'obstacle-breakthrough',
      answers,
      tags,
    });

    if (onSave) onSave();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border-primary)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    padding: 'var(--space-1) 0',
    fontSize: '13px',
    marginBottom: 'var(--space-3)',
    outline: 'none',
    caretColor: 'var(--accent-gold)',
    transition: `border-color var(--duration-instant) var(--ease-instant)`,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'var(--text-secondary)',
    fontSize: '11px',
    letterSpacing: '0.03em',
    marginBottom: 'var(--space-1)',
    textTransform: 'uppercase',
  };

  const questions = [
    { key: 'obstacle' as const, label: '最大障碍' },
    { key: 'solution' as const, label: '解决方法' },
    { key: 'effective' as const, label: '有效/无效' },
    { key: 'adjustment' as const, label: '明天调整' },
  ];

  return (
    <div>
      {questions.map((q) => (
        <div key={q.key}>
          <label className="font-caption" style={labelStyle}>{q.label}:</label>
          <input
            value={answers[q.key]}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))}
            placeholder="..."
            className="font-body"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderBottomColor = 'var(--accent-gold)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderBottomColor = 'var(--border-primary)';
            }}
          />
        </div>
      ))}

      <div>
        <label className="font-caption" style={labelStyle}>掌控感 (1-10):</label>
        <input
          type="number"
          min={1}
          max={10}
          value={answers.control}
          onChange={(e) =>
            setAnswers((prev) => ({ ...prev, control: parseInt(e.target.value) || 5 }))
          }
          className="font-body"
          style={{ ...inputStyle, width: '60px' }}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="font-caption"
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          padding: 'var(--space-1) var(--space-2)',
          marginTop: 'var(--space-2)',
          textTransform: 'uppercase',
          transition: `background-color var(--duration-instant) var(--ease-instant), color var(--duration-instant) var(--ease-instant)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--text-primary)';
          e.currentTarget.style.color = 'var(--bg-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }}
      >
        [  保存反思  ]
      </button>
    </div>
  );
};

export default ReflectionForm;

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useMoodTrend, renderAsciiLineChart } from '../../hooks/useMoodTrend';
import AsciiBox from '../../components/AsciiBox';

const getTodayString = () => new Date().toISOString().split('T')[0];

const MoodTrackerPanel: React.FC = () => {
  const moods = useAppStore((s) => s.moods);
  const saveMood = useAppStore((s) => s.saveMood);
  const deleteMood = useAppStore((s) => s.deleteMood);

  const today = getTodayString();
  const todayMood = moods.find((m) => m.date === today);

  const [mood, setMood] = useState(todayMood?.mood ?? 5);
  const [energy, setEnergy] = useState(todayMood?.energy ?? 5);
  const [note, setNote] = useState(todayMood?.note ?? '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (todayMood) {
      setMood(todayMood.mood);
      setEnergy(todayMood.energy);
      setNote(todayMood.note);
    }
  }, [todayMood]);

  const trend = useMoodTrend(moods, today, 7);
  const moodChart = renderAsciiLineChart(trend.map((d) => d.mood));

  const moodLabel = (value: number) => {
    if (value <= 3) return '低落';
    if (value <= 5) return '平静';
    if (value <= 7) return '不错';
    return '极好';
  };

  const handleSave = () => {
    saveMood({ date: today, mood, energy, note });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <AsciiBox title="情绪追踪">
      {/* Today's entry */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div
          className="font-caption"
          style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}
        >
          {todayMood ? '今日已记录 — 可修改' : '记录今日情绪'}
        </div>

        {/* Mood slider */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
            <label className="font-caption" style={{ color: 'var(--text-secondary)' }}>
              心情
            </label>
            <span className="font-mono-data" style={{ color: 'var(--accent-gold)' }}>
              {mood}/10 — {moodLabel(mood)}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-gold)' }}
          />
        </div>

        {/* Energy slider */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
            <label className="font-caption" style={{ color: 'var(--text-secondary)' }}>
              能量
            </label>
            <span className="font-mono-data" style={{ color: 'var(--accent-success)' }}>
              {energy}/10
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-success)' }}
          />
        </div>

        {/* Note */}
        <div style={{ marginBottom: 'var(--space-3)' }}>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="备注（可选）..."
            className="font-body"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border-primary)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) 0',
              width: '100%',
              outline: 'none',
              caretColor: 'var(--accent-gold)',
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            className="font-body"
            style={{
              background: saved ? 'var(--accent-success)' : 'var(--accent-gold)',
              border: `1px solid ${saved ? 'var(--accent-success)' : 'var(--accent-gold)'}`,
              color: 'var(--bg-primary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-3)',
              transition: 'all var(--duration-instant)',
            }}
          >
            {saved ? '[✓ 已保存]' : '[保存]'}
          </button>
          {todayMood && (
            <button
              onClick={() => deleteMood(todayMood.id)}
              className="font-caption"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-danger)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              [删除今日记录]
            </button>
          )}
        </div>
      </div>

      {/* ASCII Chart */}
      {trend.some((d) => d.mood !== null) && (
        <div
          style={{
            borderTop: '1px solid var(--border-primary)',
            paddingTop: 'var(--space-3)',
          }}
        >
          <div
            className="font-caption"
            style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}
          >
            近 7 天心情趋势
          </div>
          <pre
            className="font-mono-data"
            style={{
              color: 'var(--text-secondary)',
              lineHeight: 1.4,
              margin: 0,
              overflow: 'auto',
            }}
          >
            {moodChart}
          </pre>
          <div
            className="font-caption"
            style={{
              color: 'var(--text-muted)',
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 'var(--space-1)',
            }}
          >
            {trend.map((d) => (
              <span key={d.date}>
                {d.date.slice(5)}
              </span>
            ))}
          </div>
        </div>
      )}
    </AsciiBox>
  );
};

export default MoodTrackerPanel;

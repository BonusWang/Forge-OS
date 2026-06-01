import React, { useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import AsciiBox from '../components/AsciiBox';
import OrbitPageHeader from '../components/OrbitPageHeader';
import { useAppStore } from '../store/useAppStore';
import { WEEKLY_REVIEW_LITE_TEMPLATE_ID } from '../store/slices/reflectionTemplateSlice';
import { getNextWeekStart, getPrevWeekStart, getWeekDates, getWeekStart } from '../utils/date';
import type { Reflection, Task } from '../types';

interface WeeklyReviewPageProps {
  visualStyle?: 'classic' | 'orbit';
  initialWeekStart?: string;
}

interface WeeklyReviewEditorProps {
  periodStart: string;
  periodEnd: string;
  existingReview?: Reflection;
}

const getTextAnswer = (review: Reflection | undefined, ids: string[]) => {
  if (!review) return '';
  const value = ids.map((id) => review.answers[id]).find((answer) => typeof answer === 'string' && answer.trim());
  return value ? String(value) : '';
};

const getTaskEvidence = (tasks: Task[], weekStart: string) => {
  const weekDateSet = new Set(getWeekDates(weekStart));
  const weekTasks = tasks
    .filter((task) => weekDateSet.has(task.date))
    .sort((a, b) => `${a.date}-${a.order}`.localeCompare(`${b.date}-${b.order}`));
  const completed = weekTasks.filter((task) => task.status === 'completed');
  const active = weekTasks.filter((task) => task.status === 'active');

  return { weekTasks, completed, active };
};

const WeeklyReviewEditor: React.FC<WeeklyReviewEditorProps> = ({
  periodStart,
  periodEnd,
  existingReview,
}) => {
  const saveReflection = useAppStore((s) => s.saveReflection);
  const [done, setDone] = useState(() =>
    getTextAnswer(existingReview, ['weekly-done', 'weekly-facts'])
  );
  const [blocked, setBlocked] = useState(() =>
    getTextAnswer(existingReview, ['weekly-blocked', 'weekly-questions'])
  );
  const [nextOne, setNextOne] = useState(() =>
    getTextAnswer(existingReview, ['weekly-next-one', 'weekly-next'])
  );

  const canSave = done.trim().length > 0 && nextOne.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    saveReflection({
      date: periodEnd,
      kind: 'weeklyReview',
      periodStart,
      periodEnd,
      templateId: WEEKLY_REVIEW_LITE_TEMPLATE_ID,
      answers: {
        'weekly-done': done,
        'weekly-blocked': blocked,
        'weekly-next-one': nextOne,
      },
      tags: ['周复盘', `${periodStart}~${periodEnd}`, periodStart.slice(0, 7)],
    });
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '112px',
    resize: 'vertical',
    boxSizing: 'border-box',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-primary)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    lineHeight: 1.7,
    outline: 'none',
    padding: 'var(--space-2)',
  };

  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <label>
        <span className="font-caption" style={{ color: 'var(--text-secondary)' }}>
          本周完成了什么 *
        </span>
        <textarea value={done} onChange={(event) => setDone(event.target.value)} style={fieldStyle} />
      </label>

      <label>
        <span className="font-caption" style={{ color: 'var(--text-secondary)' }}>
          本周卡在哪里
        </span>
        <textarea value={blocked} onChange={(event) => setBlocked(event.target.value)} style={fieldStyle} />
      </label>

      <label>
        <span className="font-caption" style={{ color: 'var(--text-secondary)' }}>
          下周只调整一件什么事 *
        </span>
        <textarea value={nextOne} onChange={(event) => setNextOne(event.target.value)} style={fieldStyle} />
      </label>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="font-caption"
          style={{
            background: canSave ? 'var(--text-primary)' : 'var(--bg-tertiary)',
            border: `1px solid ${canSave ? 'var(--text-primary)' : 'var(--border-primary)'}`,
            color: canSave ? 'var(--bg-primary)' : 'var(--text-muted)',
            cursor: canSave ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-mono)',
            padding: 'var(--space-1) var(--space-3)',
          }}
        >
          保存周复盘
        </button>
      </div>
    </div>
  );
};

const WeeklyReviewPage: React.FC<WeeklyReviewPageProps> = ({
  visualStyle = 'classic',
  initialWeekStart,
}) => {
  const [weekStart, setWeekStart] = useState(initialWeekStart || getWeekStart());
  const tasks = useAppStore((s) => s.tasks);
  const reflections = useAppStore((s) => s.reflections);
  const isOrbitStyle = visualStyle === 'orbit';
  const periodEnd = format(addDays(new Date(weekStart), 6), 'yyyy-MM-dd');
  const { weekTasks, completed, active } = useMemo(
    () => getTaskEvidence(tasks, weekStart),
    [tasks, weekStart]
  );
  const weeklyReviews = reflections
    .filter((reflection) => reflection.kind === 'weeklyReview')
    .sort((a, b) => (b.periodStart ?? '').localeCompare(a.periodStart ?? ''));
  const existingReview = weeklyReviews.find((review) => review.periodStart === weekStart);

  return (
    <div className={isOrbitStyle ? 'orbit-page weekly-review-page' : ''}>
      {isOrbitStyle && (
        <OrbitPageHeader
          eyebrow="Weekly wiki"
          title="周复盘"
          kpis={[
            {
              label: '本周任务',
              value: weekTasks.length,
              detail: `${completed.length} 完成 / ${active.length} 未完成`,
              tone: completed.length > 0 ? 'green' : 'orange',
            },
            {
              label: '复盘页',
              value: weeklyReviews.length,
              detail: '一周一页',
              tone: 'yellow',
            },
            {
              label: '当前周',
              value: format(new Date(weekStart), 'M/d'),
              detail: `至 ${format(new Date(periodEnd), 'M/d')}`,
              tone: 'muted',
            },
            {
              label: '状态',
              value: existingReview ? '已写' : '待写',
              detail: '保存后进入反思库',
              tone: existingReview ? 'green' : 'orange',
            },
          ]}
        />
      )}

      <div
        className="weekly-review-layout"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)',
          gap: 'var(--space-6)',
          alignItems: 'start',
        }}
      >
        <AsciiBox title="周页面">
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <button
              onClick={() => setWeekStart(getPrevWeekStart(weekStart))}
              className="font-caption"
              style={navButtonStyle}
            >
              上一周
            </button>
            <button
              onClick={() => setWeekStart(getWeekStart())}
              className="font-caption"
              style={navButtonStyle}
            >
              本周
            </button>
            <button
              onClick={() => setWeekStart(getNextWeekStart(weekStart))}
              className="font-caption"
              style={navButtonStyle}
            >
              下一周
            </button>
          </div>

          <div style={{ marginTop: 'var(--space-4)' }}>
            {weeklyReviews.length === 0 ? (
              <div className="font-body" style={{ color: 'var(--text-muted)' }}>
                暂无周复盘
              </div>
            ) : (
              weeklyReviews.map((review) => (
                <button
                  key={review.id}
                  onClick={() => review.periodStart && setWeekStart(review.periodStart)}
                  className="font-caption"
                  style={{
                    ...navButtonStyle,
                    width: '100%',
                    marginBottom: 'var(--space-1)',
                    color: review.periodStart === weekStart ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  }}
                >
                  {review.periodStart} - {review.periodEnd}
                </button>
              ))
            )}
          </div>
        </AsciiBox>

        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <AsciiBox title={`${weekStart} - ${periodEnd}`}>
            <WeeklyReviewEditor
              key={`${weekStart}-${existingReview?.id ?? 'new'}`}
              periodStart={weekStart}
              periodEnd={periodEnd}
              existingReview={existingReview}
            />
          </AsciiBox>

          <AsciiBox title="本周证据">
            <div
              className="font-caption"
              style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}
            >
              完成 {completed.length} 项 / 未完成 {active.length} 项
            </div>
            <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
              {weekTasks.length === 0 ? (
                <div className="font-body" style={{ color: 'var(--text-muted)' }}>
                  本周暂无任务
                </div>
              ) : (
                weekTasks.map((task) => (
                  <div
                    key={task.id}
                    className="font-body"
                    style={{
                      borderBottom: '1px solid var(--border-primary)',
                      color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                      padding: 'var(--space-1) 0',
                      textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    }}
                  >
                    {task.date.slice(5)} · {task.content}
                  </div>
                ))
              )}
            </div>
          </AsciiBox>
        </div>
      </div>
    </div>
  );
};

const navButtonStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid var(--border-primary)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  padding: 'var(--space-1) var(--space-2)',
  textAlign: 'left',
};

export default WeeklyReviewPage;

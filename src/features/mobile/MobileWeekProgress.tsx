import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAppStore } from '../../store/useAppStore';
import { WEEKLY_REVIEW_LITE_TEMPLATE_ID } from '../../store/slices/reflectionTemplateSlice';
import { getDateLabelForDay, getDayColumnFromDate, getTodayString, getWeekDates, getWeekStart } from '../../utils/date';
import type { Reflection } from '../../types';

const getTextAnswer = (review: Reflection | undefined, ids: string[]) => {
  if (!review) return '';
  const answer = ids.map((id) => review.answers[id]).find((value) => typeof value === 'string' && value.trim());
  return answer ? String(answer) : '';
};

const MobileWeekProgress: React.FC = () => {
  const tasks = useAppStore((s) => s.tasks);
  const reflections = useAppStore((s) => s.reflections);
  const saveReflection = useAppStore((s) => s.saveReflection);
  const today = getTodayString();
  const weekStart = getWeekStart();
  const weekDates = getWeekDates(weekStart);
  const periodEnd = weekDates[6];
  const weekTasks = tasks.filter((task) => weekDates.includes(task.date));
  const completedCount = weekTasks.filter((task) => task.status === 'completed').length;
  const activeCount = weekTasks.length - completedCount;
  const completionRatio = weekTasks.length === 0 ? 0 : Math.round((completedCount / weekTasks.length) * 100);
  const existingReview = reflections.find(
    (reflection) => reflection.kind === 'weeklyReview' && reflection.periodStart === weekStart
  );
  const [isWeeklyReviewOpen, setIsWeeklyReviewOpen] = useState(false);
  const [done, setDone] = useState(() => getTextAnswer(existingReview, ['weekly-done', 'weekly-facts']));
  const [blocked, setBlocked] = useState(() => getTextAnswer(existingReview, ['weekly-blocked', 'weekly-questions']));
  const [nextOne, setNextOne] = useState(() => getTextAnswer(existingReview, ['weekly-next-one', 'weekly-next']));
  const [savedFlash, setSavedFlash] = useState('');
  const [expandedDates, setExpandedDates] = useState<Set<string>>(() => new Set());
  const canSaveReview = done.trim().length > 0 && nextOne.trim().length > 0;

  const toggleDateExpansion = (date: string) => {
    setExpandedDates((current) => {
      const next = new Set(current);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  const saveWeeklyReview = () => {
    if (!canSaveReview) return;

    saveReflection({
      date: periodEnd,
      kind: 'weeklyReview',
      periodStart: weekStart,
      periodEnd,
      templateId: WEEKLY_REVIEW_LITE_TEMPLATE_ID,
      answers: {
        'weekly-done': done.trim(),
        'weekly-blocked': blocked.trim(),
        'weekly-next-one': nextOne.trim(),
      },
      tags: ['周复盘', `${weekStart}~${periodEnd}`, weekStart.slice(0, 7), 'mobile'],
    });
    setSavedFlash('周复盘已保存');
    window.setTimeout(() => setSavedFlash(''), 1800);
  };

  return (
    <div className="mobile-progress-console">
      <section className="mobile-week-console">
        <div className="mobile-card-label">本周推进</div>
        <h1>{format(new Date(weekStart), 'M月d日')} - {format(new Date(periodEnd), 'M月d日')}</h1>
        <p>移动端先完成轻量复盘，桌面端保留更完整的整理视图。</p>
        <div className="mobile-progress-stats" aria-label="本周状态">
          <span><strong>{completedCount}</strong>已完成</span>
          <span><strong>{activeCount}</strong>待推进</span>
          <span><strong>{completionRatio}%</strong>完成率</span>
        </div>
        <button
          type="button"
          className="mobile-primary-button"
          aria-controls="mobile-week-review-panel"
          aria-expanded={isWeeklyReviewOpen}
          onClick={() => setIsWeeklyReviewOpen((open) => !open)}
        >
          {isWeeklyReviewOpen ? '收起周复盘' : '打开周复盘'}
        </button>
      </section>

      {isWeeklyReviewOpen && (
        <section
          id="mobile-week-review-panel"
          className="mobile-week-review-panel"
          aria-label="移动端周复盘"
        >
          <div className="mobile-section-heading">
            <div>
              <span>周复盘</span>
              <h2>{weekStart} - {periodEnd}</h2>
            </div>
            <span>{existingReview ? '已保存' : '草稿'}</span>
          </div>

          <label className="mobile-review-field">
            <span>本周完成了什么 *</span>
            <textarea
              value={done}
              onChange={(event) => setDone(event.target.value)}
              className="mobile-textarea"
              rows={4}
            />
          </label>

          <label className="mobile-review-field">
            <span>本周卡在哪里</span>
            <textarea
              value={blocked}
              onChange={(event) => setBlocked(event.target.value)}
              className="mobile-textarea"
              rows={3}
            />
          </label>

          <label className="mobile-review-field">
            <span>下周只调整一件什么事 *</span>
            <textarea
              value={nextOne}
              onChange={(event) => setNextOne(event.target.value)}
              className="mobile-textarea"
              rows={4}
            />
          </label>

          <button
            type="button"
            className="mobile-primary-button"
            disabled={!canSaveReview}
            onClick={saveWeeklyReview}
          >
            保存周复盘
          </button>
          {savedFlash && <div className="mobile-save-flash">{savedFlash}</div>}
        </section>
      )}

      <div className="mobile-day-timeline" aria-label="本周每日推进">
        {weekDates.map((date) => {
          const dayTasks = tasks
            .filter((task) => task.date === date)
            .sort((a, b) => a.order - b.order);
          const dayColumn = getDayColumnFromDate(new Date(date));
          const complete = dayTasks.filter((task) => task.status === 'completed').length;
          const active = dayTasks.length - complete;
          const isToday = date === today;
          const dayLabel = getDateLabelForDay(dayColumn);
          const dayStatus = dayTasks.length === 0
            ? '空白'
            : active === 0
              ? '已完成'
              : isToday
                ? '今日推进'
                : '待处理';
          const shouldExpand = isToday || active > 0 || expandedDates.has(date);
          const summary = dayTasks.length === 0
            ? '这一天还没有承诺。'
            : `已完成 ${complete} 项，点开查看明细。`;

          return (
            <section
              className={`mobile-day-node${isToday ? ' is-today' : ''}${!shouldExpand ? ' is-collapsed' : ''}`}
              key={date}
            >
              <span className="mobile-day-marker" aria-hidden="true" />
              <button
                type="button"
                className="mobile-day-header mobile-day-toggle"
                aria-controls={`mobile-day-detail-${date}`}
                aria-expanded={shouldExpand}
                aria-label={`${dayLabel} ${date} ${shouldExpand ? '收起任务明细' : '查看任务明细'}`}
                onClick={() => toggleDateExpansion(date)}
              >
                <div>
                  <span>{dayLabel}</span>
                  <strong>{format(new Date(date), 'MM/dd')}</strong>
                </div>
                <span className="mobile-day-status-chip">{dayStatus} · {complete}/{dayTasks.length}</span>
              </button>
              {shouldExpand ? (
                <div id={`mobile-day-detail-${date}`} className="mobile-day-task-list">
                  {dayTasks.map((task) => (
                    <div className="mobile-day-task" key={task.id}>
                      <span>{task.status === 'completed' ? '☑' : '□'}</span>
                      <p>{task.content}</p>
                    </div>
                  ))}
                  {dayTasks.length === 0 && <div className="mobile-empty-state">这一天还没有承诺。</div>}
                </div>
              ) : (
                <div className="mobile-day-summary">{summary}</div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default MobileWeekProgress;

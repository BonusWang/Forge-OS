import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getTodayString } from '../../utils/date';

type CaptureMode = 'inspiration' | 'reflection' | 'evidence';

const modeLabels: Record<CaptureMode, string> = {
  inspiration: '灵感',
  reflection: '反思',
  evidence: '成效',
};

const modeDestinations: Record<CaptureMode, string> = {
  inspiration: '灵感库',
  reflection: '反思库',
  evidence: '有效做法',
};

const modeDescriptions: Record<CaptureMode, string> = {
  inspiration: '捕捉一个新想法，稍后可转成任务。',
  reflection: '记录一个卡点、判断或调整。',
  evidence: '留下一个结果、进展或有效做法。',
};

const appendCaptureAnswer = (currentValue: unknown, nextContent: string) => {
  const current = typeof currentValue === 'string' ? currentValue.trim() : '';
  return current ? `${current}\n\n${nextContent}` : nextContent;
};

const getCaptureMode = (tags: string[]): CaptureMode => {
  if (tags.includes('reflection')) return 'reflection';
  if (tags.includes('evidence')) return 'evidence';
  return 'inspiration';
};

const MobileCaptureHub: React.FC = () => {
  const today = getTodayString();
  const [mode, setMode] = useState<CaptureMode>('inspiration');
  const [content, setContent] = useState('');
  const [savedFlash, setSavedFlash] = useState('');
  const [latestSavedId, setLatestSavedId] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const addInspiration = useAppStore((s) => s.addInspiration);
  const inspirations = useAppStore((s) => s.inspirations);
  const saveReflection = useAppStore((s) => s.saveReflection);
  const reflections = useAppStore((s) => s.reflections);
  const getDefaultTemplate = useAppStore((s) => s.getDefaultTemplate);
  const recentMobileCaptures = inspirations
    .filter((item) => item.tags.includes('mobile'))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);
  const canSaveCapture = content.trim().length > 0;

  const saveCapture = () => {
    const nextContent = content.trim();
    if (!nextContent) return;

    const savedId = addInspiration({
      content: nextContent,
      tags: ['mobile', mode],
    });

    if (mode !== 'inspiration') {
      const existing = reflections.find((reflection) => (reflection.kind ?? 'daily') === 'daily' && reflection.date === today);
      const defaultTemplate = getDefaultTemplate();
      const questionId = mode === 'evidence' ? 'q-effective' : 'q-solution';
      saveReflection({
        date: today,
        kind: 'daily',
        templateId: existing?.templateId ?? defaultTemplate?.id ?? 'obstacle-breakthrough',
        answers: {
          ...(existing?.answers ?? {}),
          [questionId]: appendCaptureAnswer(existing?.answers?.[questionId], nextContent),
        },
        tags: Array.from(new Set([...(existing?.tags ?? []), 'mobile', mode])),
      });
    }

    setContent('');
    setIsComposerOpen(false);
    setLatestSavedId(savedId);
    setSavedFlash(`${modeLabels[mode]}已保存到记录流`);
    window.setTimeout(() => {
      setSavedFlash('');
      setLatestSavedId('');
    }, 2200);
  };

  return (
    <div className="mobile-journal-timeline">
      <section className={`mobile-capture-composer ${isComposerOpen ? 'is-open' : 'is-collapsed'}`}>
        <div className="mobile-capture-rail" aria-hidden="true">
          <span className={mode === 'inspiration' ? 'is-active' : ''} />
          <span className={mode === 'reflection' ? 'is-active' : ''} />
          <span className={mode === 'evidence' ? 'is-active' : ''} />
        </div>
        <div className="mobile-capture-body">
          <div className="mobile-card-label">记录</div>
          <h1>统一记录入口</h1>
          <p>选择去向，保存后立即进入记录流，并写回桌面数据。</p>
          <div className="mobile-capture-lanes" role="tablist" aria-label="记录类型">
            {(Object.keys(modeLabels) as CaptureMode[]).map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={mode === item}
                className={mode === item ? 'is-active' : ''}
                onClick={() => {
                  setMode(item);
                  setIsComposerOpen(true);
                }}
              >
                {modeLabels[item]}
              </button>
            ))}
          </div>
          <div className="mobile-capture-mode-hint" aria-live="polite">
            <span>{modeDestinations[mode]}</span>
            <p>{modeDescriptions[mode]}</p>
          </div>
          {!isComposerOpen && (
            <button
              type="button"
              className="mobile-capture-trigger"
              onClick={() => setIsComposerOpen(true)}
            >
              写一条{modeLabels[mode]}
            </button>
          )}
          {isComposerOpen && (
            <>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={`写一条${modeLabels[mode]}...`}
                className="mobile-textarea mobile-capture-textarea"
                rows={5}
              />
              <button
                type="button"
                className="mobile-primary-button mobile-capture-save"
                disabled={!canSaveCapture}
                onClick={saveCapture}
              >
                保存到记录流
              </button>
            </>
          )}
          {savedFlash && <div className="mobile-save-flash">{savedFlash}</div>}
        </div>
      </section>

      <section className="mobile-capture-history" aria-label="最近保存的记录">
        <div className="mobile-section-heading">
          <div>
            <span>记录流</span>
            <h2>最近保存</h2>
          </div>
          <span>{recentMobileCaptures.length}</span>
        </div>
        {recentMobileCaptures.length === 0 ? (
          <div className="mobile-empty-state">保存后会在这里看到最近记录。</div>
        ) : (
          recentMobileCaptures.map((item) => {
            const itemMode = getCaptureMode(item.tags);
            return (
              <article
                className={`mobile-capture-history-item${item.id === latestSavedId ? ' is-new' : ''}`}
                key={item.id}
              >
                <div className="mobile-capture-history-meta">
                  <span>{modeLabels[itemMode]} · {modeDestinations[itemMode]}</span>
                  <time dateTime={item.createdAt}>
                    {item.createdAt.slice(5, 16).replace('T', ' ')}
                  </time>
                </div>
                <p>{item.content}</p>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
};

export default MobileCaptureHub;

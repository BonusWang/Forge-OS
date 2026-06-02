import { useState, useEffect, useRef, type CSSProperties } from 'react';
import Dashboard from './pages/Dashboard';
import Reflection from './pages/Reflection';
import System from './pages/System';
import WeeklyReview from './pages/WeeklyReview';
import ModulePicker from './features/modules/ModulePicker';
import { useWeekCleanup } from './hooks/useWeekCleanup';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { useAppStore } from './store/useAppStore';
import { checkUpdate, APP_VERSION } from './utils/checkUpdate';
import { systemCopy } from './copy/system-copy';
import { aloCopy } from './copy/alo-copy';
import { resources } from './utils/assets';

type VisualStyle = 'classic' | 'orbit' | 'supabase';

const orbitStyleTokens = {
  '--bg-primary': '#faf7f2',
  '--bg-secondary': '#ffffff',
  '--bg-tertiary': '#f3eee7',
  '--text-primary': '#1a1816',
  '--text-secondary': '#6b6660',
  '--text-muted': '#8d867d',
  '--accent-gold': '#d86a47',
  '--accent-success': '#2e7d5b',
  '--accent-danger': '#c0473a',
  '--border-primary': '#eae5dd',
  '--border-hover': '#d86a47',
  '--font-display': '"Cormorant", Georgia, "Times New Roman", serif',
  '--font-sans': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  '--font-mono': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as CSSProperties;

const supabaseStyleTokens = {
  '--bg-primary': '#0f0f0f',
  '--bg-secondary': '#171717',
  '--bg-tertiary': '#202020',
  '--text-primary': '#fafafa',
  '--text-secondary': '#b7b7b7',
  '--text-muted': '#737373',
  '--accent-gold': '#3ecf8e',
  '--accent-success': '#3ecf8e',
  '--accent-danger': '#ff7b72',
  '--border-primary': '#2f2f2f',
  '--border-hover': '#3ecf8e',
  '--font-display': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  '--font-sans': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  '--font-mono': 'JetBrains Mono, "Source Code Pro", Consolas, monospace',
} as CSSProperties;

const lastWordsMessage =
  systemCopy.lastWords[Math.floor(Math.random() * systemCopy.lastWords.length)] ?? '';

function App() {
  const [page, setPage] = useState<'dashboard' | 'reflection' | 'weeklyReview' | 'system'>('dashboard');
  const [weeklyReviewWeekStart, setWeeklyReviewWeekStart] = useState('');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('classic');
  const [modulePickerOpen, setModulePickerOpen] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const config = useAppStore((s) => s.config);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const lastWordsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme = config.theme ?? 'dark';
    document.documentElement.dataset.theme = theme;
  }, [config.theme]);

  useWeekCleanup();
  useDocumentTitle();

  // Check for updates on mount
  useEffect(() => {
    let cancelled = false;
    const doCheck = async () => {
      const v = window.electronAPI?.getAppVersion?.() ?? APP_VERSION;
      const result = await checkUpdate(v);
      if (!cancelled && result.hasUpdate) {
        setHasUpdate(true);
      }
    };
    // Delay slightly so it doesn't block first paint
    const timer = setTimeout(doCheck, 3000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Last Words on quit
  useEffect(() => {
    if (!window.electronAPI?.onBeforeQuit) return;

    const handler = () => {
      const today = new Date().toISOString().split('T')[0];
      const reflections = useAppStore.getState().reflections;
      const hasReflection = reflections.some((r) => r.date === today);
      if (!hasReflection && lastWordsRef.current) {
        lastWordsRef.current.style.opacity = '1';
        lastWordsRef.current.style.transform = 'translateY(0)';
      }
    };

    window.electronAPI.onBeforeQuit(handler);
    // ipcRenderer.on returns nothing useful here; cleanup is optional
  }, []);

  const isOrbitStyle = visualStyle === 'orbit';
  const isSupabaseStyle = visualStyle === 'supabase';
  const activeStyleTokens =
    visualStyle === 'orbit'
      ? orbitStyleTokens
      : visualStyle === 'supabase'
        ? supabaseStyleTokens
        : {};
  const visualStyleLabel =
    visualStyle === 'orbit' ? 'Orbit' : visualStyle === 'supabase' ? 'Supabase' : '复古';
  const toggleVisualStyle = () => {
    setVisualStyle((style) => {
      if (style === 'classic') return 'orbit';
      if (style === 'orbit') return 'supabase';
      return 'classic';
    });
  };

  useEffect(() => {
    document.body.dataset.aloVisualStyle = visualStyle;
    return () => {
      delete document.body.dataset.aloVisualStyle;
    };
  }, [visualStyle]);

  return (
    <div
      className={`app-shell${isOrbitStyle ? ' orbit-style-shell' : ''}${isSupabaseStyle ? ' supabase-style-shell' : ''}`}
      data-visual-style={visualStyle}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: "var(--font-mono)",
        ...activeStyleTokens,
      }}
    >
      <div className="app-frame">
        <aside className="app-rail" aria-label="Forge-OS navigation">
          <div className="app-rail-brand font-display notranslate" translate="no">
            <img src={resources.logoPixel} alt="" className="app-brand-mark" />
            <span className="app-brand-text notranslate" translate="no">
              <span className="app-brand-name" lang="en" translate="no">
                Forge-OS
              </span>
              <span className="app-brand-slogan" translate="no">
                Forge yourself
              </span>
            </span>
          </div>

          <div className="app-rail-section" aria-label="页面">
            <button
              type="button"
              onClick={() => setPage('dashboard')}
              className="app-rail-button"
              aria-current={page === 'dashboard' ? 'page' : undefined}
              title={aloCopy.nav.dashboardHover}
            >
              <span className="app-rail-index">01</span>
              <span className="app-rail-label">周看板</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setWeeklyReviewWeekStart('');
                setPage('weeklyReview');
              }}
              className="app-rail-button"
              aria-current={page === 'weeklyReview' ? 'page' : undefined}
            >
              <span className="app-rail-index">02</span>
              <span className="app-rail-label">周复盘</span>
            </button>
            <button
              type="button"
              onClick={() => setPage('reflection')}
              className="app-rail-button"
              aria-current={page === 'reflection' ? 'page' : undefined}
              title={aloCopy.nav.reflectionHover}
            >
              <span className="app-rail-index">03</span>
              <span className="app-rail-label">反思库</span>
            </button>
            <button
              type="button"
              onClick={() => setPage('system')}
              className="app-rail-button"
              aria-current={page === 'system' ? 'page' : undefined}
              title={aloCopy.nav.systemHover}
            >
              <span className="app-rail-index">04</span>
              <span className="app-rail-label">系统</span>
              {hasUpdate && <span className="app-rail-badge">{systemCopy.nav.hasUpdateMarker}</span>}
            </button>
          </div>

          <div className="app-rail-section app-rail-section--tools" aria-label="工具">
            <button
              type="button"
              onClick={toggleVisualStyle}
              className="app-rail-button"
              aria-pressed={visualStyle !== 'classic'}
              title={`当前风格：${visualStyleLabel}。点击切换复古、Orbit、Supabase 风格`}
            >
              <span className="app-rail-index">
                {visualStyle === 'supabase' ? 'S' : visualStyle === 'orbit' ? 'O' : '◇'}
              </span>
              <span className="app-rail-label">风格</span>
            </button>
            <button
              type="button"
              onClick={() => setModulePickerOpen(true)}
              className="app-rail-button"
              title={aloCopy.nav.moduleHover}
            >
              <span className="app-rail-index">⊕</span>
              <span className="app-rail-label">模块</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="app-rail-button"
              title={aloCopy.nav.themeHover}
            >
              <span className="app-rail-index">{config.theme === 'dark' ? '◐' : '◑'}</span>
              <span className="app-rail-label">主题</span>
            </button>
          </div>
        </aside>

        <div className="app-content-frame">
          <ModulePicker isOpen={modulePickerOpen} onClose={() => setModulePickerOpen(false)} />

          <main className="app-main">
            {page === 'dashboard' && (
              <Dashboard />
            )}
            {page === 'reflection' && <Reflection />}
            {page === 'weeklyReview' && (
              <WeeklyReview
                key={weeklyReviewWeekStart || 'current-week'}
                initialWeekStart={weeklyReviewWeekStart}
              />
            )}
            {page === 'system' && <System />}
          </main>
        </div>
      </div>

      <style>{`
        body[data-alo-visual-style="orbit"] {
          background-color: #faf7f2;
        }

        body[data-alo-visual-style="supabase"] {
          background-color: #0f0f0f;
        }

        body[data-alo-visual-style="orbit"]::before {
          opacity: 0;
        }

        body[data-alo-visual-style="supabase"]::before {
          opacity: 0;
        }

        .orbit-style-shell {
          --bg-primary: #faf7f2;
          --bg-secondary: #ffffff;
          --bg-tertiary: #f3eee7;
          --text-primary: #1a1816;
          --text-secondary: #6b6660;
          --text-muted: #8d867d;
          --accent-gold: #d86a47;
          --accent-success: #2e7d5b;
          --accent-danger: #c0473a;
          --border-primary: #eae5dd;
          --border-hover: #d86a47;
          --font-display: "Cormorant", Georgia, "Times New Roman", serif;
          --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          --font-mono: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background-color: var(--bg-primary) !important;
          color: var(--text-primary) !important;
          font-variant-numeric: tabular-nums;
        }

        .supabase-style-shell {
          --bg-primary: #0f0f0f;
          --bg-secondary: #171717;
          --bg-tertiary: #202020;
          --text-primary: #fafafa;
          --text-secondary: #b7b7b7;
          --text-muted: #737373;
          --accent-gold: #3ecf8e;
          --accent-success: #3ecf8e;
          --accent-danger: #ff7b72;
          --border-primary: #2f2f2f;
          --border-hover: #3ecf8e;
          --font-display: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          --font-mono: "JetBrains Mono", "Source Code Pro", Consolas, monospace;
          background-color: var(--bg-primary) !important;
          color: var(--text-primary) !important;
          font-variant-numeric: tabular-nums;
        }

        .orbit-style-shell .app-main {
          background: transparent !important;
          padding: var(--space-4) var(--space-5) var(--space-7) !important;
        }

        .supabase-style-shell .app-main {
          background:
            radial-gradient(circle at 18% 0%, rgba(62, 207, 142, 0.08), transparent 32%),
            radial-gradient(circle at 82% 10%, rgba(62, 207, 142, 0.05), transparent 28%);
          padding: var(--space-4) var(--space-5) var(--space-7) !important;
        }

        .app-brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
          line-height: 1;
        }

        .app-brand-name {
          color: var(--text-primary);
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 0;
          line-height: 1;
          text-transform: none;
        }

        .app-brand-slogan {
          color: var(--text-secondary);
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0;
          line-height: 1.2;
          text-transform: none;
          white-space: nowrap;
        }

        .orbit-style-shell .app-rail {
          padding: 24px 16px !important;
          background-color: rgba(255, 255, 255, 0.82) !important;
          backdrop-filter: saturate(120%) blur(10px);
        }

        .supabase-style-shell .app-rail {
          padding: 24px 16px !important;
          background-color: rgba(10, 10, 10, 0.94) !important;
          border-right-color: var(--border-primary);
          backdrop-filter: saturate(120%) blur(14px);
        }

        .orbit-style-shell .app-rail-brand {
          color: var(--text-primary) !important;
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: none;
        }

        .supabase-style-shell .app-rail-brand {
          color: var(--text-primary) !important;
          font-family: var(--font-display);
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: none;
        }

        .orbit-style-shell .app-brand-name {
          font-family: var(--font-display);
          font-size: 28px;
        }

        .supabase-style-shell .app-brand-name {
          font-family: var(--font-display);
          font-size: 22px;
          letter-spacing: -0.01em;
        }

        .orbit-style-shell .app-brand-slogan {
          font-family: var(--font-sans);
          font-size: 12px;
        }

        .supabase-style-shell .app-brand-slogan {
          color: var(--text-muted);
          font-family: var(--font-sans);
          font-size: 12px;
        }

        .orbit-style-shell .app-rail-button {
          min-height: 34px;
          border: 1px solid transparent !important;
          border-radius: 8px;
          background: transparent !important;
          color: var(--text-secondary) !important;
          font-family: var(--font-sans) !important;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 1;
          padding: 8px 10px !important;
          text-transform: none;
        }

        .supabase-style-shell .app-rail-button {
          min-height: 36px;
          border: 1px solid transparent !important;
          border-radius: 8px;
          background: transparent !important;
          color: var(--text-secondary) !important;
          font-family: var(--font-sans) !important;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0;
          line-height: 1;
          padding: 8px 10px !important;
          text-transform: none;
        }

        .orbit-style-shell .app-rail-button:hover {
          border-color: var(--border-primary) !important;
          background: rgba(255, 255, 255, 0.62) !important;
          color: var(--text-primary) !important;
        }

        .supabase-style-shell .app-rail-button:hover {
          border-color: var(--border-primary) !important;
          background: rgba(62, 207, 142, 0.08) !important;
          color: var(--text-primary) !important;
        }

        .orbit-style-shell .app-rail-button[aria-current="page"],
        .orbit-style-shell .app-rail-button[aria-pressed="true"] {
          border-color: rgba(216, 106, 71, 0.28) !important;
          background: rgba(216, 106, 71, 0.08) !important;
          color: var(--accent-gold) !important;
        }

        .supabase-style-shell .app-rail-button[aria-current="page"],
        .supabase-style-shell .app-rail-button[aria-pressed="true"] {
          border-color: rgba(62, 207, 142, 0.26) !important;
          background: rgba(62, 207, 142, 0.1) !important;
          color: var(--accent-gold) !important;
          box-shadow: inset 0 0 0 1px rgba(62, 207, 142, 0.08);
        }

        .orbit-style-shell .font-display {
          font-family: var(--font-display);
          font-weight: 700;
          letter-spacing: 0;
          text-transform: none;
        }

        .orbit-style-shell .font-h1,
        .orbit-style-shell .font-h2,
        .orbit-style-shell .font-h3,
        .orbit-style-shell .font-body,
        .orbit-style-shell .font-caption {
          letter-spacing: 0;
          text-transform: none;
        }

        .supabase-style-shell .font-display,
        .supabase-style-shell .font-h1,
        .supabase-style-shell .font-h2,
        .supabase-style-shell .font-h3,
        .supabase-style-shell .font-body,
        .supabase-style-shell .font-caption {
          letter-spacing: 0;
          text-transform: none;
        }

        .supabase-style-shell .font-display,
        .supabase-style-shell .font-h1,
        .supabase-style-shell .font-h2,
        .supabase-style-shell .font-h3 {
          font-family: var(--font-display);
        }

        .orbit-style-shell .font-body {
          font-size: 14px;
        }

        .supabase-style-shell .font-body {
          font-family: var(--font-sans);
          font-size: 14px;
        }

        .orbit-style-shell .font-caption {
          font-size: 12px;
        }

        .supabase-style-shell .font-caption {
          color: var(--text-muted);
          font-size: 12px;
        }

        .orbit-style-shell .ascii-box {
          overflow: hidden;
          border-radius: 8px;
          border-color: var(--border-primary);
          background-color: var(--bg-secondary);
          box-shadow: none;
        }

        .supabase-style-shell .ascii-box {
          overflow: hidden;
          border-radius: 12px;
          border-color: var(--border-primary);
          background-color: rgba(23, 23, 23, 0.92);
          box-shadow: none;
        }

        .orbit-style-shell .ascii-box:hover {
          border-color: rgba(216, 106, 71, 0.5);
        }

        .supabase-style-shell .ascii-box:hover {
          border-color: color-mix(in srgb, var(--accent-gold) 48%, var(--border-primary));
        }

        .orbit-style-shell .ascii-box-title {
          border-bottom-color: var(--border-primary);
          background: rgba(250, 247, 242, 0.72);
          color: var(--accent-gold);
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: none;
          white-space: normal;
        }

        .supabase-style-shell .ascii-box-title {
          border-bottom-color: var(--border-primary);
          background: rgba(32, 32, 32, 0.72);
          color: var(--accent-gold);
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-transform: none;
          white-space: normal;
        }

        .orbit-style-shell .task-column {
          border: 1px solid var(--border-primary) !important;
          border-radius: 8px;
          background-color: var(--bg-secondary) !important;
          overflow: hidden;
        }

        .supabase-style-shell .task-column {
          border: 1px solid var(--border-primary) !important;
          border-radius: 12px;
          background-color: rgba(23, 23, 23, 0.92) !important;
          overflow: hidden;
        }

        .orbit-style-shell .task-column-header {
          background: rgba(250, 247, 242, 0.78) !important;
        }

        .supabase-style-shell .task-column-header {
          background: rgba(32, 32, 32, 0.88) !important;
          color: var(--accent-gold);
        }

        .orbit-style-shell .task-column-footer {
          background: rgba(250, 247, 242, 0.46);
        }

        .supabase-style-shell .task-column-footer {
          background: rgba(32, 32, 32, 0.52);
        }

        .orbit-style-shell .task-card {
          border-radius: 8px;
          background-color: #faf7f2 !important;
          border-color: var(--border-primary) !important;
        }

        .supabase-style-shell .task-card {
          border-radius: 8px;
          background-color: #202020 !important;
          border-color: var(--border-primary) !important;
        }

        .orbit-style-shell .task-card:hover {
          background-color: var(--bg-secondary) !important;
          border-color: rgba(216, 106, 71, 0.5) !important;
        }

        .supabase-style-shell .task-card:hover {
          background-color: #252525 !important;
          border-color: color-mix(in srgb, var(--accent-gold) 50%, var(--border-primary)) !important;
        }

        .orbit-style-shell .alo-empty-state-image {
          display: none !important;
        }

        .supabase-style-shell .alo-empty-state-image {
          display: none !important;
        }

        .orbit-style-shell button:focus-visible,
        .orbit-style-shell a:focus-visible,
        .orbit-style-shell input:focus-visible,
        .orbit-style-shell textarea:focus-visible,
        .orbit-style-shell select:focus-visible {
          outline: 2px solid rgba(216, 106, 71, 0.58);
          outline-offset: 3px;
        }

        .supabase-style-shell button:focus-visible,
        .supabase-style-shell a:focus-visible,
        .supabase-style-shell input:focus-visible,
        .supabase-style-shell textarea:focus-visible,
        .supabase-style-shell select:focus-visible {
          outline: 2px solid rgba(62, 207, 142, 0.72);
          outline-offset: 3px;
        }

        .orbit-style-shell .btn-invert:hover,
        .orbit-style-shell .btn-invert:focus-visible {
          border-color: var(--accent-gold) !important;
          background-color: rgba(216, 106, 71, 0.08) !important;
          color: var(--accent-gold) !important;
        }

        .supabase-style-shell .btn-invert:hover,
        .supabase-style-shell .btn-invert:focus-visible {
          border-color: var(--accent-gold) !important;
          background-color: rgba(62, 207, 142, 0.1) !important;
          color: var(--accent-gold) !important;
        }

        @media (max-width: 767px) {
          .orbit-style-shell .app-main {
            padding: 20px 14px 40px !important;
          }

          .supabase-style-shell .app-main {
            padding: 20px 14px 40px !important;
          }

          .orbit-style-shell .app-rail {
            height: auto !important;
            min-height: 60px;
            padding: 10px 12px !important;
            flex-wrap: wrap !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            gap: 10px;
          }

          .supabase-style-shell .app-rail {
            height: auto !important;
            min-height: 60px;
            padding: 10px 12px !important;
            flex-wrap: wrap !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            gap: 10px;
          }

          .orbit-style-shell .app-rail-brand {
            width: 100%;
            font-size: 22px;
          }

          .supabase-style-shell .app-rail-brand {
            width: 100%;
            font-size: 20px;
          }

          .app-brand-slogan {
            display: none;
          }

          .orbit-style-shell .app-rail-section {
            width: 100%;
            padding-bottom: 2px;
          }

          .supabase-style-shell .app-rail-section {
            width: 100%;
            padding-bottom: 2px;
          }

          .orbit-style-shell .reflection-grid,
          .orbit-style-shell .weekly-review-layout,
          .orbit-style-shell .system-layout {
            grid-template-columns: 1fr !important;
            flex-direction: column !important;
          }

          .supabase-style-shell .reflection-grid,
          .supabase-style-shell .weekly-review-layout,
          .supabase-style-shell .system-layout {
            grid-template-columns: 1fr !important;
            flex-direction: column !important;
          }

          .weekly-review-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Last Words Overlay */}
      <div
        ref={lastWordsRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'var(--space-3) var(--space-6)',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-primary)',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          textAlign: 'center',
          opacity: 0,
          transform: 'translateY(100%)',
          transition: 'opacity 300ms ease, transform 300ms ease',
          zIndex: 10000,
          pointerEvents: 'none',
        }}
      >
        {lastWordsMessage}
      </div>
    </div>
  );
}

export default App;

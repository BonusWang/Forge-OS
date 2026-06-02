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

const lastWordsMessage =
  systemCopy.lastWords[Math.floor(Math.random() * systemCopy.lastWords.length)] ?? '';

function App() {
  const [page, setPage] = useState<'dashboard' | 'reflection' | 'weeklyReview' | 'system'>('dashboard');
  const [weeklyReviewWeekStart, setWeeklyReviewWeekStart] = useState('');
  const [visualStyle, setVisualStyle] = useState<'classic' | 'orbit'>('classic');
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
  const toggleVisualStyle = () => {
    setVisualStyle((style) => (style === 'orbit' ? 'classic' : 'orbit'));
  };

  useEffect(() => {
    document.body.dataset.aloVisualStyle = visualStyle;
    return () => {
      delete document.body.dataset.aloVisualStyle;
    };
  }, [visualStyle]);

  return (
    <div
      className={`app-shell${isOrbitStyle ? ' orbit-style-shell' : ''}`}
      data-visual-style={visualStyle}
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: "var(--font-mono)",
        ...(isOrbitStyle ? orbitStyleTokens : {}),
      }}
    >
      {/* Navigation Bar */}
      <nav
        className="app-nav"
        style={{
          height: '48px',
          borderBottom: '1px solid var(--border-primary)',
          padding: '0 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-primary)',
        }}
      >
        <div
          className="font-display app-brand notranslate"
          translate="no"
          style={{
            color: 'var(--text-primary)',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            flexShrink: 0,
          }}
        >
          <img
            src={resources.logoPixel}
            alt=""
            style={{
              height: '28px',
              width: 'auto',
              imageRendering: 'pixelated',
              opacity: 0.9,
            }}
          />
          <span className="app-brand-text notranslate" translate="no">
            <span className="app-brand-name" lang="en" translate="no">
              Forge-OS
            </span>
            <span className="app-brand-slogan" translate="no">
              Forge yourself —— 自己锻造自己
            </span>
          </span>
        </div>
        <div
          className="app-nav-actions"
          style={{
            display: 'flex',
            gap: 'var(--space-3)',
            minWidth: 0,
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          <button
            onClick={() => setPage('dashboard')}
            className="font-h2 app-nav-button"
            aria-current={page === 'dashboard' ? 'page' : undefined}
            title={aloCopy.nav.dashboardHover}
            style={{
              background: 'none',
              border: 'none',
              color: page === 'dashboard' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              if (page !== 'dashboard') {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                page === 'dashboard' ? 'var(--accent-gold)' : 'var(--text-secondary)';
            }}
          >
            {page === 'dashboard' ? '[周看板]' : ' 周看板 '}
          </button>
          <button
            onClick={() => setPage('reflection')}
            className="font-h2 app-nav-button"
            aria-current={page === 'reflection' ? 'page' : undefined}
            title={aloCopy.nav.reflectionHover}
            style={{
              background: 'none',
              border: 'none',
              color: page === 'reflection' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              if (page !== 'reflection') {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                page === 'reflection' ? 'var(--accent-gold)' : 'var(--text-secondary)';
            }}
          >
            {page === 'reflection' ? '[反思库]' : ' 反思库 '}
          </button>
          <button
            onClick={() => {
              setWeeklyReviewWeekStart('');
              setPage('weeklyReview');
            }}
            className="font-h2 app-nav-button"
            aria-current={page === 'weeklyReview' ? 'page' : undefined}
            style={{
              background: 'none',
              border: 'none',
              color: page === 'weeklyReview' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              if (page !== 'weeklyReview') {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                page === 'weeklyReview' ? 'var(--accent-gold)' : 'var(--text-secondary)';
            }}
          >
            {page === 'weeklyReview' ? '[周复盘]' : ' 周复盘 '}
          </button>
          <button
            onClick={() => setPage('system')}
            className="font-h2 app-nav-button"
            aria-current={page === 'system' ? 'page' : undefined}
            style={{
              background: 'none',
              border: 'none',
              color: page === 'system' ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              if (page !== 'system') {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                page === 'system' ? 'var(--accent-gold)' : 'var(--text-secondary)';
            }}
            title={aloCopy.nav.systemHover}
          >
            {page === 'system' ? '[◇ 系统]' : ' ◇ 系统 '}
            {hasUpdate && (
              <span style={{ color: 'var(--accent-danger)', marginLeft: 4 }}>
                {systemCopy.nav.hasUpdateMarker}
              </span>
            )}
          </button>
          <button
            onClick={toggleVisualStyle}
            className="font-h2 app-nav-button"
            aria-pressed={isOrbitStyle}
            style={{
              background: 'none',
              border: 'none',
              color: isOrbitStyle ? 'var(--accent-gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              if (!isOrbitStyle) {
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = isOrbitStyle
                ? 'var(--accent-gold)'
                : 'var(--text-secondary)';
            }}
            title="切换原风格与 orbit-general 参考风格"
          >
            [◇ 风格切换]
          </button>
          <button
            onClick={() => setModulePickerOpen(true)}
            className="font-h2 app-nav-button"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            title={aloCopy.nav.moduleHover}
          >
            [⊕ 模块]
          </button>

          <button
            onClick={toggleTheme}
            className="font-h2 app-nav-button"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              padding: 'var(--space-1) var(--space-2)',
              transition: `color var(--duration-instant) var(--ease-instant)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            title={aloCopy.nav.themeHover}
          >
            {config.theme === 'dark' ? '[◐]' : '[◑]'}
          </button>
        </div>
      </nav>

      <ModulePicker isOpen={modulePickerOpen} onClose={() => setModulePickerOpen(false)} />

      {/* Page Content */}
      <main className="app-main" style={{ padding: 'var(--space-6)' }}>
        {page === 'dashboard' && (
          <Dashboard
            onOpenWeeklyReview={(weekStart) => {
              setWeeklyReviewWeekStart(weekStart);
              setPage('weeklyReview');
            }}
          />
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

      <style>{`
        body[data-alo-visual-style="orbit"] {
          background-color: #faf7f2;
        }

        body[data-alo-visual-style="orbit"]::before {
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

        .orbit-style-shell main {
          background: transparent !important;
          padding: 32px 32px 56px !important;
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

        .orbit-style-shell .app-nav {
          height: 64px !important;
          padding: 0 32px !important;
          background-color: rgba(250, 247, 242, 0.92) !important;
          backdrop-filter: saturate(120%) blur(10px);
        }

        .orbit-style-shell .app-brand {
          color: var(--text-primary) !important;
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: none;
        }

        .orbit-style-shell .app-brand-name {
          font-family: var(--font-display);
          font-size: 28px;
        }

        .orbit-style-shell .app-brand-slogan {
          font-family: var(--font-sans);
          font-size: 12px;
        }

        .orbit-style-shell nav button {
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

        .orbit-style-shell nav button:hover {
          border-color: var(--border-primary) !important;
          background: rgba(255, 255, 255, 0.62) !important;
          color: var(--text-primary) !important;
        }

        .orbit-style-shell nav button[aria-current="page"],
        .orbit-style-shell nav button[aria-pressed="true"] {
          border-color: var(--border-primary) !important;
          background: var(--bg-secondary) !important;
          color: var(--accent-gold) !important;
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

        .orbit-style-shell .font-body {
          font-size: 14px;
        }

        .orbit-style-shell .font-caption {
          font-size: 12px;
        }

        .orbit-style-shell .ascii-box {
          overflow: hidden;
          border-radius: 8px;
          border-color: var(--border-primary);
          background-color: var(--bg-secondary);
          box-shadow: none;
        }

        .orbit-style-shell .ascii-box:hover {
          border-color: rgba(216, 106, 71, 0.5);
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

        .orbit-style-shell .task-column {
          border: 1px solid var(--border-primary) !important;
          border-radius: 8px;
          background-color: var(--bg-secondary) !important;
          overflow: hidden;
        }

        .orbit-style-shell .task-column-header {
          background: rgba(250, 247, 242, 0.78) !important;
        }

        .orbit-style-shell .task-column-footer {
          background: rgba(250, 247, 242, 0.46);
        }

        .orbit-style-shell .task-card {
          border-radius: 8px;
          background-color: #faf7f2 !important;
          border-color: var(--border-primary) !important;
        }

        .orbit-style-shell .task-card:hover {
          background-color: var(--bg-secondary) !important;
          border-color: rgba(216, 106, 71, 0.5) !important;
        }

        .orbit-style-shell .alo-empty-state-image {
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

        .orbit-style-shell .btn-invert:hover,
        .orbit-style-shell .btn-invert:focus-visible {
          border-color: var(--accent-gold) !important;
          background-color: rgba(216, 106, 71, 0.08) !important;
          color: var(--accent-gold) !important;
        }

        @media (max-width: 767px) {
          .orbit-style-shell main {
            padding: 20px 14px 40px !important;
          }

          .orbit-style-shell .app-nav {
            height: auto !important;
            min-height: 60px;
            padding: 10px 12px !important;
            flex-wrap: wrap !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            gap: 10px;
          }

          .orbit-style-shell .app-brand {
            width: 100%;
            font-size: 22px;
          }

          .app-brand-slogan {
            display: none;
          }

          .orbit-style-shell .app-nav > div:last-child {
            width: 100%;
            padding-bottom: 2px;
          }

          .orbit-style-shell .reflection-grid,
          .orbit-style-shell .weekly-review-layout,
          .orbit-style-shell .system-layout {
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

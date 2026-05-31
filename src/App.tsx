import { useState, useEffect, useRef } from 'react';
import Dashboard from './pages/Dashboard';
import Reflection from './pages/Reflection';
import System from './pages/System';
import ModulePicker from './features/modules/ModulePicker';
import { useWeekCleanup } from './hooks/useWeekCleanup';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { useAppStore } from './store/useAppStore';
import { checkUpdate, APP_VERSION } from './utils/checkUpdate';
import { systemCopy } from './copy/system-copy';
import { aloCopy } from './copy/alo-copy';

function App() {
  const [page, setPage] = useState<'dashboard' | 'reflection' | 'system'>('dashboard');
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

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: "var(--font-mono)",
      }}
    >
      {/* Navigation Bar */}
      <nav
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
          className="font-display"
          style={{
            color: 'var(--text-primary)',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <img
            src="app://resources/alo-logo-pixel.png"
            alt=""
            style={{
              height: '28px',
              width: 'auto',
              imageRendering: 'pixelated',
              opacity: 0.9,
            }}
          />
          ASCII LIFE OS
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button
            onClick={() => setPage('dashboard')}
            className="font-h2"
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
            className="font-h2"
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
            onClick={() => setPage('system')}
            className="font-h2"
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
            onClick={() => setModulePickerOpen(true)}
            className="font-h2"
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
            className="font-h2"
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
      <main style={{ padding: 'var(--space-6)' }}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'reflection' && <Reflection />}
        {page === 'system' && <System />}
      </main>

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
        {systemCopy.lastWords[Math.floor(Math.random() * systemCopy.lastWords.length)]}
      </div>
    </div>
  );
}

export default App;

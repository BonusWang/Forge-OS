import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Reflection from './pages/Reflection';
import { useWeekCleanup } from './hooks/useWeekCleanup';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { useAppStore } from './store/useAppStore';

function App() {
  const [page, setPage] = useState<'dashboard' | 'reflection'>('dashboard');
  const config = useAppStore((s) => s.config);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  useEffect(() => {
    const theme = config.theme ?? 'dark';
    document.documentElement.dataset.theme = theme;
  }, [config.theme]);

  useWeekCleanup();
  useDocumentTitle();

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
            title={config.theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          >
            {config.theme === 'dark' ? '[◐]' : '[◑]'}
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{ padding: 'var(--space-6)' }}>
        {page === 'dashboard' ? <Dashboard /> : <Reflection />}
      </main>
    </div>
  );
}

export default App;

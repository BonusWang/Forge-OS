import React, { useState } from 'react';
import MobileCaptureHub from './MobileCaptureHub';
import MobileTodayForge from './MobileTodayForge';
import MobileWeekProgress from './MobileWeekProgress';
import SyncPanel from '../system/SyncPanel';

type MobileSection = 'today' | 'progress' | 'capture' | 'system';

interface MobileAppShellProps {
  onOpenModulePicker: () => void;
  onToggleTheme: () => void;
  onToggleVisualStyle: () => void;
  theme: 'dark' | 'light';
  visualStyleLabel: string;
  hasUpdate: boolean;
}

const navItems: Array<{ id: MobileSection; label: string; index: string }> = [
  { id: 'today', label: '今日', index: '01' },
  { id: 'progress', label: '推进', index: '02' },
  { id: 'capture', label: '记录', index: '03' },
  { id: 'system', label: '系统', index: '04' },
];

const MobileAppShell: React.FC<MobileAppShellProps> = ({
  onOpenModulePicker,
  onToggleTheme,
  onToggleVisualStyle,
  theme,
  visualStyleLabel,
  hasUpdate,
}) => {
  const [activeSection, setActiveSection] = useState<MobileSection>('today');
  const [isSystemToolsOpen, setIsSystemToolsOpen] = useState(false);

  const renderSection = () => {
    if (activeSection === 'today') return <MobileTodayForge />;
    if (activeSection === 'progress') return <MobileWeekProgress />;
    if (activeSection === 'capture') return <MobileCaptureHub />;

    return (
      <section className="mobile-system-panel" aria-label="移动端系统入口">
        <div className="mobile-system-status">
          <div className="mobile-card-label">我的系统</div>
          <h1>桌面内容，移动承载</h1>
          <p>设置、模块和完整复盘仍使用同一套 Forge-OS 数据。</p>
        </div>
        <div className="mobile-system-rows">
          <button type="button" className="mobile-system-row" onClick={onOpenModulePicker}>
            <span>模块</span>
            <strong>模块管理</strong>
            <small>调整移动端可见入口</small>
          </button>
          <button type="button" className="mobile-system-row" onClick={onToggleTheme}>
            <span>主题</span>
            <strong>{theme === 'dark' ? '切到浅色' : '切到深色'}</strong>
            <small>当前 {theme === 'dark' ? '深色' : '浅色'}</small>
          </button>
          <button type="button" className="mobile-system-row" onClick={onToggleVisualStyle}>
            <span>风格</span>
            <strong>{visualStyleLabel}</strong>
            <small>同步桌面视觉模式</small>
          </button>
          <button
            type="button"
            className="mobile-system-row"
            aria-controls="mobile-system-tools"
            aria-expanded={isSystemToolsOpen}
            onClick={() => setIsSystemToolsOpen((open) => !open)}
          >
            <span>完整</span>
            <strong>{isSystemToolsOpen ? '收起系统页' : '打开系统页'}</strong>
            <small>{hasUpdate ? '发现新版本，含 COS 同步' : 'COS 数据同步'}</small>
          </button>
        </div>
        {isSystemToolsOpen && (
          <div id="mobile-system-tools" className="mobile-system-tools">
            <SyncPanel />
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="mobile-app-shell" aria-label="Forge-OS mobile">
      <main className="mobile-content">
        {renderSection()}
      </main>

      <nav className="mobile-bottom-nav" aria-label="移动端主导航">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="mobile-nav-button"
            aria-current={activeSection === item.id ? 'page' : undefined}
            onClick={() => setActiveSection(item.id)}
          >
            <span>{item.index}</span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MobileAppShell;

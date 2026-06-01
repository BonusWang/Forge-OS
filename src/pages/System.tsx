import React from 'react';
import AsciiBox from '../components/AsciiBox';
import OrbitPageHeader from '../components/OrbitPageHeader';
import UpdatePanel from '../features/system/UpdatePanel';
import DataBackupRitual from '../features/system/DataBackupRitual';
import MonkQuote from '../features/system/MonkQuote';
import { useAppStore } from '../store/useAppStore';
import { systemCopy } from '../copy/system-copy';

interface SystemProps {
  visualStyle?: 'classic' | 'orbit';
}

const System: React.FC<SystemProps> = ({ visualStyle = 'classic' }) => {
  const config = useAppStore((s) => s.config);
  const enabledModules = useAppStore((s) => s.enabledModules);
  const reflections = useAppStore((s) => s.reflections);
  const tasks = useAppStore((s) => s.tasks);
  const isOrbitStyle = visualStyle === 'orbit';

  return (
    <div className={isOrbitStyle ? 'orbit-page system-page' : ''}>
      {isOrbitStyle && (
        <OrbitPageHeader
          eyebrow="System layer"
          title="系统控制台"
          kpis={[
            {
              label: '当前主题',
              value: config.theme === 'dark' ? '暗色' : '亮色',
              detail: '主题按钮仍使用原逻辑',
              tone: 'orange',
            },
            {
              label: '启用模块',
              value: enabledModules.length,
              detail: '模块选择器共用原状态',
              tone: 'green',
            },
            {
              label: '任务数据',
              value: tasks.length,
              detail: '备份导出包含同源数据',
              tone: 'yellow',
            },
            {
              label: '反思数据',
              value: reflections.length,
              detail: '与反思库保持一致',
              tone: 'muted',
            },
          ]}
        />
      )}

      <div
        className="system-layout"
        style={{
          display: 'flex',
          gap: 'var(--space-6)',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Update & Backup */}
        <div style={{ flex: '1 1 50%', minWidth: 0 }}>
          <UpdatePanel />
          <DataBackupRitual />
        </div>

        {/* Right Column: About & Quote */}
        <div style={{ flex: '1 1 50%', minWidth: 0 }}>
          <AsciiBox title={systemCopy.about.title}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              <div className="font-h2" style={{ color: 'var(--accent-gold)' }}>
                {systemCopy.about.appName}
              </div>
              <div className="font-body" style={{ color: 'var(--text-secondary)' }}>
                {systemCopy.about.description}
              </div>
              <div className="font-caption" style={{ color: 'var(--text-muted)' }}>
                {systemCopy.about.author} · {systemCopy.about.license}
              </div>
            </div>
          </AsciiBox>

          <MonkQuote />
        </div>
      </div>
    </div>
  );
};

export default System;

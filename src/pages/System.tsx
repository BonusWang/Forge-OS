import React from 'react';
import AsciiBox from '../components/AsciiBox';
import UpdatePanel from '../features/system/UpdatePanel';
import DataBackupPanel from '../features/system/DataBackupPanel';
import MonkQuote from '../features/system/MonkQuote';
import { systemCopy } from '../copy/system-copy';

const System: React.FC = () => {
  return (
    <div className="workspace-page system-page">
      <section className="system-layout workspace-grid workspace-grid--system">
        <UpdatePanel />

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

        <DataBackupPanel />

        <MonkQuote />
      </section>
    </div>
  );
};

export default System;

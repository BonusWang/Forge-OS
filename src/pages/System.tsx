import React from 'react';
import AsciiBox from '../components/AsciiBox';
import UpdatePanel from '../features/system/UpdatePanel';
import DataBackupRitual from '../features/system/DataBackupRitual';
import MonkQuote from '../features/system/MonkQuote';
import { systemCopy } from '../copy/system-copy';

const System: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-6)',
        maxWidth: '1200px',
        margin: '0 auto',
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
  );
};

export default System;

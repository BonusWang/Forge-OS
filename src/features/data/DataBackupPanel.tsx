import React, { useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AsciiBox from '../../components/AsciiBox';
import { aloCopy } from '../../copy/alo-copy';

const DataBackupPanel: React.FC = () => {
  const store = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');

  const handleExport = () => {
    const data = {
      tasks: store.tasks,
      calendarEvents: store.calendarEvents,
      principles: store.principles,
      abilities: store.abilities,
      reflections: store.reflections,
      entertainments: store.entertainments,
      objectives: store.objectives,
      inboxItems: store.inboxItems,
      config: store.config,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setImportStatus('导出成功');
    setTimeout(() => setImportStatus(''), 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const requiredKeys = ['tasks', 'principles', 'abilities', 'reflections', 'entertainments', 'calendarEvents', 'config'];
        const missing = requiredKeys.filter((k) => !(k in json));
        if (missing.length > 0) {
          setImportStatus(aloCopy.errors.importFailed);
          return;
        }

        useAppStore.setState({
          tasks: json.tasks,
          principles: json.principles,
          abilities: json.abilities,
          reflections: json.reflections,
          entertainments: json.entertainments,
          objectives: json.objectives ?? [],
          inboxItems: json.inboxItems ?? [],
          config: json.config,
        });

        setImportStatus('导入成功，即将刷新...');
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch {
        setImportStatus(aloCopy.errors.importFailed);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AsciiBox title="数据备份">
      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
        <button
          onClick={handleExport}
          className="font-caption"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            padding: 'var(--space-1) var(--space-2)',
            transition: `background-color var(--duration-instant) var(--ease-instant), color var(--duration-instant) var(--ease-instant)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--bg-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          [  导出数据  ]
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="font-caption"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            padding: 'var(--space-1) var(--space-2)',
            transition: `background-color var(--duration-instant) var(--ease-instant), color var(--duration-instant) var(--ease-instant)`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--bg-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          [  导入数据  ]
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </div>
      {importStatus && (
        <div className="font-caption" style={{ marginTop: 'var(--space-2)', color: 'var(--text-secondary)' }}>
          {importStatus}
        </div>
      )}
    </AsciiBox>
  );
};

export default DataBackupPanel;

import React, { useRef, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import AsciiBox from '../../components/AsciiBox';
import { systemCopy } from '../../copy/system-copy';

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
      enabledModules: store.enabledModules,
      habits: store.habits,
      moods: store.moods,
      timeBlocks: store.timeBlocks,
      inspirations: store.inspirations,
      reflectionTemplates: store.reflectionTemplates,
      __version: store.__version ?? '0.1.1',
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
    setImportStatus(systemCopy.backup.exportSuccess);
    setTimeout(() => setImportStatus(''), 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const requiredKeys = [
          'tasks',
          'principles',
          'abilities',
          'reflections',
          'entertainments',
          'calendarEvents',
          'config',
        ];
        const missing = requiredKeys.filter((k) => !(k in json));
        if (missing.length > 0) {
          setImportStatus(systemCopy.backup.importFailed);
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
          enabledModules: json.enabledModules ?? [],
          habits: json.habits ?? [],
          moods: json.moods ?? [],
          timeBlocks: json.timeBlocks ?? [],
          inspirations: json.inspirations ?? [],
          reflectionTemplates: json.reflectionTemplates ?? [],
          __version: json.__version ?? '0.1.1',
        });

        setImportStatus(systemCopy.backup.importSuccess);
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch {
        setImportStatus(systemCopy.backup.importFailed);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AsciiBox title={systemCopy.backup.title}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
        }}
      >
        <div className="font-caption" style={{ color: 'var(--text-muted)' }}>
          {systemCopy.backup.sepiaHint}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <button
            onClick={handleExport}
            className="font-caption btn-invert"
            style={{
              background: 'none',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              padding: 'var(--space-1) var(--space-3)',
            }}
          >
            [ {systemCopy.backup.exportButton} ]
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="font-caption btn-invert"
            style={{
              background: 'none',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              padding: 'var(--space-1) var(--space-3)',
            }}
          >
            [ {systemCopy.backup.importButton} ]
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
          <div
            className="font-caption"
            style={{ marginTop: 'var(--space-1)', color: 'var(--text-secondary)' }}
          >
            {importStatus}
          </div>
        )}
      </div>
    </AsciiBox>
  );
};

export default DataBackupPanel;

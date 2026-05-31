import React from 'react';
import TaskBoard from '../features/tasks/TaskBoard';
import TodayProgress from '../features/tasks/TodayProgress';
import EntertainmentPanel from '../features/entertainment/EntertainmentPanel';
import PrinciplesPanel from '../features/principles/PrinciplesPanel';
import HabitTrackerPanel from '../features/habits/HabitTrackerPanel';
import MoodTrackerPanel from '../features/mood/MoodTrackerPanel';
import TimeBlockPanel from '../features/timeblocks/TimeBlockPanel';
import InspirationVaultPanel from '../features/inspiration/InspirationVaultPanel';
import ReflectionQuickEntry from '../features/reflections/ReflectionQuickEntry';
import DataBackupPanel from '../features/data/DataBackupPanel';
import MiniCalendar from '../components/MiniCalendar';
import AsciiBox from '../components/AsciiBox';
import { useAppStore } from '../store/useAppStore';
import { useSarcasticMonologue } from '../hooks/useSarcasticMonologue';

const Dashboard: React.FC = () => {
  const enabledModules = useAppStore((s) => s.enabledModules);
  const isEnabled = (id: string) => enabledModules.includes(id as any);
  const { text: monologue } = useSarcasticMonologue();

  return (
    <div>
      {/* Sarcastic Monologue Banner */}
      {monologue && (
        <div
          className="font-caption"
          style={{
            textAlign: 'center',
            padding: 'var(--space-2) var(--space-4)',
            marginBottom: 'var(--space-4)',
            color: 'var(--text-muted)',
            borderBottom: '1px dashed var(--border-primary)',
            fontStyle: 'italic',
          }}
        >
          {monologue}
        </div>
      )}

      {/* Task Board: 7 days + Backlog */}
      <TaskBoard />

      {/* Golden Ratio Layout: 61.8% / 38.2% */}
      <div
        className="dashboard-layout"
        style={{
          display: 'flex',
          gap: 'var(--space-8)',
          maxWidth: '1400px',
        }}
      >
        {/* Main Content Area ~61.8% */}
        <div className="main-area" style={{ flex: '1 1 61.8%' }}>
          <AsciiBox title="DAILY PROGRESS">
            <TodayProgress />
          </AsciiBox>

          <AsciiBox title="DAILY REFLECTION">
            <ReflectionQuickEntry />
          </AsciiBox>

          <DataBackupPanel />

          {/* Optional modules in main zone */}
          {isEnabled('timeBlocks') && <TimeBlockPanel />}
        </div>

        {/* Auxiliary Panel ~38.2% */}
        <div className="side-panel" style={{ flex: '1 1 38.2%' }}>
          {isEnabled('principles') && (
            <div style={{ marginTop: 'var(--space-7)' }}>
              <PrinciplesPanel />
            </div>
          )}

          {isEnabled('calendar') && (
            <AsciiBox title="CALENDAR">
              <MiniCalendar />
            </AsciiBox>
          )}

          {isEnabled('entertainment') && <EntertainmentPanel />}

          {/* Optional modules in side zone */}
          {isEnabled('habits') && <HabitTrackerPanel />}

          {isEnabled('mood') && <MoodTrackerPanel />}

          {isEnabled('inspiration') && <InspirationVaultPanel />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

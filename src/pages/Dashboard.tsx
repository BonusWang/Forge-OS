import React from 'react';
import TaskBoard from '../features/tasks/TaskBoard';
import TodayProgress from '../features/tasks/TodayProgress';
import EntertainmentPanel from '../features/entertainment/EntertainmentPanel';
import PrinciplesPanel from '../features/principles/PrinciplesPanel';
import ReflectionQuickEntry from '../features/reflections/ReflectionQuickEntry';
import DataBackupPanel from '../features/data/DataBackupPanel';
import MiniCalendar from '../components/MiniCalendar';
import AsciiBox from '../components/AsciiBox';

const Dashboard: React.FC = () => {
  return (
    <div>
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
        </div>

        {/* Auxiliary Panel ~38.2% */}
        <div className="side-panel" style={{ flex: '1 1 38.2%' }}>
          <div style={{ marginTop: 'var(--space-7)' }}>
            <PrinciplesPanel />
          </div>

          <AsciiBox title="CALENDAR">
            <MiniCalendar />
          </AsciiBox>

          <EntertainmentPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

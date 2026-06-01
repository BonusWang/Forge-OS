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
import OrbitPageHeader from '../components/OrbitPageHeader';
import { useAppStore } from '../store/useAppStore';
import { useSarcasticMonologue } from '../hooks/useSarcasticMonologue';
import type { ModuleId } from '../types';

interface DashboardProps {
  visualStyle?: 'classic' | 'orbit';
  onOpenWeeklyReview?: (weekStart: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ visualStyle = 'classic', onOpenWeeklyReview }) => {
  const enabledModules = useAppStore((s) => s.enabledModules);
  const inboxItems = useAppStore((s) => s.inboxItems);
  const objectives = useAppStore((s) => s.objectives);
  const reflections = useAppStore((s) => s.reflections);
  const tasks = useAppStore((s) => s.tasks);
  const isEnabled = (id: ModuleId) => enabledModules.includes(id);
  const { text: monologue } = useSarcasticMonologue();
  const isOrbitStyle = visualStyle === 'orbit';
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((task) => task.date === today);
  const completedToday = todayTasks.filter((task) => task.status === 'completed').length;
  const activeTaskCount = tasks.filter((task) => task.status === 'active' && task.date !== 'BACKLOG').length;

  return (
    <div className={isOrbitStyle ? 'orbit-page dashboard-page' : ''}>
      {isOrbitStyle && (
        <OrbitPageHeader
          eyebrow="Life operations"
          title="本周工作台"
          kpis={[
            {
              label: '今日完成',
              value: `${completedToday}/${todayTasks.length}`,
              detail: todayTasks.length > 0 ? '来自今日任务列' : '今天还没有任务',
              tone: completedToday === todayTasks.length && todayTasks.length > 0 ? 'green' : 'orange',
            },
            {
              label: '进行中任务',
              value: activeTaskCount,
              detail: '不含收纳箱',
              tone: 'yellow',
            },
            {
              label: '反思记录',
              value: reflections.length,
              detail: '复用反思库数据',
              tone: 'green',
            },
            {
              label: '收纳箱',
              value: inboxItems.length + objectives.length,
              detail: `${enabledModules.length} 个模块启用`,
              tone: 'muted',
            },
          ]}
        />
      )}

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
      <div className={isOrbitStyle ? 'orbit-board-section' : ''}>
        <TaskBoard onOpenWeeklyReview={onOpenWeeklyReview} />
      </div>

      {/* Golden Ratio Layout: 61.8% / 38.2% */}
      <div
        className="dashboard-layout orbit-dashboard-layout"
        style={{
          display: 'flex',
          gap: 'var(--space-8)',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          alignItems: 'flex-start',
        }}
      >
        {/* Main Content Area ~61.8% */}
        <div className="main-area" style={{ flex: '1 1 61.8%', minWidth: 0 }}>
          <AsciiBox title="今日进度">
            <TodayProgress />
          </AsciiBox>

          <AsciiBox title="每日反思">
            <ReflectionQuickEntry />
          </AsciiBox>

          <DataBackupPanel />

          {/* Optional modules in main zone */}
          {isEnabled('timeBlocks') && <TimeBlockPanel />}
        </div>

        {/* Auxiliary Panel ~38.2% */}
        <div className="side-panel" style={{ flex: '1 1 38.2%', minWidth: 0 }}>
          {isEnabled('principles') && (
            <div style={{ marginTop: 'var(--space-7)' }}>
              <PrinciplesPanel />
            </div>
          )}

          {isEnabled('calendar') && (
            <AsciiBox title="日历">
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

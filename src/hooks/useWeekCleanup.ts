import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getTodayString, getWeekStart, isSameWeek } from '../utils/date';
import { format, subDays } from 'date-fns';

export const useWeekCleanup = () => {
  const { config, archiveWeekTasks, migrateUnfinishedTasks, updateConfig } = useAppStore();

  useEffect(() => {
    const today = getTodayString();
    const todayWeekStart = getWeekStart();

    // First time visit or same day - no action needed beyond updating lastVisit
    if (config.lastVisitDate === today) return;

    // Check if week changed
    if (!isSameWeek(config.currentWeekStart, todayWeekStart)) {
      // New week: archive completed, move active to backlog
      archiveWeekTasks(config.currentWeekStart);
      updateConfig({ currentWeekStart: todayWeekStart, lastVisitDate: today });
      return;
    }

    // Same week, different day: migrate yesterday's unfinished tasks to today
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    migrateUnfinishedTasks(yesterday, today);

    updateConfig({ lastVisitDate: today });
  }, []);
};

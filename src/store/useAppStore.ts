import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';
import { createTaskSlice, type TaskSlice } from './slices/taskSlice';
import { createPrincipleSlice, type PrincipleSlice } from './slices/principleSlice';
import { createAbilitySlice, type AbilitySlice } from './slices/abilitySlice';
import { createReflectionSlice, type ReflectionSlice } from './slices/reflectionSlice';
import { createEntertainmentSlice, type EntertainmentSlice } from './slices/entertainmentSlice';
import { createConfigSlice, type ConfigSlice } from './slices/configSlice';
import { createCalendarSlice, type CalendarSlice } from './slices/calendarSlice';
import { createOKRSlice, type OKRSlice } from './slices/okrSlice';
import { createModuleSlice, type ModuleSlice } from './slices/moduleSlice';
import { createHabitSlice, type HabitSlice } from './slices/habitSlice';
import { createMoodSlice, type MoodSlice } from './slices/moodSlice';
import { createTimeBlockSlice, type TimeBlockSlice } from './slices/timeBlockSlice';
import { createInspirationSlice, type InspirationSlice } from './slices/inspirationSlice';
import { createReflectionTemplateSlice, type ReflectionTemplateSlice } from './slices/reflectionTemplateSlice';
import { createSyncSlice, type SyncSlice } from './slices/syncSlice';
import { migrateAllReflections } from '../utils/migrateReflectionData';
import { migrateAppData, CURRENT_APP_VERSION } from '../utils/migrateAppData';
import { platformStorage } from '../utils/platformStorage';
import type { AppState } from '../types';

export type AppStore = TaskSlice &
  CalendarSlice &
  PrincipleSlice &
  AbilitySlice &
  ReflectionSlice &
  EntertainmentSlice &
  ConfigSlice &
  OKRSlice &
  ModuleSlice &
  HabitSlice &
  MoodSlice &
  TimeBlockSlice &
  InspirationSlice &
  ReflectionTemplateSlice &
  SyncSlice & {
    __version: string;
  };

export const useAppStore = create<AppStore>()(
  persist<AppStore, [], [], AppState>(
    (...args) => ({
      ...createTaskSlice(...args),
      ...createCalendarSlice(...args),
      ...createPrincipleSlice(...args),
      ...createAbilitySlice(...args),
      ...createReflectionSlice(...args),
      ...createEntertainmentSlice(...args),
      ...createConfigSlice(...args),
      ...createOKRSlice(...args),
      ...createModuleSlice(...args),
      ...createHabitSlice(...args),
      ...createMoodSlice(...args),
      ...createTimeBlockSlice(...args),
      ...createInspirationSlice(...args),
      ...createReflectionTemplateSlice(...args),
      ...createSyncSlice(...args),
      __version: CURRENT_APP_VERSION,
    }),
    {
      name: 'alo-storage',
      storage: platformStorage as PersistStorage<AppState>,
      partialize: (state) => ({
        tasks: state.tasks,
        calendarEvents: state.calendarEvents,
        principles: state.principles,
        abilities: state.abilities,
        reflections: state.reflections,
        entertainments: state.entertainments,
        objectives: state.objectives,
        inboxItems: state.inboxItems,
        config: state.config,
        enabledModules: state.enabledModules,
        habits: state.habits,
        moods: state.moods,
        timeBlocks: state.timeBlocks,
        inspirations: state.inspirations,
        reflectionTemplates: state.reflectionTemplates,
        syncConfig: state.syncConfig,
        syncStatus: state.syncStatus,
        __version: state.__version,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        // Migrate old reflection data format
        const result = migrateAllReflections(
          state.reflections || [],
          state.reflectionTemplates || []
        );
        state.reflections = result.reflections;
        state.reflectionTemplates = result.templates;

        // Migrate app data version
        const migrated = migrateAppData(state, CURRENT_APP_VERSION);
        Object.assign(state, migrated);
      },
    }
  )
);

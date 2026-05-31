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
import { electronStorage } from '../utils/electronStorage';
import type { AppState } from '../types';

export type AppStore = TaskSlice &
  CalendarSlice &
  PrincipleSlice &
  AbilitySlice &
  ReflectionSlice &
  EntertainmentSlice &
  ConfigSlice &
  OKRSlice;

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
    }),
    {
      name: 'alo-storage',
      storage: electronStorage as PersistStorage<AppState>,
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
      }),
    }
  )
);

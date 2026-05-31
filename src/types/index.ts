export type DayColumn = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  content: string;
  column: DayColumn;
  date: string;
  status: TaskStatus;
  order: number;
  abilityId?: string;
  abilityPoints?: number;
  completedAt?: string;
  migratedFrom?: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  content: string;
  createdAt: string;
}

export interface Principle {
  id: string;
  content: string;
  order: number;
}

export interface AbilityTask {
  id: string;
  content: string;
  points: number;
}

export interface Ability {
  id: string;
  name: string;
  currentScore: number;
  maxScore: number;
  tasks: AbilityTask[];
}

export interface Reflection {
  id: string;
  date: string;
  template: 'obstacle-breakthrough';
  answers: {
    obstacle: string;
    solution: string;
    effective: string;
    adjustment: string;
    control: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Entertainment {
  id: string;
  content: string;
  date: string;
}

export interface KeyResult {
  id: string;
  content: string;
  completed: boolean;
}

export interface Objective {
  id: string;
  title: string;
  period: string;
  keyResults: KeyResult[];
}

export interface InboxItem {
  id: string;
  objectiveId?: string;
  objectiveTitle?: string;
  content: string;
  completed: boolean;
  collectedAt: string;
  abilityId?: string;
  abilityPoints?: number;
  abilityName?: string;
}

export interface AppConfig {
  currentWeekStart: string;
  lastVisitDate: string;
  theme: 'dark' | 'light';
}

export interface AppState {
  tasks: Task[];
  calendarEvents: CalendarEvent[];
  principles: Principle[];
  abilities: Ability[];
  reflections: Reflection[];
  entertainments: Entertainment[];
  objectives: Objective[];
  inboxItems: InboxItem[];
  config: AppConfig;
}

// Electron IPC API exposed via contextBridge in preload.cjs
declare global {
  interface Window {
    electronAPI?: {
      loadDataSync: () => Record<string, string> | null;
      saveData: (data: Record<string, string>) => Promise<boolean>;
    };
  }
}

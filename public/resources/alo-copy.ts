// ALO Copy Text — Empty States, Tooltips & Error Messages
// Auto-generated from resource inventory on 2026-05-27
// Usage: import { aloCopy } from './alo-copy';

export const aloCopy = {
  // ── Empty State Messages ──
  emptyStates: {
    inbox: "收纳箱空空如也。把脑中漂浮的任务丢进来吧。",
    weekBoardColumn: "暂无任务。点击 [+] 开始规划你的一天。",
    reflectionLibrary: "暂无反思记录。每晚花 5 分钟，积跬步以至千里。",
    abilityTracker: "尚未创建能力。先去添加你的第一个培养目标吧。",
  },

  // ── Tutorial / Tooltip Messages ──
  tooltips: {
    dragReorder: "拖拽任务调整优先级，跨列移动改变日期。",
    abilityScoring: "勾选完成的任务会自动累计能力分数，progress is silent。",
    weeklyReset: "每周一 00:00，看板自动归档。未完成的任务会移入收纳箱，不会丢失。",
  },

  // ── Error & Exception Messages ──
  errors: {
    importFailed: "数据导入失败：文件格式不正确或数据已损坏。",
    storageFull: "本地存储空间不足。建议导出备份后清理历史反思记录。",
  },

  // ── Brand Slogans ──
  slogans: {
    primary: "在黑暗中，金箔是最谦卑的荣耀。",
    secondary: "ASCII LIFE OS",
  },
} as const;

export type AloCopy = typeof aloCopy;

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = process.cwd();
const read = (filePath: string) => fs.readFileSync(path.join(repoRoot, filePath), 'utf-8');
const readMobileRule = (css: string, selector: string) => {
  const mobileCss = css.slice(css.indexOf('@media (max-width: 767px)'));
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = mobileCss.match(new RegExp(`\\n\\s*${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\s*\\}`));
  return match?.[1] ?? '';
};

test('App keeps desktop workspace and adds a mobile-only Forge entry point', () => {
  const app = read('src/App.tsx');

  assert.match(app, /import MobileAppShell from '\.\/features\/mobile\/MobileAppShell'/);
  assert.match(app, /className="app-frame desktop-app-frame"/);
  assert.match(app, /<MobileAppShell[\s\S]*onOpenModulePicker=\{\(\) => setModulePickerOpen\(true\)\}/);
});

test('mobile shell uses bottom navigation and routes to productized mobile sections', () => {
  const shell = read('src/features/mobile/MobileAppShell.tsx');

  assert.match(shell, /mobile-app-shell/);
  assert.match(shell, /mobile-bottom-nav/);
  assert.match(shell, /MobileTodayForge/);
  assert.match(shell, /MobileWeekProgress/);
  assert.match(shell, /MobileCaptureHub/);
  assert.doesNotMatch(shell, /mobile-topbar/);
  assert.doesNotMatch(shell, /mobile-brand/);
  assert.doesNotMatch(shell, /resources\.logoPixel/);
  assert.match(shell, /今日/);
  assert.match(shell, /推进/);
  assert.match(shell, /记录/);
  assert.match(shell, /系统/);
});

test('mobile today forge presents desktop data as a life-system entry, not a todo board', () => {
  const todayForge = read('src/features/mobile/MobileTodayForge.tsx');

  assert.match(todayForge, /mobile-daily-command/);
  assert.match(todayForge, /mobile-status-pills/);
  assert.match(todayForge, /mobile-mainline-focus/);
  assert.match(todayForge, /mobile-command-principle/);
  assert.match(todayForge, /mobile-commitment-panel/);
  assert.match(todayForge, /mobile-commitment-row/);
  assert.doesNotMatch(todayForge, /mobile-quick-dock/);
  assert.match(todayForge, /今日锻造台/);
  assert.match(todayForge, /今日主线/);
  assert.match(todayForge, /今日承诺/);
  assert.match(todayForge, /今日原则/);
  assert.doesNotMatch(todayForge, /快速记录/);
  assert.match(todayForge, /useAppStore/);
  assert.match(todayForge, /tasks[\s\S]*\.filter\(\(task\) => task\.date === today/);
  assert.match(todayForge, /principles/);
  assert.match(todayForge, /moods/);
  assert.match(todayForge, /saveMood/);
  assert.match(todayForge, /mobile-mood-panel/);
  assert.match(todayForge, /mobile-mood-controls/);
  assert.match(todayForge, /mobile-stepper-field/);
  assert.match(todayForge, /adjustMobileMood/);
  assert.match(todayForge, /adjustMobileEnergy/);
  assert.match(todayForge, /isMoodPanelOpen/);
  assert.match(todayForge, /setIsMoodPanelOpen\(false\)/);
  assert.match(todayForge, /mobile-mood-summary/);
  assert.match(todayForge, /aria-label="降低心境"/);
  assert.match(todayForge, /aria-label="提高能量"/);
  assert.match(todayForge, /aria-live="polite"/);
  assert.match(todayForge, /saveMood\(\{ date: today, mood: mobileMood, energy: mobileEnergy/);
  assert.doesNotMatch(todayForge, /type="range"/);
  assert.doesNotMatch(todayForge, /DndContext|SortableContext|useSortable/);
});

test('mobile progress uses a vertical system console instead of a horizontal task board', () => {
  const weekProgress = read('src/features/mobile/MobileWeekProgress.tsx');
  const shell = read('src/features/mobile/MobileAppShell.tsx');

  assert.match(weekProgress, /mobile-progress-console/);
  assert.match(weekProgress, /mobile-week-console/);
  assert.match(weekProgress, /mobile-progress-stats/);
  assert.match(weekProgress, /mobile-day-timeline/);
  assert.match(weekProgress, /mobile-day-node/);
  assert.match(weekProgress, /mobile-day-status-chip/);
  assert.match(weekProgress, /mobile-week-review-panel/);
  assert.match(weekProgress, /WEEKLY_REVIEW_LITE_TEMPLATE_ID/);
  assert.match(weekProgress, /saveReflection/);
  assert.match(weekProgress, /aria-expanded=\{isWeeklyReviewOpen\}/);
  assert.match(weekProgress, /getTodayString/);
  assert.doesNotMatch(shell, /setPage\('weeklyReview'\)/);
  assert.doesNotMatch(weekProgress, /DndContext|SortableContext|useSortable/);
});

test('mobile progress keeps completed days collapsed but lets users open day details', () => {
  const weekProgress = read('src/features/mobile/MobileWeekProgress.tsx');

  assert.match(weekProgress, /const shouldExpand = isToday \|\| active > 0/);
  assert.match(weekProgress, /expandedDates/);
  assert.match(weekProgress, /toggleDateExpansion/);
  assert.match(weekProgress, /aria-expanded=\{shouldExpand\}/);
  assert.match(weekProgress, /aria-controls=\{`mobile-day-detail-\$\{date\}`\}/);
  assert.match(weekProgress, /id=\{`mobile-day-detail-\$\{date\}`\}/);
  assert.match(weekProgress, /is-collapsed/);
  assert.match(weekProgress, /mobile-day-summary/);
  assert.match(weekProgress, /shouldExpand \?/);
  assert.doesNotMatch(weekProgress, /dayTasks\.slice\(0, 3\)/);
});

test('mobile capture is a journal timeline composer', () => {
  const captureHub = read('src/features/mobile/MobileCaptureHub.tsx');

  assert.match(captureHub, /mobile-journal-timeline/);
  assert.match(captureHub, /mobile-capture-composer/);
  assert.match(captureHub, /mobile-capture-lanes/);
  assert.match(captureHub, /mobile-capture-rail/);
  assert.match(captureHub, /mobile-capture-save/);
  assert.match(captureHub, /isComposerOpen/);
  assert.match(captureHub, /setIsComposerOpen\(false\)/);
  assert.match(captureHub, /latestSavedId/);
  assert.match(captureHub, /setLatestSavedId\(savedId\)/);
  assert.match(captureHub, /mobile-capture-trigger/);
  assert.match(captureHub, /mobile-capture-mode-hint/);
  assert.match(captureHub, /is-open/);
  assert.match(captureHub, /is-collapsed/);
  assert.match(captureHub, /is-new/);
  assert.match(captureHub, /recentMobileCaptures/);
  assert.match(captureHub, /mobile-capture-history/);
  assert.match(captureHub, /mobile-capture-history-item/);
  assert.match(captureHub, /tags:\s*\['mobile', mode\]/);
  assert.match(captureHub, /统一记录入口/);
  assert.match(captureHub, /成效/);
  assert.match(captureHub, /保存到记录流/);
  assert.doesNotMatch(captureHub, />证据</);
});

test('mobile system section is compact status rows, not another stacked card', () => {
  const shell = read('src/features/mobile/MobileAppShell.tsx');

  assert.match(shell, /mobile-system-panel/);
  assert.match(shell, /mobile-system-status/);
  assert.match(shell, /mobile-system-row/);
  assert.doesNotMatch(shell, /mobile-card mobile-system-card/);
});

test('mobile system opens real sync tools instead of routing to hidden desktop chrome', () => {
  const shell = read('src/features/mobile/MobileAppShell.tsx');

  assert.match(shell, /import SyncPanel from '\.\.\/system\/SyncPanel'/);
  assert.match(shell, /isSystemToolsOpen/);
  assert.match(shell, /aria-expanded=\{isSystemToolsOpen\}/);
  assert.match(shell, /mobile-system-tools/);
  assert.match(shell, /<SyncPanel \/>/);
  assert.doesNotMatch(shell, /onClick=\{\(\) => setPage\('system'\)\}/);
});

test('mobile CSS treats Android safe areas and hides desktop board chrome on phones', () => {
  const css = read('src/index.css');
  const mobileShell = readMobileRule(css, '.mobile-app-shell');
  const mobileContent = readMobileRule(css, '.mobile-content');
  const bottomNav = readMobileRule(css, '.mobile-bottom-nav');

  assert.match(css, /\.mobile-app-shell[\s\S]*display:\s*none/);
  assert.match(css, /@media \(max-width: 767px\), \(hover: none\) and \(pointer: coarse\)/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.desktop-app-frame[\s\S]*display:\s*none/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-app-shell[\s\S]*display:\s*flex/);
  assert.match(mobileShell, /height:\s*100dvh/);
  assert.match(mobileShell, /padding-top:\s*0/);
  assert.doesNotMatch(mobileShell, /safe-area-inset-top/);
  assert.doesNotMatch(css, /mobile-topbar|mobile-brand|--mobile-topbar-height/);
  assert.match(mobileContent, /padding:\s*12px 12px 0/);
  assert.match(mobileContent, /padding-bottom:\s*calc\(env\(safe-area-inset-bottom\) \+ 16px\)/);
  assert.match(mobileContent, /overflow-y:\s*auto/);
  assert.match(mobileContent, /scrollbar-width:\s*none/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-content::-webkit-scrollbar[\s\S]*display:\s*none/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-daily-command[\s\S]*border:\s*0/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-commitment-row[\s\S]*min-height:\s*56px/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-day-timeline[\s\S]*border-left/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-capture-composer[\s\S]*min-height:\s*0/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-capture-composer\.is-open[\s\S]*min-height:\s*260px/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-capture-trigger[\s\S]*min-height:\s*52px/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-capture-mode-hint[\s\S]*display:\s*grid/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-week-review-panel[\s\S]*display:\s*grid/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-capture-history[\s\S]*display:\s*grid/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-capture-history-item\.is-new[\s\S]*animation:\s*mobile-capture-new/);
  assert.match(css, /@keyframes mobile-capture-new/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-mood-panel[\s\S]*display:\s*grid/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-mood-summary[\s\S]*min-height:\s*42px/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-mood-controls[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-stepper-control button[\s\S]*min-height:\s*36px/);
  assert.match(bottomNav, /position:\s*relative/);
  assert.match(bottomNav, /left:\s*auto/);
  assert.match(bottomNav, /right:\s*auto/);
  assert.match(bottomNav, /bottom:\s*auto/);
  assert.doesNotMatch(bottomNav, /position:\s*fixed/);
  assert.match(bottomNav, /padding-bottom:\s*calc\(env\(safe-area-inset-bottom\)[\s\S]*\)/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-nav-button[\s\S]*min-height:\s*52px/);
});

test('mobile CSS prevents dense titles and uses a restrained radius system', () => {
  const css = read('src/index.css');

  assert.match(css, /@media \(max-width: 767px\)[\s\S]*--mobile-radius:\s*18px/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-mainline-focus h1[\s\S]*-webkit-line-clamp:\s*2/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-commitment-row[\s\S]*border-radius:\s*14px/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-day-node[\s\S]*border-radius:\s*var\(--mobile-radius\)/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-nav-button\s*\{[\s\S]*border-radius:\s*14px/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.mobile-nav-button\[aria-current="page"\][\s\S]*border-radius:\s*999px/);
});

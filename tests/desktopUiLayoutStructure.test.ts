import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = process.cwd();
const read = (filePath: string) => fs.readFileSync(path.join(repoRoot, filePath), 'utf-8');

test('desktop navigation separates monthly OKR and bottom system entry', () => {
  const app = read('src/App.tsx');

  assert.match(app, /MonthlyOKR/);
  assert.match(app, /monthlyOKR/);
  assert.match(app, /月度 OKR/);
  assert.match(app, /app-rail-bottom/);
  assert.match(app, /app-rail-section--system/);
  assert.match(app, /app-rail-icon/);
});

test('reflection library does not render the monthly OKR panel', () => {
  const reflectionPage = read('src/pages/Reflection.tsx');
  const monthlyOkrPage = read('src/pages/MonthlyOKR.tsx');

  assert.doesNotMatch(reflectionPage, /OKRPanel/);
  assert.doesNotMatch(reflectionPage, /reflection-okr-section/);
  assert.match(monthlyOkrPage, /OKRPanel/);
  assert.match(monthlyOkrPage, /monthly-okr-section/);
});

test('dashboard keeps execution modules under the task board', () => {
  const dashboardPage = read('src/pages/Dashboard.tsx');
  const css = read('src/index.css');

  assert.match(dashboardPage, /dashboard-board-section[\s\S]*TaskBoard/);
  assert.match(dashboardPage, /dashboard-today-strip[\s\S]*TodayProgress/);
  assert.match(dashboardPage, /dashboard-today-strip[\s\S]*ReflectionQuickEntry/);
  assert.doesNotMatch(dashboardPage, /dashboard-side-panel/);
  assert.match(css, /\.dashboard-command-grid[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(css, /\.dashboard-board-section \.task-column[\s\S]*min-width:\s*200px/);
});

test('system page merges about and update and excludes daily truth', () => {
  const systemPage = read('src/pages/System.tsx');
  const updatePanel = read('src/features/system/UpdatePanel.tsx');
  const copy = read('src/copy/system-copy.ts');

  assert.match(systemPage, /system-about-update-card/);
  assert.match(systemPage, /<UpdatePanel embedded \/>/);
  assert.match(updatePanel, /embedded\?: boolean/);
  assert.match(copy, /title:\s*'关于与更新'/);
  assert.doesNotMatch(systemPage, /MonkQuote/);
});

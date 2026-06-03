import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = process.cwd();
const read = (filePath: string) => fs.readFileSync(path.join(repoRoot, filePath), 'utf-8');

test('System page renders the COS sync panel and exposes expected controls', () => {
  const systemPage = read('src/pages/System.tsx');
  const syncPanel = read('src/features/system/SyncPanel.tsx');

  assert.match(systemPage, /SyncPanel/);
  assert.match(syncPanel, /endpoint/);
  assert.match(syncPanel, /region/);
  assert.match(syncPanel, /bucket/);
  assert.match(syncPanel, /profileId/);
  assert.match(syncPanel, /objectPrefix/);
  assert.match(syncPanel, /credentialProviderUrl/);
  assert.match(syncPanel, /accessKeyId/);
  assert.match(syncPanel, /secretAccessKey/);
  assert.match(syncPanel, /createDirectCosCredentialProvider/);
  assert.match(syncPanel, /runManualSync/);
  assert.match(syncPanel, /resolveSyncConflict/);
  assert.match(syncPanel, /recommendConflictChoice/);
});

test('COS sync panel uses mobile settings sections instead of a desktop form table', () => {
  const syncPanel = read('src/features/system/SyncPanel.tsx');

  assert.match(syncPanel, /sync-status-banner/);
  assert.match(syncPanel, /sync-setting-section/);
  assert.match(syncPanel, /sync-setting-section--connection/);
  assert.match(syncPanel, /sync-setting-section--security/);
  assert.match(syncPanel, /sync-switch/);
  assert.match(syncPanel, /sync-action-bar/);
  assert.match(syncPanel, /isConfigOpen/);
  assert.match(syncPanel, /setIsConfigOpen\(false\)/);
  assert.match(syncPanel, /修改配置/);
  assert.match(syncPanel, /sync-config-summary/);
  assert.match(syncPanel, /const activeConfig = isConfigOpen \? form : syncConfig/);
  assert.match(syncPanel, /createClient\(activeConfig\)/);
  assert.match(syncPanel, /applyResult\(result, activeConfig\)/);
});

test('mobile UI CSS keeps sync fields usable and task board horizontally scrollable', () => {
  const css = read('src/index.css');

  assert.match(css, /\.sync-config-summary[\s\S]*display:\s*grid/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.sync-field[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.sync-config-summary[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.sync-action-bar \.ascii-button[\s\S]*min-height:\s*48px/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.task-board-scroll[\s\S]*flex-direction:\s*row/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.task-board-scroll[\s\S]*overflow-x:\s*auto/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.task-column,[\s\S]*\.okr-inbox-column[\s\S]*flex:\s*0 0 min\(78vw,\s*220px\)/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.app-rail-button[\s\S]*min-height:\s*40px/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.app-rail-section--tools \.app-rail-button[\s\S]*min-height:\s*34px/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.module-picker-row[\s\S]*grid-template-columns:\s*36px minmax\(0,\s*1fr\) auto/);
});

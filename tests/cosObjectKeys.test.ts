import assert from 'node:assert/strict';
import test from 'node:test';
import { backupObjectKey, syncObjectKey } from '../src/sync/cosObjectKeys.ts';

const sharedPrefix = 'Forge-OS_Base/Domain1127/GoogleChrome';

test('COS object keys default to the shared GoogleChrome prefix', () => {
  const config = { objectPrefix: '' };

  assert.equal(syncObjectKey(config), `${sharedPrefix}/alo-data.sync.json`);
  assert.equal(
    backupObjectKey(config, 'device-1', '2026-06-03T00:00:00.000Z'),
    `${sharedPrefix}/snapshots/2026-06-03T00-00-00.000Z-device-1.json`
  );
});

test('COS object keys still honor an explicitly configured prefix', () => {
  const config = { objectPrefix: 'Forge-OS_Base/Domain1127/Android' };

  assert.equal(syncObjectKey(config), 'Forge-OS_Base/Domain1127/Android/alo-data.sync.json');
  assert.equal(
    backupObjectKey(config, 'device-1', '2026-06-03T00:00:00.000Z'),
    'Forge-OS_Base/Domain1127/Android/snapshots/2026-06-03T00-00-00.000Z-device-1.json'
  );
});

import type { CosSyncConfig } from '../types/sync';

const trimSlashes = (value: string): string => value.replace(/^\/+|\/+$/g, '');

export const cosObjectPrefix = (config: Pick<CosSyncConfig, 'objectPrefix'>): string =>
  trimSlashes(config.objectPrefix || 'Forge-OS_Base/Domain1127/GoogleChrome');

export const syncObjectKey = (config: Pick<CosSyncConfig, 'objectPrefix'>): string =>
  `${cosObjectPrefix(config)}/alo-data.sync.json`;

export const entitySyncObjectKey = (config: Pick<CosSyncConfig, 'objectPrefix'>): string =>
  `${cosObjectPrefix(config)}/alo-data.entities.v2.json`;

export const backupObjectKey = (
  config: Pick<CosSyncConfig, 'objectPrefix'>,
  deviceId: string,
  updatedAt = new Date().toISOString()
): string => `${cosObjectPrefix(config)}/snapshots/${updatedAt.replace(/:/g, '-')}-${deviceId}.json`;

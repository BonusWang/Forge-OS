import { useEffect, useRef } from 'react';
import { createCosSyncClient } from '../sync/cosSyncClient';
import { backupObjectKey, syncObjectKey } from '../sync/cosObjectKeys';
import {
  createDirectCosCredentialProvider,
  hasDirectCosCredentials,
} from '../sync/directCosCredentialProvider';
import { createHttpCosCredentialProvider } from '../sync/httpCosCredentialProvider';
import type { ManualSyncResult } from '../sync/manualSync';
import { runStartupSync } from '../sync/startupSync';
import { useAppStore } from '../store/useAppStore';
import { APP_VERSION } from '../utils/checkUpdate';
import { createStorageRecordFromAppState } from '../utils/storageRecord';

const applyStartupResult = (result: ManualSyncResult) => {
  const state = useAppStore.getState();
  const deviceId = state.syncStatus.deviceId;

  if (result.phase === 'idle') {
    return;
  }

  if (result.phase === 'not-configured') {
    state.setSyncStatus({ phase: 'not-configured' });
    return;
  }

  if (result.phase === 'error') {
    state.setSyncStatus({ phase: 'error', lastError: result.error });
    return;
  }

  if (result.phase === 'conflict') {
    if ('localRevision' in result) {
      state.setSyncStatus({
        phase: 'conflict',
        lastError: '启动同步检测到本地和云端同时变化',
        conflict: {
          localRevision: result.localRevision,
          remoteRevision: result.remoteRevision,
          localUpdatedAt: result.localUpdatedAt,
          remoteUpdatedAt: result.remoteUpdatedAt,
          backupKey: result.backupKey,
        },
      });
    }
    return;
  }

  if (result.state) {
    useAppStore.setState({
      ...result.state,
      syncConfig: state.syncConfig,
      syncStatus: {
        phase: 'success',
        deviceId,
        lastSyncedAt: new Date().toISOString(),
        lastSyncedRevision: result.revision,
        lastLocalUpdatedAt: undefined,
      },
    });
    return;
  }

  state.setSyncStatus({
    phase: 'success',
    lastSyncedAt: new Date().toISOString(),
    lastSyncedRevision: result.revision,
    lastLocalUpdatedAt: undefined,
    lastError: undefined,
    conflict: undefined,
  });
};

export const useStartupCosSync = () => {
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const state = useAppStore.getState();
    const { syncConfig, syncStatus } = state;
    if (!syncConfig.enabled || !syncStatus.lastSyncedRevision) return;

    const run = async () => {
      state.setSyncStatus({ phase: 'syncing', lastError: undefined });
      const client = createCosSyncClient({
        credentialProvider: hasDirectCosCredentials(syncConfig)
          ? createDirectCosCredentialProvider({
              accessKeyId: syncConfig.accessKeyId ?? '',
              secretAccessKey: syncConfig.secretAccessKey ?? '',
              bucket: syncConfig.bucket,
              region: syncConfig.region,
              endpoint: syncConfig.endpoint,
            })
          : createHttpCosCredentialProvider({
              endpoint: syncConfig.credentialProviderUrl,
            }),
      });

      const result = await runStartupSync({
        config: syncConfig,
        client,
        key: syncObjectKey(syncConfig),
        backupKey: backupObjectKey(syncConfig, syncStatus.deviceId),
        appVersion: APP_VERSION,
        deviceId: syncStatus.deviceId,
        storageRecord: createStorageRecordFromAppState(state),
        lastSyncedRevision: syncStatus.lastSyncedRevision,
        hasLocalChanges: Boolean(syncStatus.lastLocalUpdatedAt),
        localUpdatedAt: syncStatus.lastLocalUpdatedAt,
      });

      applyStartupResult(result);
    };

    run().catch((error) => {
      useAppStore.getState().setSyncStatus({
        phase: 'error',
        lastError: error instanceof Error ? error.message : 'startup sync failed',
      });
    });
  }, []);
};

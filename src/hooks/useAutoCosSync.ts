import { useEffect, useRef } from 'react';
import { createCosSyncClient } from '../sync/cosSyncClient';
import { backupObjectKey, syncObjectKey } from '../sync/cosObjectKeys';
import {
  createDirectCosCredentialProvider,
  hasDirectCosCredentials,
} from '../sync/directCosCredentialProvider';
import { createHttpCosCredentialProvider } from '../sync/httpCosCredentialProvider';
import { runManualSync, type ManualSyncResult } from '../sync/manualSync';
import { useAppStore } from '../store/useAppStore';
import { APP_VERSION } from '../utils/checkUpdate';
import { createStorageRecordFromAppState } from '../utils/storageRecord';

const AUTO_SYNC_DEBOUNCE_MS = 1800;
const AUTO_SYNC_POLL_MS = 30000;

const applyAutoSyncResult = (result: ManualSyncResult) => {
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
        lastError: '自动同步检测到本地和云端同时变化',
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

const runAutoSyncNow = async ({ hasLocalChanges }: { hasLocalChanges: boolean }) => {
  const current = useAppStore.getState();
  const syncConfig = current.syncConfig;
  const syncStatus = current.syncStatus;

  if (!syncConfig.enabled || !syncStatus.lastSyncedRevision) return;
  if (syncStatus.phase === 'syncing' || syncStatus.phase === 'conflict') return;
  if (hasLocalChanges && !syncStatus.lastLocalUpdatedAt) return;

  current.setSyncStatus({ phase: 'syncing', lastError: undefined });

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

  const result = await runManualSync({
    config: syncConfig,
    client,
    key: syncObjectKey(syncConfig),
    backupKey: backupObjectKey(syncConfig, syncStatus.deviceId),
    appVersion: APP_VERSION,
    deviceId: syncStatus.deviceId,
    storageRecord: createStorageRecordFromAppState(useAppStore.getState()),
    lastSyncedRevision: syncStatus.lastSyncedRevision,
    hasLocalChanges,
    localUpdatedAt: syncStatus.lastLocalUpdatedAt,
  });

  applyAutoSyncResult(result);
};

export const useAutoCosSync = () => {
  const syncConfig = useAppStore((state) => state.syncConfig);
  const syncStatus = useAppStore((state) => state.syncStatus);
  const lastAttemptedLocalUpdatedAtRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!syncConfig.enabled || !syncStatus.lastLocalUpdatedAt || !syncStatus.lastSyncedRevision) return;
    if (syncStatus.phase === 'syncing' || syncStatus.phase === 'conflict') return;
    if (lastAttemptedLocalUpdatedAtRef.current === syncStatus.lastLocalUpdatedAt) return;

    const queuedLocalUpdatedAt = syncStatus.lastLocalUpdatedAt;

    const timer = window.setTimeout(() => {
      const { syncStatus } = useAppStore.getState();

      if (syncStatus.lastLocalUpdatedAt !== queuedLocalUpdatedAt) return;
      lastAttemptedLocalUpdatedAtRef.current = syncStatus.lastLocalUpdatedAt;
      runAutoSyncNow({ hasLocalChanges: true })
        .catch((error) => {
          useAppStore.getState().setSyncStatus({
            phase: 'error',
            lastError: error instanceof Error ? error.message : 'auto sync failed',
          });
        });
    }, AUTO_SYNC_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    syncConfig.enabled,
    syncConfig.endpoint,
    syncConfig.region,
    syncConfig.bucket,
    syncConfig.profileId,
    syncConfig.credentialProviderUrl,
    syncConfig.accessKeyId,
    syncConfig.secretAccessKey,
    syncConfig.objectPrefix,
    syncStatus.deviceId,
    syncStatus.lastLocalUpdatedAt,
    syncStatus.lastSyncedRevision,
    syncStatus.phase,
  ]);

  useEffect(() => {
    if (!syncConfig.enabled || !syncStatus.lastSyncedRevision) return;
    if (syncStatus.lastLocalUpdatedAt) return;
    if (syncStatus.phase === 'syncing' || syncStatus.phase === 'conflict') return;

    const runRemoteCheck = () => {
      const { syncStatus } = useAppStore.getState();
      if (syncStatus.lastLocalUpdatedAt) return;
      void runAutoSyncNow({ hasLocalChanges: false }).catch((error) => {
        useAppStore.getState().setSyncStatus({
          phase: 'error',
          lastError: error instanceof Error ? error.message : 'auto sync failed',
        });
      });
    };

    const interval = window.setInterval(runRemoteCheck, AUTO_SYNC_POLL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') runRemoteCheck();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    syncConfig.enabled,
    syncConfig.endpoint,
    syncConfig.region,
    syncConfig.bucket,
    syncConfig.profileId,
    syncConfig.credentialProviderUrl,
    syncConfig.accessKeyId,
    syncConfig.secretAccessKey,
    syncConfig.objectPrefix,
    syncStatus.lastLocalUpdatedAt,
    syncStatus.lastSyncedRevision,
    syncStatus.phase,
  ]);
};

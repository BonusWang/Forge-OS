import React, { useMemo, useState } from 'react';
import AsciiBox from '../../components/AsciiBox';
import AsciiButton from '../../components/AsciiButton';
import { useAppStore } from '../../store/useAppStore';
import type { CosSyncConfig, CosSyncEnvelope, SyncStatus } from '../../types/sync';
import { createCosSyncClient } from '../../sync/cosSyncClient';
import { backupObjectKey, syncObjectKey } from '../../sync/cosObjectKeys';
import {
  createDirectCosCredentialProvider,
  hasDirectCosCredentials,
} from '../../sync/directCosCredentialProvider';
import { recommendConflictChoice, type ConflictChoice } from '../../sync/conflictRecommendation';
import { createHttpCosCredentialProvider } from '../../sync/httpCosCredentialProvider';
import { resolveSyncConflict, runManualSync, type ManualSyncResult } from '../../sync/manualSync';
import { APP_VERSION } from '../../utils/checkUpdate';
import { createStorageRecordFromAppState } from '../../utils/storageRecord';

type FirstSyncMode = 'upload-local' | 'restore-remote';

const createClient = (config: CosSyncConfig) =>
  createCosSyncClient({
    credentialProvider: hasDirectCosCredentials(config)
      ? createDirectCosCredentialProvider({
          accessKeyId: config.accessKeyId ?? '',
          secretAccessKey: config.secretAccessKey ?? '',
          bucket: config.bucket,
          region: config.region,
          endpoint: config.endpoint,
        })
      : createHttpCosCredentialProvider({
          endpoint: config.credentialProviderUrl,
        }),
  });

const statusLabel: Record<SyncStatus['phase'], string> = {
  'not-configured': '未配置',
  idle: '待命',
  syncing: '同步中',
  success: '已同步',
  error: '失败',
  conflict: '冲突',
};

const formatSyncError = (error?: string) => {
  if (!error) return undefined;
  if (/浏览器无法访问 COS/i.test(error)) {
    return error;
  }
  if (/Failed to fetch|NetworkError/i.test(error)) {
    return '网络或授权服务不可用，请检查手机网络、签名服务地址或 COS 跨域配置。';
  }
  return error;
};

const SyncPanel: React.FC = () => {
  const syncConfig = useAppStore((state) => state.syncConfig);
  const syncStatus = useAppStore((state) => state.syncStatus);
  const updateSyncConfig = useAppStore((state) => state.updateSyncConfig);
  const setSyncStatus = useAppStore((state) => state.setSyncStatus);
  const [form, setForm] = useState(syncConfig);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [firstSyncMode, setFirstSyncMode] = useState<FirstSyncMode>('upload-local');
  const [pendingRemoteEnvelope, setPendingRemoteEnvelope] = useState<CosSyncEnvelope | null>(null);

  const recommendation = useMemo(
    () =>
      recommendConflictChoice(
        syncStatus.conflict?.localUpdatedAt,
        syncStatus.conflict?.remoteUpdatedAt
      ),
    [syncStatus.conflict?.localUpdatedAt, syncStatus.conflict?.remoteUpdatedAt]
  );
  const displayError = formatSyncError(syncStatus.lastError);

  const updateForm = (field: keyof CosSyncConfig, value: string | boolean) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const applyResult = (result: ManualSyncResult, config: CosSyncConfig = form) => {
    const deviceId = syncStatus.deviceId;

    if (result.phase === 'idle') {
      setSyncStatus({
        phase: 'idle',
        lastError: '首次同步需要手动选择上传本地或采用云端',
      });
      return;
    }

    if (result.phase === 'not-configured') {
      setSyncStatus({ phase: 'not-configured', lastError: '请先启用并保存 COS 同步配置' });
      return;
    }

    if (result.phase === 'error') {
      setSyncStatus({ phase: 'error', lastError: result.error });
      return;
    }

    if (result.phase === 'conflict') {
      if ('remoteEnvelope' in result && result.remoteEnvelope) {
        setPendingRemoteEnvelope(result.remoteEnvelope);
      }
      if ('localRevision' in result) {
        setSyncStatus({
          phase: 'conflict',
          lastError: '检测到本地和云端同时变化',
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
        syncConfig: config,
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

    setPendingRemoteEnvelope(null);
    setSyncStatus({
      phase: 'success',
      lastSyncedAt: new Date().toISOString(),
      lastSyncedRevision: result.revision,
      lastLocalUpdatedAt: undefined,
      lastError: undefined,
      conflict: undefined,
    });
  };

  const saveConfig = () => {
    updateSyncConfig(form);
    setSyncStatus({
      phase: form.enabled ? 'idle' : 'not-configured',
      lastError: undefined,
      conflict: undefined,
    });
    setIsConfigOpen(false);
  };

  const openConfig = () => {
    setForm(syncConfig);
    setIsConfigOpen(true);
  };

  const handleManualSync = async () => {
    const activeConfig = isConfigOpen ? form : syncConfig;
    updateSyncConfig(activeConfig);
    setSyncStatus({ phase: 'syncing', lastError: undefined });

    const state = useAppStore.getState();
    const client = createClient(activeConfig);
    const result = await runManualSync({
      config: activeConfig,
      client,
      key: syncObjectKey(activeConfig),
      backupKey: backupObjectKey(activeConfig, syncStatus.deviceId),
      appVersion: APP_VERSION,
      deviceId: syncStatus.deviceId,
      storageRecord: createStorageRecordFromAppState(state),
      lastSyncedRevision: syncStatus.lastSyncedRevision,
      hasLocalChanges: Boolean(syncStatus.lastLocalUpdatedAt),
      localUpdatedAt: syncStatus.lastLocalUpdatedAt,
      firstSyncMode,
    });

    applyResult(result, activeConfig);
  };

  const handleConflictChoice = async (choice: ConflictChoice) => {
    if (choice === 'later') {
      setSyncStatus({ phase: 'conflict', lastError: '冲突已保留，稍后处理' });
      return;
    }

    if (!pendingRemoteEnvelope) {
      setSyncStatus({ phase: 'error', lastError: '缺少云端冲突快照，请重新同步' });
      return;
    }

    setSyncStatus({ phase: 'syncing', lastError: undefined });
    const state = useAppStore.getState();
    const activeConfig = isConfigOpen ? form : syncConfig;
    const result = await resolveSyncConflict({
      choice,
      client: createClient(activeConfig),
      key: syncObjectKey(activeConfig),
      appVersion: APP_VERSION,
      deviceId: syncStatus.deviceId,
      storageRecord: createStorageRecordFromAppState(state),
      remoteEnvelope: pendingRemoteEnvelope,
    });

    applyResult(result, activeConfig);
  };

  return (
    <AsciiBox title="COS 数据同步">
      <div className="sync-panel">
        <div className={`sync-status-banner sync-status-banner--${syncStatus.phase}`}>
          <div className="sync-status-main">
            <span className="font-body sync-status-title">状态：{statusLabel[syncStatus.phase]}</span>
            <span className="font-caption sync-status-device">设备：{syncStatus.deviceId}</span>
          </div>
          <div className="sync-status-meta font-caption">
            <span>最近同步：{syncStatus.lastSyncedAt ?? '暂无'}</span>
            <span>基线：{syncStatus.lastSyncedRevision ?? '暂无'}</span>
            <span>本地版本：{syncStatus.lastLocalUpdatedAt ?? '已是最新'}</span>
          </div>
          {displayError && <div className="font-caption sync-error">{displayError}</div>}
        </div>

        {!isConfigOpen && (
          <div className="sync-config-summary font-caption">
            <span>Bucket：{syncConfig.bucket}</span>
            <span>对象前缀：{syncConfig.objectPrefix}</span>
            <span>授权：{hasDirectCosCredentials(syncConfig) ? '手动密钥' : '签名服务'}</span>
          </div>
        )}

        {isConfigOpen && (
          <>
            <div className="sync-setting-section sync-setting-section--connection">
              <div className="sync-section-heading">
                <div className="font-body">连接设置</div>
                <div className="font-caption">COS Bucket 与对象路径</div>
              </div>

              <label className="sync-field sync-field--toggle font-caption">
                <span>
                  <span className="sync-field-label">启动自动同步</span>
                  <span className="sync-field-help">应用启动时自动拉取云端，仍可手动触发同步。</span>
                </span>
                <span className="sync-switch">
                  <input
                    type="checkbox"
                    checked={form.enabled}
                    onChange={(event) => updateForm('enabled', event.currentTarget.checked)}
                  />
                  <span className="sync-switch-track" aria-hidden="true">
                    <span className="sync-switch-thumb" />
                  </span>
                </span>
              </label>

              <label className="sync-field font-caption">
                <span className="sync-field-label">Endpoint</span>
                <input value={form.endpoint} onChange={(event) => updateForm('endpoint', event.target.value)} />
              </label>
              <label className="sync-field font-caption">
                <span className="sync-field-label">Region</span>
                <input value={form.region} onChange={(event) => updateForm('region', event.target.value)} />
              </label>
              <label className="sync-field font-caption">
                <span className="sync-field-label">Bucket</span>
                <input value={form.bucket} onChange={(event) => updateForm('bucket', event.target.value)} />
              </label>
              <label className="sync-field font-caption">
                <span className="sync-field-label">Profile</span>
                <input
                  value={form.profileId}
                  onChange={(event) => updateForm('profileId', event.target.value)}
                />
              </label>
              <label className="sync-field font-caption">
                <span className="sync-field-label">对象前缀</span>
                <input
                  value={form.objectPrefix}
                  onChange={(event) => updateForm('objectPrefix', event.target.value)}
                />
              </label>
            </div>

            <div className="sync-setting-section sync-setting-section--security">
              <div className="sync-section-heading">
                <div className="font-body">授权设置</div>
                <div className="font-caption">优先使用签名服务；填写密钥时将直接签名请求。</div>
              </div>

              <label className="sync-field font-caption">
                <span className="sync-field-label">签名服务</span>
                <input
                  value={form.credentialProviderUrl}
                  onChange={(event) => updateForm('credentialProviderUrl', event.target.value)}
                />
              </label>
              <label className="sync-field font-caption">
                <span className="sync-field-label">Access Key ID</span>
                <input
                  value={form.accessKeyId ?? ''}
                  onChange={(event) => updateForm('accessKeyId', event.target.value)}
                />
              </label>
              <label className="sync-field font-caption">
                <span className="sync-field-label">Secret Access Key</span>
                <input
                  type="password"
                  value={form.secretAccessKey ?? ''}
                  onChange={(event) => updateForm('secretAccessKey', event.target.value)}
                />
              </label>
            </div>

            <div className="sync-setting-section sync-setting-section--behavior">
              <div className="sync-section-heading">
                <div className="font-body">同步行为</div>
                <div className="font-caption">首次同步时选择本机数据或云端快照作为基线。</div>
              </div>

              <label className="sync-field font-caption">
                <span className="sync-field-label">首次同步</span>
                <select
                  value={firstSyncMode}
                  onChange={(event) => setFirstSyncMode(event.target.value as FirstSyncMode)}
                >
                  <option value="upload-local">上传本地</option>
                  <option value="restore-remote">采用云端</option>
                </select>
              </label>
            </div>
          </>
        )}

        <div className="sync-action-bar sync-actions">
          {isConfigOpen ? (
            <AsciiButton onClick={saveConfig} variant="secondary">
              保存配置
            </AsciiButton>
          ) : (
            <AsciiButton onClick={openConfig} variant="secondary">
              修改配置
            </AsciiButton>
          )}
          <AsciiButton onClick={handleManualSync} disabled={syncStatus.phase === 'syncing'}>
            立即同步
          </AsciiButton>
        </div>

        {syncStatus.phase === 'conflict' && (
          <div className="sync-conflict">
            <div className="font-caption text-gold">
              推荐：{recommendation === 'keep-local' ? '保留本地' : recommendation === 'use-remote' ? '采用云端' : '手动判断'}
            </div>
            <div className="sync-actions sync-conflict-actions">
              <AsciiButton onClick={() => handleConflictChoice('keep-local')}>
                保留本地
              </AsciiButton>
              <AsciiButton onClick={() => handleConflictChoice('use-remote')} variant="secondary">
                采用云端
              </AsciiButton>
              <AsciiButton onClick={() => handleConflictChoice('later')} variant="secondary">
                稍后处理
              </AsciiButton>
            </div>
          </div>
        )}
      </div>
    </AsciiBox>
  );
};

export default SyncPanel;

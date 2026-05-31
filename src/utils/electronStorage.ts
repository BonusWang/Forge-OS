// Custom storage adapter for Zustand persist middleware.
// When running in Electron, uses IPC to persist data as a file in the user's
// app data directory. Falls back to localStorage when running in a browser.
//
// Implements Zustand's PersistStorage interface — handles JSON
// serialization internally.
//
// CRITICAL FIXES APPLIED (2026-05-26):
// 1. Atomic file writes via temp+rename in main process
// 2. Automatic .bak backup creation & corruption recovery
// 3. Save-failure awareness: dirty flag only cleared on confirmed success
// 4. Exponential backoff retry on write failure
// 5. App-quit flush: listens to 'app-before-quit' IPC and forces immediate save

import type { PersistStorage, StorageValue } from 'zustand/middleware';

interface ElectronAPI {
  loadDataSync: () => Record<string, string> | null;
  saveData: (data: Record<string, string>) => Promise<boolean>;
  onBeforeQuit: (callback: () => void) => void;
}

const api: ElectronAPI | undefined = (window as any).electronAPI;

function createStorage(): PersistStorage<unknown> {
  if (api) {
    let cache: Record<string, string> | null = null;
    let dirty = false;
    let pendingFlush: ReturnType<typeof setTimeout> | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let retryCount = 0;
    const MAX_RETRIES = 5;
    const FLUSH_DEBOUNCE_MS = 300;
    const RETRY_BASE_MS = 500;

    const loadCache = () => {
      if (cache === null) {
        cache = api.loadDataSync() ?? {};

        // One-time migration: if file storage is empty, try to recover
        // data from localStorage (from a previous dev-server session).
        if (Object.keys(cache).length === 0) {
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key) {
                const val = localStorage.getItem(key);
                if (val !== null) cache[key] = val;
              }
            }
            if (Object.keys(cache).length > 0) {
              // Fire-and-forget migration write; don't block
              api.saveData({ ...cache }).catch(() => {});
            }
          } catch {
            // localStorage inaccessible, ignore
          }
        }
      }
      return cache;
    };

    const doSave = async (): Promise<boolean> => {
      if (!dirty || cache === null) return true;
      const snapshot = { ...cache };
      try {
        const ok = await api.saveData(snapshot);
        if (ok) {
          dirty = false;
          retryCount = 0;
          return true;
        }
        // saveData returned false — disk write failed
        return false;
      } catch (e) {
        console.error('[electronStorage] saveData threw:', e);
        return false;
      }
    };

    const scheduleRetry = () => {
      if (retryTimer !== null) clearTimeout(retryTimer);
      if (retryCount >= MAX_RETRIES) {
        console.error(
          `[electronStorage] Write failed ${MAX_RETRIES} times. Data remains in memory but may be lost on exit.`
        );
        return;
      }
      retryCount++;
      const delay = RETRY_BASE_MS * Math.pow(2, retryCount - 1);
      retryTimer = setTimeout(() => {
        flushImmediate();
      }, delay);
    };

    const flushImmediate = async (): Promise<boolean> => {
      if (pendingFlush !== null) {
        clearTimeout(pendingFlush);
        pendingFlush = null;
      }
      const ok = await doSave();
      if (!ok && dirty) {
        scheduleRetry();
      }
      return ok;
    };

    const flushDebounced = () => {
      if (pendingFlush !== null) clearTimeout(pendingFlush);
      pendingFlush = setTimeout(() => {
        pendingFlush = null;
        flushImmediate();
      }, FLUSH_DEBOUNCE_MS);
    };

    // Listen for app-before-quit to force synchronous-ish flush
    api.onBeforeQuit(() => {
      // Best-effort: cancel debounce and try to save immediately.
      // We can't truly block here (renderer IPC is async), but the main
      // process waits 500ms after sending this signal before quitting.
      if (pendingFlush !== null) {
        clearTimeout(pendingFlush);
        pendingFlush = null;
      }
      // Fire the save; don't await (we're in an event handler)
      flushImmediate().catch(() => {});
    });

    return {
      getItem(name: string): StorageValue<unknown> | null {
        const data = loadCache();
        const raw = data[name];
        if (raw === undefined) return null;
        try {
          return JSON.parse(raw) as StorageValue<unknown>;
        } catch {
          return null;
        }
      },
      setItem(name: string, value: StorageValue<unknown>): void {
        loadCache();
        const serialized = JSON.stringify(value);
        if (cache![name] !== serialized) {
          cache![name] = serialized;
          dirty = true;
          flushDebounced();
        }
      },
      removeItem(name: string): void {
        loadCache();
        if (name in cache!) {
          delete cache![name];
          dirty = true;
          flushDebounced();
        }
      },
    };
  }

  // Plain browser / dev-server fallback
  return {
    getItem(name: string): StorageValue<unknown> | null {
      try {
        const raw = localStorage.getItem(name);
        if (raw === null) return null;
        return JSON.parse(raw) as StorageValue<unknown>;
      } catch {
        return null;
      }
    },
    setItem(name: string, value: StorageValue<unknown>): void {
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch {
        // Storage full or unavailable — silently ignore
      }
    },
    removeItem(name: string): void {
      try {
        localStorage.removeItem(name);
      } catch {
        // ignore
      }
    },
  };
}

export const electronStorage = createStorage();

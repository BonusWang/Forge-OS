const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadDataSync: () => ipcRenderer.sendSync('load-data-sync'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  getAppVersion: () => ipcRenderer.sendSync('get-app-version'),
  saveRollback: (data) => ipcRenderer.invoke('save-rollback', data),
  onBeforeQuit: (callback) => ipcRenderer.on('app-before-quit', callback),
});

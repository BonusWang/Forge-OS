const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const fs = require('fs');

const DATA_FILE = path.join(app.getPath('userData'), 'alo-data.json');
const BACKUP_FILE = DATA_FILE + '.bak';
const TEMP_FILE = DATA_FILE + '.tmp';

function readFileSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error(`Failed to read/parse ${filePath}:`, e);
  }
  return null;
}

function readData() {
  // Try primary file first
  let data = readFileSafe(DATA_FILE);
  if (data !== null) return data;

  // Primary corrupted or missing — try backup
  console.warn('Primary data file missing or corrupted, attempting backup recovery...');
  data = readFileSafe(BACKUP_FILE);
  if (data !== null) {
    console.log('Backup recovered successfully.');
    // Restore primary from backup
    try {
      fs.copyFileSync(BACKUP_FILE, DATA_FILE);
    } catch (e) {
      console.error('Failed to restore primary from backup:', e);
    }
    return data;
  }

  console.error('Both primary and backup data files are unavailable.');
  return null;
}

function writeData(data) {
  const json = JSON.stringify(data, null, 2);
  try {
    // Atomic write: write to temp, then rename over primary
    fs.writeFileSync(TEMP_FILE, json, 'utf-8');
    fs.renameSync(TEMP_FILE, DATA_FILE);

    // Create backup copy (best-effort, don't fail primary write if backup fails)
    try {
      fs.copyFileSync(DATA_FILE, BACKUP_FILE);
    } catch (backupErr) {
      console.error('Failed to create backup:', backupErr);
    }

    return true;
  } catch (e) {
    console.error('Failed to write data file:', e);
    // Clean up temp file if it exists
    try {
      if (fs.existsSync(TEMP_FILE)) fs.unlinkSync(TEMP_FILE);
    } catch {
      // ignore cleanup error
    }
    return false;
  }
}

// IPC handlers
ipcMain.handle('save-data', (_event, data) => {
  return writeData(data);
});

ipcMain.on('load-data-sync', (event) => {
  event.returnValue = readData();
});

// Window lifecycle
let mainWindow = null;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'ASCII LIFE OS',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Register custom protocol for serving static resources from inside asar
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.replace('app://', '');
    const filePath = path.normalize(`${__dirname}/../dist/${url}`);
    callback(filePath);
  });
  createWindow();
});

app.on('before-quit', async (event) => {
  if (!isQuitting && mainWindow && !mainWindow.isDestroyed()) {
    isQuitting = true;
    event.preventDefault();

    // Ask renderer to flush pending writes synchronously
    try {
      mainWindow.webContents.send('app-before-quit');
    } catch (e) {
      console.error('Failed to send before-quit to renderer:', e);
    }

    // Give renderer a short window to complete flush, then quit
    setTimeout(() => {
      app.quit();
    }, 500);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

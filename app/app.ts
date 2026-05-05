import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { initializeDatabase } from './backend/infra/database/sqlite';
import { registerProductHandlers } from './backend/controllers/productsController';
import { registerSaleHandlers } from './backend/controllers/salesController';
import { registerBackupHandlers } from './backend/controllers/backupController';


function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: join(__dirname, 'backend', 'preload.js')
    }
  });

  const indexPath = join(__dirname, 'renderer', 'index.html');
  win.loadFile(indexPath);
}

app.whenReady().then(async () => {
  await initializeDatabase();

  registerProductHandlers();
  registerSaleHandlers();
  registerBackupHandlers();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

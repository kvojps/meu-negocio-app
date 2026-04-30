import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { initializeDatabase } from './database/sqlite';
import { createProduct, listProducts } from './repository/productRepository';

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  const indexPath = join(process.cwd(), 'dist', 'renderer', 'index.html');
  win.loadFile(indexPath);
}

app.whenReady().then(async () => {
  await initializeDatabase();

  ipcMain.handle('products:create', async (_e, product) => {
    try {
      const created = createProduct(product);
      return { success: true, product: created };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('products:list', async () => {
    try {
      const items = listProducts();
      return { success: true, products: items };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

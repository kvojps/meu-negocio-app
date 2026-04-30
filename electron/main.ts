import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { initializeDatabase } from './database/sqlite';
import { createProduct, deleteProduct, listProducts, updateProduct } from './repository/productRepository';
import { createSale, deleteSale, getSaleById, listSales } from './repository/saleRepository';
import type { CreateSaleInput } from '../shared/sale';

type ProductInput = {
  name: string;
  description?: string;
  price: number;
};

type ProductUpdatePayload = ProductInput & {
  id: number;
  cost_price: number;
};

type SaleDeletePayload = {
  id: number;
};

type SaleGetByIdPayload = {
  id: number;
};

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

  ipcMain.handle('products:update', async (_event, product: ProductUpdatePayload) => {
    try {
      const updatedAt = updateProduct(product.id, product);
      return { success: true, updated_at: updatedAt };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('products:delete', async (_event, payload: { id: number }) => {
    try {
      deleteProduct(payload.id);
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('sales:create', async (_event, sale: CreateSaleInput) => {
    try {
      const created = createSale(sale);
      return { success: true, sale: created };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('sales:list', async () => {
    try {
      const items = listSales();
      return { success: true, sales: items };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('sales:getById', async (_event, payload: SaleGetByIdPayload) => {
    try {
      const sale = getSaleById(payload.id);
      return { success: true, sale };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle('sales:delete', async (_event, payload: SaleDeletePayload) => {
    try {
      deleteSale(payload.id);
      return { success: true };
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

import { ipcMain } from 'electron';
import { createProduct, deleteProduct, listProducts, updateProduct } from '../repository/productRepository';

type ProductInput = {
  name: string;
  description?: string;
  price: number;
};

type ProductUpdatePayload = ProductInput & {
  id: number;
  cost_price: number;
};

export function registerProductHandlers() {
  ipcMain.handle('products:create', async (_e, product: ProductInput & { cost_price: number }) => {
    try {
      const created = createProduct(product as any);
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
      const updatedAt = updateProduct(product.id, product as any);
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
}

import { ipcMain } from "electron";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "../../shared/product";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../repository/productRepository";

export function registerProductHandlers() {
  ipcMain.handle(
    "products:create",
    async (_event, product: CreateProductInput) => {
      try {
        const created = createProduct(product);
        return { success: true, product: created };
      } catch (err) {
        return { success: false, error: String(err) };
      }
    },
  );

  ipcMain.handle("products:list", async () => {
    try {
      const items = listProducts();
      return { success: true, products: items };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle(
    "products:update",
    async (_event, product: UpdateProductInput) => {
      try {
        const updatedAt = updateProduct(product.id, product);
        return { success: true, updated_at: updatedAt };
      } catch (err) {
        return { success: false, error: String(err) };
      }
    },
  );

  ipcMain.handle("products:delete", async (_event, payload: { id: number }) => {
    try {
      deleteProduct(payload.id);
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });
}

import { ipcMain } from "electron";
import type { CreateSaleInput } from "../../shared/dtos/saleDto";
import {
  createSale,
  deleteSale,
  getSaleById,
  listSales,
} from "../repository/saleRepository";
import { productExists } from "../repository/productRepository";
import { createSaleSchema } from "../../shared/dtos/saleDto";

export function registerSaleHandlers() {
  ipcMain.handle("sales:create", async (_event, saleRaw: unknown) => {
    try {
      const input = createSaleSchema.parse(saleRaw) as CreateSaleInput;

      // check product existence for each item
      for (const item of input.items) {
        if (!productExists(item.product_id)) {
          throw new Error(`Produto ${item.product_id} não encontrado.`);
        }
      }

      const created = createSale(input);
      return { success: true, sale: created };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle("sales:list", async () => {
    try {
      const items = listSales();
      return { success: true, sales: items };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle("sales:getById", async (_event, payload: { id: number }) => {
    try {
      const sale = getSaleById(payload.id);
      return { success: true, sale };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });

  ipcMain.handle("sales:delete", async (_event, payload: { id: number }) => {
    try {
      deleteSale(payload.id);
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  });
}

import { ipcMain } from "electron";
import type { CreateSaleInput } from "../../shared/sale";
import {
  createSale,
  deleteSale,
  getSaleById,
  listSales,
} from "../repository/saleRepository";

export function registerSaleHandlers() {
  ipcMain.handle("sales:create", async (_event, sale: CreateSaleInput) => {
    try {
      const created = createSale(sale);
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

import { ipcMain, IpcMainInvokeEvent } from "electron";
import { ZodError } from "zod";
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
  ipcMain.handle(
    "sales:create",
    async (_event: IpcMainInvokeEvent, saleRaw: CreateSaleInput) => {
      try {
        const input = createSaleSchema.parse(saleRaw) as CreateSaleInput;

        for (const item of input.items) {
          if (!productExists(item.product_id)) {
            throw new Error(`Produto ${item.product_id} não encontrado.`);
          }
        }

        const created = createSale(input);
        return { success: true, sale: created };
      } catch (err) {
        if (err instanceof ZodError) {
          return {
            success: false,
            error: err.issues.map((e) => e.message).join("; "),
          };
        }
        return {
          success: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
  );

  ipcMain.handle("sales:list", async (_event: IpcMainInvokeEvent) => {
    try {
      const items = listSales();
      return { success: true, sales: items };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  });

  ipcMain.handle(
    "sales:getById",
    async (_event: IpcMainInvokeEvent, payload: { id: number }) => {
      try {
        const sale = getSaleById(payload.id);
        return { success: true, sale };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
  );

  ipcMain.handle(
    "sales:delete",
    async (_event: IpcMainInvokeEvent, payload: { id: number }) => {
      try {
        deleteSale(payload.id);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    },
  );
}

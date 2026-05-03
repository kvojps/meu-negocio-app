import { ipcMain, IpcMainInvokeEvent } from "electron";
import { ZodError } from "zod";
import type { ProductInput } from "../../shared/dtos/productDto";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../repository/productRepository";
import {
  createProductSchema,
  updateProductSchema,
} from "../../shared/dtos/productDto";

export function registerProductHandlers() {
  ipcMain.handle(
    "products:create",
    async (_event: IpcMainInvokeEvent, productRaw: ProductInput) => {
      try {
        const input = createProductSchema.parse(productRaw) as ProductInput;
        const created = createProduct(input);
        return { success: true, product: created };
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

  ipcMain.handle("products:list", async (_event: IpcMainInvokeEvent) => {
    try {
      const items = listProducts();
      return { success: true, products: items };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  });

  ipcMain.handle(
    "products:update",
    async (_event: IpcMainInvokeEvent, productRaw: any) => {
      try {
        const parsed = updateProductSchema.parse(productRaw);
        const { id, ...input } = parsed;
        const updatedAt = updateProduct(id, input as ProductInput);
        return { success: true, updated_at: updatedAt };
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

  ipcMain.handle(
    "products:delete",
    async (_event: IpcMainInvokeEvent, payload: { id: number }) => {
      try {
        deleteProduct(payload.id);
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

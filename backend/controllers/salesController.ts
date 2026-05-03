import type { CreateSaleInput } from "../../shared/dtos/saleDto";
import {
  createSale,
  deleteSale,
  getSaleById,
  listSales,
} from "../repository/saleRepository";
import { productExists } from "../repository/productRepository";
import { createSaleSchema } from "../../shared/dtos/saleDto";
import { typedIpcMainHandle } from "../infra/typedIpc";

export function registerSaleHandlers() {
  typedIpcMainHandle<CreateSaleInput, { sale: unknown }>(
    "sales:create",
    async (_event, saleRaw) => {
      const input = createSaleSchema.parse(saleRaw) as CreateSaleInput;

      for (const item of input.items) {
        if (!productExists(item.product_id)) {
          throw new Error(`Produto ${item.product_id} não encontrado.`);
        }
      }

      const created = createSale(input);
      return { sale: created };
    },
  );

  typedIpcMainHandle<void, { sales: unknown[] }>("sales:list", async () => {
    const items = listSales();
    return { sales: items };
  });

  typedIpcMainHandle<{ id: number }, { sale: unknown }>(
    "sales:getById",
    async (_event, payload) => {
      const sale = getSaleById(payload.id);
      return { sale };
    },
  );

  typedIpcMainHandle<{ id: number }, null>(
    "sales:delete",
    async (_event, payload) => {
      deleteSale(payload.id);
      return null;
    },
  );
}

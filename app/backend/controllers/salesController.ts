import type { CreateSaleInput, Sale, SaleWithItems } from "../../shared";
import {
  createSale,
  deleteSale,
  getSaleById,
  listSales,
} from "../repository/saleRepository";
import { productExists } from "../repository/productRepository";
import { createSaleDto } from "../../shared";
import { typedIpcMainHandle } from "../infra/typedIpc";

export function registerSaleHandlers() {
  typedIpcMainHandle<CreateSaleInput, { sale: Sale }>(
    "sales:create",
    async (_event, saleRaw) => {
      const input = createSaleDto.parse(saleRaw) as CreateSaleInput;

      for (const item of input.items) {
        if (!productExists(item.product_id)) {
          throw new Error(`Produto ${item.product_id} não encontrado.`);
        }
      }

      const created = createSale(input);
      return { sale: created };
    },
  );

  typedIpcMainHandle<void, { sales: Sale[] }>("sales:list", async () => {
    const items = listSales();
    return { sales: items };
  });

  typedIpcMainHandle<{ id: number }, { sale: SaleWithItems }>(
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

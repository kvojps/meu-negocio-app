import type { ProductInput, Product } from "../../shared";
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from "../repository/productRepository";
import { createProductSchema, updateProductSchema } from "../../shared";
import { typedIpcMainHandle } from "../infra/typedIpc";

export function registerProductHandlers() {
  typedIpcMainHandle<ProductInput, { product: Product }>(
    "products:create",
    async (_event, productRaw) => {
      const input = createProductSchema.parse(productRaw) as ProductInput;
      const created = createProduct(input);
      return { product: created };
    },
  );

  typedIpcMainHandle<void, { products: Product[] }>(
    "products:list",
    async () => {
      const items = listProducts();
      return { products: items };
    },
  );

  typedIpcMainHandle<ProductInput & { id: number }, { updated_at: string }>(
    "products:update",
    async (_event, productRaw) => {
      const parsed = updateProductSchema.parse(productRaw);
      const { id, ...input } = parsed;
      const updatedAt = updateProduct(id, input as ProductInput);
      return { updated_at: updatedAt };
    },
  );

  typedIpcMainHandle<{ id: number }, null>(
    "products:delete",
    async (_event, payload) => {
      deleteProduct(payload.id);
      return null;
    },
  );
}

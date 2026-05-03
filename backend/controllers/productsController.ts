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
import { typedIpcMainHandle } from "../infra/typedIpc";

export function registerProductHandlers() {
  typedIpcMainHandle<ProductInput, { product: unknown }>(
    "products:create",
    async (_event, productRaw) => {
      const input = createProductSchema.parse(productRaw) as ProductInput;
      const created = createProduct(input);
      return { product: created };
    },
  );

  typedIpcMainHandle<void, { products: unknown[] }>(
    "products:list",
    async () => {
      const items = listProducts();
      return { products: items };
    },
  );

  typedIpcMainHandle<any, { updated_at: unknown }>(
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

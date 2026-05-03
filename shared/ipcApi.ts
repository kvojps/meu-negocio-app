import type { Product } from "./product";
import type { CreateSaleInput } from "./dtos/saleDto";
import type { Sale, SaleWithItems } from "./sale";
import type { ApiResponse } from "./ipcContracts";

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at">;

export type AppApi = {
  createProduct: (
    product: ProductInput,
  ) => Promise<ApiResponse<{ product: Product }>>;
  listProducts: () => Promise<ApiResponse<{ products: Product[] }>>;
  updateProduct: (
    product: ProductInput & { id: number },
  ) => Promise<ApiResponse<{ updated_at: string }>>;
  deleteProduct: (payload: { id: number }) => Promise<ApiResponse<null>>;
  createSale: (sale: CreateSaleInput) => Promise<ApiResponse<{ sale: Sale }>>;
  listSales: () => Promise<ApiResponse<{ sales: Sale[] }>>;
  getSaleById: (payload: {
    id: number;
  }) => Promise<ApiResponse<{ sale: SaleWithItems }>>;
  deleteSale: (payload: { id: number }) => Promise<ApiResponse<null>>;
};

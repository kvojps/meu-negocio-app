import type { Product } from "../models/product";
import type { CreateSaleInput } from "../models/dtos/saleDto";
import type { Sale, SaleWithItems } from "../models/sale";
import type { ApiResponse } from "../contracts/ipcContracts";
import type { ProductInput as ProductDtoInput } from "../models/dtos/productDto";

export type AppApi = {
  createProduct: (
    product: ProductDtoInput,
  ) => Promise<ApiResponse<{ product: Product }>>;
  listProducts: () => Promise<ApiResponse<{ products: Product[] }>>;
  updateProduct: (
    product: ProductDtoInput & { id: number },
  ) => Promise<ApiResponse<{ updated_at: string }>>;
  deleteProduct: (payload: { id: number }) => Promise<ApiResponse<null>>;
  createSale: (sale: CreateSaleInput) => Promise<ApiResponse<{ sale: Sale }>>;
  listSales: () => Promise<ApiResponse<{ sales: Sale[] }>>;
  getSaleById: (payload: {
    id: number;
  }) => Promise<ApiResponse<{ sale: SaleWithItems }>>;
  deleteSale: (payload: { id: number }) => Promise<ApiResponse<null>>;
};

import type { Product } from "../models/product";
import type { ProductStats } from "../models/productStats";
import type { CreateSaleInput } from "../models/dtos/saleDto";
import type { Sale, SaleWithItems } from "../models/sale";
import type { ApiResponse } from "../contracts/ipcContracts";
import type { ProductInput as ProductDtoInput } from "../models/dtos/productDto";
import type { BackupData } from "../models/backup";

export type AppApi = {
  createProduct: (
    product: ProductDtoInput,
  ) => Promise<ApiResponse<{ product: Product }>>;
  listProducts: () => Promise<ApiResponse<{ products: Product[] }>>;
  getProductStats: () => Promise<ApiResponse<{ stats: ProductStats }>>;
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
  exportData: () => Promise<ApiResponse<{ path: string }>>;
  importData: (payload: { data: BackupData }) => Promise<ApiResponse<null>>;
};

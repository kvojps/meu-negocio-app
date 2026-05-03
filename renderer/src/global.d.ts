import type { Product } from '../../shared/product';
import type { CreateSaleInput } from '../../shared/dtos/saleDto';
import type { Sale, SaleWithItems } from '../../shared/sale';

type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

declare global {
  interface Window {
    api: {
      createProduct: (product: ProductInput) => Promise<{
        success: boolean;
        product?: Product;
        error?: string;
      }>;
      listProducts: () => Promise<{
        success: boolean;
        products?: Product[];
        error?: string;
      }>;
      updateProduct: (product: ProductInput & { id: number }) => Promise<{
        success: boolean;
        updated_at?: string;
        error?: string;
      }>;
      deleteProduct: (payload: { id: number }) => Promise<{
        success: boolean;
        error?: string;
      }>;
      createSale: (sale: CreateSaleInput) => Promise<{
        success: boolean;
        sale?: Sale;
        error?: string;
      }>;
      listSales: () => Promise<{
        success: boolean;
        sales?: Sale[];
        error?: string;
      }>;
      getSaleById: (payload: { id: number }) => Promise<{
        success: boolean;
        sale?: SaleWithItems;
        error?: string;
      }>;
      deleteSale: (payload: { id: number }) => Promise<{
        success: boolean;
        error?: string;
      }>;
    };
  }
}

export {};

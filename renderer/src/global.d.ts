import type { Product } from '../../shared/product';

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
    };
  }
}

export {};

import type { Product } from '../../shared/product';

declare global {
  interface Window {
    api: {
      createProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<{
        success: boolean;
        product?: Product;
        error?: string;
      }>;
      listProducts: () => Promise<{
        success: boolean;
        products?: Product[];
        error?: string;
      }>;
    };
  }
}

export {};

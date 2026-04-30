import type { Product } from '../../shared/product';

declare global {
  interface Window {
    api: {
      createProduct: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<{
        success: true;
        product: Product;
      } | {
        success: false;
        error: string;
      }>;
      listProducts: () => Promise<{
        success: true;
        products: Product[];
      } | {
        success: false;
        error: string;
      }>;
    };
  }
}

export {};

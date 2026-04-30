import type { Product } from '../../shared/product';

type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

declare global {
  interface Window {
    api: {
      createProduct: (product: ProductInput) => Promise<{
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
      updateProduct: (product: ProductInput & { id: number }) => Promise<{
        success: true;
        updated_at: string;
      } | {
        success: false;
        error: string;
      }>;
      deleteProduct: (payload: { id: number }) => Promise<{
        success: true;
      } | {
        success: false;
        error: string;
      }>;
    };
  }
}

export {};

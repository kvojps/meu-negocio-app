import type { Product } from '@shared/types/product';
import { createContext, useContext, useMemo, useState } from 'react';
import { mockProducts } from '../mocks/products';

export interface ProductsContextValue {
  products: Product[];
  addProduct: (
    data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  adjustStock: (productId: string, delta: number) => void;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  function addProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const product: Product = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setProducts((prev) => [...prev, product]);
    return product;
  }

  function updateProduct(id: string, data: Partial<Product>) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...data, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function getProductById(id: string) {
    return products.find((p) => p.id === id);
  }

  function adjustStock(productId: string, delta: number) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: Math.max(0, p.stock + delta),
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    );
  }

  const value = useMemo<ProductsContextValue>(
    () => ({
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      adjustStock,
    }),
    [products],
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext(): ProductsContextValue {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error(
      'useProductsContext must be used within a ProductsProvider',
    );
  }
  return ctx;
}

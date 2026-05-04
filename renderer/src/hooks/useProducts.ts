import { useEffect, useState } from 'react';
import type { Product } from '../../../shared';
import type { CreateProductPayload } from '../utils/ui';
import { usePagination } from './usePagination';

type UseProductsResult = {
  // Estado
  products: Product[];
  paginatedProducts: Product[];
  loadingProducts: boolean;
  productError: string;
  productPage: number;
  totalProductPages: number;
  productModalOpen: boolean;
  editingProduct: Product | null;
  // Ações de modal
  openCreateProductModal: () => void;
  openEditProductModal: (product: Product) => void;
  closeProductModal: () => void;
  // Handlers de CRUD
  handleSaveProduct: (product: CreateProductPayload, productId?: number) => Promise<void>;
  handleDeleteProduct: (product: Product) => Promise<void>;
  // Navegação de página
  goToPrevProductPage: () => void;
  goToNextProductPage: () => void;
};

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const {
    page: productPage,
    totalPages: totalProductPages,
    paginatedItems: paginatedProducts,
    goToFirst: goToFirstProductPage,
    goToPrev: goToPrevProductPage,
    goToNext: goToNextProductPage
  } = usePagination(products);

  async function loadProducts() {
    setLoadingProducts(true);
    setProductError('');

    const response = await window.api.listProducts();
    const loadedProducts = response.success ? response.data?.products : undefined;

    if (response.success && loadedProducts) {
      setProducts(loadedProducts);
    } else {
      setProductError(
        response.success
          ? 'Erro ao carregar produtos.'
          : (response.error.message ?? 'Erro ao carregar produtos.')
      );
    }

    setLoadingProducts(false);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  function openCreateProductModal() {
    setEditingProduct(null);
    setProductModalOpen(true);
  }

  function openEditProductModal(product: Product) {
    setEditingProduct(product);
    setProductModalOpen(true);
  }

  function closeProductModal() {
    setProductModalOpen(false);
    setEditingProduct(null);
  }

  async function handleSaveProduct(product: CreateProductPayload, productId?: number) {
    if (productId) {
      const response = await window.api.updateProduct({ id: productId, ...product });
      const updatedAt = response.success ? response.data?.updated_at : undefined;

      if (!response.success || !updatedAt) {
        throw new Error(
          response.success
            ? 'Erro ao atualizar produto.'
            : (response.error.message ?? 'Erro ao atualizar produto.')
        );
      }

      setProducts((current) =>
        current.map((p) => (p.id === productId ? { ...p, ...product, updated_at: updatedAt } : p))
      );
      setProductError('');
      closeProductModal();
      return;
    }

    const response = await window.api.createProduct(product);
    const createdProduct = response.success ? response.data?.product : undefined;

    if (!response.success || !createdProduct) {
      throw new Error(
        response.success
          ? 'Erro ao cadastrar produto.'
          : (response.error.message ?? 'Erro ao cadastrar produto.')
      );
    }

    setProducts((current) => [createdProduct as Product, ...current]);
    setProductError('');
    goToFirstProductPage();
    closeProductModal();
  }

  async function handleDeleteProduct(product: Product) {
    if (!product.id) return;

    const confirmed = window.confirm(`Excluir o produto "${product.name}"?`);
    if (!confirmed) return;

    setProductError('');
    const response = await window.api.deleteProduct({ id: product.id });

    if (!response.success) {
      setProductError(response.error.message ?? 'Erro ao excluir produto.');
      return;
    }

    await loadProducts();
  }

  return {
    products,
    paginatedProducts,
    loadingProducts,
    productError,
    productPage,
    totalProductPages,
    productModalOpen,
    editingProduct,
    openCreateProductModal,
    openEditProductModal,
    closeProductModal,
    handleSaveProduct,
    handleDeleteProduct,
    goToPrevProductPage,
    goToNextProductPage
  };
}

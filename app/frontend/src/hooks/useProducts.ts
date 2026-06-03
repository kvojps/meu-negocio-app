import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product, ProductInput, ProductStats } from "../../../shared";
import { usePagination } from "./usePagination";

type UseProductsResult = {
  products: Product[];
  productStats: ProductStats | null;
  paginatedProducts: Product[];
  loadingProducts: boolean;
  productError: string;
  productPage: number;
  totalProductPages: number;
  productModalOpen: boolean;
  editingProduct: Product | null;
  openCreateProductModal: () => void;
  openEditProductModal: (product: Product) => void;
  closeProductModal: () => void;
  handleSaveProduct: (
    product: ProductInput,
    productId?: number,
  ) => Promise<void>;
  handleDeleteProduct: (product: Product) => Promise<void>;
  goToPrevProductPage: () => void;
  goToNextProductPage: () => void;
};

export function useProducts(): UseProductsResult {
  const queryClient = useQueryClient();
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const {
    data,
    isLoading: loadingProducts,
    error: productsQueryError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const [listResponse, statsResponse] = await Promise.all([
        window.api.listProducts(),
        window.api.getProductStats(),
      ]);

      if (!listResponse.success) {
        throw new Error(
          listResponse.error.message ?? "Erro ao carregar produtos.",
        );
      }

      return {
        products: listResponse.data?.products ?? [],
        stats: statsResponse.success
          ? (statsResponse.data?.stats ?? null)
          : null,
      };
    },
  });

  const products = data?.products ?? [];
  const productStats = data?.stats ?? null;
  const productError =
    productsQueryError instanceof Error ? productsQueryError.message : "";

  const {
    page: productPage,
    totalPages: totalProductPages,
    paginatedItems: paginatedProducts,
    goToFirst: goToFirstProductPage,
    goToPrev: goToPrevProductPage,
    goToNext: goToNextProductPage,
  } = usePagination(products);

  const createProductMutation = useMutation({
    mutationFn: async (product: ProductInput) => {
      const response = await window.api.createProduct(product);
      if (!response.success || !response.data?.product) {
        throw new Error(
          response.success
            ? "Erro ao cadastrar produto."
            : (response.error.message ?? "Erro ao cadastrar produto."),
        );
      }
      return response.data.product;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      goToFirstProductPage();
      closeProductModal();
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...product }: { id: number } & ProductInput) => {
      const response = await window.api.updateProduct({ id, ...product });
      if (!response.success || !response.data?.updated_at) {
        throw new Error(
          response.success
            ? "Erro ao atualizar produto."
            : (response.error.message ?? "Erro ao atualizar produto."),
        );
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
      closeProductModal();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await window.api.deleteProduct({ id });
      if (!response.success) {
        throw new Error(response.error.message ?? "Erro ao excluir produto.");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

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

  async function handleSaveProduct(product: ProductInput, productId?: number) {
    if (productId) {
      await updateProductMutation.mutateAsync({ id: productId, ...product });
    } else {
      await createProductMutation.mutateAsync(product);
    }
  }

  async function handleDeleteProduct(product: Product) {
    if (!product.id) return;
    const confirmed = window.confirm(`Excluir o produto "${product.name}"?`);
    if (!confirmed) return;
    await deleteProductMutation.mutateAsync(product.id);
  }

  return {
    products,
    productStats,
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
    goToNextProductPage,
  };
}

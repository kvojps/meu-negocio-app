import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Sale, SaleWithItems, CreateSaleInput } from "../../../shared";
import { usePagination } from "./usePagination";

type UseSalesResult = {
  sales: Sale[];
  paginatedSales: Sale[];
  loadingSales: boolean;
  salesError: string;
  salePage: number;
  totalSalePages: number;
  saleModalOpen: boolean;
  saleDetailsOpen: boolean;
  saleDetails: SaleWithItems | null;
  saleDetailsStatus: string;
  openSaleModal: () => void;
  closeSaleModal: () => void;
  closeSaleDetails: () => void;
  openSaleDetails: (sale: Sale) => void;
  handleSaveSale: (sale: CreateSaleInput) => Promise<void>;
  handleDeleteSale: (sale: Sale) => Promise<void>;
  goToPrevSalePage: () => void;
  goToNextSalePage: () => void;
};

export function useSales(): UseSalesResult {
  const queryClient = useQueryClient();
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [saleDetailsOpen, setSaleDetailsOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<number | null>(null);

  const {
    data: sales = [],
    isLoading: loadingSales,
    error: salesQueryError,
  } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await window.api.listSales();
      if (!response.success) {
        throw new Error(response.error.message ?? "Erro ao carregar receitas.");
      }
      return response.data?.sales ?? [];
    },
  });

  const salesError =
    salesQueryError instanceof Error ? salesQueryError.message : "";

  const {
    page: salePage,
    totalPages: totalSalePages,
    paginatedItems: paginatedSales,
    goToFirst: goToFirstSalePage,
    goToPrev: goToPrevSalePage,
    goToNext: goToNextSalePage,
  } = usePagination(sales);

  const {
    data: saleDetailsData,
    isLoading: saleDetailsLoading,
    error: saleDetailsError,
  } = useQuery({
    queryKey: ["sale", selectedSaleId],
    queryFn: async () => {
      const response = await window.api.getSaleById({ id: selectedSaleId! });
      if (!response.success || !response.data?.sale) {
        throw new Error(
          response.success
            ? "Erro ao carregar receita."
            : (response.error.message ?? "Erro ao carregar receita."),
        );
      }
      return response.data.sale;
    },
    enabled: selectedSaleId != null,
  });

  const saleDetails = saleDetailsData ?? null;
  const saleDetailsStatus = saleDetailsLoading
    ? "Carregando detalhes..."
    : saleDetailsError instanceof Error
      ? saleDetailsError.message
      : "";

  const createSaleMutation = useMutation({
    mutationFn: async (sale: CreateSaleInput) => {
      const response = await window.api.createSale(sale);
      if (!response.success || !response.data?.sale) {
        throw new Error(
          response.success
            ? "Erro ao registrar receita."
            : (response.error.message ?? "Erro ao registrar receita."),
        );
      }
      return response.data.sale;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sales"] });
      goToFirstSalePage();
      closeSaleModal();
    },
  });

  const deleteSaleMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await window.api.deleteSale({ id });
      if (!response.success) {
        throw new Error(response.error.message ?? "Erro ao excluir receita.");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  function openSaleModal() {
    setSaleModalOpen(true);
  }

  function closeSaleModal() {
    setSaleModalOpen(false);
  }

  function openSaleDetails(sale: Sale) {
    if (!sale.id) return;
    setSelectedSaleId(sale.id);
    setSaleDetailsOpen(true);
  }

  function closeSaleDetails() {
    setSaleDetailsOpen(false);
    setSelectedSaleId(null);
  }

  async function handleSaveSale(sale: CreateSaleInput) {
    await createSaleMutation.mutateAsync(sale);
  }

  async function handleDeleteSale(sale: Sale) {
    if (!sale.id) return;
    const confirmed = window.confirm(`Excluir a receita #${sale.id}?`);
    if (!confirmed) return;

    if (selectedSaleId === sale.id) {
      closeSaleDetails();
    }

    await deleteSaleMutation.mutateAsync(sale.id);
  }

  return {
    sales,
    paginatedSales,
    loadingSales,
    salesError,
    salePage,
    totalSalePages,
    saleModalOpen,
    saleDetailsOpen,
    saleDetails,
    saleDetailsStatus,
    openSaleModal,
    closeSaleModal,
    closeSaleDetails,
    openSaleDetails,
    handleSaveSale,
    handleDeleteSale,
    goToPrevSalePage,
    goToNextSalePage,
  };
}

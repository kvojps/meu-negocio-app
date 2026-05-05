import { useEffect, useState } from 'react';
import type { Product, Sale, SaleWithItems, CreateSaleInput } from '../../../../shared';
import { usePagination } from './usePagination';

type UseSalesResult = {
  // Estado
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
  // Ações de modal
  openSaleModal: () => void;
  closeSaleModal: () => void;
  closeSaleDetails: () => void;
  openSaleDetails: (sale: Sale) => Promise<void>;
  // Handlers de CRUD
  handleSaveSale: (sale: CreateSaleInput) => Promise<void>;
  handleDeleteSale: (sale: Sale, products: Product[]) => Promise<void>;
  // Navegação de página
  goToPrevSalePage: () => void;
  goToNextSalePage: () => void;
};

export function useSales(): UseSalesResult {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [salesError, setSalesError] = useState('');
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [saleDetailsOpen, setSaleDetailsOpen] = useState(false);
  const [saleDetails, setSaleDetails] = useState<SaleWithItems | null>(null);
  const [saleDetailsStatus, setSaleDetailsStatus] = useState('');

  const {
    page: salePage,
    totalPages: totalSalePages,
    paginatedItems: paginatedSales,
    goToFirst: goToFirstSalePage,
    goToPrev: goToPrevSalePage,
    goToNext: goToNextSalePage
  } = usePagination(sales);

  async function loadSales() {
    setLoadingSales(true);
    setSalesError('');

    const response = await window.api.listSales();
    const loadedSales = response.success ? response.data?.sales : undefined;

    if (response.success && loadedSales) {
      setSales(loadedSales);
    } else {
      setSalesError(
        response.success
          ? 'Erro ao carregar receitas.'
          : (response.error.message ?? 'Erro ao carregar receitas.')
      );
    }

    setLoadingSales(false);
  }

  useEffect(() => {
    void loadSales();
  }, []);

  function openSaleModal() {
    setSaleModalOpen(true);
  }

  function closeSaleModal() {
    setSaleModalOpen(false);
  }

  function closeSaleDetails() {
    setSaleDetailsOpen(false);
    setSaleDetails(null);
    setSaleDetailsStatus('');
  }

  async function openSaleDetails(sale: Sale) {
    if (!sale.id) return;

    setSaleDetailsOpen(true);
    setSaleDetails(null);
    setSaleDetailsStatus('Carregando detalhes...');

    const response = await window.api.getSaleById({ id: sale.id });
    const details = response.success ? response.data?.sale : undefined;

    if (response.success && details) {
      setSaleDetails(details);
      setSaleDetailsStatus('');
      return;
    }

    setSaleDetailsStatus(
      response.success
        ? 'Erro ao carregar receita.'
        : (response.error.message ?? 'Erro ao carregar receita.')
    );
  }

  async function handleSaveSale(sale: CreateSaleInput) {
    const response = await window.api.createSale(sale);
    const createdSale = response.success ? response.data?.sale : undefined;

    if (!response.success || !createdSale) {
      throw new Error(
        response.success
          ? 'Erro ao registrar receita.'
          : (response.error.message ?? 'Erro ao registrar receita.')
      );
    }

    setSales((current) => [createdSale as Sale, ...current]);
    setSalesError('');
    goToFirstSalePage();
    closeSaleModal();
  }

  async function handleDeleteSale(sale: Sale, products: Product[]) {
    if (!sale.id) return;

    const confirmed = window.confirm(`Excluir a receita #${sale.id}?`);
    if (!confirmed) return;

    setSalesError('');
    const response = await window.api.deleteSale({ id: sale.id });

    if (!response.success) {
      setSalesError(response.error.message ?? 'Erro ao excluir receita.');
      return;
    }

    if (saleDetails?.id === sale.id) {
      closeSaleDetails();
    }

    void products; // recebido para possível uso futuro (ex: recalcular métricas)
    await loadSales();
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
    goToNextSalePage
  };
}

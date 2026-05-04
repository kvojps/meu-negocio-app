import { useEffect, useState } from 'react';
import type { Product, Sale, SaleWithItems, CreateSaleInput } from '../../shared';
import type { ActiveSection, CreateProductPayload } from './utils/ui';
import { Sidebar } from './components/layout/Sidebar';
import { ProductModal } from './components/products/ProductModal';
import { SaleModal } from './components/sales/SaleModal';
import { SaleDetailsModal } from './components/sales/SaleDetailsModal';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { SalesPage } from './pages/SalesPage';

const ITEMS_PER_PAGE = 8;

export function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productPage, setProductPage] = useState(1);

  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [salesError, setSalesError] = useState('');
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [salePage, setSalePage] = useState(1);
  const [saleDetailsOpen, setSaleDetailsOpen] = useState(false);
  const [saleDetails, setSaleDetails] = useState<SaleWithItems | null>(null);
  const [saleDetailsStatus, setSaleDetailsStatus] = useState('');

  async function loadProducts() {
    setLoadingProducts(true);
    setProductError('');

    const response = await window.api.listProducts();
    const loadedProducts = response.success ? response.data?.products : undefined;

    if (response.success && loadedProducts) {
      setProducts(loadedProducts);
      const nextTotalPages = Math.max(1, Math.ceil(loadedProducts.length / ITEMS_PER_PAGE));
      setProductPage((current) => Math.min(current, nextTotalPages));
    } else {
      setProductError(response.success ? 'Erro ao carregar produtos.' : response.error.message ?? 'Erro ao carregar produtos.');
    }

    setLoadingProducts(false);
  }

  async function loadSales() {
    setLoadingSales(true);
    setSalesError('');

    const response = await window.api.listSales();
    const loadedSales = response.success ? response.data?.sales : undefined;

    if (response.success && loadedSales) {
      setSales(loadedSales);
      const nextTotalPages = Math.max(1, Math.ceil(loadedSales.length / ITEMS_PER_PAGE));
      setSalePage((current) => Math.min(current, nextTotalPages));
    } else {
      setSalesError(response.success ? 'Erro ao carregar receitas.' : response.error.message ?? 'Erro ao carregar receitas.');
    }

    setLoadingSales(false);
  }

  useEffect(() => {
    void loadProducts();
    void loadSales();
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
        throw new Error(response.success ? 'Erro ao atualizar produto.' : response.error.message ?? 'Erro ao atualizar produto.');
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
      throw new Error(response.success ? 'Erro ao cadastrar produto.' : response.error.message ?? 'Erro ao cadastrar produto.');
    }

    setProducts((current) => [createdProduct as Product, ...current]);
    setProductError('');
    setProductPage(1);
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

  async function handleSaveSale(sale: CreateSaleInput) {
    const response = await window.api.createSale(sale);
    const createdSale = response.success ? response.data?.sale : undefined;

    if (!response.success || !createdSale) {
      throw new Error(response.success ? 'Erro ao registrar receita.' : response.error.message ?? 'Erro ao registrar receita.');
    }

    setSales((current) => [createdSale as Sale, ...current]);
    setSalesError('');
    setSalePage(1);
    setSaleModalOpen(false);
  }

  async function handleDeleteSale(sale: Sale) {
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
      setSaleDetailsOpen(false);
      setSaleDetails(null);
      setSaleDetailsStatus('');
    }

    await loadSales();
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

    setSaleDetailsStatus(response.success ? 'Erro ao carregar receita.' : response.error.message ?? 'Erro ao carregar receita.');
  }

  const totalProductPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const totalSalePages = Math.max(1, Math.ceil(sales.length / ITEMS_PER_PAGE));

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <Sidebar
        open={sidebarOpen}
        activeSection={activeSection}
        onToggle={() => setSidebarOpen((current) => !current)}
        onSectionChange={setActiveSection}
      />

      <main className="content">
        {activeSection === 'dashboard' ? (
          <DashboardPage sales={sales} loading={loadingSales} onOpenSale={openSaleDetails} />
        ) : activeSection === 'products' ? (
          <ProductsPage
            products={products}
            loadingProducts={loadingProducts}
            productError={productError}
            productPage={productPage}
            totalProductPages={totalProductPages}
            onCreateProduct={openCreateProductModal}
            onEditProduct={openEditProductModal}
            onDeleteProduct={(p) => void handleDeleteProduct(p)}
            onPreviousPage={() => setProductPage((prev) => Math.max(prev - 1, 1))}
            onNextPage={() => setProductPage((prev) => Math.min(prev + 1, totalProductPages))}
          />
        ) : (
          <SalesPage
            sales={sales}
            loadingSales={loadingSales}
            salesError={salesError}
            products={products}
            salePage={salePage}
            totalSalePages={totalSalePages}
            onCreateSale={() => setSaleModalOpen(true)}
            onOpenSaleDetails={(s) => void openSaleDetails(s)}
            onDeleteSale={(s) => void handleDeleteSale(s)}
            onPreviousPage={() => setSalePage((prev) => Math.max(prev - 1, 1))}
            onNextPage={() => setSalePage((prev) => Math.min(prev + 1, totalSalePages))}
          />
        )}
      </main>

      <ProductModal
        open={productModalOpen}
        product={editingProduct}
        onClose={closeProductModal}
        onSave={handleSaveProduct}
      />
      <SaleModal
        open={saleModalOpen}
        products={products}
        onClose={() => setSaleModalOpen(false)}
        onSave={handleSaveSale}
      />
      <SaleDetailsModal
        open={saleDetailsOpen}
        sale={saleDetails}
        products={products}
        status={saleDetailsStatus}
        onClose={() => {
          setSaleDetailsOpen(false);
          setSaleDetails(null);
          setSaleDetailsStatus('');
        }}
      />
    </div>
  );
}

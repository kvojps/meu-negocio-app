import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ActiveSection } from "./utils/ui";
import { Sidebar } from "./components/layout/Sidebar";
import { ProductModal } from "./components/products/ProductModal";
import { SaleModal } from "./components/sales/SaleModal";
import { SaleDetailsModal } from "./components/sales/SaleDetailsModal";
import { AppRoutes } from "./AppRoutes";
import { useProducts } from "./hooks/useProducts";
import { useSales } from "./hooks/useSales";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

function AppContent() {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
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
    goToNextProductPage,
  } = useProducts();

  const {
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
  } = useSales();

  return (
    <div
      className={`app-shell ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}
    >
      <Sidebar
        open={sidebarOpen}
        activeSection={activeSection}
        onToggle={() => setSidebarOpen((current) => !current)}
        onSectionChange={setActiveSection}
      />

      <main className="content">
        <AppRoutes
          activeSection={activeSection}
          products={products}
          paginatedProducts={paginatedProducts}
          loadingProducts={loadingProducts}
          productError={productError}
          productPage={productPage}
          totalProductPages={totalProductPages}
          onCreateProduct={openCreateProductModal}
          onEditProduct={openEditProductModal}
          onDeleteProduct={(p) => void handleDeleteProduct(p)}
          onPreviousProductPage={goToPrevProductPage}
          onNextProductPage={goToNextProductPage}
          sales={sales}
          paginatedSales={paginatedSales}
          loadingSales={loadingSales}
          salesError={salesError}
          salePage={salePage}
          totalSalePages={totalSalePages}
          onCreateSale={openSaleModal}
          onOpenSaleDetails={openSaleDetails}
          onDeleteSale={(s) => void handleDeleteSale(s)}
          onPreviousSalePage={goToPrevSalePage}
          onNextSalePage={goToNextSalePage}
        />
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
        onClose={closeSaleModal}
        onSave={handleSaveSale}
      />
      <SaleDetailsModal
        open={saleDetailsOpen}
        sale={saleDetails}
        products={products}
        status={saleDetailsStatus}
        onClose={closeSaleDetails}
      />
    </div>
  );
}

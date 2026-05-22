import { useState } from "react";
import type { ActiveSection } from "./utils/ui";
import { Sidebar } from "./components/layout/Sidebar";
import { ProductModal } from "./components/products/ProductModal";
import { SaleModal } from "./components/sales/SaleModal";
import { SaleDetailsModal } from "./components/sales/SaleDetailsModal";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SalesPage } from "./pages/SalesPage";
import { SettingsPage } from "./pages/SettingsPage";
import { useProducts } from "./hooks/useProducts";
import { useSales } from "./hooks/useSales";

export function App() {
  const [activeSection, setActiveSection] =
    useState<ActiveSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
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
        {activeSection === "dashboard" ? (
          <DashboardPage
            sales={sales}
            loading={loadingSales}
            onOpenSale={openSaleDetails}
          />
        ) : activeSection === "products" ? (
          <ProductsPage
            products={products}
            productStats={productStats}
            paginatedProducts={paginatedProducts}
            loadingProducts={loadingProducts}
            productError={productError}
            productPage={productPage}
            totalProductPages={totalProductPages}
            onCreateProduct={openCreateProductModal}
            onEditProduct={openEditProductModal}
            onDeleteProduct={(p) => void handleDeleteProduct(p)}
            onPreviousPage={goToPrevProductPage}
            onNextPage={goToNextProductPage}
          />
        ) : activeSection === "settings" ? (
          <SettingsPage />
        ) : (
          <SalesPage
            sales={sales}
            paginatedSales={paginatedSales}
            loadingSales={loadingSales}
            salesError={salesError}
            products={products}
            salePage={salePage}
            totalSalePages={totalSalePages}
            onCreateSale={openSaleModal}
            onOpenSaleDetails={(s) => void openSaleDetails(s)}
            onDeleteSale={(s) => void handleDeleteSale(s, products)}
            onPreviousPage={goToPrevSalePage}
            onNextPage={goToNextSalePage}
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

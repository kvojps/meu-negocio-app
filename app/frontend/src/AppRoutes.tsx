import type { Product, ProductStats, Sale } from "../../shared";
import type { ActiveSection } from "./utils/ui";
import { DashboardPage } from "./pages/DashboardPage";
import { ProductsPage } from "./pages/ProductsPage";
import { SalesPage } from "./pages/SalesPage";
import { SettingsPage } from "./pages/SettingsPage";

type AppRoutesProps = {
  activeSection: ActiveSection;
  products: Product[];
  productStats: ProductStats | null;
  paginatedProducts: Product[];
  loadingProducts: boolean;
  productError: string;
  productPage: number;
  totalProductPages: number;
  onCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onPreviousProductPage: () => void;
  onNextProductPage: () => void;
  sales: Sale[];
  paginatedSales: Sale[];
  loadingSales: boolean;
  salesError: string;
  salePage: number;
  totalSalePages: number;
  onCreateSale: () => void;
  onOpenSaleDetails: (sale: Sale) => void;
  onDeleteSale: (sale: Sale) => void;
  onPreviousSalePage: () => void;
  onNextSalePage: () => void;
};

export function AppRoutes({
  activeSection,
  products,
  productStats,
  paginatedProducts,
  loadingProducts,
  productError,
  productPage,
  totalProductPages,
  onCreateProduct,
  onEditProduct,
  onDeleteProduct,
  onPreviousProductPage,
  onNextProductPage,
  sales,
  paginatedSales,
  loadingSales,
  salesError,
  salePage,
  totalSalePages,
  onCreateSale,
  onOpenSaleDetails,
  onDeleteSale,
  onPreviousSalePage,
  onNextSalePage,
}: AppRoutesProps) {
  if (activeSection === "dashboard") {
    return (
      <DashboardPage
        sales={sales}
        loading={loadingSales}
        onOpenSale={onOpenSaleDetails}
      />
    );
  }

  if (activeSection === "products") {
    return (
      <ProductsPage
        products={products}
        paginatedProducts={paginatedProducts}
        loadingProducts={loadingProducts}
        productError={productError}
        productPage={productPage}
        totalProductPages={totalProductPages}
        onCreateProduct={onCreateProduct}
        onEditProduct={onEditProduct}
        onDeleteProduct={onDeleteProduct}
        onPreviousPage={onPreviousProductPage}
        onNextPage={onNextProductPage}
        productStats={productStats}
      />
    );
  }

  if (activeSection === "sales") {
    return (
      <SalesPage
        sales={sales}
        paginatedSales={paginatedSales}
        loadingSales={loadingSales}
        salesError={salesError}
        products={products}
        salePage={salePage}
        totalSalePages={totalSalePages}
        onCreateSale={onCreateSale}
        onOpenSaleDetails={onOpenSaleDetails}
        onDeleteSale={onDeleteSale}
        onPreviousPage={onPreviousSalePage}
        onNextPage={onNextSalePage}
      />
    );
  }

  return <SettingsPage />;
}

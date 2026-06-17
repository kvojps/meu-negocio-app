import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from './routes';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { HelpPage } from './pages/help/HelpPage';
import { LogoutPage } from './pages/logout/LogoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import { ProductsPage } from './pages/products/ProductsPage';
import { SalesPage } from './pages/sales/SalesPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { Sidebar } from './components/Sidebar';

export function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate replace to={ROUTES.DASHBOARD} />}
          />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
          <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
          <Route path={ROUTES.SALES} element={<SalesPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.HELP} element={<HelpPage />} />
          <Route path={ROUTES.LOGOUT} element={<LogoutPage />} />
        </Routes>
      </main>
    </div>
  );
}

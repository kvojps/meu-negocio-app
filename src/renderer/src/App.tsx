import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from './routes';

import { DashboardPage } from './pages/dashboard';
import { HelpPage } from './pages/help';
import { LogoutPage } from './pages/logout';
import { OrdersPage } from './pages/orders';
import { ProductsPage } from './pages/products';
import { SalesPage } from './pages/sales';
import { SettingsPage } from './pages/settings';

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

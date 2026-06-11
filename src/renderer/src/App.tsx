import { Navigate, Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/sidebar';
import { DashboardPage } from './pages/dashboard';
import { HelpPage } from './pages/help';
import { LogoutPage } from './pages/logout';
import { OrdersPage } from './pages/orders';
import { ProductsPage } from './pages/products';
import { SalesPage } from './pages/sales';
import { SettingsPage } from './pages/settings';

export function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/logout" element={<LogoutPage />} />
        </Routes>
      </main>
    </div>
  );
}

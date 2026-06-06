import logo32x32 from '../../assets/logo-32x32.svg';
import dashboardIcon from '../../assets/dashboard-icon.svg';
import productIcon from '../../assets/product-icon.svg';
import saleIcon from '../../assets/sale-icon.svg';
import settingIcon from '../../assets/setting-icon.svg';
import orderIcon from '../../assets/order-icon.svg';

import './Styles.css';
const navItems = [
  { key: 'dashboard', icon: dashboardIcon, label: 'Dashboard', active: true },
  { key: 'products', icon: productIcon, label: 'Produtos' },
  { key: 'orders', icon: orderIcon, label: 'Pedidos' },
  { key: 'sales', icon: saleIcon, label: 'Vendas' },
  { key: 'settings', icon: settingIcon, label: 'Configurações' },
];

export function Sidebar() {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-brand">
        <img
          alt=""
          aria-hidden="true"
          className="sidebar-brand-logo"
          src={logo32x32}
          width="32"
          height="32"
        />
        <div className="sidebar-brand-texts">
          <strong className="sidebar-brand-title">Meu Negócio</strong>
          <span className="sidebar-brand-subtitle">Free plan</span>
        </div>
      </div>

      <nav aria-label="Sidebar navigation" className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`sidebar-nav-item ${item.active ? 'sidebar-nav-item--active' : ''}`}
            type="button"
          >
            <img
              alt=""
              aria-hidden="true"
              className="sidebar-nav-icon"
              src={item.icon}
              width="24"
              height="24"
            />
            <span className="sidebar-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

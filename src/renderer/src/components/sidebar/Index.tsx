import logo32x32 from '../../assets/logo-32x32.svg';
import dashboardIcon from '../../assets/dashboard-icon.svg';
import helpIcon from '../../assets/help-icon.svg';
import productIcon from '../../assets/product-icon.svg';
import logoutIcon from '../../assets/logout-icon.svg';
import saleIcon from '../../assets/sale-icon.svg';
import settingIcon from '../../assets/setting-icon.svg';
import orderIcon from '../../assets/order-icon.svg';
import { NavLink } from 'react-router-dom';

import './Styles.css';
const navItems = [
  {
    key: 'dashboard',
    icon: dashboardIcon,
    label: 'Dashboard',
    to: '/dashboard',
  },
  { key: 'products', icon: productIcon, label: 'Produtos', to: '/products' },
  { key: 'orders', icon: orderIcon, label: 'Pedidos', to: '/orders' },
  { key: 'sales', icon: saleIcon, label: 'Vendas', to: '/sales' },
  {
    key: 'settings',
    icon: settingIcon,
    label: 'Configurações',
    to: '/settings',
  },
];

const bottomNavItems = [
  { key: 'help', icon: helpIcon, label: 'Ajuda', to: '/help' },
  { key: 'logout', icon: logoutIcon, label: 'Sair', to: '/logout' },
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

      <div className="sidebar-content">
        <nav aria-label="Sidebar navigation" className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`
              }
              to={item.to}
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
            </NavLink>
          ))}
        </nav>

        <nav
          aria-label="Sidebar support"
          className="sidebar-nav sidebar-nav--bottom"
        >
          {bottomNavItems.map((item) => (
            <NavLink key={item.key} className="sidebar-nav-item" to={item.to}>
              <img
                alt=""
                aria-hidden="true"
                className="sidebar-nav-icon"
                src={item.icon}
                width="24"
                height="24"
              />
              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

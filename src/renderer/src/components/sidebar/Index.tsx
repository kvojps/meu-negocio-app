import logo32x32 from '../../assets/logo-32x32.svg';
import closeSidebarIcon from '../../assets/close-sidebar-icon.svg';
import dashboardIcon from '../../assets/dashboard-icon.svg';
import helpIcon from '../../assets/help-icon.svg';
import productIcon from '../../assets/product-icon.svg';
import logoutIcon from '../../assets/logout-icon.svg';
import openSidebarIcon from '../../assets/open-sidebar-icon.svg';
import saleIcon from '../../assets/sale-icon.svg';
import settingIcon from '../../assets/setting-icon.svg';
import orderIcon from '../../assets/order-icon.svg';
import { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`sidebar-container ${isExpanded ? '' : 'sidebar-container--collapsed'}`}
    >
      <div className="sidebar-brand">
        <div className="sidebar-brand-main">
          {isExpanded ? (
            <img
              alt=""
              aria-hidden="true"
              className="sidebar-brand-logo"
              src={logo32x32}
              width="32"
              height="32"
            />
          ) : (
            <button
              aria-label="Expandir sidebar"
              className="sidebar-brand-toggle"
              onClick={() => setIsExpanded(true)}
              type="button"
            >
              <img
                alt=""
                aria-hidden="true"
                className="sidebar-brand-toggle-icon"
                src={openSidebarIcon}
                width="24"
                height="24"
              />
            </button>
          )}

          <div
            className={`sidebar-brand-texts ${isExpanded ? '' : 'sidebar-brand-texts--collapsed'}`}
          >
            <strong className="sidebar-brand-title">Meu Negócio</strong>
            <span className="sidebar-brand-subtitle">Free plan</span>
          </div>
        </div>

        {isExpanded ? (
          <button
            aria-label="Recolher sidebar"
            className="sidebar-brand-toggle"
            onClick={() => setIsExpanded(false)}
            type="button"
          >
            <img
              alt=""
              aria-hidden="true"
              className="sidebar-brand-toggle-icon"
              src={closeSidebarIcon}
              width="24"
              height="24"
            />
          </button>
        ) : null}
      </div>

      <div className="sidebar-content">
        <nav aria-label="Sidebar navigation" className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''} ${isExpanded ? '' : 'sidebar-nav-item--collapsed'}`
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
              <span
                className={`sidebar-nav-label ${isExpanded ? '' : 'sidebar-nav-label--collapsed'}`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <nav
          aria-label="Sidebar support"
          className="sidebar-nav sidebar-nav--bottom"
        >
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.key}
              className={`sidebar-nav-item ${isExpanded ? '' : 'sidebar-nav-item--collapsed'}`}
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
              <span
                className={`sidebar-nav-label ${isExpanded ? '' : 'sidebar-nav-label--collapsed'}`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

import closeSidebarIcon from '@assets/close-sidebar-icon.svg';
import dashboardIcon from '@assets/dashboard-icon.svg';
import helpIcon from '@assets/help-icon.svg';
import logo32x32 from '@assets/logo-32x32.svg';
import logoutIcon from '@assets/logout-icon.svg';
import openSidebarIcon from '@assets/open-sidebar-icon.svg';
import orderIcon from '@assets/order-icon.svg';
import productIcon from '@assets/product-icon.svg';
import saleIcon from '@assets/sale-icon.svg';
import settingIcon from '@assets/setting-icon.svg';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes';
import './styles.css';

interface NavItem {
  key: string;
  icon: string;
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  {
    key: 'dashboard',
    icon: dashboardIcon,
    label: 'Dashboard',
    to: ROUTES.DASHBOARD,
  },
  {
    key: 'products',
    icon: productIcon,
    label: 'Produtos',
    to: ROUTES.PRODUCTS,
  },
  { key: 'orders', icon: orderIcon, label: 'Pedidos', to: ROUTES.ORDERS },
  { key: 'sales', icon: saleIcon, label: 'Vendas', to: ROUTES.SALES },
  {
    key: 'settings',
    icon: settingIcon,
    label: 'Configurações',
    to: ROUTES.SETTINGS,
  },
];

const bottomNavItems: NavItem[] = [
  { key: 'help', icon: helpIcon, label: 'Ajuda', to: ROUTES.HELP },
  { key: 'logout', icon: logoutIcon, label: 'Sair', to: ROUTES.LOGOUT },
];

function SidebarNavItem({
  item,
  isExpanded,
}: {
  item: NavItem;
  isExpanded: boolean;
}) {
  return (
    <NavLink
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
  );
}

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`sidebar-container ${isExpanded ? '' : 'sidebar-container--collapsed'}`}
    >
      <div className="sidebar-brand">
        <div className="sidebar-brand-main">
          <img
            alt=""
            aria-hidden="true"
            className="sidebar-brand-logo"
            src={logo32x32}
            width="32"
            height="32"
          />
          <div
            className={`sidebar-brand-texts ${isExpanded ? '' : 'sidebar-brand-texts--collapsed'}`}
          >
            <strong className="sidebar-brand-title">Meu Negócio</strong>
            <span className="sidebar-brand-subtitle">Free plan</span>
          </div>
          <button
            aria-label={isExpanded ? 'Recolher sidebar' : 'Expandir sidebar'}
            className="sidebar-brand-toggle"
            onClick={() => setIsExpanded((prev) => !prev)}
            type="button"
          >
            <img
              alt=""
              aria-hidden="true"
              className="sidebar-brand-toggle-icon"
              src={isExpanded ? closeSidebarIcon : openSidebarIcon}
              width="24"
              height="24"
            />
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        <nav aria-label="Sidebar navigation" className="sidebar-nav">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.key}
              item={item}
              isExpanded={isExpanded}
            />
          ))}
        </nav>

        <nav
          aria-label="Sidebar support"
          className="sidebar-nav sidebar-nav--bottom"
        >
          {bottomNavItems.map((item) => (
            <SidebarNavItem
              key={item.key}
              item={item}
              isExpanded={isExpanded}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

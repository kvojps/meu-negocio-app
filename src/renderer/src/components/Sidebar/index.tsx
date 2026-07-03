import logo32x32 from '@assets/logo-32x32.svg';
import {
  DashboardIcon,
  HelpIcon,
  LogoutIcon,
  OrderIcon,
  ProductIcon,
  SaleIcon,
  SettingIcon,
  SidebarToggleIcon,
} from '@components/Icons';
import { useTheme } from '@contexts/ThemeContext';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../routes';
import './styles.css';

interface NavItem {
  key: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  {
    key: 'dashboard',
    icon: DashboardIcon,
    label: 'Dashboard',
    to: ROUTES.DASHBOARD,
  },
  {
    key: 'products',
    icon: ProductIcon,
    label: 'Produtos',
    to: ROUTES.PRODUCTS,
  },
  { key: 'orders', icon: OrderIcon, label: 'Pedidos', to: ROUTES.ORDERS },
  { key: 'sales', icon: SaleIcon, label: 'Vendas', to: ROUTES.SALES },
  {
    key: 'settings',
    icon: SettingIcon,
    label: 'Configurações',
    to: ROUTES.SETTINGS,
  },
];

const bottomNavItems: NavItem[] = [
  { key: 'help', icon: HelpIcon, label: 'Ajuda', to: ROUTES.HELP },
  { key: 'logout', icon: LogoutIcon, label: 'Sair', to: ROUTES.LOGOUT },
];

function SidebarNavItem({
  item,
  isExpanded,
}: {
  item: NavItem;
  isExpanded: boolean;
}) {
  const Icon = item.icon;

  return (
    <NavLink
      className={({ isActive }) =>
        `sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''} ${isExpanded ? '' : 'sidebar-nav-item--collapsed'}`
      }
      to={item.to}
    >
      <span className="sidebar-nav-icon">
        <Icon />
      </span>
      <span
        className={`sidebar-nav-label ${isExpanded ? '' : 'sidebar-nav-label--collapsed'}`}
      >
        {item.label}
      </span>
    </NavLink>
  );
}

function ThemeToggle({ isExpanded }: { isExpanded: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
      className={`sidebar-nav-item ${isExpanded ? '' : 'sidebar-nav-item--collapsed'}`}
      onClick={toggleTheme}
      type="button"
    >
      <span className="sidebar-nav-icon">
        <svg
          fill="none"
          height="24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="24"
        >
          {isDark ? (
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </>
          )}
        </svg>
      </span>
      <span
        className={`sidebar-nav-label ${isExpanded ? '' : 'sidebar-nav-label--collapsed'}`}
      >
        {isDark ? 'Tema claro' : 'Tema escuro'}
      </span>
    </button>
  );
}

const SIDEBAR_STORAGE_KEY = 'meu-negocio-sidebar-expanded';

function readStoredExpanded(): boolean {
  const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
  return stored === null ? true : stored === 'true';
}

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(readStoredExpanded);

  function toggleExpanded() {
    setIsExpanded((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
  }

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
            onClick={toggleExpanded}
            type="button"
          >
            <span
              className="sidebar-brand-toggle-icon"
              style={{ transform: isExpanded ? undefined : 'scaleX(-1)' }}
            >
              <SidebarToggleIcon size={24} />
            </span>
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
          <ThemeToggle isExpanded={isExpanded} />
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

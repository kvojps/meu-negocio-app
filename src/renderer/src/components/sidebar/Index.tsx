import logo32x32 from '../../assets/logo-32x32.svg';
import dashboardIcon from '../../assets/dashboard-icon.svg';
import productIcon from '../../assets/product-icon.svg';
import saleIcon from '../../assets/sale-icon.svg';
import settingIcon from '../../assets/setting-icon.svg';
import orderIcon from '../../assets/order-icon.svg';

import './Styles.css';

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
        <button
          className="sidebar-nav-item sidebar-nav-item--active"
          type="button"
        >
          <img
            alt=""
            aria-hidden="true"
            className="sidebar-nav-icon"
            src={dashboardIcon}
            width="24"
            height="24"
          />
          <span className="sidebar-nav-label">Dashboard</span>
        </button>
        <button
          className="sidebar-nav-item sidebar-nav-item--active"
          type="button"
        >
          <img
            alt=""
            aria-hidden="true"
            className="sidebar-nav-icon"
            src={productIcon}
            width="24"
            height="24"
          />
          <span className="sidebar-nav-label">Produtos</span>
        </button>
        <button
          className="sidebar-nav-item sidebar-nav-item--active"
          type="button"
        >
          <img
            alt=""
            aria-hidden="true"
            className="sidebar-nav-icon"
            src={orderIcon}
            width="24"
            height="24"
          />
          <span className="sidebar-nav-label">Pedidos</span>
        </button>
        <button
          className="sidebar-nav-item sidebar-nav-item--active"
          type="button"
        >
          <img
            alt=""
            aria-hidden="true"
            className="sidebar-nav-icon"
            src={saleIcon}
            width="24"
            height="24"
          />
          <span className="sidebar-nav-label">Vendas</span>
        </button>
        <button
          className="sidebar-nav-item sidebar-nav-item--active"
          type="button"
        >
          <img
            alt=""
            aria-hidden="true"
            className="sidebar-nav-icon"
            src={settingIcon}
            width="24"
            height="24"
          />
          <span className="sidebar-nav-label">Configurações</span>
        </button>
      </nav>
    </aside>
  );
}

import logo32x32 from '../../assets/logo-32x32.svg';
import productIcon from '../../assets/product-icon.svg';

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
            src={productIcon}
            width="24"
            height="24"
          />
          <span className="sidebar-nav-label">Produtos</span>
        </button>
      </nav>
    </aside>
  );
}

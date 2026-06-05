import logo32x32 from '../../assets/logo-32x32.svg';

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
    </aside>
  );
}

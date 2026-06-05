import './Styles.css';

export function Sidebar() {
  return (
    <aside className="sidebar-container">
      <div className="sidebar-brand">
        <svg
          aria-hidden="true"
          className="sidebar-brand-logo"
          viewBox="0 0 32 32"
          width="32"
          height="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" y="0" width="32" height="32" rx="3" fill="#2CBA7A" />
          <text
            x="16"
            y="16"
            fill="#FFFFFF"
            fontSize="20"
            fontWeight="700"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            M
          </text>
        </svg>

        <div className="sidebar-brand-texts">
          <strong className="sidebar-brand-title">Meu Negócio</strong>
          <span className="sidebar-brand-subtitle">Free plan</span>
        </div>
      </div>
    </aside>
  );
}

import type { ReactElement } from "react";
import type { ActiveSection } from "../../utils/ui";

/* ── SVG Icons ── */
function IconDashboard() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <rect x="2" y="2" width="7" height="7" rx="2" />
      <rect x="11" y="2" width="7" height="7" rx="2" />
      <rect x="2" y="11" width="7" height="7" rx="2" />
      <rect x="11" y="11" width="7" height="7" rx="2" />
    </svg>
  );
}

function IconProducts() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2H3V4Z" />
      <path
        fillRule="evenodd"
        d="M3 8h14v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8Zm4 3a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconSales() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M4 4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4Zm5 5a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V9Zm2-1a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1Zm3 1a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function IconBrand() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 0 1-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 0 1 .947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 0 1 2.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 0 1 2.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 0 1 .947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 0 1-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 0 1-2.287-.947ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const NAV_ITEMS: {
  section: ActiveSection;
  label: string;
  Icon: () => ReactElement;
  title: string;
}[] = [
  {
    section: "dashboard",
    label: "Dashboard",
    Icon: IconDashboard,
    title: "Dashboard",
  },
  {
    section: "products",
    label: "Produtos",
    Icon: IconProducts,
    title: "Produtos",
  },
  { section: "sales", label: "Receitas", Icon: IconSales, title: "Receitas" },
  {
    section: "settings",
    label: "Configurações",
    Icon: IconSettings,
    title: "Configurações",
  },
];

type SidebarProps = {
  open: boolean;
  activeSection: ActiveSection;
  onToggle: () => void;
  onSectionChange: (section: ActiveSection) => void;
};

export function Sidebar({
  open,
  activeSection,
  onToggle,
  onSectionChange,
}: SidebarProps) {
  return (
    <aside className={`sidebar ${open ? "expanded" : "collapsed"}`}>
      {/* Toggle */}
      <button
        className="sidebar-toggle"
        type="button"
        onClick={onToggle}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {/* Brand */}
      <div className="sidebar-brand">
        <span className="sidebar-brand-icon" title="Meu Negócio">
          <IconBrand />
        </span>
        <div className="sidebar-brand-text">
          <p className="brand-kicker">Gestão</p>
          <p className="brand-name">Meu Negócio</p>
        </div>
      </div>

      {/* Nav — always rendered, icons visible even when collapsed */}
      <nav className="sidebar-nav" aria-label="Menu lateral">
        {open && <p className="section-label">Menu</p>}
        {NAV_ITEMS.map(({ section, label, Icon, title }) => (
          <button
            key={section}
            className={`sidebar-item ${activeSection === section ? "active" : ""}`}
            type="button"
            title={!open ? title : undefined}
            aria-current={activeSection === section ? "page" : undefined}
            onClick={() => onSectionChange(section)}
          >
            <span className="sidebar-item-icon">
              <Icon />
            </span>
            <span className="sidebar-item-label">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

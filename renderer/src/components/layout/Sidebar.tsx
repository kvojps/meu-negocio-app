import type { ActiveSection } from '../../utils/ui';

type SidebarProps = {
  open: boolean;
  activeSection: ActiveSection;
  onToggle: () => void;
  onSectionChange: (section: ActiveSection) => void;
};

export function Sidebar({ open, activeSection, onToggle, onSectionChange }: SidebarProps) {
  return (
    <aside className={`sidebar ${open ? 'expanded' : 'collapsed'}`}>
      <button
        className="sidebar-toggle"
        type="button"
        onClick={onToggle}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {open ? (
        <div className="sidebar-content">
          <div>
            <p className="brand-kicker">Bussiness Management</p>
            <h1>Menu</h1>
          </div>

          <nav className="sidebar-nav" aria-label="Menu lateral">
            <button
              className={`sidebar-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              type="button"
              onClick={() => onSectionChange('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`sidebar-item ${activeSection === 'products' ? 'active' : ''}`}
              type="button"
              onClick={() => onSectionChange('products')}
            >
              Produtos
            </button>
            <button
              className={`sidebar-item ${activeSection === 'sales' ? 'active' : ''}`}
              type="button"
              onClick={() => onSectionChange('sales')}
            >
              Receitas
            </button>
          </nav>
        </div>
      ) : null}
    </aside>
  );
}

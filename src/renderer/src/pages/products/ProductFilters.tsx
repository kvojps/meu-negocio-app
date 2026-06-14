import { AlertTriangleIcon } from '../../components/Icons';
import type { FilterState } from '../../hooks/products/useProducts';

interface ProductFiltersProps {
  filters: FilterState;
  categories: string[];
  lowStockCount: number;
  onChange: (filters: FilterState) => void;
}

export function ProductFilters({
  filters,
  categories,
  lowStockCount,
  onChange,
}: ProductFiltersProps) {
  return (
    <div className="products-filters">
      <input
        className="products-filters-search"
        placeholder="Buscar por nome..."
        type="text"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      <select
        className="products-filters-select"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">Todas as categorias</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {lowStockCount > 0 && (
        <button
          className={`products-filters-toggle ${filters.lowStockOnly ? 'products-filters-toggle--active' : ''}`}
          onClick={() =>
            onChange({ ...filters, lowStockOnly: !filters.lowStockOnly })
          }
          type="button"
        >
          <AlertTriangleIcon size={16} />
          <span>Estoque baixo</span>
          <span className="products-filters-toggle-badge">{lowStockCount}</span>
        </button>
      )}
    </div>
  );
}

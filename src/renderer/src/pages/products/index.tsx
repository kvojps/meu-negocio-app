import { useMemo } from 'react';
import './styles.css';

import type { SortKey } from '../../hooks/useProducts';
import { useProducts } from '../../hooks/useProducts';

function SortIndicator({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (!direction) return null;
  return <span style={{ marginLeft: 4 }}>{direction === 'asc' ? '▲' : '▼'}</span>;
}

function StockBadge({ stock, minStock }: { stock: number; minStock: number }) {
  let className = 'stock-badge--ok';
  let label = 'OK';

  if (stock <= 0) {
    className = 'stock-badge--low';
    label = 'Sem estoque';
  } else if (stock <= minStock) {
    className = 'stock-badge--warn';
    label = 'Baixo';
  }

  return <span className={`stock-badge ${className}`}>{label}</span>;
}

export function ProductsPage() {
  const {
    products,
    filtered,
    filters,
    sort,
    setFilters,
    toggleSort,
  } = useProducts();

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [products]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const sortableColumns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Nome' },
    { key: 'category', label: 'Categoria' },
    { key: 'supplier', label: 'Fornecedor' },
    { key: 'salePrice', label: 'Preço Venda' },
    { key: 'stock', label: 'Estoque' },
  ];

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-header-title">Produtos</h1>
        <button className="products-header-button" type="button">
          + Novo Produto
        </button>
      </div>

      <div className="products-filters">
        <input
          className="products-filters-search"
          placeholder="Buscar por nome..."
          type="text"
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />
        <select
          className="products-filters-select"
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          className={`products-filters-toggle ${filters.lowStockOnly ? 'products-filters-toggle--active' : ''}`}
          onClick={() =>
            setFilters({ ...filters, lowStockOnly: !filters.lowStockOnly })
          }
          type="button"
        >
          Estoque baixo
        </button>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              {sortableColumns.map((col) => (
                <th
                  key={col.key}
                  className={
                    sort.key === col.key ? 'products-table-th--sorted' : ''
                  }
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}
                  {sort.key === col.key && (
                    <SortIndicator direction={sort.direction} />
                  )}
                </th>
              ))}
              <th className="products-table-th--actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>{product.category}</td>
                <td>{product.supplier}</td>
                <td>{formatCurrency(product.salePrice)}</td>
                <td>
                  <span style={{ marginRight: 8 }}>{product.stock}</span>
                  <StockBadge stock={product.stock} minStock={product.minStock} />
                </td>
                <td className="products-table-cell--actions">
                  <button
                    className="products-table-btn products-table-btn--edit"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    className="products-table-btn products-table-btn--delete"
                    type="button"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="products-table-footer">
          Mostrando {filtered.length} de {products.length} produtos
        </div>
      </div>
    </div>
  );
}

import { SortIndicator } from '../../components/SortIndicator';
import { StockBadge } from '../../components/StockBadge';

import type { Product } from '../../../../shared/types/product';
import type { SortKey, SortState } from '../../hooks/products/useProducts';

interface ProductTableProps {
  filtered: Product[];
  totalCount: number;
  sort: SortState;
  onToggleSort: (key: SortKey) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const sortableColumns: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Nome' },
  { key: 'category', label: 'Categoria' },
  { key: 'supplier', label: 'Fornecedor' },
  { key: 'salePrice', label: 'Preço Venda' },
  { key: 'stock', label: 'Estoque' },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export function ProductTable({
  filtered,
  totalCount,
  sort,
  onToggleSort,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
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
                onClick={() => onToggleSort(col.key)}
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
                  onClick={() => onEdit(product)}
                  type="button"
                >
                  Editar
                </button>
                <button
                  className="products-table-btn products-table-btn--delete"
                  onClick={() => onDelete(product)}
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
        Mostrando {filtered.length} de {totalCount} produtos
      </div>
    </div>
  );
}

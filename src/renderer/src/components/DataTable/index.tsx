import './styles.css';
import { SortIndicator } from '../SortIndicator';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  items: T[];
  totalCount: number;
  start: number;
  sort: { key: string | null; direction: 'asc' | 'desc' };
  onToggleSort?: (key: string) => void;
  renderActions?: (item: T) => React.ReactNode;
  footerLabel: string;
}

export function DataTable<T>({
  columns,
  items,
  totalCount,
  start,
  sort,
  onToggleSort,
  renderActions,
  footerLabel,
}: DataTableProps<T>) {
  return (
    <div className="data-table-card">
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={
                    col.sortable && sort.key === col.key
                      ? 'data-table-th--sorted'
                      : ''
                  }
                  onClick={() => col.sortable && onToggleSort?.(col.key)}
                >
                  {col.label}
                  {col.sortable && sort.key === col.key && (
                    <SortIndicator direction={sort.direction} />
                  )}
                </th>
              ))}
              {renderActions && (
                <th className="data-table-th--actions">Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render(item)}</td>
                ))}
                {renderActions && (
                  <td className="data-table-cell--actions">
                    {renderActions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="data-table-footer">
        {totalCount > 0
          ? `Mostrando ${start + 1}–${start + items.length} de ${totalCount} ${footerLabel}`
          : `Mostrando 0 de 0 ${footerLabel}`}
      </div>
    </div>
  );
}

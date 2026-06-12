import { useMemo } from 'react';

import './styles.css';

import type { OrderStatus } from '../../../../shared/types/order';
import {
  ORDER_STATUS_LABELS,
  getOrderTotal,
} from '../../../../shared/types/order';
import type { OrderSortKey } from '../../hooks/useOrders';
import { useOrders } from '../../hooks/useOrders';

const statusOptions: OrderStatus[] = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
];

function SortIndicator({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (!direction) return null;
  return (
    <span style={{ marginLeft: 4 }}>{direction === 'asc' ? '▲' : '▼'}</span>
  );
}

export function OrdersPage() {
  const { orders, filtered, filters, sort, setFilters, toggleSort } = useOrders(
    () => {},
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));

  const sortableColumns: { key: OrderSortKey; label: string }[] = useMemo(
    () => [
      { key: 'customerName', label: 'Cliente' },
      { key: 'status', label: 'Status' },
      { key: 'total', label: 'Total' },
      { key: 'createdAt', label: 'Data' },
    ],
    [],
  );

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-header-title">Pedidos</h1>
        <button className="orders-header-button" type="button">
          + Novo Pedido
        </button>
      </div>

      <div className="orders-filters">
        <input
          className="orders-filters-search"
          placeholder="Buscar cliente..."
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="orders-filters-select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos os status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              {sortableColumns.map((col) => (
                <th
                  key={col.key}
                  className={
                    sort.key === col.key ? 'orders-table-th--sorted' : ''
                  }
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}
                  {sort.key === col.key && (
                    <SortIndicator direction={sort.direction} />
                  )}
                </th>
              ))}
              <th className="orders-table-th--actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>{order.customerName}</strong>
                </td>
                <td>
                  <span
                    className={`status-badge status-badge--${order.status}`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td>{order.items.length}</td>
                <td>{formatCurrency(getOrderTotal(order))}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td className="orders-table-cell--actions">
                  <button
                    className="orders-table-btn orders-table-btn--view"
                    type="button"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="orders-table-footer">
          Mostrando {filtered.length} de {orders.length} pedidos
        </div>
      </div>
    </div>
  );
}

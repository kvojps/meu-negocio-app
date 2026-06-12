import { SortIndicator } from '../../components/SortIndicator';

import type { Order } from '../../../../shared/types/order';
import {
  ORDER_STATUS_LABELS,
  getOrderTotal,
} from '../../../../shared/types/order';
import type { OrderSortKey, OrderSortState } from '../../hooks/orders/useOrders';

interface OrderTableProps {
  filtered: Order[];
  totalCount: number;
  sort: OrderSortState;
  onToggleSort: (key: OrderSortKey) => void;
  onView: (order: Order) => void;
  onConfirm: (target: {
    type: 'advance' | 'cancel' | 'reopen' | 'delete';
    order: Order;
  }) => void;
}

const sortableColumns: { key: OrderSortKey; label: string }[] = [
  { key: 'customerName', label: 'Cliente' },
  { key: 'status', label: 'Status' },
  { key: 'total', label: 'Total' },
  { key: 'createdAt', label: 'Data' },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));

export function OrderTable({
  filtered,
  totalCount,
  sort,
  onToggleSort,
  onView,
  onConfirm,
}: OrderTableProps) {
  return (
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
                onClick={() => onToggleSort(col.key)}
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
                <span className={`status-badge status-badge--${order.status}`}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </td>
              <td>{order.items.length}</td>
              <td>{formatCurrency(getOrderTotal(order))}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td className="orders-table-cell--actions">
                <button
                  className="orders-table-btn orders-table-btn--view"
                  onClick={() => onView(order)}
                  type="button"
                >
                  Ver
                </button>
                {order.status === 'pending' && (
                  <>
                    <button
                      className="orders-table-btn orders-table-btn--advance"
                      onClick={() => onConfirm({ type: 'advance', order })}
                      type="button"
                    >
                      Avançar
                    </button>
                    <button
                      className="orders-table-btn orders-table-btn--cancel-order"
                      onClick={() => onConfirm({ type: 'cancel', order })}
                      type="button"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {order.status === 'in_progress' && (
                  <>
                    <button
                      className="orders-table-btn orders-table-btn--advance"
                      onClick={() => onConfirm({ type: 'advance', order })}
                      type="button"
                    >
                      Concluir
                    </button>
                    <button
                      className="orders-table-btn orders-table-btn--cancel-order"
                      onClick={() => onConfirm({ type: 'cancel', order })}
                      type="button"
                    >
                      Cancelar
                    </button>
                  </>
                )}
                {order.status === 'completed' && (
                  <button
                    className="orders-table-btn orders-table-btn--revert"
                    onClick={() => onConfirm({ type: 'reopen', order })}
                    type="button"
                  >
                    Reabrir
                  </button>
                )}
                {order.status === 'pending' && (
                  <button
                    className="orders-table-btn orders-table-btn--cancel-order"
                    onClick={() => onConfirm({ type: 'delete', order })}
                    type="button"
                  >
                    Excluir
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="orders-table-footer">
        Mostrando {filtered.length} de {totalCount} pedidos
      </div>
    </div>
  );
}

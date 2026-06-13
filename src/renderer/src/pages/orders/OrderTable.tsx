import { SortIndicator } from '../../components/SortIndicator';
import type { Order, OrderStatus } from '../../../../shared/types/order';
import {
  ORDER_STATUS_LABELS,
  getOrderTotal,
} from '../../../../shared/types/order';
import type {
  OrderSortKey,
  OrderSortState,
} from '../../hooks/orders/useOrders';

interface OrderTableProps {
  filtered: Order[];
  totalCount: number;
  start: number;
  sort: OrderSortState;
  onToggleSort: (key: OrderSortKey) => void;
  onView: (order: Order) => void;
  onStatusChange: (order: Order, newStatus: OrderStatus) => void;
  onConfirm: (target: {
    type: 'advance' | 'cancel' | 'reopen' | 'delete';
    order: Order;
  }) => void;
  readOnly?: boolean;
  hideStatusColumn?: boolean;
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

const ORDER_STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [
  OrderStatus,
  string,
][];

export function OrderTable({
  filtered,
  totalCount,
  start,
  sort,
  onToggleSort,
  onView,
  onStatusChange,
  onConfirm,
  readOnly = false,
  hideStatusColumn = false,
}: OrderTableProps) {
  return (
    <div className="orders-table-wrapper">
      <table className="orders-table">
        <thead>
          <tr>
            <th
              className={
                sort.key === 'customerName' ? 'orders-table-th--sorted' : ''
              }
              onClick={() => onToggleSort('customerName')}
            >
              Cliente
              {sort.key === 'customerName' && (
                <SortIndicator direction={sort.direction} />
              )}
            </th>
            {!hideStatusColumn && (
              <th
                className={
                  sort.key === 'status' ? 'orders-table-th--sorted' : ''
                }
                onClick={() => onToggleSort('status')}
              >
                Status
                {sort.key === 'status' && (
                  <SortIndicator direction={sort.direction} />
                )}
              </th>
            )}
            <th>Itens</th>
            <th
              className={sort.key === 'total' ? 'orders-table-th--sorted' : ''}
              onClick={() => onToggleSort('total')}
            >
              Total
              {sort.key === 'total' && (
                <SortIndicator direction={sort.direction} />
              )}
            </th>
            <th
              className={
                sort.key === 'createdAt' ? 'orders-table-th--sorted' : ''
              }
              onClick={() => onToggleSort('createdAt')}
            >
              Data
              {sort.key === 'createdAt' && (
                <SortIndicator direction={sort.direction} />
              )}
            </th>
            <th className="orders-table-th--actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((order) => (
            <tr key={order.id}>
              <td>
                <strong>{order.customerName}</strong>
              </td>
              {!hideStatusColumn && (
                <td>
                  {readOnly ? (
                    <span
                      className={`status-badge status-badge--${order.status}`}
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  ) : (
                    <select
                      className={`status-badge status-badge--${order.status} status-select`}
                      value={order.status}
                      onChange={(e) =>
                        onStatusChange(order, e.target.value as OrderStatus)
                      }
                    >
                      {ORDER_STATUS_OPTIONS.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
              )}
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
                {!readOnly && order.status === 'pending' && (
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
        {totalCount > 0
          ? `Mostrando ${start + 1}–${start + filtered.length} de ${totalCount} pedidos`
          : 'Mostrando 0 de 0 pedidos'}
      </div>
    </div>
  );
}

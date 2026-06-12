import './styles.css';

import { ORDER_STATUS_LABELS, getOrderTotal } from '../../../../shared/types/order';
import { useOrders } from '../../hooks/useOrders';

export function OrdersPage() {
  const { orders, filtered } = useOrders(() => {});

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));

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
        />
        <select className="orders-filters-select">
          <option value="">Todos os status</option>
        </select>
      </div>

      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Status</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Data</th>
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
                <td className="orders-table-cell--actions">—</td>
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

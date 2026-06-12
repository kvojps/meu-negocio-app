import { useState } from 'react';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import './styles.css';
import type { Order } from '../../../../shared/types/order';
import { useOrderConfirm } from '../../hooks/orders/useOrderConfirm';
import { useOrderForm } from '../../hooks/orders/useOrderForm';
import { useOrders } from '../../hooks/orders/useOrders';
import { useProducts } from '../../hooks/products/useProducts';
import { OrderFilters } from './OrderFilters';
import { OrderFormModal } from './OrderFormModal';
import { OrderTable } from './OrderTable';
import { OrderViewModal } from './OrderViewModal';

export function OrdersPage() {
  const { products, adjustStock } = useProducts();
  const {
    orders,
    filtered,
    filters,
    sort,
    setFilters,
    toggleSort,
    addOrder,
    setOrderStatus,
    deleteOrder,
  } = useOrders(adjustStock);

  const form = useOrderForm(products, addOrder);
  const confirm = useOrderConfirm(setOrderStatus, deleteOrder);
  const [viewTarget, setViewTarget] = useState<Order | null>(null);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-header-title">Pedidos</h1>
        <button
          className="orders-header-button"
          onClick={form.open}
          type="button"
        >
          + Novo Pedido
        </button>
      </div>

      <OrderFilters filters={filters} onChange={setFilters} />

      <OrderTable
        filtered={filtered}
        totalCount={orders.length}
        sort={sort}
        onToggleSort={toggleSort}
        onView={setViewTarget}
        onConfirm={confirm.setConfirmTarget}
      />

      <OrderFormModal form={form} products={products} />

      <OrderViewModal
        viewTarget={viewTarget}
        onClose={() => setViewTarget(null)}
      />

      {confirm.confirmTarget &&
        (() => {
          const { title, message, confirmLabel, danger } = confirm.buildProps();
          return (
            <ConfirmDialog
              open
              title={title}
              onConfirm={confirm.handleAction}
              onCancel={() => confirm.setConfirmTarget(null)}
              confirmLabel={confirmLabel}
              danger={danger}
            >
              {message}
            </ConfirmDialog>
          );
        })()}
    </div>
  );
}

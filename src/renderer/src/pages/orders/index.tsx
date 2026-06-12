import { useState } from 'react';

import './styles.css';

import type { Order } from '../../../../shared/types/order';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { OrderFilters } from './OrderFilters';
import { OrderTable } from './OrderTable';
import { OrderFormModal } from './OrderFormModal';
import { OrderViewModal } from './OrderViewModal';
import { useOrderForm } from './useOrderForm';
import { useOrderConfirm } from './useOrderConfirm';

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
          const { title, message, confirmLabel, danger } =
            confirm.buildProps();
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

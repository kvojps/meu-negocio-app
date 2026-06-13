import { useMemo, useState } from 'react';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Pagination } from '../../components/Pagination';
import './styles.css';
import type { Order, OrderStatus } from '../../../../shared/types/order';
import { useOrderConfirm } from '../../hooks/orders/useOrderConfirm';
import { useOrderForm } from '../../hooks/orders/useOrderForm';
import { useOrders } from '../../hooks/orders/useOrders';
import { useProducts } from '../../hooks/products/useProducts';
import { usePagination } from '../../hooks/usePagination';
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
    updateOrder,
    setOrderStatus,
    deleteOrder,
  } = useOrders(adjustStock);

  const form = useOrderForm(products, addOrder, updateOrder);
  const confirm = useOrderConfirm(setOrderStatus, deleteOrder);
  const [viewTarget, setViewTarget] = useState<Order | null>(null);

  const activeOrders = useMemo(
    () => filtered.filter((o) => o.status !== 'completed'),
    [filtered],
  );

  const { page, setPage, totalPages, paginatedItems, start } = usePagination(
    activeOrders,
    10,
  );

  function handleStatusChange(order: Order, newStatus: OrderStatus) {
    if (newStatus === order.status) return;
    confirm.setConfirmTarget({ type: 'status_change', order, newStatus });
  }

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

      <OrderFilters
        filters={filters}
        onChange={setFilters}
        hideStatuses={['completed']}
      />

      <OrderTable
        filtered={paginatedItems}
        totalCount={activeOrders.length}
        start={start}
        sort={sort}
        onToggleSort={toggleSort}
        onView={setViewTarget}
        onEdit={form.openForEdit}
        onStatusChange={handleStatusChange}
        onConfirm={confirm.setConfirmTarget}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
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

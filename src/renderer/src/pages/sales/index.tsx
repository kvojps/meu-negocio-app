import { useMemo, useState } from 'react';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Pagination } from '../../components/Pagination';
import '../orders/styles.css';
import type { Order } from '../../../../shared/types/order';
import { useOrderConfirm } from '../../hooks/orders/useOrderConfirm';
import { useOrders } from '../../hooks/orders/useOrders';
import { usePagination } from '../../hooks/usePagination';
import { OrderFilters } from '../orders/OrderFilters';
import { OrderTable } from '../orders/OrderTable';
import { OrderViewModal } from '../orders/OrderViewModal';

export function SalesPage() {
  const {
    filtered,
    filters,
    sort,
    setFilters,
    toggleSort,
    setOrderStatus,
    deleteOrder,
  } = useOrders(() => {});

  const confirm = useOrderConfirm(setOrderStatus, deleteOrder);
  const [viewTarget, setViewTarget] = useState<Order | null>(null);

  const completedOrders = useMemo(
    () => filtered.filter((o) => o.status === 'completed'),
    [filtered],
  );

  const { page, setPage, totalPages, paginatedItems, start } = usePagination(
    completedOrders,
    10,
  );

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-header-title">Vendas</h1>
      </div>

      <OrderFilters filters={filters} onChange={setFilters} hideStatusFilter />

      <OrderTable
        filtered={paginatedItems}
        totalCount={completedOrders.length}
        start={start}
        sort={sort}
        onToggleSort={toggleSort}
        onView={setViewTarget}
        onStatusChange={() => {}}
        onConfirm={confirm.setConfirmTarget}
        readOnly
        hideStatusColumn
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <OrderViewModal
        viewTarget={viewTarget}
        onClose={() => setViewTarget(null)}
        title="Detalhes da Venda"
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

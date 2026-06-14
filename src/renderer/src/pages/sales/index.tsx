import { useMemo, useState } from 'react';
import { ActionsMenu } from '../../components/ActionsMenu';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { Pagination } from '../../components/Pagination';
import '../orders/styles.css';
import type { Order } from '../../../../shared/types/order';
import { getOrderTotal } from '../../../../shared/types/order';
import { useOrderConfirm } from '../../hooks/orders/useOrderConfirm';
import type { OrderSortKey } from '../../hooks/orders/useOrders';
import { useOrders } from '../../hooks/orders/useOrders';
import { usePagination } from '../../hooks/usePagination';
import { OrderFilters } from '../orders/OrderFilters';
import { OrderViewModal } from '../orders/OrderViewModal';
import { SalesCards } from './SalesCards';

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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));

  const columns: Column<Order>[] = useMemo(
    () => [
      {
        key: 'customerName',
        label: 'Cliente',
        sortable: true,
        render: (o: Order) => <strong>{o.customerName}</strong>,
      },
      {
        key: 'items',
        label: 'Itens',
        sortable: false,
        render: (o: Order) => o.items.length,
      },
      {
        key: 'total',
        label: 'Total',
        sortable: true,
        render: (o: Order) => formatCurrency(getOrderTotal(o)),
      },
      {
        key: 'createdAt',
        label: 'Data',
        sortable: true,
        render: (o: Order) => formatDate(o.createdAt),
      },
    ],
    [],
  );

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-header-title">Vendas</h1>
      </div>

      <OrderFilters
        filters={filters}
        onChange={setFilters}
        hideStatusFilter
        showDateFilter
      />

      <SalesCards completedOrders={completedOrders} />

      <DataTable
        columns={columns}
        items={paginatedItems}
        totalCount={completedOrders.length}
        start={start}
        sort={sort}
        onToggleSort={(key) => toggleSort(key as OrderSortKey)}
        renderActions={(order: Order) => (
          <ActionsMenu onView={() => setViewTarget(order)} />
        )}
        footerLabel="vendas"
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

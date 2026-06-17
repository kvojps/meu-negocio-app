import { ActionsMenu } from '@components/ActionsMenu';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { DataTable } from '@components/DataTable';
import type { Column } from '@components/DataTable';
import { useOrderConfirm } from '@hooks/orders/useOrderConfirm';
import { useOrderForm } from '@hooks/orders/useOrderForm';
import type { OrderSortKey } from '@hooks/orders/useOrders';
import { useOrders } from '@hooks/orders/useOrders';
import { useProducts } from '@hooks/products/useProducts';
import { usePagination } from '@hooks/use-pagination/usePagination';
import type { Order, OrderStatus } from '@shared/types/order';
import { ORDER_STATUS_LABELS, getOrderTotal } from '@shared/types/order';
import { useMemo, useState } from 'react';
import { OrderFilters } from './components/OrderFilters';
import { OrderFormModal } from './components/OrderFormModal';
import { OrderViewModal } from './components/OrderViewModal';
import './styles.css';

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

  const columns: Column<Order>[] = useMemo(
    () => [
      {
        key: 'customerName',
        label: 'Cliente',
        sortable: true,
        render: (o: Order) => <strong>{o.customerName}</strong>,
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (o: Order) => (
          <select
            className={`status-badge status-badge--${o.status} status-select`}
            value={o.status}
            onChange={(e) =>
              handleStatusChange(o, e.target.value as OrderStatus)
            }
          >
            {ORDER_STATUS_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ),
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
    [handleStatusChange],
  );

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

      <DataTable
        columns={columns}
        items={paginatedItems}
        totalCount={activeOrders.length}
        start={start}
        sort={sort}
        onToggleSort={(key) => toggleSort(key as OrderSortKey)}
        renderActions={(order: Order) => (
          <ActionsMenu
            onView={() => setViewTarget(order)}
            onEdit={
              order.status === 'pending'
                ? () => form.openForEdit(order)
                : undefined
            }
            onDelete={
              order.status === 'pending'
                ? () => confirm.setConfirmTarget({ type: 'delete', order })
                : undefined
            }
          />
        )}
        footerLabel="pedidos"
        pagination={{ currentPage: page, totalPages, onPageChange: setPage }}
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

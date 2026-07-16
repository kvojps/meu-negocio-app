import { Stack } from '@mui/material';
import { useMemo, useState } from 'react';
import type { Order } from '@shared/types/order';
import {
  PAYMENT_STATUS_COLOR,
  PAYMENT_STATUS_LABELS,
  getOrderPaymentStatus,
  getOrderProfit,
  getOrderTotal,
} from '@shared/types/order';
import { ActionsMenu } from '@/components/ActionsMenu';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import type { Column } from '@/components/DataTable';
import { SaleIcon } from '@/components/Icons';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useOrderConfirm } from '@/hooks/orders/useOrderConfirm';
import type { OrderSortKey } from '@/hooks/orders/useOrders';
import { useOrders } from '@/hooks/orders/useOrders';
import { usePagination } from '@/hooks/usePagination';
import { MonthRangeFilter } from '../dashboard/components/MonthRangeFilter';
import { OrderFilters } from '../orders/components/OrderFilters';
import { OrderViewModal } from '../orders/components/OrderViewModal';
import { PaymentModal } from './components/PaymentModal';
import { SalesCards } from './components/SalesCards';

export function SalesPage() {
  const {
    orders,
    filtered,
    filters,
    sort,
    setFilters,
    toggleSort,
    setOrderStatus,
    setOrderPaymentAmount,
    deleteOrder,
  } = useOrders();

  const confirm = useOrderConfirm(setOrderStatus, deleteOrder);
  const [viewTarget, setViewTarget] = useState<Order | null>(null);
  const [paymentTarget, setPaymentTarget] = useState<Order | null>(null);

  const completedOrders = useMemo(
    () => filtered.filter((o) => o.status === 'completed'),
    [filtered],
  );

  const { page, setPage, totalPages, paginatedItems, start } = usePagination(completedOrders, 10);

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
        key: 'profit',
        label: 'Lucro',
        sortable: false,
        render: (o: Order) => formatCurrency(getOrderProfit(o)),
      },
      {
        key: 'paymentStatus',
        label: 'Pagamento',
        sortable: false,
        render: (o: Order) => {
          const paymentStatus = getOrderPaymentStatus(o);
          return (
            <StatusChip
              label={PAYMENT_STATUS_LABELS[paymentStatus]}
              color={PAYMENT_STATUS_COLOR[paymentStatus]}
            />
          );
        },
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
    <Stack spacing={2}>
      <PageHeader
        icon={<SaleIcon />}
        title="Vendas"
        subtitle="Indicadores e histórico de pedidos concluídos"
      />

      <OrderFilters filters={filters} onChange={setFilters} hideStatusFilter showPaymentFilter>
        <MonthRangeFilter orders={orders} filters={filters} onChange={setFilters} embedded />
      </OrderFilters>

      <SalesCards completedOrders={completedOrders} />

      <DataTable
        columns={columns}
        items={paginatedItems}
        totalCount={completedOrders.length}
        start={start}
        sort={sort}
        onToggleSort={(key) => toggleSort(key as OrderSortKey)}
        renderActions={(order: Order) => (
          <ActionsMenu
            onView={() => setViewTarget(order)}
            onPayment={() => setPaymentTarget(order)}
            onDelete={() => confirm.setConfirmTarget({ type: 'delete', order })}
          />
        )}
        getRowKey={(order) => order.id}
        footerLabel="vendas"
        emptyMessage="Nenhuma venda concluída ainda."
        pagination={{ currentPage: page, totalPages, onPageChange: setPage }}
      />

      <OrderViewModal
        viewTarget={viewTarget}
        onClose={() => setViewTarget(null)}
        title="Detalhes da Venda"
      />

      <PaymentModal
        order={paymentTarget}
        onClose={() => setPaymentTarget(null)}
        onSave={setOrderPaymentAmount}
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
    </Stack>
  );
}

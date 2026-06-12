import { useMemo, useState } from 'react';

import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Modal } from '../../components/Modal';
import { SortIndicator } from '../../components/SortIndicator';

import './styles.css';

import type { Order, OrderStatus } from '../../../../shared/types/order';
import {
  ORDER_STATUS_LABELS,
  getOrderTotal,
} from '../../../../shared/types/order';
import type { OrderSortKey } from '../../hooks/useOrders';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';

const statusOptions: OrderStatus[] = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
];

interface FormItem {
  productId: string;
  productName: string;
  quantity: string;
  unitPrice: string;
}

function emptyFormItem(): FormItem {
  return { productId: '', productName: '', quantity: '1', unitPrice: '' };
}

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

  const [formOpen, setFormOpen] = useState(false);
  const [formCustomer, setFormCustomer] = useState('');
  const [formItems, setFormItems] = useState<FormItem[]>([emptyFormItem()]);
  const [formManualEnabled, setFormManualEnabled] = useState(false);
  const [formManualTotal, setFormManualTotal] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [viewTarget, setViewTarget] = useState<Order | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{
    type: 'advance' | 'cancel' | 'reopen' | 'delete';
    order: Order;
  } | null>(null);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));

  const sortableColumns: { key: OrderSortKey; label: string }[] = useMemo(
    () => [
      { key: 'customerName', label: 'Cliente' },
      { key: 'status', label: 'Status' },
      { key: 'total', label: 'Total' },
      { key: 'createdAt', label: 'Data' },
    ],
    [],
  );

  const formCalculatedTotal = formItems.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );

  const formDisplayTotal = formManualEnabled
    ? Number(formManualTotal) || 0
    : formCalculatedTotal;

  function handleOpenForm() {
    setFormCustomer('');
    setFormItems([emptyFormItem()]);
    setFormManualEnabled(false);
    setFormManualTotal('');
    setFormErrors({});
    setFormOpen(true);
  }

  function handleCloseForm() {
    setFormOpen(false);
    setFormErrors({});
  }

  function handleConfirmAction() {
    if (!confirmTarget) return;

    const { type, order } = confirmTarget;

    switch (type) {
      case 'advance':
        if (order.status === 'pending') setOrderStatus(order.id, 'in_progress');
        else if (order.status === 'in_progress')
          setOrderStatus(order.id, 'completed');
        break;
      case 'cancel':
        setOrderStatus(order.id, 'cancelled');
        break;
      case 'reopen':
        setOrderStatus(order.id, 'in_progress');
        break;
      case 'delete':
        deleteOrder(order.id);
        break;
    }

    setConfirmTarget(null);
  }

  function handleAddItem() {
    setFormItems((prev) => [...prev, emptyFormItem()]);
  }

  function handleRemoveItem(index: number) {
    setFormItems((prev) => prev.filter((_, i) => i !== index));
  }

  function handleItemChange(
    index: number,
    field: keyof FormItem,
    value: string,
  ) {
    setFormItems((prev) => {
      const next = [...prev];
      const item = { ...next[index] };

      if (field === 'productId') {
        const product = products.find((p) => p.id === value);
        item.productId = value;
        item.productName = product ? product.name : '';
        item.unitPrice = product ? String(product.salePrice) : '';
      } else if (field === 'quantity') {
        item.quantity = value;
      } else if (field === 'unitPrice') {
        item.unitPrice = value;
      }

      next[index] = item;
      return next;
    });
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};
    if (!formCustomer.trim()) errors.customer = 'Nome do cliente é obrigatório';
    if (formItems.length === 0) errors.items = 'Adicione pelo menos um item';

    formItems.forEach((item, i) => {
      if (!item.productId) errors[`item_${i}_product`] = 'Selecione um produto';
      if (!item.quantity || Number(item.quantity) <= 0)
        errors[`item_${i}_qty`] = 'Quantidade inválida';
      if (!item.unitPrice || Number(item.unitPrice) < 0)
        errors[`item_${i}_price`] = 'Preço inválido';
    });

    if (formManualEnabled && (!formManualTotal || Number(formManualTotal) < 0))
      errors.manualTotal = 'Valor inválido';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSaveOrder() {
    if (!validateForm()) return;

    addOrder({
      customerName: formCustomer.trim(),
      status: 'pending',
      items: formItems.map((item) => ({
        id: crypto.randomUUID(),
        productId: item.productId,
        productName: item.productName,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      manualTotal: formManualEnabled ? Number(formManualTotal) : undefined,
    });

    handleCloseForm();
  }

  function buildConfirmProps(): {
    title: string;
    message: string;
    confirmLabel: string;
    danger: boolean;
  } {
    const { type, order } = confirmTarget!;

    switch (type) {
      case 'advance': {
        const next = order.status === 'pending' ? 'Em andamento' : 'Concluído';
        return {
          title: `Avançar para "${next}"`,
          message: `Tem certeza que deseja avançar o pedido de ${order.customerName} para "${next}"?`,
          confirmLabel: `Avançar para "${next}"`,
          danger: false,
        };
      }
      case 'cancel':
        return {
          title: 'Cancelar Pedido',
          message: `Tem certeza que deseja cancelar o pedido de ${order.customerName}?`,
          confirmLabel: 'Confirmar Cancelamento',
          danger: false,
        };
      case 'reopen':
        return {
          title: 'Reabrir Pedido',
          message: `Tem certeza que deseja reabrir o pedido de ${order.customerName}? O estoque será devolvido.`,
          confirmLabel: 'Reabrir Pedido',
          danger: false,
        };
      case 'delete':
        return {
          title: 'Excluir Pedido',
          message: `Tem certeza que deseja excluir o pedido de ${order.customerName}? Esta ação não pode ser desfeita.`,
          confirmLabel: 'Confirmar Exclusão',
          danger: true,
        };
    }
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-header-title">Pedidos</h1>
        <button
          className="orders-header-button"
          onClick={handleOpenForm}
          type="button"
        >
          + Novo Pedido
        </button>
      </div>

      <div className="orders-filters">
        <input
          className="orders-filters-search"
          placeholder="Buscar cliente..."
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="orders-filters-select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos os status</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

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
                  onClick={() => toggleSort(col.key)}
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
                  <span
                    className={`status-badge status-badge--${order.status}`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td>{order.items.length}</td>
                <td>{formatCurrency(getOrderTotal(order))}</td>
                <td>{formatDate(order.createdAt)}</td>
                <td className="orders-table-cell--actions">
                  <button
                    className="orders-table-btn orders-table-btn--view"
                    onClick={() => setViewTarget(order)}
                    type="button"
                  >
                    Ver
                  </button>
                  {order.status === 'pending' && (
                    <>
                      <button
                        className="orders-table-btn orders-table-btn--advance"
                        onClick={() =>
                          setConfirmTarget({ type: 'advance', order })
                        }
                        type="button"
                      >
                        Avançar
                      </button>
                      <button
                        className="orders-table-btn orders-table-btn--cancel-order"
                        onClick={() =>
                          setConfirmTarget({ type: 'cancel', order })
                        }
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
                        onClick={() =>
                          setConfirmTarget({ type: 'advance', order })
                        }
                        type="button"
                      >
                        Concluir
                      </button>
                      <button
                        className="orders-table-btn orders-table-btn--cancel-order"
                        onClick={() =>
                          setConfirmTarget({ type: 'cancel', order })
                        }
                        type="button"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {order.status === 'completed' && (
                    <button
                      className="orders-table-btn orders-table-btn--revert"
                      onClick={() =>
                        setConfirmTarget({ type: 'reopen', order })
                      }
                      type="button"
                    >
                      Reabrir
                    </button>
                  )}
                  {order.status === 'pending' && (
                    <button
                      className="orders-table-btn orders-table-btn--cancel-order"
                      onClick={() =>
                        setConfirmTarget({ type: 'delete', order })
                      }
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
          Mostrando {filtered.length} de {orders.length} pedidos
        </div>
      </div>

      <Modal
        open={formOpen}
        onClose={handleCloseForm}
        title="Novo Pedido"
        maxWidth="600px"
        footer={
          <>
            <button
              className="modal-btn modal-btn--cancel"
              onClick={handleCloseForm}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="modal-btn modal-btn--confirm"
              onClick={handleSaveOrder}
              type="button"
            >
              Criar Pedido
            </button>
          </>
        }
      >
        <div className="orders-form">
          <div className="orders-form-field">
            <label className="orders-form-label orders-form-label--required">
              Cliente
            </label>
            <input
              className={`orders-form-input ${formErrors.customer ? 'orders-form-input--error' : ''}`}
              placeholder="Nome do cliente"
              type="text"
              value={formCustomer}
              onChange={(e) => setFormCustomer(e.target.value)}
            />
            {formErrors.customer && (
              <span className="orders-form-error">{formErrors.customer}</span>
            )}
          </div>

          <div className="orders-items-section">
            <div className="orders-items-header">
              <h3 className="orders-items-title">Itens</h3>
              <button
                className="orders-items-add"
                onClick={handleAddItem}
                type="button"
              >
                + Adicionar Item
              </button>
            </div>

            {formItems.map((item, index) => (
              <div className="orders-item-row" key={index}>
                <div className="orders-item-row-select">
                  <select
                    className={`orders-form-input ${formErrors[`item_${index}_product`] ? 'orders-form-input--error' : ''}`}
                    style={{ width: '100%' }}
                    value={item.productId}
                    onChange={(e) =>
                      handleItemChange(index, 'productId', e.target.value)
                    }
                  >
                    <option value="">Selecionar produto...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatCurrency(p.salePrice)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="orders-item-row-input">
                  <input
                    className={`orders-form-input ${formErrors[`item_${index}_qty`] ? 'orders-form-input--error' : ''}`}
                    min="1"
                    step="1"
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, 'quantity', e.target.value)
                    }
                  />
                </div>
                <div className="orders-item-row-input">
                  <input
                    className={`orders-form-input ${formErrors[`item_${index}_price`] ? 'orders-form-input--error' : ''}`}
                    min="0"
                    step="0.01"
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, 'unitPrice', e.target.value)
                    }
                  />
                </div>
                <span className="orders-item-row-price">
                  {formatCurrency(
                    (Number(item.quantity) || 0) *
                      (Number(item.unitPrice) || 0),
                  )}
                </span>
                <button
                  className="orders-item-row-remove"
                  disabled={formItems.length <= 1}
                  onClick={() => handleRemoveItem(index)}
                  style={{
                    opacity: formItems.length <= 1 ? 0.3 : 1,
                  }}
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
            {formErrors.items && (
              <span className="orders-form-error">{formErrors.items}</span>
            )}
          </div>

          <div className="orders-total-row">
            <div className="orders-manual-toggle">
              <input
                checked={formManualEnabled}
                id="manual-total-toggle"
                type="checkbox"
                onChange={(e) => setFormManualEnabled(e.target.checked)}
              />
              <label htmlFor="manual-total-toggle">Valor personalizado</label>
            </div>

            {formManualEnabled ? (
              <input
                className={`orders-form-input orders-manual-input ${formErrors.manualTotal ? 'orders-form-input--error' : ''}`}
                min="0"
                step="0.01"
                type="number"
                value={formManualTotal}
                onChange={(e) => setFormManualTotal(e.target.value)}
              />
            ) : null}

            <span className="orders-total-label">Total:</span>
            <span className="orders-total-value">
              {formatCurrency(formDisplayTotal)}
            </span>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Detalhes do Pedido"
        maxWidth="600px"
        footer={
          <button
            className="modal-btn modal-btn--cancel"
            onClick={() => setViewTarget(null)}
            type="button"
          >
            Fechar
          </button>
        }
      >
        {viewTarget && (
          <>
            <div className="orders-details-info">
              <span>
                <strong>Cliente:</strong> {viewTarget.customerName}
              </span>
              <span>
                <strong>Status:</strong>{' '}
                <span
                  className={`status-badge status-badge--${viewTarget.status}`}
                >
                  {ORDER_STATUS_LABELS[viewTarget.status]}
                </span>
              </span>
              <span>
                <strong>Data:</strong> {formatDate(viewTarget.createdAt)}
              </span>
            </div>

            <table className="orders-details-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Qtd</th>
                  <th>Preço Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {viewTarget.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{formatCurrency(item.quantity * item.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="orders-details-total">
              {viewTarget.manualTotal !== undefined && (
                <span
                  style={{
                    color: '#9ca3af',
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    marginRight: 8,
                  }}
                >
                  (valor personalizado)
                </span>
              )}
              Total: {formatCurrency(getOrderTotal(viewTarget))}
            </div>
          </>
        )}
      </Modal>

      {confirmTarget &&
        (() => {
          const { title, message, confirmLabel, danger } = buildConfirmProps();
          return (
            <ConfirmDialog
              open
              title={title}
              onConfirm={handleConfirmAction}
              onCancel={() => setConfirmTarget(null)}
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

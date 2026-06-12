import { useEffect, useMemo, useState } from 'react';

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

function SortIndicator({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (!direction) return null;
  return (
    <span style={{ marginLeft: 4 }}>{direction === 'asc' ? '▲' : '▼'}</span>
  );
}

export function OrdersPage() {
  const { products } = useProducts();
  const { orders, filtered, filters, sort, setFilters, toggleSort, addOrder } =
    useOrders(() => {});

  const [formOpen, setFormOpen] = useState(false);
  const [formCustomer, setFormCustomer] = useState('');
  const [formItems, setFormItems] = useState<FormItem[]>([emptyFormItem()]);
  const [formManualEnabled, setFormManualEnabled] = useState(false);
  const [formManualTotal, setFormManualTotal] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [viewTarget, setViewTarget] = useState<Order | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setViewTarget(null);
        setFormOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  function renderFormModal() {
    if (!formOpen) return null;

    return (
      <div
        className="orders-modal-overlay"
        onClick={handleCloseForm}
        role="presentation"
      >
        <div
          className="orders-modal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
        >
          <div className="orders-modal-header">
            <h2 className="orders-modal-title">Novo Pedido</h2>
            <button
              className="orders-modal-close"
              onClick={handleCloseForm}
              type="button"
            >
              ×
            </button>
          </div>

          <div className="orders-modal-body">
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
                  <span className="orders-form-error">
                    {formErrors.customer}
                  </span>
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
                  <label htmlFor="manual-total-toggle">
                    Valor personalizado
                  </label>
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
          </div>

          <div className="orders-modal-footer">
            <button
              className="orders-modal-btn orders-modal-btn--cancel"
              onClick={handleCloseForm}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="orders-modal-btn orders-modal-btn--confirm"
              onClick={handleSaveOrder}
              type="button"
            >
              Criar Pedido
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderViewModal() {
    if (!viewTarget) return null;

    return (
      <div
        className="orders-modal-overlay"
        onClick={() => setViewTarget(null)}
        role="presentation"
      >
        <div
          className="orders-modal"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
        >
          <div className="orders-modal-header">
            <h2 className="orders-modal-title">Detalhes do Pedido</h2>
            <button
              className="orders-modal-close"
              onClick={() => setViewTarget(null)}
              type="button"
            >
              ×
            </button>
          </div>

          <div className="orders-modal-body">
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
          </div>

          <div className="orders-modal-footer">
            <button
              className="orders-modal-btn orders-modal-btn--cancel"
              onClick={() => setViewTarget(null)}
              type="button"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="orders-table-footer">
          Mostrando {filtered.length} de {orders.length} pedidos
        </div>
      </div>

      {renderFormModal()}
      {renderViewModal()}
    </div>
  );
}

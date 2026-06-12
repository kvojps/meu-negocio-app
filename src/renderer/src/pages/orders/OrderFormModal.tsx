import type { Product } from '../../../../shared/types/product';
import { Modal } from '../../components/Modal';
import { FormField } from '../../components/FormField';
import type { UseOrderFormReturn } from './useOrderForm';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

interface OrderFormModalProps {
  form: UseOrderFormReturn;
  products: Product[];
}

export function OrderFormModal({ form, products }: OrderFormModalProps) {
  return (
    <Modal
      open={form.isOpen}
      onClose={form.close}
      title="Novo Pedido"
      maxWidth="600px"
      footer={
        <>
          <button
            className="modal-btn modal-btn--cancel"
            onClick={form.close}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="modal-btn modal-btn--confirm"
            onClick={() => form.save()}
            type="button"
          >
            Criar Pedido
          </button>
        </>
      }
    >
      <div className="orders-form">
        <FormField label="Cliente" required error={form.errors.customer}>
          <input
            className={`orders-form-input ${form.errors.customer ? 'orders-form-input--error' : ''}`}
            placeholder="Nome do cliente"
            type="text"
            value={form.customer}
            onChange={(e) => form.setCustomer(e.target.value)}
          />
        </FormField>

        <div className="orders-items-section">
          <div className="orders-items-header">
            <h3 className="orders-items-title">Itens</h3>
            <button
              className="orders-items-add"
              onClick={form.addItem}
              type="button"
            >
              + Adicionar Item
            </button>
          </div>

          {form.items.map((item, index) => (
            <div className="orders-item-row" key={index}>
              <div className="orders-item-row-select">
                <select
                  className={`orders-form-input ${form.errors[`item_${index}_product`] ? 'orders-form-input--error' : ''}`}
                  style={{ width: '100%' }}
                  value={item.productId}
                  onChange={(e) =>
                    form.updateItem(index, 'productId', e.target.value)
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
                  className={`orders-form-input ${form.errors[`item_${index}_qty`] ? 'orders-form-input--error' : ''}`}
                  min="1"
                  step="1"
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    form.updateItem(index, 'quantity', e.target.value)
                  }
                />
              </div>
              <div className="orders-item-row-input">
                <input
                  className={`orders-form-input ${form.errors[`item_${index}_price`] ? 'orders-form-input--error' : ''}`}
                  min="0"
                  step="0.01"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    form.updateItem(index, 'unitPrice', e.target.value)
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
                disabled={form.items.length <= 1}
                onClick={() => form.removeItem(index)}
                style={{
                  opacity: form.items.length <= 1 ? 0.3 : 1,
                }}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
          {form.errors.items && (
            <span className="form-field-error">{form.errors.items}</span>
          )}
        </div>

        <div className="orders-total-row">
          <div className="orders-manual-toggle">
            <input
              checked={form.manualEnabled}
              id="manual-total-toggle"
              type="checkbox"
              onChange={(e) => form.setManualEnabled(e.target.checked)}
            />
            <label htmlFor="manual-total-toggle">Valor personalizado</label>
          </div>

          {form.manualEnabled ? (
            <input
              className={`orders-form-input orders-manual-input ${form.errors.manualTotal ? 'orders-form-input--error' : ''}`}
              min="0"
              step="0.01"
              type="number"
              value={form.manualTotal}
              onChange={(e) => form.setManualTotal(e.target.value)}
            />
          ) : null}

          <span className="orders-total-label">Total:</span>
          <span className="orders-total-value">
            {formatCurrency(form.displayTotal)}
          </span>
        </div>
      </div>
    </Modal>
  );
}

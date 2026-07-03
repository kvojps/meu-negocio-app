import { FormField } from '@components/FormField';
import { Input } from '@components/FormField/Input';
import { Select } from '@components/FormField/Select';
import { Modal } from '@components/Modal';
import type { UseOrderFormReturn } from '@hooks/orders/useOrderForm';
import type { Product } from '@shared/types/product';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

interface OrderFormModalProps {
  formState: UseOrderFormReturn;
  products: Product[];
}

export function OrderFormModal({ formState, products }: OrderFormModalProps) {
  const {
    isOpen,
    isEditing,
    isSaving,
    form,
    fields,
    displayTotal,
    close,
    onSubmit,
    selectProduct,
    addItem,
    removeItem,
  } = formState;
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const items = watch('items');
  const manualEnabled = watch('manualEnabled');

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={isEditing ? 'Editar Pedido' : 'Novo Pedido'}
      maxWidth="600px"
      footer={
        <>
          <button
            className="modal-btn modal-btn--cancel"
            disabled={isSaving}
            onClick={close}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="modal-btn modal-btn--confirm"
            disabled={isSaving}
            onClick={() => onSubmit()}
            type="button"
          >
            {isSaving
              ? 'Salvando…'
              : isEditing
                ? 'Salvar Alterações'
                : 'Criar Pedido'}
          </button>
        </>
      }
    >
      <div className="orders-form">
        <FormField label="Cliente" required error={errors.customer?.message}>
          <Input
            error={!!errors.customer}
            placeholder="Nome do cliente"
            type="text"
            {...register('customer')}
          />
        </FormField>

        <div className="orders-items-section">
          <div className="orders-items-header">
            <h3 className="orders-items-title">Itens</h3>
            <button
              className="orders-items-add"
              onClick={addItem}
              type="button"
            >
              + Adicionar Item
            </button>
          </div>

          {fields.map((field, index) => {
            const item = items[index];
            const itemErrors = errors.items?.[index];
            return (
              <div className="orders-item-row" key={field.id}>
                <div className="orders-item-row-select">
                  <Select
                    error={!!itemErrors?.productId}
                    style={{ width: '100%' }}
                    value={item?.productId ?? ''}
                    onChange={(e) => selectProduct(index, e.target.value)}
                  >
                    <option value="">Selecionar produto...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {formatCurrency(p.salePrice)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="orders-item-row-input">
                  <Input
                    error={!!itemErrors?.quantity}
                    min="1"
                    step="1"
                    type="number"
                    {...register(`items.${index}.quantity`)}
                  />
                </div>
                <div className="orders-item-row-input">
                  <Input
                    error={!!itemErrors?.unitPrice}
                    min="0"
                    step="0.01"
                    type="number"
                    {...register(`items.${index}.unitPrice`)}
                  />
                </div>
                <span className="orders-item-row-price">
                  {formatCurrency(
                    (Number(item?.quantity) || 0) *
                      (Number(item?.unitPrice) || 0),
                  )}
                </span>
                <button
                  className="orders-item-row-remove"
                  disabled={fields.length <= 1}
                  onClick={() => removeItem(index)}
                  style={{
                    opacity: fields.length <= 1 ? 0.3 : 1,
                  }}
                  type="button"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>

        <div className="orders-total-row">
          <div className="orders-manual-toggle">
            <input
              id="manual-total-toggle"
              type="checkbox"
              {...register('manualEnabled')}
            />
            <label htmlFor="manual-total-toggle">Valor personalizado</label>
          </div>

          {manualEnabled ? (
            <Input
              className="orders-manual-input"
              error={!!errors.manualTotal}
              min="0"
              step="0.01"
              type="number"
              {...register('manualTotal')}
            />
          ) : null}

          <span className="orders-total-label">Total:</span>
          <span className="orders-total-value">
            {formatCurrency(displayTotal)}
          </span>
        </div>
      </div>
    </Modal>
  );
}

import { FormField } from '../../components/FormField';
import { Modal } from '../../components/Modal';

import type { FormData, FormErrors } from '../../hooks/useProductForm';

interface ProductFormModalProps {
  isOpen: boolean;
  editingId: string | null;
  form: FormData;
  formErrors: FormErrors;
  onSave: () => void;
  onClose: () => void;
  onChange: (form: FormData) => void;
}

export function ProductFormModal({
  isOpen,
  editingId,
  form,
  formErrors,
  onSave,
  onClose,
  onChange,
}: ProductFormModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={editingId ? 'Editar Produto' : 'Novo Produto'}
      footer={
        <>
          <button
            className="modal-btn modal-btn--cancel"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            className="modal-btn modal-btn--confirm"
            onClick={onSave}
            type="button"
          >
            {editingId ? 'Salvar' : 'Criar'}
          </button>
        </>
      }
    >
      <div className="products-form">
        <FormField label="Nome" required error={formErrors.name}>
          <input
            className={`products-form-input ${formErrors.name ? 'products-form-input--error' : ''}`}
            placeholder="Nome do produto"
            type="text"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
          />
        </FormField>

        <FormField label="Descrição">
          <textarea
            className="products-form-textarea"
            placeholder="Descrição do produto (opcional)"
            rows={3}
            value={form.description}
            onChange={(e) => onChange({ ...form, description: e.target.value })}
          />
        </FormField>

        <div className="products-form-row">
          <FormField label="Categoria" required error={formErrors.category}>
            <input
              className={`products-form-input ${formErrors.category ? 'products-form-input--error' : ''}`}
              placeholder="Ex: Vestuário"
              type="text"
              value={form.category}
              onChange={(e) => onChange({ ...form, category: e.target.value })}
            />
          </FormField>

          <FormField label="Fornecedor">
            <input
              className="products-form-input"
              placeholder="Nome do fornecedor"
              type="text"
              value={form.supplier}
              onChange={(e) => onChange({ ...form, supplier: e.target.value })}
            />
          </FormField>
        </div>

        <div className="products-form-row">
          <FormField
            label="Preço de Custo"
            required
            error={formErrors.costPrice}
          >
            <input
              className={`products-form-input ${formErrors.costPrice ? 'products-form-input--error' : ''}`}
              placeholder="0,00"
              type="number"
              step="0.01"
              min="0"
              value={form.costPrice}
              onChange={(e) => onChange({ ...form, costPrice: e.target.value })}
            />
          </FormField>

          <FormField
            label="Preço de Venda"
            required
            error={formErrors.salePrice}
          >
            <input
              className={`products-form-input ${formErrors.salePrice ? 'products-form-input--error' : ''}`}
              placeholder="0,00"
              type="number"
              step="0.01"
              min="0"
              value={form.salePrice}
              onChange={(e) => onChange({ ...form, salePrice: e.target.value })}
            />
          </FormField>
        </div>

        <div className="products-form-row">
          <FormField label="Estoque" required error={formErrors.stock}>
            <input
              className={`products-form-input ${formErrors.stock ? 'products-form-input--error' : ''}`}
              placeholder="0"
              type="number"
              step="1"
              min="0"
              value={form.stock}
              onChange={(e) => onChange({ ...form, stock: e.target.value })}
            />
          </FormField>

          <FormField label="Estoque Mínimo">
            <input
              className="products-form-input"
              placeholder="0"
              type="number"
              step="1"
              min="0"
              value={form.minStock}
              onChange={(e) => onChange({ ...form, minStock: e.target.value })}
            />
          </FormField>
        </div>
      </div>
    </Modal>
  );
}

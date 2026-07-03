import { FormField } from '@components/FormField';
import { Input } from '@components/FormField/Input';
import { Textarea } from '@components/FormField/Textarea';
import { Modal } from '@components/Modal';
import type { UseProductFormReturn } from '@hooks/products/useProductForm';

interface ProductFormModalProps {
  formState: UseProductFormReturn;
}

export function ProductFormModal({ formState }: ProductFormModalProps) {
  const { isOpen, editingId, isSaving, form, close, onSubmit } = formState;
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={editingId ? 'Editar Produto' : 'Novo Produto'}
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
            {isSaving ? 'Salvando…' : editingId ? 'Salvar' : 'Criar'}
          </button>
        </>
      }
    >
      <div className="products-form">
        <FormField label="Nome" required error={errors.name?.message}>
          <Input
            error={!!errors.name}
            placeholder="Nome do produto"
            type="text"
            {...register('name')}
          />
        </FormField>

        <FormField label="Descrição">
          <Textarea
            placeholder="Descrição do produto (opcional)"
            rows={3}
            {...register('description')}
          />
        </FormField>

        <div className="products-form-row">
          <FormField
            label="Categoria"
            required
            error={errors.category?.message}
          >
            <Input
              error={!!errors.category}
              placeholder="Ex: Vestuário"
              type="text"
              {...register('category')}
            />
          </FormField>

          <FormField label="Fornecedor">
            <Input
              placeholder="Nome do fornecedor"
              type="text"
              {...register('supplier')}
            />
          </FormField>
        </div>

        <div className="products-form-row">
          <FormField
            label="Preço de Custo"
            required
            error={errors.costPrice?.message}
          >
            <Input
              error={!!errors.costPrice}
              placeholder="0,00"
              type="number"
              step="0.01"
              min="0"
              {...register('costPrice')}
            />
          </FormField>

          <FormField
            label="Preço de Venda"
            required
            error={errors.salePrice?.message}
          >
            <Input
              error={!!errors.salePrice}
              placeholder="0,00"
              type="number"
              step="0.01"
              min="0"
              {...register('salePrice')}
            />
          </FormField>
        </div>

        <div className="products-form-row">
          <FormField label="Estoque" required error={errors.stock?.message}>
            <Input
              error={!!errors.stock}
              placeholder="0"
              type="number"
              step="1"
              min="0"
              {...register('stock')}
            />
          </FormField>

          <FormField label="Estoque Mínimo">
            <Input
              placeholder="0"
              type="number"
              step="1"
              min="0"
              {...register('minStock')}
            />
          </FormField>
        </div>
      </div>
    </Modal>
  );
}

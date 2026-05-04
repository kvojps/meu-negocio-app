import { useEffect, useState } from 'react';
import type { Product } from '../../../../shared';
import type { CreateProductPayload } from '../../utils/ui';

type ProductModalProps = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (product: CreateProductPayload, productId?: number) => Promise<void>;
};

export function ProductModal({ open, product, onClose, onSave }: ProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setPrice('');
      setCostPrice('');
      setStatus('');
      setSaving(false);
      return;
    }

    setName(product?.name ?? '');
    setDescription(product?.description ?? '');
    setPrice(product ? String(product.price) : '');
    setCostPrice(product ? String(product.cost_price) : '');
    setStatus('');
    setSaving(false);
  }, [open, product]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="section-label">Produtos</p>
            <h2 id="product-modal-title">{product ? 'Editar produto' : 'Cadastrar produto'}</h2>
          </div>
          <button className="ghost-button" type="button" onClick={onClose} aria-label="Fechar modal">
            Fechar
          </button>
        </div>

        <form
          className="modal-form"
          onSubmit={async (event) => {
            event.preventDefault();

            const normalizedName = name.trim();
            const normalizedDescription = description.trim();
            const normalizedPrice = Number(price);
            const normalizedCostPrice = Number(costPrice);

            if (!normalizedName) {
              setStatus('Informe o nome do produto.');
              return;
            }

            if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
              setStatus('Informe um preço válido.');
              return;
            }

            if (!Number.isFinite(normalizedCostPrice) || normalizedCostPrice < 0) {
              setStatus('Informe um custo válido.');
              return;
            }

            setSaving(true);
            setStatus(product ? 'Atualizando produto...' : 'Salvando produto...');

            try {
              await onSave(
                {
                  name: normalizedName,
                  description: normalizedDescription,
                  price: normalizedPrice,
                  cost_price: normalizedCostPrice
                },
                product?.id
              );
              setStatus(product ? 'Produto atualizado com sucesso.' : 'Produto salvo com sucesso.');
            } catch (error) {
              setStatus(error instanceof Error ? error.message : product ? 'Erro ao atualizar produto.' : 'Erro ao salvar produto.');
            } finally {
              setSaving(false);
            }
          }}
        >
          <label>
            Nome
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Sofá 3 lugares" maxLength={120} />
          </label>

          <label>
            Descrição
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Detalhes do produto" maxLength={500} />
          </label>

          <label>
            Preço
            <input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="0,00" type="number" min="0" step="0.01" />
          </label>

          <label>
            Custo
            <input value={costPrice} onChange={(event) => setCostPrice(event.target.value)} placeholder="0,00" type="number" min="0" step="0.01" />
          </label>

          <div className="modal-actions">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : product ? 'Atualizar produto' : 'Salvar produto'}
            </button>
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>

          <p className="form-status">{status}</p>
        </form>
      </div>
    </div>
  );
}

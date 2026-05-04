import { useEffect, useState } from 'react';
import type { Product } from '../../../../shared';
import type { CreateSaleInput } from '../../../../shared';
import type { SaleFormItemState } from '../../utils/ui';
import { buildSaleFormItem, calculateSaleTotal, toDateTimeLocalValue } from '../../utils/formatters';

type SaleModalProps = {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onSave: (sale: CreateSaleInput) => Promise<void>;
};

export function SaleModal({ open, products, onClose, onSave }: SaleModalProps) {
  const [dateValue, setDateValue] = useState('');
  const [items, setItems] = useState<SaleFormItemState[]>([]);
  const [totalPrice, setTotalPrice] = useState('');
  const [totalTouched, setTotalTouched] = useState(false);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setDateValue('');
      setItems([]);
      setTotalPrice('');
      setTotalTouched(false);
      setStatus('');
      setSaving(false);
      return;
    }

    const initialItems = products.length > 0 ? [buildSaleFormItem(products)] : [buildSaleFormItem([])];
    setDateValue(toDateTimeLocalValue(new Date()));
    setItems(initialItems);
    setTotalPrice(calculateSaleTotal(initialItems));
    setTotalTouched(false);
    setStatus('');
    setSaving(false);
  }, [open, products]);

  if (!open) {
    return null;
  }

  function updateItems(nextItems: SaleFormItemState[]) {
    setItems(nextItems);
    if (!totalTouched) {
      setTotalPrice(calculateSaleTotal(nextItems));
    }
  }

  function updateItem(index: number, field: keyof SaleFormItemState, value: string) {
    const nextItems = items.map((item, currentIndex) => {
      if (currentIndex !== index) {
        return item;
      }

      if (field === 'productId') {
        const selectedProduct = products.find((product) => String(product.id) === value);
        return {
          productId: value,
          quantity: item.quantity,
          unitPrice: selectedProduct ? String(selectedProduct.price) : item.unitPrice,
          unitCost: selectedProduct ? String(selectedProduct.cost_price) : item.unitCost
        };
      }

      return {
        ...item,
        [field]: value
      };
    });

    updateItems(nextItems);
  }

  function addItem() {
    updateItems([...items, buildSaleFormItem(products)]);
  }

  function removeItem(index: number) {
    if (items.length === 1) {
      return;
    }

    const nextItems = items.filter((_, currentIndex) => currentIndex !== index);
    updateItems(nextItems);
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal sale-modal" role="dialog" aria-modal="true" aria-labelledby="sale-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="section-label">Receitas</p>
            <h2 id="sale-modal-title">Registrar receita</h2>
          </div>
          <button className="ghost-button" type="button" onClick={onClose} aria-label="Fechar modal">
            Fechar
          </button>
        </div>

        <form
          className="modal-form sale-form"
          onSubmit={async (event) => {
            event.preventDefault();

            if (products.length === 0) {
              setStatus('Cadastre ao menos um produto antes de registrar uma receita.');
              return;
            }

            const parsedDate = new Date(dateValue);
            if (Number.isNaN(parsedDate.getTime())) {
              setStatus('Informe uma data válida para a receita.');
              return;
            }

            const normalizedTotal = Number(totalPrice);
            if (!Number.isFinite(normalizedTotal) || normalizedTotal < 0) {
              setStatus('Informe um total válido para a receita.');
              return;
            }

            const normalizedItems: CreateSaleInput['items'] = [];

            for (const item of items) {
              const productId = Number(item.productId);
              const quantity = Number(item.quantity);
              const unitPrice = Number(item.unitPrice);
              const unitCost = Number(item.unitCost);

              if (!Number.isInteger(productId) || productId <= 0) {
                setStatus('Selecione um produto válido em todos os itens.');
                return;
              }

              if (!products.some((product) => product.id === productId)) {
                setStatus('Um dos produtos selecionados não existe mais.');
                return;
              }

              if (!Number.isInteger(quantity) || quantity <= 0) {
                setStatus('Informe uma quantidade válida em todos os itens.');
                return;
              }

              if (!Number.isFinite(unitPrice) || unitPrice < 0) {
                setStatus('Informe preços unitários válidos em todos os itens.');
                return;
              }

              if (!Number.isFinite(unitCost) || unitCost < 0) {
                setStatus('Informe custos unitários válidos em todos os itens.');
                return;
              }

              normalizedItems.push({
                product_id: productId,
                quantity,
                unit_price: unitPrice,
                unit_cost: unitCost
              });
            }

            if (normalizedItems.length === 0) {
              setStatus('Adicione ao menos um item à receita.');
              return;
            }

            setSaving(true);
            setStatus('Salvando receita...');

            try {
              await onSave({
                date: parsedDate.toISOString(),
                total_price: normalizedTotal,
                items: normalizedItems
              });
            } catch (error) {
              setStatus(error instanceof Error ? error.message : 'Erro ao salvar receita.');
            } finally {
              setSaving(false);
            }
          }}
        >
          <label>
            Data da receita
            <input value={dateValue} onChange={(event) => setDateValue(event.target.value)} type="datetime-local" />
          </label>

          <label>
            Valor total
            <input
              value={totalPrice}
              onChange={(event) => {
                setTotalPrice(event.target.value);
                setTotalTouched(true);
              }}
              type="number"
              min="0"
              step="0.01"
            />
          </label>

          <div className="items-block">
            <div className="items-block-header">
              <div>
                <h3>Itens da receita</h3>
                <p>Selecione os produtos e ajuste quantidades e preços unitários.</p>
              </div>
              <button className="ghost-button" type="button" onClick={addItem} disabled={products.length === 0}>
                Adicionar item
              </button>
            </div>

            {items.map((item, index) => (
              <div className="sale-item-row" key={`${index}-${item.productId}`}>
                <label>
                  Produto
                  <select value={item.productId} onChange={(event) => updateItem(index, 'productId', event.target.value)} disabled={products.length === 0}>
                    <option value="">Selecione</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Quantidade
                  <input value={item.quantity} onChange={(event) => updateItem(index, 'quantity', event.target.value)} type="number" min="1" step="1" />
                </label>

                <label>
                  Preço unitário
                  <input value={item.unitPrice} onChange={(event) => updateItem(index, 'unitPrice', event.target.value)} type="number" min="0" step="0.01" />
                </label>

                <button className="danger-button sale-item-remove" type="button" onClick={() => removeItem(index)} disabled={items.length === 1} aria-label={`Remover item ${index + 1}`}>
                  Remover
                </button>
              </div>
            ))}
          </div>

          <div className="modal-actions">
            <button className="primary-button" type="submit" disabled={saving || products.length === 0}>
              {saving ? 'Salvando...' : 'Registrar receita'}
            </button>
            <button className="secondary-button" type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>

          <p className="form-status">{status || (products.length === 0 ? 'Cadastre produtos para liberar o registro de receitas.' : '')}</p>
        </form>
      </div>
    </div>
  );
}

import type { Product, SaleWithItems } from '../../../../shared';
import { formatCurrency, formatDate } from '../../utils/formatters';

type SaleDetailsModalProps = {
  open: boolean;
  sale: SaleWithItems | null;
  products: Product[];
  status: string;
  onClose: () => void;
};

export function SaleDetailsModal({ open, sale, products, status, onClose }: SaleDetailsModalProps) {
  if (!open) {
    return null;
  }

  const productNameById = new Map(products.map((product) => [product.id, product.name]));

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal sale-details-modal" role="dialog" aria-modal="true" aria-labelledby="sale-details-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="section-label">Receitas</p>
            <h2 id="sale-details-title">{sale ? `Receita #${sale.id}` : 'Detalhes da receita'}</h2>
          </div>
          <button className="ghost-button" type="button" onClick={onClose} aria-label="Fechar modal">
            Fechar
          </button>
        </div>

        {sale ? (
          <div className="sale-details">
            <div className="sale-details-summary">
              <div>
                <span>Data</span>
                <strong>{formatDate(sale.date)}</strong>
              </div>
              <div>
                <span>Total</span>
                <strong>{formatCurrency(sale.total_price)}</strong>
              </div>
              <div>
                <span>Custo total</span>
                <strong>{formatCurrency(sale.cost_total ?? 0)}</strong>
              </div>
              <div>
                <span>Lucro bruto</span>
                <strong>{formatCurrency(sale.gross_profit ?? 0)}</strong>
              </div>
              <div>
                <span>Criado em</span>
                <strong>{formatDate(sale.created_at)}</strong>
              </div>
              <div>
                <span>Atualizado em</span>
                <strong>{formatDate(sale.updated_at)}</strong>
              </div>
            </div>

            <div className="items-block">
              <h3>Itens</h3>
              <div className="sale-details-items">
                {sale.items.length === 0 ? (
                  <p className="empty-state">Nenhum item encontrado para esta receita.</p>
                ) : (
                  sale.items.map((item) => (
                    <div className="sale-detail-item" key={item.id}>
                      <div>
                        <span>Produto</span>
                        <strong>{productNameById.get(item.product_id) ?? `Produto #${item.product_id}`}</strong>
                      </div>
                      <div>
                        <span>Quantidade</span>
                        <strong>{item.quantity}</strong>
                      </div>
                      <div>
                        <span>Preço unitário</span>
                        <strong>{formatCurrency(item.unit_price)}</strong>
                      </div>
                      <div>
                        <span>Custo unitário</span>
                        <strong>{formatCurrency(item.unit_cost)}</strong>
                      </div>
                      <div>
                        <span>Lucro do item</span>
                        <strong>{formatCurrency((item.unit_price - item.unit_cost) * item.quantity)}</strong>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="form-status">{status || 'Carregando detalhes...'}</p>
        )}
      </div>
    </div>
  );
}

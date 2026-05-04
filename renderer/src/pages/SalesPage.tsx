import type { Product, Sale } from '../../../shared';
import { formatCurrency, formatDate } from '../utils/formatters';
import { EyeIcon, TrashIcon } from '../components/shared/Icons';
import { TablePagination } from '../components/shared/TablePagination';

type SalesPageProps = {
  sales: Sale[];
  loadingSales: boolean;
  salesError: string;
  products: Product[];
  salePage: number;
  totalSalePages: number;
  onCreateSale: () => void;
  onOpenSaleDetails: (sale: Sale) => void;
  onDeleteSale: (sale: Sale) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function SalesPage({
  sales,
  loadingSales,
  salesError,
  products,
  salePage,
  totalSalePages,
  onCreateSale,
  onOpenSaleDetails,
  onDeleteSale,
  onPreviousPage,
  onNextPage
}: SalesPageProps) {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_price, 0);
  const saleStartIndex = (salePage - 1) * 8;
  const paginatedSales = sales.slice(saleStartIndex, saleStartIndex + 8);

  return (
    <>
      <section className="metrics sales-metrics">
        <div className="metric-card">
          <span>Total de receitas</span>
          <strong>{loadingSales ? '...' : sales.length}</strong>
        </div>
        <div className="metric-card">
          <span>Faturamento acumulado</span>
          <strong>{loadingSales ? '...' : formatCurrency(totalRevenue)}</strong>
        </div>
        <div className="metric-card">
          <span>Custo acumulado</span>
          <strong>{loadingSales ? '...' : formatCurrency(sales.reduce((sum, sale) => sum + (sale.cost_total ?? 0), 0))}</strong>
        </div>
        <div className="metric-card">
          <span>Lucro bruto</span>
          <strong>{loadingSales ? '...' : formatCurrency(sales.reduce((sum, sale) => sum + (sale.gross_profit ?? 0), 0))}</strong>
        </div>
      </section>

      <section className="table-card">
        <div className="table-card-header">
          <div>
            <h3>Receitas registradas</h3>
            <p>{loadingSales ? 'Carregando...' : `${sales.length} item(ns) no total`}</p>
          </div>
          <button className="primary-button" type="button" onClick={onCreateSale} disabled={products.length === 0}>
            Registrar receita
          </button>
        </div>

        {salesError ? <div className="error-box">{salesError}</div> : null}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Data</th>
                <th>Total</th>
                <th>Lucro</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    {sales.length === 0 ? 'Nenhuma receita registrada ainda.' : 'Nenhuma receita nesta página.'}
                  </td>
                </tr>
              ) : (
                paginatedSales.map((sale) => (
                  <tr key={sale.id}>
                    <td>{sale.id}</td>
                    <td>{formatDate(sale.date)}</td>
                    <td>{formatCurrency(sale.total_price)}</td>
                    <td>{formatCurrency(sale.gross_profit ?? 0)}</td>
                    <td>{formatDate(sale.created_at)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="ghost-button row-action-button icon-action-button"
                          type="button"
                          onClick={() => onOpenSaleDetails(sale)}
                          aria-label={`Visualizar receita ${sale.id}`}
                          title="Visualizar"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          className="danger-button row-action-button icon-action-button"
                          type="button"
                          onClick={() => onDeleteSale(sale)}
                          aria-label={`Excluir receita ${sale.id}`}
                          title="Excluir"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={salePage}
          totalPages={totalSalePages}
          onPrevious={onPreviousPage}
          onNext={onNextPage}
        />
      </section>
    </>
  );
}

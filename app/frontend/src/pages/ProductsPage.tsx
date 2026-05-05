import type { Product } from '../../../shared';
import { formatCurrency, formatDate } from '../utils/formatters';
import { PencilIcon, TrashIcon } from '../components/shared/Icons';
import { TablePagination } from '../components/shared/TablePagination';

type ProductsPageProps = {
  products: Product[];
  paginatedProducts: Product[];
  loadingProducts: boolean;
  productError: string;
  productPage: number;
  totalProductPages: number;
  onCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function ProductsPage({
  products,
  paginatedProducts,
  loadingProducts,
  productError,
  productPage,
  totalProductPages,
  onCreateProduct,
  onEditProduct,
  onDeleteProduct,
  onPreviousPage,
  onNextPage
}: ProductsPageProps) {
  const totalCatalogValue = products.reduce((sum, product) => sum + product.price, 0);

  return (
    <>
      <section className="metrics">
        <div className="metric-card">
          <span>Total de produtos</span>
          <strong>{loadingProducts ? '...' : products.length}</strong>
        </div>
        <div className="metric-card">
          <span>Valor total do catálogo</span>
          <strong>{loadingProducts ? '...' : formatCurrency(totalCatalogValue)}</strong>
        </div>
      </section>

      <section className="table-card">
        <div className="table-card-header">
          <div>
            <h3>Produtos cadastrados</h3>
            <p>{loadingProducts ? 'Carregando...' : `${products.length} item(ns) no total`}</p>
          </div>
          <button className="primary-button" type="button" onClick={onCreateProduct}>
            Cadastrar produto
          </button>
        </div>

        {productError ? <div className="error-box">{productError}</div> : null}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    {products.length === 0 ? 'Nenhum produto cadastrado ainda.' : 'Nenhum produto nesta página.'}
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="table-cell-truncate" title={product.name}>{product.name}</td>
                    <td className="table-cell-truncate table-cell-description" title={product.description || '-'}>{product.description || '-'}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>{formatDate(product.created_at)}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="ghost-button row-action-button icon-action-button"
                          type="button"
                          onClick={() => onEditProduct(product)}
                          aria-label={`Editar produto ${product.name}`}
                          title="Editar"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          className="danger-button row-action-button icon-action-button"
                          type="button"
                          onClick={() => onDeleteProduct(product)}
                          aria-label={`Excluir produto ${product.name}`}
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
          currentPage={productPage}
          totalPages={totalProductPages}
          onPrevious={onPreviousPage}
          onNext={onNextPage}
        />
      </section>
    </>
  );
}

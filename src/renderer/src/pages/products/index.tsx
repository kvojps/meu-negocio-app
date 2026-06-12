import './styles.css';

import { useProducts } from '../../hooks/useProducts';

export function ProductsPage() {
  const { products, filtered } = useProducts();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-header-title">Produtos</h1>
        <button className="products-header-button" type="button">
          + Novo Produto
        </button>
      </div>

      <div className="products-filters">
        <input
          className="products-filters-search"
          placeholder="Buscar por nome..."
          type="text"
        />
        <select className="products-filters-select">
          <option value="">Todas as categorias</option>
        </select>
        <button className="products-filters-toggle" type="button">
          Estoque baixo
        </button>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Fornecedor</th>
              <th>Preço Venda</th>
              <th>Estoque</th>
              <th className="products-table-th--actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>{product.category}</td>
                <td>{product.supplier}</td>
                <td>{formatCurrency(product.salePrice)}</td>
                <td>{product.stock}</td>
                <td className="products-table-cell--actions">
                  <button
                    className="products-table-btn products-table-btn--edit"
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    className="products-table-btn products-table-btn--delete"
                    type="button"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="products-table-footer">
          Mostrando {filtered.length} de {products.length} produtos
        </div>
      </div>
    </div>
  );
}

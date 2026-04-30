import { useEffect, useState } from 'react';
import type { Product } from '../../shared/product';

type CreateProductPayload = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
type UpdateProductPayload = CreateProductPayload & { id: number };

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(value?: string): string {
  if (!value) {
    return '-';
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime())
    ? value
    : parsedDate.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function Sidebar({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <aside className={`sidebar ${open ? 'expanded' : 'collapsed'}`}>
      <button
        className="sidebar-toggle"
        type="button"
        onClick={onToggle}
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      {open ? (
        <div className="sidebar-content">
          <div>
            <p className="brand-kicker">Bussiness Management</p>
            <h1>Menu</h1>
          </div>

          <nav className="sidebar-nav" aria-label="Menu lateral">
            <button className="sidebar-item active" type="button">
              Produtos
            </button>
          </nav>
        </div>
      ) : null}
    </aside>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Zm2.92 2.33H5v-.92l8.06-8.06.92.92-8.06 8.06Zm13.79-11.58a1 1 0 0 0 0-1.41l-2.33-2.33a1 1 0 0 0-1.41 0l-1.82 1.82 3.75 3.75 1.81-1.83Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3.75h6a2.25 2.25 0 0 1 2.25 2.25V7.5H21v1.5h-1.28l-.8 10.05A2.25 2.25 0 0 1 16.67 21H7.33a2.25 2.25 0 0 1-2.25-1.95L4.28 9H3V7.5h3.75V6A2.25 2.25 0 0 1 9 3.75Zm0 3.75h6V6A.75.75 0 0 0 14.25 5.25h-4.5A.75.75 0 0 0 9 6v1.5Zm-1.24 1.5.72 9h8.04l.72-9H7.76Zm2.99 1.5h1.5v6h-1.5v-6Zm3 0h1.5v6h-1.5v-6Z" />
    </svg>
  );
}

function ProductModal({
  open,
  product,
  onClose,
  onSave,
}: {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSave: (product: CreateProductPayload, productId?: number) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setPrice('');
      setStatus('');
      setSaving(false);
      return;
    }

    setName(product?.name ?? '');
    setDescription(product?.description ?? '');
    setPrice(product ? String(product.price) : '');
    setStatus('');
    setSaving(false);
  }, [open, product]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="section-label">Produtos</p>
            <h2 id="modal-title">{product ? 'Editar produto' : 'Cadastrar produto'}</h2>
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

            if (!normalizedName) {
              setStatus('Informe o nome do produto.');
              return;
            }

            if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
              setStatus('Informe um preço válido.');
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

const ITEMS_PER_PAGE = 8;

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  async function loadProducts() {
    setLoading(true);
    setError('');

    const response = await window.api.listProducts();
    if (response.success && response.products) {
      setProducts(response.products);
      const nextTotalPages = Math.max(1, Math.ceil(response.products.length / ITEMS_PER_PAGE));
      setCurrentPage((currentPageValue) => Math.min(currentPageValue, nextTotalPages));
    } else {
      setError(response.error ?? 'Erro ao carregar produtos.');
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  function openCreateModal() {
    setEditingProduct(null);
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingProduct(null);
  }

  async function handleSave(product: CreateProductPayload, productId?: number) {
    if (productId) {
      const response = await window.api.updateProduct({ id: productId, ...product });

      if (!response.success || !response.updated_at) {
        throw new Error(response.error ?? 'Erro ao atualizar produto.');
      }

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === productId
            ? { ...currentProduct, ...product, updated_at: response.updated_at }
            : currentProduct
        )
      );
      setError('');
      closeModal();
      return;
    }

    const response = await window.api.createProduct(product);

    if (!response.success || !response.product) {
      throw new Error(response.error ?? 'Erro ao cadastrar produto.');
    }

    setProducts((currentProducts) => [response.product as Product, ...currentProducts]);
    setError('');
    setCurrentPage(1);
    closeModal();
  }

  async function handleDelete(product: Product) {
    if (!product.id) {
      return;
    }

    const confirmed = window.confirm(`Excluir o produto \"${product.name}\"?`);
    if (!confirmed) {
      return;
    }

    setError('');
    const response = await window.api.deleteProduct({ id: product.id });

    if (!response.success) {
      setError(response.error ?? 'Erro ao excluir produto.');
      return;
    }

    await loadProducts();
  }

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((currentState) => !currentState)} />

      <main className="content">
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <h3>Produtos cadastrados</h3>
              <p>{loading ? 'Carregando...' : `${products.length} item(ns) no total`}</p>
            </div>
            <button className="primary-button" type="button" onClick={openCreateModal}>
              Cadastrar produto
            </button>
          </div>

          {error ? <div className="error-box">{error}</div> : null}

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
                            onClick={() => openEditModal(product)}
                            aria-label={`Editar produto ${product.name}`}
                            title="Editar"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            className="danger-button row-action-button icon-action-button"
                            type="button"
                            onClick={() => void handleDelete(product)}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Página {currentPage} de {totalPages || 1}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="ghost-button"
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Próxima
              </button>
            </div>
          </div>
        </section>
      </main>

      <ProductModal open={modalOpen} product={editingProduct} onClose={closeModal} onSave={handleSave} />
    </div>
  );
}

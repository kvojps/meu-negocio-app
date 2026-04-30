import { useEffect, useState } from 'react';
import type { Product } from '../../shared/product';

type CreateProductPayload = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

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

function ProductModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (product: CreateProductPayload) => Promise<void>;
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
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="section-label">Produtos</p>
            <h2 id="modal-title">Cadastrar produto</h2>
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
            setStatus('Salvando produto...');

            try {
              await onSave({
                name: normalizedName,
                description: normalizedDescription,
                price: normalizedPrice,
              });
              setStatus('Produto salvo com sucesso.');
            } catch (error) {
              setStatus(error instanceof Error ? error.message : 'Erro ao salvar produto.');
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
              {saving ? 'Salvando...' : 'Salvar produto'}
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

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function loadProducts() {
    setLoading(true);
    setError('');

    const response = await window.api.listProducts();
    if (response.success && response.products) {
      setProducts(response.products);
    } else {
      setError(response.error ?? 'Erro ao carregar produtos.');
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  async function handleSave(product: CreateProductPayload) {
    const response = await window.api.createProduct(product);

    if (!response.success || !response.product) {
      throw new Error(response.error ?? 'Erro ao cadastrar produto.');
    }

    setProducts((currentProducts) => [response.product as Product, ...currentProducts]);
    setModalOpen(false);
  }

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen((currentState) => !currentState)} />

      <main className="content">
        <section className="table-card">
          <div className="table-card-header">
            <div>
              <h3>Produtos cadastrados</h3>
              <p>{loading ? 'Carregando...' : `${products.length} item(ns) na lista`}</p>
            </div>
            <button className="primary-button" type="button" onClick={() => setModalOpen(true)}>
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
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty-state">
                      Nenhum produto cadastrado ainda.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.description || '-'}</td>
                      <td>{formatCurrency(product.price)}</td>
                      <td>{formatDate(product.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <ProductModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  );
}

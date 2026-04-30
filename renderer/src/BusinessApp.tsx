import { useEffect, useState } from 'react';
import type { Product } from '../../shared/product';
import type { CreateSaleInput, Sale, SaleWithItems } from '../../shared/sale';

type CreateProductPayload = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
type ActiveSection = 'products' | 'sales';
type SaleFormItemState = {
  productId: string;
  quantity: string;
  unitPrice: string;
};

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

function toDateTimeLocalValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function buildSaleFormItem(products: Product[]): SaleFormItemState {
  const firstProduct = products[0];

  return {
    productId: firstProduct?.id ? String(firstProduct.id) : '',
    quantity: '1',
    unitPrice: firstProduct ? String(firstProduct.price) : '0'
  };
}

function calculateSaleTotal(items: SaleFormItemState[]): string {
  const total = items.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    const unitPrice = Number(item.unitPrice);
    return sum + (Number.isFinite(quantity) ? quantity : 0) * (Number.isFinite(unitPrice) ? unitPrice : 0);
  }, 0);

  return total.toFixed(2);
}

function Sidebar({
  open,
  activeSection,
  onToggle,
  onSectionChange
}: {
  open: boolean;
  activeSection: ActiveSection;
  onToggle: () => void;
  onSectionChange: (section: ActiveSection) => void;
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
            <button
              className={`sidebar-item ${activeSection === 'products' ? 'active' : ''}`}
              type="button"
              onClick={() => onSectionChange('products')}
            >
              Produtos
            </button>
            <button
              className={`sidebar-item ${activeSection === 'sales' ? 'active' : ''}`}
              type="button"
              onClick={() => onSectionChange('sales')}
            >
              Receitas
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

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5c5.5 0 9.98 3.92 11 7-.98 3.08-5.5 7-11 7S2.02 15.08 1 12c1.02-3.08 5.5-7 11-7Zm0 2C7.66 7 4.01 9.98 3.05 12 4.01 14.02 7.66 17 12 17s7.99-2.98 8.95-5C19.99 9.98 16.34 7 12 7Zm0 1.75A3.25 3.25 0 1 1 12 15a3.25 3.25 0 0 1 0-6.5Zm0 2A1.25 1.25 0 1 0 12 13a1.25 1.25 0 0 0 0-2.5Z" />
    </svg>
  );
}

function ProductModal({
  open,
  product,
  onClose,
  onSave
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
                  price: normalizedPrice
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

function SaleModal({
  open,
  products,
  onClose,
  onSave
}: {
  open: boolean;
  products: Product[];
  onClose: () => void;
  onSave: (sale: CreateSaleInput) => Promise<void>;
}) {
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
          unitPrice: selectedProduct ? String(selectedProduct.price) : item.unitPrice
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

              normalizedItems.push({
                product_id: productId,
                quantity,
                unit_price: unitPrice
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

function SaleDetailsModal({
  open,
  sale,
  products,
  status,
  onClose
}: {
  open: boolean;
  sale: SaleWithItems | null;
  products: Product[];
  status: string;
  onClose: () => void;
}) {
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
                        <span>Total do item</span>
                        <strong>{formatCurrency(item.unit_price * item.quantity)}</strong>
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

function TablePagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext
}: {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="table-pagination">
      <span>
        Página {currentPage} de {totalPages || 1}
      </span>
      <div className="table-pagination-actions">
        <button className="ghost-button" type="button" onClick={onPrevious} disabled={currentPage === 1}>
          Anterior
        </button>
        <button className="ghost-button" type="button" onClick={onNext} disabled={currentPage === totalPages || totalPages === 0}>
          Próxima
        </button>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 8;

export function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('products');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productPage, setProductPage] = useState(1);

  const [sales, setSales] = useState<Sale[]>([]);
  const [loadingSales, setLoadingSales] = useState(true);
  const [salesError, setSalesError] = useState('');
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [salePage, setSalePage] = useState(1);
  const [saleDetailsOpen, setSaleDetailsOpen] = useState(false);
  const [saleDetails, setSaleDetails] = useState<SaleWithItems | null>(null);
  const [saleDetailsStatus, setSaleDetailsStatus] = useState('');

  async function loadProducts() {
    setLoadingProducts(true);
    setProductError('');

    const response = await window.api.listProducts();
    if (response.success && response.products) {
      setProducts(response.products);
      const nextTotalPages = Math.max(1, Math.ceil(response.products.length / ITEMS_PER_PAGE));
      setProductPage((currentPageValue) => Math.min(currentPageValue, nextTotalPages));
    } else {
      setProductError(response.error ?? 'Erro ao carregar produtos.');
    }

    setLoadingProducts(false);
  }

  async function loadSales() {
    setLoadingSales(true);
    setSalesError('');

    const response = await window.api.listSales();
    if (response.success && response.sales) {
      setSales(response.sales);
      const nextTotalPages = Math.max(1, Math.ceil(response.sales.length / ITEMS_PER_PAGE));
      setSalePage((currentPageValue) => Math.min(currentPageValue, nextTotalPages));
    } else {
      setSalesError(response.error ?? 'Erro ao carregar receitas.');
    }

    setLoadingSales(false);
  }

  useEffect(() => {
    void loadProducts();
    void loadSales();
  }, []);

  function openCreateProductModal() {
    setEditingProduct(null);
    setProductModalOpen(true);
  }

  function openEditProductModal(product: Product) {
    setEditingProduct(product);
    setProductModalOpen(true);
  }

  function closeProductModal() {
    setProductModalOpen(false);
    setEditingProduct(null);
  }

  async function handleSaveProduct(product: CreateProductPayload, productId?: number) {
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
      setProductError('');
      closeProductModal();
      return;
    }

    const response = await window.api.createProduct(product);

    if (!response.success || !response.product) {
      throw new Error(response.error ?? 'Erro ao cadastrar produto.');
    }

    setProducts((currentProducts) => [response.product as Product, ...currentProducts]);
    setProductError('');
    setProductPage(1);
    closeProductModal();
  }

  async function handleDeleteProduct(product: Product) {
    if (!product.id) {
      return;
    }

    const confirmed = window.confirm(`Excluir o produto \"${product.name}\"?`);
    if (!confirmed) {
      return;
    }

    setProductError('');
    const response = await window.api.deleteProduct({ id: product.id });

    if (!response.success) {
      setProductError(response.error ?? 'Erro ao excluir produto.');
      return;
    }

    await loadProducts();
  }

  function openSaleModal() {
    setSaleModalOpen(true);
  }

  function closeSaleModal() {
    setSaleModalOpen(false);
  }

  async function handleSaveSale(sale: CreateSaleInput) {
    const response = await window.api.createSale(sale);

    if (!response.success || !response.sale) {
      throw new Error(response.error ?? 'Erro ao registrar receita.');
    }

    setSales((currentSales) => [response.sale as Sale, ...currentSales]);
    setSalesError('');
    setSalePage(1);
    closeSaleModal();
  }

  async function handleDeleteSale(sale: Sale) {
    if (!sale.id) {
      return;
    }

    const confirmed = window.confirm(`Excluir a receita #${sale.id}?`);
    if (!confirmed) {
      return;
    }

    setSalesError('');
    const response = await window.api.deleteSale({ id: sale.id });

    if (!response.success) {
      setSalesError(response.error ?? 'Erro ao excluir receita.');
      return;
    }

    if (saleDetails?.id === sale.id) {
      setSaleDetailsOpen(false);
      setSaleDetails(null);
      setSaleDetailsStatus('');
    }

    await loadSales();
  }

  async function openSaleDetails(sale: Sale) {
    if (!sale.id) {
      return;
    }

    setSaleDetailsOpen(true);
    setSaleDetails(null);
    setSaleDetailsStatus('Carregando detalhes...');

    const response = await window.api.getSaleById({ id: sale.id });
    if (response.success && response.sale) {
      setSaleDetails(response.sale);
      setSaleDetailsStatus('');
      return;
    }

    setSaleDetailsStatus(response.error ?? 'Erro ao carregar receita.');
  }

  const totalProductPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const productStartIndex = (productPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(productStartIndex, productStartIndex + ITEMS_PER_PAGE);
  const totalSalePages = Math.max(1, Math.ceil(sales.length / ITEMS_PER_PAGE));
  const saleStartIndex = (salePage - 1) * ITEMS_PER_PAGE;
  const paginatedSales = sales.slice(saleStartIndex, saleStartIndex + ITEMS_PER_PAGE);

  const totalCatalogValue = products.reduce((sum, product) => sum + product.price, 0);
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_price, 0);

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <Sidebar
        open={sidebarOpen}
        activeSection={activeSection}
        onToggle={() => setSidebarOpen((currentState) => !currentState)}
        onSectionChange={setActiveSection}
      />

      <main className="content">
        <section className="page-header">
          <div>
            <p className="section-label">{activeSection === 'products' ? 'Gestão de produtos' : 'Gestão de receitas'}</p>
            <h2>{activeSection === 'products' ? 'Produtos cadastrados' : 'Receitas registradas'}</h2>
            <p className="page-description">
              {activeSection === 'products'
                ? 'Cadastre, edite e remova produtos com a mesma fluidez do fluxo atual.'
                : 'Registre vendas com múltiplos itens, acompanhe o valor total e visualize cada receita em detalhe.'}
            </p>
          </div>

          <div>
            {activeSection === 'products' ? (
              <button className="primary-button" type="button" onClick={openCreateProductModal}>
                Cadastrar produto
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={openSaleModal} disabled={products.length === 0} title={products.length === 0 ? 'Cadastre produtos primeiro' : 'Registrar receita'}>
                Registrar receita
              </button>
            )}
          </div>
        </section>

        {activeSection === 'products' ? (
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
                <button className="primary-button" type="button" onClick={openCreateProductModal}>
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
                                onClick={() => openEditProductModal(product)}
                                aria-label={`Editar produto ${product.name}`}
                                title="Editar"
                              >
                                <PencilIcon />
                              </button>
                              <button
                                className="danger-button row-action-button icon-action-button"
                                type="button"
                                onClick={() => void handleDeleteProduct(product)}
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
                onPrevious={() => setProductPage((prev) => Math.max(prev - 1, 1))}
                onNext={() => setProductPage((prev) => Math.min(prev + 1, totalProductPages))}
              />
            </section>
          </>
        ) : (
          <>
            <section className="metrics">
              <div className="metric-card">
                <span>Total de receitas</span>
                <strong>{loadingSales ? '...' : sales.length}</strong>
              </div>
              <div className="metric-card">
                <span>Faturamento acumulado</span>
                <strong>{loadingSales ? '...' : formatCurrency(totalRevenue)}</strong>
              </div>
            </section>

            <section className="table-card">
              <div className="table-card-header">
                <div>
                  <h3>Receitas registradas</h3>
                  <p>{loadingSales ? 'Carregando...' : `${sales.length} item(ns) no total`}</p>
                </div>
                <button className="primary-button" type="button" onClick={openSaleModal} disabled={products.length === 0}>
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
                      <th>Criado em</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSales.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="empty-state">
                          {sales.length === 0 ? 'Nenhuma receita registrada ainda.' : 'Nenhuma receita nesta página.'}
                        </td>
                      </tr>
                    ) : (
                      paginatedSales.map((sale) => (
                        <tr key={sale.id}>
                          <td>{sale.id}</td>
                          <td>{formatDate(sale.date)}</td>
                          <td>{formatCurrency(sale.total_price)}</td>
                          <td>{formatDate(sale.created_at)}</td>
                          <td>
                            <div className="row-actions">
                              <button
                                className="ghost-button row-action-button icon-action-button"
                                type="button"
                                onClick={() => void openSaleDetails(sale)}
                                aria-label={`Visualizar receita ${sale.id}`}
                                title="Visualizar"
                              >
                                <EyeIcon />
                              </button>
                              <button
                                className="danger-button row-action-button icon-action-button"
                                type="button"
                                onClick={() => void handleDeleteSale(sale)}
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
                onPrevious={() => setSalePage((prev) => Math.max(prev - 1, 1))}
                onNext={() => setSalePage((prev) => Math.min(prev + 1, totalSalePages))}
              />
            </section>
          </>
        )}
      </main>

      <ProductModal open={productModalOpen} product={editingProduct} onClose={closeProductModal} onSave={handleSaveProduct} />
      <SaleModal open={saleModalOpen} products={products} onClose={closeSaleModal} onSave={handleSaveSale} />
      <SaleDetailsModal open={saleDetailsOpen} sale={saleDetails} products={products} status={saleDetailsStatus} onClose={() => {
        setSaleDetailsOpen(false);
        setSaleDetails(null);
        setSaleDetailsStatus('');
      }} />
    </div>
  );
}

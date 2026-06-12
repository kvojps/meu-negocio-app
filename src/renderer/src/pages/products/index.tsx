import { useEffect, useMemo, useState } from 'react';

import './styles.css';

import type { Product } from '../../../../shared/types/product';
import type { SortKey } from '../../hooks/useProducts';
import { useProducts } from '../../hooks/useProducts';

type FormData = {
  name: string;
  description: string;
  category: string;
  supplier: string;
  costPrice: string;
  salePrice: string;
  stock: string;
  minStock: string;
};

const emptyForm: FormData = {
  name: '',
  description: '',
  category: '',
  supplier: '',
  costPrice: '',
  salePrice: '',
  stock: '',
  minStock: '',
};

function SortIndicator({ direction }: { direction: 'asc' | 'desc' | null }) {
  if (!direction) return null;
  return (
    <span style={{ marginLeft: 4 }}>{direction === 'asc' ? '▲' : '▼'}</span>
  );
}

function StockBadge({ stock, minStock }: { stock: number; minStock: number }) {
  let className = 'stock-badge--ok';
  let label = 'OK';

  if (stock <= 0) {
    className = 'stock-badge--low';
    label = 'Sem estoque';
  } else if (stock <= minStock) {
    className = 'stock-badge--warn';
    label = 'Baixo';
  }

  return <span className={`stock-badge ${className}`}>{label}</span>;
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="products-form-field">
      <label
        className={`products-form-label ${required ? 'products-form-label--required' : ''}`}
      >
        {label}
      </label>
      {children}
      {error && <span className="products-form-error">{error}</span>}
    </div>
  );
}

export function ProductsPage() {
  const {
    products,
    filtered,
    filters,
    sort,
    setFilters,
    toggleSort,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (deleteTarget) {
          setDeleteTarget(null);
        } else if (formModalOpen) {
          handleCloseForm();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [products]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const sortableColumns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Nome' },
    { key: 'category', label: 'Categoria' },
    { key: 'supplier', label: 'Fornecedor' },
    { key: 'salePrice', label: 'Preço Venda' },
    { key: 'stock', label: 'Estoque' },
  ];

  function handleOpenNew() {
    setForm(emptyForm);
    setFormErrors({});
    setEditingId(null);
    setFormModalOpen(true);
  }

  function handleOpenEdit(product: Product) {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      supplier: product.supplier,
      costPrice: String(product.costPrice),
      salePrice: String(product.salePrice),
      stock: String(product.stock),
      minStock: String(product.minStock),
    });
    setFormErrors({});
    setEditingId(product.id);
    setFormModalOpen(true);
  }

  function handleCloseForm() {
    setFormModalOpen(false);
    setEditingId(null);
    setFormErrors({});
  }

  function validateForm(): boolean {
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errors.name = 'Nome é obrigatório';
    if (!form.category.trim()) errors.category = 'Categoria é obrigatória';
    if (!form.costPrice.trim() || Number(form.costPrice) < 0)
      errors.costPrice = 'Preço de custo inválido';
    if (!form.salePrice.trim() || Number(form.salePrice) < 0)
      errors.salePrice = 'Preço de venda inválido';
    if (
      !form.stock.trim() ||
      Number(form.stock) < 0 ||
      !Number.isInteger(Number(form.stock))
    )
      errors.stock = 'Estoque inválido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSave() {
    if (!validateForm()) return;

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      supplier: form.supplier.trim(),
      costPrice: Number(form.costPrice),
      salePrice: Number(form.salePrice),
      stock: Number(form.stock),
      minStock: form.minStock.trim() ? Number(form.minStock) : 0,
    };

    if (editingId) {
      updateProduct(editingId, data);
    } else {
      addProduct(data);
    }

    handleCloseForm();
  }

  function handleConfirmDelete() {
    if (deleteTarget) {
      deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-header-title">Produtos</h1>
        <button
          className="products-header-button"
          onClick={handleOpenNew}
          type="button"
        >
          + Novo Produto
        </button>
      </div>

      <div className="products-filters">
        <input
          className="products-filters-search"
          placeholder="Buscar por nome..."
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="products-filters-select"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          className={`products-filters-toggle ${filters.lowStockOnly ? 'products-filters-toggle--active' : ''}`}
          onClick={() =>
            setFilters({ ...filters, lowStockOnly: !filters.lowStockOnly })
          }
          type="button"
        >
          Estoque baixo
        </button>
      </div>

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              {sortableColumns.map((col) => (
                <th
                  key={col.key}
                  className={
                    sort.key === col.key ? 'products-table-th--sorted' : ''
                  }
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}
                  {sort.key === col.key && (
                    <SortIndicator direction={sort.direction} />
                  )}
                </th>
              ))}
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
                <td>
                  <span style={{ marginRight: 8 }}>{product.stock}</span>
                  <StockBadge
                    stock={product.stock}
                    minStock={product.minStock}
                  />
                </td>
                <td className="products-table-cell--actions">
                  <button
                    className="products-table-btn products-table-btn--edit"
                    onClick={() => handleOpenEdit(product)}
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    className="products-table-btn products-table-btn--delete"
                    onClick={() => setDeleteTarget(product)}
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

      {formModalOpen && (
        <div
          className="products-modal-overlay"
          onClick={handleCloseForm}
          role="presentation"
        >
          <div
            className="products-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <div className="products-modal-header">
              <h2 className="products-modal-title">
                {editingId ? 'Editar Produto' : 'Novo Produto'}
              </h2>
              <button
                className="products-modal-close"
                onClick={handleCloseForm}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="products-modal-body">
              <div className="products-form">
                <FormField label="Nome" required error={formErrors.name}>
                  <input
                    className={`products-form-input ${formErrors.name ? 'products-form-input--error' : ''}`}
                    placeholder="Nome do produto"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </FormField>

                <FormField label="Descrição">
                  <textarea
                    className="products-form-textarea"
                    placeholder="Descrição do produto (opcional)"
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </FormField>

                <div className="products-form-row">
                  <FormField
                    label="Categoria"
                    required
                    error={formErrors.category}
                  >
                    <input
                      className={`products-form-input ${formErrors.category ? 'products-form-input--error' : ''}`}
                      placeholder="Ex: Vestuário"
                      type="text"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    />
                  </FormField>

                  <FormField label="Fornecedor">
                    <input
                      className="products-form-input"
                      placeholder="Nome do fornecedor"
                      type="text"
                      value={form.supplier}
                      onChange={(e) =>
                        setForm({ ...form, supplier: e.target.value })
                      }
                    />
                  </FormField>
                </div>

                <div className="products-form-row">
                  <FormField
                    label="Preço de Custo"
                    required
                    error={formErrors.costPrice}
                  >
                    <input
                      className={`products-form-input ${formErrors.costPrice ? 'products-form-input--error' : ''}`}
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.costPrice}
                      onChange={(e) =>
                        setForm({ ...form, costPrice: e.target.value })
                      }
                    />
                  </FormField>

                  <FormField
                    label="Preço de Venda"
                    required
                    error={formErrors.salePrice}
                  >
                    <input
                      className={`products-form-input ${formErrors.salePrice ? 'products-form-input--error' : ''}`}
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.salePrice}
                      onChange={(e) =>
                        setForm({ ...form, salePrice: e.target.value })
                      }
                    />
                  </FormField>
                </div>

                <div className="products-form-row">
                  <FormField label="Estoque" required error={formErrors.stock}>
                    <input
                      className={`products-form-input ${formErrors.stock ? 'products-form-input--error' : ''}`}
                      placeholder="0"
                      type="number"
                      step="1"
                      min="0"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                      }
                    />
                  </FormField>

                  <FormField label="Estoque Mínimo">
                    <input
                      className="products-form-input"
                      placeholder="0"
                      type="number"
                      step="1"
                      min="0"
                      value={form.minStock}
                      onChange={(e) =>
                        setForm({ ...form, minStock: e.target.value })
                      }
                    />
                  </FormField>
                </div>
              </div>
            </div>

            <div className="products-modal-footer">
              <button
                className="products-modal-btn products-modal-btn--cancel"
                onClick={handleCloseForm}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="products-modal-btn products-modal-btn--confirm"
                onClick={handleSave}
                type="button"
              >
                {editingId ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div
          className="products-modal-overlay"
          onClick={() => setDeleteTarget(null)}
          role="presentation"
        >
          <div
            className="products-modal"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
          >
            <div className="products-modal-header">
              <h2 className="products-modal-title">Excluir Produto</h2>
              <button
                className="products-modal-close"
                onClick={() => setDeleteTarget(null)}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="products-modal-body">
              <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.6 }}>
                Tem certeza que deseja excluir{' '}
                <strong>{deleteTarget.name}</strong>? Esta ação não pode ser
                desfeita.
              </p>
            </div>

            <div className="products-modal-footer">
              <button
                className="products-modal-btn products-modal-btn--cancel"
                onClick={() => setDeleteTarget(null)}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="products-modal-btn products-modal-btn--danger"
                onClick={handleConfirmDelete}
                type="button"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

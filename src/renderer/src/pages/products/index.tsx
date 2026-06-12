import { useMemo, useState } from 'react';

import { ConfirmDialog } from '../../components/ConfirmDialog';

import './styles.css';

import type { Product } from '../../../../shared/types/product';
import { useProducts } from '../../hooks/useProducts';
import { ProductFilters } from './ProductFilters';
import { ProductFormModal } from './ProductFormModal';
import { ProductTable } from './ProductTable';
import { useProductForm } from './useProductForm';

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

  const form = useProductForm();
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category));
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [products]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-header-title">Produtos</h1>
        <button
          className="products-header-button"
          onClick={form.openNew}
          type="button"
        >
          + Novo Produto
        </button>
      </div>

      <ProductFilters
        filters={filters}
        categories={categories}
        onChange={setFilters}
      />

      <ProductTable
        filtered={filtered}
        totalCount={products.length}
        sort={sort}
        onToggleSort={toggleSort}
        onEdit={form.openEdit}
        onDelete={setDeleteTarget}
      />

      <ProductFormModal
        isOpen={form.isOpen}
        editingId={form.editingId}
        form={form.form}
        formErrors={form.formErrors}
        onSave={() => form.save(addProduct, updateProduct)}
        onClose={form.close}
        onChange={form.setForm}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir Produto"
        onConfirm={() => {
          if (deleteTarget) {
            deleteProduct(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Confirmar Exclusão"
        danger
      >
        Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>?
        Esta ação não pode ser desfeita.
      </ConfirmDialog>
    </div>
  );
}

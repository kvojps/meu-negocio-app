import { useMemo, useState } from 'react';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Pagination } from '../../components/Pagination';
import './styles.css';
import type { Product } from '../../../../shared/types/product';
import { useProductConfirm } from '../../hooks/products/useProductConfirm';
import { useProductForm } from '../../hooks/products/useProductForm';
import { useProducts } from '../../hooks/products/useProducts';
import { usePagination } from '../../hooks/usePagination';
import { ProductFilters } from './ProductFilters';
import { ProductFormModal } from './ProductFormModal';
import { ProductTable } from './ProductTable';

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

  const form = useProductForm(addProduct, updateProduct);
  const confirm = useProductConfirm(deleteProduct);

  const { page, setPage, totalPages, paginatedItems, start } = usePagination(
    filtered,
    10,
  );

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

      <div className="products-table-card">
        <ProductTable
          filtered={paginatedItems}
          totalCount={filtered.length}
          start={start}
          sort={sort}
          onToggleSort={toggleSort}
          onEdit={form.openEdit}
          onDelete={confirm.setDeleteTarget}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <ProductFormModal
        isOpen={form.isOpen}
        editingId={form.editingId}
        form={form.form}
        formErrors={form.formErrors}
        onSave={form.save}
        onClose={form.close}
        onChange={form.setForm}
      />

      {confirm.deleteTarget &&
        (() => {
          const { title, message, confirmLabel, danger } = confirm.buildProps();
          return (
            <ConfirmDialog
              open
              title={title}
              onConfirm={confirm.handleAction}
              onCancel={() => confirm.setDeleteTarget(null)}
              confirmLabel={confirmLabel}
              danger={danger}
            >
              {message}
            </ConfirmDialog>
          );
        })()}
    </div>
  );
}

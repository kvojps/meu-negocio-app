import { useMemo, useState } from 'react';
import { ActionsMenu } from '../../components/ActionsMenu';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { DataTable } from '../../components/DataTable';
import type { Column } from '../../components/DataTable';
import { Pagination } from '../../components/Pagination';
import { StockBadge } from '../../components/StockBadge';
import './styles.css';
import type { Product } from '../../../../shared/types/product';
import { useProductConfirm } from '../../hooks/products/useProductConfirm';
import { useProductForm } from '../../hooks/products/useProductForm';
import type { SortKey } from '../../hooks/products/useProducts';
import { useProducts } from '../../hooks/products/useProducts';
import { usePagination } from '../../hooks/usePagination';
import { ProductFilters } from './ProductFilters';
import { ProductFormModal } from './ProductFormModal';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

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

  const lowStockCount = useMemo(
    () => products.filter((p) => p.stock <= p.minStock).length,
    [products],
  );

  const columns: Column<Product>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Nome',
        sortable: true,
        render: (p: Product) => <strong>{p.name}</strong>,
      },
      {
        key: 'category',
        label: 'Categoria',
        sortable: true,
        render: (p: Product) => p.category,
      },
      {
        key: 'supplier',
        label: 'Fornecedor',
        sortable: true,
        render: (p: Product) => p.supplier,
      },
      {
        key: 'salePrice',
        label: 'Preço Venda',
        sortable: true,
        render: (p: Product) => formatCurrency(p.salePrice),
      },
      {
        key: 'stock',
        label: 'Estoque',
        sortable: true,
        render: (p: Product) => (
          <>
            <span
              style={{ marginRight: 8 }}
              className={
                p.stock <= p.minStock ? 'stock-number--low' : ''
              }
            >
              {p.stock}
            </span>
            <StockBadge stock={p.stock} minStock={p.minStock} />
          </>
        ),
      },
    ],
    [],
  );

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
        lowStockCount={lowStockCount}
        onChange={setFilters}
      />

      <DataTable
          columns={columns}
          items={paginatedItems}
          totalCount={filtered.length}
          start={start}
          sort={sort}
          onToggleSort={(key) => toggleSort(key as SortKey)}
          renderActions={(product: Product) => (
            <ActionsMenu
              onEdit={() => form.openEdit(product)}
              onDelete={() => confirm.setDeleteTarget(product)}
            />
          )}
          footerLabel="produtos"
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />

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

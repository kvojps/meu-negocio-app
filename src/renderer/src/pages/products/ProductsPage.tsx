import { ActionsMenu } from '@components/ActionsMenu';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { DataTable } from '@components/DataTable';
import type { Column } from '@components/DataTable';
import { PlusIcon, ProductIcon } from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { StockBadge } from '@components/StockBadge';
import { useProductConfirm } from '@hooks/products/useProductConfirm';
import { useProductForm } from '@hooks/products/useProductForm';
import type { SortKey } from '@hooks/products/useProducts';
import { useProducts } from '@hooks/products/useProducts';
import { usePagination } from '@hooks/usePagination';
import { Button, Stack, Typography } from '@mui/material';
import type { Product } from '@shared/types/product';
import { useMemo } from 'react';
import { ProductFilters } from './components/ProductFilters';
import { ProductFormModal } from './components/ProductFormModal';

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
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="body2"
              color={p.stock <= p.minStock ? 'error.main' : 'text.primary'}
            >
              {p.stock}
            </Typography>
            <StockBadge stock={p.stock} minStock={p.minStock} />
          </Stack>
        ),
      },
    ],
    [],
  );

  return (
    <Stack spacing={2}>
      <PageHeader
        icon={<ProductIcon />}
        title="Produtos"
        subtitle="Cadastro e controle de estoque do seu catálogo"
        actions={
          <Button
            variant="contained"
            startIcon={<PlusIcon size={16} />}
            onClick={form.openNew}
          >
            Novo Produto
          </Button>
        }
      />

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
        getRowKey={(product) => product.id}
        footerLabel="produtos"
        emptyMessage="Nenhum produto cadastrado ainda — clique em “+ Novo Produto” para começar."
        pagination={{ currentPage: page, totalPages, onPageChange: setPage }}
      />

      <ProductFormModal formState={form} />

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
    </Stack>
  );
}

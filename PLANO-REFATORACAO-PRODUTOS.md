# Plano de Refatoração — Products Page

## Diagnóstico

`src/renderer/src/pages/products/index.tsx` — **534 linhas, 10+ responsabilidades**:

| Responsabilidade | Linhas |
|---|---|
| Componentes inline (`SortIndicator`, `StockBadge`, `FormField`) | ~55 |
| Layout + header da página | ~10 |
| Filtros (JSX + estado inline) | ~30 |
| Tabela (JSX + sort + ações) | ~60 |
| Modal de formulário (JSX + estado + validação) | ~170 |
| Modal de exclusão (JSX + estado) | ~50 |
| Lógica de form (validação, save, open/close) | ~70 |
| Utilidades (`formatCurrency`, `categories`) | ~15 |
| Efeito colateral (Escape key) | ~12 |

**Duplicação com Orders**: `SortIndicator`, `FormField`, `Modal`, `ConfirmDialog`, `formatCurrency` — tudo reescrito em `src/renderer/src/pages/orders/index.tsx`.

## Organização final

Seguindo a convenção já existente no projeto (sidebar em `components/sidebar/`):

```
src/renderer/src/
  components/                          ← compartilhados
    Modal/
      index.tsx + styles.css           ← overlay + dialog com slots
    ConfirmDialog/
      index.tsx + styles.css           ← Modal + título + confirm/cancel
    SortIndicator.tsx                  ← ▲/▼ (inline style, sem CSS)
    FormField/
      index.tsx + styles.css           ← label + children + erro
    StockBadge.tsx                     ← badge de estoque (sem CSS próprio, usa classes do produto)

  hooks/                               ← já existe, mantido
    useProducts.ts                     ← inalterado
    useOrders.ts                       ← inalterado

  pages/products/                      ← flat, sem subpastas
    index.tsx                          ← só orquestração (~50 linhas)
    styles.css                         ← mantido (classes de layout da página)
    ProductFilters.tsx                 ← busca + categoria + toggle
    ProductTable.tsx                   ← tabela ordenável + StockBadge
    ProductFormModal.tsx               ← modal de criar/editar
    useProductForm.ts                  ← estado + validação do form
```

## Sequência de tarefas

| # | Tarefa | Arquivos envolvidos | Descrição |
|---|---|---|---|
| 1 | **Criar `Modal` compartilhado** | `components/Modal/index.tsx`, `components/Modal/styles.css` | Overlay + dialog com props `open`, `onClose`, `title`, `children` (body), `footer` (slot). Fecha no Escape e no overlay. |
| 2 | **Criar `ConfirmDialog` compartilhado** | `components/ConfirmDialog/index.tsx`, `components/ConfirmDialog/styles.css` | Usa `Modal`. Props: `open`, `title`, `message`, `confirmLabel`, `onConfirm`, `onCancel`, `danger` (para botão vermelho). |
| 3 | **Criar `SortIndicator` compartilhado** | `components/SortIndicator.tsx` | Extraído do código duplicado. Props: `direction: 'asc' \| 'desc' \| null`. |
| 4 | **Criar `FormField` compartilhado** | `components/FormField/index.tsx`, `components/FormField/styles.css` | Props: `label`, `required`, `error`, `children`. Estilos migrados de `products/styles.css` (`.products-form-field/label/error` → genéricos). |
| 5 | **Criar `StockBadge`** | `components/StockBadge.tsx` | Props: `stock`, `minStock`. Classes CSS permanecem em `products/styles.css` (específicas do domínio). |
| 6 | **Criar `useProductForm`** | `pages/products/useProductForm.ts` | Hook que encapsula: `FormData`, `editingId`, `formErrors`, `isOpen`; funções `openNew()`, `openEdit(product)`, `close()`, `validate()`, `save(addProduct, updateProduct)`. |
| 7 | **Criar `ProductFilters`** | `pages/products/ProductFilters.tsx` | Props: `filters`, `categories`, `onChange`. Renderiza busca + select + toggle. |
| 8 | **Criar `ProductTable`** | `pages/products/ProductTable.tsx` | Props: `filtered`, `sort`, `onToggleSort`, `onEdit`, `onDelete`. Renderiza tabela com `SortIndicator` e `StockBadge`. |
| 9 | **Criar `ProductFormModal`** | `pages/products/ProductFormModal.tsx` | Usa `Modal` + `FormField`. Props: `form` (do hook useProductForm), `onSave`, `onClose`. Renderiza todos os campos do formulário. |
| 10 | **Simplificar `index.tsx`** | `pages/products/index.tsx` | Remove tudo que foi extraído. Fica com: `useProducts()`, `useProductForm()`, estado `deleteTarget`, composição dos componentes. Remove `SortIndicator`, `StockBadge`, `FormField`, `formatCurrency` (substituído pelo compartilhado). |
| 11 | **Migrar estilos** | `pages/products/styles.css` | Remover classes de `FormField` movidas para `components/FormField/styles.css`. Manter classes de layout (`.products-page`, `.products-header`, `.products-filters`, `.products-table-*`, `.stock-badge`, `.products-modal-*`). |
| 12 | **Otimizar Orders (opcional)** | `pages/orders/index.tsx` | Substituir `SortIndicator` inline pelo compartilhado e usar `Modal`/`ConfirmDialog` compartilhados. Reduz duplicação, mas é um passo à parte. |

## Interfaces de props (contratos)

```tsx
// Modal
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

// ConfirmDialog
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;      // default "Confirmar"
  cancelLabel?: string;       // default "Cancelar"
  danger?: boolean;           // botão vermelho
  children: React.ReactNode;
}

// SortIndicator
interface SortIndicatorProps {
  direction: 'asc' | 'desc' | null;
}

// FormField
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

// StockBadge
interface StockBadgeProps {
  stock: number;
  minStock: number;
}

// ProductFilters
interface ProductFiltersProps {
  filters: FilterState;
  categories: string[];
  onChange: (filters: FilterState) => void;
}

// ProductTable
interface ProductTableProps {
  filtered: Product[];
  sort: SortState;
  onToggleSort: (key: SortKey) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// useProductForm retorno
interface UseProductFormReturn {
  isOpen: boolean;
  editingId: string | null;
  form: FormData;
  formErrors: Partial<Record<keyof FormData, string>>;
  openNew: () => void;
  openEdit: (product: Product) => void;
  close: () => void;
  save: (add: AddFn, update: UpdateFn) => void;
  setForm: Dispatch<SetStateAction<FormData>>;
}
```

## Como fica `index.tsx` depois

```tsx
import { useMemo, useState } from 'react';

import './styles.css';

import type { Product } from '../../../../shared/types/product';
import { useProducts } from '../../hooks/useProducts';
import { ProductFilters } from './ProductFilters';
import { ProductTable } from './ProductTable';
import { ProductFormModal } from './ProductFormModal';
import { useProductForm } from './useProductForm';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export function ProductsPage() {
  const { products, filtered, filters, sort, setFilters, toggleSort, addProduct, updateProduct, deleteProduct } = useProducts();
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
        <button className="products-header-button" onClick={form.openNew} type="button">
          + Novo Produto
        </button>
      </div>

      <ProductFilters filters={filters} categories={categories} onChange={setFilters} />

      <ProductTable
        filtered={filtered}
        sort={sort}
        onToggleSort={toggleSort}
        onEdit={form.openEdit}
        onDelete={setDeleteTarget}
      />

      <ProductFormModal form={form} onSave={form.save} onClose={form.close} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir Produto"
        onConfirm={() => { deleteProduct(deleteTarget!.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel="Confirmar Exclusão"
        danger
      >
        <p>
          Tem certeza que deseja excluir <strong>{deleteTarget?.name}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </ConfirmDialog>
    </div>
  );
}
```

**~50 linhas, 1 responsabilidade**: orquestrar a página.

## Riscos e observações

- **Nomes de classes CSS**: `ProductFilters` e `ProductTable` continuam usando classes `.products-filters-*` e `.products-table-*` do `styles.css` original — sem quebra.
- **`FormField` compartilhado**: as classes `.products-form-field/label/error` viram `.form-field/label/error` no CSS do componente. Isso **quebra** o `products/styles.css` — por isso a tarefa 11 (migração de estilos) existe.
- **StockBadge**: fica em `components/` porque Orders também mostra badges de status e pode reusar. Mas as classes CSS `.stock-badge*` continuam no `products/styles.css` — se Orders também usar, o CSS precisa ser migrado para um lugar compartilhado.
- **Ordem de execução**: as tarefas 1-5 (componentes compartilhados) podem ser paralelizadas. As tarefas 6-9 dependem das interfaces definidas em 1-5. A tarefa 10 (simplificar index) é a última e mais rápida.

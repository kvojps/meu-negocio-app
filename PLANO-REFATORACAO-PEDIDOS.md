# Plano de Refatoração — Orders Page

## Diagnóstico

`src/renderer/src/pages/orders/index.tsx` — **643 linhas, múltiplas responsabilidades**:

| Responsabilidade | Linhas |
|---|---|
| Layout + header da página | ~12 |
| Filtros (JSX + estado inline + `statusOptions`) | ~22 |
| Tabela (JSX + sort + colunas + ações por status) | ~120 |
| Modal de formulário (JSX + itens dinâmicos + total) | ~150 |
| Modal de visualização (JSX + detalhes + tabela de itens) | ~75 |
| Lógica de confirmação (`buildConfirmProps` + `handleConfirmAction`) | ~50 |
| Estado do form (customer, itens, manual total, erros) | ~10 |
| Lógica do form (validate, save, item change, add, remove) | ~70 |
| Utilitários (`formatCurrency`, `formatDate`, `sortableColumns`) | ~18 |

**Já extraído na tarefa 12**: `SortIndicator`, `Modal`, `ConfirmDialog` — uso dos compartilhados.

## Organização final

Seguindo o mesmo padrão de Products (arquivos flat junto ao `index.tsx`):

```
src/renderer/src/pages/orders/
  index.tsx            ← orquestração (~80-100 linhas)
  styles.css           ← mantido, classes de layout
  OrderFilters.tsx     ← busca + select status
  OrderTable.tsx       ← tabela ordenável + ações por status
  OrderFormModal.tsx   ← modal de criar pedido (itens dinâmicos)
  OrderViewModal.tsx   ← modal de detalhes do pedido
  useOrderForm.ts      ← estado + validação do form
  useOrderConfirm.ts   ← lógica de confirmação (buildConfirmProps + handleConfirmAction)
```

## Tarefas

| # | Tarefa | Arquivos | Descrição |
|---|---|---|---|
| 1 | **Criar `OrderFilters`** | `pages/orders/OrderFilters.tsx` | Props: `filters: OrderFilterState`, `onChange`. Renderiza input busca + select status. `statusOptions` move para dentro do componente. |
| 2 | **Criar `OrderTable`** | `pages/orders/OrderTable.tsx` | Props: `filtered`, `totalCount`, `sort`, `onToggleSort`, `onView`, `onConfirm`. Renderiza tabela com headers ordenáveis + `SortIndicator` + ações condicionais por status + `formatCurrency`/`formatDate` internos. |
| 3 | **Criar `useOrderForm`** | `pages/orders/useOrderForm.ts` | Hook que encapsula: `FormItem`, `emptyFormItem()`, `formCustomer`, `formItems`, `formManualEnabled`, `formManualTotal`, `formErrors`, `isOpen`; funções `open()`, `close()`, `validate()`, `save(addOrder)`, `addItem()`, `removeItem(index)`, `updateItem(index, field, value, products)`. |
| 4 | **Criar `OrderFormModal`** | `pages/orders/OrderFormModal.tsx` | Usa `Modal` + `FormField`. Props: hook `useOrderForm` + `products` (para o select de produtos). Renderiza campos + itens dinâmicos + total. |
| 5 | **Criar `useOrderConfirm`** | `pages/orders/useOrderConfirm.ts` | Hook que encapsula: estado `confirmTarget`, funções `buildProps()` e `handleAction(setOrderStatus, deleteOrder)`. |
| 6 | **Criar `OrderViewModal`** | `pages/orders/OrderViewModal.tsx` | Usa `Modal`. Props: `viewTarget: Order \| null`, `onClose`. Renderiza info + tabela de itens + total. |
| 7 | **Simplificar `index.tsx`** | `pages/orders/index.tsx` | Remove tudo extraído. Fica com: `useOrders()`, `useOrderForm()`, `useOrderConfirm()`, estado `viewTarget`, composição dos componentes. Remove `statusOptions`, `FormItem`, `emptyFormItem`, `formatCurrency`, `formatDate`, `sortableColumns`, `buildConfirmProps`, `handleConfirmAction`, `handleOpen/CloseForm`, `handleAdd/RemoveItem`, `handleItemChange`, `validateForm`, `handleSaveOrder`. |
| 8 | **Limpar `styles.css`** | `pages/orders/styles.css` | Remover classes duplicadas do `FormField` compartilhado: `.orders-form-field*`, `.orders-form-label*`, `.orders-form-error`. Substituir uso inline do label/error pelo `FormField`. |

## Contratos (props)

```tsx
// OrderFilters
interface OrderFiltersProps {
  filters: OrderFilterState;
  onChange: (filters: OrderFilterState) => void;
}

// OrderTable
interface OrderTableProps {
  filtered: Order[];
  totalCount: number;
  sort: OrderSortState;
  onToggleSort: (key: OrderSortKey) => void;
  onView: (order: Order) => void;
  onConfirm: (target: { type: 'advance' | 'cancel' | 'reopen' | 'delete'; order: Order }) => void;
}

// useOrderForm return
interface UseOrderFormReturn {
  isOpen: boolean;
  customer: string;
  items: FormItem[];
  manualEnabled: boolean;
  manualTotal: string;
  errors: Record<string, string>;
  open: () => void;
  close: () => void;
  save: (addOrder: AddOrderFn) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, field: string, value: string) => void;
  setCustomer: (value: string) => void;
  setManualEnabled: (value: boolean) => void;
  setManualTotal: (value: string) => void;
}

// useOrderConfirm return
interface UseOrderConfirmReturn {
  confirmTarget: { type: string; order: Order } | null;
  setConfirmTarget: (target: { type: string; order: Order } | null) => void;
  buildProps: () => { title: string; message: string; confirmLabel: string; danger: boolean };
  handleAction: () => void;
}

// OrderFormModal
interface OrderFormModalProps {
  form: UseOrderFormReturn;
  products: Product[];
}

// OrderViewModal
interface OrderViewModalProps {
  viewTarget: Order | null;
  onClose: () => void;
}
```

## `index.tsx` depois (~80 linhas)

```tsx
import { useState } from 'react';

import './styles.css';

import type { Order } from '../../../../shared/types/order';
import { useOrders } from '../../hooks/useOrders';
import { useProducts } from '../../hooks/useProducts';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { OrderFilters } from './OrderFilters';
import { OrderTable } from './OrderTable';
import { OrderFormModal } from './OrderFormModal';
import { OrderViewModal } from './OrderViewModal';
import { useOrderForm } from './useOrderForm';
import { useOrderConfirm } from './useOrderConfirm';

export function OrdersPage() {
  const { products, adjustStock } = useProducts();
  const {
    orders, filtered, filters, sort,
    setFilters, toggleSort, addOrder,
    setOrderStatus, deleteOrder,
  } = useOrders(adjustStock);

  const form = useOrderForm();
  const confirm = useOrderConfirm(setOrderStatus, deleteOrder);
  const [viewTarget, setViewTarget] = useState<Order | null>(null);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-header-title">Pedidos</h1>
        <button className="orders-header-button" onClick={form.open} type="button">
          + Novo Pedido
        </button>
      </div>

      <OrderFilters filters={filters} onChange={setFilters} />

      <OrderTable
        filtered={filtered}
        totalCount={orders.length}
        sort={sort}
        onToggleSort={toggleSort}
        onView={setViewTarget}
        onConfirm={confirm.setConfirmTarget}
      />

      <OrderFormModal form={form} products={products} />

      <OrderViewModal viewTarget={viewTarget} onClose={() => setViewTarget(null)} />

      {confirm.confirmTarget && (() => {
        const { title, message, confirmLabel, danger } = confirm.buildProps();
        return (
          <ConfirmDialog
            open title={title}
            onConfirm={confirm.handleAction}
            onCancel={() => confirm.setConfirmTarget(null)}
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
```

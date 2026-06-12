# Plano — Tela de Pedidos

## Modelo de Dados

**`src/shared/types/order.ts`**

```ts
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  customerName: string
  status: OrderStatus
  items: OrderItem[]
  manualTotal?: number    // se preenchido, substitui soma dos itens
  createdAt: string
  updatedAt: string
}

export function getOrderTotal(order: Order): number {
  if (order.manualTotal !== undefined) return order.manualTotal
  return order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
}
```

---

## Mapeamento de Status

| Status | Label | Cor | Ação disponível |
|---|---|---|---|
| `pending` | Pendente | Amarelo | Avançar p/ "Em andamento" ou Cancelar |
| `in_progress` | Em andamento | Azul | Avançar p/ "Concluído" ou Cancelar |
| `completed` | Concluído | Verde | Estornar p/ "Em andamento" (reverte estoque) |
| `cancelled` | Cancelado | Vermelho | — (finalizado) |

**Regra de estoque:**
- Ao mudar para `completed`: deduzir `quantity` do estoque de cada item
- Ao sair de `completed` (estorno): devolver `quantity` ao estoque

---

## Estrutura da Página

```
Pedidos                                    [+ Novo Pedido]

🔍 Buscar cliente...    [Todos os status ▼]

Cliente ▲ │ Status │ Itens │ Total │ Data │ Ações
──────────┼────────┼───────┼───────┼──────┼─────────
João      │ ● Pendente │ 3    │ R$ 147 │ 15/01 │ 👁 ✏️ ❌
Maria     │ ● Concluído│ 1    │ R$ 59  │ 10/01 │ 👁

Mostrando X de Y pedidos
```

---

## Funcionalidades por Tarefa

| # | Tarefa | Descrição |
|---|---|---|
| 1 | `shared/types/order.ts` | Interface Order, OrderItem, OrderStatus, helpers |
| 2 | `mocks/orders.ts` | 6 pedidos mockados com itens variados |
| 3 | `hooks/useOrders.ts` | CRUD + filtro + sort + atualização de estoque (recebe `adjustStock` via parâmetro) |
| 4 | `pages/orders/styles.css` | Todos os estilos (tabela, badges status, modais) |
| 5 | `pages/orders/index.tsx` — Estrutura base | Header, botão Novo, filtros placeholder |
| 6 | `pages/orders/index.tsx` — Tabela + sort | Renderizar pedidos, sort cíclico, badge de status colorido |
| 7 | `pages/orders/index.tsx` — Filtros | Busca por cliente, select de status |
| 8 | `pages/orders/index.tsx` — Modal Novo Pedido | Nome do cliente + adicionar itens (select de produto + qtd) + preço automático ou manual |
| 9 | `pages/orders/index.tsx` — Modal Ver Itens | Detalhamento dos itens do pedido |
| 10 | `pages/orders/index.tsx` — Ações de status | Botões para avançar/reverter status (com confirmação) + exclusão |
| 11 | Integrar hooks | Na página, `useProducts` + `useOrders` com `adjustStock` conectado |

---

## Hook `useOrders`

```ts
function useOrders(adjustStock: (productId: string, delta: number) => void) {
  // Estado: orders[], filters, sort
  // filtered via useMemo
  // addOrder(data) → gera itens com id, calcula total
  // setOrderStatus(id, 'completed') → chama adjustStock(item.productId, -item.quantity)
  // setOrderStatus(id, 'in_progress') → se saindo de 'completed', chama adjustStock(item.productId, +item.quantity)
  // deleteOrder(id) → só se status for 'pending', sem ajuste de estoque
}
```

---

## Modal Novo Pedido

- **Campos:** Nome do cliente (text, obrigatório)
- **Seção de itens:** lista dinâmica com + Adicionar Item
  - Cada item: select de produto + quantidade (number) + preço unitário (preenchido automático, editável)
- **Total:** calculado automaticamente (soma qtd × preço)
- **Toggle "Valor personalizado":** se ativado, exibe input de total manual que sobrepõe o calculado

---

## Arquivos

```
src/
├── shared/types/
│   └── order.ts              ← NOVO
├── renderer/src/
│   ├── mocks/
│   │   └── orders.ts          ← NOVO
│   ├── hooks/
│   │   └── useOrders.ts       ← NOVO
│   └── pages/orders/
│       ├── index.tsx          ← REESCREVER
│       └── styles.css         ← REESCREVER
```

Total: 3 arquivos novos, renderer pages modificados.

---

## Dependência entre Páginas

Na `OrdersPage`, ambos hooks são usados:

```ts
const { products, updateProductStock } = useProducts()
const { ... } = useOrders(updateProductStock)
```

`updateProductStock` ajusta `product.stock` por um delta (positivo ou negativo).

---

## Critérios de Verificação

- `npx tsc --noEmit` sem erros
- Tabela exibe pedidos mockados com status colorido
- Filtro por nome do cliente funciona
- Filtro por status funciona
- Sort por colunas funciona
- Modal Novo Pedido permite adicionar itens com produtos existentes
- Modal exibe detalhes dos itens
- Avançar status de pedido funciona
- Ao concluir pedido, estoque dos produtos é deduzido
- Estorno de conclusão devolve estoque
- Exclusão só permitida em "Pendente"
- Preços formatados em R$
- Datas formatadas padrão brasileiro

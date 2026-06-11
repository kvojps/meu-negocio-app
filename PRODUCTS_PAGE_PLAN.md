# Plano — Tela de Produtos

## Estrutura de Arquivos

```
src/
├── shared/
│   └── types/
│       └── product.ts
├── renderer/src/
│   ├── mocks/
│   │   └── products.ts
│   ├── hooks/
│   │   └── useProducts.ts
│   └── pages/products/
│       └── index.tsx
│       └── styles.css
```

---

## 1. `src/shared/types/product.ts`

```ts
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  supplier: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. `src/renderer/src/mocks/products.ts`

- 8 produtos de exemplo com categorias variadas
- Preços como number, estoques diversos
- IDs com `crypto.randomUUID()`

---

## 3. `src/renderer/src/hooks/useProducts.ts`

- Estado: `products[]`, `filters`, `sort`
- `filtered` via `useMemo` (busca por nome + categoria + estoque baixo + sort)
- CRUD: `addProduct`, `updateProduct`, `deleteProduct`, `getProductById`

---

## 4. `src/renderer/src/pages/products/styles.css`

Header, botão Novo, barra de filtros, tabela (zebra, hover, cursor sort), badge estoque (verde/amarelo/vermelho), modal overlay, form grid 2 colunas, botões.

---

## 5. `src/renderer/src/pages/products/index.tsx`

Página completa em arquivo único.

**Layout:**

```
Produtos                                   [+ Novo Produto]
🔍 Buscar...     [Todas ▼]  [📦 Estoque baixo]
Nome ▲ │ Categoria │ Fornecedor │ Preço Venda │ Estoque
───────┼───────────┼────────────┼─────────────┼────────────
Dados  │           │            │             │ ██ 12
Mostrando X de Y produtos
```

---

## Ordem de Implementação (9 tarefas)

| #   | Tarefa                | Arquivo                     | Entrega                                               |
| --- | --------------------- | --------------------------- | ----------------------------------------------------- |
| 1   | Tipo Product          | `shared/types/product.ts`   | Interface                                             |
| 2   | Dados mockados        | `mocks/products.ts`         | 8 produtos                                            |
| 3   | Hook useProducts      | `hooks/useProducts.ts`      | CRUD + filtro + sort                                  |
| 4   | Estilos CSS           | `pages/products/styles.css` | Todos os estilos                                      |
| 5   | Estrutura base        | `pages/products/index.tsx`  | Header, botão Novo, filtros placeholder, tabela vazia |
| 6   | Tabela + sort + badge | `pages/products/index.tsx`  | Renderizar produtos, sort cíclico, badge colorido     |
| 7   | Filtros funcionais    | `pages/products/index.tsx`  | Busca, select categoria, toggle estoque baixo         |
| 8   | Modal formulário      | `pages/products/index.tsx`  | Overlay + form com validação + salvar (novo/editar)   |
| 9   | Modal exclusão        | `pages/products/index.tsx`  | Confirmação + remover                                 |

---

## Critérios de Verificação

- `npm run dev:renderer` sem erros
- Tabela com 8 produtos
- Sort funcional em colunas clicáveis
- Busca filtra por nome
- Filtro de categoria funciona
- Toggle estoque baixo funciona
- Modal abre para Novo e Editar
- Salvar adiciona/atualiza
- Excluir remove com confirmação
- Preços em R$, datas formato brasileiro

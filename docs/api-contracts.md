# Contratos da API IPC

Este documento define os contratos de comunicação entre o **Renderer (React)** e o **Main Process (Electron)** via IPC. Todos os dados devem seguir exatamente estas estruturas.

> Tipos compartilhados estão em `shared/models/`, `shared/models/dtos/`, `shared/contracts/` e são reexportados por `shared/index.ts`.

---

## Padrão de Resposta

Todas as respostas seguem o mesmo envelope definido em `shared/contracts/ipcContracts.ts`:

**Sucesso:**

```ts
{ success: true, data: payload }
```

**Erro:**

```ts
{ success: false, error: { message: string, code?: string, details?: unknown } }
```

O campo `error` carrega a mensagem da exceção e, quando disponível, metadados adicionais de validação ou domínio.

---

## PRODUCTS

### `products:create`

Cria um novo produto.

**Request:** `ProductInput`

```ts
{
  name: string;           // obrigatório
  description?: string;  // opcional
  price: number;         // >= 0
  cost_price: number;    // >= 0
}
```

**Response (sucesso):**

```ts
{
  success: true;
  data: {
    product: Product; // objeto completo com id, created_at, updated_at e todos os campos
  }
}
```

---

### `products:list`

Lista todos os produtos, ordenados por `id DESC`.

**Request:** sem payload

**Response (sucesso):**

```ts
{
  success: true;
  data: {
    products: Product[];
  };
}
```

---

### `products:update`

Atualiza um produto existente.

**Request:** `ProductInput` + `id`

```ts
{
  id: number;
  name: string;
  description?: string;
  price: number;
  cost_price: number;
}
```

**Response (sucesso):**

```ts
{
  success: true;
  data: {
    updated_at: string; // ISO timestamp do momento da atualização
  }
}
```

---

### `products:delete`

Remove um produto pelo `id`.

**Request:**

```ts
{
  id: number;
}
```

**Response (sucesso):**

```ts
{
  success: true;
  data: null;
}
```

---

## SALES

### `sales:create`

Cria uma nova venda com seus itens. `cost_total` e `gross_profit` são **calculados internamente** — não devem ser enviados no request.

**Request:** `CreateSaleInput`

```ts
{
  date: string; // ISO 8601, ex: "2026-04-30T10:00:00Z"
  total_price: number; // >= 0
  items: Array<{
    product_id: number; // deve existir na tabela products
    quantity: number; // inteiro > 0
    unit_price: number; // >= 0
    unit_cost: number; // >= 0
  }>;
}
```

**Response (sucesso):**

```ts
{
  success: true;
  data: {
    sale: Sale; // inclui id, created_at, updated_at, date, total_price, cost_total, gross_profit
  }
}
```

---

### `sales:list`

Lista todas as vendas, ordenadas por `date DESC, id DESC`.

**Request:** sem payload

**Response (sucesso):**

```ts
{
  success: true;
  data: {
    sales: Sale[];
  };
}
```

Cada item de `Sale`:

```ts
{
  id: number;
  created_at: string;
  updated_at: string;
  date: string;
  total_price: number;
  cost_total: number;
  gross_profit: number;
}
```

---

### `sales:getById`

Busca uma venda com seus itens pelo `id`.

**Request:**

```ts
{
  id: number;
}
```

**Response (sucesso):**

```ts
{
  success: true;
  data: {
    sale: SaleWithItems; // Sale + items[]
  }
}
```

`SaleWithItems`:

```ts
{
  id: number;
  created_at: string;
  updated_at: string;
  date: string;
  total_price: number;
  cost_total: number;
  gross_profit: number;
  items: Array<{
    id: number;
    created_at: string;
    updated_at: string;
    sale_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    unit_cost: number;
  }>;
}
```

---

### `sales:delete`

Remove uma venda e seus itens pelo `id`.

**Request:**

```ts
{
  id: number;
}
```

**Response (sucesso):**

```ts
{
  success: true;
  data: null;
}
```

---

## Regras Gerais

- Todos os handlers são registrados no **Main Process** (`registerProductHandlers`, `registerSaleHandlers`) usando `typedIpcMainHandle`;
- O Renderer **nunca** acessa o banco diretamente;
- Dados são validados no Main Process antes de persistir; os repositories assumem entrada já validada;
- `id` é sempre `number`;
- Datas são strings ISO 8601 (ex.: `"2026-04-30T10:00:00.000Z"`).
- `created_at` e `updated_at` são gerados automaticamente — nunca enviados no request;
- `cost_total` e `gross_profit` são calculados internamente na criação da venda;
- Toda persistência passa por repositories em `backend/repository/`, com acesso ao banco em `backend/infra/database/`;

## Convenções de Canal

- Formato: `entidade:acao` — ex.: `products:create`, `sales:list`;
- Entidades sempre no **plural**;
- Requests e responses devem ser tipados via `shared/` e expostos no renderer via `shared/contracts/ipcApi.ts`;

# 🔗 IPC API Contracts

Este documento define os contratos de comunicação entre o **Renderer (React)** e o **Main Process (Electron)** via IPC. Todos os dados devem seguir exatamente estas estruturas.

## 📦 PRODUCTS

### ➕ products:create

Cria um novo produto.

**request:**

```json
{
  "name": "string",
  "description": "string",
  "price": "number"
}
```

**response:**

```json
{
  "id": "number",
  "created_at": "string",
  "updated_at": "string"
}
```

---

### 📄 products:list

Lista todos os produtos.

**request:**

```json
{}
```

**response:**

```json
{
  "products": [
    {
      "id": "number",
      "created_at": "string",
      "updated_at": "string",
      "name": "string",
      "description": "string",
      "price": "number"
    }
  ]
}
```

---

### 🔍 products:getById

Busca um produto específico.

**request:**

```json
{
  "id": "number"
}
```

**response:**

```json
{
  "product": {
    "id": "number",
    "created_at": "string",
    "updated_at": "string",
    "name": "string",
    "description": "string",
    "price": "number"
  }
}
```

---

### ✏️ products:update

Atualiza um produto existente.

**request:**

```json
{
  "id": "number",
  "name": "string",
  "description": "string",
  "price": "number"
}
```

**response:**

```json
{
  "success": "boolean",
  "updated_at": "string"
}
```

---

### ❌ products:delete

Remove um produto.

**request:**

```json
{
  "id": "number"
}
```

**response:**

```json
{
  "success": "boolean"
}
```

---

## 💰 SALES (RECEITAS)

### ➕ sales:create

Cria uma nova venda.

**request:**

```json
{
  "date": "string",
  "items": [
    {
      "product_id": "number",
      "quantity": "number",
      "unit_price": "number"
    }
  ],
  "total_price": "number"
}
```

**observação:**

* `total_price` pode ser calculado automaticamente ou informado manualmente

**response:**

```json
{
  "id": "number",
  "created_at": "string",
  "updated_at": "string"
}
```

---

### 📄 sales:list

Lista todas as vendas.

**request:**

```json
{}
```

**response:**

```json
{
  "sales": [
    {
      "id": "number",
      "created_at": "string",
      "updated_at": "string",
      "date": "string",
      "total_price": "number"
    }
  ]
}
```

---

### 🔍 sales:getById

Busca uma venda com seus itens.

**request:**

```json
{
  "id": "number"
}
```

**response:**

```json
{
  "sale": {
    "id": "number",
    "created_at": "string",
    "updated_at": "string",
    "date": "string",
    "total_price": "number",
    "items": [
      {
        "id": "number",
        "created_at": "string",
        "updated_at": "string",
        "sale_id": "number",
        "product_id": "number",
        "quantity": "number",
        "unit_price": "number"
      }
    ]
  }
}
```

---

### ❌ sales:delete

Remove uma venda.

**request:**

```json
{
  "id": "number"
}
```

**response:**

```json
{
  "success": "boolean"
}
```

---

## ⚠️ REGRAS GERAIS

* Todos os handlers devem ser implementados no **Main Process**;
* O Renderer nunca acessa banco diretamente;
* Toda persistência deve passar por repositories;
* Dados devem ser validados antes de persistir;
* IDs são sempre numéricos;
* Datas devem ser strings no formato ISO (`2026-04-30T10:00:00Z`);
* Campos `created_at` e `updated_at` são gerados automaticamente pelo sistema;

---

## 🔒 PADRÕES DE RESPOSTA

### Sucesso

```json
{
  "success": true
}
```

### Erro

```json
{
  "error": "mensagem de erro"
}
```

---

## 🧠 Convenções

* Nome dos canais: `entidade:ação`
  Ex: `products:create`, `sales:list`;
* Sempre usar plural para entidades;
* Requests e responses devem ser tipados (shared/types);

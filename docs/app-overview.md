# Visão Geral

## 1. Escopo

Aplicativo desktop local, offline e voltado à gestão de produtos e vendas. Centraliza cadastro, consulta e análise básica do fluxo financeiro em uma única interface.

### 1.1 Premissas

| Requisito             | Detalhe                                           |
| --------------------- | ------------------------------------------------- |
| Funcionamento offline | 100% local, sem internet                          |
| Persistência          | SQLite via Drizzle ORM (`drizzle-orm`)            |
| Segurança             | Renderer sem acesso direto ao banco ou filesystem |

### 1.2. Público-alvo

Pequeno empreendedor, em uso individual, sem autenticação e sem sincronização remota.

### 1.3 Funcionalidades

| Área                  | O que faz                                                          |
| --------------------- | ------------------------------------------------------------------ |
| Dashboard             | Gráficos de produtos e receitas                                    |
| Produtos              | Cadastro, consulta, edição e exclusão de produtos                  |
| Receitas              | Cadastro, consulta e exclusão de vendas                            |
| Importação/Exportação | Importar e exportar dados (backup e restauração) via arquivo local |

## 2. Regras de negócio atuais

1. Produtos
   - Podem existir mesmo que nunca tenham sido vendidos;
   - São exibidos do mais novo para o mais antigo;

2. Vendas
   - Para registrar uma venda é obrigatório incluir pelo menos um item;
   - Uma venda pode reunir vários itens e produtos diferentes;
   - Ao registrar, informe o valor total e a lista de itens; o sistema confere os dados e calcula automaticamente o custo total (soma dos custos dos itens) e o lucro bruto (total - custo total).
   - As vendas são listadas por data (mais recentes primeiro); quando duas vendas têm a mesma data, a ordem segue o registro;
   - Produtos e vendas são excluídos permanentemente (sem lixeira);

## 3. Modelo de dados

### `products`

| Campo         | Tipo     | Descrição                              |
| ------------- | -------- | -------------------------------------- |
| `id`          | `number` | Identificador único                    |
| `created_at`  | `string` | Data de criação em ISO 8601            |
| `updated_at`  | `string` | Data da última atualização em ISO 8601 |
| `name`        | `string` | Nome do produto                        |
| `description` | `string` | Descrição opcional                     |
| `price`       | `number` | Preço de venda                         |
| `cost_price`  | `number` | Custo de aquisição                     |

### `sales`

| Campo          | Tipo     | Descrição                                |
| -------------- | -------- | ---------------------------------------- |
| `id`           | `number` | Identificador único                      |
| `created_at`   | `string` | Data de criação em ISO 8601              |
| `updated_at`   | `string` | Data da última atualização em ISO 8601   |
| `date`         | `string` | Data da venda em ISO 8601                |
| `total_price`  | `number` | Total informado para a venda             |
| `cost_total`   | `number` | Soma de `unit_cost × quantity` dos itens |
| `gross_profit` | `number` | `total_price - cost_total`               |

### `sale_items`

| Campo        | Tipo     | Descrição                              |
| ------------ | -------- | -------------------------------------- |
| `id`         | `number` | Identificador único                    |
| `created_at` | `string` | Data de criação em ISO 8601            |
| `updated_at` | `string` | Data da última atualização em ISO 8601 |
| `sale_id`    | `number` | Referência à venda                     |
| `product_id` | `number` | Referência ao produto                  |
| `quantity`   | `number` | Quantidade vendida                     |
| `unit_price` | `number` | Preço unitário no momento da venda     |
| `unit_cost`  | `number` | Custo unitário no momento da venda     |

## 4. Mapa rápido do código

| Parte                | Arquivo principal                                         |
| -------------------- | --------------------------------------------------------- |
| Entrada do app       | `app/app.ts`                                              |
| Ponte segura IPC     | `app/backend/preload.ts`                                  |
| Handlers IPC         | `app/backend/controllers/`                                |
| Persistência         | `app/backend/repository/` e `app/backend/infra/database/` |
| Tipos compartilhados | `app/shared/`                                             |
| Interface React      | `app/frontend/src/`                                       |

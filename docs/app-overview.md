# Visão Geral

## 1. Objetivo

O aplicativo ajuda um pequeno negócio a controlar produtos e receitas em um ambiente local, simples e offline. A aplicação substitui planilhas e anotações soltas por uma interface única para cadastro, consulta e análise básica do fluxo financeiro.

## 2. Público-alvo

| Perfil | Descrição |
| --- | --- |
| Pequeno empreendedor | Uso individual, sem autenticação e sem sincronização remota |

## 3. Escopo atual

O sistema hoje cobre três áreas visíveis na interface:

| Área | O que faz |
| --- | --- |
| Dashboard | Mostra métricas de faturamento, custo, lucro, ticket médio e gráfico por período |
| Produtos | Lista, cadastra, edita e remove produtos |
| Receitas | Lista, registra, detalha e remove vendas |

As telas ficam dentro de `app/frontend/src/pages/` e são acionadas pela sidebar principal.

## 4. Premissas do projeto

| Requisito | Detalhe |
| --- | --- |
| Funcionamento offline | 100% local, sem dependência de internet |
| Persistência | SQLite via `sql.js` |
| Arquitetura | Main process, preload e renderer separados |
| Segurança | Renderer não acessa banco nem filesystem diretamente |
| Autenticação | Não existe no escopo atual |

## 5. Regras de negócio atuais

- Um produto pode existir sem aparecer em nenhuma venda.
- Uma venda precisa ter pelo menos um item.
- Uma venda pode conter vários itens e vários produtos.
- O renderer envia `total_price` e os itens da venda; o backend valida os dados e calcula `cost_total` e `gross_profit`.
- Produtos e vendas são removidos definitivamente, sem soft delete.
- A listagem de produtos é ordenada por `id DESC`.
- A listagem de vendas é ordenada por `date DESC, id DESC`.

## 6. Modelo de dados

### `products`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `number` | Identificador único |
| `created_at` | `string` | Data de criação em ISO 8601 |
| `updated_at` | `string` | Data da última atualização em ISO 8601 |
| `name` | `string` | Nome do produto |
| `description` | `string` | Descrição opcional |
| `price` | `number` | Preço de venda |
| `cost_price` | `number` | Custo de aquisição |

### `sales`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `number` | Identificador único |
| `created_at` | `string` | Data de criação em ISO 8601 |
| `updated_at` | `string` | Data da última atualização em ISO 8601 |
| `date` | `string` | Data da venda em ISO 8601 |
| `total_price` | `number` | Total informado para a venda |
| `cost_total` | `number` | Soma de `unit_cost × quantity` dos itens |
| `gross_profit` | `number` | `total_price - cost_total` |

### `sale_items`

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `id` | `number` | Identificador único |
| `created_at` | `string` | Data de criação em ISO 8601 |
| `updated_at` | `string` | Data da última atualização em ISO 8601 |
| `sale_id` | `number` | Referência à venda |
| `product_id` | `number` | Referência ao produto |
| `quantity` | `number` | Quantidade vendida |
| `unit_price` | `number` | Preço unitário no momento da venda |
| `unit_cost` | `number` | Custo unitário no momento da venda |

## 7. Mapa rápido do código

| Parte | Arquivo principal |
| --- | --- |
| Entrada do app | `app/app.ts` |
| Ponte segura IPC | `app/backend/preload.ts` |
| Handlers IPC | `app/backend/controllers/` |
| Persistência | `app/backend/repository/` e `app/backend/infra/database/` |
| Tipos compartilhados | `app/shared/` |
| Interface React | `app/frontend/src/` |

## 8. Referências

- [architecture.md](architecture.md) — camadas, estrutura de pastas e fluxo de dados.
- [api-contracts.md](api-contracts.md) — contratos IPC detalhados.
- [decisions.md](decisions.md) — decisões técnicas e justificativas.

# 📘 Visão geral da aplicação

## 1. Objetivo

Este aplicativo desktop tem como objetivo auxiliar no gerenciamento de um pequeno negócio de venda de produtos, permitindo o controle de produtos e receitas de forma simples, local e eficiente.

O foco inicial é substituir controles manuais ou planilhas desorganizadas por um sistema centralizado, confiável e de fácil uso.

---

## 2. Público-alvo

| Perfil               | Descrição                                          |
| -------------------- | -------------------------------------------------- |
| Pequeno empreendedor | Proprietário do negócio, uso individual e autônomo |

---

## 3. Escopo

O sistema opera com as seguintes premissas:

| Requisito             | Detalhe                                          |
| --------------------- | ------------------------------------------------ |
| Funcionamento offline | 100% local, sem dependência de internet ou nuvem |
| Persistência de dados | Banco de dados SQLite armazenado localmente      |
| Interface             | Simples, direta e focada em produtividade        |
| Autenticação          | Não há — uso pessoal e individual                |

> [!NOTE]
> O escopo inicial cobre produtos e vendas. Funcionalidades como clientes, estoque detalhado e relatórios avançados podem ser adicionadas em versões futuras.

---

## 4. Funcionalidades principais

### 📊 Dashboard Financeiro

- Visualizar receitas por semana, mês ou período personalizado;
- Acompanhar faturamento, custo total e lucro bruto;
- Observar a distribuição das receitas em uma visão consolidada;

### 📦 Gestão de Produtos

- Cadastrar novos produtos com nome, descrição, preço de venda e custo;
- Listar todos os produtos cadastrados;
- Editar dados de produtos existentes;
- Remover produtos;

### 💰 Gestão de Receitas (Vendas)

- Registrar vendas realizadas com data e itens;
- Associar uma venda a um ou mais produtos;
- Listar vendas com totais calculados (faturamento, custo e lucro);
- Consultar o detalhe de uma venda com seus itens;

---

## 5. Regras de negócio

- Um produto pode existir sem estar vinculado a nenhuma venda;
- Uma venda deve conter ao menos um item;
- Uma venda pode conter múltiplos produtos;
- O `total_price` da venda pode ser:
  - **Calculado automaticamente** — soma de `unit_price × quantity` de cada item;
  - **Informado manualmente** — valor livre definido pelo usuário;
- `cost_total` e `gross_profit` são calculados automaticamente pelo sistema;
- Produtos e vendas removidos não podem ser recuperados (sem soft delete);

---

## 6. Modelo de dados

### Produto (`products`)

| Campo         | Tipo     | Descrição                             |
| ------------- | -------- | ------------------------------------- |
| `id`          | `number` | Identificador único                   |
| `created_at`  | `string` | Data de criação (ISO 8601)            |
| `updated_at`  | `string` | Data da última atualização (ISO 8601) |
| `name`        | `string` | Nome do produto                       |
| `description` | `string` | Descrição opcional                    |
| `price`       | `number` | Preço de venda                        |
| `cost_price`  | `number` | Custo de aquisição                    |

### Venda (`sales`)

| Campo          | Tipo     | Descrição                                |
| -------------- | -------- | ---------------------------------------- |
| `id`           | `number` | Identificador único                      |
| `created_at`   | `string` | Data de criação (ISO 8601)               |
| `updated_at`   | `string` | Data da última atualização (ISO 8601)    |
| `date`         | `string` | Data em que a venda ocorreu              |
| `total_price`  | `number` | Valor total da venda                     |
| `cost_total`   | `number` | Custo total dos itens vendidos           |
| `gross_profit` | `number` | Lucro bruto (`total_price - cost_total`) |

### Itens da Venda (`sale_items`)

| Campo        | Tipo     | Descrição                             |
| ------------ | -------- | ------------------------------------- |
| `id`         | `number` | Identificador único                   |
| `created_at` | `string` | Data de criação (ISO 8601)            |
| `updated_at` | `string` | Data da última atualização (ISO 8601) |
| `sale_id`    | `number` | Referência à venda                    |
| `product_id` | `number` | Referência ao produto                 |
| `quantity`   | `number` | Quantidade vendida                    |
| `unit_price` | `number` | Preço unitário no momento da venda    |
| `unit_cost`  | `number` | Custo unitário no momento da venda    |

---

## 7. Referências

- [architecture.md](architecture.md) — camadas, estrutura de pastas e fluxo de dados;
- [api-contracts.md](api-contracts.md) — contratos IPC detalhados (request/response);
- [decisions.md](decisions.md) — decisões técnicas e justificativas;

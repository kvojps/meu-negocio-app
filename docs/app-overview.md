# 📘 Visão geral da aplicação

## 1. Objetivo

Este aplicativo desktop tem como objetivo auxiliar no gerenciamento de negócios, permitindo o controle de produtos e receitas de forma simples, local e eficiente.

O foco inicial é substituir controles manuais ou desorganizados por um sistema centralizado.

## 2. Público-Alvo

- Pequeno empreendedor;
- Uso individual;

## 3. Escopo

O sistema inicialmente deve:

- Funcionar 100% offline;
- Armazenar dados localmente (SQLite);
- Ter interface simples e direta;
- Não possuir autenticação;

## 4. Funcionalidades Principais

### 📊 Dashboard Financeiro

- Visualizar receitas por semana, mês ou período personalizado;
- Acompanhar faturamento, custo e lucro bruto;
- Observar a distribuição das receitas em uma visão consolidada;

### 📦 Gestão de Produtos

- Cadastrar novos produtos;
- Listar todos os produtos;
- Editar produtos existentes;
- Remover produtos;

### 💰 Gestão de Receitas (Vendas)

- Cadastrar vendas realizadas;
- Associar venda a um ou mais produtos;
- Listar vendas;

## 5. Regras de Negócio

- Um produto pode existir sem estar vinculado a uma venda;
- Uma venda pode conter múltiplos produtos;
- O valor da venda pode ser:
  - calculado automaticamente (soma dos produtos);
  - ou informado manualmente (flexível);

## 6. Tipos de Dados Principais

### > Produto

- id;
- created_at;
- updated_at;
- name;
- description;
- price;
- cost_price;

### > Venda (Receita)

- id;
- created_at;
- updated_at;
- date;
- total_price;
- cost_total;
- gross_profit;

### > Itens da Venda

- id;
- created_at;
- updated_at;
- sale_id;
- product_id;
- quantity;
- unit_price;
- unit_cost;

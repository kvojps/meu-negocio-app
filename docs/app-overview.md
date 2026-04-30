# 📘 Visão geral da aplicação

## 1. Objetivo

Este aplicativo desktop tem como objetivo auxiliar no gerenciamento de um pequeno negócio de venda de móveis, permitindo o controle de produtos e receitas de forma simples, local e eficiente.

O foco inicial é substituir controles manuais ou desorganizados por um sistema centralizado.

## 2. Público-Alvo

- Pequeno empreendedor (vendedor de móveis);
- Uso individual;

## 3. Funcionalidades Principais

### 📊 Dashboard Financeiro

- Visualizar receitas por semana, mês ou período personalizado;
- Acompanhar faturamento, custo e lucro bruto;
- Observar a distribuição das receitas em uma visão consolidada;

### 📦 Gestão de Produtos

- Cadastrar novos produtos;
- Editar produtos existentes;
- Remover produtos;
- Listar todos os produtos;
- Informações básicas:
  - Nome;
  - Descrição;
  - Preço;
  - Custo;
  - Data de cadastro;

### 💰 Gestão de Receitas (Vendas)

- Registrar vendas realizadas;
- Associar venda a um ou mais produtos;
- Informar valor total;
- Registrar custo histórico dos itens da venda;
- Visualizar lucro bruto por venda;
- Registrar data da venda;
- Listar receitas;
- Visualizar histórico de vendas;

## 4. Regras de Negócio (Inicial)

- Um produto pode existir sem estar vinculado a uma venda;
- Uma venda pode conter múltiplos produtos;
- O valor da venda pode ser:
  - calculado automaticamente (soma dos produtos);
  - ou informado manualmente (flexível);

## 5. Escopo Inicial (MVP)

O sistema inicialmente deve:

- Funcionar 100% offline;
- Armazenar dados localmente (SQLite);
- Ter interface simples e direta;
- Não possuir autenticação;

## 6. Tipos de Dados Principais

### Produto

- id;
- created_at;
- updated_at;
- name;
- description;
- price;
- cost_price;

### Venda (Receita)

- id;
- created_at;
- updated_at;
- date;
- total_price;
- cost_total;
- gross_profit;

### Itens da Venda

- id;
- created_at;
- updated_at;
- sale_id;
- product_id;
- quantity;
- unit_price;
- unit_cost;

## 9. Experiência do Usuário

- Interface simples e intuitiva;
- Fluxo rápido para registrar vendas;
- Poucos cliques para operações comuns;
- Foco em clareza e agilidade;

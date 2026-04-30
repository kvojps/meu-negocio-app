# 🧾 Decisões técnicas

Este documento registra as principais decisões técnicas do projeto, junto com seus motivos. O objetivo é manter consistência ao longo do desenvolvimento e evitar mudanças desnecessárias.

## 1. Plataforma Desktop

**Decisão:** Utilizar Electron para desenvolvimento do aplicativo desktop.

**Motivo:**

* Uso de tecnologias web (JavaScript/TypeScript + React);
* Facilidade de desenvolvimento e manutenção;
* Grande ecossistema e documentação;
* Integração simples com Node.js;

## 2. Arquitetura

**Decisão:** Separação em três camadas:

* Main Process;
* Renderer Process;
* Preload + IPC;

**Motivo:**

* Segurança no acesso ao sistema;
* Organização do código;
* Escalabilidade;
* Alinhamento com boas práticas do Electron;

## 3. Comunicação entre camadas

**Decisão:** Utilizar IPC (Inter-Process Communication).

**Motivo:**

* Comunicação segura entre frontend e backend;
* Controle de acesso a recursos sensíveis;
* Padronização via `api-contracts.md`;

## 4. Banco de Dados

**Decisão:** Utilizar SQLite como banco de dados local;

**Motivo:**

* Não requer servidor;
* Leve e rápido;
* Ideal para aplicações offline;
* Simplicidade de setup e distribuição;

### 4.1. Biblioteca de acesso ao banco

**Decisão:** Utilizar better-sqlite3

**Motivo:**

* API simples e síncrona;
* Boa performance;
* Baixa complexidade comparada a alternativas;
* Adequado para aplicações desktop;

### 4.2. Persistência de Dados

**Decisão:** Centralizar acesso ao banco via camada de repositories

**Motivo:**

* Separação de responsabilidades;
* Facilidade de manutenção;
* Evita duplicação de queries;
* Melhor organização para uso com IA;

### 4.3. Modelagem de Dados

**Decisão:** Utilizar estrutura relacional com três entidades:

* Products;
* Sales;
* Sale Items;

**Motivo:**

* Representação clara do domínio;
* Flexibilidade para evoluções futuras;
* Normalização dos dados;

### 4.4. Custo Histórico e Lucro

**Decisão:** Persistir custo do produto e custo unitário do item da venda, calculando o lucro bruto a partir desses valores.

**Motivo:**

* Preserva o histórico financeiro das vendas;
* Evita distorção do lucro quando o custo do produto muda depois da venda;
* Permite exibir custo total e lucro bruto por venda e no consolidado;

## 5. Controle de Timestamps

**Decisão:** Utilizar campos:

* `created_at`;
* `updated_at`;

**Motivo:**

* Rastreabilidade de dados;
* Facilidade para auditoria futura;
* Consistência entre entidades;

## 6. Estrutura de Projeto

**Decisão:** Separar código em:

* electron/ (main, preload, database);
* renderer/ (React);
* shared/ (tipos e contratos);
* docs/ (documentação);

**Motivo:**

* Organização clara;
* Evita acoplamento;
* Facilita manutenção e escalabilidade;

## 7. Uso de TypeScript

**Decisão:** Utilizar TypeScript em todo o projeto.

**Motivo:**

* Tipagem forte;
* Melhor integração com IA;
* Redução de bugs;
* Melhor legibilidade e manutenção;

## 8. Estratégia de Desenvolvimento

**Decisão:** Desenvolvimento orientado por contratos (api-contracts).

**Motivo:**

* Clareza na comunicação entre camadas;
* Facilita uso de IA;
* Reduz inconsistências;
* Permite desenvolvimento incremental;

## 9. Escopo Inicial

**Decisão:** Aplicação offline e single-user.

**Motivo:**

* Reduz complexidade inicial;
* Entrega mais rápida;
* Foco no problema principal do usuário;

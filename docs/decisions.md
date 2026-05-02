# Decisões Técnicas

Este documento registra as principais decisões técnicas do projeto e seus motivos. O objetivo é manter consistência ao longo do desenvolvimento e evitar mudanças desnecessárias.

---

## 1. Plataforma Desktop

**Decisão:** Utilizar Electron para desenvolvimento do aplicativo desktop.

**Motivo:**

- Permite o uso de tecnologias web já dominadas pela equipe (TypeScript + React);
- Facilidade de desenvolvimento, debugging e manutenção;
- Grande ecossistema e documentação consolidada;

---

## 2. Arquitetura em Camadas

**Decisão:** Separar o sistema em três camadas com responsabilidades distintas: Main Process, Renderer Process e Preload + IPC.

**Motivo:**

- Segurança no acesso ao sistema de arquivos e ao banco de dados;
- Organização e clareza do código;
- Facilita escalabilidade e manutenção;

> Detalhes de cada camada estão em [`architecture.md`](architecture.md).

---

## 3. Comunicação entre Camadas via IPC

**Decisão:** Utilizar IPC (Inter-Process Communication) com canais tipados para toda comunicação entre renderer e main process.

**Motivo:**

- Comunicação segura e controlada entre frontend e backend;
- Controle de acesso a recursos sensíveis do sistema;
- Padronização via contratos documentados em [`api-contracts.md`](api-contracts.md);

---

## 4. Banco de Dados

### 4.1 Motor: SQLite

**Decisão:** Utilizar SQLite como banco de dados local.

**Motivo:**

- Não requer servidor — adequado para operação 100% offline;
- Leve, rápido e com baixo consumo de recursos;
- Simplicidade de setup e distribuição junto ao executável;

---

### 4.2 Biblioteca de Acesso: sql.js

**Decisão:** Utilizar `sql.js` para acessar o banco SQLite.

**Motivo:**

- Compatível com o ambiente Electron sem necessidade de compilação nativa;
- API simples e adequada para aplicações desktop;
- Boa performance para o volume de dados esperado;

---

### 4.3 Camada de Repositories

**Decisão:** Centralizar todo acesso ao banco em repositories (`backend/repository/`).

**Motivo:**

- Separação de responsabilidades — controllers não executam SQL diretamente;
- Facilita manutenção e evita duplicação de queries;
- Ponto único para validações de domínio antes de persistir;

---

## 5. Controle de Timestamps

**Decisão:** Adicionar os campos `created_at` e `updated_at` em todas as entidades persistidas.

**Motivo:**

- Rastreabilidade e consistência entre todas as entidades;
- Facilita auditoria futura sem alteração de esquema;

---

## 6. Estrutura de Pastas

**Decisão:** Organizar o código nas pastas `backend/`, `renderer/`, `shared/` e `docs/`.

**Motivo:**

- Separação clara entre camadas, evitando acoplamento indevido;
- Facilita a localização de código e onboarding de novos desenvolvedores;

> Detalhes da estrutura em [`architecture.md`](architecture.md).

---

## 7. TypeScript em Todo o Projeto

**Decisão:** Utilizar TypeScript em todo o projeto, incluindo main process, renderer e camada compartilhada.

**Motivo:**

- Tipagem forte reduz bugs em tempo de desenvolvimento;
- Contratos IPC tipados via `shared/` eliminam inconsistências entre camadas;
- Melhor legibilidade e manutenção a longo prazo;

---

## 8. Desenvolvimento Orientado por Contratos

**Decisão:** Documentar e seguir contratos IPC explícitos antes de implementar cada funcionalidade.

**Motivo:**

- Clareza na comunicação entre camadas, especialmente com suporte de ferramentas de IA;
- Reduz inconsistências entre o que o renderer envia e o que o main process espera;
- Permite desenvolvimento incremental e paralelo;

---

## 9. Escopo Inicial: Offline e Single-User

**Decisão:** Desenvolver a aplicação como offline-first e single-user, sem autenticação ou sincronização remota.

**Motivo:**

- Reduz complexidade inicial e tempo de entrega;
- Foco no problema principal do usuário (gestão local do negócio);
- Permite evolução futura incremental sem reescritas;

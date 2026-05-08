# Meu Negócio — v0.5.1

Aplicativo desktop Electron + React para gestão local de produtos e receitas. O app opera 100% offline, com persistência em SQLite via `sql.js`, e está organizado em três áreas principais dentro de `app/`: `backend/`, `frontend/` e `shared/`.

## 1. Funcionalidades

- Gerenciamento de produtos;
- Gerenciamento de receitas;
- Dashboard financeira;

## 2. Início rápido

### 2.1 Desenvolvimento

```powershell
npm install
npm run start
```

### 2.2 Instalador

```powershell
npm run dist
```

- O instalador `.exe` é gerado em `release/`;
- O banco local é salvo em `appData/data/app.db` no diretório de dados do usuário do Electron;

> [!IMPORTANT]  
> O Windows pode bloquear a instalação exibindo o erro **“Fornecedor não confiável”**, pois a aplicação ainda não possui um certificado digital válido.
>
> **Como resolver:**  
> Acesse `Segurança do Windows` → `Controle de apps e navegador` → `Controle inteligente de aplicativos` e defina como `Desativado (temporariamente)`.

## 3. Documentação

| Documento                                     | Descrição                                           |
| --------------------------------------------- | --------------------------------------------------- |
| [Visão geral](docs/app-overview.md)           | Objetivo, escopo, funcionalidades e modelo de dados |
| [Arquitetura](docs/architecture.md)           | Organização do projeto e fluxo de dados             |
| [Desenvolvimento](docs/development.md)        | Guia de desenvolvimento                             |
| [Contratos de API IPC](docs/api-contracts.md) | Regras de comunicação entre renderer e main         |
| [Changelog](CHANGELOG.md)                     | Histórico de versões e notas de release             |
| [Guia de Contribuição](CONTRIBUTION.md)       | Como contribuir, regras e boas práticas             |

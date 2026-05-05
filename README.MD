# Meu Negócio — v0.4.21

Aplicativo desktop Electron + React para gestão local de produtos e receitas. O app opera 100% offline, com persistência em SQLite via `sql.js`, e está organizado em três áreas principais dentro de `app/`: `backend/`, `frontend/` e `shared/`.

## O que o app faz hoje

- Cadastro, edição, listagem e exclusão de produtos.
- Registro, listagem, consulta detalhada e exclusão de receitas.
- Dashboard com métricas de faturamento, custo e lucro bruto por período.
- Navegação entre seções por sidebar e modais para edição de dados.

## Início rápido

### Desenvolvimento

```powershell
npm install
npm run start
```

### Gerar instalador

```powershell
npm run dist
```

O instalador `.exe` é gerado em `release/`.

## Estrutura atual

```txt
app/
 app.ts
 backend/
  preload.ts
  controllers/
  infra/
  repository/
 frontend/
  index.html
  vite.config.ts
  src/
 shared/
docs/
```

O banco local é salvo em `appData/data/app.db` no diretório de dados do usuário do Electron.

## Documentação

| Documento                                     | Descrição                                           |
| --------------------------------------------- | --------------------------------------------------- |
| [Visão geral](docs/app-overview.md)           | Objetivo, escopo, funcionalidades e modelo de dados |
| [Arquitetura](docs/architecture.md)           | Camadas, estrutura real do projeto e fluxo de dados |
| [Contratos de API IPC](docs/api-contracts.md) | Contratos de comunicação entre renderer e main      |
| [Decisões técnicas](docs/decisions.md)        | Decisões de design e regras do projeto              |

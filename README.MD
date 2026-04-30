# Bussiness Management — Cadastro de Produtos (MVP)

Instruções para executar localmente (Windows):

1. Instalar dependências:

```powershell
npm install
```

2. Build e iniciar o app:

```powershell
npm run start
```

Arquivos importantes:
- Código TypeScript: `electron/`, `renderer/`, `shared/`
- Banco de dados SQLite: `data/app.db`

Observações:
- A interface é simples: formulário em `renderer/index.html` para criar produtos.
- A API exposta no preload traz `window.api.createProduct` e `window.api.listProducts`.
# Business Management

Aplicação desktop para gerenciamento de um pequeno negócio de venda de móveis, construída com Electron + React e pensada para operar 100% offline com persistência local em SQLite.

O projeto organiza a interface no Renderer, a lógica sensível no Main Process e a comunicação entre as camadas via IPC com contratos bem definidos. A documentação abaixo descreve a visão geral, a arquitetura e as decisões técnicas que orientam a implementação.

## Documentação

- [Visão geral da aplicação](docs/app-overview.md);
- [Arquitetura do sistema](docs/architecture.md);
- [Contratos de API IPC](docs/api-contracts.md);
- [Decisões técnicas](docs/decisions.md);

## Objetivos do projeto

- Centralizar o cadastro de produtos e vendas em uma única aplicação local;
- Manter a interface simples e rápida para uso diário;
- Garantir separação clara entre UI, comunicação e persistência;
- Padronizar os fluxos de dados por meio de contratos compartilhados;

## Estrutura inicial

- docs/: documentação funcional e técnica do projeto;
- shared/: tipos e contratos compartilhados entre as camadas;
- electron/: código do Main Process, preload e acesso ao banco;
- renderer/: interface construída com React;

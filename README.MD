# Meu Negócio — v0.4.21

Aplicativo desktop Windows para auxiliar pequenos empreendedores no gerenciamento de produtos e vendas. Permite cadastrar produtos, registrar vendas e acompanhar o histórico de receitas de forma simples e organizada. Opera 100% offline, sem dependência de internet ou servidores externos.

---

## Início Rápido

### Execução em modo desenvolvimento

```powershell
npm install
npm run start
```

### Gerar instalador

```powershell
npm run dist
```

O instalador `.exe` será gerado na pasta `release/`. Execute-o para instalar o aplicativo.

---

## Documentação

| Documento                                     | Descrição                                           |
| --------------------------------------------- | --------------------------------------------------- |
| [Visão geral](docs/app-overview.md)           | Objetivo, escopo, funcionalidades e modelo de dados |
| [Arquitetura](docs/architecture.md)           | Camadas, estrutura de pastas e fluxo de dados       |
| [Contratos de API IPC](docs/api-contracts.md) | Contratos de comunicação IPC (request/response)     |
| [Decisões técnicas](docs/decisions.md)        | Decisões de design e suas justificativas            |

# Meu Negócio v.0.4.0

Este é um aplicativo desktop Windows desenvolvido para auxiliar pequenos empreendedores no gerenciamento de produtos e vendas. A aplicação permite cadastrar produtos, registrar vendas e acompanhar o histórico de receitas de forma simples e organizada.
O sistema funciona totalmente offline e utiliza armazenamento local, sendo ideal para uso individual sem dependência de internet.

## Guia de início rápido

### > Execução local

- Instalar dependências:

```powershell
npm install
```

- Build e iniciar o app:

```powershell
npm run start
```

### > Instalar aplicativo

- Gerar instalador:

```powershell
npm run dist
```

- Executar arquivo .exe gerado na pasta release (Instalador);

- Após instalação, executar aplicativo;

## Documentação

- [Visão geral da aplicação](docs/app-overview.md);
- [Arquitetura do sistema](docs/architecture.md);
- [Contratos de API IPC](docs/api-contracts.md);
- [Decisões técnicas](docs/decisions.md);

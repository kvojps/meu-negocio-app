# Changelog

Todas as mudanças notáveis deste repositório, extraídas das releases do GitHub.

> Fonte: <https://github.com/kvojps/meu-negocio-app/releases>

## [v0.4.24](https://github.com/kvojps/meu-negocio-app/releases/tag/v0.4.24) — 5 de maio de 2026

- Organizar módulos front e back do APP;
- Não excluir dados ao desinstalar;
- Funcionalidade de importação e exportação de dados;

## [v0.4.21](https://github.com/kvojps/meu-negocio-app/releases/tag/v0.4.21) — 5 de maio de 2026

- Melhoria da UI do app;

## [v0.4.20](https://github.com/kvojps/meu-negocio-app/releases/tag/v0.4.20) — 5 de maio de 2026

- Segregar `styles.css`, já que mistura tokens globais, reset, layout e componentes em um único arquivo (733 linhas);
- Utilizar DTO de produtos e vendas compartilhados entre backend e frontend;
- Corrigir `button:disabled` para usar `not-allowed` em vez de `cursor:progress`;

## [v0.4.17](https://github.com/kvojps/meu-negocio-app/releases/tag/v0.4.17) — 4 de maio de 2026

- Segregação de responsabilidades da camada Frontend;
- Número mágico `8` duplicado sem constante compartilhada;
- Lógica de paginação duplicada entre `App` e as páginas;
- `formatDashboardDateLabel` e `formatDashboardAxisLabel` são idênticas;
- `DashboardPage` recalcula métricas derivadas que poderiam vir de `App` ou de um hook;
- `App.tsx` acumula estado e handlers de dois domínios distintos;

## [v0.4.11](https://github.com/kvojps/meu-negocio-app/releases/tag/v0.4.11) — 4 de maio de 2026

- Resolver SQL Injection em `saleRepository.ts` (queries interpolam variáveis em vez de usar prepared statements);
- Padronizar tipagem de row nos mappers;
- Extrair mappers de repositório para tabelas;
- Mover pasta "database" para "infra";
- Extrair validações do repositório e mover para o controller com ZOD;
- Padronizar entradas e saídas da API IPC;
- Organização da camada `shared`;

## [v0.4.4](https://github.com/kvojps/meu-negocio-app/releases/tag/v0.4.4) — 2 de maio de 2026

- Extração e padronização de controllers de produtos e receitas;
- Refatoração da lógica de configuração do banco de dados;
- Refatoração da lógica de persistência do banco de dados;
- Renomeação da camada eletron para backend e extração da lógica de configuração do APP para raíz;

## [v0.4.0](https://github.com/kvojps/meu-negocio-app/releases/tag/v0.4.0) — 30 de abril de 2026

- Gerenciamento de produtos;
- Gerenciamento de receitas;
- Inclusão do cálculo de lucros ao gerenciamento de receitas;
- Dashboard;

---

Arquivo gerado automaticamente a partir das releases públicas em GitHub.

# Instrucoes para agentes

Use este arquivo como guia rapido antes de alterar o projeto.

## Fonte de verdade

- Leia primeiro [README.MD](README.MD) e a documentacao em [docs/app-overview.md](docs/app-overview.md), [docs/architecture.md](docs/architecture.md), [docs/api-contracts.md](docs/api-contracts.md) e [docs/decisions.md](docs/decisions.md).
- Nao replique aqui o conteudo completo desses documentos; quando a regra ja existir la, apenas referencie a documentacao.

## Contexto do projeto

- Aplicacao desktop Electron + React para gestao de um pequeno negocio de venda de moveis.
- O projeto deve operar 100% offline com persistencia local em SQLite.
- O codigo segue separacao clara entre renderer, preload e main process.

## Regras que os agentes devem respeitar

- Mantenha a interface no renderer, a ponte segura no preload e a logica sensivel no main process.
- Nao acesse Node.js, arquivos ou banco diretamente a partir do renderer.
- Toda operacao de banco e toda query SQL devem ficar no main process, idealmente em repositories.
- Qualquer comunicacao entre renderer e main deve seguir os contratos tipados de [docs/api-contracts.md](docs/api-contracts.md).
- Use TypeScript em todo o projeto e compartilhe tipos e contratos em `shared/`.
- Preserve os padroes de nomenclatura: canais IPC no formato `entidade:acao`, entidades no plural e timestamps `created_at` e `updated_at`.

## Como trabalhar

- Antes de mudar comportamento de dominio, confira as decisoes registradas em [docs/decisions.md](docs/decisions.md).
- Ao criar novas areas do projeto, mantenha o codigo organizado nas pastas previstas no README: `electron/`, `renderer/` e `shared/`.
- Se precisar de orientacoes mais especificas para uma area, crie um arquivo de instrucoes separado em vez de inflar este arquivo.

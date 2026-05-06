# Guia de contribuição

Este projeto segue uma arquitetura Electron + React com separação clara entre `main`, `preload`, `renderer` e `shared`. Antes de contribuir, leia a documentação em `README.MD` e em `docs/` para entender as regras de domínio e os contratos IPC.

## 1. Regras de contribuição

- Mantenha a interface no `renderer`;
- Mantenha a ponte segura no `preload`;
- Mantenha acesso a banco, filesystem e lógica sensível no `main`;
- Não acesse Node.js, arquivos ou banco diretamente a partir do `renderer`;
- Toda comunicação entre camadas deve seguir os contratos tipados em `app/shared/` e `docs/api-contracts.md`;
- Preserve os padrões de nomenclatura do projeto;

## 2. Estrutura esperada

- `app/app.ts`: bootstrap do Electron;
- `app/backend/`: preload, controllers, infra e repositories;
- `app/frontend/`: interface React;
- `app/shared/`: modelos, contratos e tipos compartilhados;

## 3. Boas práticas para mudanças

- Faça mudanças pequenas e focadas;
- Adicione ou atualize tipos compartilhados quando um contrato mudar;
- Valide as alterações com `npm run build` antes de abrir um PR;
- Se a mudança afetar persistência ou IPC, revise também os documentos em `docs/`;

### 3.1 Antes de enviar

- Confirme que o projeto compila;
- Verifique que a alteração não quebra as diretrizes do projeto;
- Descreva claramente o que mudou e por quê no PR;

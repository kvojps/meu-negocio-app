# Contratos da API IPC

Este documento define os contratos de comunicação entre o **Renderer (React)** e o **Main Process (Electron)** via IPC. Todos os dados devem seguir exatamente estas estruturas.

> Tipos compartilhados estão em `shared/models/`, `shared/models/dtos/`, `shared/contracts/` e são reexportados por `shared/index.ts`.

---

## 1. Padrão de Resposta

Todas as respostas seguem o mesmo envelope definido em `shared/contracts/ipcContracts.ts`:

**Sucesso:**

```ts
{ success: true, data: payload }
```

**Erro:**

```ts
{ success: false, error: { message: string, code?: string, details?: unknown } }
```

O campo `error` carrega a mensagem da exceção e, quando disponível, metadados adicionais de validação ou domínio.

## 2. Regras Gerais

1. Chamadas e registro
   - O Renderer envia chamadas via IPC; os handlers que respondem a essas chamadas são registrados no **Main Process** (por exemplo `registerProductHandlers`, `registerSaleHandlers`) usando `typedIpcMainHandle`.
2. Validação
   - Os dados recebidos pelo Main Process são validados antes de qualquer gravação; os repositories assumem que a entrada já está validada.
3. Acesso a dados
   - O Renderer **nunca** acessa o banco diretamente.
   - Toda persistência é feita por repositories em `backend/repository/`, que por sua vez acessam o banco em `backend/infra/database/`.

4. Tipos e formatos (entrada/saída)
   - `id` é sempre `number`.
   - Datas são strings ISO 8601 (ex.: `"2026-04-30T10:00:00.000Z"`).
   - `created_at` e `updated_at` são gerados automaticamente pelo backend e não devem ser enviados no request.

## 3. Convenções de Canal

- Formato: `entidade:acao` — ex.: `products:create`, `sales:list`;
- Entidades sempre no **plural**;
- Requests e responses devem ser tipados via `shared/` e expostos no renderer via `shared/contracts/ipcApi.ts`;

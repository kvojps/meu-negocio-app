# 🏗️ Arquitetura do sistema

## 1. Visão geral

Este projeto é um aplicativo desktop construído com **Electron + React + TypeScript**, organizado em três camadas com responsabilidades bem delimitadas:

| Camada           | Tecnologia             | Responsabilidade principal                    |
| ---------------- | ---------------------- | --------------------------------------------- |
| **Main Process** | Electron / Node.js     | Lógica de negócio, persistência, acesso ao SO |
| **Preload**      | Electron contextBridge | Ponte segura entre renderer e main            |
| **Renderer**     | React + TypeScript     | Interface do usuário e estado de UI           |

A persistência é feita exclusivamente com **SQLite** via **SqlJs**, operando 100% offline.

> [!IMPORTANT]
> O renderer **nunca** acessa Node.js, o sistema de arquivos ou o banco de dados diretamente. Toda comunicação deve passar pelo canal IPC definido em [`api-contracts.md`](api-contracts.md).

---

## 2. Diagrama de camadas

```mermaid
graph TD
    A["Renderer Process<br/>(React UI)"]
    B["Preload Script<br/>(contextBridge)"]
    C["Main Process<br/>(Electron / Node.js)"]
    D["Repositories<br/>(productRepository, saleRepository)"]
    E["SQLite<br/>(better-sqlite3)"]

    A -- "window.api.*" --> B
    B -- "ipcRenderer.invoke" --> C
    C -- "ipcMain.handle" --> D
    D --> E
```

---

## 3. Estrutura de pastas

```txt
bussiness_management/
├── electronApp.ts            # Ponto de entrada do Electron (main process)
├── backend/
│   ├── controllers/          # Handlers IPC — registram ipcMain.handle
│   ├── database/
│   │   ├── sqlite.ts         # Configuração e conexão com o banco
│   │   ├── schema.ts         # Criação de tabelas (DDL)
│   │   ├── helpers.ts        # Utilitários de banco (timestamps, etc.)
│   │   └── paths.ts          # Resolução de caminho do arquivo .db
│   ├── repository/
│   │   ├── productRepository.ts
│   │   └── saleRepository.ts
│   └── preload.ts            # Ponte contextBridge
├── renderer/                 # Aplicação React (UI)
├── shared/
│   ├── types/                # Tipos TypeScript compartilhados
│   ├── product.ts            # Contrato de produto
│   └── sale.ts               # Contrato de venda
└── docs/                     # Documentação do projeto
```

---

## 4. Responsabilidades por camada

### 4.1 Main Process (`electronApp.ts` + `backend/controllers/`)

**Responsável por:**

- Criar e gerenciar a janela do Electron;
- Gerenciar o ciclo de vida da aplicação e do banco;
- Registrar handlers `ipcMain.handle` para cada canal;
- Orquestrar chamadas aos repositories;

**Regras:**

- Nunca expor APIs internas diretamente ao renderer;
- Toda operação sensível (banco, SO, arquivos) deve ocorrer aqui;
- Handlers devem delegar persistência aos repositories, nunca executar SQL diretamente;

---

### 4.2 Camada de persistência (`backend/database/` + `backend/repository/`)

O banco é acessado exclusivamente pelo Main Process através da seguinte organização:

```txt
backend/database/
  ├── sqlite.ts     → abre/fecha conexão, exporta instância db
  ├── schema.ts     → executa CREATE TABLE (rodado na inicialização)
  ├── helpers.ts    → funções auxiliares (ex: gerar timestamps)
  └── paths.ts      → resolve o caminho do arquivo .db em dev e produção

backend/repository/
  ├── productRepository.ts   → CRUD de produtos
  └── saleRepository.ts      → CRUD de vendas e itens de venda
```

**Regras:**

- Todo SQL deve estar centralizado nos repositories;
- `created_at` e `updated_at` são gerenciados automaticamente pelos helpers;
- Nunca acessar `db` diretamente fora dos repositories;

---

### 4.3 Preload Script (`backend/preload.ts`)

**Responsável por:**

- Expor uma API controlada ao renderer via `contextBridge.exposeInMainWorld`;
- Encaminhar chamadas usando `ipcRenderer.invoke(canal, payload)`;

**Regras:**

- Usar `contextIsolation: true` e `nodeIntegration: false` sempre;
- Expor **apenas** as funções listadas nos contratos de [`api-contracts.md`](api-contracts.md);
- Nunca expor referências diretas a módulos Node.js ou ao banco;

Exemplo de estrutura exposta:

```typescript
// backend/preload.ts
contextBridge.exposeInMainWorld("api", {
  products: {
    create: (data) => ipcRenderer.invoke("products:create", data),
    list: () => ipcRenderer.invoke("products:list"),
    // ...
  },
  sales: {
    /* ... */
  },
});
```

---

### 4.4 Renderer Process (`renderer/`)

**Responsável por:**

- Renderizar a interface (React);
- Gerenciar estado de UI;
- Chamar `window.api.*` para qualquer operação de dados;

**Regras:**

- Não importar nem usar APIs de Node.js, `fs`, `path`, ou `better-sqlite3`;
- Não acessar banco ou sistema de arquivos de forma direta;
- Lógica de negócio e validações de domínio devem estar no Main Process;

---

### 4.5 Camada compartilhada (`shared/`)

Contém tipos e contratos TypeScript usados por **ambas** as camadas:

| Arquivo             | Conteúdo                                                    |
| ------------------- | ----------------------------------------------------------- |
| `shared/types/`     | Interfaces e tipos base (ex: `Product`, `Sale`, `SaleItem`) |
| `shared/product.ts` | Contrato tipado de produto para IPC                         |
| `shared/sale.ts`    | Contrato tipado de venda e itens para IPC                   |

**Objetivo:** eliminar duplicação e garantir consistência de tipos entre renderer e main.

---

## 5. Fluxo de dados (ponta a ponta)

```mermaid
sequenceDiagram
    participant UI as Renderer (React)
    participant Pre as Preload
    participant Main as Main Process
    participant Repo as Repository
    participant DB as SQLite

    UI->>Pre: window.api.products.create(data)
    Pre->>Main: ipcRenderer.invoke("products:create", data)
    Main->>Repo: productRepository.create(data)
    Repo->>DB: INSERT (prepared statement)
    DB-->>Repo: { id, created_at, updated_at }
    Repo-->>Main: resultado
    Main-->>Pre: resposta IPC
    Pre-->>UI: Promise resolvida
    UI->>UI: atualiza estado React
```

---

## 6. Segurança

| Medida                   | Detalhe                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `contextIsolation: true` | Renderer isolado do contexto Node.js                       |
| `nodeIntegration: false` | Renderer não tem acesso a APIs Node                        |
| `contextBridge`          | Único ponto de exposição controlada ao renderer            |
| Validação de dados       | Dados recebidos via IPC são validados antes de persistir   |
| SQL isolado              | Banco acessível somente pelos repositories no Main Process |

---

## 7. Convenções do projeto

- **Canais IPC:** formato `entidade:acao` (ex: `products:create`, `sales:list`);
- **Entidades:** sempre no plural nos canais e nos repositórios;
- **Timestamps:** `created_at` e `updated_at` em todas as entidades, formato ISO 8601;
- **Tipagem:** todos os payloads IPC tipados via `shared/`;
- **SQL:** sempre via prepared statements, centralizado nos repositories;
- **Async:** operações externas usam `async/await`; better-sqlite3 é síncrono por design;

---

## 8. Referências

- [app-overview.md](app-overview.md) — objetivo, escopo e funcionalidades;
- [api-contracts.md](api-contracts.md) — contratos IPC detalhados (request/response);
- [decisions.md](decisions.md) — decisões técnicas e justificativas;

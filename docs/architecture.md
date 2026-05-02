# 🏗️ Documentação da arquitetura

## 1. Visão Geral

Este projeto é um aplicativo desktop construído com **Electron + React**, dividido em três camadas principais:

- **Backend (Electron / Node.js)** → Camada lógica/persistência;
- **Renderer Process (React)** → Interface do usuário;
- **Preload + IPC** → Comunicação segura entre Frontend e Backend;

O sistema utiliza **SQLite** como banco de dados local para persistência.

### 1.1. Estrutura de Alto Nível

```id="arch1"
[ Renderer (React UI) ]
            ↓ IPC
[ Preload (Bridge segura) ]
            ↓ IPC
[ Backend (Node/Electron) ]
            ↓
[ SQLite Database (local) ]
            ↓
[ Sistema Operacional ]
```

## 2. Responsabilidades por Camada

### 2.1 Backend

**> Responsável por**:

- Registrar handlers de IPC;
- Executar lógica de negócio;
- Gerenciar configuração e conexão com SQLite;
- Executar queries e regras de persistência;
- Acessar sistema de arquivos;

**> Regras:**

- Toda operação sensível deve acontecer aqui;
- Toda persistência deve passar por esta camada;
- Não expor APIs diretamente ao renderer;
- Utilizar repositories para acesso ao banco;

### 2.2 Renderer Process

**> Responsável por:**

- Interações do usuário;
- Interface do usuário (UI);
- Gerenciamento de estado (React);

**> Regras:**

- Toda comunicação com o sistema deve ocorrer via IPC;
- Não acessar diretamente APIs do Node.js ou banco de dados;
- Manter lógica de UI separada da lógica de negócio;

### 2.3 Preload Script

**> Responsável por:**

- Servir como camada de segurança entre renderer e backend;
- Expor uma API controlada ao renderer;

**> Regras:**

- Usar `contextBridge`;
- Expor apenas funções necessárias;
- Nunca expor acesso direto ao banco ou módulos do Node;

### 2.4. Comunicação (IPC)

A comunicação entre renderer e main ocorre via IPC:

- `ipcRenderer` → envia mensagens;
- `ipcMain` → escuta e responde;

### 2.5 Fluxo padrão

1. Renderer dispara ação;
2. Preload encaminha chamada;
3. Backend executa lógica;
4. Backend acessa SQLite se necessário;
5. Retorna resposta ao renderer;

### 2.6. Camada de Persistência (SQLite)

O sistema utiliza **SQLite** como banco de dados local, executado exclusivamente no **Backend**.

**2.6.1 Organização:**

```id="arch2"
electron/main/database/
  ├── db.ts
  ├── migrations.ts
  └── repositories/
```

**2.6.2 Componentes:**

- **sqlite.ts** → lógica de configuração e conexão com banco;
- **repositories/** → encapsula queries SQL;

**2.6.3 Regras:**

- Não acessar banco via IPC diretamente;
- Nunca executar SQL fora de repositories;
- Toda query deve estar centralizada;
- Utilizar prepared statements sempre que possível;

**2.6.4 Repositories:**

Repositories são responsáveis por:

- Encapsular queries SQL;
- Isolar lógica de persistência;
- Facilitar manutenção e testes;

Exemplo de responsabilidades:

- Criar registros;
- Buscar dados;
- Atualizar informações;
- Remover dados;

### 2.7 Camada compartilhada

A pasta `shared/` contém:

- Tipos TypeScript;
- Interfaces de dados;
- Contratos de comunicação (IPC);

**Objetivo**:

- Evitar duplicação;
- Garantir consistência entre camadas;

## 3. Segurança

Medidas adotadas:

- `contextIsolation: true`;
- `nodeIntegration: false`;
- Comunicação apenas via preload;
- Validação de dados recebidos via IPC;
- Banco acessível somente pelo backend;

## 4. Convenções do Projeto

- Separação clara entre UI, lógica e persistência;
- IPC sempre tipado;
- Nomeação padronizada de canais IPC;
- Funções assíncronas para operações externas (quando necessário);
- Queries centralizadas em repositories;

## 5. Fluxo de Dados

```id="arch3"
UI (React)
  → chama API (preload)
    → envia IPC
      → handler (main)
        → repository
          → SQLite
        ← resultado
      ← resposta IPC
  ← UI atualiza estado
```

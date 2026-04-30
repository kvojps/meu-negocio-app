# 🏗️ Documentação da arquitetura

## 1. Visão Geral

Este projeto é um aplicativo desktop construído com **Electron + React**, dividido em três camadas principais:

* **Main Process (Electron / Node.js)** → controle do sistema e lógica de backend local;
* **Renderer Process (React)** → interface do usuário;
* **Preload + IPC** → comunicação segura entre frontend e backend;

O sistema utiliza **SQLite** como banco de dados local para persistência.

### 1.1. Objetivos da arquitetura

* Separação clara de responsabilidades;
* Segurança no acesso a recursos do sistema;
* Persistência local eficiente;
* Facilidade de manutenção e escalabilidade;
* Compatibilidade com ferramentas de IA durante o desenvolvimento;

### 1.2. Estrutura de Alto Nível

```id="arch1"
[ Renderer (React UI) ]
            ↓ IPC
[ Preload (Bridge segura) ]
            ↓ IPC
[ Main Process (Node/Electron) ]
            ↓
[ SQLite Database (local) ]
            ↓
[ Sistema Operacional ]
```

## 2. Responsabilidades por Camada

### 2.1 Main Process

**Responsável por**:

* Criar e gerenciar janelas;
* Acessar sistema de arquivos;
* Gerenciar conexão com SQLite;
* Executar queries e regras de persistência;
* Registrar handlers de IPC;
* Executar lógica de negócio;

**Regras:**

* Toda operação sensível deve acontecer aqui;
* Toda persistência deve passar por esta camada;
* Não expor APIs diretamente ao renderer;
* Utilizar repositories para acesso ao banco;

### 2.2 Renderer Process

**Responsável por:**

* Interface do usuário (UI);
* Gerenciamento de estado (React);
* Interações do usuário;

**Regras:**

* Não acessar diretamente APIs do Node.js ou banco de dados;
* Toda comunicação com o sistema deve ocorrer via IPC;
* Manter lógica de UI separada da lógica de negócio;

### 2.3 Preload Script

**Responsável por:**

* Expor uma API controlada ao renderer
* Servir como camada de segurança entre renderer e main

**Regras:**

* Usar `contextBridge`
* Expor apenas funções necessárias
* Nunca expor acesso direto ao banco ou módulos do Node

### 2.4. Comunicação (IPC)

A comunicação entre renderer e main ocorre via IPC:

* `ipcRenderer` → envia mensagens;
* `ipcMain` → escuta e responde;

### 2.5 Fluxo padrão

1. Renderer dispara ação;
2. Preload encaminha chamada;
3. Main process executa lógica;
4. Main acessa SQLite se necessário;
5. Retorna resposta ao renderer;

### 2.6. Camada de Persistência (SQLite)

O sistema utiliza **SQLite** como banco de dados local, executado exclusivamente no **Main Process**.

**2.6.1 Organização:**

```id="arch2"
electron/main/database/
  ├── db.ts
  ├── migrations.ts
  └── repositories/
```

**2.6.2 Componentes:**

* **db.ts** → inicializa conexão com banco;
* **migrations.ts** → cria/atualiza estrutura do banco;
* **repositories/** → encapsula queries SQL;

**2.6.3 Regras:**

* Nunca executar SQL fora de repositories;
* Não acessar banco via IPC diretamente;
* Toda query deve estar centralizada;
* Utilizar prepared statements sempre que possível;

**2.6.4 Repositories:**

Repositories são responsáveis por:

* Encapsular queries SQL;
* Isolar lógica de persistência;
* Facilitar manutenção e testes;

Exemplo de responsabilidades:

* Criar registros;
* Buscar dados;
* Atualizar informações;
* Remover dados;

### 2.7 Camada compartilhada

A pasta `shared/` contém:

* Tipos TypeScript
* Interfaces de dados
* Contratos de comunicação (IPC)

Objetivo:

* Evitar duplicação
* Garantir consistência entre camadas
* Melhorar integração com IA

## 3. Segurança

Medidas adotadas:

* `contextIsolation: true`;
* `nodeIntegration: false`;
* Comunicação apenas via preload;
* Banco acessível somente pelo main process;
* Validação de dados recebidos via IPC;

## 4. Convenções do Projeto

* IPC sempre tipado;
* Queries centralizadas em repositories;
* Funções assíncronas para operações externas (quando necessário);
* Separação clara entre UI, lógica e persistência;
* Nomeação padronizada de canais IPC;

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

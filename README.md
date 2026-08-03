# Finance Track API
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge) ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

Backend da aplicação **Finance Track**, responsável pelo gerenciamento de usuários, autenticação e operações financeiras através de uma API REST desenvolvida com **Node.js**, **Express**, **TypeScript** e **PostgreSQL**.

> Este projeto foi desenvolvido com foco em boas práticas de engenharia de software, arquitetura em camadas, baixo acoplamento e escalabilidade.

---
## Repositórios do Projeto

| Projeto | Descrição |
|---------|-----------|
| 🖥️ **Frontend** | https://github.com/Diasszx/finance-track-web |
| ⚙️ **Backend** | https://github.com/Diasszx/finance-track-api |

---

# Arquitetura

A API foi organizada seguindo uma arquitetura em camadas para separar responsabilidades e facilitar manutenção, testes e evolução do sistema.

```text
Client
    │
    ▼
Express Router
    │
    ▼
Controller
    │
    ▼
Repository
    │
    ▼
PostgreSQL
```

Cada camada possui uma responsabilidade específica.

| Camada | Responsabilidade |
|---------|-----------------|
| Controller | Recebe requisições HTTP, valida entradas e retorna respostas. |
| Repository | Comunicação com o banco de dados. |
| Database | Persistência dos dados utilizando PostgreSQL. |

A arquitetura foi construída para permitir evolução futura com a introdução de uma camada de **Services**, reduzindo ainda mais o acoplamento.

---

# Tecnologias

## Backend

- Node.js
- Express 5
- TypeScript

## Banco de Dados

- PostgreSQL

## Validação

- Zod

## Segurança

- bcrypt

## Identificadores

- UUID

## Ferramentas

- Git
- Docker
- Husky
- Commitlint
- ESLint
- Prettier

---

# Funcionalidades

## Usuários

- Criar usuário
- Buscar usuário por ID
- Atualizar usuário
- Remover usuário

---

# Estrutura do Projeto

```text
src
│
├── controllers
│
├── db
│   └── postgres
│
├── entities
│
├── errors
│
├── repositories
│   ├── interfaces
│   └── postgres
│
├── routes
│
├── types
│
├── utils
│
├── app.ts
└── server.ts
```

---

# Padrões utilizados

Este projeto utiliza alguns padrões bastante utilizados em aplicações Node.js.

## Repository Pattern

Toda comunicação com o banco de dados acontece através dos repositórios.

Isso permite:

- reduzir acoplamento;
- facilitar manutenção;
- permitir troca de banco futuramente.

---

## Dependency Injection

Os controllers recebem suas dependências através do construtor.

Isso evita instanciar classes diretamente e facilita testes e reutilização.

---

## DTO

Os dados recebidos da requisição são representados por DTOs para evitar que informações inválidas sejam propagadas pela aplicação.

---

## Validação com Zod

Todas as entradas são validadas utilizando Zod.

Exemplo:

- e-mail válido
- senha mínima
- UUID válido
- campos obrigatórios

---

# Banco de Dados

O projeto utiliza PostgreSQL.

Modelo simplificado:

```text
Users
│
├── id
├── first_name
├── last_name
├── email
└── password
```

Novas entidades serão adicionadas nas próximas versões para gerenciamento financeiro.

---

# Fluxo de uma requisição

```text
Cliente

↓

Express

↓

Controller

↓

Validação (Zod)

↓

Repository

↓

PostgreSQL

↓

Resposta HTTP
```

---

# Scripts

Instalar dependências

```bash
npm install
```

Modo desenvolvimento

```bash
npm run dev
```

Build

```bash
npm run build
```

Executar versão compilada

```bash
npm run start
```

Lint

```bash
npm run lint
```

Corrigir lint

```bash
npm run lint:fix
```

Formatar código

```bash
npm run format
```

Verificar formatação

```bash
npm run format:check
```

Type Checking

```bash
npm run typecheck
```

---

# Variáveis de Ambiente

Crie um arquivo:

```
.env
```

Exemplo:

```env
PORT=3000

DATABASE_HOST=

DATABASE_PORT=

DATABASE_USER=

DATABASE_PASSWORD=

DATABASE_NAME=
```

---

# Padrão de Código

O projeto utiliza:

- ESLint
- Prettier
- Husky
- Commitlint

Garantindo padronização antes de cada commit.

---

# API REST

Atualmente a API possui endpoints para gerenciamento de usuários.

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| POST | /users | Criar usuário |
| GET | /users/:id | Buscar usuário |
| PATCH | /users/:id | Atualizar usuário |
| DELETE | /users/:id | Remover usuário |

---

# Roadmap

## Em desenvolvimento

- Autenticação JWT
- Login
- Refresh Token

## Próximas funcionalidades

- CRUD de transações
- Receitas
- Despesas
- Investimentos
- Dashboard
- Categorias
- Upload de arquivos
- Testes automatizados
- Swagger/OpenAPI

---

# Qualidade de Código

Este projeto busca seguir princípios de desenvolvimento como:

- Clean Code
- SOLID
- Baixo acoplamento
- Alta coesão
- Arquitetura em camadas
- Repository Pattern
- Dependency Injection
- Tipagem forte com TypeScript

---

# Futuras Melhorias

- Services Layer
- Testes unitários
- Testes de integração
- Docker Compose
- Cache
- CI/CD
- Deploy na AWS

---

# Autor

Adam Dias

LinkedIn

GitHub

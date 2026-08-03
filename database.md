# Banco de Dados

## Modelo Entidade-Relacionamento

```mermaid
erDiagram

USERS {
    UUID id PK
    VARCHAR first_name
    VARCHAR last_name
    VARCHAR email UK
    VARCHAR password
}

TRANSACTIONS {
    UUID id PK
    UUID user_id FK
    VARCHAR title
    DECIMAL amount
    ENUM type
    DATE date
}

USERS ||--o{ TRANSACTIONS : owns
```

---

## Relacionamentos

Um usuário pode possuir diversas transações.

Cada transação pertence a apenas um usuário.

---

## Índices

- PK(id)
- UNIQUE(email)
- INDEX(user_id)

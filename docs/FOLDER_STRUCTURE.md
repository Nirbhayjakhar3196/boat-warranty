# Folder Structure

Version: 1.0

---

# Overview

The project follows a scalable layered architecture where each folder has a single responsibility.

```
boat-warranty-hub/
│
├── docs/
├── prisma/
├── public/
├── src/
├── .github/
├── docker/
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

# Root Directory

## docs/

Contains all project documentation.

Examples

- PRD
- API Docs
- Database Design
- Deployment Guide

---

## prisma/

Contains Prisma schema and migrations.

```
prisma/
│
├── schema.prisma
├── migrations/
└── seed.js
```

Responsibilities

- Database Models
- Migrations
- Seed Data

---

## public/

Stores static assets.

Examples

- Images
- Icons
- Logos

---

# src/

Contains the application source code.

```
src/
│
├── app/
├── config/
├── constants/
├── generated/
├── lib/
├── middleware/
├── repositories/
├── services/
├── utils/
└── validations/
```

---

# app/

Contains Next.js App Router.

```
app/
│
├── api/
│
├── login/
├── dashboard/
├── warranty/
└── repairs/
```

---

# api/

All backend API routes.

Example

```
api/

auth/

products/

repairs/

upload/

warranty/
```

---

# config/

Stores configuration.

Examples

JWT

Cloud Storage

Environment Variables

---

# constants/

Stores application constants.

Example

```
USER_ROLE

API_MESSAGES

STATUS_CODES

ERROR_MESSAGES
```

---

# generated/

Prisma generated client.

Never edit manually.

---

# lib/

Reusable libraries.

Example

```
prisma.js

jwt.js

cloudStorage.js
```

---

# middleware/

Application middleware.

Examples

Authentication

Authorization

Logging

Rate Limiting (Future)

---

# repositories/

Only database queries.

Examples

findUser()

findProduct()

createRepair()

---

# services/

Business Logic.

Examples

Login

Warranty Check

Repair Processing

---

# validations/

Zod validation schemas.

Example

```
login.validation.js

product.validation.js
```

---

# utils/

Reusable helper functions.

Examples

AppError

API Response

Date Helpers

File Helpers

JWT Helpers

---

# .github/

Contains GitHub Actions.

```
.github/

workflows/

ci.yml
```

---

# docker/

Docker-related configuration.

```
docker/

postgres/

nginx/
```

---

# Naming Conventions

Folders

lowercase

Files

camelCase

Classes

PascalCase

Variables

camelCase

Constants

UPPER_CASE

---

# Best Practices

- One responsibility per folder
- No business logic inside routes
- Repository only for database
- Services only for business logic
- Validation before service execution
- Reusable utility functions
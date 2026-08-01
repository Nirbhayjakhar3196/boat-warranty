# System Architecture

Version 1.0

---

# 1. Overview

BOAT Warranty Hub follows a Layered Architecture.

Each layer has a single responsibility.

This improves:

- Scalability
- Maintainability
- Testability

---

# 2. High Level Architecture

                    Client
                       │
                       ▼
                Next.js Frontend
                       │
HTTP Request            │
────────────────────────┼────────────────────
                       ▼
              Route Handler (API)
                       │
                       ▼
               Validation (Zod)
                       │
                       ▼
                Service Layer
                       │
                       ▼
              Repository Layer
                       │
                       ▼
                  Prisma ORM
                       │
                       ▼
                 PostgreSQL

---

# 3. Layer Responsibilities

## Frontend

Responsible for

- Forms
- UI
- API Calls

Never talks directly to database.

---

## Route Handlers

Responsible for

- Receive Request
- Validate Request
- Return Response

No Business Logic.

---

## Service Layer

Responsible for

Business Logic

Examples

- Login
- Password Hashing
- JWT Generation
- Warranty Validation

---

## Repository Layer

Responsible only for

Database Queries

Examples

findProduct()

createProduct()

updateProduct()

deleteProduct()

---

## Prisma ORM

Converts JavaScript Objects into SQL Queries.

---

## PostgreSQL

Persistent Storage.

Stores

- Users
- Products
- Repairs

---

# 4. Folder Structure

src/

app/

api/

config/

constants/

repositories/

services/

validations/

middleware/

utils/

lib/

---

# 5. Request Lifecycle

Client

↓

HTTP Request

↓

Route Handler

↓

Validation

↓

Service

↓

Repository

↓

Prisma

↓

Database

↓

Repository

↓

Service

↓

Route

↓

JSON Response

---

# 6. Authentication Flow

Admin Login

↓

Validate Credentials

↓

Compare Password

↓

Generate JWT

↓

Return Token

↓

Client Stores Token

↓

Future Requests

↓

Authorization Header

↓

Protected API

---

# 7. Product Flow

Admin

↓

Create Product

↓

Validation

↓

Service

↓

Repository

↓

Database

↓

Success Response

---

# 8. Warranty Lookup Flow

Customer

↓

Enter Serial Number

↓

Validate

↓

Repository Query

↓

Database

↓

Return Product

↓

Return Repair History

↓

Display Result

---

# 9. Error Handling

Application uses

AppError

Every error contains

- Message
- Status Code
- Error Type

Response Helpers ensure

Consistent API Response.

---

# 10. Response Format

Success

{
    "success": true,
    "message": "...",
    "data": {}
}

Error

{
    "success": false,
    "message": "...",
    "errors": []
}

---

# 11. Security

JWT Authentication

bcrypt Password Hashing

RBAC

Protected Routes

Environment Variables

Zod Validation

---

# 12. Design Patterns Used

Repository Pattern

Service Layer Pattern

Dependency Separation

Layered Architecture

Response Helper Pattern

Custom Error Pattern

---

# 13. Future Architecture

Future versions may include

Redis Cache

Background Jobs

Message Queues

Microservices

Monitoring

Logging

Cloud Deployment

Container Orchestration
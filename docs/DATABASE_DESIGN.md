# Database Design

Version: 1.0 (MVP)

---

# 1. Overview

The BOAT Warranty Hub database is designed using a relational model with PostgreSQL and Prisma ORM.

The MVP consists of three core entities:

- User
- Product
- RepairHistory

---

# 2. Database Diagram

            User
             │
             │ manages
             ▼
          Product
             │
             │ has many
             ▼
      RepairHistory

---

# 3. Entity: User

Purpose:

Stores administrator credentials.

---

Fields

| Field | Type | Constraint |
|-------|------|------------|
| id | Int | Primary Key |
| name | String | Required |
| email | String | Unique |
| password | String | Hashed |
| role | Enum | ADMIN |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

---

Business Rules

- Email must be unique.
- Password is stored using bcrypt.
- Only ADMIN users exist in MVP.

---

# 4. Entity: Product

Purpose

Stores warranty information for products.

---

Fields

| Field | Type | Constraint |
|-------|------|------------|
| id | Int | Primary Key |
| serialNumber | String | Unique |
| name | String | Required |
| model | String | Required |
| purchaseDate | DateTime | Required |
| warrantyExpiry | DateTime | Required |
| warrantyPdfUrl | String | Optional |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto |

---

Business Rules

- Every serial number is unique.
- Warranty expiry must be after purchase date.
- Warranty PDF is optional.
- One product can have many repair records.

---

# 5. Entity: RepairHistory

Purpose

Stores every repair made for a product.

---

Fields

| Field | Type | Constraint |
|-------|------|------------|
| id | Int | Primary Key |
| productId | Int | Foreign Key |
| issue | String | Required |
| repairDate | DateTime | Required |
| status | Enum | Required |
| remarks | String | Optional |
| createdAt | DateTime | Auto |

---

Repair Status

- Pending
- Approved
- In Progress
- Completed
- Rejected

---

Business Rules

- Repair must belong to an existing product.
- Multiple repairs are allowed.
- Repair history should never be deleted permanently.

---

# 6. Relationships

## User → Product

Relationship

One Admin

↓

Manages

↓

Many Products

---

## Product → RepairHistory

Relationship

One Product

↓

Many Repairs

---

# 7. Constraints

User

- Email Unique

Product

- Serial Number Unique

Repair

- Foreign Key Required

---

# 8. Indexes

Recommended

- email
- serialNumber
- warrantyExpiry
- repairDate

---

# 9. Prisma Naming Convention

Models

PascalCase

Example

User

Product

RepairHistory

---

Fields

camelCase

Example

purchaseDate

warrantyExpiry

repairDate

---

# 10. Migration Strategy

Step 1

Create User

↓

Step 2

Create Product

↓

Step 3

Create RepairHistory

↓

Step 4

Seed Admin User

---

# 11. Future Version (V2)

Additional Entities

- Warranty
- Purchase
- Customer
- Notifications
- Dashboard Analytics
- Audit Logs
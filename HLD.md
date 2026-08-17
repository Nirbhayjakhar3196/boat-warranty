# High-Level Design (HLD)

# Boat Warranty Hub

**Version:** 1.0
**Status:** Draft
**Document Type:** High-Level Design

---

# 1. Introduction

## 1.1 Purpose

This document describes the high-level technical architecture of the Boat Warranty Hub.

The purpose of this document is to define:

* Major system components.
* Responsibilities of each component.
* Communication between components.
* Application architecture.
* Data flow.
* Authentication and authorization approach.
* File/document management.
* Deployment architecture.
* Scalability and reliability considerations.
* External system integration points.

This document is based on the requirements defined in the Product Requirements Document (PRD).

---

# 2. System Overview

Boat Warranty Hub will use a web-based client-server architecture.

At a high level:

```text
                    ┌──────────────────────┐
                    │       Users          │
                    │ Customer / Dealer    │
                    │ Admin / Service      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Frontend        │
                    │       Next.js        │
                    └──────────┬───────────┘
                               │
                         HTTP / HTTPS
                               │
                               ▼
                    ┌──────────────────────┐
                    │       Backend        │
                    │      Next.js API     │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        Authentication    Business Logic    File Service
              │                │                │
              │                │                ▼
              │                │          Object Storage
              │                │
              │                ▼
              │          Prisma ORM
              │                │
              └────────────────┤
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    │       Database       │
                    └──────────────────────┘
```

---

# 3. Architecture Style

The initial system will use a **modular monolithic architecture**.

The application will be deployed as one primary backend application while its internal business functionality will be separated into independent modules.

Conceptually:

```text
                    Boat Warranty Hub
                           │
                  ┌────────┴────────┐
                  │    Backend      │
                  │   Application   │
                  └────────┬────────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
   Auth Module        Warranty Module      Claim Module
       │                   │                   │
       ▼                   ▼                   ▼
   User Module          Boat Module       Document Module
                           │
                           ▼
                    Notification Module
```

This approach keeps the initial system relatively simple while maintaining clear boundaries between business domains.

The architecture can later evolve into separate services if the system's scale or business requirements justify it.

---

# 4. Major System Components

The system consists of the following major components:

1. Client Application.
2. Backend API.
3. Authentication and Authorization.
4. User Management Module.
5. Boat Management Module.
6. Warranty Management Module.
7. Claim Management Module.
8. Document Management Module.
9. Notification Module.
10. Database.
11. Object/File Storage.
12. Monitoring and Logging.
13. CI/CD and Deployment Infrastructure.

---

# 5. Client Application

## 5.1 Responsibility

The client application provides the user interface through which users interact with Boat Warranty Hub.

The frontend will be implemented using **Next.js**.

## 5.2 Responsibilities

The frontend will:

* Display dashboards.
* Provide login interfaces.
* Display boats.
* Display warranties.
* Create claims.
* Upload documents.
* Display claim status.
* Provide search and filtering.
* Display role-specific functionality.
* Handle user interaction and client-side validation.

The frontend should not directly access the database.

---

# 6. Backend API

The backend provides the main application interface between the frontend and the business logic.

Conceptually:

```text
Frontend
    │
    │ HTTP Request
    ▼
Backend API
    │
    ▼
Business Logic
    │
    ▼
Database / Storage
```

The backend will be responsible for:

* Request handling.
* Authentication.
* Authorization.
* Input validation.
* Business rules.
* Claim processing.
* Warranty validation.
* Database operations.
* Document management.
* Error handling.
* Audit logging.

---

# 7. API Layer

The application will expose REST-style HTTP APIs.

Example API structure:

```text
/api
   │
   ├── /auth
   │
   ├── /users
   │
   ├── /boats
   │
   ├── /warranties
   │
   ├── /claims
   │
   ├── /documents
   │
   └── /notifications
```

Example:

```text
POST /api/claims
```

The API receives a request from the frontend and passes it through validation and business logic before modifying the database.

---

# 8. Authentication and Authorization

Authentication determines:

> "Who is this user?"

Authorization determines:

> "What is this user allowed to do?"

These are separate concepts.

Example:

```text
User
 │
 ▼
Login
 │
 ▼
Authentication
 │
 ▼
Authenticated User
 │
 ▼
Authorization
 │
 ├── Customer
 ├── Dealer
 ├── Service Personnel
 ├── Warranty Administrator
 └── System Administrator
```

The system will use role-based access control (RBAC).

---

# 9. Role-Based Access Control

Access to system functionality will depend on user roles.

Example:

```text
Customer
   ├── View Own Boats
   ├── View Own Warranties
   ├── Create Claims
   └── Track Own Claims

Dealer
   ├── Manage Boats
   ├── Manage Customers
   ├── Create Claims
   └── Upload Documents

Warranty Administrator
   ├── View Claims
   ├── Review Claims
   ├── Approve Claims
   └── Reject Claims

System Administrator
   ├── Manage Users
   ├── Manage Roles
   └── Manage System Configuration
```

Authorization must be enforced on the backend.

Frontend-based hiding of buttons alone is not sufficient for security.

---

# 10. Backend Module Architecture

The backend will be divided into logical business modules.

```text
Backend
│
├── Auth
│
├── Users
│
├── Boats
│
├── Warranties
│
├── Claims
│
├── Documents
│
├── Notifications
│
└── Audit
```

Each module should contain its own business responsibilities.

This separation improves maintainability and makes future changes easier.

---

# 11. User Management Module

## Responsibility

Manages users and their roles.

## Main responsibilities

* Create users.
* Retrieve user information.
* Update user information.
* Assign roles.
* Deactivate users.
* Manage user profiles.

High-level flow:

```text
Frontend
   ↓
User API
   ↓
User Module
   ↓
Database
```

---

# 12. Boat Management Module

## Responsibility

Manages boat records.

A boat may be associated with:

* Customer.
* Dealer.
* Warranty.
* Service history.

High-level relationship:

```text
Customer
    │
    │ owns
    ▼
  Boat
    │
    │ has
    ▼
 Warranty
```

The module will provide functionality for creating, retrieving, updating, and managing boat records.

---

# 13. Warranty Management Module

## Responsibility

Manages warranty records associated with boats.

High-level structure:

```text
Boat
 │
 └── Warranty
       │
       ├── Start Date
       ├── End Date
       ├── Status
       └── Warranty Type
```

The module will be responsible for:

* Creating warranties.
* Viewing warranties.
* Updating warranties.
* Checking warranty status.
* Determining warranty eligibility.
* Associating warranties with boats.

---

# 14. Claim Management Module

The Claim Module is one of the core business modules.

It manages the complete warranty claim lifecycle.

```text
Claim
 │
 ├── Create
 ├── Submit
 ├── Review
 ├── Approve
 ├── Reject
 ├── Repair
 └── Complete
```

The module will enforce claim-related business rules.

Example:

```text
Claim Submission
       │
       ▼
Check Boat
       │
       ▼
Check Warranty
       │
       ▼
Check Required Information
       │
       ▼
Create Claim
       │
       ▼
Submit for Review
```

---

# 15. Claim Status Workflow

The claim lifecycle will be represented using predefined statuses.

Initial status flow:

```text
DRAFT
   ↓
SUBMITTED
   ↓
UNDER_REVIEW
   ↓
 ┌──────────────┐
 ↓              ↓
APPROVED      REJECTED
 ↓
IN_REPAIR
 ↓
COMPLETED
```

The backend will control valid state transitions.

For example:

```text
DRAFT → SUBMITTED
SUBMITTED → UNDER_REVIEW
UNDER_REVIEW → APPROVED
UNDER_REVIEW → REJECTED
APPROVED → IN_REPAIR
IN_REPAIR → COMPLETED
```

Invalid transitions should be rejected.

---

# 16. Document Management Module

The document module manages files associated with business entities.

Examples:

* Invoice.
* Service report.
* Warranty document.
* Repair image.
* Purchase document.

The system should separate:

1. File storage.
2. File metadata.

Conceptually:

```text
User
 │
 ▼
Frontend
 │
 ▼
Backend
 │
 ├──────────────► Object Storage
 │                    │
 │                    ▼
 │                  File
 │
 ▼
PostgreSQL
 │
 ▼
Document Metadata
```

The database should store information such as:

* Document ID.
* File name.
* File type.
* File size.
* Storage reference.
* Associated claim.
* Uploaded by.
* Created timestamp.

The actual file can be stored in object storage rather than directly inside PostgreSQL.

---

# 17. Notification Module

The notification module will provide a centralized place for system notifications.

Potential events:

```text
Claim Submitted
      ↓
Notification

Claim Approved
      ↓
Notification

Claim Rejected
      ↓
Notification

Additional Documents Required
      ↓
Notification
```

Initially, notifications may be handled inside the application.

Future versions can integrate:

* Email.
* SMS.
* Push notifications.

---

# 18. Audit Module

Important system activities should be recorded.

Examples:

```text
User A
   ↓
Created Claim

User B
   ↓
Approved Claim

User C
   ↓
Changed Claim Status
```

An audit record may contain:

* Actor.
* Action.
* Entity.
* Entity ID.
* Timestamp.
* Relevant metadata.

This provides traceability for important warranty operations.

---

# 19. Database

The primary application database will be **PostgreSQL**.

The database will store structured business information.

High-level entities include:

```text
User
Role
Boat
Warranty
Claim
Document
Notification
AuditLog
```

High-level relationships:

```text
User
 │
 ├──────────── owns/manages ────────────┐
 │                                      │
 ▼                                      ▼
Boat                                  Claim
 │                                      │
 ▼                                      │
Warranty ◄──────────────────────────────┘
 │
 ▼
Document
```

The detailed database schema will be defined separately in the LLD/database design.

---

# 20. ORM Layer

The backend will use **Prisma ORM** to communicate with PostgreSQL.

Conceptually:

```text
Backend Business Logic
        │
        ▼
      Prisma
        │
        ▼
   PostgreSQL
```

The application should not directly construct raw database queries for normal application operations unless there is a specific reason.

Prisma will provide:

* Database access.
* Type-safe queries.
* Schema management.
* Relationship handling.
* Migration support.

---

# 21. Request Processing Flow

A typical request will follow this structure:

```text
User
 ↓
Frontend
 ↓
HTTP Request
 ↓
API Route
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Business Logic
 ↓
Prisma
 ↓
PostgreSQL
 ↓
Response
 ↓
Frontend
 ↓
User
```

Example:

```text
Customer
   ↓
"Submit Claim"
   ↓
POST /api/claims
   ↓
Authenticate User
   ↓
Check Customer Permissions
   ↓
Validate Request
   ↓
Check Warranty
   ↓
Create Claim
   ↓
Save in PostgreSQL
   ↓
Return Claim
   ↓
Display Success
```

---

# 22. Error Handling

Errors should be handled consistently throughout the application.

Examples:

```text
400 Bad Request
→ Invalid input

401 Unauthorized
→ User is not authenticated

403 Forbidden
→ User does not have permission

404 Not Found
→ Resource does not exist

409 Conflict
→ Operation conflicts with current state

500 Internal Server Error
→ Unexpected server failure
```

The API should return structured error responses.

---

# 23. Validation

Validation should occur at the API boundary before business operations are performed.

Example:

```text
Create Claim Request
        ↓
Validate Required Fields
        ↓
Validate Data Types
        ↓
Validate Business Rules
        ↓
Process Claim
```

Validation should include:

* Required fields.
* Correct data types.
* Valid identifiers.
* Valid dates.
* File constraints.
* Business-specific rules.

---

# 24. Security Architecture

Security will be applied at multiple layers.

```text
                    Security
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
Authentication   Authorization     Input Validation
       │               │                │
       └───────────────┼────────────────┘
                       ▼
                Database Security
                       │
                       ▼
                File Access Control
```

Important security practices include:

* HTTPS.
* Secure password handling.
* Authentication.
* Role-based authorization.
* Input validation.
* Secure session/token management.
* Protection of uploaded documents.
* Environment-based secret management.
* Database access restrictions.
* Audit logging.

---

# 25. File Upload Architecture

The file upload flow will be:

```text
User
 ↓
Frontend
 ↓
Upload API
 ↓
Validate File
 ├── File Type
 ├── File Size
 └── Authorization
 ↓
Object Storage
 ↓
Storage Reference
 ↓
Document Metadata → PostgreSQL
```

The database will store metadata and the storage reference rather than relying on the database as the primary binary-file store.

---

# 26. Caching

Caching is not required as a primary component of the MVP.

If performance requirements increase, caching can later be introduced for suitable read-heavy operations.

Potential candidates:

* Dashboard statistics.
* Frequently accessed warranty information.
* Reference data.

The caching layer should not become the source of truth for transactional warranty or claim data.

---

# 27. Logging and Monitoring

The production system should provide centralized logging.

Important events include:

* Authentication failures.
* API errors.
* Claim operations.
* Authorization failures.
* File-upload failures.
* Database errors.
* Unexpected application errors.

Monitoring should help identify:

* Application failures.
* High response times.
* Database problems.
* Resource usage.
* Failed deployments.

---

# 28. Deployment Architecture

A high-level production deployment may look like:

```text
                    Internet
                       │
                       ▼
                 Load Balancer
                       │
                       ▼
              Next.js Application
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        PostgreSQL          Object Storage
             │
             ▼
        Database Data
```

The exact cloud provider can be selected later.

---

# 29. Docker

The application should be containerized using Docker.

Conceptually:

```text
Docker
 │
 └── Boat Warranty Hub
       │
       ├── Application
       └── Dependencies
```

Docker provides a consistent environment between development, testing, and production.

---

# 30. CI/CD Architecture

The project should use a CI/CD pipeline.

High-level flow:

```text
Developer
    ↓
Git Push
    ↓
Git Repository
    ↓
CI Pipeline
    │
    ├── Install Dependencies
    ├── Lint
    ├── Type Check
    ├── Tests
    ├── Build
    └── Security Checks
    ↓
Deployment
    ↓
Production
```

The pipeline should prevent broken builds from being deployed.

---

# 31. Environment Management

Different environments should use separate configuration values.

```text
Development
     │
     ├── Development Database
     └── Development Secrets

Testing
     │
     ├── Test Database
     └── Test Configuration

Production
     │
     ├── Production Database
     └── Production Secrets
```

Sensitive values should not be committed to the Git repository.

Examples:

```text
DATABASE_URL
AUTH_SECRET
STORAGE_ACCESS_KEY
STORAGE_SECRET
API_KEYS
```

---

# 32. Data Flow — Claim Submission

The complete high-level claim submission flow is:

```text
Customer
   │
   │ Submit Claim
   ▼
Frontend
   │
   │ POST /api/claims
   ▼
Backend API
   │
   ▼
Authentication
   │
   ▼
Authorization
   │
   ▼
Validation
   │
   ▼
Claim Module
   │
   ├── Check Boat
   │
   ├── Check Warranty
   │
   ├── Validate Claim
   │
   └── Create Claim
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
   │
   ▼
Claim Created
   │
   ▼
Notification Module
   │
   ▼
Customer / Administrator
```

---

# 33. Data Flow — Claim Review

```text
Warranty Administrator
        │
        ▼
Frontend
        │
        ▼
GET /api/claims/:id
        │
        ▼
Authentication
        │
        ▼
Authorization
        │
        ▼
Claim Module
        │
        ▼
PostgreSQL
        │
        ▼
Claim Details
        │
        ▼
Administrator
        │
        ├──────── Approve
        │
        └──────── Reject
                    │
                    ▼
              Update Claim
                    │
                    ▼
                Audit Log
                    │
                    ▼
               Notification
```

---

# 34. Scalability Strategy

The initial architecture will prioritize simplicity while keeping clear module boundaries.

Potential future scaling strategies include:

### Horizontal Scaling

Multiple application instances can run behind a load balancer.

```text
             Load Balancer
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
    App #1      App #2      App #3
       │          │          │
       └──────────┼──────────┘
                  ▼
             PostgreSQL
```

### Database Scaling

Future options may include:

* Read replicas.
* Connection pooling.
* Query optimization.
* Index optimization.

### Storage Scaling

Object storage can scale independently of application servers.

---

# 35. Reliability Strategy

The system should minimize single points of failure where practical.

Important mechanisms include:

* Database backups.
* Reliable object storage.
* Health checks.
* Application monitoring.
* Error logging.
* Automated deployment.
* Recovery procedures.

---

# 36. Architectural Decisions

## AD-01 — Modular Monolith

A modular monolith will be used initially instead of microservices.

### Reason

The initial system does not require the operational complexity of multiple independently deployed services.

The modular structure still provides clear separation between business domains.

---

## AD-02 — PostgreSQL

PostgreSQL will be used as the primary relational database.

### Reason

The application contains strongly related business entities such as:

```text
User
Boat
Warranty
Claim
Document
```

A relational database is suitable for these relationships and transactional workflows.

---

## AD-03 — Prisma

Prisma will be used as the ORM.

### Reason

It provides type-safe database access and integrates well with the TypeScript backend.

---

## AD-04 — Object Storage

Large uploaded files will be stored in object storage instead of directly inside PostgreSQL.

### Reason

This keeps transactional database data separate from large binary files and allows storage to scale independently.

---

# 37. Technology Stack

The initial technology stack is:

| Layer            | Technology           |
| ---------------- | -------------------- |
| Frontend         | Next.js              |
| Backend          | Next.js API / Server |
| Language         | TypeScript           |
| ORM              | Prisma               |
| Database         | PostgreSQL           |
| File Storage     | Object Storage       |
| Containerization | Docker               |
| Version Control  | Git                  |
| CI/CD            | CI/CD Pipeline       |
| API Style        | REST                 |
| Architecture     | Modular Monolith     |

Specific cloud providers and external services can be selected during implementation.

---

# 38. High-Level Project Structure

The application is expected to follow a modular structure similar to:

```text
boat-warranty-hub/
│
├── app/
│   │
│   ├── api/
│   │
│   ├── dashboard/
│   │
│   ├── login/
│   │
│   └── ...
│
├── src/
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── boats/
│   │   ├── warranties/
│   │   ├── claims/
│   │   ├── documents/
│   │   ├── notifications/
│   │   └── audit/
│   │
│   ├── lib/
│   └── shared/
│
├── prisma/
│   └── schema.prisma
│
├── tests/
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── ...
```

The exact structure may evolve during LLD and implementation.

---

# 39. HLD Summary

The Boat Warranty Hub will use a modular monolithic architecture consisting of:

```text
                    Users
                      │
                      ▼
                  Next.js UI
                      │
                      ▼
                  REST APIs
                      │
              ┌───────┴────────┐
              ▼                ▼
        Authentication    Business Modules
                              │
                ┌─────────────┼──────────────┐
                ▼             ▼              ▼
              Boats       Warranties       Claims
                                             │
                                             ▼
                                        Documents
                                             │
                                             ▼
                                      Notifications
                             
                             
                         Prisma ORM
                              │
                              ▼
                         PostgreSQL
                             
                             
                         Object Storage
```

The architecture is intentionally designed to be simple enough for the initial product while maintaining clear module boundaries for future growth.

---

# 40. Relationship Between PRD, HLD and LLD

The design process is:

```text
PRD
 │
 │ Defines WHAT
 │
 ▼
HLD
 │
 │ Defines SYSTEM ARCHITECTURE
 │
 ▼
LLD
 │
 │ Defines IMPLEMENTATION DETAILS
 │
 ▼
CODE
```

The PRD defines the product requirements.

The HLD transforms those requirements into major technical components and their interactions.

The LLD will further break those components into:

* Controllers.
* Services.
* Repositories.
* Classes.
* Interfaces.
* Database models.
* API contracts.
* Validation rules.
* Detailed workflows.

---

# 41. Next Design Phase

The next document will be the **Low-Level Design (LLD)**.

The LLD will take the modules defined here and break them down into implementation-level components.

For example:

```text
Claim Module
     │
     ├── ClaimController
     │
     ├── ClaimService
     │
     ├── ClaimRepository
     │
     ├── ClaimValidator
     │
     ├── ClaimDTO
     │
     └── Claim Model
```

The LLD will also define detailed database relationships, API contracts, request/response structures, validation, error handling, and internal workflows.

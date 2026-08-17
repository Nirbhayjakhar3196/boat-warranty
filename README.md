# 🚤 Boat Warranty Hub

A centralized warranty management platform for managing boats, warranties, warranty claims, supporting documents, and claim-processing workflows.

---

## 📌 Overview

Boat Warranty Hub is a web-based warranty management system designed to digitize and centralize the complete boat warranty lifecycle.

The platform allows different users such as customers, dealers, service personnel, warranty administrators, and system administrators to manage warranty-related activities through a single system.

The system focuses on:

* Boat registration and management
* Warranty management
* Warranty claim submission
* Claim review and approval
* Claim status tracking
* Supporting document management
* Role-based access control
* Notifications
* Audit logging

---

# 🎯 Problem

Boat warranty management can involve multiple users, documents, claims, invoices, service records, and approval steps.

When these processes are handled manually or across disconnected systems, it can lead to:

* Difficult-to-track warranty information
* Slow claim processing
* Lost or disconnected documents
* Poor claim visibility
* Duplicate or invalid claims
* Manual administrative work
* Limited auditability

Boat Warranty Hub aims to solve these problems by providing a centralized digital platform.

---

# 💡 Product Vision

The goal of Boat Warranty Hub is to create a secure, traceable, and scalable platform where warranty-related activities can be managed from a single system.

The core workflow is:

```text
Boat
  ↓
Warranty
  ↓
Warranty Claim
  ↓
Claim Review
  ↓
Approval / Rejection
  ↓
Repair
  ↓
Completion
```

---

# 👥 User Roles

The system supports multiple roles.

| Role                   | Responsibility                                 |
| ---------------------- | ---------------------------------------------- |
| Customer               | Manage own boats, warranties and claims        |
| Dealer                 | Register boats and assist with warranty claims |
| Service Personnel      | Provide service and repair information         |
| Warranty Administrator | Review and process warranty claims             |
| System Administrator   | Manage users, roles and system configuration   |

---

# ✨ Core Features

## 🔐 Authentication

* User login
* Secure authentication
* Role-based access
* User profile management

---

## 🚤 Boat Management

Authorized users can:

* Register boats
* View boat information
* Update boat information
* Associate boats with customers and dealers
* Track associated warranties

---

## 🛡️ Warranty Management

The system manages:

* Warranty records
* Warranty start and end dates
* Warranty status
* Warranty type
* Warranty terms
* Warranty-to-boat relationships

Example warranty lifecycle:

```text
ACTIVE
  │
  ├──► EXPIRED
  │
  └──► CANCELLED
```

---

## 📋 Warranty Claims

Users can:

* Create claims
* Submit claims
* Upload supporting documents
* Track claim status
* Review claim information

Warranty administrators can:

* Review claims
* Approve claims
* Reject claims
* Move claims through the workflow

---

## 🔄 Claim Lifecycle

The claim workflow is:

```text
DRAFT
  ↓
SUBMITTED
  ↓
UNDER_REVIEW
  ↓
 ┌───────────┐
 ↓           ↓
APPROVED    REJECTED
 ↓
IN_REPAIR
 ↓
COMPLETED
```

Invalid state transitions are prevented by the backend.

---

## 📎 Document Management

Claims can contain supporting documents such as:

* Invoices
* Service reports
* Purchase documents
* Repair images
* Warranty documents

The application stores file metadata in the database while actual files are stored in object storage.

---

## 🔔 Notifications

The system provides notifications for important events such as:

* Claim submitted
* Claim approved
* Claim rejected
* Additional documentation requested
* Claim completed
* Warranty approaching expiry

---

## 📝 Audit Logging

Important operations are recorded for traceability.

Examples:

```text
CLAIM_CREATED
CLAIM_SUBMITTED
CLAIM_APPROVED
CLAIM_REJECTED
CLAIM_COMPLETED
BOAT_REGISTERED
DOCUMENT_UPLOADED
USER_ROLE_CHANGED
```

---

# 🏗️ Architecture

Boat Warranty Hub follows a **modular monolithic architecture**.

High-level architecture:

```text
                         Users
                           │
                           ▼
                    Next.js Frontend
                           │
                           ▼
                       REST API
                           │
                           ▼
                  Authentication Layer
                           │
                           ▼
                 Authorization / RBAC
                           │
                           ▼
                       Validators
                           │
                           ▼
                       Services
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
      Users              Boats            Warranties
                                             │
                                             ▼
                                           Claims
                                             │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                         Documents       Notifications     Audit
                              │
                              ▼
                        Object Storage

                           Services
                              │
                              ▼
                         Repositories
                              │
                              ▼
                            Prisma
                              │
                              ▼
                         PostgreSQL
```

---

# 🧱 Architecture Pattern

The backend follows a layered architecture:

```text
HTTP Request
     ↓
Controller / API Route
     ↓
Authentication
     ↓
Authorization
     ↓
Validation
     ↓
Service
     ↓
Repository
     ↓
Prisma
     ↓
PostgreSQL
```

### Controller

Handles HTTP requests and responses.

### Validator

Validates incoming data.

### Service

Contains business logic.

### Repository

Handles database operations.

### Prisma

Acts as the ORM between the application and PostgreSQL.

---

# 🧩 Main Modules

```text
src/
└── modules/
    ├── auth/
    ├── users/
    ├── boats/
    ├── warranties/
    ├── claims/
    ├── documents/
    ├── notifications/
    └── audit/
```

Each module is responsible for a specific business domain.

---

# 🛠️ Tech Stack

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

---

# 📁 Project Structure

The project is organized approximately as follows:

```text
boat-warranty-hub/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── boats/
│   │   ├── warranties/
│   │   ├── claims/
│   │   ├── documents/
│   │   └── notifications/
│   │
│   ├── dashboard/
│   ├── login/
│   └── ...
│
├── src/
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
│   ├── middleware/
│   ├── errors/
│   └── shared/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── tests/
│
├── docs/
│   ├── PRD.md
│   ├── HLD.md
│   └── LLD.md
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

# 📚 Documentation

Detailed project documentation is available in the `docs` directory.

### Product Requirements

`docs/PRD.md`

Defines:

* Product vision
* Problem statement
* Target users
* Features
* Functional requirements
* Non-functional requirements
* Business rules
* MVP scope
* Future scope

### High-Level Design

`docs/HLD.md`

Defines:

* System architecture
* Major components
* Application modules
* Data flow
* Deployment architecture
* Security architecture
* Scalability strategy
* CI/CD architecture

### Low-Level Design

`docs/LLD.md`

Defines:

* Controllers
* Services
* Repositories
* DTOs
* Validation
* Database entities
* API structure
* Claim state machine
* Authorization
* Error handling
* Detailed workflows

---

# 🚀 Getting Started

## Prerequisites

Before running the project, make sure the following are installed:

* Node.js
* npm
* Git
* PostgreSQL
* Docker (optional but recommended)

Verify Node.js:

```bash
node --version
```

Verify npm:

```bash
npm --version
```

Verify Git:

```bash
git --version
```

---

# 📥 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project directory:

```bash
cd boat-warranty-hub
```

Install dependencies:

```bash
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="your-postgresql-connection-string"

AUTH_SECRET="your-auth-secret"

STORAGE_ENDPOINT="your-storage-endpoint"
STORAGE_ACCESS_KEY="your-storage-access-key"
STORAGE_SECRET_KEY="your-storage-secret-key"
```

Never commit real secrets to Git.

The `.env` file should be included in `.gitignore`.

---

# 🗄️ Database Setup

After configuring `DATABASE_URL`, validate the Prisma configuration:

```bash
npx prisma validate
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

The database schema is defined in:

```text
prisma/schema.prisma
```

---

# ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

# 🐳 Running with Docker

Build the Docker image:

```bash
docker build -t boat-warranty-hub .
```

Run the container:

```bash
docker run -p 3000:3000 boat-warranty-hub
```

If Docker Compose is configured:

```bash
docker compose up
```

To stop the services:

```bash
docker compose down
```

---

# 🧪 Testing

Run the test suite using the project's configured test command.

Example:

```bash
npm test
```

Testing should cover:

* Unit tests
* Integration tests
* API tests
* Critical end-to-end workflows

---

# 🔍 Code Quality

Before creating a pull request, developers should run:

```bash
npm run lint
```

Type checking should also be performed where configured:

```bash
npm run type-check
```

The exact scripts may vary depending on the final `package.json`.

---

# 🔄 CI/CD

The CI/CD pipeline is expected to perform:

```text
Git Push
   ↓
Install Dependencies
   ↓
Lint
   ↓
Type Check
   ↓
Tests
   ↓
Build
   ↓
Docker Build
   ↓
Security Checks
   ↓
Deployment
```

A production deployment should only occur after required checks pass.

---

# 🔒 Security

The application should follow these security principles:

* Never commit secrets.
* Use HTTPS in production.
* Hash passwords securely.
* Validate all incoming data.
* Enforce authorization on the server.
* Protect uploaded files.
* Restrict database access.
* Avoid logging sensitive information.
* Maintain audit logs for important operations.
* Use environment variables for configuration and secrets.

---

# 📊 Core Data Model

The main entities are:

```text
User
 │
 ├── Boat
 │     │
 │     └── Warranty
 │            │
 │            └── Claim
 │                  │
 │                  └── Document
 │
 ├── Notification
 │
 └── AuditLog
```

The detailed database design is documented in the LLD and will be finalized during implementation.

---

# 🔄 Example Claim Workflow

A typical claim workflow is:

```text
Customer
   │
   ▼
Create Claim
   │
   ▼
Add Details
   │
   ▼
Upload Documents
   │
   ▼
Submit Claim
   │
   ▼
Warranty Administrator
   │
   ▼
Review Claim
   │
   ├───────────────┐
   ▼               ▼
Approve          Reject
   │               │
   ▼               ▼
In Repair        Closed
   │
   ▼
Completed
```

---

# 🗺️ Development Roadmap

The recommended implementation order is:

### Phase 1 — Foundation

* Project setup
* TypeScript configuration
* Database setup
* Prisma setup
* Environment configuration

### Phase 2 — Authentication

* User model
* Authentication
* Password handling
* Session management
* Role-based access

### Phase 3 — Boat Management

* Boat model
* Boat APIs
* Boat validation
* Boat permissions

### Phase 4 — Warranty Management

* Warranty model
* Warranty APIs
* Warranty status
* Warranty eligibility

### Phase 5 — Claims

* Claim model
* Claim creation
* Claim submission
* Claim review
* Claim approval/rejection
* Claim state transitions

### Phase 6 — Documents

* File upload
* Object storage
* Document metadata
* Secure document access

### Phase 7 — Notifications & Audit

* Notification system
* Audit logging
* Claim activity history

### Phase 8 — Testing

* Unit tests
* Integration tests
* API tests
* End-to-end tests

### Phase 9 — DevOps

* Docker
* CI/CD
* Environment management
* Deployment
* Monitoring

---

# 🧠 Design Philosophy

The project follows these principles:

### Simple First

The initial architecture should avoid unnecessary complexity.

### Modular

Business domains should remain separated.

### Secure by Default

Authorization and validation should be enforced at the backend.

### Maintainable

Code should be easy to understand, test, and modify.

### Scalable

The architecture should allow the application to grow without requiring a complete rewrite.

### Traceable

Important warranty operations should be auditable.

---

# 🚧 Current Status

The project documentation currently defines:

* Product Requirements
* High-Level Architecture
* Low-Level Design
* Core modules
* Claim workflow
* Database entities
* API structure
* Security requirements
* Deployment strategy

Implementation is performed incrementally based on these designs.

---

# 📌 Future Improvements

Potential future capabilities include:

* Email notifications
* SMS notifications
* Push notifications
* Advanced analytics
* Warranty expiry reminders
* Automated claim validation
* Duplicate claim detection
* AI-assisted claim processing
* External ERP/CRM integrations
* Advanced reporting
* Mobile application

---

# 🤝 Contribution Workflow

A typical development workflow is:

```text
Create Branch
     ↓
Implement Feature
     ↓
Write Tests
     ↓
Run Lint / Type Check
     ↓
Commit
     ↓
Push
     ↓
Create Pull Request
     ↓
CI Checks
     ↓
Code Review
     ↓
Merge
```

Feature branches should be used instead of directly pushing development work to the production branch.

---

# 📄 License

License information will be added when the project's licensing model is finalized.

---

# 👨‍💻 Project Documentation Structure

The project follows this documentation hierarchy:

```text
                    Boat Warranty Hub
                           │
                           ▼
                         PRD
                    What & Why?
                           │
                           ▼
                         HLD
                 System Architecture
                           │
                           ▼
                         LLD
                Implementation Design
                           │
                           ▼
                        API/DB
                   Detailed Contracts
                           │
                           ▼
                         CODE
                           │
                           ▼
                    Docker + CI/CD
                           │
                           ▼
                      Deployment
```

---

# ⭐ Summary

Boat Warranty Hub is designed as a centralized platform for managing the complete boat warranty lifecycle.

The system provides:

* Authentication
* Role-based access control
* Boat management
* Warranty management
* Claim management
* Document management
* Notifications
* Audit logging

The initial architecture uses a modular monolith with Next.js, TypeScript, Prisma, PostgreSQL, Docker, and CI/CD.

The project is designed to start simple while maintaining a strong foundation for future scalability, automation, integrations, and advanced warranty-management capabilities.

# BOAT Warranty Hub

Version: 1.0 (MVP)

---

# 1. Project Overview

BOAT Warranty Hub is a web-based warranty verification and repair management system.

Customers can check their product warranty by entering the serial number and view repair history.

Administrators can manage products, upload warranty PDFs, update repair history, and maintain the product database.

The project focuses on learning production backend development using:

- Next.js
- Node.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Docker
- GitHub Actions CI/CD

---

# 2. Objectives

- Build a production-style backend
- Learn Prisma relationships
- Learn Backend + Frontend Integration
- Learn Docker
- Learn CI/CD
- Learn Authentication
- Learn File Uploads
- Learn Deployment

---

# 3. User Roles

## Admin

- Login
- Add Product
- Update Product
- Delete Product
- Manage Repairs
- Upload Warranty PDF
- View Dashboard

---

## Customer

- Search Warranty
- View Warranty Details
- View Repair History
- Download Warranty PDF

---

# 4. Tech Stack

Frontend

- Next.js
- Tailwind CSS
- React

Backend

- Next.js Route Handlers
- Prisma ORM
- PostgreSQL

Authentication

- JWT
- bcrypt

Validation

- Zod

Storage

- Google Cloud Storage

Deployment

- Vercel
- PostgreSQL
- GitHub Actions
- Docker

---

# 5. Database Design

## User

| Field | Type |
|--------|------|
| id | Int |
| name | String |
| email | String |
| password | String |
| role | ADMIN |

---

## Product

| Field | Type |
|--------|------|
| id | Int |
| serialNumber | String |
| name | String |
| model | String |
| purchaseDate | DateTime |
| warrantyExpiry | DateTime |
| warrantyPdfUrl | String |
| createdAt | DateTime |
| updatedAt | DateTime |

---

## RepairHistory

| Field | Type |
|--------|------|
| id | Int |
| productId | Int |
| issue | String |
| repairDate | DateTime |
| status | String |
| remarks | String |
| createdAt | DateTime |

---

# 6. Relationships

User

↓

Manages

↓

Product

↓

Has Many

↓

RepairHistory

---

# 7. Authentication

Admin Login

JWT Token

Protected Routes

Password Hashing

Role Based Authentication

---

# 8. API Endpoints

## Authentication

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

---

## Product

GET /api/products

POST /api/products

PUT /api/products/:id

DELETE /api/products/:id

---

## Warranty

GET /api/warranty/:serial

---

## Repairs

POST /api/repairs

PUT /api/repairs/:id

DELETE /api/repairs/:id

---

## Upload

POST /api/upload

---

# 9. Application Workflow

Customer

↓

Enter Serial Number

↓

Validate Request

↓

Search Product

↓

Check Warranty Expiry

↓

If Active

↓

Show Warranty

↓

Fetch Repair History

↓

Display PDF

Else

↓

Warranty Expired

---

# 10. Admin Workflow

Admin Login

↓

Dashboard

↓

Manage Products

↓

Upload Warranty PDF

↓

Manage Repairs

↓

Database Updated

---

# 11. Folder Structure

src

app/

api/

auth/

products/

repairs/

upload/

warranty/

lib/

repositories/

services/

utils/

validations/

middleware/

config/

---

# 12. Security

JWT Authentication

bcrypt Password Hashing

Protected Routes

RBAC

Zod Validation

Environment Variables

Google Cloud Signed URLs

Private Storage

---

# 13. CI/CD

GitHub

↓

Push

↓

GitHub Actions

↓

Run Tests

↓

Docker Build

↓

Deploy

↓

Vercel

---

# 14. Docker

Dockerfile

Docker Compose

PostgreSQL Container

Application Container

---

# 15. Error Handling

Custom AppError

Response Helper

Centralized Error Responses

Validation Errors

HTTP Status Codes

---

# 16. Future Enhancements (Version 2)

These features are intentionally excluded from MVP and planned for the next version.

## Database Improvements

Separate Product and Warranty entities

Purchase entity

Warranty entity

Repair Request entity

Better Prisma relationships

---

## Customer Features

Customer Dashboard

Warranty Registration

Warranty Renewal

Profile Management

Download Invoice

Email Notifications

SMS Notifications

---

## Admin Features

Analytics Dashboard

Total Products

Total Active Warranty

Expired Warranty Count

Pending Repairs

Completed Repairs

Search Customers

Export Reports

CSV Export

PDF Reports

---

## Product Features

Categories

Brands

Stock Management

Product Images

Soft Delete

Bulk Import

---

## Warranty Features

Warranty Registration

Warranty Activation

Warranty Extension

Warranty Status

Auto Expiry

Reminder Emails

---

## Repair Features

Repair Timeline

Repair Tracking

Repair Cost

Technician Notes

Estimated Completion

Repair Attachments

---

## Search

Search by

Serial Number

Product Name

Model

Customer

Warranty Status

Repair Status

---

## Pagination

?page=1

&limit=10

Sorting

Filtering

---

## Performance

Redis Cache

Database Indexing

Prisma Optimization

Lazy Loading

---

## Security

Refresh Tokens

Rate Limiting

Helmet

Audit Logs

Session Tracking

Login History

---

## DevOps

Monitoring

Logging

Prometheus

Grafana

Nginx

AWS Deployment

Terraform

Kubernetes

---

# 17. Learning Outcomes

After completing this project, the developer will have hands-on experience with:

- Production Backend Development
- Prisma ORM
- PostgreSQL
- Authentication
- JWT
- Docker
- CI/CD
- Google Cloud Storage
- Backend Architecture
- Repository Pattern
- Service Layer
- API Design
- File Upload
- Production Deployment
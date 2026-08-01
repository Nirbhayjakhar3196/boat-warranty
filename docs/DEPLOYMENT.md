# Deployment Guide

Version 1.0

---

# Deployment Overview

Frontend

↓

Vercel

Backend

↓

Next.js Route Handlers

Database

↓

PostgreSQL

Storage

↓

Google Cloud Storage

CI/CD

↓

GitHub Actions

---

# Environment Variables

DATABASE_URL=

JWT_SECRET=

GOOGLE_PROJECT_ID=

GOOGLE_CLIENT_EMAIL=

GOOGLE_PRIVATE_KEY=

GOOGLE_BUCKET_NAME=

---

# Local Development

Requirements

Node.js

Git

Docker Desktop

PostgreSQL

---

Installation

```
git clone <repository>

cd boat-warranty-hub

npm install
```

---

Database

```
npx prisma migrate dev

npx prisma generate
```

---

Run Project

```
npm run dev
```

---

# Docker

Build Image

```
docker build -t boat-warranty-hub .
```

Run Container

```
docker run -p 3000:3000 boat-warranty-hub
```

---

# Docker Compose

Start

```
docker compose up
```

Stop

```
docker compose down
```

---

# GitHub Actions

Pipeline

Push

↓

Install Dependencies

↓

Run Lint

↓

Run Build

↓

Run Tests

↓

Docker Build

↓

Deploy

---

# Deployment Steps

Push Code

↓

GitHub Actions

↓

Build

↓

Deploy

↓

Live Website

---

# Production Checklist

✓ Environment Variables

✓ Build Success

✓ Docker Image

✓ Database Connected

✓ File Upload Working

✓ JWT Working

✓ HTTPS Enabled

✓ Error Logging

✓ Monitoring

---

# Troubleshooting

Database Connection Failed

- Check DATABASE_URL

JWT Error

- Verify JWT_SECRET

Cloud Upload Failed

- Check Bucket Credentials

Build Failed

- Verify dependencies

---

# Future Deployment

AWS

Google Cloud Run

Railway

Digital Ocean

Kubernetes

Nginx

Terraform
# Monorepo

## What is a Monorepo?

A **Monorepo (Monolithic Repository)** is a repository management strategy where multiple applications, services, packages, and libraries are stored inside a **single Git repository**.

Instead of creating separate repositories for:

- Frontend
- Backend
- Mobile App
- Shared UI Components
- Shared Database Logic

everything is stored in one repository.

---

# Simple Definition

```text
One Git Repository
        │
        ├── Multiple Applications
        ├── Multiple Packages
        ├── Shared Libraries
        └── Shared Configurations
```

---

# Real World Example

Suppose a company has:

```text
Customer Website
Admin Dashboard
Mobile App
Backend APIs
Shared UI Components
Shared Database Logic
```

Instead of creating:

```text
website-repo
admin-repo
mobile-repo
backend-repo
ui-repo
database-repo
```

they create:

```text
company-monorepo
```

and keep everything together.

---

# Monorepo Architecture

```text
Git Repository
│
├── Apps
├── Packages
├── Configurations
└── Documentation
```

---

# Basic Folder Structure

```text
company-monorepo/

├── apps/
│
│   ├── web/
│   ├── admin/
│   └── mobile/
│
├── packages/
│
│   ├── ui/
│   ├── auth/
│   ├── database/
│   └── utils/
│
├── docs/
│
├── package.json
│
└── turbo.json
```

---

# Core Concepts

## 1. Single Repository

Everything exists inside one Git repository.

```bash
git clone company-monorepo
```

You receive:

```text
Web App
Admin App
Mobile App
Shared Packages
```

all at once.

---

## 2. Multiple Applications

A monorepo can contain multiple applications.

Example:

```text
apps/

├── web
├── admin
├── mobile
└── dashboard
```

Each application is independent.

---

## 3. Shared Packages

Shared code is stored in packages.

```text
packages/

├── ui
├── auth
├── database
└── utils
```

Used by all applications.

---

# Shared UI Package Example

```text
packages/ui/
```

```tsx
export function Button() {
  return <button>Submit</button>;
}
```

Usage:

```tsx
import { Button } from "@repo/ui";
```

Used by:

```text
Web App
Admin App
Mobile App
```

---

# Shared Authentication Package

```text
packages/auth/
```

Contains:

```text
JWT Logic
Session Logic
Middleware
Permissions
Roles
```

Used by all applications.

---

# Shared Database Package

```text
packages/database/
```

Contains:

```text
Prisma Client
MongoDB Connection
Database Utilities
Schemas
```

Example:

```ts
import prisma from "@repo/database";
```

Used by:

```text
Web App
Admin App
Backend Services
```

---

# Monorepo for MERN Stack

## Folder Structure

```text
mern-monorepo/

├── apps/
│
│   ├── client/
│   │
│   ├── admin/
│   │
│   └── server/
│
├── packages/
│
│   ├── ui/
│   ├── auth/
│   ├── database/
│   └── utils/
│
├── package.json
│
└── pnpm-workspace.yaml
```

---

# Monorepo for Next.js

## Folder Structure

```text
next-monorepo/

├── apps/
│
│   ├── web/
│   ├── admin/
│   └── docs/
│
├── packages/
│
│   ├── ui/
│   ├── auth/
│   ├── database/
│   ├── config/
│   └── utils/
│
├── turbo.json
│
└── package.json
```

---

# Popular Monorepo Tools

## Turborepo

Used heavily with Next.js.

Features:

- Remote Caching
- Faster Builds
- Shared Packages
- Task Pipelines

---

## pnpm Workspaces

Example:

```yaml
packages:
  - apps/*
  - packages/*
```

---

## Nx

Enterprise-grade monorepo framework.

Provides:

- Dependency Graph
- Code Generation
- Build Optimization
- Testing Utilities

---

# Advantages of Monorepo

## Code Sharing

Write once.

Use everywhere.

```text
UI Components
Database Logic
Authentication
Utilities
```

---

## Easier Refactoring

Update one package.

All applications receive updates.

---

## Consistent Development

Same:

```text
TypeScript
ESLint
Prettier
Testing
```

for every application.

---

## Simplified Dependency Management

One dependency version.

```text
React 19
Next.js 16
TypeScript 6
```

---

## Better Collaboration

Teams work inside one repository.

---

# Disadvantages

## Repository Size

Can become very large.

---

## Complex Setup

Requires:

```text
Turborepo
Nx
pnpm Workspaces
```

configuration.

---

## Dependency Management Complexity

Managing relationships between:

```text
Apps
Packages
Libraries
```

can become difficult.

---

# Modern SaaS Monorepo Example

```text
saas-monorepo/

├── apps/
│
│   ├── web/
│   ├── admin/
│   └── docs/
│
├── packages/
│
│   ├── ui/
│   ├── auth/
│   ├── database/
│   ├── logger/
│   └── utils/
│
└── turbo.json
```

Used by many modern SaaS companies.

---

# Frontend + Backend + Database Structure in a Monorepo

A very common professional setup:

```text
company-monorepo/

├── apps/
│
│   ├── frontend/
│   │
│   ├── admin/
│   │
│   └── backend/
│
├── packages/
│
│   ├── ui/
│   │
│   ├── auth/
│   │
│   ├── database/
│   │
│   └── utils/
│
└── package.json
```

---

## Frontend App

```text
apps/frontend/

├── src/
├── pages/
├── components/
└── public/
```

Responsible for:

```text
UI
Routing
Forms
Dashboard
```

---

## Backend App

```text
apps/backend/

├── routes/
├── controllers/
├── services/
├── middleware/
└── models/
```

Responsible for:

```text
APIs
Authentication
Business Logic
Database Access
```

---

## Shared Database Package

```text
packages/database/

├── prisma/
├── schemas/
├── client.ts
└── index.ts
```

Responsible for:

```text
Database Connection
ORM
Models
Queries
```

Used by:

```text
Frontend (Server Components)
Backend APIs
Admin Panel
```

---

# Difference Between Monorepo and Monolithic Architecture

This is where most developers get confused.

---

# Monolithic Architecture

Monolithic Architecture defines:

> How the application is built and deployed.

Example:

```text
E-Commerce App

├── Auth Module
├── Product Module
├── Order Module
├── Payment Module
└── Database
```

Everything runs as:

```text
One Application
```

Deployment:

```text
Build
   ↓
Deploy
   ↓
Entire Application
```

---

## Monolithic Folder Structure (Frontend + Backend + Database)

```text
ecommerce-app/

├── frontend/
│
├── backend/
│
├── database/
│
├── package.json
│
└── .env
```

OR in Next.js:

```text
next-app/

├── app/
├── components/
├── lib/
├── prisma/
└── package.json
```

Everything belongs to a single application.

---

# Monorepo

Monorepo defines:

> How code is organized in Git.

Example:

```text
company-monorepo/

├── apps/
│
│   ├── web/
│   ├── admin/
│   └── backend/
│
├── packages/
│
│   ├── ui/
│   ├── auth/
│   └── database/
│
└── package.json
```

Everything belongs to:

```text
One Git Repository
```

but can contain multiple applications.

---

# Visual Comparison

## Monolithic Architecture

```text
One Application

├── Frontend
├── Backend
└── Database
```

Question answered:

```text
How is the application built?
```

---

## Monorepo

```text
One Repository

├── Frontend App
├── Admin App
├── Backend App
├── Shared UI
└── Shared Database
```

Question answered:

```text
How is the code organized?
```

---

# Final Memory Trick

```text
Monolith
=
One Application
```

```text
Microservices
=
Multiple Independent Services
```

```text
Monorepo
=
One Repository
```

---

# Recommended Setup for Next.js & MERN Developers

```text
Monorepo
│
├── Frontend App
├── Admin App
├── Backend App
├── Shared UI Package
├── Shared Auth Package
└── Shared Database Package
```

Inside each application, use a:

```text
Modular Monolithic Architecture
```

This is one of the most common and professional setups used in modern SaaS products.
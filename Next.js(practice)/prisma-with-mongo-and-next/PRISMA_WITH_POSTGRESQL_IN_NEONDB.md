# Prisma + Neon DB (PostgreSQL) + Next.js Setup & Migration Guide

This guide explains how this project connects Next.js with **Neon DB (PostgreSQL)** using **Prisma** from start to end, and how to successfully manage database migrations.

---

## 🚀 The Project Stack
- **Framework:** Next.js `16.2.6` (App Router)
- **Library:** React `19.2.4`
- **ORM:** Prisma `7.2.0`
- **Database:** Neon DB (Serverless PostgreSQL)
- **Database Adapter:** `@prisma/adapter-pg`

---

## 💡 The Core Concept: How Migration Files Are Generated
In Prisma, there are two ways to sync your `schema.prisma` with your database. Understanding the difference is crucial to ensuring your migration files are generated in the `prisma/migrations` folder:

### 1. `npx prisma migrate dev --name <migration_name>` (Recommended & Standard for SQL/Neon)
* **What it does:** Compares your `schema.prisma` with your database state, **automatically generates a folder containing a `migration.sql` file** inside `prisma/migrations/`, and applies the SQL code to your database.
* **Why use it:** It keeps a chronological, historical record of your database changes. **This is what you want!** Whenever you run this command, a new migration file is generated.

### 2. `npx prisma db push` (Only for Prototyping or MongoDB)
* **What it does:** Directly pushes your current `schema.prisma` file to the database.
* **Why it doesn't work for your needs:** It does **NOT** generate any migration SQL files in the `prisma/migrations` folder. 

> **Important:** To always generate migration files in your `prisma/migrations` folder, ALWAYS use `npx prisma migrate dev` instead of `npx prisma db push`!

---

## 🛠️ Step-by-Step Project Setup (From Scratch to Neon DB)

### 1. Get Your Neon DB Connection String
1. Go to [Neon.tech](https://neon.tech/) and log in.
2. Create a new project/database or select an existing one.
3. In your Neon dashboard, copy the **Connection String** from the homepage (ensure you select **Prisma** or **PostgreSQL** dialect).
4. The connection string looks like this:
   ```env
   DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-sparkling-surf-ap0tp0ts-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

### 2. Configure Environment Variables
Create a `.env` or `.env.local` file in the root of your project and paste your connection string:
```env
DATABASE_URL="postgresql://neondb_owner:YOUR_ACTUAL_NEON_PASSWORD@ep-sparkling-surf-ap0tp0ts-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
```
> **Warning:** Keep your database credentials private. Do not commit `.env` or `.env.local` files to GitHub.

---

## 📁 The Updated Configuration (Standard Setup)
We are using the standard approach where the **Prisma Client** is generated inside your `node_modules` folder, and environment files are loaded dynamically.

### 1. `prisma.config.ts` (Root directory)
This config handles loading both `.env.local` (commonly used by Next.js) and standard `.env` (used by Prisma CLI) so your database credentials are always available:
```typescript
import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Load both environment configuration files
loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
```

### 2. `prisma/schema.prisma`
Since we do not specify a custom output path, Prisma Client generates directly into `node_modules/.prisma/client`:
```prisma
generator client {
  provider = "prisma-client-js"
  // output is commented out so it generates inside node_modules
}

datasource db {
  provider = "postgresql"
}

// ─── User Model ─────────────────────────────────────────────
model User {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  name     String?
  posts    Post[]    @relation("UserPosts")
  comments Comment[] @relation("UserComments")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

// ─── Post Model ─────────────────────────────────────────────
model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?
  published Boolean   @default(false)

  author   User?   @relation("UserPosts", fields: [authorId], references: [id], onDelete: SetNull)
  authorId Int?

  comments Comment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("posts")
}

// ─── Comment Model ──────────────────────────────────────────
model Comment {
  id   Int    @id @default(autoincrement())
  body String

  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId Int

  author   User?  @relation("UserComments", fields: [authorId], references: [id], onDelete: SetNull)
  authorId Int?

  createdAt DateTime @default(now())

  @@map("comments")
}
```

### 3. Reusable Prisma Client inside `src/lib/prisma.ts`
We import the client directly from the `@prisma/client` package instead of a custom folder, utilizing the Neon `@prisma/adapter-pg` driver:
```typescript
import { PrismaClient } from "@prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

// Prevents multiple Prisma instances in Development due to hot-reloads
const prisma = global.__prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

export default prisma;
```

---

## 🔄 The Golden Migration Workflow (How to Change Schema & Generate Files)

Whenever you want to modify your database structure (e.g. add a new model, field, or relationship), use this simple workflow:

### **Step 1: Modify `prisma/schema.prisma`**
Open the schema file and make your edits (e.g., adding a `phone` field to the `User` model):
```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  phone String? // Added this new field
  ...
}
```

### **Step 2: Generate and Run the Migration**
Run the following command in your terminal. Replace `<migration_name>` with a simple name describing your changes:
```bash
npx prisma migrate dev --name add_phone_to_user
```

#### What this command does automatically:
1. **Creates a new folder** inside `prisma/migrations/` named with a timestamp and your migration name (e.g., `prisma/migrations/20260529120000_add_phone_to_user/`).
2. **Generates a `migration.sql` file** inside that folder with the exact raw SQL query.
3. **Applies the SQL query** directly to your Neon DB cloud database to update the table columns.
4. **Regenerates the standard Prisma Client** automatically in your `node_modules` so your code editor gets autocomplete for the new changes!

---

## 📋 Complete Guide to Starting the Project & Running Migrations
Follow these ultra-simple steps whenever you download, clone, or start working on the project on a new system:

### 1. Install Dependencies
Install all package dependencies, including Next.js, React, and Prisma packages:
```bash
npm install
```

### 2. Set Up the `.env` or `.env.local` File
Create a `.env` or `.env.local` file in the root of the project and insert your Neon connection string:
```env
DATABASE_URL="postgresql://neondb_owner:YOUR_ACTUAL_NEON_PASSWORD@ep-sparkling-surf-ap0tp0ts-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### 3. Run Existing Migrations (Sync Database)
Sync your cloud Neon database to create all tables:
```bash
npx prisma migrate dev
```
*(If no new changes are present in your schema compared to the migration history, Prisma will simply ensure your Neon DB has all existing tables up to date).*

### 4. Verify/Regenerate Prisma Client
Ensure your local standard `PrismaClient` is fully generated inside `node_modules`:
```bash
npx prisma generate
```

### 5. Start Development Server
Boot up the local Next.js server to run the application:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🛠️ Handy Prisma Troubleshooting Commands

| Command | What it does | When to use |
| :--- | :--- | :--- |
| `npx prisma validate` | Checks your `schema.prisma` syntax. | To check for syntax errors before migrations. |
| `npx prisma generate` | Regenerates the TypeScript client library. | If VS Code autocomplete doesn't show new tables/fields. |
| `npx prisma studio` | Opens a visual database explorer in browser. | To view, search, and edit database records visually. |
| `npx prisma migrate status` | Shows state of applied/pending migrations. | To debug if the DB tables got out of sync. |

---

## ⚡ Short Commands Cheat Sheet

Instead of typing long `npx` commands in your terminal, you can now use these short scripts configured in your `package.json`:

| Short Command | Long Command under the hood | What it does |
| :--- | :--- | :--- |
| **`npm run db:migrate`** | `npx prisma migrate dev` | Compares schema, generates migration SQL, updates DB, and updates TypeScript client. |
| **`npm run db:generate`** | `npx prisma generate` | Generates type-safe client methods. |
| **`npm run db:status`** | `npx prisma migrate status` | Checks migration synchronization status. |
| **`npm run db:studio`** | `npx prisma studio` | Opens local visual database dashboard in browser. |


# 🍃 Prisma with MongoDB Atlas — Full Guide (Start to End)

This guide walks you through the **complete process** of setting up Prisma with
MongoDB Atlas in a Next.js project — from account creation to running queries —
with every command and every step explained.

---

## 📦 Part 1 — Project Setup

### Step 1.1 — Create a Next.js Project

```bash
npx create-next-app@latest my-app
cd my-app
```

---

### Step 1.2 — Install Prisma

```bash
npm install prisma @prisma/client
```

| Package | What it does |
| :--- | :--- |
| `prisma` | The Prisma CLI tool (used in your terminal) |
| `@prisma/client` | The auto-generated database client your code imports |

---

### Step 1.3 — Initialize Prisma

```bash
npx prisma init
```

**What this creates:**
```
your-project/
├── prisma/
│   └── schema.prisma    ← Your database schema lives here
└── .env                 ← Your DATABASE_URL goes here
```

> ⚠️ After running this command, open `prisma/schema.prisma`.
> It will have `provider = "postgresql"` by default.
> You must change it to `"mongodb"` (done in the next step).

---

## 🌐 Part 2 — MongoDB Atlas Cloud Setup

### Step 2.1 — Create a Free Atlas Account

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **Try Free** and create an account.
3. Choose the **Free Tier (M0)** cluster.
4. Select any region (choose one close to you for speed).
5. Click **Create Cluster** (takes ~2 minutes).

---

### Step 2.2 — Create a Database User

1. In your Atlas dashboard, click **Database Access** in the left sidebar.
2. Click **Add New Database User**.
3. Set:
   - **Authentication Method**: Password
   - **Username**: e.g. `admin`
   - **Password**: Use a strong password (save it!)
   - **Role**: `Atlas Admin` (for development)
4. Click **Add User**.

---

### Step 2.3 — Allow Network Access

1. Click **Network Access** in the left sidebar.
2. Click **Add IP Address**.
3. Click **Allow Access from Anywhere** (sets `0.0.0.0/0`).
   > ⚠️ For production apps, only whitelist your server's specific IP.
4. Click **Confirm**.

---

### Step 2.4 — Get Your Connection String

1. Go to **Database** in the sidebar and click **Connect** on your cluster.
2. Click **Drivers**.
3. Select **Node.js** as the driver.
4. Copy the connection string. It looks like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your actual credentials.
6. Add your **database name** before the `?`:
   ```
   mongodb+srv://admin:mypassword@cluster0.abcde.mongodb.net/myapp?retryWrites=true&w=majority
   ```

---

### Step 2.5 — Add Connection String to `.env.local`

```env
# .env.local
DATABASE_URL="mongodb+srv://admin:mypassword@cluster0.abcde.mongodb.net/myapp?retryWrites=true&w=majority"
```

> 💡 Use `.env.local` in Next.js projects (not `.env`) so Next.js picks it up
> automatically without any extra configuration.

---

## ✍️ Part 3 — Writing the Schema

### Step 3.1 — Configure `prisma/schema.prisma`

Open `prisma/schema.prisma` and replace everything with this:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "mongodb"          // ← Changed from "postgresql" to "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─── User Model ─────────────────────────────────────────────
model User {
  // ⚠️ MongoDB ID rules: must be String, @default(auto()), @map("_id"), @db.ObjectId
  id    String  @id @default(auto()) @map("_id") @db.ObjectId
  email String  @unique
  name  String?

  // Relations
  posts    Post[]    @relation("UserPosts")
  comments Comment[] @relation("UserComments")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")  // maps to the "users" collection in MongoDB
}

// ─── Post Model ─────────────────────────────────────────────
model Post {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // ⚠️ Relation scalars must also be String @db.ObjectId
  author   User?   @relation("UserPosts", fields: [authorId], references: [id], onDelete: SetNull)
  authorId String? @db.ObjectId

  comments Comment[]

  @@map("posts")
}

// ─── Comment Model ──────────────────────────────────────────
model Comment {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  body      String
  createdAt DateTime @default(now())

  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String @db.ObjectId

  author   User?   @relation("UserComments", fields: [authorId], references: [id], onDelete: SetNull)
  authorId String? @db.ObjectId

  @@map("comments")
}
```

### 💡 MongoDB Schema Rules (Must Know)

| Rule | Why |
| :--- | :--- |
| ID must be `String` | MongoDB ObjectIds are hexadecimal strings |
| Must have `@default(auto())` | MongoDB generates the ObjectId automatically |
| Must have `@map("_id")` | MongoDB's internal primary key field is always named `_id` |
| Must have `@db.ObjectId` | Tells Prisma this is a MongoDB ObjectId type |
| All relation scalars (`authorId`, `postId`) must also be `String @db.ObjectId` | The linked document's ID must match the same type |

---

## ⚡ Part 4 — Syncing Schema to Database

### Step 4.1 — Push the Schema (The Key Command)

```bash
npx prisma db push
```

**What this does, step by step:**
1. Reads your `schema.prisma` file.
2. Connects to your MongoDB Atlas cluster using `DATABASE_URL`.
3. Creates any missing collections (`users`, `posts`, `comments`) in Atlas.
4. Sets up all `@unique` indexes (e.g. the `email` unique index on `users`).
5. Auto-generates the **Prisma Client** (type-safe database library) into
   `node_modules/@prisma/client`.

**Expected output:**
```
✔  Generated Prisma Client (v7.x.x) to ./node_modules/@prisma/client
The database is already in sync with the Prisma schema.
```

> 🚫 **Never run `npx prisma migrate dev` with MongoDB.** It will fail with:
> `Error: Prisma Migrate is not supported for MongoDB.`

---

### Step 4.2 — When to Re-run `db push`

Run `npx prisma db push` again whenever you:
- Add a new model to `schema.prisma`
- Add or remove a field from an existing model
- Add or change a `@unique` constraint
- Change a relation

---

### Step 4.3 — Regenerate the Client (Without DB sync)

If you only want to regenerate the TypeScript types without touching the database:

```bash
npx prisma generate
```

Run this when:
- VS Code autocomplete stops showing new fields
- You updated `schema.prisma` but don't need to push changes yet

---

## 🔌 Part 5 — Setting Up the Prisma Client in Next.js

### Step 5.1 — Create `src/lib/prisma.ts`

Create this file to share a **single** Prisma client instance across your app:

```typescript
// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

// Reuse the same client in development (avoids "too many connections" error)
const prisma = global.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

export default prisma;
```

> 💡 **Why the `global.__prisma` trick?**
> In Next.js dev mode, hot-reloading re-runs your module files very frequently.
> Without this pattern, each reload would create a new database connection,
> eventually exhausting the MongoDB Atlas connection pool.

> 📝 **Note for Neon DB / PostgreSQL:** You additionally pass a
> `PrismaPg adapter` to the constructor. MongoDB does not need any adapter —
> just `new PrismaClient()` works directly.

---

## 🧑‍💻 Part 6 — Using Prisma in Your Code

### Step 6.1 — Create a Record

```typescript
// Example: API route POST /api/posts
import prisma from "@/lib/prisma";

const post = await prisma.post.create({
  data: {
    title: "My First Post",
    content: "Hello World!",
    published: true,
    author: {
      connectOrCreate: {
        where: { email: "user@example.com" },
        create: { email: "user@example.com", name: "User" },
      },
    },
  },
});
```

---

### Step 6.2 — Read Records

```typescript
// Get all published posts with their authors
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true, comments: true },
  orderBy: { createdAt: "desc" },
});
```

---

### Step 6.3 — Find a Single Record by ID

```typescript
// ✅ MongoDB: id is already a String — no parseInt needed!
const post = await prisma.post.findUnique({
  where: { id: params.id },  // params.id from URL is already a string
  include: { author: true, comments: true },
});
```

> 🔁 **Compare with PostgreSQL (Neon DB):**
> ```typescript
> // ⚠️ PostgreSQL: id is Int — must convert the URL string to a number
> const parsedId = parseInt(params.id, 10);
> const post = await prisma.post.findUnique({ where: { id: parsedId } });
> ```

---

### Step 6.4 — Update a Record

```typescript
const updated = await prisma.post.update({
  where: { id: params.id },
  data: { title: "Updated Title", published: true },
});
```

---

### Step 6.5 — Delete a Record

```typescript
await prisma.post.delete({
  where: { id: params.id },
});
```

---

## 🔍 Part 7 — Useful Utility Commands

| Command | What it does | When to use |
| :--- | :--- | :--- |
| `npx prisma db push` | Sync schema → Atlas + regenerates client | After any schema change |
| `npx prisma generate` | Regenerates client only (no DB changes) | When autocomplete is stale |
| `npx prisma studio` | Opens visual database browser at `localhost:5555` | To view/edit data without writing code |
| `npx prisma validate` | Checks `schema.prisma` for syntax errors | Before pushing to make sure schema is valid |
| `npx prisma db push --force-reset` | ⚠️ DROPS all data and rebuilds from schema | Only in dev when you want a clean slate |

---

## 📊 Part 8 — Full Command Cheat Sheet

```bash
# 1. Initialize Prisma in your project (run once)
npx prisma init

# 2. After editing schema.prisma — sync changes to MongoDB Atlas
npx prisma db push

# 3. Regenerate TypeScript client only (no DB changes)
npx prisma generate

# 4. Open visual database browser
npx prisma studio

# 5. Validate your schema for errors
npx prisma validate

# 6. DANGER: Wipe all data and re-apply schema (dev only)
npx prisma db push --force-reset
```

---

## 🔄 Part 9 — Full Day-to-Day Workflow

This is the exact workflow you follow every time you work on your MongoDB project:

```
1. Edit prisma/schema.prisma   →  Add/change a model or field
        ↓
2. npx prisma db push          →  Sync changes to Atlas + update client types
        ↓
3. Update your API routes       →  Use the new fields in prisma.model.create() etc.
        ↓
4. npm run dev                  →  Start Next.js and test in browser
```

---

## 🔁 Part 10 — Comparison: MongoDB vs PostgreSQL (Neon DB)

| Step | MongoDB Atlas | Neon DB (PostgreSQL) |
| :--- | :--- | :--- |
| Provider in schema | `"mongodb"` | `"postgresql"` |
| ID field | `String @id @default(auto()) @map("_id") @db.ObjectId` | `Int @id @default(autoincrement())` |
| Sync command | `npx prisma db push` | `npx prisma migrate dev --name <name>` |
| Migration SQL files? | ❌ No | ✅ Yes (in `prisma/migrations/`) |
| ID in API routes | Use directly as `String` | Parse with `parseInt(id, 10)` |
| Prisma adapter needed? | ❌ No adapter | ✅ `@prisma/adapter-pg` for Neon |
| Production deploy | `npx prisma db push` | `npx prisma migrate deploy` |

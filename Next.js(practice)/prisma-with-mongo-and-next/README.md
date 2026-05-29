# 📝 Prisma Posts — Next.js + Neon DB (PostgreSQL)

A full-stack Next.js application using **Prisma ORM** with **Neon DB (PostgreSQL)**
as the cloud database. The app supports creating, editing, deleting, and commenting
on posts, with a tag taxonomy system and a clean, responsive UI.

---

## 🗂️ Project Structure

```
prisma-with-mongo-and-next/
├── prisma/
│   ├── schema.prisma          ← Database models (User, Post, Comment, Tag)
│   └── migrations/            ← SQL migration history (auto-generated)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── posts/         ← GET all, POST create + [id] GET, PATCH, DELETE
│   │   │   ├── comments/      ← GET all, POST create + [id] GET, DELETE
│   │   │   └── tags/          ← GET all, POST create
│   │   ├── posts/             ← Posts list page + [id] detail page
│   │   ├── tags/              ← Tags management page
│   │   └── new-post/          ← Create post form page
│   └── lib/
│       └── prisma.ts          ← Shared Prisma client instance
├── prisma.config.ts           ← Loads .env & .env.local for Prisma CLI
├── PRISMA.md                  ← Full Neon DB + Prisma guide
├── MONGODB.md                 ← Full MongoDB Atlas + Prisma guide
└── .env.local                 ← Your DATABASE_URL (never commit this!)
```

---

## ⚙️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 16** | Full-stack React framework (App Router) |
| **Prisma 7** | Type-safe ORM for database access |
| **Neon DB** | Serverless PostgreSQL cloud database |
| **TypeScript** | Static typing across the whole project |
| **@prisma/adapter-pg** | PostgreSQL connection adapter for Neon |

---

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd prisma-with-mongo-and-next
npm install
```

---

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require"
```

Get this connection string from your [Neon DB Dashboard](https://console.neon.tech)
under **Connection Details → Connection String**.

---

### 3. Apply Migrations to Your Database

This creates all the tables (`users`, `posts`, `comments`, `tags`) in your Neon DB:

```bash
npx prisma migrate deploy
```

> ✅ Use `migrate deploy` when setting up a fresh clone.
> It applies all existing migration files without creating new ones.

---

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Commands

These short scripts are configured in `package.json` so you don't need to type
long `npx` commands every time.

### Development Workflow

```bash
# After changing prisma/schema.prisma → creates SQL file + updates DB + regenerates client
npm run db:migrate
# ↑ Prompts you to enter a migration name (e.g. "add_phone_to_user")

# Check if your local migration files match what's applied to Neon DB
npm run db:status

# Regenerate TypeScript client only (when autocomplete feels stale)
npm run db:generate

# Open a visual browser to view and edit database records
npm run db:studio
```

### Direct `npx` Equivalents

| Short Command | Full Command | When to Use |
| :--- | :--- | :--- |
| `npm run db:migrate` | `npx prisma migrate dev` | After every schema change in development |
| `npm run db:status` | `npx prisma migrate status` | To check DB sync state |
| `npm run db:generate` | `npx prisma generate` | To refresh TypeScript types only |
| `npm run db:studio` | `npx prisma studio` | To visually browse/edit DB records |
| *(not in scripts)* | `npx prisma migrate deploy` | On fresh clone / production deploy |
| *(not in scripts)* | `npx prisma migrate reset --force` | ⚠️ Wipes DB and re-applies all migrations |

---

## 🔄 Day-to-Day Development Workflow

```
1. Edit prisma/schema.prisma    →  Add or change a model / field
         ↓
2. npm run db:migrate            →  Enter a name (e.g. "add_tag_model")
   (Prisma creates migration SQL + applies it to Neon + regenerates client)
         ↓
3. Update API routes & pages     →  Use the new fields in your code
         ↓
4. npm run dev                   →  Test in browser at http://localhost:3000
```

---

## 📋 Migration Naming Guide

When running `npm run db:migrate`, use descriptive snake_case names:

| Schema Change | Good Migration Name |
| :--- | :--- |
| Added `phone` field to `User` | `add_phone_to_user` |
| Created new `Tag` model | `add_tag_model` |
| Removed `content` from `Post` | `remove_content_from_post` |
| Made `email` optional | `make_email_nullable` |

---

## 🌐 API Routes Reference

| Method | Route | What it does |
| :--- | :--- | :--- |
| `GET` | `/api/posts` | Fetch all posts |
| `POST` | `/api/posts` | Create a new post |
| `GET` | `/api/posts/:id` | Fetch a single post by ID |
| `PATCH` | `/api/posts/:id` | Update a post (title, content, published) |
| `DELETE` | `/api/posts/:id` | Delete a post and all its comments |
| `GET` | `/api/comments` | Fetch all comments |
| `POST` | `/api/comments` | Add a comment to a post |
| `DELETE` | `/api/comments/:id` | Delete a single comment |
| `GET` | `/api/tags` | Fetch all tags |
| `POST` | `/api/tags` | Create a tag (optionally linked to a post) |

---

## 📚 Reference Guides

| File | Contents |
| :--- | :--- |
| [`PRISMA.md`](./PRISMA.md) | Full Neon DB + PostgreSQL + `prisma migrate` workflow |
| [`MONGODB.md`](./MONGODB.md) | Full MongoDB Atlas + `prisma db push` workflow |

---

## 🚢 Production Deployment

When deploying (e.g. to Vercel):

1. Add `DATABASE_URL` as an environment variable in your Vercel dashboard.
2. Add this build command to run migrations automatically on each deploy:
   ```bash
   npx prisma migrate deploy && next build
   ```
   > `migrate deploy` safely applies pending migrations without creating new ones.

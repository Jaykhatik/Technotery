# Prisma + MongoDB + Next.js Setup Guide

This guide explains how this project connects Next.js with MongoDB using Prisma from start to end.

The project stack is:

- Next.js `16.2.6`
- React `19.2.4`
- Prisma `6.19.0`
- MongoDB Atlas
- App Router API routes

> Important: this project uses Prisma `6.19.0` because MongoDB support in this setup works correctly with Prisma 6. Do not upgrade Prisma blindly unless you confirm MongoDB support for your target Prisma version.

## 1. Create A Next.js Project

If starting from zero, create a Next app:

```bash
npx create-next-app@latest prisma-with-mongo-and-next
cd prisma-with-mongo-and-next
```

Choose TypeScript and App Router.

## 2. Install Prisma

Install Prisma CLI as a dev dependency and Prisma Client as a runtime dependency:

```bash
npm install prisma@6.19.0 --save-dev
npm install @prisma/client@6.19.0
```

Initialize Prisma:

```bash
npx prisma init
```

This creates:

```text
prisma/schema.prisma
.env
```

This project also has:

```text
prisma.config.ts
src/lib/prisma.ts
src/generated/prisma
```

## 3. Create MongoDB Atlas Database

1. Go to MongoDB Atlas.
2. Create a cluster.
3. Create a database user.
4. Allow your IP address in Network Access.
5. Copy the MongoDB connection string.

The connection string looks like this:

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster-url.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority"
```

Example shape:

```env
DATABASE_URL="mongodb+srv://myuser:mypassword@cluster1.mongodb.net/PrismaData?retryWrites=true&w=majority"
```

Do not commit real database passwords to GitHub.

## 4. Configure Environment Variables

Create or update `.env` in the project root:

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster-url.mongodb.net/PrismaData?retryWrites=true&w=majority"
```

The database name in this project is:

```text
PrismaData
```

If your document is in another database, Prisma will not find it.

## 5. Configure Prisma

This project uses `prisma.config.ts`:

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"]!,
  },
});
```

`import "dotenv/config"` loads the `.env` file so Prisma can read `DATABASE_URL`.

## 6. Prisma Schema For MongoDB

The main Prisma file is:

```text
prisma/schema.prisma
```

Current schema:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id       String    @id @map("_id") @default(auto()) @db.ObjectId
  email    String    @unique
  name     String?
  posts    Post[]    @relation("UserPosts")
  comments Comment[] @relation("UserComments")
}

model Post {
  id        String     @id @map("_id") @default(auto()) @db.ObjectId
  title     String
  content   String?
  published Boolean    @default(false)
  author    User?      @relation("UserPosts", fields: [authorId], references: [id])
  authorId  String?    @db.ObjectId
  comments  Comment[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

model Comment {
  id        String   @id @map("_id") @default(auto()) @db.ObjectId
  body      String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String   @db.ObjectId
  author    User?    @relation("UserComments", fields: [authorId], references: [id])
  authorId  String?  @db.ObjectId
  createdAt DateTime @default(now())
}
```

## 7. Important MongoDB Notes

MongoDB uses `_id`, but Prisma models normally use `id`.

That is why every model has:

```prisma
id String @id @map("_id") @default(auto()) @db.ObjectId
```

Meaning:

- `id` is used in your TypeScript code.
- `_id` is used inside MongoDB.
- `@db.ObjectId` tells Prisma this is a MongoDB ObjectId.
- `@default(auto())` lets MongoDB/Prisma create the ObjectId automatically.

Collection names are based on model names:

```text
User
Post
Comment
```

So MongoDB should contain collections named exactly:

```text
User
Post
Comment
```

If your collection is named `posts`, Prisma model `Post` will not read it unless you add:

```prisma
@@map("posts")
```

inside the `Post` model.

## 8. Generate Prisma Client

After creating or changing the schema, run:

```bash
npx prisma generate
```

Because this project uses:

```prisma
output = "../src/generated/prisma"
```

the generated client is created here:

```text
src/generated/prisma
```

### Why `src/generated/prisma` Is Created

The `src/generated/prisma` folder is created automatically when you run:

```bash
npx prisma generate
```

It is created because `schema.prisma` has this generator:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}
```

In simple words:

- `schema.prisma` describes your database models.
- `npx prisma generate` reads that schema.
- Prisma creates TypeScript/JavaScript code inside `src/generated/prisma`.
- Your app imports that generated code to talk to MongoDB.

This generated folder gives you `PrismaClient`.

Example:

```ts
await prisma.post.findMany();
await prisma.user.create();
await prisma.comment.findMany();
```

Benefits:

- TypeScript knows your models: `User`, `Post`, `Comment`.
- TypeScript knows your fields: `title`, `content`, `email`, `published`.
- You get autocomplete in VS Code.
- You get safer database queries.
- You can use Prisma methods like `findMany`, `create`, `update`, and `delete`.

The flow is:

```text
schema.prisma
  -> npx prisma generate
  -> src/generated/prisma
  -> src/lib/prisma.ts
  -> Next.js pages and API routes
  -> MongoDB
```

Do not edit files inside `src/generated/prisma` manually.

If you change `schema.prisma`, just run:

```bash
npx prisma generate
```

Prisma will update the generated folder again.

## 9. Push Schema To MongoDB

For MongoDB, Prisma does not use normal SQL migrations like PostgreSQL or MySQL.

Use:

```bash
npx prisma db push
```

Then regenerate the client:

```bash
npx prisma generate
```

## 10. Create A Reusable Prisma Client

The reusable Prisma client is in:

```text
src/lib/prisma.ts
```

Code:

```ts
import { PrismaClient } from "../generated/prisma";

declare global {
  var __prisma: PrismaClient | undefined;
}

const prisma = global.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.__prisma = prisma;

export default prisma;
```

Why this file exists:

- It creates one Prisma client instance.
- In development, Next.js hot reload can create many Prisma clients.
- Storing it on `global` avoids too many database connections.

## 11. Using Prisma In Next.js API Routes

API routes live in:

```text
src/app/api
```

### Posts API

File:

```text
src/app/api/posts/route.ts
```

This route:

- Gets all posts.
- Creates posts.
- Creates or reuses an author by email.
- Connects the post to the author.

Main idea:

```ts
const author = await prisma.user.upsert({
  where: { email: authorEmail },
  update: authorName ? { name: authorName } : {},
  create: {
    email: authorEmail,
    name: authorName || null,
  },
});

const post = await prisma.post.create({
  data: {
    title,
    content: content || null,
    published: body.published !== false,
    author: { connect: { id: author.id } },
  },
  include: { author: true },
});
```

This fixes the old `Unknown` author problem because new posts now always connect to a real `User`.

### Comments API

File:

```text
src/app/api/comments/route.ts
```

This route:

- Gets all comments.
- Creates a comment for a specific post.
- Optionally creates or reuses a comment author by email.
- Connects the comment to the post.

Main idea:

```ts
const comment = await prisma.comment.create({
  data: {
    body: commentBody,
    post: { connect: { id: postId } },
    author: author ? { connect: { id: author.id } } : undefined,
  },
  include: { author: true },
});
```

## 12. Using Prisma In Server Components

The posts page uses Prisma directly instead of fetching `/api/posts`.

File:

```text
src/app/posts/page.tsx
```

Example:

```ts
async function getPosts() {
  return prisma.post.findMany({
    include: {
      author: true,
      comments: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
```

Why not use this on the server?

```ts
fetch("/api/posts")
```

Because server-side fetch needs an absolute URL. Relative URLs like `/api/posts` can throw:

```text
Failed to parse URL from /api/posts
```

Using Prisma directly in server components avoids that problem.

## 13. Showing Comments For One Post

The post detail page is:

```text
src/app/posts/[id]/page.tsx
```

It loads one post and only that post's comments:

```ts
return prisma.post.findUnique({
  where: { id },
  include: {
    author: true,
    comments: {
      include: { author: true },
      orderBy: { createdAt: "desc" },
    },
  },
});
```

This means:

- Click one post.
- Only comments connected to that post are shown.
- Comments from other posts do not appear.

## 14. Add Comment Modal

The comment modal component is:

```text
src/app/posts/[id]/CommentForm.tsx
```

It is a client component:

```tsx
"use client";
```

It uses:

```ts
const router = useRouter();
```

After a comment is created, it calls:

```ts
router.refresh();
```

That refreshes the server-rendered post detail page so the new comment appears.

## 15. Published Field

The `published` field is:

```prisma
published Boolean @default(false)
```

Meaning:

- `true` means the post is published.
- `false` means the post is a draft.

In the UI:

- Published posts show `Published`.
- Draft posts show `Draft`.

The new post form has a `Publish now` checkbox.

## 16. Common Prisma Commands

Generate Prisma Client:

```bash
npx prisma generate
```

Push schema changes to MongoDB:

```bash
npx prisma db push
```

Open Prisma Studio:

```bash
npx prisma studio
```

Check Prisma version:

```bash
npx prisma -v
```

## 17. Run The Next.js Project

Start development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build production version:

```bash
npm run build
```

Start production server after build:

```bash
npm run start
```

Run lint:

```bash
npm run lint
```

## 18. Full Setup Steps From Start To End

Use these steps when creating this setup again:

1. Create Next.js app.

```bash
npx create-next-app@latest prisma-with-mongo-and-next
```

2. Install Prisma 6 packages.

```bash
npm install prisma@6.19.0 --save-dev
npm install @prisma/client@6.19.0
```

3. Initialize Prisma.

```bash
npx prisma init
```

4. Add MongoDB connection string in `.env`.

```env
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@cluster-url.mongodb.net/PrismaData?retryWrites=true&w=majority"
```

5. Configure `prisma/schema.prisma` with MongoDB datasource.

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

6. Add your Prisma models.

```prisma
model User {
  id    String @id @map("_id") @default(auto()) @db.ObjectId
  email String @unique
  name  String?
}
```

7. Generate Prisma Client.

```bash
npx prisma generate
```

8. Push schema to MongoDB.

```bash
npx prisma db push
```

9. Create reusable Prisma client in `src/lib/prisma.ts`.

10. Use Prisma inside API routes for create/update/delete operations.

11. Use Prisma directly inside server components for database-backed pages.

12. Run the app.

```bash
npm run dev
```

13. Test routes.

```text
/posts
/new-post
/posts/[id]
/api/posts
/api/comments
```

14. Build before deployment.

```bash
npm run build
```

## 19. Common Problems And Fixes

### Problem: Prisma returns empty posts

Check:

- The database name in `DATABASE_URL`.
- The collection name in MongoDB.
- Your collection should be `Post`, not `posts`, unless you use `@@map("posts")`.

### Problem: Author shows Unknown

This happens when `authorId` is `null`.

Fix:

- Send `authorName` and `authorEmail` from the form.
- In the API route, upsert a `User`.
- Connect the post to that user.

### Problem: Failed to parse URL from /api/posts

This happens when a server component tries:

```ts
fetch("/api/posts")
```

Fix:

- Use Prisma directly in server components.
- Or use an absolute URL.

### Problem: NextResponse error with status 204

Do not return JSON with status `204`.

Wrong:

```ts
return NextResponse.json({}, { status: 204 });
```

Correct:

```ts
return new Response(null, { status: 204 });
```

### Problem: VS Code says datasource `url` is no longer supported

You may see this warning in `schema.prisma`:

```text
The datasource property `url` is no longer supported in schema files.
```

This warning is for Prisma 7.

This project uses Prisma `6.19.0`, where MongoDB still needs the `url` field inside `schema.prisma`:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

Do not remove `url` from `schema.prisma` in this project. If you remove it, Prisma 6 validation/generation can fail.

To fix the VS Code warning:

1. Open VS Code Command Palette.
2. Search for Prisma version selection.
3. Select Prisma ORM version `6`.
4. Restart the Prisma language server or reload VS Code.

You can confirm the real project schema is valid with:

```bash
npx prisma validate
```

## 20. Final Project Flow

The app flow is:

1. User opens `/posts`.
2. Server component reads posts from MongoDB using Prisma.
3. User creates a post from `/new-post`.
4. API route creates or reuses an author.
5. API route creates the post and connects author.
6. User clicks a post.
7. Post detail page loads that post and related comments.
8. User clicks `Add comment`.
9. Comment modal opens.
10. API route creates the comment and connects it to the post.
11. Page refreshes and shows the new comment.

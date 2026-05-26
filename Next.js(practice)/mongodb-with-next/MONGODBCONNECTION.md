# Next.js 15 + MongoDB Practice Project

A modern Next.js project integrated with MongoDB and Mongoose. This repository serves as a step-by-step implementation guide to securely connect and query a MongoDB database within Next.js API routes.

---

## 🚀 How to Connect MongoDB to Next.js (Step-by-Step)

Connecting MongoDB to Next.js involves **4 key phases**: Setup, Secure Configuration, Schema Modeling, and API Routing.

### Phase 1: Installation

Install `mongoose` in your project to interact with MongoDB:

```bash
npm install mongoose
```

---

### Phase 2: Secure Environment Configuration

Database credentials should **never** be hardcoded in your code. Always store them securely in a `.env.local` file located in the root of your project.

#### ⚠️ Windows Collision Warning
On Windows systems, the variable `username` is a built-in OS environment variable. To avoid collisions, always prefix your database variables (e.g., `MONGODB_USER` and `MONGODB_PASSWORD`).

1. Create a `.env.local` file:
   ```env
   MONGODB_USER=your_db_username
   MONGODB_PASSWORD=your_db_password
   ```

2. Create `src/lib/db.ts` to manage your connection string safely:
   ```typescript
   const username = process.env.MONGODB_USER;
   const password = process.env.MONGODB_PASSWORD;

   export const connectionSrt = `mongodb+srv://${username}:${password}@firstcluster.tueqd3h.mongodb.net/dataDB?appName=Firstcluster`;
   ```

---

### Phase 3: Define a Mongoose Schema and Model

Create a Mongoose model to define the structure of your collection and prevent hot-reload compilation issues.

Create `src/lib/model/product.ts`:
```typescript
import mongoose from "mongoose";

const productModel = new mongoose.Schema({
  name: String,
  price: Number,
  company: String,
  color: String,
  category: String
});

// Reuse existing model if compiled during hot-reloads, otherwise register a new one
export const Product = mongoose.models.products || mongoose.model("products", productModel);
```

---

### Phase 4: Create Next.js API Routes

Use the connection inside your Next.js route handlers.

Create `src/app/api/products/route.ts`:
```typescript
import { connectionSrt } from "@/lib/db";
import { Product } from "@/lib/model/product";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Establish the connection to the database
    await mongoose.connect(connectionSrt);
    
    // 2. Fetch the documents from the collection
    const data = await Product.find();
    
    // 3. Return the response
    return NextResponse.json({ result: data, success: true });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ result: "Failed to fetch products", success: false }, { status: 500 });
  }
}
```

---

## 🛠️ Is This the "Correct" Way?

Yes! Your current approach is **conceptually correct** and works perfectly for learning and development. 

### 💡 Advanced Tip: Connection Caching (For Production & Serverless)
In a high-traffic production application or serverless environment (like Vercel), calling `mongoose.connect` on every request can open too many connections. Mongoose handles basic caching internally, but the industry best-practice for Next.js is to cache the connection globally:

```typescript
// Example: src/lib/dbConnect.ts
import mongoose from 'mongoose';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(connectionSrt).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

You can scale up to this cached pattern as your project grows!

---

## 运行与测试 (Running & Testing)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test the API route by visiting [http://localhost:3000/api/products](http://localhost:3000/api/products) or running this in PowerShell:
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/api/products"
   ```

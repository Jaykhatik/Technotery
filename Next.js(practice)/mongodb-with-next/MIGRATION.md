# MongoDB Schema & Database Migration Guide

This guide provides a comprehensive, step-by-step blueprint for executing database migrations in a **Next.js 15+ & MongoDB/Mongoose** application. 

Since MongoDB is a schemaless database, Mongoose manages document validation at the application level. However, when you update schemas in your code (e.g., adding default values, renaming fields, or converting a field like `category: String` to an `ObjectId` relational reference), existing database documents are not automatically updated. 

This document details two migration patterns:
1. **Schema & Data Migration (Application Level):** Programmatically updating existing records using `migrate-mongo`.
2. **Infrastructure Migration (Hosting Level):** Exporting and importing physical datasets between local instances and MongoDB Atlas using database CLI tools (`mongodump` & `mongorestore`).

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Section 1: Schema & Data Migration (migrate-mongo)](#section-1-schema--data-migration-migrate-mongo)
   - [Step 1: Installation & CLI Setup](#step-1-installation--cli-setup)
   - [Step 2: Configuration & Environment Binding](#step-2-configuration--environment-binding)
   - [Step 3: Creating a Migration Script](#step-3-creating-a-migration-script)
   - [Step 4: Writing Migration Scripts (Standard Scenarios)](#step-4-writing-migration-scripts-standard-scenarios)
     - [Scenario A: Adding a New Field with a Default Value](#scenario-a-adding-a-new-field-with-a-default-value)
     - [Scenario B: Converting Field Types (String to ObjectId Relationship)](#scenario-b-converting-field-types-string-to-objectid-relationship)
     - [Scenario C: Renaming / Deleting Fields](#scenario-c-renaming--deleting-fields)
   - [Step 5: Executing & Rolling Back Migrations](#step-5-executing--rolling-back-migrations)
3. [Section 2: Database Instance Migration (Local DB to MongoDB Atlas)](#section-2-database-instance-migration-local-db-to-mongodb-atlas)
   - [Step 1: Local Backup (mongodump)](#step-1-local-backup-mongodump)
   - [Step 2: Security & Network Provisioning](#step-2-security--network-provisioning)
   - [Step 3: Database Import (mongorestore)](#step-3-database-import-mongorestore)
4. [Production & Deployment Best Practices](#production--deployment-best-practices)

---

## Prerequisites

Before continuing, make sure you have the following command-line tools installed:
- **Node.js** (v18.0.0 or higher)
- **MongoDB Database Tools** (Required for Scenario 2: includes `mongodump` and `mongorestore`). You can download them from the [MongoDB Download Center](https://www.mongodb.com/try/download/database-tools).

---

## Section 1: Schema & Data Migration (migrate-mongo)

`migrate-mongo` is a lightweight, database-agnostic migration framework specifically optimized for MongoDB in Node.js. It records which migrations have executed in a dedicated `changelog` collection in your database to ensure scripts are never run multiple times.

### Step 1: Installation & CLI Setup

To get started, install `migrate-mongo` as a development dependency in your project root:

```bash
npm install --save-dev migrate-mongo
```

Initialize the migration environment:

```bash
npx migrate-mongo init
```

This command automatically generates two items:
1. `migrate-mongo-config.js` (Configuration file in the root).
2. `migrations/` (A folder where all future migration files will be kept).

---

### Step 2: Configuration & Environment Binding

To prevent hardcoding sensitive credentials and to automatically pull connection details from your existing `.env.local` configuration, configure the `migrate-mongo-config.js` file:

1. Open `migrate-mongo-config.js`.
2. Configure it to load `.env.local` using `dotenv`.
3. Account for **Windows Operating System environment variables** (avoiding collisions with the OS-level `username` variable by matching your custom `MONGODB_USER` and `MONGODB_PASSWORD` variables).

Here is the exact boilerplate configuration to use:

```javascript
// migrate-mongo-config.js
require('dotenv').config({ path: '.env.local' });

const dbUser = process.env.MONGODB_USER;
const dbPass = process.env.MONGODB_PASSWORD;

// Clean connection URL targeting the correct cluster and DB name
const url = `mongodb+srv://${dbUser}:${dbPass}@firstcluster.tueqd3h.mongodb.net`;

const config = {
  mongodb: {
    url: url,
    databaseName: "dataDB",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // If your MongoDB version requires specialized SSL settings, add them here
    }
  },
  // The directory where migrations are saved
  migrationsDir: "migrations",
  // MongoDB collection name used to track applied migrations
  changelogCollectionName: "changelog",
  // The file extension to use for migration files
  migrationFileExtension: ".js",
  // Use file hashing to prevent manual mutation of applied migration scripts
  useFileHash: false,
  // Node.js module style used
  moduleSystem: 'commonjs',
};

module.exports = config;
```

---

### Step 3: Creating a Migration Script

To perform a database change, generate a new timestamped migration file. The name should describe the change:

```bash
npx migrate-mongo create <migration-name>
```

#### Example:
```bash
npx migrate-mongo create add-status-to-products
```
This generates a file inside `/migrations/` like:  
`migrations/20260528113045-add-status-to-products.js`.

---

### Step 4: Writing Migration Scripts (Standard Scenarios)

Every migration script consists of two async functions:
- `up()`: Code that executes to **apply** changes to the database.
- `down()`: Code that executes to **revert** those changes if something breaks.

Here are the templates for the three most common migration operations in your Next.js application:

#### Scenario A: Adding a New Field with a Default Value
*Use Case: You added a `status` or a `stock` field to the Product schema, and you want existing database documents to have `status: "active"` and `stock: 0`.*

```javascript
module.exports = {
  async up(db, client) {
    // Modify the "products" collection
    // Match documents where the field does not exist and set default values
    await db.collection('products').updateMany(
      { status: { $exists: false } },
      { 
        $set: { 
          status: "active",
          stock: 0 
        } 
      }
    );
  },

  async down(db, client) {
    // Revert the changes: remove these fields from all documents
    await db.collection('products').updateMany(
      { status: { $exists: true } },
      { 
        $unset: { 
          status: "",
          stock: "" 
        } 
      }
    );
  }
};
```

---

#### Scenario B: Converting Field Types (String to ObjectId Relationship)
*Use Case: Previously, your product documents had `category` stored as a plain `String` (e.g. `"Electronics"`). You decided to create a relational `categories` collection, and you want to convert the plain string to a reference pointer `categoryId` pointing to a Category document.*

```javascript
const { ObjectId } = require('mongodb');

module.exports = {
  async up(db, client) {
    // 1. Fetch all products
    const products = await db.collection('products').find({}).toArray();

    for (const product of products) {
      if (product.category && typeof product.category === 'string') {
        // 2. Check if a corresponding category exists in the "categories" collection
        let categoryDoc = await db.collection('categories').findOne({ name: product.category });

        // 3. If it doesn't exist, create it on-the-fly to maintain referential integrity
        if (!categoryDoc) {
          const insertResult = await db.collection('categories').insertOne({
            name: product.category,
            createdAt: new Date()
          });
          categoryDoc = { _id: insertResult.insertedId };
        }

        // 4. Update the product: add the relational 'categoryId' and remove the old string field
        await db.collection('products').updateOne(
          { _id: product._id },
          {
            $set: { categoryId: categoryDoc._id },
            $unset: { category: "" }
          }
        );
      }
    }
  },

  async down(db, client) {
    // Revert process: lookup the Category name and restore it as a string
    const products = await db.collection('products').find({ categoryId: { $exists: true } }).toArray();

    for (const product of products) {
      const categoryDoc = await db.collection('categories').findOne({ _id: product.categoryId });
      
      if (categoryDoc) {
        await db.collection('products').updateOne(
          { _id: product._id },
          {
            $set: { category: categoryDoc.name },
            $unset: { categoryId: "" }
          }
        );
      }
    }
  }
};
```

---

#### Scenario C: Renaming / Deleting Fields
*Use Case: Renaming a field from `company` to `manufacturer` across all existing product entries.*

```javascript
module.exports = {
  async up(db, client) {
    await db.collection('products').updateMany(
      {},
      { $rename: { "company": "manufacturer" } }
    );
  },

  async down(db, client) {
    await db.collection('products').updateMany(
      {},
      { $rename: { "manufacturer": "company" } }
    );
  }
};
```

---

### Step 5: Executing & Rolling Back Migrations

Once your migration script is ready, use the following commands to manage execution:

#### To view pending/completed migrations:
```bash
npx migrate-mongo status
```

#### To apply all pending migrations:
```bash
npx migrate-mongo up
```
*Console Output Example:*
```text
UP: 20260528113045-add-status-to-products.js
OK
```

#### To rollback the single most recent migration:
```bash
npx migrate-mongo down
```
*Console Output Example:*
```text
DOWN: 20260528113045-add-status-to-products.js
OK
```

---

## Section 2: Database Instance Migration (Local DB to MongoDB Atlas)

This section describes migrating database contents from a local offline environment to a hosted serverless environment like MongoDB Atlas.

```mermaid
graph TD
    A[Local MongoDB] -->|1. mongodump| B(Binary BSON/JSON Backup)
    B -->|2. mongorestore + Connection URI| C[MongoDB Atlas Cloud]
```

### Step 1: Local Backup (mongodump)

Ensure your local MongoDB instance is running, open a terminal window, and dump the collection contents into an offline directory:

```bash
mongodump --db=dataDB --out=./db-backup
```

This creates a `./db-backup/dataDB` folder containing:
- `<collection_name>.bson`: The raw binary data of your documents.
- `<collection_name>.metadata.json`: The index specifications and collection schemas.

---

### Step 2: Security & Network Provisioning

Before trying to restore onto MongoDB Atlas, complete the following network configuration:
1. **IP Whitelisting:** Navigate to **Network Access** in the MongoDB Atlas console and add your current public IP address (or select `0.0.0.0/0` to allow temporary access from all locations).
2. **Database User:** Under **Database Access**, create a user with `Read and Write to any database` permissions (or direct admin rights over the `dataDB` namespace).

---

### Step 3: Database Import (mongorestore)

Run the import script using your target connection string. Escape special characters in your password or wrap the URI in quotes to avoid shell errors:

```bash
mongorestore --uri="mongodb+srv://<username>:<password>@firstcluster.tueqd3h.mongodb.net/dataDB" ./db-backup/dataDB
```

#### Parameter Details:
*   `--uri`: The target remote cluster address.
*   `./db-backup/dataDB`: Path to the source dump files representing your database schema.

---

## Production & Deployment Best Practices

### 1. Database Backups before Migrations
Always perform a manual dump (`mongodump`) of your live database right before running `npx migrate-mongo up` in a production environment. If a custom data script fails halfway, you can restore your production state instantly:
```bash
mongodump --uri="mongodb+srv://..." --out=./prod-backup-before-migration
```

### 2. CI/CD Integration
Avoid running migrations manually on production servers. Integrate them into your build pipelines. Add a custom step in your `package.json`:
```json
"scripts": {
  "db:migrate": "migrate-mongo up"
}
```
Run `npm run db:migrate` in your continuous deployment pipeline immediately before running `next build`.

### 3. Serverless Environment Warning
Because Next.js route handlers are stateless serverless functions, Mongoose connections are transient. Using tools like `migrate-mongo` directly inside standard React API handlers is not recommended. Always perform migration runs externally (via CLI or build pipeline script) rather than inside request handler callbacks to prevent database connection limits and pool exhaustion.

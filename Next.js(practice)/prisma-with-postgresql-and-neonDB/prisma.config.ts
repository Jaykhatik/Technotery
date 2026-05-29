import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'prisma/config';

// Prisma CLI loads `.env` by default; Next.js commonly uses `.env.local`.
// Load both so `DATABASE_URL` is available for migrations.
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

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

// Railway automatically provides DATABASE_URL or POSTGRES_URL
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_PRIVATE_URL ||
  "";

export const isDbConfigured = Boolean(connectionString);

export const pool =
  globalForDb.conn ??
  (connectionString
    ? new Pool({
        connectionString,
        ssl:
          process.env.NODE_ENV === "production" && !connectionString.includes("localhost")
            ? { rejectUnauthorized: false }
            : false,
        max: 10,
        idleTimeoutMillis: 30000,
      })
    : null);

if (process.env.NODE_ENV !== "production" && pool) {
  globalForDb.conn = pool;
}

export const db = pool ? drizzle(pool, { schema }) : null;

export * from "./schema";


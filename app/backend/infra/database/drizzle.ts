import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { join } from "path";
import { products } from "./tables/productTables";
import { saleItems, sales } from "./tables/saleTables";
import { app } from "electron";
import { existsSync, mkdirSync } from "node:fs";

const schema = { products, sales, saleItems };

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export async function initializeDrizzle() {
  if (dbInstance) return;

  const dbPath = getDatabasePath();

  try {
    const sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");

    dbInstance = drizzle(sqlite, { schema });
    const migrationsPath = __dirname.includes("dist")
      ? join(__dirname, "migrations")
      : join(
          process.cwd(),
          "app",
          "backend",
          "infra",
          "database",
          "migrations",
        );
    migrate(dbInstance, { migrationsFolder: migrationsPath });
    console.log(`[Database] Drizzle ORM initialized at: ${dbPath}`);
  } catch (error) {
    console.error("[Database] Failed to initialize Drizzle:", error);
    throw error;
  }
}

export function getDb() {
  if (!dbInstance) {
    throw new Error("Drizzle not initialized. Call initializeDrizzle first.");
  }
  return dbInstance;
}

// Old database used by sql.js (Old library).
export function getLegacyDatabasePath(): string {
  return join(getDatabaseDirectory(), "app.db");
}

export function getDatabasePath(): string {
  return join(getDatabaseDirectory(), "app-drizzle.db");
}

function getDatabaseDirectory(): string {
  const dataDirectory = join(app.getPath("userData"), "data");

  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true });
  }

  return dataDirectory;
}

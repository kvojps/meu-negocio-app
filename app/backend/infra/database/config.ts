import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { join } from "path";
import { products } from "./tables/productTables";
import { saleItems, sales } from "./tables/saleTables";
import { app } from "electron";
import { existsSync, mkdirSync } from "node:fs";
import { logger } from "../logging/logger";

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
    logger.info("DATABASE", "Drizzle ORM initialized", { path: dbPath });
  } catch (error) {
    logger.error("DATABASE", "Failed to initialize Drizzle", {
      error: error instanceof Error ? error.message : String(error),
      path: dbPath,
    });
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

export function getDatabaseDirectory(): string {
  const dataDirectory = join(app.getPath("userData"), "data");

  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true });
  }

  return dataDirectory;
}

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { join } from "path";
import { getDrizzleDatabasePath } from "./paths";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export async function initializeDrizzle() {
  if (dbInstance) return;

  const dbPath = getDrizzleDatabasePath();

  try {
    const sqlite = new Database(dbPath);

    // Ativa PRAGMAs recomendados
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");

    dbInstance = drizzle(sqlite, { schema });

    // Determina o caminho das migrations baseado se estamos em dev ou prod (dist)
    const migrationsPath = __dirname.includes("dist")
      ? join(__dirname, "migrations")
      : join(process.cwd(), "app", "backend", "infra", "database", "migrations");

    // Aplica as migrações automaticamente ao iniciar
    migrate(dbInstance, { migrationsFolder: migrationsPath });

    console.log(`[Database] Drizzle ORM inicializado em: ${dbPath}`);
  } catch (error) {
    console.error("[Database] Falha ao inicializar o Drizzle:", error);
    throw error;
  }
}

export function getDb() {
  if (!dbInstance) {
    throw new Error("Drizzle not initialized. Call initializeDrizzle first.");
  }
  return dbInstance;
}

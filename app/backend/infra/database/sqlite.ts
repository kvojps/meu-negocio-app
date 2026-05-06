import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from "sql.js";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { getDatabasePath } from "./paths";
import { applyDatabaseMigrations, DATABASE_SCHEMA } from "./schema";

// TODO: This file should be removed when legacy repositories are removed.

let sqlJs: SqlJsStatic | null = null;
let database: SqlJsDatabase | null = null;

export async function initializeDatabase(): Promise<void> {
  if (database) {
    return;
  }

  sqlJs = await initSqlJs({
    locateFile: (file: string) => require.resolve(`sql.js/dist/${file}`),
  });

  const dbPath = getDatabasePath();

  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    database = new sqlJs.Database(fileBuffer);
  } else {
    database = new sqlJs.Database();
  }

  database.run("PRAGMA foreign_keys = ON;");
  database!.run(DATABASE_SCHEMA);
  applyDatabaseMigrations(database!);
  saveDatabase();
}

export function persistDatabase(): void {
  saveDatabase();
}

export function getDatabase(): SqlJsDatabase {
  if (!database) {
    throw new Error("Database not initialized");
  }

  return database;
}

function saveDatabase(): void {
  if (!database) {
    throw new Error("Database not initialized");
  }

  writeFileSync(getDatabasePath(), Buffer.from(database.export()));
}

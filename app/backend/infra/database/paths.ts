import { app } from "electron";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

// TODO: move file funcions to drizzle.ts (config.ts) and remove this file;

export function getDatabaseDirectory(): string {
  const dataDirectory = join(app.getPath("userData"), "data");

  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true });
  }

  return dataDirectory;
}

// TODO: Rename to getLegacyDatabasePath;
export function getDatabasePath(): string {
  return join(getDatabaseDirectory(), "app.db");
}

// TODO: Rename to getDatabasePath;
export function getDrizzleDatabasePath(): string {
  return join(getDatabaseDirectory(), "app-drizzle.db");
}

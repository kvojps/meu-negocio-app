import { app } from "electron";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

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

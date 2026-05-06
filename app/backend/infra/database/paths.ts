import { app } from "electron";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

export function getDatabaseDirectory(): string {
  const dataDirectory = join(app.getPath("userData"), "data");

  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true });
  }

  return dataDirectory;
}

export function getDatabasePath(): string {
  return join(getDatabaseDirectory(), "app.db");
}

export function getDrizzleDatabasePath(): string {
  return join(getDatabaseDirectory(), "app-drizzle.db");
}

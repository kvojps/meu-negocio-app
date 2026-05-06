import { app } from "electron";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

export function getDatabaseDirectory(): string {
  let userDataPath: string;
  try {
    // Fallback para o diretório atual se o Electron não estiver disponível (ex: CLI do Drizzle)
    userDataPath = app?.getPath ? app.getPath("userData") : ".";
  } catch (error) {
    userDataPath = ".";
  }

  const dataDirectory = join(userDataPath, "data");

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

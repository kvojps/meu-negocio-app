import { existsSync, renameSync } from "fs";
import { getDatabasePath } from "./paths";
import * as BackupSqliteRepository from "../../repository/legacy/backupRepository";
import * as DrizzleBackupRepository from "../../repository/drizzleBackupRepository";
import { initializeDatabase } from "./sqlite";
import logger from "../../infra/logging/logger";

// TODO: Move this function to config.ts and remove this file;
// TODO: Rename function to migrateLegacyDatabase;
// TODO: Logs and comments in english;

/**
 * Tenta extrair dados do banco antigo (app.db) se ele existir.
 * E importa para o novo sistema Drizzle (app-drizzle.db).
 */
export async function extractOldData() {
  const oldPath = getDatabasePath();

  if (!existsSync(oldPath)) {
    return;
  }

  try {
    logger.info("DATABASE", "Legacy database (app.db) detected. Analyzing data...");

    // Inicializa o sql.js para ler o arquivo antigo
    await initializeDatabase();

    // TODO: Move this legacy function to a private function and remove legacy repositories when possible.
    const data = BackupSqliteRepository.exportAllData();

    // Se não houver dados relevantes, não precisa migrar
    if (data.products.length === 0 && data.sales.length === 0) {
      logger.info("DATABASE", "Legacy database is empty. No migration needed.");
      return;
    }

    logger.info("DATABASE", `Starting migration of ${data.products.length} products and ${data.sales.length} sales...`);
    DrizzleBackupRepository.importAllData(data);

    // Renomeia o arquivo antigo para marcar como migrado e evitar duplicação
    const backupPath = `${oldPath}.bak`;
    renameSync(oldPath, backupPath);
    logger.info("DATABASE", "Migration success! Legacy database moved", { path: backupPath });
  } catch (error) {
    logger.warn("DATABASE", "Legacy file app.db might be in new format or unreadable by legacy engine", {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}


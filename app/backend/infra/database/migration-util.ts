import { existsSync, renameSync } from "fs";
import { getDatabasePath } from "./paths";
import * as BackupSqliteRepository from "../../repository/legacy/backupRepository";
import * as DrizzleBackupRepository from "../../repository/drizzleBackupRepository";
import { initializeDatabase } from "./sqlite";

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
    console.log(
      "[Migration] Detectado banco de dados legado (app.db). Analisando dados...",
    );

    // Inicializa o sql.js para ler o arquivo antigo
    await initializeDatabase();

    // TODO: Move this legacy function to a private function and remove legacy repositories when possible.
    const data = BackupSqliteRepository.exportAllData();

    // Se não houver dados relevantes, não precisa migrar
    if (data.products.length === 0 && data.sales.length === 0) {
      console.log(
        "[Migration] Banco legado está vazio. Nenhuma ação necessária.",
      );
      return;
    }

    console.log(
      `[Migration] Iniciando importação de ${data.products.length} produtos e ${data.sales.length} vendas...`,
    );
    DrizzleBackupRepository.importAllData(data);

    // Renomeia o arquivo antigo para marcar como migrado e evitar duplicação
    const backupPath = `${oldPath}.bak`;
    renameSync(oldPath, backupPath);
    console.log(`[Migration] Sucesso! Banco legado movido para: ${backupPath}`);
  } catch (e: unknown) {
    console.warn(
      "[Migration] O arquivo app.db já parece estar no novo formato ou não pôde ser lido pelo motor legado.",
      e,
    );
  }
}

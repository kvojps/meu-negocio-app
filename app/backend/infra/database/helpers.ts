import type { Database as SqlJsDatabase } from "sql.js";

// TODO: This helpers must be removed when legacy repositories are removed.

/**
 * Extrai o ID da última linha inserida.
 * Deve ser chamado imediatamente após um INSERT.
 */
export function getLastInsertedId(database: SqlJsDatabase): number {
  const result = database.exec("SELECT last_insert_rowid() AS id");
  return Number(result[0]?.values[0]?.[0] ?? 0);
}

/**
 * Obtém o número de linhas afetadas pela última operação (UPDATE/DELETE).
 * Deve ser chamado imediatamente após UPDATE ou DELETE.
 */
export function getChangedRowCount(database: SqlJsDatabase): number {
  const result = database.exec("SELECT changes() AS changes");
  return Number(result[0]?.values[0]?.[0] ?? 0);
}

/**
 * Valida que pelo menos uma linha foi afetada.
 * Lança erro com mensagem customizada se nenhuma linha foi alterada.
 */
export function ensureRowFound(rowCount: number, errorMessage: string): void {
  if (rowCount === 0) {
    throw new Error(errorMessage);
  }
}

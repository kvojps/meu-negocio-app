import { existsSync, renameSync } from "fs";
import Database from "better-sqlite3";
import { getLegacyDatabasePath } from "./config";
import * as DrizzleBackupRepository from "../../repository/drizzleBackupRepository";
import type { BackupData } from "../../../shared";
import { logger } from "../logging/logger";

export async function migrateLegacyDatabase() {
  const oldPath = getLegacyDatabasePath();
  if (!existsSync(oldPath)) {
    logger.info("DATABASE", "No legacy DB found. Skipping migration.");
    return;
  }

  try {
    logger.info("DATABASE", "Legacy DB found. Checking data...");
    const data = exportLegacyData(oldPath);
    if (data.products.length === 0 && data.sales.length === 0) {
      logger.info("DATABASE", "Legacy DB is empty. Skipping migration.");
      return;
    }
    logger.info(
      "DATABASE",
      `Importing ${data.products.length} products and ${data.sales.length} sales from legacy DB...`,
    );
    DrizzleBackupRepository.importAllData(data);
    const backupPath = `${oldPath}.bak`;
    renameSync(oldPath, backupPath);
    logger.info("DATABASE", "Migration done. Legacy DB moved", {
      path: backupPath,
    });
  } catch (e: unknown) {
    logger.warn("DATABASE", "Legacy DB could not be read or migrated", {
      error: e instanceof Error ? e.message : String(e),
    });
  }
}

function exportLegacyData(databasePath: string): BackupData {
  const db = new Database(databasePath, { readonly: true });

  try {
    const products = exportProducts(db);
    const sales = exportSales(db);
    const sale_items = exportSaleItems(db);

    return {
      version: 1,
      exported_at: new Date().toISOString(),
      products,
      sales,
      sale_items,
    };
  } finally {
    db.close();
  }
}

function exportProducts(db: Database.Database): BackupData["products"] {
  const columns = getColumns(db, "products");
  const hasCostPrice = columns.has("cost_price");
  const rows = db
    .prepare("SELECT * FROM products ORDER BY id ASC")
    .all() as Record<string, unknown>[];

  return rows.map((row: Record<string, unknown>) => ({
    id: Number(row.id),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    name: String(row.name),
    description: (row.description as string | null) ?? "",
    price: Number(row.price),
    cost_price: hasCostPrice ? Number(row.cost_price ?? 0) : 0,
  }));
}

function exportSales(db: Database.Database): BackupData["sales"] {
  const columns = getColumns(db, "sales");
  const hasCostTotal = columns.has("cost_total");
  const hasGrossProfit = columns.has("gross_profit");
  const rows = db
    .prepare("SELECT * FROM sales ORDER BY id ASC")
    .all() as Record<string, unknown>[];

  return rows.map((row: Record<string, unknown>) => ({
    id: Number(row.id),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    date: String(row.date),
    total_price: Number(row.total_price),
    cost_total: hasCostTotal ? Number(row.cost_total ?? 0) : 0,
    gross_profit: hasGrossProfit ? Number(row.gross_profit ?? 0) : 0,
  }));
}

function exportSaleItems(db: Database.Database): BackupData["sale_items"] {
  const columns = getColumns(db, "sale_items");
  const hasUnitCost = columns.has("unit_cost");
  const rows = db
    .prepare("SELECT * FROM sale_items ORDER BY id ASC")
    .all() as Record<string, unknown>[];

  return rows.map((row: Record<string, unknown>) => ({
    id: Number(row.id),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    sale_id: Number(row.sale_id),
    product_id: Number(row.product_id),
    quantity: Number(row.quantity),
    unit_price: Number(row.unit_price),
    unit_cost: hasUnitCost ? Number(row.unit_cost ?? 0) : 0,
  }));
}

function getColumns(db: Database.Database, tableName: string): Set<string> {
  const rows = db.prepare(`PRAGMA table_info(${tableName})`).all() as Record<
    string,
    unknown
  >[];

  return new Set(rows.map((row: Record<string, unknown>) => String(row.name)));
}

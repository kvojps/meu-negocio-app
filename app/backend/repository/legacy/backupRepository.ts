import type { BackupData } from "../../../shared";
import { getDatabase, persistDatabase } from "../../infra/database/sqlite";

// TODO: Remove this file and all legacy repositories when possible.

/** @deprecated Use drizzleBackupRepository instead */
export function exportAllData(dbOverride?: any): BackupData {
  const db = dbOverride || getDatabase();

  const productsResult = db.exec(
    `SELECT id, created_at, updated_at, name, description, price, cost_price FROM products ORDER BY id ASC`,
  );
  const salesResult = db.exec(
    `SELECT id, created_at, updated_at, date, total_price, cost_total, gross_profit FROM sales ORDER BY id ASC`,
  );
  const itemsResult = db.exec(
    `SELECT id, created_at, updated_at, sale_id, product_id, quantity, unit_price, unit_cost FROM sale_items ORDER BY id ASC`,
  );

  const products = (productsResult[0]?.values ?? []).map((row: any) => ({
    id: row[0] as number,
    created_at: row[1] as string,
    updated_at: row[2] as string,
    name: row[3] as string,
    description: (row[4] as string | null) ?? "",
    price: row[5] as number,
    cost_price: row[6] as number,
  }));

  const sales = (salesResult[0]?.values ?? []).map((row: any) => ({
    id: row[0] as number,
    created_at: row[1] as string,
    updated_at: row[2] as string,
    date: row[3] as string,
    total_price: row[4] as number,
    cost_total: row[5] as number,
    gross_profit: row[6] as number,
  }));

  const sale_items = (itemsResult[0]?.values ?? []).map((row: any) => ({
    id: row[0] as number,
    created_at: row[1] as string,
    updated_at: row[2] as string,
    sale_id: row[3] as number,
    product_id: row[4] as number,
    quantity: row[5] as number,
    unit_price: row[6] as number,
    unit_cost: row[7] as number,
  }));

  return {
    version: 1,
    exported_at: new Date().toISOString(),
    products,
    sales,
    sale_items,
  };
}

/** @deprecated Use drizzleBackupRepository instead */
export function importAllData(data: BackupData): void {
  const db = getDatabase();

  db.run("BEGIN TRANSACTION");

  try {
    // Limpa na ordem correta (FK: sale_items → sales → products)
    db.run("DELETE FROM sale_items");
    db.run("DELETE FROM sales");
    db.run("DELETE FROM products");

    // Reseta os auto-increment counters
    db.run(
      "DELETE FROM sqlite_sequence WHERE name IN ('products', 'sales', 'sale_items')",
    );

    // Reinsere produtos
    const productStmt = db.prepare(
      `INSERT INTO products (id, created_at, updated_at, name, description, price, cost_price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );
    try {
      for (const p of data.products) {
        productStmt.run([
          p.id,
          p.created_at,
          p.updated_at,
          p.name,
          p.description || null,
          p.price,
          p.cost_price,
        ]);
      }
    } finally {
      productStmt.free();
    }

    // Reinsere vendas
    const saleStmt = db.prepare(
      `INSERT INTO sales (id, created_at, updated_at, date, total_price, cost_total, gross_profit) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );
    try {
      for (const s of data.sales) {
        saleStmt.run([
          s.id,
          s.created_at,
          s.updated_at,
          s.date,
          s.total_price,
          s.cost_total,
          s.gross_profit,
        ]);
      }
    } finally {
      saleStmt.free();
    }

    // Reinsere itens de venda
    const itemStmt = db.prepare(
      `INSERT INTO sale_items (id, created_at, updated_at, sale_id, product_id, quantity, unit_price, unit_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    try {
      for (const item of data.sale_items) {
        itemStmt.run([
          item.id,
          item.created_at,
          item.updated_at,
          item.sale_id,
          item.product_id,
          item.quantity,
          item.unit_price,
          item.unit_cost,
        ]);
      }
    } finally {
      itemStmt.free();
    }

    db.run("COMMIT");
    persistDatabase();
  } catch (error) {
    db.run("ROLLBACK");
    throw error;
  }
}

import type {
  CreateSaleInput,
  Sale,
  SaleItem,
  SaleWithItems,
} from "../../../shared";
import { getDatabase, persistDatabase } from "../infra/database/sqlite";
import {
  getLastInsertedId,
  getChangedRowCount,
  ensureRowFound,
} from "../infra/database/helpers";
import {
  mapSaleRow,
  mapSaleItemRow,
  type SaleRow,
  type SaleItemRow,
} from "../infra/database/tables/saleTables";

// NOTE: Repository assumes input already validated

export function createSale(input: CreateSaleInput): Sale {
  const now = new Date().toISOString();
  const db = getDatabase();
  const costTotal = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_cost,
    0,
  );
  const grossProfit = input.total_price - costTotal;

  db.run("BEGIN TRANSACTION");

  try {
    const saleStmt = db.prepare(
      `INSERT INTO sales (created_at, updated_at, date, total_price, cost_total, gross_profit) VALUES (?, ?, ?, ?, ?, ?)`,
    );
    saleStmt.run([
      now,
      now,
      input.date,
      input.total_price,
      costTotal,
      grossProfit,
    ]);
    saleStmt.free();

    const saleId = getLastInsertedId(db);

    const itemStmt = db.prepare(
      `INSERT INTO sale_items (created_at, updated_at, sale_id, product_id, quantity, unit_price, unit_cost) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    );

    try {
      for (const item of input.items) {
        itemStmt.run([
          now,
          now,
          saleId,
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

    return {
      id: saleId,
      created_at: now,
      updated_at: now,
      date: input.date,
      total_price: input.total_price,
      cost_total: costTotal,
      gross_profit: grossProfit,
    };
  } catch (error) {
    db.run("ROLLBACK");
    throw error;
  }
}

export function listSales(): Sale[] {
  const db = getDatabase();
  const result = db.exec(
    `SELECT id, created_at, updated_at, date, total_price, cost_total, gross_profit FROM sales ORDER BY date DESC, id DESC`,
  );

  if (result.length === 0) {
    return [];
  }

  const table = result[0];
  return table.values.map((row: unknown[]) => mapSaleRow(row as SaleRow));
}

export function getSaleById(id: number): SaleWithItems {
  const db = getDatabase();
  const saleStmt = db.prepare(
    `SELECT id, created_at, updated_at, date, total_price, cost_total, gross_profit FROM sales WHERE id = ?`,
  );
  let sale: Sale;
  try {
    saleStmt.bind([id]);
    if (!saleStmt.step()) {
      throw new Error("Venda não encontrada.");
    }
    sale = mapSaleRow(saleStmt.get() as SaleRow);
  } finally {
    saleStmt.free();
  }

  const itemStmt = db.prepare(
    `SELECT id, created_at, updated_at, sale_id, product_id, quantity, unit_price, unit_cost FROM sale_items WHERE sale_id = ? ORDER BY id ASC`,
  );
  const items: SaleItem[] = [];
  try {
    itemStmt.bind([id]);
    while (itemStmt.step()) {
      items.push(mapSaleItemRow(itemStmt.get() as SaleItemRow));
    }
  } finally {
    itemStmt.free();
  }

  return {
    ...sale,
    items,
  };
}

export function deleteSale(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare(`DELETE FROM sales WHERE id = ?`);

  try {
    stmt.run([id]);
  } finally {
    stmt.free();
  }

  const changedRows = getChangedRowCount(db);
  ensureRowFound(changedRows, "Venda não encontrada.");

  persistDatabase();
}

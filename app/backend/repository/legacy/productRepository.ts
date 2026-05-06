import type { Product, ProductInput } from "../../../shared";
import { getDatabase, persistDatabase } from "../../infra/database/sqlite";
import {
  mapProductRow,
  type ProductRow,
} from "../../infra/database/tables/productTables";
import {
  getLastInsertedId,
  getChangedRowCount,
  ensureRowFound,
} from "../../infra/database/helpers";

// TODO: Remove this file and all legacy repositories when possible.
// NOTE: Repository assumes input already validated

/** @deprecated Use drizzleProductRepository instead */
export function createProduct(input: ProductInput): Product {
  const now = new Date().toISOString();
  const db = getDatabase();
  const stmt = db.prepare(
    `INSERT INTO products (created_at, updated_at, name, description, price, cost_price) VALUES (?, ?, ?, ?, ?, ?)`,
  );
  stmt.run([
    now,
    now,
    input.name,
    input.description ?? null,
    input.price,
    input.cost_price,
  ]);
  stmt.free();

  const id = getLastInsertedId(db);
  persistDatabase();

  return { id, created_at: now, updated_at: now, ...input };
}

/** @deprecated Use drizzleProductRepository instead */
export function listProducts(): Product[] {
  const db = getDatabase();
  const result = db.exec(
    `SELECT id, created_at, updated_at, name, description, price, cost_price FROM products ORDER BY id DESC`,
  );

  if (result.length === 0) {
    return [];
  }

  const table = result[0];
  return table.values.map((row: unknown[]) => mapProductRow(row as ProductRow));
}

/** @deprecated Use drizzleProductRepository instead */
export function productExists(id: number): boolean {
  const db = getDatabase();
  const stmt = db.prepare(`SELECT id FROM products WHERE id = ?`);
  try {
    stmt.bind([id]);
    return stmt.step();
  } finally {
    stmt.free();
  }
}

/** @deprecated Use drizzleProductRepository instead */
export function updateProduct(id: number, input: ProductInput): string {
  const now = new Date().toISOString();
  const db = getDatabase();
  const stmt = db.prepare(
    `UPDATE products SET updated_at = ?, name = ?, description = ?, price = ?, cost_price = ? WHERE id = ?`,
  );

  try {
    stmt.run([
      now,
      input.name,
      input.description ?? null,
      input.price,
      input.cost_price,
      id,
    ]);
  } finally {
    stmt.free();
  }

  const changedRows = getChangedRowCount(db);
  ensureRowFound(changedRows, "Produto não encontrado.");

  persistDatabase();
  return now;
}

/** @deprecated Use drizzleProductRepository instead */
export function deleteProduct(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare(`DELETE FROM products WHERE id = ?`);

  try {
    stmt.run([id]);
  } finally {
    stmt.free();
  }

  const changedRows = getChangedRowCount(db);
  ensureRowFound(changedRows, "Produto não encontrado.");

  persistDatabase();
}

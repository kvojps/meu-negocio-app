import type { Product, CreateProductInput } from "../../shared/product";
import { getDatabase, persistDatabase } from "../database/sqlite";

function mapProductRow(row: unknown[]): Product {
  return {
    id: Number(row[0]),
    created_at: String(row[1]),
    updated_at: String(row[2]),
    name: String(row[3]),
    description: row[4] === null ? undefined : String(row[4]),
    price: Number(row[5]),
    cost_price: Number(row[6]),
  };
}

export function createProduct(input: CreateProductInput): Product {
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

  const insertedRow = db.exec("SELECT last_insert_rowid() AS id");
  const id = Number(insertedRow[0]?.values[0]?.[0] ?? 0);
  persistDatabase();

  return { id, created_at: now, updated_at: now, ...input };
}

export function listProducts(): Product[] {
  const db = getDatabase();
  const result = db.exec(
    `SELECT id, created_at, updated_at, name, description, price, cost_price FROM products ORDER BY id DESC`,
  );

  if (result.length === 0) {
    return [];
  }

  const table = result[0];
  return table.values.map((row: unknown[]) => mapProductRow(row));
}

export function updateProduct(id: number, input: CreateProductInput): string {
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

  const changes = db.exec("SELECT changes() AS changes");
  const changedRows = Number(changes[0]?.values[0]?.[0] ?? 0);

  if (changedRows === 0) {
    throw new Error("Produto não encontrado.");
  }

  persistDatabase();
  return now;
}

export function deleteProduct(id: number): void {
  const db = getDatabase();
  const stmt = db.prepare(`DELETE FROM products WHERE id = ?`);

  try {
    stmt.run([id]);
  } finally {
    stmt.free();
  }

  const changes = db.exec("SELECT changes() AS changes");
  const changedRows = Number(changes[0]?.values[0]?.[0] ?? 0);

  if (changedRows === 0) {
    throw new Error("Produto não encontrado.");
  }

  persistDatabase();
}

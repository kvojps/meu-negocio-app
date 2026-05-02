import type { Product, CreateProductInput } from "../../shared/product";
import { getDatabase, persistDatabase } from "../database/sqlite";
import {
  getLastInsertedId,
  getChangedRowCount,
  ensureRowFound,
} from "../database/helpers";

// Mappers
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

// Validations
function assertValidProduct(input: CreateProductInput): void {
  if (typeof input.name !== "string" || input.name.trim().length === 0) {
    throw new Error("Nome do produto é obrigatório.");
  }

  if (!Number.isFinite(input.price) || input.price < 0) {
    throw new Error(
      "Preço do produto deve ser um número válido maior ou igual a zero.",
    );
  }

  if (!Number.isFinite(input.cost_price) || input.cost_price < 0) {
    throw new Error(
      "Custo do produto deve ser um número válido maior ou igual a zero.",
    );
  }

  if (
    input.description !== undefined &&
    typeof input.description !== "string"
  ) {
    throw new Error("Descrição do produto deve ser uma string.");
  }
}

// Repository functions
export function createProduct(input: CreateProductInput): Product {
  assertValidProduct(input);

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
  assertValidProduct(input);

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

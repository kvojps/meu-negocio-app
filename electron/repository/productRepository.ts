import type { Product } from '../../shared/product';
import { getDatabase, persistDatabase } from '../database/sqlite';

export function createProduct(p: Product): Product {
  const now = new Date().toISOString();
  const db = getDatabase();
  const stmt = db.prepare(`INSERT INTO products (created_at, updated_at, name, description, price) VALUES (?, ?, ?, ?, ?)`);
  stmt.run([now, now, p.name, p.description ?? null, p.price]);
  stmt.free();

  const insertedRow = db.exec('SELECT last_insert_rowid() AS id');
  const id = Number(insertedRow[0]?.values[0]?.[0] ?? 0);
  persistDatabase();

  return { id, created_at: now, updated_at: now, ...p };
}

export function listProducts(): Product[] {
  const db = getDatabase();
  const result = db.exec(`SELECT id, created_at, updated_at, name, description, price FROM products ORDER BY id DESC`);

  if (result.length === 0) {
    return [];
  }

  const table = result[0];
  return table.values.map((row: unknown[]) => ({
    id: Number(row[0]),
    created_at: String(row[1]),
    updated_at: String(row[2]),
    name: String(row[3]),
    description: row[4] === null ? undefined : String(row[4]),
    price: Number(row[5])
  }));
}

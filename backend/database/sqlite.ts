import { app } from 'electron';
import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const schema = `
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  cost_price REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  date TEXT NOT NULL,
  total_price REAL NOT NULL,
  cost_total REAL NOT NULL DEFAULT 0,
  gross_profit REAL NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sale_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  unit_cost REAL NOT NULL DEFAULT 0,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
`;

let sqlJs: SqlJsStatic | null = null;
let database: SqlJsDatabase | null = null;
let dbPath: string | null = null;

function getDataDirectory(): string {
  const dataDirectory = join(app.getPath('userData'), 'data');
  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory, { recursive: true });
  }

  return dataDirectory;
}

function saveDatabase(): void {
  if (!database || !dbPath) {
    throw new Error('Database not initialized');
  }

  writeFileSync(dbPath, Buffer.from(database.export()));
}

function ensureColumn(tableName: string, columnName: string, definition: string): void {
  if (!database) {
    throw new Error('Database not initialized');
  }

  const result = database.exec(`PRAGMA table_info(${tableName})`);
  const table = result[0];
  const hasColumn = table?.values.some((row: unknown[]) => String(row[1]) === columnName) ?? false;

  if (!hasColumn) {
    database.run(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

export async function initializeDatabase(): Promise<void> {
  if (database) {
    return;
  }

  sqlJs = await initSqlJs({
    locateFile: (file: string) => require.resolve(`sql.js/dist/${file}`)
  });

  dbPath = join(getDataDirectory(), 'app.db');

  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    database = new sqlJs.Database(fileBuffer);
  } else {
    database = new sqlJs.Database();
  }

  database.run('PRAGMA foreign_keys = ON;');
  database!.run(schema);
  ensureColumn('products', 'cost_price', 'REAL NOT NULL DEFAULT 0');
  ensureColumn('sales', 'cost_total', 'REAL NOT NULL DEFAULT 0');
  ensureColumn('sales', 'gross_profit', 'REAL NOT NULL DEFAULT 0');
  ensureColumn('sale_items', 'unit_cost', 'REAL NOT NULL DEFAULT 0');
  saveDatabase();
}

export function getDatabase(): SqlJsDatabase {
  if (!database) {
    throw new Error('Database not initialized');
  }

  return database;
}

export function persistDatabase(): void {
  saveDatabase();
}

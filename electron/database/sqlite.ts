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
  price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  date TEXT NOT NULL,
  total_price REAL NOT NULL
);

CREATE TABLE IF NOT EXISTS sale_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  sale_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
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

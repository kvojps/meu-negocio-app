import type { Database as SqlJsDatabase } from "sql.js";
export * from "./tables/productTables";
export * from "./tables/saleTables";

export const DATABASE_SCHEMA = `
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

type ColumnMigration = {
  tableName: string;
  columnName: string;
  definition: string;
};

const COLUMN_MIGRATIONS: ColumnMigration[] = [
  {
    tableName: "products",
    columnName: "cost_price",
    definition: "REAL NOT NULL DEFAULT 0",
  },
  {
    tableName: "sales",
    columnName: "cost_total",
    definition: "REAL NOT NULL DEFAULT 0",
  },
  {
    tableName: "sales",
    columnName: "gross_profit",
    definition: "REAL NOT NULL DEFAULT 0",
  },
  {
    tableName: "sale_items",
    columnName: "unit_cost",
    definition: "REAL NOT NULL DEFAULT 0",
  },
];

export function applyDatabaseMigrations(database: SqlJsDatabase): void {
  for (const migration of COLUMN_MIGRATIONS) {
    if (!hasColumn(database, migration.tableName, migration.columnName)) {
      database.run(
        `ALTER TABLE ${migration.tableName} ADD COLUMN ${migration.columnName} ${migration.definition}`,
      );
    }
  }
}

function hasColumn(
  database: SqlJsDatabase,
  tableName: string,
  columnName: string,
): boolean {
  const result = database.exec(`PRAGMA table_info(${tableName})`);
  const table = result[0];

  return (
    table?.values.some((row: unknown[]) => String(row[1]) === columnName) ??
    false
  );
}

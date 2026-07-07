import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'node:path';

let db: Database.Database | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  supplier TEXT NOT NULL DEFAULT '',
  cost_price REAL NOT NULL,
  sale_price REAL NOT NULL,
  stock INTEGER NOT NULL,
  min_stock INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  status TEXT NOT NULL,
  manual_total REAL,
  amount_paid REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  unit_cost REAL NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL DEFAULT '',
  cnpj TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT ''
);
`;

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database has not been initialized yet');
  }
  return db;
}

export function initDb(): Database.Database {
  const dbPath = path.join(app.getPath('userData'), 'meu-negocio.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(SCHEMA);
  migrate(db);
  return db;
}

function migrate(db: Database.Database): void {
  const hasUnitCost = db
    .prepare(
      "SELECT 1 FROM pragma_table_info('order_items') WHERE name = 'unit_cost'",
    )
    .get();
  if (!hasUnitCost) {
    db.exec(
      'ALTER TABLE order_items ADD COLUMN unit_cost REAL NOT NULL DEFAULT 0',
    );
  }

  const hasAmountPaid = db
    .prepare(
      "SELECT 1 FROM pragma_table_info('orders') WHERE name = 'amount_paid'",
    )
    .get();
  if (!hasAmountPaid) {
    db.exec(
      'ALTER TABLE orders ADD COLUMN amount_paid REAL NOT NULL DEFAULT 0',
    );
    backfillAmountPaidForCompletedOrders(db);
  }
}

function backfillAmountPaidForCompletedOrders(db: Database.Database): void {
  const completedOrders = db
    .prepare(
      `SELECT o.id AS id, o.manual_total AS manual_total,
         COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS items_total
       FROM orders o
       LEFT JOIN order_items oi ON oi.order_id = o.id
       WHERE o.status = 'completed'
       GROUP BY o.id`,
    )
    .all() as {
    id: string;
    manual_total: number | null;
    items_total: number;
  }[];

  const updateAmountPaid = db.prepare(
    'UPDATE orders SET amount_paid = @amountPaid WHERE id = @id',
  );
  const backfillTransaction = db.transaction(() => {
    for (const row of completedOrders) {
      const total = row.manual_total ?? row.items_total;
      updateAmountPaid.run({ id: row.id, amountPaid: total });
    }
  });
  backfillTransaction();
}

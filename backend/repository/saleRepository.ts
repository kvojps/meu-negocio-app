import type {
  CreateSaleInput,
  Sale,
  SaleItem,
  SaleWithItems,
} from "../../shared/sale";
import { getDatabase, persistDatabase } from "../database/sqlite";
import {
  getLastInsertedId,
  getChangedRowCount,
  ensureRowFound,
} from "../database/helpers";

// Mappers
type SaleRow = [number, string, string, string, number, number, number];
type SaleItemRow = [
  number,
  string,
  string,
  number,
  number,
  number,
  number,
  number,
];

function mapSaleRow(row: SaleRow): Sale {
  const [id, createdAt, updatedAt, date, totalPrice, costTotal, grossProfit] =
    row;

  return {
    id: Number(id),
    created_at: String(createdAt),
    updated_at: String(updatedAt),
    date: String(date),
    total_price: Number(totalPrice),
    cost_total: Number(costTotal),
    gross_profit: Number(grossProfit),
  };
}

function mapSaleItemRow(row: SaleItemRow): SaleItem {
  const [
    id,
    createdAt,
    updatedAt,
    saleId,
    productId,
    quantity,
    unitPrice,
    unitCost,
  ] = row;

  return {
    id: Number(id),
    created_at: String(createdAt),
    updated_at: String(updatedAt),
    sale_id: Number(saleId),
    product_id: Number(productId),
    quantity: Number(quantity),
    unit_price: Number(unitPrice),
    unit_cost: Number(unitCost),
  };
}

// Validations
function assertValidDate(date: string): void {
  if (Number.isNaN(Date.parse(date))) {
    throw new Error("Data da venda inválida.");
  }
}

function assertValidSale(total_price: number): void {
  if (!Number.isFinite(total_price) || total_price < 0) {
    throw new Error(
      "Valor total da venda deve ser um número válido maior ou igual a zero.",
    );
  }
}

function assertValidItems(items: CreateSaleInput["items"]): void {
  if (items.length === 0) {
    throw new Error("Adicione ao menos um item à venda.");
  }

  const db = getDatabase();

  for (const item of items) {
    if (!Number.isInteger(item.product_id) || item.product_id <= 0) {
      throw new Error("Produto inválido na venda.");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Quantidade inválida na venda.");
    }

    if (!Number.isFinite(item.unit_price) || item.unit_price < 0) {
      throw new Error("Preço unitário inválido na venda.");
    }

    if (!Number.isFinite(item.unit_cost) || item.unit_cost < 0) {
      throw new Error("Custo unitário inválido na venda.");
    }

    const productStmt = db.prepare(`SELECT id FROM products WHERE id = ?`);
    let productExists = false;
    try {
      productStmt.bind([item.product_id]);
      productExists = productStmt.step();
    } finally {
      productStmt.free();
    }
    if (!productExists) {
      throw new Error(`Produto ${item.product_id} não encontrado.`);
    }
  }
}

// Repository functions
export function createSale(input: CreateSaleInput): Sale {
  assertValidDate(input.date);
  assertValidSale(input.total_price);
  assertValidItems(input.items);

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

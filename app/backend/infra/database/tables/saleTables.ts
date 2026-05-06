import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { products } from "./productTables";
import type { Sale, SaleItem } from "../../../../shared";

export const sales = sqliteTable("sales", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  created_at: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
  date: text("date").notNull(),
  total_price: real("total_price").notNull(),
  cost_total: real("cost_total").notNull().default(0),
  gross_profit: real("gross_profit").notNull().default(0),
});

export const saleItems = sqliteTable("sale_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  created_at: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
  sale_id: integer("sale_id")
    .notNull()
    .references(() => sales.id, { onDelete: "cascade" }),
  product_id: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  unit_price: real("unit_price").notNull(),
  unit_cost: real("unit_cost").notNull().default(0),
});

// TODO: Remove instructions above and this type when legacy repositories are removed.
export type SaleRow = [number, string, string, string, number, number, number];
export type SaleItemRow = [
  number,
  string,
  string,
  number,
  number,
  number,
  number,
  number,
];

export function mapSaleRow(row: SaleRow): Sale {
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

export function mapSaleItemRow(row: SaleItemRow): SaleItem {
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

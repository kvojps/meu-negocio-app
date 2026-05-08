import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import { products } from "./productTables";

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

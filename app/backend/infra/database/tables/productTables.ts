import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  created_at: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updated_at: text("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date().toISOString()),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  cost_price: real("cost_price").notNull().default(0),
});

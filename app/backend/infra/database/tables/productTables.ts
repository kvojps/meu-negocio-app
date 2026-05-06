import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";
import type { Product } from "../../../../shared";

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

// TODO: Remove instructions above and this type when legacy repositories are removed.
export type ProductRow = [
  number,
  string,
  string,
  string,
  string | null,
  number,
  number,
];

export function mapProductRow(row: ProductRow): Product {
  const [id, createdAt, updatedAt, name, description, price, costPrice] = row;

  return {
    id: Number(id),
    created_at: String(createdAt),
    updated_at: String(updatedAt),
    name: String(name),
    description: description === null ? undefined : String(description),
    price: Number(price),
    cost_price: Number(costPrice),
  };
}

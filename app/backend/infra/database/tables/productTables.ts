import type { Product } from "../../../../../shared";

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

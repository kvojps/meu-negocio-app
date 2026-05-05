import type { Sale, SaleItem } from "../../../../shared";

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

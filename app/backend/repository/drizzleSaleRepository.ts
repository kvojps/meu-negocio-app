import { eq, desc, asc } from "drizzle-orm";
import { getDb } from "../infra/database/drizzle";
import { sales, saleItems } from "../infra/database/schema";
import type { CreateSaleInput, Sale, SaleWithItems } from "../../shared";

// NOTE: Repository assumes input already validated

export function createSale(input: CreateSaleInput): Sale {
  const db = getDb();

  const costTotal = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unit_cost,
    0,
  );
  const grossProfit = input.total_price - costTotal;

  return db.transaction((tx) => {
    const sale = tx
      .insert(sales)
      .values({
        date: input.date,
        total_price: input.total_price,
        cost_total: costTotal,
        gross_profit: grossProfit,
      })
      .returning()
      .get();

    if (!sale) {
      throw new Error("Falha ao criar venda.");
    }

    for (const item of input.items) {
      tx.insert(saleItems)
        .values({
          sale_id: sale.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          unit_cost: item.unit_cost,
        })
        .run();
    }

    return sale;
  });
}

export function listSales(): Sale[] {
  const db = getDb();
  return db
    .select()
    .from(sales)
    .orderBy(desc(sales.date), desc(sales.id))
    .all();
}

export function getSaleById(id: number): SaleWithItems {
  const db = getDb();
  const sale = db.select().from(sales).where(eq(sales.id, id)).get();

  if (!sale) {
    throw new Error("Venda não encontrada.");
  }

  const items = db
    .select()
    .from(saleItems)
    .where(eq(saleItems.sale_id, id))
    .orderBy(asc(saleItems.id))
    .all();

  return {
    ...sale,
    items,
  };
}

export function deleteSale(id: number): void {
  const db = getDb();
  const result = db.delete(sales).where(eq(sales.id, id)).returning().get();

  if (!result) {
    throw new Error("Venda não encontrada.");
  }
}

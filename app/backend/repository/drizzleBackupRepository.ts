import { asc, sql } from "drizzle-orm";
import { getDb } from "../infra/database/drizzle";
import { products, sales, saleItems } from "../infra/database/schema";
import type { BackupData, Product, Sale, SaleItem } from "../../shared";

// NOTE: Repository assumes input already validated

export function exportAllData(): BackupData {
  const db = getDb();

  const allProducts = db.select().from(products).orderBy(asc(products.id)).all();
  const allSales = db.select().from(sales).orderBy(asc(sales.id)).all();
  const allItems = db.select().from(saleItems).orderBy(asc(saleItems.id)).all();

  return {
    version: 1,
    exported_at: new Date().toISOString(),
    products: allProducts as Required<Product>[],
    sales: allSales as Required<Sale>[],
    sale_items: allItems as Required<SaleItem>[],
  };
}

export function importAllData(data: BackupData): void {
  const db = getDb();

  db.transaction((tx) => {
    // Limpa na ordem correta (FK: sale_items → sales → products)
    tx.delete(saleItems).run();
    tx.delete(sales).run();
    tx.delete(products).run();

    // Reseta os auto-increment counters (SQLite specific)
    tx.run(
      sql`DELETE FROM sqlite_sequence WHERE name IN ('products', 'sales', 'sale_items')`,
    );

    // Reinsere produtos
    if (data.products.length > 0) {
      for (const p of data.products) {
        tx.insert(products)
          .values({
            id: p.id,
            created_at: p.created_at,
            updated_at: p.updated_at,
            name: p.name,
            description: p.description || null,
            price: p.price,
            cost_price: p.cost_price,
          })
          .run();
      }
    }

    // Reinsere vendas
    if (data.sales.length > 0) {
      for (const s of data.sales) {
        tx.insert(sales)
          .values({
            id: s.id,
            created_at: s.created_at,
            updated_at: s.updated_at,
            date: s.date,
            total_price: s.total_price,
            cost_total: s.cost_total,
            gross_profit: s.gross_profit,
          })
          .run();
      }
    }

    // Reinsere itens de venda
    if (data.sale_items.length > 0) {
      for (const item of data.sale_items) {
        tx.insert(saleItems)
          .values({
            id: item.id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            sale_id: item.sale_id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            unit_cost: item.unit_cost,
          })
          .run();
      }
    }
  });
}

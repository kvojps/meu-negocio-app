import { eq, desc, sql } from "drizzle-orm";
import { getDb } from "../infra/database/config";
import { products } from "../infra/database/tables/productTables";
import type { Product, ProductInput, ProductStats } from "../../shared";

// NOTE: Repository assumes input already validated

export function createProduct(input: ProductInput): Product {
  const db = getDb();
  const result = db
    .insert(products)
    .values({
      name: input.name,
      description: input.description,
      price: input.price,
      cost_price: input.cost_price,
    })
    .returning()
    .get();

  if (!result) {
    throw new Error("Falha ao criar produto.");
  }

  return result;
}

export function listProducts(): Product[] {
  const db = getDb();
  const rows = db.select().from(products).orderBy(desc(products.id)).all();
  return rows;
}

export function getProductStats(): ProductStats {
  const db = getDb();
  const row = db
    .select({
      totalCost: sql<number>`COALESCE(SUM(${products.cost_price}), 0)`,
      totalValue: sql<number>`COALESCE(SUM(${products.price}), 0)`,
    })
    .from(products)
    .get();

  const totalCost = Number(row?.totalCost ?? 0);
  const totalValue = Number(row?.totalValue ?? 0);
  const profitMargin =
    totalValue > 0 ? ((totalValue - totalCost) / totalValue) * 100 : 0;

  return { totalCost, totalValue, profitMargin };
}

export function productExists(id: number): boolean {
  const db = getDb();
  const result = db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, id))
    .get();
  return !!result;
}

export function updateProduct(id: number, input: ProductInput): string {
  const db = getDb();
  const result = db
    .update(products)
    .set({
      name: input.name,
      description: input.description,
      price: input.price,
      cost_price: input.cost_price,
    })
    .where(eq(products.id, id))
    .returning({ updatedAt: products.updated_at })
    .get();

  if (!result) {
    throw new Error("Produto não encontrado.");
  }

  return result.updatedAt;
}

export function deleteProduct(id: number): void {
  const db = getDb();
  const result = db
    .delete(products)
    .where(eq(products.id, id))
    .returning()
    .get();

  if (!result) {
    throw new Error("Produto não encontrado.");
  }
}

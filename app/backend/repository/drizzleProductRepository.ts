import { eq, desc } from "drizzle-orm";
import { getDb } from "../infra/database/drizzle";
import { products } from "../infra/database/schema";
import type { Product, ProductInput } from "../../shared";

// NOTE: Repository assumes input already validated

/**
 * Mapeia o resultado do Drizzle (que usa null) para a interface Product (que usa undefined)
 */
function mapFromDb(row: typeof products.$inferSelect): Product {
  return {
    ...row,
    description: row.description ?? undefined,
  };
}

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

  return mapFromDb(result);
}

export function listProducts(): Product[] {
  const db = getDb();
  const rows = db.select().from(products).orderBy(desc(products.id)).all();
  return rows.map(mapFromDb);
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

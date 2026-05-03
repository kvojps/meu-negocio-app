import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome do produto é obrigatório").transform((s) => s.trim()),
  description: z.string().optional(),
  price: z.number().nonnegative("Preço deve ser >= 0"),
  cost_price: z.number().nonnegative("Custo deve ser >= 0"),
});

export const updateProductSchema = createProductSchema.extend({
  id: z.number().int().positive(),
});

export type ProductInput = z.infer<typeof createProductSchema>;

export default createProductSchema;

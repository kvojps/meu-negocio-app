import { z } from "zod";

export const createProductDto = z.object({
  name: z
    .string()
    .min(1, "Nome do produto é obrigatório")
    .transform((s) => s.trim()),
  description: z.string().optional(),
  price: z.number().nonnegative("Preço deve ser >= 0"),
  cost_price: z.number().nonnegative("Custo deve ser >= 0"),
});

export default createProductDto;

export type ProductInput = z.infer<typeof createProductDto>;

export const updateProductDto = createProductDto.extend({
  id: z.number().int().positive(),
});

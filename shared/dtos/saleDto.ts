import { z } from "zod";

export const saleItemSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unit_price: z.number().nonnegative(),
  unit_cost: z.number().nonnegative(),
});

export const createSaleSchema = z.object({
  date: z
    .string()
    .refine((d) => !Number.isNaN(Date.parse(d)), {
      message: "Data da venda inválida.",
    }),
  total_price: z.number().nonnegative(),
  items: z.array(saleItemSchema).min(1, "Adicione ao menos um item à venda."),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
export type SaleItemInput = z.infer<typeof saleItemSchema>;

export default createSaleSchema;

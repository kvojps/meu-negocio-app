import { z } from "zod";

export const saleItemDto = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  unit_price: z.number().nonnegative(),
  unit_cost: z.number().nonnegative(),
});

export const createSaleDto = z.object({
  date: z
    .string()
    .refine((d) => !Number.isNaN(Date.parse(d)), {
      message: "Data da venda inválida.",
    }),
  total_price: z.number().nonnegative(),
  items: z.array(saleItemDto).min(1, "Adicione ao menos um item à venda."),
});

export type CreateSaleInput = z.infer<typeof createSaleDto>;
export type SaleItemInput = z.infer<typeof saleItemDto>;

export default createSaleDto;

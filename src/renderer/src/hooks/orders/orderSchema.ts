import { z } from 'zod';

export const orderItemSchema = z.object({
  productId: z.string().min(1, 'Selecione um produto'),
  productName: z.string(),
  quantity: z
    .string()
    .trim()
    .min(1, 'Quantidade inválida')
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
      'Quantidade inválida',
    ),
  unitPrice: z
    .string()
    .trim()
    .min(1, 'Preço inválido')
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) >= 0,
      'Preço inválido',
    ),
  unitCost: z.string().trim(),
});

export const orderFormSchema = z
  .object({
    customer: z.string().trim().min(1, 'Nome do cliente é obrigatório'),
    items: z.array(orderItemSchema).min(1, 'Adicione pelo menos um item'),
    manualEnabled: z.boolean(),
    manualTotal: z.string().trim(),
  })
  .refine(
    (data) =>
      !data.manualEnabled ||
      (data.manualTotal !== '' &&
        !Number.isNaN(Number(data.manualTotal)) &&
        Number(data.manualTotal) >= 0),
    { message: 'Valor inválido', path: ['manualTotal'] },
  );

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export function emptyOrderItem() {
  return {
    productId: '',
    productName: '',
    quantity: '1',
    unitPrice: '',
    unitCost: '',
  };
}

export const emptyOrderFormValues: OrderFormValues = {
  customer: '',
  items: [emptyOrderItem()],
  manualEnabled: false,
  manualTotal: '',
};

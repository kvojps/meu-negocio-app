import { z } from 'zod';

export const orderStatusSchema = z.enum(['pending', 'in_progress', 'completed', 'cancelled']);

const orderItemSchema = z.object({
  id: z.string().min(1, 'Identificador do item é obrigatório'),
  productId: z.string().min(1, 'Produto do item é obrigatório'),
  productName: z.string().min(1, 'Nome do produto do item é obrigatório'),
  quantity: z
    .number()
    .int('Quantidade deve ser um número inteiro')
    .positive('Quantidade deve ser maior que zero'),
  unitPrice: z.number().nonnegative('Preço unitário não pode ser negativo'),
  unitCost: z.number().nonnegative('Custo unitário não pode ser negativo'),
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(1, 'Nome do cliente é obrigatório'),
  status: orderStatusSchema,
  items: z.array(orderItemSchema),
  manualTotal: z.number().nonnegative('Total manual não pode ser negativo').optional(),
  amountPaid: z.number().nonnegative('Valor pago não pode ser negativo'),
});

export const updateOrderSchema = createOrderSchema.omit({ status: true });

export const paymentAmountSchema = z.number().nonnegative('Valor pago não pode ser negativo');

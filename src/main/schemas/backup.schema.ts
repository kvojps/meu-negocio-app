import { z } from 'zod';
import { BACKUP_VERSION } from '../db/backupRepository';
import { orderStatusSchema } from './orders.schema';
import { companySettingsSchema } from './settings.schema';

const backupOrderItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number(),
  unitPrice: z.number(),
  unitCost: z.number().optional().default(0),
});

const backupOrderSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  status: orderStatusSchema,
  items: z.array(backupOrderItemSchema),
  manualTotal: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const backupProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  supplier: z.string(),
  costPrice: z.number(),
  salePrice: z.number(),
  stock: z.number(),
  minStock: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const backupSchema = z.object({
  version: z.literal(BACKUP_VERSION),
  exportedAt: z.string(),
  products: z.array(backupProductSchema),
  orders: z.array(backupOrderSchema),
  settings: companySettingsSchema,
});

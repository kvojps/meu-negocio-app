import type { Order, OrderItem, OrderStatus } from '@shared/types/order';
import type { Product } from '@shared/types/product';
import type Database from 'better-sqlite3';
import { randomUUID } from 'node:crypto';
import { adjustProductStock } from './productsRepository';

interface OrderRow {
  id: string;
  customer_name: string;
  status: OrderStatus;
  manual_total: number | null;
  amount_paid: number;
  created_at: string;
  updated_at: string;
}

interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
}

function rowToItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    unitCost: row.unit_cost,
  };
}

function buildOrder(row: OrderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    status: row.status,
    items,
    manualTotal: row.manual_total ?? undefined,
    amountPaid: row.amount_paid,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getItemsForOrder(db: Database.Database, orderId: string): OrderItem[] {
  const rows = db
    .prepare('SELECT * FROM order_items WHERE order_id = ?')
    .all(orderId) as OrderItemRow[];
  return rows.map(rowToItem);
}

export function getAllOrders(db: Database.Database): Order[] {
  const orderRows = db
    .prepare('SELECT * FROM orders ORDER BY created_at ASC')
    .all() as OrderRow[];
  const itemRows = db
    .prepare('SELECT * FROM order_items')
    .all() as OrderItemRow[];

  const itemsByOrder = new Map<string, OrderItem[]>();
  for (const row of itemRows) {
    const items = itemsByOrder.get(row.order_id) ?? [];
    items.push(rowToItem(row));
    itemsByOrder.set(row.order_id, items);
  }

  return orderRows.map((row) =>
    buildOrder(row, itemsByOrder.get(row.id) ?? []),
  );
}

function getOrderById(db: Database.Database, id: string): Order | undefined {
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as
    | OrderRow
    | undefined;
  if (!row) return undefined;
  return buildOrder(row, getItemsForOrder(db, id));
}

function insertItems(
  db: Database.Database,
  orderId: string,
  items: OrderItem[],
): void {
  const insertItem = db.prepare(
    `INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price, unit_cost)
     VALUES (@id, @orderId, @productId, @productName, @quantity, @unitPrice, @unitCost)`,
  );
  for (const item of items) {
    insertItem.run({
      id: item.id,
      orderId,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      unitCost: item.unitCost,
    });
  }
}

export function addOrder(
  db: Database.Database,
  data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>,
): Order {
  const now = new Date().toISOString();
  const order: Order = {
    ...data,
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
  };

  const insertTransaction = db.transaction(() => {
    db.prepare(
      `INSERT INTO orders (id, customer_name, status, manual_total, amount_paid, created_at, updated_at)
       VALUES (@id, @customerName, @status, @manualTotal, @amountPaid, @createdAt, @updatedAt)`,
    ).run({
      id: order.id,
      customerName: order.customerName,
      status: order.status,
      manualTotal: order.manualTotal ?? null,
      amountPaid: order.amountPaid,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    });
    insertItems(db, order.id, order.items);
  });
  insertTransaction();

  return order;
}

export function updateOrder(
  db: Database.Database,
  id: string,
  data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
): Order {
  const existing = getOrderById(db, id);
  if (!existing) {
    throw new Error(`Order not found: ${id}`);
  }

  const updatedAt = new Date().toISOString();

  const updateTransaction = db.transaction(() => {
    db.prepare(
      `UPDATE orders SET customer_name = @customerName, manual_total = @manualTotal, updated_at = @updatedAt WHERE id = @id`,
    ).run({
      id,
      customerName: data.customerName,
      manualTotal: data.manualTotal ?? null,
      updatedAt,
    });
    db.prepare('DELETE FROM order_items WHERE order_id = ?').run(id);
    insertItems(db, id, data.items);
  });
  updateTransaction();

  return { ...existing, ...data, updatedAt };
}

export function deleteOrder(db: Database.Database, id: string): void {
  db.prepare('DELETE FROM orders WHERE id = ?').run(id);
}

export interface SetOrderStatusResult {
  order: Order;
  updatedProducts: Product[];
}

export function setOrderStatus(
  db: Database.Database,
  id: string,
  newStatus: OrderStatus,
): SetOrderStatusResult {
  const existing = getOrderById(db, id);
  if (!existing) {
    throw new Error(`Order not found: ${id}`);
  }

  const updatedProducts: Product[] = [];

  const statusTransaction = db.transaction(() => {
    const wasCompleted = existing.status === 'completed';
    const isNowCompleted = newStatus === 'completed';

    if (wasCompleted && !isNowCompleted) {
      for (const item of existing.items) {
        const product = adjustProductStock(db, item.productId, item.quantity);
        if (product) updatedProducts.push(product);
      }
    } else if (!wasCompleted && isNowCompleted) {
      for (const item of existing.items) {
        const product = adjustProductStock(db, item.productId, -item.quantity);
        if (product) updatedProducts.push(product);
      }
    }

    const updatedAt = new Date().toISOString();
    db.prepare(
      'UPDATE orders SET status = @status, updated_at = @updatedAt WHERE id = @id',
    ).run({ id, status: newStatus, updatedAt });
  });
  statusTransaction();

  const order = getOrderById(db, id);
  if (!order) {
    throw new Error(`Order not found after update: ${id}`);
  }

  return { order, updatedProducts };
}

export function setOrderPaymentAmount(
  db: Database.Database,
  id: string,
  amountPaid: number,
): Order {
  const existing = getOrderById(db, id);
  if (!existing) {
    throw new Error(`Order not found: ${id}`);
  }

  const updatedAt = new Date().toISOString();
  db.prepare(
    'UPDATE orders SET amount_paid = @amountPaid, updated_at = @updatedAt WHERE id = @id',
  ).run({ id, amountPaid, updatedAt });

  const order = getOrderById(db, id);
  if (!order) {
    throw new Error(`Order not found after update: ${id}`);
  }

  return order;
}

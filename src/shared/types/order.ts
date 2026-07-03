export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
}

export interface Order {
  id: string;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  manualTotal?: number;
  createdAt: string;
  updatedAt: string;
}

export function getOrderTotal(order: Order): number {
  if (order.manualTotal !== undefined) return order.manualTotal;
  return order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
}

export function getOrderCost(order: Order): number {
  return order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0,
  );
}

export function getOrderProfit(order: Order): number {
  return getOrderTotal(order) - getOrderCost(order);
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

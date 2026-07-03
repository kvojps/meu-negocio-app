import type { Order, OrderStatus } from '@shared/types/order';
import { createContext, useContext, useMemo, useState } from 'react';
import { mockOrders } from '../mocks/orders';
import { useProductsContext } from './ProductsContext';

export interface OrdersContextValue {
  orders: Order[];
  addOrder: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrder: (
    id: string,
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
  ) => void;
  setOrderStatus: (id: string, newStatus: OrderStatus) => void;
  deleteOrder: (id: string) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { adjustStock } = useProductsContext();
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  function addOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const order: Order = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setOrders((prev) => [...prev, order]);
    return order;
  }

  function setOrderStatus(id: string, newStatus: OrderStatus) {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== id) return order;

        const wasCompleted = order.status === 'completed';
        const isNowCompleted = newStatus === 'completed';

        if (wasCompleted && !isNowCompleted) {
          order.items.forEach((item) =>
            adjustStock(item.productId, item.quantity),
          );
        } else if (!wasCompleted && isNowCompleted) {
          order.items.forEach((item) =>
            adjustStock(item.productId, -item.quantity),
          );
        }

        return {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }

  function updateOrder(
    id: string,
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
  ) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, ...data, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
  }

  function deleteOrder(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders,
      addOrder,
      updateOrder,
      setOrderStatus,
      deleteOrder,
    }),
    [orders],
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export function useOrdersContext(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error('useOrdersContext must be used within an OrdersProvider');
  }
  return ctx;
}

import type { Order, OrderStatus } from '@shared/types/order';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useProductsContext } from './ProductsContext';

export interface OrdersContextValue {
  orders: Order[];
  isLoading: boolean;
  addOrder: (
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<Order>;
  updateOrder: (
    id: string,
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
  ) => Promise<void>;
  setOrderStatus: (id: string, newStatus: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { refreshProducts } = useProductsContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.api.orders
      .getAll()
      .then(setOrders)
      .finally(() => setIsLoading(false));
  }, []);

  async function addOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const order = await window.api.orders.add(data);
    setOrders((prev) => [...prev, order]);
    return order;
  }

  async function setOrderStatus(id: string, newStatus: OrderStatus) {
    const { order, updatedProducts } = await window.api.orders.setStatus(
      id,
      newStatus,
    );
    setOrders((prev) => prev.map((o) => (o.id === id ? order : o)));
    if (updatedProducts.length > 0) {
      await refreshProducts();
    }
  }

  async function updateOrder(
    id: string,
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
  ) {
    const updated = await window.api.orders.update(id, data);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  }

  async function deleteOrder(id: string) {
    await window.api.orders.delete(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders,
      isLoading,
      addOrder,
      updateOrder,
      setOrderStatus,
      deleteOrder,
    }),
    [orders, isLoading],
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

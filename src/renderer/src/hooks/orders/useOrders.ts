import { useMemo, useState } from 'react';

import type { Order, OrderStatus } from '../../../../shared/types/order';
import { getOrderTotal } from '../../../../shared/types/order';
import { mockOrders } from '../../mocks/orders';

export type OrderSortKey = 'customerName' | 'status' | 'total' | 'createdAt';

export interface OrderFilterState {
  search: string;
  status: string;
}

export interface OrderSortState {
  key: OrderSortKey | null;
  direction: 'asc' | 'desc';
}

export function useOrders(
  adjustStock: (productId: string, delta: number) => void,
) {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filters, setFilters] = useState<OrderFilterState>({
    search: '',
    status: '',
  });
  const [sort, setSort] = useState<OrderSortState>({
    key: null,
    direction: 'asc',
  });

  const filtered = useMemo(() => {
    let result = [...orders];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((o) => o.customerName.toLowerCase().includes(q));
    }

    if (filters.status) {
      result = result.filter((o) => o.status === filters.status);
    }

    if (sort.key) {
      const key = sort.key;
      result.sort((a, b) => {
        let cmp = 0;

        if (key === 'total') {
          cmp = getOrderTotal(a) - getOrderTotal(b);
        } else if (key === 'createdAt') {
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        } else {
          const aVal = a[key] ?? '';
          const bVal = b[key] ?? '';
          cmp = String(aVal).localeCompare(String(bVal), 'pt-BR');
        }

        return sort.direction === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [orders, filters, sort]);

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

  function deleteOrder(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  function toggleSort(key: OrderSortKey) {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: 'asc' };
    });
  }

  return {
    orders,
    filtered,
    filters,
    sort,
    setFilters,
    toggleSort,
    addOrder,
    setOrderStatus,
    deleteOrder,
  };
}

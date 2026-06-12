import { useState } from 'react';

import type { OrderStatus } from '../../../shared/types/order';
import type { Order } from '../../../shared/types/order';

interface ConfirmTarget {
  type: 'advance' | 'cancel' | 'reopen' | 'delete';
  order: Order;
}

interface ConfirmProps {
  title: string;
  message: string;
  confirmLabel: string;
  danger: boolean;
}

export type UseOrderConfirmReturn = {
  confirmTarget: ConfirmTarget | null;
  setConfirmTarget: (target: ConfirmTarget | null) => void;
  buildProps: () => ConfirmProps;
  handleAction: () => void;
};

export function useOrderConfirm(
  setOrderStatus: (id: string, status: OrderStatus) => void,
  deleteOrder: (id: string) => void,
): UseOrderConfirmReturn {
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(
    null,
  );

  function buildProps(): ConfirmProps {
    const { type, order } = confirmTarget!;

    switch (type) {
      case 'advance': {
        const next = order.status === 'pending' ? 'Em andamento' : 'Concluído';
        return {
          title: `Avançar para "${next}"`,
          message: `Tem certeza que deseja avançar o pedido de ${order.customerName} para "${next}"?`,
          confirmLabel: `Avançar para "${next}"`,
          danger: false,
        };
      }
      case 'cancel':
        return {
          title: 'Cancelar Pedido',
          message: `Tem certeza que deseja cancelar o pedido de ${order.customerName}?`,
          confirmLabel: 'Confirmar Cancelamento',
          danger: false,
        };
      case 'reopen':
        return {
          title: 'Reabrir Pedido',
          message: `Tem certeza que deseja reabrir o pedido de ${order.customerName}? O estoque será devolvido.`,
          confirmLabel: 'Reabrir Pedido',
          danger: false,
        };
      case 'delete':
        return {
          title: 'Excluir Pedido',
          message: `Tem certeza que deseja excluir o pedido de ${order.customerName}? Esta ação não pode ser desfeita.`,
          confirmLabel: 'Confirmar Exclusão',
          danger: true,
        };
    }
  }

  function handleAction() {
    if (!confirmTarget) return;

    const { type, order } = confirmTarget;

    switch (type) {
      case 'advance':
        if (order.status === 'pending') setOrderStatus(order.id, 'in_progress');
        else if (order.status === 'in_progress')
          setOrderStatus(order.id, 'completed');
        break;
      case 'cancel':
        setOrderStatus(order.id, 'cancelled');
        break;
      case 'reopen':
        setOrderStatus(order.id, 'in_progress');
        break;
      case 'delete':
        deleteOrder(order.id);
        break;
    }

    setConfirmTarget(null);
  }

  return {
    confirmTarget,
    setConfirmTarget,
    buildProps,
    handleAction,
  };
}

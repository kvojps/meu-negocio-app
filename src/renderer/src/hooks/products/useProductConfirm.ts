import { useState } from 'react';
import type { Product } from '../../../../shared/types/product';

export function useProductConfirm(deleteProduct: (id: string) => void) {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  function buildProps() {
    return {
      title: 'Excluir Produto',
      message: `Tem certeza que deseja excluir ${deleteTarget?.name}? Esta ação não pode ser desfeita.`,
      confirmLabel: 'Confirmar Exclusão',
      danger: true as const,
    };
  }

  function handleAction() {
    if (deleteTarget) {
      deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  return { deleteTarget, setDeleteTarget, buildProps, handleAction };
}

import { useToast } from '@contexts/ToastContext';
import type { Product } from '@shared/types/product';
import { useState } from 'react';

export function useProductConfirm(
  deleteProduct: (id: string) => Promise<void>,
) {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const { showToast } = useToast();

  function buildProps() {
    return {
      title: 'Excluir Produto',
      message: `Tem certeza que deseja excluir ${deleteTarget?.name}? Esta ação não pode ser desfeita.`,
      confirmLabel: 'Confirmar Exclusão',
      danger: true as const,
    };
  }

  async function handleAction() {
    if (deleteTarget) {
      await deleteProduct(deleteTarget.id);
      showToast(`Produto "${deleteTarget.name}" excluído.`, 'info');
      setDeleteTarget(null);
    }
  }

  return { deleteTarget, setDeleteTarget, buildProps, handleAction };
}

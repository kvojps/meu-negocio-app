import { useToast } from '@contexts/ToastContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Order } from '@shared/types/order';
import type { Product } from '@shared/types/product';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  type OrderFormValues,
  emptyOrderFormValues,
  emptyOrderItem,
  orderFormSchema,
} from './orderSchema';

export function useOrderForm(
  products: Product[],
  addOrder: (
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<Order>,
  updateOrder?: (
    id: string,
    data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>,
  ) => Promise<void>,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Order | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: emptyOrderFormValues,
  });

  const itemsArray = useFieldArray({ control: form.control, name: 'items' });

  const items = form.watch('items');
  const manualEnabled = form.watch('manualEnabled');
  const manualTotal = form.watch('manualTotal');

  const calculatedTotal = items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );
  const displayTotal = manualEnabled
    ? Number(manualTotal) || 0
    : calculatedTotal;

  function open() {
    form.reset(emptyOrderFormValues);
    setEditTarget(null);
    setIsOpen(true);
  }

  function openForEdit(order: Order) {
    form.reset({
      customer: order.customerName,
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
      })),
      manualEnabled: order.manualTotal !== undefined,
      manualTotal:
        order.manualTotal !== undefined ? String(order.manualTotal) : '',
    });
    setEditTarget(order);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setEditTarget(null);
    form.reset(emptyOrderFormValues);
  }

  function selectProduct(index: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    form.setValue(`items.${index}.productId`, productId);
    form.setValue(`items.${index}.productName`, product ? product.name : '');
    form.setValue(
      `items.${index}.unitPrice`,
      product ? String(product.salePrice) : '',
    );
  }

  function addItem() {
    itemsArray.append(emptyOrderItem());
  }

  function removeItem(index: number) {
    itemsArray.remove(index);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      const data = {
        customerName: values.customer.trim(),
        items: values.items.map((item) => ({
          id: crypto.randomUUID(),
          productId: item.productId,
          productName: item.productName,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
        manualTotal: values.manualEnabled
          ? Number(values.manualTotal)
          : undefined,
      };

      if (editTarget && updateOrder) {
        await updateOrder(editTarget.id, data);
        showToast('Pedido atualizado com sucesso.');
      } else {
        await addOrder({ ...data, status: 'pending' });
        showToast('Pedido criado com sucesso.');
      }

      close();
    } finally {
      setIsSaving(false);
    }
  });

  return {
    isOpen,
    isEditing: !!editTarget,
    isSaving,
    form,
    fields: itemsArray.fields,
    displayTotal,
    open,
    openForEdit,
    close,
    onSubmit,
    selectProduct,
    addItem,
    removeItem,
  };
}

export type UseOrderFormReturn = ReturnType<typeof useOrderForm>;

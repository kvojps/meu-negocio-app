import { useState } from 'react';

import type { Order } from '../../../shared/types/order';
import type { Product } from '../../../shared/types/product';

interface FormItem {
  productId: string;
  productName: string;
  quantity: string;
  unitPrice: string;
}

function emptyFormItem(): FormItem {
  return { productId: '', productName: '', quantity: '1', unitPrice: '' };
}

export type UseOrderFormReturn = {
  isOpen: boolean;
  customer: string;
  items: FormItem[];
  manualEnabled: boolean;
  manualTotal: string;
  errors: Record<string, string>;
  displayTotal: number;
  open: () => void;
  close: () => void;
  save: () => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, field: keyof FormItem, value: string) => void;
  setCustomer: (value: string) => void;
  setManualEnabled: (value: boolean) => void;
  setManualTotal: (value: string) => void;
};

export function useOrderForm(
  products: Product[],
  addOrder: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void,
): UseOrderFormReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState<FormItem[]>([emptyFormItem()]);
  const [manualEnabled, setManualEnabled] = useState(false);
  const [manualTotal, setManualTotal] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculatedTotal = items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );

  const displayTotal = manualEnabled
    ? Number(manualTotal) || 0
    : calculatedTotal;

  function open() {
    setCustomer('');
    setItems([emptyFormItem()]);
    setManualEnabled(false);
    setManualTotal('');
    setErrors({});
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setErrors({});
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!customer.trim()) errs.customer = 'Nome do cliente é obrigatório';
    if (items.length === 0) errs.items = 'Adicione pelo menos um item';

    items.forEach((item, i) => {
      if (!item.productId) errs[`item_${i}_product`] = 'Selecione um produto';
      if (!item.quantity || Number(item.quantity) <= 0)
        errs[`item_${i}_qty`] = 'Quantidade inválida';
      if (!item.unitPrice || Number(item.unitPrice) < 0)
        errs[`item_${i}_price`] = 'Preço inválido';
    });

    if (manualEnabled && (!manualTotal || Number(manualTotal) < 0))
      errs.manualTotal = 'Valor inválido';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function save() {
    if (!validate()) return;

    addOrder({
      customerName: customer.trim(),
      status: 'pending',
      items: items.map((item) => ({
        id: crypto.randomUUID(),
        productId: item.productId,
        productName: item.productName,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
      })),
      manualTotal: manualEnabled ? Number(manualTotal) : undefined,
    });

    close();
  }

  function addItem() {
    setItems((prev) => [...prev, emptyFormItem()]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof FormItem, value: string) {
    setItems((prev) => {
      const next = [...prev];
      const item = { ...next[index] };

      if (field === 'productId') {
        const product = products.find((p) => p.id === value);
        item.productId = value;
        item.productName = product ? product.name : '';
        item.unitPrice = product ? String(product.salePrice) : '';
      } else if (field === 'quantity') {
        item.quantity = value;
      } else if (field === 'unitPrice') {
        item.unitPrice = value;
      }

      next[index] = item;
      return next;
    });
  }

  return {
    isOpen,
    customer,
    items,
    manualEnabled,
    manualTotal,
    errors,
    displayTotal,
    open,
    close,
    save,
    addItem,
    removeItem,
    updateItem,
    setCustomer,
    setManualEnabled,
    setManualTotal,
  };
}

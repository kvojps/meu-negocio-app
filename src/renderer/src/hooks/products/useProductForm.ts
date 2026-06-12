import { useState } from 'react';

import type { Product } from '../../../../shared/types/product';

export type FormData = {
  name: string;
  description: string;
  category: string;
  supplier: string;
  costPrice: string;
  salePrice: string;
  stock: string;
  minStock: string;
};

export type FormErrors = Partial<Record<keyof FormData, string>>;

const emptyForm: FormData = {
  name: '',
  description: '',
  category: '',
  supplier: '',
  costPrice: '',
  salePrice: '',
  stock: '',
  minStock: '',
};

export function useProductForm(
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void,
  updateProduct: (id: string, data: Partial<Product>) => void,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  function openNew() {
    setForm(emptyForm);
    setFormErrors({});
    setEditingId(null);
    setIsOpen(true);
  }

  function openEdit(product: Product) {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      supplier: product.supplier,
      costPrice: String(product.costPrice),
      salePrice: String(product.salePrice),
      stock: String(product.stock),
      minStock: String(product.minStock),
    });
    setFormErrors({});
    setEditingId(product.id);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setEditingId(null);
    setFormErrors({});
  }

  function validate(): boolean {
    const errors: FormErrors = {};
    if (!form.name.trim()) errors.name = 'Nome é obrigatório';
    if (!form.category.trim()) errors.category = 'Categoria é obrigatória';
    if (!form.costPrice.trim() || Number(form.costPrice) < 0)
      errors.costPrice = 'Preço de custo inválido';
    if (!form.salePrice.trim() || Number(form.salePrice) < 0)
      errors.salePrice = 'Preço de venda inválido';
    if (
      !form.stock.trim() ||
      Number(form.stock) < 0 ||
      !Number.isInteger(Number(form.stock))
    )
      errors.stock = 'Estoque inválido';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function save() {
    if (!validate()) return;

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      supplier: form.supplier.trim(),
      costPrice: Number(form.costPrice),
      salePrice: Number(form.salePrice),
      stock: Number(form.stock),
      minStock: form.minStock.trim() ? Number(form.minStock) : 0,
    };

    if (editingId) {
      updateProduct(editingId, data);
    } else {
      addProduct(data);
    }

    close();
  }

  return {
    isOpen,
    editingId,
    form,
    formErrors,
    openNew,
    openEdit,
    close,
    save,
    setForm,
  };
}

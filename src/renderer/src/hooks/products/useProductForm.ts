import { useToast } from '@contexts/ToastContext';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product } from '@shared/types/product';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type ProductFormValues,
  emptyProductFormValues,
  productFormSchema,
} from './productSchema';

export function useProductForm(
  addProduct: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void,
  updateProduct: (id: string, data: Partial<Product>) => void,
) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: emptyProductFormValues,
  });

  function openNew() {
    form.reset(emptyProductFormValues);
    setEditingId(null);
    setIsOpen(true);
  }

  function openEdit(product: Product) {
    form.reset({
      name: product.name,
      description: product.description,
      category: product.category,
      supplier: product.supplier,
      costPrice: String(product.costPrice),
      salePrice: String(product.salePrice),
      stock: String(product.stock),
      minStock: String(product.minStock),
    });
    setEditingId(product.id);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setEditingId(null);
    form.reset(emptyProductFormValues);
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      const data = {
        name: values.name.trim(),
        description: values.description.trim(),
        category: values.category.trim(),
        supplier: values.supplier.trim(),
        costPrice: Number(values.costPrice),
        salePrice: Number(values.salePrice),
        stock: Number(values.stock),
        minStock: values.minStock.trim() ? Number(values.minStock) : 0,
      };

      if (editingId) {
        updateProduct(editingId, data);
        showToast('Produto atualizado com sucesso.');
      } else {
        addProduct(data);
        showToast('Produto criado com sucesso.');
      }

      close();
    } finally {
      setIsSaving(false);
    }
  });

  return {
    isOpen,
    editingId,
    isSaving,
    form,
    openNew,
    openEdit,
    close,
    onSubmit,
  };
}

export type UseProductFormReturn = ReturnType<typeof useProductForm>;

import type { Product } from '@shared/types/product';
import { useMemo, useState } from 'react';

export type SortKey = 'name' | 'category' | 'supplier' | 'salePrice' | 'stock';

export interface FilterState {
  search: string;
  category: string;
  lowStockOnly: boolean;
}

export interface SortState {
  key: SortKey | null;
  direction: 'asc' | 'desc';
}

export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    lowStockOnly: false,
  });
  const [sort, setSort] = useState<SortState>({
    key: null,
    direction: 'asc',
  });

  const filtered = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.lowStockOnly) {
      result = result.filter((p) => p.stock <= p.minStock);
    }

    if (sort.key) {
      result.sort((a, b) => {
        const aVal = a[sort.key!];
        const bVal = b[sort.key!];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          const cmp = aVal.localeCompare(bVal, 'pt-BR');
          return sort.direction === 'asc' ? cmp : -cmp;
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        return 0;
      });
    }

    return result;
  }, [products, filters, sort]);

  function toggleSort(key: SortKey) {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: 'asc' };
    });
  }

  return { filtered, filters, sort, setFilters, toggleSort };
}

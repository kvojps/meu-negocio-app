import { useState } from 'react';
import { ITEMS_PER_PAGE } from '../utils/ui';

type UsePaginationResult<T> = {
  page: number;
  totalPages: number;
  paginatedItems: T[];
  goToFirst: () => void;
  goToPrev: () => void;
  goToNext: () => void;
};

export function usePagination<T>(
  items: T[],
  itemsPerPage: number = ITEMS_PER_PAGE
): UsePaginationResult<T> {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const clampedPage = Math.min(page, totalPages);
  const startIndex = (clampedPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  function goToFirst() {
    setPage(1);
  }

  function goToPrev() {
    setPage((prev) => Math.max(prev - 1, 1));
  }

  function goToNext() {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }

  return { page: clampedPage, totalPages, paginatedItems, goToFirst, goToPrev, goToNext };
}

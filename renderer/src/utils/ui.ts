export const ITEMS_PER_PAGE = 8;

export type ActiveSection = 'dashboard' | 'products' | 'sales';

export type DashboardPeriod = 'week' | 'month' | 'custom';

export type SaleFormItemState = {
  productId: string;
  quantity: string;
  unitPrice: string;
  unitCost: string;
};

export type DashboardBucket = {
  key: string;
  label: string;
  saleCount: number;
  revenue: number;
  cost: number;
  profit: number;
};

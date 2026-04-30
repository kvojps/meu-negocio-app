export interface Sale {
  id?: number;
  created_at?: string;
  updated_at?: string;
  date: string;
  total_price: number;
  cost_total?: number;
  gross_profit?: number;
}

export interface SaleItem {
  id?: number;
  created_at?: string;
  updated_at?: string;
  sale_id?: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  unit_cost: number;
}

export interface SaleWithItems extends Sale {
  items: SaleItem[];
}

export type CreateSaleItemInput = Omit<SaleItem, 'id' | 'created_at' | 'updated_at' | 'sale_id'>;

export type CreateSaleInput = Omit<Sale, 'id' | 'created_at' | 'updated_at'> & {
  items: CreateSaleItemInput[];
};
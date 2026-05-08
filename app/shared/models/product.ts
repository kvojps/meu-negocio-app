export interface Product {
  id?: number;
  created_at?: string;
  updated_at?: string;
  name: string;
  description?: string | null;
  price: number;
  cost_price: number;
}

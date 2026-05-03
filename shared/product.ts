export interface Product {
  id?: number;
  created_at?: string;
  updated_at?: string;
  name: string;
  description?: string;
  price: number;
  cost_price: number;
}

// Note: input types moved to DTOs in `shared/dtos/productDto.ts`

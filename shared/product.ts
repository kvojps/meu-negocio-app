export interface Product {
  id?: number;
  created_at?: string;
  updated_at?: string;
  name: string;
  description?: string;
  price: number;
  cost_price: number;
}

// Inputs
export type CreateProductInput = Omit<
  Product,
  "id" | "created_at" | "updated_at"
>;

export type UpdateProductInput = CreateProductInput & {
  id: number;
};

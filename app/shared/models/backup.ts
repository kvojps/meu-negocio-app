import type { Product } from "./product";
import type { Sale, SaleItem } from "./sale";

export interface BackupData {
  version: 1;
  exported_at: string;
  products: Required<Product>[];
  sales: Required<Sale>[];
  sale_items: Required<SaleItem>[];
}

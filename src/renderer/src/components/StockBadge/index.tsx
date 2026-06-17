import { ArrowDownIcon } from '../Icons';

interface StockBadgeProps {
  stock: number;
  minStock: number;
}

export function StockBadge({ stock, minStock }: StockBadgeProps) {
  if (stock > minStock) return null;

  return (
    <span className="stock-badge stock-badge--low">
      <ArrowDownIcon />
    </span>
  );
}

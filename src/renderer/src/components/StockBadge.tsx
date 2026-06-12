interface StockBadgeProps {
  stock: number;
  minStock: number;
}

export function StockBadge({ stock, minStock }: StockBadgeProps) {
  let className = 'stock-badge--ok';
  let label = 'OK';

  if (stock <= 0) {
    className = 'stock-badge--low';
    label = 'Sem estoque';
  } else if (stock <= minStock) {
    className = 'stock-badge--warn';
    label = 'Baixo';
  }

  return <span className={`stock-badge ${className}`}>{label}</span>;
}

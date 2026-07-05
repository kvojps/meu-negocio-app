import { ArrowDownward } from '@mui/icons-material';
import { Chip } from '@mui/material';

interface StockBadgeProps {
  stock: number;
  minStock: number;
}

export function StockBadge({ stock, minStock }: StockBadgeProps) {
  if (stock > minStock) return null;

  return (
    <Chip
      size="small"
      color="warning"
      icon={<ArrowDownward sx={{ fontSize: 14 }} />}
      label="Estoque baixo"
    />
  );
}

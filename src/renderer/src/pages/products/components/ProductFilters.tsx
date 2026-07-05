import { AlertTriangleIcon, SearchIcon } from '@components/Icons';
import type { FilterState } from '@hooks/products/useProducts';
import {
  Badge,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
} from '@mui/material';

interface ProductFiltersProps {
  filters: FilterState;
  categories: string[];
  lowStockCount: number;
  onChange: (filters: FilterState) => void;
}

export function ProductFilters({
  filters,
  categories,
  lowStockCount,
  onChange,
}: ProductFiltersProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
    >
      <TextField
        size="small"
        placeholder="Buscar por nome..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        sx={{ minWidth: 220 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size={16} />
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        select
        size="small"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">Todas as categorias</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>
      {lowStockCount > 0 && (
        <ToggleButton
          value="lowStockOnly"
          selected={filters.lowStockOnly}
          onChange={() =>
            onChange({ ...filters, lowStockOnly: !filters.lowStockOnly })
          }
          size="small"
          color="warning"
        >
          <AlertTriangleIcon size={16} />
          <Stack component="span" sx={{ ml: 1, mr: 1.5 }}>
            Estoque baixo
          </Stack>
          <Badge badgeContent={lowStockCount} color="warning" />
        </ToggleButton>
      )}
    </Stack>
  );
}

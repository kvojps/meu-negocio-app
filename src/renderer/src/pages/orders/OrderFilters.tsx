import type { OrderStatus } from '../../../../shared/types/order';
import { ORDER_STATUS_LABELS } from '../../../../shared/types/order';
import type { OrderFilterState } from '../../hooks/useOrders';

const statusOptions: OrderStatus[] = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
];

interface OrderFiltersProps {
  filters: OrderFilterState;
  onChange: (filters: OrderFilterState) => void;
}

export function OrderFilters({ filters, onChange }: OrderFiltersProps) {
  return (
    <div className="orders-filters">
      <input
        className="orders-filters-search"
        placeholder="Buscar cliente..."
        type="text"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      <select
        className="orders-filters-select"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="">Todos os status</option>
        {statusOptions.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}

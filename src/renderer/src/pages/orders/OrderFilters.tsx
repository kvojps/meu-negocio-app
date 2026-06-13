import type { OrderStatus } from '../../../../shared/types/order';
import { ORDER_STATUS_LABELS } from '../../../../shared/types/order';
import type { OrderFilterState } from '../../hooks/orders/useOrders';

const ALL_STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
];

interface OrderFiltersProps {
  filters: OrderFilterState;
  onChange: (filters: OrderFilterState) => void;
  hideStatuses?: OrderStatus[];
  hideStatusFilter?: boolean;
}

export function OrderFilters({
  filters,
  onChange,
  hideStatuses,
  hideStatusFilter,
}: OrderFiltersProps) {
  const statusOptions = hideStatuses
    ? ALL_STATUS_OPTIONS.filter((s) => !hideStatuses.includes(s))
    : ALL_STATUS_OPTIONS;

  return (
    <div className="orders-filters">
      <input
        className="orders-filters-search"
        placeholder="Buscar cliente..."
        type="text"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      {!hideStatusFilter && (
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
      )}
    </div>
  );
}

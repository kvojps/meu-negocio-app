import { SearchIcon } from '@components/Icons';
import type { OrderFilterState } from '@hooks/orders/useOrders';
import type { OrderStatus, PaymentStatus } from '@shared/types/order';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@shared/types/order';
import { ptBR } from 'date-fns/locale/pt-BR';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt-BR', ptBR);

const ALL_STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
];

const ALL_PAYMENT_STATUS_OPTIONS: PaymentStatus[] = [
  'paid',
  'partial',
  'unpaid',
];

function toDate(iso: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

function toISO(date: Date | null): string {
  if (!date) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function DatePickerInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <DatePicker
      locale="pt-BR"
      dateFormat="dd/MM/yyyy"
      placeholderText="dd/mm/aaaa"
      selected={toDate(value)}
      onChange={(date: Date | null) => onChange(toISO(date))}
      className="orders-filters-date"
      wrapperClassName="orders-filters-date-wrap"
    />
  );
}

interface OrderFiltersProps {
  filters: OrderFilterState;
  onChange: (filters: OrderFilterState) => void;
  hideStatuses?: OrderStatus[];
  hideStatusFilter?: boolean;
  hideSearch?: boolean;
  showDateFilter?: boolean;
  showPaymentFilter?: boolean;
}

export function OrderFilters({
  filters,
  onChange,
  hideStatuses,
  hideStatusFilter,
  hideSearch,
  showDateFilter,
  showPaymentFilter,
}: OrderFiltersProps) {
  const statusOptions = hideStatuses
    ? ALL_STATUS_OPTIONS.filter((s) => !hideStatuses.includes(s))
    : ALL_STATUS_OPTIONS;

  return (
    <div className="orders-filters">
      {!hideSearch && (
        <div className="search-input-wrap">
          <span className="search-input-icon">
            <SearchIcon size={16} />
          </span>
          <input
            className="orders-filters-search"
            placeholder="Buscar cliente..."
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
          />
        </div>
      )}
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
      {showPaymentFilter && (
        <select
          className="orders-filters-select"
          value={filters.paymentStatus}
          onChange={(e) =>
            onChange({ ...filters, paymentStatus: e.target.value })
          }
        >
          <option value="">Todos os pagamentos</option>
          {ALL_PAYMENT_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {PAYMENT_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      )}
      {showDateFilter && (
        <>
          <DatePickerInput
            value={filters.dateFrom}
            onChange={(v) => onChange({ ...filters, dateFrom: v })}
          />
          <span className="orders-filters-date-separator">—</span>
          <DatePickerInput
            value={filters.dateTo}
            onChange={(v) => onChange({ ...filters, dateTo: v })}
          />
        </>
      )}
    </div>
  );
}

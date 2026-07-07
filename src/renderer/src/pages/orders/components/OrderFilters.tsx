import { InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { ptBR } from 'date-fns/locale/pt-BR';
import { forwardRef } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import type { OrderStatus, PaymentStatus } from '@shared/types/order';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@shared/types/order';
import { SearchIcon } from '@components/Icons';
import type { OrderFilterState } from '@hooks/orders/useOrders';
import 'react-datepicker/dist/react-datepicker.css';

registerLocale('pt-BR', ptBR);

const ALL_STATUS_OPTIONS: OrderStatus[] = ['pending', 'in_progress', 'completed', 'cancelled'];

const ALL_PAYMENT_STATUS_OPTIONS: PaymentStatus[] = ['paid', 'partial', 'unpaid'];

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

interface DatePickerFieldProps {
  value?: string;
  placeholder?: string;
  onClick?: () => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const DatePickerField = forwardRef<HTMLInputElement, DatePickerFieldProps>(
  ({ value, placeholder, onClick, onChange }, ref) => (
    <TextField
      value={value}
      placeholder={placeholder}
      onClick={onClick}
      onChange={onChange}
      inputRef={ref}
      size="small"
      sx={{ width: 150 }}
    />
  ),
);
DatePickerField.displayName = 'DatePickerField';

function DatePickerInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <DatePicker
      locale="pt-BR"
      dateFormat="dd/MM/yyyy"
      placeholderText="dd/mm/aaaa"
      selected={toDate(value)}
      onChange={(date: Date | null) => onChange(toISO(date))}
      customInput={<DatePickerField />}
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
    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
      {!hideSearch && (
        <TextField
          size="small"
          placeholder="Buscar cliente..."
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
      )}
      {!hideStatusFilter && (
        <TextField
          select
          size="small"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Todos os status</MenuItem>
          {statusOptions.map((s) => (
            <MenuItem key={s} value={s}>
              {ORDER_STATUS_LABELS[s]}
            </MenuItem>
          ))}
        </TextField>
      )}
      {showPaymentFilter && (
        <TextField
          select
          size="small"
          value={filters.paymentStatus}
          onChange={(e) => onChange({ ...filters, paymentStatus: e.target.value })}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Todos os pagamentos</MenuItem>
          {ALL_PAYMENT_STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>
              {PAYMENT_STATUS_LABELS[s]}
            </MenuItem>
          ))}
        </TextField>
      )}
      {showDateFilter && (
        <Stack direction="row" spacing={1} alignItems="center">
          <DatePickerInput
            value={filters.dateFrom}
            onChange={(v) => onChange({ ...filters, dateFrom: v })}
          />
          <Typography color="text.secondary">—</Typography>
          <DatePickerInput
            value={filters.dateTo}
            onChange={(v) => onChange({ ...filters, dateTo: v })}
          />
        </Stack>
      )}
    </Stack>
  );
}

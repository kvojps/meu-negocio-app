import { Close } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import type { Product } from '@shared/types/product';
import { Modal } from '@components/Modal';
import type { UseOrderFormReturn } from '@hooks/orders/useOrderForm';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

interface OrderFormModalProps {
  formState: UseOrderFormReturn;
  products: Product[];
}

export function OrderFormModal({ formState, products }: OrderFormModalProps) {
  const {
    isOpen,
    isEditing,
    isSaving,
    form,
    fields,
    displayTotal,
    close,
    onSubmit,
    selectProduct,
    addItem,
    removeItem,
  } = formState;
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const items = watch('items');
  const manualEnabled = watch('manualEnabled');

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={isEditing ? 'Editar Pedido' : 'Novo Pedido'}
      maxWidth="600px"
      footer={
        <>
          <Button onClick={close} disabled={isSaving} color="inherit">
            Cancelar
          </Button>
          <Button onClick={() => onSubmit()} disabled={isSaving} variant="contained">
            {isSaving ? 'Salvando…' : isEditing ? 'Salvar Alterações' : 'Criar Pedido'}
          </Button>
        </>
      }
    >
      <Stack spacing={3}>
        <TextField
          label="Cliente"
          required
          error={!!errors.customer}
          helperText={errors.customer?.message}
          placeholder="Nome do cliente"
          fullWidth
          {...register('customer')}
        />

        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1">Itens</Typography>
            <Button size="small" onClick={addItem}>
              + Adicionar Item
            </Button>
          </Stack>

          {fields.map((field, index) => {
            const item = items[index];
            const itemErrors = errors.items?.[index];
            return (
              <Stack direction="row" spacing={1} alignItems="flex-start" key={field.id}>
                <TextField
                  select
                  error={!!itemErrors?.productId}
                  value={item?.productId ?? ''}
                  onChange={(e) => selectProduct(index, e.target.value)}
                  sx={{ flex: 2 }}
                >
                  <MenuItem value="">Selecionar produto...</MenuItem>
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name} — {formatCurrency(p.salePrice)}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  error={!!itemErrors?.quantity}
                  type="number"
                  slotProps={{ htmlInput: { min: '1', step: '1' } }}
                  sx={{ flex: 1 }}
                  {...register(`items.${index}.quantity`)}
                />
                <TextField
                  error={!!itemErrors?.unitPrice}
                  type="number"
                  slotProps={{ htmlInput: { min: '0', step: '0.01' } }}
                  sx={{ flex: 1 }}
                  {...register(`items.${index}.unitPrice`)}
                />
                <Typography variant="body2" sx={{ pt: 1.5, minWidth: 88, textAlign: 'right' }}>
                  {formatCurrency((Number(item?.quantity) || 0) * (Number(item?.unitPrice) || 0))}
                </Typography>
                <IconButton
                  onClick={() => removeItem(index)}
                  disabled={fields.length <= 1}
                  size="small"
                  sx={{ mt: 0.5 }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Stack>
            );
          })}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <FormControlLabel
            control={<Checkbox checked={!!manualEnabled} {...register('manualEnabled')} />}
            label="Valor personalizado"
          />

          {manualEnabled && (
            <TextField
              error={!!errors.manualTotal}
              type="number"
              slotProps={{ htmlInput: { min: '0', step: '0.01' } }}
              sx={{ maxWidth: 160 }}
              {...register('manualTotal')}
            />
          )}

          <Typography sx={{ ml: 'auto' }} variant="subtitle1">
            Total: {formatCurrency(displayTotal)}
          </Typography>
        </Stack>
      </Stack>
    </Modal>
  );
}

import { FormField } from '@components/FormField';
import { Input } from '@components/FormField/Input';
import { Modal } from '@components/Modal';
import { useToast } from '@contexts/ToastContext';
import type { Order } from '@shared/types/order';
import {
  PAYMENT_STATUS_LABELS,
  getOrderPaymentStatus,
  getOrderTotal,
} from '@shared/types/order';
import { useEffect, useState } from 'react';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

interface PaymentModalProps {
  order: Order | null;
  onClose: () => void;
  onSave: (id: string, amountPaid: number) => Promise<void>;
}

export function PaymentModal({ order, onClose, onSave }: PaymentModalProps) {
  const [amount, setAmount] = useState('0');
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (order) setAmount(String(order.amountPaid));
  }, [order]);

  if (!order) return null;

  const total = getOrderTotal(order);
  const parsedAmount = Math.min(Math.max(Number(amount) || 0, 0), total);
  const balanceDue = Math.max(total - parsedAmount, 0);

  async function handleSave() {
    if (!order) return;
    setIsSaving(true);
    try {
      await onSave(order.id, parsedAmount);
      showToast('Pagamento atualizado.');
      onClose();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Registrar Pagamento"
      maxWidth="420px"
      footer={
        <>
          <button
            className="modal-btn modal-btn--cancel"
            onClick={onClose}
            type="button"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            className="modal-btn modal-btn--confirm"
            onClick={handleSave}
            type="button"
            disabled={isSaving}
          >
            Salvar
          </button>
        </>
      }
    >
      <div className="orders-details-info">
        <span>
          <strong>Cliente:</strong> {order.customerName}
        </span>
        <span>
          <strong>Total:</strong> {formatCurrency(total)}
        </span>
        <span>
          <strong>Status:</strong>{' '}
          <span
            className={`status-badge status-badge--${getOrderPaymentStatus(order)}`}
          >
            {PAYMENT_STATUS_LABELS[getOrderPaymentStatus(order)]}
          </span>
        </span>
      </div>

      <FormField label="Valor pago">
        <Input
          type="number"
          min={0}
          max={total}
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </FormField>

      <div className="orders-details-total">
        Saldo restante: {formatCurrency(balanceDue)}
      </div>

      <div className="payment-modal-shortcuts">
        <button
          className="modal-btn modal-btn--cancel"
          onClick={() => setAmount(String(total))}
          type="button"
        >
          Marcar como pago total
        </button>
        <button
          className="modal-btn modal-btn--cancel"
          onClick={() => setAmount('0')}
          type="button"
        >
          Marcar como não pago
        </button>
      </div>
    </Modal>
  );
}

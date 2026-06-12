import { Modal } from '../../components/Modal';
import type { Order } from '../../../../shared/types/order';
import {
  ORDER_STATUS_LABELS,
  getOrderTotal,
} from '../../../../shared/types/order';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr));

interface OrderViewModalProps {
  viewTarget: Order | null;
  onClose: () => void;
}

export function OrderViewModal({ viewTarget, onClose }: OrderViewModalProps) {
  return (
    <Modal
      open={!!viewTarget}
      onClose={onClose}
      title="Detalhes do Pedido"
      maxWidth="600px"
      footer={
        <button
          className="modal-btn modal-btn--cancel"
          onClick={onClose}
          type="button"
        >
          Fechar
        </button>
      }
    >
      {viewTarget && (
        <>
          <div className="orders-details-info">
            <span>
              <strong>Cliente:</strong> {viewTarget.customerName}
            </span>
            <span>
              <strong>Status:</strong>{' '}
              <span
                className={`status-badge status-badge--${viewTarget.status}`}
              >
                {ORDER_STATUS_LABELS[viewTarget.status]}
              </span>
            </span>
            <span>
              <strong>Data:</strong> {formatDate(viewTarget.createdAt)}
            </span>
          </div>

          <table className="orders-details-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Preço Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {viewTarget.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{formatCurrency(item.quantity * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="orders-details-total">
            {viewTarget.manualTotal !== undefined && (
              <span
                style={{
                  color: '#9ca3af',
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  marginRight: 8,
                }}
              >
                (valor personalizado)
              </span>
            )}
            Total: {formatCurrency(getOrderTotal(viewTarget))}
          </div>
        </>
      )}
    </Modal>
  );
}

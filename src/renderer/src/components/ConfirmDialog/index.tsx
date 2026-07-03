import { AlertTriangleIcon, CheckIcon } from '@components/Icons';
import { Modal } from '@components/Modal';
import './styles.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  children: React.ReactNode;
}

export function ConfirmDialog({
  open,
  title,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  children,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <button
            className="modal-btn modal-btn--cancel"
            onClick={onCancel}
            type="button"
          >
            {cancelLabel}
          </button>
          <button
            className={`modal-btn ${danger ? 'modal-btn--danger' : 'modal-btn--confirm'}`}
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="confirm-dialog-body">
        <span
          className={`confirm-dialog-icon ${danger ? 'confirm-dialog-icon--danger' : ''}`}
        >
          {danger ? <AlertTriangleIcon size={20} /> : <CheckIcon size={20} />}
        </span>
        <p className="confirm-dialog-message">{children}</p>
      </div>
    </Modal>
  );
}
